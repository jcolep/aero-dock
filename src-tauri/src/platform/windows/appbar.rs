//! Appbar registration: the way the stock taskbar keeps maximised windows
//! from running underneath it.
//!
//! The dock is a plain always-on-top window, so by itself the shell has no
//! idea it is there and a maximised window fills the whole screen behind it.
//! Registering the dock window as an appbar and claiming a strip of the
//! monitor edge makes the shell shrink every monitor's work area by that
//! strip.
//!
//! Only the *visible* dock is reserved. The window itself is much taller
//! (tooltip band, magnification headroom, flyouts), and reserving all of it
//! would leave a dead gap above the dock.
//!
//! With a dock on several monitors, each dock window is its own appbar, so
//! the registrations are kept per window.
//!
//! The shell drops an appbar by itself when its window goes away, so a crash
//! cannot leave the screen permanently short. `release_all` is still called
//! on a normal quit.

//! # With the frame on
//!
//! The shell stacks appbars on one edge in the order they registered: each new
//! one goes inside the ones already there. The frame's margin has to sit
//! inside the menu bar and the dock, and if it were registered after them, any
//! later change to the bar or dock (a taller bar, a bigger dock) would query
//! the shell, find the frame's strip in the way and put itself inside it. So on
//! a monitor with the frame on, the bar and dock register nothing. They each
//! record a *claim* (how far in from the screen edge their strip reaches) and
//! the frame registers one strip per edge, thick enough to cover every claim
//! and the margin besides. Nothing is queried, so there is no order to get
//! wrong. See `commands/frame.rs`.

use std::sync::OnceLock;

use parking_lot::Mutex;
use windows::Win32::Foundation::{HWND, RECT};
use windows::Win32::UI::Shell::{
    SHAppBarMessage, ABE_BOTTOM, ABE_LEFT, ABE_RIGHT, ABE_TOP, ABM_NEW, ABM_QUERYPOS, ABM_REMOVE,
    ABM_SETPOS, APPBARDATA,
};
use windows::Win32::UI::WindowsAndMessaging::WM_APP;

use super::monitors::Rect;
use crate::core::settings::DockEdge;

/// Callback message the shell would post for appbar notifications. Nothing
/// listens for it, which is harmless: the reservation is recomputed whenever
/// the dock repositions, including on display changes.
const APPBAR_CALLBACK: u32 = WM_APP + 0x31;

struct Registration {
    hwnd: isize,
    edge: DockEdge,
    /// The strip currently claimed from the shell. Repeat calls that come
    /// out the same (every resize repositions the dock) leave it alone,
    /// because each claim makes the shell re-lay-out every maximised window.
    granted: RECT,
}

/// One entry per dock window that currently holds a strip.
static STATE: Mutex<Vec<Registration>> = Mutex::new(Vec::new());

/// Who is asking for a strip.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Owner {
    MenuBar,
    Dock,
    /// One of the frame's own strips; never turned into a claim.
    Frame,
}

/// How far in from its monitor's edge a bar or dock's strip reaches, which
/// the frame's strip on that edge has to cover. Kept only for monitors the
/// frame is on for.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct Claim {
    hwnd: isize,
    /// The monitor's top-left corner, which names it.
    monitor: (i32, i32),
    edge: DockEdge,
    inner: i32,
}

static CLAIMS: Mutex<Vec<Claim>> = Mutex::new(Vec::new());

/// Monitors (by top-left corner) the frame is registering for.
static FRAME_MONITORS: Mutex<Vec<(i32, i32)>> = Mutex::new(Vec::new());

/// Called when a claim appears, moves or goes, so the frame can re-lay-out.
static CLAIMS_HOOK: OnceLock<Box<dyn Fn() + Send + Sync>> = OnceLock::new();

pub fn set_claims_hook(hook: impl Fn() + Send + Sync + 'static) {
    let _ = CLAIMS_HOOK.set(Box::new(hook));
}

