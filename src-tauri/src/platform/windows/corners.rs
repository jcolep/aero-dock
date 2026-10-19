//! The frame's corner pieces, drawn here and shown in small windows of their own.
//!
//! With the frame on, a maximised app fills the opening exactly, and one snapped to a side or a quarter fills part of
//! it with a corner or two in the opening's corners. Those corners are square. Over each one a piece is laid: what
//! the margin is there (the wallpaper, seen through the margin's glass, and the glass border if it is on), shaped by
//! the opening's rounded edge and anti-aliased along it. The app is behind the frame at its corners and looks to have
//! rounded ones. Nothing is done to the app's window, so it works for every app.
//!
//! Each piece is a layered window the size of its corner (a few dozen pixels square), always on top, that takes no
//! clicks and no focus, painted with `UpdateLayeredWindow` from a bitmap drawn here pixel by pixel. Showing, moving
//! and repainting one is immediate: nothing has to wake up and render first. A piece is drawn again only when what
//! it shows changes (the opening, the radius, the glass's color, the wallpaper).
//!
//! `render` is the drawing, and has no part in windows: it is what the tests look at.

use std::cell::RefCell;
use std::collections::HashMap;

use windows::core::w;
use windows::Win32::Foundation::{COLORREF, HWND, LPARAM, LRESULT, POINT, SIZE, WPARAM};
use windows::Win32::Graphics::Gdi::{
    CreateCompatibleDC, CreateDIBSection, DeleteDC, DeleteObject, GetDC, ReleaseDC, SelectObject, AC_SRC_ALPHA,
    AC_SRC_OVER, BITMAPINFO, BITMAPINFOHEADER, BI_RGB, BLENDFUNCTION, DIB_RGB_COLORS,
};
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, IsWindowVisible, RegisterClassW, SetWindowPos, ShowWindow,
    UpdateLayeredWindow, HWND_TOPMOST, SWP_NOACTIVATE, SWP_NOMOVE, SWP_NOSIZE, SWP_SHOWWINDOW, SW_HIDE, ULW_ALPHA,
    WINDOW_EX_STYLE, WNDCLASSW, WS_EX_LAYERED, WS_EX_NOACTIVATE, WS_EX_TOOLWINDOW, WS_EX_TOPMOST, WS_EX_TRANSPARENT,
    WS_POPUP,
};

use super::monitors::Rect;

/// How far past the curve each piece reaches along the opening's edges, in pixels: the curve, the pixels it passes
/// through, and a little more so that nothing of the app's square corner is left beside it.
const BEYOND: i32 = 4;

/// The glass border's light, down the frame's whole height: the same stops as `BevelGradient` in FrameApp.tsx (white,
/// at these opacities). Keep the two in step.
const BEVEL: [(f32, f32); 5] = [(0.0, 0.78), (0.2, 0.3), (0.55, 0.1), (0.88, 0.17), (1.0, 0.36)];
/// The bright hairline on the border's outer edge, and the dark one where the apps begin (frame.css).
const LIT: ([f32; 3], f32) = ([1.0, 1.0, 1.0], 0.5);
const EDGE: ([f32; 3], f32) = ([4.0 / 255.0, 16.0 / 255.0, 32.0 / 255.0], 0.4);

/// How the margin looks: what the frame's page says its glass is, and how wide its border is.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Look {
    /// The margin's glass, straight (not premultiplied) RGBA, 0 to 1. `None` until the page has said: a piece is then
    /// drawn in the margin's color as read off the screen, glass and all.
    pub glass: Option<[f32; 4]>,
    /// The glass border's width in pixels (0 when it is off).
    pub border: f32,
}

/// What is under one corner piece: the wallpaper (seen through the glass), or, where it could not be had or does not
/// line up with the margin, the margin's own color as seen beside the corner.
#[derive(Debug, Clone, PartialEq)]
pub enum Ground {
    /// The wallpaper under the piece, `size` by `size`, RGB rows from the piece's top left.
    Wallpaper(Vec<[u8; 3]>),
    Flat([u8; 3]),
}

/// One corner piece: which corner of which opening, and how big.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Piece {
    /// 0 top left, 1 top right, 2 bottom right, 3 bottom left.
    pub corner: usize,
    /// The opening on the screen: the rounded rectangle the pieces are outside of.
    pub opening: Rect,
    pub radius: i32,
    /// The frame's own box on the screen, which the border's light runs across: one light, high on the upper
    /// left, the same `--rim` every other surface in the app is lit by (tokens.css), not light from directly
    /// above — the two used to disagree (picked apart from the menu bar's own border, October 2026).
    pub frame_left: i32,
    pub frame_top: i32,
    pub frame_width: i32,
    pub frame_height: i32,
}

