//! Noticing an app gone full screen (a video, a game, a slideshow) on the menu bar's monitor, so the bar can step out
//! of its way, as Windows' taskbar does.
//!
//! The bar is always on top, so without this it lies over a full-screen video. The shell has its own "a full-screen
//! app is running" (`SHQueryUserNotificationState`, `ABN_FULLSCREENAPP`), but it is one answer for every monitor and
//! a screen-sized overlay also makes it say so (see the frame's corners in CLAUDE.md, which stopped using it for that).
//! So this looks for itself, on the one monitor it is told about: the window on top at the bar's place, if it covers
//! the whole monitor, is a full-screen app. A maximised window stops at the bar, so it is never one.
//!
//! Like the frame's corner watcher (`shaper.rs`) it is woken by window events (moved or resized, to the front,
//! minimised, gone) and also looks every second in case one was missed, and it only says when the answer changes.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::{channel, Sender};
use std::sync::OnceLock;
use std::time::Duration;

use parking_lot::Mutex;
use windows::core::BOOL;
use windows::Win32::Foundation::{HWND, LPARAM, RECT};
use windows::Win32::Graphics::Dwm::{DwmGetWindowAttribute, DWMWA_CLOAKED};
use windows::Win32::UI::Accessibility::{SetWinEventHook, HWINEVENTHOOK};
use windows::Win32::UI::WindowsAndMessaging::{
    DispatchMessageW, EnumWindows, GetClassNameW, GetMessageW, GetWindowLongPtrW, GetWindowRect, GetWindowThreadProcessId,
    IsIconic, IsWindowVisible, TranslateMessage, EVENT_OBJECT_DESTROY, EVENT_OBJECT_HIDE, EVENT_OBJECT_LOCATIONCHANGE,
    EVENT_SYSTEM_FOREGROUND, EVENT_SYSTEM_MINIMIZEEND, EVENT_SYSTEM_MINIMIZESTART, GWL_EXSTYLE, MSG,
    OBJID_WINDOW, WINEVENT_OUTOFCONTEXT, WINEVENT_SKIPOWNPROCESS, WS_EX_TOOLWINDOW, WS_EX_TRANSPARENT,
};

use super::monitors::Rect;
use super::shaper::{contains, fullscreen, visible_bounds};

/// The monitor being watched, if any.
static SCREEN: Mutex<Option<Rect>> = Mutex::new(None);
/// The last answer given.
static FULL: AtomicBool = AtomicBool::new(false);
static WAKE: OnceLock<Sender<()>> = OnceLock::new();
static ON_CHANGE: OnceLock<Box<dyn Fn(bool) + Send + Sync>> = OnceLock::new();

/// Windows that are never an app gone full screen, though they can be the size of the monitor: the desktop, the
/// taskbar, and the shell's own hosts (the touch keyboard's and the Start menu's, which sit there hidden).
const NOT_APPS: [&str; 5] = ["Progman", "WorkerW", "Shell_TrayWnd", "Shell_SecondaryTrayWnd", "Windows.UI.Core.CoreWindow"];

/// Whether an app is full screen on the watched monitor now.
pub fn is_full() -> bool {
    FULL.load(Ordering::SeqCst)
}

