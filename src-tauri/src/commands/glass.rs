//! Real frosted glass for the dock, the menu bar and the frame: what is behind
//! them blurred by Windows (see `platform::windows::backdrop`).
//!
//! The menu bar's shape is known here, from its settings. The dock bar's is
//! only known to its page, which says where the bar is within the window
//! (`report_dock_bar`); the window itself may be moved around, so what is kept
//! is that position within the window, and the screen position is worked out
//! afresh each time it is needed. The frame's ring is a window of exactly the
//! right shape already, so it just has the blur switched on.
//!
//! Everything here runs on the main thread, which owns the windows.

use std::collections::HashMap;

use parking_lot::Mutex;
use tauri::{AppHandle, Manager, WebviewWindow};
use windows::Win32::Foundation::{HWND, RECT};
use windows::Win32::UI::WindowsAndMessaging::{GetWindowRect, IsWindow, IsWindowVisible};

use crate::core::settings::SettingsStore;
use crate::core::AeroResult;
use crate::platform::windows::backdrop;
use crate::platform::windows::monitors::Rect;

/// Where a dock's bar is within its window, in physical pixels, and its
/// corner radius, while it is on screen.
#[derive(Debug, Clone, Copy, PartialEq)]
struct Bar {
    rel: Rect,
    radius: i32,
    shown: bool,
}

/// The docks' bars by dock window handle.
static BARS: Mutex<Option<HashMap<isize, Bar>>> = Mutex::new(None);

/// Whether blur was last switched on or off on each frame ring, so a repeat is
/// not asked of the system again.
static RINGS: Mutex<Option<HashMap<isize, bool>>> = Mutex::new(None);

fn hwnd_of(window: &WebviewWindow) -> Option<HWND> {
    window.hwnd().ok().map(|h| HWND(h.0))
}

fn pane_id_for_dock(hwnd: isize) -> String {
    format!("dock-{hwnd:x}")
}

/// What a dock's page reports about its bar, in the page's own pixels.
#[derive(Debug, Clone, Copy, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BarReport {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
    pub radius: f64,
    /// False once the bar has slid away, or the dock is going.
    pub shown: bool,
}

/// A dock's page says where its bar is, or that it has slid away or gone.
#[tauri::command]
pub fn report_dock_bar(app: AppHandle, window: WebviewWindow, bar: BarReport) -> AeroResult<()> {
    let BarReport { x, y, width, height, radius, shown } = bar;
    let Some(hwnd) = hwnd_of(&window) else { return Ok(()) };
    let scale = window.scale_factor().unwrap_or(1.0);
    let px = |v: f64| (v * scale).round() as i32;
    let bar = Bar {
        rel: Rect { x: px(x), y: px(y), width: px(width), height: px(height) },
        radius: px(radius.max(0.0)),
        shown: shown && width >= 1.0 && height >= 1.0,
    };
    let key = hwnd.0 as isize;
    let changed = {
        let mut guard = BARS.lock();
        let bars = guard.get_or_insert_with(HashMap::new);
        bars.insert(key, bar) != Some(bar)
    };
    if changed {
        // placed on the main thread, which owns the panes
        let handle = app.clone();
        let _ = app.run_on_main_thread(move || sync_all(&handle));
    }
    Ok(())
}

/// Where each dock's bar is on screen now, in physical pixels (only those that are showing).
pub fn dock_bar_rects() -> Vec<RECT> {
    let bars: HashMap<isize, Bar> = BARS.lock().clone().unwrap_or_default();
    let mut out = Vec::new();
    for (key, bar) in bars {
        let hwnd = HWND(key as *mut _);
        let mut at = RECT::default();
        if bar.shown
            && unsafe { IsWindow(Some(hwnd)).as_bool() }
            && unsafe { IsWindowVisible(hwnd).as_bool() }
            && unsafe { GetWindowRect(hwnd, &mut at) }.is_ok()
        {
            out.push(RECT {
                left: at.left + bar.rel.x,
                top: at.top + bar.rel.y,
                right: at.left + bar.rel.x + bar.rel.width,
                bottom: at.top + bar.rel.y + bar.rel.height,
            });
        }
    }
    out
}

