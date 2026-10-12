//! Settings IPC surface. The frontend reads the full struct, sends whole-
//! struct updates, and listens for `settings://changed` to re-render.

use tauri::{AppHandle, State};

use crate::core::settings::{PinnedItem, Settings, SettingsStore};
use crate::core::AeroResult;

#[tauri::command]
pub fn get_settings(store: State<'_, SettingsStore>) -> Settings {
    store.get()
}

/// Replace the settings with a new struct (the frontend always sends the
/// complete state; sanitization clamps anything out of range).
///
/// Async on purpose: a plain command runs on the main thread, which is the
/// thread every window paints on, and this one writes the file and re-places
/// every window. Run there, each step of a slider drag stalled all of them.
#[tauri::command]
pub async fn set_settings(
    app: AppHandle,
    store: State<'_, SettingsStore>,
    settings: Settings,
) -> AeroResult<Settings> {
    crate::trace!("set_settings: menu bar height {}", settings.menu_bar.height);
    let result = store.replace(&app, settings)?;
    crate::trace!("set_settings: stored");
    // edge/monitor/floating changes must move the window even when its
    // size is unchanged (bottom<->top keeps identical dimensions, so the
    // frontend's resize path never fires). Placement is done on the main
    // thread, in order with the docks' own size reports.
    // the keyboard shortcuts follow their switch
    #[cfg(windows)]
    crate::platform::windows::hotkeys::set_enabled(result.accessibility.keyboard_shortcuts);
    crate::commands::dock::position_dock_later(&app);
    crate::trace!("set_settings: docks queued for placing");
    // "a dock on every monitor" may have been switched, or the first dock
    // moved to another monitor: add or remove docks to match
    let docks = app.clone();
    tauri::async_runtime::spawn(async move {
        crate::commands::dock::sync_docks(&docks).await;
        // the menu bar's presence and height, and the dock's room beside it
        crate::commands::menubar::sync_menubar(&docks).await;
        // the frame goes round what they leave, so it is placed last
        crate::commands::frame::sync_frames(&docks).await;
    });
    Ok(result)
}

#[tauri::command]
pub fn pin_item(
    app: AppHandle,
    store: State<'_, SettingsStore>,
    mut item: PinnedItem,
    index: Option<usize>,
) -> AeroResult<Settings> {
    // a packaged app's exe cannot be launched; pin the app, by its AUMID
    #[cfg(windows)]
    if let Some(target) = crate::platform::windows::packaged::app_target_for_path(&item.path) {
        item.path = target;
    }
    store.update(&app, |s| {
        s.pinned.retain(|p| p.id != item.id);
        let at = index.unwrap_or(s.pinned.len()).min(s.pinned.len());
        s.pinned.insert(at, item);
    })
}

/// Repair the pins made before packaged apps were pinned by their AUMID.
///
/// A packaged app that runs in a process of its own (Terminal, the new Notepad,
/// Teams, the new Outlook) used to be pinned by the exe in its WindowsApps
/// folder, which cannot be launched, and it was named for whatever window it
/// had open. Each such pin is pointed at the app itself and given the app's
/// own name. Done once at startup, off the main thread because naming an app
/// reads the Start menu's app list; a pin whose package has since been updated
/// (so its folder is gone) cannot be worked out and is left for the user.
#[cfg(windows)]
pub fn migrate_packaged_pins(app: &AppHandle) {
    use tauri::Manager;
    use crate::platform::windows::packaged;

    let app = app.clone();
    tauri::async_runtime::spawn_blocking(move || {
        let store = app.state::<SettingsStore>();
        let wanted = |p: &PinnedItem| {
            (!p.path.is_empty()).then(|| packaged::app_target_for_path(&p.path)).flatten()
        };
        // what each pin to repair becomes: its path, and its proper name
        let mut fixes = std::collections::HashMap::new();
        for pin in store.get().pinned.iter().flat_map(|p| std::iter::once(p).chain(p.children.iter())) {
            if let Some(target) = wanted(pin) {
                let name = crate::commands::apps::display_name_for(&target);
                fixes.insert(pin.id.clone(), (target, name));
            }
        }
        if fixes.is_empty() {
            return;
        }
        log::info!("repairing {} pinned packaged app(s)", fixes.len());
        let repair = |p: &mut PinnedItem| {
            if let Some((target, name)) = fixes.get(&p.id) {
                p.path = target.clone();
                if let Some(name) = name {
                    p.name = name.clone();
                }
            }
        };
        if let Err(e) = store.update(&app, |s| {
            for pin in &mut s.pinned {
                repair(pin);
                pin.children.iter_mut().for_each(&repair);
            }
        }) {
            log::warn!("could not repair the pinned packaged apps: {e}");
        }
    });
}

#[tauri::command]
pub fn unpin_item(
    app: AppHandle,
    store: State<'_, SettingsStore>,
    id: String,
) -> AeroResult<Settings> {
    store.update(&app, |s| {
        s.pinned.retain(|p| p.id != id);
        for p in &mut s.pinned {
            p.children.retain(|c| c.id != id);
        }
    })
}

/// Reorder pinned items to match the given id sequence (drag-and-drop).
#[tauri::command]
pub fn reorder_pinned(
    app: AppHandle,
    store: State<'_, SettingsStore>,
    ids: Vec<String>,
) -> AeroResult<Settings> {
    store.update(&app, |s| {
        s.pinned.sort_by_key(|p| {
            ids.iter().position(|id| *id == p.id).unwrap_or(usize::MAX)
        });
    })
}

