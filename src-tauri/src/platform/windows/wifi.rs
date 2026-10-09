//! Wi-Fi networks in range, and joining one the machine already knows.
//!
//! Through the system's WLAN service (`wlanapi`), which is also what lists
//! networks in the taskbar's own flyout. Joining a network is only done for one
//! that has a saved profile, since that is what holds its password; for any
//! other the page hands over to Windows' own network picker, which asks for
//! it. Nothing is stored or sent anywhere by this.

use serde::Serialize;
use windows::core::{GUID, PCWSTR};
use windows::Win32::Foundation::{HANDLE, WIN32_ERROR};
use windows::Win32::NetworkManagement::WiFi::{
    dot11_BSS_type_infrastructure, wlan_connection_mode_profile, WlanCloseHandle, WlanConnect,
    WlanDisconnect, WlanEnumInterfaces, WlanFreeMemory, WlanGetAvailableNetworkList, WlanOpenHandle,
    WlanScan, WLAN_AVAILABLE_NETWORK_CONNECTED, WLAN_AVAILABLE_NETWORK_HAS_PROFILE,
    WLAN_AVAILABLE_NETWORK_LIST, WLAN_CONNECTION_PARAMETERS, WLAN_INTERFACE_INFO_LIST,
};

use crate::core::{AeroError, AeroResult};

/// One network in range.
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Network {
    pub ssid: String,
    /// 0 to 100.
    pub signal: u8,
    pub secured: bool,
    /// The one this machine is joined to.
    pub connected: bool,
    /// Has a saved profile, so can be joined without asking for a password.
    pub known: bool,
    /// The saved profile's name, used to join it. Not shown.
    #[serde(skip)]
    pub profile: String,
}

/// A WLAN client handle, closed when it goes.
struct Client(HANDLE);

impl Client {
    fn open() -> AeroResult<Client> {
        let mut negotiated = 0u32;
        let mut handle = HANDLE::default();
        let rc = unsafe { WlanOpenHandle(2, None, &mut negotiated, &mut handle) };
        if rc != 0 {
            return Err(AeroError::other(format!("no Wi-Fi service (code {rc})")));
        }
        Ok(Client(handle))
    }

    /// The first wireless interface, if the machine has one.
    fn interface(&self) -> AeroResult<GUID> {
        let mut list: *mut WLAN_INTERFACE_INFO_LIST = std::ptr::null_mut();
        let rc = unsafe { WlanEnumInterfaces(self.0, None, &mut list) };
        if rc != 0 || list.is_null() {
            return Err(AeroError::other("no Wi-Fi adapter"));
        }
        let guid = unsafe {
            let l = &*list;
            let first = (l.dwNumberOfItems > 0).then(|| l.InterfaceInfo[0].InterfaceGuid);
            WlanFreeMemory(list as *const _);
            first
        };
        guid.ok_or_else(|| AeroError::other("no Wi-Fi adapter"))
    }
}

impl Drop for Client {
    fn drop(&mut self) {
        unsafe {
            WlanCloseHandle(self.0, None);
        }
    }
}

/// The text of a fixed-size wide-character field, up to its first nul.
fn wide_text(units: &[u16]) -> String {
    let end = units.iter().position(|u| *u == 0).unwrap_or(units.len());
    String::from_utf16_lossy(&units[..end])
}

/// A network's name, from the bytes the adapter reports it in. Names are
/// nominally UTF-8, though not always valid; what is not is replaced.
fn ssid_text(bytes: &[u8], length: u32) -> String {
    let n = (length as usize).min(bytes.len());
    String::from_utf8_lossy(&bytes[..n]).into_owned()
}

/// Of networks that share a name (one network, several access points), keep the
/// strongest, joined ones first, then by signal.
pub fn tidy(mut networks: Vec<Network>) -> Vec<Network> {
    networks.retain(|n| !n.ssid.trim().is_empty());
    networks.sort_by(|a, b| {
        b.connected
            .cmp(&a.connected)
            .then(b.known.cmp(&a.known))
            .then(b.signal.cmp(&a.signal))
    });
    let mut seen: Vec<String> = Vec::new();
    networks.retain(|n| {
        if seen.contains(&n.ssid) {
            false
        } else {
            seen.push(n.ssid.clone());
            true
        }
    });
    networks
}

/// Ask the adapter to look again; results arrive over the next few seconds.
pub fn rescan() {
    if let Ok(client) = Client::open() {
        if let Ok(guid) = client.interface() {
            unsafe {
                let _ = WlanScan(client.0, &guid, None, None, None);
            }
        }
    }
}

