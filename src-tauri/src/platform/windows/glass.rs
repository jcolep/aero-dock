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

use windows::core::{w, Interface, HSTRING};
use windows::Win32::Foundation::{COLORREF, HWND, LPARAM, LRESULT, RECT, WPARAM};
use windows::Win32::Graphics::Dwm::{DwmSetWindowAttribute, DWMWINDOWATTRIBUTE};
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::System::WinRT::Composition::ICompositorDesktopInterop;
use windows::Win32::System::WinRT::{CreateDispatcherQueueController, DispatcherQueueOptions, DQTAT_COM_STA, DQTYPE_THREAD_CURRENT};
use windows::Win32::UI::Shell::{DefSubclassProc, RemoveWindowSubclass, SetWindowSubclass};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, GetWindow, GetWindowLongPtrW, GetWindowRect, GW_HWNDNEXT, IsWindow, IsWindowVisible, RegisterClassW,
    SetLayeredWindowAttributes, SetWindowPos, ShowWindow, GWL_EXSTYLE, HWND_TOPMOST, LWA_ALPHA, SWP_NOACTIVATE,
    SWP_SHOWWINDOW, SW_HIDE, WINDOW_EX_STYLE, WM_DESTROY, WM_SHOWWINDOW, WM_WINDOWPOSCHANGED, WNDCLASSW, WS_EX_LAYERED,
    WS_EX_NOACTIVATE, WS_EX_NOREDIRECTIONBITMAP, WS_EX_TOOLWINDOW, WS_EX_TOPMOST, WS_EX_TRANSPARENT, WS_POPUP,
};
use windows::Foundation::TimeSpan;
use windows::System::DispatcherQueueController;
use windows::UI::Composition::{
    CompositionRoundedRectangleGeometry, Compositor, ContainerVisual, Desktop::DesktopWindowTarget,
    SpriteVisual,
};
use windows_numerics::{Vector2, Vector3};

/// `DWMWA_USE_HOSTBACKDROPBRUSH`: without it the host backdrop brush is black.
const USE_HOST_BACKDROP: DWMWINDOWATTRIBUTE = DWMWINDOWATTRIBUTE(17);
/// Any one number will do for the subclass that watches a page's window; it only has to be the same each time.
const WATCH_ID: usize = 0xAE20_6A55;
/// How long a piece of glass takes to come in, in 100 ns ticks: 260 ms, eased out (quick at first, settling), so it
/// blooms in as a menu lands rather than switching on. (It goes at once.)
const FADE_IN: i64 = 260 * 10_000;
/// How far past its edges each piece of glass reaches for what is behind it, in px.
///
/// The compositor blurs what is behind the glass window within the box that holds everything drawn in it, and no
/// further: the bar alone was a blur of its own thin strip (dark, over a dark wallpaper), and turned pale whenever
/// anything else was drawn further down the window (an open menu, even a speck), which let the blur reach the bright
/// windows under the bar. Measured: the bar's look stops changing once that box reaches 40 px past it. So each piece
/// has two specks of its own (one pixel, all but transparent) this far beyond two opposite corners, and its blur is
/// always of its real surroundings, whatever else is open.
const REACH: f32 = 96.0;
/// How much of a speck shows: enough that the compositor counts it as drawn, too little to see.
const SPECK: f32 = 0.01;

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
    specks: [SpriteVisual; 2],
    geometry: CompositionRoundedRectangleGeometry,
    place: Place,
}

