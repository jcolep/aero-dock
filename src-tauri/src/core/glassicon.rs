//! Glass versions of icons, made once and kept.
//!
//! An app's icon is whatever its author drew. To make a set of them look like
//! one set of liquid glass, each is given the same treatment, done to its pixels
//! when the icon is first read and saved beside it, so showing one costs nothing
//! (the dock is drawn in software, and an effect run on every icon on every
//! frame of a magnifying dock would not keep up).
//!
//! Three looks, all following the icon's own outline, none putting a tile behind it:
//!
//! - **Glass** keeps the colors and gives the icon a body of glass: a rim of
//!   light along the edges that face the light (the upper left) and a soft
//!   shadow along those that face away, a sheen across the top, and a faint
//!   glow all round the edge.
//! - **Clear** keeps only the icon's lightness: light parts become frosted white
//!   glass, dark parts nearly vanish, so the drawing is left as a shape cut in
//!   glass.
//! - **Tinted** is the same with the drawing's lightness mapped onto one color,
//!   the theme's, from deep to pale.
//!
//! No pixel is ever made more opaque than it was, so the silhouette is the icon's
//! own, with no halo outside it.

use std::path::{Path, PathBuf};

use image::{Rgba, RgbaImage};

use crate::core::AeroResult;

/// Bump when the pixels a look produces change, so a kept copy made by the old
/// rules is not served.
const VERSION: u32 = 1;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Style {
    Glass,
    Clear,
    Tinted,
}

impl Style {
    /// From the setting; `plain`, and anything unknown, is no treatment.
    pub fn parse(name: &str) -> Option<Style> {
        match name {
            "glass" => Some(Style::Glass),
            "clear" => Some(Style::Clear),
            "tinted" => Some(Style::Tinted),
            _ => None,
        }
    }

    fn name(self) -> &'static str {
        match self {
            Style::Glass => "glass",
            Style::Clear => "clear",
            Style::Tinted => "tinted",
        }
    }
}

/// `#rrggbb` as bytes.
pub fn parse_hex(text: &str) -> Option<[u8; 3]> {
    let t = text.trim().trim_start_matches('#');
    if t.len() != 6 || !t.chars().all(|c| c.is_ascii_hexdigit()) {
        return None;
    }
    let n = u32::from_str_radix(t, 16).ok()?;
    Some([(n >> 16) as u8, (n >> 8) as u8, n as u8])
}

/// The light comes from the upper left.
const LIGHT: (f32, f32) = (-0.55, -0.835);

/// Blur a plane with three passes of a box, which is near enough to a Gaussian.
/// Outside the plane counts as empty, so the edge of the canvas is an edge.
fn blur(src: &[f32], w: usize, h: usize, radius: usize) -> Vec<f32> {
    if radius == 0 {
        return src.to_vec();
    }
    let mut a = src.to_vec();
    let mut b = vec![0.0f32; src.len()];
    let norm = 1.0 / (2 * radius + 1) as f32;
    for _ in 0..3 {
        // across
        for y in 0..h {
            let row = &a[y * w..(y + 1) * w];
            let mut sum: f32 = row.iter().take(radius + 1).sum();
            for x in 0..w {
                b[y * w + x] = sum * norm;
                let add = x + radius + 1;
                if add < w {
                    sum += row[add];
                }
                if x >= radius {
                    sum -= row[x - radius];
                }
            }
        }
        // down
        for x in 0..w {
            let mut sum = 0.0f32;
            for y in 0..=radius.min(h - 1) {
                sum += b[y * w + x];
            }
            for y in 0..h {
                a[y * w + x] = sum * norm;
                let add = y + radius + 1;
                if add < h {
                    sum += b[add * w + x];
                }
                if y >= radius {
                    sum -= b[(y - radius) * w + x];
                }
            }
        }
    }
    a
}

fn mix(a: f32, b: f32, t: f32) -> f32 {
    a + (b - a) * t
}