/// The networks in range.
pub fn networks() -> AeroResult<Vec<Network>> {
    let client = Client::open()?;
    let guid = client.interface()?;
    let mut list: *mut WLAN_AVAILABLE_NETWORK_LIST = std::ptr::null_mut();
    let rc = unsafe { WlanGetAvailableNetworkList(client.0, &guid, 0, None, &mut list) };
    if rc != 0 || list.is_null() {
        return Err(AeroError::other(format!("could not list networks (code {rc})")));
    }
    let mut out = Vec::new();
    unsafe {
        let l = &*list;
        let items = std::slice::from_raw_parts(l.Network.as_ptr(), l.dwNumberOfItems as usize);
        for n in items {
            out.push(Network {
                ssid: ssid_text(&n.dot11Ssid.ucSSID, n.dot11Ssid.uSSIDLength),
                signal: n.wlanSignalQuality.min(100) as u8,
                secured: n.bSecurityEnabled.as_bool(),
                connected: n.dwFlags & WLAN_AVAILABLE_NETWORK_CONNECTED != 0,
                known: n.dwFlags & WLAN_AVAILABLE_NETWORK_HAS_PROFILE != 0,
                profile: wide_text(&n.strProfileName),
            });
        }
        WlanFreeMemory(list as *const _);
    }
    Ok(tidy(out))
}

/// Join a network that has a saved profile. Returns once the request is made;
/// joining takes a moment more.
pub fn connect(ssid: &str) -> AeroResult<()> {
    let wanted = networks()?
        .into_iter()
        .find(|n| n.ssid == ssid)
        .ok_or_else(|| AeroError::other("that network is not in range"))?;
    if !wanted.known || wanted.profile.is_empty() {
        return Err(AeroError::other("that network has no saved profile"));
    }
    let client = Client::open()?;
    let guid = client.interface()?;
    let profile: Vec<u16> = wanted.profile.encode_utf16().chain(std::iter::once(0)).collect();
    let parameters = WLAN_CONNECTION_PARAMETERS {
        wlanConnectionMode: wlan_connection_mode_profile,
        strProfile: PCWSTR(profile.as_ptr()),
        pDot11Ssid: std::ptr::null_mut(),
        pDesiredBssidList: std::ptr::null_mut(),
        dot11BssType: dot11_BSS_type_infrastructure,
        dwFlags: 0,
    };
    let rc = unsafe { WlanConnect(client.0, &guid, &parameters, None) };
    if WIN32_ERROR(rc) != WIN32_ERROR(0) {
        return Err(AeroError::other(format!("could not join the network (code {rc})")));
    }
    Ok(())
}

/// Leave the network this machine is joined to.
pub fn disconnect() -> AeroResult<()> {
    let client = Client::open()?;
    let guid = client.interface()?;
    let rc = unsafe { WlanDisconnect(client.0, &guid, None) };
    if rc != 0 {
        return Err(AeroError::other(format!("could not leave the network (code {rc})")));
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn net(ssid: &str, signal: u8, connected: bool, known: bool) -> Network {
        Network { ssid: ssid.into(), signal, secured: true, connected, known, profile: String::new() }
    }

    #[test]
    fn names_are_read_up_to_their_length_and_up_to_a_nul() {
        let mut bytes = [0u8; 32];
        bytes[..4].copy_from_slice(b"Home");
        assert_eq!(ssid_text(&bytes, 4), "Home");
        assert_eq!(ssid_text(&bytes, 99), format!("Home{}", "\0".repeat(28)));
        let wide: Vec<u16> = "Café\0junk".encode_utf16().collect();
        assert_eq!(wide_text(&wide), "Café");
    }

    #[test]
    fn a_network_seen_by_several_access_points_is_listed_once_by_its_strongest() {
        let out = tidy(vec![
            net("Office", 40, false, true),
            net("Cafe", 90, false, false),
            net("Office", 80, false, true),
            net("", 99, false, false),
            net("Home", 60, true, true),
        ]);
        let names: Vec<_> = out.iter().map(|n| (n.ssid.as_str(), n.signal)).collect();
        // the joined one first, then known ones, then the rest; one of each name
        assert_eq!(names, vec![("Home", 60), ("Office", 80), ("Cafe", 90)]);
    }

    #[test]
    fn the_networks_can_be_listed_or_the_machine_has_none() {
        // reading only: with no Wi-Fi adapter this is an error, not a hang
        if let Ok(list) = networks() {
            assert!(list.iter().all(|n| n.signal <= 100));
        }
    }
}
