//! Which apps are using the microphone or the camera right now, so the menu bar
//! can show a dot, as macOS does.
//!
//! Windows keeps the record itself, for its own privacy indicators: under
//! `CapabilityAccessManager\ConsentStore\<sensor>` there is a key for every app
//! that has ever asked, with the time it last started (`LastUsedTimeStart`) and
//! stopped (`LastUsedTimeStop`) using it. An app that has started and not
//! stopped (a stop time of zero) is using the sensor now. Packaged apps are keys
//! of their own; ordinary programs are under `NonPackaged`, named by their path
//! with `\` written as `#`.
//!
//! Only ever read. A thread looks every couple of seconds, which is a handful of
//! registry reads, and tells the page only when the answer changes.

use serde::Serialize;
use windows::core::{w, PCWSTR, PWSTR};
use windows::Win32::Foundation::ERROR_SUCCESS;
use windows::Win32::System::Registry::{
    RegCloseKey, RegEnumKeyExW, RegOpenKeyExW, RegQueryValueExW, HKEY, HKEY_CURRENT_USER, KEY_READ,
};

/// Which sensor.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Sensor {
    Microphone,
    Camera,
}

/// One app using one sensor.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Use {
    pub sensor: Sensor,
    pub app: String,
}

const STORE: &str = "Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore";

/// An open registry key, closed when it goes.
struct Key(HKEY);

impl Key {
    fn open(path: &str) -> Option<Key> {
        let wide: Vec<u16> = path.encode_utf16().chain(std::iter::once(0)).collect();
        let mut key = HKEY::default();
        let rc = unsafe { RegOpenKeyExW(HKEY_CURRENT_USER, PCWSTR(wide.as_ptr()), None, KEY_READ, &mut key) };
        (rc == ERROR_SUCCESS).then_some(Key(key))
    }

    fn subkeys(&self) -> Vec<String> {
        let mut out = Vec::new();
        for index in 0.. {
            let mut buffer = [0u16; 512];
            let mut length = buffer.len() as u32;
            let rc = unsafe {
                RegEnumKeyExW(self.0, index, Some(PWSTR(buffer.as_mut_ptr())), &mut length, None, None, None, None)
            };
            if rc != ERROR_SUCCESS {
                break;
            }
            out.push(String::from_utf16_lossy(&buffer[..length as usize]));
        }
        out
    }

    /// A 64-bit value, if there is one of that name.
    fn qword(&self, name: PCWSTR) -> Option<u64> {
        let mut value = 0u64;
        let mut size = std::mem::size_of::<u64>() as u32;
        let rc = unsafe {
            RegQueryValueExW(self.0, name, None, None, Some(&mut value as *mut u64 as *mut u8), Some(&mut size))
        };
        (rc == ERROR_SUCCESS && size == 8).then_some(value)
    }
}

impl Drop for Key {
    fn drop(&mut self) {
        unsafe {
            let _ = RegCloseKey(self.0);
        }
    }
}

/// Whether the times say it is being used now: started, and not stopped.
pub fn in_use(start: Option<u64>, stop: Option<u64>) -> bool {
    start.unwrap_or(0) > 0 && stop.unwrap_or(0) == 0
}

/// A name a person would know, from a key's name.
///
/// An ordinary program's key is its path with `\` as `#` (`C:#Program
/// Files#Zoom#bin#Zoom.exe`), and it is called by its file, without `.exe`. A
/// packaged app's key is its package family (`Microsoft.WindowsCamera_8wekyb3d8bbwe`),
/// and it is called by the part before the `_`, without the publisher's prefix.
pub fn friendly_name(key: &str, packaged: bool) -> String {
    if packaged {
        let package = key.split('_').next().unwrap_or(key);
        return package.rsplit('.').next().unwrap_or(package).to_string();
    }
    let file = key.rsplit('#').next().unwrap_or(key);
    let stem = file.strip_suffix(".exe").or_else(|| file.strip_suffix(".EXE")).unwrap_or(file);
    stem.to_string()
}

/// The apps using a sensor.
fn using(sensor: Sensor, store_name: &str) -> Vec<Use> {
    let base = format!("{STORE}\\{store_name}");
    let Some(root) = Key::open(&base) else { return Vec::new() };
    let mut found = Vec::new();
    let mut check = |path: String, name: String| {
        if let Some(key) = Key::open(&path) {
            let start = key.qword(w!("LastUsedTimeStart"));
            let stop = key.qword(w!("LastUsedTimeStop"));
            if in_use(start, stop) {
                found.push(Use { sensor, app: name });
            }
        }
    };
    for name in root.subkeys() {
        if name == "NonPackaged" {
            let nonpackaged = format!("{base}\\NonPackaged");
            if let Some(group) = Key::open(&nonpackaged) {
                for program in group.subkeys() {
                    check(format!("{nonpackaged}\\{program}"), friendly_name(&program, false));
                }
            }
        } else {
            check(format!("{base}\\{name}"), friendly_name(&name, true));
        }
    }
    found
}

/// Everything using the microphone or the camera now, each app once per sensor.
pub fn read() -> Vec<Use> {
    let mut all = using(Sensor::Microphone, "microphone");
    all.extend(using(Sensor::Camera, "webcam"));
    all.sort_by(|a, b| (a.sensor as u8, &a.app).cmp(&(b.sensor as u8, &b.app)));
    all.dedup();
    all
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn started_and_not_stopped_is_in_use() {
        assert!(in_use(Some(133_000_000_000_000_000), Some(0)));
        assert!(in_use(Some(5), None));
        // stopped after starting
        assert!(!in_use(Some(5), Some(9)));
        // never used
        assert!(!in_use(Some(0), Some(0)));
        assert!(!in_use(None, None));
    }

    #[test]
    fn keys_are_called_by_names_a_person_knows() {
        assert_eq!(friendly_name("C:#Program Files#Zoom#bin#Zoom.exe", false), "Zoom");
        assert_eq!(friendly_name("C:#Users#me#AppData#Local#Teams#current#Teams.exe", false), "Teams");
        assert_eq!(friendly_name("Microsoft.WindowsCamera_8wekyb3d8bbwe", true), "WindowsCamera");
        assert_eq!(friendly_name("MSTeams_8wekyb3d8bbwe", true), "MSTeams");
        assert_eq!(friendly_name("plain", true), "plain");
    }

    #[test]
    fn the_registry_can_be_read_here() {
        // reading only; whatever is in use on this machine, it is listed without error
        let all = read();
        assert!(all.windows(2).all(|p| (p[0].sensor as u8, &p[0].app) <= (p[1].sensor as u8, &p[1].app)));
    }
}
