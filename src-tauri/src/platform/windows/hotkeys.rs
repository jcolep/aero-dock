//! The global shortcuts: Ctrl+Alt+M and Ctrl+Alt+D bring the keyboard to the menu
//! bar and the dock, and Ctrl+Alt+W opens the overview of every window.
//!
//! The bars never take the keyboard on their own (clicking one must not steal
//! it from the app being used), so without a way in they cannot be reached from
//! the keyboard at all, or by a screen reader. A shortcut is that way in. It is
//! the system's own hotkey registration, not a keyboard hook: the system tells
//! this thread when the chord is pressed, and nothing else about the keyboard is
//! watched.
//!
//! A chord another program already holds cannot be registered; that one is
//! skipped, and the other still works.

use std::sync::atomic::{AtomicU32, Ordering};

use windows::Win32::Foundation::{LPARAM, WPARAM};
use windows::Win32::System::Threading::GetCurrentThreadId;
use windows::Win32::UI::Input::KeyboardAndMouse::{
    RegisterHotKey, UnregisterHotKey, HOT_KEY_MODIFIERS, MOD_ALT, MOD_CONTROL, MOD_NOREPEAT,
};
use windows::Win32::UI::WindowsAndMessaging::{GetMessageW, PostThreadMessageW, MSG, WM_APP, WM_HOTKEY};

/// Which bar a shortcut is for.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Target {
    MenuBar,
    Dock,
    /// The overview of every window.
    Mission,
}

/// The shortcuts: an id, the key (a virtual-key code) and what it is for.
const CHORDS: [(i32, u32, Target); 3] =
    [(1, 0x4D, Target::MenuBar), (2, 0x44, Target::Dock), (3, 0x57, Target::Mission)];

/// Message to the thread: register (wparam 1) or unregister (0) the chords.
const SWITCH: u32 = WM_APP + 1;

static THREAD: AtomicU32 = AtomicU32::new(0);

fn register() {
    let modifiers: HOT_KEY_MODIFIERS = MOD_CONTROL | MOD_ALT | MOD_NOREPEAT;
    for (id, key, _) in CHORDS {
        if unsafe { RegisterHotKey(None, id, modifiers, key) }.is_err() {
            log::warn!("could not register shortcut {id}: another program has it");
        }
    }
}

fn unregister() {
    for (id, _, _) in CHORDS {
        unsafe {
            let _ = UnregisterHotKey(None, id);
        }
    }
}

/// Start the thread that listens, with the chords registered or not to begin
/// with. `on_press` runs on that thread, so it must only hand off.
pub fn start(enabled: bool, on_press: impl Fn(Target) + Send + 'static) {
    if THREAD.load(Ordering::SeqCst) != 0 {
        return;
    }
    let spawned = std::thread::Builder::new().name("hotkeys".into()).spawn(move || unsafe {
        THREAD.store(GetCurrentThreadId(), Ordering::SeqCst);
        if enabled {
            register();
        }
        let mut msg = MSG::default();
        while GetMessageW(&mut msg, None, 0, 0).as_bool() {
            match msg.message {
                WM_HOTKEY => {
                    let id = msg.wParam.0 as i32;
                    if let Some((_, _, target)) = CHORDS.iter().find(|(c, _, _)| *c == id) {
                        on_press(*target);
                    }
                }
                SWITCH => {
                    unregister();
                    if msg.wParam.0 == 1 {
                        register();
                    }
                }
                _ => {}
            }
        }
    });
    if let Err(e) = spawned {
        log::warn!("could not start the shortcut listener: {e}");
    }
}

/// Switch the shortcuts on or off, from any thread.
pub fn set_enabled(enabled: bool) {
    let thread = THREAD.load(Ordering::SeqCst);
    if thread != 0 {
        unsafe {
            let _ = PostThreadMessageW(thread, SWITCH, WPARAM(enabled as usize), LPARAM(0));
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_shortcuts_are_distinct_chords_on_letters() {
        let mut ids: Vec<i32> = CHORDS.iter().map(|c| c.0).collect();
        ids.sort();
        ids.dedup();
        assert_eq!(ids.len(), CHORDS.len());
        let mut keys: Vec<u32> = CHORDS.iter().map(|c| c.1).collect();
        keys.sort();
        keys.dedup();
        assert_eq!(keys.len(), CHORDS.len());
        // M, D and W
        assert!(CHORDS.iter().all(|c| (0x41..=0x5A).contains(&c.1)));
    }
}
