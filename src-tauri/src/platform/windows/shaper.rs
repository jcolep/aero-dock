//! Noticing which maximised app fills each opening of the frame, so that its square corners can be covered.
//!
//! With the frame on, a maximised window fills exactly the opening in the frame's margin, and its own corners are
//! square. They are not altered: the frame's corner window (see `commands/frame.rs`) lies over them, a piece of the
//! margin's own colour in each corner, shaped by the opening's rounded edge and anti-aliased along it, so the app
//! looks to have rounded corners and is behind the frame there. Nothing is done to the app's window at all, which is
//! why it works for every app (an elevated one, one that manages its own window shape, one that is not responding),
//! and why it costs nothing while nothing changes.
//!
//! This worker only looks. Whenever a window moves or changes state (heard through a WinEvent hook), or every so
//! often in case one was missed, it looks at the maximised windows, and for each monitor says whether the one on top
//! fills the opening. It says so a moment after the window has arrived (Windows takes about that long to grow a
//! window to fill the screen, drawing it from a scaled picture with square corners, and a corner piece shown at once
//! would be on its own in the empty space), and takes it back the moment it goes.

use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::{channel, Sender};
use std::sync::OnceLock;
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use windows::core::BOOL;
use windows::Win32::Foundation::{HWND, LPARAM, RECT};
use windows::Win32::Graphics::Dwm::{DwmGetWindowAttribute, DWMWA_CLOAKED, DWMWA_EXTENDED_FRAME_BOUNDS};
use windows::Win32::Graphics::Gdi::{GetWindowRgnBox, SetWindowRgn};
use windows::Win32::UI::Accessibility::{SetWinEventHook, HWINEVENTHOOK};
use windows::Win32::UI::WindowsAndMessaging::{
    DispatchMessageW, EnumWindows, GetMessageW, GetWindowLongPtrW, GetWindowRect, GetWindowThreadProcessId,
    IsIconic, IsWindowVisible, IsZoomed, TranslateMessage, EVENT_OBJECT_LOCATIONCHANGE, GWL_EXSTYLE, MSG,
    OBJID_WINDOW, WINEVENT_OUTOFCONTEXT, WINEVENT_SKIPOWNPROCESS, WS_EX_TOOLWINDOW,
};

use super::monitors::Rect;

/// An opening in the frame on one monitor, in screen pixels.
#[derive(Debug, Clone, PartialEq)]
pub struct Opening {
    pub monitor: String,
    /// The whole monitor, to tell which one a window is on.
    pub screen: Rect,
    /// The opening itself: where a maximised window sits.
    pub rect: Rect,
    /// The radius the corners are to have.
    pub radius: i32,
}

/// How far a maximised window's visible edges may be from the opening's and still be the window that fills it, in
/// pixels. A program lays itself out for the work area it knew of when it was maximised, and one that has not been
/// told of a change since (the frame's margin was set after it, the bar was made taller) stands a few pixels off.
/// What matters is that it is the window that is meant to fill the opening, not that it does so exactly.
const NEAR: i32 = 24;

/// Whether a window's visible bounds are those of the window that fills the opening: its edges are near the
/// opening's.
pub fn fits(visible: &Rect, opening: &Rect) -> bool {
    let right = |r: &Rect| r.x + r.width;
    let bottom = |r: &Rect| r.y + r.height;
    (visible.x - opening.x).abs() <= NEAR
        && (visible.y - opening.y).abs() <= NEAR
        && (right(visible) - right(opening)).abs() <= NEAR
        && (bottom(visible) - bottom(opening)).abs() <= NEAR
}

fn centre(r: &Rect) -> (i32, i32) {
    (r.x + r.width / 2, r.y + r.height / 2)
}

fn contains(r: &Rect, p: (i32, i32)) -> bool {
    p.0 >= r.x && p.0 < r.x + r.width && p.1 >= r.y && p.1 < r.y + r.height
}

/// How long a window that fills the opening has been the one on top before its corners are covered. Windows takes
/// about this long to grow a window to fill the screen.
const COVER_DELAY: Duration = Duration::from_millis(330);

