//! System widgets IPC + the status poller thread.

use tauri::{AppHandle, Emitter};

use crate::core::{AeroError, AeroResult};
use crate::platform::windows::system;

pub const SYSTEM_EVENT: &str = "system://status";
/// The tray's hidden-icons flyout opened (`true`) or closed (`false`).
pub const TRAY_FLYOUT_EVENT: &str = "tray://flyout";
const POLL_SECS: u64 = 20;

#[tauri::command]
pub async fn get_system_status() -> AeroResult<system::SystemStatus> {
    tauri::async_runtime::spawn_blocking(system::read_status)
        .await
        .map_err(|e| AeroError::other(format!("status task failed: {e}")))
}

#[tauri::command]
pub async fn set_volume(
    app: AppHandle,
    level: Option<u8>,
    mute: Option<bool>,
) -> AeroResult<()> {
    tauri::async_runtime::spawn_blocking(move || -> AeroResult<()> {
        system::set_volume(level, mute)?;
        // push the fresh state right away so the widget doesn't lag
        let status = system::read_status();
        let _ = app.emit(SYSTEM_EVENT, &status);
        Ok(())
    })
    .await
    .map_err(|e| AeroError::other(format!("volume task failed: {e}")))?
}

#[tauri::command]
pub async fn open_recycle_bin() -> AeroResult<()> {
    tauri::async_runtime::spawn_blocking(|| {
        std::process::Command::new("explorer.exe")
            .arg("shell:RecycleBinFolder")
            .spawn()
            .map(|_| ())
            .map_err(AeroError::Io)
    })
    .await
    .map_err(|e| AeroError::other(format!("open bin task failed: {e}")))?
}

#[tauri::command]
pub async fn empty_recycle_bin(app: AppHandle) -> AeroResult<()> {
    tauri::async_runtime::spawn_blocking(move || -> AeroResult<()> {
        // Windows' own routine asks "are you sure you want to permanently
        // delete these items?", which is a strange thing to be asked about
        // nothing. When there is nothing to empty, say so instead.
        if system::recycle_bin_is_empty() {
            system::message_box("Recycle Bin", "The Recycle Bin is already empty.");
            return Ok(());
        }
        system::empty_recycle_bin()?;
        let status = system::read_status();
        let _ = app.emit(SYSTEM_EVENT, &status);
        Ok(())
    })
    .await
    .map_err(|e| AeroError::other(format!("empty bin task failed: {e}")))?
}

/// Open the notification centre and calendar (what clicking the clock in the
/// Windows taskbar does).
#[tauri::command]
pub fn open_notification_center() {
    crate::platform::windows::shell_ui::open_notification_center();
}

/// Open the system tray's hidden-icons flyout. Resolves to whether the
/// tray's button could be found; the flyout is open by the time it does.
#[tauri::command]
pub async fn open_tray_overflow(
    app: AppHandle,
    window: tauri::WebviewWindow,
    anchor_x: i32,
    anchor_top: i32,
) -> AeroResult<bool> {
    // if the button cannot be found, what the taskbar exposed goes here
    let dump = crate::core::paths::data_dir(&app)
        .ok()
        .map(|dir| dir.join("tray-uia-dump.txt"));
    // The button reports where it is inside the dock window it was clicked
    // in; the flyout is placed in screen coordinates, so add that window's
    // own position.
    let anchor = window
        .outer_position()
        .ok()
        .map(|pos| (pos.x + anchor_x, pos.y + anchor_top));
    // The dock is told when the flyout opens and closes, so that it can stay
    // put while the flyout is up instead of sliding away under it.
    let events = app.clone();
    tauri::async_runtime::spawn_blocking(move || {
        crate::platform::windows::shell_ui::open_tray_overflow(dump, anchor, &|open| {
            let _ = events.emit(TRAY_FLYOUT_EVENT, open);
        })
    })
    .await
        .map_err(|e| AeroError::other(format!("tray task failed: {e}")))?
}

/// Current wallpaper's dominant vibrant color as `#rrggbb`.
#[tauri::command]
pub async fn get_wallpaper_accent() -> AeroResult<String> {
    tauri::async_runtime::spawn_blocking(crate::platform::windows::wallpaper::wallpaper_accent)
        .await
        .map_err(|e| AeroError::other(format!("wallpaper task failed: {e}")))?
}

/// Background poller: looks at the system status every POLL_SECS while the
/// app runs and pushes it when it has changed. Cheap reads; skipped entirely
/// when the dock is hidden would be an over-optimization at this cadence.
///
/// Nothing is sent for a reading that matches the last one: it would be
/// serialised, delivered to every window, parsed and re-rendered to show what
/// is already on screen, three times a minute, for ever.
pub fn start_poller(app: AppHandle) {
    std::thread::Builder::new()
        .name("aero-system-poll".into())
        .spawn(move || {
            let mut last: Option<system::SystemStatus> = None;
            loop {
                let status = system::read_status();
                if last.as_ref() != Some(&status) {
                    if app.emit(SYSTEM_EVENT, &status).is_err() {
                        return; // app shutting down
                    }
                    last = Some(status);
                }
                std::thread::sleep(std::time::Duration::from_secs(POLL_SECS));
            }
        })
        .expect("spawn system poller");
}
