//! Noticing which corners of each opening of the frame have an app's square corner in them, so they can be covered.
//!
//! With the frame on, a maximised window fills exactly the opening in the frame's margin, and a window snapped to a
//! side or a quarter fills part of it with one or two of its corners in the opening's corners. Those corners are
//! square. They are not altered: the frame's corner window (see `commands/frame.rs`) lies over them, a piece of the
//! margin in each corner, shaped by the opening's rounded edge and anti-aliased along it, so the app looks to have
//! rounded corners there and is behind the frame. Nothing is done to the app's window at all, which is why it works
//! for every app, and why it costs nothing while nothing changes.
//!
//! This worker only looks. Whenever a window moves, changes state or comes to the front (heard through WinEvent
//! hooks), or every so often in case one was missed, it looks at each corner of each opening: the window on top
//! there, if its own corner is in that corner of the opening (it is maximised, or snapped there), is to have it
//! covered. A corner is covered a moment after that has become so (`COVER_DELAY`: before Windows' animation brings
//! the window there, so it never shows its square corner), and uncovered the moment it is not.

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
    IsIconic, IsWindowVisible, IsZoomed, TranslateMessage, EVENT_OBJECT_LOCATIONCHANGE, EVENT_SYSTEM_FOREGROUND,
    GWL_EXSTYLE, MSG, OBJID_WINDOW, WINEVENT_OUTOFCONTEXT, WINEVENT_SKIPOWNPROCESS, WS_EX_TOOLWINDOW, WS_EX_TRANSPARENT,
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

/// The corners, as bits of a mask, in the order the frame's arrays use: top left, top right, bottom right, bottom left.
pub const CORNERS: [u8; 4] = [1, 2, 4, 8];

/// How far a maximised window's visible edges may be from the opening's and still be the window that fills it, in
/// pixels. What a window reports can be more than it draws (a program with the standard frame counts its resize
/// border at the top, which is not drawn), and one laid out for a work area it has not been told has changed stands
/// a few pixels off; what matters is that it is the window that fills the opening.
const NEAR: i32 = 24;

/// How far a window's corner may be from the opening's corner and still be snapped into it, in pixels.
const SNAPPED: i32 = 4;

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

/// Whether a window covers its whole monitor: a fullscreen video, game, slideshow or browser. It is over the frame,
/// not in it, so it holds no corner, though on a monitor with little claimed at its edges it would be near enough the
/// opening to pass for a maximised window. Decided for each window, so a video fullscreen on one monitor leaves the
/// other monitor's corners as they are (the shell's own "a fullscreen app is running" is one answer for every monitor,
/// and a screen-sized overlay also makes it say so).
pub fn fullscreen(visible: &Rect, screen: &Rect) -> bool {
    visible.x <= screen.x + 1
        && visible.y <= screen.y + 1
        && visible.x + visible.width >= screen.x + screen.width - 1
        && visible.y + visible.height >= screen.y + screen.height - 1
}

/// The point of each corner of a rectangle, a couple of pixels in, in the order of `CORNERS`.
fn corner_points(r: &Rect) -> [(i32, i32); 4] {
    let (l, t, rr, b) = (r.x + 2, r.y + 2, r.x + r.width - 3, r.y + r.height - 3);
    [(l, t), (rr, t), (rr, b), (l, b)]
}

/// Whether corner `i` of a window's rectangle is in the same corner of the opening.
pub fn corner_snapped(visible: &Rect, opening: &Rect, i: usize) -> bool {
    let (vr, vb, or, ob) = (visible.x + visible.width, visible.y + visible.height, opening.x + opening.width, opening.y + opening.height);
    let near = |a: i32, b: i32| (a - b).abs() <= SNAPPED;
    match i {
        0 => near(visible.x, opening.x) && near(visible.y, opening.y),
        1 => near(vr, or) && near(visible.y, opening.y),
        2 => near(vr, or) && near(vb, ob),
        _ => near(visible.x, opening.x) && near(vb, ob),
    }
}

pub(crate) fn contains(r: &Rect, p: (i32, i32)) -> bool {
    p.0 >= r.x && p.0 < r.x + r.width && p.1 >= r.y && p.1 < r.y + r.height
}

