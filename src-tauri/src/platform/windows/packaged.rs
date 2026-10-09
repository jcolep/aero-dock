//! Packaged (MSIX and Store) apps: Terminal, the new Notepad, Paint, Teams,
//! the new Outlook and the rest.
//!
//! They cannot be launched from the exe they run. The exe sits in a folder
//! under `C:\Program Files\WindowsApps\` named for the package's version, which
//! ordinary programs may not execute from, and which is a different folder
//! after every update. They are launched by their AppUserModelID (AUMID, as in
//! `Microsoft.WindowsTerminal_8wekyb3d8bbwe!App`) through the activation
//! manager instead.
//!
//! Only windows hosted by `ApplicationFrameHost` used to be given one, so an
//! app that runs in a process of its own (all of the above) was pinned by its
//! exe path, and the pin then failed to open, or opened nothing, once the app
//! was closed. The AUMID is read from the process here, and for a path that
//! was pinned before, worked out from the package's own manifest.

use std::path::{Path, PathBuf};

/// The part of a path that marks a packaged app's install folder.
const WINDOWS_APPS: &str = "\\windowsapps\\";

/// Whether a path is inside the packaged apps' install folder.
pub fn is_packaged_path(path: &str) -> bool {
    path.to_ascii_lowercase().contains(WINDOWS_APPS)
}

/// The AUMID of the packaged app a process belongs to, or None if it has no
/// package identity (an ordinary program).
pub fn process_aumid(pid: u32) -> Option<String> {
    use windows::core::PWSTR;
    use windows::Win32::Foundation::{CloseHandle, ERROR_SUCCESS};
    use windows::Win32::Storage::Packaging::Appx::GetApplicationUserModelId;
    use windows::Win32::System::Threading::{OpenProcess, PROCESS_QUERY_LIMITED_INFORMATION};

    unsafe {
        let handle = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, false, pid).ok()?;
        // an AUMID is at most 130 characters, counting the terminator
        let mut buf = [0u16; 130];
        let mut len = buf.len() as u32;
        let status = GetApplicationUserModelId(handle, &mut len, Some(PWSTR(buf.as_mut_ptr())));
        let _ = CloseHandle(handle);
        if status != ERROR_SUCCESS || len == 0 {
            return None;
        }
        let text = String::from_utf16_lossy(&buf[..(len as usize).saturating_sub(1)]);
        (!text.is_empty()).then_some(text)
    }
}

/// Split `...\WindowsApps\<package folder>\<rest>` into the package folder and
/// the exe's path inside it.
fn split_package_path(path: &str) -> Option<(PathBuf, String)> {
    let lower = path.to_ascii_lowercase();
    let at = lower.find(WINDOWS_APPS)? + WINDOWS_APPS.len();
    let rest = &path[at..];
    let (folder, inside) = rest.split_once('\\')?;
    if folder.is_empty() || inside.is_empty() {
        return None;
    }
    let root = &path[..at];
    Some((Path::new(root).join(folder), inside.to_string()))
}

/// `Name_1.2.3.4_x64__publisherid` is the package folder of the package family
/// `Name_publisherid`: the name, then the publisher, with the version, the
/// architecture and the (usually empty) resource id left out.
fn family_name(folder: &str) -> Option<String> {
    let parts: Vec<&str> = folder.split('_').collect();
    if parts.len() < 5 {
        return None;
    }
    let name = parts[0];
    let publisher = parts[parts.len() - 1];
    (!name.is_empty() && !publisher.is_empty()).then(|| format!("{name}_{publisher}"))
}

/// One attribute's value out of a tag's text: `Id="x"` gives `x`. The name has
/// to start after a space, so `Id` is not found inside `ProcessId`.
fn attribute<'a>(tag: &'a str, name: &str) -> Option<&'a str> {
    let needle = format!(" {name}=\"");
    let start = tag.find(&needle)? + needle.len();
    let end = tag[start..].find('"')?;
    Some(&tag[start..start + end])
}

/// One application a package declares.
#[derive(Debug, PartialEq)]
struct Declared {
    id: String,
    executable: String,
    /// Whether it has an entry in the Start menu. A package can declare
    /// several applications that run the same exe (Teams has a background
    /// container beside the app itself), and only the one that is listed is the
    /// app the user means.
    listed: bool,
}

/// The applications a package manifest declares.
fn manifest_applications(xml: &str) -> Vec<Declared> {
    let mut out = Vec::new();
    let mut rest = xml;
    while let Some(at) = rest.find("<Application") {
        let after = &rest[at + "<Application".len()..];
        // `<Applications>` is the list, not an application
        if after.starts_with('s') {
            rest = after;
            continue;
        }
        let end = after.find('>').unwrap_or(after.len());
        let tag = &after[..end];
        // what the application declares runs to its closing tag, unless it is
        // written as a single self-closing tag
        let block = if tag.ends_with('/') {
            tag
        } else {
            let to = after.find("</Application>").unwrap_or(after.len());
            &after[..to]
        };
        if let (Some(id), Some(exe)) = (attribute(tag, "Id"), attribute(tag, "Executable")) {
            out.push(Declared {
                id: id.to_string(),
                executable: exe.to_string(),
                listed: !block.contains("AppListEntry=\"none\""),
            });
        }
        rest = &after[end..];
    }
    out
}