fn claims_changed() {
    if let Some(hook) = CLAIMS_HOOK.get() {
        hook();
    }
}

/// Which monitors the frame is on for. Replaces the list.
pub fn set_frame_monitors(origins: Vec<(i32, i32)>) {
    *FRAME_MONITORS.lock() = origins;
}

/// Whether the frame is on for the monitor with this top-left corner.
pub fn frame_active(origin: (i32, i32)) -> bool {
    FRAME_MONITORS.lock().contains(&origin)
}

/// The furthest in any bar or dock claim reaches on one edge of a monitor, or
/// 0 when nothing claims it.
pub fn claimed(origin: (i32, i32), edge: DockEdge) -> i32 {
    CLAIMS
        .lock()
        .iter()
        .filter(|c| c.monitor == origin && c.edge == edge)
        .map(|c| c.inner)
        .max()
        .unwrap_or(0)
}

/// How far in from the screen edge a strip reaches, for a rectangle along
/// `edge` of `monitor`.
fn inner_extent(edge: DockEdge, monitor: &Rect, strip: &Rect) -> i32 {
    match edge {
        DockEdge::Top => strip.y + strip.height - monitor.y,
        DockEdge::Bottom => monitor.y + monitor.height - strip.y,
        DockEdge::Left => strip.x + strip.width - monitor.x,
        DockEdge::Right => monitor.x + monitor.width - strip.x,
    }
}

/// `strip` moved `by` pixels further in from `edge`.
fn shifted_in(edge: DockEdge, strip: Rect, by: i32) -> Rect {
    match edge {
        DockEdge::Top => Rect { y: strip.y + by, ..strip },
        DockEdge::Bottom => Rect { y: strip.y - by, ..strip },
        DockEdge::Left => Rect { x: strip.x + by, ..strip },
        DockEdge::Right => Rect { x: strip.x - by, ..strip },
    }
}

fn abe(edge: DockEdge) -> u32 {
    match edge {
        DockEdge::Top => ABE_TOP,
        DockEdge::Bottom => ABE_BOTTOM,
        DockEdge::Left => ABE_LEFT,
        DockEdge::Right => ABE_RIGHT,
    }
}

fn to_rect(r: RECT) -> Rect {
    Rect {
        x: r.left,
        y: r.top,
        width: r.right - r.left,
        height: r.bottom - r.top,
    }
}

fn data(hwnd: HWND, edge: DockEdge, rc: RECT) -> APPBARDATA {
    APPBARDATA {
        cbSize: std::mem::size_of::<APPBARDATA>() as u32,
        hWnd: hwnd,
        uCallbackMessage: APPBAR_CALLBACK,
        uEdge: abe(edge),
        rc,
        ..Default::default()
    }
}

