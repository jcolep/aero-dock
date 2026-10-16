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
//! * **The corner pieces.** A maximised app's corners are square, and nothing is done to the app's window. Over each
//!   corner of the opening that an app's corner is in, a piece of the margin is laid: four small native windows per
//!   monitor, on top, drawn pixel by pixel with what the margin is there (the wallpaper under its glass, and the glass
//!   border), anti-aliased along the opening's curve (see `platform/windows/corners.rs`, which draws them, and
//!   `platform/windows/shaper.rs`, which says which corners are held: a fullscreen window holds none).
//! * **The hook.** The menu bar and dock tell the frame when how much they
//!   claim changes, and it lays out again.

use std::collections::HashMap;
use std::sync::atomic::{AtomicBool, Ordering};

use parking_lot::Mutex;
use tauri::{AppHandle, Manager, WebviewWindow};
use windows::Win32::Foundation::HWND;
use windows::Win32::Graphics::Gdi::{
    CombineRgn, CreateRectRgn, CreateRoundRectRgn, DeleteObject, HRGN, RGN_DIFF,
};

use crate::commands::dock::on_main_thread;
use crate::core::settings::{DockEdge, Settings, SettingsStore};
use crate::core::{AeroError, AeroResult};
use crate::platform::windows::appbar::{self, Owner};
use crate::platform::windows::monitors::{enumerate_monitors, MonitorInfoEx, Rect};
use crate::platform::windows::corners::{self, Ground};
use crate::platform::windows::screenpick::Picture;
use crate::platform::windows::shaper::{self, Opening};
use crate::platform::windows::{anchor, dock_window};

const RING_PREFIX: &str = "frame-";

/// The edges, in the order the per-edge arrays here use.
const EDGES: [DockEdge; 4] = [DockEdge::Top, DockEdge::Right, DockEdge::Bottom, DockEdge::Left];

/// Whether a window label belongs to the frame.
pub fn is_frame_label(label: &str) -> bool {
    label.starts_with(RING_PREFIX)
}

/// The part of a monitor's device name a window label can hold.
fn tail(monitor_name: &str) -> String {
    monitor_name.chars().filter(|c| c.is_ascii_alphanumeric()).collect()
}

