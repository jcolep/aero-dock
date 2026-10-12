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
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use tauri::{AppHandle, Manager, WebviewWindow};
use windows::Win32::Foundation::{HWND, RECT};
use windows::Win32::UI::HiDpi::GetDpiForWindow;
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

/// Whether the blur was last found to be on, and when.
static BLUR_CACHE: Mutex<Option<(Instant, bool)>> = Mutex::new(None);

/// Where the Start menu's panel is within its window, in physical pixels, as it is now
/// (it moves while it opens and closes), and whether the blur should be behind it.
#[derive(Debug, Clone, Copy, PartialEq)]
struct StartPane {
    x: i32,
    y: i32,
    width: i32,
    height: i32,
    radius: i32,
    shown: bool,
}

static START: Mutex<Option<StartPane>> = Mutex::new(None);

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
    /// How many physical pixels the page's pixel is (its `devicePixelRatio`), which is
    /// right for the screen the page is on at this moment; the window's own idea of its
    /// scale can be that of another screen for a while after it has been moved.
    #[serde(default)]
    pub dpr: Option<f64>,
}

/// A dock's page says where its bar is, or that it has slid away or gone.
#[tauri::command]
pub fn report_dock_bar(app: AppHandle, window: WebviewWindow, bar: BarReport) -> AeroResult<()> {
    let BarReport { x, y, width, height, radius, shown, dpr } = bar;
    let Some(hwnd) = hwnd_of(&window) else { return Ok(()) };
    let scale = dpr.filter(|d| *d > 0.1).unwrap_or_else(|| dpi_scale(hwnd));
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
        // placed on the main thread, which owns the panes. Only this dock's pane is looked at:
        // the page reports at every frame while the bar is on the move, and everything
        // else (the menu bar, the frame, the settings) has not changed
        let handle = app.clone();
        let _ = app.run_on_main_thread(move || sync_dock(&handle, key));
    }
    Ok(())
}

/// How many physical pixels a logical one is on the screen a window is on now (the
/// system's answer, not what the window toolkit last remembered).
pub fn dpi_scale(hwnd: HWND) -> f64 {
    let dpi = unsafe { GetDpiForWindow(hwnd) };
    if dpi == 0 { 1.0 } else { dpi as f64 / 96.0 }
}

/// Whether the blur is on: the setting, and not while transparency is to be reduced. Looked
/// up at most twice a second, since the dock's reports come at every frame of an animation.
fn blur_on(app: &AppHandle) -> bool {
    let mut cache = BLUR_CACHE.lock();
    if let Some((at, on)) = *cache {
        if at.elapsed() < Duration::from_millis(500) {
            return on;
        }
    }
    let settings = app.state::<SettingsStore>().get();
    let reduce = crate::platform::windows::accessibility::effective(
        &settings.accessibility.reduce_transparency,
        crate::platform::windows::accessibility::read().reduce_transparency,
    );
    let on = settings.appearance.real_blur && !reduce;
    *cache = Some((Instant::now(), on));
    on
}

/// One dock's pane, to match where its bar is now. Main thread.
fn sync_dock(app: &AppHandle, key: isize) {
    let Some(bar) = BARS.lock().as_ref().and_then(|m| m.get(&key).copied()) else { return };
    apply_dock(key, &bar, blur_on(app));
}

