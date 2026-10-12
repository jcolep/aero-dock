//! The frame: a margin of glass round the free space of every monitor, between
//! the menu bar and the dock, that holds maximised apps in from the screen
//! edges and gives them rounded corners.
//!
//! Four pieces make it up on each monitor.
//!
//! * **Strips.** One appbar strip per edge, registered through four hidden
//!   anchor windows, thick enough to cover the menu bar, the dock, a visible
//!   Windows taskbar and then the margin. The shell makes every maximised
//!   window fit what is left, so apps and snap layouts respect the margin with
//!   nothing done to them. The menu bar and dock register nothing while the
//!   frame is on; see `platform/windows/appbar.rs`.
//! * **The ring.** A transparent window over the free space, kept behind every
//!   ordinary window, clipped to the margin so that the opening in the middle
//!   neither draws nor takes clicks. The page draws the glass and the scene in
//!   it.
//! * **The shaping.** A maximised app's corners are square. Its own window is
//!   cut round them with a window region (see `platform/windows/shaper.rs`), so
//!   what shows through is the ring's glass, which is behind it, with nothing
//!   laid over the app. Only an app that cannot be shaped (an elevated one) is
//!   left square.
//! * **The fringe.** A window region is stepped, so a second small window, kept
//!   on top, draws a thin anti-aliased edge along each of the four arcs, a few
//!   pixels wide and clipped to just that. It is shown only while the app on
//!   top is one that has been shaped, and hidden while a fullscreen app, game
//!   or video is running.//! * **The hook.** The menu bar and dock tell the frame when how much they
//!   claim changes, and it lays out again.

use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};

use parking_lot::Mutex;
use tauri::{AppHandle, Manager, WebviewWindow};
use windows::Win32::Foundation::HWND;
use windows::Win32::Graphics::Gdi::{
    CombineRgn, CreateRectRgn, CreateRoundRectRgn, DeleteObject, HRGN, RGN_AND, RGN_DIFF, RGN_OR,
};

use crate::commands::dock::on_main_thread;
use crate::core::settings::{DockEdge, Settings, SettingsStore};
use crate::core::{AeroError, AeroResult};
use crate::platform::windows::appbar::{self, Owner};
use crate::platform::windows::monitors::{enumerate_monitors, MonitorInfoEx, Rect};
use crate::platform::windows::shaper::{self, Opening};
use crate::platform::windows::{anchor, dock_window};

const RING_PREFIX: &str = "frame-";
const CORNERS_PREFIX: &str = "framecorners-";

/// The edges, in the order the per-edge arrays here use.
const EDGES: [DockEdge; 4] = [DockEdge::Top, DockEdge::Right, DockEdge::Bottom, DockEdge::Left];

/// Whether a window label belongs to the frame.
pub fn is_frame_label(label: &str) -> bool {
    label.starts_with(RING_PREFIX) || label.starts_with(CORNERS_PREFIX)
}

/// The part of a monitor's device name a window label can hold.
fn tail(monitor_name: &str) -> String {
    monitor_name.chars().filter(|c| c.is_ascii_alphanumeric()).collect()
}

fn ring_label(monitor_name: &str) -> String {
    format!("{RING_PREFIX}{}", tail(monitor_name))
}

fn corners_label(monitor_name: &str) -> String {
    format!("{CORNERS_PREFIX}{}", tail(monitor_name))
}

/// Where the frame goes on one monitor, in physical pixels.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Geometry {
    /// The free space the frame fills: the monitor less everything claimed.
    pub x: i32,
    pub y: i32,
    pub w: i32,
    pub h: i32,
    /// Width of the margin.
    pub pad: i32,
    /// Corner radius of the opening, never more than the opening allows.
    pub radius: i32,
}

/// The frame's rectangle on a monitor, given how far in the menu bar, the dock
/// and the taskbar reach on each edge (`base`, in the order top, right, bottom,
/// left), the margin and the wanted radius.
pub fn geometry(monitor: &Rect, base: [i32; 4], pad: i32, radius: i32) -> Geometry {
    let x = monitor.x + base[3];
    let y = monitor.y + base[0];
    let w = (monitor.width - base[1] - base[3]).max(1);
    let h = (monitor.height - base[0] - base[2]).max(1);
    let pad = pad.clamp(0, (w.min(h) - 2).max(0) / 2);
    let opening = (w - 2 * pad).min(h - 2 * pad).max(0);
    Geometry { x, y, w, h, pad, radius: radius.clamp(0, opening / 2) }
}

