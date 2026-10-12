//! A bench for capturing what is behind our windows without capturing them (tests only).
//!
//! A frosted backdrop with a true rounded shape has to be blurred by the page itself, from a picture of
//! what is behind it, because the system's blur is only ever a rectangle (see `blurlab`). A picture of the
//! screen has the dock's own window in it, so this tries the ways of leaving chosen windows out:
//!
//!   plain   `BitBlt` of the screen: everything, our windows too (the control)
//!   mag     the Magnification API's window with an exclude list
//!   affinity `SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE)` on the window, read back at once
//!
//! `cargo test --lib capture_lab -- --ignored --nocapture` with `BLUR_LAB_OUT` set. It shows a window of
//! stripes and a grey window on each screen for a few seconds, and reads back only that.

use std::sync::atomic::{AtomicU32, Ordering};
use std::time::{Duration, Instant};

use parking_lot::Mutex;
use windows::core::w;
use windows::Win32::Foundation::{HINSTANCE, HWND, RECT};
use windows::Win32::Graphics::Gdi::{GetStockObject, InvalidateRect, DKGRAY_BRUSH, HBRUSH, HRGN};
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::UI::HiDpi::{SetProcessDpiAwarenessContext, DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2};
use windows::Win32::UI::Magnification::{
    MagInitialize, MagSetImageScalingCallback, MagSetWindowFilterList, MagSetWindowSource, MagSetWindowTransform,
    MagUninitialize, MAGIMAGEHEADER, MAGTRANSFORM, MW_FILTERMODE_EXCLUDE, WC_MAGNIFIER,
};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DestroyWindow, RegisterClassW, SetLayeredWindowAttributes, SetWindowDisplayAffinity, ShowWindow,
    LWA_ALPHA, SW_SHOWNOACTIVATE, WINDOW_DISPLAY_AFFINITY, WNDCLASSW, WS_CHILD, WS_EX_LAYERED, WS_EX_NOACTIVATE,
    WS_EX_TOOLWINDOW, WS_EX_TOPMOST, WS_POPUP, WS_VISIBLE,
};

use super::blurlab::{pump, read_screen, register_class, spread};
use super::monitors::enumerate_monitors;

/// The grey window: the class's brush is all there is to it.
unsafe extern "system" fn solid_proc(
    hwnd: HWND,
    msg: u32,
    wparam: windows::Win32::Foundation::WPARAM,
    lparam: windows::Win32::Foundation::LPARAM,
) -> windows::Win32::Foundation::LRESULT {
    unsafe { windows::Win32::UI::WindowsAndMessaging::DefWindowProcW(hwnd, msg, wparam, lparam) }
}

/// What the magnifier's callback last saw: the pixels, their width, height and stride.
type Seen = Option<(Vec<u8>, u32, u32, u32)>;
static SEEN: Mutex<Seen> = Mutex::new(None);
static CALLS: AtomicU32 = AtomicU32::new(0);

unsafe extern "system" fn callback(
    _hwnd: HWND,
    src: *mut core::ffi::c_void,
    src_header: MAGIMAGEHEADER,
    _dest: *mut core::ffi::c_void,
    _dest_header: MAGIMAGEHEADER,
    _unclipped: RECT,
    _clipped: RECT,
    _dirty: HRGN,
) -> windows::core::BOOL {
    if !src.is_null() && src_header.width > 0 && src_header.height > 0 {
        let len = (src_header.height * src_header.stride) as usize;
        let bytes = unsafe { std::slice::from_raw_parts(src as *const u8, len) }.to_vec();
        *SEEN.lock() = Some((bytes, src_header.width, src_header.height, src_header.stride));
    }
    CALLS.fetch_add(1, Ordering::SeqCst);
    true.into()
}

fn say(report: &mut String, line: String) {
    print!("{line}");
    use std::io::Write;
    let _ = std::io::stdout().flush();
    report.push_str(&line);
}

fn save(name: &str, bgra: &[u8], w: u32, h: u32, stride: u32, out: &str) {
    let mut rgba = Vec::with_capacity((w * h * 4) as usize);
    for y in 0..h {
        for x in 0..w {
            let i = (y * stride + x * 4) as usize;
            rgba.extend_from_slice(&[bgra[i + 2], bgra[i + 1], bgra[i], 255]);
        }
    }
    if let Some(img) = image::RgbaImage::from_raw(w, h, rgba) {
        let _ = img.save(format!("{out}/{name}.png"));
    }
}

