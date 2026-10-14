//! Reading colours off the screen as it is drawn.
//!
//! The frame's fringe has to match what the margin looks like beside a corner, which is the margin's glass over
//! whatever the wallpaper is at that spot. That cannot be worked out (a wallpaper is a picture, and a slideshow
//! changes it), but it can be looked at: a few pixels in the margin, which nothing but the glass and the wallpaper
//! are in. The desktop's own device context gives the composed picture.

use windows::core::w;
use windows::Win32::Foundation::RECT;
use windows::Win32::Graphics::Gdi::{
    CreateCompatibleDC, CreateDIBSection, DeleteDC, DeleteObject, GetDC, GetPixel, ReleaseDC, SelectObject, BITMAPINFO,
    BITMAPINFOHEADER, BI_RGB, CLR_INVALID, DIB_RGB_COLORS,
};
use windows::Win32::Storage::Xps::{PrintWindow, PRINT_WINDOW_FLAGS};
use windows::Win32::UI::WindowsAndMessaging::{FindWindowW, GetWindowRect};

/// The mean colour of the pixels at these screen points, as `[r, g, b]`. Points that cannot be read are left out;
/// none at all gives `None`.
pub fn mean_colour(points: &[(i32, i32)]) -> Option<[u8; 3]> {
    let dc = unsafe { GetDC(None) };
    if dc.is_invalid() {
        return None;
    }
    let (mut r, mut g, mut b, mut n) = (0u32, 0u32, 0u32, 0u32);
    for &(x, y) in points {
        let c = unsafe { GetPixel(dc, x, y) };
        if c.0 == CLR_INVALID {
            continue;
        }
        r += c.0 & 0xff;
        g += (c.0 >> 8) & 0xff;
        b += (c.0 >> 16) & 0xff;
        n += 1;
    }
    unsafe {
        ReleaseDC(None, dc);
    }
    (n > 0).then(|| [(r / n) as u8, (g / n) as u8, (b / n) as u8])
}

/// The colour of each of these screen points, or `None` for one that cannot be read.
pub fn colours_at(points: &[(i32, i32)]) -> Vec<Option<[u8; 3]>> {
    let dc = unsafe { GetDC(None) };
    if dc.is_invalid() {
        return vec![None; points.len()];
    }
    let out = points
        .iter()
        .map(|&(x, y)| {
            let c = unsafe { GetPixel(dc, x, y) };
            (c.0 != CLR_INVALID).then_some([(c.0 & 0xff) as u8, ((c.0 >> 8) & 0xff) as u8, ((c.0 >> 16) & 0xff) as u8])
        })
        .collect();
    unsafe {
        ReleaseDC(None, dc);
    }
    out
}

/// The desktop's own picture: the wallpaper, as the shell draws it, without any window over it. The shell is asked
/// to draw its desktop window into a bitmap, which is a matter of tens of milliseconds and is only done when the
/// wallpaper has changed.
pub struct Desktop {
    left: i32,
    top: i32,
    width: i32,
    height: i32,
    /// Top-down, four bytes a pixel: blue, green, red, unused.
    bgra: Vec<u8>,
}

impl Desktop {
    pub fn capture() -> Option<Desktop> {
        unsafe {
            let shell = FindWindowW(w!("Progman"), None).ok()?;
            let mut r = RECT::default();
            GetWindowRect(shell, &mut r).ok()?;
            let (width, height) = (r.right - r.left, r.bottom - r.top);
            if width <= 0 || height <= 0 {
                return None;
            }
            let screen = GetDC(None);
            let dc = CreateCompatibleDC(Some(screen));
            let info = BITMAPINFO {
                bmiHeader: BITMAPINFOHEADER {
                    biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
                    biWidth: width,
                    // negative: top-down rows
                    biHeight: -height,
                    biPlanes: 1,
                    biBitCount: 32,
                    biCompression: BI_RGB.0,
                    ..Default::default()
                },
                ..Default::default()
            };
            let mut bits: *mut core::ffi::c_void = std::ptr::null_mut();
            let bitmap = CreateDIBSection(Some(dc), &info, DIB_RGB_COLORS, &mut bits, None, 0);
            let result = match bitmap {
                Ok(bitmap) if !bits.is_null() => {
                    let old = SelectObject(dc, bitmap.into());
                    // PW_RENDERFULLCONTENT: what the compositor has for it, which is the wallpaper
                    let drawn = PrintWindow(shell, dc, PRINT_WINDOW_FLAGS(2)).as_bool();
                    let len = (width * height * 4) as usize;
                    let copy = drawn.then(|| std::slice::from_raw_parts(bits as *const u8, len).to_vec());
                    SelectObject(dc, old);
                    let _ = DeleteObject(bitmap.into());
                    copy.map(|bgra| Desktop { left: r.left, top: r.top, width, height, bgra })
                }
                _ => None,
            };
            let _ = DeleteDC(dc);
            ReleaseDC(None, screen);
            result
        }
    }

    /// The wallpaper's colour at a screen point.
    pub fn rgb(&self, x: i32, y: i32) -> Option<[u8; 3]> {
        let (px, py) = (x - self.left, y - self.top);
        if px < 0 || py < 0 || px >= self.width || py >= self.height {
            return None;
        }
        let i = ((py * self.width + px) * 4) as usize;
        Some([self.bgra[i + 2], self.bgra[i + 1], self.bgra[i]])
    }

