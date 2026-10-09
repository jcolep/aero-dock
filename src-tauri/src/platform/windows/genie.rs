//! Minimising a window into its dock icon, and bringing it back out, the way a
//! Mac does: the window pours into the icon like something out of a lamp.
//!
//! Windows cannot be asked to animate another program's window that way, so the
//! effect is made, not borrowed. The window is photographed (`PrintWindow`), a
//! see-through overlay window appears over it showing the photograph exactly,
//! the real window is minimised underneath with Windows' own minimise animation
//! switched off for it, and the overlay then plays the effect, frame by frame,
//! and goes away. The window is only ever really minimised or restored; the
//! overlay is a picture that never takes a click.
//!
//! The effect treats the picture as a stack of rows. The bottom row, nearest the
//! dock, sets off first and arrives first; each row above it follows a moment
//! later; every row narrows toward the icon as it goes and slides toward its
//! middle. Together they make the funnel. (`Scale` is the plain version: every
//! row moves together, so the window just shrinks into the icon.) Restoring is
//! the same played backwards from the last picture taken when it went in; a
//! window that was minimised some other way has no picture, and is restored
//! plainly.
//!
//! Everything about an animation is on a thread of its own, and anything that
//! goes wrong (a window that will not be photographed, one that is not
//! responding, an overlay that cannot be made) ends in the plain minimise or
//! restore, so a window is never left stuck. The drawing is pure arithmetic on
//! pixels, and is tested without a screen.

use std::collections::VecDeque;
use std::ffi::c_void;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Once};
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use windows::core::{w, BOOL};
use windows::Win32::Foundation::{COLORREF, HWND, LPARAM, LRESULT, POINT, RECT, SIZE, WPARAM};
use windows::Win32::Graphics::Dwm::{
    DwmGetWindowAttribute, DwmSetWindowAttribute, DWMWA_EXTENDED_FRAME_BOUNDS,
    DWMWA_TRANSITIONS_FORCEDISABLED,
};
use windows::Win32::Graphics::Gdi::{
    CreateCompatibleDC, CreateDIBSection, DeleteDC, DeleteObject, GetDC, ReleaseDC, SelectObject, AC_SRC_ALPHA,
    AC_SRC_OVER, BITMAPINFO, BITMAPINFOHEADER, BI_RGB, BLENDFUNCTION, DIB_RGB_COLORS, HBITMAP, HDC, HGDIOBJ,
};
use windows::Win32::Storage::Xps::{PrintWindow, PRINT_WINDOW_FLAGS};
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, DispatchMessageW, GetWindowRect, IsHungAppWindow, IsIconic,
    IsWindow, PeekMessageW, RegisterClassW, ShowWindow, ShowWindowAsync, TranslateMessage, UpdateLayeredWindow,
    MSG, PM_REMOVE, SW_MINIMIZE, SW_RESTORE, SW_SHOWNOACTIVATE, ULW_ALPHA, WNDCLASSW, WS_EX_LAYERED,
    WS_EX_NOACTIVATE, WS_EX_TOOLWINDOW, WS_EX_TOPMOST, WS_EX_TRANSPARENT, WS_POPUP,
};

use super::running;

// ---- the arithmetic: no windows in this part ----

/// Which effect.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Effect {
    /// The window pours into the icon, bottom first.
    Genie,
    /// The window shrinks into the icon, all at once.
    Scale,
}

impl Effect {
    /// From the setting. `off`, and anything unknown, is no effect.
    pub fn parse(name: &str) -> Option<Effect> {
        match name {
            "genie" => Some(Effect::Genie),
            "scale" => Some(Effect::Scale),
            _ => None,
        }
    }

    /// How long it takes.
    fn duration(self) -> Duration {
        match self {
            Effect::Genie => Duration::from_millis(400),
            Effect::Scale => Duration::from_millis(280),
        }
    }
}

/// A rectangle on the screen, in pixels.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Area {
    pub x: f32,
    pub y: f32,
    pub w: f32,
    pub h: f32,
}