/// Claim `thickness` physical pixels along `edge` of `bounds` (the full
/// monitor rectangle) and return the strip claimed.
///
/// Normally the shell is asked where the strip may go, and it steps around
/// any other appbar on the same edge (the Windows taskbar, say). With
/// `ignore_others` the strip goes exactly on the monitor edge and nothing is
/// asked. Use that when the taskbar is being kept hidden: an auto-hidden
/// taskbar still reveals itself for a moment when the pointer touches the
/// screen edge, and if the dock repositions in that moment it would be
/// parked above the taskbar and stay there.
///
/// `monitor` is the whole monitor, which `bounds` may be a part of (a dock at
/// the top starts below the menu bar). It is what a claim is measured from.
pub fn reserve(
    hwnd: HWND,
    edge: DockEdge,
    bounds: Rect,
    thickness: i32,
    ignore_others: bool,
    owner: Owner,
    monitor: Rect,
) -> Rect {
    let mut want = RECT {
        left: bounds.x,
        top: bounds.y,
        right: bounds.x + bounds.width,
        bottom: bounds.y + bounds.height,
    };
    match edge {
        DockEdge::Top => want.bottom = want.top + thickness,
        DockEdge::Bottom => want.top = want.bottom - thickness,
        DockEdge::Left => want.right = want.left + thickness,
        DockEdge::Right => want.left = want.right - thickness,
    }

    let key = hwnd.0 as isize;

    // With the frame on for this monitor the strip is not registered: the
    // frame covers it. Say how far in it reaches, and where it goes.
    let origin = (monitor.x, monitor.y);
    if owner != Owner::Frame && frame_active(origin) {
        // anything this window registered before the frame came on goes
        remove_registration(hwnd);
        let mut strip = to_rect(want);
        if !ignore_others {
            // a visible Windows taskbar on this edge is outside the strip
            strip = shifted_in(edge, strip, super::taskbar::visible_thickness(&monitor, edge));
        }
        let claim = Claim {
            hwnd: key,
            monitor: origin,
            edge,
            inner: inner_extent(edge, &monitor, &strip),
        };
        let changed = {
            let mut claims = CLAIMS.lock();
            match claims.iter().position(|c| c.hwnd == key) {
                Some(i) if claims[i] == claim => false,
                Some(i) => {
                    claims[i] = claim;
                    true
                }
                None => {
                    claims.push(claim);
                    true
                }
            }
        };
        if changed {
            claims_changed();
        }
        return strip;
    }
    // Not in frame mode (or this is the frame's own strip): any claim this
    // window held is dropped, and the strip is registered as ever.
    if owner != Owner::Frame {
        drop_claim(key);
    }
    crate::trace!("appbar: reserve {edge:?} {thickness}px for {key:#x}");
    // The lock is only held to read and write the table, never across a
    // shell call: the shell sends messages to our windows while it works, and
    // a thread waiting here for the lock could not answer them.
    let held = STATE
        .lock()
        .iter()
        .find(|reg| reg.hwnd == key)
        .map(|reg| (reg.edge, reg.granted));
    if held.is_none() {
        crate::trace!("appbar: ABM_NEW");
        let mut abd = data(hwnd, edge, want);
        unsafe {
            SHAppBarMessage(ABM_NEW, &mut abd);
        }
    }

    // Ask where the strip may go, then pin the thickness back, because the
    // shell trims the rectangle on the side that collides with another bar.
    // This is only a question, so it is cheap and is repeated every time
    // rather than trusting an earlier answer that may have gone stale.
    let mut granted = want;
    if !ignore_others {
        crate::trace!("appbar: ABM_QUERYPOS");
        let mut abd = data(hwnd, edge, want);
        unsafe {
            SHAppBarMessage(ABM_QUERYPOS, &mut abd);
        }
        granted = abd.rc;
        match edge {
            DockEdge::Top => granted.bottom = granted.top + thickness,
            DockEdge::Bottom => granted.top = granted.bottom - thickness,
            DockEdge::Left => granted.right = granted.left + thickness,
            DockEdge::Right => granted.left = granted.right - thickness,
        }
    }

    let unchanged = held.is_some_and(|(held_edge, held_rc)| {
        held_edge == edge
            && held_rc.left == granted.left
            && held_rc.top == granted.top
            && held_rc.right == granted.right
            && held_rc.bottom == granted.bottom
    });
    if !unchanged {
        crate::trace!("appbar: ABM_SETPOS");
        let mut abd = data(hwnd, edge, granted);
        unsafe {
            SHAppBarMessage(ABM_SETPOS, &mut abd);
        }
        crate::trace!("appbar: ABM_SETPOS returned");
        let registration = Registration {
            hwnd: key,
            edge,
            granted,
        };
        let mut state = STATE.lock();
        match state.iter().position(|reg| reg.hwnd == key) {
            Some(i) => state[i] = registration,
            None => state.push(registration),
        }
    }
    to_rect(granted)
}

/// Make the next `reserve` of every dock claim its strip again even if it
/// comes out the same, so the shell re-lays-out the work area. The
/// registrations stay.
pub fn forget() {
    for reg in STATE.lock().iter_mut() {
        reg.granted = RECT::default();
    }
}

