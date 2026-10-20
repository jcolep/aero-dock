//! An app's Jump List: what Windows' taskbar shows when the app is right-clicked (Remote Desktop's recent
//! connections, a browser's "New window", an editor's recent files, anything pinned there).
//!
//! Apps write their lists to Windows (`ICustomDestinationList`, and Windows records recent and pinned files itself),
//! and Windows keeps them per user under `%APPDATA%\Microsoft\Windows\Recent\`. There is no documented way to read
//! another app's list; the documented interfaces only manage an app's own. What the taskbar reads them with is two
//! internal interfaces of `windows.storage.dll`, unchanged from Windows 7 to 11 (the ID of the first was renewed in
//! Windows 10): `IAutomaticDestinationList` (recent, frequent and pinned) and `IInternalCustomDestinationList` (the
//! app's own categories and tasks). Their layout here is as published by the author of the open-source Files app's
//! Jump List code (0x5bfa, MIT): https://qiita.com/0x5bfa/items/211d5ebdd9eab6cd1881 and
//! https://github.com/0x5bfa/JumpListManager. Only reading is used; nothing is ever written to an app's list.
//!
//! A list belongs to an AppUserModelID, so the hard part is knowing an app's (`app_ids`): a window's own, a packaged
//! app's, the Start menu entry's, or the one Windows works out from the exe's path. Each is tried in turn and the first
//! with anything in it is the one.

// the interfaces' methods keep Windows' own names
#![allow(non_snake_case)]

use serde::Serialize;
use windows::core::{interface, Interface, GUID, HRESULT, IUnknown, IUnknown_Vtbl, PCWSTR, PWSTR};
use windows::Win32::Foundation::{HWND, PROPERTYKEY};
use windows::Win32::System::Com::StructuredStorage::{PropVariantToBoolean, PropVariantToStringAlloc};
use windows::Win32::System::Com::{CoCreateInstance, CoTaskMemFree, CLSCTX_INPROC_SERVER};
use windows::Win32::UI::Shell::Common::{IObjectArray, IObjectCollection};
use windows::Win32::UI::Shell::PropertiesSystem::{IPropertyStore, SHGetPropertyStoreForWindow};
use windows::Win32::UI::Shell::{
    IShellItem, IShellLinkW, SHGetKnownFolderPath, SHLoadIndirectString, FOLDERID_ProgramFilesX64, FOLDERID_ProgramFilesX86,
    FOLDERID_System, FOLDERID_SystemX86, FOLDERID_UserProgramFiles, FOLDERID_Windows, KF_FLAG_DEFAULT,
    SIGDN_DESKTOPABSOLUTEPARSING, SIGDN_NORMALDISPLAY,
};

use crate::platform::windows::util::to_wide;

const CLSID_AUTOMATIC_DESTINATION_LIST: GUID = GUID::from_u128(0xf0ae1542_f497_484b_a175_a20db09144ba);
const CLSID_DESTINATION_LIST: GUID = GUID::from_u128(0x77f10cf0_3db5_4966_b520_b7c54fd35ed6);

/// Windows 10 and 11.
#[interface("e9c5ef8d-fd41-4f72-ba87-eb03bad5817c")]
unsafe trait IAutomaticDestinationList: IUnknown {
    fn Initialize(&self, app_id: PCWSTR, app_path: PCWSTR, list_path: PCWSTR) -> HRESULT;
    fn HasList(&self, has: *mut i32) -> HRESULT;
    fn GetList(&self, kind: u32, max: i32, flags: u32, riid: *const GUID, out: *mut *mut core::ffi::c_void) -> HRESULT;
}

/// The same, as Windows 7 and 8 named it.
#[interface("bc10dce3-62f2-4bc6-af37-db46ed7873c4")]
unsafe trait IAutomaticDestinationList7: IUnknown {
    fn Initialize(&self, app_id: PCWSTR, app_path: PCWSTR, list_path: PCWSTR) -> HRESULT;
    fn HasList(&self, has: *mut i32) -> HRESULT;
    fn GetList(&self, kind: u32, max: i32, flags: u32, riid: *const GUID, out: *mut *mut core::ffi::c_void) -> HRESULT;
}