fn normalise(rel: &str) -> String {
    rel.replace('/', "\\").to_ascii_lowercase()
}

/// The AUMID of the application in a package that runs `inside` (the exe's
/// path within the package folder), from the package folder's name and its
/// manifest's text.
fn aumid_from_manifest(folder: &str, inside: &str, manifest: &str) -> Option<String> {
    let family = family_name(folder)?;
    let apps = manifest_applications(manifest);
    let wanted = normalise(inside);
    let file = wanted.rsplit('\\').next().unwrap_or(&wanted).to_string();
    // Of the applications that run this exe, the one with a Start menu entry
    // is the one meant; failing that, the first.
    fn best(matches: Vec<&Declared>) -> Option<&Declared> {
        matches
            .iter()
            .find(|d| d.listed)
            .or_else(|| matches.first())
            .copied()
    }
    let found = best(apps.iter().filter(|d| normalise(&d.executable) == wanted).collect())
        .or_else(|| {
            best(
                apps.iter()
                    .filter(|d| normalise(&d.executable).rsplit('\\').next() == Some(file.as_str()))
                    .collect(),
            )
        })
        // one application: that has to be it
        .or_else(|| (apps.len() == 1).then(|| &apps[0]));
    found.map(|d| format!("{family}!{}", d.id))
}

/// The AUMID for an exe inside a packaged app's install folder, read from the
/// manifest beside it. None for an ordinary path, or if the package has since
/// been updated and its old folder removed.
pub fn aumid_for_exe(path: &str) -> Option<String> {
    let (dir, inside) = split_package_path(path)?;
    let manifest = std::fs::read_to_string(dir.join("AppxManifest.xml")).ok()?;
    let folder = dir.file_name()?.to_string_lossy().into_owned();
    aumid_from_manifest(&folder, &inside, &manifest)
}

