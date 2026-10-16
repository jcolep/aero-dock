//! Pictures of the screen, for the frame's corner pieces.
//!
//! A piece has to look like the margin beside it: the margin's glass over whatever the wallpaper is at that spot.
//! Two pictures give that. The desktop's own, as the shell draws it (the wallpaper with no window over it), is what
//! the piece shows; and the screen as it is drawn, round the opening, says whether that picture lines up with what is
//! seen in the margin (the shell can lay a wallpaper out differently on another monitor), and what color the margin
//! is, for a corner where it does not.
//!
//! Each is one copy into memory, then read pixel by pixel there. (Reading the screen a pixel at a time, `GetPixel`,
//! waits on the compositor at every call: a look at the four corners that way took four seconds.)

use windows::core::w;
use windows::Win32::Foundation::RECT;
use windows::Win32::Graphics::Gdi::{
    BitBlt, CreateCompatibleDC, CreateDIBSection, DeleteDC, DeleteObject, GetDC, ReleaseDC, SelectObject, BITMAPINFO,
    BITMAPINFOHEADER, BI_RGB, CAPTUREBLT, DIB_RGB_COLORS, HDC, SRCCOPY,
};
use windows::Win32::Storage::Xps::{PrintWindow, PRINT_WINDOW_FLAGS};
use windows::Win32::UI::WindowsAndMessaging::{FindWindowW, GetWindowRect};

use super::monitors::Rect;

/// A picture of part of the screen, in screen coordinates.
pub struct Picture {
    left: i32,
    top: i32,
    width: i32,
    height: i32,
    /// Top-down, four bytes a pixel: blue, green, red, unused.
    bgra: Vec<u8>,
}

/// Draw into a bitmap of the given size with `draw` (given a memory device context and the screen's), and keep it.
fn picture(left: i32, top: i32, width: i32, height: i32, draw: impl FnOnce(HDC, HDC) -> bool) -> Option<Picture> {
    if width <= 0 || height <= 0 {
        return None;
    }
    unsafe {
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
        let result = match CreateDIBSection(Some(dc), &info, DIB_RGB_COLORS, &mut bits, None, 0) {
            Ok(bitmap) if !bits.is_null() => {
                let old = SelectObject(dc, bitmap.into());
                let drawn = draw(dc, screen);
                let len = (width * height * 4) as usize;
                let copy = drawn.then(|| std::slice::from_raw_parts(bits as *const u8, len).to_vec());
                SelectObject(dc, old);
                let _ = DeleteObject(bitmap.into());
                copy.map(|bgra| Picture { left, top, width, height, bgra })
            }
            _ => None,
        };
        let _ = DeleteDC(dc);
        ReleaseDC(None, screen);
        result
    }
}

impl Picture {
    /// The desktop's own picture: the wallpaper, as the shell draws it, without any window (or icon) over it. The
    /// shell is asked to draw its desktop window into a bitmap: tens of milliseconds, done when the wallpaper or the
    /// frame has changed.
    pub fn desktop() -> Option<Picture> {
        unsafe {
            let shell = FindWindowW(w!("Progman"), None).ok()?;
            let mut r = RECT::default();
            GetWindowRect(shell, &mut r).ok()?;
            // PW_RENDERFULLCONTENT: what the compositor has for it, which is the wallpaper
            picture(r.left, r.top, r.right - r.left, r.bottom - r.top, |dc, _| PrintWindow(shell, dc, PRINT_WINDOW_FLAGS(2)).as_bool())
        }
    }

    /// A part of the screen as it is drawn now, every window and the frame's glass included: one copy, a few
    /// milliseconds even for a whole monitor.
    pub fn screen(area: &Rect) -> Option<Picture> {
        picture(area.x, area.y, area.width, area.height, |dc, screen| unsafe {
            BitBlt(dc, 0, 0, area.width, area.height, Some(screen), area.x, area.y, SRCCOPY | CAPTUREBLT).is_ok()
        })
    }

    /// The color at a screen point, if the picture has it.
    pub fn rgb(&self, x: i32, y: i32) -> Option<[u8; 3]> {
        let (px, py) = (x - self.left, y - self.top);
        if px < 0 || py < 0 || px >= self.width || py >= self.height {
            return None;
        }
        let i = ((py * self.width + px) * 4) as usize;
        Some([self.bgra[i + 2], self.bgra[i + 1], self.bgra[i]])
    }

    /// A rectangle of it from a screen point, as RGB rows; `None` if any of it is outside.
    pub fn pixels(&self, x: i32, y: i32, w: i32, h: i32) -> Option<Vec<[u8; 3]>> {
        let mut out = Vec::with_capacity((w * h) as usize);
        for yy in y..y + h {
            for xx in x..x + w {
                out.push(self.rgb(xx, yy)?);
            }
        }
        Some(out)
    }

