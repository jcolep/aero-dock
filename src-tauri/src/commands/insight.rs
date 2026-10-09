//! What the menu bar's privacy dots and stats show: which apps are using the
//! microphone or camera, and how busy the machine is.
//!
//! Everything here only reads. The privacy watcher looks every couple of
//! seconds and tells the page only when the answer changes; the stats are asked
//! for by the page, while its popover is open or its sparkline is drawing.

use std::time::Duration;

use serde::Serialize;
use tauri::{AppHandle, Emitter, Manager};

use crate::core::settings::SettingsStore;
use crate::core::{AeroError, AeroResult};
use crate::platform::windows::privacy::{self, Use};
use crate::platform::windows::procstats::{self, Program, Throughput};
use crate::platform::windows::sysstats;

/// The event sent when the apps using the microphone or camera change.
const PRIVACY_EVENT: &str = "privacy://changed";

/// How often the registry is looked at.
const PRIVACY_EVERY: Duration = Duration::from_secs(2);

/// Which apps are using the microphone or camera now.
#[tauri::command]
pub async fn get_privacy_use() -> AeroResult<Vec<Use>> {
    tauri::async_runtime::spawn_blocking(privacy::read)
        .await
        .map_err(|e| AeroError::other(format!("privacy task failed: {e}")))
}

/// Start the thread that watches for the microphone or camera being used. Once,
/// at startup. It does nothing while the dots are switched off.
pub fn start_privacy_watch(app: AppHandle) {
    let spawned = std::thread::Builder::new().name("privacy-watch".into()).spawn(move || {
        let mut last: Option<Vec<Use>> = None;
        loop {
            std::thread::sleep(PRIVACY_EVERY);
            let settings = app.state::<SettingsStore>().get().menu_bar;
            if !(settings.enabled && settings.show_privacy) {
                last = None;
                continue;
            }
            let now = privacy::read();
            if last.as_ref() != Some(&now) {
                let _ = app.emit(PRIVACY_EVENT, &now);
                last = Some(now);
            }
        }
    });
    if let Err(e) = spawned {
        log::warn!("could not start the privacy watcher: {e}");
    }
}

/// The machine's load, for the sparkline and the stats popover.
#[derive(Debug, Clone, Copy, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stats {
    pub cpu_percent: u8,
    pub memory_percent: u8,
    pub memory_used_mb: u64,
    pub memory_total_mb: u64,
    pub net_down: u64,
    pub net_up: u64,
}

#[tauri::command]
pub async fn get_stats() -> AeroResult<Stats> {
    tauri::async_runtime::spawn_blocking(|| {
        let load = sysstats::read();
        let Throughput { down, up } = procstats::throughput();
        Stats {
            cpu_percent: load.cpu_percent,
            memory_percent: load.memory_percent,
            memory_used_mb: load.memory_used_mb,
            memory_total_mb: load.memory_total_mb,
            net_down: down,
            net_up: up,
        }
    })
    .await
    .map_err(|e| AeroError::other(format!("stats task failed: {e}")))
}

/// The programs using the most processor (or memory, with `by_cpu` false).
#[tauri::command]
pub async fn get_top_processes(by_cpu: bool, limit: usize) -> AeroResult<Vec<Program>> {
    let limit = limit.clamp(1, 20);
    tauri::async_runtime::spawn_blocking(move || procstats::top(by_cpu, limit))
        .await
        .map_err(|e| AeroError::other(format!("process task failed: {e}")))
}