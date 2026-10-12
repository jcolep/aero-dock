//! Real frosted glass: Windows blurring what is behind a surface.
//!
//! Aero Dock's windows are transparent web views, and a web view can only blur
//! its own content, so on its own the "glass" is a tint over a sharp desktop.
//! The system can blur what is behind a window (through the undocumented but
//! long-stable `SetWindowCompositionAttribute`), but it does it for the whole
//! window, and the dock's window is far larger than the dock's bar (room for
//! flyouts and tooltips).
//!
//! It is the plain blur, not acrylic. Acrylic lays its own tint and luminosity
//! over the blur, and under a dark system theme that comes out near black, a
//! solid backing where the glass was meant to show the desktop through.
//!
//! So the blur gets windows of its own: a pane is a bare popup, exactly the
//! size of the bar, shaped to its corners by a window region, with the blur
//! switched on, kept directly beneath the window it backs. The web view above
//! it draws the tint and the rest as before, and what shows through is the
//! desktop, blurred. A pane has no content and takes no input.
//!
//! Panes are created and moved on the main thread, which pumps their messages.
//! A pane is only ever as far up as the window it sits under, never above it.

use std::collections::HashMap;
use std::sync::Once;
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use windows::core::{s, w, BOOL};
use windows::Win32::Foundation::{HINSTANCE, HWND, LPARAM, LRESULT, WPARAM};
use windows::Win32::Graphics::Dwm::{DwmSetWindowAttribute, DWMWINDOWATTRIBUTE};
use windows::Win32::System::LibraryLoader::{GetModuleHandleW, GetProcAddress};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, IsWindow, RegisterClassW, SetWindowPos,
    ShowWindow, HTTRANSPARENT, MA_NOACTIVATE, SWP_NOACTIVATE, SWP_SHOWWINDOW, SW_HIDE, WM_ERASEBKGND,
    WM_MOUSEACTIVATE, WM_NCHITTEST, WNDCLASSW, WS_EX_NOACTIVATE, WS_EX_TOOLWINDOW, WS_EX_TOPMOST, WS_POPUP,
};

use super::monitors::Rect;

static REGISTER: Once = Once::new();

unsafe extern "system" fn proc(hwnd: HWND, msg: u32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
    match msg {
        // never the target of a click, and never activated
        // nothing is painted: what shows is the blur, not a background
        WM_ERASEBKGND => LRESULT(1),
        WM_NCHITTEST => LRESULT(HTTRANSPARENT as isize),
        WM_MOUSEACTIVATE => LRESULT(MA_NOACTIVATE as isize),
        _ => unsafe { DefWindowProcW(hwnd, msg, wparam, lparam) },
    }
}

// ---- the system's blur ----

/// `WINDOWCOMPOSITIONATTRIBDATA` and `ACCENT_POLICY`, as user32 reads them.
#[repr(C)]
struct AccentPolicy {
    state: u32,
    flags: u32,
    /// ABGR: the tint laid over the blur.
    gradient: u32,
    animation: u32,
}

#[repr(C)]
struct CompositionAttribute {
    attribute: u32,
    data: *mut core::ffi::c_void,
    size: usize,
}

const WCA_ACCENT_POLICY: u32 = 19;
const ACCENT_DISABLED: u32 = 0;
/// A plain blur of what is behind, with no tint of its own: the page above draws
/// the glass's colour.
const ACCENT_ENABLE_BLURBEHIND: u32 = 3;

type SetCompositionAttribute =
    unsafe extern "system" fn(hwnd: HWND, data: *mut CompositionAttribute) -> BOOL;

/// Switch the system's blur on or off behind a window. False if this
/// Windows has no such call (the window is then simply left as it was).
pub fn set_blur(hwnd: HWND, on: bool) -> bool {
    // no flags: with the tint flag it would lay the gradient colour over the blur
    set_accent(hwnd, if on { ACCENT_ENABLE_BLURBEHIND } else { ACCENT_DISABLED }, 0, 0)
}

/// Set a window's accent policy as it is (see `AccentPolicy`).
pub fn set_accent(hwnd: HWND, state: u32, flags: u32, gradient: u32) -> bool {
    unsafe {
        let Ok(user32) = GetModuleHandleW(w!("user32.dll")) else { return false };
        let Some(found) = GetProcAddress(user32, s!("SetWindowCompositionAttribute")) else {
            return false;
        };
        let set: SetCompositionAttribute = std::mem::transmute(found);
        let mut policy = AccentPolicy { state, flags, gradient, animation: 0 };
        let mut data = CompositionAttribute {
            attribute: WCA_ACCENT_POLICY,
            data: &mut policy as *mut AccentPolicy as *mut _,
            size: std::mem::size_of::<AccentPolicy>(),
        };
        set(hwnd, &mut data).as_bool()
    }
}