#[interface("507101cd-f6ad-46c8-8e20-eeb9e6bac47f")]
unsafe trait IInternalCustomDestinationList: IUnknown {
    fn SetMinItems(&self, n: u32) -> HRESULT;
    fn SetApplicationID(&self, app_id: PCWSTR) -> HRESULT;
    fn GetSlotCount(&self, n: *mut u32) -> HRESULT;
    fn GetCategoryCount(&self, n: *mut u32) -> HRESULT;
    fn GetCategory(&self, index: u32, flags: u32, category: *mut Category) -> HRESULT;
    fn DeleteCategory(&self, index: u32, a: i32) -> HRESULT;
    fn EnumerateCategoryDestinations(&self, index: u32, riid: *const GUID, out: *mut *mut core::ffi::c_void) -> HRESULT;
}

/// `APPDESTCATEGORY`, with room to spare after it: it is undocumented, and a Windows that writes more than the four
/// fields known must not write past the end of it.
#[repr(C)]
struct Category {
    kind: u32,
    /// The name (a string Windows allocated, with `GCF_COPY_NAME`) for a custom category, or which known one.
    name_or_known: usize,
    items: u32,
    separators: u32,
    _spare: [u32; 16],
}

const DEST_PINNED: u32 = 0;
const DEST_RECENT: u32 = 1;
const DEST_FREQUENT: u32 = 2;
const CATEGORY_CUSTOM: u32 = 0;
const CATEGORY_KNOWN: u32 = 1;
const CATEGORY_TASKS: u32 = 2;
const KNOWN_FREQUENT: usize = 1;
const KNOWN_RECENT: usize = 2;
const GCF_COPY_NAME: u32 = 1;

const PKEY_TITLE: PROPERTYKEY = PROPERTYKEY { fmtid: GUID::from_u128(0xf29f85e0_4ff9_1068_ab91_08002b27b3d9), pid: 2 };
const PKEY_APP_ID: PROPERTYKEY = PROPERTYKEY { fmtid: GUID::from_u128(0x9f4c2855_9f79_4b39_a8d0_e1d42de1d5f3), pid: 5 };
/// `System.Link.TargetParsingPath`: what a Start menu entry runs.
const PKEY_LINK_TARGET: PROPERTYKEY = PROPERTYKEY { fmtid: GUID::from_u128(0xb9b4b3fc_2b51_4a42_b5d8_324146afcf25), pid: 2 };
const PKEY_IS_SEPARATOR: PROPERTYKEY = PROPERTYKEY { fmtid: GUID::from_u128(0x9f4c2855_9f79_4b39_a8d0_e1d42de1d5f3), pid: 6 };

/// One entry of a list: a shortcut (a task, or one of the app's own entries) or a file or folder Windows recorded.
#[derive(Debug, Clone, Serialize, serde::Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct JumpItem {
    pub title: String,
    /// `link` (run `path` with `args` in `dir`) or `file` (open `path` with the app).
    pub kind: String,
    pub path: String,
    pub args: String,
    pub dir: String,
}

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct JumpSection {
    pub title: String,
    pub items: Vec<JumpItem>,
}

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct JumpList {
    /// The AppUserModelID it was found under.
    pub app_id: String,
    pub sections: Vec<JumpSection>,
}

fn string_of(store: &IPropertyStore, key: &PROPERTYKEY) -> String {
    unsafe {
        let Ok(value) = store.GetValue(key) else { return String::new() };
        let Ok(p) = PropVariantToStringAlloc(&value) else { return String::new() };
        let s = p.to_string().unwrap_or_default();
        CoTaskMemFree(Some(p.0 as *const _));
        s
    }
}

