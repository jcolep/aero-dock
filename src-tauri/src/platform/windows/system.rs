//! System status for the dock widgets: battery, network connectivity,
//! master volume (WASAPI), and Recycle Bin. Read in one call; a small
//! poller thread pushes changes to the frontend every 20s (plus an
//! immediate push after volume changes made through us).

use serde::Serialize;
use windows::core::PCWSTR;
use windows::Win32::NetworkManagement::IpHelper::{
    GetAdaptersAddresses, GAA_FLAG_INCLUDE_GATEWAYS, GAA_FLAG_SKIP_ANYCAST, GAA_FLAG_SKIP_DNS_SERVER,
    GAA_FLAG_SKIP_MULTICAST, IF_TYPE_ETHERNET_CSMACD, IF_TYPE_IEEE80211, IP_ADAPTER_ADDRESSES_LH,
};
use windows::Win32::NetworkManagement::Ndis::IfOperStatusUp;
use windows::Win32::Networking::WinSock::AF_UNSPEC;
use windows::Win32::Media::Audio::Endpoints::IAudioEndpointVolume;
use windows::Win32::Media::Audio::{eConsole, eRender, IMMDeviceEnumerator, MMDeviceEnumerator};
use windows::Win32::Networking::NetworkListManager::{
    INetworkListManager, NetworkListManager, NLM_CONNECTIVITY_IPV4_INTERNET,
    NLM_CONNECTIVITY_IPV6_INTERNET,
};
use windows::Win32::System::Com::{CoCreateInstance, CLSCTX_ALL, CLSCTX_INPROC_SERVER};
use windows::Win32::System::Power::GetSystemPowerStatus;
use windows::Win32::UI::Shell::{SHEmptyRecycleBinW, SHQueryRecycleBinW, SHQUERYRBINFO};

use crate::core::AeroResult;
use crate::platform::ComApartment;

#[derive(Debug, Clone, PartialEq, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct BatteryStatus {
    pub present: bool,
    pub percent: u8,
    pub charging: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct VolumeStatus {
    pub available: bool,
    /// 0..=100
    pub level: u8,
    pub muted: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct RecycleBinStatus {
    pub items: u64,
    pub bytes: u64,
}

/// What a network connection runs over.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Default)]
#[serde(rename_all = "lowercase")]
pub enum LinkKind {
    #[default]
    Unknown,
    Wifi,
    Ethernet,
}

#[derive(Debug, Clone, PartialEq, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SystemStatus {
    pub battery: BatteryStatus,
    pub internet: bool,
    /// What the connection in use runs over, so the icon can say.
    pub link: LinkKind,
    pub volume: VolumeStatus,
    pub recycle_bin: RecycleBinStatus,
}

pub fn read_status() -> SystemStatus {
    let _com = ComApartment::new();
    SystemStatus {
        battery: read_battery(),
        internet: read_internet().unwrap_or(false),
        link: read_link(),
        volume: read_volume().unwrap_or_default(),
        recycle_bin: read_recycle_bin().unwrap_or_default(),
    }
}

fn read_battery() -> BatteryStatus {
    let mut status = Default::default();
    if unsafe { GetSystemPowerStatus(&mut status) }.is_err() {
        return BatteryStatus::default();
    }
    // 128 = no system battery, 255 = unknown
    let present = status.BatteryFlag != 128 && status.BatteryLifePercent != 255;
    BatteryStatus {
        present,
        percent: if present { status.BatteryLifePercent } else { 0 },
        charging: status.ACLineStatus == 1,
    }
}

fn read_internet() -> AeroResult<bool> {
    let manager: INetworkListManager =
        unsafe { CoCreateInstance(&NetworkListManager, None, CLSCTX_ALL)? };
    let connectivity = unsafe { manager.GetConnectivity()? };
    let internet =
        (connectivity.0 & (NLM_CONNECTIVITY_IPV4_INTERNET.0 | NLM_CONNECTIVITY_IPV6_INTERNET.0))
            != 0;
    Ok(internet)
}

/// An adapter that is up and has a way out: a candidate for the connection in
/// use.
#[derive(Debug, Clone, Copy, PartialEq)]
struct Link {
    kind: LinkKind,
    /// The interface metric: the lower, the more the system prefers it.
    metric: u32,
}