/// A rounded rectangle as a GDI region, from `left`/`top` up to but not
/// including `right`/`bottom`, as `CreateRectRgn` takes them.
///
/// Two quirks of GDI are allowed for here. A rounded region leaves out its far
/// column and row (it is a pixel smaller than a plain one on those sides), so
/// one more is asked for; and a corner with no size makes an empty region
/// instead of a square one, so a plain rectangle is made.
unsafe fn round_rect(left: i32, top: i32, right: i32, bottom: i32, radius: i32) -> HRGN {
    unsafe {
        if radius <= 0 {
            return CreateRectRgn(left, top, right, bottom);
        }
        let d = 2 * radius;
        CreateRoundRectRgn(left, top, right + 1, bottom + 1, d, d)
    }
}

/// The margin as a region: the whole window less the opening. The opening's
/// corners are made a pixel rounder than the page draws them, so the region
/// takes in a little more than the page paints and the page's own smooth edge,
/// not this region's stepped one, is what shows. (The ring is also what shows
/// through the corners cut from a maximised app, which is why it takes in the
/// slivers outside the opening's curve.)
unsafe fn ring_region(g: &Geometry) -> HRGN {
    unsafe {
        let whole = CreateRectRgn(0, 0, g.w, g.h);
        let opening = round_rect(g.pad, g.pad, g.w - g.pad, g.h - g.pad, g.radius + 1);
        let ring = CreateRectRgn(0, 0, 0, 0);
        CombineRgn(Some(ring), Some(whole), Some(opening), RGN_DIFF);
        let _ = DeleteObject(whole.into());
        let _ = DeleteObject(opening.into());
        ring
    }
}

/// How far in from the edge of the opening the fringe reaches, in pixels. The
/// clip an app is shaped with is up to a pixel off the ideal curve and the
/// edge itself is a pixel more, so this is a little over both.
const FRINGE: i32 = 3;

/// The fringe as a region: a thin band along each of the opening's four
/// corner arcs, just inside the clip an app is shaped with. Nothing else, so
/// it takes no clicks anywhere else. Empty when the corners are square.
unsafe fn fringe_region(g: &Geometry) -> HRGN {
    unsafe {
        let band = CreateRectRgn(0, 0, 0, 0);
        if g.radius <= 0 {
            return band;
        }
        let clip = round_rect(
            g.pad,
            g.pad,
            g.w - g.pad,
            g.h - g.pad,
            crate::platform::windows::shaper::clip_radius(g.radius),
        );
        let inner = round_rect(
            g.pad + FRINGE,
            g.pad + FRINGE,
            g.w - g.pad - FRINGE,
            g.h - g.pad - FRINGE,
            (g.radius - 1 - FRINGE).max(0),
        );
        CombineRgn(Some(band), Some(clip), Some(inner), RGN_DIFF);
        // only near the four corners, not along the straight edges
        let reach = g.radius + 2 * FRINGE;
        let near = CreateRectRgn(0, 0, 0, 0);
        for (x, y) in [
            (g.pad, g.pad),
            (g.w - g.pad - reach, g.pad),
            (g.pad, g.h - g.pad - reach),
            (g.w - g.pad - reach, g.h - g.pad - reach),
        ] {
            let square = CreateRectRgn(x, y, x + reach, y + reach);
            CombineRgn(Some(near), Some(near), Some(square), RGN_OR);
            let _ = DeleteObject(square.into());
        }
        CombineRgn(Some(band), Some(band), Some(near), RGN_AND);
        let _ = DeleteObject(clip.into());
        let _ = DeleteObject(inner.into());
        let _ = DeleteObject(near.into());
        band
    }
}
/// Hidden anchor windows by monitor name, as raw handles, in the order of
/// [`EDGES`].
static ANCHORS: Mutex<Vec<(String, [isize; 4])>> = Mutex::new(Vec::new());