fn bool_of(store: &IPropertyStore, key: &PROPERTYKEY) -> bool {
    unsafe { store.GetValue(key).ok().and_then(|v| PropVariantToBoolean(&v).ok()).is_some_and(|b| b.as_bool()) }
}

/// A string as Windows would show it: `@dll,-123` and `ms-resource:` names looked up, anything else as it is.
fn indirect(text: &str) -> String {
    if !text.starts_with('@') && !text.starts_with("ms-resource") {
        return text.to_string();
    }
    let wide = to_wide(text);
    let mut out = [0u16; 512];
    match unsafe { SHLoadIndirectString(PCWSTR(wide.as_ptr()), &mut out, None) } {
        Ok(()) => String::from_utf16_lossy(&out[..out.iter().position(|c| *c == 0).unwrap_or(0)]),
        Err(_) => text.to_string(),
    }
}

/// What an entry of a list is, or None for a separator or anything that is not a link or a shell item.
fn item_of(unknown: &IUnknown) -> Option<JumpItem> {
    if let Ok(link) = unknown.cast::<IShellLinkW>() {
        let store = link.cast::<IPropertyStore>().ok();
        if let Some(store) = &store {
            if bool_of(store, &PKEY_IS_SEPARATOR) {
                return None;
            }
        }
        let mut path = [0u16; 1024];
        let mut args = [0u16; 2048];
        let mut dir = [0u16; 1024];
        unsafe {
            let _ = link.GetPath(&mut path, std::ptr::null_mut(), 0);
            let _ = link.GetArguments(&mut args);
            let _ = link.GetWorkingDirectory(&mut dir);
        }
        let text = |b: &[u16]| String::from_utf16_lossy(&b[..b.iter().position(|c| *c == 0).unwrap_or(b.len())]);
        let path = text(&path);
        let mut title = store.as_ref().map(|s| indirect(&string_of(s, &PKEY_TITLE))).unwrap_or_default();
        if title.trim().is_empty() {
            let mut desc = [0u16; 512];
            let _ = unsafe { link.GetDescription(&mut desc) };
            title = indirect(&text(&desc));
        }
        if title.trim().is_empty() {
            title = path.rsplit('\\').next().unwrap_or("").trim_end_matches(".exe").to_string();
        }
        if path.is_empty() || title.trim().is_empty() {
            return None;
        }
        return Some(JumpItem { title, kind: "link".into(), path, args: text(&args), dir: text(&dir) });
    }
    if let Ok(item) = unknown.cast::<IShellItem>() {
        let read = |sigdn| unsafe {
            item.GetDisplayName(sigdn).ok().map(|p: PWSTR| {
                let s = p.to_string().unwrap_or_default();
                CoTaskMemFree(Some(p.0 as *const _));
                s
            })
        };
        let title = read(SIGDN_NORMALDISPLAY)?;
        let path = read(SIGDN_DESKTOPABSOLUTEPARSING)?;
        return Some(JumpItem { title, kind: "file".into(), path, args: String::new(), dir: String::new() });
    }
    None
}

fn items_of(array: &IObjectArray, max: usize) -> Vec<JumpItem> {
    let count = unsafe { array.GetCount() }.unwrap_or(0) as usize;
    let mut out = Vec::new();
    for i in 0..count {
        if let Ok(unknown) = unsafe { array.GetAt::<IUnknown>(i as u32) } {
            if let Some(item) = item_of(&unknown) {
                if !out.contains(&item) {
                    out.push(item);
                }
            }
        }
        if out.len() >= max {
            break;
        }
    }
    out
}

/// The automatic list (recent, frequent, pinned) for an app, through whichever name of the interface this Windows has.
struct Automatic(IUnknown);

