/**
 * TypeScript mirrors of the Rust IPC types (src-tauri/src/core/settings.rs,
 * platform/mod.rs, platform/windows/monitors.rs). Keep both sides in sync
 * in the same change, always.
 */

export type DockEdge = "top" | "bottom" | "left" | "right";

export interface DockSettings {
  edge: DockEdge;
  monitor: string | null;
  /** A dock on every monitor, not just the chosen one. */
  allMonitors: boolean;
  /** With several docks, each lists only windows on its own screen. */
  perMonitorWindows: boolean;
  iconSize: number;
  magnification: boolean;
  magnificationScale: number;
  magnificationLift: number;
  magnificationReach: number;
  autoHide: boolean;
  /** Pointer-away delay before the dock slides out, in milliseconds. */
  autoHideDelayMs: number;
  floating: boolean;
  floatingMargin: number;
  /** Icon-to-glass padding across the dock axis, in logical px. */
  padding: number;
  /** Gap between an icon and its running-app dot, in logical px. */
  indicatorGap: number;
  /** Horizontal gap between apps in the dock, in logical px. */
  iconSpacing: number;
  /** Corner radius of the dock bar in px; null = the material's own. */
  cornerRadius: number | null;
  /** Size of the network, volume, battery and Recycle Bin glyphs, in px. */
  statusIconSize: number;
  /** Order running (unpinned) apps were dragged into, as dock item ids. */
  runningOrder: string[];
  /** Search and Settings appear only when the pointer nears their end. */
  revealControls: boolean;
  /** Reserve screen space so maximised windows stop at the dock. */
  reserveSpace: boolean;
  showRunningApps: boolean;
  /** Built-in dock controls, each independently hideable. */
  showSearchButton: boolean;
  showSettingsButton: boolean;
  showClock: boolean;
  /** Battery, network, volume and Recycle Bin glyphs. */
  showSystemStatus: boolean;
  /** An app flashing for attention bounces its icon and wears a dot. */
  attentionBounce: boolean;
  /** How a window goes into the dock when minimised from it. */
  minimizeEffect: "genie" | "scale" | "off";
  /** What a middle click on an icon does: end the app, or ask its windows to close. */
  middleClick: "endTask" | "close";
  /** How strongly the theme's colour tints the dock's glass, 0 to 1.5 (1 = as the material has it). */
  tint: number;
  /** Tint the dock as the menu bar is tinted, so the dock, the bar and the frame read as one glass. */
  tintLikeMenuBar: boolean;
  /** What marks running apps: a dot under each, or one mark under the app in front with a ghost under the hovered one. */
  indicatorStyle: "dots" | "focus";
  /** The focus mark's shape. */
  indicatorShape: "pill" | "dot";
  /** How the focus mark moves to the app that comes to the front. */
  focusMotion: MarkMotion;
  /** How its ghost follows the pointer. */
  ghostMotion: MarkMotion;
}

/** How the dock's focus mark and its ghost move. */
export type MarkMotion = "glide" | "bounce" | "snap" | "float" | "fade";

/** How a surface is rendered. Both are Frutiger Aero; they differ in how
 *  thick the material reads. "aero" is the glossy beveled panel, "liquid"
 *  keeps the palette but renders as a thin lens. */
export type SurfaceStyle = "aero" | "liquid" | "clear";

/** plain: as drawn. glass: the icon with a glass body. clear: frosted white glass. tinted: glass in the theme's colour. */
export type IconStyle = "plain" | "glass" | "clear" | "tinted";

