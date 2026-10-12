//! Dock window geometry, for one dock or one per monitor. Each dock's
//! frontend measures its content (which changes with icon count, size, and
//! magnification headroom) and asks Rust to fit its OS window; Rust owns
//! edge/monitor math so a window always lands inside its monitor.
//!
//! The first dock is the window declared in `tauri.conf.json`, labelled
//! `dock`. With "a dock on every monitor" on, the others are built here at
//! run time, one per remaining monitor, labelled `dock-<monitor>`, and
//! closed again when the setting is turned off or the monitor goes away.

use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};

use parking_lot::Mutex;
use tauri::{AppHandle, Manager, WebviewWindow};

use crate::core::settings::{DockEdge, Settings, SettingsStore};
use crate::core::{AeroError, AeroResult};
use crate::platform::windows::appbar;
use crate::platform::windows::monitors::{enumerate_monitors, pick_monitor, MonitorInfoEx, Rect};

/// Glass border drawn around the dock on top of icons and padding (logical px).
const GLASS_BORDER: u32 = 2;

/// The dock declared in `tauri.conf.json`.
pub const PRIMARY_LABEL: &str = "dock";
/// Docks built at run time for the other monitors start with this.
const SECONDARY_PREFIX: &str = "dock-";

/// Whether a window label belongs to a dock (the first or an extra one).
pub fn is_dock_label(label: &str) -> bool {
    label == PRIMARY_LABEL || label.starts_with(SECONDARY_PREFIX)
}

/// Every dock window that exists right now.
pub fn dock_windows(app: &AppHandle) -> Vec<WebviewWindow> {
    app.webview_windows()
        .into_values()
        .filter(|w| is_dock_label(w.label()))
        .collect()
}

/// The label for the dock on a given monitor. Labels may only hold letters,
/// digits and a few symbols, and a device name like `\\.\DISPLAY2` holds
/// others, so those are dropped.
fn label_for_monitor(monitor_name: &str) -> String {
    let tail: String = monitor_name.chars().filter(|c| c.is_ascii_alphanumeric()).collect();
    format!("{SECONDARY_PREFIX}{tail}")
}

/// Last sizes requested by a dock's frontend, in logical pixels.
#[derive(Clone, Copy)]
struct Sizes {
    /// The OS window.
    window: (f64, f64),
    /// The part of the window that shows pixels and takes mouse input. Never
    /// larger than the window.
    visible: (f64, f64),
    /// Measured thickness of the dock bar itself across the dock axis, if
    /// the frontend has reported one yet.
    bar: Option<f64>,
}

impl Sizes {
    /// A sensible footprint for before the first measurement arrives.
    fn initial() -> Self {
        let footprint = (720.0, 160.0);
        Self {
            window: footprint,
            visible: footprint,
            bar: None,
        }
    }
}

#[derive(Default)]
pub struct DockGeometry {
    /// Sizes by window label.
    sizes: Mutex<HashMap<String, Sizes>>,
    /// Which monitor each extra dock was built for, by window label (device
    /// name). The first dock's monitor is a setting instead.
    monitors: Mutex<HashMap<String, String>>,
}

/// A dock's frontend reports its sizes; that window is resized and
/// repositioned.
///
/// The window is kept at its tallest so that opening a flyout never resizes
/// it (a resize makes the web view lag a frame behind, which shows as the
/// dock jumping). `visible_*` says how much of it is actually in use; the
/// rest is clipped away so it neither draws nor catches clicks. Omitted, the
/// whole window counts as visible.
#[tauri::command]
pub fn resize_dock(
    app: AppHandle,
    window: WebviewWindow,
    width: f64,
    height: f64,
    visible_width: Option<f64>,
    visible_height: Option<f64>,
    bar_thickness: Option<f64>,
) -> AeroResult<()> {
    let size = (width.max(1.0), height.max(1.0));
    let visible = (
        visible_width.unwrap_or(size.0).clamp(1.0, size.0),
        visible_height.unwrap_or(size.1).clamp(1.0, size.1),
    );
    let label = window.label().to_string();
    app.state::<DockGeometry>().sizes.lock().insert(
        label.clone(),
        Sizes {
            window: size,
            visible,
            // 0 means "not measured yet"
            bar: bar_thickness.filter(|t| *t >= 1.0),
        },
    );
    position_one(&app, &label)
}

/// Which monitor a dock window belongs on, by device name. `None` means the
/// primary one.
fn monitor_name_for(app: &AppHandle, label: &str, settings: &Settings) -> Option<String> {
    if label == PRIMARY_LABEL {
        settings.dock.monitor.clone()
    } else {
        app.state::<DockGeometry>().monitors.lock().get(label).cloned()
    }
}

