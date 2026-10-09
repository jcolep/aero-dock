//! Mission Control: every window of the screen the pointer is on, laid out as a
//! grid of live thumbnails on a dimmed backdrop, to pick one from or to type to
//! find.
//!
//! The overview is a window of its own, as large as the monitor, built the first
//! time it is asked for and kept (hidden) after that so that it opens at once.
//! The page lays out the cards and animates them from where the real windows
//! are; this side supplies the monitor, where each window is (`window_rects`)
//! and the live pictures themselves, which are drawn by the compositor into this
//! window (see `platform::windows::thumbnails`), so nothing is copied.
//!
//! Unlike the bars, this window takes the keyboard: it exists to be typed into
//! and to be left with Escape.

use serde::Serialize;
use tauri::{AppHandle, Emitter, Manager, WebviewWindow};
use windows::Win32::Foundation::{HWND, POINT, RECT};
use windows::Win32::Graphics::Dwm::{DwmGetWindowAttribute, DWMWA_EXTENDED_FRAME_BOUNDS};
use windows::Win32::UI::WindowsAndMessaging::{GetCursorPos, GetForegroundWindow, GetWindowRect, IsIconic};

use crate::commands::dock::on_main_thread;
use crate::core::{AeroError, AeroResult};
use crate::platform::windows::dock_window;
use crate::platform::windows::monitors::{enumerate_monitors, MonitorInfoEx};
use crate::platform::windows::thumbnails;

pub const LABEL: &str = "mission";

/// The event the page waits for, with the monitor and who had the keyboard.
const OPEN_EVENT: &str = "mission://open";

/// What the page is told when the overview opens.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct Opening {
    /// The monitor's device name, to pick out its windows.
    monitor: String,
    /// The monitor's place and size, in physical pixels.
    x: i32,
    y: i32,
    width: i32,
    height: i32,
    scale: f64,
    /// The window that had the keyboard before, as a raw handle, so Escape can give it back.
    previous: i64,
}

/// The monitor that holds a point, or the first one if none does.
pub fn monitor_containing(monitors: &[MonitorInfoEx], x: i32, y: i32) -> Option<&MonitorInfoEx> {
    monitors
        .iter()
        .find(|m| {
            x >= m.bounds.x && x < m.bounds.x + m.bounds.width && y >= m.bounds.y && y < m.bounds.y + m.bounds.height
        })
        .or_else(|| monitors.first())
}

fn visible(window: &WebviewWindow) -> bool {
    window.is_visible().unwrap_or(false)
}

/// Open the overview if it is closed, close it if it is open.
pub async fn toggle(app: &AppHandle) {
    if app.get_webview_window(LABEL).is_some_and(|w| visible(&w)) {
        close(app);
        return;
    }
    if let Err(e) = open(app).await {
        log::warn!("could not open the window overview: {e}");
    }
}

