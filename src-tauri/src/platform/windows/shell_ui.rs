//! Opening pieces of the Windows shell's own UI from the dock: the
//! notification centre with its calendar, and the hidden-icons flyout from
//! the system tray.
//!
//! Neither has a public API. The notification centre answers to Win+N, so
//! that shortcut is sent. The hidden-icons flyout belongs to the taskbar, so
//! its button is pressed through UI Automation; that only works while the
//! taskbar window is actually shown, which the dock keeps hidden, so it is
//! revealed for the length of the flyout and hidden again after.

use std::sync::atomic::{AtomicBool, Ordering};
use std::time::{Duration, Instant};

use windows::core::{w, Interface};
use windows::Win32::Foundation::{COLORREF, HWND, LPARAM, POINT, RECT, WPARAM};
use windows::Win32::Graphics::Dwm::{DwmGetWindowAttribute, DWMWA_CLOAKED};
use windows::Win32::Graphics::Gdi::{
    GetMonitorInfoW, MonitorFromPoint, MONITORINFO, MONITOR_DEFAULTTONEAREST,
};
use windows::Win32::System::Com::{CoCreateInstance, CLSCTX_INPROC_SERVER};
use windows::Win32::UI::Accessibility::{
    CUIAutomation, IUIAutomation, IUIAutomationInvokePattern, TreeScope_Descendants,
    UIA_InvokePatternId,
};
use windows::Win32::UI::Input::KeyboardAndMouse::{
    SendInput, INPUT, INPUT_0, INPUT_KEYBOARD, KEYBDINPUT, KEYBD_EVENT_FLAGS, KEYEVENTF_KEYUP,
    VIRTUAL_KEY, VK_LWIN,
};
use windows::Win32::UI::WindowsAndMessaging::{
    FindWindowW, GetClassNameW, GetForegroundWindow, GetWindowLongPtrW, GetWindowRect,
    IsWindowVisible, PostMessageW, SetLayeredWindowAttributes, SetWindowLongPtrW, SetWindowPos,
    ShowWindow, GWL_EXSTYLE, LWA_ALPHA, SW_HIDE, SWP_NOACTIVATE, SWP_NOSIZE, SWP_NOZORDER,
    WM_CLOSE, WS_EX_LAYERED,
};

use super::taskbar;
use crate::core::{AeroError, AeroResult};

fn key(vk: u16, up: bool) -> INPUT {
    INPUT {
        r#type: INPUT_KEYBOARD,
        Anonymous: INPUT_0 {
            ki: KEYBDINPUT {
                wVk: VIRTUAL_KEY(vk),
                wScan: 0,
                dwFlags: if up { KEYEVENTF_KEYUP } else { KEYBD_EVENT_FLAGS(0) },
                time: 0,
                dwExtraInfo: 0,
            },
        },
    }
}

/// Open the notification centre and calendar, as Win+N does.
pub fn open_notification_center() {
    const VK_N: u16 = 0x4E;
    let sequence = [
        key(VK_LWIN.0, false),
        key(VK_N, false),
        key(VK_N, true),
        key(VK_LWIN.0, true),
    ];
    unsafe {
        SendInput(&sequence, std::mem::size_of::<INPUT>() as i32);
    }
}

/// Whether a taskbar element looks like the "show hidden icons" arrow. The
/// automation name is localised, so this also accepts the ids the shell
/// has used for it.
fn looks_like_overflow_button(name: &str, id: &str) -> bool {
    let name = name.to_ascii_lowercase();
    let id = id.to_ascii_lowercase();
    name.contains("hidden icons")
        || name.contains("show hidden")
        || (name.contains("hidden") && name.contains("icon"))
        || name.contains("chevron")
        || name.contains("overflow")
        || id.contains("notifyitemexpand")
        || id.contains("chevron")
        || id.contains("overflow")
}

