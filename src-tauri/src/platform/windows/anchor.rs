//! Windows that are never shown, to hold appbar strips.
//!
//! An appbar belongs to a window and claims one edge, so the frame, which
//! claims all four edges of every monitor, needs four windows per monitor
//! to register them with. These are bare popups: no content, no taskbar
//! button, never visible. They have to be made on the thread that pumps
//! messages (the main one), because the shell talks to a registered window.

use std::sync::Once;

use windows::core::w;
use windows::Win32::Foundation::{HINSTANCE, HWND, LPARAM, LRESULT, WPARAM};
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, RegisterClassW, WNDCLASSW, WS_EX_NOACTIVATE,
    WS_EX_TOOLWINDOW, WS_POPUP,
};

static REGISTER: Once = Once::new();

unsafe extern "system" fn proc(hwnd: HWND, msg: u32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
    unsafe { DefWindowProcW(hwnd, msg, wparam, lparam) }
}

/// Make one. None if the system refuses.
pub fn create() -> Option<HWND> {
    unsafe {
        let instance = HINSTANCE(GetModuleHandleW(None).ok()?.0);
        REGISTER.call_once(|| {
            let class = WNDCLASSW {
                lpfnWndProc: Some(proc),
                hInstance: instance,
                lpszClassName: w!("AeroDockFrameAnchor"),
                ..Default::default()
            };
            RegisterClassW(&class);
        });
        CreateWindowExW(
            WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE,
            w!("AeroDockFrameAnchor"),
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
        .ok()
    }
}

/// Destroy one made by [`create`].
pub fn destroy(hwnd: HWND) {
    unsafe {
        let _ = DestroyWindow(hwnd);
    }
}
