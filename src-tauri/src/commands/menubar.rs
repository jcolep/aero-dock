//! The menu bar: a strip along the top of the main monitor, after the macOS
//! one. System and app menus on the left, status items and the Control
//! Center on the right.
//!
//! It is a window like the dock's, with the same two tricks. It reserves a
//! strip of the screen, so maximised windows stop under it. And the window is
//! much taller than the bar (it has to hold an open menu or the Control
//! Center), with everything outside the part in use clipped away, so opening
//! a menu never resizes the window.

use std::sync::atomic::{AtomicBool, Ordering};

use parking_lot::Mutex;
use tauri::{AppHandle, Emitter, Manager, WebviewWindow};

use crate::core::settings::{DockEdge, Settings, SettingsStore};
use crate::core::{AeroError, AeroResult};
use crate::platform::windows::appbar;
use crate::platform::windows::monitors::{enumerate_monitors, pick_monitor, MonitorInfoEx};

pub const LABEL: &str = "menubar";

/// Logical px of window below the bar, for an open menu or the Control Center.
const PANEL_ROOM: f64 = 700.0;

/// How tall the part of the window in use is, in logical px: the bar alone,
/// or the bar and whatever is open under it. Set by the frontend.
static VISIBLE_HEIGHT: Mutex<Option<f64>> = Mutex::new(None);

/// The monitor the bar lives on: the one the dock's main monitor setting
/// names, or the primary one.
fn bar_monitor<'a>(settings: &Settings, monitors: &'a [MonitorInfoEx]) -> &'a MonitorInfoEx {
    pick_monitor(monitors, settings.dock.monitor.as_deref())
}

/// How much of the top of a monitor the bar takes, in physical px, if it is
/// on that monitor. The dock uses this when it is also at the top, so the
/// two do not claim the same strip.
pub fn top_inset(settings: &Settings, monitors: &[MonitorInfoEx], monitor: &MonitorInfoEx) -> i32 {
    if !settings.menu_bar.enabled || bar_monitor(settings, monitors).name != monitor.name {
        return 0;
    }
    (settings.menu_bar.thickness() as f64 * monitor.scale).round() as i32
}

/// The frontend says how much of the window is in use, in logical px.
#[tauri::command]
pub fn resize_menubar(app: AppHandle, visible_height: f64) -> AeroResult<()> {
    crate::trace!("resize_menubar: {visible_height}");
    *VISIBLE_HEIGHT.lock() = Some(visible_height.max(1.0));
    let placed = position_menubar(&app);
    crate::trace!("resize_menubar: done");
    placed
}

/// Place the bar's window along the top of its monitor and reserve its strip.
pub fn position_menubar(app: &AppHandle) -> AeroResult<()> {
    let Some(window) = app.get_webview_window(LABEL) else {
        return Ok(());
    };
    let settings = app.state::<SettingsStore>().get();
    let monitors = enumerate_monitors()?;
    let monitor = bar_monitor(&settings, &monitors);
    let scale = monitor.scale;

    // the bar and the gap above it: the strip of the screen that is reserved
    // and that stays in view
    let bar = (settings.menu_bar.thickness() as f64 * scale).round() as i32;
    let width = monitor.bounds.width;
    let height = bar + (PANEL_ROOM * scale).round() as i32;
    let hwnd = windows::Win32::Foundation::HWND(window.hwnd()?.0);
    crate::trace!("position_menubar: bar {bar}px, window {width}x{height}");

    // Tauri puts the caption style back on a window at moments of its own, so
    // taking it off once does not last. The window is made to refuse it, and
    // it is checked again each time the bar is placed (this runs on the main
    // thread, which is the one that owns the window).
    crate::platform::windows::dock_window::keep_caption_off(hwnd);

    let strip = appbar::reserve(
        hwnd,
        DockEdge::Top,
        monitor.bounds,
        bar,
        // as for the dock: a taskbar that is being kept hidden must not
        // influence where the bar goes
        settings.hide_taskbar,
        appbar::Owner::MenuBar,
        monitor.bounds,
    );
    crate::trace!("position_menubar: reserved at y {}", strip.y);
    crate::platform::windows::dock_window::set_bounds(hwnd, strip.x, strip.y, width, height)?;
    crate::trace!("position_menubar: bounds set");

    let clipped = clip_to_use(hwnd, scale, bar, width, height);
    // the blur behind the bar follows where it now is
    crate::commands::glass::sync_all(app);
    clipped
}

