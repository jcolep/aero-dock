//! The Windows key opening Liquidock's Start menu instead of Windows' (`settings.start.windows_key`), and Ctrl+Win
//! opening Windows' own.
//!
//! Windows opens its Start menu when the Windows key is let go with nothing else pressed while it was down. The key
//! cannot be registered as a hotkey (Windows holds it, and a hotkey needs a key besides the modifier), and the ways the
//! Start menu replacements take it over properly (Open-Shell hooks Explorer's own hotkey registration from inside
//! Explorer) mean putting code into Explorer, which is not something to do on a work machine. So this is what
//! AutoHotkey and PowerToys' Keyboard Manager do: a low-level keyboard hook that watches the key go down and up, and
//! when it was a lone press, holds back its release and sends in its place a key that does nothing (0xFF, "no
//! mapping", what PowerToys uses) followed by the release. To Windows that reads as Win+<a key>, which is not a Start
//! menu press, and every Win+<letter> shortcut is left alone because the key's press always goes through untouched.
//!
//! Ctrl+Win, let go with nothing else pressed, is not a Start menu press for Windows either, so for that one this
//! sends Windows a plain Windows key press of its own once Ctrl is up, and Windows opens its menu.
//!
//! The hook is only installed while the setting is on. Its callback only decides (`Tracker`, which is plain code and
//! tested below) and sends; opening the menu is handed to another thread, as Windows drops a hook that is slow to
//! answer (`LowLevelHooksTimeout`, at most a second, removed without telling anyone).
//!
//! An app running as administrator: Windows does not show a hook in an ordinary process the keys typed into it, so
//! there the Windows key opens Windows' menu as always. If the hold-back-and-resend ever fails to send (Windows
//! refuses input sent to a more privileged window), the real release is let through, so the key is never left down.

use std::sync::atomic::{AtomicU32, Ordering};
use std::sync::mpsc::{channel, Sender};

use parking_lot::Mutex;
use windows::Win32::Foundation::{LPARAM, LRESULT, WPARAM};
use windows::Win32::System::Threading::GetCurrentThreadId;
use windows::Win32::UI::Input::KeyboardAndMouse::{
    SendInput, INPUT, INPUT_0, INPUT_KEYBOARD, KEYBDINPUT, KEYBD_EVENT_FLAGS, KEYEVENTF_EXTENDEDKEY, KEYEVENTF_KEYUP,
    VIRTUAL_KEY, VK_LWIN,
};
use windows::Win32::UI::WindowsAndMessaging::{
    CallNextHookEx, GetMessageW, PostThreadMessageW, SetWindowsHookExW, UnhookWindowsHookEx, HHOOK, KBDLLHOOKSTRUCT,
    MSG, WH_KEYBOARD_LL, WM_APP, WM_KEYDOWN, WM_KEYUP, WM_SYSKEYDOWN, WM_SYSKEYUP,
};

const LWIN: u32 = 0x5B;
const RWIN: u32 = 0x5C;
const CTRL: [u32; 3] = [0x11, 0xA2, 0xA3];
const SHIFT_ALT: [u32; 6] = [0x10, 0xA0, 0xA1, 0x12, 0xA4, 0xA5];
/// The key sent to make a lone Windows key press not one: "no mapping", which does nothing.
const MASK: u16 = 0xFF;
/// Marks what this sends, so the hook lets it straight through. ("LQDK")
const TAG: usize = 0x4C51_444B;

/// What to do with a key event.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Verdict {
    /// Let it through.
    Pass,
    /// A lone Windows key release: hold it back, send the mask and the release instead, and open Liquidock's Start.
    Ours,
    /// Let it through, then open Windows' Start menu (a lone Ctrl+Win, with Ctrl now up).
    Original,
}

/// Follows the keyboard from the hook's events, to tell a lone Windows key press from a shortcut.
#[derive(Debug, Default)]
pub struct Tracker {
    /// The Windows key that is down, if one is.
    win: Option<u32>,
    /// Another key went down while it was.
    other: bool,
    /// Ctrl was held at some point while it was (before it went down, or during).
    ctrl_with: bool,
    /// Shift or Alt was held when it went down.
    shift_alt_with: bool,
    ctrl: bool,
    shift_alt: bool,
    /// A lone Ctrl+Win was let go of while Ctrl was still down: Windows' menu opens when Ctrl comes up.
    original_after_ctrl: bool,
}

