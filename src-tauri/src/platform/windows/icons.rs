//! High-resolution icon extraction. `IShellItemImageFactory::GetImage`
//! yields the same 256px assets Explorer uses; we convert the returned
//! HBITMAP to RGBA and store PNGs in an on-disk cache, keyed by target
//! path hash. The WebView loads them over the asset protocol, so each
//! icon crosses IPC exactly zero times.

use std::path::{Path, PathBuf};

use windows::core::PCWSTR;
use windows::Win32::Foundation::SIZE;
use windows::Win32::Graphics::Gdi::{
    DeleteObject, GetDC, GetDIBits, GetObjectW, ReleaseDC, BITMAP, BITMAPINFO, BITMAPINFOHEADER,
    BI_RGB, DIB_RGB_COLORS, HBITMAP, HGDIOBJ,
};
use windows::Win32::UI::Shell::{
    IShellItemImageFactory, SHCreateItemFromParsingName, SIIGBF_BIGGERSIZEOK, SIIGBF_ICONONLY,
};

use super::util::{path_key, to_wide};
use crate::core::{AeroError, AeroResult};
use crate::platform::ComApartment;

const ICON_SIZE: i32 = 256;

/// Bump when the pixels a given path produces change, so upgrades do not
/// keep serving icons rendered by the previous rules. v2 added the
/// normalisation pass in `normalize_icon`.
const CACHE_VERSION: u32 = 2;

/// Return the cached PNG path for `target`, extracting it on first use.
/// Call from `spawn_blocking`.
pub fn ensure_icon(target: &str, cache_dir: &Path) -> AeroResult<PathBuf> {
    let key = path_key(target);
    let png_path = cache_dir.join(format!("{key}-v{CACHE_VERSION}.png"));
    if png_path.exists() {
        return Ok(png_path);
    }
    std::fs::create_dir_all(cache_dir)?;

    let _com = ComApartment::new();
    let rgba = normalize_icon(extract_rgba(target)?);
    rgba.save_with_format(&png_path, image::ImageFormat::Png)?;
    Ok(png_path)
}

/// The sizes an icon is made at when high quality icons are on. A window asks for the nearest above what it shows, so
/// a handful of copies per icon serve every surface and every dock size.
pub const SIZED_STEPS: [u32; 6] = [32, 48, 64, 96, 128, 192];

/// Round a wanted size up to the next of `SIZED_STEPS`; `None` when it is more than the largest (the 256 px picture
/// is the one to use).
pub fn sized_step(wanted: u32) -> Option<u32> {
    SIZED_STEPS.iter().copied().find(|s| *s >= wanted)
}

/// Resize with the colour weighted by coverage. Scaling straight RGBA smears the colour of the transparent pixels
/// round an icon's edge into it (a dark or pale fringe); scaling colour times alpha, and dividing it out after, does
/// not. Lanczos3 for the filter: the sharpest that does not ring much.
pub fn resize_icon(img: &image::RgbaImage, side: u32) -> image::RgbaImage {
    let (w, h) = img.dimensions();
    let mut premul = image::ImageBuffer::<image::Rgba<f32>, Vec<f32>>::new(w, h);
    for (x, y, p) in img.enumerate_pixels() {
        // 0 to 1 throughout: the resampler treats float pixels as that and clamps to it
        let a = p.0[3] as f32 / 255.0;
        premul.put_pixel(x, y, image::Rgba([p.0[0] as f32 / 255.0 * a, p.0[1] as f32 / 255.0 * a, p.0[2] as f32 / 255.0 * a, a]));
    }
    let small = image::imageops::resize(&premul, side, side, image::imageops::FilterType::Lanczos3);
    let mut out = image::RgbaImage::new(side, side);
    for (x, y, p) in small.enumerate_pixels() {
        let a = p.0[3].clamp(0.0, 1.0);
        let un = |c: f32| if a > 0.0 { (c / a * 255.0).round().clamp(0.0, 255.0) as u8 } else { 0 };
        out.put_pixel(x, y, image::Rgba([un(p.0[0]), un(p.0[1]), un(p.0[2]), (a * 255.0).round() as u8]));
    }
    out
}

