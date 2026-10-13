//! Window management IPC: the frontend gets live snapshots via the
//! `apps://running-changed` event; these commands cover hydrate + actions.

use serde::Deserialize;
use tauri::{State, WebviewWindow};

use crate::core::settings::SettingsStore;
use crate::platform::windows::{accessibility, genie, running};

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

/// The dock icon a window is going into or coming out of, as the page measured
/// it: CSS pixels from the top left of the dock window.
#[derive(Debug, Clone, Copy, Deserialize)]
pub struct IconRect {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
}

/// Where the icon is on the screen, in physical pixels, given where the dock
/// window's page starts and how big its pixels are.
fn on_screen(icon: IconRect, origin: (i32, i32), scale: f64) -> genie::Area {
    genie::Area {
        x: origin.0 as f32 + (icon.x * scale) as f32,
        y: origin.1 as f32 + (icon.y * scale) as f32,
        w: (icon.width * scale) as f32,
        h: (icon.height * scale) as f32,
    }
}

#[tauri::command]
pub fn toggle_window(
    window: WebviewWindow,
    store: State<'_, SettingsStore>,
    hwnd: isize,
    target: Option<IconRect>,
) {
    let settings = store.get();
    let still = accessibility::effective(&settings.accessibility.reduce_motion, accessibility::read().reduce_motion);
    let effect = genie::Effect::parse(&settings.dock.minimize_effect);
    let plan = match (target, effect, still) {
        (Some(icon), Some(effect), false) => window
            .inner_position()
            .ok()
            .zip(window.scale_factor().ok())
            .map(|(p, scale)| (on_screen(icon, (p.x, p.y), scale), effect)),
        _ => None,
    };
    running::toggle_window(hwnd, plan);
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

/// End the programs that own these windows at once, as Task Manager's End Task does. Returns the names of the
/// programs ended. The shell's own windows are asked to close instead (see `endtask`).
#[tauri::command]
pub fn end_task(hwnds: Vec<isize>) -> crate::core::AeroResult<Vec<String>> {
    let ended = crate::platform::windows::endtask::end_windows(&hwnds);
    for hwnd in &ended.asked {
        running::close_window(*hwnd);
    }
    if ended.names.is_empty() && ended.asked.is_empty() && !ended.refused.is_empty() {
        return Err(crate::core::AeroError::other(format!(
            "Windows would not end {} (it may be running as administrator)",
            ended.refused.join(", ")
        )));
    }
    Ok(ended.names)
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
pub fn hide_window_previews(window: tauri::WebviewWindow) -> crate::core::AeroResult<()> {
    // the previews drawn into the window that asked, and no one else's
    let hwnd = window.hwnd()?;
    crate::platform::windows::thumbnails::hide_for(windows::Win32::Foundation::HWND(hwnd.0));
    // a closing flyout must never leave a window pulled to the front
    crate::platform::windows::peek::stop();
    Ok(())
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_icon_is_put_on_the_screen_from_the_page_it_was_measured_in() {
        // a dock window at (1920, 1000) on a 150% display: a 40 px icon at (100, 8)
        let at = on_screen(IconRect { x: 100.0, y: 8.0, width: 40.0, height: 40.0 }, (1920, 1000), 1.5);
        assert_eq!((at.x, at.y, at.w, at.h), (2070.0, 1012.0, 60.0, 60.0));
    }
}