    /// A square of it, as RGBA rows, from a screen point; `None` if any of it is outside.
    pub fn patch(&self, x: i32, y: i32, w: i32, h: i32) -> Option<Vec<u8>> {
        let mut out = Vec::with_capacity((w * h * 4) as usize);
        for yy in y..y + h {
            for xx in x..x + w {
                let [r, g, b] = self.rgb(xx, yy)?;
                out.extend_from_slice(&[r, g, b, 255]);
            }
        }
        Some(out)
    }
}

/// Whether two runs of colours are the same picture (one may be seen through a tint: a uniform change of brightness
/// and colour), judged by how their lightness rises and falls together. Two flat runs are the same; a flat run and a
/// varied one are not.
pub fn lines_up(seen: &[[u8; 3]], drawn: &[[u8; 3]]) -> bool {
    let luma = |c: &[u8; 3]| 0.299 * c[0] as f64 + 0.587 * c[1] as f64 + 0.114 * c[2] as f64;
    let a: Vec<f64> = seen.iter().map(luma).collect();
    let b: Vec<f64> = drawn.iter().map(luma).collect();
    if a.len() != b.len() || a.len() < 4 {
        return false;
    }
    let mean = |v: &[f64]| v.iter().sum::<f64>() / v.len() as f64;
    let (ma, mb) = (mean(&a), mean(&b));
    let (mut cov, mut va, mut vb) = (0.0, 0.0, 0.0);
    for (x, y) in a.iter().zip(&b) {
        cov += (x - ma) * (y - mb);
        va += (x - ma) * (x - ma);
        vb += (y - mb) * (y - mb);
    }
    let n = a.len() as f64;
    // nearly flat: within a couple of levels either way
    let (flat_a, flat_b) = (va / n < 6.0, vb / n < 6.0);
    if flat_a || flat_b {
        return flat_a && flat_b && (ma - mb).abs() < 60.0;
    }
    cov / (va.sqrt() * vb.sqrt()) > 0.7
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_same_picture_lines_up_even_through_a_tint_and_another_does_not() {
        let picture: Vec<[u8; 3]> = (0..20).map(|i| [(i * 12) as u8, (200 - i * 5) as u8, (i * 7) as u8]).collect();
        // seen through glass: darker and bluer, the same ups and downs
        let tinted: Vec<[u8; 3]> = picture.iter().map(|c| [c[0] / 2 + 10, c[1] / 2 + 10, c[2] / 2 + 60]).collect();
        assert!(lines_up(&tinted, &picture));
        // the picture somewhere else: reversed
        let elsewhere: Vec<[u8; 3]> = picture.iter().rev().copied().collect();
        assert!(!lines_up(&elsewhere, &picture));
        // flat and flat, flat and not
        let flat = vec![[120u8, 110, 100]; 20];
        assert!(lines_up(&flat, &[[118u8, 112, 99]; 20]));
        assert!(!lines_up(&flat, &picture));
    }

    #[test]
    fn the_desktop_picture_can_be_had() {
        // whatever the wallpaper is, the shell draws it, as big as the desktop
        let d = Desktop::capture().expect("the desktop draws itself");
        assert!(d.width > 0 && d.height > 0 && d.bgra.len() == (d.width * d.height * 4) as usize);
        assert!(d.rgb(d.left, d.top).is_some() && d.patch(d.left, d.top, 4, 4).is_some_and(|p| p.len() == 64));
    }

    #[test]
    fn a_point_off_every_screen_has_no_colour() {
        assert_eq!(mean_colour(&[(-90_000, -90_000)]), None);
        assert_eq!(mean_colour(&[]), None);
    }

    /// Needs a desktop to read: not there while the screen is locked.
    #[test]
    #[ignore]
    fn a_point_on_the_screen_has_one() {
        // whatever is at the origin, it is a colour
        assert!(mean_colour(&[(0, 0), (1, 1), (2, 2)]).is_some());
    }

    /// A look at the live screen: does the desktop picture line up with what is seen in the margin beside each corner
    /// of the primary monitor's opening (10, 44, 1900 by 1026 on this machine)?
    #[test]
    #[ignore]
    fn live_corners_line_up() {
        let d = Desktop::capture().expect("desktop");
        let (x, y, w, h, d_out) = (10, 44, 1900, 1026, 5);
        let (right, bottom) = (x + w - 1, y + h - 1);
        for (name, cx, cy, sx, sy) in [("tl", x, y, 1, 1), ("tr", right, y, -1, 1), ("br", right, bottom, -1, -1), ("bl", x, bottom, 1, -1)] {
            let mut pts = Vec::new();
            for a in (12..60).step_by(2) {
                pts.push((cx + sx * a, cy - sy * d_out));
                pts.push((cx - sx * d_out, cy + sy * a));
            }
            let seen: Vec<[u8; 3]> = colours_at(&pts).into_iter().flatten().collect();
            let drawn: Vec<[u8; 3]> = pts.iter().filter_map(|&(px, py)| d.rgb(px, py)).collect();
            println!("{name}: {} points, lines up: {}", seen.len(), lines_up(&seen, &drawn));
        }
    }
}