/// Remember the order running (unpinned) apps were dragged into.
///
/// `ids` is the order on screen right now. Apps that are not running at the
/// moment keep a slot after them, so closing an app and reopening it later
/// does not throw its position away; the list is capped on save.
#[tauri::command]
pub fn reorder_running(
    app: AppHandle,
    store: State<'_, SettingsStore>,
    ids: Vec<String>,
) -> AeroResult<Settings> {
    store.update(&app, |s| {
        let mut order = Vec::with_capacity(ids.len());
        for id in ids.iter().chain(s.dock.running_order.iter()) {
            if !order.contains(id) {
                order.push(id.clone());
            }
        }
        s.dock.running_order = order;
    })
}

/// Atomic first-run import: pins the starter set and marks onboarding
/// complete in one settings transaction. Safe to call any number of
/// times (React StrictMode double-fires effects in dev) — only the
/// first call through the lock does anything.
#[tauri::command]
pub fn first_run_import(
    app: AppHandle,
    store: State<'_, SettingsStore>,
    items: Vec<PinnedItem>,
) -> AeroResult<Settings> {
    store.update(&app, |s| {
        if !s.onboarding_complete && s.pinned.is_empty() {
            s.pinned = items;
            s.onboarding_complete = true;
        }
    })
}

#[tauri::command]
pub fn export_settings(store: State<'_, SettingsStore>) -> AeroResult<String> {
    store.export_json()
}

/// Write settings JSON to the user's Downloads folder; returns the path.
#[tauri::command]
pub fn export_settings_file(app: AppHandle, store: State<'_, SettingsStore>) -> AeroResult<String> {
    use tauri::Manager;
    let dir = app.path().download_dir()?;
    let stamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or(0);
    let path = dir.join(format!("aero-dock-settings-{stamp}.json"));
    std::fs::write(&path, store.export_json()?)?;
    Ok(path.to_string_lossy().to_string())
}

/// Where this copy keeps its files, and whether it is running portable.
/// Settings shows it so nobody has to guess which folder to back up.
#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StorageInfo {
    pub portable: bool,
    pub data_dir: String,
}

#[tauri::command]
pub fn storage_info(app: AppHandle) -> AeroResult<StorageInfo> {
    Ok(StorageInfo {
        portable: crate::core::paths::is_portable(),
        data_dir: crate::core::paths::config_dir(&app)?
            .to_string_lossy()
            .to_string(),
    })
}

/// Open (or focus) the settings window. Async on purpose: building a
/// WebView2 inside a sync command deadlocks on Windows (the command
/// blocks the main thread the webview needs for creation).
#[tauri::command]
pub async fn open_settings(app: AppHandle) -> AeroResult<()> {
    use tauri::Manager;
    if let Some(w) = app.get_webview_window("settings") {
        w.show()?;
        w.set_focus()?;
        return Ok(());
    }
    let builder = tauri::WebviewWindowBuilder::new(
        &app,
        "settings",
        tauri::WebviewUrl::App("index.html?window=settings".into()),
    )
    .title(crate::platform::windows::running::SETTINGS_TITLE)
    .inner_size(820.0, 640.0)
    .min_inner_size(660.0, 500.0);

    // Every WebView2 window sharing a profile has to be created with the
    // same browser arguments, or the second one fails to appear at all.
    // The dock's come from tauri.conf.json, so read them from there rather
    // than keeping a second copy that could drift.
    #[cfg(windows)]
    let builder = match dock_browser_args(&app) {
        Some(args) => builder.additional_browser_args(&args),
        None => builder,
    };

    builder.build()?;
    Ok(())
}

#[tauri::command]
pub fn import_settings(
    app: AppHandle,
    store: State<'_, SettingsStore>,
    json: String,
) -> AeroResult<Settings> {
    let result = store.import_json(&app, &json)?;
    if let Err(e) = crate::commands::dock::position_dock(&app) {
        log::warn!("reposition after import failed: {e}");
    }
    let docks = app.clone();
    tauri::async_runtime::spawn(async move {
        crate::commands::dock::sync_docks(&docks).await;
        crate::commands::menubar::sync_menubar(&docks).await;
    });
    Ok(result)
}

/// The browser arguments the dock window was configured with.
#[cfg(windows)]
pub(crate) fn dock_browser_args(app: &AppHandle) -> Option<String> {
    app.config()
        .app
        .windows
        .iter()
        .find(|w| w.label == "dock")
        .and_then(|w| w.additional_browser_args.clone())
}

#[cfg(test)]
mod tests {
    /// The browser arguments live in tauri.conf.json. Setting them there
    /// replaces Tauri's own defaults rather than adding to them, so those
    /// have to be repeated, and the GPU flag is what saves the memory.
    #[test]
    fn the_dock_keeps_tauris_defaults_and_renders_in_software() {
        let conf: serde_json::Value =
            serde_json::from_str(include_str!("../../tauri.conf.json")).unwrap();
        let args = conf["app"]["windows"]
            .as_array()
            .unwrap()
            .iter()
            .find(|w| w["label"] == "dock")
            .and_then(|w| w["additionalBrowserArgs"].as_str())
            .expect("the dock sets its browser arguments explicitly");
        assert!(args.contains("msWebOOUI,msPdfOOUI,msSmartScreenProtection"), "{args}");
        assert!(args.contains("--disable-gpu"), "{args}");
        // a debugging port left in a shipped build lets any local process
        // run script with the app's permissions
        assert!(!args.contains("remote-debugging"), "{args}");
    }
}