/// The last geometry placed for each monitor, so a repeat is skipped.
static LAST: std::sync::LazyLock<Mutex<HashMap<String, Geometry>>> =
    std::sync::LazyLock::new(|| Mutex::new(HashMap::new()));

/// Whether a fullscreen app is up, which hides the corners.
static FULLSCREEN: AtomicBool = AtomicBool::new(false);

fn anchors_for(monitor_name: &str) -> Option<[isize; 4]> {
    ANCHORS.lock().iter().find(|(n, _)| n == monitor_name).map(|(_, a)| *a)
}

/// The monitor's four anchors, made if it has none yet. Main thread only.
fn ensure_anchors(monitor_name: &str) -> Option<[isize; 4]> {
    if let Some(found) = anchors_for(monitor_name) {
        return Some(found);
    }
    let mut made = [0isize; 4];
    for slot in &mut made {
        *slot = anchor::create()?.0 as isize;
    }
    ANCHORS.lock().push((monitor_name.to_string(), made));
    Some(made)
}

/// Give back a monitor's strips and destroy its anchors.
fn drop_anchors(monitor_name: &str) {
    let removed = {
        let mut all = ANCHORS.lock();
        all.iter().position(|(n, _)| n == monitor_name).map(|i| all.remove(i).1)
    };
    for raw in removed.into_iter().flatten() {
        let hwnd = HWND(raw as *mut _);
        appbar::release_window(hwnd);
        anchor::destroy(hwnd);
    }
    LAST.lock().remove(monitor_name);
}

fn window_of(app: &AppHandle, label: &str) -> Option<WebviewWindow> {
    app.get_webview_window(label)
}

fn hwnd_of(window: &WebviewWindow) -> Option<HWND> {
    window.hwnd().ok().map(|h| HWND(h.0))
}

/// Every frame window there is.
fn frame_windows(app: &AppHandle) -> Vec<WebviewWindow> {
    app.webview_windows()
        .into_values()
        .filter(|w| is_frame_label(w.label()))
        .collect()
}

/// Place the frame on one monitor: its strips, then its two windows. Main
/// thread only.
fn layout_monitor(
    app: &AppHandle,
    monitor: &MonitorInfoEx,
    settings: &Settings,
) -> AeroResult<Option<Opening>> {
    let ring = window_of(app, &ring_label(&monitor.name));
    let corners = window_of(app, &corners_label(&monitor.name));
    let (Some(ring), Some(corners)) = (ring, corners) else {
        // built a moment from now; the next layout places it
        return Ok(None);
    };
    let (Some(ring_hwnd), Some(corners_hwnd)) = (hwnd_of(&ring), hwnd_of(&corners)) else {
        return Ok(None);
    };
    let Some(anchors) = ensure_anchors(&monitor.name) else {
        return Err(AeroError::other("could not make the frame's anchor windows"));
    };

    let scale = monitor.scale;
    let pad = (settings.frame.padding as f64 * scale).round() as i32;
    let radius = (settings.frame.corner_radius as f64 * scale).round() as i32;
    let base: [i32; 4] =
        EDGES.map(|edge| appbar::base_extent(&monitor.bounds, edge, settings.hide_taskbar));
    let g = geometry(&monitor.bounds, base, pad, radius);

    // The strips go in even when nothing about the windows changed: a repeat
    // is answered from a cache and costs the shell nothing.
    for (i, edge) in EDGES.into_iter().enumerate() {
        appbar::reserve(
            HWND(anchors[i] as *mut _),
            edge,
            monitor.bounds,
            base[i] + g.pad,
            true,
            Owner::Frame,
            monitor.bounds,
        );
    }

    let changed = LAST.lock().get(&monitor.name) != Some(&g);
    // the two windows are not the dock's: they are never in the way of what is
    // under them, and keep their title bars off like the menu bar does
    for hwnd in [ring_hwnd, corners_hwnd] {
        dock_window::apply_dock_styles(hwnd)?;
        dock_window::keep_caption_off(hwnd);
    }
    if changed {
        for (hwnd, region) in [
            (ring_hwnd, unsafe { ring_region(&g) }),
            (corners_hwnd, unsafe { fringe_region(&g) }),
        ] {
            dock_window::set_bounds(hwnd, g.x, g.y, g.w, g.h)?;
            dock_window::set_region(hwnd, region)?;
        }
        LAST.lock().insert(monitor.name.clone(), g);
    }

    // shown only now it is in place, so it never appears in the wrong spot
    if !ring.is_visible().unwrap_or(false) {
        let _ = ring.show();
    }
    let _ = ring.set_always_on_bottom(true);
    let _ = corners.set_always_on_top(true);
    // the fringe is shown only over an app that has been shaped
    set_corners_visible(
        &corners,
        !FULLSCREEN.load(Ordering::Relaxed)
            && g.radius > 0
            && shaper::fringe_wanted(&monitor.name),
    );
    Ok(Some(Opening {
        monitor: monitor.name.clone(),
        screen: monitor.bounds,
        rect: Rect { x: g.x + g.pad, y: g.y + g.pad, width: g.w - 2 * g.pad, height: g.h - 2 * g.pad },
        radius: g.radius,
    }))
}