impl Piece {
    /// How big the piece's square is.
    pub fn size(&self) -> i32 {
        (self.radius + BEYOND).min(self.opening.width / 2).min(self.opening.height / 2).max(1)
    }

    /// Where the piece's square is on the screen: in its corner of the opening.
    pub fn origin(&self) -> (i32, i32) {
        let s = self.size();
        let o = &self.opening;
        let (left, top, right, bottom) = (o.x, o.y, o.x + o.width - s, o.y + o.height - s);
        match self.corner {
            0 => (left, top),
            1 => (right, top),
            2 => (right, bottom),
            _ => (left, bottom),
        }
    }
}

/// Signed distance from a point to a rounded rectangle's edge: positive outside, negative inside.
fn rounded_distance(px: f32, py: f32, x: f32, y: f32, w: f32, h: f32, r: f32) -> f32 {
    let r = r.min(w / 2.0).min(h / 2.0).max(0.0);
    let (cx, cy) = (x + w / 2.0, y + h / 2.0);
    let qx = (px - cx).abs() - (w / 2.0 - r);
    let qy = (py - cy).abs() - (h / 2.0 - r);
    let outside = (qx.max(0.0).powi(2) + qy.max(0.0).powi(2)).sqrt();
    outside + qx.max(qy).min(0.0) - r
}

/// The border's light at a point on the screen: projected onto the diagonal from the frame's top left to its
/// bottom right, the same direction `--rim` lights every other surface from, not straight down from the top.
fn bevel_alpha(px: f32, py: f32, left: f32, top: f32, width: f32, height: f32) -> f32 {
    let (dx, dy) = (width.max(1.0), height.max(1.0));
    let t = (((px - left) * dx + (py - top) * dy) / (dx * dx + dy * dy)).clamp(0.0, 1.0);
    for pair in BEVEL.windows(2) {
        let ((t0, a0), (t1, a1)) = (pair[0], pair[1]);
        if t <= t1 {
            return a0 + (a1 - a0) * ((t - t0) / (t1 - t0)).clamp(0.0, 1.0);
        }
    }
    BEVEL[BEVEL.len() - 1].1
}

fn over(under: [f32; 3], color: [f32; 3], alpha: f32) -> [f32; 3] {
    let a = alpha.clamp(0.0, 1.0);
    [under[0] + (color[0] - under[0]) * a, under[1] + (color[1] - under[1]) * a, under[2] + (color[2] - under[2]) * a]
}

/// Draw one piece: `size` by `size` pixels, premultiplied BGRA rows from the top left, as `UpdateLayeredWindow` takes
/// them. Outside the opening's curve it is the margin (the ground, the glass over it, the border); inside it, nothing,
/// so the app shows; along the curve, in between, by how much of each pixel is outside it.
pub fn render(piece: &Piece, ground: &Ground, look: &Look) -> Vec<u8> {
    let size = piece.size();
    let (ox, oy) = piece.origin();
    let o = &piece.opening;
    let (x, y, w, h, r) = (o.x as f32, o.y as f32, o.width as f32, o.height as f32, piece.radius as f32);
    let b = look.border;
    let mut out = vec![0u8; (size * size * 4) as usize];
    for row in 0..size {
        for col in 0..size {
            // the middle of the pixel, on the screen
            let (px, py) = ((ox + col) as f32 + 0.5, (oy + row) as f32 + 0.5);
            let inner = rounded_distance(px, py, x, y, w, h, r);
            // how much of the pixel is outside the curve: the piece's shape
            let shape = (inner + 0.5).clamp(0.0, 1.0);
            if shape <= 0.0 {
                continue;
            }
            let i = (row * size + col) as usize;
            let mut c = match ground {
                Ground::Wallpaper(rgb) => {
                    let p = rgb.get(i).copied().unwrap_or([0, 0, 0]);
                    [p[0] as f32 / 255.0, p[1] as f32 / 255.0, p[2] as f32 / 255.0]
                }
                Ground::Flat(p) => [p[0] as f32 / 255.0, p[1] as f32 / 255.0, p[2] as f32 / 255.0],
            };
            // the glass over the wallpaper (a flat color was read with the glass already over it)
            if let (Ground::Wallpaper(_), Some(g)) = (ground, look.glass) {
                c = over(c, [g[0], g[1], g[2]], g[3]);
            }
            if b > 0.0 {
                let outer = rounded_distance(px, py, x - b, y - b, w + 2.0 * b, h + 2.0 * b, r + b);
                // the band between the opening's curve and the border's outer one, lit from above
                let band = (0.5 - outer).clamp(0.0, 1.0) * shape;
                c = over(
                    c,
                    [1.0, 1.0, 1.0],
                    band * bevel_alpha(px, py, piece.frame_left as f32, piece.frame_top as f32, piece.frame_width as f32, piece.frame_height as f32),
                );
                // a bright hairline along the outer curve, and a dark one along the opening's (the half of a two pixel
                // line that is outside the curve)
                c = over(c, LIT.0, LIT.1 * (1.0 - outer.abs()).clamp(0.0, 1.0));
                c = over(c, EDGE.0, EDGE.1 * (1.5 - inner.abs()).clamp(0.0, 1.0));
            }
            let a = shape;
            out[i * 4] = (c[2] * a * 255.0).round() as u8;
            out[i * 4 + 1] = (c[1] * a * 255.0).round() as u8;
            out[i * 4 + 2] = (c[0] * a * 255.0).round() as u8;
            out[i * 4 + 3] = (a * 255.0).round() as u8;
        }
    }
    out
}