/// The connection Windows would use: of the candidates, the one it prefers.
fn preferred(links: &[Link]) -> LinkKind {
    links
        .iter()
        .min_by_key(|l| l.metric)
        .map_or(LinkKind::Unknown, |l| l.kind)
}

/// Virtual switches, VPNs and the like carry a wired adapter type but are not
/// the cable in the wall.
fn looks_virtual(description: &str) -> bool {
    let d = description.to_ascii_lowercase();
    ["virtual", "vmware", "hyper-v", "vpn", "tap-", "wintun", "loopback", "bluetooth", "wsl", "docker"]
        .iter()
        .any(|marker| d.contains(marker))
}

/// Whether the connection in use is wired or wireless: among the adapters that
/// are up and have a gateway, the one the system prefers.
fn read_link() -> LinkKind {
    let flags = GAA_FLAG_INCLUDE_GATEWAYS
        | GAA_FLAG_SKIP_ANYCAST
        | GAA_FLAG_SKIP_MULTICAST
        | GAA_FLAG_SKIP_DNS_SERVER;
    // 8-byte units, so the structures sit where they need to
    let mut size: u32 = 16 * 1024;
    let mut buffer: Vec<u64> = Vec::new();
    let mut result = u32::MAX;
    for _ in 0..4 {
        buffer = vec![0u64; (size as usize).div_ceil(8)];
        result = unsafe {
            GetAdaptersAddresses(
                AF_UNSPEC.0 as u32,
                flags,
                None,
                Some(buffer.as_mut_ptr() as *mut IP_ADAPTER_ADDRESSES_LH),
                &mut size,
            )
        };
        // 111: the buffer was too small, and `size` says how big it must be
        if result != 111 {
            break;
        }
    }
    if result != 0 {
        return LinkKind::Unknown;
    }
    let mut links = Vec::new();
    let mut next = buffer.as_ptr() as *const IP_ADAPTER_ADDRESSES_LH;
    while !next.is_null() {
        let adapter = unsafe { &*next };
        next = adapter.Next;
        let kind = match adapter.IfType {
            IF_TYPE_IEEE80211 => LinkKind::Wifi,
            IF_TYPE_ETHERNET_CSMACD => LinkKind::Ethernet,
            _ => continue,
        };
        if adapter.OperStatus != IfOperStatusUp || adapter.FirstGatewayAddress.is_null() {
            continue;
        }
        let description = unsafe { adapter.Description.to_string() }.unwrap_or_default();
        if kind == LinkKind::Ethernet && looks_virtual(&description) {
            continue;
        }
        links.push(Link { kind, metric: adapter.Ipv4Metric });
    }
    preferred(&links)
}

fn endpoint_volume() -> AeroResult<IAudioEndpointVolume> {
    let enumerator: IMMDeviceEnumerator =
        unsafe { CoCreateInstance(&MMDeviceEnumerator, None, CLSCTX_INPROC_SERVER)? };
    let device = unsafe { enumerator.GetDefaultAudioEndpoint(eRender, eConsole)? };
    let volume: IAudioEndpointVolume = unsafe { device.Activate(CLSCTX_INPROC_SERVER, None)? };
    Ok(volume)
}

fn read_volume() -> AeroResult<VolumeStatus> {
    let volume = endpoint_volume()?;
    let level = unsafe { volume.GetMasterVolumeLevelScalar()? };
    let muted = unsafe { volume.GetMute()? }.as_bool();
    Ok(VolumeStatus {
        available: true,
        level: (level * 100.0).round() as u8,
        muted,
    })
}

/// Set master volume 0..=100; `mute` of None leaves mute state alone.
pub fn set_volume(level: Option<u8>, mute: Option<bool>) -> AeroResult<()> {
    let _com = ComApartment::new();
    let volume = endpoint_volume()?;
    if let Some(level) = level {
        let scalar = (level.min(100) as f32) / 100.0;
        unsafe { volume.SetMasterVolumeLevelScalar(scalar, std::ptr::null())? };
    }
    if let Some(mute) = mute {
        unsafe { volume.SetMute(mute, std::ptr::null())? };
    }
    Ok(())
}

