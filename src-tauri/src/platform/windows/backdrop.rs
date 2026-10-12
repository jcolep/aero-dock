//! Real frosted glass: Windows blurring what is behind a surface.
//!
//! Aero Dock's windows are transparent web views, and a web view can only blur
//! its own content, so on its own the "glass" is a tint over a sharp desktop.
//! The system can blur what is behind a window (through the undocumented but
//! long-stable `SetWindowCompositionAttribute`), but it does it for the whole
//! window, and the dock's window is far larger than the dock's bar (room for
//! flyouts and tooltips).
//!
//! It is the plain blur, not acrylic. Acrylic lays its own tint and luminosity
//! over the blur, and under a dark system theme that comes out near black, a
//! solid backing where the glass was meant to show the desktop through.
//!
//! So the blur gets windows of its own: a pane is a bare popup, exactly the
//! size of the bar, shaped to its corners by a window region, with the blur
//! switched on, kept directly beneath the window it backs. The web view above
//! it draws the tint and the rest as before, and what shows through is the
//! desktop, blurred. A pane has no content and takes no input.
//!
//! Panes are created and moved on the main thread, which pumps their messages.
//! A pane is only ever as far up as the window it sits under, never above it.

use std::collections::HashMap;
use std::sync::Once;

use parking_lot::Mutex;
use windows::core::{s, w, BOOL};
use windows::Win32::Foundation::{HINSTANCE, HWND, LPARAM, LRESULT, WPARAM};
use windows::Win32::Graphics::Dwm::{DwmSetWindowAttribute, DWMWINDOWATTRIBUTE};
use windows::Win32::Graphics::Gdi::{
    CreateRectRgn, CreateRoundRectRgn, DeleteObject, RedrawWindow, SetWindowRgn, HRGN, RDW_FRAME, RDW_INVALIDATE,
    RDW_UPDATENOW,
};
use windows::Win32::System::LibraryLoader::{GetModuleHandleW, GetProcAddress};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, IsWindow, RegisterClassW, SetWindowPos,
    ShowWindow, HTTRANSPARENT, MA_NOACTIVATE, SWP_NOACTIVATE, SWP_SHOWWINDOW, SW_HIDE, WM_ERASEBKGND,
    WM_MOUSEACTIVATE, WM_NCHITTEST, WNDCLASSW, WS_EX_NOACTIVATE, WS_EX_TOOLWINDOW, WS_EX_TOPMOST, WS_POPUP,
};

use super::monitors::Rect;

static REGISTER: Once = Once::new();

unsafe extern "system" fn proc(hwnd: HWND, msg: u32, wparam: WPARAM, lparam: LPARAM) -> LRESULT {
    match msg {
        // never the target of a click, and never activated
        // nothing is painted: what shows is the blur, not a background
        WM_ERASEBKGND => LRESULT(1),
        WM_NCHITTEST => LRESULT(HTTRANSPARENT as isize),
        WM_MOUSEACTIVATE => LRESULT(MA_NOACTIVATE as isize),
        _ => unsafe { DefWindowProcW(hwnd, msg, wparam, lparam) },
    }
}

// ---- the system's blur ----

/// `WINDOWCOMPOSITIONATTRIBDATA` and `ACCENT_POLICY`, as user32 reads them.
#[repr(C)]
struct AccentPolicy {
    state: u32,
    flags: u32,
    /// ABGR: the tint laid over the blur.
    gradient: u32,
    animation: u32,
}

#[repr(C)]
struct CompositionAttribute {
    attribute: u32,
    data: *mut core::ffi::c_void,
    size: usize,
}

const WCA_ACCENT_POLICY: u32 = 19;
const ACCENT_DISABLED: u32 = 0;
/// A plain blur of what is behind, with no tint of its own: the page above draws
/// the glass's colour.
const ACCENT_ENABLE_BLURBEHIND: u32 = 3;

type SetCompositionAttribute =
    unsafe extern "system" fn(hwnd: HWND, data: *mut CompositionAttribute) -> BOOL;

