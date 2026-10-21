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
    // Each window is given the folder by name (`data_directory`, see the builders and the dock's in `setup`), and it is
    // not put in the environment: every program started from the dock or Start inherits the environment, and a
    // WebView2 program (DriveWorks Administrator) told to use this profile folder, which is open here with other
    // arguments, fails to initialise and crashes.
    #[cfg(windows)]
    if let Some(dir) = core::paths::webview_dir() {
        let _ = std::fs::create_dir_all(&dir);
    }

    let mut context = tauri::generate_context!();
    // draw with the graphics card or in software, by the setting, before any window is made
    #[cfg(windows)]
    commands::settings::apply_gpu_choice(context.config_mut());

    tauri::Builder::default()
        // No raw keyboard and mouse events (nothing here reads them). Registering for them, which tao does by default
        // while a window of ours has focus, kept the Windows key's hook (`winkey`) from being called at all while our
        // own windows had the keyboard, so Windows' Start menu opened instead (tauri-apps/wry#1761).
        .device_event_filter(tauri::DeviceEventFilter::Always)
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

            // The dock window is declared in tauri.conf.json with `create: false` and made here, because a window
            // made from the configuration cannot be given an absolute profile folder (only one under the app's
            // own data folder), and the portable profile has to be named without the environment (see the note
            // in `run`).
            let window = {
                let config = app
                    .config()
                    .app
                    .windows
                    .iter()
                    .find(|w| w.label == "dock")
                    .cloned()
                    .expect("dock window declared in tauri.conf.json");
                let builder = tauri::WebviewWindowBuilder::from_config(app.handle(), &config)?;
                #[cfg(windows)]
                let builder = match core::paths::webview_dir() {
                    Some(dir) => builder.data_directory(dir),
                    None => builder,
                };
                builder.build()?
            };

            // Not having the window's handle yet is not worth failing the launch for ("the underlying handle is not
            // available" ended a start on October 20; the next one a minute later was fine): the styles are put on
            // again each time the dock is placed.
            #[cfg(windows)]
            match window.hwnd() {
                Ok(hwnd) => {
                    let hwnd = windows::Win32::Foundation::HWND(hwnd.0);
                    if let Err(e) = platform::windows::dock_window::apply_dock_styles(hwnd) {
                        log::warn!("could not style the dock window: {e}");
                    }
                    platform::windows::dock_window::strip_caption(hwnd);
                }
                Err(e) => log::warn!("the dock window's handle is not ready yet: {e}"),
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

            // the same for its first placement: the docks are placed again once they are all built (sync_docks)
            if let Err(e) = commands::dock::position_dock(&handle) {
                log::warn!("could not place the dock yet: {e}");
            }
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
            #[cfg(windows)]
            commands::insight::start_privacy_watch(handle.clone());
            // another program (Mica For Everyone) can put a grey material behind every window
            #[cfg(windows)]
            platform::windows::system_backdrop::start();
            // the table of frame timings, if it was left on
            {
                let h = handle.clone();
                tauri::async_runtime::spawn(async move { commands::perf::sync(&h).await });
            }
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
            // the Windows key opening the Start menu, if it was chosen
            #[cfg(windows)]
            {
                let enabled = app.state::<SettingsStore>().get().start.windows_key;
                let handle = handle.clone();
                platform::windows::winkey::start(enabled, move || {
                    let h = handle.clone();
                    let _ = handle.run_on_main_thread(move || {
                        commands::keyboard::enter(&h, platform::windows::hotkeys::Target::Start)
                    });
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

            // Lock, unlock, sleep, a display or the compositor changing can leave the frosted glass's blur stale, so it
            // is put back in place: at once, and again a moment later when the screens have settled (that one makes
            // each glass window a pixel wider for a moment too). Every event is in the trace, to see what happened.
            #[cfg(windows)]
            {
                let handle = handle.clone();
                platform::windows::running::set_system_hook(move |what, refresh| {
                    crate::trace!("system: {what}{}", if refresh { " (refreshing the glass)" } else { "" });
                    if !refresh {
                        return;
                    }
                    let _ = handle.run_on_main_thread(move || {
                        let n = platform::windows::glass::refresh_all(false);
                        crate::trace!("glass: refreshed {n} window(s) for: {what}");
                    });
                    let later = handle.clone();
                    std::thread::spawn(move || {
                        std::thread::sleep(std::time::Duration::from_millis(1500));
                        let _ = later.clone().run_on_main_thread(move || {
                            let n = platform::windows::glass::refresh_all(true);
                            crate::trace!("glass: refreshed {n} window(s) again, a moment after: {what}");
                        });
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
            commands::start::prebuild(&handle);
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
            commands::apps::jump_list,
            commands::apps::jump_open,
            commands::apps::launch,
            commands::apps::launch_as_admin,
            commands::apps::open_file_location,
            commands::apps::resolve_drop,
            commands::apps::list_folder,
            commands::apps::list_recent_files,
            commands::dock::resize_dock,
            commands::glass::report_dock_bar,
            commands::mission::toggle_mission,
            commands::mission::close_mission,
            commands::mission::window_rects,
            commands::start::toggle_start,
            commands::start::backdrop_light,
            commands::start::close_start,
            commands::start::start_ready,
            commands::start::user_profile,
            commands::start::list_recent_downloads,
            commands::glass::set_glass_pane,
            commands::settings::restart_app,
            commands::perf::report_frame_stats,
            commands::perf::frame_stats,
            commands::perf::frame_report,
            commands::start::search_files,
            commands::start::windows_search,
            commands::insight::get_privacy_use,
            commands::insight::get_stats,
            commands::insight::get_top_processes,
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
            commands::dock::set_tray_icon,
            commands::dock::set_memory_saver,
            commands::windows_cmd::get_running,
            commands::windows_cmd::activate_window,
            commands::windows_cmd::toggle_window,
            commands::windows_cmd::minimize_window,
            commands::windows_cmd::close_window,
            commands::windows_cmd::end_task,
            commands::frame::report_frame_glass,
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
            commands::widgets::widget_save_media,
            commands::widgets::widget_clear_media,
            commands::widgets::set_widget_keyboard,
            commands::widgets::widget_system_load,
            commands::widgets::widget_now_playing,
            commands::widgets::widget_media_control,
            commands::widgets::media_artwork,
            commands::widgets::media_seek,
            commands::widgets::media_seek_by,
            commands::widgets::media_shuffle,
            commands::widgets::media_repeat,
            commands::widgets::media_select,
            commands::widgets::media_focus_source,
            commands::widgets::media_spectrum,
        ])
        .build(context)
        .expect("error while building Liquidock")
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
    let support = MenuItem::with_id(app, "support", "Support Liquidock ☕", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Quit Liquidock", true, None::<&str>)?;
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
    }

    TrayIconBuilder::with_id("aero-dock-tray")
        .icon(
            app.default_window_icon()
                .expect("bundle has a default icon")
                .clone(),
        )
        .tooltip("Liquidock (right-click for menu)")
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
