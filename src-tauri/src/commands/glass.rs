//! Real frosted glass: what is behind a surface, blurred.
//!
//! Two ways, because the system's blur is only ever a rectangle (see `platform::windows::backdrop`):
//!
//! * The dock, the Start menu and whatever else is rounded: a page asks for a picture of the screen
//!   behind a region of its window (`capture_backdrop`), already shrunk and blurred, with our own
//!   windows left out of it (see `platform::windows::backdrop_capture`), and paints it under its glass,
//!   where the glass's own shape clips it, antialiased, to any corner.
//! * The menu bar, which is nearly a rectangle: a pane, a plain window with the system's blur on kept
//!   just under it, made here from the bar's settings.
//!
//! The frame's ring is not blurred: it is cut to its shape with a region, and the system's blur
//! ignores regions.
//!
//! The pane runs on the main thread, which owns the windows.

use std::collections::HashMap;
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use tauri::{AppHandle, Manager, WebviewWindow};
use windows::Win32::Foundation::{HWND, RECT};
use windows::Win32::UI::HiDpi::GetDpiForWindow;
use windows::Win32::UI::WindowsAndMessaging::{GetWindowRect, IsWindow, IsWindowVisible};

use crate::core::settings::SettingsStore;
use crate::core::AeroResult;
use crate::platform::windows::backdrop;
use crate::platform::windows::backdrop_capture;
use crate::platform::windows::monitors::Rect;

/// Where a dock's bar is within its window, in physical pixels, and its
/// corner radius, while it is on screen.
#[derive(Debug, Clone, Copy, PartialEq)]
struct Bar {
    rel: Rect,
    radius: i32,
    shown: bool,
}

/// Whether the blur was last found to be on, and when.
static BLUR_CACHE: Mutex<Option<(Instant, bool)>> = Mutex::new(None);

/// The docks' bars by dock window handle.
static BARS: Mutex<Option<HashMap<isize, Bar>>> = Mutex::new(None);

/// Whether blur was last switched on or off on each frame ring, so a repeat is
/// not asked of the system again.
static RINGS: Mutex<Option<HashMap<isize, bool>>> = Mutex::new(None);

/// Which look-again is the latest asked for (see `settle_later`).
static SETTLE_ASKED: AtomicU64 = AtomicU64::new(0);

/// A pane held inside a bar that is moving is to be looked at again once the bar has stood still,
/// to be put exactly under it. Only the latest ask is answered.
fn settle_later(app: &AppHandle) {
    let ask = SETTLE_ASKED.fetch_add(1, Ordering::SeqCst) + 1;
    let handle = app.clone();
    std::thread::spawn(move || {
        std::thread::sleep(Duration::from_millis(150));
        if SETTLE_ASKED.load(Ordering::SeqCst) == ask {
            sync_later(&handle);
        }
    });
}

fn hwnd_of(window: &WebviewWindow) -> Option<HWND> {
    window.hwnd().ok().map(|h| HWND(h.0))
}

/// What a dock's page reports about its bar, in the page's own pixels.
#[derive(Debug, Clone, Copy, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BarReport {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
    pub radius: f64,
    /// False once the bar has slid away, or the dock is going.
    pub shown: bool,
    /// How many physical pixels the page's pixel is (its `devicePixelRatio`), which is
    /// right for the screen the page is on at this moment; the window's own idea of its
    /// scale can be that of another screen for a while after it has been moved.
    #[serde(default)]
    pub dpr: Option<f64>,
}

/// A dock's page says where its bar is, or that it has slid away or gone. (Where the Start menu
/// rests is worked out from it.)
#[tauri::command]
pub fn report_dock_bar(window: WebviewWindow, bar: BarReport) -> AeroResult<()> {
    let BarReport { x, y, width, height, radius, shown, dpr } = bar;
    let Some(hwnd) = hwnd_of(&window) else { return Ok(()) };
    let scale = dpr.filter(|d| *d > 0.1).unwrap_or_else(|| dpi_scale(hwnd));
    let px = |v: f64| (v * scale).round() as i32;
    let bar = Bar {
        rel: Rect { x: px(x), y: px(y), width: px(width), height: px(height) },
        radius: px(radius.max(0.0)),
        shown: shown && width >= 1.0 && height >= 1.0,
    };
    BARS.lock().get_or_insert_with(HashMap::new).insert(hwnd.0 as isize, bar);
    Ok(())
}