/// The color a page gives for the glass (`rgba(r, g, b, a)` or `rgb(r, g, b)`), as straight RGBA from 0 to 1.
pub fn parse_css_color(s: &str) -> Option<[f32; 4]> {
    let inner = s.trim().strip_prefix("rgba(").or_else(|| s.trim().strip_prefix("rgb("))?.strip_suffix(')')?;
    let parts: Vec<f32> = inner.split(',').map(|p| p.trim().parse::<f32>()).collect::<Result<_, _>>().ok()?;
    match parts.as_slice() {
        [r, g, b] => Some([r / 255.0, g / 255.0, b / 255.0, 1.0]),
        [r, g, b, a] => Some([r / 255.0, g / 255.0, b / 255.0, a.clamp(0.0, 1.0)]),
        _ => None,
    }
}

// ---- the windows ----

/// A piece's window, and what it was last given, so that the same is never drawn twice. (Whether it is showing is asked
/// of Windows each time, never remembered here, so the two cannot disagree.)
struct Shown {
    hwnd: HWND,
    drawn: Option<(Piece, Ground, Look)>,
}

thread_local! {
    /// By monitor: its four pieces' windows. Made, used and destroyed on the main thread.
    static PIECES: RefCell<HashMap<String, [Shown; 4]>> = RefCell::new(HashMap::new());
}

unsafe extern "system" fn piece_proc(h: HWND, m: u32, w: WPARAM, l: LPARAM) -> LRESULT {
    unsafe { DefWindowProcW(h, m, w, l) }
}

fn make_window() -> Option<HWND> {
    unsafe {
        let instance = GetModuleHandleW(None).ok()?;
        // registering again fails harmlessly once the class is there
        RegisterClassW(&WNDCLASSW { lpfnWndProc: Some(piece_proc), hInstance: instance.into(), lpszClassName: w!("AeroDockCorner"), ..Default::default() });
        // layered (drawn from a bitmap, with per-pixel alpha), clicked through, on top, not in Alt-Tab, never active
        let ex = WS_EX_LAYERED | WS_EX_TRANSPARENT | WS_EX_TOPMOST | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE;
        CreateWindowExW(WINDOW_EX_STYLE(ex.0), w!("AeroDockCorner"), w!(""), WS_POPUP, 0, 0, 1, 1, None, None, Some(instance.into()), None).ok()
    }
}

/// Put a drawn bitmap into a layered window, at a place on the screen.
fn paint(hwnd: HWND, x: i32, y: i32, size: i32, bgra: &[u8]) -> bool {
    unsafe {
        let screen = GetDC(None);
        let dc = CreateCompatibleDC(Some(screen));
        let info = BITMAPINFO {
            bmiHeader: BITMAPINFOHEADER {
                biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
                biWidth: size,
                biHeight: -size,
                biPlanes: 1,
                biBitCount: 32,
                biCompression: BI_RGB.0,
                ..Default::default()
            },
            ..Default::default()
        };
        let mut bits: *mut core::ffi::c_void = std::ptr::null_mut();
        let mut done = false;
        if let Ok(bitmap) = CreateDIBSection(Some(dc), &info, DIB_RGB_COLORS, &mut bits, None, 0) {
            if !bits.is_null() {
                std::ptr::copy_nonoverlapping(bgra.as_ptr(), bits as *mut u8, bgra.len().min((size * size * 4) as usize));
                let old = SelectObject(dc, bitmap.into());
                let blend = BLENDFUNCTION { BlendOp: AC_SRC_OVER as u8, BlendFlags: 0, SourceConstantAlpha: 255, AlphaFormat: AC_SRC_ALPHA as u8 };
                done = UpdateLayeredWindow(
                    hwnd,
                    Some(screen),
                    Some(&POINT { x, y }),
                    Some(&SIZE { cx: size, cy: size }),
                    Some(dc),
                    Some(&POINT { x: 0, y: 0 }),
                    COLORREF(0),
                    Some(&blend),
                    ULW_ALPHA,
                )
                .is_ok();
                SelectObject(dc, old);
            }
            let _ = DeleteObject(bitmap.into());
        }
        let _ = DeleteDC(dc);
        ReleaseDC(None, screen);
        done
    }
}

