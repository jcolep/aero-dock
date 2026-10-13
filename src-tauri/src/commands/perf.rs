//! Frame timings: how smoothly each window really draws, on each screen, as numbers.
//!
//! "Smooth" is a feeling, and the same window can be smooth on a 165 Hz screen and rough on a 75 Hz one.
//! With the overlay switched on (Settings > Animations), every window's page times its own frames (the gaps
//! between its animation frames) and says how they went twice a second; a small window of its own, at the top
//! left of the main screen and out of the way of the pointer, lists them: the window, the screen it is on and
//! that screen's refresh rate, frames a second, the average gap, the slowest 5% of them, the worst in the last
//! ten seconds, and how many frames were late. A report of the same can be saved.
//!
//! Timing the frames keeps each window drawing at the screen's rate for as long as it is on, which is what
//! costs: it is a diagnostic, and it is off until chosen.

use std::collections::HashMap;
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, WebviewWindow};

use crate::core::settings::SettingsStore;
use crate::core::AeroResult;

pub const LABEL: &str = "perf";

/// What a page says about its own frames.
#[derive(Debug, Clone, Copy, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FrameStats {
    pub fps: f64,
    pub avg_ms: f64,
    pub p95_ms: f64,
    pub worst_ms: f64,
    /// Frames in the last second that took half as long again as the usual one.
    pub late: u32,
    pub frames: u32,
    pub dpr: f64,
}

/// One window's line of the table.
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FrameRow {
    pub label: String,
    pub monitor: String,
    pub refresh_hz: u32,
    pub fps: f64,
    pub avg_ms: f64,
    pub p95_ms: f64,
    pub worst_ms: f64,
    pub late: u32,
    pub frames: u32,
    pub dpr: f64,
}

struct Kept {
    at: Instant,
    row: FrameRow,
}

static ROWS: Mutex<Option<HashMap<String, Kept>>> = Mutex::new(None);

/// A window's line is dropped when it has not been updated for this long (it is hidden, or gone).
const STALE: Duration = Duration::from_millis(3500);

/// The screen a window is on, and that screen's refresh rate.
fn screen_of(window: &WebviewWindow) -> (String, u32) {
    let name = window.current_monitor().ok().flatten().and_then(|m| m.name().cloned()).unwrap_or_default();
    #[cfg(windows)]
    let hz = crate::platform::windows::monitors::refresh_hz(&name).unwrap_or(0);
    #[cfg(not(windows))]
    let hz = 0;
    (name, hz)
}

/// A window says how its frames went.
#[tauri::command]
pub fn report_frame_stats(window: WebviewWindow, stats: FrameStats) {
    let label = window.label().to_string();
    let (monitor, refresh_hz) = screen_of(&window);
    let row = FrameRow {
        label: label.clone(),
        monitor,
        refresh_hz,
        fps: stats.fps,
        avg_ms: stats.avg_ms,
        p95_ms: stats.p95_ms,
        worst_ms: stats.worst_ms,
        late: stats.late,
        frames: stats.frames,
        dpr: stats.dpr,
    };
    ROWS.lock().get_or_insert_with(HashMap::new).insert(label, Kept { at: Instant::now(), row });
}

/// The table as it is now: the windows that have said something lately.
#[tauri::command]
pub fn frame_stats() -> Vec<FrameRow> {
    let mut guard = ROWS.lock();
    let Some(map) = guard.as_mut() else { return Vec::new() };
    map.retain(|_, k| k.at.elapsed() < STALE);
    let mut rows: Vec<FrameRow> = map.values().map(|k| k.row.clone()).collect();
    rows.sort_by(|a, b| a.label.cmp(&b.label));
    rows
}

/// The table, written to `frame-report.txt` in the data folder, and returned.
#[tauri::command]
pub fn frame_report(app: AppHandle) -> AeroResult<String> {
    let mut lines = vec![format!("{:<18} {:<14} {:>5} {:>6} {:>7} {:>7} {:>7} {:>5}", "window", "screen", "Hz", "fps", "avg ms", "p95 ms", "worst", "late")];
    for r in frame_stats() {
        lines.push(format!(
            "{:<18} {:<14} {:>5} {:>6.1} {:>7.1} {:>7.1} {:>7.1} {:>5}",
            r.label,
            r.monitor.trim_start_matches("\\\\.\\"),
            r.refresh_hz,
            r.fps,
            r.avg_ms,
            r.p95_ms,
            r.worst_ms,
            r.late
        ));
    }
    let text = lines.join("\n");
    if let Ok(dir) = crate::core::paths::data_dir(&app) {
        let _ = std::fs::write(dir.join("frame-report.txt"), &text);
    }
    Ok(text)
}

/// The size of the table's window, in physical pixels.
const HUD: (u32, u32) = (700, 260);

/// Show the table's window if the overlay is on, and take it away if not.
pub async fn sync(app: &AppHandle) {
    let on = app.state::<SettingsStore>().get().appearance.frame_overlay;
    let existing = app.get_webview_window(LABEL);
    if !on {
        if let Some(window) = existing {
            let _ = window.hide();
        }
        return;
    }
    let window = match existing {
        Some(w) => w,
        None => {
            let builder = tauri::WebviewWindowBuilder::new(app, LABEL, tauri::WebviewUrl::App("index.html?window=perf".into()))
                .title("")
                .inner_size(HUD.0 as f64, HUD.1 as f64)
                .transparent(true)
                .decorations(false)
                .always_on_top(true)
                .skip_taskbar(true)
                .resizable(false)
                .maximizable(false)
                .minimizable(false)
                .focused(false)
                .shadow(false)
                .visible(false);
            #[cfg(windows)]
            let builder = match crate::commands::settings::dock_browser_args(app) {
                Some(args) => builder.additional_browser_args(&args),
                None => builder,
            };
            match builder.build() {
                Ok(w) => w,
                Err(e) => {
                    log::warn!("could not make the frame timings window: {e}");
                    return;
                }
            }
        }
    };
    let handle = app.clone();
    let _ = crate::commands::dock::on_main_thread(app, move || {
        let Some(window) = handle.get_webview_window(LABEL) else { return };
        #[cfg(windows)]
        if let Ok(hwnd) = window.hwnd() {
            let hwnd = windows::Win32::Foundation::HWND(hwnd.0);
            crate::platform::windows::dock_window::keep_caption_off(hwnd);
            let _ = crate::platform::windows::dock_window::set_no_activate(hwnd, true);
            if let Ok(monitors) = crate::platform::windows::monitors::enumerate_monitors() {
                if let Some(m) = monitors.iter().find(|m| m.is_primary).or(monitors.first()) {
                    let _ = crate::platform::windows::dock_window::set_bounds(
                        hwnd,
                        m.bounds.x + 16,
                        m.bounds.y + 56,
                        HUD.0 as i32,
                        HUD.1 as i32,
                    );
                }
            }
        }
        // the pointer goes through it
        let _ = window.set_ignore_cursor_events(true);
        let _ = window.show();
        let _ = window.set_always_on_top(true);
    })
    .await;
    let _ = window;
}