impl Tracker {
    pub fn key(&mut self, vk: u32, down: bool) -> Verdict {
        let is_ctrl = CTRL.contains(&vk);
        let is_shift_alt = SHIFT_ALT.contains(&vk);
        if down {
            if vk == LWIN || vk == RWIN {
                // a held key repeats its press: only the first one starts a press
                if self.win.is_none() {
                    self.win = Some(vk);
                    self.other = false;
                    self.ctrl_with = self.ctrl;
                    self.shift_alt_with = self.shift_alt;
                    self.original_after_ctrl = false;
                }
                return Verdict::Pass;
            }
            if is_ctrl {
                self.ctrl = true;
                if self.win.is_some() {
                    self.ctrl_with = true;
                }
                return Verdict::Pass;
            }
            if is_shift_alt {
                self.shift_alt = true;
            }
            if self.win.is_some() {
                self.other = true;
            }
            // something else typed while waiting for Ctrl: that was Ctrl+<key>, not for the menu
            self.original_after_ctrl = false;
            return Verdict::Pass;
        }
        if is_ctrl {
            self.ctrl = false;
            if std::mem::take(&mut self.original_after_ctrl) {
                return Verdict::Original;
            }
            return Verdict::Pass;
        }
        if is_shift_alt {
            self.shift_alt = false;
            return Verdict::Pass;
        }
        if Some(vk) != self.win {
            return Verdict::Pass;
        }
        self.win = None;
        if self.other || self.shift_alt_with || self.shift_alt {
            return Verdict::Pass;
        }
        if self.ctrl_with {
            if self.ctrl {
                self.original_after_ctrl = true;
                return Verdict::Pass;
            }
            return Verdict::Original;
        }
        Verdict::Ours
    }
}

/// Which Start menu to open, or (only while tracing) what the hook saw, to write down off the hook's thread.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Open {
    Ours,
    Original,
    Saw { vk: u32, down: bool, injected: bool, verdict: Verdict, sent: Option<bool>, error: u32, front: isize },
}

/// The class and program of a window, for the trace.
fn describe(hwnd: isize) -> String {
    use windows::Win32::Foundation::HWND;
    use windows::Win32::UI::WindowsAndMessaging::{GetClassNameW, GetWindowThreadProcessId};
    let hwnd = HWND(hwnd as *mut _);
    let mut class = [0u16; 128];
    let n = unsafe { GetClassNameW(hwnd, &mut class) } as usize;
    let mut pid = 0u32;
    unsafe { GetWindowThreadProcessId(hwnd, Some(&mut pid)) };
    let exe = crate::platform::windows::running::process_path(pid).unwrap_or_default();
    let exe = exe.rsplit('\\').next().unwrap_or("").to_string();
    format!("{:#x} {} ({exe}, pid {pid})", hwnd.0 as isize, String::from_utf16_lossy(&class[..n]))
}

static TRACKER: Mutex<Option<Tracker>> = Mutex::new(None);
static SENDER: Mutex<Option<Sender<Open>>> = Mutex::new(None);
static THREAD: AtomicU32 = AtomicU32::new(0);
/// Message to the hook's thread: install (wparam 1) or remove (0) the hook.
const SWITCH: u32 = WM_APP + 2;

fn key_input(vk: u16, up: bool, extended: bool) -> INPUT {
    let mut flags = KEYBD_EVENT_FLAGS(0);
    if up {
        flags |= KEYEVENTF_KEYUP;
    }
    if extended {
        flags |= KEYEVENTF_EXTENDEDKEY;
    }
    INPUT {
        r#type: INPUT_KEYBOARD,
        Anonymous: INPUT_0 { ki: KEYBDINPUT { wVk: VIRTUAL_KEY(vk), wScan: 0, dwFlags: flags, time: 0, dwExtraInfo: TAG } },
    }
}

