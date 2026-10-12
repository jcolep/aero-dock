//! Finding out whether the frosted glass can be the shape it is meant to be on
//! each of the screens.
//!
//! The blur is a window of its own shaped by a window region (see `backdrop`),
//! and on at least one machine a screen showed it as the whole rectangle of the
//! window, square corners and all, behind a bar with round ones, while another
//! screen of the same machine showed it right. Which screens do is a property of
//! the screen and its graphics path, not something to be read from a setting, so
//! it is looked at.
//!
//! The check puts a window of black and white stripes in the middle of a screen,
//! a blur pane over it, round at the corners as it would be for a bar, and
//! reads back what the screen shows (the pictures a screen shows can be read by
//! the program that drew them): blurred stripes are grey, and a corner of the
//! pane's rectangle that is outside its round shape must still show stripes. It
//! takes about a second a screen and shows for that long, so it is run when it
//! is asked for, not behind anyone's back.
//!
//! What it finds is kept (`blur-check.json` in the data folder) and used: a
//! screen whose blur ignores the shape gets a pane inset so that its square
//! corners are inside the round bar (see `degrade`), and so no rectangle shows.

use std::collections::HashMap;
use std::path::Path;
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use windows::core::w;
use windows::Win32::Foundation::{HINSTANCE, HWND, LPARAM, LRESULT, RECT, WPARAM};
use windows::Win32::Graphics::Gdi::{
    BeginPaint, BitBlt, CreateCompatibleDC, CreateDIBSection, DeleteDC, DeleteObject, EndPaint, FillRect, GetDC,
    GetStockObject, ReleaseDC, SelectObject, BITMAPINFO, BITMAPINFOHEADER, BI_RGB, BLACK_BRUSH, CAPTUREBLT,
    DIB_RGB_COLORS, HBRUSH, HGDIOBJ, PAINTSTRUCT, SRCCOPY, WHITE_BRUSH,
};
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, DispatchMessageW, PeekMessageW, RegisterClassW, SetWindowPos,
    ShowWindow, TranslateMessage, MSG, PM_REMOVE, SWP_NOACTIVATE, SWP_SHOWWINDOW, SW_SHOWNOACTIVATE, WM_ERASEBKGND,
    WM_PAINT, WNDCLASSW, WS_EX_NOACTIVATE, WS_EX_TOOLWINDOW, WS_EX_TOPMOST, WS_POPUP,
};

use super::backdrop;
use super::monitors::{enumerate_monitors, MonitorInfoEx, Rect};

/// What was found on one screen.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Check {
    pub monitor: String,
    pub primary: bool,
    pub scale: f64,
    /// Whether the blur is drawn at all.
    pub blurs: bool,
    /// Whether it keeps to the round shape it is given.
    pub shape_kept: bool,
    /// How much the stripes still vary in the middle of the pane (high: not blurred) and at its
    /// outside corner (high: not blurred, which is right there), as a spread of brightness 0..127.
    pub centre_spread: f32,
    pub corner_spread: f32,
    pub note: String,
}

/// The screens as last read: when, and each one's device name and place.
type ScreenList = Option<(Instant, Vec<(String, Rect)>)>;

/// Which screens keep the shape, by device name (`\\.\DISPLAY2`). A screen not in it is not known not to.
static SHAPE: Mutex<Option<HashMap<String, bool>>> = Mutex::new(None);

/// Whether the blur keeps its shape on a screen; true when that is not known.
pub fn shape_kept(monitor: &str) -> bool {
    SHAPE.lock().as_ref().and_then(|m| m.get(monitor).copied()).unwrap_or(true)
}

/// Whether it does on the screen a point is on. The list of screens is read at most every two
/// seconds, since this is asked at every frame of an animation.
pub fn shape_kept_at(x: i32, y: i32) -> bool {
    static MONITORS: Mutex<ScreenList> = Mutex::new(None);
    let mut guard = MONITORS.lock();
    let stale = guard.as_ref().is_none_or(|(at, _)| at.elapsed() > Duration::from_secs(2));
    if stale {
        let list = enumerate_monitors()
            .map(|all| all.into_iter().map(|m| (m.name, m.bounds)).collect())
            .unwrap_or_default();
        *guard = Some((Instant::now(), list));
    }
    let list = &guard.as_ref().expect("just made").1;
    let found = list.iter().find(|(_, b)| x >= b.x && x < b.x + b.width && y >= b.y && y < b.y + b.height);
    found.map(|(n, _)| shape_kept(n)).unwrap_or(true)
}