fn mean(bgra: &[u8], stride: u32, x: u32, y: u32, w: u32, h: u32) -> (f32, f32) {
    let mut block = Vec::new();
    for yy in y..y + h {
        for xx in x..x + w {
            let i = (yy * stride + xx * 4) as usize;
            block.extend_from_slice(&[bgra[i], bgra[i + 1], bgra[i + 2], 255]);
        }
    }
    let m = block.chunks_exact(4).map(|p| 0.114 * p[0] as f32 + 0.587 * p[1] as f32 + 0.299 * p[2] as f32).sum::<f32>()
        / (block.len() / 4) as f32;
    (m, spread(&block))
}

#[test]
#[ignore]
fn capture_lab() {
    // a bench that sticks must not leave its windows on someone's screen
    std::thread::spawn(|| {
        std::thread::sleep(Duration::from_secs(45));
        eprintln!("the bench stuck; leaving");
        std::process::exit(2);
    });
    unsafe {
        let _ = SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);
    }
    assert!(register_class());
    let out = std::env::var("BLUR_LAB_OUT").unwrap_or_else(|_| "target/blur-lab".into());
    std::fs::create_dir_all(&out).expect("an output folder");
    let instance = HINSTANCE(unsafe { GetModuleHandleW(None) }.expect("module").0);
    unsafe {
        let class = WNDCLASSW {
            lpfnWndProc: Some(solid_proc),
            hInstance: instance,
            lpszClassName: w!("AeroDockLabSolid"),
            hbrBackground: HBRUSH(GetStockObject(DKGRAY_BRUSH).0),
            ..Default::default()
        };
        RegisterClassW(&class);
        assert!(MagInitialize().as_bool(), "MagInitialize");
    }

    let only = std::env::var("LAB_ONLY").unwrap_or_default();
    for monitor in enumerate_monitors().expect("monitors") {
        if !only.is_empty() && !monitor.name.contains(&only) {
            continue;
        }
        let b = monitor.bounds;
        let (sw, sh) = (700, 300);
        let (sx, sy) = (b.x + (b.width - sw) / 2, b.y + (b.height - sh) / 2);
        let name = monitor.name.replace(['\\', '.'], "");
        let make = |class: windows::core::PCWSTR, ex, style, x, y, w, h, parent: Option<HWND>| unsafe {
            CreateWindowExW(ex, class, w!(""), style, x, y, w, h, parent, None, Some(instance), None)
        };
        let ex_top = WS_EX_TOPMOST | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE;
        let stripes = make(w!("AeroDockBlurProbe"), ex_top, WS_POPUP, sx, sy, sw, sh, None).expect("stripes");
        // the window to leave out: a solid grey one over the middle of the stripes
        let (dx, dy, dw, dh) = (sx + 200, sy + 100, 300, 100);
        let grey = make(w!("AeroDockLabSolid"), ex_top, WS_POPUP, dx, dy, dw, dh, None).expect("grey");
        unsafe {
            let _ = ShowWindow(stripes, SW_SHOWNOACTIVATE);
            let _ = ShowWindow(grey, SW_SHOWNOACTIVATE);
        }
        pump(400);
        let mut report = format!("{} {}x{} at ({}, {})\n", monitor.name, b.width, b.height, b.x, b.y);
        let inner = |bgra: &[u8], stride: u32, label: &str, report: &mut String| {
            // the middle of where the grey window is, and a place on the stripes beside it
            let (m, s) = mean(bgra, stride, 200 + 100, 100 + 30, 40, 20);
            let (m2, s2) = mean(bgra, stride, 20, 20, 40, 20);
            say(&mut *report, format!("{label:>10}: under the grey window mean {m:.1} spread {s:.1}; on the stripes mean {m2:.1} spread {s2:.1}\n"));
        };

        println!("plain capture");
        // ---- plain ----
        if let Some(plain) = read_screen(sx, sy, sw, sh) {
            inner(&plain, (sw * 4) as u32, "plain", &mut report);
            save(&format!("capture-{name}-plain"), &plain, sw as u32, sh as u32, (sw * 4) as u32, &out);
        }

        // ---- the magnifier, with the grey window excluded ----
        unsafe {
            for (label, host_at, alpha) in [
                ("mag-off", (-20000, -20000), 255u8),
                ("mag-on", (b.x + 10, b.y + 10), 2),
                ("mag-solid", (b.x + 10, b.y + 10), 255),
                ("mag-prim", (10, 10), 2),
            ] {
                let host = make(
                    w!("AeroDockBlurProbe"),
                    WS_EX_LAYERED | ex_top,
                    WS_POPUP,
                    host_at.0,
                    host_at.1,
                    sw,
                    sh,
                    None,
                )
                .expect("host");
                // faint but not nothing when it is on screen
                let _ = SetLayeredWindowAttributes(host, Default::default(), alpha, LWA_ALPHA);
                let mag = make(WC_MAGNIFIER, Default::default(), WS_CHILD | WS_VISIBLE, 0, 0, sw, sh, Some(host));
                let Ok(mag) = mag else {
                    say(&mut report, format!("{label:>10}: could not make the magnifier\n"));
                    let _ = DestroyWindow(host);
                    continue;
                };
                let mut ident = MAGTRANSFORM { v: [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0] };
                let _ = MagSetWindowTransform(mag, &mut ident);
                let mut exclude = [grey, host];
                println!("{label}: the magnifier is made");
                let ok_filter = MagSetWindowFilterList(mag, MW_FILTERMODE_EXCLUDE, 2, exclude.as_mut_ptr()).as_bool();
                let ok_src = MagSetWindowSource(mag, RECT { left: sx, top: sy, right: sx + sw, bottom: sy + sh }).as_bool();
                let ok_cb = MagSetImageScalingCallback(mag, Some(callback)).as_bool();
                println!("{label}: set up (filter {ok_filter}, source {ok_src}, callback {ok_cb})");
                let _ = ShowWindow(host, SW_SHOWNOACTIVATE);
                println!("{label}: shown");
                *SEEN.lock() = None;
                CALLS.store(0, Ordering::SeqCst);
                let started = Instant::now();
                let mut first_at = None;
                for _ in 0..40 {
                    let _ = InvalidateRect(Some(mag), None, false);
                    pump(25);
                    if CALLS.load(Ordering::SeqCst) > 0 && first_at.is_none() {
                        first_at = Some(started.elapsed());
                    }
                    if CALLS.load(Ordering::SeqCst) >= 3 {
                        break;
                    }
                }
                say(&mut report, format!(
                    "{label:>10}: filter {ok_filter} source {ok_src} callback {ok_cb}; callbacks {}, first after {:?}\n",
                    CALLS.load(Ordering::SeqCst),
                    first_at
                ));
                let seen = SEEN.lock().clone();
                if let Some((bytes, w, h, stride)) = seen {
                    say(&mut report, format!("{label:>10}: {w}x{h} stride {stride}\n"));
                    if w >= 340 && h >= 140 {
                        inner(&bytes, stride, label, &mut report);
                        save(&format!("capture-{name}-{label}"), &bytes, w, h, stride, &out);
                    }
                    // how long a capture takes, in steady state
                    let t = Instant::now();
                    let n = 10;
                    for _ in 0..n {
                        CALLS.store(0, Ordering::SeqCst);
                        let _ = InvalidateRect(Some(mag), None, false);
                        pump(1);
                    }
                    say(&mut report, format!("{label:>10}: about {:?} for each of {n} repeats\n", t.elapsed() / n));
                }
                let _ = DestroyWindow(host);
            }
        }

        println!("affinity");
        // ---- display affinity: the grey window leaves the picture ----
        unsafe {
            let ok = SetWindowDisplayAffinity(grey, WINDOW_DISPLAY_AFFINITY(0x11)).is_ok();
            pump(150);
            if let Some(bgra) = read_screen(sx, sy, sw, sh) {
                say(&mut report, format!("  affinity set {ok}\n"));
                inner(&bgra, (sw * 4) as u32, "affinity", &mut report);
                save(&format!("capture-{name}-affinity"), &bgra, sw as u32, sh as u32, (sw * 4) as u32, &out);
            }
            let _ = SetWindowDisplayAffinity(grey, WINDOW_DISPLAY_AFFINITY(0));
        }

        println!("{report}");
        let _ = std::fs::write(format!("{out}/capture-{name}.txt"), &report);
        unsafe {
            let _ = DestroyWindow(grey);
            let _ = DestroyWindow(stripes);
        }
        pump(150);
        std::thread::sleep(Duration::from_millis(100));
    }
    unsafe {
        let _ = MagUninitialize();
    }
}

