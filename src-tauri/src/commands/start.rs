//! The Start menu: the panel the dock's search button opens, in liquid glass,
//! centred on the screen above the dock like Windows 11's.
//!
//! It is a window of its own, only as large as the panel and its shadow, built
//! the first time it is wanted and kept (hidden) after that so that it opens at
//! once. The page does the rest (the pinned apps, the list of all of them, the
//! search); this side supplies where to put the window, who is signed in, files
//! from Windows' index, and a way of noticing that the pointer has gone and
//! clicked somewhere else.
//!
//! Like the window overview it takes the keyboard (it exists to be typed into),
//! and gives it back to whoever had it when it is left with Escape.

use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::time::Duration;

use parking_lot::Mutex;
use serde::Serialize;
use tauri::{AppHandle, Emitter, Manager, WebviewWindow};
use windows::Win32::Foundation::{HWND, POINT, RECT};
use windows::Win32::UI::Input::KeyboardAndMouse::{GetAsyncKeyState, VK_LBUTTON, VK_MBUTTON, VK_RBUTTON};
use windows::Win32::UI::WindowsAndMessaging::{GetCursorPos, GetForegroundWindow, GetWindowRect};

use crate::commands::dock::on_main_thread;
use crate::commands::mission::monitor_containing;
use crate::core::{AeroError, AeroResult};
use crate::platform::windows::dock_window;
use crate::platform::windows::filesearch::{self, Found};
use crate::platform::windows::monitors::{enumerate_monitors, MonitorInfoEx};
use crate::platform::windows::profile::{self, Profile};

pub const LABEL: &str = "start";

/// The panel, in logical pixels. Windows 11's is a little over 640 by 700.
pub const PANEL_WIDTH: f64 = 664.0;
pub const PANEL_HEIGHT: f64 = 744.0;
/// Room around the panel for its shadow, in logical pixels.
pub const MARGIN: f64 = 48.0;
/// The panel's corner radius, in logical pixels.
pub const RADIUS: f64 = 24.0;
/// The space left between the panel and the edge of the screen or a bar.
const EDGE_GAP: f64 = 12.0;

const OPEN_EVENT: &str = "start://open";
const OUTSIDE_EVENT: &str = "start://outside";

/// What the page is told when the menu opens.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct Opening {
    /// The window that had the keyboard before, as a raw handle, so Escape can give it back.
    previous: i64,
}

/// Whoever had the keyboard before the menu took it.
static PREVIOUS: Mutex<isize> = Mutex::new(0);
/// Counts openings, so the thread that watches for a click elsewhere knows when it is out of date.
static GENERATION: AtomicU64 = AtomicU64::new(0);
/// The page has been told to close and is playing its closing animation. A second ask to
/// close (the dock's search button, clicked to dismiss it, arrives just after the click
/// elsewhere was noticed) must not cut that short by hiding the window at once.
static CLOSING: AtomicBool = AtomicBool::new(false);

/// Where the window goes: the panel centred on the work area, resting above the
/// bottom of it and above any dock bar that lies along the bottom.
///
/// Everything is in physical pixels except the scale; `bars` are the docks' bars
/// on screen. Returns the window's rectangle (x, y, width, height).
pub fn place(work: (i32, i32, i32, i32), scale: f64, bars: &[RECT]) -> (i32, i32, i32, i32) {
    let (wx, wy, ww, wh) = work;
    let px = |v: f64| (v * scale).round() as i32;
    let margin = px(MARGIN);
    let gap = px(EDGE_GAP);
    let panel_w = px(PANEL_WIDTH).min(ww - 2 * gap).max(px(320.0));
    let mut bottom = wy + wh - gap;
    // a bar along the bottom (a dock that does not reserve its space) is not covered
    for b in bars {
        let across = b.left < wx + ww && b.right > wx;
        let low = (b.top + b.bottom) / 2 > wy + wh / 2;
        if across && low && b.top - gap < bottom {
            bottom = b.top - gap;
        }
    }
    let top_limit = wy + gap;
    let panel_h = px(PANEL_HEIGHT).min(bottom - top_limit).max(px(300.0));
    let win_w = panel_w + 2 * margin;
    let win_h = panel_h + 2 * margin;
    let x = wx + (ww - win_w) / 2;
    let y = bottom - panel_h - margin;
    (x, y, win_w, win_h)
}

fn visible(window: &WebviewWindow) -> bool {
    window.is_visible().unwrap_or(false)
}

/// Open the menu if it is closed, close it if it is open. Closing is asked of the
/// page, which plays its closing animation and then hides the window.
pub async fn toggle(app: &AppHandle) {
    if app.get_webview_window(LABEL).is_some_and(|w| visible(&w)) {
        if !CLOSING.swap(true, Ordering::SeqCst) {
            let _ = app.emit_to(LABEL, OUTSIDE_EVENT, ());
        }
        return;
    }
    if let Err(e) = open(app).await {
        log::warn!("could not open the Start menu: {e}");
    }
}