/// Show or hide the corner window.
fn set_corners_visible(corners: &WebviewWindow, visible: bool) {
    let showing = corners.is_visible().unwrap_or(false);
    if visible && !showing {
        let _ = corners.show();
        let _ = corners.set_always_on_top(true);
    } else if !visible && showing {
        let _ = corners.hide();
    }
}

/// Lay out the frame on every monitor. Main thread only.
pub fn layout_all(app: &AppHandle) {
    let settings = app.state::<SettingsStore>().get();
    if !settings.frame.enabled {
        return;
    }
    let monitors = match enumerate_monitors() {
        Ok(m) => m,
        Err(e) => {
            log::warn!("could not list monitors to lay out the frame: {e}");
            return;
        }
    };
    let mut openings = Vec::new();
    for monitor in &monitors {
        match layout_monitor(app, monitor, &settings) {
            Ok(Some(opening)) => openings.push(opening),
            Ok(None) => {}
            Err(e) => log::warn!("could not lay out the frame on {}: {e}", monitor.name),
        }
    }
    // the shaper rounds whichever maximised app fills each opening
    shaper::set_openings(openings);
}

/// Take the frame off every window it has shaped. Called when Aero Dock quits
/// as well as when the frame goes: a window left with its region would stay
/// clipped to the size it had.
pub fn shutdown() {
    shaper::set_openings(Vec::new());
}

/// Lay out the frame soon, on the main thread, without waiting.
pub fn layout_later(app: &AppHandle) {
    let handle = app.clone();
    if let Err(e) = app.run_on_main_thread(move || layout_all(&handle)) {
        log::warn!("could not queue the frame for laying out: {e}");
    }
}

/// Set the frame up: have the menu bar and dock tell it when their claims
/// change, and watch for fullscreen apps. Once, at startup.
pub fn init(app: &AppHandle) {
    let handle = app.clone();
    appbar::set_claims_hook(move || layout_later(&handle));
    let handle = app.clone();
    shaper::set_changed_hook(move || layout_later(&handle));

    let handle = app.clone();
    let spawned = std::thread::Builder::new()
        .name("frame-fullscreen".into())
        .spawn(move || loop {
            std::thread::sleep(std::time::Duration::from_millis(1500));
            let enabled = handle.state::<SettingsStore>().get().frame.enabled;
            if !enabled {
                continue;
            }
            let now = fullscreen_app_running();
            if FULLSCREEN.swap(now, Ordering::Relaxed) != now {
                let h = handle.clone();
                let _ = handle.run_on_main_thread(move || {
                    // the corners come back by themselves on the next layout;
                    // hiding is done here
                    for w in frame_windows(&h) {
                        if w.label().starts_with(CORNERS_PREFIX) {
                            set_corners_visible(&w, !now);
                        }
                    }
                });
            }
        });
    if let Err(e) = spawned {
        log::warn!("could not start the fullscreen watcher: {e}");
    }
}