/// The monitor the calling dock window is on, by device name, so its
/// frontend can pick out its own screen's windows.
#[tauri::command]
pub fn dock_monitor(app: AppHandle, window: WebviewWindow) -> AeroResult<String> {
    let settings = app.state::<SettingsStore>().get();
    let monitors = enumerate_monitors()?;
    let wanted = monitor_name_for(&app, window.label(), &settings);
    Ok(pick_monitor(&monitors, wanted.as_deref()).name.clone())
}

/// Run `f` on the main thread and wait for what it returns.
///
/// All window placement happens there. A dock's frontend reports its size
/// through a command, and commands run on the main thread, while a settings
/// change, a monitor change or the menu bar placing the docks around itself
/// all start on a worker. Two placements of one window at once can each read
/// the size the other is about to replace, and the older then finishes last,
/// leaving the window at a size nobody asked for: it was seen as a dock stuck
/// at its few-pixel hidden strip while its page believed it was open. On the
/// one thread they simply happen in order.
///
/// Waiting for the main thread from a worker is safe; what must never happen
/// is the main thread waiting for a worker, which is why this is `async`.
pub async fn on_main_thread<T: Send + 'static>(
    app: &AppHandle,
    f: impl FnOnce() -> T + Send + 'static,
) -> AeroResult<T> {
    let (tx, rx) = std::sync::mpsc::channel();
    app.run_on_main_thread(move || {
        let _ = tx.send(f());
    })
    .map_err(|e| AeroError::other(format!("could not reach the main thread: {e}")))?;
    tauri::async_runtime::spawn_blocking(move || rx.recv())
        .await
        .map_err(|e| AeroError::other(format!("main thread task failed: {e}")))?
        .map_err(|_| AeroError::other("the main thread dropped the request"))
}

/// Place every dock soon, on the main thread, without waiting. For callers
/// that have nothing to do after it.
pub fn position_dock_later(app: &AppHandle) {
    let handle = app.clone();
    let queued = app.run_on_main_thread(move || {
        if let Err(e) = position_dock(&handle) {
            log::warn!("could not place the docks: {e}");
        }
    });
    if let Err(e) = queued {
        log::warn!("could not queue the docks for placing: {e}");
    }
}

/// Recompute and apply every dock window's position from current settings.
/// Called on settings changes, display changes and taskbar changes. Meant to
/// run on the main thread (see [`on_main_thread`]).
pub fn position_dock(app: &AppHandle) -> AeroResult<()> {
    let mut first_error = None;
    for window in dock_windows(app) {
        if let Err(e) = position_one(app, window.label()) {
            log::warn!("could not place the {} window: {e}", window.label());
            first_error.get_or_insert(e);
        }
    }
    first_error.map_or(Ok(()), Err)
}

