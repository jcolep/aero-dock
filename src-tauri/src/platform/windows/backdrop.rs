//! What the frosted glass is not: the system's own blur (tests only; the program does not use it).
//!
//! Windows can blur what is behind a window (through the undocumented but long-stable
//! `SetWindowCompositionAttribute`), and it is the whole window's rectangle every time: it was
//! measured on Windows 11 with a window region, a layered window's alpha, `DwmEnableBlurBehindWindow`
//! and a blur region, and acrylic, and none gives a shape. A bar that is rounded could only be had
//! with plain rectangles inside its curve (`tile_rects`), which leave a rim at the corners and show
//! as bands where a rectangle is narrow, so the program blurs a picture of the screen instead (see
//! `backdrop_capture`). This is kept for the bench (`blurlab`), to say again what Windows does.

use std::sync::Once;

use windows::core::{s, w, BOOL};
use windows::Win32::Foundation::{HINSTANCE, HWND, LPARAM, LRESULT, WPARAM};
use windows::Win32::Graphics::Dwm::{DwmSetWindowAttribute, DWMWINDOWATTRIBUTE};
use windows::Win32::System::LibraryLoader::{GetModuleHandleW, GetProcAddress};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, RegisterClassW, HTTRANSPARENT, MA_NOACTIVATE, WM_ERASEBKGND, WM_MOUSEACTIVATE,
    WM_NCHITTEST, WNDCLASSW, WS_EX_NOACTIVATE, WS_EX_TOOLWINDOW, WS_EX_TOPMOST, WS_POPUP,
};

/// A tile narrower than this is left out. A window blurs only what is in its own bounds, so a narrow
/// one blurs a narrow strip of the screen and shows as a band that is not like its neighbours.
const MIN_TILE: i32 = 10;

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

/// A bare pane window, not yet placed.
pub fn make_pane() -> Option<HWND> {

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
}
