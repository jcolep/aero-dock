//! A bench for how the system treats blur panes (tests only; nothing here is in the program).
//!
//! `cargo test --lib blur_lab -- --ignored --nocapture` puts a window of stripes in the middle of each
//! screen and, on it, one pane for each of several ways of making a blurred rounded shape, then
//! reads back what the screen shows: a table of numbers and a picture of the stripes window (and
//! only that: the picture is of a window the bench drew itself and covers). It shows for a few
//! seconds a screen and touches nothing else: no input, no settings, no other window.
//!
//! The ways, each in its own cell of the grid:
//!   a  shaped by a window region after the pane is shown (what the program did)
//!   b  shaped before it is shown
//!   c  no shape: a plain rectangle
//!   d  the system's own rounded corners, no region
//!   e  rectangles only: the shape as a handful of plain rectangles (`backdrop::tile_rects`)
//!   f  a region, the pane resized once (size and region changed together)
//!   g  a rectangle, resized the same way
//!   h  a region, grown over thirty frames
//!   i  a region, shrunk over thirty frames
//!   j  nothing: the stripes as they are
//!   k  the older blur-behind call with a blur region (no accent)
//!   l  a region on a layered window
//!   m  a layered window whose picture is the shape, a little alpha inside it and none outside
//!   n  the same, the alpha following the shape's soft edge (0 to 3)
//!   o  as m, with the acrylic accent and no tint
//!   p  what the program makes for the dock's bar: plain rectangles (ackdrop::tile_rects)
//!   q  the same for a panel

use std::time::Duration;

use std::time::Instant;

use windows::core::w;
use windows::Win32::Foundation::{HINSTANCE, HWND, LPARAM, LRESULT, POINT, RECT, SIZE, WPARAM};
use windows::Win32::Graphics::Dwm::{
    DwmEnableBlurBehindWindow, DwmSetWindowAttribute, DWMWINDOWATTRIBUTE, DWM_BB_BLURREGION, DWM_BB_ENABLE,
    DWM_BLURBEHIND,
};
use windows::Win32::Graphics::Gdi::{
    BeginPaint, BitBlt, CreateCompatibleDC, CreateDIBSection, CreateRectRgn, CreateRoundRectRgn, DeleteDC, DeleteObject,
    EndPaint, FillRect, GetDC, GetStockObject, RedrawWindow, ReleaseDC, SelectObject, SetWindowRgn, AC_SRC_ALPHA,
    AC_SRC_OVER, BITMAPINFO, BITMAPINFOHEADER, BI_RGB, BLACK_BRUSH, BLENDFUNCTION, CAPTUREBLT, DIB_RGB_COLORS, HBRUSH,
    HGDIOBJ, HRGN, PAINTSTRUCT, RDW_FRAME, RDW_INVALIDATE, RDW_UPDATENOW, SRCCOPY, WHITE_BRUSH,
};
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::UI::HiDpi::{SetProcessDpiAwarenessContext, DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, DispatchMessageW, GetWindowLongPtrW, PeekMessageW, RegisterClassW, TranslateMessage, SetLayeredWindowAttributes, SetWindowLongPtrW, SetWindowPos,
    ShowWindow, UpdateLayeredWindow, GWL_EXSTYLE, LWA_ALPHA, MSG, PM_REMOVE, ULW_ALPHA, WM_ERASEBKGND, WM_PAINT, WNDCLASSW, SWP_NOACTIVATE, SWP_NOMOVE, SWP_NOSIZE, SWP_SHOWWINDOW, SW_SHOWNOACTIVATE, WS_EX_LAYERED,
    WS_EX_NOACTIVATE, WS_EX_TOOLWINDOW, WS_EX_TOPMOST, WS_POPUP,
};