/// Make the glass version of an icon.
pub fn bake(img: &RgbaImage, style: Style, tint: [u8; 3]) -> RgbaImage {
    let (w32, h32) = img.dimensions();
    let (w, h) = (w32 as usize, h32 as usize);
    if w < 4 || h < 4 {
        return img.clone();
    }
    let scale = w.max(h) as f32 / 256.0;
    let alpha: Vec<f32> = img.pixels().map(|p| p.0[3] as f32 / 255.0).collect();
    // how far from the edge the rim reaches
    let radius = ((5.0 * scale).round() as usize).max(1);
    let soft = blur(&alpha, w, h, radius);
    // and a second, much tighter outline for the crisp line of light right on the edge
    let sharp = blur(&alpha, w, h, ((1.5 * scale).round() as usize).max(1));

    // the slope of the blurred outline: where it is steep there is an edge, and
    // which way it faces says whether the light reaches it
    let at = |x: usize, y: usize| soft[y * w + x];
    let at_sharp = |x: usize, y: usize| sharp[y * w + x];
    let mut slope = vec![(0.0f32, 0.0f32); w * h];
    let mut crisp = vec![0.0f32; w * h];
    let mut steepest = 1e-6f32;
    let mut steepest_crisp = 1e-6f32;
    for y in 0..h {
        for x in 0..w {
            let gx = (at((x + 1).min(w - 1), y) - at(x.saturating_sub(1), y)) * 0.5;
            let gy = (at(x, (y + 1).min(h - 1)) - at(x, y.saturating_sub(1))) * 0.5;
            slope[y * w + x] = (gx, gy);
            steepest = steepest.max((gx * gx + gy * gy).sqrt());
            let cx = (at_sharp((x + 1).min(w - 1), y) - at_sharp(x.saturating_sub(1), y)) * 0.5;
            let cy = (at_sharp(x, (y + 1).min(h - 1)) - at_sharp(x, y.saturating_sub(1))) * 0.5;
            let m = (cx * cx + cy * cy).sqrt();
            crisp[y * w + x] = m;
            steepest_crisp = steepest_crisp.max(m);
        }
    }

    let tint_f = [tint[0] as f32 / 255.0, tint[1] as f32 / 255.0, tint[2] as f32 / 255.0];
    let mut out = RgbaImage::new(w32, h32);
    for y in 0..h {
        for x in 0..w {
            let src = img.get_pixel(x as u32, y as u32).0;
            let a = src[3] as f32 / 255.0;
            if a <= 0.002 {
                out.put_pixel(x as u32, y as u32, Rgba([0, 0, 0, 0]));
                continue;
            }
            let (gx, gy) = slope[y * w + x];
            let mag = (gx * gx + gy * gy).sqrt();
            let edge = (mag / steepest).clamp(0.0, 1.0);
            // the outward normal is minus the slope of the outline
            let facing = if mag > 1e-6 { (-gx * LIGHT.0 - gy * LIGHT.1) / mag } else { 0.0 };
            let line = crisp[y * w + x] / steepest_crisp;
            let rim_light = edge * facing.clamp(0.0, 1.0).powf(1.2) * 1.15 + line * facing.clamp(0.0, 1.0).powf(1.0) * 0.55;
            let rim_shade = edge * (-facing).clamp(0.0, 1.0) * 1.2;
            let glow = edge * 0.2 + line * 0.14;
            // a sheen across the upper part, leaning with the light, thinner at the edge
            let t = y as f32 / h as f32 + 0.18 * (x as f32 / w as f32 - 0.5);
            let sheen = (1.0 - t / 0.56).clamp(0.0, 1.0).powf(1.6) * 0.40 * (1.0 - 0.6 * edge);

            let rgb = [src[0] as f32 / 255.0, src[1] as f32 / 255.0, src[2] as f32 / 255.0];
            let lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
            // the body of the icon: its color and how much of it there is
            let (body, body_a): ([f32; 3], f32) = match style {
                Style::Glass => {
                    // a little livelier and lighter, and very slightly see-through
                    let lifted = [0, 1, 2].map(|i| (mix(lum, rgb[i], 1.07) + (1.0 - rgb[i]) * 0.04).clamp(0.0, 1.0));
                    // and a little more see-through toward the edge, as glass is
                    (lifted, a * (0.96 - 0.14 * edge))
                }
                Style::Clear => {
                    let tone = 0.80 + 0.20 * lum;
                    ([(0.80 + 0.20 * lum) * tone, (0.88 + 0.12 * lum) * tone, (0.96 + 0.04 * lum) * tone], a * (0.34 + 0.5 * lum.powf(0.7)))
                }
                Style::Tinted => {
                    let deep = tint_f.map(|c| c * 0.40 + 0.03);
                    let pale = tint_f.map(|c| mix(c, 1.0, 0.62));
                    let k = lum.powf(0.9);
                    ([0, 1, 2].map(|i| mix(deep[i], pale[i], k)), a * (0.52 + 0.4 * lum))
                }
            };

            // light over the body, then shadow over that (all premultiplied)
            let white_a = ((sheen + rim_light * 0.85 + glow) * a).clamp(0.0, 0.92);
            let black_a = (rim_shade * 0.34 * a).clamp(0.0, 0.5);
            let mut pre = [body[0] * body_a, body[1] * body_a, body[2] * body_a];
            let mut alpha_out = body_a;
            for c in pre.iter_mut() {
                *c = *c * (1.0 - white_a) + white_a;
            }
            alpha_out = alpha_out * (1.0 - white_a) + white_a;
            for c in pre.iter_mut() {
                *c *= 1.0 - black_a;
            }
            alpha_out = alpha_out * (1.0 - black_a) + black_a;

            // never more opaque than the icon was: the outline stays its own
            let final_a = alpha_out.min(a);
            let straight = if alpha_out > 1e-4 { [pre[0] / alpha_out, pre[1] / alpha_out, pre[2] / alpha_out] } else { [0.0; 3] };
            out.put_pixel(
                x as u32,
                y as u32,
                Rgba([
                    (straight[0].clamp(0.0, 1.0) * 255.0).round() as u8,
                    (straight[1].clamp(0.0, 1.0) * 255.0).round() as u8,
                    (straight[2].clamp(0.0, 1.0) * 255.0).round() as u8,
                    (final_a.clamp(0.0, 1.0) * 255.0).round() as u8,
                ]),
            );
        }
    }
    out
}