    /// How light the picture is in each cell of a `cols` × `rows` grid laid over all of it, row by row, 0 (black) to 1
    /// (white), as lightness is seen (CIE L*, not the raw values). Each cell's figure leans toward its lightest part:
    /// the mean and the lightest tenth, half and half, since a bright window edge under one corner of a cell is what
    /// makes light text over it hard to read, however dark the rest. Read from a sparse grid of points (a few hundred a
    /// cell), which a frosted surface blurs into much the same as all of them.
    pub fn light_grid(&self, cols: usize, rows: usize) -> Vec<f32> {
        let lightness = |c: [u8; 3]| -> f32 {
            let lin = |v: u8| {
                let v = v as f32 / 255.0;
                if v <= 0.04045 { v / 12.92 } else { ((v + 0.055) / 1.055).powf(2.4) }
            };
            let y = 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
            let l = if y > 216.0 / 24389.0 { 116.0 * y.cbrt() - 16.0 } else { y * 24389.0 / 27.0 };
            (l / 100.0).clamp(0.0, 1.0)
        };
        let mut out = Vec::with_capacity(cols * rows);
        for row in 0..rows {
            for col in 0..cols {
                let (x0, x1) = (self.width * col as i32 / cols as i32, self.width * (col as i32 + 1) / cols as i32);
                let (y0, y1) = (self.height * row as i32 / rows as i32, self.height * (row as i32 + 1) / rows as i32);
                let step = (((x1 - x0) * (y1 - y0)) as f32 / 400.0).sqrt().max(1.0) as i32;
                let mut seen = Vec::new();
                let mut y = y0 + step / 2;
                while y < y1 {
                    let mut x = x0 + step / 2;
                    while x < x1 {
                        if let Some(c) = self.rgb(self.left + x, self.top + y) {
                            seen.push(lightness(c));
                        }
                        x += step;
                    }
                    y += step;
                }
                if seen.is_empty() {
                    out.push(0.0);
                    continue;
                }
                let mean = seen.iter().sum::<f32>() / seen.len() as f32;
                seen.sort_by(|a, b| a.total_cmp(b));
                let top = &seen[seen.len() * 9 / 10..];
                let lightest = top.iter().sum::<f32>() / top.len().max(1) as f32;
                out.push(0.5 * mean + 0.5 * lightest);
            }
        }
        out
    }

    /// The mean color at these screen points, leaving out any the picture does not have; `None` if it has none.
    pub fn mean(&self, points: &[(i32, i32)]) -> Option<[u8; 3]> {
        let (mut r, mut g, mut b, mut n) = (0u32, 0u32, 0u32, 0u32);
        for c in points.iter().filter_map(|&(x, y)| self.rgb(x, y)) {
            r += c[0] as u32;
            g += c[1] as u32;
            b += c[2] as u32;
            n += 1;
        }
        (n > 0).then(|| [(r / n) as u8, (g / n) as u8, (b / n) as u8])
    }
}

/// Means, variances and covariance of two runs.
fn moments(a: &[f64], b: &[f64]) -> (f64, f64, f64, f64, f64) {
    let n = a.len().max(1) as f64;
    let (ma, mb) = (a.iter().sum::<f64>() / n, b.iter().sum::<f64>() / n);
    let (mut cov, mut va, mut vb) = (0.0, 0.0, 0.0);
    for (x, y) in a.iter().zip(b) {
        cov += (x - ma) * (y - mb);
        va += (x - ma) * (x - ma);
        vb += (y - mb) * (y - mb);
    }
    (ma, mb, va / n, vb / n, cov / n)
}

/// Whether two runs of colors are the same picture (one may be seen through a tint: a uniform change of brightness
/// and color), judged by how their lightness rises and falls together. Two flat runs are the same; a flat run and a
/// varied one are not.
///
/// A few points may disagree and it still is: the run seen on the screen goes through the margin, where the ambient
/// scene's motes drift, and against a dark wallpaper one bright mote was enough to undo the whole of it (measured: the
/// secondary monitor's corners fell back to a flat color at every look). So the points that fit the tint worst, a
/// fifth of them, are set aside before judging; a picture that is not the same fits badly everywhere.
pub fn lines_up(seen: &[[u8; 3]], drawn: &[[u8; 3]]) -> bool {
    let luma = |c: &[u8; 3]| 0.299 * c[0] as f64 + 0.587 * c[1] as f64 + 0.114 * c[2] as f64;
    let mut a: Vec<f64> = seen.iter().map(luma).collect();
    let mut b: Vec<f64> = drawn.iter().map(luma).collect();
    if a.len() != b.len() || a.len() < 5 {
        return false;
    }
    // how the seen lightness follows the drawn (the tint), fitted to all of them, then without the worst fifth
    let (ma, mb, _, vb, cov) = moments(&a, &b);
    let slope = if vb > 1e-9 { cov / vb } else { 0.0 };
    let mut order: Vec<usize> = (0..a.len()).collect();
    order.sort_by(|&i, &j| {
        let r = |k: usize| (a[k] - (ma + slope * (b[k] - mb))).abs();
        r(i).total_cmp(&r(j))
    });
    order.truncate(a.len() - a.len() / 5);
    a = order.iter().map(|&i| a[i]).collect();
    b = order.iter().map(|&i| b[i]).collect();
    let (ma, mb, va, vb, cov) = moments(&a, &b);
    // nearly flat: within a couple of levels either way
    let (flat_a, flat_b) = (va < 6.0, vb < 6.0);
    if flat_a || flat_b {
        return flat_a && flat_b && (ma - mb).abs() < 60.0;
    }
    cov / (va.sqrt() * vb.sqrt()) > 0.7
}