/// Capture behind a running copy of the program, leaving all of its windows out of the picture.
/// `LIVE_PID` is its process id. `cargo test --lib capture_live -- --ignored --nocapture`
#[test]
#[ignore]
fn capture_live() {
    use windows::core::BOOL;
    use windows::Win32::Foundation::LPARAM;
    use windows::Win32::UI::WindowsAndMessaging::{
        EnumWindows, GetWindowRect, GetWindowThreadProcessId, IsWindowVisible,
    };
    std::thread::spawn(|| {
        std::thread::sleep(Duration::from_secs(45));
        eprintln!("the bench stuck; leaving");
        std::process::exit(2);
    });
    unsafe {
        let _ = SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);
    }
    assert!(register_class());
    let out = std::env::var("BLUR_LAB_OUT").unwrap_or_else(|_| "target/blur-lab".into());
    std::fs::create_dir_all(&out).expect("an output folder");
    let pid: u32 = std::env::var("LIVE_PID").expect("LIVE_PID").parse().expect("a number");

    struct Found {
        pid: u32,
        all: Vec<HWND>,
    }
    unsafe extern "system" fn each(hwnd: HWND, l: LPARAM) -> BOOL {
        let found = unsafe { &mut *(l.0 as *mut Found) };
        let mut p = 0u32;
        unsafe { GetWindowThreadProcessId(hwnd, Some(&mut p)) };
        if p == found.pid {
            found.all.push(hwnd);
        }
        true.into()
    }
    let mut found = Found { pid, all: Vec::new() };
    unsafe {
        let _ = EnumWindows(Some(each), LPARAM(&mut found as *mut Found as isize));
    }
    for h in &found.all {
        let mut r = RECT::default();
        unsafe {
            let _ = GetWindowRect(*h, &mut r);
            if IsWindowVisible(*h).as_bool() {
                println!("window {:?}: {}x{} at ({}, {})", h.0, r.right - r.left, r.bottom - r.top, r.left, r.top);
            }
        }
    }
    let instance = HINSTANCE(unsafe { GetModuleHandleW(None) }.expect("module").0);
    let (sw, sh) = (1920, 1080);
    unsafe {
        assert!(MagInitialize().as_bool());
        let host = CreateWindowExW(
            WS_EX_LAYERED | WS_EX_TOPMOST | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE,
            w!("AeroDockBlurProbe"),
            w!(""),
            WS_POPUP,
            0,
            0,
            sw / 2,
            sh / 2,
            None,
            None,
            Some(instance),
            None,
        )
        .expect("host");
        let _ = SetLayeredWindowAttributes(host, Default::default(), 2, LWA_ALPHA);
        let mag = CreateWindowExW(Default::default(), WC_MAGNIFIER, w!(""), WS_CHILD | WS_VISIBLE, 0, 0, sw / 2, sh / 2, Some(host), None, Some(instance), None)
            .expect("mag");
        let mut tr = MAGTRANSFORM { v: [0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 1.0] };
        let _ = MagSetWindowTransform(mag, &mut tr);
        let mut list: Vec<HWND> = found.all.clone();
        list.push(host);
        println!("excluding {} windows", list.len());
        let _ = MagSetWindowFilterList(mag, MW_FILTERMODE_EXCLUDE, list.len() as i32, list.as_mut_ptr());
        let _ = MagSetWindowSource(mag, RECT { left: 0, top: 0, right: sw, bottom: sh });
        let _ = MagSetImageScalingCallback(mag, Some(callback));
        let _ = ShowWindow(host, SW_SHOWNOACTIVATE);
        *SEEN.lock() = None;
        CALLS.store(0, Ordering::SeqCst);
        let started = Instant::now();
        for _ in 0..60 {
            let _ = InvalidateRect(Some(mag), None, false);
            pump(25);
            if CALLS.load(Ordering::SeqCst) >= 2 {
                break;
            }
        }
        println!("callbacks {} after {:?} (a half-size magnifier over a {sw}x{sh} source)", CALLS.load(Ordering::SeqCst), started.elapsed());
        let seen = SEEN.lock().clone();
        if let Some((bytes, w, h, stride)) = seen {
            println!("source delivered: {w}x{h}");
            // only the bottom of the screen, where the dock is, and the middle, where the Start menu is
            let crop = |name: &str, x0: u32, y0: u32, cw: u32, ch: u32| {
                let mut part = Vec::new();
                for y in y0..(y0 + ch).min(h) {
                    let i = (y * stride + x0 * 4) as usize;
                    part.extend_from_slice(&bytes[i..i + (cw.min(w - x0) * 4) as usize]);
                }
                save(name, &part, cw.min(w - x0), ch.min(h - y0), cw.min(w - x0) * 4, &out);
            };
            crop("live-excluded-bottom", 0, h - 130, w, 130);
            crop("live-excluded-start", 240, 30, 450, 400);
        }
        // the same with nothing left out, for comparison
        if let Some(plain) = read_screen(0, sh - 260, sw, 260) {
            save("live-plain-bottom", &plain, sw as u32, 260, (sw * 4) as u32, &out);
        }
        let _ = DestroyWindow(host);
        let _ = MagUninitialize();
    }
}