/// The kept glass copy of an icon, made if it is not there yet. Safe to call from
/// several threads at once: a copy is written whole under another name and moved
/// into place.
pub fn variant_path(plain: &Path, style: Style, tint: [u8; 3]) -> AeroResult<PathBuf> {
    let stem = plain.file_stem().and_then(|s| s.to_str()).unwrap_or("icon");
    let look = match style {
        Style::Tinted => format!("tinted-{:02x}{:02x}{:02x}", tint[0], tint[1], tint[2]),
        other => other.name().to_string(),
    };
    let path = plain.with_file_name(format!("{stem}.{look}-b{VERSION}.png"));
    if path.exists() {
        return Ok(path);
    }
    let img = image::open(plain)?.to_rgba8();
    let baked = bake(&img, style, tint);
    let partial = plain.with_file_name(format!("{stem}.{look}-b{VERSION}.{}.part", std::process::id()));
    baked.save_with_format(&partial, image::ImageFormat::Png)?;
    // another thread may have finished first; its copy is the same
    if std::fs::rename(&partial, &path).is_err() {
        let _ = std::fs::remove_file(&partial);
    }
    Ok(path)
}

#[cfg(test)]
mod tests {
    use super::*;

    /// A disc of one color on a transparent square, 96 px.
    fn disc(color: [u8; 3]) -> RgbaImage {
        let mut img = RgbaImage::new(96, 96);
        for y in 0..96i32 {
            for x in 0..96i32 {
                let d = (((x - 48) * (x - 48) + (y - 48) * (y - 48)) as f32).sqrt();
                // a soft one-pixel edge
                let a = (40.0 - d).clamp(0.0, 1.0);
                img.put_pixel(x as u32, y as u32, Rgba([color[0], color[1], color[2], (a * 255.0) as u8]));
            }
        }
        img
    }

    const BLUE: [u8; 3] = [0x2f, 0x7d, 0xe3];

    fn lum(p: &Rgba<u8>) -> f32 {
        0.299 * p.0[0] as f32 + 0.587 * p.0[1] as f32 + 0.114 * p.0[2] as f32
    }