/// Press the system tray's "show hidden icons" button. Returns whether one
/// was found. Every element seen is appended to `seen`, one line each, so a
/// failure can say what the taskbar actually exposes.
fn press_overflow_button(seen: &mut Vec<String>) -> AeroResult<bool> {
    seen.clear();
    let _com = crate::platform::ComApartment::new();
    let automation: IUIAutomation =
        unsafe { CoCreateInstance(&CUIAutomation, None, CLSCTX_INPROC_SERVER)? };
    let tray = unsafe { windows::Win32::UI::WindowsAndMessaging::FindWindowW(w!("Shell_TrayWnd"), None) }
        .map_err(|e| AeroError::other(format!("taskbar not found: {e}")))?;
    let root = unsafe { automation.ElementFromHandle(tray)? };
    let everything = unsafe { automation.CreateTrueCondition()? };
    let elements = unsafe { root.FindAll(TreeScope_Descendants, &everything)? };
    let count = unsafe { elements.Length()? };
    for i in 0..count {
        let element = unsafe { elements.GetElement(i)? };
        let name = unsafe { element.CurrentName() }.map(|s| s.to_string()).unwrap_or_default();
        let id = unsafe { element.CurrentAutomationId() }
            .map(|s| s.to_string())
            .unwrap_or_default();
        let class = unsafe { element.CurrentClassName() }
            .map(|s| s.to_string())
            .unwrap_or_default();
        let control_type = unsafe { element.CurrentControlType() }.map(|t| t.0).unwrap_or(0);
        let offscreen = unsafe { element.CurrentIsOffscreen() }
            .map(|b| b.as_bool())
            .unwrap_or(false);
        if seen.len() < 800 {
            seen.push(format!(
                "type={control_type} class='{class}' id='{id}' name='{name}' offscreen={offscreen}"
            ));
        }
        if !looks_like_overflow_button(&name, &id) {
            continue;
        }
        let pattern = unsafe { element.GetCurrentPattern(UIA_InvokePatternId) };
        if let Ok(pattern) = pattern {
            if let Ok(invoke) = pattern.cast::<IUIAutomationInvokePattern>() {
                unsafe { invoke.Invoke()? };
                return Ok(true);
            }
        }
    }
    Ok(false)
}

/// The hidden-icons flyout's window, while one exists (its class name
/// changed between Windows 10 and 11).
fn overflow_flyout() -> Option<HWND> {
    /// A window of this class that is actually on screen. A failed lookup
    /// comes back as a null handle inside an `Ok`, so null has to be
    /// rejected by hand; without that every lookup "finds" something and the
    /// flyout looks permanently open. A window that exists but is hidden or
    /// cloaked is not a flyout the user can see either.
    fn visible_window_of_class(class: windows::core::PCWSTR) -> Option<HWND> {
        unsafe {
            let hwnd = FindWindowW(class, None).ok()?;
            if hwnd.0.is_null() || !IsWindowVisible(hwnd).as_bool() {
                return None;
            }
            let mut cloaked: u32 = 0;
            let _ = DwmGetWindowAttribute(
                hwnd,
                DWMWA_CLOAKED,
                &mut cloaked as *mut u32 as *mut _,
                std::mem::size_of::<u32>() as u32,
            );
            (cloaked == 0).then_some(hwnd)
        }
    }
    visible_window_of_class(w!("TopLevelWindowForOverflowXamlIsland"))
        .or_else(|| visible_window_of_class(w!("NotifyIconOverflowWindow")))
}

/// The flyout's window if it exists at all, shown yet or not. This is for
/// grabbing it as early as possible; [`overflow_flyout`] is the one that
/// means "the user can see it".
fn overflow_flyout_any() -> Option<HWND> {
    unsafe {
        for class in [
            w!("TopLevelWindowForOverflowXamlIsland"),
            w!("NotifyIconOverflowWindow"),
        ] {
            if let Ok(hwnd) = FindWindowW(class, None) {
                if !hwnd.0.is_null() {
                    return Some(hwnd);
                }
            }
        }
        None
    }
}

/// Make a window fully transparent without hiding it, so it can be moved
/// and resized by the shell without anyone seeing. Returns whether the
/// layered style had to be added, which [`reveal_window`] must undo.
fn hide_window(hwnd: HWND) -> bool {
    unsafe {
        let ex = GetWindowLongPtrW(hwnd, GWL_EXSTYLE) as u32;
        let added = ex & WS_EX_LAYERED.0 == 0;
        if added {
            SetWindowLongPtrW(hwnd, GWL_EXSTYLE, (ex | WS_EX_LAYERED.0) as isize);
        }
        let _ = SetLayeredWindowAttributes(hwnd, COLORREF(0), 0, LWA_ALPHA);
        added
    }
}

/// Undo [`hide_window`].
fn reveal_window(hwnd: HWND, added_layered: bool) {
    unsafe {
        let _ = SetLayeredWindowAttributes(hwnd, COLORREF(0), 255, LWA_ALPHA);
        if added_layered {
            let ex = GetWindowLongPtrW(hwnd, GWL_EXSTYLE) as u32;
            SetWindowLongPtrW(hwnd, GWL_EXSTYLE, (ex & !WS_EX_LAYERED.0) as isize);
        }
    }
}