/// Switch the system's blur on or off behind a window. False if this
/// Windows has no such call (the window is then simply left as it was).
pub fn set_blur(hwnd: HWND, on: bool) -> bool {
    unsafe {
        let Ok(user32) = GetModuleHandleW(w!("user32.dll")) else { return false };
        let Some(found) = GetProcAddress(user32, s!("SetWindowCompositionAttribute")) else {
            return false;
        };
        let set: SetCompositionAttribute = std::mem::transmute(found);
        let mut policy = AccentPolicy {
            state: if on { ACCENT_ENABLE_BLURBEHIND } else { ACCENT_DISABLED },
            // no flags: with the tint flag it would lay the gradient colour over the blur
            flags: 0,
            gradient: 0,
            animation: 0,
        };
        let mut data = CompositionAttribute {
            attribute: WCA_ACCENT_POLICY,
            data: &mut policy as *mut AccentPolicy as *mut _,
            size: std::mem::size_of::<AccentPolicy>(),
        };
        set(hwnd, &mut data).as_bool()
    }
}

// ---- panes ----

struct Pane {
    hwnd: isize,
    /// What it was last placed at, so a repeat is skipped (placing a window and
    /// shaping it both make the system repaint it).
    placed: Option<(Rect, i32, bool)>,
}

static PANES: Mutex<Option<HashMap<String, Pane>>> = Mutex::new(None);

/// A bare pane window, not yet placed (the blur check makes its own).
pub fn make_pane() -> Option<HWND> {
    make()
}

/// The shape of a pane (see `region`), for a pane placed by hand.
pub fn pane_region(x: i32, y: i32, width: i32, height: i32, radius: i32) -> HRGN {
    region(x, y, width, height, radius)
}

fn make() -> Option<HWND> {
    unsafe {
        let instance = HINSTANCE(GetModuleHandleW(None).ok()?.0);
        REGISTER.call_once(|| {
            let class = WNDCLASSW {
                lpfnWndProc: Some(proc),
                hInstance: instance,
                lpszClassName: w!("AeroDockBackdrop"),
                ..Default::default()
            };
            RegisterClassW(&class);
        });
        let hwnd = CreateWindowExW(
            WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE | WS_EX_TOPMOST,
            w!("AeroDockBackdrop"),
            w!(""),
            WS_POPUP,
            0,
            0,
            1,
            1,
            None,
            None,
            Some(instance),
            None,
        )
        .ok()?;
        // Windows 11 rounds the corners of top-level windows itself; the pane
        // is given its own shape
        const DWMWA_WINDOW_CORNER_PREFERENCE: i32 = 33;
        const DWMWCP_DONOTROUND: i32 = 1;
        let _ = DwmSetWindowAttribute(
            hwnd,
            DWMWINDOWATTRIBUTE(DWMWA_WINDOW_CORNER_PREFERENCE),
            &DWMWCP_DONOTROUND as *const i32 as *const _,
            std::mem::size_of::<i32>() as u32,
        );
        Some(hwnd)
    }
}

/// A region for a rounded rectangle in a window's own coordinates, the way the
/// system draws one: a rounded region leaves out its far row and column, so it
/// is asked for one more of each, and no radius is a plain rectangle.
fn region(x: i32, y: i32, width: i32, height: i32, radius: i32) -> HRGN {
    unsafe {
        if radius <= 0 {
            CreateRectRgn(x, y, x + width, y + height)
        } else {
            CreateRoundRectRgn(x, y, x + width + 1, y + height + 1, 2 * radius, 2 * radius)
        }
    }
}

