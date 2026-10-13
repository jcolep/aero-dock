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
//! * **The corner pieces.** A maximised app's corners are square, and nothing is done to the app's window. A second
//!   small window, kept on top, is clipped to the four little pieces of each corner of the opening that are outside
//!   its rounded edge, and draws the margin's colour there, anti-aliased along the curve, so the app's corners are
//!   behind the frame and it looks to have rounded ones (see `platform/windows/shaper.rs`, which says when an app
//!   fills the opening, and `corner_colours`, which reads what the margin looks like beside each corner). It is
//!   hidden while a fullscreen app, game or video is running.
//! * **The hook.** The menu bar and dock tell the frame when how much they
//!   claim changes, and it lays out again.

use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};

use parking_lot::Mutex;
use serde::Serialize;
use tauri::{AppHandle, Manager, WebviewWindow};
use windows::Win32::Foundation::HWND;
use windows::Win32::Graphics::Gdi::{
    CombineRgn, CreateRectRgn, CreateRoundRectRgn, DeleteObject, HRGN, RGN_DIFF, RGN_OR,
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

/// How far inside the ideal curve the corner pieces' window reaches, in pixels. The page draws each piece anti-aliased
/// along the ideal curve, and a pixel only blends if the window has it, so the window has to take in the pixels the
/// curve passes through: a pixel or two inside it, which is where the app's square corner has to be hidden anyway.
const OVERLAP: i32 = 2;

/// The four corner pieces of a window's rectangle (`app`, in the corner window's own coordinates) as a region: in
/// each corner, what is outside its rounded edge and inside its square one. A maximised app's square corners are
/// there, and the corner window draws the margin's colour over them. Nothing else is in it, so the rest of the
/// window takes no clicks and draws nothing. Empty when the corners are square.
unsafe fn corner_region(app: &Rect, radius: i32) -> HRGN {
    unsafe {
        let pieces = CreateRectRgn(0, 0, 0, 0);
        if radius <= 0 {
            return pieces;
        }
        // each corner's square, as far along each edge as the curve reaches
        let reach = radius + OVERLAP;
        let (left, top, right, bottom) = (app.x, app.y, app.x + app.width, app.y + app.height);
        for (x, y) in [(left, top), (right - reach, top), (right - reach, bottom - reach), (left, bottom - reach)] {
            let square = CreateRectRgn(x, y, x + reach, y + reach);
            CombineRgn(Some(pieces), Some(pieces), Some(square), RGN_OR);
            let _ = DeleteObject(square.into());
        }
        // less what is inside the curve: the same curve a couple of pixels in from every edge, so that the pieces take
        // in the pixels the drawn curve passes through
        let inside = round_rect(left + OVERLAP, top + OVERLAP, right - OVERLAP, bottom - OVERLAP, (radius - OVERLAP).max(0));
        CombineRgn(Some(pieces), Some(pieces), Some(inside), RGN_DIFF);
        let _ = DeleteObject(inside.into());
        pieces
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
        // the corner pieces are put in when there is a window to cover (below)
        for (hwnd, region) in [(ring_hwnd, unsafe { ring_region(&g) }), (corners_hwnd, unsafe { CreateRectRgn(0, 0, 0, 0) })] {
            dock_window::set_bounds(hwnd, g.x, g.y, g.w, g.h)?;
            dock_window::set_region(hwnd, region)?;
        }
        LAST.lock().insert(monitor.name.clone(), g);
        PIECES.lock().remove(corners.label());
    }
    // shown only now it is in place, so it never appears in the wrong spot
    if !ring.is_visible().unwrap_or(false) {
        let _ = ring.show();
    }
    let _ = ring.set_always_on_bottom(true);
    let _ = corners.set_always_on_top(true);
    // The corner pieces are over the maximised app on top, if it is the one that fills the opening, once it has
    // arrived. They are put where that app's own corners are (which is the opening's, or a few pixels off for one
    // that has not been told of a change to the work area), in the colour of the margin beside each, looked at
    // before the window is shown so that what is read is the margin and not the pieces.
    let cover = if FULLSCREEN.load(Ordering::Relaxed) || g.radius <= 0 { None } else { shaper::cover_rect(&monitor.name) };
    if let Some(app_rect) = cover {
        // in the corner window's own coordinates
        let rel = Rect { x: app_rect.x - g.x, y: app_rect.y - g.y, width: app_rect.width, height: app_rect.height };
        let wanted = (rel, g.radius);
        if PIECES.lock().get(corners.label()) != Some(&wanted) {
            let region = unsafe { corner_region(&rel, g.radius) };
            if dock_window::set_region(corners_hwnd, region).is_ok() {
                PIECES.lock().insert(corners.label().to_string(), wanted);
            }
        }
        // off this thread: the first look at the wallpaper under the pieces takes a few tens of milliseconds
        {
            let (app, label, pad, radius) = (app.clone(), corners.label().to_string(), g.pad, g.radius);
            std::thread::spawn(move || paint_corners(&app, &label, &app_rect, &rel, pad, radius));
        }
        let mut covering = COVERING.lock();
        covering.retain(|c| c.label != corners.label());
        covering.push(Covering { label: corners.label().to_string(), screen: app_rect, rel, pad: g.pad, radius: g.radius });
    } else {
        COVERING.lock().retain(|c| c.label != corners.label());
    }
    set_corners_visible(&corners, cover.is_some());    Ok(Some(Opening {
        monitor: monitor.name.clone(),
        screen: monitor.bounds,
        rect: Rect { x: g.x + g.pad, y: g.y + g.pad, width: g.w - 2 * g.pad, height: g.h - 2 * g.pad },
        radius: g.radius,
    }))
}

/// What the margin looks like beside each corner of a window's rectangle, as `#rrggbb`, in the order top left, top
/// right, bottom right, bottom left: a few pixels of it, on either side of the corner, read off the screen. The piece
/// of a corner is drawn in this colour, so it matches the glass whatever the wallpaper is there (a single colour for
/// the whole screen is a poor match for any wallpaper that is not flat).
fn corner_colours(app: &Rect, pad: i32, radius: i32) -> Option<[String; 4]> {
    // in the middle of the margin: clear of the glass border along the opening's edge, and of whatever is beyond the
    // margin (the menu bar, the dock, the screen edge)
    let d = (pad / 2).max(2);
    let (x, y) = (app.x, app.y);
    let (right, bottom) = (app.x + app.width - 1, app.y + app.height - 1);
    // along the margin from the corner, past the curve
    let along = [radius + 6, radius + 14, radius + 22];
    let hex = |points: Vec<(i32, i32)>| {
        crate::platform::windows::screenpick::mean_colour(&points).map(|[r, g, b]| format!("#{r:02x}{g:02x}{b:02x}"))
    };
    Some([
        hex(along.iter().flat_map(|a| [(x + a, y - d), (x - d, y + a)]).collect())?,
        hex(along.iter().flat_map(|a| [(right - a, y - d), (right + d, y + a)]).collect())?,
        hex(along.iter().flat_map(|a| [(right - a, bottom + d), (right + d, bottom - a)]).collect())?,
        hex(along.iter().flat_map(|a| [(x + a, bottom + d), (x - d, bottom - a)]).collect())?,
    ])
}

/// A square of the wallpaper under a corner piece, in the page's own coordinates, as RGBA rows.
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Patch {
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
    pub rgba: Vec<u8>,
}

/// What the corner window's page draws: where the window it covers is, in the page's own coordinates, how round its
/// corners are, the colour of the margin beside each, and, where it could be had and lines up with what is seen,
/// the wallpaper under each (which the page lays the margin's own glass over, so the piece is the margin).
#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CornerPaint {
    pub colours: [String; 4],
    pub rect: Rect,
    pub radius: i32,
    pub patches: Vec<Option<Patch>>,
}

