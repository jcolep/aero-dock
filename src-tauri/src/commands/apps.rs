//! App discovery, icon resolution, and launching.

use std::collections::HashMap;

use tauri::AppHandle;

use crate::core::{AeroError, AeroResult};
use crate::platform::AppEntry;

/// Cached app list: the scan (Start Menu + AppsFolder COM enumeration)
/// costs ~2s, so search shouldn't pay it on every open.
static APP_CACHE: parking_lot::Mutex<Option<(std::time::Instant, Vec<AppEntry>)>> =
    parking_lot::Mutex::new(None);
const APP_CACHE_TTL_SECS: u64 = 300;

fn scan_apps_cached(force: bool) -> AeroResult<Vec<AppEntry>> {
    if !force {
        if let Some((at, apps)) = APP_CACHE.lock().as_ref() {
            if at.elapsed().as_secs() < APP_CACHE_TTL_SECS {
                return Ok(apps.clone());
            }
        }
    }
    let apps = crate::platform::windows::apps::enumerate_apps()?;
    *APP_CACHE.lock() = Some((std::time::Instant::now(), apps.clone()));
    Ok(apps)
}

/// Warm the cache off the critical path (called once at startup).
pub fn warm_app_cache() {
    tauri::async_runtime::spawn_blocking(|| {
        if let Err(e) = scan_apps_cached(true) {
            log::warn!("app cache warm failed: {e}");
        }
    });
}

/// Enumerate installed apps (Start Menu + Desktop + AppsFolder), cached.
#[tauri::command]
pub async fn list_apps() -> AeroResult<Vec<AppEntry>> {
    tauri::async_runtime::spawn_blocking(|| scan_apps_cached(false))
        .await
        .map_err(|e| AeroError::other(format!("app scan task failed: {e}")))?
}

/// Resolve icons for a batch of launch targets. Returns
/// `target -> absolute PNG path` for every target that yielded an icon;
/// targets that fail are simply absent (frontend falls back to a glyph).
#[tauri::command]
pub async fn resolve_icons(
    app: AppHandle,
    targets: Vec<String>,
    style: Option<String>,
    tint: Option<String>,
) -> AeroResult<HashMap<String, String>> {
    let cache_dir = crate::core::paths::data_dir(&app)?.join("icons");
    // the look the icons are asked for in (none for plain), and the colour of the tinted one
    let look = style.as_deref().and_then(crate::core::glassicon::Style::parse);
    let tint = tint.as_deref().and_then(crate::core::glassicon::parse_hex).unwrap_or([0x2f, 0x9d, 0xe3]);
    tauri::async_runtime::spawn_blocking(move || {
        let mut out = HashMap::with_capacity(targets.len());
        for target in targets {
            match crate::platform::windows::icons::ensure_icon(&target, &cache_dir) {
                Ok(path) => {
                    // the glass copy is made once and kept beside the plain one; if it cannot
                    // be made the plain icon is better than none
                    let shown = match look {
                        Some(style) => crate::core::glassicon::variant_path(&path, style, tint).unwrap_or(path),
                        None => path,
                    };
                    out.insert(target, shown.to_string_lossy().to_string());
                }
                Err(e) => eprintln!("[icons] no icon for {target}: {e}"),
            }
        }
        out
    })
    .await
    .map_err(|e| AeroError::other(format!("icon task failed: {e}")))
}

/// Launch an app (or open a file/folder) through the shell, detached from
/// our process, with optional arguments and working directory.
#[tauri::command]
pub async fn launch(app: tauri::AppHandle, target: String, args: Option<String>) -> AeroResult<()> {
    // Aero Dock pinned to itself means its settings window. Starting the
    // exe again would only hit the single-instance guard, which just shows
    // the dock.
    if is_own_exe(&target) {
        return crate::commands::settings::open_settings(app).await;
    }
    // the shell will not reliably foreground what we start from here, so
    // ask the running-app tracker to do it when the new window appears
    #[cfg(windows)]
    crate::platform::windows::running::focus_next_new_window();
    tauri::async_runtime::spawn_blocking(move || launch_blocking(&target, args.as_deref()))
        .await
        .map_err(|e| AeroError::other(format!("launch task failed: {e}")))?
}

/// True when `target` is the executable that is running right now.
fn is_own_exe(target: &str) -> bool {
    let Ok(own) = std::env::current_exe() else {
        return false;
    };
    let same = |a: &std::path::Path, b: &std::path::Path| {
        match (std::fs::canonicalize(a), std::fs::canonicalize(b)) {
            (Ok(a), Ok(b)) => a == b,
            _ => a.to_string_lossy().eq_ignore_ascii_case(&b.to_string_lossy()),
        }
    };
    same(std::path::Path::new(target), &own)
}