/// Read what a past check found.
pub fn load(path: &Path) {
    let Ok(text) = std::fs::read_to_string(path) else { return };
    let Ok(checks) = serde_json::from_str::<Vec<Check>>(&text) else { return };
    remember(&checks);
}

fn remember(checks: &[Check]) {
    // only a screen that blurs and was seen to lose its shape is treated as one that does
    let map: HashMap<String, bool> = checks.iter().map(|c| (c.monitor.clone(), !c.blurs || c.shape_kept)).collect();
    *SHAPE.lock() = Some(map);
}

/// Keep what a check found, to be read at the next start and used from now.
pub fn save(path: &Path, checks: &[Check]) {
    remember(checks);
    if let Ok(text) = serde_json::to_string_pretty(checks) {
        let _ = std::fs::write(path, text);
    }
}

/// The pane for a screen that does not keep the shape: inset so that its square corners are
/// inside the round corners of what it backs (a corner of radius r is met by a square corner
/// inset by r(1 - cos 45°), about 0.3 r), so that no rectangle shows. The ring round the edge
/// is not blurred, which on a bar a few tens of pixels tall is a thin rim of clear glass.
pub fn degrade(rect: Rect, radius: i32, shape_kept: bool) -> (Rect, i32) {
    if shape_kept || radius <= 0 {
        return (rect, radius);
    }
    let inset = (radius as f32 * 0.3).ceil() as i32;
    let narrowed = Rect {
        x: rect.x + inset,
        y: rect.y + inset,
        width: (rect.width - 2 * inset).max(1),
        height: (rect.height - 2 * inset).max(1),
    };
    (narrowed, (radius - inset).max(0))
}

/// How much brightness varies over some pixels (BGRA), as a standard deviation, 0 to 127.5.
pub fn spread(bgra: &[u8]) -> f32 {
    let luma: Vec<f32> = bgra
        .chunks_exact(4)
        .map(|p| 0.114 * p[0] as f32 + 0.587 * p[1] as f32 + 0.299 * p[2] as f32)
        .collect();
    if luma.is_empty() {
        return 0.0;
    }
    let mean = luma.iter().sum::<f32>() / luma.len() as f32;
    (luma.iter().map(|l| (l - mean) * (l - mean)).sum::<f32>() / luma.len() as f32).sqrt()
}

/// The verdict for a screen from the two spreads. Stripes of black and white are about 127; blurred,
/// they are nearly level. Returns (blurs, shape kept).
pub fn judge(centre: f32, corner: f32) -> (bool, bool) {
    (centre < 60.0, corner > 90.0)
}

// ---- the probe: a window of stripes ----

unsafe extern "system" fn stripes_proc(hwnd: HWND, msg: u32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
    match msg {
        WM_ERASEBKGND => LRESULT(1),
        WM_PAINT => unsafe {
            let mut ps = PAINTSTRUCT::default();
            let dc = BeginPaint(hwnd, &mut ps);
            let black = HBRUSH(GetStockObject(BLACK_BRUSH).0);
            let white = HBRUSH(GetStockObject(WHITE_BRUSH).0);
            // three pixels of each, across the whole window
            let mut x = 0;
            let mut dark = true;
            while x < 4000 {
                let band = RECT { left: x, top: ps.rcPaint.top, right: x + 3, bottom: ps.rcPaint.bottom };
                FillRect(dc, &band, if dark { black } else { white });
                dark = !dark;
                x += 3;
            }
            let _ = EndPaint(hwnd, &ps);
            LRESULT(0)
        },
        _ => unsafe { DefWindowProcW(hwnd, msg, wparam, lparam) },
    }
}

/// Let the system run what it has for this thread's windows, for a time.
fn pump(ms: u64) {
    let until = Instant::now() + Duration::from_millis(ms);
    while Instant::now() < until {
        unsafe {
            let mut msg = MSG::default();
            while PeekMessageW(&mut msg, None, 0, 0, PM_REMOVE).as_bool() {
                let _ = TranslateMessage(&msg);
                DispatchMessageW(&msg);
            }
        }
        std::thread::sleep(Duration::from_millis(8));
    }
}

