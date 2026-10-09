//! Screen brightness, for the monitor the menu bar is on, over DDC/CI: the
//! channel an external monitor listens on for its brightness, which the
//! system's own slider uses for them too. Laptop panels are not on that
//! channel, and so are not reached by this; a monitor that does not answer is
//! simply reported as having no brightness control.
//!
//! The calls are slow (the monitor answers over a serial link), so the page
//! reads once when the Control Center opens and sets when the slider settles.

use serde::Serialize;
use windows::Win32::Devices::Display::{
    DestroyPhysicalMonitors, GetMonitorBrightness, GetNumberOfPhysicalMonitorsFromHMONITOR,
    GetPhysicalMonitorsFromHMONITOR, SetMonitorBrightness, PHYSICAL_MONITOR,
};
use windows::Win32::Foundation::POINT;
use windows::Win32::Graphics::Gdi::{MonitorFromPoint, HMONITOR, MONITOR_DEFAULTTONEAREST};

use super::monitors::Rect;
use crate::core::{AeroError, AeroResult};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Brightness {
    /// The monitor answered, so it can be set from here.
    pub available: bool,
    /// 0 to 100.
    pub percent: u8,
}

/// The physical monitors behind a display, released when it goes.
struct Physical(Vec<PHYSICAL_MONITOR>);

impl Physical {
    fn of(monitor: HMONITOR) -> Option<Physical> {
        let mut count = 0u32;
        unsafe { GetNumberOfPhysicalMonitorsFromHMONITOR(monitor, &mut count) }.ok()?;
        if count == 0 {
            return None;
        }
        let mut list = vec![PHYSICAL_MONITOR::default(); count as usize];
        unsafe { GetPhysicalMonitorsFromHMONITOR(monitor, &mut list) }.ok()?;
        Some(Physical(list))
    }
}

impl Drop for Physical {
    fn drop(&mut self) {
        unsafe {
            let _ = DestroyPhysicalMonitors(&self.0);
        }
    }
}

/// The display that holds a rectangle's middle.
fn monitor_at(bounds: &Rect) -> HMONITOR {
    let centre = POINT { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
    unsafe { MonitorFromPoint(centre, MONITOR_DEFAULTTONEAREST) }
}

/// Where a reading sits between a monitor's own minimum and maximum, as a
/// percentage.
pub fn percent_of(min: u32, current: u32, max: u32) -> u8 {
    if max <= min {
        return 0;
    }
    ((current.saturating_sub(min)) as f64 * 100.0 / (max - min) as f64).round().clamp(0.0, 100.0) as u8
}

/// The value on a monitor's own scale for a percentage.
pub fn value_for(min: u32, max: u32, percent: u8) -> u32 {
    if max <= min {
        return min;
    }
    min + ((max - min) as f64 * percent.min(100) as f64 / 100.0).round() as u32
}

/// The brightness of the monitor over `bounds`.
pub fn read(bounds: &Rect) -> Brightness {
    let Some(physical) = Physical::of(monitor_at(bounds)) else {
        return Brightness::default();
    };
    for monitor in &physical.0 {
        let (mut min, mut cur, mut max) = (0u32, 0u32, 0u32);
        if unsafe { GetMonitorBrightness(monitor.hPhysicalMonitor, &mut min, &mut cur, &mut max) } != 0 {
            return Brightness { available: true, percent: percent_of(min, cur, max) };
        }
    }
    Brightness::default()
}

/// Set the brightness of the monitor over `bounds`.
pub fn set(bounds: &Rect, percent: u8) -> AeroResult<()> {
    let physical = Physical::of(monitor_at(bounds))
        .ok_or_else(|| AeroError::other("this display has no brightness control"))?;
    let mut done = false;
    for monitor in &physical.0 {
        let (mut min, mut cur, mut max) = (0u32, 0u32, 0u32);
        if unsafe { GetMonitorBrightness(monitor.hPhysicalMonitor, &mut min, &mut cur, &mut max) } == 0 {
            continue;
        }
        if unsafe { SetMonitorBrightness(monitor.hPhysicalMonitor, value_for(min, max, percent)) } != 0 {
            done = true;
        }
    }
    if done {
        Ok(())
    } else {
        Err(AeroError::other("this display did not accept a brightness change"))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_monitors_own_scale_maps_to_a_percentage_and_back() {
        // a monitor that reports 0 to 100
        assert_eq!(percent_of(0, 40, 100), 40);
        assert_eq!(value_for(0, 100, 40), 40);
        // one that reports 10 to 90
        assert_eq!(percent_of(10, 50, 90), 50);
        assert_eq!(value_for(10, 90, 50), 50);
        assert_eq!(value_for(10, 90, 0), 10);
        assert_eq!(value_for(10, 90, 100), 90);
        // nonsense scales do not divide by zero or run past the ends
        assert_eq!(percent_of(5, 5, 5), 0);
        assert_eq!(percent_of(50, 20, 100), 0);
        assert_eq!(value_for(7, 7, 60), 7);
        assert_eq!(value_for(0, 100, 250), 100);
    }

    #[test]
    fn reading_a_display_is_safe_even_where_nothing_answers() {
        // only reads, and a display that does not speak DDC reports unavailable
        let b = read(&Rect { x: 0, y: 0, width: 800, height: 600 });
        assert!(b.percent <= 100);
    }
}
