//! Keeps Windows' system backdrop (Mica and its relatives) off our windows.
//!
//! Programs such as Mica For Everyone give every window on the desktop a
//! backdrop material, with a call any program may make about any window
//! (`DWMWA_SYSTEMBACKDROP_TYPE`). Our windows are see-through web views with
//! the glass drawn by the page, so a material under them shows through every
//! clear pixel as a sheet of flat grey: squares over the whole screen, wherever
//! one of the bars, panels or overlays is. An app cannot stop another program
//! from asking, but it can say no afterwards, and the answer sticks until it is
//! asked again.
//!
//! So a thread looks at our windows (every top-level window of this process,
//! shown or not) and, where a material has been put on one, puts it back to
//! none and takes back the glass the other program stretched over the window's
//! face. It looks often for a while after it last had to act, because the other
//! program applies its rules again as windows appear and change, and rarely when
//! it has not been needed for some time. It leaves alone any window that has none.

use std::ffi::c_void;
use std::time::Duration;

use windows::core::BOOL;
use windows::Win32::Foundation::{HWND, LPARAM};
use windows::Win32::Graphics::Dwm::{
    DwmExtendFrameIntoClientArea, DwmGetWindowAttribute, DwmSetWindowAttribute, DWMWINDOWATTRIBUTE,
};
use windows::Win32::System::Threading::GetCurrentProcessId;
use windows::Win32::UI::Controls::MARGINS;
use windows::Win32::UI::WindowsAndMessaging::{EnumWindows, GetWindowThreadProcessId};

/// The window attribute that chooses the material behind a window.
const DWMWA_SYSTEMBACKDROP_TYPE: DWMWINDOWATTRIBUTE = DWMWINDOWATTRIBUTE(38);
/// "No material" (the other values are auto 0, Mica 2, acrylic 3 and Mica Alt 4).
const DWMSBT_NONE: i32 = 1;

/// Whether a backdrop value is a material that fills the window: Mica, acrylic
/// or Mica Alt. Auto and none are what a window of ours has by default.
pub fn is_material(value: i32) -> bool {
    matches!(value, 2..=4)
}

/// How long to wait before looking again. Quickly for the first few seconds, and
/// for as long as another program has been seen doing this (it puts the material
/// back from time to time, and every moment it stays is a flash of grey on
/// screen); slowly otherwise, to be ready if such a program is started later.
pub fn pause_after(quiet_looks: u32, interference_seen: bool) -> Duration {
    if interference_seen || quiet_looks < 40 {
        Duration::from_millis(150)
    } else {
        Duration::from_millis(2500)
    }
}

fn backdrop_of(hwnd: HWND) -> Option<i32> {
    let mut value = 0i32;
    unsafe {
        DwmGetWindowAttribute(
            hwnd,
            DWMWA_SYSTEMBACKDROP_TYPE,
            &mut value as *mut i32 as *mut c_void,
            std::mem::size_of::<i32>() as u32,
        )
        .ok()?;
    }
    Some(value)
}

/// Take a material off a window if it has one. True if there was one.
pub fn shield(hwnd: HWND) -> bool {
    let Some(value) = backdrop_of(hwnd) else {
        return false;
    };
    if !is_material(value) {
        return false;
    }
    let none = DWMSBT_NONE;
    unsafe {
        let _ = DwmSetWindowAttribute(
            hwnd,
            DWMWA_SYSTEMBACKDROP_TYPE,
            &none as *const i32 as *const c_void,
            std::mem::size_of::<i32>() as u32,
        );
        // the glass stretched over the whole window, which is what makes the
        // material show through clear pixels; these windows never use it (their
        // transparency comes from the blur-behind call the window toolkit makes)
        let _ = DwmExtendFrameIntoClientArea(hwnd, &MARGINS::default());
    }
    true
}

unsafe extern "system" fn collect(hwnd: HWND, found: LPARAM) -> BOOL {
    let list = unsafe { &mut *(found.0 as *mut Vec<HWND>) };
    let mut pid = 0u32;
    unsafe { GetWindowThreadProcessId(hwnd, Some(&mut pid)) };
    if pid == unsafe { GetCurrentProcessId() } {
        list.push(hwnd);
    }
    true.into()
}

/// Every top-level window of this process.
fn our_windows() -> Vec<HWND> {
    let mut list: Vec<HWND> = Vec::new();
    unsafe {
        let _ = EnumWindows(Some(collect), LPARAM(&mut list as *mut Vec<HWND> as isize));
    }
    list
}

/// One look at all our windows. Returns how many had a material taken off.
pub fn pass() -> usize {
    our_windows().into_iter().filter(|h| shield(*h)).count()
}