/// Whether the shell says a fullscreen app, a game or a presentation is up.
fn fullscreen_app_running() -> bool {
    use windows::Win32::UI::Shell::{
        SHQueryUserNotificationState, QUNS_BUSY, QUNS_PRESENTATION_MODE,
        QUNS_RUNNING_D3D_FULL_SCREEN,
    };
    match unsafe { SHQueryUserNotificationState() } {
        Ok(state) => {
            state == QUNS_BUSY
                || state == QUNS_RUNNING_D3D_FULL_SCREEN
                || state == QUNS_PRESENTATION_MODE
        }
        Err(_) => false,
    }
}

static SYNCING: AtomicBool = AtomicBool::new(false);
static SYNC_AGAIN: AtomicBool = AtomicBool::new(false);

struct SyncGuard;

impl Drop for SyncGuard {
    fn drop(&mut self) {
        SYNCING.store(false, Ordering::SeqCst);
    }
}

/// Make the frame match the settings and the monitors that are connected: its
/// windows built for each, or all of it taken down. Safe to call as often as
/// wanted. One runs at a time, and a call that arrives during another asks it
/// to go round again, as for the docks. Call it after the docks and the menu
/// bar have been synced, since it re-places them around itself.
pub async fn sync_frames(app: &AppHandle) {
    if SYNCING.swap(true, Ordering::SeqCst) {
        SYNC_AGAIN.store(true, Ordering::SeqCst);
        return;
    }
    let _guard = SyncGuard;
    loop {
        SYNC_AGAIN.store(false, Ordering::SeqCst);
        sync_once(app).await;
        if !SYNC_AGAIN.load(Ordering::SeqCst) {
            break;
        }
    }
}

async fn sync_once(app: &AppHandle) {
    let settings = app.state::<SettingsStore>().get();
    let monitors = match enumerate_monitors() {
        Ok(m) => m,
        Err(e) => {
            log::warn!("could not list monitors for the frame: {e}");
            return;
        }
    };

    if !settings.frame.enabled {
        take_down(app, &monitors).await;
        return;
    }

    // windows for every monitor, and none for monitors that went away
    let wanted: Vec<String> = monitors.iter().map(|m| m.name.clone()).collect();
    for window in frame_windows(app) {
        let label = window.label().to_string();
        let keep = wanted.iter().any(|n| label == ring_label(n) || label == corners_label(n));
        if !keep {
            let _ = window.destroy();
        }
    }
    let gone: Vec<String> = ANCHORS
        .lock()
        .iter()
        .map(|(n, _)| n.clone())
        .filter(|n| !wanted.contains(n))
        .collect();
    if !gone.is_empty() {
        let _ = on_main_thread(app, move || gone.iter().for_each(|n| drop_anchors(n))).await;
    }
    for name in &wanted {
        for (label, page, on_top) in [
            (ring_label(name), "frame", false),
            (corners_label(name), "framecorners", true),
        ] {
            if app.get_webview_window(&label).is_none() {
                if let Err(e) = build_window(app, &label, page, on_top).await {
                    log::warn!("could not build {label}: {e}");
                }
            }
        }
    }

    // Frame mode on for every monitor, then the bar and the dock placed again
    // so that they claim instead of registering, then the frame laid out
    // around what they claim.
    let origins: Vec<(i32, i32)> = monitors.iter().map(|m| (m.bounds.x, m.bounds.y)).collect();
    let handle = app.clone();
    let placed = on_main_thread(app, move || {
        appbar::set_frame_monitors(origins);
        if let Err(e) = crate::commands::menubar::position_menubar(&handle) {
            log::warn!("could not place the menu bar for the frame: {e}");
        }
        if let Err(e) = crate::commands::dock::position_dock(&handle) {
            log::warn!("could not place the docks for the frame: {e}");
        }
        layout_all(&handle);
    })
    .await;
    if let Err(e) = placed {
        log::warn!("could not place the frame: {e}");
    }
}