/// Keep placing the flyout above the anchor until its size stops changing
/// (the shell sizes it to its contents a moment after creating it), so it
/// is in its final place by the time it is shown. Gives up after about a
/// third of a second rather than hold it back for long.
fn settle_flyout_position(flyout: HWND, anchor_x: i32, anchor_top: i32, trace: &Trace) {
    let mut last_size = (0, 0);
    let mut steady = 0;
    for _ in 0..35 {
        let mut rect = RECT::default();
        let have_rect = unsafe { GetWindowRect(flyout, &mut rect) }.is_ok();
        let size = (rect.right - rect.left, rect.bottom - rect.top);
        if have_rect && size.0 > 0 && size.1 > 0 {
            centre_flyout_above(flyout, anchor_x, anchor_top);
            if size == last_size {
                steady += 1;
                // three readings in a row at the same size: it has settled,
                // and the shell has had time to do its own placement first
                if steady >= 3 {
                    trace.log(format!("settled at {}x{}", size.0, size.1));
                    return;
                }
            } else {
                steady = 0;
            }
            last_size = size;
        }
        std::thread::sleep(Duration::from_millis(10));
    }
    trace.log("gave up waiting for the size to settle");
}

/// Move the flyout so it is centred above a point on screen (the tray
/// button in the dock), kept on the monitor it is on. Coordinates are
/// physical pixels.
fn centre_flyout_above(flyout: HWND, anchor_x: i32, anchor_top: i32) {
    const GAP: i32 = 12;
    const MARGIN: i32 = 8;
    unsafe {
        let mut rect = RECT::default();
        if GetWindowRect(flyout, &mut rect).is_err() {
            return;
        }
        let (w, h) = (rect.right - rect.left, rect.bottom - rect.top);
        let monitor = MonitorFromPoint(
            POINT {
                x: anchor_x,
                y: anchor_top,
            },
            MONITOR_DEFAULTTONEAREST,
        );
        let mut info = MONITORINFO {
            cbSize: std::mem::size_of::<MONITORINFO>() as u32,
            ..Default::default()
        };
        if !GetMonitorInfoW(monitor, &mut info).as_bool() {
            return;
        }
        let screen = info.rcMonitor;
        let max_x = (screen.right - w - MARGIN).max(screen.left + MARGIN);
        let x = (anchor_x - w / 2).max(screen.left + MARGIN).min(max_x);
        let y = (anchor_top - h - GAP).max(screen.top + MARGIN);
        let _ = SetWindowPos(flyout, None, x, y, 0, 0, SWP_NOSIZE | SWP_NOZORDER | SWP_NOACTIVATE);
    }
}

/// Close an open flyout.
///
/// Right after a click on the dock, the dock window is the foreground one, so
/// the flyout does not have the keyboard and an Escape would go to the wrong
/// place. So Escape is only used when the focus really is the flyout (or the
/// taskbar that opened it); otherwise it is asked to close, and if it
/// ignores that it is hidden outright.
fn close_flyout(flyout: HWND, trace: &Trace) {
    const VK_ESCAPE: u16 = 0x1B;
    let class = foreground_class();
    trace.log(format!("closing the flyout, foreground is '{class}'"));
    if class == "TopLevelWindowForOverflowXamlIsland"
        || class == "NotifyIconOverflowWindow"
        || class == "Shell_TrayWnd"
    {
        tap(VK_ESCAPE);
    } else {
        unsafe {
            let _ = PostMessageW(Some(flyout), WM_CLOSE, WPARAM(0), LPARAM(0));
        }
    }
    for _ in 0..8 {
        std::thread::sleep(Duration::from_millis(25));
        if overflow_flyout().is_none() {
            trace.log("the flyout closed");
            return;
        }
    }
    trace.log("the flyout ignored the request: hiding its window");
    unsafe {
        let _ = ShowWindow(flyout, SW_HIDE);
    }
}

/// The class of the window that has the foreground right now.
fn foreground_class() -> String {
    let mut class = [0u16; 64];
    let len = unsafe { GetClassNameW(GetForegroundWindow(), &mut class) };
    if len > 0 {
        String::from_utf16_lossy(&class[..len as usize])
    } else {
        String::new()
    }
}

/// Tap a single key.
fn tap(vk: u16) {
    let sequence = [key(vk, false), key(vk, true)];
    unsafe {
        SendInput(&sequence, std::mem::size_of::<INPUT>() as i32);
    }
}