/// Clip the window to what is in use: the bar, or the bar and what is open
/// under it.
fn clip_to_use(
    hwnd: windows::Win32::Foundation::HWND,
    scale: f64,
    bar: i32,
    width: i32,
    height: i32,
) -> AeroResult<()> {
    let wanted = VISIBLE_HEIGHT
        .lock()
        .map(|h| (h * scale).round() as i32)
        .unwrap_or(bar);
    let visible = wanted.clamp(bar, height);
    let clipped = crate::platform::windows::dock_window::set_visible_region(hwnd, 0, 0, width, visible);
    crate::trace!("position_menubar: clipped to {visible}px");
    clipped
}

/// The frontend says a menu has opened or closed.
///
/// A menu has to notice a click anywhere else on the screen, and Escape, in
/// order to close. The way to do that used to be taking the keyboard focus, so
/// that clicking elsewhere shows up as the bar window losing it. But
/// activating the bar's window makes Windows flash its glass backing for a
/// frame or two (a pale wash across the whole bar), on every menu opened. So
/// the bar never takes the focus. While a menu is open a pair of low-level
/// input hooks watch for the click and the key instead, and tell the page.
#[tauri::command]
pub fn set_menubar_menu_open(app: AppHandle, open: bool) -> AeroResult<()> {
    use crate::platform::windows::outside_click;
    if !open {
        outside_click::stop();
        return Ok(());
    }
    let Some(window) = app.get_webview_window(LABEL) else {
        return Ok(());
    };
    let hwnd = windows::Win32::Foundation::HWND(window.hwnd()?.0);
    outside_click::start(hwnd, move |event| {
        let name = match event {
            outside_click::Event::Outside => "menubar://outside",
            outside_click::Event::Escape => "menubar://escape",
        };
        let _ = app.emit(name, ());
    });
    Ok(())
}

static SYNCING: AtomicBool = AtomicBool::new(false);
static SYNC_AGAIN: AtomicBool = AtomicBool::new(false);

struct SyncGuard;

impl Drop for SyncGuard {
    fn drop(&mut self) {
        SYNCING.store(false, Ordering::SeqCst);
    }
}

/// Make the bar exist, or not, to match the setting, and put it in place.
/// Safe to call as often as wanted. One runs at a time, and a call that
/// arrives during another asks it to go round again, as for the docks.
pub async fn sync_menubar(app: &AppHandle) {
    if SYNCING.swap(true, Ordering::SeqCst) {
        SYNC_AGAIN.store(true, Ordering::SeqCst);
        return;
    }
    let _guard = SyncGuard;
    loop {
        SYNC_AGAIN.store(false, Ordering::SeqCst);
        crate::trace!("sync_menubar: pass");
        sync_once(app).await;
        crate::trace!("sync_menubar: pass done");
        if !SYNC_AGAIN.load(Ordering::SeqCst) {
            break;
        }
    }
}

/// The bar's on/off state and height as of the last sync, so the docks are
/// only re-placed around it when one of those actually changed. Every
/// settings change from anywhere calls this, and most have nothing to do
/// with the bar.
static LAST_SEEN: Mutex<Option<(bool, u32)>> = Mutex::new(None);
// (whether it is on, and how much of the top of the screen it takes)