/// The frame is off: give back its strips, close its windows, and let the menu
/// bar and dock register for themselves again.
async fn take_down(app: &AppHandle, monitors: &[MonitorInfoEx]) {
    let had_anything = !frame_windows(app).is_empty() || !ANCHORS.lock().is_empty();
    if !had_anything {
        return;
    }
    shaper::set_openings(Vec::new());
    for window in frame_windows(app) {
        let _ = window.destroy();
    }
    let names: Vec<String> = monitors.iter().map(|m| m.name.clone()).collect();
    let stale: Vec<String> = ANCHORS.lock().iter().map(|(n, _)| n.clone()).collect();
    let handle = app.clone();
    let done = on_main_thread(app, move || {
        for name in stale.iter().chain(names.iter()) {
            drop_anchors(name);
        }
        appbar::set_frame_monitors(Vec::new());
        // forget what they were granted, so the shell lays the screen out again
        appbar::forget();
        if let Err(e) = crate::commands::menubar::position_menubar(&handle) {
            log::warn!("could not place the menu bar after the frame: {e}");
        }
        if let Err(e) = crate::commands::dock::position_dock(&handle) {
            log::warn!("could not place the docks after the frame: {e}");
        }
    })
    .await;
    if let Err(e) = done {
        log::warn!("could not take the frame down: {e}");
    }
}

