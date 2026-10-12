//! A picture of what is behind our windows, with our windows left out of it, blurred.
//!
//! The system's own blur is a rectangle and nothing else (see `backdrop` and `blurlab`), so it
//! cannot sit behind a rounded dock or panel. This makes the blur in the page instead: a picture of
//! the screen behind a surface is taken here, shrunk and blurred, and the page paints it under the
//! glass, clipped to the glass's own (antialiased, any) shape.
//!
//! The picture comes from the Magnification API's window, which can leave chosen windows out of what
//! it renders (`MagSetWindowFilterList`), so the dock is not in the picture of what is behind it.
//! (A plain screen capture has the dock in it; excluding our windows from capture by display affinity
//! would also make them vanish from the user's own screenshots and recordings.) The magnifier needs a
//! host window that is shown and sits on the primary screen; it is a few pixels of nearly nothing at
//! the top left, which lets every click through. What is behind another screen is still read.
//!
//! One thread owns the host and the magnifier and takes the jobs one at a time.

use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::mpsc::{channel, Sender};
use std::sync::OnceLock;
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use windows::core::{w, BOOL};
use windows::Win32::Foundation::{HINSTANCE, HWND, LPARAM, LRESULT, RECT, WPARAM};
use windows::Win32::Graphics::Gdi::{InvalidateRect, HRGN};
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::System::Threading::GetCurrentProcessId;
use windows::Win32::UI::Magnification::{
    MagInitialize, MagSetImageScalingCallback, MagSetWindowFilterList, MagSetWindowSource, MagSetWindowTransform,
    MAGIMAGEHEADER, MAGTRANSFORM, MW_FILTERMODE_EXCLUDE, WC_MAGNIFIER,
};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DispatchMessageW, EnumWindows, GetSystemMetrics, GetWindowThreadProcessId,
    PeekMessageW, RegisterClassW, SetLayeredWindowAttributes, SetWindowPos, ShowWindow, TranslateMessage, LWA_ALPHA, MSG,
    PM_REMOVE, SM_CXVIRTUALSCREEN, SM_CYVIRTUALSCREEN, SM_XVIRTUALSCREEN, SM_YVIRTUALSCREEN, SWP_NOACTIVATE,
    SWP_NOMOVE, SWP_NOZORDER, SW_SHOWNOACTIVATE, WNDCLASSW, WS_CHILD, WS_EX_LAYERED, WS_EX_NOACTIVATE,
    WS_EX_TOOLWINDOW, WS_EX_TOPMOST, WS_EX_TRANSPARENT, WS_POPUP, WS_VISIBLE,
};

use super::monitors::Rect;

// ---- the picture, in pure steps ----

/// How much the system is asked to shrink the screen by on the way in (it does it for nothing, in
/// the magnifier); `REDUCE` is how much more is done here, by averaging, so that the blur is of a
/// small picture.
const CAPTURE_SHRINK: i32 = 2;
const REDUCE: usize = 2;

/// Average k x k blocks of a BGRA picture into an RGBA one (a partial block at the edge is
/// averaged over what it has).
pub fn reduce(src: &[u8], width: usize, height: usize, stride: usize, k: usize) -> (Vec<u8>, usize, usize) {
    let k = k.max(1);
    let (cols, rows) = (width.div_ceil(k), height.div_ceil(k));
    let mut out = vec![255u8; cols * rows * 4];
    for cy in 0..rows {
        for cx in 0..cols {
            let (mut r, mut g, mut b, mut n) = (0u32, 0u32, 0u32, 0u32);
            for y in cy * k..((cy + 1) * k).min(height) {
                for x in cx * k..((cx + 1) * k).min(width) {
                    let i = y * stride + x * 4;
                    b += src[i] as u32;
                    g += src[i + 1] as u32;
                    r += src[i + 2] as u32;
                    n += 1;
                }
            }
            let o = (cy * cols + cx) * 4;
            out[o] = (r / n) as u8;
            out[o + 1] = (g / n) as u8;
            out[o + 2] = (b / n) as u8;
        }
    }
    (out, cols, rows)
}