/// The launch target a pin of a packaged app's exe should have instead, the
/// same `shell:AppsFolder\<AUMID>` that apps found by the dock use. None if
/// the path is not a packaged app's, or its AUMID cannot be worked out.
pub fn app_target_for_path(path: &str) -> Option<String> {
    if !is_packaged_path(path) {
        return None;
    }
    aumid_for_exe(path).map(|aumid| format!("shell:AppsFolder\\{aumid}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEAMS_DIR: &str = "MSTeams_26225.1806.5074.1452_x64__8wekyb3d8bbwe";
    const TEAMS_EXE: &str =
        "C:\\Program Files\\WindowsApps\\MSTeams_26225.1806.5074.1452_x64__8wekyb3d8bbwe\\ms-teams.exe";

    const MANIFEST: &str = r#"<?xml version="1.0" encoding="utf-8"?>
<Package xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10">
  <Identity Name="MSTeams" Publisher="CN=Microsoft Corporation" Version="26225.1806.5074.1452" />
  <Applications>
    <Application Id="MSTeams" Executable="ms-teams.exe" EntryPoint="Windows.FullTrustApplication">
      <uap:VisualElements DisplayName="Microsoft Teams" />
    </Application>
  </Applications>
</Package>"#;

    #[test]
    fn a_packaged_path_is_told_from_an_ordinary_one() {
        assert!(is_packaged_path(TEAMS_EXE));
        assert!(is_packaged_path(&TEAMS_EXE.to_uppercase()));
        assert!(!is_packaged_path("C:\\Program Files\\Mozilla Firefox\\firefox.exe"));
        assert!(!is_packaged_path("shell:AppsFolder\\Microsoft.WindowsTerminal_8wekyb3d8bbwe!App"));
    }

    #[test]
    fn a_path_splits_into_the_package_folder_and_the_exe_inside_it() {
        let (dir, inside) = split_package_path(TEAMS_EXE).expect("splits");
        assert_eq!(dir.file_name().unwrap().to_string_lossy(), TEAMS_DIR);
        assert_eq!(inside, "ms-teams.exe");

        let nested = "C:\\Program Files\\WindowsApps\\Microsoft.WindowsNotepad_11.2.0.0_x64__8wekyb3d8bbwe\\Notepad\\Notepad.exe";
        let (_, inside) = split_package_path(nested).expect("splits");
        assert_eq!(inside, "Notepad\\Notepad.exe");

        assert!(split_package_path("C:\\Windows\\notepad.exe").is_none());
        assert!(split_package_path("C:\\Program Files\\WindowsApps\\").is_none());
    }

    #[test]
    fn the_family_name_leaves_out_the_version_and_architecture() {
        assert_eq!(family_name(TEAMS_DIR).as_deref(), Some("MSTeams_8wekyb3d8bbwe"));
        // a resource id in the middle is left out too
        assert_eq!(
            family_name("Microsoft.WindowsTerminal_1.21.0_x64__8wekyb3d8bbwe").as_deref(),
            Some("Microsoft.WindowsTerminal_8wekyb3d8bbwe")
        );
        assert_eq!(
            family_name("Some.App_2.0.0.0_neutral_split.scale-100_abc123xyz").as_deref(),
            Some("Some.App_abc123xyz")
        );
        assert_eq!(family_name("not-a-package-folder"), None);
    }

    #[test]
    fn the_application_with_a_start_menu_entry_wins_when_several_run_the_same_exe() {
        // laid out as Teams' own manifest is: a hidden container comes first
        let manifest = r#"<Package><Applications>
            <Application Id="MSTeamsRemoteModuleContainer" Executable="ms-teams.exe" EntryPoint="x">
              <uap:VisualElements DisplayName="Container" AppListEntry="none" />
            </Application>
            <Application Id="MSTeams" Executable="ms-teams.exe" EntryPoint="x">
              <uap:VisualElements DisplayName="Microsoft Teams" />
            </Application>
            <Application Id="MSTeams.Update" Executable="ms-teamsupdate.exe" EntryPoint="x">
              <uap:VisualElements DisplayName="Updater" AppListEntry="none" />
            </Application>
        </Applications></Package>"#;
        let apps = manifest_applications(manifest);
        assert_eq!(apps.len(), 3);
        assert!(!apps[0].listed && apps[1].listed && !apps[2].listed);
        assert_eq!(
            aumid_from_manifest(TEAMS_DIR, "ms-teams.exe", manifest).as_deref(),
            Some("MSTeams_8wekyb3d8bbwe!MSTeams")
        );
        // and when only hidden ones run it, the first still gives an answer
        assert_eq!(
            aumid_from_manifest(TEAMS_DIR, "ms-teamsupdate.exe", manifest).as_deref(),
            Some("MSTeams_8wekyb3d8bbwe!MSTeams.Update")
        );
    }

    #[test]
    fn a_self_closing_application_tag_is_read_too() {
        let manifest = r#"<Package><Applications><Application Id="Solo" Executable="solo.exe" /></Applications></Package>"#;
        let apps = manifest_applications(manifest);
        assert_eq!(
            apps,
            vec![Declared { id: "Solo".into(), executable: "solo.exe".into(), listed: true }]
        );
    }

    #[test]
    fn the_manifest_gives_the_application_id() {
        let apps = manifest_applications(MANIFEST);
        assert_eq!(apps.len(), 1);
        assert_eq!((apps[0].id.as_str(), apps[0].executable.as_str()), ("MSTeams", "ms-teams.exe"));
        assert_eq!(
            aumid_from_manifest(TEAMS_DIR, "ms-teams.exe", MANIFEST).as_deref(),
            Some("MSTeams_8wekyb3d8bbwe!MSTeams")
        );
    }

    #[test]
    fn a_package_with_several_applications_gives_the_one_that_runs_this_exe() {
        let manifest = r#"<Package><Applications>
            <Application Id="App" Executable="Terminal\wt.exe" EntryPoint="x" />
            <Application Id="Preview" Executable="Terminal\wtp.exe" EntryPoint="x" />
        </Applications></Package>"#;
        let dir = "Microsoft.WindowsTerminal_1.21.0_x64__8wekyb3d8bbwe";
        assert_eq!(
            aumid_from_manifest(dir, "Terminal\\wtp.exe", manifest).as_deref(),
            Some("Microsoft.WindowsTerminal_8wekyb3d8bbwe!Preview")
        );
        // forward slashes and case do not matter
        assert_eq!(
            aumid_from_manifest(dir, "terminal/WT.EXE", manifest).as_deref(),
            Some("Microsoft.WindowsTerminal_8wekyb3d8bbwe!App")
        );
        // two applications and no match: no guess
        assert_eq!(aumid_from_manifest(dir, "other.exe", manifest), None);
    }

    #[test]
    fn an_application_id_is_not_found_inside_a_longer_attribute_name() {
        let tag = r#" ProcessId="wrong" Id="right" Executable="a.exe""#;
        assert_eq!(attribute(tag, "Id"), Some("right"));
        assert_eq!(attribute(tag, "Missing"), None);
    }

    #[test]
    fn an_ordinary_path_has_no_packaged_target() {
        assert_eq!(app_target_for_path("C:\\Windows\\explorer.exe"), None);
        assert_eq!(app_target_for_path("shell:AppsFolder\\X_abc!App"), None);
    }
}
