//! What Windows itself says about motion and transparency: its "Animation
//! effects" and "Transparency effects" switches (Settings > Accessibility >
//! Visual effects). Liquidock follows them unless told otherwise, so a person
//! who has turned either off for a reason does not find this app ignoring it.

use serde::Serialize;
use windows::core::{w, BOOL};
use windows::Win32::System::Registry::{RegGetValueW, HKEY_CURRENT_USER, RRF_RT_REG_DWORD};
use windows::Win32::UI::WindowsAndMessaging::{
    SystemParametersInfoW, SPI_GETCLIENTAREAANIMATION, SYSTEM_PARAMETERS_INFO_UPDATE_FLAGS,
};

/// The two switches, as "wants less".
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SystemFlags {
    pub reduce_motion: bool,
    pub reduce_transparency: bool,
}

/// Whether Windows has animation effects turned off.
fn animations_off() -> bool {
    let mut on = BOOL(1);
    let read = unsafe {
        SystemParametersInfoW(
            SPI_GETCLIENTAREAANIMATION,
            0,
            Some(&mut on as *mut BOOL as *mut _),
            SYSTEM_PARAMETERS_INFO_UPDATE_FLAGS(0),
        )
    };
    read.is_ok() && !on.as_bool()
}

/// Whether Windows has transparency effects turned off.
fn transparency_off() -> bool {
    let mut value = 1u32;
    let mut size = std::mem::size_of::<u32>() as u32;
    let rc = unsafe {
        RegGetValueW(
            HKEY_CURRENT_USER,
            w!("Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize"),
            w!("EnableTransparency"),
            RRF_RT_REG_DWORD,
            None,
            Some(&mut value as *mut u32 as *mut _),
            Some(&mut size),
        )
    };
    // no value means the default, which is on
    rc.0 == 0 && value == 0
}

pub fn read() -> SystemFlags {
    SystemFlags { reduce_motion: animations_off(), reduce_transparency: transparency_off() }
}

/// What a setting comes to: `on` and `off` are decisions, anything else
/// follows the system.
pub fn effective(policy: &str, system: bool) -> bool {
    match policy {
        "on" => true,
        "off" => false,
        _ => system,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_decision_overrides_the_system_and_anything_else_follows_it() {
        assert!(effective("on", false));
        assert!(!effective("off", true));
        assert!(effective("system", true));
        assert!(!effective("system", false));
        assert!(effective("whatever", true));
    }

    #[test]
    fn the_system_switches_can_be_read() {
        // reading only
        let _ = read();
    }
}
