//! Paired Bluetooth devices and whether each is connected, through
//! `Windows.Devices.Bluetooth`. Read only: Windows has no public call to connect
//! or disconnect a classic device, so the page hands over to the Bluetooth
//! settings page for that.

use serde::Serialize;
use windows::Devices::Bluetooth::{BluetoothConnectionStatus, BluetoothDevice, BluetoothMajorClass};
use windows::Devices::Enumeration::DeviceInformation;

use crate::core::{AeroError, AeroResult};
use crate::platform::ComApartment;

/// What a device is, which decides its icon.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Sort {
    Audio,
    Input,
    Phone,
    Computer,
    Other,
}

fn sort_of(class: BluetoothMajorClass) -> Sort {
    match class {
        BluetoothMajorClass::AudioVideo => Sort::Audio,
        BluetoothMajorClass::Peripheral => Sort::Input,
        BluetoothMajorClass::Phone => Sort::Phone,
        BluetoothMajorClass::Computer => Sort::Computer,
        _ => Sort::Other,
    }
}

/// A paired device.
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Device {
    pub name: String,
    pub sort: Sort,
    pub connected: bool,
}

/// Connected devices first, then by name.
pub fn tidy(mut devices: Vec<Device>) -> Vec<Device> {
    devices.retain(|d| !d.name.trim().is_empty());
    devices.sort_by(|a, b| b.connected.cmp(&a.connected).then(a.name.to_lowercase().cmp(&b.name.to_lowercase())));
    devices.dedup_by(|a, b| a.name == b.name);
    devices
}

/// The devices this machine is paired with.
pub fn paired() -> AeroResult<Vec<Device>> {
    let _com = ComApartment::new();
    let selector = BluetoothDevice::GetDeviceSelectorFromPairingState(true)
        .map_err(|e| AeroError::other(format!("no Bluetooth: {e}")))?;
    let found = DeviceInformation::FindAllAsyncAqsFilter(&selector)
        .and_then(|op| op.join())
        .map_err(|e| AeroError::other(format!("could not list Bluetooth devices: {e}")))?;
    let mut out = Vec::new();
    for info in &found {
        let Ok(id) = info.Id() else { continue };
        // a device that cannot be opened is skipped, not fatal to the list
        let Ok(device) = BluetoothDevice::FromIdAsync(&id).and_then(|op| op.join()) else {
            continue;
        };
        out.push(Device {
            name: device.Name().map(|n| n.to_string()).unwrap_or_default(),
            sort: device
                .ClassOfDevice()
                .and_then(|c| c.MajorClass())
                .map(sort_of)
                .unwrap_or(Sort::Other),
            connected: device.ConnectionStatus().map(|s| s == BluetoothConnectionStatus::Connected).unwrap_or(false),
        });
    }
    Ok(tidy(out))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn dev(name: &str, connected: bool) -> Device {
        Device { name: name.into(), sort: Sort::Other, connected }
    }

    #[test]
    fn connected_devices_come_first_then_by_name_without_repeats() {
        let out = tidy(vec![
            dev("keyboard", false),
            dev("Headphones", true),
            dev("", true),
            dev("Mouse", false),
            dev("Mouse", false),
        ]);
        let names: Vec<_> = out.iter().map(|d| d.name.as_str()).collect();
        assert_eq!(names, vec!["Headphones", "keyboard", "Mouse"]);
    }

    #[test]
    fn device_classes_pick_their_icons() {
        assert_eq!(sort_of(BluetoothMajorClass::AudioVideo), Sort::Audio);
        assert_eq!(sort_of(BluetoothMajorClass::Peripheral), Sort::Input);
        assert_eq!(sort_of(BluetoothMajorClass::Health), Sort::Other);
    }

    #[test]
    fn the_devices_can_be_listed_or_the_machine_has_no_bluetooth() {
        // reading only
        let _ = paired();
    }
}
