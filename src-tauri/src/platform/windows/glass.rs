//! Frosted glass, made by the compositor.
//!
//! Each window with glass in it (the dock, the menu bar, the Start menu) gets a glass window of its own, kept exactly
//! where it is and immediately beneath it. The glass window has no picture of its own (`WS_EX_NOREDIRECTIONBITMAP`),
//! takes no clicks (layered and transparent to the pointer), and holds a layer of composition visuals, one for each
//! piece of glass, painted with the host backdrop brush (what is behind the window, blurred by the compositor) and
//! clipped to the glass's own rounded rectangle, anti-aliased. The page above it is transparent where the glass is,
//! save its tint and grain, so the blur shows through.
//!
//! Nothing is captured, encoded or sent: the compositor blurs what is behind, on the graphics card, as part of
//! drawing the screen. All this side does is say where each piece of glass is, when the page says it has moved, and
//! keep the glass window with its window when that moves, changes place in the stack, shows or hides.
//!
//! The glass is a window beneath rather than a layer inside the page's window because a layer inside it is beneath
//! the web view's own window too, and does not show through it (measured). Composition objects are made and used on
//! one thread with a dispatcher queue: the main thread, which owns the pages' windows and so hears when they move.

use std::cell::RefCell;
use std::collections::HashMap;

use windows::core::{w, Interface};
use windows::Win32::Foundation::{COLORREF, HWND, LPARAM, LRESULT, RECT, WPARAM};
use windows::Win32::Graphics::Dwm::{DwmSetWindowAttribute, DWMWINDOWATTRIBUTE};
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::System::WinRT::Composition::ICompositorDesktopInterop;
use windows::Win32::System::WinRT::{CreateDispatcherQueueController, DispatcherQueueOptions, DQTAT_COM_STA, DQTYPE_THREAD_CURRENT};
use windows::Win32::UI::Shell::{DefSubclassProc, RemoveWindowSubclass, SetWindowSubclass};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, GetWindowLongPtrW, GetWindowRect, IsWindowVisible, RegisterClassW,
    SetLayeredWindowAttributes, SetWindowPos, ShowWindow, GWL_EXSTYLE, HWND_TOPMOST, LWA_ALPHA, SWP_NOACTIVATE,
    SWP_SHOWWINDOW, SW_HIDE, WINDOW_EX_STYLE, WM_DESTROY, WM_SHOWWINDOW, WM_WINDOWPOSCHANGED, WNDCLASSW, WS_EX_LAYERED,
    WS_EX_NOACTIVATE, WS_EX_NOREDIRECTIONBITMAP, WS_EX_TOOLWINDOW, WS_EX_TOPMOST, WS_EX_TRANSPARENT, WS_POPUP,
};
use windows::System::DispatcherQueueController;
use windows::UI::Composition::{
    CompositionRoundedRectangleGeometry, Compositor, ContainerVisual, Desktop::DesktopWindowTarget, SpriteVisual,
};
use windows_numerics::{Vector2, Vector3};

/// `DWMWA_USE_HOSTBACKDROPBRUSH`: without it the host backdrop brush is black.
const USE_HOST_BACKDROP: DWMWINDOWATTRIBUTE = DWMWINDOWATTRIBUTE(17);
/// Any one number will do for the subclass that watches a page's window; it only has to be the same each time.
const WATCH_ID: usize = 0xAE20_6A55;

/// Where a piece of glass is, in its window's own physical pixels.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Place {
    pub x: f32,
    pub y: f32,
    pub width: f32,
    pub height: f32,
    pub radius: f32,
    /// How much of the blur shows, 0 to 1 (the frost amount).
    pub opacity: f32,
}

struct Pane {
    visual: SpriteVisual,
    geometry: CompositionRoundedRectangleGeometry,
    place: Place,
}

/// The glass beneath one page's window.
struct Host {
    window: HWND,
    _target: DesktopWindowTarget,
    root: ContainerVisual,
    panes: HashMap<String, Pane>,
}

struct Glass {
    _queue: DispatcherQueueController,
    compositor: Compositor,
    /// By the page's window.
    hosts: HashMap<isize, Host>,
}

thread_local! {
    static GLASS: RefCell<Option<Glass>> = const { RefCell::new(None) };
}

unsafe extern "system" fn glass_proc(h: HWND, m: u32, w: WPARAM, l: LPARAM) -> LRESULT {
    unsafe { DefWindowProcW(h, m, w, l) }
}

fn compositor_on_this_thread() -> windows::core::Result<Glass> {
    let options = DispatcherQueueOptions {
        dwSize: std::mem::size_of::<DispatcherQueueOptions>() as u32,
        threadType: DQTYPE_THREAD_CURRENT,
        apartmentType: DQTAT_COM_STA,
    };
    let queue = unsafe { CreateDispatcherQueueController(options)? };
    unsafe {
        let instance = GetModuleHandleW(None)?;
        RegisterClassW(&WNDCLASSW {
            lpfnWndProc: Some(glass_proc),
            hInstance: instance.into(),
            lpszClassName: w!("AeroDockGlass"),
            ..Default::default()
        });
    }
    Ok(Glass { _queue: queue, compositor: Compositor::new()?, hosts: HashMap::new() })
}

/// Put the glass window where the page's window is, just beneath it, and show it; or hide it with the page's window.
fn follow(page: HWND, glass: HWND) {
    unsafe {
        if !IsWindowVisible(page).as_bool() {
            let _ = ShowWindow(glass, SW_HIDE);
            return;
        }
        let mut r = RECT::default();
        if GetWindowRect(page, &mut r).is_err() {
            return;
        }
        // immediately beneath the page's window in the stack: what it blurs is what is behind both
        let _ = SetWindowPos(glass, Some(page), r.left, r.top, r.right - r.left, r.bottom - r.top, SWP_NOACTIVATE | SWP_SHOWWINDOW);
    }
}