/// How far along each edge a piece reaches: the curve, and a little more. The page uses the same.
fn piece_reach(rect: &Rect, radius: i32) -> i32 {
    (radius + 4).min(rect.width.min(rect.height) / 2)
}

/// The wallpaper under each corner piece of `screen` (the opening on the screen), placed in the page by `rel`, for
/// each corner whose wallpaper lines up with what is seen in the margin beside it (checked along the margin, so a
/// monitor the shell lays out differently, or a corner with a window over its margin, falls back to the colour).
fn corner_patches(screen: &Rect, rel: &Rect, pad: i32, radius: i32) -> Vec<Option<Patch>> {
    use crate::platform::windows::screenpick::{colours_at, lines_up, Desktop};
    let Some(desk) = Desktop::capture() else { return vec![None, None, None, None] };
    let reach = piece_reach(screen, radius);
    let d = (pad / 2).max(2);
    let (x, y) = (screen.x, screen.y);
    let (right, bottom) = (screen.x + screen.width - 1, screen.y + screen.height - 1);
    let (dx, dy) = (rel.x - screen.x, rel.y - screen.y);
    [(x, y, 1, 1), (right, y, -1, 1), (right, bottom, -1, -1), (x, bottom, 1, -1)]
        .into_iter()
        .map(|(cx, cy, sx, sy)| {
            let mut pts = Vec::new();
            for a in (radius + 2..radius + 50).step_by(2) {
                pts.push((cx + sx * a, cy - sy * d));
                pts.push((cx - sx * d, cy + sy * a));
            }
            let pairs: Vec<([u8; 3], [u8; 3])> = colours_at(&pts)
                .into_iter()
                .zip(&pts)
                .filter_map(|(seen, &(px, py))| Some((seen?, desk.rgb(px, py)?)))
                .collect();
            let (seen, drawn): (Vec<_>, Vec<_>) = pairs.into_iter().unzip();
            if !lines_up(&seen, &drawn) {
                return None;
            }
            // the square from the corner, inward
            let px = if sx > 0 { cx } else { cx - reach + 1 };
            let py = if sy > 0 { cy } else { cy - reach + 1 };
            desk.patch(px, py, reach, reach).map(|rgba| Patch { x: px + dx, y: py + dy, width: reach, height: reach, rgba })
        })
        .collect()
}