/// The window on top at a point, among ordinary visible windows of other programs: its visible bounds.
fn top_at(point: (i32, i32)) -> Option<Rect> {
    struct Walk {
        point: (i32, i32),
        found: Option<Rect>,
    }
    unsafe extern "system" fn each(hwnd: HWND, lparam: LPARAM) -> BOOL {
        let walk = unsafe { &mut *(lparam.0 as *mut Walk) };
        unsafe {
            if !IsWindowVisible(hwnd).as_bool() || IsIconic(hwnd).as_bool() {
                return true.into();
            }
            let mut outer = RECT::default();
            if GetWindowRect(hwnd, &mut outer).is_err() || !contains(&outer.into(), walk.point) {
                return true.into();
            }
            // a palette or tray flyout, or an overlay the pointer goes through (a recorder's, a GPU's): not the app
            let ex = GetWindowLongPtrW(hwnd, GWL_EXSTYLE) as u32;
            if ex & (WS_EX_TOOLWINDOW.0 | WS_EX_TRANSPARENT.0) != 0 {
                return true.into();
            }
            let mut pid = 0u32;
            GetWindowThreadProcessId(hwnd, Some(&mut pid));
            if pid == std::process::id() {
                return true.into();
            }
            let mut cloaked = 0u32;
            let _ = DwmGetWindowAttribute(hwnd, DWMWA_CLOAKED, &mut cloaked as *mut u32 as *mut _, 4);
            if cloaked != 0 {
                return true.into();
            }
            let mut class = [0u16; 64];
            let n = GetClassNameW(hwnd, &mut class) as usize;
            let class = String::from_utf16_lossy(&class[..n]);
            if NOT_APPS.contains(&class.as_str()) {
                // the desktop is the bottom of the stack: nothing further down is on top
                return (class != "Progman" && class != "WorkerW").into();
            }
            if let Some(visible) = visible_bounds(hwnd) {
                if contains(&visible, walk.point) {
                    walk.found = Some(visible);
                    return false.into();
                }
            }
        }
        true.into()
    }
    let mut walk = Walk { point, found: None };
    unsafe {
        let _ = EnumWindows(Some(each), LPARAM(&mut walk as *mut Walk as isize));
    }
    walk.found
}

/// One look: is the window on top at the top middle of the monitor one that covers all of it?
fn look() {
    let Some(screen) = *SCREEN.lock() else {
        if FULL.swap(false, Ordering::SeqCst) {
            if let Some(f) = ON_CHANGE.get() {
                f(false);
            }
        }
        return;
    };
    let point = (screen.x + screen.width / 2, screen.y + 2);
    let full = top_at(point).is_some_and(|top| fullscreen(&top, &screen));
    if FULL.swap(full, Ordering::SeqCst) != full {
        crate::trace!("fullscreen: {full} on {screen:?}");
        if let Some(f) = ON_CHANGE.get() {
            f(full);
        }
    }
}

fn wake() {
    if let Some(tx) = WAKE.get() {
        let _ = tx.send(());
    }
}

unsafe extern "system" fn on_event(_hook: HWINEVENTHOOK, _event: u32, hwnd: HWND, id_object: i32, id_child: i32, _thread: u32, _time: u32) {
    if id_object == OBJID_WINDOW.0 && id_child == 0 && !hwnd.0.is_null() {
        wake();
    }
}

/// Watch `screen` (the menu bar's monitor), or nothing. `on_change` (set the first time) is told whenever an app
/// goes full screen there or stops being; it runs on the watcher's thread, so it must only hand off.
pub fn watch(screen: Option<Rect>, on_change: impl Fn(bool) + Send + Sync + 'static) {
    *SCREEN.lock() = screen;
    let _ = ON_CHANGE.set(Box::new(on_change));
    if WAKE.get().is_some() {
        wake();
        return;
    }
    let (tx, rx) = channel::<()>();
    if WAKE.set(tx).is_err() {
        return;
    }
    let worker = std::thread::Builder::new().name("fullscreen".into()).spawn(move || loop {
        let _ = rx.recv_timeout(Duration::from_secs(1));
        // one change is a burst of events: look once at the end of it
        std::thread::sleep(Duration::from_millis(30));
        while rx.try_recv().is_ok() {}
        look();
    });
    if let Err(e) = worker {
        log::warn!("could not start the full-screen watcher: {e}");
        return;
    }
    // out-of-context hooks are delivered through the queue of the thread that set them
    let hook = std::thread::Builder::new().name("fullscreen-events".into()).spawn(|| unsafe {
        for (from, to) in [
            (EVENT_SYSTEM_FOREGROUND, EVENT_SYSTEM_FOREGROUND),
            (EVENT_SYSTEM_MINIMIZESTART, EVENT_SYSTEM_MINIMIZEEND),
            (EVENT_OBJECT_DESTROY, EVENT_OBJECT_HIDE),
            (EVENT_OBJECT_LOCATIONCHANGE, EVENT_OBJECT_LOCATIONCHANGE),
        ] {
            SetWinEventHook(from, to, None, Some(on_event), 0, 0, WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS);
        }
        let mut msg = MSG::default();
        while GetMessageW(&mut msg, None, 0, 0).as_bool() {
            let _ = TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
    });
    if let Err(e) = hook {
        log::warn!("could not listen for windows going full screen: {e}");
    }
}