/// The icon at `px` pixels square, made from the cached picture at `path` and kept beside it (`name-p48.png`). The
/// picture itself when `px` is not smaller than it is. Call from `spawn_blocking`.
pub fn sized_icon(path: &Path, px: u32) -> AeroResult<PathBuf> {
    let Some(stem) = path.file_stem().and_then(|s| s.to_str()) else {
        return Ok(path.to_path_buf());
    };
    let sized = path.with_file_name(format!("{stem}-p{px}.png"));
    if sized.exists() {
        return Ok(sized);
    }
    let img = image::open(path)?.to_rgba8();
    if px >= img.width() {
        return Ok(path.to_path_buf());
    }
    resize_icon(&img, px).save_with_format(&sized, image::ImageFormat::Png)?;
    Ok(sized)
}

fn extract_rgba(target: &str) -> AeroResult<image::RgbaImage> {
    let wide = to_wide(target);
    let factory: IShellItemImageFactory =
        unsafe { SHCreateItemFromParsingName(PCWSTR(wide.as_ptr()), None)? };
    let size = SIZE {
        cx: ICON_SIZE,
        cy: ICON_SIZE,
    };
    // ICONONLY fails for some shell items (known folders with custom
    // icons, e.g. Downloads); fall back to the general image path.
    let hbitmap: HBITMAP = unsafe {
        match factory.GetImage(size, SIIGBF_ICONONLY | SIIGBF_BIGGERSIZEOK) {
            Ok(h) => h,
            Err(_) => factory.GetImage(size, SIIGBF_BIGGERSIZEOK)?,
        }
    };
    let result = hbitmap_to_rgba(hbitmap);
    unsafe {
        let _ = DeleteObject(HGDIOBJ(hbitmap.0));
    };
    result
}

/// Content is considered "small" below this fraction of the canvas, at
/// which point the icon is cropped to its drawn pixels and scaled up.
const SMALL_CONTENT_RATIO: f32 = 0.62;

/// Bounding box of the non-transparent pixels, as (x0, y0, x1, y1) with
/// the far edges exclusive. `None` when the image is fully transparent.
fn alpha_bounds(img: &image::RgbaImage) -> Option<(u32, u32, u32, u32)> {
    let (w, h) = img.dimensions();
    let (mut x0, mut y0, mut x1, mut y1) = (w, h, 0u32, 0u32);
    for (x, y, px) in img.enumerate_pixels() {
        if px.0[3] > 8 {
            x0 = x0.min(x);
            y0 = y0.min(y);
            x1 = x1.max(x + 1);
            y1 = y1.max(y + 1);
        }
    }
    (x1 > x0 && y1 > y0).then_some((x0, y0, x1, y1))
}

/// Centre an image on a transparent square canvas of `side` pixels.
fn pad_to_square(img: &image::RgbaImage, side: u32) -> image::RgbaImage {
    let (w, h) = img.dimensions();
    let mut out = image::RgbaImage::from_pixel(side, side, image::Rgba([0, 0, 0, 0]));
    let ox = (side.saturating_sub(w)) / 2;
    let oy = (side.saturating_sub(h)) / 2;
    image::imageops::replace(&mut out, img, ox as i64, oy as i64);
    out
}

/// Give every icon the same optical weight.
///
/// Apps that ship only a 16 or 32 px resource (Core Temp is the usual
/// example) come back as a small drawing marooned in the middle of the
/// requested canvas, so the dock would render a postage stamp on a big
/// tile. Crop those to their drawn pixels first. Non-square icons are
/// padded rather than stretched, so the aspect ratio survives whatever
/// size the dock is set to.
pub fn normalize_icon(img: image::RgbaImage) -> image::RgbaImage {
    let (w, h) = img.dimensions();
    if w == 0 || h == 0 {
        return img;
    }
    let Some((x0, y0, x1, y1)) = alpha_bounds(&img) else {
        return img; // fully transparent, nothing to measure
    };

    let (cw, ch) = (x1 - x0, y1 - y0);
    let ratio = cw.max(ch) as f32 / w.max(h) as f32;

    // Only crop when the drawing is genuinely marooned. Well-formed icons
    // keep the padding their designer chose.
    let content = if ratio < SMALL_CONTENT_RATIO {
        image::imageops::crop_imm(&img, x0, y0, cw, ch).to_image()
    } else {
        img
    };

    let (cw, ch) = content.dimensions();
    let square = if cw == ch {
        content
    } else {
        pad_to_square(&content, cw.max(ch))
    };

    if square.width() == ICON_SIZE as u32 {
        square
    } else {
        image::imageops::resize(
            &square,
            ICON_SIZE as u32,
            ICON_SIZE as u32,
            image::imageops::FilterType::Lanczos3,
        )
    }
}