/// What was last sent to each corner window, by its label, for a page that starts after it was sent.
static PAINT: Mutex<Vec<(String, CornerPaint)>> = Mutex::new(Vec::new());

/// The pieces last put into each corner window: the rectangle they are round and the radius.
static PIECES: std::sync::LazyLock<Mutex<HashMap<String, (Rect, i32)>>> =
    std::sync::LazyLock::new(|| Mutex::new(HashMap::new()));

/// What each corner window is covering now, so that its colours can be looked at again while it does.
struct Covering {
    label: String,
    screen: Rect,
    rel: Rect,
    pad: i32,
    radius: i32,
}

static COVERING: Mutex<Vec<Covering>> = Mutex::new(Vec::new());

/// How often the colours beside the covered corners are looked at again: the wallpaper can change (a new one, a
/// slideshow), and so can the margin's glass. Twenty-four pixels read and compared; nothing is sent unless they changed.
const REPAINT_EVERY: std::time::Duration = std::time::Duration::from_millis(1500);

/// Look at the colours beside the covered corners every so often, for as long as the app runs.
fn start_repaint(app: AppHandle) {
    let _ = std::thread::Builder::new().name("frame-corner-colours".into()).spawn(move || loop {
        std::thread::sleep(REPAINT_EVERY);
        let now: Vec<(String, Rect, Rect, i32, i32)> =
            COVERING.lock().iter().map(|c| (c.label.clone(), c.screen, c.rel, c.pad, c.radius)).collect();
        for (label, screen, rel, pad, radius) in now {
            paint_corners(&app, &label, &screen, &rel, pad, radius);
        }
    });
}

/// The page asks for what it should draw when it starts (see `paint_corners`).
#[tauri::command]
pub fn frame_corner_colours(label: String) -> Option<CornerPaint> {
    PAINT.lock().iter().find(|(l, _)| *l == label).map(|(_, p)| p.clone())
}