/// How many physical pixels a logical one is on the screen a window is on now (the
/// system's answer, not what the window toolkit last remembered).
pub fn dpi_scale(hwnd: HWND) -> f64 {
    let dpi = unsafe { GetDpiForWindow(hwnd) };
    if dpi == 0 { 1.0 } else { dpi as f64 / 96.0 }
}

/// Whether the blur is on: the setting, and not while transparency is to be reduced. Looked
/// up at most twice a second, since pages ask for pictures several times a second.
fn blur_on(app: &AppHandle) -> bool {
    let mut cache = BLUR_CACHE.lock();
    if let Some((at, on)) = *cache {
        if at.elapsed() < Duration::from_millis(500) {
            return on;
        }
    }
    let settings = app.state::<SettingsStore>().get();
    let reduce = crate::platform::windows::accessibility::effective(
        &settings.accessibility.reduce_transparency,
        crate::platform::windows::accessibility::read().reduce_transparency,
    );
    let on = settings.appearance.real_blur && !reduce;
    *cache = Some((Instant::now(), on));
    on
}

/// Where each dock's bar is on screen now, in physical pixels (only those that are showing).
pub fn dock_bar_rects() -> Vec<RECT> {
    let bars: HashMap<isize, Bar> = BARS.lock().clone().unwrap_or_default();
    let mut out = Vec::new();
    for (key, bar) in bars {
        let hwnd = HWND(key as *mut _);
        let mut at = RECT::default();
        if bar.shown
            && unsafe { IsWindow(Some(hwnd)).as_bool() }
            && unsafe { IsWindowVisible(hwnd).as_bool() }
            && unsafe { GetWindowRect(hwnd, &mut at) }.is_ok()
        {
            out.push(RECT {
                left: at.left + bar.rel.x,
                top: at.top + bar.rel.y,
                right: at.left + bar.rel.x + bar.rel.width,
                bottom: at.top + bar.rel.y + bar.rel.height,
            });
        }
    }
    out
}

/// What a page asks for: a blurred picture of the screen behind a region of its window.
#[derive(Debug, Clone, Copy, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BackdropRequest {
    /// The region, in the page's pixels from the window's top left.
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
    /// The page's `devicePixelRatio`.
    pub dpr: Option<f64>,
    /// The blur, as a CSS `blur()` would say it (a spread in the page's pixels), and the
    /// `saturate()` and `brightness()` to be laid on it.
    pub blur: f64,
    pub saturate: f64,
    pub brightness: f64,
}

/// What a request comes to, in the screen's terms: the region, where its window is, and the look.
struct BackdropPlan {
    region: Rect,
    window_x: i32,
    window_y: i32,
    sigma: f32,
    saturate: f32,
    brightness: f32,
}

/// None when there is to be no picture: the blur is off, or the window is not there to be behind.
fn plan_backdrop(app: &AppHandle, window: &WebviewWindow, request: &BackdropRequest) -> Option<BackdropPlan> {
    if !blur_on(app) {
        return None;
    }
    let hwnd = hwnd_of(window)?;
    let mut at = RECT::default();
    if unsafe { GetWindowRect(hwnd, &mut at) }.is_err() || unsafe { !IsWindowVisible(hwnd).as_bool() } {
        return None;
    }
    let scale = request.dpr.filter(|d| *d > 0.1).unwrap_or_else(|| dpi_scale(hwnd));
    let region = Rect {
        x: at.left + (request.x * scale).floor() as i32,
        y: at.top + (request.y * scale).floor() as i32,
        width: (request.width * scale).ceil() as i32,
        height: (request.height * scale).ceil() as i32,
    };
    if region.width < 8 || region.height < 8 || region.width > 8192 || region.height > 8192 {
        return None;
    }
    Some(BackdropPlan {
        region,
        window_x: at.left,
        window_y: at.top,
        sigma: (request.blur * scale) as f32,
        saturate: request.saturate.clamp(0.0, 4.0) as f32,
        brightness: request.brightness.clamp(0.2, 2.0) as f32,
    })
}