/// Place one dock window.
fn position_one(app: &AppHandle, label: &str) -> AeroResult<()> {
    let settings = app.state::<SettingsStore>().get();
    let sizes = app
        .state::<DockGeometry>()
        .sizes
        .lock()
        .get(label)
        .copied()
        .unwrap_or_else(Sizes::initial);
    let (logical_w, logical_h) = sizes.window;

    let monitors = enumerate_monitors()?;
    let wanted = monitor_name_for(app, label, &settings);
    let monitor = pick_monitor(&monitors, wanted.as_deref());

    let scale = monitor.scale;
    let margin = if settings.dock.floating {
        (settings.dock.floating_margin as f64 * scale).round() as i32
    } else {
        0
    };

    let w = (logical_w * scale).round() as i32;
    let h = (logical_h * scale).round() as i32;

    let window = app
        .get_webview_window(label)
        .ok_or_else(|| AeroError::other("dock window missing"))?;
    let hwnd = windows::Win32::Foundation::HWND(window.hwnd()?.0);
    crate::trace!("position_one: {label}");

    // Tauri puts a title bar's style bits back on a window at moments of its own (a
    // show, a change of focus or of always-on-top). The dock's window is much taller
    // than the dock and clipped to the part in use; the title would be drawn at the
    // top of it, out of sight, until something made the clip tall (a preview flyout
    // opening) and a strip reading "Aero Dock" appeared in the middle of the screen.
    // The window is made to refuse the style, as the menu bar's is.
    #[cfg(windows)]
    crate::platform::windows::dock_window::keep_caption_off(hwnd);

    // Reserve a strip for the visible dock (not the much taller window) so
    // maximised windows stop at it. The strip then stands in for the work
    // area when placing the dock, because the work area already excludes it.
    let reserved = if settings.dock.reserve_space && !settings.dock.auto_hide {
        // the measured bar when we have it; before the first report, the
        // icons-plus-padding estimate
        let visible = sizes.bar.unwrap_or(
            (settings.dock.icon_size + 2 * settings.dock.padding + GLASS_BORDER) as f64,
        );
        let thickness = (visible * scale).round() as i32 + margin;
        // With the menu bar along the top of this monitor, a dock at the top
        // starts below it, not on top of it.
        let mut bounds = monitor.bounds;
        if settings.dock.edge == DockEdge::Top {
            let inset = crate::commands::menubar::top_inset(&settings, &monitors, monitor);
            bounds.y += inset;
            bounds.height -= inset;
        }
        Some(appbar::reserve(
            hwnd,
            settings.dock.edge,
            bounds,
            thickness,
            // while the taskbar is kept hidden it must not influence where
            // the dock goes, even if it flashes up under the pointer
            settings.hide_taskbar,
            appbar::Owner::Dock,
            monitor.bounds,
        ))
    } else {
        appbar::release_window(hwnd);
        None
    };
    // A dock that reserves nothing sits against the work area. With the frame
    // on, the work area is inside the frame's margin, and the dock belongs on
    // the screen edge in front of it, below the menu bar if there is one.
    let unreserved = if appbar::frame_active((monitor.bounds.x, monitor.bounds.y)) {
        let inset = crate::commands::menubar::top_inset(&settings, &monitors, monitor);
        Rect {
            y: monitor.bounds.y + inset,
            height: monitor.bounds.height - inset,
            ..monitor.bounds
        }
    } else {
        monitor.work_area
    };
    let area = MonitorInfoEx {
        work_area: reserved.unwrap_or(unreserved),
        ..monitor.clone()
    };
    // The gap to the screen edge is inside the window (the frontend adds it
    // to the window's size and pads the bar in by it), so the window itself
    // goes right to the edge, and a pointer in the gap is still on the dock.
    // The strip reserved above still includes the gap.
    let (x, y) = place_on_edge(&area, settings.dock.edge, w, h, 0);

    // one call for both, so the window never shows its new size at its old
    // position (see `set_bounds`)
    crate::platform::windows::dock_window::set_bounds(hwnd, x, y, w, h)?;

    // clip to the in-use part, which hugs the dock's own screen edge
    let vw = ((sizes.visible.0 * scale).round() as i32).clamp(1, w);
    let vh = ((sizes.visible.1 * scale).round() as i32).clamp(1, h);
    let (rx, ry) = match settings.dock.edge {
        DockEdge::Bottom => (0, h - vh),
        DockEdge::Top | DockEdge::Left => (0, 0),
        DockEdge::Right => (w - vw, 0),
    };
    crate::platform::windows::dock_window::set_visible_region(hwnd, rx, ry, vw, vh)
}

/// Pure placement math: center the dock along the chosen work-area edge.
fn place_on_edge(
    monitor: &MonitorInfoEx,
    edge: DockEdge,
    w: i32,
    h: i32,
    margin: i32,
) -> (i32, i32) {
    let wa = monitor.work_area;
    match edge {
        DockEdge::Bottom => (wa.x + (wa.width - w) / 2, wa.y + wa.height - h - margin),
        DockEdge::Top => (wa.x + (wa.width - w) / 2, wa.y + margin),
        DockEdge::Left => (wa.x + margin, wa.y + (wa.height - h) / 2),
        DockEdge::Right => (wa.x + wa.width - w - margin, wa.y + (wa.height - h) / 2),
    }
}

static SYNCING: AtomicBool = AtomicBool::new(false);
static SYNC_AGAIN: AtomicBool = AtomicBool::new(false);

/// Clears the "a sync is running" flag however the sync ends.
struct SyncGuard;

impl Drop for SyncGuard {
    fn drop(&mut self) {
        SYNCING.store(false, Ordering::SeqCst);
    }
}

/// Make the set of dock windows match the settings and the monitors that are
/// connected: one dock per monitor when "a dock on every monitor" is on, just
/// the first dock otherwise. Extra docks are built for monitors that need one
/// and closed for monitors that went away or no longer need one. Safe to call
/// at any time, as often as wanted: it changes nothing when nothing needs to
/// change.
///
/// Only one runs at a time. Settings changes call this on every slider
/// movement, and two runs at once could both try to build the same window. A
/// call that arrives while one is running does not start a second; it asks the
/// running one to go round again, so the last request is always honoured.
pub async fn sync_docks(app: &AppHandle) {
    if SYNCING.swap(true, Ordering::SeqCst) {
        SYNC_AGAIN.store(true, Ordering::SeqCst);
        return;
    }
    let _guard = SyncGuard;
    loop {
        SYNC_AGAIN.store(false, Ordering::SeqCst);
        crate::trace!("sync_docks: pass");
        sync_docks_once(app).await;
        crate::trace!("sync_docks: pass done");
        if !SYNC_AGAIN.load(Ordering::SeqCst) {
            break;
        }
    }
}