fn hbitmap_to_rgba(hbitmap: HBITMAP) -> AeroResult<image::RgbaImage> {
    let mut bmp = BITMAP::default();
    let got = unsafe {
        GetObjectW(
            HGDIOBJ(hbitmap.0),
            std::mem::size_of::<BITMAP>() as i32,
            Some(&mut bmp as *mut BITMAP as *mut _),
        )
    };
    if got == 0 {
        return Err(AeroError::other("GetObjectW failed on icon bitmap"));
    }
    let (width, height) = (bmp.bmWidth, bmp.bmHeight);
    if width <= 0 || height <= 0 {
        return Err(AeroError::other("icon bitmap has invalid dimensions"));
    }

    let mut info = BITMAPINFO {
        bmiHeader: BITMAPINFOHEADER {
            biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
            biWidth: width,
            biHeight: -height, // negative = top-down rows
            biPlanes: 1,
            biBitCount: 32,
            biCompression: BI_RGB.0,
            ..Default::default()
        },
        ..Default::default()
    };

    let mut pixels = vec![0u8; (width as usize) * (height as usize) * 4];
    let hdc = unsafe { GetDC(None) };
    let lines = unsafe {
        GetDIBits(
            hdc,
            hbitmap,
            0,
            height as u32,
            Some(pixels.as_mut_ptr() as *mut _),
            &mut info,
            DIB_RGB_COLORS,
        )
    };
    unsafe { ReleaseDC(None, hdc) };
    if lines == 0 {
        return Err(AeroError::other("GetDIBits failed on icon bitmap"));
    }

    // BGRA -> RGBA in place
    let (rgba, _) = pixels.as_chunks_mut::<4>();
    for px in rgba {
        px.swap(0, 2);
    }
    // Bitmaps without an alpha channel come back with alpha 0 everywhere;
    // treat those as fully opaque instead of invisible.
    let (rgba, _) = pixels.as_chunks::<4>();
    if rgba.iter().all(|px| px[3] == 0) {
        let (rgba, _) = pixels.as_chunks_mut::<4>();
        for px in rgba {
            px[3] = 255;
        }
    }

    image::RgbaImage::from_raw(width as u32, height as u32, pixels)
        .ok_or_else(|| AeroError::other("icon pixel buffer size mismatch"))
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Transparent canvas with an opaque square drawn at (x, y).
    fn canvas(side: u32, x: u32, y: u32, w: u32, h: u32) -> image::RgbaImage {
        let mut img = image::RgbaImage::from_pixel(side, side, image::Rgba([0, 0, 0, 0]));
        for yy in y..(y + h) {
            for xx in x..(x + w) {
                img.put_pixel(xx, yy, image::Rgba([10, 120, 220, 255]));
            }
        }
        img
    }

    #[test]
    fn alpha_bounds_finds_the_drawn_region() {
        let img = canvas(64, 20, 24, 8, 10);
        assert_eq!(alpha_bounds(&img), Some((20, 24, 28, 34)));
    }

    #[test]
    fn alpha_bounds_is_none_when_empty() {
        let img = image::RgbaImage::from_pixel(32, 32, image::Rgba([0, 0, 0, 0]));
        assert_eq!(alpha_bounds(&img), None);
    }

    #[test]
    fn tiny_icon_is_cropped_and_scaled_up() {
        // a 16px drawing marooned on a 256px canvas, the Core Temp case
        let img = canvas(256, 120, 120, 16, 16);
        let out = normalize_icon(img);
        assert_eq!(out.dimensions(), (ICON_SIZE as u32, ICON_SIZE as u32));
        // after cropping, the drawing fills the canvas, so the corners
        // are now opaque rather than empty padding
        assert!(out.get_pixel(4, 4).0[3] > 8, "content should reach the edges");
    }

    #[test]
    fn well_formed_icon_keeps_its_padding() {
        // content covers most of the canvas already, so no crop
        let img = canvas(256, 8, 8, 240, 240);
        let out = normalize_icon(img);
        assert_eq!(out.dimensions(), (ICON_SIZE as u32, ICON_SIZE as u32));
        assert_eq!(out.get_pixel(1, 1).0[3], 0, "original padding should survive");
    }

    #[test]
    fn non_square_icon_is_padded_not_stretched() {
        // 200x100 of content: padding keeps the 2:1 shape inside a square
        let mut img = image::RgbaImage::from_pixel(256, 256, image::Rgba([0, 0, 0, 0]));
        for y in 78..178 {
            for x in 28..228 {
                img.put_pixel(x, y, image::Rgba([255, 0, 0, 255]));
            }
        }
        let out = normalize_icon(img);
        assert_eq!(out.dimensions(), (ICON_SIZE as u32, ICON_SIZE as u32));
        // top and bottom stay empty, so the shape was not stretched to fill
        assert_eq!(out.get_pixel(128, 2).0[3], 0);
        assert_eq!(out.get_pixel(128, 253).0[3], 0);
        // and the middle is still drawn
        assert!(out.get_pixel(128, 128).0[3] > 8);
    }

    #[test]
    fn fully_transparent_icon_is_left_alone() {
        let img = image::RgbaImage::from_pixel(48, 48, image::Rgba([0, 0, 0, 0]));
        let out = normalize_icon(img);
        assert_eq!(out.dimensions(), (48, 48));
    }

    #[test]
    fn a_wanted_size_rounds_up_to_a_size_kept() {
        assert_eq!(sized_step(26), Some(32));
        assert_eq!(sized_step(34), Some(48));
        assert_eq!(sized_step(48), Some(48));
        assert_eq!(sized_step(150), Some(192));
        assert_eq!(sized_step(193), None, "above the largest kept, the 256 px picture is used");
    }

    #[test]
    fn resizing_keeps_the_colour_to_the_edge_with_no_fringe() {
        // a red square on transparent black-ish pixels: straight RGBA scaling would darken its rim
        let mut img = image::RgbaImage::from_pixel(256, 256, image::Rgba([0, 0, 0, 0]));
        for y in 64..192 {
            for x in 64..192 {
                img.put_pixel(x, y, image::Rgba([255, 40, 40, 255]));
            }
        }
        let out = resize_icon(&img, 48);
        assert_eq!(out.dimensions(), (48, 48));
        // every drawn pixel, partly covered ones included, is the square's red (not dragged towards black)
        for p in out.pixels().filter(|p| p.0[3] > 20) {
            assert!(p.0[0] >= 235 && p.0[1] <= 60, "fringe colour {:?}", p.0);
        }
        assert_eq!(out.get_pixel(24, 24).0[3], 255, "the middle is still solid");
        assert_eq!(out.get_pixel(1, 1).0[3], 0, "and the padding clear");
    }

    #[test]
    fn a_sized_copy_is_made_once_beside_the_picture() {
        let dir = std::env::temp_dir().join("aero-icon-sized-test");
        std::fs::create_dir_all(&dir).unwrap();
        let big = dir.join("probe-v2.png");
        canvas(256, 32, 32, 192, 192).save(&big).unwrap();
        let small = sized_icon(&big, 64).unwrap();
        assert_eq!(small.file_name().unwrap(), "probe-v2-p64.png");
        assert_eq!(image::open(&small).unwrap().width(), 64);
        // again: the same file, not another
        assert_eq!(sized_icon(&big, 64).unwrap(), small);
        // asked for as big as the picture or bigger: the picture itself
        assert_eq!(sized_icon(&big, 256).unwrap(), big);
    }

    #[test]
    fn extracts_folder_icon() {
        let dir = std::env::temp_dir().join("aero-icon-test");
        let result = ensure_icon(r"C:\Windows", &dir);
        assert!(result.is_ok(), "folder icon failed: {:?}", result.err());
    }

    #[test]
    fn extracts_exe_icon() {
        let dir = std::env::temp_dir().join("aero-icon-test");
        let result = ensure_icon(r"C:\Windows\System32\notepad.exe", &dir);
        assert!(result.is_ok(), "exe icon failed: {:?}", result.err());
    }
}