// ---- panes ----

/// How long a bar has to have stood still before its pane is put exactly under it.
const SETTLE: Duration = Duration::from_millis(110);
/// While a bar is on the move its pane keeps this far inside it. The page says where the bar is
/// a frame or two late, and a pane that is late behind a bar that is growing is only a rim of
/// clear glass, where behind one that is shrinking it is a blurred rectangle left outside it.
const LAG: i32 = 6;
/// A tile narrower than this is left out. A window blurs what is in its own bounds, so a narrow
/// one blurs a narrow strip of the screen and shows as a band that is not like its neighbours.
const MIN_TILE: i32 = 10;

struct Pane {
    /// The windows it is made of, those in use first (`shown` of them).
    hwnds: Vec<isize>,
    shown: usize,
    /// What it was last asked to be, so a repeat is skipped.
    placed: Option<(Rect, i32, bool)>,
    /// Whether the windows are exactly where it was asked (and not held in for a bar on the move).
    settled: bool,
    /// When what it was asked changed last.
    changed_at: Instant,
}

static PANES: Mutex<Option<HashMap<String, Pane>>> = Mutex::new(None);

/// A bare pane window, not yet placed (the bench makes its own).
#[cfg(test)]
pub fn make_pane() -> Option<HWND> {
    make()
}