fn shell_execute(verb: &str, target: &str, args: Option<&str>) -> AeroResult<()> {
    use windows::core::PCWSTR;
    use windows::Win32::UI::Shell::ShellExecuteW;
    use windows::Win32::UI::WindowsAndMessaging::SW_SHOWNORMAL;

    use crate::platform::windows::util::to_wide;

    let _com = crate::platform::ComApartment::new();
    let target_w = to_wide(target);
    let args_w = args.map(to_wide);
    let verb_w = to_wide(verb);
    // real files get their folder as workdir; URIs (ms-settings:) get none
    let workdir = std::path::Path::new(target)
        .parent()
        .filter(|p| !p.as_os_str().is_empty() && p.exists())
        .map(|p| to_wide(&p.to_string_lossy()));

    let hinst = unsafe {
        ShellExecuteW(
            None,
            PCWSTR(verb_w.as_ptr()),
            PCWSTR(target_w.as_ptr()),
            args_w.as_ref().map_or(PCWSTR::null(), |a| PCWSTR(a.as_ptr())),
            workdir.as_ref().map_or(PCWSTR::null(), |w| PCWSTR(w.as_ptr())),
            SW_SHOWNORMAL,
        )
    };
    // ShellExecuteW returns a value > 32 on success (legacy contract).
    if hinst.0 as isize <= 32 {
        return Err(AeroError::other(format!(
            "shell {verb} failed for {target} (code {})",
            hinst.0 as isize
        )));
    }
    Ok(())
}

/// Launch a target the way the dock does, from non-async code.
/// Workspace restore uses this to bring closed apps back.
pub fn launch_target(target: &str) -> AeroResult<()> {
    launch_blocking(target, None)
}

/// Open a shell URI such as `ms-settings:apps-volume`.
pub fn open_shell_uri(uri: &str) -> AeroResult<()> {
    shell_execute("open", uri, None)
}

fn launch_blocking(target: &str, args: Option<&str>) -> AeroResult<()> {
    // packaged apps (Settings, Store apps…) activate by AUMID through
    // the activation manager — ShellExecuteW silently no-ops on these
    if let Some(aumid) = target.strip_prefix("shell:AppsFolder\\") {
        return activate_aumid(aumid, args);
    }
    // An app pinned by the exe in its WindowsApps install folder (as every
    // packaged app that runs in a process of its own used to be, and as a
    // dropped exe still is) cannot be run from there: the folder is not
    // executable by ordinary programs, so the shell answers "access denied" or
    // does nothing at all. The app is started by its AUMID instead, which the
    // package's own manifest gives.
    if crate::platform::windows::packaged::is_packaged_path(target) {
        if let Some(app) = crate::platform::windows::packaged::app_target_for_path(target) {
            if let Some(aumid) = app.strip_prefix("shell:AppsFolder\\") {
                return activate_aumid(aumid, args);
            }
        }
        // The package folder is named for a version, so an update removes it
        // and leaves any pin made from it pointing at nothing.
        if !std::path::Path::new(target).exists() {
            return Err(AeroError::other(
                "this app has been updated since it was pinned; unpin it and pin it again",
            ));
        }
    }
    shell_execute("open", target, args)
}

fn activate_aumid(aumid: &str, args: Option<&str>) -> AeroResult<()> {
    use windows::core::PCWSTR;
    use windows::Win32::System::Com::{CoCreateInstance, CLSCTX_LOCAL_SERVER};
    use windows::Win32::UI::Shell::{
        ApplicationActivationManager, IApplicationActivationManager, AO_NONE,
    };

    use crate::platform::windows::util::to_wide;

    let _com = crate::platform::ComApartment::new();
    let manager: IApplicationActivationManager =
        unsafe { CoCreateInstance(&ApplicationActivationManager, None, CLSCTX_LOCAL_SERVER)? };
    let wide = to_wide(aumid);
    let args_w = args.filter(|a| !a.is_empty()).map(to_wide);
    unsafe {
        manager.ActivateApplication(
            PCWSTR(wide.as_ptr()),
            args_w.as_ref().map_or(PCWSTR::null(), |a| PCWSTR(a.as_ptr())),
            AO_NONE,
        )?
    };
    Ok(())
}

/// The name an app should go by when it is pinned: its own, not the title of
/// whichever window it happens to have open (which is all a running app's
/// entry has, so "Mail - Jake Pascoe - Outlook" got pinned as that). A
/// packaged app's is its Start menu name; any other program's is the
/// description in its version information. None if neither is to be had.
pub fn display_name_for(target: &str) -> Option<String> {
    if target.to_ascii_lowercase().starts_with("shell:appsfolder\\") {
        let apps = scan_apps_cached(false).ok()?;
        return apps
            .into_iter()
            .find(|a| a.target_path.eq_ignore_ascii_case(target))
            .map(|a| a.name)
            .filter(|n| !n.trim().is_empty());
    }
    crate::platform::windows::apps::file_description(target)
}

/// Ask for an app's proper name (see [`display_name_for`]).
#[tauri::command]
pub async fn app_display_name(target: String) -> AeroResult<Option<String>> {
    tauri::async_runtime::spawn_blocking(move || display_name_for(&target))
        .await
        .map_err(|e| AeroError::other(format!("name lookup failed: {e}")))
}

/// Launch elevated (UAC prompt) — the "Run as administrator" menu action.
#[tauri::command]
pub async fn launch_as_admin(target: String, args: Option<String>) -> AeroResult<()> {
    tauri::async_runtime::spawn_blocking(move || {
        shell_execute("runas", &target, args.as_deref())
    })
    .await
    .map_err(|e| AeroError::other(format!("launch task failed: {e}")))?
}

