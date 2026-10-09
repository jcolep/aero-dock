//! Windows taskbar control: get the shell taskbar out of the way so Aero
//! Dock can be the visible bar, and put it back on request.
//!
//! `ABM_SETSTATE` alone is not enough. It sets the auto-hide *state*, which
//! frees up the work area, but on Windows 11 the shell frequently leaves the
//! bar on screen anyway — it looks like it shifted rather than hid. So the
//! bar is also hidden outright with `ShowWindow`, which is what actually
//! makes it disappear. Both are reversible, and `restore` runs on quit and
//! again at startup so a crash can never leave you without a taskbar.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Once;

use parking_lot::Mutex;
use windows::core::w;

use crate::core::settings::DockEdge;
use windows::Win32::Foundation::{COLORREF, HWND, LPARAM};
use windows::Win32::UI::Accessibility::{SetWinEventHook, HWINEVENTHOOK};
use windows::Win32::UI::Shell::{
    SHAppBarMessage, ABM_SETSTATE, ABS_ALWAYSONTOP, ABS_AUTOHIDE, APPBARDATA,
};
use windows::Win32::UI::WindowsAndMessaging::{
    DispatchMessageW, EnumWindows, FindWindowW, GetClassNameW, GetMessageW, GetWindowLongPtrW,
    IsWindowVisible, SetLayeredWindowAttributes, SetWindowLongPtrW, ShowWindow, TranslateMessage,
    EVENT_OBJECT_LOCATIONCHANGE, EVENT_OBJECT_SHOW, GWL_EXSTYLE, LWA_ALPHA, MSG, OBJID_WINDOW,
    SW_HIDE, SW_SHOWNA, WINEVENT_OUTOFCONTEXT, WINEVENT_SKIPOWNPROCESS, WS_EX_LAYERED,
};

/// Set the appbar auto-hide state. This is what frees the work area, so
/// maximised windows use the full screen.
fn set_appbar_state(hide: bool) {
    let state = if hide { ABS_AUTOHIDE } else { ABS_ALWAYSONTOP };
    let mut abd = APPBARDATA {
        cbSize: std::mem::size_of::<APPBARDATA>() as u32,
        lParam: LPARAM(state as isize),
        ..Default::default()
    };
    unsafe {
        SHAppBarMessage(ABM_SETSTATE, &mut abd);
    }
}

/// Collector for the secondary taskbars that appear on additional monitors.
unsafe extern "system" fn collect_secondary(hwnd: HWND, lparam: LPARAM) -> windows::core::BOOL {
    unsafe {
        let mut class = [0u16; 64];
        let len = GetClassNameW(hwnd, &mut class);
        if len > 0 {
            let name = String::from_utf16_lossy(&class[..len as usize]);
            if name == "Shell_SecondaryTrayWnd" {
                let list = &mut *(lparam.0 as *mut Vec<HWND>);
                list.push(hwnd);
            }
        }
    }
    true.into()
}

/// Every taskbar window: the primary one plus one per extra monitor.
fn taskbar_windows() -> Vec<HWND> {
    let mut found = Vec::new();
    unsafe {
        if let Ok(primary) = FindWindowW(w!("Shell_TrayWnd"), None) {
            if !primary.0.is_null() {
                found.push(primary);
            }
        }
        let mut secondary: Vec<HWND> = Vec::new();
        let _ = EnumWindows(
            Some(collect_secondary),
            LPARAM(&mut secondary as *mut Vec<HWND> as isize),
        );
        found.extend(secondary);
    }
    found
}

fn show_taskbars(visible: bool) {
    let cmd = if visible { SW_SHOWNA } else { SW_HIDE };
    for hwnd in taskbar_windows() {
        unsafe {
            let _ = ShowWindow(hwnd, cmd);
        }
    }
}

/// How deep a taskbar rectangle `r` is along `edge` of `monitor`, or 0 if it is
/// not a taskbar lying along that edge: it has to be against that side of the
/// monitor and span most of it.
pub fn extent_along(monitor: &super::monitors::Rect, r: &super::monitors::Rect, edge: DockEdge) -> i32 {
    // a window that is mostly on another monitor is that monitor's
    let cx = r.x + r.width / 2;
    let cy = r.y + r.height / 2;
    let inside = cx >= monitor.x
        && cx < monitor.x + monitor.width
        && cy >= monitor.y
        && cy < monitor.y + monitor.height;
    if !inside || r.width <= 0 || r.height <= 0 {
        return 0;
    }
    let slack = 3;
    match edge {
        DockEdge::Bottom => {
            if r.y + r.height >= monitor.y + monitor.height - slack
                && r.width * 2 >= monitor.width
                && r.height * 2 < monitor.height
            {
                r.height
            } else {
                0
            }
        }
        DockEdge::Top => {
            if r.y <= monitor.y + slack && r.width * 2 >= monitor.width && r.height * 2 < monitor.height {
                r.height
            } else {
                0
            }
        }
        DockEdge::Left => {
            if r.x <= monitor.x + slack && r.height * 2 >= monitor.height && r.width * 2 < monitor.width {
                r.width
            } else {
                0
            }
        }
        DockEdge::Right => {
            if r.x + r.width >= monitor.x + monitor.width - slack
                && r.height * 2 >= monitor.height
                && r.width * 2 < monitor.width
            {
                r.width
            } else {
                0
            }
        }
    }
}