async fn build(app: &AppHandle) -> AeroResult<WebviewWindow> {
    let builder = tauri::WebviewWindowBuilder::new(app, LABEL, tauri::WebviewUrl::App("index.html?window=start".into()))
        .title("")
        .inner_size(PANEL_WIDTH + 2.0 * MARGIN, PANEL_HEIGHT + 2.0 * MARGIN)
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
        .ok_or_else(|| AeroError::other("no monitor to show the Start menu on"))?
        .clone();
    if app.get_webview_window(LABEL).is_none() {
        build(app).await?;
    }
    // an open menu of the bar's is closed first: there is one thing at a time
    let _ = app.emit_to(crate::commands::menubar::LABEL, "menubar://outside", ());
    let handle = app.clone();
    on_main_thread(app, move || place_and_show(&handle, &monitor)).await?
}

fn place_and_show(app: &AppHandle, monitor: &MonitorInfoEx) -> AeroResult<()> {
    let window = app.get_webview_window(LABEL).ok_or_else(|| AeroError::other("the Start window is missing"))?;
    let hwnd = HWND(window.hwnd()?.0);
    let previous = unsafe { GetForegroundWindow() };
    *PREVIOUS.lock() = previous.0 as isize;
    CLOSING.store(false, Ordering::SeqCst);
    dock_window::keep_caption_off(hwnd);
    dock_window::set_no_activate(hwnd, false)?;

    let w = monitor.work_area;
    let bars: Vec<RECT> = crate::commands::glass::dock_bar_rects();
    let (x, y, width, height) = place((w.x, w.y, w.width, w.height), monitor.scale, &bars);
    dock_window::set_bounds(hwnd, x, y, width, height)?;
    window.show()?;
    window.set_always_on_top(true)?;
    window.set_focus()?;
    let _ = app.emit_to(LABEL, OPEN_EVENT, Opening { previous: previous.0 as isize as i64 });
    watch(app.clone(), hwnd, monitor.scale);
    Ok(())
}

/// Close the menu: hide the window, and with `restore` hand the keyboard back.
pub fn close(app: &AppHandle, restore: bool) {
    GENERATION.fetch_add(1, Ordering::SeqCst);
    CLOSING.store(false, Ordering::SeqCst);
    if let Some(window) = app.get_webview_window(LABEL) {
        let _ = window.hide();
    }
    if restore {
        let previous = *PREVIOUS.lock();
        if previous != 0 {
            crate::platform::windows::running::activate_window(previous);
        }
    }
}

fn button_down() -> bool {
    [VK_LBUTTON, VK_RBUTTON, VK_MBUTTON].iter().any(|k| unsafe { GetAsyncKeyState(k.0 as i32) } as u16 & 0x8000 != 0)
}

/// Whether a screen point is inside the panel (the window less its margin).
pub fn inside_panel(window: RECT, margin: i32, x: i32, y: i32) -> bool {
    x >= window.left + margin && x < window.right - margin && y >= window.top + margin && y < window.bottom - margin
}

/// While the menu is open, tell the page when a click lands anywhere else, or
/// when another window takes the keyboard, so that it can close as Windows'
/// does. This looks at the pointer's buttons a few dozen times a second for as
/// long as the menu is open and not at all otherwise (it needs no hook, so it
/// cannot get in the way of anything and cannot be left behind).
fn watch(app: AppHandle, window_handle: HWND, scale: f64) {
    // a handle is only a number, but the type that holds it cannot cross to another thread
    let hwnd_value = window_handle.0 as isize;
    let generation = GENERATION.fetch_add(1, Ordering::SeqCst) + 1;
    let margin = (MARGIN * scale).round() as i32;
    let _ = std::thread::Builder::new().name("start-watch".into()).spawn(move || {
        let hwnd = HWND(hwnd_value as *mut _);
        let started = std::time::Instant::now();
        let mut was_down = button_down();
        let mut told_at: Option<std::time::Instant> = None;
        loop {
            std::thread::sleep(Duration::from_millis(25));
            if GENERATION.load(Ordering::SeqCst) != generation {
                return;
            }
            let Some(window) = app.get_webview_window(LABEL) else { return };
            if !window.is_visible().unwrap_or(false) {
                return;
            }
            // told to close, by this thread or by a press of the button that opens it
            if told_at.is_none() && CLOSING.load(Ordering::SeqCst) {
                told_at = Some(std::time::Instant::now());
            }
            if let Some(at) = told_at {
                // the page was told and has not closed: it is not going to, so it is closed here
                if at.elapsed() > Duration::from_millis(1500) {
                    let handle = app.clone();
                    let _ = app.run_on_main_thread(move || close(&handle, false));
                    return;
                }
                continue;
            }
            let down = button_down();
            let mut outside = false;
            if down && !was_down {
                let mut at = POINT::default();
                let mut rect = RECT::default();
                if unsafe { GetCursorPos(&mut at) }.is_ok()
                    && unsafe { GetWindowRect(hwnd, &mut rect) }.is_ok()
                    && !inside_panel(rect, margin, at.x, at.y)
                {
                    outside = true;
                }
            }
            was_down = down;
            // the keyboard went to something else (Alt+Tab, a click on another program), once it has had time to arrive
            if !outside && started.elapsed() > Duration::from_millis(600) {
                let front = unsafe { GetForegroundWindow() };
                if front != hwnd && !front.0.is_null() {
                    outside = true;
                }
            }
            if outside {
                told_at = Some(std::time::Instant::now());
                CLOSING.store(true, Ordering::SeqCst);
                let _ = app.emit_to(LABEL, OUTSIDE_EVENT, ());
            }
        }
    });
}

