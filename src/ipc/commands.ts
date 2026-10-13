/**
 * Typed bindings for every Rust command. This file is the only place in
 * the frontend allowed to call `invoke` directly.
 */

import { invoke } from "@tauri-apps/api/core";
import type {
  AppAudio,
  AppEntry,
  AudioDevice,
  BluetoothDevice,
  BrightnessInfo,
  MonitorInfoEx,
  OutputChoice,
  PinnedItem,
  PrivacyUse,
  Program,
  RadioInfo,
  RecentFile,
  RestoreReport,
  RunningSnapshot,
  Settings,
  StorageInfo,
  Stats,
  SwitchReport,
  SystemAccessibility,
  SystemLoad,
  SystemStatus,
  WidgetKind,
  WidgetStyle,
  WifiNetwork,
} from "./types";
import type { DesktopBounds, FrameRow, Download, FoundFile, HitRect, MediaAction, NowPlaying, Profile } from "./types";

export const ipc = {
  // settings
  getSettings: () => invoke<Settings>("get_settings"),
  setSettings: (settings: Settings) => invoke<Settings>("set_settings", { settings }),
  pinItem: (item: PinnedItem, index?: number) =>
    invoke<Settings>("pin_item", { item, index: index ?? null }),
  unpinItem: (id: string) => invoke<Settings>("unpin_item", { id }),
  reorderPinned: (ids: string[]) => invoke<Settings>("reorder_pinned", { ids }),
  reorderRunning: (ids: string[]) => invoke<Settings>("reorder_running", { ids }),
  firstRunImport: (items: PinnedItem[]) =>
    invoke<Settings>("first_run_import", { items }),
  exportSettings: () => invoke<string>("export_settings"),
  exportSettingsFile: () => invoke<string>("export_settings_file"),
  importSettings: (json: string) => invoke<Settings>("import_settings", { json }),
  openSettings: () => invoke<void>("open_settings"),
  storageInfo: () => invoke<StorageInfo>("storage_info"),
  quitApp: () => invoke<void>("quit_app"),
  /** Ask WebView2 to drop caches (true) or behave normally (false). */
  setMemorySaver: (low: boolean) => invoke<void>("set_memory_saver", { low }),

  // apps
  listApps: () => invoke<AppEntry[]>("list_apps"),
  /** What an app calls itself (its Start menu name, or the description in its
   *  version information), as opposed to the title of a window it has open. */
  appDisplayName: (target: string) => invoke<string | null>("app_display_name", { target }),
  resolveIcons: (targets: string[], style?: string, tint?: string) =>
    invoke<Record<string, string>>("resolve_icons", { targets, style: style ?? null, tint: tint ?? null }),
  launch: (target: string, args?: string) =>
    invoke<void>("launch", { target, args: args || null }),
  launchAsAdmin: (target: string, args?: string) =>
    invoke<void>("launch_as_admin", { target, args: args || null }),
  openFileLocation: (target: string) =>
    invoke<void>("open_file_location", { target }),
  resolveDrop: (path: string) => invoke<AppEntry>("resolve_drop", { path }),
  listRecentFiles: (limit?: number) =>
    invoke<RecentFile[]>("list_recent_files", { limit: limit ?? null }),
  setDockFocusable: (focusable: boolean) =>
    invoke<void>("set_dock_focusable", { focusable }),
  setTaskbarHidden: (hidden: boolean) =>
    invoke<void>("set_taskbar_hidden", { hidden }),
  listFolder: (path: string, limit?: number) =>
    invoke<{ name: string; path: string; isDir: boolean }[]>("list_folder", {
      path,
      limit: limit ?? null,
    }),

  // running windows
  getRunning: () => invoke<RunningSnapshot>("get_running"),
  activateWindow: (hwnd: number) => invoke<void>("activate_window", { hwnd }),
  /** Taskbar-style click: restore if minimized, minimize if frontmost, else focus. */
  toggleWindow: (hwnd: number, target?: { x: number; y: number; width: number; height: number }) =>
    invoke<void>("toggle_window", { hwnd, target: target ?? null }),
  minimizeWindow: (hwnd: number) => invoke<void>("minimize_window", { hwnd }),
  closeWindow: (hwnd: number) => invoke<void>("close_window", { hwnd }),

  // system widgets
  getSystemStatus: () => invoke<SystemStatus>("get_system_status"),
  setVolume: (level?: number, mute?: boolean) =>
    invoke<void>("set_volume", { level: level ?? null, mute: mute ?? null }),
  openRecycleBin: () => invoke<void>("open_recycle_bin"),
  emptyRecycleBin: () => invoke<void>("empty_recycle_bin"),
  /** Open the notification centre and calendar. */
  openNotificationCenter: () => invoke<void>("open_notification_center"),
  /** Open (or, if open, close) the tray's hidden-icons flyout, centred above
   *  the given point in dock-window pixels. Resolves false if it would not open. */
  openTrayOverflow: (anchorX: number, anchorTop: number) =>
    invoke<boolean>("open_tray_overflow", { anchorX, anchorTop }),
  getWallpaperAccent: () => invoke<string>("get_wallpaper_accent"),

  // window previews (DWM thumbnails, physical px in dock client area)
  showWindowPreviews: (
    slots: { hwnd: number; x: number; y: number; w: number; h: number }[],
  ) => invoke<void>("show_window_previews", { slots }),
  hideWindowPreviews: () => invoke<void>("hide_window_previews"),
  /** Show the real window behind a preview (peek), or null to put it back. */
  peekWindow: (hwnd: number | null) => invoke<void>("peek_window", { hwnd }),

  // per-app audio
  listAppAudio: () => invoke<AppAudio[]>("list_app_audio"),
  getAppAudio: (exe: string) => invoke<AppAudio | null>("get_app_audio", { exe }),
  setAppAudio: (exe: string, level?: number, mute?: boolean) =>
    invoke<AppAudio | null>("set_app_audio", {
      exe,
      level: level ?? null,
      mute: mute ?? null,
    }),
  /** Positive notches scroll the volume up. */
  nudgeAppVolume: (exe: string, notches: number) =>
    invoke<AppAudio | null>("nudge_app_volume", { exe, notches }),
  toggleAppMute: (exe: string) => invoke<AppAudio | null>("toggle_app_mute", { exe }),
  listAudioDevices: () => invoke<AudioDevice[]>("list_audio_devices"),
  setAppOutputDevice: (exe: string, deviceId: string | null, openSettings: boolean) =>
    invoke<OutputChoice>("set_app_output_device", { exe, deviceId, openSettings }),

  // modes
  enableModes: (enabled: boolean) => invoke<Settings>("enable_modes", { enabled }),
  createMode: (name: string, glyph: string | null, copyCurrentPins: boolean) =>
    invoke<Settings>("create_mode", { name, glyph, copyCurrentPins }),
  renameMode: (id: string, name: string, glyph: string | null) =>
    invoke<Settings>("rename_mode", { id, name, glyph }),
  deleteMode: (id: string) => invoke<Settings>("delete_mode", { id }),
  switchMode: (id: string) => invoke<SwitchReport>("switch_mode", { id }),
  captureWorkspace: (modeId?: string) =>
    invoke<Settings>("capture_workspace", { modeId: modeId ?? null }),
  restoreWorkspace: (modeId?: string) =>
    invoke<RestoreReport>("restore_workspace", { modeId: modeId ?? null }),
  clearWorkspace: (modeId: string) => invoke<Settings>("clear_workspace", { modeId }),
  setModeApps: (modeId: string, apps: string[]) =>
    invoke<Settings>("set_mode_apps", { modeId, apps }),
  setAutoSwitch: (enabled: boolean) => invoke<Settings>("set_auto_switch", { enabled }),
  setRestoreWorkspaceOnSwitch: (enabled: boolean) =>
    invoke<Settings>("set_restore_workspace_on_switch", { enabled }),
  foregroundChanged: (exe: string) =>
    invoke<SwitchReport | null>("foreground_changed", { exe }),

  // desktop widgets
  widgetDesktopBounds: () => invoke<DesktopBounds>("widget_desktop_bounds"),
  openWidgetLayer: () => invoke<void>("open_widget_layer"),
  closeWidgetLayer: () => invoke<void>("close_widget_layer"),
  /** Only these rectangles take clicks; the rest passes to the desktop. */
  setWidgetHitRects: (rects: HitRect[]) => invoke<void>("set_widget_hit_rects", { rects }),
  setWidgetDragMode: (dragging: boolean) =>
    invoke<void>("set_widget_drag_mode", { dragging }),
  enableWidgets: (enabled: boolean) => invoke<Settings>("enable_widgets", { enabled }),
  addWidget: (kind: WidgetKind, x?: number, y?: number) =>
    invoke<Settings>("add_widget", { kind, x: x ?? null, y: y ?? null }),
  removeWidget: (id: string) => invoke<Settings>("remove_widget", { id }),
  placeWidget: (id: string, x: number, y: number, width: number, height: number) =>
    invoke<Settings>("place_widget", { id, x, y, width, height }),
  styleWidget: (id: string, style: WidgetStyle) =>
    invoke<Settings>("style_widget", { id, style }),
  allowWeatherNetwork: (allowed: boolean) =>
    invoke<Settings>("allow_weather_network", { allowed }),
  widgetSystemLoad: () => invoke<SystemLoad>("widget_system_load"),
  widgetNowPlaying: () => invoke<NowPlaying>("widget_now_playing"),
  widgetMediaControl: (action: MediaAction) =>
    invoke<boolean>("widget_media_control", { action }),
  mediaArtwork: (fresh: boolean) => invoke<string | null>("media_artwork", { fresh }),
  mediaSeek: (positionMs: number) => invoke<boolean>("media_seek", { positionMs }),
  mediaSeekBy: (deltaMs: number) => invoke<boolean>("media_seek_by", { deltaMs }),
  mediaShuffle: (on: boolean) => invoke<boolean>("media_shuffle", { on }),
  mediaRepeat: (mode: "none" | "track" | "list") => invoke<boolean>("media_repeat", { mode }),
  mediaSelect: (id: string | null) => invoke<void>("media_select", { id }),
  mediaFocusSource: (hwnd: number) => invoke<void>("media_focus_source", { hwnd }),
  mediaSpectrum: (on: boolean) => invoke<void>("media_spectrum", { on }),

  // dock window
  /** `width`/`height` size the OS window; `visible*` is the part of it that
   *  shows pixels and takes mouse input (the rest is clipped away). */
  resizeDock: (
    width: number,
    height: number,
    visibleWidth: number,
    visibleHeight: number,
    barThickness: number,
  ) => invoke<void>("resize_dock", { width, height, visibleWidth, visibleHeight, barThickness }),
  /** Where the dock's glass bar is in its window (page px), so Windows can blur
   *  what is behind it; `shown` false once it has slid away. */
  reportDockBar: (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    shown: boolean,
  ) =>
    invoke<void>("report_dock_bar", {
      // the page's own idea of its pixels, which is right for the screen it is on now
      bar: { x, y, width, height, radius, shown, dpr: window.devicePixelRatio },
    }),
  /** Where the Start menu's panel is within its window now, in physical px, for the blur
   *  that goes behind it; `shown` false while it is too faint (or gone) for one. */
  /** A blurred picture of the screen behind a region of this window, our windows left out (see
   *  BackdropLayer): a 16-byte header (where, from the window, and how big, in physical pixels) and a PNG.
   *  Empty when there is none to be had. */
  captureBackdrop: (request: {
    x: number;
    y: number;
    width: number;
    height: number;
    dpr: number;
    blur: number;
    saturate: number;
    brightness: number;
  }) => invoke<ArrayBuffer>("capture_backdrop", { request }),
  // control center
  // mission control
  toggleMission: () => invoke<void>("toggle_mission"),
  closeMission: () => invoke<void>("close_mission"),
  /** Where each window is on screen (physical px); minimised ones are left out. */
  windowRects: (hwnds: number[]) =>
    invoke<{ hwnd: number; x: number; y: number; width: number; height: number }[]>("window_rects", { hwnds }),
  getPrivacyUse: () => invoke<PrivacyUse[]>("get_privacy_use"),
  getStats: () => invoke<Stats>("get_stats"),
  getTopProcesses: (byCpu: boolean, limit: number) => invoke<Program[]>("get_top_processes", { byCpu, limit }),
  getSystemAccessibility: () => invoke<SystemAccessibility>("get_system_accessibility"),
  getRadios: () => invoke<RadioInfo[]>("get_radios"),
  setRadio: (kind: RadioInfo["kind"], on: boolean) => invoke<void>("set_radio", { kind, on }),
  listWifi: (rescan: boolean) => invoke<WifiNetwork[]>("list_wifi", { rescan }),
  connectWifi: (ssid: string) => invoke<void>("connect_wifi", { ssid }),
  disconnectWifi: () => invoke<void>("disconnect_wifi"),
  listBluetooth: () => invoke<BluetoothDevice[]>("list_bluetooth"),
  getBrightness: () => invoke<BrightnessInfo>("get_brightness"),
  setBrightness: (percent: number) => invoke<void>("set_brightness", { percent }),
  listMonitors: () => invoke<MonitorInfoEx[]>("list_monitors"),
  /** The monitor the calling dock window is on, by device name. */
  dockMonitor: () => invoke<string>("dock_monitor"),

  // menu bar
  /** How tall the part of the menu bar's window in use is, in logical px. */
  resizeMenubar: (visibleHeight: number) =>
    invoke<void>("resize_menubar", { visibleHeight }),
  /** A menu has opened or closed: Rust watches for a click elsewhere, and for
   *  Escape, while one is open, and sends `menubarOutside` / `menubarEscape`. */
  setMenubarMenuOpen: (open: boolean) => invoke<void>("set_menubar_menu_open", { open }),
  /** Run a power or session action; restart, shut down and log out ask first. */
  systemAction: (kind: "lock" | "sleep" | "restart" | "shutdown" | "logoff" | "taskmgr") =>
    invoke<void>("system_action", { kind }),
  hideApp: (exe: string) => invoke<void>("hide_app", { exe }),
  hideOthers: (exe: string) => invoke<void>("hide_others", { exe }),
  showAllApps: () => invoke<void>("show_all_apps"),
  quitAppWindows: (exe: string) => invoke<void>("quit_app_windows", { exe }),
  /** Open the dock's search, which lives in the dock's own window. */
  openDockSearch: () => invoke<void>("open_dock_search"),
  /** Open the Start menu, or close it if it is open. */
  toggleStart: () => invoke<void>("toggle_start"),
  /** The Start menu is done; `restore` gives the keyboard back to whoever had it. */
  closeStart: (restore: boolean) => invoke<void>("close_start", { restore }),
  userProfile: () => invoke<Profile>("user_profile"),
  searchFiles: (query: string) => invoke<FoundFile[]>("search_files", { query }),
  /** Look at each screen (a window of stripes shows on each for a second) to see whether the frosted glass keeps its shape. */
  /** Where each blur pane is now, written to blur-report.txt as well. */
  blurReport: () => invoke<string>("blur_report"),
  /** How this window's frames went, for the table of frame timings. */
  reportFrameStats: (stats: { fps: number; avgMs: number; p95Ms: number; worstMs: number; late: number; frames: number; dpr: number }) =>
    invoke<void>("report_frame_stats", { stats }),
  frameStats: () => invoke<FrameRow[]>("frame_stats"),
  frameReport: () => invoke<string>("frame_report"),
  /** Close Aero Dock and start it again. */
  restartApp: () => invoke<void>("restart_app"),
  listRecentDownloads: (limit?: number) => invoke<Download[]>("list_recent_downloads", { limit: limit ?? null }),
};