/// How long a corner has had a window's corner in it before it is covered: long enough to let a window that only
/// passes through (dragged across a corner) go by, and short enough that the piece is in place before Windows' own
/// animation brings the window there (measured on the owner's Dell: the window's square corner first shows about
/// 300 ms after it is maximised, and with 330 ms here it was seen for 80 to 100 ms each time). A piece that arrives
/// before the window does is not seen: over the empty corner it draws exactly what the ring already draws there.
const COVER_DELAY: Duration = Duration::from_millis(100);

// ---- state ----

static ENABLED: AtomicBool = AtomicBool::new(false);
static STARTED: OnceLock<Sender<()>> = OnceLock::new();
static OPENINGS: Mutex<Vec<Opening>> = Mutex::new(Vec::new());
/// Per monitor: which corners are to be covered now.
static COVER: Mutex<Vec<(String, u8)>> = Mutex::new(Vec::new());
/// Per monitor and corner: since when a window's corner has been in it.
static SINCE: Mutex<Vec<(String, usize, Instant)>> = Mutex::new(Vec::new());
static CHANGED: OnceLock<Box<dyn Fn() + Send + Sync>> = OnceLock::new();

/// Called when a monitor's covered corners change.
pub fn set_changed_hook(hook: impl Fn() + Send + Sync + 'static) {
    let _ = CHANGED.set(Box::new(hook));
}