/// What the screen shows in a rectangle, as BGRA (top-down).
fn read_screen(x: i32, y: i32, width: i32, height: i32) -> Option<Vec<u8>> {
    if width <= 0 || height <= 0 {
        return None;
    }
    unsafe {
        let screen = GetDC(None);
        let mem = CreateCompatibleDC(Some(screen));
        let info = BITMAPINFO {
            bmiHeader: BITMAPINFOHEADER {
                biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
                biWidth: width,
                biHeight: -height,
                biPlanes: 1,
                biBitCount: 32,
                biCompression: BI_RGB.0,
                ..Default::default()
            },
            ..Default::default()
        };
        let mut bits: *mut core::ffi::c_void = std::ptr::null_mut();
        let made = CreateDIBSection(Some(mem), &info, DIB_RGB_COLORS, &mut bits, None, 0);
        let result = match made {
            Ok(bitmap) if !bits.is_null() => {
                let old = SelectObject(mem, HGDIOBJ(bitmap.0));
                // CAPTUREBLT: windows that are layered, as the web views are, are part of the picture too
                let ok = BitBlt(mem, 0, 0, width, height, Some(screen), x, y, SRCCOPY | CAPTUREBLT).is_ok();
                let out = ok.then(|| std::slice::from_raw_parts(bits as *const u8, (width * height * 4) as usize).to_vec());
                SelectObject(mem, old);
                let _ = DeleteObject(HGDIOBJ(bitmap.0));
                out
            }
            _ => None,
        };
        let _ = DeleteDC(mem);
        ReleaseDC(None, screen);
        result
    }
}

fn probe_one(monitor: &MonitorInfoEx) -> Check {
    let mut check = Check {
        monitor: monitor.name.clone(),
        primary: monitor.is_primary,
        scale: monitor.scale,
        blurs: false,
        shape_kept: false,
        centre_spread: 0.0,
        corner_spread: 0.0,
        note: String::new(),
    };
    let b = monitor.bounds;
    let (w, h) = (360, 220);
    let (x, y) = (b.x + (b.width - w) / 2, b.y + (b.height - h) / 2);
    unsafe {
        let Ok(module) = GetModuleHandleW(None) else { return check };
        let instance = HINSTANCE(module.0);
        let make = |left: i32, top: i32, width: i32, height: i32| {
            CreateWindowExW(
                WS_EX_TOPMOST | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE,
                w!("AeroDockBlurProbe"),
                w!(""),
                WS_POPUP,
                left,
                top,
                width,
                height,
                None,
                None,
                Some(instance),
                None,
            )
        };
        let stripes = make(x, y, w, h);
        // a window above the stripes for the pane to sit under
        let cover = make(-32000, -32000, 1, 1);
        let (Ok(stripes), Ok(cover)) = (stripes, cover) else {
            check.note = "could not make the test window".into();
            return check;
        };
        let _ = ShowWindow(stripes, SW_SHOWNOACTIVATE);
        let _ = ShowWindow(cover, SW_SHOWNOACTIVATE);
        pump(250);

        // the pane: 40 px inside the stripes, round at the corners as a bar is
        let (px, py, pw, ph, radius) = (x + 40, y + 40, w - 80, h - 80, 50);
        if let Some(pane) = backdrop::make_pane() {
            backdrop::set_blur(pane, true);
            let _ = SetWindowPos(pane, Some(cover), px, py, pw, ph, SWP_NOACTIVATE | SWP_SHOWWINDOW);
            let shape = backdrop::pane_region(0, 0, pw, ph, radius);
            let _ = windows::Win32::Graphics::Gdi::SetWindowRgn(pane, Some(shape), true);
            pump(500);

            let centre = read_screen(px + pw / 2 - 12, py + ph / 2 - 4, 24, 8);
            // the very corner of the pane's rectangle, which is outside its round shape
            let corner = read_screen(px + 2, py + 1, 12, 4);
            match (centre, corner) {
                (Some(c), Some(k)) => {
                    check.centre_spread = spread(&c);
                    check.corner_spread = spread(&k);
                    let (blurs, kept) = judge(check.centre_spread, check.corner_spread);
                    check.blurs = blurs;
                    check.shape_kept = kept;
                    check.note = match (blurs, kept) {
                        (false, _) => "the blur is not drawn on this screen".into(),
                        (true, true) => "the blur is drawn and keeps its shape".into(),
                        (true, false) => "the blur is drawn, but as the whole rectangle: its shape is ignored".into(),
                    };
                }
                _ => check.note = "the screen could not be read back".into(),
            }
            let _ = DestroyWindow(pane);
        } else {
            check.note = "could not make a blur window".into();
        }
        let _ = DestroyWindow(cover);
        let _ = DestroyWindow(stripes);
        pump(80);
    }
    check
}