/// Four little-endian `i32`s say what the picture is of: where (from the window's top left) and how big, in
/// physical pixels. A PNG follows. An empty answer is "no picture" (the blur is off, or cannot be had).
#[tauri::command]
pub async fn capture_backdrop(
    app: AppHandle,
    window: WebviewWindow,
    request: BackdropRequest,
) -> AeroResult<tauri::ipc::Response> {
    use image::codecs::png::{CompressionType, FilterType, PngEncoder};
    use image::{ExtendedColorType, ImageEncoder};

    let none = || Ok(tauri::ipc::Response::new(Vec::<u8>::new()));
    let Some(plan) = plan_backdrop(&app, &window, &request) else { return none() };
    let picture = tauri::async_runtime::spawn_blocking(move || {
        backdrop_capture::capture(plan.region, plan.sigma, plan.saturate, plan.brightness)
            .map(|p| (p, plan.window_x, plan.window_y))
    })
    .await
    .map_err(|e| crate::core::AeroError::other(format!("the capture failed: {e}")))?;
    let Some((picture, window_x, window_y)) = picture else { return none() };

    let mut bytes = Vec::with_capacity(16 + picture.cols * picture.rows);
    for v in [picture.region.x - window_x, picture.region.y - window_y, picture.region.width, picture.region.height] {
        bytes.extend_from_slice(&v.to_le_bytes());
    }
    PngEncoder::new_with_quality(&mut bytes, CompressionType::Fast, FilterType::NoFilter)
        .write_image(&picture.rgba, picture.cols as u32, picture.rows as u32, ExtendedColorType::Rgba8)
        .map_err(|e| crate::core::AeroError::other(format!("the picture could not be made: {e}")))?;
    Ok(tauri::ipc::Response::new(bytes))
}

/// Make the menu bar's pane and every blur match the settings and where the windows
/// are now. Cheap when nothing moved: each pane remembers what it was last
/// given. Main thread.
pub fn sync_all(app: &AppHandle) {
    let settings = app.state::<SettingsStore>().get();
    // not while transparency is to be reduced, by the setting or by Windows
    let reduce = crate::platform::windows::accessibility::effective(
        &settings.accessibility.reduce_transparency,
        crate::platform::windows::accessibility::read().reduce_transparency,
    );
    let on = settings.appearance.real_blur && !reduce;
    *BLUR_CACHE.lock() = Some((Instant::now(), on));

    // ---- the menu bar ----
    let bar_pane = "menubar";
    let mut wanted_bar = None;
    if on && settings.menu_bar.enabled {
        if let Some(window) = app.get_webview_window(crate::commands::menubar::LABEL) {
            if let Some(hwnd) = hwnd_of(&window) {
                let mut at = RECT::default();
                let visible = unsafe { IsWindowVisible(hwnd).as_bool() };
                if visible && unsafe { GetWindowRect(hwnd, &mut at) }.is_ok() {
                    let scale = dpi_scale(hwnd);
                    let gap = (settings.menu_bar.gap as f64 * scale).round() as i32;
                    let height = (settings.menu_bar.height as f64 * scale).round() as i32;
                    let radius = (settings.menu_bar.corner_radius as f64 * scale).round() as i32;
                    let rect = Rect {
                        x: at.left + gap,
                        y: at.top + gap,
                        width: (at.right - at.left) - 2 * gap,
                        height,
                    };
                    wanted_bar = Some((hwnd, (rect, radius, gap == 0)));
                }
            }
        }
    }
    let settling = match wanted_bar {
        Some((hwnd, shape)) => backdrop::set_pane(bar_pane, hwnd, Some(shape)),
        None => {
            // no window to sit under now; hide whatever pane there was
            backdrop::set_pane(bar_pane, HWND::default(), None)
        }
    };
    if settling {
        settle_later(app);
    }

    // ---- docks that have gone ----
    let mut guard = BARS.lock();
    if let Some(map) = guard.as_mut() {
        map.retain(|key, _| unsafe { IsWindow(Some(HWND(*key as *mut _))).as_bool() });
    }
    drop(guard);

    // ---- the frame ----
    for window in app.webview_windows().into_values() {
        let label = window.label();
        if label.starts_with("frame-") {
            if let Some(hwnd) = hwnd_of(&window) {
                // Never blurred for now. The ring is a window the size of the screen cut to its shape with a
                // region, and the system's blur ignores a region (see `backdrop::tile_rects`): it would blur
                // the whole screen behind it. Its margin is plain strips and could be tiles like the bars'.
                let want = false;
                let mut guard = RINGS.lock();
                let rings = guard.get_or_insert_with(HashMap::new);
                if rings.insert(hwnd.0 as isize, want) != Some(want) {
                    backdrop::set_blur(hwnd, want);
                }
            }
        }
    }
}