/// Which corners of a monitor's opening are to be covered right now, as a mask of `CORNERS`.
pub fn cover_mask(monitor: &str) -> u8 {
    COVER.lock().iter().find(|(m, _)| m == monitor).map_or(0, |(_, mask)| *mask)
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
            let any = c.iter().any(|(_, mask)| *mask != 0);
            c.clear();
            any
        };
        SINCE.lock().clear();
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
pub(crate) fn visible_bounds(hwnd: HWND) -> Option<Rect> {
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

/// A window that can be on top of a corner: its visible bounds, and whether it is maximised.
struct Seen {
    visible: Rect,
    maximised: bool,
}

/// Visible, ordinary windows of other programs, top of the stack first: only those that could be the one on top at one
/// of `points`, and only until each point has its window.
///
/// This runs at every window that moves (sixty times a second while one is dragged), and asking the compositor about a
/// window (is it cloaked, where is it drawn) is the costly part. So a window is first ruled out by its plain rectangle,
/// which is cheap and never smaller than where it is drawn, and the walk stops once every point has the window on top
/// of it: everything further down the stack is under one.
fn windows_on_screen(points: &[(i32, i32)]) -> Vec<Seen> {
    struct Walk<'a> {
        points: &'a [(i32, i32)],
        covered: Vec<bool>,
        out: Vec<Seen>,
    }
    unsafe extern "system" fn each(hwnd: HWND, lparam: LPARAM) -> BOOL {
        let walk = unsafe { &mut *(lparam.0 as *mut Walk) };
        unsafe {
            if !IsWindowVisible(hwnd).as_bool() || IsIconic(hwnd).as_bool() {
                return true.into();
            }
            let mut outer = RECT::default();
            if GetWindowRect(hwnd, &mut outer).is_err() {
                return true.into();
            }
            let outer = rect_of(outer);
            let wanted = walk.points.iter().zip(&walk.covered).any(|(p, done)| !done && contains(&outer, *p));
            // a tool window (a palette, a tray flyout) is not an app's window, and a window the pointer goes through
            // is an overlay (a GPU's or a recorder's, a meeting's border round the screen, often the whole screen and
            // drawing nothing): neither is the window on top at a corner
            let ex = GetWindowLongPtrW(hwnd, GWL_EXSTYLE) as u32;
            if !wanted || ex & (WS_EX_TOOLWINDOW.0 | WS_EX_TRANSPARENT.0) != 0 {
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
            if let Some(visible) = visible_bounds(hwnd) {
                for (i, p) in walk.points.iter().enumerate() {
                    if contains(&visible, *p) {
                        walk.covered[i] = true;
                    }
                }
                walk.out.push(Seen { visible, maximised: IsZoomed(hwnd).as_bool() });
            }
        }
        // every point has its window: what is further down is beneath them
        (!walk.covered.iter().all(|c| *c)).into()
    }
    let mut walk = Walk { points, covered: vec![false; points.len()], out: Vec::new() };
    unsafe {
        let _ = EnumWindows(Some(each), LPARAM(&mut walk as *mut Walk as isize));
    }
    walk.out
}
/// Which corners of an opening have the corner of the window on top there in them, given the windows top first.
fn corners_held(opening: &Opening, windows: &[Seen]) -> u8 {
    if opening.radius <= 0 {
        return 0;
    }
    let mut mask = 0;
    for (i, point) in corner_points(&opening.rect).into_iter().enumerate() {
        // the window on top at that corner (the desktop, if nothing else, which does not hold it)
        let Some(top) = windows.iter().find(|w| contains(&w.visible, point)) else { continue };
        let held = if fullscreen(&top.visible, &opening.screen) {
            false
        } else if top.maximised {
            fits(&top.visible, &opening.rect)
        } else {
            corner_snapped(&top.visible, &opening.rect, i)
        };
        if held {
            mask |= CORNERS[i];
        }
    }
    mask
}

/// One look at the screen. Returns how soon it wants another, if it does (a corner is waiting to be covered).
fn tick() -> Option<Duration> {
    let openings = OPENINGS.lock().clone();
    if openings.is_empty() {
        return None;
    }
    let points: Vec<(i32, i32)> = openings.iter().filter(|o| o.radius > 0).flat_map(|o| corner_points(&o.rect)).collect();
    let windows = windows_on_screen(&points);
    let mut changed = false;
    let mut again: Option<Duration> = None;
    {
        let mut cover = COVER.lock();
        let mut since = SINCE.lock();
        for opening in &openings {
            let held = corners_held(opening, &windows);
            // a corner comes when it has been held a moment, and goes the moment it is not
            let mut want = 0u8;
            for (i, bit) in CORNERS.into_iter().enumerate() {
                if held & bit == 0 {
                    since.retain(|(m, c, _)| !(*m == opening.monitor && *c == i));
                    continue;
                }
                let at = match since.iter().find(|(m, c, _)| *m == opening.monitor && *c == i) {
                    Some((_, _, at)) => *at,
                    None => {
                        let now = Instant::now();
                        since.push((opening.monitor.clone(), i, now));
                        now
                    }
                };
                let waited = at.elapsed();
                if waited >= COVER_DELAY {
                    want |= bit;
                } else {
                    let left = COVER_DELAY - waited + Duration::from_millis(8);
                    again = Some(again.map_or(left, |a| a.min(left)));
                }
            }
            match cover.iter_mut().find(|(m, _)| *m == opening.monitor) {
                Some((_, now)) if *now == want => {}
                Some((_, now)) => {
                    *now = want;
                    changed = true;
                }
                None => {
                    cover.push((opening.monitor.clone(), want));
                    changed |= want != 0;
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
    // a window itself (not a caret or a scroll bar in it) moving, changing state, or coming to the front: any of them
    // can change what is on top at a corner
    if id_object != OBJID_WINDOW.0 || id_child != 0 || hwnd.0.is_null() {
        return;
    }
    wake();
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
            // woken by an event, or every so often in case one was missed (or a corner is due)
            if !straight_on {
                let _ = rx.recv_timeout(sooner.take().map_or(Duration::from_millis(400), |s| s.min(Duration::from_millis(400))));
            }
            straight_on = false;
            // The first event of a change is looked at at once, and what follows it in the next few milliseconds (one
            // change is a burst of events) is one more look at the end of it, not many.
            if ENABLED.load(Ordering::Relaxed) {
                sooner = tick();
            }
            std::thread::sleep(Duration::from_millis(16));
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
        for event in [EVENT_OBJECT_LOCATIONCHANGE, EVENT_SYSTEM_FOREGROUND] {
            SetWinEventHook(event, event, None, Some(on_event), 0, 0, WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS);
        }
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

    fn opening() -> Opening {
        Opening { monitor: "m".into(), screen: Rect { x: 1920, y: -165, width: 2560, height: 1440 }, rect: OPENING, radius: 18 }
    }

    #[test]
    fn a_window_that_fills_the_opening_fits_it() {
        // a pixel or two off, as a maximised window is
        let almost = Rect { x: 1935, y: -116, width: 2530, height: 1345 };
        assert!(fits(&almost, &OPENING));
        assert!(fits(&OPENING, &OPENING));
        // File Explorer: eight pixels more at the top, its undrawn resize border
        let explorer = Rect { x: 1934, y: -125, width: 2532, height: 1354 };
        assert!(fits(&explorer, &OPENING));
    }

    #[test]
    fn a_window_that_does_not_fill_it_does_not() {
        let small = Rect { x: 2100, y: 100, width: 900, height: 600 };
        assert!(!fits(&small, &OPENING));
        let full = Rect { x: 1920, y: -165, width: 2560, height: 1440 };
        assert!(!fits(&full, &OPENING));
    }

    #[test]
    fn a_maximised_window_holds_all_four_corners() {
        let w = [Seen { visible: OPENING, maximised: true }];
        assert_eq!(corners_held(&opening(), &w), 0b1111);
    }

    #[test]
    fn two_windows_snapped_side_by_side_hold_their_outer_corners() {
        let half = OPENING.width / 2;
        let left = Seen { visible: Rect { x: OPENING.x, y: OPENING.y, width: half, height: OPENING.height }, maximised: false };
        let right = Seen { visible: Rect { x: OPENING.x + half, y: OPENING.y, width: OPENING.width - half, height: OPENING.height }, maximised: false };
        // the left one holds top left and bottom left, the right one top right and bottom right: all four, between them
        assert_eq!(corners_held(&opening(), &[left, right]), 0b1111);
        // with only the left one there, only its two
        let left_only = [Seen { visible: Rect { x: OPENING.x, y: OPENING.y, width: half, height: OPENING.height }, maximised: false }];
        assert_eq!(corners_held(&opening(), &left_only), CORNERS[0] | CORNERS[3]);
    }

    #[test]
    fn a_window_snapped_to_a_quarter_holds_one_corner() {
        let q = Seen { visible: Rect { x: OPENING.x + OPENING.width / 2, y: OPENING.y + OPENING.height / 2, width: OPENING.width / 2, height: OPENING.height / 2 }, maximised: false };
        assert_eq!(corners_held(&opening(), &[q]), CORNERS[2]);
    }

    #[test]
    fn a_window_over_a_corner_that_is_not_snapped_there_hides_what_is_under_it() {
        // a small window dragged over the top left corner, on top of a maximised one: that corner is not covered
        let floating = Seen { visible: Rect { x: OPENING.x - 30, y: OPENING.y - 20, width: 400, height: 300 }, maximised: false };
        let maximised = Seen { visible: OPENING, maximised: true };
        assert_eq!(corners_held(&opening(), &[floating, maximised]), 0b1110);
    }

    #[test]
    fn a_fullscreen_window_holds_no_corner_even_where_it_is_near_the_opening() {
        // a monitor with only the margin claimed: the opening is 10px in from every edge, so a fullscreen window's edges
        // are within reach of the opening's
        let screen = Rect { x: 1920, y: 0, width: 2560, height: 1440 };
        let opening = Opening { monitor: "m".into(), screen, rect: Rect { x: 1930, y: 10, width: 2540, height: 1420 }, radius: 10 };
        let video = Seen { visible: screen, maximised: true };
        assert!(fits(&video.visible, &opening.rect), "near enough to pass for maximised");
        assert_eq!(corners_held(&opening, &[video]), 0, "but it is over the frame, not in it");
        // and a maximised one there still holds them all
        let app = Seen { visible: opening.rect, maximised: true };
        assert_eq!(corners_held(&opening, &[app]), 0b1111);
    }

    #[test]
    fn nothing_is_covered_where_nothing_is_known() {
        assert_eq!(cover_mask("no such monitor"), 0);
    }
}
