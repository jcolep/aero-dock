//! Noticing a click anywhere outside the menu bar, and the Escape key, while a
//! menu is open, without taking the keyboard focus.
//!
//! Two low-level hooks (mouse and keyboard) are installed when a menu opens and
//! removed when it closes, so they are in the way of the system's input for
//! only as long as a menu is on screen. They never swallow anything: a click
//! that closes the menu still reaches whatever it was aimed at.
//!
//! The hook callbacks do almost nothing, because while one runs the system
//! waits on it before handing the input on. They only look at where the click
//! landed and pass a small message to another thread, which tells the page.

use std::sync::atomic::{AtomicIsize, AtomicU32, Ordering};
use std::sync::mpsc::{channel, Sender};

use parking_lot::Mutex;
use windows::Win32::Foundation::{HWND, LPARAM, LRESULT, WPARAM};
use windows::Win32::System::Threading::GetCurrentThreadId;
use windows::Win32::UI::Input::KeyboardAndMouse::VK_ESCAPE;
use windows::Win32::UI::WindowsAndMessaging::{
    CallNextHookEx, GetAncestor, GetMessageW, PostThreadMessageW, SetWindowsHookExW,
    UnhookWindowsHookEx, WindowFromPoint, GA_ROOT, KBDLLHOOKSTRUCT, MSG, MSLLHOOKSTRUCT,
    WH_KEYBOARD_LL, WH_MOUSE_LL, WM_KEYDOWN, WM_LBUTTONDOWN, WM_MBUTTONDOWN, WM_QUIT,
    WM_RBUTTONDOWN, WM_SYSKEYDOWN, WM_XBUTTONDOWN,
};

/// What the hooks noticed.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Event {
    /// A click on something that is not the bar's window.
    Outside,
    /// The Escape key.
    Escape,
}

/// The bar's window, as a raw handle, which a click is compared against.
static BAR: AtomicIsize = AtomicIsize::new(0);
/// The hook thread's id while one is running, or 0.
static THREAD: AtomicU32 = AtomicU32::new(0);
/// Where the hook callbacks send what they see.
static SENDER: Mutex<Option<Sender<Event>>> = Mutex::new(None);

fn send(event: Event) {
    if let Some(tx) = SENDER.lock().as_ref() {
        let _ = tx.send(event);
    }
}

/// Whether a screen point is over the bar's window (or anything inside it).
fn over_bar(x: i32, y: i32) -> bool {
    let bar = HWND(BAR.load(Ordering::Relaxed) as *mut _);
    let hit = unsafe { WindowFromPoint(windows::Win32::Foundation::POINT { x, y }) };
    if hit.0.is_null() {
        return false;
    }
    // the web view is a child window of the bar's, so compare the top level
    hit == bar || unsafe { GetAncestor(hit, GA_ROOT) } == bar
}

unsafe extern "system" fn mouse_proc(code: i32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
    if code >= 0 {
        let message = wparam.0 as u32;
        if matches!(
            message,
            WM_LBUTTONDOWN | WM_RBUTTONDOWN | WM_MBUTTONDOWN | WM_XBUTTONDOWN
        ) {
            let info = unsafe { &*(lparam.0 as *const MSLLHOOKSTRUCT) };
            if !over_bar(info.pt.x, info.pt.y) {
                send(Event::Outside);
            }
        }
    }
    unsafe { CallNextHookEx(None, code, wparam, lparam) }
}

unsafe extern "system" fn key_proc(code: i32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
    if code >= 0 && matches!(wparam.0 as u32, WM_KEYDOWN | WM_SYSKEYDOWN) {
        let info = unsafe { &*(lparam.0 as *const KBDLLHOOKSTRUCT) };
        if info.vkCode == VK_ESCAPE.0 as u32 {
            send(Event::Escape);
        }
    }
    unsafe { CallNextHookEx(None, code, wparam, lparam) }
}

/// Start watching, for the bar window `bar`. `on_event` runs on its own
/// thread, never inside a hook. Calling this while already watching only
/// changes which window counts as the bar.
pub fn start(bar: HWND, on_event: impl Fn(Event) + Send + 'static) {
    BAR.store(bar.0 as isize, Ordering::Relaxed);
    if THREAD.load(Ordering::SeqCst) != 0 {
        return;
    }

    let (tx, rx) = channel();
    *SENDER.lock() = Some(tx);
    std::thread::Builder::new()
        .name("menubar-events".into())
        .spawn(move || {
            // ends when the sender is dropped, in `stop`
            while let Ok(event) = rx.recv() {
                on_event(event);
            }
        })
        .ok();

    // The hooks live on a thread of their own that pumps messages, which is
    // what makes the system call them. A WM_QUIT posted to it ends the pump.
    let started = std::thread::Builder::new()
        .name("menubar-hooks".into())
        .spawn(|| unsafe {
            THREAD.store(GetCurrentThreadId(), Ordering::SeqCst);
            let mouse = SetWindowsHookExW(WH_MOUSE_LL, Some(mouse_proc), None, 0);
            let keys = SetWindowsHookExW(WH_KEYBOARD_LL, Some(key_proc), None, 0);
            if mouse.is_err() || keys.is_err() {
                log::warn!("could not watch for clicks outside the menu bar");
            }
            let mut msg = MSG::default();
            while GetMessageW(&mut msg, None, 0, 0).as_bool() {}
            if let Ok(hook) = mouse {
                let _ = UnhookWindowsHookEx(hook);
            }
            if let Ok(hook) = keys {
                let _ = UnhookWindowsHookEx(hook);
            }
            THREAD.store(0, Ordering::SeqCst);
        });
    if started.is_err() {
        *SENDER.lock() = None;
        return;
    }
    // Wait for the thread to say who it is, so that a `stop` straight after
    // this has someone to post the quit to (otherwise the hooks would be
    // left installed with nothing to ever remove them).
    for _ in 0..100 {
        if THREAD.load(Ordering::SeqCst) != 0 {
            break;
        }
        std::thread::sleep(std::time::Duration::from_millis(1));
    }
}

/// Stop watching. Safe to call when nothing is being watched.
pub fn stop() {
    // dropping the sender ends the thread that forwards events
    *SENDER.lock() = None;
    let thread = THREAD.load(Ordering::SeqCst);
    if thread != 0 {
        unsafe {
            let _ = PostThreadMessageW(thread, WM_QUIT, WPARAM(0), LPARAM(0));
        }
    }
}