/// Watches a page's window, and keeps its glass with it.
unsafe extern "system" fn watch(hwnd: HWND, msg: u32, wparam: WPARAM, lparam: LPARAM, _id: usize, glass: usize) -> LRESULT {
    let result = unsafe { DefSubclassProc(hwnd, msg, wparam, lparam) };
    match msg {
        WM_WINDOWPOSCHANGED | WM_SHOWWINDOW => follow(hwnd, HWND(glass as *mut _)),
        WM_DESTROY => {
            unsafe {
                let _ = RemoveWindowSubclass(hwnd, Some(watch), WATCH_ID);
            }
            forget_window(hwnd);
        }
        _ => {}
    }
    result
}

fn host_for(glass: &mut Glass, page: HWND) -> windows::core::Result<&mut Host> {
    let key = page.0 as isize;
    if !glass.hosts.contains_key(&key) {
        let topmost = unsafe { GetWindowLongPtrW(page, GWL_EXSTYLE) } as u32 & WS_EX_TOPMOST.0 != 0;
        let mut ex = WS_EX_NOREDIRECTIONBITMAP | WS_EX_LAYERED | WS_EX_TRANSPARENT | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE;
        if topmost {
            ex |= WS_EX_TOPMOST;
        }
        let window = unsafe {
            CreateWindowExW(
                WINDOW_EX_STYLE(ex.0),
                w!("AeroDockGlass"),
                w!(""),
                WS_POPUP,
                0,
                0,
                1,
                1,
                None,
                None,
                Some(GetModuleHandleW(None)?.into()),
                None,
            )?
        };
        let on: i32 = 1;
        unsafe {
            // fully opaque as a layered window: what shows is only the visuals, which have their own shape
            SetLayeredWindowAttributes(window, COLORREF(0), 255, LWA_ALPHA)?;
            DwmSetWindowAttribute(window, USE_HOST_BACKDROP, &on as *const i32 as *const _, 4)?;
        }
        let interop: ICompositorDesktopInterop = glass.compositor.cast()?;
        let target = unsafe { interop.CreateDesktopWindowTarget(window, true)? };
        let root = glass.compositor.CreateContainerVisual()?;
        target.SetRoot(&root)?;
        unsafe {
            let _ = SetWindowSubclass(page, Some(watch), WATCH_ID, window.0 as usize);
            if topmost {
                let _ = SetWindowPos(window, Some(HWND_TOPMOST), 0, 0, 0, 0, SWP_NOACTIVATE);
            }
        }
        follow(page, window);
        glass.hosts.insert(key, Host { window, _target: target, root, panes: HashMap::new() });
    }
    Ok(glass.hosts.get_mut(&key).expect("just made"))
}

fn new_pane(compositor: &Compositor, root: &ContainerVisual) -> windows::core::Result<Pane> {
    let visual = compositor.CreateSpriteVisual()?;
    visual.SetBrush(&compositor.CreateHostBackdropBrush()?)?;
    let geometry = compositor.CreateRoundedRectangleGeometry()?;
    visual.SetClip(&compositor.CreateGeometricClipWithGeometry(&geometry)?)?;
    root.Children()?.InsertAtTop(&visual)?;
    Ok(Pane { visual, geometry, place: Place { x: 0.0, y: 0.0, width: 0.0, height: 0.0, radius: 0.0, opacity: -1.0 } })
}

fn apply(pane: &mut Pane, place: Place) -> windows::core::Result<()> {
    if pane.place == place {
        return Ok(());
    }
    let size = Vector2 { X: place.width.max(0.0), Y: place.height.max(0.0) };
    pane.visual.SetOffset(Vector3 { X: place.x, Y: place.y, Z: 0.0 })?;
    pane.visual.SetSize(size)?;
    pane.geometry.SetSize(size)?;
    let radius = place.radius.min(size.X / 2.0).min(size.Y / 2.0).max(0.0);
    pane.geometry.SetCornerRadius(Vector2 { X: radius, Y: radius })?;
    pane.visual.SetOpacity(place.opacity.clamp(0.0, 1.0))?;
    pane.place = place;
    Ok(())
}

/// Put a piece of glass under a page's window, move it, or (with `None`) take it away. Main thread only.
pub fn set_pane(page: HWND, id: &str, place: Option<Place>) -> windows::core::Result<()> {
    GLASS.with(|cell| {
        let mut slot = cell.borrow_mut();
        if slot.is_none() {
            if place.is_none() {
                return Ok(());
            }
            *slot = Some(compositor_on_this_thread()?);
        }
        let glass = slot.as_mut().expect("just made");
        let Some(place) = place else {
            if let Some(host) = glass.hosts.get_mut(&(page.0 as isize)) {
                if let Some(pane) = host.panes.remove(id) {
                    let _ = host.root.Children().and_then(|c| c.Remove(&pane.visual));
                }
            }
            return Ok(());
        };
        let compositor = glass.compositor.clone();
        let host = host_for(glass, page)?;
        if !host.panes.contains_key(id) {
            let pane = new_pane(&compositor, &host.root)?;
            host.panes.insert(id.to_string(), pane);
        }
        apply(host.panes.get_mut(id).expect("just made"), place)
    })
}

/// The page's window is closing: its glass goes with it. Main thread only.
pub fn forget_window(page: HWND) {
    GLASS.with(|cell| {
        if let Ok(mut slot) = cell.try_borrow_mut() {
            if let Some(host) = slot.as_mut().and_then(|g| g.hosts.remove(&(page.0 as isize))) {
                unsafe {
                    let _ = DestroyWindow(host.window);
                }
            }
        }
    });
}