impl Automatic {
    fn open(app_id: &[u16]) -> Option<Self> {
        let unknown: IUnknown = unsafe { CoCreateInstance(&CLSID_AUTOMATIC_DESTINATION_LIST, None, CLSCTX_INPROC_SERVER) }.ok()?;
        let ok = if let Ok(list) = unknown.cast::<IAutomaticDestinationList>() {
            unsafe { list.Initialize(PCWSTR(app_id.as_ptr()), PCWSTR::null(), PCWSTR::null()) }.is_ok()
        } else if let Ok(list) = unknown.cast::<IAutomaticDestinationList7>() {
            unsafe { list.Initialize(PCWSTR(app_id.as_ptr()), PCWSTR::null(), PCWSTR::null()) }.is_ok()
        } else {
            false
        };
        ok.then_some(Self(unknown))
    }

    fn list(&self, kind: u32, max: usize) -> Vec<JumpItem> {
        let mut out: *mut core::ffi::c_void = std::ptr::null_mut();
        let hr = if let Ok(list) = self.0.cast::<IAutomaticDestinationList>() {
            unsafe { list.GetList(kind, max as i32, 0, &IObjectCollection::IID, &mut out) }
        } else if let Ok(list) = self.0.cast::<IAutomaticDestinationList7>() {
            unsafe { list.GetList(kind, max as i32, 0, &IObjectCollection::IID, &mut out) }
        } else {
            return Vec::new();
        };
        if hr.is_err() || out.is_null() {
            return Vec::new();
        }
        let collection = unsafe { IObjectCollection::from_raw(out) };
        collection.cast::<IObjectArray>().map(|a| items_of(&a, max)).unwrap_or_default()
    }
}

/// The list under one AppUserModelID, as the taskbar lays it out: what is pinned, then the app's own categories in its
/// order (a known category is the recent or frequent list there), then its tasks; an app that has no list of its own
/// gets its recent files. None if there is nothing in it.
fn read_one(app_id: &str, max: usize) -> Option<JumpList> {
    let wide = to_wide(app_id);
    let automatic = Automatic::open(&wide);
    let auto = |kind| automatic.as_ref().map(|a| a.list(kind, max)).unwrap_or_default();
    let mut sections = Vec::new();
    let pinned = auto(DEST_PINNED);
    let mut tasks = None;
    let mut shown_recent = false;
    let custom: Option<IInternalCustomDestinationList> = unsafe { CoCreateInstance(&CLSID_DESTINATION_LIST, None, CLSCTX_INPROC_SERVER) }.ok();
    let mut categories = 0u32;
    if let Some(custom) = &custom {
        if unsafe { custom.SetApplicationID(PCWSTR(wide.as_ptr())) }.is_ok() {
            let _ = unsafe { custom.GetCategoryCount(&mut categories) };
        }
        for i in 0..categories {
            let mut c = Category { kind: u32::MAX, name_or_known: 0, items: 0, separators: 0, _spare: [0; 16] };
            if unsafe { custom.GetCategory(i, GCF_COPY_NAME, &mut c) }.is_err() {
                continue;
            }
            let entries = || {
                let mut out: *mut core::ffi::c_void = std::ptr::null_mut();
                let hr = unsafe { custom.EnumerateCategoryDestinations(i, &IObjectCollection::IID, &mut out) };
                if hr.is_err() || out.is_null() {
                    return Vec::new();
                }
                let collection = unsafe { IObjectCollection::from_raw(out) };
                collection.cast::<IObjectArray>().map(|a| items_of(&a, max)).unwrap_or_default()
            };
            match c.kind {
                CATEGORY_CUSTOM => {
                    let name = if c.name_or_known != 0 {
                        let p = PWSTR(c.name_or_known as *mut u16);
                        let s = unsafe { p.to_string() }.unwrap_or_default();
                        unsafe { CoTaskMemFree(Some(p.0 as *const _)) };
                        indirect(&s)
                    } else {
                        String::new()
                    };
                    let items = entries();
                    if !items.is_empty() {
                        sections.push(JumpSection { title: if name.trim().is_empty() { "Recent".into() } else { name }, items });
                    }
                }
                CATEGORY_KNOWN => {
                    let (title, kind) = if c.name_or_known == KNOWN_FREQUENT { ("Frequent", DEST_FREQUENT) } else { ("Recent", DEST_RECENT) };
                    shown_recent |= c.name_or_known == KNOWN_RECENT;
                    let items = auto(kind);
                    if !items.is_empty() {
                        sections.push(JumpSection { title: title.into(), items });
                    }
                }
                CATEGORY_TASKS => {
                    let items = entries();
                    if !items.is_empty() {
                        tasks = Some(JumpSection { title: "Tasks".into(), items });
                    }
                }
                _ => {}
            }
        }
    }
    // an app without a list of its own shows the files it was last used with
    if categories == 0 && !shown_recent {
        let items = auto(DEST_RECENT);
        if !items.is_empty() {
            sections.push(JumpSection { title: "Recent".into(), items });
        }
    }
    // pinned first; what is pinned is not shown again further down
    if !pinned.is_empty() {
        for s in &mut sections {
            s.items.retain(|i| !pinned.contains(i));
        }
        sections.retain(|s| !s.items.is_empty());
        sections.insert(0, JumpSection { title: "Pinned".into(), items: pinned });
    }
    sections.extend(tasks);
    (!sections.is_empty()).then(|| JumpList { app_id: app_id.to_string(), sections })
}