/// One box blur pass along a line of `n` pixels `step` bytes apart, with the edge pixel standing for
/// what is beyond it.
fn box_line(px: &mut [u8], start: usize, step: usize, n: usize, radius: usize, scratch: &mut Vec<[u8; 3]>) {
    scratch.clear();
    for i in 0..n {
        let o = start + i * step;
        scratch.push([px[o], px[o + 1], px[o + 2]]);
    }
    let window = (2 * radius + 1) as u32;
    let at = |i: isize| scratch[i.clamp(0, n as isize - 1) as usize];
    let mut sum = [0u32; 3];
    for i in -(radius as isize)..=(radius as isize) {
        let p = at(i);
        for c in 0..3 {
            sum[c] += p[c] as u32;
        }
    }
    for i in 0..n {
        let o = start + i * step;
        for c in 0..3 {
            px[o + c] = ((sum[c] + window / 2) / window) as u8;
        }
        let out = at(i as isize - radius as isize);
        let inn = at(i as isize + radius as isize + 1);
        for c in 0..3 {
            sum[c] = sum[c] + inn[c] as u32 - out[c] as u32;
        }
    }
}

/// Blur an RGBA picture: three box passes each way, which is a close likeness of a Gaussian of
/// about `radius` pixels' spread.
pub fn blur(rgba: &mut [u8], width: usize, height: usize, radius: usize) {
    if radius == 0 || width == 0 || height == 0 {
        return;
    }
    let mut scratch = Vec::with_capacity(width.max(height));
    for _ in 0..3 {
        for y in 0..height {
            box_line(rgba, y * width * 4, 4, width, radius, &mut scratch);
        }
        for x in 0..width {
            box_line(rgba, x * 4, width * 4, height, radius, &mut scratch);
        }
    }
}

/// Saturate and brighten, as the page's `saturate()` and `brightness()` would (for the same look as a
/// backdrop filter over a picture the page had).
pub fn grade(rgba: &mut [u8], saturate: f32, brightness: f32) {
    for p in rgba.chunks_exact_mut(4) {
        let (r, g, b) = (p[0] as f32, p[1] as f32, p[2] as f32);
        let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        for (c, v) in [r, g, b].into_iter().enumerate() {
            p[c] = ((luma + (v - luma) * saturate) * brightness).round().clamp(0.0, 255.0) as u8;
        }
    }
}

/// A picture of the screen behind a rectangle.
pub struct Picture {
    /// The rectangle it is of, in screen pixels (what could be had of the one asked for).
    pub region: Rect,
    pub cols: usize,
    pub rows: usize,
    pub rgba: Vec<u8>,
}

/// Blurred by `sigma` screen pixels, then saturated and brightened.
pub fn finish(raw: &Raw, region: Rect, sigma: f32, saturate: f32, brightness: f32) -> Picture {
    let scale = CAPTURE_SHRINK as usize * REDUCE;
    let (mut rgba, cols, rows) = reduce(&raw.bytes, raw.width, raw.height, raw.stride, REDUCE);
    blur(&mut rgba, cols, rows, (sigma / scale as f32).round().max(1.0) as usize);
    grade(&mut rgba, saturate, brightness);
    Picture { region, cols, rows, rgba }
}

// ---- the magnifier ----

/// What the magnifier handed over: BGRA pixels.
#[derive(Clone)]
pub struct Raw {
    pub bytes: Vec<u8>,
    pub width: usize,
    pub height: usize,
    pub stride: usize,
}

static LATEST: Mutex<Option<Raw>> = Mutex::new(None);
static DELIVERED: AtomicU64 = AtomicU64::new(0);