/// Place or take away a dock's pane. The pane is one pixel inside the bar all round: the
/// bar's own edge is smooth and the pane's is not, so at the bar's exact edge the pane
/// shows as a pale fringe.
fn apply_dock(key: isize, bar: &Bar, on: bool) {
    let hwnd = HWND(key as *mut _);
    let id = pane_id_for_dock(key);
    let mut at = RECT::default();
    let showing = on
        && bar.shown
        && unsafe { IsWindow(Some(hwnd)).as_bool() }
        && unsafe { IsWindowVisible(hwnd).as_bool() }
        && unsafe { GetWindowRect(hwnd, &mut at) }.is_ok();
    if showing {
        let rect = Rect {
            x: at.left + bar.rel.x + 1,
            y: at.top + bar.rel.y + 1,
            width: bar.rel.width - 2,
            height: bar.rel.height - 2,
        };
        backdrop::set_pane(&id, hwnd, Some((rect, (bar.radius - 1).max(0), false)));
    } else {
        backdrop::set_pane(&id, hwnd, None);
    }
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
    // what the reports that come at every frame use, so they need not look it up again
    *BLUR_CACHE.lock() = Some((Instant::now(), on));

    // ---- the menu bar ----
    let bar_pane = "menubar";
    let mut wanted_bar = None;
    if on && settings.menu_bar.enabled {
        if let Some(window) = app.get_webview_window(crate::commands::menubar::LABEL) {
            if let Some(hwnd) = hwnd_of(&window) {
                let mut at = RECT::default();
                let visible = unsafe { IsWindowVisible(hwnd).as_bool() };
                if visible && unsafe { GetWindowRect(hwnd, &mut at) }.is_ok() {
                    let scale = dpi_scale(hwnd);
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
    sync_start(app);

    // ---- the docks ----
    let bars: HashMap<isize, Bar> = BARS.lock().clone().unwrap_or_default();
    let mut gone = Vec::new();
    for (key, bar) in &bars {
        if unsafe { !IsWindow(Some(HWND(*key as *mut _))).as_bool() } {
            gone.push(*key);
            continue;
        }
        apply_dock(*key, bar, on);
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

/// What the Start menu's page says about its panel: where it is now within the window, in
/// physical pixels, its corner radius, and whether it is solid enough for a blur to go behind.
#[derive(Debug, Clone, Copy, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StartPaneReport {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
    pub radius: f64,
    pub shown: bool,
}

/// The Start menu's page says where its panel is. The page says so at every frame while the
/// panel is on the move (it opens and closes by sliding, swelling or pouring), so that the
/// blur behind it is the panel's own shape at every moment and not a rectangle left at the
/// place it comes to rest.
#[tauri::command]
pub fn report_start_pane(app: AppHandle, report: StartPaneReport) {
    let pane = StartPane {
        x: report.x.round() as i32,
        y: report.y.round() as i32,
        width: report.width.round() as i32,
        height: report.height.round() as i32,
        radius: report.radius.round().max(0.0) as i32,
        shown: report.shown && report.width >= 1.0 && report.height >= 1.0,
    };
    let changed = {
        let mut guard = START.lock();
        let old = guard.replace(pane);
        old != Some(pane)
    };
    if changed {
        let handle = app.clone();
        let _ = app.run_on_main_thread(move || sync_start(&handle));
    }
}

/// The Start menu is going: no blur is left behind it.
pub fn forget_start_pane(app: &AppHandle) {
    if let Some(pane) = START.lock().as_mut() {
        pane.shown = false;
    }
    sync_later(app);
}

/// Where the Start menu's pane goes on the screen, given where its window is: the panel's
/// place within the window, less what the window does not show (the panel slides out of it
/// while it opens and closes), and one pixel in all round, because the panel's edge is smooth
/// and the pane's is not. None when too little is left to be worth a pane.
fn start_pane_rect(window: RECT, pane: &StartPane) -> Option<Rect> {
    // the window has no frame, so its top left is the page's
    let left = (window.left + pane.x).max(window.left);
    let top = (window.top + pane.y).max(window.top);
    let right = (window.left + pane.x + pane.width).min(window.right);
    let bottom = (window.top + pane.y + pane.height).min(window.bottom);
    let rect = Rect { x: left + 1, y: top + 1, width: right - left - 2, height: bottom - top - 2 };
    (rect.width > 4 && rect.height > 4).then_some(rect)
}

/// Put the Start menu's pane where its panel is, or take it away. Main thread.
fn sync_start(app: &AppHandle) {
    let pane = *START.lock();
    let window = app.get_webview_window(crate::commands::start::LABEL);
    let hwnd = window.as_ref().and_then(hwnd_of);
    let mut at = RECT::default();
    if let (Some(pane), Some(hwnd)) = (pane, hwnd) {
        if pane.shown
            && blur_on(app)
            && unsafe { IsWindowVisible(hwnd).as_bool() }
            && unsafe { GetWindowRect(hwnd, &mut at) }.is_ok()
        {
            if let Some(rect) = start_pane_rect(at, &pane) {
                backdrop::set_pane("start", hwnd, Some((rect, (pane.radius - 1).max(0), false)));
                return;
            }
        }
    }
    backdrop::set_pane("start", HWND::default(), None);
}

#[cfg(test)]
mod tests {
    use super::*;

    fn window() -> RECT {
        RECT { left: 1000, top: 200, right: 1760, bottom: 1000 }
    }

    fn pane(x: i32, y: i32, width: i32, height: i32) -> StartPane {
        StartPane { x, y, width, height, radius: 24, shown: true }
    }

    #[test]
    fn the_start_pane_is_the_panel_one_pixel_in() {
        let rect = start_pane_rect(window(), &pane(48, 48, 664, 704)).expect("a pane");
        assert_eq!((rect.x, rect.y, rect.width, rect.height), (1049, 249, 662, 702));
    }

    #[test]
    fn what_the_window_does_not_show_the_pane_does_not_either() {
        // the panel sliding out of the bottom of its window
        let rect = start_pane_rect(window(), &pane(48, 600, 664, 704)).expect("a pane");
        assert_eq!(rect.y + rect.height + 1, 1000, "it stops at the window''s bottom");
        // and with nothing of it left inside: no pane
        assert!(start_pane_rect(window(), &pane(48, 805, 664, 704)).is_none(), "nothing left to blur");
    }

    #[test]
    fn a_pane_too_small_to_see_is_not_made() {
        assert!(start_pane_rect(window(), &pane(48, 48, 5, 5)).is_none());
        assert!(start_pane_rect(window(), &pane(48, 48, 0, 0)).is_none());
    }
}
