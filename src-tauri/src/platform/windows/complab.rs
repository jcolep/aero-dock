//! A bench for frosted glass made by the compositor itself: a window with no picture of its own
//! (`WS_EX_NOREDIRECTIONBITMAP`), a composition visual in it painted with the host backdrop brush (what is behind
//! the window, blurred by the compositor), clipped to a rounded rectangle. Shown for a moment on the primary
//! monitor, active and then not, and photographed each time. Only run by hand:
//!
//!   cargo test --lib complab -- --ignored --nocapture

#![cfg(test)]

use windows::core::{w, Interface};
use windows_numerics::{Vector2, Vector3};
use windows::Win32::Foundation::{HWND, LPARAM, LRESULT, WPARAM};
use windows::Win32::Graphics::Gdi::{
    BitBlt, CreateCompatibleDC, CreateDIBSection, DeleteDC, DeleteObject, GetDC, ReleaseDC, SelectObject, BITMAPINFO,
    BITMAPINFOHEADER, BI_RGB, DIB_RGB_COLORS, SRCCOPY,
};
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::System::WinRT::Composition::ICompositorDesktopInterop;
use windows::Win32::System::WinRT::{CreateDispatcherQueueController, DispatcherQueueOptions, DQTAT_COM_STA, DQTYPE_THREAD_CURRENT};
use windows::Win32::UI::WindowsAndMessaging::{
    CreateWindowExW, DefWindowProcW, DestroyWindow, DispatchMessageW, PeekMessageW, RegisterClassW, SetForegroundWindow,
    ShowWindow, TranslateMessage, MSG, PM_REMOVE, SW_SHOWNOACTIVATE, WINDOW_EX_STYLE, WNDCLASSW, WS_EX_NOACTIVATE,
    WS_EX_TOOLWINDOW, WS_EX_TOPMOST, WS_POPUP,
};
use windows::UI::Composition::Compositor;

unsafe extern "system" fn proc_(h: HWND, m: u32, w: WPARAM, l: LPARAM) -> LRESULT {
    unsafe { DefWindowProcW(h, m, w, l) }
}

fn pump(ms: u64) {
    let until = std::time::Instant::now() + std::time::Duration::from_millis(ms);
    let mut msg = MSG::default();
    while std::time::Instant::now() < until {
        unsafe {
            while PeekMessageW(&mut msg, None, 0, 0, PM_REMOVE).as_bool() {
                let _ = TranslateMessage(&msg);
                DispatchMessageW(&msg);
            }
        }
        std::thread::sleep(std::time::Duration::from_millis(8));
    }
}

/// A photograph of part of the screen, saved as a PNG.
fn photo(x: i32, y: i32, w: i32, h: i32, path: &str) {
    unsafe {
        let screen = GetDC(None);
        let dc = CreateCompatibleDC(Some(screen));
        let info = BITMAPINFO {
            bmiHeader: BITMAPINFOHEADER {
                biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
                biWidth: w,
                biHeight: -h,
                biPlanes: 1,
                biBitCount: 32,
                biCompression: BI_RGB.0,
                ..Default::default()
            },
            ..Default::default()
        };
        let mut bits: *mut core::ffi::c_void = std::ptr::null_mut();
        let bmp = CreateDIBSection(Some(dc), &info, DIB_RGB_COLORS, &mut bits, None, 0).expect("dib");
        let old = SelectObject(dc, bmp.into());
        let _ = BitBlt(dc, 0, 0, w, h, Some(screen), x, y, SRCCOPY);
        let src = std::slice::from_raw_parts(bits as *const u8, (w * h * 4) as usize);
        let mut img = image::RgbaImage::new(w as u32, h as u32);
        for (i, p) in img.pixels_mut().enumerate() {
            *p = image::Rgba([src[i * 4 + 2], src[i * 4 + 1], src[i * 4], 255]);
        }
        img.save(path).expect("png");
        SelectObject(dc, old);
        let _ = DeleteObject(bmp.into());
        let _ = DeleteDC(dc);
        ReleaseDC(None, screen);
    }
}