unsafe extern "system" fn delivered(
    _hwnd: HWND,
    src: *mut core::ffi::c_void,
    header: MAGIMAGEHEADER,
    _dest: *mut core::ffi::c_void,
    _dest_header: MAGIMAGEHEADER,
    _unclipped: RECT,
    _clipped: RECT,
    _dirty: HRGN,
) -> BOOL {
    if !src.is_null() && header.width > 0 && header.height > 0 {
        let len = header.height as usize * header.stride as usize;
        let bytes = unsafe { std::slice::from_raw_parts(src as *const u8, len) }.to_vec();
        *LATEST.lock() = Some(Raw {
            bytes,
            width: header.width as usize,
            height: header.height as usize,
            stride: header.stride as usize,
        });
        DELIVERED.fetch_add(1, Ordering::SeqCst);
    }
    true.into()
}

unsafe extern "system" fn host_proc(hwnd: HWND, msg: u32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
    unsafe { DefWindowProcW(hwnd, msg, wparam, lparam) }
}

struct Job {
    region: Rect,
    reply: Sender<Option<Raw>>,
}

struct Rig {
    host: HWND,
    mag: HWND,
    size: (i32, i32),
}

fn pump() {
    unsafe {
        let mut msg = MSG::default();
        while PeekMessageW(&mut msg, None, 0, 0, PM_REMOVE).as_bool() {
            let _ = TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
    }
}

/// Every top-level window of this process: all of them are left out of the picture.
fn our_windows() -> Vec<HWND> {
    unsafe extern "system" fn each(hwnd: HWND, l: LPARAM) -> BOOL {
        let list = unsafe { &mut *(l.0 as *mut Vec<HWND>) };
        let mut pid = 0u32;
        unsafe { GetWindowThreadProcessId(hwnd, Some(&mut pid)) };
        if pid == unsafe { GetCurrentProcessId() } {
            list.push(hwnd);
        }
        true.into()
    }
    let mut list: Vec<HWND> = Vec::new();
    unsafe {
        let _ = EnumWindows(Some(each), LPARAM(&mut list as *mut Vec<HWND> as isize));
    }
    list
}

fn make_rig() -> Option<Rig> {
    unsafe {
        if !MagInitialize().as_bool() {
            log::warn!("the magnifier could not be started: no frosted glass");
            return None;
        }
        let instance = HINSTANCE(GetModuleHandleW(None).ok()?.0);
        let class = WNDCLASSW {
            lpfnWndProc: Some(host_proc),
            hInstance: instance,
            lpszClassName: w!("AeroDockBackdropHost"),
            ..Default::default()
        };
        RegisterClassW(&class);
        // on the primary screen (which has its top left at 0, 0), shown, and as good as invisible and
        // untouchable
        let host = CreateWindowExW(
            WS_EX_LAYERED | WS_EX_TRANSPARENT | WS_EX_TOPMOST | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE,
            w!("AeroDockBackdropHost"),
            w!(""),
            WS_POPUP,
            0,
            0,
            64,
            64,
            None,
            None,
            Some(instance),
            None,
        )
        .ok()?;
        let _ = SetLayeredWindowAttributes(host, Default::default(), 2, LWA_ALPHA);
        let mag = CreateWindowExW(
            Default::default(),
            WC_MAGNIFIER,
            w!(""),
            WS_CHILD | WS_VISIBLE,
            0,
            0,
            64,
            64,
            Some(host),
            None,
            Some(instance),
            None,
        )
        .ok()?;
        let _ = MagSetImageScalingCallback(mag, Some(delivered));
        let _ = ShowWindow(host, SW_SHOWNOACTIVATE);
        Some(Rig { host, mag, size: (64, 64) })
    }
}

/// One picture: the region, shrunk by the system to `region / CAPTURE_SHRINK`.
fn take(rig: &mut Rig, region: Rect) -> Option<Raw> {
    let (cols, rows) = ((region.width / CAPTURE_SHRINK).max(1), (region.height / CAPTURE_SHRINK).max(1));
    unsafe {
        if rig.size != (cols, rows) {
            let _ = SetWindowPos(rig.host, None, 0, 0, cols, rows, SWP_NOACTIVATE | SWP_NOMOVE | SWP_NOZORDER);
            let _ = SetWindowPos(rig.mag, None, 0, 0, cols, rows, SWP_NOACTIVATE | SWP_NOMOVE | SWP_NOZORDER);
            rig.size = (cols, rows);
        }
        let mut transform = MAGTRANSFORM {
            v: [cols as f32 / region.width as f32, 0.0, 0.0, 0.0, rows as f32 / region.height as f32, 0.0, 0.0, 0.0, 1.0],
        };
        let _ = MagSetWindowTransform(rig.mag, &mut transform);
        let mut leave_out = our_windows();
        leave_out.push(rig.host);
        let _ = MagSetWindowFilterList(rig.mag, MW_FILTERMODE_EXCLUDE, leave_out.len() as i32, leave_out.as_mut_ptr());
        let _ = MagSetWindowSource(
            rig.mag,
            RECT { left: region.x, top: region.y, right: region.x + region.width, bottom: region.y + region.height },
        );
        let before = DELIVERED.load(Ordering::SeqCst);
        let until = Instant::now() + Duration::from_millis(250);
        loop {
            let _ = InvalidateRect(Some(rig.mag), None, false);
            pump();
            if DELIVERED.load(Ordering::SeqCst) > before {
                break;
            }
            if Instant::now() > until {
                return None;
            }
            std::thread::sleep(Duration::from_millis(2));
        }
    }
    LATEST.lock().clone()
}

static JOBS: OnceLock<Option<Sender<Job>>> = OnceLock::new();

fn jobs() -> Option<&'static Sender<Job>> {
    JOBS.get_or_init(|| {
        let (tx, rx) = channel::<Job>();
        let started = std::thread::Builder::new().name("backdrop-capture".into()).spawn(move || {
            let mut rig = make_rig();
            while let Ok(job) = rx.recv() {
                let result = rig.as_mut().and_then(|r| take(r, job.region));
                let _ = job.reply.send(result);
            }
            if let Some(r) = rig {
                let _ = r.host;
            }
        });
        started.ok().map(|_| tx)
    })
    .as_ref()
}