/// Explorer's `/select,` switch is unusually fussy. The path has to be
/// quoted inside the same argument, and the argument has to reach
/// Explorer exactly as written. Rust's normal `arg()` escaping wraps the
/// whole `/select,C:\Program Files\...` string in quotes, which Explorer
/// fails to parse and silently answers by opening Documents. Building the
/// command line by hand and passing it through `raw_arg` is what makes it
/// select the real file.
fn explorer_select_arg(path: &str) -> String {
    format!("/select,\"{path}\"")
}

/// Packaged apps live in the shell's AppsFolder namespace and have no
/// path on disk, so the best "location" to show is that folder.
fn is_shell_namespace(target: &str) -> bool {
    target.to_ascii_lowercase().starts_with("shell:")
}

/// Open Explorer with the target file selected.
#[tauri::command]
pub async fn open_file_location(target: String) -> AeroResult<()> {
    tauri::async_runtime::spawn_blocking(move || {
        use std::os::windows::process::CommandExt;

        if is_shell_namespace(&target) {
            std::process::Command::new("explorer.exe")
                .arg("shell:AppsFolder")
                .spawn()
                .map_err(AeroError::Io)?;
            return Ok(());
        }

        let path = std::path::Path::new(&target);
        if !path.exists() {
            // A pin can outlive the thing it points at. Fall back to the
            // parent folder so the user still lands somewhere useful.
            if let Some(parent) = path.parent().filter(|p| p.exists()) {
                std::process::Command::new("explorer.exe")
                    .arg(parent)
                    .spawn()
                    .map_err(AeroError::Io)?;
                return Ok(());
            }
            return Err(AeroError::other(format!("path not found: {target}")));
        }

        std::process::Command::new("explorer.exe")
            .raw_arg(explorer_select_arg(&target))
            .spawn()
            .map_err(AeroError::Io)?;
        Ok(())
    })
    .await
    .map_err(|e| AeroError::other(format!("explorer task failed: {e}")))?
}

/// Resolve a dropped file into a pinnable (name, target) pair.
/// `.lnk` shortcuts are dereferenced; anything else pins as itself.
#[tauri::command]
pub async fn resolve_drop(path: String) -> AeroResult<AppEntry> {
    tauri::async_runtime::spawn_blocking(move || {
        crate::platform::windows::apps::resolve_single(&path)
    })
    .await
    .map_err(|e| AeroError::other(format!("resolve task failed: {e}")))?
}

/// Recently used files from the Windows Recent folder.
#[tauri::command]
pub async fn list_recent_files(limit: Option<usize>) -> AeroResult<Vec<crate::platform::windows::recent::RecentFile>> {
    tauri::async_runtime::spawn_blocking(move || {
        crate::platform::windows::recent::list_recent(limit.unwrap_or(20))
    })
    .await
    .map_err(|e| AeroError::other(format!("recent files task failed: {e}")))?
}

#[derive(serde::Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FolderEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
}

/// List a pinned folder's contents for the flyout grid: directories
/// first, then files, alphabetical, hidden/system files skipped.
#[tauri::command]
pub async fn list_folder(path: String, limit: Option<usize>) -> AeroResult<Vec<FolderEntry>> {
    tauri::async_runtime::spawn_blocking(move || {
        let limit = limit.unwrap_or(30);
        let mut entries: Vec<FolderEntry> = Vec::new();
        for entry in std::fs::read_dir(&path)?.flatten() {
            let name = entry.file_name().to_string_lossy().to_string();
            if name.starts_with('.') || name.eq_ignore_ascii_case("desktop.ini") {
                continue;
            }
            let is_dir = entry.file_type().map(|t| t.is_dir()).unwrap_or(false);
            entries.push(FolderEntry {
                name,
                path: entry.path().to_string_lossy().to_string(),
                is_dir,
            });
        }
        entries.sort_by(|a, b| {
            b.is_dir
                .cmp(&a.is_dir)
                .then_with(|| a.name.to_lowercase().cmp(&b.name.to_lowercase()))
        });
        entries.truncate(limit);
        Ok(entries)
    })
    .await
    .map_err(|e| AeroError::other(format!("folder list task failed: {e}")))?
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn select_argument_quotes_the_path() {
        assert_eq!(
            explorer_select_arg(r"C:\Program Files\App\app.exe"),
            "/select,\"C:\\Program Files\\App\\app.exe\""
        );
    }

    #[test]
    fn select_argument_handles_paths_without_spaces() {
        assert_eq!(
            explorer_select_arg(r"C:\tools\a.exe"),
            "/select,\"C:\\tools\\a.exe\""
        );
    }

    #[test]
    fn shell_namespace_targets_are_recognised() {
        assert!(is_shell_namespace(r"shell:AppsFolder\Microsoft.WindowsCalculator_8wekyb3d8bbwe!App"));
        assert!(is_shell_namespace("SHELL:AppsFolder\\x"));
        assert!(!is_shell_namespace(r"C:\Windows\notepad.exe"));
    }
}