async fn sync_docks_once(app: &AppHandle) {
    let settings = app.state::<SettingsStore>().get();
    let monitors = match enumerate_monitors() {
        Ok(monitors) => monitors,
        Err(e) => {
            log::warn!("could not list monitors to place the docks: {e}");
            return;
        }
    };
    let first = pick_monitor(&monitors, settings.dock.monitor.as_deref()).name.clone();

    // (label, monitor) for each extra dock that should exist
    let wanted: Vec<(String, String)> = if settings.dock.all_monitors {
        monitors
            .iter()
            .filter(|m| m.name != first)
            .map(|m| (label_for_monitor(&m.name), m.name.clone()))
            .collect()
    } else {
        Vec::new()
    };

    // close extra docks that should not exist any more
    for window in dock_windows(app) {
        let label = window.label().to_string();
        if label == PRIMARY_LABEL || wanted.iter().any(|(l, _)| *l == label) {
            continue;
        }
        if let Ok(hwnd) = window.hwnd() {
            appbar::release_window(windows::Win32::Foundation::HWND(hwnd.0));
        }
        let geometry = app.state::<DockGeometry>();
        geometry.sizes.lock().remove(&label);
        geometry.monitors.lock().remove(&label);
        let _ = window.destroy();
    }

    // open the ones that are missing
    for (label, monitor) in &wanted {
        app.state::<DockGeometry>()
            .monitors
            .lock()
            .insert(label.clone(), monitor.clone());
        if app.get_webview_window(label).is_none() {
            if let Err(e) = build_extra_dock(app, label).await {
                log::warn!("could not build the dock for {monitor}: {e}");
            }
        }
    }

    // windows moving between monitors only need watching when several docks
    // each list their own screen's windows
    crate::platform::windows::running::watch_monitors(
        settings.dock.all_monitors && settings.dock.per_monitor_windows && !wanted.is_empty(),
    );

    let handle = app.clone();
    match on_main_thread(app, move || position_dock(&handle)).await {
        Ok(Ok(())) => {}
        Ok(Err(e)) | Err(e) => log::warn!("could not place the docks: {e}"),
    }
}

/// Build one extra dock window, set up like the one in `tauri.conf.json`.
/// Async because a WebView2 cannot be created from the main thread.
async fn build_extra_dock(app: &AppHandle, label: &str) -> AeroResult<()> {
    let builder = tauri::WebviewWindowBuilder::new(
        app,
        label,
        tauri::WebviewUrl::App("index.html".into()),
    )
    .title("Aero Dock")
    .inner_size(1200.0, 220.0)
    .transparent(true)
    .decorations(false)
    .always_on_top(true)
    .skip_taskbar(true)
    .resizable(false)
    .maximizable(false)
    .minimizable(false)
    .shadow(false)
    .visible(false);

    // every WebView2 window on one profile needs the same browser arguments
    #[cfg(windows)]
    let builder = match crate::commands::settings::dock_browser_args(app) {
        Some(args) => builder.additional_browser_args(&args),
        None => builder,
    };

    let window = builder.build()?;
    #[cfg(windows)]
    {
        let hwnd = windows::Win32::Foundation::HWND(window.hwnd()?.0);
        crate::platform::windows::dock_window::apply_dock_styles(hwnd)?;
        crate::platform::windows::dock_window::strip_caption(hwnd);
    }
    // placed before it is shown, so it never appears in the wrong spot
    let handle = app.clone();
    let name = label.to_string();
    on_main_thread(app, move || position_one(&handle, &name)).await??;
    window.show()?;
    Ok(())
}

/// List monitors so the settings UI can offer a monitor picker.
#[tauri::command]
pub fn list_monitors() -> AeroResult<Vec<MonitorInfoEx>> {
    enumerate_monitors()
}

/// Auto-hide the Windows taskbar (Aero Dock becomes the bar) or restore
/// it. Repositions the dock afterwards because the work area changes.
#[tauri::command]
pub async fn set_taskbar_hidden(app: AppHandle, hidden: bool) -> AeroResult<()> {
    crate::platform::windows::taskbar::set_taskbar_autohide(hidden);
    settle_after_taskbar_change(&app).await;
    Ok(())
}

