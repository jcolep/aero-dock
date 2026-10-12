//! Finding files and folders for the Start menu's search, with Windows' own
//! index (the one Explorer's search box uses), so a result is as quick and as
//! complete as theirs: names, and the words inside documents.
//!
//! The index only covers the places Windows is told to look (by default the
//! user's folders), which is also why nothing here wanders the disk.

use serde::Serialize;
use windows::core::HSTRING;
use windows::Storage::Search::{FolderDepth, IndexerOption, QueryOptions};
use windows::Storage::StorageFolder;

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Found {
    pub name: String,
    pub path: String,
    pub folder: bool,
}

/// Whether a result is worth showing: not something a program keeps for itself.
pub fn worth_showing(path: &str) -> bool {
    let p = path.to_ascii_lowercase();
    !(p.contains("\\appdata\\") || p.contains("\\.git\\") || p.contains("\\node_modules\\") || p.contains("\\$recycle.bin\\"))
}

/// Files and folders matching `query`, files first, at most `limit` of each kind.
pub async fn search(query: &str, limit: u32) -> Vec<Found> {
    let query = query.trim();
    if query.is_empty() {
        return Vec::new();
    }
    let Ok(profile) = std::env::var("USERPROFILE") else {
        return Vec::new();
    };
    let Ok(root) = StorageFolder::GetFolderFromPathAsync(&HSTRING::from(profile)) else {
        return Vec::new();
    };
    let Ok(root) = root.await else {
        return Vec::new();
    };

    let options = || -> Option<QueryOptions> {
        let o = QueryOptions::new().ok()?;
        o.SetFolderDepth(FolderDepth::Deep).ok()?;
        o.SetIndexerOption(IndexerOption::OnlyUseIndexer).ok()?;
        o.SetUserSearchFilter(&HSTRING::from(query)).ok()?;
        Some(o)
    };

    let mut found = Vec::new();
    // asked for more than wanted, since some will be thrown out
    let ask = limit * 3;
    if let Some(o) = options() {
        if let Ok(q) = root.CreateFileQueryWithOptions(&o) {
            if let Ok(op) = q.GetFilesAsync(0, ask) {
                if let Ok(files) = op.await {
                    for f in files {
                        let (Ok(name), Ok(path)) = (f.Name(), f.Path()) else { continue };
                        let path = path.to_string();
                        if worth_showing(&path) {
                            found.push(Found { name: name.to_string(), path, folder: false });
                        }
                    }
                }
            }
        }
    }
    // what is called by the word comes before what only mentions it
    let wanted = query.to_lowercase();
    found.sort_by_key(|f| !f.name.to_lowercase().contains(&wanted));
    found.truncate(limit as usize);
    let mut folders = Vec::new();
    if let Some(o) = options() {
        if let Ok(q) = root.CreateFolderQueryWithOptions(&o) {
            if let Ok(op) = q.GetFoldersAsync(0, ask) {
                if let Ok(list) = op.await {
                    for f in list {
                        let (Ok(name), Ok(path)) = (f.Name(), f.Path()) else { continue };
                        let path = path.to_string();
                        if worth_showing(&path) {
                            folders.push(Found { name: name.to_string(), path, folder: true });
                        }
                    }
                }
            }
        }
    }
    folders.sort_by_key(|f| !f.name.to_lowercase().contains(&wanted));
    folders.truncate(limit as usize / 2 + 1);
    found.extend(folders);
    found
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn what_programs_keep_for_themselves_is_not_shown() {
        assert!(worth_showing(r"C:\Users\x\Documents\report.docx"));
        assert!(!worth_showing(r"C:\Users\x\AppData\Local\Temp\a.txt"));
        assert!(!worth_showing(r"C:\Users\x\src\app\node_modules\a\index.js"));
        assert!(!worth_showing(r"C:\Users\x\src\app\.git\config"));
    }

    #[test]
    fn an_empty_search_finds_nothing_and_a_search_never_fails() {
        assert!(tauri::async_runtime::block_on(search("   ", 8)).is_empty());
        // whatever the machine's index has, it comes back as a list
        let _ = tauri::async_runtime::block_on(search("zzzz-not-a-real-file-name", 8));
    }

    /// Prints what the index finds. `cargo test --lib what_the_index_finds -- --ignored --nocapture`
    #[test]
    #[ignore]
    fn what_the_index_finds() {
        let started = std::time::Instant::now();
        let found = tauri::async_runtime::block_on(search("readme", 8));
        println!("{} results in {:?}", found.len(), started.elapsed());
        for f in found {
            println!("  {} {}", if f.folder { "[folder]" } else { "[file]  " }, f.path);
        }
    }
}