export interface AppearanceSettings {
  /** Legacy: the named theme, kept only to find a starting colour. */
  theme: string;
  /** The colour the whole look is derived from, `#rrggbb`; "" until picked. */
  accent: string;
  transparency: number;
  glassIntensity: number;
  bloomAmount: number;
  reflectionStrength: number;
  /** Shadow under the dock bar, 0 (none) to 1. */
  dockShadow: number;
  particleDensity: number;
  scene: string;
  animationSpeed: number;
  wallpaperSync: boolean;
  /** Material for the dock, its flyouts and its controls. */
  dockSurface: SurfaceStyle;
  /** Material for the settings window, independent of the dock. */
  settingsSurface: SurfaceStyle;
  /** Windows blurs what is behind the dock, menu bar and frame. */
  realBlur: boolean;
  /** A soft highlight that follows the pointer across the glass. */
  pointerLight: boolean;
  /** A fine grain over the glass. */
  glassGrain: boolean;
  /** What is done to every app's icon (baked into a copy of it). */
  iconStyle: IconStyle;
  /** How frosted the glass is on each surface, while frosted glass is on. */
  frost: FrostSettings;
  /** A table of how smoothly each window draws, on each screen (a diagnostic). */
  frameOverlay: boolean;
  /** Draw the windows with the graphics card (read when the program starts). */
  hardwareAcceleration: boolean;
  /** The settings window: dark liquid glass, or the classic sky. */
  settingsLook: "night" | "sky";
}

/** One window's frame timings (see commands/perf.rs). */
export interface FrameRow {
  label: string;
  monitor: string;
  refreshHz: number;
  fps: number;
  avgMs: number;
  p95Ms: number;
  worstMs: number;
  late: number;
  frames: number;
  dpr: number;
}

export type PinKind = "app" | "file" | "folder" | "stack";

export interface PinnedItem {
  id: string;
  kind: PinKind;
  path: string;
  name: string;
  icon: string | null;
  children: PinnedItem[];
  /** How a stack opens; unset means a grid. Only stacks use it. */
  view?: StackView | null;
}

/** How a stack of pinned items opens. */
export type StackView = "grid" | "fan" | "list";

/** One app's remembered audio inside a mode. */
export interface AppAudioPref {
  exe: string;
  volume: number;
  muted: boolean;
  deviceId: string | null;
}

export type WindowState = "normal" | "minimized" | "maximized";

export interface SnapRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface WindowSnapshot {
  exe: string;
  title: string;
  aumid: string | null;
  monitor: string;
  rect: SnapRect;
  state: WindowState;
}

export interface WorkspaceSnapshot {
  windows: WindowSnapshot[];
  /** Unix seconds. 0 means nothing has been saved yet. */
  capturedAt: number;
}

/** One saved way of working: its own pins, layout and per-app audio. */
export interface DockMode {
  id: string;
  name: string;
  glyph: string;
  pinned: PinnedItem[];
  audio: AppAudioPref[];
  workspace: WorkspaceSnapshot;
  autoSwitchApps: string[];
}

export interface ModesSettings {
  enabled: boolean;
  activeId: string;
  modes: DockMode[];
  autoSwitch: boolean;
  restoreWorkspaceOnSwitch: boolean;
}

export type WidgetKind = "clock" | "calendar" | "weather" | "systemStats" | "music";

/** Per-kind settings. Flat and optional so a kind can add one without a
 *  migration; each widget reads only the fields it cares about. */
export interface WidgetOptions {
  seconds: boolean;
  twentyFourHour: boolean;
  analog: boolean;
  latitude: number | null;
  longitude: number | null;
  place: string | null;
  celsius: boolean;
}

/** One widget on the desktop. Position is CSS pixels inside the overlay,
 *  whose origin is the top left of the virtual desktop. */
export interface WidgetInstance {
  id: string;
  kind: WidgetKind;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  surface: SurfaceStyle;
  accent: string | null;
  ambient: boolean;
  locked: boolean;
  options: WidgetOptions;
}

export interface WidgetsSettings {
  enabled: boolean;
  widgets: WidgetInstance[];
  /** Weather is the only widget that leaves the machine. */
  allowWeatherNetwork: boolean;
}