#[cfg(test)]
mod tests {
    use super::*;

    /// A picture `w` × `h` colored by `color(x, y)`.
    fn painted(w: i32, h: i32, color: impl Fn(i32, i32) -> [u8; 3]) -> Picture {
        let mut bgra = Vec::with_capacity((w * h * 4) as usize);
        for y in 0..h {
            for x in 0..w {
                let [r, g, b] = color(x, y);
                bgra.extend_from_slice(&[b, g, r, 255]);
            }
        }
        Picture { left: 100, top: 50, width: w, height: h, bgra }
    }

    #[test]
    fn the_light_grid_says_where_it_is_light() {
        // white on the right half, black on the left
        let p = painted(400, 300, |x, _| if x >= 200 { [255, 255, 255] } else { [0, 0, 0] });
        let g = p.light_grid(2, 2);
        assert_eq!(g.len(), 4);
        assert!(g[0] < 0.01 && g[2] < 0.01, "dark cells: {g:?}");
        assert!(g[1] > 0.99 && g[3] > 0.99, "light cells: {g:?}");
        // mid grey reads as about half (L* of sRGB 119 is 50)
        let grey = painted(100, 100, |_, _| [119, 119, 119]).light_grid(1, 1)[0];
        assert!((grey - 0.5).abs() < 0.02, "grey: {grey}");
    }

    #[test]
    fn a_cell_leans_toward_its_lightest_part() {
        // a dark cell with a bright stripe down a fifth of it: well above its mean, which is what light text minds
        let p = painted(200, 200, |x, _| if x < 40 { [255, 255, 255] } else { [20, 20, 20] });
        let g = p.light_grid(1, 1)[0];
        assert!(g > 0.55 && g < 0.8, "a bright edge counts for more than its share: {g}");
    }

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
    fn a_few_motes_drifting_through_the_margin_do_not_undo_it() {
        // a dark starry wallpaper, flat but for a star or two, seen through glass
        let mut drawn = vec![[20u8, 22, 38]; 48];
        drawn[10] = [180, 180, 200];
        drawn[30] = [150, 150, 170];
        let mut seen: Vec<[u8; 3]> = drawn.iter().map(|c| [c[0] / 2 + 12, c[1] / 2 + 12, c[2] / 2 + 20]).collect();
        // and three motes of the ambient scene, bright, where the wallpaper is dark
        for i in [5, 22, 41] {
            seen[i] = [230, 230, 240];
        }
        assert!(lines_up(&seen, &drawn), "the same picture, motes and all");
        // the picture in the wrong place (shifted along the margin) is still not
        let shifted: Vec<[u8; 3]> = (0..48).map(|i| seen[(i + 17) % 48]).collect();
        assert!(!lines_up(&shifted, &drawn));
        // nor is a varied run against another varied run
        let ramp: Vec<[u8; 3]> = (0..48).map(|i| [(i * 5) as u8, (i * 5) as u8, (i * 5) as u8]).collect();
        let other: Vec<[u8; 3]> = (0..48).map(|i| [((i * 37) % 240) as u8; 3]).collect();
        assert!(!lines_up(&other, &ramp));
    }

    #[test]
    fn the_desktop_picture_can_be_had() {
        // whatever the wallpaper is, the shell draws it, as big as the desktop
        let d = Picture::desktop().expect("the desktop draws itself");
        assert!(d.width > 0 && d.height > 0 && d.bgra.len() == (d.width * d.height * 4) as usize);
        assert!(d.rgb(d.left, d.top).is_some() && d.pixels(d.left, d.top, 4, 4).is_some_and(|p| p.len() == 16));
    }

    #[test]
    fn a_picture_has_only_what_it_was_taken_of() {
        let p = Picture { left: 10, top: 20, width: 2, height: 1, bgra: vec![3, 2, 1, 0, 30, 20, 10, 0] };
        assert_eq!(p.rgb(10, 20), Some([1, 2, 3]));
        assert_eq!(p.rgb(11, 20), Some([10, 20, 30]));
        assert_eq!(p.rgb(12, 20), None);
        assert_eq!(p.mean(&[(10, 20), (11, 20), (500, 500)]), Some([5, 11, 16]));
        assert_eq!(p.mean(&[(-90_000, -90_000)]), None);
        assert_eq!(p.pixels(10, 20, 3, 1), None, "a rectangle partly outside it");
    }

    /// Needs a desktop to read: not there while the screen is locked.
    #[test]
    #[ignore]
    fn the_screen_can_be_copied_quickly() {
        let area = Rect { x: 0, y: 0, width: 1920, height: 1080 };
        let t = std::time::Instant::now();
        let shot = Picture::screen(&area).expect("a picture of the screen");
        println!("a copy of {}x{} in {:?}", area.width, area.height, t.elapsed());
        assert!(shot.rgb(5, 5).is_some());
    }
}
