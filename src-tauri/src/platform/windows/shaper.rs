//! Rounding the corners of maximised apps, by shaping their windows.
//!
//! With the frame on, a maximised window fills exactly the opening in the
//! frame's margin. Its own corners are square. This cuts them away with a
//! window region (`SetWindowRgn`), so that what shows through the cut corners
//! is the frame's glass, which is behind the app and already drawn there. No
//! copy of the glass is laid over the app, so there is nothing to match.
//!
//! A window region is stepped, a pixel is in or out, so a thin anti-aliased
//! fringe is laid over each arc by the frame's corner window (see
//! `commands/frame.rs`) to smooth it. The clip is made a pixel squarer than
//! the ideal curve, so the fringe, which is drawn along the ideal curve, always
//! covers whatever the clip leaves outside it.
//!
//! A worker thread keeps it right. Whenever a window moves or changes state
//! (heard through a WinEvent hook) or every so often, it looks at the
//! maximised windows, shapes those that fit an opening, and removes the shape
//! from any that no longer do (restored, moved to another monitor, closed
//! frame). Regions are always taken off again when the frame is switched off
//! and when Aero Dock quits: a window left with its region would stay clipped
//! to the old size.
//!
//! Windows that cannot be shaped (an elevated app, which an ordinary process
//! may not alter, or one that is not responding) are left alone and square, and
//! the fringe is not shown over them.

use std::collections::{HashMap, HashSet};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::{channel, Sender};
use std::sync::OnceLock;
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use windows::core::BOOL;
use windows::Win32::Foundation::{HWND, LPARAM, RECT};
use windows::Win32::Graphics::Dwm::{
    DwmGetWindowAttribute, DWMWA_CLOAKED, DWMWA_EXTENDED_FRAME_BOUNDS,
};
use windows::Win32::Graphics::Gdi::{
    CreateRectRgn, CreateRoundRectRgn, DeleteObject, GetWindowRgn, GetWindowRgnBox,
    PtInRegion, SetWindowRgn, HRGN,
};
use windows::Win32::UI::Accessibility::{SetWinEventHook, HWINEVENTHOOK};
use windows::Win32::UI::WindowsAndMessaging::{
    DispatchMessageW, EnumWindows, GetMessageW, GetWindowLongPtrW, GetWindowRect,
    GetWindowThreadProcessId, IsHungAppWindow, IsIconic, IsWindow, IsWindowVisible, IsZoomed,
    TranslateMessage, EVENT_OBJECT_LOCATIONCHANGE, GWL_EXSTYLE, MSG, OBJID_WINDOW,
    WINEVENT_OUTOFCONTEXT, WINEVENT_SKIPOWNPROCESS, WS_EX_TOOLWINDOW,
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

/// How far a window's visible edge may be from the opening's and still count
/// as filling it, in pixels.
const TOLERANCE: i32 = 3;

/// Whether a window's visible bounds are the opening.
pub fn fits(visible: &Rect, opening: &Rect) -> bool {
    (visible.x - opening.x).abs() <= TOLERANCE
        && (visible.y - opening.y).abs() <= TOLERANCE
        && (visible.width - opening.width).abs() <= 2 * TOLERANCE
        && (visible.height - opening.height).abs() <= 2 * TOLERANCE
}

/// The visible bounds as a rectangle in the window's own coordinates, which is
/// what a window region is given in. A maximised window's rectangle reaches a
/// few pixels past what is drawn, on the sides that are off screen.
pub fn relative_to(window: &Rect, visible: &Rect) -> Rect {
    Rect { x: visible.x - window.x, y: visible.y - window.y, ..*visible }
}

/// The radius the window is clipped with: a pixel squarer than the curve the
/// fringe is drawn along (see the module notes).
pub fn clip_radius(radius: i32) -> i32 {
    (radius - 1).max(0)
}

fn centre(r: &Rect) -> (i32, i32) {
    (r.x + r.width / 2, r.y + r.height / 2)
}

fn contains(r: &Rect, p: (i32, i32)) -> bool {
    p.0 >= r.x && p.0 < r.x + r.width && p.1 >= r.y && p.1 < r.y + r.height
}

// ---- state ----

static ENABLED: AtomicBool = AtomicBool::new(false);
static STARTED: OnceLock<Sender<()>> = OnceLock::new();
static OPENINGS: Mutex<Vec<Opening>> = Mutex::new(Vec::new());
/// Windows shaped by us, with what they were shaped to, so a repeat is skipped.
static SHAPED: Mutex<Vec<(isize, Rect, i32)>> = Mutex::new(Vec::new());
/// Windows that refused a shape, and what they were asked for, so they are not
/// asked every few hundred milliseconds.
static REFUSED: Mutex<Vec<(isize, Rect, i32)>> = Mutex::new(Vec::new());
/// Per monitor: whether the topmost maximised window is shaped, which is when
/// the fringe is wanted over it.
static FRINGE: Mutex<Vec<(String, bool)>> = Mutex::new(Vec::new());
static CHANGED: OnceLock<Box<dyn Fn() + Send + Sync>> = OnceLock::new();

/// Called when a monitor starts or stops needing its fringe.
pub fn set_changed_hook(hook: impl Fn() + Send + Sync + 'static) {
    let _ = CHANGED.set(Box::new(hook));
}

/// Whether the fringe is wanted on a monitor right now.
pub fn fringe_wanted(monitor: &str) -> bool {
    FRINGE.lock().iter().any(|(m, on)| m == monitor && *on)
}

/// Set where the openings are. An empty list switches shaping off, and takes
/// every shape off again.
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
        unshape_all();
    } else if !same {
        // the openings moved, so what was shaped to the old ones may be wrong
        start();
        wake();
    }
}