/// Put a pane named `id` at `rect` (screen pixels), corners of `radius`, just
/// beneath `over`; or take it away with `None`. `flush_top` leaves the top
/// corners square, for a bar that touches the top of the screen. Main thread.
pub fn set_pane(id: &str, over: HWND, shape: Option<(Rect, i32, bool)>) {
    let mut guard = PANES.lock();
    let panes = guard.get_or_insert_with(HashMap::new);

    let Some((rect, radius, flush_top)) = shape else {
        if let Some(pane) = panes.get_mut(id) {
            if pane.placed.take().is_some() {
                unsafe {
                    let _ = ShowWindow(HWND(pane.hwnd as *mut _), SW_HIDE);
                }
            }
        }
        return;
    };
    if rect.width < 1 || rect.height < 1 {
        return;
    }

    if !panes.contains_key(id) {
        let Some(hwnd) = make() else { return };
        set_blur(hwnd, true);
        panes.insert(id.to_string(), Pane { hwnd: hwnd.0 as isize, placed: None });
    }
    let pane = panes.get_mut(id).expect("just ensured");
    let hwnd = HWND(pane.hwnd as *mut _);
    if unsafe { !IsWindow(Some(hwnd)).as_bool() } {
        panes.remove(id);
        return;
    }
    let want = Some((rect, radius, flush_top));
    if pane.placed == want {
        return;
    }
    unsafe {
        let _ = SetWindowPos(
            hwnd,
            Some(over),
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            SWP_NOACTIVATE | SWP_SHOWWINDOW,
        );
        // flush with the top of the screen the bar is rounded below only: the
        // shape reaches above the window, where it is cut off
        let shape = if flush_top {
            region(0, -radius, rect.width, rect.height + radius, radius)
        } else {
            region(0, 0, rect.width, rect.height, radius)
        };
        // Always redrawn. A shape changed without it was not always taken up by the system until the
        // pane was next drawn, which it never is (nothing is painted in it), so a pane kept the
        // shape and size it had before and showed as a stale backing behind a bar that had moved.
        if SetWindowRgn(hwnd, Some(shape), true) == 0 {
            log::warn!("blur pane {id}: it could not be shaped to {}x{} (radius {radius})", rect.width, rect.height);
            let _ = DeleteObject(shape.into());
        }
        // Told to be drawn again as well. The system does not take a moved blur up from the
        // window being moved alone on every graphics path: on one screen of the machine this
        // was found on, a pane stayed where it had been, the size it had been, for as long
        // as the window it backed stood still.
        let _ = RedrawWindow(Some(hwnd), None, None, RDW_INVALIDATE | RDW_FRAME | RDW_UPDATENOW);
    }
    pane.placed = want;
}

/// Destroy a pane, if there is one.
pub fn drop_pane(id: &str) {
    let removed = PANES.lock().as_mut().and_then(|p| p.remove(id));
    if let Some(pane) = removed {
        unsafe {
            let _ = DestroyWindow(HWND(pane.hwnd as *mut _));
        }
    }
}

/// The panes there are, with their windows.
pub fn pane_windows() -> Vec<(String, isize)> {
    PANES.lock().as_ref().map(|p| p.iter().map(|(k, v)| (k.clone(), v.hwnd)).collect()).unwrap_or_default()
}

/// The ids of the panes there are.
pub fn pane_ids() -> Vec<String> {
    PANES.lock().as_ref().map(|p| p.keys().cloned().collect()).unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_accent_policy_is_the_size_user32_expects() {
        // four 32-bit fields
        assert_eq!(std::mem::size_of::<AccentPolicy>(), 16);
    }

    #[test]
    fn a_pane_can_be_made_placed_and_dropped_without_a_window_to_sit_under() {
        // a pane needs a window to sit beneath; any live one will do
        let under = unsafe {
            CreateWindowExW(
                Default::default(),
                w!("STATIC"),
                w!(""),
                WS_POPUP,
                -30000,
                -30000,
                10,
                10,
                None,
                None,
                None,
                None,
            )
        }
        .expect("a window to sit under");
        let rect = Rect { x: -29000, y: -29000, width: 300, height: 60 };
        set_pane("test", under, Some((rect, 14, false)));
        assert!(pane_ids().contains(&"test".to_string()));
        // a repeat is skipped, and hiding keeps the pane for next time
        set_pane("test", under, Some((rect, 14, false)));
        set_pane("test", under, None);
        assert!(pane_ids().contains(&"test".to_string()));
        drop_pane("test");
        assert!(!pane_ids().contains(&"test".to_string()));
        unsafe {
            let _ = DestroyWindow(under);
        }
    }
}