fn send(inputs: &[INPUT]) -> bool {
    unsafe { SendInput(inputs, std::mem::size_of::<INPUT>() as i32) as usize == inputs.len() }
}

unsafe extern "system" fn key_proc(code: i32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
    if code >= 0 {
        let info = unsafe { &*(lparam.0 as *const KBDLLHOOKSTRUCT) };
        // what this module sent goes straight through
        if info.dwExtraInfo != TAG {
            let down = match wparam.0 as u32 {
                WM_KEYDOWN | WM_SYSKEYDOWN => Some(true),
                WM_KEYUP | WM_SYSKEYUP => Some(false),
                _ => None,
            };
            if let Some(down) = down {
                let verdict = TRACKER.lock().get_or_insert_with(Tracker::default).key(info.vkCode, down);
                let mut sent = None;
                let mut error = 0;
                let mut swallow = false;
                match verdict {
                    Verdict::Pass => {}
                    Verdict::Ours => {
                        // the mask, then the release held back; if Windows refuses them, the real release goes on
                        let win = info.vkCode as u16;
                        let ok = send(&[key_input(MASK, false, false), key_input(MASK, true, false), key_input(win, true, true)]);
                        if !ok {
                            error = unsafe { windows::Win32::Foundation::GetLastError() }.0;
                        }
                        sent = Some(ok);
                        swallow = ok;
                    }
                    Verdict::Original => {}
                }
                if let Some(tx) = SENDER.lock().as_ref() {
                    if crate::core::trace::enabled() && (info.vkCode == LWIN || info.vkCode == RWIN || verdict != Verdict::Pass) {
                        let front = unsafe { windows::Win32::UI::WindowsAndMessaging::GetForegroundWindow() }.0 as isize;
                        let injected = info.flags.0 & 0x10 != 0;
                        let _ = tx.send(Open::Saw { vk: info.vkCode, down, injected, verdict, sent, error, front });
                    }
                    match verdict {
                        Verdict::Ours if swallow => drop(tx.send(Open::Ours)),
                        Verdict::Original => drop(tx.send(Open::Original)),
                        _ => {}
                    }
                }
                if swallow {
                    return LRESULT(1);
                }
            }
        }
    }
    unsafe { CallNextHookEx(None, code, wparam, lparam) }
}

/// Start the thread that holds the hook, with it installed or not to begin with. `open_ours` runs on a thread of
/// its own, never inside the hook.
pub fn start(enabled: bool, open_ours: impl Fn() + Send + 'static) {
    if THREAD.load(Ordering::SeqCst) != 0 {
        return;
    }
    let (tx, rx) = channel();
    *SENDER.lock() = Some(tx);
    let opener = std::thread::Builder::new().name("winkey-open".into()).spawn(move || {
        while let Ok(open) = rx.recv() {
            match open {
                Open::Saw { vk, down, injected, verdict, sent, error, front } => {
                    crate::trace!(
                        "winkey: {vk:#x} {} {}{verdict:?} sent={sent:?} error={error} front={}",
                        if down { "down" } else { "up" },
                        if injected { "(injected) " } else { "" },
                        describe(front)
                    );
                }
                Open::Ours => open_ours(),
                // after the hook has let Ctrl's release through: a Windows key press of our own, which Windows opens
                // its menu for
                Open::Original => {
                    let win = VK_LWIN.0;
                    if !send(&[key_input(win, false, true), key_input(win, true, true)]) {
                        log::warn!("could not open Windows' Start menu");
                    }
                }
            }
        }
    });
    if let Err(e) = opener {
        log::warn!("could not start the Windows key's opener: {e}");
        return;
    }
    let spawned = std::thread::Builder::new().name("winkey".into()).spawn(move || unsafe {
        THREAD.store(GetCurrentThreadId(), Ordering::SeqCst);
        let mut hook: Option<HHOOK> = None;
        let set = |on: bool, hook: &mut Option<HHOOK>| {
            if let Some(h) = hook.take() {
                let _ = UnhookWindowsHookEx(h);
            }
            *TRACKER.lock() = Some(Tracker::default());
            if on {
                match SetWindowsHookExW(WH_KEYBOARD_LL, Some(key_proc), None, 0) {
                    Ok(h) => *hook = Some(h),
                    Err(e) => log::warn!("could not watch the Windows key: {e}"),
                }
            }
        };
        set(enabled, &mut hook);
        // the hook is called on this thread while it waits for messages
        let mut msg = MSG::default();
        while GetMessageW(&mut msg, None, 0, 0).as_bool() {
            if msg.message == SWITCH {
                set(msg.wParam.0 == 1, &mut hook);
            }
        }
        set(false, &mut hook);
    });
    if let Err(e) = spawned {
        log::warn!("could not start the Windows key's hook: {e}");
    }
}