impl Area {
    fn centre_x(&self) -> f32 {
        self.x + self.w / 2.0
    }
    fn centre_y(&self) -> f32 {
        self.y + self.h / 2.0
    }
    fn from_rect(r: RECT) -> Area {
        Area { x: r.left as f32, y: r.top as f32, w: (r.right - r.left) as f32, h: (r.bottom - r.top) as f32 }
    }
    /// The smallest area holding both, in whole pixels.
    fn union(&self, other: &Area) -> (i32, i32, usize, usize) {
        let left = self.x.min(other.x).floor();
        let top = self.y.min(other.y).floor();
        let right = (self.x + self.w).max(other.x + other.w).ceil();
        let bottom = (self.y + self.h).max(other.y + other.h).ceil();
        (left as i32, top as i32, (right - left).max(1.0) as usize, (bottom - top).max(1.0) as usize)
    }
}

/// A photograph of a window: BGRA, one premultiplied pixel per four bytes.
#[derive(Debug, Clone)]
pub struct Frame {
    pub w: usize,
    pub h: usize,
    pub px: Vec<u8>,
}

/// Where one frame goes: the top left of what was drawn, on the screen, and its
/// size. The pixels are in the buffer given to `render`, from its top left.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Placed {
    pub x: i32,
    pub y: i32,
    pub w: usize,
    pub h: usize,
}

fn lerp(a: f32, b: f32, t: f32) -> f32 {
    a + (b - a) * t
}

fn smooth(t: f32) -> f32 {
    let t = t.clamp(0.0, 1.0);
    t * t * (3.0 - 2.0 * t)
}

/// How far behind the bottom row the top row sets off, as a fraction of the whole.
const GENIE_LAG: f32 = 0.5;

/// Where one row of the picture is at time `t` (0 at the start, 1 at the end).
struct RowAt {
    y: f32,
    centre: f32,
    half: f32,
}

fn row_at(effect: Effect, v: f32, t: f32, from: &Area, to: &Area) -> RowAt {
    let lag = if effect == Effect::Genie { GENIE_LAG } else { 0.0 };
    // the bottom row (v = 1) leads; the top (v = 0) is the last to go
    let own = if lag == 0.0 { t } else { ((t - (1.0 - v) * lag) / (1.0 - lag)).clamp(0.0, 1.0) };
    let e = smooth(own);
    // narrowing comes early, sliding late: that is the funnel
    let (squeeze, slide) = if effect == Effect::Genie { (e.powf(0.6), smooth(e)) } else { (e, e) };
    RowAt {
        y: lerp(from.y + v * from.h, to.centre_y(), e),
        centre: lerp(from.centre_x(), to.centre_x(), slide),
        half: lerp(from.w / 2.0, (to.w / 2.0).max(3.0), squeeze),
    }
}