fn ring_label(monitor_name: &str) -> String {
    format!("{RING_PREFIX}{}", tail(monitor_name))
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

/// Hidden anchor windows by monitor name, as raw handles, in the order of
/// [`EDGES`].
static ANCHORS: Mutex<Vec<(String, [isize; 4])>> = Mutex::new(Vec::new());

/// The last geometry placed for each monitor, so a repeat is skipped.
/// Where each monitor's frame was last laid out, and its scale: what the corner pieces are placed from between layouts.
static PLACED: std::sync::LazyLock<Mutex<HashMap<String, (Geometry, f64)>>> = std::sync::LazyLock::new(|| Mutex::new(HashMap::new()));

static LAST: std::sync::LazyLock<Mutex<HashMap<String, Geometry>>> =
    std::sync::LazyLock::new(|| Mutex::new(HashMap::new()));

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

/// Place the frame on one monitor: its strips, its ring and its corner pieces. Main thread only.
fn layout_monitor(
    app: &AppHandle,
    monitor: &MonitorInfoEx,
    settings: &Settings,
) -> AeroResult<Option<Opening>> {
    let Some(ring) = window_of(app, &ring_label(&monitor.name)) else {
        // built a moment from now; the next layout places it
        crate::trace!("frame {}: no ring yet", monitor.name);
        return Ok(None);
    };
    let Some(ring_hwnd) = hwnd_of(&ring) else {
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
    // the ring is not the dock's: it is never in the way of what is under it, and keeps its title bar off like the
    // menu bar does
    dock_window::apply_dock_styles(ring_hwnd)?;
    dock_window::keep_caption_off(ring_hwnd);
    if changed {
        dock_window::set_bounds(ring_hwnd, g.x, g.y, g.w, g.h)?;
        dock_window::set_region(ring_hwnd, unsafe { ring_region(&g) })?;
        LAST.lock().insert(monitor.name.clone(), g);
    }
    // shown only now it is in place, so it never appears in the wrong spot
    if !ring.is_visible().unwrap_or(false) {
        let _ = ring.show();
    }
    let _ = ring.set_always_on_bottom(true);
    let opening = Rect { x: g.x + g.pad, y: g.y + g.pad, width: g.w - 2 * g.pad, height: g.h - 2 * g.pad };
    PLACED.lock().insert(monitor.name.clone(), (g, monitor.scale));
    place_corners(app, &monitor.name, monitor.scale, settings, &g);
    Ok(Some(Opening { monitor: monitor.name.clone(), screen: monitor.bounds, rect: opening, radius: g.radius }))
}

/// Lay the corner pieces over the corners of the opening that have an app's own corner in them (a maximised app holds
/// all four, one snapped to a side two, one snapped to a quarter one), once it has arrived there, and take them off
/// the others. What is under them is looked at ahead of time, so a piece is ready the moment it is wanted. Main
/// thread only.
fn place_corners(app: &AppHandle, name: &str, scale: f64, settings: &Settings, g: &Geometry) {
    let opening = Rect { x: g.x + g.pad, y: g.y + g.pad, width: g.w - 2 * g.pad, height: g.h - 2 * g.pad };
    let pieces = [0, 1, 2, 3].map(|corner| corners::Piece { corner, opening, radius: g.radius, frame_top: g.y, frame_height: g.h });
    let grounds = grounds_for(app, name, &pieces, g.pad);
    let mask = if g.radius <= 0 { 0 } else { shaper::cover_mask(name) };
    crate::trace!("corners {name}: held {mask:04b}, ground {}", if grounds.is_some() { "ready" } else { "not yet" });
    match grounds {
        Some(grounds) if mask != 0 => corners::show(name, pieces, &grounds, &look(settings, scale, g.pad), mask),
        // nothing to cover, or what is under the pieces is still being looked at (they are laid when it has been)
        _ => corners::hide(name),
    }
}

/// How the margin looks, for the pieces: the glass as the frame's page draws it, and the border as wide as the ring
/// draws it (FrameApp: as wide as asked, but never past the margin, nor here past the curve).
fn look(settings: &Settings, scale: f64, pad: i32) -> corners::Look {
    let f = &settings.frame;
    let pad_css = (pad as f64 / scale).round() as u32;
    let border = if f.glass_border && pad_css > 1 { f.border_width.min(pad_css - 1).min(f.corner_radius) } else { 0 };
    corners::Look { glass: *GLASS.lock(), border: (border as f64 * scale).round() as f32 }
}

/// The margin's glass, as the frame's page reported it (see `report_frame_glass`).
static GLASS: Mutex<Option<[f32; 4]>> = Mutex::new(None);

/// The frame's page says what color its glass is (the computed fill of `.frame-glass`), so that the corner pieces
/// lay the very same over the wallpaper. Sent when the page starts and whenever the theme or tint changes.
#[tauri::command]
pub fn report_frame_glass(app: AppHandle, color: String) {
    let parsed = corners::parse_css_color(&color);
    let changed = std::mem::replace(&mut *GLASS.lock(), parsed) != parsed;
    if changed {
        corners_later(&app);
    }
}

/// What the margin looks like beside each corner of the opening, in the order top left, top right, bottom right,
/// bottom left: a few pixels of it, on either side of the corner, in a picture of the screen (the glass over the
/// wallpaper). A piece whose wallpaper cannot be had is drawn in this.
fn corner_colors(seen: &Picture, opening: &Rect, pad: i32, radius: i32) -> [[u8; 3]; 4] {
    // in the middle of the margin: clear of the glass border along the opening's edge, and of whatever is beyond the
    // margin (the menu bar, the dock, the screen edge)
    let d = (pad / 2).max(2);
    let (x, y) = (opening.x, opening.y);
    let (right, bottom) = (opening.x + opening.width - 1, opening.y + opening.height - 1);
    // along the margin from the corner, past the curve
    let along = [radius + 6, radius + 14, radius + 22];
    let mean = |pts: Vec<(i32, i32)>| seen.mean(&pts).unwrap_or([0, 0, 0]);
    [
        mean(along.iter().flat_map(|a| [(x + a, y - d), (x - d, y + a)]).collect()),
        mean(along.iter().flat_map(|a| [(right - a, y - d), (right + d, y + a)]).collect()),
        mean(along.iter().flat_map(|a| [(right - a, bottom + d), (right + d, bottom - a)]).collect()),
        mean(along.iter().flat_map(|a| [(x + a, bottom + d), (x - d, bottom - a)]).collect()),
    ]
}

/// What is under each of a monitor's pieces: the wallpaper, where the desktop's own picture of it lines up with the
/// margin as seen beside the corner (checked along the margin, so a monitor the shell lays out differently falls back
/// to the color), or the margin's color as seen. The second value says whether any corner fell back: that may only
/// have been a window over the margin at the time, so it is looked at again later.
fn look_under(pieces: &[corners::Piece; 4], pad: i32) -> ([Ground; 4], bool) {
    use crate::platform::windows::screenpick::lines_up;
    let opening = pieces[0].opening;
    let radius = pieces[0].radius;
    // the opening and its margin: everything looked at is in here
    let area = Rect { x: opening.x - pad, y: opening.y - pad, width: opening.width + 2 * pad, height: opening.height + 2 * pad };
    let d = (pad / 2).max(2);
    let (x, y) = (opening.x, opening.y);
    let (right, bottom) = (opening.x + opening.width - 1, opening.y + opening.height - 1);
    // along the margin beside each corner, both ways, past the curve
    let margin: [Vec<(i32, i32)>; 4] = [(x, y, 1, 1), (right, y, -1, 1), (right, bottom, -1, -1), (x, bottom, 1, -1)].map(|(cx, cy, sx, sy)| {
        (radius + 2..radius + 50).step_by(2).flat_map(|a| [(cx + sx * a, cy - sy * d), (cx - sx * d, cy + sy * a)]).collect()
    });
    let desk = Picture::desktop();
    let mut flat = [[0u8; 3]; 4];
    let mut lined = [false; 4];
    // a few looks, a moment apart: a mote of the ambient scene drifting through the margin can upset one
    for attempt in 0..3 {
        if attempt > 0 {
            std::thread::sleep(std::time::Duration::from_millis(120));
        }
        let Some(seen) = Picture::screen(&area) else { continue };
        if attempt == 0 {
            flat = corner_colors(&seen, &opening, pad, radius);
        }
        let Some(desk) = &desk else { break };
        for k in 0..4 {
            if !lined[k] {
                let (a, b): (Vec<_>, Vec<_>) = margin[k].iter().filter_map(|&(px, py)| Some((seen.rgb(px, py)?, desk.rgb(px, py)?))).unzip();
                lined[k] = lines_up(&a, &b);
            }
        }
        if lined.iter().all(|l| *l) {
            break;
        }
    }
    crate::trace!("corners: opening {opening:?}, pad {pad}, radius {radius}, desktop {}, lined up {lined:?}", desk.is_some());
    let mut fell_back = false;
    let grounds = [0, 1, 2, 3].map(|k| {
        let (px, py) = pieces[k].origin();
        let size = pieces[k].size();
        match desk.as_ref().filter(|_| lined[k]).and_then(|desk| desk.pixels(px, py, size, size)) {
            Some(rgb) => Ground::Wallpaper(rgb),
            None => {
                fell_back = true;
                Ground::Flat(flat[k])
            }
        }
    });
    (grounds, fell_back)
}
/// What is under a monitor's pieces, as last looked at, for the opening and radius it was looked at for.
struct Grounds {
    key: (Rect, i32),
    grounds: Option<[Ground; 4]>,
    /// A corner fell back to the color; looked at again (a few times, further apart) when the pieces are next laid.
    fell_back: bool,
    tries: u32,
    next_try: std::time::Instant,
    /// A look is under way.
    busy: bool,
}

static GROUNDS: std::sync::LazyLock<Mutex<HashMap<String, Grounds>>> = std::sync::LazyLock::new(|| Mutex::new(HashMap::new()));

/// What is under a monitor's pieces, if it has been looked at for this opening; and if it has not (or a corner fell
/// back and it is time to look again), a look started off this thread (the desktop drawn whole, some tens of
/// milliseconds), after which the pieces are placed again.
fn grounds_for(app: &AppHandle, monitor: &str, pieces: &[corners::Piece; 4], pad: i32) -> Option<[Ground; 4]> {
    let key = (pieces[0].opening, pieces[0].radius);
    let now = std::time::Instant::now();
    let mut all = GROUNDS.lock();
    let entry = all
        .entry(monitor.to_string())
        .or_insert_with(|| Grounds { key, grounds: None, fell_back: false, tries: 0, next_try: now, busy: false });
    if entry.key != key {
        *entry = Grounds { key, grounds: None, fell_back: false, tries: 0, next_try: now, busy: false };
    }
    let look_again = entry.grounds.is_none() || (entry.fell_back && entry.tries < 6 && now >= entry.next_try);
    if look_again && !entry.busy && pieces[0].radius > 0 {
        entry.busy = true;
        let (app, monitor, pieces) = (app.clone(), monitor.to_string(), *pieces);
        crate::trace!("corners {monitor}: looking at what is under them");
        let spawned = std::thread::Builder::new().name("frame-corner-look".into()).spawn(move || {
            let (grounds, fell_back) = look_under(&pieces, pad);
            crate::trace!("corners {monitor}: looked (fell back to a color: {fell_back})");
            let again = {
                let mut all = GROUNDS.lock();
                match all.get_mut(&monitor) {
                    Some(entry) if entry.key == key => {
                        entry.busy = false;
                        entry.tries += 1;
                        let wait = std::time::Duration::from_secs(3 * entry.tries as u64);
                        entry.next_try = std::time::Instant::now() + wait;
                        entry.grounds = Some(grounds);
                        entry.fell_back = fell_back;
                        (fell_back && entry.tries < 6).then_some(wait)
                    }
                    Some(entry) => {
                        entry.busy = false;
                        None
                    }
                    None => None,
                }
            };
            corners_later(&app);
            // A corner fell back to the color, perhaps because a window was crossing the margin (the shell moves the
            // snapped and maximised ones when the frame takes its strips): look again a little later, whether or not
            // anything else lays the frame out by then.
            if let Some(wait) = again {
                std::thread::sleep(wait);
                corners_later(&app);
            }
        });
        if spawned.is_err() {
            entry.busy = false;
        }
    }
    entry.grounds.clone()
}

/// Wait for the wallpaper to change, for as long as the app runs, and when it has, look at what is under the corners
/// again. Windows writes the wallpaper's settings under `HKCU\Control Panel\Desktop` whenever it changes (a new picture
/// from Personalisation, a slideshow moving on, Spotlight), so the registry is asked to say when that key changes, and
/// nothing is done in between: no polling, and nothing the ambient scene drifting through the margin could be
/// mistaken for.
fn watch_wallpaper(app: AppHandle) {
    use windows::core::w;
    use windows::Win32::System::Registry::{
        RegCloseKey, RegNotifyChangeKeyValue, RegOpenKeyExW, HKEY, HKEY_CURRENT_USER, KEY_NOTIFY, REG_NOTIFY_CHANGE_LAST_SET,
    };
    let _ = std::thread::Builder::new().name("frame-wallpaper".into()).spawn(move || unsafe {
        let mut key = HKEY::default();
        if RegOpenKeyExW(HKEY_CURRENT_USER, w!("Control Panel\\Desktop"), None, KEY_NOTIFY, &mut key).is_err() {
            log::warn!("could not watch for the wallpaper changing");
            return;
        }
        loop {
            // blocks until a value under the key is written
            if RegNotifyChangeKeyValue(key, false, REG_NOTIFY_CHANGE_LAST_SET, None, false).is_err() {
                break;
            }
            // the new wallpaper fades in over the old for about a second, and is written in several steps
            std::thread::sleep(std::time::Duration::from_millis(1500));
            GROUNDS.lock().clear();
            corners_later(&app);
        }
        let _ = RegCloseKey(key);
    });
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

/// Take the frame off every window it has shaped. Called when Liquidock quits
/// as well as when the frame goes: a window left with its region would stay
/// clipped to the size it had.
pub fn shutdown() {
    shaper::set_openings(Vec::new());
}

/// Place only the corner pieces again, from where each monitor's frame was last laid out: what is wanted when the
/// corners held change (every maximise, restore and snap), when what is under them has been looked at, or when the
/// glass changes color. Nothing else of the frame (its strips, its ring) is touched. Main thread only.
fn corners_all(app: &AppHandle) {
    let settings = app.state::<SettingsStore>().get();
    if !settings.frame.enabled {
        return;
    }
    let placed: Vec<(String, Geometry, f64)> = PLACED.lock().iter().map(|(n, (g, s))| (n.clone(), *g, *s)).collect();
    for (name, g, scale) in placed {
        place_corners(app, &name, scale, &settings, &g);
    }
}

/// Place the corner pieces again soon, on the main thread, without waiting.
pub fn corners_later(app: &AppHandle) {
    let handle = app.clone();
    if let Err(e) = app.run_on_main_thread(move || corners_all(&handle)) {
        log::warn!("could not queue the frame's corners: {e}");
    }
}

/// Lay out the frame soon, on the main thread, without waiting.
pub fn layout_later(app: &AppHandle) {
    let handle = app.clone();
    if let Err(e) = app.run_on_main_thread(move || layout_all(&handle)) {
        log::warn!("could not queue the frame for laying out: {e}");
    }
}

/// Set the frame up: have the menu bar and dock tell it when their claims change, and watch for the wallpaper changing.
/// Once, at startup.
pub fn init(app: &AppHandle) {
    let handle = app.clone();
    appbar::set_claims_hook(move || layout_later(&handle));
    watch_wallpaper(app.clone());
    let handle = app.clone();
    shaper::set_changed_hook(move || corners_later(&handle));
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
    crate::trace!("frame: sync");
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
        let keep = wanted.iter().any(|n| label == ring_label(n));
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
        let label = ring_label(name);
        if app.get_webview_window(&label).is_none() {
            if let Err(e) = build_window(app, &label).await {
                log::warn!("could not build {label}: {e}");
            }
        }
    }

    // Frame mode on for every monitor, then the bar and the dock placed again
    // so that they claim instead of registering, then the frame laid out
    // around what they claim.
    let origins: Vec<(i32, i32)> = monitors.iter().map(|m| (m.bounds.x, m.bounds.y)).collect();
    let handle = app.clone();
    let placed = on_main_thread(app, move || {
        // the pieces of monitors that went away
        corners::forget_except(&wanted);
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
    GROUNDS.lock().clear();
    let done = on_main_thread(app, move || {
        corners::forget_except(&[]);
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

/// Build a monitor's ring, hidden: transparent, undecorated, out of the taskbar and Alt-Tab, kept behind.
async fn build_window(app: &AppHandle, label: &str) -> AeroResult<()> {
    let url = "index.html?window=frame".to_string();
    let builder = tauri::WebviewWindowBuilder::new(app, label, tauri::WebviewUrl::App(url.into()))
        .title("")
        .inner_size(800.0, 600.0)
        .transparent(true)
        .decorations(false)
        .always_on_bottom(true)
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
        assert!(is_frame_label("frame-DISPLAY1"));
        assert!(!is_frame_label("dock"));
        assert!(!is_frame_label("menubar"));
    }
}
