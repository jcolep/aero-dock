//! The Control Center's real controls: the Wi-Fi and Bluetooth radios, the
//! networks and devices they see, and the screen's brightness.
//!
//! Each runs on a worker thread, because each waits on the system (a radio, the
//! WLAN service, a monitor over its serial link) for as long as it takes. A
//! machine without the hardware answers with an empty list, not an error, so
//! the panel just has less to show.

use tauri::{AppHandle, Manager};

use crate::core::settings::SettingsStore;
use crate::core::{AeroError, AeroResult};
use crate::platform::windows::bluetooth::{self, Device};
use crate::platform::windows::brightness::{self, Brightness};
use crate::platform::windows::monitors::{enumerate_monitors, pick_monitor, Rect};
use crate::platform::windows::radios::{self, Kind, RadioInfo};
use crate::platform::windows::wifi::{self, Network};

async fn blocking<T: Send + 'static>(f: impl FnOnce() -> T + Send + 'static) -> AeroResult<T> {
    tauri::async_runtime::spawn_blocking(f)
        .await
        .map_err(|e| AeroError::other(format!("control task failed: {e}")))
}

/// What Windows says about animation and transparency, for settings that follow it.
#[tauri::command]
pub async fn get_system_accessibility() -> AeroResult<crate::platform::windows::accessibility::SystemFlags> {
    blocking(crate::platform::windows::accessibility::read).await
}

/// The Wi-Fi and Bluetooth radios, with whether each is on.
#[tauri::command]
pub async fn get_radios() -> AeroResult<Vec<RadioInfo>> {
    // no radio API, or no radios: nothing to show
    blocking(|| radios::list().unwrap_or_default()).await
}

/// Switch the Wi-Fi or the Bluetooth radio.
#[tauri::command]
pub async fn set_radio(kind: String, on: bool) -> AeroResult<()> {
    let kind = Kind::parse(&kind).ok_or_else(|| AeroError::other(format!("unknown radio: {kind}")))?;
    blocking(move || radios::set(kind, on)).await?
}

/// The Wi-Fi networks in range; `rescan` asks the adapter to look again first.
#[tauri::command]
pub async fn list_wifi(rescan: bool) -> AeroResult<Vec<Network>> {
    blocking(move || {
        if rescan {
            wifi::rescan();
        }
        wifi::networks().unwrap_or_default()
    })
    .await
}

/// Join a network that has a saved profile.
#[tauri::command]
pub async fn connect_wifi(ssid: String) -> AeroResult<()> {
    blocking(move || wifi::connect(&ssid)).await?
}

/// Leave the network this machine is on.
#[tauri::command]
pub async fn disconnect_wifi() -> AeroResult<()> {
    blocking(wifi::disconnect).await?
}

/// The Bluetooth devices this machine is paired with.
#[tauri::command]
pub async fn list_bluetooth() -> AeroResult<Vec<Device>> {
    blocking(|| bluetooth::paired().unwrap_or_default()).await
}

/// Where the menu bar is: the screen whose brightness the slider is for.
fn bar_bounds(app: &AppHandle) -> AeroResult<Rect> {
    let settings = app.state::<SettingsStore>().get();
    let monitors = enumerate_monitors()?;
    Ok(pick_monitor(&monitors, settings.dock.monitor.as_deref()).bounds)
}

/// The brightness of the screen the menu bar is on.
#[tauri::command]
pub async fn get_brightness(app: AppHandle) -> AeroResult<Brightness> {
    let bounds = bar_bounds(&app)?;
    blocking(move || brightness::read(&bounds)).await
}

/// Set the brightness of the screen the menu bar is on, 0 to 100.
#[tauri::command]
pub async fn set_brightness(app: AppHandle, percent: u8) -> AeroResult<()> {
    let bounds = bar_bounds(&app)?;
    blocking(move || brightness::set(&bounds, percent)).await?
}
#[cfg(test)]
mod tests {
    use super::*;

    /// Prints what this machine reports, for a person to read. Reads only: it
    /// never switches a radio or sets a brightness. Run on its own with
    /// `cargo test what_this_machine_has -- --ignored --nocapture`.
    #[test]
    #[ignore]
    fn what_this_machine_has() {
        eprintln!("radios: {:?}", radios::list());
        eprintln!("wifi: {:?}", wifi::networks().map(|n| n.into_iter().map(|n| (n.ssid, n.signal, n.connected, n.known)).collect::<Vec<_>>()));
        eprintln!("bluetooth: {:?}", bluetooth::paired());
        let monitors = enumerate_monitors().expect("monitors");
        for m in &monitors {
            eprintln!("brightness on {}: {:?}", m.name, brightness::read(&m.bounds));
        }
    }
}