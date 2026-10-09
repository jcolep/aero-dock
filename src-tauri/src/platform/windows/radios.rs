//! The machine's radios: Wi-Fi and Bluetooth, read and switched through the
//! system's radio API (`Windows.Devices.Radios`), the same one the Settings app
//! uses. Switching asks the system for access first, as the API requires.
//!
//! Nothing here runs on its own: a radio is only touched when the Control
//! Center is opened (to read) or a toggle in it is clicked (to switch).

use serde::Serialize;
use windows::Devices::Radios::{Radio, RadioAccessStatus, RadioKind, RadioState};

use crate::core::{AeroError, AeroResult};
use crate::platform::ComApartment;

/// What a radio is, as the page names it.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Kind {
    Wifi,
    Bluetooth,
}

impl Kind {
    pub fn parse(name: &str) -> Option<Kind> {
        match name {
            "wifi" => Some(Kind::Wifi),
            "bluetooth" => Some(Kind::Bluetooth),
            _ => None,
        }
    }

    fn matches(self, kind: RadioKind) -> bool {
        match self {
            Kind::Wifi => kind == RadioKind::WiFi,
            Kind::Bluetooth => kind == RadioKind::Bluetooth,
        }
    }
}

/// One radio, as the Control Center shows it.
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RadioInfo {
    pub kind: Kind,
    pub name: String,
    /// Switched on.
    pub on: bool,
    /// Can be switched from here: not off at a hardware switch or by policy.
    pub switchable: bool,
}

/// The Wi-Fi and Bluetooth radios there are (the first of each).
pub fn list() -> AeroResult<Vec<RadioInfo>> {
    let _com = ComApartment::new();
    let radios = Radio::GetRadiosAsync()
        .and_then(|op| op.join())
        .map_err(|e| AeroError::other(format!("could not read the radios: {e}")))?;
    let mut out: Vec<RadioInfo> = Vec::new();
    for radio in &radios {
        let kind = match radio.Kind() {
            Ok(RadioKind::WiFi) => Kind::Wifi,
            Ok(RadioKind::Bluetooth) => Kind::Bluetooth,
            _ => continue,
        };
        if out.iter().any(|r| r.kind == kind) {
            continue;
        }
        let state = radio.State().unwrap_or(RadioState::Unknown);
        out.push(RadioInfo {
            kind,
            name: radio.Name().map(|n| n.to_string()).unwrap_or_default(),
            on: state == RadioState::On,
            // "disabled" is off at a switch or by the system, which this cannot undo
            switchable: state == RadioState::On || state == RadioState::Off,
        });
    }
    Ok(out)
}

/// Switch a radio on or off.
pub fn set(kind: Kind, on: bool) -> AeroResult<()> {
    let _com = ComApartment::new();
    let access = Radio::RequestAccessAsync()
        .and_then(|op| op.join())
        .map_err(|e| AeroError::other(format!("could not ask for radio access: {e}")))?;
    if access != RadioAccessStatus::Allowed {
        return Err(AeroError::other("Windows did not allow Aero Dock to switch radios"));
    }
    let radios = Radio::GetRadiosAsync()
        .and_then(|op| op.join())
        .map_err(|e| AeroError::other(format!("could not read the radios: {e}")))?;
    let wanted = if on { RadioState::On } else { RadioState::Off };
    let mut found = false;
    for radio in &radios {
        let Ok(k) = radio.Kind() else { continue };
        if !kind.matches(k) {
            continue;
        }
        found = true;
        let status = radio
            .SetStateAsync(wanted)
            .and_then(|op| op.join())
            .map_err(|e| AeroError::other(format!("could not switch the radio: {e}")))?;
        if status != RadioAccessStatus::Allowed {
            return Err(AeroError::other("the radio refused to change"));
        }
    }
    if found {
        Ok(())
    } else {
        Err(AeroError::other("this machine has no such radio"))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn radio_kinds_are_named_as_the_page_names_them() {
        assert_eq!(Kind::parse("wifi"), Some(Kind::Wifi));
        assert_eq!(Kind::parse("bluetooth"), Some(Kind::Bluetooth));
        assert_eq!(Kind::parse("zigbee"), None);
        assert!(Kind::Wifi.matches(RadioKind::WiFi));
        assert!(!Kind::Wifi.matches(RadioKind::Bluetooth));
    }

    #[test]
    fn the_radios_can_be_read_here() {
        // reading only: whatever this machine has, it is listed without error or
        // a hang (switching is never done in a test)
        let radios = list().expect("radios can be listed");
        assert!(radios.len() <= 2);
    }
}