/// How much of `edge` of `monitor` a Windows taskbar that is on screen right
/// now takes, in physical pixels. 0 when there is none, or it is hidden.
pub fn visible_thickness(monitor: &super::monitors::Rect, edge: DockEdge) -> i32 {
    use windows::Win32::Foundation::RECT;
    use windows::Win32::UI::WindowsAndMessaging::GetWindowRect;

    let mut deepest = 0;
    for hwnd in taskbar_windows() {
        unsafe {
            if !IsWindowVisible(hwnd).as_bool() {
                continue;
            }
            let mut r = RECT::default();
            if GetWindowRect(hwnd, &mut r).is_err() {
                continue;
            }
            deepest = deepest.max(extent_along(monitor, &r.into(), edge));
        }
    }
    deepest
}

/// While true, any taskbar window that appears is hidden again at once.
static KEEP_HIDDEN: AtomicBool = AtomicBool::new(false);
static WATCHER: Once = Once::new();

fn is_taskbar(hwnd: HWND) -> bool {
    let mut class = [0u16; 64];
    let len = unsafe { GetClassNameW(hwnd, &mut class) };
    if len <= 0 {
        return false;
    }
    let name = String::from_utf16_lossy(&class[..len as usize]);
    name == "Shell_TrayWnd" || name == "Shell_SecondaryTrayWnd"
}

/// Runs whenever a window anywhere is shown or moved. If it is a taskbar
/// and we are meant to be hiding them, hide it again.
unsafe extern "system" fn on_window_event(
    _hook: HWINEVENTHOOK,
    _event: u32,
    hwnd: HWND,
    id_object: i32,
    id_child: i32,
    _thread: u32,
    _time: u32,
) {
    // only the window itself, not its carets, cursors or children
    if !KEEP_HIDDEN.load(Ordering::Relaxed) || id_object != OBJID_WINDOW.0 || id_child != 0 {
        return;
    }
    unsafe {
        if !hwnd.0.is_null() && IsWindowVisible(hwnd).as_bool() && is_taskbar(hwnd) {
            // transparent first, so the frame already in flight shows nothing
            // (and a taskbar the shell has just recreated is covered too)
            make_transparent(hwnd, &mut MADE_LAYERED.lock());
            let _ = ShowWindow(hwnd, SW_HIDE);
        }
    }
}

/// Start the watcher thread, once. Hiding the taskbar a single time is not
/// enough: the shell shows it again by itself, for instance when the
/// pointer touches the screen edge on an auto-hidden bar, or when Explorer
/// restarts. A WinEvent hook hears that happen and answers immediately,
/// with no polling.
fn start_watcher() {
    WATCHER.call_once(|| {
        let spawned = std::thread::Builder::new()
            .name("taskbar-watcher".into())
            .spawn(|| unsafe {
                // out-of-context hooks are delivered through this thread's
                // message queue, so it has to pump one
                for event in [EVENT_OBJECT_SHOW, EVENT_OBJECT_LOCATIONCHANGE] {
                    SetWinEventHook(
                        event,
                        event,
                        None,
                        Some(on_window_event),
                        0,
                        0,
                        WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS,
                    );
                }
                let mut msg = MSG::default();
                while GetMessageW(&mut msg, None, 0, 0).as_bool() {
                    let _ = TranslateMessage(&msg);
                    DispatchMessageW(&msg);
                }
            });
        if let Err(e) = spawned {
            log::warn!("could not start the taskbar watcher: {e}");
        }
    });
}

/// `hide = true` takes the taskbar off screen and keeps it there; `false`
/// puts it back.
pub fn set_taskbar_autohide(hide: bool) {
    KEEP_HIDDEN.store(hide, Ordering::Relaxed);
    if hide {
        start_watcher();
        // Hidden is not enough on its own: pressing the Windows key makes the
        // shell slide the bar in, and for the second that takes, the hook
        // below is hiding it again after every frame it draws. Transparent
        // as well, nothing of it can show in between.
        fade_out();
    } else {
        fade_in();
    }
    set_appbar_state(hide);
    show_taskbars(!hide);
}

/// Taskbar windows we made layered ourselves (and so must un-layer again).
static MADE_LAYERED: Mutex<Vec<isize>> = Mutex::new(Vec::new());