/// Take the Windows key over, or give it back, from any thread.
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

    const E: u32 = 0x45;
    const LCTRL: u32 = 0xA2;
    const LSHIFT: u32 = 0xA0;

    fn run(keys: &[(u32, bool)]) -> Vec<Verdict> {
        let mut t = Tracker::default();
        keys.iter().map(|&(vk, down)| t.key(vk, down)).collect()
    }

    #[test]
    fn a_lone_windows_key_opens_ours_on_release() {
        assert_eq!(run(&[(LWIN, true), (LWIN, false)]), [Verdict::Pass, Verdict::Ours]);
        assert_eq!(run(&[(RWIN, true), (RWIN, false)]), [Verdict::Pass, Verdict::Ours]);
    }

    #[test]
    fn a_held_key_repeating_is_still_a_lone_press() {
        assert_eq!(run(&[(LWIN, true), (LWIN, true), (LWIN, true), (LWIN, false)]).last(), Some(&Verdict::Ours));
    }

    #[test]
    fn a_shortcut_is_left_to_windows() {
        assert!(run(&[(LWIN, true), (E, true), (E, false), (LWIN, false)]).iter().all(|v| *v == Verdict::Pass));
        assert!(run(&[(LSHIFT, true), (LWIN, true), (LWIN, false), (LSHIFT, false)]).iter().all(|v| *v == Verdict::Pass));
        assert!(run(&[(LWIN, true), (LSHIFT, true), (LSHIFT, false), (LWIN, false)]).iter().all(|v| *v == Verdict::Pass));
    }

    #[test]
    fn ctrl_win_opens_windows_menu_once_both_are_up() {
        // Win let go first: Windows' menu waits for Ctrl
        assert_eq!(
            run(&[(LCTRL, true), (LWIN, true), (LWIN, false), (LCTRL, false)]),
            [Verdict::Pass, Verdict::Pass, Verdict::Pass, Verdict::Original]
        );
        // Ctrl let go first
        assert_eq!(
            run(&[(LCTRL, true), (LWIN, true), (LCTRL, false), (LWIN, false)]),
            [Verdict::Pass, Verdict::Pass, Verdict::Pass, Verdict::Original]
        );
        // Win pressed first, then Ctrl
        assert_eq!(run(&[(LWIN, true), (LCTRL, true), (LWIN, false), (LCTRL, false)]).last(), Some(&Verdict::Original));
    }

    #[test]
    fn ctrl_win_with_a_key_is_a_shortcut() {
        // Ctrl+Win+D (a new desktop)
        let d = 0x44;
        assert!(run(&[(LCTRL, true), (LWIN, true), (d, true), (d, false), (LWIN, false), (LCTRL, false)])
            .iter()
            .all(|v| *v == Verdict::Pass));
        // Ctrl+Win, Win up, then Ctrl+C before Ctrl comes up: no menu
        let c = 0x43;
        assert!(run(&[(LCTRL, true), (LWIN, true), (LWIN, false), (c, true), (c, false), (LCTRL, false)])
            .iter()
            .all(|v| *v == Verdict::Pass));
    }

    #[test]
    fn a_shortcut_does_not_spoil_the_next_press() {
        assert_eq!(run(&[(LWIN, true), (E, true), (E, false), (LWIN, false), (LWIN, true), (LWIN, false)]).last(), Some(&Verdict::Ours));
        assert_eq!(run(&[(LCTRL, true), (LCTRL, false), (LWIN, true), (LWIN, false)]).last(), Some(&Verdict::Ours));
    }
}