/// Show a monitor's pieces: each corner in `mask` (bits 1, 2, 4, 8 for top left, top right, bottom right, bottom
/// left) is drawn over what is under it (`grounds`, one each) and shown on top; the others are hidden. Main thread
/// only. A piece already showing the same is left alone: this runs at every change of the corners held, on every
/// monitor, so a call that changes nothing does nothing.
pub fn show(monitor: &str, pieces: [Piece; 4], grounds: &[Ground; 4], look: &Look, mask: u8) {
    PIECES.with(|cell| {
        let mut all = cell.borrow_mut();
        if !all.contains_key(monitor) {
            let made: Vec<HWND> = (0..4).filter_map(|_| make_window()).collect();
            if made.len() < 4 {
                log::warn!("could not make the frame's corner pieces");
                for hwnd in made {
                    unsafe {
                        let _ = DestroyWindow(hwnd);
                    }
                }
                return;
            }
            let made = [0, 1, 2, 3].map(|k| Shown { hwnd: made[k], drawn: None });
            all.insert(monitor.to_string(), made);
        }
        let shown = all.get_mut(monitor).expect("just made");
        for (k, s) in shown.iter_mut().enumerate() {
            let showing = unsafe { IsWindowVisible(s.hwnd).as_bool() };
            if mask & (1 << k) == 0 {
                if showing {
                    unsafe {
                        let _ = ShowWindow(s.hwnd, SW_HIDE);
                    }
                }
                continue;
            }
            let wanted = (pieces[k], grounds[k].clone(), *look);
            if s.drawn.as_ref() != Some(&wanted) {
                let (x, y) = pieces[k].origin();
                let bgra = render(&pieces[k], &grounds[k], look);
                if paint(s.hwnd, x, y, pieces[k].size(), &bgra) {
                    s.drawn = Some(wanted);
                }
            }
            // shown on top as it comes in; one already showing is left where it is
            if !showing {
                unsafe {
                    let _ = SetWindowPos(s.hwnd, Some(HWND_TOPMOST), 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE | SWP_SHOWWINDOW);
                }
            }
        }
    });
}

/// Hide a monitor's pieces (nothing on it is to be covered). Main thread only.
pub fn hide(monitor: &str) {
    PIECES.with(|cell| {
        if let Some(shown) = cell.borrow().get(monitor) {
            for s in shown.iter().filter(|s| unsafe { IsWindowVisible(s.hwnd).as_bool() }) {
                unsafe {
                    let _ = ShowWindow(s.hwnd, SW_HIDE);
                }
            }
        }
    });
}