/// The AppUserModelID Windows gives an ordinary program that does not name its own: its path, with the known folder it
/// is in replaced by that folder's ID (`{6D809377-6AF0-444B-8957-A3773F02200E}\Notepad++\notepad++.exe`).
fn implicit_app_id(exe: &str) -> Option<String> {
    let folders = [
        FOLDERID_System,
        FOLDERID_SystemX86,
        FOLDERID_ProgramFilesX64,
        FOLDERID_ProgramFilesX86,
        FOLDERID_UserProgramFiles,
        FOLDERID_Windows,
    ];
    let lower = exe.to_ascii_lowercase();
    let mut best: Option<(usize, String)> = None;
    for id in folders {
        let Ok(p) = (unsafe { SHGetKnownFolderPath(&id, KF_FLAG_DEFAULT, None) }) else { continue };
        let path = unsafe { p.to_string() }.unwrap_or_default();
        unsafe { CoTaskMemFree(Some(p.0 as *const _)) };
        let prefix = format!("{}\\", path.trim_end_matches('\\')).to_ascii_lowercase();
        if path.is_empty() || !lower.starts_with(&prefix) {
            continue;
        }
        // the most specific folder (System before Windows)
        if best.as_ref().is_none_or(|(len, _)| prefix.len() > *len) {
            best = Some((prefix.len(), format!("{{{id:?}}}\\{}", &exe[prefix.len()..])));
        }
    }
    best.map(|(_, id)| id)
}

/// A window's own AppUserModelID, if it was given one (browsers' profiles, for example).
fn window_app_id(hwnd: isize) -> Option<String> {
    let store: IPropertyStore = unsafe { SHGetPropertyStoreForWindow(HWND(hwnd as *mut _)) }.ok()?;
    let id = string_of(&store, &PKEY_APP_ID);
    (!id.is_empty()).then_some(id)
}

