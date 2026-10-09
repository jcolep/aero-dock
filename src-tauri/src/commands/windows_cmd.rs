//! Window management IPC: the frontend gets live snapshots via the
//! `apps://running-changed` event; these commands cover hydrate + actions.

use crate::platform::windows::running;

#[tauri::command]
pub fn get_running() -> running::RunningSnapshot {
    running::snapshot()
}

#[tauri::command]
pub fn activate_window(hwnd: isize) {
    // restore the stacking order first, so activating starts from the
    // real one and not from a window that is only being peeked at
    crate::platform::windows::peek::stop();
    running::activate_window(hwnd);
}

#[tauri::command]
pub fn toggle_window(hwnd: isize) {
    running::toggle_window(hwnd);
}

#[tauri::command]
pub fn minimize_window(hwnd: isize) {
    running::minimize_window(hwnd);
}

#[tauri::command]
pub fn close_window(hwnd: isize) {
    running::close_window(hwnd);
}

// ---- the app menu in the menu bar: Hide, Hide Others, Show All, Quit ----

/// Every tracked window belonging to the program with this executable.
fn windows_of(exe: &str) -> Vec<isize> {
    running::snapshot()
        .windows
        .into_iter()
        .filter(|w| w.exe.eq_ignore_ascii_case(exe))
        .map(|w| w.hwnd)
        .collect()
}

/// Minimise every window of an app.
#[tauri::command]
pub fn hide_app(exe: String) {
    for hwnd in windows_of(&exe) {
        running::minimize_window(hwnd);
    }
}

/// Minimise every window that is not the app's own.
#[tauri::command]
pub fn hide_others(exe: String) {
    let keep = windows_of(&exe);
    for window in running::snapshot().windows {
        if !keep.contains(&window.hwnd) {
            running::minimize_window(window.hwnd);
        }
    }
}

/// Bring back every minimised window.
#[tauri::command]
pub fn show_all_apps() {
    for window in running::snapshot().windows {
        running::restore_window(window.hwnd);
    }
}

/// Ask every window of an app to close, the way its own close button does.
/// An app with unsaved work gets to ask about it first, as it would anyway.
#[tauri::command]
pub fn quit_app_windows(exe: String) {
    for hwnd in windows_of(&exe) {
        running::close_window(hwnd);
    }
}

/// Show live DWM previews at the given client-area rects (physical px), in
/// the dock window that asked: with a dock on each monitor, the preview has
/// to be drawn into the one the pointer is on.
#[tauri::command]
pub fn show_window_previews(
    window: tauri::WebviewWindow,
    slots: Vec<crate::platform::windows::thumbnails::PreviewSlot>,
) -> crate::core::AeroResult<()> {
    let hwnd = window.hwnd()?;
    crate::platform::windows::thumbnails::show(
        windows::Win32::Foundation::HWND(hwnd.0),
        &slots,
    )
}

#[tauri::command]
pub fn hide_window_previews() {
    crate::platform::windows::thumbnails::hide();
    // a closing flyout must never leave a window pulled to the front
    crate::platform::windows::peek::stop();
}

/// Show the real window behind a preview the pointer is on (`Some`), or put
/// it back (`None`).
#[tauri::command]
pub fn peek_window(hwnd: Option<isize>) {
    match hwnd {
        Some(hwnd) => crate::platform::windows::peek::start(hwnd),
        None => crate::platform::windows::peek::stop(),
    }
}