/// Draw the picture at time `t` into `buf` (rows `stride` bytes apart), from the
/// top left. Returns where it goes, or `None` when nothing of it can be seen.
///
/// The buffer must be at least `stride` by the height of the union of `from` and
/// `to`, and `stride` at least four times its width.
pub fn render(
    src: &Frame,
    from: &Area,
    to: &Area,
    t: f32,
    effect: Effect,
    buf: &mut [u8],
    stride: usize,
) -> Option<Placed> {
    if src.w == 0 || src.h == 0 || from.w < 1.0 || from.h < 1.0 {
        return None;
    }
    let t = t.clamp(0.0, 1.0);
    // gone by the end: it fades out over the last of the way in
    let alpha = 1.0 - smooth((t - 0.8) / 0.2);
    if alpha <= 0.004 {
        return None;
    }

    // where every row is, never crossing the one above it
    let rows: Vec<RowAt> = {
        let mut out: Vec<RowAt> = Vec::with_capacity(src.h);
        for r in 0..src.h {
            let v = (r as f32 + 0.5) / src.h as f32;
            let mut at = row_at(effect, v, t, from, to);
            if let Some(above) = out.last() {
                at.y = at.y.max(above.y);
            }
            out.push(at);
        }
        out
    };

    let y0 = rows[0].y.floor() as i32;
    let y1 = rows[src.h - 1].y.ceil() as i32;
    let x0 = rows.iter().map(|r| r.centre - r.half).fold(f32::MAX, f32::min).floor() as i32;
    let x1 = rows.iter().map(|r| r.centre + r.half).fold(f32::MIN, f32::max).ceil() as i32;
    // rounding can leave the box a pixel outside the two areas it moves between
    // (and the buffer is only as big as those): keep it inside
    let (ux, uy, uw, uh) = from.union(to);
    let (x0, x1) = (x0.max(ux), x1.min(ux + uw as i32));
    let (y0, y1) = (y0.max(uy), y1.min(uy + uh as i32));
    if x1 <= x0 || y1 <= y0 {
        return None;
    }
    let (bw, bh) = ((x1 - x0) as usize, (y1 - y0) as usize);
    if bw * 4 > stride || buf.len() < stride * bh {
        return None;
    }
    // everything in the box starts see-through
    for row in 0..bh {
        buf[row * stride..row * stride + bw * 4].fill(0);
    }

    let mut r = 0usize;
    for y in y0..y1 {
        let yc = y as f32 + 0.5;
        // the pair of picture rows this screen row falls between
        while r + 1 < src.h - 1 && rows[r + 1].y <= yc {
            r += 1;
        }
        if yc < rows[0].y || yc > rows[src.h - 1].y {
            continue;
        }
        let (a, b) = (&rows[r], &rows[(r + 1).min(src.h - 1)]);
        let span = b.y - a.y;
        let f = if span > 1e-4 { ((yc - a.y) / span).clamp(0.0, 1.0) } else { 0.0 };
        let centre = lerp(a.centre, b.centre, f);
        let half = lerp(a.half, b.half, f);
        if half < 0.5 {
            continue;
        }
        let source_row = ((r as f32 + f) as usize).min(src.h - 1);
        let line = &src.px[source_row * src.w * 4..(source_row + 1) * src.w * 4];
        let left = centre - half;
        let xs = (left.floor() as i32).max(x0);
        let xe = ((centre + half).ceil() as i32).min(x1);
        let out_row = &mut buf[(y - y0) as usize * stride..];
        for x in xs..xe {
            let u = (((x as f32 + 0.5) - left) / (2.0 * half)).clamp(0.0, 1.0);
            let sx = (u * (src.w - 1) as f32) as usize;
            let s = &line[sx * 4..sx * 4 + 4];
            let o = (x - x0) as usize * 4;
            if alpha >= 0.999 {
                out_row[o..o + 4].copy_from_slice(s);
            } else {
                out_row[o] = (s[0] as f32 * alpha) as u8;
                out_row[o + 1] = (s[1] as f32 * alpha) as u8;
                out_row[o + 2] = (s[2] as f32 * alpha) as u8;
                out_row[o + 3] = (s[3] as f32 * alpha) as u8;
            }
        }
    }
    Some(Placed { x: x0, y: y0, w: bw, h: bh })
}

/// Halve a picture's size, averaging each two by two block. A window as wide as a
/// screen is drawn from half the pixels: it is in motion and shrinking, and a
/// frame has to be quick.
pub fn halve(src: &Frame) -> Frame {
    let (w, h) = (src.w / 2, src.h / 2);
    if w == 0 || h == 0 {
        return src.clone();
    }
    let mut px = vec![0u8; w * h * 4];
    for y in 0..h {
        for x in 0..w {
            for c in 0..4 {
                let at = |dx: usize, dy: usize| src.px[((y * 2 + dy) * src.w + x * 2 + dx) * 4 + c] as u32;
                px[(y * w + x) * 4 + c] = ((at(0, 0) + at(1, 0) + at(0, 1) + at(1, 1)) / 4) as u8;
            }
        }
    }
    Frame { w, h, px }
}

// ---- windows ----

/// The last picture taken of each window as it went into the dock, and where it
/// was, so that it can come out again. A few are kept, the oldest dropped.
static PICTURES: Mutex<VecDeque<(isize, Arc<Frame>, Area)>> = Mutex::new(VecDeque::new());
const KEEP_PICTURES: usize = 6;

/// One effect at a time: a second asked for while one plays is done plainly.
static BUSY: AtomicBool = AtomicBool::new(false);

/// Photographs wider than this are halved.
const HALVE_ABOVE: usize = 1600;

/// The bounds a window is drawn in, without its invisible borders.
fn drawn_bounds(hwnd: HWND) -> Option<RECT> {
    let mut r = RECT::default();
    unsafe {
        DwmGetWindowAttribute(
            hwnd,
            DWMWA_EXTENDED_FRAME_BOUNDS,
            &mut r as *mut RECT as *mut c_void,
            std::mem::size_of::<RECT>() as u32,
        )
        .ok()?;
    }
    (r.right > r.left && r.bottom > r.top).then_some(r)
}