/// Start the thread that keeps looking.
pub fn start() {
    let spawned = std::thread::Builder::new().name("system-backdrop".into()).spawn(|| {
        let mut quiet = 0u32;
        let mut said = false;
        loop {
            let fixed = pass();
            if fixed > 0 {
                quiet = 0;
                if !said {
                    said = true;
                    log::info!(
                        "took the system backdrop off {fixed} of our windows: another program (Mica For Everyone, or similar) puts one on every window"
                    );
                }
            } else {
                quiet = quiet.saturating_add(1);
            }
            std::thread::sleep(pause_after(quiet, said));
        }
    });
    if let Err(e) = spawned {
        log::warn!("could not start the backdrop guard: {e}");
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use windows::core::w;
    use windows::Win32::UI::WindowsAndMessaging::{
        CreateWindowExW, DestroyWindow, ShowWindow, SW_SHOWNOACTIVATE, WINDOW_EX_STYLE, WS_POPUP,
    };

    fn off_screen_window() -> HWND {
        off_screen_window_styled(WS_POPUP)
    }

    fn off_screen_window_styled(style: windows::Win32::UI::WindowsAndMessaging::WINDOW_STYLE) -> HWND {
        let hwnd = unsafe {
            CreateWindowExW(WINDOW_EX_STYLE(0), w!("STATIC"), w!("a window"), style, -30000, -30000, 200, 120, None, None, None, None)
        }
        .expect("a test window");
        unsafe {
            let _ = ShowWindow(hwnd, SW_SHOWNOACTIVATE);
        }
        hwnd
    }

    fn set(hwnd: HWND, value: i32) {
        unsafe {
            let _ = DwmSetWindowAttribute(
                hwnd,
                DWMWA_SYSTEMBACKDROP_TYPE,
                &value as *const i32 as *const c_void,
                std::mem::size_of::<i32>() as u32,
            );
        }
    }

    #[test]
    fn only_the_materials_that_fill_a_window_count() {
        assert!(!is_material(0));
        assert!(!is_material(1));
        assert!(is_material(2));
        assert!(is_material(3));
        assert!(is_material(4));
        assert!(!is_material(5));
    }

    #[test]
    fn it_looks_quickly_at_first_and_for_good_once_it_has_been_needed() {
        // idle for a long time and never needed: rarely
        assert!(pause_after(100, false) > pause_after(0, false) * 10);
        assert_eq!(pause_after(0, false), pause_after(39, false));
        // needed once: always quickly, however long it has been quiet since
        assert_eq!(pause_after(10_000, true), pause_after(0, false));
    }

    #[test]
    fn a_material_put_on_a_window_is_taken_off_and_a_clean_window_is_left_alone() {
        let hwnd = off_screen_window();
        // what Mica For Everyone does to a window
        set(hwnd, 2);
        assert_eq!(backdrop_of(hwnd), Some(2));
        assert!(shield(hwnd), "there was a material to remove");
        assert_eq!(backdrop_of(hwnd), Some(DWMSBT_NONE));
        assert!(!shield(hwnd), "nothing left to remove");
        // a window that was never touched is not touched
        let clean = off_screen_window();
        assert!(!shield(clean));
        unsafe {
            let _ = DestroyWindow(hwnd);
            let _ = DestroyWindow(clean);
        }
    }

    #[test]
    fn a_pass_finds_the_windows_of_this_process() {
        let hwnd = off_screen_window();
        assert!(our_windows().contains(&hwnd));
        set(hwnd, 3);
        assert!(pass() >= 1);
        assert_eq!(backdrop_of(hwnd), Some(DWMSBT_NONE));
        unsafe {
            let _ = DestroyWindow(hwnd);
        }
    }

    /// How long one look takes. `cargo test --lib how_long_is_a_look -- --ignored --nocapture`
    #[test]
    #[ignore]
    fn how_long_is_a_look() {
        let hwnds: Vec<HWND> = (0..8).map(|_| off_screen_window()).collect();
        let start = std::time::Instant::now();
        let n = 400;
        for _ in 0..n {
            pass();
        }
        let each = start.elapsed() / n;
        let all = unsafe {
            let mut c = 0usize;
            unsafe extern "system" fn count(_: HWND, l: LPARAM) -> BOOL {
                unsafe { *(l.0 as *mut usize) += 1 };
                true.into()
            }
            let _ = EnumWindows(Some(count), LPARAM(&mut c as *mut usize as isize));
            c
        };
        println!("one look: {each:?} ({all} top-level windows on the desktop, {} of ours)", our_windows().len());
        println!("at one look per 150 ms that is {:.4}% of one core", each.as_secs_f64() / 0.150 * 100.0);
        for h in hwnds {
            unsafe {
                let _ = DestroyWindow(h);
            }
        }
    }

    /// Whether Mica For Everyone (if it is running) puts a material on a new
    /// window here, and whether it puts it back after we take it off. Reads and
    /// changes only a window made for the test. `cargo test --lib does_mica_for_everyone -- --ignored --nocapture`
    #[test]
    #[ignore]
    fn does_mica_for_everyone_fight_back() {
        use windows::Win32::UI::WindowsAndMessaging::{WS_CAPTION, WS_OVERLAPPEDWINDOW};
        for (name, style) in [("a plain popup", WS_POPUP), ("a popup with a caption", WS_POPUP | WS_CAPTION), ("an ordinary window", WS_OVERLAPPEDWINDOW)] {
            let hwnd = off_screen_window_styled(style);
            std::thread::sleep(Duration::from_millis(2500));
            println!("{name}: 2.5 s after it appeared, the backdrop is {:?}", backdrop_of(hwnd));
            unsafe {
                let _ = DestroyWindow(hwnd);
            }
        }
        let hwnd = off_screen_window_styled(WS_OVERLAPPEDWINDOW);
        std::thread::sleep(Duration::from_millis(2500));
        println!("2.5 s after it appeared, the backdrop is {:?}", backdrop_of(hwnd));
        let removed = shield(hwnd);
        println!("shield removed a material: {removed}; now {:?}", backdrop_of(hwnd));
        for second in 1..=6 {
            std::thread::sleep(Duration::from_secs(1));
            let value = backdrop_of(hwnd);
            println!("{second} s later: {value:?}");
            if value.is_some_and(is_material) {
                println!("  it came back; shield again: {}", shield(hwnd));
            }
        }
        unsafe {
            let _ = DestroyWindow(hwnd);
        }
    }
}