    #[test]
    fn nothing_is_drawn_outside_the_icon_and_nothing_is_more_opaque_than_it_was() {
        let src = disc([200, 60, 60]);
        for style in [Style::Glass, Style::Clear, Style::Tinted] {
            let out = bake(&src, style, BLUE);
            assert_eq!(out.dimensions(), src.dimensions());
            for (a, b) in src.pixels().zip(out.pixels()) {
                assert!(b.0[3] <= a.0[3], "{style:?}: alpha {} over {}", b.0[3], a.0[3]);
                if a.0[3] == 0 {
                    assert_eq!(b.0[3], 0, "{style:?}: a halo");
                }
            }
        }
    }

    #[test]
    fn the_edge_facing_the_light_is_lit_and_the_one_facing_away_is_in_shadow() {
        let out = bake(&disc([120, 120, 120]), Style::Glass, BLUE);
        // just inside the rim, upper left and lower right
        let lit = out.get_pixel(48 - 28, 48 - 28);
        let dark = out.get_pixel(48 + 28, 48 + 28);
        assert!(lum(lit) > lum(dark) + 20.0, "lit {} dark {}", lum(lit), lum(dark));
    }

    #[test]
    fn glass_keeps_the_color_and_has_a_sheen_across_the_top() {
        let out = bake(&disc([200, 40, 40]), Style::Glass, BLUE);
        let middle = out.get_pixel(48, 48).0;
        assert!(middle[0] > middle[1] + 60 && middle[0] > middle[2] + 60, "still red: {middle:?}");
        // the upper part of the inside is brighter than the lower
        assert!(lum(out.get_pixel(48, 26)) > lum(out.get_pixel(48, 70)), "the sheen is on top");
    }

    #[test]
    fn clear_leaves_no_color_and_lets_dark_parts_go() {
        let mut src = disc([200, 40, 40]);
        // a dark mark inside the disc
        for y in 60..72u32 {
            for x in 40..56u32 {
                src.put_pixel(x, y, Rgba([10, 10, 10, 255]));
            }
        }
        let out = bake(&src, Style::Clear, BLUE);
        let p = out.get_pixel(30, 48).0;
        let spread = p[0].max(p[1]).max(p[2]) - p[0].min(p[1]).min(p[2]);
        assert!(spread < 50, "nearly colorless: {p:?}");
        // the dark mark is much more see-through than the light disc round it
        assert!(out.get_pixel(48, 66).0[3] + 40 < out.get_pixel(30, 48).0[3], "dark goes clear");
    }

    #[test]
    fn tinted_takes_the_color_given() {
        let out = bake(&disc([150, 150, 150]), Style::Tinted, BLUE);
        let p = out.get_pixel(48, 60).0;
        assert!(p[2] > p[0] + 25, "blue-tinted: {p:?}");
        let red = bake(&disc([150, 150, 150]), Style::Tinted, [0xd8, 0x30, 0x30]);
        let q = red.get_pixel(48, 60).0;
        assert!(q[0] > q[2] + 25, "red-tinted: {q:?}");
    }

    #[test]
    fn the_same_icon_gives_the_same_pixels_and_a_blank_one_stays_blank() {
        let src = disc([90, 160, 90]);
        assert_eq!(bake(&src, Style::Glass, BLUE), bake(&src, Style::Glass, BLUE));
        let blank = RgbaImage::new(64, 64);
        for style in [Style::Glass, Style::Clear, Style::Tinted] {
            assert!(bake(&blank, style, BLUE).pixels().all(|p| p.0[3] == 0));
        }
        // a tiny image is returned as it was, not panicked on
        let tiny = RgbaImage::new(2, 2);
        assert_eq!(bake(&tiny, Style::Glass, BLUE), tiny);
    }

    #[test]
    fn a_square_icon_that_fills_its_canvas_is_still_an_icon() {
        // full-bleed: no transparent margin at all
        let src = RgbaImage::from_pixel(64, 64, Rgba([40, 90, 200, 255]));
        let out = bake(&src, Style::Glass, BLUE);
        assert!(out.pixels().all(|p| p.0[3] > 200));
    }