/// Windows' own minimise and restore animation, switched off or on for a window.
fn set_transitions(hwnd: HWND, disabled: bool) {
    let flag: BOOL = disabled.into();
    unsafe {
        let _ = DwmSetWindowAttribute(
            hwnd,
            DWMWA_TRANSITIONS_FORCEDISABLED,
            &flag as *const BOOL as *const c_void,
            std::mem::size_of::<BOOL>() as u32,
        );
    }
}

/// A GDI bitmap we can write pixels into, with a device context holding it.
struct Surface {
    dc: HDC,
    bitmap: HBITMAP,
    old: HGDIOBJ,
    bits: *mut u8,
    w: usize,
    h: usize,
}

impl Surface {
    fn new(w: usize, h: usize) -> Option<Surface> {
        unsafe {
            let screen = GetDC(None);
            let dc = CreateCompatibleDC(Some(screen));
            ReleaseDC(None, screen);
            if dc.is_invalid() {
                return None;
            }
            let info = BITMAPINFO {
                bmiHeader: BITMAPINFOHEADER {
                    biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
                    biWidth: w as i32,
                    // top-down: row 0 is the top
                    biHeight: -(h as i32),
                    biPlanes: 1,
                    biBitCount: 32,
                    biCompression: BI_RGB.0,
                    ..Default::default()
                },
                ..Default::default()
            };
            let mut bits: *mut c_void = std::ptr::null_mut();
            let bitmap = match CreateDIBSection(Some(dc), &info, DIB_RGB_COLORS, &mut bits, None, 0) {
                Ok(b) if !bits.is_null() => b,
                _ => {
                    let _ = DeleteDC(dc);
                    return None;
                }
            };
            let old = SelectObject(dc, HGDIOBJ(bitmap.0));
            Some(Surface { dc, bitmap, old, bits: bits as *mut u8, w, h })
        }
    }

    fn bytes(&mut self) -> &mut [u8] {
        unsafe { std::slice::from_raw_parts_mut(self.bits, self.w * self.h * 4) }
    }
}

impl Drop for Surface {
    fn drop(&mut self) {
        unsafe {
            SelectObject(self.dc, self.old);
            let _ = DeleteObject(HGDIOBJ(self.bitmap.0));
            let _ = DeleteDC(self.dc);
        }
    }
}

/// Photograph a window. `None` if it would not be photographed, or came out
/// empty (a window drawn by the graphics card directly, a protected one).
fn capture(hwnd: HWND, visible: RECT) -> Option<Frame> {
    let mut whole = RECT::default();
    unsafe { GetWindowRect(hwnd, &mut whole).ok()? };
    let (ww, wh) = ((whole.right - whole.left) as usize, (whole.bottom - whole.top) as usize);
    if ww == 0 || wh == 0 || ww > 8192 || wh > 8192 {
        return None;
    }
    let mut surface = Surface::new(ww, wh)?;
    // 2 is PW_RENDERFULLCONTENT: what the compositor draws, not just what the
    // window paints for itself
    let ok = unsafe { PrintWindow(hwnd, surface.dc, PRINT_WINDOW_FLAGS(2)) }.as_bool();
    if !ok {
        return None;
    }
    let all = surface.bytes();

    // what is drawn, without the invisible borders
    let (ox, oy) = ((visible.left - whole.left).max(0) as usize, (visible.top - whole.top).max(0) as usize);
    let cw = ((visible.right - visible.left) as usize).min(ww.saturating_sub(ox));
    let ch = ((visible.bottom - visible.top) as usize).min(wh.saturating_sub(oy));
    if cw == 0 || ch == 0 {
        return None;
    }
    let mut px = Vec::with_capacity(cw * ch * 4);
    for row in 0..ch {
        let start = ((oy + row) * ww + ox) * 4;
        px.extend_from_slice(&all[start..start + cw * 4]);
    }

    // An opaque window comes back with alpha 0 in places, as GDI writes none. If
    // most of it says see-through the picture is made solid; if not, the
    // window really has an edge to its shape (round corners) and it is kept.
    let clear = px.chunks_exact(4).filter(|p| p[3] == 0).count();
    if clear * 2 > cw * ch {
        for p in px.chunks_exact_mut(4) {
            p[3] = 255;
        }
    }
    // nothing but black: the photograph failed quietly
    if px.chunks_exact(4).step_by(37).all(|p| p[0] == 0 && p[1] == 0 && p[2] == 0) {
        return None;
    }
    let frame = Frame { w: cw, h: ch, px };
    Some(if cw > HALVE_ABOVE { halve(&frame) } else { frame })
}