/// Ask the shell to open the hidden-icons flyout from the keyboard: Win+B
/// puts focus on the notification area, Enter then opens it. The Enter is
/// the dangerous half, because anywhere else it would land in whatever app
/// is in front (and could confirm a dialog), so it is only sent once the
/// taskbar has been seen to take the focus. Returns whether the Enter was
/// sent. Finding and placing the flyout is [`watch_for_flyout`]'s job.
fn press_keys_for_flyout(trace: &Trace) -> bool {
    const VK_B: u16 = 0x42;
    const VK_RETURN: u16 = 0x0D;

    let sequence = [
        key(VK_LWIN.0, false),
        key(VK_B, false),
        key(VK_B, true),
        key(VK_LWIN.0, true),
    ];
    trace.log(format!("sending Win+B, foreground is '{}'", foreground_class()));
    let sent = unsafe { SendInput(&sequence, std::mem::size_of::<INPUT>() as i32) };
    trace.log(format!("Win+B: {sent} of {} events accepted", sequence.len()));

    // wait for the taskbar to actually take the focus
    let mut taskbar_has_focus = false;
    for _ in 0..8 {
        std::thread::sleep(Duration::from_millis(100));
        let class = foreground_class();
        trace.log(format!("foreground is '{class}'"));
        if class == "Shell_TrayWnd" {
            taskbar_has_focus = true;
            break;
        }
    }
    if !taskbar_has_focus {
        trace.log("the taskbar never took the focus: not sending Enter");
        return false;
    }

    trace.log("sending Enter");
    tap(VK_RETURN);
    true
}

/// Catch the flyout the moment it exists and have it in place before anyone
/// sees it. Runs alongside whatever asks the shell to open it, so that it
/// is already watching when the window appears; returns once the flyout is
/// up and placed (true), or when `stop` is set or about six seconds pass
/// (false).
///
/// The shell opens the window at its own default spot and animates it in
/// from there, so moving it afterwards shows a frame in the wrong place.
/// Instead it is made transparent at once, put where it belongs once its
/// size has settled, and only then shown.
///
/// The window can also be left over from last time, hidden, in which case it
/// "exists" before the shell has done anything with it. So it is made
/// transparent when first seen, but not placed or revealed until the shell
/// has actually shown it; otherwise the shell would show it at its default
/// spot after the dock had already revealed it.
fn watch_for_flyout(anchor: Option<(i32, i32)>, trace: &Trace, stop: &AtomicBool) -> bool {
    let mut held: Option<(HWND, bool)> = None;
    let deadline = Instant::now() + Duration::from_secs(6);
    while Instant::now() < deadline && !stop.load(Ordering::SeqCst) {
        std::thread::sleep(Duration::from_millis(2));
        let Some(flyout) = overflow_flyout_any() else {
            continue;
        };
        let (_, made_layered) = *held.get_or_insert_with(|| {
            trace.log("the flyout window exists: making it transparent");
            (flyout, hide_window(flyout))
        });
        if overflow_flyout().is_none() {
            // not shown by the shell yet
            continue;
        }
        trace.log("the shell has shown the flyout");
        if let Some((x, y)) = anchor {
            settle_flyout_position(flyout, x, y, trace);
        }
        reveal_window(flyout, made_layered);
        trace.log("the flyout is revealed");
        return true;
    }
    // it never came up: do not leave a transparent window behind
    if let Some((flyout, made_layered)) = held {
        reveal_window(flyout, made_layered);
    }
    trace.log("no flyout appeared");
    false
}

/// Open the system tray's hidden-icons flyout. Blocking; call from a worker
/// thread. Returns whether it opened. When it did not and `dump_path` is
/// given, what the taskbar exposed to UI Automation is written there.
///
/// UI Automation is tried first, once. On some Windows 11 builds it sees
/// almost nothing inside the taskbar (two empty panes, in the one this was
/// written against), and then the keyboard route is the fallback.
///
/// Calling it while the flyout is open closes it instead, so the dock's
/// button toggles. `anchor` is where the flyout should sit centred above, in
/// screen pixels (centre x, top y).
///
/// `on_flyout` is told `true` when the flyout is up and `false` once it is
/// gone (always, however the attempt ended).
pub fn open_tray_overflow(
    dump_path: Option<std::path::PathBuf>,
    anchor: Option<(i32, i32)>,
    on_flyout: &dyn Fn(bool),
) -> AeroResult<bool> {
    let trace = Trace::new(dump_path.as_ref().map(|p| p.with_file_name("tray-debug.log")));
    trace.log(format!("click, anchor={anchor:?}"));
    // a second click while it is up means "put it away"
    if let Some(flyout) = overflow_flyout() {
        trace.log("a flyout window exists: closing it");
        close_flyout(flyout, &trace);
        return Ok(true);
    }
    // a click while the first is still being set up is not a second request
    if OPENING.swap(true, Ordering::SeqCst) {
        trace.log("already opening: ignoring this click");
        return Ok(true);
    }
    // however this ends, a later click must not be locked out by it
    let _opening = OpeningGuard;
    let result = open_tray_overflow_inner(dump_path, anchor, on_flyout, &trace);
    // whatever happened, the flyout is not up any more
    on_flyout(false);
    trace.log(format!("finished: {result:?}"));
    result
}

