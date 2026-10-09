pub mod commands;
pub mod core;
pub mod platform;

use tauri::Manager;

use crate::commands::dock::DockGeometry;
use crate::core::settings::SettingsStore;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    core::trace::init();
    #[cfg(windows)]
    core::trace::log_native_exceptions();
    core::trace::install_panic_log();
    crate::trace!("started");

    // A portable copy takes WebView2's profile with it. Left alone, WebView2
    // writes one under %LOCALAPPDATA% on whatever machine it was plugged into.
    #[cfg(windows)]
    if let Some(dir) = core::paths::webview_dir() {
        let _ = std::fs::create_dir_all(&dir);
        std::env::set_var("WEBVIEW2_USER_DATA_FOLDER", &dir);
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            // Second launch: just make sure the existing docks are visible.
            for window in commands::dock::dock_windows(app) {
                let _ = window.show();
            }
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .manage(DockGeometry::default())
        .setup(|app| {
            let handle = app.handle().clone();
            let store = SettingsStore::load(&handle)?;
            app.manage(store);
            // pins of packaged apps made by their exe cannot be launched;
            // point them at the apps themselves
            #[cfg(windows)]
            commands::settings::migrate_packaged_pins(&handle);

            // Icons are served to the webview through the asset protocol,
            // whose static scope in tauri.conf.json only covers %APPDATA%.
            // A portable copy keeps its icon cache beside the exe, outside
            // that scope, so every icon would be refused and show as a
            // broken image. Allow wherever the cache really is.
            if let Ok(dir) = core::paths::data_dir(&handle) {
                if let Err(e) = app.asset_protocol_scope().allow_directory(&dir, true) {
                    log::warn!("could not allow the icon cache for the webview: {e}");
                }
            }

            let window = app
                .get_webview_window("dock")
                .expect("dock window declared in tauri.conf.json");

            #[cfg(windows)]
            {
                let hwnd = window.hwnd()?;
                platform::windows::dock_window::apply_dock_styles(
                    windows::Win32::Foundation::HWND(hwnd.0),
                )?;
            }

            // honor the taskbar preference from the last session, and if it
            // is off, force the taskbar back: a previous crash while hidden
            // must not leave the user without one.
            //
            // This goes before the dock is placed: the screen space the dock
            // reserves is negotiated around any taskbar still on screen, so
            // placing it first parks the dock above a taskbar that is about
            // to disappear.
            let taskbar_hidden = app.state::<SettingsStore>().get().hide_taskbar;
            if taskbar_hidden {
                platform::windows::taskbar::set_taskbar_autohide(true);
            } else {
                platform::windows::taskbar::restore_taskbar();
            }

            commands::dock::position_dock(&handle)?;
            window.show()?;

            // The shell takes a moment to actually clear its taskbar away,
            // so the first placement can still have seen it. Renegotiate
            // once it has settled.
            if taskbar_hidden {
                let handle = handle.clone();
                tauri::async_runtime::spawn(async move {
                    commands::dock::settle_after_taskbar_change(&handle).await;
                });
            }

            // With a dock on every monitor, the extra docks are built now
            // (spawned, because building a webview inside setup would
            // deadlock) and again whenever a monitor comes or goes.
            {
                let handle = handle.clone();
                tauri::async_runtime::spawn(async move {
                    commands::dock::sync_docks(&handle).await;
                    // the menu bar, if it is switched on, is built after the
                    // docks so that they are placed first and then make way
                    commands::menubar::sync_menubar(&handle).await;
                    // and the frame, if on, goes round both
                    commands::frame::sync_frames(&handle).await;
                });
            }
            #[cfg(windows)]
            commands::frame::init(&handle);
            // the shortcuts that bring the keyboard to the menu bar and the dock
            #[cfg(windows)]
            {
                let enabled = app.state::<SettingsStore>().get().accessibility.keyboard_shortcuts;
                let handle = handle.clone();
                platform::windows::hotkeys::start(enabled, move |target| {
                    let h = handle.clone();
                    let _ = handle.run_on_main_thread(move || commands::keyboard::enter(&h, target));
                });
            }
            #[cfg(windows)]
            {
                let handle = handle.clone();
                platform::windows::running::set_display_hook(move || {
                    let handle = handle.clone();
                    tauri::async_runtime::spawn(async move {
                        commands::dock::sync_docks(&handle).await;
                        commands::menubar::sync_menubar(&handle).await;
                        commands::frame::sync_frames(&handle).await;
                    });
                });
            }

            #[cfg(windows)]
            platform::windows::running::start(handle.clone());
            commands::system_cmd::start_poller(handle.clone());
            setup_tray(app)?;
            // Widgets were on last time, so put them back. Spawned
            // because building a webview inside setup would deadlock on
            // the thread the webview needs.
            if app.state::<SettingsStore>().get().widgets.enabled {
                let handle = handle.clone();
                tauri::async_runtime::spawn(async move {
                    if let Err(e) = commands::widgets::open_widget_layer(handle).await {
                        log::warn!("could not restore the widget layer: {e}");
                    }
                });
            }
            commands::apps::warm_app_cache();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::settings::get_settings,
            commands::settings::set_settings,
            commands::settings::pin_item,
            commands::settings::unpin_item,
            commands::settings::reorder_pinned,
            commands::settings::reorder_running,
            commands::settings::first_run_import,
            commands::settings::export_settings,
            commands::settings::export_settings_file,
            commands::settings::import_settings,
            commands::settings::open_settings,
            commands::settings::storage_info,
            commands::apps::list_apps,
            commands::apps::resolve_icons,
            commands::apps::app_display_name,
            commands::apps::launch,
            commands::apps::launch_as_admin,
            commands::apps::open_file_location,
            commands::apps::resolve_drop,
            commands::apps::list_folder,
            commands::apps::list_recent_files,
            commands::dock::resize_dock,
            commands::glass::report_dock_bar,
            commands::control::get_system_accessibility,
            commands::control::get_radios,
            commands::control::set_radio,
            commands::control::list_wifi,
            commands::control::connect_wifi,
            commands::control::disconnect_wifi,
            commands::control::list_bluetooth,
            commands::control::get_brightness,
            commands::control::set_brightness,
            commands::dock::list_monitors,
            commands::dock::dock_monitor,
            commands::menubar::resize_menubar,
            commands::menubar::system_action,
            commands::menubar::open_dock_search,
            commands::windows_cmd::hide_app,
            commands::windows_cmd::hide_others,
            commands::windows_cmd::show_all_apps,
            commands::windows_cmd::quit_app_windows,
            commands::dock::set_dock_focusable,
            commands::menubar::set_menubar_menu_open,
            commands::dock::set_taskbar_hidden,
            commands::dock::quit_app,
            commands::dock::set_memory_saver,
            commands::windows_cmd::get_running,
            commands::windows_cmd::activate_window,
            commands::windows_cmd::toggle_window,
            commands::windows_cmd::minimize_window,
            commands::windows_cmd::close_window,
            commands::windows_cmd::show_window_previews,
            commands::windows_cmd::hide_window_previews,
            commands::windows_cmd::peek_window,
            commands::system_cmd::get_system_status,
            commands::system_cmd::set_volume,
            commands::system_cmd::open_recycle_bin,
            commands::system_cmd::open_notification_center,
            commands::system_cmd::open_tray_overflow,
            commands::system_cmd::empty_recycle_bin,
            commands::system_cmd::get_wallpaper_accent,
            commands::audio::list_app_audio,
            commands::audio::get_app_audio,
            commands::audio::set_app_audio,
            commands::audio::nudge_app_volume,
            commands::audio::toggle_app_mute,
            commands::audio::list_audio_devices,
            commands::audio::set_app_output_device,
            commands::modes::enable_modes,
            commands::modes::create_mode,
            commands::modes::rename_mode,
            commands::modes::delete_mode,
            commands::modes::switch_mode,
            commands::modes::capture_workspace,
            commands::modes::restore_workspace,
            commands::modes::clear_workspace,
            commands::modes::set_mode_apps,
            commands::modes::set_auto_switch,
            commands::modes::set_restore_workspace_on_switch,
            commands::modes::foreground_changed,
            commands::widgets::widget_desktop_bounds,
            commands::widgets::open_widget_layer,
            commands::widgets::close_widget_layer,
            commands::widgets::set_widget_hit_rects,
            commands::widgets::set_widget_drag_mode,
            commands::widgets::enable_widgets,
            commands::widgets::add_widget,
            commands::widgets::remove_widget,
            commands::widgets::place_widget,
            commands::widgets::style_widget,
            commands::widgets::allow_weather_network,
            commands::widgets::widget_system_load,
            commands::widgets::widget_now_playing,
            commands::widgets::widget_media_control,
        ])
        .build(tauri::generate_context!())
        .expect("error while building Aero Dock")
        .run(|_app, event| {
            match &event {
                tauri::RunEvent::ExitRequested { code, .. } => {
                    crate::trace!("exit requested, code {code:?}");
                }
                tauri::RunEvent::Exit => crate::trace!("exit"),
                tauri::RunEvent::WindowEvent {
                    label,
                    event: tauri::WindowEvent::CloseRequested { .. },
                    ..
                } => crate::trace!("close requested: {label}"),
                tauri::RunEvent::WindowEvent {
                    label,
                    event: tauri::WindowEvent::Destroyed,
                    ..
                } => crate::trace!("destroyed: {label}"),
                _ => {}
            }
            // leaving? give the user their taskbar back
            if let tauri::RunEvent::ExitRequested { .. } = event {
                // always restore, not only when the pref is on: the user may
                // have toggled it off mid-session without the bar coming back
                platform::windows::taskbar::restore_taskbar();
                // windows the frame has rounded get their own shape back
                commands::frame::shutdown();
                platform::windows::appbar::release_all();
            }
        });
}