fn read_recycle_bin() -> AeroResult<RecycleBinStatus> {
    let mut info = SHQUERYRBINFO {
        cbSize: std::mem::size_of::<SHQUERYRBINFO>() as u32,
        ..Default::default()
    };
    unsafe { SHQueryRecycleBinW(PCWSTR::null(), &mut info)? };
    Ok(RecycleBinStatus {
        items: info.i64NumItems as u64,
        bytes: info.i64Size as u64,
    })
}

/// Empty the bin with the standard system confirmation dialog.
/// True when the Recycle Bin holds nothing. If it cannot be read, say no, so
/// that the normal emptying path (and its own error handling) still runs.
pub fn recycle_bin_is_empty() -> bool {
    let _com = ComApartment::new();
    read_recycle_bin().map(|bin| bin.items == 0).unwrap_or(false)
}

/// Show a plain message box and wait for it to be dismissed. Kept above
/// other windows, because the dock itself is topmost and would otherwise
/// cover it.
pub fn message_box(title: &str, text: &str) {
    use windows::Win32::UI::WindowsAndMessaging::{
        MessageBoxW, MB_ICONINFORMATION, MB_OK, MB_SETFOREGROUND, MB_TOPMOST,
    };
    let title = super::util::to_wide(title);
    let text = super::util::to_wide(text);
    unsafe {
        MessageBoxW(
            None,
            PCWSTR(text.as_ptr()),
            PCWSTR(title.as_ptr()),
            MB_OK | MB_ICONINFORMATION | MB_TOPMOST | MB_SETFOREGROUND,
        );
    }
}

/// Ask a yes/no question in a plain message box and wait for the answer.
/// True only for Yes. Kept above other windows for the same reason as
/// [`message_box`].
pub fn confirm(title: &str, text: &str) -> bool {
    use windows::Win32::UI::WindowsAndMessaging::{
        MessageBoxW, IDYES, MB_ICONQUESTION, MB_SETFOREGROUND, MB_TOPMOST, MB_YESNO,
    };
    let title = super::util::to_wide(title);
    let text = super::util::to_wide(text);
    let answer = unsafe {
        MessageBoxW(
            None,
            PCWSTR(text.as_ptr()),
            PCWSTR(title.as_ptr()),
            MB_YESNO | MB_ICONQUESTION | MB_TOPMOST | MB_SETFOREGROUND,
        )
    };
    answer == IDYES
}

pub fn empty_recycle_bin() -> AeroResult<()> {
    let _com = ComApartment::new();
    unsafe { SHEmptyRecycleBinW(None, PCWSTR::null(), 0)? };
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn status_reads_without_error() {
        let s = read_status();
        // machine-agnostic invariants only
        assert!(s.volume.level <= 100);
        assert!(!s.battery.present || s.battery.percent <= 100);
    }

    #[test]
    fn the_link_in_use_is_the_one_the_system_prefers() {
        let wifi = |metric| Link { kind: LinkKind::Wifi, metric };
        let wired = |metric| Link { kind: LinkKind::Ethernet, metric };
        // the cable is preferred over the radio, as Windows does
        assert_eq!(preferred(&[wifi(40), wired(25)]), LinkKind::Ethernet);
        assert_eq!(preferred(&[wired(25), wifi(40)]), LinkKind::Ethernet);
        // and a radio with a lower figure wins
        assert_eq!(preferred(&[wifi(10), wired(25)]), LinkKind::Wifi);
        assert_eq!(preferred(&[wifi(40)]), LinkKind::Wifi);
        assert_eq!(preferred(&[]), LinkKind::Unknown);
    }

    #[test]
    fn virtual_adapters_are_not_the_cable() {
        assert!(looks_virtual("Hyper-V Virtual Ethernet Adapter"));
        assert!(looks_virtual("VMware Virtual Ethernet Adapter for VMnet8"));
        assert!(looks_virtual("TAP-Windows Adapter V9"));
        assert!(!looks_virtual("Intel(R) Ethernet Connection (7) I219-V"));
        assert!(!looks_virtual("Realtek PCIe GbE Family Controller"));
    }

    #[test]
    fn the_link_can_be_read_here() {
        // whatever this machine has, reading it does not fail or hang
        let _ = read_link();
    }
}