static CLASS: Once = Once::new();

unsafe extern "system" fn overlay_proc(hwnd: HWND, msg: u32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
    unsafe { DefWindowProcW(hwnd, msg, wparam, lparam) }
}

/// The see-through window the effect is drawn in: a layered window with its own
/// per-pixel transparency, over everything, which never takes a click or the focus.
struct Overlay {
    hwnd: HWND,
    surface: Surface,
    screen: HDC,
}

impl Overlay {
    fn new(width: usize, height: usize) -> Option<Overlay> {
        let surface = Surface::new(width, height)?;
        unsafe {
            let instance = windows::Win32::Foundation::HINSTANCE(GetModuleHandleW(None).ok()?.0);
            CLASS.call_once(|| {
                let class = WNDCLASSW {
                    lpfnWndProc: Some(overlay_proc),
                    hInstance: instance,
                    lpszClassName: w!("AeroDockGenie"),
                    ..Default::default()
                };
                RegisterClassW(&class);
            });
            let hwnd = CreateWindowExW(
                WS_EX_LAYERED | WS_EX_TRANSPARENT | WS_EX_TOPMOST | WS_EX_NOACTIVATE | WS_EX_TOOLWINDOW,
                w!("AeroDockGenie"),
                w!(""),
                WS_POPUP,
                0,
                0,
                1,
                1,
                None,
                None,
                Some(instance),
                None,
            )
            .ok()?;
            Some(Overlay { hwnd, surface, screen: GetDC(None) })
        }
    }

    /// Show a rendered frame, at its place on the screen.
    fn present(&self, at: Placed) -> bool {
        let position = POINT { x: at.x, y: at.y };
        let size = SIZE { cx: at.w as i32, cy: at.h as i32 };
        let from = POINT { x: 0, y: 0 };
        let blend = BLENDFUNCTION {
            BlendOp: AC_SRC_OVER as u8,
            BlendFlags: 0,
            SourceConstantAlpha: 255,
            AlphaFormat: AC_SRC_ALPHA as u8,
        };
        unsafe {
            UpdateLayeredWindow(
                self.hwnd,
                Some(self.screen),
                Some(&position),
                Some(&size),
                Some(self.surface.dc),
                Some(&from),
                COLORREF(0),
                Some(&blend),
                ULW_ALPHA,
            )
        }
        .is_ok()
    }

    fn show(&self) {
        unsafe {
            let _ = ShowWindow(self.hwnd, SW_SHOWNOACTIVATE);
        }
    }

    /// Let the system deliver whatever it has for this thread's windows.
    fn pump(&self) {
        unsafe {
            let mut msg = MSG::default();
            while PeekMessageW(&mut msg, None, 0, 0, PM_REMOVE).as_bool() {
                let _ = TranslateMessage(&msg);
                DispatchMessageW(&msg);
            }
        }
    }
}

impl Drop for Overlay {
    fn drop(&mut self) {
        unsafe {
            let _ = DestroyWindow(self.hwnd);
            ReleaseDC(None, self.screen);
        }
    }
}

/// Play the effect on an overlay: `backwards` is coming out of the icon.
fn play(overlay: &mut Overlay, frame: &Frame, from: &Area, to: &Area, effect: Effect, backwards: bool) {
    let stride = overlay.surface.w * 4;
    let started = Instant::now();
    let duration = effect.duration();
    let mut shown_any = false;
    loop {
        let p = (started.elapsed().as_secs_f32() / duration.as_secs_f32()).min(1.0);
        let t = if backwards { 1.0 - p } else { p };
        let placed = render(frame, from, to, t, effect, overlay.surface.bytes(), stride);
        if let Some(at) = placed {
            if overlay.present(at) && !shown_any {
                overlay.show();
                shown_any = true;
            }
        }
        overlay.pump();
        if p >= 1.0 {
            break;
        }
        std::thread::sleep(Duration::from_millis(8));
    }
}

/// A window about to go into the dock: its picture and its place, if it can be had.
fn prepare(hwnd: HWND, target: Area) -> Option<(Arc<Frame>, Area, Effect)> {
    if unsafe { !IsWindow(Some(hwnd)).as_bool() || IsIconic(hwnd).as_bool() || IsHungAppWindow(hwnd).as_bool() } {
        return None;
    }
    let visible = drawn_bounds(hwnd)?;
    let frame = capture(hwnd, visible)?;
    let from = Area::from_rect(visible);
    // pouring down only makes sense into an icon below the window's middle; any
    // other edge of the screen gets the plain shrink
    let effect = if target.centre_y() > from.centre_y() { Effect::Genie } else { Effect::Scale };
    Some((Arc::new(frame), from, effect))
}