async fn sync_once(app: &AppHandle) {
    let bar = app.state::<SettingsStore>().get().menu_bar;
    let enabled = bar.enabled;
    let existing = app.get_webview_window(LABEL);
    match (enabled, existing) {
        (true, None) => {
            if let Err(e) = build_menubar(app).await {
                log::warn!("could not build the menu bar: {e}");
            }
        }
        (true, Some(_)) => {}
        (false, Some(window)) => {
            if let Ok(hwnd) = window.hwnd() {
                appbar::release_window(windows::Win32::Foundation::HWND(hwnd.0));
            }
            *VISIBLE_HEIGHT.lock() = None;
            let _ = window.destroy();
        }
        (false, None) => {}
    }
    // placement is done on the main thread, in order with everything else that
    // places a window (see `on_main_thread`)
    let handle = app.clone();
    match crate::commands::dock::on_main_thread(app, move || position_menubar(&handle)).await {
        Ok(Ok(())) => {}
        Ok(Err(e)) | Err(e) => log::warn!("could not place the menu bar: {e}"),
    }
    // the dock may need to move to make room for the bar, or back, but only
    // if the bar's presence or height changed
    let seen = Some((enabled, bar.thickness()));
    let changed = std::mem::replace(&mut *LAST_SEEN.lock(), seen) != seen;
    if changed {
        crate::trace!("sync_menubar: re-placing the docks around the bar");
        let handle = app.clone();
        match crate::commands::dock::on_main_thread(app, move || {
            crate::commands::dock::position_dock(&handle)
        })
        .await
        {
            Ok(Ok(())) => {}
            Ok(Err(e)) | Err(e) => {
                log::warn!("could not re-place the docks around the menu bar: {e}")
            }
        }
    }
}

/// Build the bar's window, hidden, set up like the dock's. Async because a
/// WebView2 cannot be created from the main thread.
async fn build_menubar(app: &AppHandle) -> AeroResult<WebviewWindow> {
    let builder = tauri::WebviewWindowBuilder::new(
        app,
        LABEL,
        tauri::WebviewUrl::App("index.html?window=menubar".into()),
    )
    // No title: Windows draws it behind the page, and the page is transparent
    // (see `strip_caption`). This window sits where it would be seen.
    .title("")
    .inner_size(1200.0, 600.0)
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
    crate::commands::dock::on_main_thread(app, move || position_menubar(&handle)).await??;
    window.show()?;
    // showing it is what puts the caption back
    #[cfg(windows)]
    crate::platform::windows::dock_window::strip_caption(windows::Win32::Foundation::HWND(
        window.hwnd()?.0,
    ));
    Ok(window)
}

/// Run a power or session action from the Apple menu. Restart, shut down and
/// log out ask first, because they throw away whatever is open.
#[tauri::command]
pub async fn system_action(kind: String) -> AeroResult<()> {
    tauri::async_runtime::spawn_blocking(move || run_system_action(&kind))
        .await
        .map_err(|e| AeroError::other(format!("action task failed: {e}")))?
}

fn run_system_action(kind: &str) -> AeroResult<()> {
    use crate::platform::windows::system::confirm;
    use std::os::windows::process::CommandExt;
    use std::process::Command;
    /// Do not flash a console window for these.
    const NO_WINDOW: u32 = 0x0800_0000;

    let run = |program: &str, args: &[&str]| -> AeroResult<()> {
        Command::new(program)
            .args(args)
            .creation_flags(NO_WINDOW)
            .spawn()
            .map(|_| ())
            .map_err(AeroError::Io)
    };

    match kind {
        "lock" => run("rundll32.exe", &["user32.dll,LockWorkStation"]),
        "sleep" => run("rundll32.exe", &["powrprof.dll,SetSuspendState", "0,1,0"]),
        "taskmgr" => run("taskmgr.exe", &[]),
        "restart" => {
            if confirm("Restart", "Are you sure you want to restart your PC now?") {
                run("shutdown.exe", &["/r", "/t", "0"])?;
            }
            Ok(())
        }
        "shutdown" => {
            if confirm("Shut Down", "Are you sure you want to shut down your PC now?") {
                run("shutdown.exe", &["/s", "/t", "0"])?;
            }
            Ok(())
        }
        "logoff" => {
            if confirm("Log Out", "Are you sure you want to log out now?") {
                run("shutdown.exe", &["/l"])?;
            }
            Ok(())
        }
        other => Err(AeroError::other(format!("unknown action: {other}"))),
    }
}

/// Open the Start menu, from the bar's search button (which is where the
/// dock's search used to open).
#[tauri::command]
pub async fn open_dock_search(app: AppHandle) {
    crate::commands::start::toggle(&app).await;
}
