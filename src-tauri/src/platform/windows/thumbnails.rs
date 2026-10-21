//! Live window previews via DWM thumbnails: the compositor renders a
//! real, live miniature of a source window directly into a rectangle of
//! our dock window — zero copies, zero polling. The frontend draws the
//! glass frame; we place the living picture inside it.

use parking_lot::Mutex;
use serde::Deserialize;
use windows::Win32::Foundation::{HWND, RECT, SIZE};
use windows::Win32::Graphics::Dwm::{
    DwmQueryThumbnailSourceSize, DwmRegisterThumbnail, DwmUnregisterThumbnail,
    DwmUpdateThumbnailProperties, DWM_THUMBNAIL_PROPERTIES, DWM_TNP_RECTDESTINATION,
    DWM_TNP_SOURCECLIENTAREAONLY, DWM_TNP_VISIBLE,
};

use crate::core::AeroResult;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PreviewSlot {
    /// Source window handle.
    pub hwnd: isize,
    /// Destination rect in the dock window's client area, physical px.
    pub x: i32,
    pub y: i32,
    pub w: i32,
    pub h: i32,
}

/// Registered thumbnails: the window each is drawn into, and its id (an opaque
/// HTHUMBNAIL). Kept by destination, so that the dock's flyout and the window
/// overview, each a window of its own, do not tear down each other's.
static ACTIVE: Mutex<Vec<(isize, isize)>> = Mutex::new(Vec::new());

/// Where a window's live picture goes inside the box given for it: as large as fits at the window's own proportions
/// (never past its own size, so a small dialog is drawn small), centred. DWM stretches a thumbnail to whatever rectangle
/// it is given, so a tall or an ultra-wide window filling a fixed box was squashed or stretched. Returns
/// `(x, y, width, height)`; the box itself if either size is unknown.
pub fn fit_in(slot: (i32, i32, i32, i32), source: (i32, i32)) -> (i32, i32, i32, i32) {
    let (x, y, w, h) = slot;
    let (sw, sh) = source;
    if sw <= 0 || sh <= 0 || w <= 0 || h <= 0 {
        return slot;
    }
    let scale = (w as f64 / sw as f64).min(h as f64 / sh as f64).min(1.0);
    let fw = ((sw as f64 * scale).round() as i32).max(1);
    let fh = ((sh as f64 * scale).round() as i32).max(1);
    (x + (w - fw) / 2, y + (h - fh) / 2, fw, fh)
}

/// Replace the previews drawn into dest with the given slots.
pub fn show(dest: HWND, slots: &[PreviewSlot]) -> AeroResult<()> {
    hide_for(dest);
    let mut active = ACTIVE.lock();
    for slot in slots {
        let thumb = match unsafe { DwmRegisterThumbnail(dest, HWND(slot.hwnd as *mut _)) } {
            Ok(t) => t,
            Err(e) => {
                log::debug!("thumbnail register failed for {}: {e}", slot.hwnd);
                continue;
            }
        };
        // the picture keeps its window's proportions inside the box (asked of DWM, which knows what it draws)
        let source: SIZE = unsafe { DwmQueryThumbnailSourceSize(thumb) }.unwrap_or_default();
        let (x, y, w, h) = fit_in((slot.x, slot.y, slot.w, slot.h), (source.cx, source.cy));
        let props = DWM_THUMBNAIL_PROPERTIES {
            dwFlags: DWM_TNP_RECTDESTINATION | DWM_TNP_VISIBLE | DWM_TNP_SOURCECLIENTAREAONLY,
            rcDestination: RECT { left: x, top: y, right: x + w, bottom: y + h },
            fVisible: true.into(),
            fSourceClientAreaOnly: false.into(),
            ..Default::default()
        };
        if unsafe { DwmUpdateThumbnailProperties(thumb, &props) }.is_err() {
            let _ = unsafe { DwmUnregisterThumbnail(thumb) };
            continue;
        }
        active.push((dest.0 as isize, thumb));
    }
    Ok(())
}

/// Tear down the previews drawn into one window.
pub fn hide_for(dest: HWND) {
    let mut active = ACTIVE.lock();
    active.retain(|(d, id)| {
        if *d == dest.0 as isize {
            let _ = unsafe { DwmUnregisterThumbnail(*id) };
            false
        } else {
            true
        }
    });
}

#[cfg(test)]
mod tests {
    use super::fit_in;

    #[test]
    fn a_wide_window_fills_the_width_and_is_centred_vertically() {
        // 1920x1080 into a 200x120 box: 16:9 is wider than 5:3, so the width is what fits
        assert_eq!(fit_in((10, 20, 200, 120), (1920, 1080)), (10, 20 + (120 - 113) / 2, 200, 113));
    }

    #[test]
    fn a_tall_window_fills_the_height_and_is_centred_across() {
        // a phone-shaped window: 400x1200 into 200x120
        let (x, y, w, h) = fit_in((0, 0, 200, 120), (400, 1200));
        assert_eq!((y, h), (0, 120));
        assert_eq!(w, 40);
        assert_eq!(x, (200 - 40) / 2);
    }

    #[test]
    fn a_small_window_is_drawn_at_its_own_size_not_blown_up() {
        assert_eq!(fit_in((0, 0, 400, 240), (200, 100)), (100, 70, 200, 100));
    }

    #[test]
    fn the_proportions_are_kept() {
        for (sw, sh) in [(1920, 1080), (1024, 768), (500, 900), (3440, 1440), (333, 777)] {
            let (_, _, w, h) = fit_in((0, 0, 280, 170), (sw, sh));
            let want = sw as f64 / sh as f64;
            let got = w as f64 / h as f64;
            assert!((want - got).abs() / want < 0.03, "{sw}x{sh} drawn {w}x{h}");
        }
    }

    #[test]
    fn an_unknown_size_leaves_the_box_as_it_was() {
        assert_eq!(fit_in((5, 6, 200, 120), (0, 0)), (5, 6, 200, 120));
        assert_eq!(fit_in((5, 6, 0, 120), (800, 600)), (5, 6, 0, 120));
    }
}