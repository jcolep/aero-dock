//! Peek: while the pointer is on a window preview, show the real window.
//!
//! The taskbar's version fades every other window to glass through an
//! undocumented DWM call. This one uses ordinary window ordering: the
//! previewed window is raised to the front without being activated, and put
//! back in exactly its old place in the stacking order when the pointer
//! moves off. It is raised to the top of the *normal* windows, which still
//! leaves it under the dock (a topmost window), so the preview flyout stays
//! visible over it.
//!
//! A minimised window is left alone: showing it would mean restoring and
//! re-minimising it, with the animations that go with that, on every hover.

use parking_lot::Mutex;
use windows::Win32::Foundation::HWND;
use windows::Win32::UI::WindowsAndMessaging::{
    GetWindow, GetWindowLongPtrW, IsIconic, IsWindow, SetWindowPos, GWL_EXSTYLE, GW_HWNDPREV,
    HWND_TOP, SWP_NOACTIVATE, SWP_NOMOVE, SWP_NOSIZE, WS_EX_TOPMOST,
};

struct Peeking {
    hwnd: isize,
    /// The nearest ordinary window that was above it, so it can go back
    /// directly beneath that one. `None` means it was already frontmost.
    above: Option<isize>,
}

static STATE: Mutex<Option<Peeking>> = Mutex::new(None);

const KEEP_PLACE: windows::Win32::UI::WindowsAndMessaging::SET_WINDOW_POS_FLAGS =
    windows::Win32::UI::WindowsAndMessaging::SET_WINDOW_POS_FLAGS(
        SWP_NOMOVE.0 | SWP_NOSIZE.0 | SWP_NOACTIVATE.0,
    );

/// The closest window above `hwnd` that is not topmost. Walking past
/// topmost ones matters: inserting after a topmost window would make
/// `hwnd` topmost too.
unsafe fn nearest_ordinary_above(hwnd: HWND) -> Option<isize> {
    unsafe {
        let mut above = GetWindow(hwnd, GW_HWNDPREV).ok();
        while let Some(h) = above {
            if h.0.is_null() {
                return None;
            }
            if GetWindowLongPtrW(h, GWL_EXSTYLE) as u32 & WS_EX_TOPMOST.0 == 0 {
                return Some(h.0 as isize);
            }
            above = GetWindow(h, GW_HWNDPREV).ok();
        }
        None
    }
}

/// Show `hwnd` at the front. Whatever was being peeked at before goes back
/// first.
pub fn start(hwnd: isize) {
    stop();
    unsafe {
        let h = HWND(hwnd as *mut _);
        if !IsWindow(Some(h)).as_bool() || IsIconic(h).as_bool() {
            return;
        }
        let above = nearest_ordinary_above(h);
        if SetWindowPos(h, Some(HWND_TOP), 0, 0, 0, 0, KEEP_PLACE).is_ok() {
            *STATE.lock() = Some(Peeking { hwnd, above });
        }
    }
}

/// Put the peeked window back where it was. Safe to call when nothing is
/// being peeked at.
pub fn stop() {
    let Some(peek) = STATE.lock().take() else {
        return;
    };
    unsafe {
        let h = HWND(peek.hwnd as *mut _);
        if !IsWindow(Some(h)).as_bool() {
            return;
        }
        // Nothing above it before means it was frontmost already and has
        // nothing to go back to. If the window it sat under has gone, it
        // stays where it is rather than guessing.
        if let Some(above) = peek.above {
            let above = HWND(above as *mut _);
            if IsWindow(Some(above)).as_bool() {
                let _ = SetWindowPos(h, Some(above), 0, 0, 0, 0, KEEP_PLACE);
            }
        }
    }
}