fn remember(hwnd: isize, frame: Arc<Frame>, at: Area) {
    let mut kept = PICTURES.lock();
    kept.retain(|(h, _, _)| *h != hwnd);
    kept.push_back((hwnd, frame, at));
    while kept.len() > KEEP_PICTURES {
        kept.pop_front();
    }
}

/// Minimise a window into the icon at `target`. True if the effect took the job
/// (and will minimise the window itself); false if not, and the caller should
/// minimise it plainly. Returns at once: the effect plays on a thread of its own.
pub fn minimize(hwnd: isize, target: Area, requested: Effect) -> bool {
    if BUSY.swap(true, Ordering::SeqCst) {
        return false;
    }
    let h = HWND(hwnd as *mut _);
    let Some((frame, from, fitting)) = prepare(h, target) else {
        BUSY.store(false, Ordering::SeqCst);
        return false;
    };
    let effect = if requested == Effect::Scale { Effect::Scale } else { fitting };
    remember(hwnd, frame.clone(), from);

    let spawned = std::thread::Builder::new().name("genie".into()).spawn(move || {
        let h = HWND(hwnd as *mut _);
        let (x, y, bw, bh) = from.union(&target);
        let _ = (x, y);
        let overlay = Overlay::new(bw, bh);
        match overlay {
            Some(mut overlay) => {
                // the first frame is the window exactly, so that nothing shows when the
                // real one goes from underneath it
                let stride = overlay.surface.w * 4;
                if let Some(first) = render(&frame, &from, &target, 0.0, effect, overlay.surface.bytes(), stride) {
                    overlay.present(first);
                    overlay.show();
                }
                set_transitions(h, true);
                unsafe {
                    let _ = ShowWindowAsync(h, SW_MINIMIZE);
                }
                play(&mut overlay, &frame, &from, &target, effect, false);
                set_transitions(h, false);
            }
            None => running::minimize_window(hwnd),
        }
        BUSY.store(false, Ordering::SeqCst);
    });
    if spawned.is_err() {
        BUSY.store(false, Ordering::SeqCst);
        return false;
    }
    true
}

/// Bring a minimised window out of the icon at `target`, then restore and focus
/// it. True if the effect took the job; false if there is no picture of it from
/// when it went in (so the caller restores it plainly).
pub fn restore(hwnd: isize, target: Area, requested: Effect) -> bool {
    let h = HWND(hwnd as *mut _);
    if unsafe { !IsWindow(Some(h)).as_bool() || !IsIconic(h).as_bool() } {
        return false;
    }
    if BUSY.swap(true, Ordering::SeqCst) {
        return false;
    }
    let remembered = {
        let mut kept = PICTURES.lock();
        kept.iter().position(|(k, _, _)| *k == hwnd).and_then(|i| kept.remove(i))
    };
    let Some((_, frame, at)) = remembered else {
        BUSY.store(false, Ordering::SeqCst);
        return false;
    };
    let effect = if requested == Effect::Scale || target.centre_y() <= at.centre_y() { Effect::Scale } else { Effect::Genie };

    let spawned = std::thread::Builder::new().name("genie".into()).spawn(move || {
        let h = HWND(hwnd as *mut _);
        let (_, _, bw, bh) = at.union(&target);
        match Overlay::new(bw, bh) {
            Some(mut overlay) => {
                play(&mut overlay, &frame, &at, &target, effect, true);
                // the window comes back under the last frame, which is it exactly
                set_transitions(h, true);
                unsafe {
                    let _ = ShowWindowAsync(h, SW_RESTORE);
                }
                running::activate_window(hwnd);
                std::thread::sleep(Duration::from_millis(160));
                set_transitions(h, false);
            }
            None => running::activate_window(hwnd),
        }
        BUSY.store(false, Ordering::SeqCst);
    });
    if spawned.is_err() {
        BUSY.store(false, Ordering::SeqCst);
        return false;
    }
    true
}

#[cfg(test)]
mod tests {
    use super::*;