/// The glass beneath one page's window.
struct Host {
    window: HWND,
    _target: DesktopWindowTarget,
    root: ContainerVisual,
    panes: HashMap<String, Pane>,
    /// Pieces taken away, hidden and kept for the next to come: a label comes and goes with every icon the pointer
    /// crosses, and making and unmaking visuals for each was churn the compositor did not need.
    spare: Vec<Pane>,
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
/// Only if it is not there already: the compositor refreshes a window's blur when the window is placed, even where it
/// already was, and the page's window hears of every clip and nudge (a menu opening, a tooltip), so placing it each
/// time made all its glass flicker.
fn follow(page: HWND, glass: HWND) {
    unsafe {
        if !IsWindowVisible(page).as_bool() {
            if IsWindowVisible(glass).as_bool() {
                let _ = ShowWindow(glass, SW_HIDE);
            }
            return;
        }
        let mut r = RECT::default();
        if GetWindowRect(page, &mut r).is_err() {
            return;
        }
        let mut now = RECT::default();
        let beneath = GetWindow(page, GW_HWNDNEXT).ok() == Some(glass);
        if beneath && IsWindowVisible(glass).as_bool() && GetWindowRect(glass, &mut now).is_ok() && now == r {
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
        glass.hosts.insert(key, Host { window, _target: target, root, panes: HashMap::new(), spare: Vec::new() });
    }
    Ok(glass.hosts.get_mut(&key).expect("just made"))
}

impl Pane {
    fn show(&self, shown: bool) {
        for v in [&self.visual, &self.specks[0], &self.specks[1]] {
            let _ = v.SetIsVisible(shown);
        }
    }
}

fn new_pane(compositor: &Compositor, root: &ContainerVisual) -> windows::core::Result<Pane> {
    let visual = compositor.CreateSpriteVisual()?;
    visual.SetBrush(&compositor.CreateHostBackdropBrush()?)?;
    let geometry = compositor.CreateRoundedRectangleGeometry()?;
    visual.SetClip(&compositor.CreateGeometricClipWithGeometry(&geometry)?)?;
    root.Children()?.InsertAtTop(&visual)?;
    // each speck is a visual of the window's own, with a brush of its own (measured: specks inside a container
    // with the piece, sharing its brush, did not count)
    let speck = || -> windows::core::Result<SpriteVisual> {
        let s = compositor.CreateSpriteVisual()?;
        s.SetBrush(&compositor.CreateHostBackdropBrush()?)?;
        s.SetSize(Vector2 { X: 1.0, Y: 1.0 })?;
        s.SetOpacity(SPECK)?;
        root.Children()?.InsertAtBottom(&s)?;
        Ok(s)
    };
    let specks = [speck()?, speck()?];
    Ok(Pane { visual, specks, geometry, place: Place { x: 0.0, y: 0.0, width: 0.0, height: 0.0, radius: 0.0, opacity: -1.0 } })
}

/// Bring a piece of glass in from nothing to `to`, so that it does not arrive in one frame.
fn fade_in(compositor: &Compositor, visual: &SpriteVisual, to: f32) -> windows::core::Result<()> {
    let fade = compositor.CreateScalarKeyFrameAnimation()?;
    fade.InsertKeyFrame(0.0, 0.0)?;
    let ease = compositor.CreateCubicBezierEasingFunction(Vector2 { X: 0.22, Y: 1.0 }, Vector2 { X: 0.36, Y: 1.0 })?;
    fade.InsertKeyFrameWithEasingFunction(1.0, to.clamp(0.0, 1.0), &ease)?;
    fade.SetDuration(TimeSpan { Duration: FADE_IN })?;
    visual.StartAnimation(&HSTRING::from("Opacity"), &fade)
}

/// Place a piece of glass, in a window `room` px big (its specks must be inside it, or they do not count: measured).
fn apply(pane: &mut Pane, place: Place, room: Vector2) -> windows::core::Result<()> {
    if pane.place == place {
        return Ok(());
    }
    let size = Vector2 { X: place.width.max(0.0), Y: place.height.max(0.0) };
    pane.visual.SetOffset(Vector3 { X: place.x, Y: place.y, Z: 0.0 })?;
    pane.visual.SetSize(size)?;
    pane.geometry.SetSize(size)?;
    let inside = |x: f32, y: f32| Vector3 { X: x.clamp(0.0, (room.X - 1.0).max(0.0)), Y: y.clamp(0.0, (room.Y - 1.0).max(0.0)), Z: 0.0 };
    pane.specks[0].SetOffset(inside(place.x - REACH, place.y - REACH))?;
    pane.specks[1].SetOffset(inside(place.x + size.X + REACH - 1.0, place.y + size.Y + REACH - 1.0))?;
    let radius = place.radius.min(size.X / 2.0).min(size.Y / 2.0).max(0.0);
    pane.geometry.SetCornerRadius(Vector2 { X: radius, Y: radius })?;
    if place.opacity != pane.place.opacity {
        // a new amount ends any fade still coming in
        if pane.place.opacity >= 0.0 {
            pane.visual.StopAnimation(&HSTRING::from("Opacity"))?;
        }
        pane.visual.SetOpacity(place.opacity.clamp(0.0, 1.0))?;
    }
    pane.place = place;
    Ok(())
}

/// Put a piece of glass under a page's window, move it, or (with `None`) take it away. Main thread only.
pub fn set_pane(page: HWND, id: &str, place: Option<Place>) -> windows::core::Result<()> {
    let placed = GLASS.with(|cell| {
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
                if let Some(mut pane) = host.panes.remove(id) {
                    pane.show(false);
                    pane.place.opacity = -1.0;
                    host.spare.push(pane);
                }
            }
            return Ok(());
        };
        let compositor = glass.compositor.clone();
        let host = host_for(glass, page)?;
        let room = unsafe {
            let mut r = RECT::default();
            let _ = GetWindowRect(host.window, &mut r);
            Vector2 { X: (r.right - r.left) as f32, Y: (r.bottom - r.top) as f32 }
        };
        if !host.panes.contains_key(id) {
            let mut pane = match host.spare.pop() {
                Some(pane) => pane,
                None => new_pane(&compositor, &host.root)?,
            };
            // placed before it is shown, so it is never seen where the last one was
            apply(&mut pane, place, room)?;
            pane.show(true);
            fade_in(&compositor, &pane.visual, place.opacity)?;
            host.panes.insert(id.to_string(), pane);
        }
        apply(host.panes.get_mut(id).expect("just made"), place, room)
    });
    commit();
    placed
}