/// Build the window, hidden, set up like the bars' (transparent, no title bar).
async fn build(app: &AppHandle) -> AeroResult<WebviewWindow> {
    let builder = tauri::WebviewWindowBuilder::new(app, LABEL, tauri::WebviewUrl::App("index.html?window=mission".into()))
        .title("")
        .inner_size(1280.0, 720.0)
        .transparent(true)
        .decorations(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .resizable(false)
        .maximizable(false)
        .minimizable(false)
        .shadow(false)
        .visible(false);
    #[cfg(windows)]
    let builder = match crate::commands::settings::dock_browser_args(app) {
        Some(args) => builder.additional_browser_args(&args),
        None => builder,
    };
    Ok(builder.build()?)
}

async fn open(app: &AppHandle) -> AeroResult<()> {
    let monitors = enumerate_monitors()?;
    let mut at = POINT::default();
    let pointer = unsafe { GetCursorPos(&mut at) }.is_ok();
    let monitor = if pointer { monitor_containing(&monitors, at.x, at.y) } else { monitors.first() }
        .ok_or_else(|| AeroError::other("no monitor to show the overview on"))?
        .clone();
    if app.get_webview_window(LABEL).is_none() {
        build(app).await?;
    }
    let handle = app.clone();
    on_main_thread(app, move || place_and_show(&handle, &monitor)).await?
}

/// Put the window over the monitor, show it and give it the keyboard. Main thread.
fn place_and_show(app: &AppHandle, monitor: &MonitorInfoEx) -> AeroResult<()> {
    let window = app.get_webview_window(LABEL).ok_or_else(|| AeroError::other("the overview window is missing"))?;
    let hwnd = HWND(window.hwnd()?.0);
    // whoever has the keyboard now, before the overview takes it
    let previous = unsafe { GetForegroundWindow() }.0 as isize as i64;
    // no title bar, and not one of the windows that refuses to be activated
    dock_window::keep_caption_off(hwnd);
    dock_window::set_no_activate(hwnd, false)?;
    let b = monitor.bounds;
    dock_window::set_bounds(hwnd, b.x, b.y, b.width, b.height)?;
    window.show()?;
    // above the bars, which are always on top too
    window.set_always_on_top(true)?;
    window.set_focus()?;
    let _ = app.emit_to(
        LABEL,
        OPEN_EVENT,
        Opening { monitor: monitor.name.clone(), x: b.x, y: b.y, width: b.width, height: b.height, scale: monitor.scale, previous },
    );
    Ok(())
}

/// Close the overview: its live pictures first, then the window.
pub fn close(app: &AppHandle) {
    let Some(window) = app.get_webview_window(LABEL) else { return };
    if let Ok(hwnd) = window.hwnd() {
        thumbnails::hide_for(HWND(hwnd.0));
    }
    let _ = window.hide();
}

/// Open or close the overview, from the Aero menu.
#[tauri::command]
pub async fn toggle_mission(app: AppHandle) -> AeroResult<()> {
    toggle(&app).await;
    Ok(())
}

/// The page is done (a window was chosen, or Escape).
#[tauri::command]
pub fn close_mission(app: AppHandle) {
    close(&app);
}

/// Where a window is on screen, in physical pixels.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WindowRect {
    pub hwnd: isize,
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
}

/// The visible bounds of each window that has them: a minimised window has
/// none, and is left out.
#[tauri::command]
pub fn window_rects(hwnds: Vec<isize>) -> Vec<WindowRect> {
    let mut out = Vec::new();
    for hwnd in hwnds {
        let window = HWND(hwnd as *mut _);
        if unsafe { IsIconic(window) }.as_bool() {
            continue;
        }
        let mut r = RECT::default();
        // the frame as drawn (without the invisible borders), else the plain rectangle
        let drawn = unsafe {
            DwmGetWindowAttribute(
                window,
                DWMWA_EXTENDED_FRAME_BOUNDS,
                &mut r as *mut RECT as *mut _,
                std::mem::size_of::<RECT>() as u32,
            )
        }
        .is_ok();
        if !drawn && unsafe { GetWindowRect(window, &mut r) }.is_err() {
            continue;
        }
        if r.right > r.left && r.bottom > r.top {
            out.push(WindowRect { hwnd, x: r.left, y: r.top, width: r.right - r.left, height: r.bottom - r.top });
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::platform::windows::monitors::Rect;

    fn monitor(name: &str, x: i32, y: i32, width: i32, height: i32) -> MonitorInfoEx {
        let bounds = Rect { x, y, width, height };
        MonitorInfoEx { name: name.into(), bounds, work_area: bounds, scale: 1.0, is_primary: x == 0 }
    }

    #[test]
    fn the_overview_goes_on_the_monitor_the_pointer_is_on() {
        let monitors = vec![monitor("A", 0, 0, 1920, 1080), monitor("B", 1920, -165, 2560, 1440)];
        assert_eq!(monitor_containing(&monitors, 100, 100).map(|m| m.name.as_str()), Some("A"));
        assert_eq!(monitor_containing(&monitors, 3000, 700).map(|m| m.name.as_str()), Some("B"));
        // the shared edge belongs to the monitor that starts there
        assert_eq!(monitor_containing(&monitors, 1920, 0).map(|m| m.name.as_str()), Some("B"));
        // a point on none of them is not left without an answer
        assert_eq!(monitor_containing(&monitors, -5000, 0).map(|m| m.name.as_str()), Some("A"));
        assert!(monitor_containing(&[], 0, 0).is_none());
    }

    #[test]
    fn a_window_with_no_handle_has_no_rectangle() {
        // a handle that is not a window gives nothing, rather than a made-up box
        assert!(window_rects(vec![0x7fff_ffff]).is_empty());
    }
}