fn make() -> Option<HWND> {
    unsafe {
        let instance = HINSTANCE(GetModuleHandleW(None).ok()?.0);
        REGISTER.call_once(|| {
            let class = WNDCLASSW {
                lpfnWndProc: Some(proc),
                hInstance: instance,
                lpszClassName: w!("AeroDockBackdrop"),
                ..Default::default()
            };
            RegisterClassW(&class);
        });
        let hwnd = CreateWindowExW(
            WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE | WS_EX_TOPMOST,
            w!("AeroDockBackdrop"),
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
        // Windows 11 rounds the corners of top-level windows itself (and gives them a shadow); a
        // pane is a plain rectangle
        const DWMWA_WINDOW_CORNER_PREFERENCE: i32 = 33;
        const DWMWCP_DONOTROUND: i32 = 1;
        let _ = DwmSetWindowAttribute(
            hwnd,
            DWMWINDOWATTRIBUTE(DWMWA_WINDOW_CORNER_PREFERENCE),
            &DWMWCP_DONOTROUND as *const i32 as *const _,
            std::mem::size_of::<i32>() as u32,
        );
        Some(hwnd)
    }
}

/// Plain rectangles, none overlapping another, that together cover most of a rounded rectangle
/// of `width` x `height` and never reach outside it: a column for the middle and, down each side,
/// columns that step in with the curve, each as tall as the curve allows at its outer edge. Each
/// is `(x, y, width, height)` from the shape's top left. What is left is the thin wedge between
/// the steps and the curve, and the narrowest steps (see `MIN_TILE`). `flush_top` is a bar that
/// runs off the top of the screen, whose top corners are square.
///
/// The system's blur is a rectangle and nothing else. It was tried (see `blurlab`) shaped with a
/// window region, with a layered window whose picture is the shape, and with the older blur call
/// and a blur region: the blur is the whole rectangle every time, corners and all, and on Windows
/// 11 it is the same on every screen. Only plain windows are certain.
pub fn tile_rects(width: i32, height: i32, radius: i32, flush_top: bool) -> Vec<(i32, i32, i32, i32)> {
    if width < 1 || height < 1 {
        return Vec::new();
    }
    let r = radius.min(width / 2).min(height / 2);
    if r < 3 {
        return vec![(0, 0, width, height)];
    }
    // the steps: how far in each starts (x) and how far down the curve is there (t), for
    // points at equal angles round the corner, rounded so as to stay inside it
    let steps = if r >= 12 { 2 } else { 1 };
    let points: Vec<(i32, i32)> = (0..=steps)
        .map(|j| {
            let angle = std::f64::consts::FRAC_PI_2 * j as f64 / steps as f64;
            let x = (r as f64 * (1.0 - angle.cos())).ceil() as i32;
            let t = (r as f64 * (1.0 - angle.sin())).ceil() as i32;
            (x, t)
        })
        .collect();
    let mut out = Vec::new();
    let mut column = |x: i32, w: i32, t: i32, wide_enough: bool| {
        let top = if flush_top { 0 } else { t };
        let h = height - top - t;
        if w >= 1 && h >= 1 && wide_enough {
            out.push((x, top, w, h));
        }
    };
    for pair in points.windows(2) {
        let ((x0, t0), (x1, _)) = (pair[0], pair[1]);
        let w = x1 - x0;
        // left, and its mirror on the right
        column(x0, w, t0, w >= MIN_TILE);
        column(width - x1, w, t0, w >= MIN_TILE);
    }
    // the middle: full height
    column(r, width - 2 * r, 0, true);
    out
}

/// Put a pane named `id` at `rect` (screen pixels), corners of `radius`, just
/// beneath `over`; or take it away with `None`. `flush_top` leaves the top
/// corners square, for a bar that touches the top of the screen. Main thread.
///
/// True when the pane is being held inside a bar that is on the move, and wants to be looked at
/// again once the bar has stood still (by `SETTLE`), to be put exactly under it.
pub fn set_pane(id: &str, over: HWND, shape: Option<(Rect, i32, bool)>) -> bool {
    let mut guard = PANES.lock();
    let panes = guard.get_or_insert_with(HashMap::new);

    let Some((rect, radius, flush_top)) = shape else {
        if let Some(pane) = panes.get_mut(id) {
            if pane.placed.take().is_some() {
                hide_from(pane, 0);
            }
        }
        return false;
    };
    if rect.width < 1 || rect.height < 1 {
        return false;
    }

    let pane = panes.entry(id.to_string()).or_insert_with(|| Pane {
        hwnds: Vec::new(),
        shown: 0,
        placed: None,
        settled: true,
        changed_at: Instant::now() - Duration::from_secs(10),
    });
    // a pane whose windows have gone is made again
    if pane.hwnds.iter().any(|h| unsafe { !IsWindow(Some(HWND(*h as *mut _))).as_bool() }) {
        pane.hwnds.clear();
        pane.shown = 0;
        pane.placed = None;
    }

    let want = Some((rect, radius, flush_top));
    let now = Instant::now();
    let changed = pane.placed != want;
    let quiet = now.duration_since(pane.changed_at) >= SETTLE;
    if changed {
        pane.changed_at = now;
    } else if pane.settled {
        return false;
    } else if !quiet {
        return true;
    }
    // the first move of a bar that has been still is followed exactly; the ones after it, held in
    let moving = changed && !quiet;
    let lag = if moving { LAG.min(rect.width / 4).min(rect.height / 4) } else { 0 };
    let inner = Rect { x: rect.x + lag, y: rect.y + lag, width: rect.width - 2 * lag, height: rect.height - 2 * lag };
    let tiles = tile_rects(inner.width, inner.height, (radius - lag).max(0), flush_top);

    let mut used = 0;
    for (i, (tx, ty, tw, th)) in tiles.iter().enumerate() {
        if i >= pane.hwnds.len() {
            let Some(hwnd) = make() else { break };
            set_blur(hwnd, true);
            pane.hwnds.push(hwnd.0 as isize);
        }
        let hwnd = HWND(pane.hwnds[i] as *mut _);
        unsafe {
            let _ = SetWindowPos(
                hwnd,
                Some(over),
                inner.x + tx,
                inner.y + ty,
                *tw,
                *th,
                SWP_NOACTIVATE | SWP_SHOWWINDOW,
            );
        }
        used = i + 1;
    }
    hide_from(pane, used);
    pane.shown = used;
    pane.placed = want;
    pane.settled = !moving;
    moving
}

/// Hide the windows of a pane from the `from`th on.
fn hide_from(pane: &mut Pane, from: usize) {
    for h in pane.hwnds.iter().skip(from).take(pane.shown.saturating_sub(from)) {
        unsafe {
            let _ = ShowWindow(HWND(*h as *mut _), SW_HIDE);
        }
    }
    pane.shown = pane.shown.min(from);
}

/// Destroy a pane, if there is one.
pub fn drop_pane(id: &str) {
    let removed = PANES.lock().as_mut().and_then(|p| p.remove(id));
    if let Some(pane) = removed {
        for h in pane.hwnds {
            unsafe {
                let _ = DestroyWindow(HWND(h as *mut _));
            }
        }
    }
}

/// The panes there are, with their windows.
pub fn pane_windows() -> Vec<(String, isize)> {
    PANES
        .lock()
        .as_ref()
        .map(|p| {
            p.iter()
                .flat_map(|(k, v)| v.hwnds.iter().enumerate().map(move |(i, h)| (format!("{k}#{i}"), *h)))
                .collect()
        })
        .unwrap_or_default()
}

/// The ids of the panes there are.
pub fn pane_ids() -> Vec<String> {
    PANES.lock().as_ref().map(|p| p.keys().cloned().collect()).unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_accent_policy_is_the_size_user32_expects() {
        // four 32-bit fields
        assert_eq!(std::mem::size_of::<AccentPolicy>(), 16);
    }

    /// Whether the pixel at (x, y) is inside a width x height rounded rectangle of this radius.
    fn inside(x: i32, y: i32, width: i32, height: i32, radius: i32, flush_top: bool) -> bool {
        let (px, py) = (x as f64 + 0.5, y as f64 + 0.5);
        let r = radius as f64;
        let cx = if px < r { r } else if px > width as f64 - r { width as f64 - r } else { px };
        let cy = if py < r && !flush_top {
            r
        } else if py > height as f64 - r {
            height as f64 - r
        } else {
            py
        };
        (px - cx).powi(2) + (py - cy).powi(2) <= r * r + 0.01
    }

    #[test]
    fn the_tiles_stay_inside_the_shape_and_do_not_overlap() {
        for (w, h, r, flush) in [(662, 702, 24, false), (590, 46, 23, false), (1200, 32, 14, true), (400, 46, 40, false), (300, 60, 0, false)] {
            let tiles = tile_rects(w, h, r, flush);
            assert!(!tiles.is_empty(), "{w}x{h} r{r}");
            let mut covered = vec![0u8; (w * h) as usize];
            for (tx, ty, tw, th) in &tiles {
                for y in *ty..*ty + *th {
                    for x in *tx..*tx + *tw {
                        assert!(x >= 0 && y >= 0 && x < w && y < h, "{w}x{h} r{r}: tile outside the window");
                        let rr = r.min(w / 2).min(h / 2);
                        assert!(inside(x, y, w, h, rr, flush), "{w}x{h} r{r}: ({x}, {y}) is outside the shape");
                        covered[(y * w + x) as usize] += 1;
                    }
                }
            }
            assert!(covered.iter().all(|c| *c <= 1), "{w}x{h} r{r}: tiles overlap");
            // and little of the shape is left out
            let rr = r.min(w / 2).min(h / 2);
            let mut shape = 0;
            let mut left_out = 0;
            for y in 0..h {
                for x in 0..w {
                    if inside(x, y, w, h, rr, flush) {
                        shape += 1;
                        if covered[(y * w + x) as usize] == 0 {
                            left_out += 1;
                        }
                    }
                }
            }
            assert!(left_out * 100 < shape * 6, "{w}x{h} r{r}: {left_out} of {shape} left out");
        }
    }

    #[test]
    fn a_shape_without_corners_is_one_rectangle() {
        assert_eq!(tile_rects(300, 60, 0, false), vec![(0, 0, 300, 60)]);
        assert_eq!(tile_rects(300, 60, 2, false), vec![(0, 0, 300, 60)]);
        assert!(tile_rects(0, 60, 10, false).is_empty());
    }

    #[test]
    fn a_pane_can_be_made_placed_and_dropped_without_a_window_to_sit_under() {
        // a pane needs a window to sit beneath; any live one will do
        let under = unsafe {
            CreateWindowExW(
                Default::default(),
                w!("STATIC"),
                w!(""),
                WS_POPUP,
                -30000,
                -30000,
                10,
                10,
                None,
                None,
                None,
                None,
            )
        }
        .expect("a window to sit under");
        let rect = Rect { x: -29000, y: -29000, width: 300, height: 60 };
        set_pane("test", under, Some((rect, 14, false)));
        assert!(pane_ids().contains(&"test".to_string()));
        // a repeat is skipped, and hiding keeps the pane for next time
        set_pane("test", under, Some((rect, 14, false)));
        set_pane("test", under, None);
        assert!(pane_ids().contains(&"test".to_string()));
        drop_pane("test");
        assert!(!pane_ids().contains(&"test".to_string()));
        unsafe {
            let _ = DestroyWindow(under);
        }
    }
}