/// Composition draws a batch of changes when its thread next goes round its loop with work to do, so the last change
/// of a run (a menu's glass taken away as it closes) could wait on screen for whatever happened next, a click, say.
/// Ask for it to be drawn now.
fn commit() {
    GLASS.with(|cell| {
        if let Some(glass) = cell.borrow().as_ref() {
            let _ = glass.compositor.RequestCommitAsync();
        }
    })
}

/// Re-place every glass window where its page's window is, even though it already is there.
///
/// The compositor refreshes a window's blur when the window is placed (see `follow`, which for that reason does not
/// place a window that is already right). After the machine locks, sleeps or changes its displays the blur can be left
/// stale, and then the glass looks off until something places its window again: a menu opening did, by resizing the
/// page's window, which is how the menu bar's glass seemed to switch on when an item was hovered. `jiggle` also makes
/// each glass window a pixel wider for a moment, which a window placed where it already was might not be enough for.
/// Returns how many glass windows were placed. Main thread only.
pub fn refresh_all(jiggle: bool) -> usize {
    let placed = GLASS.with(|cell| {
        let Ok(slot) = cell.try_borrow() else { return 0 };
        let Some(glass) = slot.as_ref() else { return 0 };
        let mut placed = 0;
        for (key, host) in &glass.hosts {
            let page = HWND(*key as *mut _);
            unsafe {
                if !IsWindow(Some(page)).as_bool() || !IsWindowVisible(page).as_bool() {
                    continue;
                }
                let mut r = RECT::default();
                if GetWindowRect(page, &mut r).is_err() {
                    continue;
                }
                let (w, h) = (r.right - r.left, r.bottom - r.top);
                let flags = SWP_NOACTIVATE | SWP_SHOWWINDOW;
                if jiggle {
                    let _ = SetWindowPos(host.window, Some(page), r.left, r.top, w + 1, h, flags);
                }
                let _ = SetWindowPos(host.window, Some(page), r.left, r.top, w, h, flags);
            }
            placed += 1;
        }
        placed
    });
    commit();
    placed
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
