//! Win32 styling for the dock window: keep it out of Alt-Tab and the
//! taskbar, and stop it from stealing focus from the app the user is
//! actually working in (docks are furniture, not windows).

use parking_lot::Mutex;
use windows::Win32::Foundation::{HWND, LPARAM, LRESULT, WPARAM};
use windows::Win32::Graphics::Gdi::{CreateRectRgn, DeleteObject, SetWindowRgn};
use windows::Win32::UI::Shell::{DefSubclassProc, SetWindowSubclass};
use windows::Win32::UI::WindowsAndMessaging::{
    GetWindowLongPtrW, SetWindowLongPtrW, SetWindowPos, GWL_EXSTYLE, GWL_STYLE, STYLESTRUCT,
    SWP_FRAMECHANGED, SWP_NOACTIVATE, SWP_NOMOVE, SWP_NOSIZE, SWP_NOZORDER, WM_NCACTIVATE,
    WM_STYLECHANGING,
    WS_CAPTION, WS_EX_APPWINDOW, WS_EX_NOACTIVATE, WS_EX_TOOLWINDOW, WS_SYSMENU,
};

use crate::core::AeroResult;

/// Apply dock chrome: WS_EX_TOOLWINDOW (no Alt-Tab entry), no
/// WS_EX_APPWINDOW (no taskbar button), WS_EX_NOACTIVATE (clicks don't
/// pull focus away from the foreground app).
pub fn apply_dock_styles(hwnd: HWND) -> AeroResult<()> {
    unsafe {
        let mut ex = GetWindowLongPtrW(hwnd, GWL_EXSTYLE) as isize;
        ex |= (WS_EX_TOOLWINDOW.0 | WS_EX_NOACTIVATE.0) as isize;
        ex &= !(WS_EX_APPWINDOW.0 as isize);
        SetWindowLongPtrW(hwnd, GWL_EXSTYLE, ex);
    }
    Ok(())
}

/// Remove the title bar and system menu from a window's style.
///
/// A Tauri window built without decorations can still carry the style bits of
/// a captioned window, and then Windows draws the title behind the page. The
/// page is transparent, so wherever it is clear the title shows through. That
/// is invisible on a window whose top is out of view, and plain on one that
/// sits at the top of the screen.
pub fn strip_caption(hwnd: HWND) {
    unsafe {
        let style = GetWindowLongPtrW(hwnd, GWL_STYLE) as u32;
        let bare = style & !(WS_CAPTION.0 | WS_SYSMENU.0);
        if bare == style {
            return;
        }
        SetWindowLongPtrW(hwnd, GWL_STYLE, bare as isize);
        // make Windows lay the frame out again with the new style
        let _ = SetWindowPos(
            hwnd,
            None,
            0,
            0,
            0,
            0,
            SWP_FRAMECHANGED | SWP_NOMOVE | SWP_NOSIZE | SWP_NOZORDER | SWP_NOACTIVATE,
        );
    }
}

/// Make a window refuse a title bar for good.
///
/// [`strip_caption`] takes the style off once, but Tauri puts it back at
/// moments of its own (a show, a change of focus or of always-on-top), and
/// until the next time the window is placed the title shows through the clear
/// page as a tinted overlay across the top. Watching the window's style
/// changes instead closes that for every route: whatever sets the style, the
/// caption bits are removed on the way in. Safe to call repeatedly; the window
/// has to belong to the calling thread.
pub fn keep_caption_off(hwnd: HWND) {
    /// Any one number will do; it only has to be the same each time.
    const GUARD_ID: usize = 0xAE20_0C01;

    unsafe extern "system" fn guard(
        hwnd: HWND,
        msg: u32,
        wparam: WPARAM,
        lparam: LPARAM,
        _id: usize,
        _data: usize,
    ) -> LRESULT {
        if msg == WM_STYLECHANGING && wparam.0 as i32 == GWL_STYLE.0 && lparam.0 != 0 {
            let style = unsafe { &mut *(lparam.0 as *mut STYLESTRUCT) };
            style.styleNew &= !(WS_CAPTION.0 | WS_SYSMENU.0);
        }
        // The window goes active and inactive whenever the bar is clicked and
        // whenever the focus moves on (Chromium takes the focus for its web
        // view even though the window asks not to be activated). Windows
        // repaints a window's frame each time, and for this one, a clear
        // window with no frame, that repaint shows as a pale wash across the
        // whole bar, which can stay until something else repaints it.
        // Handing the message on with an lParam of -1 is the documented way to
        // say "do not repaint the frame"; everything else about it still runs.
        if msg == WM_NCACTIVATE {
            return unsafe { DefSubclassProc(hwnd, msg, wparam, LPARAM(-1)) };
        }
        unsafe { DefSubclassProc(hwnd, msg, wparam, lparam) }
    }

    // the same id and procedure again just updates the existing one
    if !unsafe { SetWindowSubclass(hwnd, Some(guard), GUARD_ID, 0) }.as_bool() {
        log::warn!("could not guard a window against its title bar coming back");
    }
    strip_caption(hwnd);
}