/// Tray icon: the dock's home base. Left-click toggles dock visibility;
/// the menu covers show/hide, settings, and quit.
/// Where the support link points. Kept in step with `KOFI_URL` in
/// `src/links.ts`, which is what the windows themselves use.
const KOFI_URL: &str = "https://ko-fi.com/theagencymge";

fn setup_tray(app: &tauri::App) -> tauri::Result<()> {
    use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
    use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};

    let toggle = MenuItem::with_id(app, "toggle", "Show/hide dock", true, None::<&str>)?;
    let settings = MenuItem::with_id(app, "settings", "Settings…", true, None::<&str>)?;
    let support = MenuItem::with_id(app, "support", "Support Aero Dock ☕", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Quit Aero Dock", true, None::<&str>)?;
    let separator = PredefinedMenuItem::separator(app)?;
    let menu = Menu::with_items(app, &[&toggle, &settings, &support, &separator, &quit])?;

    fn toggle_dock(app: &tauri::AppHandle) {
        // every dock together: they are shown or hidden as one
        let docks = commands::dock::dock_windows(app);
        let showing = docks.iter().any(|w| w.is_visible().unwrap_or(false));
        for w in docks {
            if showing {
                let _ = w.hide();
            } else {
                let _ = w.show();
            }
        }
        // the blur behind the bar goes and comes with it
        commands::glass::sync_all(app);
    }

    TrayIconBuilder::with_id("aero-dock-tray")
        .icon(
            app.default_window_icon()
                .expect("bundle has a default icon")
                .clone(),
        )
        .tooltip("Aero Dock (right-click for menu)")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "toggle" => toggle_dock(app),
            "settings" => {
                let app = app.clone();
                tauri::async_runtime::spawn(async move {
                    if let Err(e) = commands::settings::open_settings(app).await {
                        log::error!("open settings from tray failed: {e}");
                    }
                });
            }
            "support" => {
                // the shell opens it in whatever browser the user uses;
                // nothing external is ever loaded into our own windows
                if let Err(e) = commands::apps::launch_target(KOFI_URL) {
                    log::warn!("could not open the support page: {e}");
                }
            }
            "quit" => commands::dock::quit_app(app.clone()),
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                toggle_dock(tray.app_handle());
            }
        })
        .build(app)?;
    Ok(())
}