/// The Start menu's own IDs, by the exe each entry runs (lowercased path): an app that names itself (Remote Desktop is
/// `Microsoft.Windows.RemoteDesktop`, VS Code `Microsoft.VisualStudioCode`) keeps its list under that name, not under
/// one worked out from its path. Read from the Apps folder (each entry's `System.Link.TargetParsingPath`), kept for ten
/// minutes.
fn start_menu_ids(exe: &str) -> Vec<String> {
    use std::collections::HashMap;
    use std::time::{Duration, Instant};
    use windows::Win32::UI::Shell::{BHID_EnumItems, BHID_PropertyStore, FOLDERID_AppsFolder, IEnumShellItems, SHGetKnownFolderItem, SIGDN_PARENTRELATIVEPARSING};
    /// When it was read, and the IDs by exe.
    type Kept = Option<(Instant, HashMap<String, Vec<String>>)>;
    static MAP: parking_lot::Mutex<Kept> = parking_lot::Mutex::new(None);
    let mut map = MAP.lock();
    if map.as_ref().is_none_or(|(at, m)| m.is_empty() || at.elapsed() > Duration::from_secs(600)) {
        let _com = crate::platform::ComApartment::new();
        let mut by_exe: HashMap<String, Vec<String>> = HashMap::new();
        let mut read = || -> windows::core::Result<()> {
            let folder: IShellItem = unsafe { SHGetKnownFolderItem(&FOLDERID_AppsFolder, KF_FLAG_DEFAULT, None)? };
            let items: IEnumShellItems = unsafe { folder.BindToHandler(None, &BHID_EnumItems)? };
            loop {
                let mut got = [None];
                let mut n = 0;
                if unsafe { items.Next(&mut got, Some(&mut n)) }.is_err() || n == 0 {
                    break;
                }
                let Some(item) = got[0].take() else { break };
                let Ok(p) = (unsafe { item.GetDisplayName(SIGDN_PARENTRELATIVEPARSING) }) else { continue };
                let id = unsafe { p.to_string() }.unwrap_or_default();
                unsafe { CoTaskMemFree(Some(p.0 as *const _)) };
                let Ok(store) = (unsafe { item.BindToHandler::<_, IPropertyStore>(None, &BHID_PropertyStore) }) else { continue };
                let target = string_of(&store, &PKEY_LINK_TARGET);
                if !id.is_empty() && target.to_ascii_lowercase().ends_with(".exe") {
                    by_exe.entry(target.to_ascii_lowercase()).or_default().push(id);
                }
            }
            Ok(())
        };
        if let Err(e) = read() {
            log::warn!("could not read the Start menu's app ids: {e}");
        }
        *map = Some((Instant::now(), by_exe));
    }
    map.as_ref().and_then(|(_, m)| m.get(&exe.to_ascii_lowercase()).cloned()).unwrap_or_default()
}

/// Programs whose Start menu entry is not their exe: File Explorer's opens a shell folder.
fn well_known_id(exe: &str) -> Option<String> {
    match crate::core::names::exe_key(exe).as_str() {
        "explorer.exe" => Some("Microsoft.Windows.Explorer".into()),
        _ => None,
    }
}

/// The names an app's list could be under, most specific first.
pub fn app_ids(target: &str, exe: &str, hwnds: &[isize], pids: &[u32]) -> Vec<String> {
    let mut ids: Vec<String> = Vec::new();
    let mut add = |id: Option<String>| {
        if let Some(id) = id.filter(|i| !i.trim().is_empty()) {
            if !ids.iter().any(|x| x.eq_ignore_ascii_case(&id)) {
                ids.push(id);
            }
        }
    };
    for h in hwnds {
        add(window_app_id(*h));
    }
    for p in pids {
        add(crate::platform::windows::packaged::process_aumid(*p));
    }
    if let Some(aumid) = target.strip_prefix("shell:AppsFolder\\").or_else(|| target.strip_prefix("shell:appsfolder\\")) {
        add(Some(aumid.to_string()));
    }
    let program = if exe.is_empty() { target } else { exe };
    if crate::platform::windows::packaged::is_packaged_path(program) {
        add(crate::platform::windows::packaged::aumid_for_exe(program));
    }
    add(well_known_id(program));
    for id in start_menu_ids(program) {
        add(Some(id));
    }
    add(implicit_app_id(program));
    ids
}

/// The first of `ids` with a list, read; or None.
pub fn read(ids: &[String], max: usize) -> Option<JumpList> {
    let _com = crate::platform::ComApartment::new();
    ids.iter().find_map(|id| read_one(id, max))
}