// ---- state ----

static ENABLED: AtomicBool = AtomicBool::new(false);
static STARTED: OnceLock<Sender<()>> = OnceLock::new();
static OPENINGS: Mutex<Vec<Opening>> = Mutex::new(Vec::new());
/// Per monitor: the bounds of the window whose corners are to be covered now, if there is one.
static COVER: Mutex<Vec<(String, Option<Rect>)>> = Mutex::new(Vec::new());
/// Per monitor: since when a window that fills the opening has been on top of it.
static ON_TOP_SINCE: Mutex<Vec<(String, Instant)>> = Mutex::new(Vec::new());
/// The windows that fill an opening now, so that one that stops (restored, closed) is looked at.
static FILLING: Mutex<Vec<isize>> = Mutex::new(Vec::new());
static CHANGED: OnceLock<Box<dyn Fn() + Send + Sync>> = OnceLock::new();

/// Called when a monitor starts or stops needing its corners covered.
pub fn set_changed_hook(hook: impl Fn() + Send + Sync + 'static) {
    let _ = CHANGED.set(Box::new(hook));
}

/// The visible bounds of the window whose corners are to be covered on a monitor right now: the maximised window on
/// top, once it has arrived, if it is the one that fills the opening.
pub fn cover_rect(monitor: &str) -> Option<Rect> {
    COVER.lock().iter().find(|(m, _)| m == monitor).and_then(|(_, r)| *r)
}

/// Set where the openings are. An empty list switches the looking off.
pub fn set_openings(openings: Vec<Opening>) {
    let empty = openings.is_empty();
    ENABLED.store(!empty, Ordering::Relaxed);
    let same = {
        let mut held = OPENINGS.lock();
        let same = *held == openings;
        *held = openings;
        same
    };
    if empty {
        let changed = {
            let mut c = COVER.lock();
            let any = c.iter().any(|(_, r)| r.is_some());
            c.clear();
            any
        };
        ON_TOP_SINCE.lock().clear();
        FILLING.lock().clear();
        if changed {
            if let Some(hook) = CHANGED.get() {
                hook();
            }
        }
    } else if !same {
        // the openings moved, so what was decided for the old ones may be wrong
        start();
        wake();
    }
}

fn wake() {
    if let Some(tx) = STARTED.get() {
        let _ = tx.send(());
    }
}

// ---- looking at windows ----

fn rect_of(r: RECT) -> Rect {
    r.into()
}

/// The bounds a window is drawn in (without its invisible borders).
fn visible_bounds(hwnd: HWND) -> Option<Rect> {
    let mut r = RECT::default();
    unsafe {
        DwmGetWindowAttribute(
            hwnd,
            DWMWA_EXTENDED_FRAME_BOUNDS,
            &mut r as *mut RECT as *mut _,
            std::mem::size_of::<RECT>() as u32,
        )
        .ok()?;
    }
    (r.right > r.left && r.bottom > r.top).then(|| rect_of(r))
}

/// Maximised, visible, ordinary windows of other programs, top of the stack
/// first.
fn maximised_windows() -> Vec<HWND> {
    unsafe extern "system" fn each(hwnd: HWND, lparam: LPARAM) -> BOOL {
        let out = unsafe { &mut *(lparam.0 as *mut Vec<HWND>) };
        unsafe {
            if !IsWindowVisible(hwnd).as_bool() || IsIconic(hwnd).as_bool() || !IsZoomed(hwnd).as_bool() {
                return true.into();
            }
            if GetWindowLongPtrW(hwnd, GWL_EXSTYLE) as u32 & WS_EX_TOOLWINDOW.0 != 0 {
                return true.into();
            }
            let mut cloaked = 0u32;
            let _ = DwmGetWindowAttribute(
                hwnd,
                DWMWA_CLOAKED,
                &mut cloaked as *mut u32 as *mut _,
                std::mem::size_of::<u32>() as u32,
            );
            if cloaked != 0 {
                return true.into();
            }
            let mut pid = 0u32;
            GetWindowThreadProcessId(hwnd, Some(&mut pid));
            if pid == std::process::id() {
                return true.into();
            }
        }
        out.push(hwnd);
        true.into()
    }
    let mut found: Vec<HWND> = Vec::new();
    unsafe {
        let _ = EnumWindows(Some(each), LPARAM(&mut found as *mut Vec<HWND> as isize));
    }
    found
}