/// Open or close the menu, from the dock's search button.
#[tauri::command]
pub async fn toggle_start(app: AppHandle) -> AeroResult<()> {
    toggle(&app).await;
    Ok(())
}

/// The page is done with the menu. `restore` hands the keyboard back to whoever had it.
#[tauri::command]
pub fn close_start(app: AppHandle, restore: bool) {
    close(&app, restore);
}

/// Who is signed in: their name and picture.
#[tauri::command]
pub async fn user_profile() -> Profile {
    tauri::async_runtime::spawn_blocking(profile::read).await.unwrap_or_default()
}

/// The newest things in the Downloads folder, newest first.
#[tauri::command]
pub async fn list_recent_downloads(limit: Option<usize>) -> Vec<crate::platform::windows::downloads::Download> {
    let limit = limit.unwrap_or(6).min(40);
    tauri::async_runtime::spawn_blocking(move || crate::platform::windows::downloads::recent(limit))
        .await
        .unwrap_or_default()
}

/// Files and folders from Windows' index that match what was typed.
#[tauri::command]
pub async fn search_files(query: String) -> Vec<Found> {
    // the index is asked from a thread of its own: its futures cannot move between the runtime's
    tauri::async_runtime::spawn_blocking(move || tauri::async_runtime::block_on(filesearch::search(&query, 8)))
        .await
        .unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn bar(left: i32, top: i32, right: i32, bottom: i32) -> RECT {
        RECT { left, top, right, bottom }
    }

    #[test]
    fn the_panel_is_centred_and_rests_above_the_bottom() {
        // a 1920 by 1040 work area on a 100% screen
        let (x, y, w, h) = place((0, 0, 1920, 1040), 1.0, &[]);
        assert_eq!(w, 664 + 96);
        assert_eq!(h, 744 + 96);
        assert_eq!(x + w / 2, 960, "centred");
        // the panel (the window less its margin) ends a gap above the work area's bottom
        assert_eq!(y + h - 48, 1040 - 12);
    }

    #[test]
    fn it_rests_above_a_dock_that_lies_along_the_bottom() {
        let dock = bar(700, 980, 1220, 1060);
        let (_, y, _, h) = place((0, 0, 1920, 1080), 1.0, &[dock]);
        assert_eq!(y + h - 48, 980 - 12);
        // a bar at the top of the screen is not in the way of the bottom
        let top = bar(0, 0, 1920, 30);
        let (_, y2, _, h2) = place((0, 0, 1920, 1080), 1.0, &[top]);
        assert_eq!(y2 + h2 - 48, 1080 - 12);
        // nor is one on another monitor
        let elsewhere = bar(2000, 980, 2500, 1060);
        let (_, y3, _, h3) = place((0, 0, 1920, 1080), 1.0, &[elsewhere]);
        assert_eq!(y3 + h3 - 48, 1080 - 12);
    }

    #[test]
    fn it_grows_with_the_screens_scale_and_shrinks_to_a_short_screen() {
        let (_, _, w, h) = place((0, 0, 3000, 1600), 1.5, &[]);
        assert_eq!(w, ((664.0f64 * 1.5).round() + (48.0f64 * 1.5).round() * 2.0) as i32);
        assert!(h > 744);
        // a screen too short for the whole panel gets a shorter one that still fits
        let (_, y, _, h) = place((0, 0, 1366, 600), 1.0, &[]);
        assert!(y >= 12 - 48, "the panel stays on screen");
        assert!(h < 744 + 96);
    }

    #[test]
    fn a_click_in_the_margin_is_outside_the_panel() {
        let window = RECT { left: 100, top: 100, right: 856, bottom: 936 };
        assert!(inside_panel(window, 48, 400, 400));
        assert!(!inside_panel(window, 48, 110, 400), "in the shadow");
        assert!(!inside_panel(window, 48, 400, 95));
        assert!(!inside_panel(window, 48, 900, 400));
    }
}
