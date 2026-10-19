//! Arranging the apps' windows, from the dock's own menu (right-click on the dock's empty space): cascade, stacked,
//! side by side, and showing the desktop, as the Windows taskbar's menu has had them.
//!
//! Only the apps' windows are touched: the ones the dock lists (`running::snapshot`), never Liquidock's own (the dock,
//! the menu bar, the frame, the glass), which a plain `CascadeWindows` over the whole desktop would gather up with
//! the rest, and which Windows' own Show desktop (Win+D) can hide. And only those on the monitor the menu was opened
//! on, laid out in that monitor's work area, so a dock on each screen arranges its own screen.

use parking_lot::Mutex;
use windows::Win32::Foundation::{HWND, POINT, RECT};
use windows::Win32::Graphics::Gdi::{GetMonitorInfoW, MonitorFromPoint, MonitorFromWindow, HMONITOR, MONITORINFO, MONITOR_DEFAULTTONEAREST};
use windows::Win32::UI::WindowsAndMessaging::{
    CascadeWindows, GetCursorPos, IsIconic, IsWindow, IsWindowVisible, IsZoomed, ShowWindow, TileWindows, MDITILE_HORIZONTAL,
    MDITILE_SKIPDISABLED, MDITILE_VERTICAL, SW_MINIMIZE, SW_RESTORE,
};

use super::running;

/// How to lay the windows out.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Layout {
    /// Overlapping, each a step down and across from the last.
    Cascade,
    /// One above another, each the full width.
    Stacked,
    /// Side by side, each the full height.
    SideBySide,
}

/// The windows Show desktop put away, to bring back the next time it is chosen.
static PUT_AWAY: Mutex<Vec<isize>> = Mutex::new(Vec::new());

/// The monitor under the pointer (where the menu was opened) and its work area.
fn monitor_here() -> Option<(HMONITOR, RECT)> {
    unsafe {
        let mut at = POINT::default();
        GetCursorPos(&mut at).ok()?;
        let monitor = MonitorFromPoint(at, MONITOR_DEFAULTTONEAREST);
        let mut info = MONITORINFO { cbSize: std::mem::size_of::<MONITORINFO>() as u32, ..Default::default() };
        GetMonitorInfoW(monitor, &mut info).as_bool().then_some((monitor, info.rcWork))
    }
}

/// The apps' windows on a monitor that can be seen (not minimised), as the dock lists them.
fn shown_on(monitor: HMONITOR) -> Vec<HWND> {
    running::snapshot()
        .windows
        .iter()
        .map(|w| HWND(w.hwnd as *mut _))
        .filter(|&h| unsafe { IsWindow(Some(h)).as_bool() && IsWindowVisible(h).as_bool() && !IsIconic(h).as_bool() })
        .filter(|&h| unsafe { MonitorFromWindow(h, MONITOR_DEFAULTTONEAREST) } == monitor)
        .collect()
}

/// Lay out the apps' windows on the monitor under the pointer. Maximised ones are restored first (a maximised
/// window will not be moved). Returns how many were arranged.
pub fn arrange(layout: Layout) -> usize {
    let Some((monitor, work)) = monitor_here() else { return 0 };
    let windows = shown_on(monitor);
    if windows.is_empty() {
        return 0;
    }
    unsafe {
        for &h in &windows {
            if IsZoomed(h).as_bool() {
                let _ = ShowWindow(h, SW_RESTORE);
            }
        }
        let area = Some(&work as *const RECT);
        let moved = match layout {
            Layout::Cascade => CascadeWindows(None, MDITILE_SKIPDISABLED, area, Some(&windows)),
            Layout::Stacked => TileWindows(None, MDITILE_HORIZONTAL, area, Some(&windows)),
            Layout::SideBySide => TileWindows(None, MDITILE_VERTICAL, area, Some(&windows)),
        };
        moved as usize
    }
}

/// Show the desktop, or, chosen again with nothing of the apps on show, bring back what it put away. Only the apps'
/// windows on the monitor under the pointer are put away; the dock and the rest of Liquidock stay.
pub fn toggle_desktop() {
    let Some((monitor, _)) = monitor_here() else { return };
    let shown = shown_on(monitor);
    let mut put_away = PUT_AWAY.lock();
    if shown.is_empty() {
        // the desktop is showing: bring back what was put away (those that still exist and are still put away)
        for raw in put_away.drain(..) {
            let h = HWND(raw as *mut _);
            if unsafe { IsWindow(Some(h)).as_bool() && IsIconic(h).as_bool() } {
                let _ = unsafe { ShowWindow(h, SW_RESTORE) };
            }
        }
        return;
    }
    put_away.clear();
    for h in shown {
        put_away.push(h.0 as isize);
        let _ = unsafe { ShowWindow(h, SW_MINIMIZE) };
    }
}