/// How far in from the screen edge the frame's own strip on `edge` has to
/// start its margin: past the furthest bar or dock claim there, and past a
/// visible Windows taskbar. `taskbar_hidden` says the taskbar is kept away, so
/// that a momentary reveal under the pointer is not counted.
pub fn base_extent(monitor: &Rect, edge: DockEdge, taskbar_hidden: bool) -> i32 {
    let claimed = claimed((monitor.x, monitor.y), edge);
    let taskbar = if taskbar_hidden {
        0
    } else {
        super::taskbar::visible_thickness(monitor, edge)
    };
    claimed.max(taskbar)
}

/// Forget a window's claim, telling the frame if there was one.
fn drop_claim(key: isize) {
    let removed = {
        let mut claims = CLAIMS.lock();
        let before = claims.len();
        claims.retain(|c| c.hwnd != key);
        claims.len() != before
    };
    if removed {
        claims_changed();
    }
}

/// Take back a registration with the shell, if the window holds one.
fn remove_registration(hwnd: HWND) {
    let key = hwnd.0 as isize;
    let reg = {
        let mut state = STATE.lock();
        let Some(i) = state.iter().position(|reg| reg.hwnd == key) else {
            return;
        };
        state.remove(i)
    };
    let mut abd = data(HWND(reg.hwnd as *mut _), reg.edge, reg.granted);
    unsafe {
        SHAppBarMessage(ABM_REMOVE, &mut abd);
    }
}

/// Give back the screen space one dock window holds, and any claim it made.
/// Safe to call for a window that holds none.
pub fn release_window(hwnd: HWND) {
    drop_claim(hwnd.0 as isize);
    remove_registration(hwnd);
}

/// Give back all the screen space every dock holds.
pub fn release_all() {
    CLAIMS.lock().clear();
    let all: Vec<Registration> = STATE.lock().drain(..).collect();
    for reg in all {
        let mut abd = data(HWND(reg.hwnd as *mut _), reg.edge, reg.granted);
        unsafe {
            SHAppBarMessage(ABM_REMOVE, &mut abd);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const MONITOR: Rect = Rect { x: 1920, y: -165, width: 2560, height: 1440 };

    #[test]
    fn a_strip_reaches_in_from_each_edge_by_its_far_side() {
        // a 28px strip on each edge of the monitor
        let top = Rect { x: 1920, y: -165, width: 2560, height: 28 };
        let bottom = Rect { x: 1920, y: 1247, width: 2560, height: 28 };
        let left = Rect { x: 1920, y: -165, width: 28, height: 1440 };
        let right = Rect { x: 4452, y: -165, width: 28, height: 1440 };
        assert_eq!(inner_extent(DockEdge::Top, &MONITOR, &top), 28);
        assert_eq!(inner_extent(DockEdge::Bottom, &MONITOR, &bottom), 28);
        assert_eq!(inner_extent(DockEdge::Left, &MONITOR, &left), 28);
        assert_eq!(inner_extent(DockEdge::Right, &MONITOR, &right), 28);
        // a dock that starts below a 24px menu bar reaches 24 + its own depth
        let below_bar = Rect { x: 1920, y: -141, width: 2560, height: 60 };
        assert_eq!(inner_extent(DockEdge::Top, &MONITOR, &below_bar), 84);
    }

    #[test]
    fn a_strip_is_pushed_in_from_the_edge_it_lies_along() {
        let strip = Rect { x: 0, y: 0, width: 100, height: 20 };
        assert_eq!(shifted_in(DockEdge::Top, strip, 10).y, 10);
        assert_eq!(shifted_in(DockEdge::Bottom, strip, 10).y, -10);
        assert_eq!(shifted_in(DockEdge::Left, strip, 10).x, 10);
        assert_eq!(shifted_in(DockEdge::Right, strip, 10).x, -10);
        // nothing else about it changes
        let moved = shifted_in(DockEdge::Top, strip, 10);
        assert_eq!((moved.x, moved.width, moved.height), (0, 100, 20));
    }
}