/** Appearance changes, all optional so the UI sends only what changed. */
export interface WidgetStyle {
  opacity?: number;
  surface?: SurfaceStyle;
  /** null clears the tint back to the theme accent. */
  accent?: string | null;
  ambient?: boolean;
  locked?: boolean;
  options?: WidgetOptions;
}

export interface DesktopBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Physical-pixel rectangle the overlay accepts clicks in. */
export interface HitRect {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

export interface SystemLoad {
  cpuPercent: number;
  memoryPercent: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  uptimeSeconds: number;
}

/** One of the players, when there is more than one. */
export interface PlayerBrief {
  id: string;
  name: string;
  title: string;
  playing: boolean;
  current: boolean;
}

export interface NowPlaying {
  active: boolean;
  title: string;
  artist: string;
  album: string;
  playing: boolean;
  /** The player's app id. */
  source: string;
  /** The program's own name. */
  sourceName: string;
  /** What to ask the icon cache for, or empty. */
  sourceTarget: string;
  /** A window of the program (the one showing this track if it can tell), or 0. */
  sourceHwnd: number;
  /** Changes with the track. */
  key: string;
  hasArtwork: boolean;
  positionMs: number;
  /** 0 for a live stream. */
  durationMs: number;
  canSeek: boolean;
  canPrevious: boolean;
  canNext: boolean;
  /** Null when the player has no shuffle. */
  shuffle: boolean | null;
  /** Null when the player has no repeat. */
  repeat: "none" | "track" | "list" | null;
  players: PlayerBrief[];
}

export type MediaAction = "playpause" | "next" | "previous";

/** The strip along the top of the screen, after the macOS menu bar. */
export interface MenuBarSettings {
  enabled: boolean;
  /** Height in logical px. */
  height: number;
  /** The bar shows the clock and status icons, so the dock does not. */
  takesOverDockStatus: boolean;
  /** Play the dock's ambient scene inside the bar. */
  ambient: boolean;
  showDate: boolean;
  showSeconds: boolean;
  /** Space between the bar and the top and sides of the screen, in px. Above
   *  0 the bar floats and is rounded on every corner. */
  gap: number;
  /** Corner radius in px. */
  cornerRadius: number;
  /** How strongly the bar is tinted with the theme colour (1 = default). */
  tint: number;
  /** Space between the items in the bar, in px. */
  itemSpacing: number;
  /** Size of the text in the bar, in px. */
  fontSize: number;
  /** The hairline of light round the bar's edge. */
  edgeHighlight: boolean;
  /** The circle behind the Wi-Fi icon in the Control Center, `#rrggbb`;
   *  "" follows the theme colour. */
  wifiColor: string;
  /** The same for the Bluetooth icon. */
  bluetoothColor: string;
  /** How far the sliding lens reaches past its button, in px. */
  lensGrow: number;
  /** How much the button under the lens is enlarged (1 = not at all). */
  lensMagnify: number;
  /** How strongly the lens bends what is under it (0 = not at all, 1 = default). */
  lensWarp: number;
  /** Menus and the Control Center close when the pointer leaves them. */
  closeOnLeave: boolean;
  /** A dot while an app is using the microphone or camera. */
  showPrivacy: boolean;
  /** A load graph that opens a popover of what is using the machine. */
  showStats: boolean;
  /** The Now Playing card takes its colours from the cover. */
  mediaTint: boolean;
  /** The card draws what is playing as moving bars (listens to the output). */
  mediaSpectrum: boolean;
  mediaIsland: boolean;
  mediaIslandPinned: boolean;
  mediaPeek: boolean;
}

/** Which animation each kind of thing uses: the id of a preset in
 *  `engine/animation/presets.ts`. Rust checks each against the same list. */
export interface AnimationSettings {
  /** Menu bar menus and the Control Center. */
  menu: string;
  /** The dock's flyouts and panels. */
  flyout: string;
  /** The dock appearing and disappearing. */
  dockReveal: string;
  /** What an icon does when an app is launched from it. */
  launch: string;
  /** How icons swell as the pointer passes over them. */
  magnify: string;
  /** The Start menu, opening and closing. */
  start: string;
  /** The media pill in the menu bar and the card under the Control Center button. */
  island: string;
}

/** A frame of glass round the free space of every monitor, between the menu bar
 *  and the dock, that holds maximised apps in from the screen edges. */
export interface FrameSettings {
  enabled: boolean;
  /** Width of the margin on every side, in px. */
  padding: number;
  /** Corner radius of the opening the apps sit in, in px. */
  cornerRadius: number;
  /** How strongly the margin is tinted with the theme colour (1 = default). */
  tint: number;
  /** Play the ambient scene in the margin. */
  ambient: boolean;
  /** A bevel of glass round the opening the apps sit in. */
  glassBorder: boolean;
  /** Width of that bevel, in px. */
  borderWidth: number;
}

/** How the app behaves for people who need it quieter, and how it feels. */
export interface AccessibilitySettings {
  /** "system" follows Windows' Animation effects switch. */
  reduceMotion: "system" | "on" | "off";
  /** "system" follows Windows' Transparency effects switch. */
  reduceTransparency: "system" | "on" | "off";
  /** Ctrl+Alt+M and Ctrl+Alt+D bring the keyboard to the menu bar and the dock. */
  keyboardShortcuts: boolean;
  /** Soft sounds for menus, switches and launching. */
  uiSounds: boolean;
  /** 0 to 1. */
  uiSoundVolume: number;
}

/** What Windows says about motion and transparency. */
export interface SystemAccessibility {
  reduceMotion: boolean;
  reduceTransparency: boolean;
}

/** One app using the microphone or the camera. */
export interface PrivacyUse {
  sensor: "microphone" | "camera";
  app: string;
}

/** The machine's load. */
export interface Stats {
  cpuPercent: number;
  memoryPercent: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  /** Bytes a second. */
  netDown: number;
  netUp: number;
}

/** A program (all its processes together) and what it uses. */
export interface Program {
  name: string;
  cpuPercent: number;
  memoryMb: number;
  processes: number;
}

/** A radio the Control Center can switch. */
export interface RadioInfo {
  kind: "wifi" | "bluetooth";
  name: string;
  on: boolean;
  /** False when it is off at a hardware switch or by policy. */
  switchable: boolean;
}

/** A Wi-Fi network in range. */
export interface WifiNetwork {
  ssid: string;
  /** 0 to 100. */
  signal: number;
  secured: boolean;
  connected: boolean;
  /** Saved before, so it can be joined without a password. */
  known: boolean;
}

/** A paired Bluetooth device. */
export interface BluetoothDevice {
  name: string;
  sort: "audio" | "input" | "phone" | "computer" | "other";
  connected: boolean;
}

/** The brightness of the screen the menu bar is on. */
export interface BrightnessInfo {
  available: boolean;
  /** 0 to 100. */
  percent: number;
}

/** One app pinned to the Start menu. */
export interface StartPin {
  name: string;
  /** An exe or document path, or `shell:AppsFolder\<aumid>`. */
  target: string;
  args: string;
}

export interface StartSettings {
  pinned: StartPin[];
  /** The pins were started from the dock's, once. */
  seeded: boolean;
  /** The Recommended section (recent files). */
  showRecommended: boolean;
}

/** How frosted one surface's glass is. */
export interface FrostLook {
  /** How far what is behind the glass is blurred, in pixels. */
  blur: number;
  /** How much grain lies over it, 0 to 1. */
  grain: number;
  /** Whether this surface, and everything that belongs to it, has frosted glass (set from the old single switch until set). */
  glass?: boolean;
}

export interface FrostSettings {
  dock: FrostLook;
  start: FrostLook;
  menuBar: FrostLook;
}

/** Who is signed in. */
export interface Profile {
  name: string;
  /** A `data:` address, or empty. */
  picture: string;
}

/** Something in the Downloads folder. */
export interface Download {
  name: string;
  path: string;
  /** When it last changed, in ms since 1970. */
  modifiedMs: number;
  size: number;
  folder: boolean;
}

/** A file or folder from Windows' index. */
export interface FoundFile {
  name: string;
  path: string;
  folder: boolean;
}

export interface Settings {
  schemaVersion: number;
  dock: DockSettings;
  appearance: AppearanceSettings;
  pinned: PinnedItem[];
  launchAtStartup: boolean;
  hideTaskbar: boolean;
  onboardingComplete: boolean;
  modes: ModesSettings;
  widgets: WidgetsSettings;
  menuBar: MenuBarSettings;
  accessibility: AccessibilitySettings;
  animations: AnimationSettings;
  frame: FrameSettings;
  start: StartSettings;
}

export interface AppEntry {
  name: string;
  shortcutPath: string | null;
  targetPath: string;
  args: string;
  icon: string | null;
  source: "start-menu" | "desktop" | "folder" | "apps-folder";
  /** When its shortcut was made (ms since 1970): when it was installed, or near it. 0 if unknown. */
  addedMs: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MonitorInfoEx {
  name: string;
  bounds: Rect;
  workArea: Rect;
  scale: number;
  isPrimary: boolean;
}

export interface WindowInfo {
  hwnd: number;
  title: string;
  exe: string;
  pid: number;
  /** AppUserModelID for UWP windows (hosted by ApplicationFrameHost). */
  aumid: string | null;
  /** Device name of the monitor most of the window is on (`\\.\DISPLAY1`),
   *  matching `MonitorInfoEx.name`. Empty if unknown. */
  monitor: string;
}

export interface RunningSnapshot {
  windows: WindowInfo[];
  focused: number;
}

export interface RecentFile {
  name: string;
  path: string;
  icon: string;
  usedAt: number;
}

export interface SystemStatus {
  battery: { present: boolean; percent: number; charging: boolean };
  internet: boolean;
  /** What the connection in use runs over; the icon follows it. */
  link: "wifi" | "ethernet" | "unknown";
  volume: { available: boolean; level: number; muted: boolean };
  recycleBin: { items: number; bytes: number };
}

/** One app in the Windows volume mixer, rolled up across its sessions. */
export interface AppAudio {
  exe: string;
  path: string;
  name: string;
  /** 0..=100 */
  volume: number;
  muted: boolean;
  sessions: number;
}

/** An output endpoint an app can be sent to. */
export interface AudioDevice {
  id: string;
  name: string;
  isDefault: boolean;
}

/** What a mode switch managed to do. */
export interface SwitchReport {
  modeId: string;
  modeName: string;
  audioApplied: number;
  windowsMoved: number;
  appsLaunched: number;
  settings: Settings;
}

/** What a workspace restore managed to do. */
export interface RestoreReport {
  moved: number;
  launched: number;
  missing: number;
}

/** Windows has no public per-app routing API; this says what happened. */
export interface OutputChoice {
  exe: string;
  deviceId: string | null;
  openedSettings: boolean;
}

/** Where this copy keeps settings.json and the icon cache. */
export interface StorageInfo {
  portable: boolean;
  dataDir: string;
}

/** Event channel names pushed from Rust. */
export const EVENTS = {
  settingsChanged: "settings://changed",
  runningChanged: "apps://running-changed",
  systemStatus: "system://status",
  /** A click anywhere but the menu bar, while one of its menus is open. */
  menubarOutside: "menubar://outside",
  /** The Escape key, while one of the menu bar's menus is open. */
  menubarEscape: "menubar://escape",
  /** The tray's hidden-icons flyout opened (true) or closed (false). */
  trayFlyout: "tray://flyout",
  /** The person at the machine went idle (true) or came back (false). */
  userIdle: "system://idle",
} as const;