static OPENING: AtomicBool = AtomicBool::new(false);

struct OpeningGuard;

impl Drop for OpeningGuard {
    fn drop(&mut self) {
        OPENING.store(false, Ordering::SeqCst);
    }
}

/// A timeline of what the tray button did, for working out why it did not do
/// what was wanted. Appended to a file beside the other data; it is cut back
/// when it grows, so it stays small.
struct Trace {
    path: Option<std::path::PathBuf>,
    started: Instant,
}

impl Trace {
    fn new(path: Option<std::path::PathBuf>) -> Self {
        if let Some(p) = &path {
            if std::fs::metadata(p).is_ok_and(|m| m.len() > 20_000) {
                let _ = std::fs::write(p, "");
            }
        }
        Self {
            path,
            started: Instant::now(),
        }
    }

    fn log(&self, message: impl AsRef<str>) {
        use std::io::Write;
        let Some(path) = &self.path else { return };
        if let Ok(mut file) = std::fs::OpenOptions::new().create(true).append(true).open(path) {
            let _ = writeln!(
                file,
                "[{:>5} ms] {}",
                self.started.elapsed().as_millis(),
                message.as_ref()
            );
        }
    }
}

fn open_tray_overflow_inner(
    dump_path: Option<std::path::PathBuf>,
    anchor: Option<(i32, i32)>,
    on_flyout: &dyn Fn(bool),
    trace: &Trace,
) -> AeroResult<bool> {
    // The taskbar has to be on screen for the shell to give it the focus,
    // but it is made fully transparent first so it is never seen sliding in.
    trace.log("fading the taskbar out");
    taskbar::fade_out();
    trace.log("showing the taskbar");
    let was_hiding = taskbar::suspend_hiding();
    std::thread::sleep(Duration::from_millis(300));
    let mut seen = Vec::new();
    let mut used_keyboard = false;
    let stop = AtomicBool::new(false);
    // Whichever way the shell is asked, the watcher is already looking for
    // the window, so the flyout is placed before it is ever on screen.
    let opened = std::thread::scope(|scope| {
        let watcher = scope.spawn(|| watch_for_flyout(anchor, trace, &stop));
        trace.log("trying UI Automation");
        let ui_automation = press_overflow_button(&mut seen);
        trace.log(format!("UI Automation: {:?}, {} elements", ui_automation.as_ref().ok(), seen.len()));
        let mut asked = matches!(ui_automation, Ok(true));
        if !asked {
            used_keyboard = true;
            asked = press_keys_for_flyout(trace);
        }
        if !asked {
            stop.store(true, Ordering::SeqCst);
        }
        watcher.join().unwrap_or(false)
    });
    let result: AeroResult<bool> = Ok(opened);
    if !opened && used_keyboard && foreground_class() == "Shell_TrayWnd" {
        // nothing opened: let go of the taskbar's keyboard focus again
        tap(0x1B);
    }
    if !matches!(result, Ok(true)) {
        if let Some(path) = dump_path {
            let mut text = format!(
                "Tray button not found. Result: {:?}\nElements seen: {}\n\n",
                result.as_ref().map(|_| ()).map_err(|e| e.to_string()),
                seen.len()
            );
            text.push_str(&seen.join("\n"));
            let _ = std::fs::write(path, text);
        }
    }
    if matches!(result, Ok(true)) {
        // it is up and in place
        on_flyout(true);
        // The shell positions the flyout again as it animates in, so keep
        // moving it for a moment rather than once.
        if let Some((x, y)) = anchor {
            for _ in 0..8 {
                std::thread::sleep(Duration::from_millis(60));
                if let Some(flyout) = overflow_flyout() {
                    centre_flyout_above(flyout, x, y);
                }
            }
        }
        // Keep the taskbar (invisible) for as long as the flyout is up, so
        // the flyout is not pulled away with it.
        let deadline = Instant::now() + Duration::from_secs(30);
        while Instant::now() < deadline && overflow_flyout().is_some() {
            std::thread::sleep(Duration::from_millis(200));
        }
    }
    taskbar::resume_hiding(was_hiding);
    taskbar::fade_in();
    result
}