/// Make every pane and every blur match the settings and where the windows
/// are now. Cheap when nothing moved: each pane remembers what it was last
/// given. Main thread.
pub fn sync_all(app: &AppHandle) {
    let settings = app.state::<SettingsStore>().get();
    // not while transparency is to be reduced, by the setting or by Windows
    let reduce = crate::platform::windows::accessibility::effective(
        &settings.accessibility.reduce_transparency,
        crate::platform::windows::accessibility::read().reduce_transparency,
    );
    let on = settings.appearance.real_blur && !reduce;

    // ---- the menu bar ----
    let bar_pane = "menubar";
    let mut wanted_bar = None;
    if on && settings.menu_bar.enabled {
        if let Some(window) = app.get_webview_window(crate::commands::menubar::LABEL) {
            if let Some(hwnd) = hwnd_of(&window) {
                let mut at = RECT::default();
                let visible = unsafe { IsWindowVisible(hwnd).as_bool() };
                if visible && unsafe { GetWindowRect(hwnd, &mut at) }.is_ok() {
                    let scale = window.scale_factor().unwrap_or(1.0);
                    let gap = (settings.menu_bar.gap as f64 * scale).round() as i32;
                    let height = (settings.menu_bar.height as f64 * scale).round() as i32;
                    let radius = (settings.menu_bar.corner_radius as f64 * scale).round() as i32;
                    let rect = Rect {
                        x: at.left + gap,
                        y: at.top + gap,
                        width: (at.right - at.left) - 2 * gap,
                        height,
                    };
                    wanted_bar = Some((hwnd, (rect, radius, gap == 0)));
                }
            }
        }
    }
    match wanted_bar {
        Some((hwnd, shape)) => backdrop::set_pane(bar_pane, hwnd, Some(shape)),
        None => {
            // no window to sit under now; hide whatever pane there was
            backdrop::set_pane(bar_pane, HWND::default(), None);
        }
    }

    // ---- the Start menu ----
    let mut wanted_start = None;
    if on {
        if let Some(window) = app.get_webview_window(crate::commands::start::LABEL) {
            if let Some(hwnd) = hwnd_of(&window) {
                let mut at = RECT::default();
                if unsafe { IsWindowVisible(hwnd).as_bool() } && unsafe { GetWindowRect(hwnd, &mut at) }.is_ok() {
                    let scale = window.scale_factor().unwrap_or(1.0);
                    // the panel is the window less the room left round it for its shadow
                    let m = (crate::commands::start::MARGIN * scale).round() as i32;
                    let rect = Rect {
                        x: at.left + m,
                        y: at.top + m,
                        width: (at.right - at.left) - 2 * m,
                        height: (at.bottom - at.top) - 2 * m,
                    };
                    let radius = (crate::commands::start::RADIUS * scale).round() as i32;
                    wanted_start = Some((hwnd, (rect, radius, false)));
                }
            }
        }
    }
    match wanted_start {
        Some((hwnd, shape)) => backdrop::set_pane("start", hwnd, Some(shape)),
        None => backdrop::set_pane("start", HWND::default(), None),
    }

    // ---- the docks ----
    let bars: HashMap<isize, Bar> = BARS.lock().clone().unwrap_or_default();
    let mut gone = Vec::new();
    for (key, bar) in &bars {
        let hwnd = HWND(*key as *mut _);
        let alive = unsafe { IsWindow(Some(hwnd)).as_bool() };
        if !alive {
            gone.push(*key);
            continue;
        }
        let id = pane_id_for_dock(*key);
        let mut at = RECT::default();
        let showing = on
            && bar.shown
            && unsafe { IsWindowVisible(hwnd).as_bool() }
            && unsafe { GetWindowRect(hwnd, &mut at) }.is_ok();
        if showing {
            let rect = Rect { x: at.left + bar.rel.x, y: at.top + bar.rel.y, ..bar.rel };
            backdrop::set_pane(&id, hwnd, Some((rect, bar.radius, false)));
        } else {
            backdrop::set_pane(&id, hwnd, None);
        }
    }
    if !gone.is_empty() {
        let mut guard = BARS.lock();
        if let Some(map) = guard.as_mut() {
            for key in gone {
                map.remove(&key);
                backdrop::drop_pane(&pane_id_for_dock(key));
            }
        }
    }

    // ---- the frame ----
    for window in app.webview_windows().into_values() {
        let label = window.label();
        if label.starts_with("frame-") {
            if let Some(hwnd) = hwnd_of(&window) {
                let want = on && settings.frame.enabled;
                let mut guard = RINGS.lock();
                let rings = guard.get_or_insert_with(HashMap::new);
                if rings.insert(hwnd.0 as isize, want) != Some(want) {
                    backdrop::set_blur(hwnd, want);
                }
            }
        }
    }
}

/// Queue [`sync_all`] on the main thread, from anywhere.
pub fn sync_later(app: &AppHandle) {
    let handle = app.clone();
    let _ = app.run_on_main_thread(move || sync_all(&handle));
}