fn wake() {
    if let Some(tx) = STARTED.get() {
        let _ = tx.send(());
    }
}

/// Take every shape we put on a window off again.
pub fn unshape_all() {
    let all: Vec<isize> = SHAPED.lock().iter().map(|(h, _, _)| *h).collect();
    for h in all {
        clear(h);
    }
    REFUSED.lock().clear();
    let changed = {
        let mut f = FRINGE.lock();
        let any = f.iter().any(|(_, on)| *on);
        f.clear();
        any
    };
    if changed {
        if let Some(hook) = CHANGED.get() {
            hook();
        }
    }
}

fn clear(hwnd: isize) {
    SHAPED.lock().retain(|(h, _, _)| *h != hwnd);
    let w = HWND(hwnd as *mut _);
    unsafe {
        if IsWindow(Some(w)).as_bool() {
            let _ = SetWindowRgn(w, None, false);
        }
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

/// Shape one window, if it is not already. Whether it is shaped afterwards.
fn ensure_shaped(hwnd: HWND, visible: &Rect, radius: i32) -> bool {
    let key = hwnd.0 as isize;
    let mut window = RECT::default();
    if unsafe { GetWindowRect(hwnd, &mut window) }.is_err() {
        return false;
    }
    let rel = relative_to(&rect_of(window), visible);
    let clip = clip_radius(radius);
    // already shaped like this, and still wearing it?
    if SHAPED.lock().iter().any(|(h, r, c)| *h == key && r_eq(r, &rel) && *c == clip) {
        if region_in_place(hwnd, &rel, clip) {
            return true;
        }
        // some programs manage their own window shape and take ours off again
        // when they resize or change state; shape it again, but not forever
        SHAPED.lock().retain(|(h, _, _)| *h != key);
        if lost_again(key) {
            crate::trace!("shaper: {key:x} keeps removing its shape, leaving it square");
            remember_refused(key, rel, clip);
            return false;
        }
    }
    if REFUSED.lock().iter().any(|(h, r, c)| *h == key && r_eq(r, &rel) && *c == clip) {
        return false;
    }
    // shaping makes the window's own thread answer, so a program that is not
    // responding would stall this one until it does
    if unsafe { IsHungAppWindow(hwnd) }.as_bool() {
        return false;
    }
    let region = region_of(&rel, clip);
    // Without a redraw. With one the system sends the window a WM_WINDOWPOSCHANGED, which a program takes for its
    // window having moved or changed size: it lays itself out again and paints again, in the middle of Windows'
    // own animation of it growing to fill the screen, and the window jerks and flashes. The region needs no
    // such thing: the window is composited from the picture it has already drawn, and the region only says how
    // much of that picture is shown.
    let applied = unsafe { SetWindowRgn(hwnd, Some(region), false) } != 0;
    if !applied {
        // the system did not take it, so it is still ours to free
        unsafe {
            let _ = DeleteObject(region.into());
        }
        crate::trace!("shaper: {key:x} refused a shape");
        remember_refused(key, rel, clip);
        return false;
    }
    // taken is not the same as kept: look at what the window now has
    if !region_in_place(hwnd, &rel, clip) {
        crate::trace!("shaper: {key:x} took a shape but does not show it, leaving it square");
        unsafe {
            let _ = SetWindowRgn(hwnd, None, false);
        }
        remember_refused(key, rel, clip);
        return false;
    }
    let mut shaped = SHAPED.lock();
    shaped.retain(|(h, _, _)| *h != key);
    shaped.push((key, rel, clip));
    true
}

/// A region for a rectangle with rounded corners, as the system draws it: a
/// rounded one leaves out its far row and column, so it is asked for one more
/// of each, and no radius is a plain rectangle (a zero ellipse is empty).
fn region_of(r: &Rect, radius: i32) -> HRGN {
    unsafe {
        if radius <= 0 {
            CreateRectRgn(r.x, r.y, r.x + r.width, r.y + r.height)
        } else {
            CreateRoundRectRgn(r.x, r.y, r.x + r.width + 1, r.y + r.height + 1, 2 * radius, 2 * radius)
        }
    }
}

fn remember_refused(key: isize, rel: Rect, clip: i32) {
    let mut refused = REFUSED.lock();
    refused.retain(|(h, _, _)| *h != key);
    refused.push((key, rel, clip));
}

/// Whether the window has a region that is ours: one inside the opening and
/// most of it. A window without one, or with one a
/// program put there itself, which reaches over its invisible borders, does not.
fn region_in_place(hwnd: HWND, rel: &Rect, clip: i32) -> bool {
    let mut b = RECT::default();
    let kind = unsafe { GetWindowRgnBox(hwnd, &mut b) };
    // 0 is an error, which is what a window with no region gives
    let boxed = kind.0 != 0
        && b.left >= rel.x - 1
        && b.top >= rel.y - 1
        && b.right <= rel.x + rel.width + 2
        && b.bottom <= rel.y + rel.height + 2
        && b.right - b.left >= rel.width / 2
        && b.bottom - b.top >= rel.height / 2;
    if !boxed || clip < 3 {
        return boxed;
    }
    // a region of the right size that is not rounded is someone else's: the
    // opening's own corner pixel must be cut away
    unsafe {
        let copy = CreateRectRgn(0, 0, 0, 0);
        let got = GetWindowRgn(hwnd, copy).0 != 0;
        let corner_in = PtInRegion(copy, rel.x, rel.y).as_bool();
        let _ = DeleteObject(copy.into());
        got && !corner_in
    }
}

/// Note that a window lost its shape, and say whether it has now done so too
/// often lately to be worth fighting over.
fn lost_again(key: isize) -> bool {
    static LOST: Mutex<Vec<(isize, u32, Instant)>> = Mutex::new(Vec::new());
    let mut lost = LOST.lock();
    lost.retain(|(_, _, since)| since.elapsed() < Duration::from_secs(10));
    match lost.iter_mut().find(|(h, _, _)| *h == key) {
        Some((_, n, _)) => {
            *n += 1;
            *n > 4
        }
        None => {
            lost.push((key, 1, Instant::now()));
            false
        }
    }
}

fn r_eq(a: &Rect, b: &Rect) -> bool {
    a.x == b.x && a.y == b.y && a.width == b.width && a.height == b.height
}

/// How long a window has been the one on top and shaped before the fringe is shown over its corners. Windows takes
/// about this long to grow a window to fill the screen, drawing it from a picture that has square corners and is
/// scaled; the fringe, drawn along the final corners, would show on its own in the empty space for that time.
const FRINGE_DELAY: Duration = Duration::from_millis(330);

/// Per monitor: since when a shaped window has been on top of it.
static ON_TOP_SINCE: Mutex<Vec<(String, Instant)>> = Mutex::new(Vec::new());

/// One look at the screen. Returns how soon it wants another, if it does (the fringe is waiting to be shown).
fn tick() -> Option<Duration> {
    let openings = OPENINGS.lock().clone();
    if openings.is_empty() {
        return None;
    }
    let mut keep: HashSet<isize> = HashSet::new();
    // for each monitor, whether the window on top of its maximised ones is shaped
    let mut top: HashMap<String, bool> = HashMap::new();
    for hwnd in maximised_windows() {
        let Some(visible) = visible_bounds(hwnd) else { continue };
        let Some(opening) = openings.iter().find(|o| contains(&o.screen, centre(&visible))) else {
            continue;
        };
        let mut shaped = false;
        if opening.radius > 0 && fits(&visible, &opening.rect) {
            shaped = ensure_shaped(hwnd, &visible, opening.radius);
            if shaped {
                keep.insert(hwnd.0 as isize);
            }
        }
        top.entry(opening.monitor.clone()).or_insert(shaped);
    }
    // windows that were shaped and no longer should be
    let stale: Vec<isize> = SHAPED
        .lock()
        .iter()
        .map(|(h, _, _)| *h)
        .filter(|h| !keep.contains(h))
        .collect();
    for h in stale {
        clear(h);
    }
    REFUSED.lock().retain(|(h, _, _)| unsafe { IsWindow(Some(HWND(*h as *mut _))) }.as_bool());

    let mut changed = false;
    let mut again: Option<Duration> = None;
    {
        let mut fringe = FRINGE.lock();
        let mut since = ON_TOP_SINCE.lock();
        for opening in &openings {
            let on_top = top.get(&opening.monitor).copied().unwrap_or(false);
            // it goes the moment the shaped window goes, and comes only when the window has had time to arrive
            let want = if on_top {
                let at = match since.iter().find(|(m, _)| *m == opening.monitor) {
                    Some((_, at)) => *at,
                    None => {
                        let now = Instant::now();
                        since.push((opening.monitor.clone(), now));
                        now
                    }
                };
                let waited = at.elapsed();
                if waited >= FRINGE_DELAY {
                    true
                } else {
                    let left = FRINGE_DELAY - waited + Duration::from_millis(8);
                    again = Some(again.map_or(left, |a| a.min(left)));
                    false
                }
            } else {
                since.retain(|(m, _)| *m != opening.monitor);
                false
            };
            match fringe.iter_mut().find(|(m, _)| *m == opening.monitor) {
                Some((_, on)) if *on == want => {}
                Some((_, on)) => {
                    *on = want;
                    changed = true;
                }
                None => {
                    fringe.push((opening.monitor.clone(), want));
                    changed |= want;
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
    // only a window itself moving or resizing, and only ones that matter: a
    // maximised one (that may need shaping) or one we have shaped (that may
    // have stopped being)
    if id_object != OBJID_WINDOW.0 || id_child != 0 || hwnd.0.is_null() {
        return;
    }
    let key = hwnd.0 as isize;
    let interesting = unsafe { IsZoomed(hwnd).as_bool() } || SHAPED.lock().iter().any(|(h, _, _)| *h == key);
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
    let worker = std::thread::Builder::new().name("frame-shaper".into()).spawn(move || {
        let mut sooner: Option<Duration> = None;
        let mut straight_on = false;
        loop {
            // woken by an event, or every so often in case one was missed (or the fringe is due)
            if !straight_on {
                let _ = rx.recv_timeout(sooner.take().map_or(Duration::from_millis(400), |s| s.min(Duration::from_millis(400))));
            }
            straight_on = false;
            // The first event of a change is looked at at once: a window that has just grown to fill the screen
            // should have its corners cut in the next frame, not several frames on. What follows it in the next
            // few milliseconds (one change is a burst of events) is one more look at the end of it, not many.
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
        log::warn!("could not start the window shaper: {e}");
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
        assert!(fits(&OPENING, &OPENING));
        // a pixel or two off, as a maximised window is
        let near = Rect { x: 1935, y: -116, width: 2531, height: 1345 };
        assert!(fits(&near, &OPENING));
    }

    #[test]
    fn a_window_that_does_not_fill_it_does_not() {
        // an ordinary window
        let small = Rect { x: 2100, y: 100, width: 900, height: 600 };
        assert!(!fits(&small, &OPENING));
        // a maximised one on a monitor with no frame (the full screen)
        let full = Rect { x: 1920, y: -165, width: 2560, height: 1440 };
        assert!(!fits(&full, &OPENING));
        // one snapped to half
        let half = Rect { x: 1934, y: -117, width: 1266, height: 1346 };
        assert!(!fits(&half, &OPENING));
    }

    #[test]
    fn the_region_is_given_relative_to_the_window() {
        // a maximised window's rectangle reaches 8px past what is drawn on
        // the left, right and bottom, and none at the top
        let window = Rect { x: 1926, y: -117, width: 2548, height: 1354 };
        let visible = Rect { x: 1934, y: -117, width: 2532, height: 1346 };
        let rel = relative_to(&window, &visible);
        assert_eq!((rel.x, rel.y, rel.width, rel.height), (8, 0, 2532, 1346));
    }

    #[test]
    fn the_clip_is_a_pixel_squarer_than_the_curve_but_never_negative() {
        assert_eq!(clip_radius(18), 17);
        assert_eq!(clip_radius(1), 0);
        assert_eq!(clip_radius(0), 0);
    }

    #[test]
    fn a_region_we_set_is_seen_and_a_missing_one_is_not() {
        use windows::core::w;
        use windows::Win32::UI::WindowsAndMessaging::{CreateWindowExW, DestroyWindow, WS_POPUP, WINDOW_EX_STYLE};
        // an unshown window far off screen, of a class every system has
        let hwnd = unsafe {
            CreateWindowExW(WINDOW_EX_STYLE(0), w!("STATIC"), w!(""), WS_POPUP, -30000, -30000, 800, 600, None, None, None, None)
        }
        .expect("a test window");
        let rel = Rect { x: 0, y: 0, width: 800, height: 600 };
        assert!(!region_in_place(hwnd, &rel, 17), "no region yet");
        unsafe {
            let region = CreateRoundRectRgn(0, 0, 801, 601, 34, 34);
            assert_ne!(SetWindowRgn(hwnd, Some(region), false), 0);
        }
        assert!(region_in_place(hwnd, &rel, 17), "the rounded region spans the window");
        assert!(!region_in_place(hwnd, &Rect { x: 20, y: 20, width: 700, height: 500 }, 17), "a different size is not it");
        unsafe {
            let _ = SetWindowRgn(hwnd, None, false);
        }
        assert!(!region_in_place(hwnd, &rel, 17), "taken off again");
        unsafe {
            let _ = DestroyWindow(hwnd);
        }
    }

    #[test]
    fn a_square_region_of_the_right_size_is_not_ours() {
        use windows::core::w;
        use windows::Win32::UI::WindowsAndMessaging::{CreateWindowExW, DestroyWindow, WS_POPUP, WINDOW_EX_STYLE};
        let hwnd = unsafe {
            CreateWindowExW(WINDOW_EX_STYLE(0), w!("STATIC"), w!(""), WS_POPUP, -30000, -30000, 800, 600, None, None, None, None)
        }
        .expect("a test window");
        let rel = Rect { x: 0, y: 0, width: 800, height: 600 };
        unsafe {
            // a program's own region: right size, square corners
            let square = region_of(&rel, 0);
            assert_ne!(SetWindowRgn(hwnd, Some(square), false), 0);
        }
        assert!(!region_in_place(hwnd, &rel, 17), "square corners are not the shape asked for");
        unsafe {
            let _ = DestroyWindow(hwnd);
        }
    }
    /// What the program sees when its window is shaped: the system tells it (WM_WINDOWPOSCHANGED) whether or not a
    /// redraw is asked for, and what it is told must be that nothing moved and nothing was resized, or a program
    /// lays itself out again and paints in the middle of the system's own animation of it growing to fill the screen.
    #[test]
    fn shaping_a_window_tells_it_that_nothing_moved_or_was_resized() {
        use std::sync::atomic::AtomicU32;
        use windows::core::w;
        use windows::Win32::Foundation::{LRESULT, WPARAM};
        use windows::Win32::UI::Shell::{DefSubclassProc, SetWindowSubclass};
        use windows::Win32::UI::WindowsAndMessaging::{
            CreateWindowExW, DestroyWindow, ShowWindow, SW_SHOWNOACTIVATE, SWP_NOMOVE, SWP_NOSIZE, WINDOWPOS, WINDOW_EX_STYLE,
            WM_WINDOWPOSCHANGED, WS_POPUP,
        };

        static NOTICES: AtomicU32 = AtomicU32::new(0);
        static MOVED_OR_SIZED: AtomicU32 = AtomicU32::new(0);
        unsafe extern "system" fn watch(hwnd: HWND, msg: u32, wparam: WPARAM, lparam: LPARAM, _id: usize, _data: usize) -> LRESULT {
            if msg == WM_WINDOWPOSCHANGED {
                NOTICES.fetch_add(1, Ordering::SeqCst);
                let at = unsafe { &*(lparam.0 as *const WINDOWPOS) };
                if at.flags.0 & SWP_NOMOVE.0 == 0 || at.flags.0 & SWP_NOSIZE.0 == 0 {
                    MOVED_OR_SIZED.fetch_add(1, Ordering::SeqCst);
                }
            }
            unsafe { DefSubclassProc(hwnd, msg, wparam, lparam) }
        }

        let hwnd = unsafe {
            CreateWindowExW(WINDOW_EX_STYLE(0), w!("STATIC"), w!(""), WS_POPUP, -30000, -30000, 800, 600, None, None, None, None)
        }
        .expect("a test window");
        unsafe {
            let _ = ShowWindow(hwnd, SW_SHOWNOACTIVATE);
            assert!(SetWindowSubclass(hwnd, Some(watch), 1, 0).as_bool());
        }
        let rel = Rect { x: 0, y: 0, width: 800, height: 600 };
        assert!(shape_for_test(hwnd, &rel, 17));
        unsafe {
            let _ = SetWindowRgn(hwnd, None, false);
        }
        assert!(NOTICES.load(Ordering::SeqCst) > 0, "the test heard the notices at all");
        assert_eq!(MOVED_OR_SIZED.load(Ordering::SeqCst), 0, "none of them said it moved or was resized");
        unsafe {
            let _ = DestroyWindow(hwnd);
        }
    }

    /// `ensure_shaped` looks at the screen to find the window's bounds; this is the part of it that sets the shape.
    fn shape_for_test(hwnd: HWND, rel: &Rect, clip: i32) -> bool {
        let region = region_of(rel, clip);
        let applied = unsafe { SetWindowRgn(hwnd, Some(region), false) } != 0;
        applied && region_in_place(hwnd, rel, clip)
    }
    #[test]
    fn a_point_is_on_the_monitor_that_contains_it() {
        let a = Rect { x: 0, y: 0, width: 1920, height: 1080 };
        assert!(contains(&a, (0, 0)) && contains(&a, (1919, 1079)));
        assert!(!contains(&a, (1920, 500)) && !contains(&a, (-1, 5)));
    }
}