/// Layer one window if it is not already, and make it fully transparent.
fn make_transparent(hwnd: HWND, made: &mut Vec<isize>) {
    unsafe {
        let ex = GetWindowLongPtrW(hwnd, GWL_EXSTYLE) as u32;
        if ex & WS_EX_LAYERED.0 == 0 {
            SetWindowLongPtrW(hwnd, GWL_EXSTYLE, (ex | WS_EX_LAYERED.0) as isize);
            made.push(hwnd.0 as isize);
        }
        let _ = SetLayeredWindowAttributes(hwnd, COLORREF(0), 0, LWA_ALPHA);
    }
}

/// Make the taskbar fully transparent, either while it is briefly revealed
/// (so it can take the keyboard focus a shell shortcut needs without anyone
/// seeing it slide in) or for as long as it is being kept hidden. Pair with
/// [`fade_in`], which is also called by [`restore_taskbar`], so a transparent
/// taskbar can never outlive the dock.
pub fn fade_out() {
    let mut made = MADE_LAYERED.lock();
    for hwnd in taskbar_windows() {
        make_transparent(hwnd, &mut made);
    }
}

/// Undo [`fade_out`]: fully opaque again, and not layered if it was not
/// before. Safe to call whenever; it only touches windows that are layered.
/// While the taskbar is meant to stay hidden it stays transparent.
pub fn fade_in() {
    if KEEP_HIDDEN.load(Ordering::Relaxed) {
        return;
    }
    let mut made = MADE_LAYERED.lock();
    for hwnd in taskbar_windows() {
        unsafe {
            let ex = GetWindowLongPtrW(hwnd, GWL_EXSTYLE) as u32;
            if ex & WS_EX_LAYERED.0 == 0 {
                continue;
            }
            let _ = SetLayeredWindowAttributes(hwnd, COLORREF(0), 255, LWA_ALPHA);
            if let Some(at) = made.iter().position(|h| *h == hwnd.0 as isize) {
                made.remove(at);
                SetWindowLongPtrW(hwnd, GWL_EXSTYLE, (ex & !WS_EX_LAYERED.0) as isize);
            }
        }
    }
}

/// Stop keeping the taskbar hidden and show it, for something that has to
/// reach one of its controls. Returns whether it was being kept hidden, to
/// hand back to [`resume_hiding`].
pub fn suspend_hiding() -> bool {
    let was = KEEP_HIDDEN.swap(false, Ordering::Relaxed);
    if was {
        show_taskbars(true);
    }
    was
}

/// Hide the taskbar again after [`suspend_hiding`], if it was hidden before.
pub fn resume_hiding(was_hiding: bool) {
    if was_hiding {
        KEEP_HIDDEN.store(true, Ordering::Relaxed);
        show_taskbars(false);
    }
}

/// Force the taskbar visible regardless of current state. Called on quit
/// and at startup, so an unclean exit cannot strand the user without one.
pub fn restore_taskbar() {
    KEEP_HIDDEN.store(false, Ordering::Relaxed);
    // a taskbar left transparent by a crash mid-flyout would look missing
    fade_in();
    set_appbar_state(false);
    show_taskbars(true);
}

#[cfg(test)]
mod tests {
    use super::super::monitors::Rect;
    use super::*;

    const MONITOR: Rect = Rect { x: 0, y: 0, width: 1920, height: 1080 };

    #[test]
    fn a_taskbar_along_the_bottom_is_its_height_deep() {
        let bar = Rect { x: 0, y: 1032, width: 1920, height: 48 };
        assert_eq!(extent_along(&MONITOR, &bar, DockEdge::Bottom), 48);
        // and is nothing on the other edges
        assert_eq!(extent_along(&MONITOR, &bar, DockEdge::Top), 0);
        assert_eq!(extent_along(&MONITOR, &bar, DockEdge::Left), 0);
        assert_eq!(extent_along(&MONITOR, &bar, DockEdge::Right), 0);
    }

    #[test]
    fn a_taskbar_down_the_side_is_its_width_deep() {
        let left = Rect { x: 0, y: 0, width: 62, height: 1080 };
        let right = Rect { x: 1858, y: 0, width: 62, height: 1080 };
        assert_eq!(extent_along(&MONITOR, &left, DockEdge::Left), 62);
        assert_eq!(extent_along(&MONITOR, &right, DockEdge::Right), 62);
        assert_eq!(extent_along(&MONITOR, &left, DockEdge::Bottom), 0);
    }

    #[test]
    fn a_window_that_is_not_a_taskbar_on_this_monitor_counts_for_nothing() {
        // a small window near the bottom does not span the monitor
        let small = Rect { x: 100, y: 1000, width: 300, height: 80 };
        assert_eq!(extent_along(&MONITOR, &small, DockEdge::Bottom), 0);
        // the taskbar of the monitor to the right is not this monitor's
        let other = Rect { x: 1920, y: 1032, width: 1920, height: 48 };
        assert_eq!(extent_along(&MONITOR, &other, DockEdge::Bottom), 0);
        // nor is one with no size
        assert_eq!(extent_along(&MONITOR, &Rect { x: 0, y: 1080, width: 0, height: 0 }, DockEdge::Bottom), 0);
    }
}