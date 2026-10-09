//! Live running-application tracking, the way real taskbars do it:
//! a hidden window on its own thread registers for shell hook messages
//! (HSHELL_WINDOWCREATED / DESTROYED / ACTIVATED …) and keeps a snapshot
//! of alt-tab-eligible windows. Every change is pushed to the frontend
//! as a full `apps://running-changed` snapshot — no polling anywhere.

use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, AtomicIsize, AtomicU32, Ordering};
use std::sync::OnceLock;
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use serde::Serialize;
use tauri::{AppHandle, Emitter};
use windows::core::w;
use windows::Win32::Foundation::{HWND, LPARAM, LRESULT, WPARAM};
use windows::Win32::Graphics::Dwm::{DwmGetWindowAttribute, DWMWA_CLOAKED};
use windows::Win32::Graphics::Gdi::{
    GetMonitorInfoW, MonitorFromWindow, MONITORINFO, MONITORINFOEXW, MONITOR_DEFAULTTONEAREST,
};
use windows::Win32::System::SystemInformation::GetTickCount;
use windows::Win32::System::Threading::{
    OpenProcess, QueryFullProcessImageNameW, PROCESS_NAME_WIN32,
    PROCESS_QUERY_LIMITED_INFORMATION,
};
use windows::Win32::UI::Input::KeyboardAndMouse::{GetLastInputInfo, LASTINPUTINFO};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DispatchMessageW, EnumWindows, GetClassNameW, GetMessageW,
    GetWindow, GetWindowLongPtrW, GetWindowTextLengthW, GetWindowTextW, GetWindowThreadProcessId,
    IsWindow, IsWindowVisible, KillTimer, RegisterClassW, RegisterShellHookWindow,
    RegisterWindowMessageW, SetTimer, TranslateMessage, GWL_EXSTYLE, GW_OWNER, MSG,
    WINDOW_EX_STYLE, WINDOW_STYLE, WM_DISPLAYCHANGE, WM_TIMER, WNDCLASSW, WS_EX_TOOLWINDOW,
};

pub const RUNNING_EVENT: &str = "apps://running-changed";

/// The person at the machine went idle (`true`) or came back (`false`).
pub const IDLE_EVENT: &str = "system://idle";

/// Id of the timer that watches for windows moving between monitors. It also
/// carries the check for the user going idle, so one tick serves both.
const MONITOR_TIMER: usize = 1;

/// Id of the short timer that batches shell events into one snapshot.
const EMIT_TIMER: usize = 2;

/// How long after a shell event the snapshot is sent. A window being created
/// or activated sends several events in a row; waiting this long answers the
/// whole burst once. Short enough not to be felt.
const EMIT_DELAY_MS: u32 = 25;

/// No keyboard or mouse input for this long counts as the user being away.
/// Long enough that reading something, or watching a video, is not mistaken
/// for it, since what rests on this is decoration the person may be looking
/// at.
const IDLE_AFTER_MS: u32 = 90_000;

// Shell hook codes (winuser.h)
const HSHELL_WINDOWCREATED: usize = 1;
const HSHELL_WINDOWDESTROYED: usize = 2;
const HSHELL_WINDOWACTIVATED: usize = 4;
const HSHELL_REDRAW: usize = 6;
const HSHELL_RUDEAPPACTIVATED: usize = 0x8004;
/// A window's taskbar button is flashing: it wants attention. The same number as
/// HSHELL_REDRAW with the high bit set.
const HSHELL_FLASH: usize = HSHELL_REDRAW | 0x8000;

