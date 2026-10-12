//! What was downloaded lately, for the Start menu: the newest things in the
//! Downloads folder, whichever program put them there.
//!
//! The folder is the one Windows says is Downloads (it can be moved off the
//! user's profile), not a guessed path. A download still in progress is not
//! listed: a browser writes it under a temporary name until it is done, and a
//! half-written file is not one to offer to open.

use std::path::PathBuf;
use std::time::UNIX_EPOCH;

use serde::Serialize;

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Download {
    pub name: String,
    pub path: String,
    /// When it last changed, in milliseconds since 1970.
    pub modified_ms: i64,
    pub size: u64,
    pub folder: bool,
}

/// What reading a directory entry gave, before any of it is judged.
#[derive(Debug, Clone)]
pub struct Raw {
    pub name: String,
    pub path: String,
    pub modified_ms: i64,
    pub size: u64,
    pub folder: bool,
    pub hidden: bool,
}

/// The endings a browser or downloader gives a file until it is complete.
const UNFINISHED: &[&str] = &[".crdownload", ".part", ".partial", ".tmp", ".download", ".opdownload", ".!ut", ".aria2"];

/// Whether a name is something to offer: not unfinished, not the folder's own
/// bookkeeping.
pub fn offerable(name: &str) -> bool {
    let lower = name.to_ascii_lowercase();
    !(lower == "desktop.ini" || lower == "thumbs.db" || lower.starts_with('.') || UNFINISHED.iter().any(|e| lower.ends_with(e)))
}

/// The newest `limit` of the entries that are worth offering, newest first.
pub fn pick(mut entries: Vec<Raw>, limit: usize) -> Vec<Download> {
    entries.retain(|e| !e.hidden && offerable(&e.name));
    entries.sort_by(|a, b| b.modified_ms.cmp(&a.modified_ms).then_with(|| a.name.cmp(&b.name)));
    entries
        .into_iter()
        .take(limit)
        .map(|e| Download { name: e.name, path: e.path, modified_ms: e.modified_ms, size: e.size, folder: e.folder })
        .collect()
}

/// Where Downloads is: the place Windows records, else `Downloads` in the profile.
pub fn downloads_dir() -> Option<PathBuf> {
    use windows::Win32::System::Com::CoTaskMemFree;
    use windows::Win32::UI::Shell::{FOLDERID_Downloads, SHGetKnownFolderPath, KF_FLAG_DEFAULT};
    let known = unsafe {
        SHGetKnownFolderPath(&FOLDERID_Downloads, KF_FLAG_DEFAULT, None).ok().map(|p| {
            let path = p.to_string().ok();
            CoTaskMemFree(Some(p.0 as *const _));
            path
        })
    }
    .flatten()
    .map(PathBuf::from)
    .filter(|p| p.is_dir());
    known.or_else(|| std::env::var_os("USERPROFILE").map(|p| PathBuf::from(p).join("Downloads")).filter(|p| p.is_dir()))
}

/// The newest things downloaded, newest first.
pub fn recent(limit: usize) -> Vec<Download> {
    use std::os::windows::fs::MetadataExt;
    // hidden (2) and system (4) files are the folder's own
    const HIDDEN_OR_SYSTEM: u32 = 0x2 | 0x4;
    let Some(dir) = downloads_dir() else {
        return Vec::new();
    };
    let Ok(read) = std::fs::read_dir(dir) else {
        return Vec::new();
    };
    let entries = read
        .filter_map(|e| e.ok())
        .filter_map(|e| {
            let meta = e.metadata().ok()?;
            let modified = meta.modified().ok()?.duration_since(UNIX_EPOCH).ok()?.as_millis() as i64;
            Some(Raw {
                name: e.file_name().to_string_lossy().into_owned(),
                path: e.path().to_string_lossy().into_owned(),
                modified_ms: modified,
                size: meta.len(),
                folder: meta.is_dir(),
                hidden: meta.file_attributes() & HIDDEN_OR_SYSTEM != 0,
            })
        })
        .collect();
    pick(entries, limit)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn raw(name: &str, modified_ms: i64) -> Raw {
        Raw { name: name.into(), path: format!("C:\\Users\\x\\Downloads\\{name}"), modified_ms, size: 10, folder: false, hidden: false }
    }

    #[test]
    fn a_download_still_arriving_is_not_offered() {
        assert!(offerable("report.pdf"));
        assert!(!offerable("report.pdf.crdownload"));
        assert!(!offerable("movie.mkv.PART"));
        assert!(!offerable("setup.exe.tmp"));
        assert!(!offerable("desktop.ini"));
        assert!(!offerable(".DS_Store"));
        // a name that merely contains one of those words is fine
        assert!(offerable("part-list.xlsx"));
        assert!(offerable("download.png"));
    }

    #[test]
    fn the_newest_come_first_and_only_as_many_as_asked_for() {
        let picked = pick(vec![raw("old.zip", 100), raw("new.zip", 300), raw("mid.zip", 200), raw("newest.zip.crdownload", 400)], 2);
        let names: Vec<&str> = picked.iter().map(|d| d.name.as_str()).collect();
        assert_eq!(names, ["new.zip", "mid.zip"]);
    }

    #[test]
    fn hidden_things_and_ties_are_handled() {
        let mut secret = raw("secret.txt", 999);
        secret.hidden = true;
        let picked = pick(vec![secret, raw("b.txt", 5), raw("a.txt", 5)], 10);
        // the same moment: by name, so the order does not shuffle between looks
        assert_eq!(picked.iter().map(|d| d.name.as_str()).collect::<Vec<_>>(), ["a.txt", "b.txt"]);
        assert!(pick(Vec::new(), 5).is_empty());
        assert!(pick(vec![raw("a", 1)], 0).is_empty());
    }

    #[test]
    fn reading_the_real_folder_never_fails() {
        let found = recent(6);
        assert!(found.len() <= 6);
        assert!(found.windows(2).all(|w| w[0].modified_ms >= w[1].modified_ms), "newest first");
    }

    /// Prints what is in this machine's Downloads. `cargo test --lib what_was_downloaded -- --ignored --nocapture`
    #[test]
    #[ignore]
    fn what_was_downloaded() {
        println!("folder: {:?}", downloads_dir());
        for d in recent(8) {
            println!("  {} ({} bytes, {} ms)", d.name, d.size, d.modified_ms);
        }
    }
}
