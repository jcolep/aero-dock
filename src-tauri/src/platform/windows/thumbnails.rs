//! Live window previews via DWM thumbnails: the compositor renders a
//! real, live miniature of a source window directly into a rectangle of
//! our dock window — zero copies, zero polling. The frontend draws the
//! glass frame; we place the living picture inside it.

use parking_lot::Mutex;
use serde::Deserialize;
use windows::Win32::Foundation::{HWND, RECT};
use windows::Win32::Graphics::Dwm::{
    DwmRegisterThumbnail, DwmUnregisterThumbnail, DwmUpdateThumbnailProperties,
    DWM_THUMBNAIL_PROPERTIES, DWM_TNP_RECTDESTINATION, DWM_TNP_SOURCECLIENTAREAONLY,
    DWM_TNP_VISIBLE,
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
        let props = DWM_THUMBNAIL_PROPERTIES {
            dwFlags: DWM_TNP_RECTDESTINATION | DWM_TNP_VISIBLE | DWM_TNP_SOURCECLIENTAREAONLY,
            rcDestination: RECT {
                left: slot.x,
                top: slot.y,
                right: slot.x + slot.w,
                bottom: slot.y + slot.h,
            },
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
