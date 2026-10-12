//! The global shortcuts: Ctrl+Alt+M and Ctrl+Alt+D bring the keyboard to the menu
//! bar and the dock, Ctrl+Alt+W opens the overview of every window, and
//! Ctrl+Alt+Space (and Ctrl+Esc, which Windows uses for its own Start menu) opens
//! the Start menu.
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
    /// The Start menu.
    Start,
}

/// The shortcuts: an id, the modifiers, the key (a virtual-key code) and what it is for.
const CTRL_ALT: HOT_KEY_MODIFIERS = HOT_KEY_MODIFIERS(MOD_CONTROL.0 | MOD_ALT.0);
const CHORDS: [(i32, HOT_KEY_MODIFIERS, u32, Target); 5] = [
    (1, CTRL_ALT, 0x4D, Target::MenuBar),
    (2, CTRL_ALT, 0x44, Target::Dock),
    (3, CTRL_ALT, 0x57, Target::Mission),
    // Space, and Escape with Ctrl alone (Windows' own way to its Start menu)
    (4, CTRL_ALT, 0x20, Target::Start),
    (5, MOD_CONTROL, 0x1B, Target::Start),
];

/// Message to the thread: register (wparam 1) or unregister (0) the chords.
const SWITCH: u32 = WM_APP + 1;

static THREAD: AtomicU32 = AtomicU32::new(0);

fn register() {
    for (id, modifiers, key, _) in CHORDS {
        let modifiers = HOT_KEY_MODIFIERS(modifiers.0 | MOD_NOREPEAT.0);
        if unsafe { RegisterHotKey(None, id, modifiers, key) }.is_err() {
            log::warn!("could not register shortcut {id}: another program has it");
        }
    }
}

fn unregister() {
    for (id, _, _, _) in CHORDS {
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
                    if let Some((_, _, _, target)) = CHORDS.iter().find(|(c, _, _, _)| *c == id) {
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
    fn the_shortcuts_are_distinct_chords() {
        let mut ids: Vec<i32> = CHORDS.iter().map(|c| c.0).collect();
        ids.sort();
        ids.dedup();
        assert_eq!(ids.len(), CHORDS.len());
        // the same key with the same modifiers would be one chord claimed twice
        let mut chords: Vec<(u32, u32)> = CHORDS.iter().map(|c| (c.1 .0, c.2)).collect();
        chords.sort();
        chords.dedup();
        assert_eq!(chords.len(), CHORDS.len());
        // every chord has a modifier, so none can be typed by accident
        assert!(CHORDS.iter().all(|c| c.1 .0 != 0));
        // M, D and W are letters; Start is on Space and on Escape
        for (_, _, key, target) in CHORDS {
            match target {
                Target::Start => assert!(key == 0x20 || key == 0x1B),
                _ => assert!((0x41..=0x5A).contains(&key)),
            }
        }
    }
}