#[test]
#[ignore]
fn complab() {
    let out = std::env::var("COMPLAB_OUT").unwrap_or_else(|_| "target".into());
    unsafe {
        let options = DispatcherQueueOptions {
            dwSize: std::mem::size_of::<DispatcherQueueOptions>() as u32,
            threadType: DQTYPE_THREAD_CURRENT,
            apartmentType: DQTAT_COM_STA,
        };
        let _queue = CreateDispatcherQueueController(options).expect("dispatcher queue");
        let compositor = Compositor::new().expect("compositor");

        let instance = GetModuleHandleW(None).expect("module");
        let class = w!("AeroCompLab");
        RegisterClassW(&WNDCLASSW { lpfnWndProc: Some(proc_), hInstance: instance.into(), lpszClassName: class, ..Default::default() });
        let (x, y, width, height) = (300, 420, 640, 150);
        let hwnd = CreateWindowExW(
            // like a Tauri transparent window: a normal surface, made see-through by a blur-behind with an empty region
            if std::env::var("COMPLAB_TAURI").is_ok() { WINDOW_EX_STYLE(0) } else if std::env::var("COMPLAB_LAYERED").is_ok() { WINDOW_EX_STYLE(0x0020_0000 | 0x0008_0000 | 0x0000_0020) } else { WINDOW_EX_STYLE(0x0020_0000) } | WS_EX_TOOLWINDOW | WS_EX_TOPMOST | WS_EX_NOACTIVATE,
            class,
            w!(""),
            WS_POPUP,
            x,
            y,
            width,
            height,
            None,
            None,
            Some(instance.into()),
            None,
        )
        .expect("window");

        let top = std::env::var("COMPLAB_TAURI").is_err();
        if !top {
            let region = windows::Win32::Graphics::Gdi::CreateRectRgn(0, 0, -1, -1);
            let bb = windows::Win32::Graphics::Dwm::DWM_BLURBEHIND { dwFlags: windows::Win32::Graphics::Dwm::DWM_BB_ENABLE | windows::Win32::Graphics::Dwm::DWM_BB_BLURREGION, fEnable: true.into(), hRgnBlur: region, fTransitionOnMaximized: false.into() };
            let _ = windows::Win32::Graphics::Dwm::DwmEnableBlurBehindWindow(hwnd, &bb);
        }
        // the window has to ask for the host backdrop, or the brush is black
        let on: i32 = 1;
        let _ = windows::Win32::Graphics::Dwm::DwmSetWindowAttribute(hwnd, windows::Win32::Graphics::Dwm::DWMWINDOWATTRIBUTE(17), &on as *const i32 as *const _, 4);
        let interop: ICompositorDesktopInterop = compositor.cast().expect("interop");
        let target = interop.CreateDesktopWindowTarget(hwnd, top).expect("target");
        let visual = compositor.CreateSpriteVisual().expect("visual");
        // a bar inset in the window, as the dock's is in its larger window
        visual.SetOffset(Vector3 { X: 20.0, Y: 20.0, Z: 0.0 }).unwrap();
        visual.SetSize(Vector2 { X: 600.0, Y: 110.0 }).unwrap();
        visual.SetBrush(&compositor.CreateHostBackdropBrush().expect("backdrop")).unwrap();
        let geometry = compositor.CreateRoundedRectangleGeometry().unwrap();
        geometry.SetSize(Vector2 { X: 600.0, Y: 110.0 }).unwrap();
        geometry.SetCornerRadius(Vector2 { X: 28.0, Y: 28.0 }).unwrap();
        visual.SetClip(&compositor.CreateGeometricClipWithGeometry(&geometry).unwrap()).unwrap();
        target.SetRoot(&visual).unwrap();

        if std::env::var("COMPLAB_LAYERED").is_ok() {
            let r = windows::Win32::UI::WindowsAndMessaging::SetLayeredWindowAttributes(hwnd, windows::Win32::Foundation::COLORREF(0), 255, windows::Win32::UI::WindowsAndMessaging::LWA_ALPHA);
            println!("layered attributes: {r:?}");
        }
        let started = std::time::Instant::now();
        let _ = ShowWindow(hwnd, SW_SHOWNOACTIVATE);
        pump(900);
        println!("shown, inactive, {} ms", started.elapsed().as_millis());
        photo(x - 20, y - 20, width + 40, height + 40, &format!("{out}/complab-inactive.png"));
        let under = windows::Win32::UI::WindowsAndMessaging::WindowFromPoint(windows::Win32::Foundation::POINT { x: x + 300, y: y + 70 });
        println!("what the pointer would hit in the middle of the glass: {:?} (the glass is {:?})", under.0, hwnd.0);
        let _ = SetForegroundWindow(hwnd);
        pump(600);
        photo(x - 20, y - 20, width + 40, height + 40, &format!("{out}/complab-active.png"));
        // moved and resized, as the bar is when icons swell: no new window, only the visual
        visual.SetSize(Vector2 { X: 520.0, Y: 110.0 }).unwrap();
        geometry.SetSize(Vector2 { X: 520.0, Y: 110.0 }).unwrap();
        pump(300);
        photo(x - 20, y - 20, width + 40, height + 40, &format!("{out}/complab-resized.png"));
        let _ = DestroyWindow(hwnd);
        pump(100);
    }
}