/// Move and resize the window in one step, in physical pixels.
///
/// Two separate calls (size, then position) leave a moment where the window
/// has its new size at its old position. The dock is anchored to the bottom
/// of its window, and the window grows by hundreds of pixels when a preview
/// flyout opens, so that moment shows as the whole dock jumping up or down
/// the screen for a frame or two.
pub fn set_bounds(hwnd: HWND, x: i32, y: i32, w: i32, h: i32) -> AeroResult<()> {
    unsafe {
        SetWindowPos(
            hwnd,
            None,
            x,
            y,
            w.max(1),
            h.max(1),
            SWP_NOZORDER | SWP_NOACTIVATE,
        )
        .map_err(|e| crate::core::AeroError::other(format!("could not place the dock: {e}")))?;
    }
    Ok(())
}

/// Clip a window to a region the caller built. The region belongs to the
/// system once this succeeds; if it fails the region is freed here.
pub fn set_region(hwnd: HWND, region: windows::Win32::Graphics::Gdi::HRGN) -> AeroResult<()> {
    unsafe {
        if SetWindowRgn(hwnd, Some(region), true) == 0 {
            let _ = DeleteObject(region.into());
            return Err(crate::core::AeroError::other("could not clip a window"));
        }
    }
    Ok(())
}

/// The last clip applied, so [`set_visible_region`] can skip a repeat:
/// `SetWindowRgn` forces a repaint, and it is called on every resize report.
static LAST: Mutex<Option<(isize, [i32; 4])>> = Mutex::new(None);

/// Clip the window to a rectangle (window coordinates, physical pixels).
/// Outside it the window draws nothing and mouse input passes through to
/// whatever is underneath, which is what lets the window stay much larger
/// than the dock without getting in the way.
pub fn set_visible_region(hwnd: HWND, x: i32, y: i32, w: i32, h: i32) -> AeroResult<()> {
    let key = (hwnd.0 as isize, [x, y, w, h]);
    // The lock is not held across `SetWindowRgn`. That call makes the
    // window's own thread answer messages, and if that thread is waiting for
    // this lock (a second window being clipped from another thread) neither
    // can go on: the app hangs.
    if *LAST.lock() == Some(key) {
        return Ok(());
    }
    unsafe {
        let region = CreateRectRgn(x, y, x + w, y + h);
        // on success the system owns the region and frees it itself
        if SetWindowRgn(hwnd, Some(region), true) == 0 {
            let _ = DeleteObject(region.into());
            return Err(crate::core::AeroError::other("could not clip the dock window"));
        }
    }
    *LAST.lock() = Some(key);
    Ok(())
}

/// Temporarily allow the dock to take keyboard focus (search overlay),
/// or give focus-immunity back when the overlay closes.
pub fn set_no_activate(hwnd: HWND, no_activate: bool) -> AeroResult<()> {
    unsafe {
        let mut ex = GetWindowLongPtrW(hwnd, GWL_EXSTYLE) as isize;
        if no_activate {
            ex |= WS_EX_NOACTIVATE.0 as isize;
        } else {
            ex &= !(WS_EX_NOACTIVATE.0 as isize);
        }
        SetWindowLongPtrW(hwnd, GWL_EXSTYLE, ex);
    }
    Ok(())
}