/// Read the colours beside the corners of the window being covered and give them, with where it is, to the corner
/// window's page, if they have changed. `screen` is the window's rectangle on the screen, `rel` in the corner window.
fn paint_corners(app: &AppHandle, label: &str, screen: &Rect, rel: &Rect, pad: i32, radius: i32) {
    use tauri::Emitter;
    let Some(colours) = corner_colours(screen, pad, radius) else { return };
    // The wallpaper under the pieces is looked at again only when the margin beside them has changed (a new
    // wallpaper) or they have moved: it is the desktop drawn whole, tens of milliseconds.
    let previous = PAINT.lock().iter().find(|(l, _)| l == label).map(|(_, p)| p.clone());
    let patches = match previous {
        Some(p) if p.rect == *rel && p.radius == radius && p.colours == colours => p.patches,
        _ => corner_patches(screen, rel, pad, radius),
    };
    let paint = CornerPaint { colours, rect: *rel, radius, patches };
    {
        let mut held = PAINT.lock();
        match held.iter_mut().find(|(l, _)| l == label) {
            Some((_, old)) if *old == paint => return,
            Some((_, old)) => *old = paint.clone(),
            None => held.push((label.to_string(), paint.clone())),
        }
    }
    let _ = app.emit_to(label, "frame://corners", paint);
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
    start_repaint(app.clone());
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
    // the profile is named here, not in the environment: a program started from this one would inherit the
    // environment, and a WebView2 app (DriveWorks) given our profile folder fails to start
    #[cfg(windows)]
    let builder = match crate::core::paths::webview_dir() {
        Some(dir) => builder.data_directory(dir),
        None => builder,
    };
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
    fn the_corner_pieces_are_what_a_square_corner_has_over_a_round_one_and_nothing_else() {
        // a 1000x600 window, 20px margin, 30px corners: the opening is x 20..980, y 20..580, and its rounded corner
        // is cut away from its square one in the first 30px or so along each edge
        let g = geometry(&Rect { x: 0, y: 0, width: 1000, height: 600 }, [0; 4], 20, 30);
        let opening = Rect { x: g.pad, y: g.pad, width: g.w - 2 * g.pad, height: g.h - 2 * g.pad };
        let pieces = unsafe { corner_region(&opening, g.radius) };
        // the very corner of the opening's square is in the piece, at every corner
        assert!(inside(pieces, 21, 21) && inside(pieces, 978, 21));
        assert!(inside(pieces, 21, 578) && inside(pieces, 978, 578));
        // on the curve itself: the pieces reach in as far as the pixels it passes through
        assert!(inside(pieces, 29, 29) && inside(pieces, 971, 571));
        // not well inside the curve, where the app is
        assert!(!inside(pieces, 33, 33) && !inside(pieces, 45, 45) && !inside(pieces, 955, 555));
        // not the margin, and not the opening's middle or its straight edges
        assert!(!inside(pieces, 500, 5) && !inside(pieces, 5, 300) && !inside(pieces, 500, 300));
        assert!(!inside(pieces, 500, 22) && !inside(pieces, 22, 300));
        assert!(!inside(pieces, 500, 578) && !inside(pieces, 978, 300));
        unsafe {
            let _ = DeleteObject(pieces.into());
        }
    }    #[test]
    fn the_pieces_follow_a_window_that_stands_off_the_opening() {
        // File Explorer, maximised eight pixels higher than the opening: its corners are where it is
        let app = Rect { x: 20, y: 12, width: 960, height: 568 };
        let pieces = unsafe { corner_region(&app, 30) };
        assert!(inside(pieces, 21, 13) && inside(pieces, 978, 13), "its own top corners");
        assert!(!inside(pieces, 21, 21 + 40) && !inside(pieces, 500, 14), "and not its edge");
        // the opening's own corner, below it, is the app's
        assert!(!inside(pieces, 40, 40));
        unsafe {
            let _ = DeleteObject(pieces.into());
        }
    }


    #[test]
    fn square_corners_have_no_pieces() {
        let g = geometry(&Rect { x: 0, y: 0, width: 1000, height: 600 }, [0; 4], 20, 0);
        let pieces = unsafe { corner_region(&Rect { x: 20, y: 20, width: 960, height: 560 }, g.radius) };
        assert!(!inside(pieces, 21, 21) && !inside(pieces, 500, 21) && !inside(pieces, 500, 300));
        unsafe {
            let _ = DeleteObject(pieces.into());
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