    /// A picture whose rows are told apart by colour: row r is (r, r, r, 255).
    fn striped(w: usize, h: usize) -> Frame {
        let mut px = Vec::with_capacity(w * h * 4);
        for r in 0..h {
            for _ in 0..w {
                px.extend_from_slice(&[(r % 251) as u8, (r % 251) as u8, (r % 251) as u8, 255]);
            }
        }
        Frame { w, h, px }
    }

    fn setup() -> (Frame, Area, Area) {
        // a 200 by 120 window high on a screen, and a small icon low and to the right
        (striped(200, 120), Area { x: 100.0, y: 50.0, w: 200.0, h: 120.0 }, Area { x: 400.0, y: 500.0, w: 40.0, h: 40.0 })
    }

    fn buffer(from: &Area, to: &Area) -> (Vec<u8>, usize) {
        let (_, _, w, h) = from.union(to);
        let stride = w * 4;
        (vec![0u8; stride * h], stride)
    }

    #[test]
    fn at_the_start_the_picture_is_the_window_exactly() {
        let (frame, from, to) = setup();
        let (mut buf, stride) = buffer(&from, &to);
        let placed = render(&frame, &from, &to, 0.0, Effect::Genie, &mut buf, stride).expect("something to draw");
        assert_eq!((placed.x, placed.y, placed.w, placed.h), (100, 50, 200, 120));
        // every pixel is the window's own: row r is the colour r
        for r in 0..120 {
            let px = &buf[r * stride..r * stride + 4];
            assert_eq!(px, &[r as u8, r as u8, r as u8, 255], "row {r}");
        }
    }

    #[test]
    fn by_the_end_nothing_is_left_to_see() {
        let (frame, from, to) = setup();
        let (mut buf, stride) = buffer(&from, &to);
        assert!(render(&frame, &from, &to, 1.0, Effect::Genie, &mut buf, stride).is_none());
        assert!(render(&frame, &from, &to, 1.0, Effect::Scale, &mut buf, stride).is_none());
    }

    #[test]
    fn the_bottom_goes_first_so_the_picture_is_a_funnel() {
        let (frame, from, to) = setup();
        let (mut buf, stride) = buffer(&from, &to);
        let placed = render(&frame, &from, &to, 0.45, Effect::Genie, &mut buf, stride).expect("drawn");
        // the width of the picture in its first and its last visible rows
        let width_of = |row: usize| buf[row * stride..row * stride + placed.w * 4].chunks_exact(4).filter(|p| p[3] != 0).count();
        let top = width_of(0);
        let bottom = width_of(placed.h - 1);
        assert!(top > bottom * 2, "wide at the top ({top}), narrow at the bottom ({bottom})");
        // and it has already moved down toward the icon
        assert!(placed.y + placed.h as i32 > 170, "the bottom has left the window's own area");
    }

    #[test]
    fn the_plain_shrink_keeps_every_row_the_same_width() {
        let (frame, from, to) = setup();
        let (mut buf, stride) = buffer(&from, &to);
        let placed = render(&frame, &from, &to, 0.5, Effect::Scale, &mut buf, stride).expect("drawn");
        let widths: Vec<usize> = (0..placed.h)
            .map(|row| buf[row * stride..row * stride + placed.w * 4].chunks_exact(4).filter(|p| p[3] != 0).count())
            .filter(|w| *w > 0)
            .collect();
        let (lo, hi) = (widths.iter().min().unwrap(), widths.iter().max().unwrap());
        assert!(hi - lo <= 2, "rows are {lo} to {hi} wide");
    }

    #[test]
    fn every_frame_stays_inside_the_window_and_the_icon_together() {
        let (frame, from, to) = setup();
        let (mut buf, stride) = buffer(&from, &to);
        let (ux, uy, uw, uh) = from.union(&to);
        for effect in [Effect::Genie, Effect::Scale] {
            for step in 0..=20 {
                let t = step as f32 / 20.0;
                if let Some(p) = render(&frame, &from, &to, t, effect, &mut buf, stride) {
                    assert!(p.x >= ux && p.y >= uy, "{effect:?} at {t}: starts inside");
                    assert!(p.x + p.w as i32 <= ux + uw as i32 && p.y + p.h as i32 <= uy + uh as i32, "{effect:?} at {t}: ends inside");
                }
            }
        }
    }