/// The screen as a whole: the rectangle all the screens make together.
pub fn virtual_screen() -> Rect {
    unsafe {
        Rect {
            x: GetSystemMetrics(SM_XVIRTUALSCREEN),
            y: GetSystemMetrics(SM_YVIRTUALSCREEN),
            width: GetSystemMetrics(SM_CXVIRTUALSCREEN),
            height: GetSystemMetrics(SM_CYVIRTUALSCREEN),
        }
    }
}

/// The part of `r` that is on a screen; None when none is.
pub fn on_screen(r: Rect, screen: Rect) -> Option<Rect> {
    let (left, top) = (r.x.max(screen.x), r.y.max(screen.y));
    let (right, bottom) = ((r.x + r.width).min(screen.x + screen.width), (r.y + r.height).min(screen.y + screen.height));
    // whole multiples of what the picture is shrunk by, so the shrinking is exact
    let unit = CAPTURE_SHRINK * REDUCE as i32;
    let (width, height) = ((right - left) / unit * unit, (bottom - top) / unit * unit);
    (width >= unit && height >= unit).then_some(Rect { x: left, y: top, width, height })
}

/// A blurred picture of what is behind `region` (screen pixels), our windows left out. Waits for the
/// magnifier, so not for a thread that must not wait. None when there is no such picture to be had.
pub fn capture(region: Rect, sigma: f32, saturate: f32, brightness: f32) -> Option<Picture> {
    let region = on_screen(region, virtual_screen())?;
    let (reply, wait) = channel();
    jobs()?.send(Job { region, reply }).ok()?;
    let raw = wait.recv_timeout(Duration::from_millis(600)).ok()??;
    Some(finish(&raw, region, sigma, saturate, brightness))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn bgra(width: usize, height: usize, f: impl Fn(usize, usize) -> [u8; 3]) -> Vec<u8> {
        let mut v = Vec::new();
        for y in 0..height {
            for x in 0..width {
                let [r, g, b] = f(x, y);
                v.extend_from_slice(&[b, g, r, 255]);
            }
        }
        v
    }

    #[test]
    fn a_block_is_the_average_of_its_pixels_and_a_picture_turns_from_bgra_to_rgba() {
        let src = bgra(4, 2, |x, _| if x < 2 { [200, 0, 0] } else { [0, 100, 0] });
        let (out, cols, rows) = reduce(&src, 4, 2, 16, 2);
        assert_eq!((cols, rows), (2, 1));
        assert_eq!(&out[0..4], &[200, 0, 0, 255]);
        assert_eq!(&out[4..8], &[0, 100, 0, 255]);
    }

    #[test]
    fn an_edge_block_is_averaged_over_what_there_is() {
        let src = bgra(3, 1, |_, _| [90, 90, 90]);
        let (out, cols, _) = reduce(&src, 3, 1, 12, 2);
        assert_eq!(cols, 2);
        assert_eq!(&out[4..7], &[90, 90, 90]);
    }

    #[test]
    fn a_blur_leaves_a_flat_picture_alone_and_spreads_an_edge() {
        let mut flat = vec![120u8; 8 * 8 * 4];
        blur(&mut flat, 8, 8, 2);
        assert!(flat.iter().all(|v| *v == 120));
        // black on the left half, white on the right
        let mut edge: Vec<u8> = (0..8 * 8).flat_map(|i| if i % 8 < 4 { [0, 0, 0, 255] } else { [255, 255, 255, 255] }).collect();
        blur(&mut edge, 8, 8, 2);
        let at = |x: usize| edge[(3 * 8 + x) * 4];
        assert!(at(0) < 40 && at(7) > 215, "the far sides stay dark and light");
        assert!(at(3) > 40 && at(4) < 215, "the edge is soft");
        assert!(at(3) < at(4));
        // opaque stays opaque
        assert!(edge.chunks_exact(4).all(|p| p[3] == 255));
    }

    #[test]
    fn grading_saturates_around_the_grey_of_a_pixel_and_scales_its_brightness() {
        let mut grey = vec![100, 100, 100, 255];
        grade(&mut grey, 1.5, 1.0);
        assert_eq!(&grey[0..3], &[100, 100, 100], "grey has nothing to saturate");
        let mut red = vec![200, 50, 50, 255];
        grade(&mut red, 1.5, 1.0);
        assert!(red[0] > 200 && red[1] < 50, "{red:?}");
        let mut bright = vec![100, 100, 100, 255];
        grade(&mut bright, 1.0, 1.2);
        assert_eq!(&bright[0..3], &[120, 120, 120]);
        let mut over = vec![250, 250, 250, 255];
        grade(&mut over, 1.0, 1.5);
        assert_eq!(&over[0..3], &[255, 255, 255]);
    }

    #[test]
    fn a_region_is_cut_to_the_screen_and_to_whole_units() {
        let screen = Rect { x: -1920, y: 0, width: 4480, height: 1440 };
        let r = on_screen(Rect { x: -2000, y: 1400, width: 300, height: 100 }, screen).expect("some of it is on screen");
        assert_eq!((r.x, r.y), (-1920, 1400));
        assert_eq!(r.width % 4, 0);
        assert_eq!(r.height % 4, 0);
        assert!(r.height <= 40);
        assert!(on_screen(Rect { x: 5000, y: 0, width: 100, height: 100 }, screen).is_none());
        assert!(on_screen(Rect { x: 0, y: 0, width: 3, height: 100 }, screen).is_none());
    }

    /// Whether this machine can take the picture, and how long it takes. Shows nothing but a few
    /// pixels at the top left of the primary screen for an instant.
    /// `cargo test --lib the_magnifier_gives_a_picture -- --ignored --nocapture`
    #[test]
    #[ignore]
    fn the_magnifier_gives_a_picture() {
        std::thread::spawn(|| {
            std::thread::sleep(Duration::from_secs(30));
            std::process::exit(2);
        });
        let region = Rect { x: 100, y: 100, width: 600, height: 120 };
        for i in 0..4 {
            let t = Instant::now();
            let p = capture(region, 22.0, 1.2, 1.0).expect("a picture");
            println!("{i}: {}x{} of {:?} in {:?}", p.cols, p.rows, p.region, t.elapsed());
        }
    }
}