/// Queue [`sync_all`] on the main thread, from anywhere.
pub fn sync_later(app: &AppHandle) {
    let handle = app.clone();
    let _ = app.run_on_main_thread(move || sync_all(&handle));
}

/// A written account of the frosted glass now, to say what is on a screen when it looks wrong: the
/// screens, the docks and their bars, the Start window, the menu bar's pane, and a picture taken of
/// a corner of the primary screen to say whether the magnifier works here and how long it takes.
#[tauri::command]
pub async fn blur_report(app: AppHandle) -> AeroResult<String> {
    let mut lines = Vec::new();
    let describe = |hwnd: HWND| -> String {
        let mut at = RECT::default();
        let have = unsafe { GetWindowRect(hwnd, &mut at) }.is_ok();
        format!(
            "window {}x{} at ({}, {}), visible {}, dpi {}",
            if have { at.right - at.left } else { 0 },
            if have { at.bottom - at.top } else { 0 },
            at.left,
            at.top,
            unsafe { IsWindowVisible(hwnd).as_bool() },
            unsafe { GetDpiForWindow(hwnd) },
        )
    };
    for m in crate::platform::windows::monitors::enumerate_monitors()? {
        lines.push(format!(
            "screen {}{}: {}x{} at ({}, {}), scale {}",
            m.name,
            if m.is_primary { " (primary)" } else { "" },
            m.bounds.width,
            m.bounds.height,
            m.bounds.x,
            m.bounds.y,
            m.scale,
        ));
    }
    lines.push(format!("blur on: {}", blur_on(&app)));
    let started = Instant::now();
    let test = tauri::async_runtime::spawn_blocking(|| {
        backdrop_capture::capture(Rect { x: 100, y: 100, width: 600, height: 120 }, 22.0, 1.0, 1.0)
    })
    .await
    .ok()
    .flatten();
    match test {
        Some(p) => lines.push(format!("a picture of 600x120 was taken in {:?} ({}x{} kept)", started.elapsed(), p.cols, p.rows)),
        None => lines.push("no picture could be taken: the glass cannot be blurred on this machine".to_string()),
    }
    for (key, bar) in BARS.lock().clone().unwrap_or_default() {
        let hwnd = HWND(key as *mut _);
        lines.push(format!(
            "dock {key:x}: bar in its window at ({}, {}) {}x{} radius {} shown {}; {}",
            bar.rel.x,
            bar.rel.y,
            bar.rel.width,
            bar.rel.height,
            bar.radius,
            bar.shown,
            describe(hwnd)
        ));
    }
    if let Some(start) = app.get_webview_window(crate::commands::start::LABEL).as_ref().and_then(hwnd_of) {
        lines.push(format!("start: {}", describe(start)));
    }
    for (id, hwnd) in backdrop::pane_windows() {
        lines.push(format!("pane {id}: {}", describe(HWND(hwnd as *mut _))));
    }
    let text = lines.join("\n");
    if let Ok(dir) = crate::core::paths::data_dir(&app) {
        let _ = std::fs::write(dir.join("blur-report.txt"), &text);
    }
    Ok(text)
}
