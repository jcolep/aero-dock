//! Bringing the keyboard to a bar when its shortcut is pressed.
//!
//! The menu bar's window and the dock's are built never to take the keyboard,
//! so that clicking them does not take it from the app in use. For the length of
//! a keyboard visit that is turned off: the window is made one that can be
//! activated, takes the focus, and the page is told to start. It gives the
//! focus back and turns the protection on again when it is done (see
//! `set_dock_focusable`, which both pages call to do so).

use tauri::{AppHandle, Emitter, Manager};

use crate::platform::windows::hotkeys::Target;

/// The event the page waits for. Its payload is the window that had the keyboard
/// (a raw handle), or 0.
const ENTER: &str = "keyboard://enter";

/// Move the keyboard into the bar `target`. Main thread.
pub fn enter(app: &AppHandle, target: Target) {
    let label = match target {
        Target::MenuBar => crate::commands::menubar::LABEL,
        Target::Dock => crate::commands::dock::PRIMARY_LABEL,
        Target::Mission => {
            // not a visit to a bar: the overview of every window, which has its own
            // window to build, so it is opened off this thread
            let app = app.clone();
            tauri::async_runtime::spawn(async move { crate::commands::mission::toggle(&app).await });
            return;
        }
    };
    let Some(window) = app.get_webview_window(label) else { return };
    if !window.is_visible().unwrap_or(false) {
        return;
    }
    // whoever had the keyboard, so the page can give it back when it is done
    let before = unsafe { windows::Win32::UI::WindowsAndMessaging::GetForegroundWindow() };
    if let Ok(hwnd) = window.hwnd() {
        let _ = crate::platform::windows::dock_window::set_no_activate(
            windows::Win32::Foundation::HWND(hwnd.0),
            false,
        );
    }
    let _ = window.set_focus();
    let _ = app.emit_to(label, ENTER, before.0 as isize as i64);
}