/// Re-place the dock once the shell has finished showing or hiding its
/// taskbar. The dock's reserved strip is negotiated around whatever
/// taskbar is on screen at the time, and a repeat request for the same
/// strip is answered from a cache, so the cache is dropped first or the
/// dock would keep the position it worked out beside the old taskbar.
pub async fn settle_after_taskbar_change(app: &AppHandle) {
    // the shell animates the taskbar away
    tokio_sleep(800).await;
    appbar::forget();
    let handle = app.clone();
    match on_main_thread(app, move || position_dock(&handle)).await {
        Ok(Ok(())) => {}
        Ok(Err(e)) | Err(e) => {
            log::warn!("could not re-place the dock after the taskbar changed: {e}")
        }
    }
}

async fn tokio_sleep(ms: u64) {
    tauri::async_runtime::spawn_blocking(move || {
        std::thread::sleep(std::time::Duration::from_millis(ms))
    })
    .await
    .ok();
}

/// Shut Aero Dock down for real, from anywhere in the UI.
///
/// The taskbar is restored here as well as in the exit handler. Quitting
/// is the one action where leaving the shell taskbar hidden would strand
/// someone with no way back, so it is worth doing twice.
#[tauri::command]
pub fn quit_app(app: AppHandle) {
    crate::platform::windows::taskbar::restore_taskbar();
    // a window left shaped would stay clipped to the size it had
    crate::commands::frame::shutdown();
    appbar::release_all();
    crate::platform::windows::peek::stop();
    app.exit(0);
}

/// Let the calling dock take keyboard focus (search overlay) or give its
/// focus-immunity back when the overlay closes.
#[tauri::command]
pub fn set_dock_focusable(window: WebviewWindow, focusable: bool) -> AeroResult<()> {
    let hwnd = window.hwnd()?;
    crate::platform::windows::dock_window::set_no_activate(
        windows::Win32::Foundation::HWND(hwnd.0),
        !focusable,
    )?;
    if focusable {
        window.set_focus()?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::platform::windows::monitors::Rect;

    fn monitor() -> MonitorInfoEx {
        MonitorInfoEx {
            name: r"\\.\DISPLAY1".into(),
            bounds: Rect { x: 0, y: 0, width: 2560, height: 1440 },
            work_area: Rect { x: 0, y: 0, width: 2560, height: 1392 }, // 48px taskbar
            scale: 1.25,
            is_primary: true,
        }
    }

    #[test]
    fn bottom_edge_sits_above_taskbar() {
        let (x, y) = place_on_edge(&monitor(), DockEdge::Bottom, 800, 200, 10);
        assert_eq!(x, (2560 - 800) / 2);
        assert_eq!(y, 1392 - 200 - 10);
    }

    #[test]
    fn left_edge_centers_vertically() {
        let (x, y) = place_on_edge(&monitor(), DockEdge::Left, 200, 800, 0);
        assert_eq!(x, 0);
        assert_eq!(y, (1392 - 800) / 2);
    }

    #[test]
    fn dock_labels_are_recognised() {
        assert!(is_dock_label("dock"));
        assert!(is_dock_label("dock-DISPLAY2"));
        assert!(!is_dock_label("settings"));
        assert!(!is_dock_label("widgets"));
        // a window that merely starts with the letters is not a dock
        assert!(!is_dock_label("dockyard"));
    }

    #[test]
    fn a_monitor_name_becomes_a_legal_label() {
        let label = label_for_monitor(r"\\.\DISPLAY2");
        assert_eq!(label, "dock-DISPLAY2");
        assert!(is_dock_label(&label));
        // different monitors get different docks
        assert_ne!(label_for_monitor(r"\\.\DISPLAY2"), label_for_monitor(r"\\.\DISPLAY3"));
    }
}

/// Trim or restore the calling window's memory. The dock calls this with
/// `true` when it goes to sleep after a spell with no interaction, and
/// with `false` the moment the cursor comes back.
///
/// Best effort by design: an old WebView2 runtime without the API just
/// keeps its caches, which is what it did before this existed.
#[tauri::command]
pub fn set_memory_saver(webview: tauri::Webview, low: bool) {
    #[cfg(windows)]
    {
        let result = webview.with_webview(move |platform| {
            if let Err(e) =
                crate::platform::windows::memory::set_memory_target(&platform.controller(), low)
            {
                log::debug!("memory target not applied: {e}");
            }
        });
        if let Err(e) = result {
            log::debug!("could not reach the webview: {e}");
        }
    }
    #[cfg(not(windows))]
    let _ = (webview, low);
}