/// Destroy the pieces of every monitor not in `keep` (all of them, given nothing). Main thread only.
pub fn forget_except(keep: &[String]) {
    PIECES.with(|cell| {
        cell.borrow_mut().retain(|name, shown| {
            let kept = keep.contains(name);
            if !kept {
                for s in shown.iter() {
                    unsafe {
                        let _ = DestroyWindow(s.hwnd);
                    }
                }
            }
            kept
        })
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The primary monitor's opening on the owner's machine, with its 10px corners.
    fn piece(corner: usize) -> Piece {
        Piece {
            corner,
            opening: Rect { x: 10, y: 44, width: 1900, height: 1026 },
            radius: 10,
            frame_left: 0,
            frame_top: 34,
            frame_width: 1920,
            frame_height: 1046,
        }
    }
    const DARK: Ground = Ground::Flat([20, 24, 40]);
    const PLAIN: Look = Look { glass: Some([0.2, 0.3, 0.5, 0.25]), border: 0.0 };

    /// The pixel at a screen point in a drawn piece: (premultiplied b, g, r, alpha).
    fn at(p: &Piece, bgra: &[u8], sx: i32, sy: i32) -> [u8; 4] {
        let (ox, oy) = p.origin();
        let i = (((sy - oy) * p.size() + (sx - ox)) * 4) as usize;
        [bgra[i], bgra[i + 1], bgra[i + 2], bgra[i + 3]]
    }

    #[test]
    fn each_piece_sits_in_its_own_corner_of_the_opening() {
        assert_eq!(piece(0).size(), 14);
        assert_eq!(piece(0).origin(), (10, 44));
        assert_eq!(piece(1).origin(), (1910 - 14, 44));
        assert_eq!(piece(2).origin(), (1910 - 14, 1070 - 14));
        assert_eq!(piece(3).origin(), (10, 1070 - 14));
    }

    #[test]
    fn the_corner_is_covered_and_inside_the_curve_is_left_to_the_app() {
        for k in 0..4 {
            let p = piece(k);
            let img = render(&p, &DARK, &PLAIN);
            let (left, top, right, bottom) = (10, 44, 1909, 1069);
            let (cx, cy) = [(left, top), (right, top), (right, bottom), (left, bottom)][k];
            let (sx, sy) = [(1, 1), (-1, 1), (-1, -1), (1, -1)][k];
            // the square corner itself, and the pixels beside it, are the margin's, fully
            assert_eq!(at(&p, &img, cx, cy)[3], 255, "corner {k}: its very corner");
            assert_eq!(at(&p, &img, cx + sx, cy + sy)[3], 255, "corner {k}: one in");
            // well inside the curve (six pixels in on both axes, four from the curve's centre), nothing
            assert_eq!(at(&p, &img, cx + 6 * sx, cy + 6 * sy)[3], 0, "corner {k}: inside the curve");
            // along the straight edges past the curve, nothing: the app's own edge is not covered
            assert_eq!(at(&p, &img, cx + 12 * sx, cy)[3], 0, "corner {k}: the top or bottom edge");
            assert_eq!(at(&p, &img, cx, cy + 12 * sy)[3], 0, "corner {k}: the side edge");
        }
    }

    #[test]
    fn the_curve_is_anti_aliased() {
        let p = piece(0);
        let img = render(&p, &DARK, &PLAIN);
        // all along the curve the pixels it passes through are partly covered: neither all nor nothing
        let partial = img.chunks(4).filter(|px| px[3] > 0 && px[3] < 255).count();
        assert!(partial >= 8, "a soft edge along the curve ({partial} pixels)");
    }

    #[test]
    fn the_glass_is_laid_over_the_wallpaper_and_a_flat_color_is_left_as_it_is() {
        let p = piece(0);
        let white = Ground::Wallpaper(vec![[255, 255, 255]; 14 * 14]);
        let img = render(&p, &white, &Look { glass: Some([0.0, 0.0, 0.0, 0.5]), border: 0.0 });
        // white wallpaper through half-black glass: mid grey
        let c = at(&p, &img, 10, 44);
        assert!((c[0] as i32 - 128).abs() <= 1 && c[3] == 255, "{c:?}");
        // a flat color already has the glass in it
        let flat = render(&p, &Ground::Flat([200, 100, 50]), &Look { glass: Some([0.0, 0.0, 0.0, 0.5]), border: 0.0 });
        assert_eq!(at(&p, &flat, 10, 44), [50, 100, 200, 255]);
    }

    #[test]
    fn the_glass_border_lightens_the_band_along_the_curve() {
        let p = piece(0);
        let plain = render(&p, &DARK, &PLAIN);
        let bordered = render(&p, &DARK, &Look { border: 3.0, ..PLAIN });
        // just outside the curve, on the diagonal (the curve crosses it about three pixels in), the band is lighter
        let on_band = (0..6).any(|d| at(&p, &bordered, 10 + d, 44 + d)[2] > at(&p, &plain, 10 + d, 44 + d)[2] + 8);
        assert!(on_band, "the border shows in the corner");
        // and nothing is drawn inside the curve either way
        assert_eq!(at(&p, &bordered, 16, 50)[3], 0);
    }

    #[test]
    fn a_page_color_is_read() {
        assert_eq!(parse_css_color("rgba(255, 0, 51, 0.5)"), Some([1.0, 0.0, 0.2, 0.5]));
        assert_eq!(parse_css_color("rgb(0, 0, 0)"), Some([0.0, 0.0, 0.0, 1.0]));
        assert_eq!(parse_css_color("none"), None);
    }

    #[test]
    fn square_corners_draw_nothing_but_the_square_itself() {
        // with no radius there is nothing outside the curve: the piece is empty
        let p = Piece { radius: 0, ..piece(0) };
        assert!(render(&p, &DARK, &PLAIN).chunks(4).all(|px| px[3] == 0));
    }
}