/// Open an entry the way the taskbar would. A shortcut runs as it says (Remote Desktop's `mstsc /v:host`, a browser's
/// page). A file or folder opens with the app whose list it is in (a picture in VS Code's recent files opens in VS
/// Code, not in the picture viewer), except for File Explorer's and a packaged app's, which Windows opens itself.
pub fn open(item: &JumpItem, exe: &str) -> crate::core::AeroResult<()> {
    use windows::Win32::UI::Shell::ShellExecuteW;
    use windows::Win32::UI::WindowsAndMessaging::SW_SHOWNORMAL;
    let (file, params, dir) = if item.kind == "link" {
        (item.path.clone(), item.args.clone(), item.dir.clone())
    } else {
        let with_app = !exe.is_empty()
            && well_known_id(exe).is_none()
            && !crate::platform::windows::packaged::is_packaged_path(exe)
            && std::path::Path::new(exe).is_file();
        if with_app {
            (exe.to_string(), format!("\"{}\"", item.path), String::new())
        } else {
            (item.path.clone(), String::new(), String::new())
        }
    };
    let (f, p, d) = (to_wide(&file), to_wide(&params), to_wide(&dir));
    let opt = |w: &Vec<u16>, s: &str| if s.is_empty() { PCWSTR::null() } else { PCWSTR(w.as_ptr()) };
    let verb = to_wide("open");
    let result = unsafe { ShellExecuteW(None, PCWSTR(verb.as_ptr()), PCWSTR(f.as_ptr()), opt(&p, &params), opt(&d, &dir), SW_SHOWNORMAL) };
    // above 32 is success; anything else is one of the old error codes
    if result.0 as isize <= 32 {
        return Err(crate::core::AeroError::other(format!("could not open {} ({})", item.title, result.0 as isize)));
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_category_record_has_room_to_spare() {
        // the four known fields, laid out as Windows does on 64-bit, with the spare room after them
        assert!(std::mem::size_of::<Category>() >= 24 + 64);
        assert_eq!(std::mem::offset_of!(Category, name_or_known), 8);
        assert_eq!(std::mem::offset_of!(Category, items), 16);
    }

    #[test]
    fn remote_desktop_is_named_by_the_system_folder() {
        let _com = crate::platform::ComApartment::new();
        let id = implicit_app_id(r"C:\Windows\System32\mstsc.exe").expect("an id");
        assert_eq!(id.to_ascii_uppercase(), r"{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\MSTSC.EXE");
    }

    /// The file name Windows gives a list: CRC-64 (reflected, polynomial 0x92C64265D32139A4, starting from all ones,
    /// no final XOR) of the AppUserModelID; which form of the text is hashed is what this finds out.
    fn crc64(bytes: &[u8]) -> u64 {
        let mut crc = u64::MAX;
        for b in bytes {
            crc ^= *b as u64;
            for _ in 0..8 {
                crc = if crc & 1 != 0 { (crc >> 1) ^ 0x92C6_4265_D321_39A4 } else { crc >> 1 };
            }
        }
        crc
    }

    #[test]
    #[ignore]
    fn find_the_hash() {
        let id = "Microsoft.Windows.Explorer";
        let utf16 = |s: &str| s.encode_utf16().flat_map(|c| c.to_le_bytes()).collect::<Vec<u8>>();
        for (form, bytes) in [
            ("utf16", utf16(id)),
            ("utf16 upper", utf16(&id.to_uppercase())),
            ("utf16 lower", utf16(&id.to_lowercase())),
            ("utf8", id.as_bytes().to_vec()),
            ("utf8 upper", id.to_uppercase().into_bytes()),
        ] {
            println!("{form}: {:016x}", crc64(&bytes));
        }
    }

    /// Which apps have lists on this machine: every AppUserModelID in the Start menu's Apps folder, hashed and matched
    /// to the files in Recent\{Automatic,Custom}Destinations.
    #[test]
    #[ignore]
    fn match_files_to_apps() {
        use windows::Win32::UI::Shell::{BHID_EnumItems, FOLDERID_AppsFolder, IEnumShellItems, SHGetKnownFolderItem, SIGDN_PARENTRELATIVEPARSING};
        let _com = crate::platform::ComApartment::new();
        let recent = std::path::PathBuf::from(std::env::var("APPDATA").unwrap()).join(r"Microsoft\Windows\Recent");
        let mut files: Vec<String> = Vec::new();
        for dir in ["AutomaticDestinations", "CustomDestinations"] {
            for e in std::fs::read_dir(recent.join(dir)).unwrap().flatten() {
                files.push(e.file_name().to_string_lossy().split('.').next().unwrap().to_ascii_lowercase());
            }
        }
        let hash = |id: &str| format!("{:016x}", crc64(&id.to_uppercase().encode_utf16().flat_map(|c| c.to_le_bytes()).collect::<Vec<u8>>()));
        let folder: IShellItem = unsafe { SHGetKnownFolderItem(&FOLDERID_AppsFolder, KF_FLAG_DEFAULT, None) }.unwrap();
        let items: IEnumShellItems = unsafe { folder.BindToHandler(None, &BHID_EnumItems) }.unwrap();
        loop {
            let mut got = [None];
            let mut n = 0;
            if unsafe { items.Next(&mut got, Some(&mut n)) }.is_err() || n == 0 {
                break;
            }
            let item = got[0].take().unwrap();
            let id = unsafe { item.GetDisplayName(SIGDN_PARENTRELATIVEPARSING) }.map(|p| unsafe { p.to_string() }.unwrap_or_default()).unwrap_or_default();
            let h = hash(&id);
            if files.contains(&h) {
                // what the entry runs, as the Apps folder says it
                let store: Option<IPropertyStore> = unsafe { item.BindToHandler(None, &windows::Win32::UI::Shell::BHID_PropertyStore) }.ok();
                let target = store.map(|s| string_of(&s, &PKEY_LINK_TARGET)).unwrap_or_default();
                println!("{h}  {id}  ->  {target}");
            }
        }
        for id in ["Microsoft.Windows.Explorer", "Microsoft.Windows.RemoteDesktop", "{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\\mstsc.exe"] {
            println!("{} {}  {id}", if files.contains(&hash(id)) { "HAS " } else { "none" }, hash(id));
        }
    }

    /// Reads real lists on this machine (whatever it has): run by hand with `--ignored --nocapture`.
    #[test]
    #[ignore]
    fn print_lists() {
        if let Some(list) = read(&["Microsoft.Windows.Explorer".to_string()], 10) {
            println!("Explorer by its own id: {:?}", list.sections.iter().map(|s| (&s.title, s.items.len())).collect::<Vec<_>>());
        } else {
            println!("Explorer by its own id: (none)");
        }
        for (name, exe) in [
            ("Remote Desktop", r"C:\Windows\System32\mstsc.exe"),
            ("Explorer", r"C:\Windows\explorer.exe"),
            ("VS Code", r"C:\Users\JakePascoe\AppData\Local\Programs\Microsoft VS Code\Code.exe"), ("DriveWorks", r"C:\Program Files\DriveWorks\22.1.0.715\DriveWorksAdministrator.exe"), ("Zen", r"C:\Users\JakePascoe\AppData\Local\Zen Browser\zen.exe"), ("Excel", r"C:\Program Files\Microsoft Office\root\Office16\EXCEL.EXE"),
        ] {
            let ids = app_ids("", exe, &[], &[]);
            println!("{name}: ids {ids:?}");
            match read(&ids, 10) {
                Some(list) => {
                    for s in list.sections {
                        println!("  [{}]", s.title);
                        for i in s.items {
                            println!("    {} -> {} {}", i.title, i.path, i.args);
                        }
                    }
                }
                None => println!("  (none)"),
            }
        }
    }
}