/// The event sent when a window starts asking for attention. Its payload is the
/// window's handle.
const ATTENTION_EVENT: &str = "apps://attention";

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WindowInfo {
    /// HWND as integer; opaque handle for activate/minimize/close calls.
    pub hwnd: isize,
    pub title: String,
    /// Full path of the owning process executable.
    pub exe: String,
    pub pid: u32,
    /// AppUserModelID for packaged (UWP/Store) windows, which are all
    /// hosted by ApplicationFrameHost.exe — the exe alone can't
    /// identify them, but the frame window carries the app's AUMID.
    pub aumid: Option<String>,
    /// Device name of the monitor most of the window is on (`\\.\DISPLAY1`),
    /// as in the monitor picker. Filled in each time a snapshot is taken.
    pub monitor: String,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RunningSnapshot {
    pub windows: Vec<WindowInfo>,
    /// HWND of the foreground window (0 = none of ours).
    pub focused: isize,
}

struct TrackerState {
    app: AppHandle,
    windows: HashMap<isize, WindowInfo>,
    focused: isize,
    /// Set just after the dock launches something: the next new window
    /// that appears before this moment gets brought to the front.
    want_focus_until: Option<Instant>,
}

static STATE: OnceLock<Mutex<TrackerState>> = OnceLock::new();
static SHELL_MSG: OnceLock<u32> = OnceLock::new();

/// The hidden window the shell reports to, once it exists. The batching timer
/// belongs to it.
static HOOK_HWND: AtomicIsize = AtomicIsize::new(0);
/// A snapshot has been asked for and the batching timer is running.
static EMIT_PENDING: AtomicBool = AtomicBool::new(false);
/// What the frontends were last told, so that an event which changes nothing
/// (a window redrawing its taskbar button, a title it already had) is not
/// sent, parsed, and re-rendered by every window for nothing.
static LAST_EMITTED: Mutex<Option<RunningSnapshot>> = Mutex::new(None);
/// Whether the user is currently counted as away.
static USER_IDLE: AtomicBool = AtomicBool::new(false);
/// Ticks of the one-second timer, to run the idle check every other one.
static TICKS: AtomicU32 = AtomicU32::new(0);

/// The monitor most of a window is on, by device name. Empty if it cannot
/// be told, which a dock treats as "show it everywhere".
fn monitor_of(hwnd: isize) -> String {
    unsafe {
        let monitor = MonitorFromWindow(HWND(hwnd as *mut _), MONITOR_DEFAULTTONEAREST);
        let mut info = MONITORINFOEXW {
            monitorInfo: MONITORINFO {
                cbSize: std::mem::size_of::<MONITORINFOEXW>() as u32,
                ..Default::default()
            },
            ..Default::default()
        };
        if GetMonitorInfoW(monitor, &mut info.monitorInfo).as_bool() {
            super::util::from_wide(&info.szDevice)
        } else {
            String::new()
        }
    }
}

/// Bring every tracked window's monitor up to date. True if any changed.
fn refresh_monitors() -> bool {
    with_state(|s| {
        let mut changed = false;
        for window in s.windows.values_mut() {
            let monitor = monitor_of(window.hwnd);
            if monitor != window.monitor {
                window.monitor = monitor;
                changed = true;
            }
        }
        changed
    })
    .unwrap_or(false)
}

/// Whether to keep an eye on windows being dragged between monitors. Only
/// worth doing while several docks each list their own screen's windows.
static WATCH_MONITORS: AtomicBool = AtomicBool::new(false);

pub fn watch_monitors(on: bool) {
    WATCH_MONITORS.store(on, Ordering::Relaxed);
}

/// Called when the set of monitors changes (one plugged in or removed, or a
/// resolution change). Set once at startup.
static DISPLAY_HOOK: OnceLock<Box<dyn Fn() + Send + Sync>> = OnceLock::new();

pub fn set_display_hook(hook: impl Fn() + Send + Sync + 'static) {
    let _ = DISPLAY_HOOK.set(Box::new(hook));
}

/// Current snapshot for the initial frontend hydrate.
pub fn snapshot() -> RunningSnapshot {
    refresh_monitors();
    match STATE.get() {
        Some(state) => {
            let s = state.lock();
            let mut windows: Vec<_> = s.windows.values().cloned().collect();
            windows.sort_by_key(|w| w.hwnd);
            RunningSnapshot {
                windows,
                focused: s.focused,
            }
        }
        None => RunningSnapshot {
            windows: Vec::new(),
            focused: 0,
        },
    }
}

/// Spawn the tracker thread. Call once from app setup.
pub fn start(app: AppHandle) {
    std::thread::Builder::new()
        .name("aero-shell-hook".into())
        .spawn(move || run_message_loop(app))
        .expect("spawn shell hook thread");
}

fn run_message_loop(app: AppHandle) {
    let initial: HashMap<isize, WindowInfo> = enumerate_taskbar_windows()
        .into_iter()
        .map(|w| (w.hwnd, w))
        .collect();
    // Start from whatever is in front right now, so the first click on an
    // icon already knows whether its window is the frontmost one.
    let focused = unsafe {
        let fg = windows::Win32::UI::WindowsAndMessaging::GetForegroundWindow();
        if fg.0.is_null() || is_own_window(fg) {
            0
        } else {
            fg.0 as isize
        }
    };
    let _ = STATE.set(Mutex::new(TrackerState {
        app: app.clone(),
        windows: initial,
        focused,
        want_focus_until: None,
    }));
    emit_snapshot();

    unsafe {
        let class = WNDCLASSW {
            lpfnWndProc: Some(wnd_proc),
            lpszClassName: w!("AeroDockShellHook"),
            ..Default::default()
        };
        RegisterClassW(&class);

        // NOTE: must be a real (hidden) top-level window — message-only
        // windows (HWND_MESSAGE parent) never receive shell hook messages.
        let hwnd = match CreateWindowExW(
            WINDOW_EX_STYLE(0),
            w!("AeroDockShellHook"),
            w!("AeroDockShellHook"),
            WINDOW_STYLE(0),
            0,
            0,
            0,
            0,
            None,
            None,
            None,
            None,
        ) {
            Ok(h) => h,
            Err(e) => {
                log::error!("shell hook window creation failed: {e}");
                return;
            }
        };

        let _ = SHELL_MSG.set(RegisterWindowMessageW(w!("SHELLHOOK")));
        if !RegisterShellHookWindow(hwnd).as_bool() {
            log::error!("RegisterShellHookWindow failed; running apps won't be live");
            return;
        }

        HOOK_HWND.store(hwnd.0 as isize, Ordering::SeqCst);

        // A window dragged to another monitor sends the shell hook nothing.
        // This tick notices it, but only does any work while several docks
        // are each listing their own screen's windows (see `watch_monitors`);
        // otherwise it returns at once. It also checks for the user going
        // idle, which is the other thing that wants a slow regular look.
        SetTimer(Some(hwnd), MONITOR_TIMER, 1000, None);

        let mut msg = MSG::default();
        while GetMessageW(&mut msg, None, 0, 0).as_bool() {
            let _ = TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
    }
}

unsafe extern "system" fn wnd_proc(
    hwnd: HWND,
    msg: u32,
    wparam: WPARAM,
    lparam: LPARAM,
) -> LRESULT {
    if msg == WM_TIMER && wparam.0 == MONITOR_TIMER {
        if TICKS.fetch_add(1, Ordering::Relaxed).is_multiple_of(2) {
            check_idle();
        }
        if WATCH_MONITORS.load(Ordering::Relaxed) && refresh_monitors() {
            emit_snapshot();
        }
        return LRESULT(0);
    }
    if msg == WM_TIMER && wparam.0 == EMIT_TIMER {
        // one-shot: the burst of shell events is over
        unsafe {
            let _ = KillTimer(Some(hwnd), EMIT_TIMER);
        }
        EMIT_PENDING.store(false, Ordering::SeqCst);
        prune_and_emit_now();
        return LRESULT(0);
    }
    if msg == WM_DISPLAYCHANGE {
        // a monitor came or went, or changed resolution
        if let Some(hook) = DISPLAY_HOOK.get() {
            hook();
        }
        return LRESULT(0);
    }
    if Some(&msg) == SHELL_MSG.get() {
        let target = HWND(lparam.0 as *mut _);
        match wparam.0 {
            HSHELL_WINDOWCREATED | HSHELL_REDRAW => {
                if let Some(info) = unsafe { probe_window(target) } {
                    let hwnd = info.hwnd;
                    // a window we have not seen, soon after a launch from
                    // the dock, is the thing that was launched
                    let bring_forward = with_state(|s| {
                        let is_new = !s.windows.contains_key(&hwnd);
                        s.windows.insert(hwnd, info);
                        let wanted =
                            is_new && s.want_focus_until.is_some_and(|t| Instant::now() < t);
                        if wanted {
                            s.want_focus_until = None;
                        }
                        wanted
                    })
                    .unwrap_or(false);
                    prune_and_emit();
                    if bring_forward {
                        activate_window(hwnd);
                    }
                    return LRESULT(0);
                } else {
                    // REDRAW on a window that stopped qualifying (title gone)
                    with_state(|s| {
                        s.windows.remove(&(lparam.0));
                    });
                }
                prune_and_emit();
            }
            HSHELL_FLASH => {
                // a window in the background is flashing for attention (a message,
                // a finished download); the page decides what to do about it
                with_state(|s| {
                    let _ = s.app.emit(ATTENTION_EVENT, target.0 as isize);
                });
            }
            HSHELL_WINDOWDESTROYED => {
                with_state(|s| {
                    s.windows.remove(&(lparam.0));
                    if s.focused == lparam.0 {
                        s.focused = 0;
                    }
                });
                prune_and_emit();
            }
            HSHELL_WINDOWACTIVATED | HSHELL_RUDEAPPACTIVATED => {
                // activation can arrive before creation for fast-starting apps
                if let Some(info) = unsafe { probe_window(target) } {
                    // a real window, which includes our own settings window
                    with_state(|s| {
                        s.windows.insert(info.hwnd, info);
                        s.focused = lparam.0;
                    });
                } else if unsafe { is_own_window(target) } {
                    // The dock and the widget layer are not listed as apps.
                    // Clicking the dock can briefly make the dock the
                    // foreground window; that is not the user switching
                    // apps, and recording it would make the app they were
                    // just using look unfocused, so a click on its icon
                    // would refocus it instead of minimizing it.
                    return LRESULT(0);
                } else {
                    with_state(|s| s.focused = lparam.0);
                }
                prune_and_emit();
            }
            _ => {}
        }
        return LRESULT(0);
    }
    unsafe { DefWindowProcW(hwnd, msg, wparam, lparam) }
}

/// Expect the dock to have just launched something: bring forward the next
/// new window that appears in the next few seconds. Launching goes through
/// the shell, which does not reliably give the new window the foreground
/// when the request comes from a background process like the dock.
pub fn focus_next_new_window() {
    with_state(|s| s.want_focus_until = Some(Instant::now() + Duration::from_secs(6)));
}

/// True for any window belonging to this process: the dock, settings, the
/// widget layer.
unsafe fn is_own_window(hwnd: HWND) -> bool {
    let mut pid = 0u32;
    unsafe { GetWindowThreadProcessId(hwnd, Some(&mut pid)) };
    pid != 0 && pid == std::process::id()
}

fn with_state<R>(f: impl FnOnce(&mut TrackerState) -> R) -> Option<R> {
    STATE.get().map(|state| f(&mut state.lock()))
}

/// Ask for the new state of the windows to be pushed to the frontends. Not
/// sent at once: a window being created or activated sends the shell hook
/// several events in a row, so this starts a short timer and the one snapshot
/// that follows it covers them all.
fn prune_and_emit() {
    if EMIT_PENDING.swap(true, Ordering::SeqCst) {
        return; // already on its way
    }
    let hwnd = HOOK_HWND.load(Ordering::SeqCst);
    if hwnd == 0 {
        // nothing to time it with yet
        EMIT_PENDING.store(false, Ordering::SeqCst);
        prune_and_emit_now();
        return;
    }
    let started = unsafe { SetTimer(Some(HWND(hwnd as *mut _)), EMIT_TIMER, EMIT_DELAY_MS, None) };
    if started == 0 {
        EMIT_PENDING.store(false, Ordering::SeqCst);
        prune_and_emit_now();
    }
}

/// Drop stale entries (windows that died without a DESTROYED hook) and
/// push the new snapshot to the frontend.
fn prune_and_emit_now() {
    with_state(|s| {
        s.windows
            .retain(|&hwnd, _| unsafe { IsWindow(Some(HWND(hwnd as *mut _))).as_bool() });
    });
    emit_snapshot();
}

/// Send the snapshot, unless it is what was sent last.
fn emit_snapshot() {
    refresh_monitors();
    if let Some(state) = STATE.get() {
        let (app, snap) = {
            let s = state.lock();
            let mut windows: Vec<_> = s.windows.values().cloned().collect();
            windows.sort_by_key(|w| w.hwnd);
            (
                s.app.clone(),
                RunningSnapshot {
                    windows,
                    focused: s.focused,
                },
            )
        };
        {
            let mut last = LAST_EMITTED.lock();
            if last.as_ref() == Some(&snap) {
                return;
            }
            *last = Some(snap.clone());
        }
        if let Err(e) = app.emit(RUNNING_EVENT, &snap) {
            log::warn!("emit running snapshot failed: {e}");
        }
    }
}

/// Whether the time since the last input counts as being away. Both arguments
/// are millisecond tick counts, which wrap after about 49 days; the
/// subtraction wraps with them, so a count that has just rolled over still
/// gives the right gap. Pure so it can be tested.
fn is_idle(now_ticks: u32, last_input_ticks: u32) -> bool {
    now_ticks.wrapping_sub(last_input_ticks) >= IDLE_AFTER_MS
}

/// Tell the frontends when the user goes idle or comes back. Cheap: one call,
/// and an event only when the answer changes.
fn check_idle() {
    let mut info = LASTINPUTINFO {
        cbSize: std::mem::size_of::<LASTINPUTINFO>() as u32,
        dwTime: 0,
    };
    if !unsafe { GetLastInputInfo(&mut info) }.as_bool() {
        return;
    }
    let idle = is_idle(unsafe { GetTickCount() }, info.dwTime);
    if USER_IDLE.swap(idle, Ordering::SeqCst) != idle {
        if let Some(app) = with_state(|s| s.app.clone()) {
            let _ = app.emit(IDLE_EVENT, idle);
        }
    }
}

/// Initial scan: everything currently alt-tab eligible.
fn enumerate_taskbar_windows() -> Vec<WindowInfo> {
    unsafe extern "system" fn cb(hwnd: HWND, lparam: LPARAM) -> windows::core::BOOL {
        let out = unsafe { &mut *(lparam.0 as *mut Vec<WindowInfo>) };
        if let Some(info) = unsafe { probe_window(hwnd) } {
            out.push(info);
        }
        windows::core::BOOL(1)
    }
    let mut out: Vec<WindowInfo> = Vec::new();
    unsafe {
        let _ = EnumWindows(Some(cb), LPARAM(&mut out as *mut _ as isize));
    }
    out
}

/// Processes that own visible, titled, top-level windows without being
/// applications anyone wants in a dock. These are shell surfaces: the
/// search flyout, the Start menu, the IME candidate window and friends.
/// Windows Search is the one people actually notice, because it stays
/// alive in the background and its window is neither owned nor cloaked
/// often enough for the usual checks to catch it.
const SHELL_HOST_EXES: &[&str] = &[
    "searchhost.exe",
    "searchapp.exe",
    "searchui.exe",
    "startmenuexperiencehost.exe",
    "shellexperiencehost.exe",
    "textinputhost.exe",
    "peopleexperiencehost.exe",
    "lockapp.exe",
    "widgets.exe",
    "widgetboard.exe",
    "systemsettingsbroker.exe",
    "runtimebroker.exe",
    "dwm.exe",
];

/// Window classes belonging to the shell's own XAML and CoreWindow
/// surfaces. Matching on class catches shell UI even when it is hosted
/// by a process that also runs legitimate windows.
const SHELL_CLASSES: &[&str] = &[
    "windows.ui.core.corewindow",
    "xaml_windowedpopupclass",
    "multitaskingviewframe",
    "foregroundstaging",
    "windows.internal.shell.tabproxywindow",
    "progman",
    "workerw",
    "shell_traywnd",
    "shell_secondarytraywnd",
    "notifyiconoverflowwindow",
];

/// Packaged shell components, matched on the AppUserModelID prefix.
/// A real Store app never starts with one of these.
const SHELL_AUMID_PREFIXES: &[&str] = &[
    "microsoft.windows.search",
    "microsoft.windows.startmenuexperiencehost",
    "microsoft.windows.shellexperiencehost",
    "microsoft.windows.widgets",
    "microsoftwindows.client.cbs",
    "microsoftwindows.client.core",
    "windows.immersivecontrolpanel",
];

const APP_FRAME_HOST: &str = "applicationframehost.exe";

/// File name of a full executable path, lowercased. Shared with the
/// audio and workspace code so "the same app" means one thing everywhere.
use crate::core::names::exe_key as exe_basename;

/// True when a window belongs to the Windows shell rather than to an
/// application. Pure so the rules can be tested without a desktop.
fn is_shell_surface(exe_path: &str, class_name: &str) -> bool {
    let exe = exe_basename(exe_path);
    let class = class_name.to_ascii_lowercase();
    SHELL_HOST_EXES.contains(&exe.as_str()) || SHELL_CLASSES.contains(&class.as_str())
}

/// True when a packaged window is a shell component rather than a Store
/// app the user installed.
fn is_shell_aumid(aumid: &str) -> bool {
    let lower = aumid.to_ascii_lowercase();
    SHELL_AUMID_PREFIXES
        .iter()
        .any(|prefix| lower.starts_with(prefix))
}

/// Packaged apps are all hosted by ApplicationFrameHost. Without an
/// AUMID there is nothing to identify or launch, so such a window is a
/// frame the shell is holding open rather than a running app.
fn is_orphan_app_frame(exe_path: &str, aumid: Option<&str>) -> bool {
    exe_basename(exe_path) == APP_FRAME_HOST && aumid.is_none()
}

/// The title of the settings window, the one window of ours that belongs in
/// the running apps. Kept in step with `open_settings`, which sets it.
pub const SETTINGS_TITLE: &str = "Aero Dock Settings";

/// Whether a window may be listed given whose it is: anything of another
/// process, and of ours only the settings window. Pure so it can be tested.
fn is_listable_own_window(is_ours: bool, title: &str) -> bool {
    !is_ours || title == SETTINGS_TITLE
}

/// Read a window's class name.
unsafe fn window_class(hwnd: HWND) -> String {
    unsafe {
        let mut buf = [0u16; 256];
        let n = GetClassNameW(hwnd, &mut buf);
        if n <= 0 {
            return String::new();
        }
        String::from_utf16_lossy(&buf[..n as usize])
    }
}

/// Alt-tab eligibility + metadata. Returns None for windows a dock
/// should not show (owned popups, tool windows, cloaked UWP shells,
/// untitled windows, and shell surfaces such as Windows Search).
unsafe fn probe_window(hwnd: HWND) -> Option<WindowInfo> {
    unsafe {
        if !IsWindow(Some(hwnd)).as_bool() || !IsWindowVisible(hwnd).as_bool() {
            return None;
        }
        if GetWindow(hwnd, GW_OWNER).is_ok_and(|o| !o.0.is_null()) {
            return None;
        }
        let ex = GetWindowLongPtrW(hwnd, GWL_EXSTYLE) as u32;
        if ex & WS_EX_TOOLWINDOW.0 != 0 {
            return None;
        }
        // cloaked = UWP window that is suspended/on another virtual desktop shell state
        let mut cloaked: u32 = 0;
        let _ = DwmGetWindowAttribute(
            hwnd,
            DWMWA_CLOAKED,
            &mut cloaked as *mut u32 as *mut _,
            std::mem::size_of::<u32>() as u32,
        );
        if cloaked != 0 {
            return None;
        }

        let len = GetWindowTextLengthW(hwnd);
        if len == 0 {
            return None;
        }
        let mut title_buf = vec![0u16; len as usize + 1];
        let read = GetWindowTextW(hwnd, &mut title_buf);
        let title = String::from_utf16_lossy(&title_buf[..read.max(0) as usize]);
        if title.trim().is_empty() {
            return None;
        }

        let mut pid: u32 = 0;
        GetWindowThreadProcessId(hwnd, Some(&mut pid));
        // Of our own windows only the settings window is an app the user
        // expects to see and switch back to. The dock, the menu bar and the
        // rest are the shell itself, so they are not listed whatever their
        // styles happen to be at the moment.
        if pid == 0 || !is_listable_own_window(pid == std::process::id(), &title) {
            return None;
        }
        let exe = process_path(pid)?;

        // Shell surfaces look like ordinary windows to every check above:
        // visible, titled, unowned, not cloaked. They have to be named.
        if is_shell_surface(&exe, &window_class(hwnd)) {
            return None;
        }

        // A packaged app is identified, and launched, by its AUMID. Those
        // hosted by ApplicationFrameHost carry it on the window; one that runs
        // in a process of its own (Terminal, the new Notepad, Teams, Outlook)
        // has it on the process. Without it the app was pinned by its exe,
        // which sits in a versioned WindowsApps folder that cannot be launched.
        let aumid = if exe_basename(&exe) == APP_FRAME_HOST {
            window_aumid(hwnd)
        } else {
            super::packaged::process_aumid(pid)
        };
        if is_orphan_app_frame(&exe, aumid.as_deref()) {
            return None;
        }
        if aumid.as_deref().is_some_and(is_shell_aumid) {
            return None;
        }

        Some(WindowInfo {
            hwnd: hwnd.0 as isize,
            title,
            exe,
            pid,
            aumid,
            // filled in when a snapshot is taken, which is always before
            // anyone sees it
            monitor: String::new(),
        })
    }
}

/// Read PKEY_AppUserModel_ID from a window's property store.
fn window_aumid(hwnd: HWND) -> Option<String> {
    use windows::core::GUID;
    use windows::Win32::Foundation::PROPERTYKEY;
    use windows::Win32::System::Com::StructuredStorage::PropVariantToStringAlloc;
    use windows::Win32::UI::Shell::PropertiesSystem::{IPropertyStore, SHGetPropertyStoreForWindow};

    const PKEY_APPUSERMODEL_ID: PROPERTYKEY = PROPERTYKEY {
        fmtid: GUID::from_u128(0x9F4C2855_9F79_4B39_A8D0_E1D42DE1D5F3),
        pid: 5,
    };

    unsafe {
        let store: IPropertyStore = SHGetPropertyStoreForWindow(hwnd).ok()?;
        let value = store.GetValue(&PKEY_APPUSERMODEL_ID).ok()?;
        let pw = PropVariantToStringAlloc(&value).ok()?;
        if pw.is_null() {
            return None;
        }
        let s = pw.to_string().ok()?;
        windows::Win32::System::Com::CoTaskMemFree(Some(pw.as_ptr() as *const _));
        if s.is_empty() {
            None
        } else {
            Some(s)
        }
    }
}

fn process_path(pid: u32) -> Option<String> {
    unsafe {
        let handle = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, false, pid).ok()?;
        let mut buf = [0u16; 1024];
        let mut len = buf.len() as u32;
        let ok = QueryFullProcessImageNameW(handle, PROCESS_NAME_WIN32,
            windows::core::PWSTR(buf.as_mut_ptr()), &mut len);
        let _ = windows::Win32::Foundation::CloseHandle(handle);
        ok.ok()?;
        Some(String::from_utf16_lossy(&buf[..len as usize]))
    }
}

// ---------------------------------------------------------------------
// window actions
// ---------------------------------------------------------------------

/// Bring a window to the foreground, restoring it if minimized.
/// Uses the Alt-key trick so it works from a NOACTIVATE dock window.
pub fn activate_window(hwnd: isize) {
    use windows::Win32::UI::Input::KeyboardAndMouse::{
        keybd_event, KEYBD_EVENT_FLAGS, KEYEVENTF_KEYUP, VK_MENU,
    };
    use windows::Win32::UI::WindowsAndMessaging::{
        IsIconic, SetForegroundWindow, ShowWindow, SW_RESTORE,
    };
    unsafe {
        let h = HWND(hwnd as *mut _);
        if !IsWindow(Some(h)).as_bool() {
            return;
        }
        if IsIconic(h).as_bool() {
            let _ = ShowWindow(h, SW_RESTORE);
        }
        // Windows only lets the foreground process reassign foreground;
        // a synthetic Alt press makes the shell treat us as eligible.
        keybd_event(VK_MENU.0 as u8, 0, KEYBD_EVENT_FLAGS(0), 0);
        let _ = SetForegroundWindow(h);
        keybd_event(VK_MENU.0 as u8, 0, KEYEVENTF_KEYUP, 0);
    }
}

/// Taskbar-style click: a minimized window is restored, the window that
/// currently has the foreground is minimized, and any other window is
/// brought forward. Decided from live window state rather than the cached
/// focus snapshot, which goes stale (for instance after the last window is
/// minimized, nothing else takes focus to update it).
pub fn toggle_window(hwnd: isize, into_icon: Option<(super::genie::Area, super::genie::Effect)>) {
    use windows::Win32::UI::WindowsAndMessaging::{
        GetAncestor, GetForegroundWindow, IsIconic, GA_ROOTOWNER,
    };
    let is_foreground = unsafe {
        let h = HWND(hwnd as *mut _);
        if !IsWindow(Some(h)).as_bool() {
            return;
        }
        // Pressing the dock can make the dock itself the foreground
        // window, so when it is, "in front" means whichever other window
        // was in front just before, which the shell hook tracks.
        let mut front = GetForegroundWindow();
        if front.0.is_null() || is_own_window(front) {
            let tracked = with_state(|s| s.focused).unwrap_or(0);
            front = HWND(tracked as *mut _);
        }
        !IsIconic(h).as_bool()
            && !front.0.is_null()
            && (front == h || GetAncestor(front, GA_ROOTOWNER) == GetAncestor(h, GA_ROOTOWNER))
    };
    // With an icon to pour into (or out of) the window goes the long way; if the
    // effect cannot take the job it is done plainly, as before.
    if is_foreground {
        if into_icon.is_some_and(|(at, effect)| super::genie::minimize(hwnd, at, effect)) {
            return;
        }
        minimize_window(hwnd);
    } else {
        if into_icon.is_some_and(|(at, effect)| super::genie::restore(hwnd, at, effect)) {
            return;
        }
        activate_window(hwnd);
    }
}

pub fn minimize_window(hwnd: isize) {
    use windows::Win32::UI::WindowsAndMessaging::{ShowWindow, SW_MINIMIZE};
    unsafe {
        let h = HWND(hwnd as *mut _);
        if IsWindow(Some(h)).as_bool() {
            let _ = ShowWindow(h, SW_MINIMIZE);
        }
    }
}

/// Bring a minimised window back without taking the focus. Does nothing to a
/// window that is not minimised.
pub fn restore_window(hwnd: isize) {
    use windows::Win32::UI::WindowsAndMessaging::{IsIconic, ShowWindow, SW_SHOWNOACTIVATE};
    unsafe {
        let h = HWND(hwnd as *mut _);
        if IsWindow(Some(h)).as_bool() && IsIconic(h).as_bool() {
            let _ = ShowWindow(h, SW_SHOWNOACTIVATE);
        }
    }
}

pub fn close_window(hwnd: isize) {
    use windows::Win32::UI::WindowsAndMessaging::{PostMessageW, WM_CLOSE};
    unsafe {
        let h = HWND(hwnd as *mut _);
        if IsWindow(Some(h)).as_bool() {
            let _ = PostMessageW(Some(h), WM_CLOSE, WPARAM(0), LPARAM(0));
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_flash_notice_is_the_redraw_notice_with_the_high_bit() {
        // winuser.h: HSHELL_FLASH is (HSHELL_REDRAW|HSHELL_HIGHBIT), 0x8006
        assert_eq!(HSHELL_FLASH, 0x8006);
        assert_ne!(HSHELL_FLASH, HSHELL_REDRAW);
    }

    #[test]
    fn idle_means_a_long_gap_since_the_last_input() {
        let t = IDLE_AFTER_MS;
        assert!(!is_idle(10_000, 9_000));
        assert!(!is_idle(t + 9_999, 10_000)); // a millisecond short
        assert!(is_idle(t + 10_000, 10_000)); // exactly the threshold
        assert!(is_idle(t * 3, 1_000));
    }

    #[test]
    fn idle_survives_the_tick_count_wrapping() {
        // the counter rolled over 1s ago, and the last input was 1ms short
        // of the threshold before that (so exactly the threshold in all)
        let last = u32::MAX - (IDLE_AFTER_MS - 1_001);
        assert!(is_idle(1_000, last));
        // and an input one millisecond more recent is not yet that long ago
        assert!(!is_idle(1_000, last.wrapping_add(1)));
    }

    #[test]
    fn an_unchanged_snapshot_compares_equal_so_it_is_not_sent_again() {
        let window = |hwnd: isize, title: &str| WindowInfo {
            hwnd,
            title: title.into(),
            exe: r"C:\a.exe".into(),
            pid: 7,
            aumid: None,
            monitor: r"\\.\DISPLAY1".into(),
        };
        let a = RunningSnapshot { windows: vec![window(1, "one")], focused: 1 };
        let same = RunningSnapshot { windows: vec![window(1, "one")], focused: 1 };
        let retitled = RunningSnapshot { windows: vec![window(1, "two")], focused: 1 };
        let refocused = RunningSnapshot { windows: vec![window(1, "one")], focused: 0 };
        assert_eq!(a, same);
        assert_ne!(a, retitled);
        assert_ne!(a, refocused);
    }

    #[test]
    fn only_the_settings_window_of_our_own_is_listed() {
        assert!(is_listable_own_window(true, SETTINGS_TITLE));
        assert!(!is_listable_own_window(true, "Aero Dock"));
        assert!(!is_listable_own_window(true, "Aero Dock menu bar"));
        // other programs are untouched, even one with a similar title
        assert!(is_listable_own_window(false, "Aero Dock"));
    }

    #[test]
    fn basename_is_lowercased_and_stripped() {
        assert_eq!(exe_basename(r"C:\Windows\Explorer.EXE"), "explorer.exe");
        assert_eq!(exe_basename("notepad.exe"), "notepad.exe");
    }

    #[test]
    fn windows_search_is_filtered_out() {
        let search = r"C:\Windows\SystemApps\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\SearchHost.exe";
        assert!(is_shell_surface(search, "Windows.UI.Core.CoreWindow"));
        // and even if the class changes, the executable still catches it
        assert!(is_shell_surface(search, "SomethingElse"));
    }

    #[test]
    fn start_menu_and_input_host_are_filtered_out() {
        assert!(is_shell_surface(r"C:\W\StartMenuExperienceHost.exe", "X"));
        assert!(is_shell_surface(r"C:\W\TextInputHost.exe", "X"));
    }

    #[test]
    fn desktop_and_tray_classes_are_filtered_out() {
        assert!(is_shell_surface(r"C:\Windows\explorer.exe", "Progman"));
        assert!(is_shell_surface(r"C:\Windows\explorer.exe", "Shell_TrayWnd"));
    }

    #[test]
    fn ordinary_apps_survive() {
        assert!(!is_shell_surface(r"C:\Windows\explorer.exe", "CabinetWClass"));
        assert!(!is_shell_surface(r"C:\Program Files\Notepad++\notepad++.exe", "Notepad++"));
        assert!(!is_shell_surface(r"C:\Users\x\AppData\Local\Programs\Code\Code.exe", "Chrome_WidgetWin_1"));
    }

    #[test]
    fn shell_packages_are_filtered_but_store_apps_are_not() {
        assert!(is_shell_aumid("Microsoft.Windows.Search_cw5n1h2txyewy!App"));
        assert!(is_shell_aumid("MicrosoftWindows.Client.CBS_cw5n1h2txyewy!InputApp"));
        assert!(!is_shell_aumid("Microsoft.WindowsCalculator_8wekyb3d8bbwe!App"));
        assert!(!is_shell_aumid("SpotifyAB.SpotifyMusic_zpdnekdrzrea0!Spotify"));
    }

    #[test]
    fn app_frames_without_an_aumid_are_dropped() {
        let host = r"C:\Windows\System32\ApplicationFrameHost.exe";
        assert!(is_orphan_app_frame(host, None));
        assert!(!is_orphan_app_frame(host, Some("Microsoft.WindowsCalculator_8wekyb3d8bbwe!App")));
        // a normal app with no AUMID is not an orphan frame
        assert!(!is_orphan_app_frame(r"C:\Windows\explorer.exe", None));
    }
}