/// One look at the screen. Returns how soon it wants another, if it does (a window has just arrived and its corners
/// are waiting to be covered).
fn tick() -> Option<Duration> {
    let openings = OPENINGS.lock().clone();
    if openings.is_empty() {
        return None;
    }
    // for each monitor, the bounds of the window on top of its maximised ones, if that is the one that fills the opening
    let mut top: HashMap<String, Option<Rect>> = HashMap::new();
    let mut filling: Vec<isize> = Vec::new();
    for hwnd in maximised_windows() {
        let Some(visible) = visible_bounds(hwnd) else { continue };
        let Some(opening) = openings.iter().find(|o| contains(&o.screen, centre(&visible))) else {
            continue;
        };
        let fills = opening.radius > 0 && fits(&visible, &opening.rect);
        if fills {
            filling.push(hwnd.0 as isize);
        }
        top.entry(opening.monitor.clone()).or_insert(fills.then_some(visible));
    }
    *FILLING.lock() = filling;

    let mut changed = false;
    let mut again: Option<Duration> = None;
    {
        let mut cover = COVER.lock();
        let mut since = ON_TOP_SINCE.lock();
        for opening in &openings {
            let on_top = top.get(&opening.monitor).copied().flatten();
            // it goes the moment the window goes, and comes only when the window has had time to arrive
            let want = if let Some(bounds) = on_top {
                let at = match since.iter().find(|(m, _)| *m == opening.monitor) {
                    Some((_, at)) => *at,
                    None => {
                        let now = Instant::now();
                        since.push((opening.monitor.clone(), now));
                        now
                    }
                };
                let waited = at.elapsed();
                if waited >= COVER_DELAY {
                    Some(bounds)
                } else {
                    let left = COVER_DELAY - waited + Duration::from_millis(8);
                    again = Some(again.map_or(left, |a| a.min(left)));
                    None
                }
            } else {
                since.retain(|(m, _)| *m != opening.monitor);
                None
            };
            match cover.iter_mut().find(|(m, _)| *m == opening.monitor) {
                Some((_, now)) if *now == want => {}
                Some((_, now)) => {
                    *now = want;
                    changed = true;
                }
                None => {
                    cover.push((opening.monitor.clone(), want));
                    changed |= want.is_some();
                }
            }
        }
    }
    if changed {
        if let Some(hook) = CHANGED.get() {
            hook();
        }
    }
    again
}

/// Earlier versions cut the corners of a maximised window with a window region, and a window they were stopped under
/// (a crash, the task ended) is left wearing it, clipped to a size it may no longer be. Take those off: a maximised
/// window of another program whose region is a rounded one nearly as large as the window is one of ours.
fn clear_old_regions() {
    unsafe extern "system" fn each(hwnd: HWND, _lparam: LPARAM) -> BOOL {
        unsafe {
            if !IsWindowVisible(hwnd).as_bool() || !IsZoomed(hwnd).as_bool() {
                return true.into();
            }
            let mut window = RECT::default();
            let mut region = RECT::default();
            // COMPLEXREGION (3) is what a window with a region of rounded corners reports; none at all is an error
            let kind = GetWindowRgnBox(hwnd, &mut region);
            if kind.0 == 3
                && GetWindowRect(hwnd, &mut window).is_ok()
                && region.right - region.left >= (window.right - window.left) * 9 / 10
                && region.bottom - region.top >= (window.bottom - window.top) * 9 / 10
            {
                let _ = SetWindowRgn(hwnd, None, false);
            }
        }
        true.into()
    }
    unsafe {
        let _ = EnumWindows(Some(each), LPARAM(0));
    }
}

// ---- the worker ----