    #[test]
    fn the_looks_and_the_color_are_read_from_the_settings() {
        assert_eq!(Style::parse("glass"), Some(Style::Glass));
        assert_eq!(Style::parse("clear"), Some(Style::Clear));
        assert_eq!(Style::parse("tinted"), Some(Style::Tinted));
        assert_eq!(Style::parse("plain"), None);
        assert_eq!(Style::parse("<script>"), None);
        assert_eq!(parse_hex("#2f9de3"), Some([0x2f, 0x9d, 0xe3]));
        assert_eq!(parse_hex(" 2F9DE3 "), Some([0x2f, 0x9d, 0xe3]));
        assert_eq!(parse_hex("red"), None);
        assert_eq!(parse_hex(""), None);
    }

    #[test]
    fn a_kept_copy_is_made_once_and_named_for_its_look() {
        let dir = std::env::temp_dir().join(format!("aero-glass-{}", std::process::id()));
        std::fs::create_dir_all(&dir).expect("a folder");
        let plain = dir.join("abc-v2.png");
        disc([200, 80, 80]).save(&plain).expect("a picture");
        let glass = variant_path(&plain, Style::Glass, BLUE).expect("glass");
        assert!(glass.exists());
        assert!(glass.file_name().unwrap().to_string_lossy().starts_with("abc-v2.glass"));
        let tinted = variant_path(&plain, Style::Tinted, BLUE).expect("tinted");
        assert!(tinted.file_name().unwrap().to_string_lossy().contains("tinted-2f7de3"));
        // asked again, it is the same file and is not rewritten
        let stamp = std::fs::metadata(&glass).unwrap().modified().unwrap();
        assert_eq!(variant_path(&plain, Style::Glass, BLUE).unwrap(), glass);
        assert_eq!(std::fs::metadata(&glass).unwrap().modified().unwrap(), stamp);
        let _ = std::fs::remove_dir_all(&dir);
    }

    /// Bakes the real icons of this machine in all four looks onto one sheet, to
    /// be looked at: `AERO_ICON_DIR` is the cache folder, `AERO_SHEET_OUT` the png to write.
    /// `cargo test --lib bake_a_sheet_of_real_icons -- --ignored`
    #[test]
    #[ignore]
    fn bake_a_sheet_of_real_icons() {
        let (Some(dir), Some(out)) = (std::env::var_os("AERO_ICON_DIR"), std::env::var_os("AERO_SHEET_OUT")) else {
            return;
        };
        let mut files: Vec<PathBuf> = std::fs::read_dir(dir)
            .expect("the icon folder")
            .filter_map(|e| e.ok().map(|e| e.path()))
            .filter(|p| p.extension().is_some_and(|x| x == "png") && p.file_name().is_some_and(|n| n.to_string_lossy().ends_with("-v2.png")))
            .collect();
        files.sort();
        let picks: Vec<&PathBuf> = files.iter().step_by((files.len() / 10).max(1)).take(10).collect();
        let cell = 96u32;
        let mut sheet = RgbaImage::from_pixel(cell * picks.len() as u32, cell * 4, Rgba([30, 44, 78, 255]));
        // a lighter wedge behind, so glass is seen over light and dark
        for y in 0..cell * 4 {
            for x in 0..sheet.width() {
                if (x + y) % 400 < 200 && x > sheet.width() / 2 {
                    sheet.put_pixel(x, y, Rgba([120, 150, 190, 255]));
                }
            }
        }
        for (i, path) in picks.iter().enumerate() {
            let img = image::open(path).expect("icon").to_rgba8();
            let looks = [None, Some(Style::Glass), Some(Style::Clear), Some(Style::Tinted)];
            for (row, style) in looks.iter().enumerate() {
                let made = match style {
                    Some(s) => bake(&img, *s, BLUE),
                    None => img.clone(),
                };
                let small = image::imageops::resize(&made, cell - 8, cell - 8, image::imageops::FilterType::Lanczos3);
                image::imageops::overlay(&mut sheet, &small, (i as u32 * cell + 4) as i64, (row as u32 * cell + 4) as i64);
            }
        }
        sheet.save(out).expect("the sheet");
    }
}
