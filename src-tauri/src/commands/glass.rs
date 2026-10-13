//! Frosted glass: what is behind a surface, blurred, by the compositor.
//!
//! A page says where each piece of its glass is (`set_glass_pane`), in its own pixels, as it appears, moves and
//! goes, and a composition visual beneath the page is put there, painted with what is behind the window, blurred
//! (see `platform::windows::glass`). Nothing is captured or sent back. The dock, the Start menu and the menu bar do
//! it, and none of them do while the frosted glass is switched off (or transparency is to be reduced).
//!
//! The dock also reports where its bar is (`report_dock_bar`): where the Start menu rests is worked out from it.
use std::collections::HashMap;

use parking_lot::Mutex;
use tauri::WebviewWindow;
use windows::Win32::Foundation::{HWND, RECT};
use windows::Win32::UI::HiDpi::GetDpiForWindow;
use windows::Win32::UI::WindowsAndMessaging::{GetWindowRect, IsWindow, IsWindowVisible};

use crate::core::AeroResult;
use crate::platform::windows::monitors::Rect;
/// Where a dock's bar is within its window, in physical pixels, and its
/// corner radius, while it is on screen.
#[derive(Debug, Clone, Copy, PartialEq)]
struct Bar {
    rel: Rect,
    radius: i32,
    shown: bool,
}

/// The docks' bars by dock window handle.
static BARS: Mutex<Option<HashMap<isize, Bar>>> = Mutex::new(None);

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
    let mut guard = BARS.lock();
    let bars = guard.get_or_insert_with(HashMap::new);
    bars.insert(hwnd.0 as isize, bar);
    // a dock that has gone is not remembered
    bars.retain(|key, _| unsafe { IsWindow(Some(HWND(*key as *mut _))).as_bool() });
    Ok(())
}

/// How many physical pixels a logical one is on the screen a window is on now (the
/// system's answer, not what the window toolkit last remembered).
pub fn dpi_scale(hwnd: HWND) -> f64 {
    let dpi = unsafe { GetDpiForWindow(hwnd) };
    if dpi == 0 { 1.0 } else { dpi as f64 / 96.0 }
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

/// What a page says about a piece of its glass, in its own pixels.
#[derive(Debug, Clone, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PaneReport {
    /// Which piece, within the window.
    pub id: String,
    /// False: take it away.
    pub shown: bool,
    #[serde(default)]
    pub x: f64,
    #[serde(default)]
    pub y: f64,
    #[serde(default)]
    pub width: f64,
    #[serde(default)]
    pub height: f64,
    #[serde(default)]
    pub radius: f64,
    /// How much of the blur shows, 0 to 1.
    #[serde(default = "one")]
    pub opacity: f64,
    /// The page's `devicePixelRatio`.
    #[serde(default)]
    pub dpr: Option<f64>,
}

fn one() -> f64 {
    1.0
}

/// A page puts a piece of glass under itself, moves it, or takes it away.
#[tauri::command]
pub fn set_glass_pane(window: WebviewWindow, pane: PaneReport) -> AeroResult<()> {
    let Some(hwnd) = hwnd_of(&window) else { return Ok(()) };
    let scale = pane.dpr.filter(|d| *d > 0.1).unwrap_or_else(|| dpi_scale(hwnd)) as f32;
    let place = (pane.shown && pane.width >= 1.0 && pane.height >= 1.0).then(|| crate::platform::windows::glass::Place {
        x: pane.x as f32 * scale,
        y: pane.y as f32 * scale,
        width: pane.width as f32 * scale,
        height: pane.height as f32 * scale,
        radius: pane.radius.max(0.0) as f32 * scale,
        opacity: pane.opacity as f32,
    });
    let raw = hwnd.0 as isize;
    let id = pane.id;
    // composition belongs to the main thread
    window.run_on_main_thread(move || {
        match crate::platform::windows::glass::set_pane(HWND(raw as *mut _), &id, place) {
            Ok(()) => crate::trace!("glass: {id} {place:?}"),
            Err(e) => {
                crate::trace!("glass: could not place {id}: {e}");
                log::warn!("could not place the glass: {e}");
            }
        }
    })?;
    Ok(())
}