/// Build one of the frame's windows, hidden: transparent, undecorated, out of
/// the taskbar and Alt-Tab. `on_top` is for the corners; the ring stays behind.
async fn build_window(app: &AppHandle, label: &str, page: &str, on_top: bool) -> AeroResult<()> {
    let url = format!("index.html?window={page}");
    let builder = tauri::WebviewWindowBuilder::new(app, label, tauri::WebviewUrl::App(url.into()))
        .title("")
        .inner_size(800.0, 600.0)
        .transparent(true)
        .decorations(false)
        .always_on_top(on_top)
        .always_on_bottom(!on_top)
        .skip_taskbar(true)
        .resizable(false)
        .maximizable(false)
        .minimizable(false)
        .shadow(false)
        .focused(false)
        .visible(false);

    // every WebView2 window on one profile needs the same browser arguments
    #[cfg(windows)]
    let builder = match crate::commands::settings::dock_browser_args(app) {
        Some(args) => builder.additional_browser_args(&args),
        None => builder,
    };
    builder.build()?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    const MONITOR: Rect = Rect { x: 1920, y: -165, width: 2560, height: 1440 };

    #[test]
    fn the_frame_fills_what_the_bar_and_dock_leave() {
        // a 24px bar on top and a 70px dock along the bottom, a 14px margin
        let g = geometry(&MONITOR, [24, 0, 70, 0], 14, 18);
        assert_eq!((g.x, g.y, g.w, g.h), (1920, -141, 2560, 1346));
        assert_eq!((g.pad, g.radius), (14, 18));
    }

    #[test]
    fn a_taskbar_or_a_dock_down_the_side_narrows_it_from_that_side() {
        let g = geometry(&MONITOR, [0, 62, 0, 90], 10, 12);
        assert_eq!((g.x, g.y, g.w, g.h), (2010, -165, 2408, 1440));
    }

    #[test]
    fn the_corners_cannot_be_rounder_than_the_opening_allows() {
        // a 200x200 frame with a 20px margin has a 160px opening: radius at most 80
        let tiny = Rect { x: 0, y: 0, width: 200, height: 200 };
        assert_eq!(geometry(&tiny, [0; 4], 20, 500).radius, 80);
        // and a margin cannot eat the whole thing
        let g = geometry(&tiny, [0; 4], 500, 10);
        assert!(g.pad <= 99 && g.radius <= 1);
        // never negative
        assert_eq!(geometry(&MONITOR, [0; 4], 14, -5).radius, 0);
    }

    /// Whether a point is in a region.
    fn inside(region: HRGN, x: i32, y: i32) -> bool {
        unsafe { windows::Win32::Graphics::Gdi::PtInRegion(region, x, y).as_bool() }
    }

    #[test]
    fn the_ring_covers_the_margin_and_the_rounded_corners_and_not_the_opening() {
        // a 1000x600 window, 20px margin, 30px corners: the opening is
        // x 20..980, y 20..580, with its corners cut at (50,50) and so on
        let g = geometry(&Rect { x: 0, y: 0, width: 1000, height: 600 }, [0; 4], 20, 30);
        let ring = unsafe { ring_region(&g) };
        // the margin, on all four sides
        assert!(inside(ring, 500, 5) && inside(ring, 500, 595));
        assert!(inside(ring, 5, 300) && inside(ring, 995, 300));
        // the middle of the opening is not part of it
        assert!(!inside(ring, 500, 300));
        assert!(!inside(ring, 60, 60));
        // the corner of the opening's rectangle is outside its rounded edge,
        // so the ring takes it in, at every corner
        assert!(inside(ring, 23, 23) && inside(ring, 976, 23));
        assert!(inside(ring, 23, 576) && inside(ring, 976, 576));
        // while a point well inside the curve is the opening's
        assert!(!inside(ring, 45, 45) && !inside(ring, 955, 555));
        unsafe {
            let _ = DeleteObject(ring.into());
        }
    }

    #[test]
    fn the_fringe_is_a_thin_band_along_each_arc_and_nothing_else() {
        // a 1000x600 window, 20px margin, 30px corners; the app is clipped
        // with 29px corners, and the band reaches 3px in from that edge
        let g = geometry(&Rect { x: 0, y: 0, width: 1000, height: 600 }, [0; 4], 20, 30);
        let band = unsafe { fringe_region(&g) };
        // on the arc of each corner, just inside the clip's edge
        assert!(inside(band, 29, 29) && inside(band, 970, 29));
        assert!(inside(band, 29, 570) && inside(band, 970, 570));
        // not the margin, and not the opening's middle
        assert!(!inside(band, 500, 5) && !inside(band, 500, 300));
        // not along the straight edges, where an app's edge needs no smoothing
        assert!(!inside(band, 500, 21) && !inside(band, 21, 300));
        assert!(!inside(band, 500, 579) && !inside(band, 978, 300));
        // not deep inside a corner either
        assert!(!inside(band, 60, 60));
        unsafe {
            let _ = DeleteObject(band.into());
        }
    }

    #[test]
    fn square_corners_have_no_fringe() {
        let g = geometry(&Rect { x: 0, y: 0, width: 1000, height: 600 }, [0; 4], 20, 0);
        let band = unsafe { fringe_region(&g) };
        assert!(!inside(band, 21, 21) && !inside(band, 500, 21) && !inside(band, 500, 300));
        unsafe {
            let _ = DeleteObject(band.into());
        }
    }

    #[test]
    fn a_rounded_region_has_the_same_extent_as_a_plain_one() {
        // GDI leaves a rounded region's far column and row out; round_rect
        // allows for it, and for a corner with no size
        unsafe {
            let plain = CreateRectRgn(0, 0, 100, 50);
            let rounded = round_rect(0, 0, 100, 50, 4);
            let square = round_rect(0, 0, 100, 50, 0);
            for h in [plain, rounded, square] {
                assert!(inside(h, 99, 25) && inside(h, 50, 49), "the far edge is in");
                assert!(!inside(h, 100, 25) && !inside(h, 50, 50), "one past it is out");
                assert!(inside(h, 0, 25) && inside(h, 50, 0), "the near edge is in");
            }
            // and the rounded one has cut corners the plain one does not
            assert!(inside(plain, 0, 0) && !inside(rounded, 0, 0));
            for h in [plain, rounded, square] {
                let _ = DeleteObject(h.into());
            }
        }
    }
    #[test]
    fn claims_larger_than_the_screen_still_leave_a_window() {
        let g = geometry(&MONITOR, [5000, 0, 5000, 0], 14, 18);
        assert!(g.w >= 1 && g.h >= 1);
    }

    #[test]
    fn labels_are_valid_and_tell_the_ring_from_the_corners() {
        assert_eq!(ring_label("\\\\.\\DISPLAY2"), "frame-DISPLAY2");
        assert_eq!(corners_label("\\\\.\\DISPLAY2"), "framecorners-DISPLAY2");
        assert!(is_frame_label("frame-DISPLAY1"));
        assert!(is_frame_label("framecorners-DISPLAY1"));
        assert!(!is_frame_label("dock"));
        assert!(!is_frame_label("menubar"));
        // the ring's prefix must not match the corners' label by accident
        assert!(!ring_label("X").starts_with(CORNERS_PREFIX));
    }
}