/// Look at every screen. Takes about a second for each, and shows for that long.
pub fn run() -> Vec<Check> {
    let Ok(monitors) = enumerate_monitors() else { return Vec::new() };
    unsafe {
        let Ok(module) = GetModuleHandleW(None) else { return Vec::new() };
        let class = WNDCLASSW {
            lpfnWndProc: Some(stripes_proc),
            hInstance: HINSTANCE(module.0),
            lpszClassName: w!("AeroDockBlurProbe"),
            ..Default::default()
        };
        // registering it again is refused, and harmless
        RegisterClassW(&class);
    }
    monitors.iter().map(probe_one).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn pixels(values: &[u8]) -> Vec<u8> {
        values.iter().flat_map(|v| [*v, *v, *v, 255]).collect()
    }

    #[test]
    fn stripes_vary_a_great_deal_and_a_level_grey_not_at_all() {
        let stripes = pixels(&[0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255]);
        assert!(spread(&stripes) > 100.0);
        assert!(spread(&pixels(&[128; 12])) < 0.5);
        assert_eq!(spread(&[]), 0.0);
    }

    #[test]
    fn the_verdict_needs_a_blurred_middle_and_a_striped_corner() {
        assert_eq!(judge(10.0, 120.0), (true, true), "blurred in the middle, stripes at the corner");
        assert_eq!(judge(10.0, 12.0), (true, false), "the corner is blurred too: the shape was ignored");
        assert!(!judge(120.0, 120.0).0, "nothing was blurred");
    }

    #[test]
    fn a_pane_that_loses_its_shape_is_inset_so_its_corners_are_inside_the_round_ones() {
        let rect = Rect { x: 100, y: 100, width: 400, height: 50 };
        // right: untouched
        assert_eq!(degrade(rect, 25, true), (rect, 25));
        let (narrow, radius) = degrade(rect, 25, false);
        // inset by 0.3 of the radius, rounded up
        assert_eq!((narrow.x, narrow.y, narrow.width, narrow.height), (108, 108, 384, 34));
        assert_eq!(radius, 17);
        // a square corner of the narrowed rectangle lies inside the round corner of the original:
        // its distance from the centre of that corner's circle is within the radius
        let centre = (100.0 + 25.0, 100.0 + 25.0);
        let corner = (narrow.x as f32, narrow.y as f32);
        let distance = ((corner.0 - centre.0).powi(2) + (corner.1 - centre.1).powi(2)).sqrt();
        assert!(distance <= 25.5, "{distance}");
        // no radius, nothing to do; and a tiny one is never made smaller than a pixel
        assert_eq!(degrade(rect, 0, false), (rect, 0));
        let (tiny, _) = degrade(Rect { x: 0, y: 0, width: 5, height: 5 }, 40, false);
        assert!(tiny.width >= 1 && tiny.height >= 1);
    }

    #[test]
    fn a_screen_is_taken_to_keep_the_shape_until_a_check_says_it_does_not() {
        remember(&[]);
        assert!(shape_kept("\\\\.\\DISPLAY9"));
        let check = |name: &str, blurs: bool, kept: bool| Check {
            monitor: name.into(),
            primary: false,
            scale: 1.0,
            blurs,
            shape_kept: kept,
            centre_spread: 0.0,
            corner_spread: 0.0,
            note: String::new(),
        };
        remember(&[check("A", true, true), check("B", true, false), check("C", false, false)]);
        assert!(shape_kept("A"));
        assert!(!shape_kept("B"), "blurred as a rectangle");
        assert!(shape_kept("C"), "no blur at all is nothing to correct");
        assert!(shape_kept("D"), "not looked at");
        remember(&[]);
    }

    /// Looks at the real screens of this machine, which shows a window of stripes on each for a second.
    /// `cargo test --lib check_this_machine -- --ignored --nocapture`
    #[test]
    #[ignore]
    fn check_this_machine() {
        for c in run() {
            println!("{c:#?}");
        }
    }
}