    #[test]
    fn it_fades_out_at_the_end_and_never_gets_brighter() {
        let (frame, from, to) = setup();
        let (mut buf, stride) = buffer(&from, &to);
        let mut last = 255u8;
        for step in 0..=20 {
            let t = step as f32 / 20.0;
            if let Some(p) = render(&frame, &from, &to, t, Effect::Scale, &mut buf, stride) {
                // only the part just drawn: the rest of the buffer holds earlier frames
                let peak = (0..p.h)
                    .flat_map(|r| buf[r * stride..r * stride + p.w * 4].chunks_exact(4).map(|px| px[3]))
                    .max()
                    .unwrap();
                assert!(peak <= last, "alpha {peak} after {last} at {t}");
                last = peak;
            }
        }
        assert!(last < 255, "it faded");
    }

    #[test]
    fn a_degenerate_window_or_icon_does_not_panic() {
        let (frame, from, _) = setup();
        let tiny = Area { x: 10.0, y: 900.0, w: 0.0, h: 0.0 };
        let (mut buf, stride) = buffer(&from, &tiny);
        for step in 0..=10 {
            let _ = render(&frame, &from, &tiny, step as f32 / 10.0, Effect::Genie, &mut buf, stride);
        }
        let empty = Frame { w: 0, h: 0, px: Vec::new() };
        assert!(render(&empty, &from, &tiny, 0.5, Effect::Genie, &mut buf, stride).is_none());
        // a buffer too small for the frame is refused, not written past
        let mut small = vec![0u8; 16];
        assert!(render(&frame, &from, &tiny, 0.0, Effect::Genie, &mut small, 16).is_none());
    }

    #[test]
    fn halving_averages_blocks() {
        let frame = Frame { w: 2, h: 2, px: vec![0, 0, 0, 255, 100, 100, 100, 255, 200, 200, 200, 255, 100, 100, 100, 255] };
        let half = halve(&frame);
        assert_eq!((half.w, half.h), (1, 1));
        assert_eq!(&half.px[..4], &[100, 100, 100, 255]);
    }

    #[test]
    fn the_setting_names_the_effect() {
        assert_eq!(Effect::parse("genie"), Some(Effect::Genie));
        assert_eq!(Effect::parse("scale"), Some(Effect::Scale));
        assert_eq!(Effect::parse("off"), None);
        assert_eq!(Effect::parse("explode"), None);
    }

    #[test]
    fn a_window_can_be_photographed_and_drawn_into_an_overlay_off_screen() {
        // A real window, shown far off the screen where nobody sees it, photographed
        // by the same code that photographs other programs' windows, then drawn
        // into the overlay and handed to the system as a frame.
        use windows::Win32::UI::WindowsAndMessaging::{DestroyWindow, WINDOW_EX_STYLE};
        let hwnd = unsafe {
            CreateWindowExW(WINDOW_EX_STYLE(0), w!("STATIC"), w!("a window"), WS_POPUP, -30000, -30000, 320, 200, None, None, None, None)
        }
        .expect("a test window");
        unsafe {
            let _ = ShowWindow(hwnd, SW_SHOWNOACTIVATE);
        }
        let mut whole = RECT::default();
        unsafe { GetWindowRect(hwnd, &mut whole).expect("its rectangle") };
        // an empty STATIC window is painted in the system's window colour, which
        // is not black, so a good photograph is not mistaken for a failed one
        let frame = capture(hwnd, whole);
        unsafe {
            let _ = DestroyWindow(hwnd);
        }
        // Whether the system paints a window this far off the screen is its own
        // business (it sometimes does not, and the photograph is then refused, as
        // it should be), so a photograph is checked when there is one and the
        // overlay is exercised with a plain picture either way.
        let frame = match frame {
            Some(f) => {
                assert_eq!((f.w, f.h), (320, 200));
                assert!(f.px.chunks_exact(4).all(|p| p[3] == 255), "a window comes out solid");
                f
            }
            None => striped(320, 200),
        };

        let from = Area { x: -30000.0, y: -30000.0, w: 320.0, h: 200.0 };
        let to = Area { x: -29800.0, y: -29600.0, w: 40.0, h: 40.0 };
        let (_, _, uw, uh) = from.union(&to);
        let mut overlay = Overlay::new(uw, uh).expect("an overlay window");
        let stride = overlay.surface.w * 4;
        let placed = render(&frame, &from, &to, 0.3, Effect::Genie, overlay.surface.bytes(), stride).expect("a frame");
        assert!(overlay.present(placed), "the system took the frame");
        overlay.show();
        overlay.pump();
    }
}