unsafe extern "system" fn on_event(
    _hook: HWINEVENTHOOK,
    _event: u32,
    hwnd: HWND,
    id_object: i32,
    id_child: i32,
    _thread: u32,
    _time: u32,
) {
    // only a window itself moving or resizing, and only ones that matter: a maximised one (that may now fill an
    // opening) or one that did (that may have stopped)
    if id_object != OBJID_WINDOW.0 || id_child != 0 || hwnd.0.is_null() {
        return;
    }
    let key = hwnd.0 as isize;
    let interesting = unsafe { IsZoomed(hwnd).as_bool() } || FILLING.lock().contains(&key);
    if interesting {
        wake();
    }
}

/// Start the worker, once.
fn start() {
    if STARTED.get().is_some() {
        return;
    }
    let (tx, rx) = channel::<()>();
    if STARTED.set(tx).is_err() {
        return;
    }
    clear_old_regions();
    let worker = std::thread::Builder::new().name("frame-shaper".into()).spawn(move || {
        let mut sooner: Option<Duration> = None;
        let mut straight_on = false;
        loop {
            // woken by an event, or every so often in case one was missed (or a window has arrived and is due)
            if !straight_on {
                let _ = rx.recv_timeout(sooner.take().map_or(Duration::from_millis(400), |s| s.min(Duration::from_millis(400))));
            }
            straight_on = false;
            // The first event of a change is looked at at once, and what follows it in the next few milliseconds (one
            // change is a burst of events) is one more look at the end of it, not many.
            if ENABLED.load(Ordering::Relaxed) {
                sooner = tick();
            }
            std::thread::sleep(Duration::from_millis(12));
            while rx.try_recv().is_ok() {
                straight_on = true;
            }
        }
    });
    if let Err(e) = worker {
        log::warn!("could not start the window watcher: {e}");
        return;
    }
    // out-of-context hooks are delivered through the queue of the thread that
    // set them, so that thread has to pump one
    let hook = std::thread::Builder::new().name("frame-shaper-events".into()).spawn(|| unsafe {
        SetWinEventHook(
            EVENT_OBJECT_LOCATIONCHANGE,
            EVENT_OBJECT_LOCATIONCHANGE,
            None,
            Some(on_event),
            0,
            0,
            WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS,
        );
        let mut msg = MSG::default();
        while GetMessageW(&mut msg, None, 0, 0).as_bool() {
            let _ = TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
    });
    if let Err(e) = hook {
        log::warn!("could not listen for window changes: {e}");
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const OPENING: Rect = Rect { x: 1934, y: -117, width: 2532, height: 1346 };

    #[test]
    fn a_window_that_fills_the_opening_fits_it() {
        // a pixel or two off, as a maximised window is
        let almost = Rect { x: 1935, y: -116, width: 2530, height: 1345 };
        assert!(fits(&almost, &OPENING));
        assert!(fits(&OPENING, &OPENING));
        // a few pixels off, as one that was laid out for another work area stands (File Explorer, eight pixels
        // taller than the opening at the top)
        let stale = Rect { x: 1934, y: -125, width: 2532, height: 1354 };
        assert!(fits(&stale, &OPENING));
    }

    #[test]
    fn a_window_that_does_not_fill_it_does_not() {
        let small = Rect { x: 2100, y: 100, width: 900, height: 600 };
        assert!(!fits(&small, &OPENING));
        // one on a monitor with no frame, filling the whole screen
        let full = Rect { x: 1920, y: -165, width: 2560, height: 1440 };
        assert!(!fits(&full, &OPENING));
        // one snapped to half
        let half = Rect { x: 1934, y: -117, width: 1266, height: 1346 };
        assert!(!fits(&half, &OPENING));
    }

    #[test]
    fn a_point_is_on_the_monitor_that_contains_it() {
        let a = Rect { x: 0, y: 0, width: 1920, height: 1080 };
        assert!(contains(&a, (0, 0)) && contains(&a, (1919, 1079)));
        assert!(!contains(&a, (1920, 500)) && !contains(&a, (-1, 5)));
    }

    #[test]
    fn nothing_is_covered_where_nothing_is_known() {
        assert_eq!(cover_rect("no such monitor"), None);
    }
}