use super::backdrop;
use super::monitors::enumerate_monitors;
/// How much brightness varies over some pixels (BGRA), as a standard deviation, 0 to 127.5.
pub(super) fn spread(bgra: &[u8]) -> f32 {
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
pub(super) fn pump(ms: u64) {
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
pub(super) fn read_screen(x: i32, y: i32, width: i32, height: i32) -> Option<Vec<u8>> {
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

/// Make the class of the stripes window known. Registering it again is refused, and harmless.
pub(super) fn register_class() -> bool {
    unsafe {
        let Ok(module) = GetModuleHandleW(None) else { return false };
        let class = WNDCLASSW {
            lpfnWndProc: Some(stripes_proc),
            hInstance: HINSTANCE(module.0),
            lpszClassName: w!("AeroDockBlurProbe"),
            ..Default::default()
        };
        RegisterClassW(&class);
    }
    true
}


/// A rounded rectangle as a window region, in the window's own coordinates.
fn pane_region(x: i32, y: i32, width: i32, height: i32, radius: i32) -> HRGN {
    unsafe {
        if radius <= 0 {
            CreateRectRgn(x, y, x + width, y + height)
        } else {
            CreateRoundRectRgn(x, y, x + width + 1, y + height + 1, 2 * radius, 2 * radius)
        }
    }
}
const PW: i32 = 180;
const PH: i32 = 90;
const R: i32 = 40;
const STRIPES_W: i32 = 1000;
const STRIPES_H: i32 = 700;

fn mean_luma(bgra: &[u8]) -> f32 {
    let n = bgra.len() / 4;
    if n == 0 {
        return 0.0;
    }
    bgra.chunks_exact(4).map(|p| 0.114 * p[0] as f32 + 0.587 * p[1] as f32 + 0.299 * p[2] as f32).sum::<f32>() / n as f32
}

fn new_pane(blur: bool) -> HWND {
    let pane = backdrop::make_pane().expect("a pane");
    if blur {
        backdrop::set_blur(pane, true);
    }
    pane
}

fn put(pane: HWND, cover: HWND, x: i32, y: i32, w: i32, h: i32) {
    unsafe {
        let _ = SetWindowPos(pane, Some(cover), x, y, w, h, SWP_NOACTIVATE | SWP_SHOWWINDOW);
    }
}

fn shape(pane: HWND, w: i32, h: i32) {
    unsafe {
        let region = pane_region(0, 0, w, h, R);
        let _ = SetWindowRgn(pane, Some(region), true);
        let _ = RedrawWindow(Some(pane), None, None, RDW_INVALIDATE | RDW_FRAME | RDW_UPDATENOW);
    }
}

/// How much of the pixel at (x, y) is inside a w x h rounded rectangle of radius R, 0 to 1.
fn coverage(x: i32, y: i32, w: i32, h: i32) -> f32 {
    let r = R as f32;
    let mut inside = 0;
    for sy in 0..4 {
        for sx in 0..4 {
            let (px, py) = (x as f32 + (sx as f32 + 0.5) / 4.0, y as f32 + (sy as f32 + 0.5) / 4.0);
            let cx = px.clamp(r, w as f32 - r);
            let cy = py.clamp(r, h as f32 - r);
            if (px - cx).powi(2) + (py - cy).powi(2) <= r * r {
                inside += 1;
            }
        }
    }
    inside as f32 / 16.0
}

/// Give a layered window a picture that is the shape: premultiplied black, with a little alpha
/// where the shape is (`soft`: following its soft edge, 0 to 3) and none outside it.
fn layered_shape(pane: HWND, x: i32, y: i32, w: i32, h: i32, soft: bool) {
    unsafe {
        let screen = GetDC(None);
        let mem = CreateCompatibleDC(Some(screen));
        let info = BITMAPINFO {
            bmiHeader: BITMAPINFOHEADER {
                biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
                biWidth: w,
                biHeight: -h,
                biPlanes: 1,
                biBitCount: 32,
                biCompression: BI_RGB.0,
                ..Default::default()
            },
            ..Default::default()
        };
        let mut bits: *mut core::ffi::c_void = std::ptr::null_mut();
        if let Ok(bitmap) = CreateDIBSection(Some(mem), &info, DIB_RGB_COLORS, &mut bits, None, 0) {
            if !bits.is_null() {
                let pixels = std::slice::from_raw_parts_mut(bits as *mut u8, (w * h * 4) as usize);
                for py in 0..h {
                    for px in 0..w {
                        let c = coverage(px, py, w, h);
                        let alpha = if soft { (c * 3.0).round() as u8 } else if c > 0.5 { 1 } else { 0 };
                        let i = ((py * w + px) * 4) as usize;
                        pixels[i..i + 4].copy_from_slice(&[0, 0, 0, alpha]);
                    }
                }
                let old = SelectObject(mem, HGDIOBJ(bitmap.0));
                let at = POINT { x, y };
                let size = SIZE { cx: w, cy: h };
                let from = POINT { x: 0, y: 0 };
                let blend = BLENDFUNCTION {
                    BlendOp: AC_SRC_OVER as u8,
                    BlendFlags: 0,
                    SourceConstantAlpha: 255,
                    AlphaFormat: AC_SRC_ALPHA as u8,
                };
                let _ = UpdateLayeredWindow(pane, Some(screen), Some(&at), Some(&size), Some(mem), Some(&from), Default::default(), Some(&blend), ULW_ALPHA);
                SelectObject(mem, old);
            }
            let _ = DeleteObject(HGDIOBJ(bitmap.0));
        }
        let _ = DeleteDC(mem);
        ReleaseDC(None, screen);
    }
}
/// One cell: where its pane ends up (screen pixels), and the panes made for it.
struct Cell {
    key: &'static str,
    /// The pane's final rectangle.
    at: (i32, i32, i32, i32),
    windows: Vec<HWND>,
}

fn lerp(a: i32, b: i32, t: f32) -> i32 {
    (a as f32 + (b - a) as f32 * t).round() as i32
}

#[test]
#[ignore]
fn blur_lab() {
    unsafe {
        let _ = SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);
    }
    assert!(register_class());
    let out = std::env::var("BLUR_LAB_OUT").unwrap_or_else(|_| "target/blur-lab".into());
    std::fs::create_dir_all(&out).expect("an output folder");

    for monitor in enumerate_monitors().expect("monitors") {
        let b = monitor.bounds;
        let (sx, sy) = (b.x + (b.width - STRIPES_W) / 2, b.y + (b.height - STRIPES_H) / 2);
        let instance = HINSTANCE(unsafe { GetModuleHandleW(None) }.expect("module").0);
        let make = |x: i32, y: i32, w: i32, h: i32| unsafe {
            CreateWindowExW(
                WS_EX_TOPMOST | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE,
                w!("AeroDockBlurProbe"),
                w!(""),
                WS_POPUP,
                x,
                y,
                w,
                h,
                None,
                None,
                Some(instance),
                None,
            )
            .expect("a window")
        };
        let stripes = make(sx, sy, STRIPES_W, STRIPES_H);
        let cover = make(-32000, -32000, 1, 1);
        unsafe {
            let _ = ShowWindow(stripes, SW_SHOWNOACTIVATE);
            let _ = ShowWindow(cover, SW_SHOWNOACTIVATE);
        }
        pump(300);

        let keys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q"];
        let mut cells: Vec<Cell> = keys
            .iter()
            .enumerate()
            .map(|(i, key)| {
                let (col, row) = ((i % 5) as i32, (i / 5) as i32);
                let (x, y) = (sx + 10 + col * 195, sy + 20 + row * 165);
                Cell { key, at: (x, y, PW, PH), windows: Vec::new() }
            })
            .collect();

        for cell in cells.iter_mut() {
            let (x, y, w, h) = cell.at;
            match cell.key {
                "a" => {
                    let p = new_pane(true);
                    put(p, cover, x, y, w, h);
                    shape(p, w, h);
                    cell.windows.push(p);
                }
                "b" => {
                    let p = new_pane(true);
                    unsafe {
                        // placed but not shown, shaped, and only then shown
                        let _ = SetWindowPos(p, Some(cover), x, y, w, h, SWP_NOACTIVATE);
                        let region = pane_region(0, 0, w, h, R);
                        let _ = SetWindowRgn(p, Some(region), true);
                        let _ = ShowWindow(p, SW_SHOWNOACTIVATE);
                    }
                    cell.windows.push(p);
                }
                "c" => {
                    let p = new_pane(true);
                    put(p, cover, x, y, w, h);
                    cell.windows.push(p);
                }
                "d" => {
                    let p = new_pane(true);
                    unsafe {
                        const DWMWA_WINDOW_CORNER_PREFERENCE: i32 = 33;
                        const DWMWCP_ROUND: i32 = 2;
                        let _ = DwmSetWindowAttribute(
                            p,
                            DWMWINDOWATTRIBUTE(DWMWA_WINDOW_CORNER_PREFERENCE),
                            &DWMWCP_ROUND as *const i32 as *const _,
                            std::mem::size_of::<i32>() as u32,
                        );
                    }
                    put(p, cover, x, y, w, h);
                    cell.windows.push(p);
                }
                "e" => {
                    for (tx, ty, tw, th) in backdrop::tile_rects(w, h, R, false) {
                        let p = new_pane(true);
                        put(p, cover, x + tx, y + ty, tw, th);
                        cell.windows.push(p);
                    }
                }
                "f" | "g" => {
                    let p = new_pane(true);
                    let small = (x + 40, y + 20, 100, 50);
                    put(p, cover, small.0, small.1, small.2, small.3);
                    if cell.key == "f" {
                        shape(p, small.2, small.3);
                    }
                    pump(250);
                    put(p, cover, x, y, w, h);
                    if cell.key == "f" {
                        shape(p, w, h);
                    }
                    cell.windows.push(p);
                }
                "h" | "i" => {
                    let p = new_pane(true);
                    let (from, to) = if cell.key == "h" { ((60, 30), (w, h)) } else { ((w, h), (90, 45)) };
                    for step in 0..=30 {
                        let t = step as f32 / 30.0;
                        let (pw, ph) = (lerp(from.0, to.0, t), lerp(from.1, to.1, t));
                        put(p, cover, x + (w - pw) / 2, y + (h - ph) / 2, pw, ph);
                        shape(p, pw, ph);
                        pump(8);
                    }
                    // where it ended up, for the measuring
                    cell.at = (x + (w - to.0) / 2, y + (h - to.1) / 2, to.0, to.1);
                    cell.windows.push(p);
                }
                "j" => {}
                "k" => {
                    // the older call: a blur region and no accent
                    let p = new_pane(false);
                    put(p, cover, x, y, w, h);
                    unsafe {
                        let region = pane_region(0, 0, w, h, R);
                        let bb = DWM_BLURBEHIND {
                            dwFlags: DWM_BB_ENABLE | DWM_BB_BLURREGION,
                            fEnable: true.into(),
                            hRgnBlur: region,
                            fTransitionOnMaximized: false.into(),
                        };
                        let _ = DwmEnableBlurBehindWindow(p, &bb);
                    }
                    cell.windows.push(p);
                }
                "l" => {
                    let p = new_pane(true);
                    unsafe {
                        let ex = GetWindowLongPtrW(p, GWL_EXSTYLE);
                        SetWindowLongPtrW(p, GWL_EXSTYLE, ex | WS_EX_LAYERED.0 as isize);
                        let _ = SetLayeredWindowAttributes(p, Default::default(), 255, LWA_ALPHA);
                    }
                    put(p, cover, x, y, w, h);
                    shape(p, w, h);
                    cell.windows.push(p);
                }
                // what the program makes now: a bar of the dock's shape, and a panel
                "p" | "q" => {
                    let (ph, r) = if cell.key == "p" { (46, 23) } else { (h, 24) };
                    let oy = (h - ph) / 2;
                    for (tx, ty, tw, th) in backdrop::tile_rects(w, ph, r, false) {
                        let p = new_pane(true);
                        put(p, cover, x + tx, y + oy + ty, tw, th);
                        cell.windows.push(p);
                    }
                }
                "m" | "n" | "o" => {
                    let p = new_pane(false);
                    unsafe {
                        let ex = GetWindowLongPtrW(p, GWL_EXSTYLE);
                        SetWindowLongPtrW(p, GWL_EXSTYLE, ex | WS_EX_LAYERED.0 as isize);
                    }
                    if cell.key == "o" {
                        // acrylic, with a tint of no opacity
                        backdrop::set_accent(p, 4, 0, 0);
                    } else {
                        backdrop::set_blur(p, true);
                    }
                    layered_shape(p, x, y, w, h, cell.key == "n");
                    unsafe {
                        let _ = SetWindowPos(p, Some(cover), 0, 0, 0, 0, SWP_NOACTIVATE | SWP_NOMOVE | SWP_NOSIZE);
                        let _ = ShowWindow(p, SW_SHOWNOACTIVATE);
                    }
                    cell.windows.push(p);
                }                _ => {}
            }
        }
        pump(900);

        // ---- read back ----
        let name = monitor.name.replace(['\\', '.'], "");
        let mut report = format!(
            "{} {}x{} at ({}, {}) scale {} {}\n",
            monitor.name,
            b.width,
            b.height,
            b.x,
            b.y,
            monitor.scale,
            if monitor.is_primary { "(primary)" } else { "" }
        );
        report.push_str("cell  centre(mean spread)   corner(mean spread)   outside(spread)   top-edge(mean spread)\n");
        for cell in &cells {
            let (x, y, w, h) = cell.at;
            let block = |bx: i32, by: i32, bw: i32, bh: i32| read_screen(bx, by, bw, bh).unwrap_or_default();
            let centre = block(x + w / 2 - 12, y + h / 2 - 4, 24, 8);
            // the very corner of the rectangle, outside the round shape
            let corner = block(x + 2, y + 1, 12, 4);
            // just beyond the left edge, in the middle: nothing there should be blurred
            let outside = block(x - 14, y + h / 2 - 4, 10, 8);
            // inside the top edge, at the middle
            let top = block(x + w / 2 - 12, y + 2, 24, 3);
            report.push_str(&format!(
                "{:>4}  {:>6.1} {:>6.1}       {:>6.1} {:>6.1}       {:>6.1}       {:>6.1} {:>6.1}\n",
                cell.key,
                mean_luma(&centre),
                spread(&centre),
                mean_luma(&corner),
                spread(&corner),
                spread(&outside),
                mean_luma(&top),
                spread(&top),
            ));
        }
        println!("{report}");
        let _ = std::fs::write(format!("{out}/lab-{name}.txt"), &report);

        // the stripes window itself (a window this bench drew and which covers what is read)
        if let Some(bgra) = read_screen(sx, sy, STRIPES_W, STRIPES_H) {
            let rgba: Vec<u8> = bgra.chunks_exact(4).flat_map(|p| [p[2], p[1], p[0], 255]).collect();
            if let Some(img) = image::RgbaImage::from_raw(STRIPES_W as u32, STRIPES_H as u32, rgba) {
                let _ = img.save(format!("{out}/lab-{name}.png"));
            }
        }

        for cell in &cells {
            for w in &cell.windows {
                unsafe {
                    let _ = DestroyWindow(*w);
                }
            }
        }
        unsafe {
            let _ = DestroyWindow(cover);
            let _ = DestroyWindow(stripes);
        }
        pump(200);
        std::thread::sleep(Duration::from_millis(100));
    }
}
