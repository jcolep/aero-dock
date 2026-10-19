//! Settings engine: a single versioned struct persisted as JSON at
//! `%APPDATA%\AeroDock\settings.json`, written atomically, with every
//! mutation pushed to the frontend as a full-struct `settings://changed`
//! event so the UI stays a pure function of settings.

use std::fs;
use std::path::{Path, PathBuf};

use parking_lot::RwLock;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter};

use super::error::{AeroError, AeroResult};
use super::names::exe_key;
use super::widgets::WidgetsSettings;
use super::workspace::WorkspaceSnapshot;

pub const SETTINGS_EVENT: &str = "settings://changed";
pub const CURRENT_SCHEMA_VERSION: u32 = 2;

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum DockEdge {
    Top,
    #[default]
    Bottom,
    Left,
    Right,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct DockSettings {
    /// Which screen edge the dock lives on.
    pub edge: DockEdge,
    /// Monitor name (as reported by the OS); `None` = primary.
    pub monitor: Option<String>,
    /// Put a dock on every monitor, not just the one in `monitor`.
    pub all_monitors: bool,
    /// With a dock on every monitor, each one lists only the windows that are
    /// on its own screen, as the taskbar's "where the window is open" mode
    /// does. Off, every dock lists every window.
    pub per_monitor_windows: bool,
    /// Base icon size in logical pixels.
    pub icon_size: u32,
    /// Cursor-proximity magnification on hover.
    pub magnification: bool,
    /// Peak scale at the cursor (1.0 = off, 1.5 = 150%).
    pub magnification_scale: f32,
    /// How far the icon under the pointer rises, as it grows, above where it rests, as a fraction of the
    /// icon size (0 = it only grows).
    pub magnification_lift: f32,
    /// How far from the pointer an icon is still swollen, in icon widths. Wider is a gentler, longer hill.
    pub magnification_reach: f32,
    /// Slide off-screen when not in use.
    pub auto_hide: bool,
    /// How long the pointer must be away before auto-hide slides the dock
    /// out, in milliseconds.
    pub auto_hide_delay_ms: u32,
    /// Floating mode: detached from the edge with a margin.
    pub floating: bool,
    /// Gap between dock and screen edge in floating mode (logical px).
    pub floating_margin: u32,
    /// Padding between the icons and the dock's glass edge across the dock
    /// axis (logical px). Smaller = a shorter dock.
    pub padding: u32,
    /// Gap between an icon and its running-app dot (logical px). The dot
    /// sits in the padding under the icon, so a large gap wants more
    /// padding to keep it inside the glass.
    pub indicator_gap: u32,
    /// Horizontal gap between apps in the dock (logical px).
    pub icon_spacing: u32,
    /// Corner radius of the dock bar (logical px). `None` uses the radius
    /// that belongs to the current material.
    pub corner_radius: Option<u32>,
    /// Size of the network, volume, battery and Recycle Bin glyphs next to
    /// the clock (logical px).
    pub status_icon_size: u32,
    /// Order the user dragged running (unpinned) apps into, as dock item
    /// ids. Apps not listed keep the order Windows reports them in, after
    /// the listed ones.
    pub running_order: Vec<String>,
    /// Keep the Search and Settings buttons out of sight until the pointer
    /// nears their end of the dock (Search on the left, Settings beside the
    /// clock). Horizontal docks only.
    pub reveal_controls: bool,
    /// How close to the dock's end the pointer must get for that end's button to
    /// bud out (logical px, measured in from the bar's own edge). Smaller means
    /// further to travel before it appears.
    pub reveal_zone: u32,
    /// Reserve screen space for the dock like the Windows taskbar does, so
    /// maximised windows stop at the dock instead of running underneath it.
    /// Has no effect while auto-hide is on.
    pub reserve_space: bool,
    /// Show currently running apps that aren't pinned.
    pub show_running_apps: bool,
    /// Built-in dock controls, each independently hideable.
    pub show_search_button: bool,
    /// How the Liquidock button (the drop that opens Start, where the search button was) shines under the pointer:
    /// `sweep` (a glint crosses it), `caustic` (the light at its foot swells, with a glow behind) or `rim` (a bright
    /// line runs once round its outline).
    pub start_shine: String,
    pub show_settings_button: bool,
    pub show_clock: bool,
    /// Battery, network, volume and Recycle Bin glyphs.
    pub show_system_status: bool,
    /// An app that flashes for attention (a message, a finished download) makes its
    /// icon bounce and wear a dot, until it is looked at.
    pub attention_bounce: bool,
    /// How a window goes into the dock when minimised from it, and comes out:
    /// genie (squeezed down to the icon), scale (shrunk to it) or off.
    pub minimize_effect: String,
    /// What a middle click on an icon does: `endTask` ends the app (every process of it, at once, as Task Manager's
    /// End Task does, so unsaved work is lost), `close` asks its windows to close the way their own close button
    /// would (one with unsaved work still asks first).
    pub middle_click: String,
    /// How strongly the theme's color tints the dock's glass, 0 to 1.5 (1 = as the material has it).
    pub tint: f32,
    /// Tint the dock's glass with the theme color (Color & materials); off, it is plain glass.
    pub tint_with_theme: bool,
    /// What marks running apps: `dots` (a dot under every running app, the focused one brighter) or `focus` (one
    /// mark, under the app in front, with a ghost of it under the app the pointer is on).
    pub indicator_style: String,
    /// The focus mark's shape: `pill` or `dot` (the glowing dot).
    pub indicator_shape: String,
    /// The running-app mark's own color, `#rrggbb`, or empty to follow the theme's accent. The ghost (the ring
    /// under whatever the pointer is on) is never touched by this: it stays white, in every look.
    pub mark_color: String,
    /// How the focus mark moves to the app that comes to the front: `glide`, `bounce`, `snap`, `float` or `fade`.
    pub focus_motion: String,
    /// How its ghost follows the pointer from app to app: the same choices.
    pub ghost_motion: String,
    /// How much the focus mark and its ghost stretch out with their speed as they travel, 0 (not at all) to 1.
    pub mark_stretch: f32,
    /// With the focus mark, how the other running apps show they are running: `dots` (faint glowing marks of the
    /// mark's shape in its track), `halo` (a soft pool of light the icon sits in), `dim` (the apps that are not
    /// running are drawn faded) or `none`.
    pub running_cue: String,
}

/// How the dock's focus mark and its ghost may move (see `DockSettings::focus_motion`).
pub const MARK_MOTIONS: &[&str] = &["glide", "bounce", "snap", "float", "fade"];

impl Default for DockSettings {
    fn default() -> Self {
        Self {
            edge: DockEdge::Bottom,
            monitor: None,
            all_monitors: false,
            per_monitor_windows: true,
            icon_size: 48,
            magnification: true,
            magnification_scale: 1.45,
            magnification_lift: 0.12,
            magnification_reach: 2.6,
            auto_hide: false,
            auto_hide_delay_ms: 1400,
            floating: true,
            floating_margin: 8,
            padding: 10,
            indicator_gap: 4,
            icon_spacing: 6,
            corner_radius: None,
            status_icon_size: 16,
            running_order: Vec::new(),
            reveal_controls: true,
            reveal_zone: 40,
            reserve_space: true,
            show_running_apps: true,
            show_search_button: true,
            start_shine: "sweep".into(),
            show_settings_button: true,
            show_clock: true,
            show_system_status: true,
            attention_bounce: true,
            middle_click: "endTask".into(),
            minimize_effect: "genie".into(),
            tint: 1.0,
            tint_with_theme: true,
            indicator_style: "dots".into(),
            indicator_shape: "pill".into(),
            mark_color: String::new(),
            focus_motion: "glide".into(),
            ghost_motion: "glide".into(),
            mark_stretch: 0.5,
            running_cue: "dots".into(),
        }
    }
}

/// How a surface is rendered.
///
/// `Liquid` renders the theme's color as a thin lens: little tint in the body, the work at the rim, where light
/// enters and bends. `Clear` is neutral glass in the style of Apple's Liquid Glass: rounded shapes, a specular rim,
/// the picked color as a flat veil. (There was a third, the glossy beveled `aero` panel; a file that still names it
/// gets Liquid, which kept its colors.)
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SurfaceStyle {
    #[default]
    #[serde(alias = "aero")]
    Liquid,
    Clear,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct AppearanceSettings {
    /// Theme id: aero | ocean | forest | aurora | sunset | night. No longer
    /// chosen from a list; it is kept so settings saved before the color
    /// picker still know where their look started, which the picker's
    /// starting color is taken from while `accent` is empty.
    pub theme: String,
    /// The color the whole look is derived from, `#rrggbb`. Empty until one
    /// is picked.
    pub accent: String,
    /// Overall dock opacity, 0.3..=1.0.
    pub transparency: f32,
    /// Glass blur/refraction intensity, 0.0..=1.0.
    pub glass_intensity: f32,
    /// Hover/launch bloom strength, 0.0..=1.0.
    pub bloom_amount: f32,
    /// Icon reflection strength, 0.0..=1.0.
    pub reflection_strength: f32,
    /// Soft shadow under the dock bar, 0.0..=1.0 (0 = none). It is kept
    /// tight to the bar rather than spreading out to the sides.
    pub dock_shadow: f32,
    /// Ambient particle density, 0.0..=1.0 (0 disables particles).
    pub particle_density: f32,
    /// Ambient scene: none | dust | rain | snow | bubbles | aurora.
    pub scene: String,
    /// Global animation speed multiplier, 0.5..=2.0.
    pub animation_speed: f32,
    /// Tint the theme from the wallpaper's dominant color.
    pub wallpaper_sync: bool,
    /// Material used by the dock, its flyouts and its controls (the settings window is always clear night glass).
    pub dock_surface: SurfaceStyle,
    /// Have Windows blur what is behind the dock, menu bar and frame, so the
    /// glass is frosted rather than only tinted. Off until chosen: it depends on
    /// how Windows draws the blur on a given machine.
    pub real_blur: bool,
    /// A soft highlight that follows the pointer across the glass.
    pub pointer_light: bool,
    /// What a menu's items and a panel's sections do under the pointer: `magnify` (swell a little and rise, as the
    /// Control Center's tiles do), `lift` (rise, with a shadow), `glow` (light up in the theme color) or `none`.
    pub hover_effect: String,
    /// A fine grain over the glass, which keeps its gradients from banding.
    pub glass_grain: bool,
    /// What is done to every app's icon: plain | glass | clear | tinted. The
    /// treatment is baked into a copy of the icon when it is first read (see
    /// `core::glassicon`), so it costs nothing to show.
    pub icon_style: String,
    /// How the frosted glass is made on each surface (it only is while `real_blur` is on).
    pub frost: FrostSettings,
    /// A table of how smoothly each window draws, on each screen (see `commands::perf`). A diagnostic: timing
    /// the frames keeps every window drawing at its screen's rate.
    pub frame_overlay: bool,
    /// Draw the windows with the graphics card. Off, the web views are drawn in software, which keeps the
    /// graphics process small (about 60 MB less) and costs frames on a fast screen. Read when the program
    /// starts (the browser's arguments cannot change under a window that is open), so a change waits for a restart.
    pub hardware_acceleration: bool,
}

/// How frosted one surface's glass is.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct FrostLook {
    /// How far what is behind the glass is blurred, in pixels, `FrostLook::BLUR`.
    pub blur: f32,
    /// How much grain lies over it, 0.0..=1.0.
    pub grain: f32,
    /// Whether this surface (and everything that belongs to it: the dock's flyouts, the menu bar's menus) has
    /// frosted glass. A file from before there was one for each takes the single switch there was (`real_blur`).
    pub glass: Option<bool>,
}

impl FrostLook {
    pub const BLUR: std::ops::RangeInclusive<f32> = 0.0..=120.0;

    fn new(blur: f32) -> Self {
        Self { blur, grain: 0.35, glass: None }
    }
}

impl Default for FrostLook {
    fn default() -> Self {
        Self::new(30.0)
    }
}

/// The frosted glass of each surface that has some, each its own.
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct FrostSettings {
    pub dock: FrostLook,
    pub start: FrostLook,
    pub menu_bar: FrostLook,
}

impl Default for FrostSettings {
    fn default() -> Self {
        Self { dock: FrostLook::new(30.0), start: FrostLook::new(34.0), menu_bar: FrostLook::new(28.0) }
    }
}

impl Default for AppearanceSettings {
    fn default() -> Self {
        Self {
            theme: "aero".into(),
            accent: String::new(),
            transparency: 0.92,
            glass_intensity: 0.8,
            bloom_amount: 0.7,
            reflection_strength: 0.6,
            dock_shadow: 0.0,
            particle_density: 0.35,
            scene: "dust".into(),
            animation_speed: 1.0,
            wallpaper_sync: false,
            dock_surface: SurfaceStyle::Liquid,
            real_blur: false,
            pointer_light: true,
            hover_effect: "magnify".into(),
            glass_grain: true,
            icon_style: "glass".into(),
            frost: FrostSettings::default(),
            frame_overlay: false,
            hardware_acceleration: true,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PinKind {
    App,
    File,
    Folder,
    /// A dock folder holding other items (a "stack").
    Stack,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PinnedItem {
    /// Stable id (uuid-ish string generated at pin time).
    pub id: String,
    pub kind: PinKind,
    /// Filesystem target. Empty for stacks.
    #[serde(default)]
    pub path: String,
    pub name: String,
    /// Icon cache key (see icons module); `None` = not yet extracted.
    #[serde(default)]
    pub icon: Option<String>,
    /// Children when `kind == Stack`.
    #[serde(default)]
    pub children: Vec<PinnedItem>,
    /// How a stack opens: `grid`, `fan` or `list`. `None` is a grid. Only
    /// stacks use it.
    #[serde(default)]
    pub view: Option<String>,
}

/// Ceilings that stop a hand-edited or imported file from producing a
/// dock nobody can use, or a restore that grinds for minutes.
const MAX_MODES: usize = 12;
const MAX_SNAPSHOT_WINDOWS: usize = 200;

/// What a mode remembers about one app's audio.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppAudioPref {
    /// Lowercased executable file name, e.g. `discord.exe`.
    pub exe: String,
    /// 0..=100.
    pub volume: u8,
    pub muted: bool,
    /// Output endpoint chosen for this app; `None` follows the system.
    #[serde(default)]
    pub device_id: Option<String>,
}

/// One saved way of working: its own pins, its own window layout, and its
/// own per-app volumes.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct DockMode {
    pub id: String,
    pub name: String,
    /// A short glyph shown on the switcher tile. Empty means the UI picks.
    pub glyph: String,
    /// The pins this mode shows. Loaded into `Settings::pinned` while the
    /// mode is active, which is why every existing pin path keeps working.
    pub pinned: Vec<PinnedItem>,
    pub audio: Vec<AppAudioPref>,
    pub workspace: WorkspaceSnapshot,
    /// Executables that pull this mode to the front when they focus.
    pub auto_switch_apps: Vec<String>,
}

impl Default for DockMode {
    fn default() -> Self {
        Self {
            id: String::new(),
            name: "Mode".into(),
            glyph: String::new(),
            pinned: Vec::new(),
            audio: Vec::new(),
            workspace: WorkspaceSnapshot::default(),
            auto_switch_apps: Vec::new(),
        }
    }
}

impl DockMode {
    /// Read one app's remembered audio, if this mode has an opinion.
    pub fn audio_for(&self, exe: &str) -> Option<&AppAudioPref> {
        let key = exe_key(exe);
        self.audio.iter().find(|a| a.exe == key)
    }

    /// Remember an app's audio, replacing any earlier entry for it.
    pub fn set_audio(&mut self, pref: AppAudioPref) {
        let key = exe_key(&pref.exe);
        self.audio.retain(|a| a.exe != key);
        self.audio.push(AppAudioPref { exe: key, ..pref });
    }

    /// True when this mode claims the given foreground app.
    pub fn claims(&self, exe: &str) -> bool {
        let key = exe_key(exe);
        self.auto_switch_apps.iter().any(|a| exe_key(a) == key)
    }
}

/// The Modes feature as a whole. Off by default, so upgrading changes
/// nothing until the user turns it on.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct ModesSettings {
    pub enabled: bool,
    /// Id of the mode currently loaded into the dock.
    pub active_id: String,
    pub modes: Vec<DockMode>,
    /// Follow the foreground app into whichever mode claims it.
    pub auto_switch: bool,
    /// Also put windows back when switching, not just pins and audio.
    pub restore_workspace_on_switch: bool,
}

impl Default for ModesSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            active_id: String::new(),
            modes: Vec::new(),
            auto_switch: false,
            restore_workspace_on_switch: true,
        }
    }
}

/// The strip along the top of the screen, after the macOS menu bar: system
/// and app menus on the left, status items and the Control Center on the
/// right. The dock is for apps; this is for the system and for the app in
/// front.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct MenuBarSettings {
    /// Show the bar at all.
    pub enabled: bool,
    /// Height in logical px.
    pub height: u32,
    /// The bar takes over the clock and the status icons, so the dock no
    /// longer shows them. Off, the dock keeps its own as well.
    pub takes_over_dock_status: bool,
    /// Show the ambient scene (the same one the dock plays) inside the bar.
    pub ambient: bool,
    /// Show the day and date beside the time.
    pub show_date: bool,
    /// Show the seconds in the time.
    pub show_seconds: bool,
    /// Space in logical px between the bar and the top and sides of the
    /// screen. Above 0 the bar floats, rounded on all four corners.
    pub gap: u32,
    /// Corner radius in logical px (the bottom corners only while the bar
    /// touches the top of the screen).
    pub corner_radius: u32,
    /// How strongly the bar is tinted with the theme color, 1.0 being the
    /// default. Lower is clearer, higher is more solid.
    pub tint: f32,
    /// Space in logical px between the items in the bar.
    pub item_spacing: u32,
    /// Size of the text in the bar, in logical px.
    pub font_size: u32,
    /// The hairline of light round the bar's edge.
    pub edge_highlight: bool,
    /// The color of the circle behind the Wi-Fi icon in the Control Center,
    /// as `#rrggbb`. Empty follows the theme color.
    pub wifi_color: String,
    /// The same for the Bluetooth icon.
    pub bluetooth_color: String,
    /// How far the sliding lens reaches past the button it is on, in px.
    pub lens_grow: u32,
    /// How much the button under the lens is enlarged, 1.0 being not at all.
    pub lens_magnify: f32,
    /// How strongly the lens bends what is under it, 0 for not at all, 1 being
    /// the default.
    pub lens_warp: f32,
    /// A menu or the Control Center closes when the pointer moves away from it,
    /// instead of staying until something else is clicked.
    pub close_on_leave: bool,
    /// A dot in the bar while an app is using the microphone or camera.
    pub show_privacy: bool,
    /// A small load graph in the bar, opening a popover of what is using the machine.
    pub show_stats: bool,
    /// The Now Playing card takes its colors from the cover.
    pub media_tint: bool,
    /// The card draws the sound that is playing as moving bars. This listens to the
    /// output (a loopback capture; nothing is recorded or kept).
    pub media_spectrum: bool,
    /// A pill for the media that is playing, which slides out of the middle of the bar when the pointer rests there.
    pub media_island: bool,
    /// Keep that pill slid out while something is playing, instead of waiting for the pointer.
    pub media_island_pinned: bool,
    /// Resting the pointer on the Control Center button shows its Now Playing card, hanging from the button.
    pub media_peek: bool,
}

impl Default for MenuBarSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            height: 28,
            takes_over_dock_status: true,
            ambient: true,
            show_date: true,
            show_seconds: false,
            gap: 0,
            corner_radius: 12,
            tint: 1.0,
            item_spacing: 2,
            font_size: 13,
            edge_highlight: true,
            wifi_color: String::new(),
            bluetooth_color: String::new(),
            lens_grow: 3,
            lens_magnify: 1.07,
            lens_warp: 1.0,
            close_on_leave: true,
            show_privacy: true,
            show_stats: true,
            media_tint: true,
            media_spectrum: true,
            media_island: true,
            media_island_pinned: false,
            media_peek: true,
        }
    }
}

impl MenuBarSettings {
    /// How much of the top of the screen the bar takes, in logical px: its
    /// own height and the gap above it.
    pub fn thickness(&self) -> u32 {
        self.height + self.gap
    }
}

/// How the app behaves for people who need it quieter, and how it feels for
/// everyone else.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct AccessibilitySettings {
    /// Cut animation down to nothing but the change: `system` follows the
    /// Windows "Animation effects" switch, `on` always, `off` never.
    pub reduce_motion: String,
    /// Make glass solid and drop the blur: `system` follows the Windows
    /// "Transparency effects" switch, `on` always, `off` never.
    pub reduce_transparency: String,
    /// The global shortcuts that move the keyboard into the menu bar and the
    /// dock (Ctrl+Alt+M and Ctrl+Alt+D).
    pub keyboard_shortcuts: bool,
    /// Soft sounds for opening and closing menus, switches and launching.
    pub ui_sounds: bool,
    /// How loud they are, 0.0..=1.0.
    pub ui_sound_volume: f32,
}

impl Default for AccessibilitySettings {
    fn default() -> Self {
        Self {
            reduce_motion: "system".into(),
            reduce_transparency: "system".into(),
            keyboard_shortcuts: true,
            ui_sounds: false,
            ui_sound_volume: 0.4,
        }
    }
}

impl AccessibilitySettings {
    const POLICIES: &'static [&'static str] = &["system", "on", "off"];
}
/// A frame round the free space of every monitor, between the menu bar and the
/// dock: maximised apps are held in from the screen edges by `padding`, with
/// rounded corners, and the margin they leave is drawn as glass with the
/// ambient scene drifting in it. Off by default, because it claims screen space.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct FrameSettings {
    pub enabled: bool,
    /// Width of the margin on every side, in logical px.
    pub padding: u32,
    /// Corner radius of the opening the apps sit in, in logical px.
    pub corner_radius: u32,
    /// How strongly the margin is tinted with the theme color (1 = default).
    pub tint: f32,
    /// Play the ambient scene in the margin.
    pub ambient: bool,
    /// A bevel of glass round the opening the apps sit in.
    pub glass_border: bool,
    /// Width of that bevel, in logical px.
    pub border_width: u32,
}

impl Default for FrameSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            padding: 14,
            corner_radius: 18,
            tint: 1.0,
            ambient: true,
            glass_border: false,
            border_width: 3,
        }
    }
}

/// Which animation each kind of thing uses. Each is the name of a preset the
/// frontend knows (see `engine/animation/presets.ts`); the lists of names that
/// are allowed live here too, so a hand-edited file can never name one the
/// frontend would not recognise.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct AnimationSettings {
    /// Menu bar menus and the Control Center, opening and closing.
    pub menu: String,
    /// The dock's own flyouts and panels: window previews, context menus,
    /// folders and stacks, search, modes, notices.
    pub flyout: String,
    /// The dock appearing and disappearing: at launch, and with auto-hide.
    pub dock_reveal: String,
    /// What an icon does when an app is launched from it.
    pub launch: String,
    /// What plays on the icon's own glass, or behind it, on every click.
    pub click: String,
    /// How the icons swell as the pointer passes over them.
    pub magnify: String,
    /// The Start menu, opening and closing.
    pub start: String,
    /// The media pill in the menu bar, and the card that hangs from the Control Center button, arriving and leaving.
    pub island: String,
}

impl AnimationSettings {
    pub const MENU: &'static [&'static str] =
        &["goo", "spring", "unfurl", "reveal", "drift", "fade", "none"];
    pub const FLYOUT: &'static [&'static str] =
        &["bloom", "pop", "glide", "unfurl", "jelly", "fade", "none"];
    pub const DOCK_REVEAL: &'static [&'static str] =
        &["slide", "rise", "pop", "genie", "cascade", "fade", "none"];
    pub const LAUNCH: &'static [&'static str] = &["bounce", "hop", "jelly", "pulse", "none"];
    /// `dimple` and `halo` and `shine` clip to the icon's own glass; `bloom` is a glow behind it, the one that
    /// came first (see CHANGELOG) — picked second, in a side-by-side comparison, over itself as the baseline.
    pub const CLICK: &'static [&'static str] = &["dimple", "halo", "shine", "bloom"];
    pub const MAGNIFY: &'static [&'static str] = &["soft", "snappy", "bouncy", "liquid"];
    pub const START: &'static [&'static str] = &["rise", "bloom", "genie", "slide", "fade", "none"];
    pub const ISLAND: &'static [&'static str] = &["gloop", "jelly", "drop", "unfurl", "bloom", "spring", "fade", "none"];
}

impl Default for AnimationSettings {
    /// Each is what the app has always done (the menu bar's, what it was last
    /// shipped with), so updating changes nothing until one is picked.
    fn default() -> Self {
        Self {
            menu: "goo".into(),
            flyout: "bloom".into(),
            dock_reveal: "slide".into(),
            launch: "bounce".into(),
            // a new field, so there is no old behaviour to preserve: "dimple" won a side-by-side comparison
            // (October 2026) against the three others here, including `bloom`, which is what shipped first
            click: "dimple".into(),
            magnify: "soft".into(),
            start: "rise".into(),
            island: "gloop".into(),
        }
    }
}

/// Put `value` back to `fallback` unless it is one of `allowed`.
fn keep_known(value: &mut String, allowed: &[&str], fallback: &str) {
    if !allowed.contains(&value.as_str()) {
        *value = fallback.to_string();
    }
}

/// One app pinned to the Start menu.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
#[serde(rename_all = "camelCase", default)]
pub struct StartPin {
    pub name: String,
    /// What to launch: an exe or document path, or `shell:AppsFolder\<aumid>`.
    pub target: String,
    pub args: String,
}

/// The Start menu (the panel the dock's search button opens).
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", default)]
pub struct StartSettings {
    /// What is pinned, in order. Windows keeps its own pinned layout in a file that
    /// cannot be read, so this is a list of our own.
    pub pinned: Vec<StartPin>,
    /// The pins have been started from the dock's, once; after that they are the user's.
    pub seeded: bool,
    /// The Recommended section (recent files).
    pub show_recommended: bool,
    /// Darken the glass where what is behind the panel is light, so its text stays readable (looked at once, as it
    /// opens: `commands::start::backdrop_behind`).
    pub adaptive_tint: bool,
    /// The Windows key, pressed and let go on its own, opens this Start menu instead of Windows' (Ctrl+Win opens
    /// Windows'). Needs a keyboard hook while it is on (`platform::windows::winkey`).
    pub windows_key: bool,
}

impl Default for StartSettings {
    fn default() -> Self {
        Self { pinned: Vec::new(), seeded: false, show_recommended: true, adaptive_tint: true, windows_key: false }
    }
}

const MAX_START_PINS: usize = 80;

impl StartSettings {
    fn sanitize(&mut self) {
        let mut seen: Vec<(String, String)> = Vec::new();
        self.pinned.retain_mut(|p| {
            p.name.truncate(120);
            p.target.truncate(520);
            p.args.truncate(520);
            if p.target.trim().is_empty() {
                return false;
            }
            if p.name.trim().is_empty() {
                p.name = p.target.clone();
            }
            // the same app twice is one
            let key = (p.target.to_ascii_lowercase(), p.args.clone());
            if seen.contains(&key) {
                return false;
            }
            seen.push(key);
            true
        });
        self.pinned.truncate(MAX_START_PINS);
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Settings {
    pub schema_version: u32,
    pub dock: DockSettings,
    pub appearance: AppearanceSettings,
    pub pinned: Vec<PinnedItem>,
    pub launch_at_startup: bool,
    /// Put the Windows taskbar into auto-hide so Liquidock is the bar.
    pub hide_taskbar: bool,
    pub onboarding_complete: bool,
    pub modes: ModesSettings,
    pub widgets: WidgetsSettings,
    pub menu_bar: MenuBarSettings,
    pub accessibility: AccessibilitySettings,
    pub animations: AnimationSettings,
    pub frame: FrameSettings,
    pub start: StartSettings,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            schema_version: CURRENT_SCHEMA_VERSION,
            dock: DockSettings::default(),
            appearance: AppearanceSettings::default(),
            pinned: Vec::new(),
            launch_at_startup: false,
            hide_taskbar: false,
            onboarding_complete: false,
            modes: ModesSettings::default(),
            widgets: WidgetsSettings::default(),
            menu_bar: MenuBarSettings::default(),
            accessibility: AccessibilitySettings::default(),
            animations: AnimationSettings::default(),
            frame: FrameSettings::default(),
            start: StartSettings::default(),
        }
    }
}

impl Settings {
    /// Clamp every numeric field into its documented range so a hand-edited
    /// or imported file can never push the renderer into a broken state.
    fn sanitize(&mut self) {
        let a = &mut self.appearance;
        a.transparency = a.transparency.clamp(0.3, 1.0);
        for look in [&mut a.frost.dock, &mut a.frost.start, &mut a.frost.menu_bar] {
            look.blur = if look.blur.is_finite() { look.blur.clamp(*FrostLook::BLUR.start(), *FrostLook::BLUR.end()) } else { 30.0 };
            look.grain = if look.grain.is_finite() { look.grain.clamp(0.0, 1.0) } else { 0.35 };
        }
        a.glass_intensity = a.glass_intensity.clamp(0.0, 1.0);
        // each surface has its own frosted glass switch; one not yet set takes the single switch there used to be
        let blur = a.real_blur;
        for look in [&mut a.frost.dock, &mut a.frost.start, &mut a.frost.menu_bar] {
            look.glass.get_or_insert(blur);
        }
        a.bloom_amount = a.bloom_amount.clamp(0.0, 1.0);
        a.reflection_strength = a.reflection_strength.clamp(0.0, 1.0);
        a.dock_shadow = a.dock_shadow.clamp(0.0, 1.0);
        a.accent = normalize_hex(&a.accent);
        a.particle_density = a.particle_density.clamp(0.0, 1.0);
        a.animation_speed = a.animation_speed.clamp(0.5, 2.0);
        let d = &mut self.dock;
        d.icon_size = d.icon_size.clamp(16, 96);
        d.magnification_scale = d.magnification_scale.clamp(1.0, 2.0);
        d.magnification_lift = if d.magnification_lift.is_finite() { d.magnification_lift.clamp(0.0, 0.5) } else { 0.12 };
        d.magnification_reach = if d.magnification_reach.is_finite() { d.magnification_reach.clamp(1.5, 4.5) } else { 2.6 };
        d.tint = if d.tint.is_finite() { d.tint.clamp(0.0, 1.5) } else { 1.0 };
        d.mark_stretch = if d.mark_stretch.is_finite() { d.mark_stretch.clamp(0.0, 1.0) } else { 0.5 };
        d.floating_margin = d.floating_margin.min(64);
        d.padding = d.padding.clamp(2, 24);
        d.indicator_gap = d.indicator_gap.min(16);
        d.icon_spacing = d.icon_spacing.min(32);
        d.corner_radius = d.corner_radius.map(|r| r.min(48));
        d.status_icon_size = d.status_icon_size.clamp(10, 32);
        d.reveal_zone = d.reveal_zone.clamp(16, 120);
        // a hand-edited file cannot grow this without bound
        d.running_order.truncate(64);
        // below ~200ms the dock hides while you are still reaching for it
        d.auto_hide_delay_ms = d.auto_hide_delay_ms.clamp(200, 10_000);
        let f = &mut self.frame;
        f.padding = f.padding.clamp(4, 64);
        // the opening cannot be rounder than half of its own margin allows
        f.corner_radius = f.corner_radius.min(48);
        f.tint = if f.tint.is_finite() { f.tint.clamp(0.2, 2.0) } else { 1.0 };
        f.border_width = f.border_width.clamp(1, 10);
        keep_known(&mut self.dock.minimize_effect, &["genie", "scale", "off"], "genie");
        keep_known(&mut self.dock.middle_click, &["endTask", "close"], "endTask");
        keep_known(&mut self.dock.indicator_style, &["dots", "focus"], "dots");
        keep_known(&mut self.dock.indicator_shape, &["pill", "dot"], "pill");
        keep_known(&mut self.dock.focus_motion, MARK_MOTIONS, "glide");
        keep_known(&mut self.dock.ghost_motion, MARK_MOTIONS, "glide");
        keep_known(&mut self.dock.running_cue, &["dots", "halo", "dim", "none"], "dots");
        keep_known(&mut self.dock.start_shine, &["sweep", "caustic", "rim"], "sweep");
        self.dock.mark_color = normalize_hex(&self.dock.mark_color);
        keep_known(&mut self.appearance.icon_style, &["plain", "glass", "clear", "tinted"], "glass");
        keep_known(&mut self.appearance.hover_effect, &["magnify", "lift", "glow", "none"], "magnify");
        let a11y = &mut self.accessibility;
        keep_known(&mut a11y.reduce_motion, AccessibilitySettings::POLICIES, "system");
        keep_known(&mut a11y.reduce_transparency, AccessibilitySettings::POLICIES, "system");
        a11y.ui_sound_volume = if a11y.ui_sound_volume.is_finite() { a11y.ui_sound_volume.clamp(0.0, 1.0) } else { 0.4 };
        let n = &mut self.animations;
        keep_known(&mut n.menu, AnimationSettings::MENU, "goo");
        keep_known(&mut n.flyout, AnimationSettings::FLYOUT, "bloom");
        keep_known(&mut n.dock_reveal, AnimationSettings::DOCK_REVEAL, "slide");
        keep_known(&mut n.launch, AnimationSettings::LAUNCH, "bounce");
        keep_known(&mut n.click, AnimationSettings::CLICK, "dimple");
        keep_known(&mut n.magnify, AnimationSettings::MAGNIFY, "soft");
        keep_known(&mut n.start, AnimationSettings::START, "rise");
        keep_known(&mut n.island, AnimationSettings::ISLAND, "gloop");
        let m = &mut self.menu_bar;
        m.height = m.height.clamp(22, 44);
        m.gap = m.gap.min(24);
        m.corner_radius = m.corner_radius.min(24);
        m.tint = if m.tint.is_finite() { m.tint.clamp(0.2, 2.0) } else { 1.0 };
        m.item_spacing = m.item_spacing.min(16);
        m.font_size = m.font_size.clamp(11, 17);
        // written into a style, so only ever a plain color
        m.wifi_color = normalize_hex(&m.wifi_color);
        m.bluetooth_color = normalize_hex(&m.bluetooth_color);
        m.lens_grow = m.lens_grow.min(10);
        m.lens_magnify = if m.lens_magnify.is_finite() { m.lens_magnify.clamp(1.0, 1.3) } else { 1.07 };
        m.lens_warp = if m.lens_warp.is_finite() { m.lens_warp.clamp(0.0, 2.0) } else { 1.0 };
        // a stack opens as a grid, a fan or a list; anything else is a grid
        for pin in &mut self.pinned {
            pin.view = pin
                .view
                .take()
                .filter(|v| matches!(v.as_str(), "grid" | "fan" | "list"));
        }
        self.sanitize_modes();
        self.widgets.sanitize();
        self.start.sanitize();
        // Every pin, unpin and reorder edits `pinned` directly, so the
        // active mode has to pick those up here. Without this a pin made
        // between two switches would be thrown away by the next switch.
        self.sync_pins_into_active_mode();
        self.schema_version = CURRENT_SCHEMA_VERSION;
    }

    /// Keep the mode list internally consistent: no duplicate or empty
    /// ids, sane volumes, bounded sizes, and an active id that actually
    /// resolves. A file edited by hand cannot leave the dock pointing at
    /// a mode that is not there.
    fn sanitize_modes(&mut self) {
        let m = &mut self.modes;
        m.modes.truncate(MAX_MODES);

        let mut seen: Vec<String> = Vec::with_capacity(m.modes.len());
        let mut next_spare = 1;
        for mode in m.modes.iter_mut() {
            if mode.id.trim().is_empty() || seen.contains(&mode.id) {
                // a collision would make switching ambiguous, so mint a
                // fresh id rather than dropping the user's mode
                loop {
                    let candidate = format!("mode-{next_spare}");
                    next_spare += 1;
                    if !seen.contains(&candidate) {
                        mode.id = candidate;
                        break;
                    }
                }
            }
            seen.push(mode.id.clone());

            if mode.name.trim().is_empty() {
                mode.name = "Mode".into();
            }
            mode.workspace.windows.truncate(MAX_SNAPSHOT_WINDOWS);

            for pref in mode.audio.iter_mut() {
                pref.exe = exe_key(&pref.exe);
                pref.volume = pref.volume.min(100);
            }
            // one entry per app; the last one written wins
            let mut keep: Vec<AppAudioPref> = Vec::with_capacity(mode.audio.len());
            for pref in mode.audio.drain(..).rev() {
                if !keep.iter().any(|k| k.exe == pref.exe) {
                    keep.push(pref);
                }
            }
            keep.reverse();
            mode.audio = keep;

            for app in mode.auto_switch_apps.iter_mut() {
                *app = exe_key(app);
            }
            mode.auto_switch_apps.retain(|a| !a.is_empty());
            mode.auto_switch_apps.dedup();
        }

        // the active id has to name a mode that exists
        if !m.modes.iter().any(|x| x.id == m.active_id) {
            m.active_id = m.modes.first().map(|x| x.id.clone()).unwrap_or_default();
        }
        // enabled with nothing to switch to is a broken state; the dock
        // would have no pins to show
        if m.enabled && m.modes.is_empty() {
            m.enabled = false;
        }
    }

    /// The mode currently loaded into the dock, if Modes is on.
    pub fn active_mode(&self) -> Option<&DockMode> {
        if !self.modes.enabled {
            return None;
        }
        self.modes.modes.iter().find(|m| m.id == self.modes.active_id)
    }

    fn active_mode_mut(&mut self) -> Option<&mut DockMode> {
        if !self.modes.enabled {
            return None;
        }
        let id = self.modes.active_id.clone();
        self.modes.modes.iter_mut().find(|m| m.id == id)
    }

    /// Copy the dock's live pins into the active mode.
    ///
    /// `pinned` is the working set every existing command already edits,
    /// so this is what makes an ordinary pin or reorder stick to the mode
    /// it happened in.
    pub fn sync_pins_into_active_mode(&mut self) {
        let pins = self.pinned.clone();
        if let Some(mode) = self.active_mode_mut() {
            mode.pinned = pins;
        }
    }

    /// Turn Modes on, seeding the first mode from the dock as it is now
    /// so nothing the user already set up is lost.
    pub fn enable_modes_with_default(&mut self, id: String, name: String) {
        if self.modes.modes.is_empty() {
            self.modes.modes.push(DockMode {
                id: id.clone(),
                name,
                pinned: self.pinned.clone(),
                ..DockMode::default()
            });
            self.modes.active_id = id;
        }
        self.modes.enabled = true;
    }

    /// Switch modes: the outgoing mode keeps the current pins, and the
    /// incoming mode's pins become the dock.
    ///
    /// Returns false when the id names no mode, leaving everything alone.
    pub fn switch_mode(&mut self, id: &str) -> bool {
        if !self.modes.modes.iter().any(|m| m.id == id) {
            return false;
        }
        self.sync_pins_into_active_mode();
        self.modes.active_id = id.to_string();
        if let Some(mode) = self.active_mode() {
            self.pinned = mode.pinned.clone();
        }
        true
    }

    /// Which mode claims the given foreground executable, if any. Used by
    /// auto-switching; returns None when the active mode already claims
    /// it, so a switch is only reported when it would change something.
    pub fn mode_claiming(&self, exe: &str) -> Option<&DockMode> {
        if !self.modes.enabled || !self.modes.auto_switch {
            return None;
        }
        let hit = self.modes.modes.iter().find(|m| m.claims(exe))?;
        (hit.id != self.modes.active_id).then_some(hit)
    }
}

/// Drop a leading UTF-8 byte order mark.
///
/// Several Windows editors add one when saving, and a settings file
/// that has been through one would otherwise fail to parse. That
/// failure is not harmless: the store treats an unreadable file as
/// corrupt, renames it aside and starts from defaults, so a BOM would
/// quietly cost somebody their pinned apps.
fn strip_bom(raw: &str) -> &str {
    raw.strip_prefix('\u{feff}').unwrap_or(raw)
}

/// `#rrggbb`, lowercase, or empty if the text is not a color. A hand-edited
/// file cannot push anything but a color into the stylesheet this way.
fn normalize_hex(raw: &str) -> String {
    let text = raw.trim().trim_start_matches('#');
    if text.len() == 6 && text.chars().all(|c| c.is_ascii_hexdigit()) {
        format!("#{}", text.to_ascii_lowercase())
    } else {
        String::new()
    }
}

/// Thread-safe settings store managed as Tauri state.
pub struct SettingsStore {
    inner: RwLock<Settings>,
    path: PathBuf,
}

impl SettingsStore {
    /// Load from disk (or defaults when missing/corrupt) at the app config dir.
    pub fn load(app: &AppHandle) -> AeroResult<Self> {
        let dir = crate::core::paths::config_dir(app)?;
        fs::create_dir_all(&dir)?;
        let path = dir.join("settings.json");
        let settings = Self::read_file(&path).unwrap_or_else(|e| {
            if path.exists() {
                log::warn!("settings unreadable ({e}); backing up and using defaults");
                let _ = fs::rename(&path, dir.join("settings.json.bak"));
            }
            Settings::default()
        });
        Ok(Self {
            inner: RwLock::new(settings),
            path,
        })
    }

    fn read_file(path: &Path) -> AeroResult<Settings> {
        let raw = fs::read_to_string(path)?;
        let mut settings: Settings = serde_json::from_str(strip_bom(&raw))?;
        settings.sanitize();
        Ok(settings)
    }

    pub fn get(&self) -> Settings {
        self.inner.read().clone()
    }

    /// Apply a mutation, persist atomically, and broadcast the new state.
    pub fn update<F: FnOnce(&mut Settings)>(&self, app: &AppHandle, f: F) -> AeroResult<Settings> {
        let snapshot = {
            let mut guard = self.inner.write();
            f(&mut guard);
            guard.sanitize();
            guard.clone()
        };
        self.persist(&snapshot)?;
        app.emit(SETTINGS_EVENT, &snapshot)?;
        Ok(snapshot)
    }

    /// Replace the whole struct (settings import).
    pub fn replace(&self, app: &AppHandle, mut settings: Settings) -> AeroResult<Settings> {
        settings.sanitize();
        {
            let mut guard = self.inner.write();
            *guard = settings.clone();
        }
        self.persist(&settings)?;
        app.emit(SETTINGS_EVENT, &settings)?;
        Ok(settings)
    }

    /// Atomic write: temp file in the same directory, then rename over.
    fn persist(&self, settings: &Settings) -> AeroResult<()> {
        let json = serde_json::to_string_pretty(settings)?;
        let tmp = self.path.with_extension("json.tmp");
        fs::write(&tmp, json)?;
        fs::rename(&tmp, &self.path).or_else(|_| {
            // rename over an open file can fail on Windows; fall back to copy
            fs::copy(&tmp, &self.path).map(|_| {
                let _ = fs::remove_file(&tmp);
            })
        })?;
        Ok(())
    }

    pub fn export_json(&self) -> AeroResult<String> {
        Ok(serde_json::to_string_pretty(&self.get())?)
    }

    pub fn import_json(&self, app: &AppHandle, json: &str) -> AeroResult<Settings> {
        let settings: Settings = serde_json::from_str(strip_bom(json))
            .map_err(|e| AeroError::other(format!("invalid settings file: {e}")))?;
        self.replace(app, settings)
    }
}

/// Whether the windows are to be drawn with the graphics card, read from the settings file before the
/// program has started anything (the browser's arguments are fixed when its first window is made, and the
/// settings store needs the app, which needs them). Anything missing or unreadable is "yes".
pub fn hardware_acceleration_wanted() -> bool {
    let path = match crate::core::paths::config_dir_early() {
        Some(dir) => dir.join("settings.json"),
        None => return true,
    };
    let Ok(text) = std::fs::read_to_string(path) else { return true };
    let Ok(value) = serde_json::from_str::<serde_json::Value>(text.trim_start_matches('\u{feff}')) else { return true };
    value["appearance"]["hardwareAcceleration"].as_bool().unwrap_or(true)
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accent_is_kept_only_if_it_is_a_color() {
        assert_eq!(normalize_hex("#ABCDEF"), "#abcdef");
        assert_eq!(normalize_hex("  2f9de3 "), "#2f9de3");
        // anything else would otherwise travel into a stylesheet
        assert_eq!(normalize_hex("red"), "");
        assert_eq!(normalize_hex("#12345"), "");
        assert_eq!(normalize_hex("#12345g"), "");
        assert_eq!(normalize_hex("#fff; background: url(x)"), "");
        assert_eq!(normalize_hex(""), "");
    }

    #[test]
    fn the_menu_bar_is_off_and_its_height_stays_sensible() {
        let mut s = Settings::default();
        // off until asked for: nobody gets a strip taken off their screen by
        // updating
        assert!(!s.menu_bar.enabled);
        s.menu_bar.height = 500;
        s.sanitize();
        assert_eq!(s.menu_bar.height, 44);
        s.menu_bar.height = 1;
        s.sanitize();
        assert_eq!(s.menu_bar.height, 22);
    }

    #[test]
    fn the_frame_is_off_until_asked_for_and_its_numbers_stay_sensible() {
        // updating must not take a margin off anyone's screen
        let old: Settings = serde_json::from_str(r#"{"menuBar":{"enabled":true}}"#)
            .expect("an older file must still load");
        assert!(!old.frame.enabled);
        assert_eq!(old.frame.padding, 14);

        let mut s = Settings::default();
        s.frame.padding = 900;
        s.frame.corner_radius = 900;
        s.frame.tint = f32::NAN;
        s.sanitize();
        assert_eq!(s.frame.padding, 64);
        assert_eq!(s.frame.corner_radius, 48);
        assert!((s.frame.tint - 1.0).abs() < f32::EPSILON);
        s.frame.padding = 0;
        s.sanitize();
        assert_eq!(s.frame.padding, 4);
        // the glass border is off until asked for, and cannot be wider than the margin is likely to be
        assert!(!old.frame.glass_border);
        s.frame.border_width = 400;
        s.sanitize();
        assert_eq!(s.frame.border_width, 10);
    }

    #[test]
    fn each_surface_takes_the_old_single_glass_switch_until_it_has_its_own() {
        let on: Settings = serde_json::from_str(r#"{"appearance":{"realBlur":true}}"#).expect("loads");
        let mut on = on;
        on.sanitize();
        assert_eq!(on.appearance.frost.dock.glass, Some(true));
        assert_eq!(on.appearance.frost.menu_bar.glass, Some(true));
        let mut mixed: Settings =
            serde_json::from_str(r#"{"appearance":{"realBlur":true,"frost":{"start":{"blur":30,"grain":0.3,"glass":false}}}}"#)
                .expect("loads");
        mixed.sanitize();
        assert_eq!(mixed.appearance.frost.start.glass, Some(false), "its own switch is kept");
        assert_eq!(mixed.appearance.frost.dock.glass, Some(true));
    }

    #[test]
    fn the_new_menu_bar_and_dock_settings_start_where_nothing_changes_and_stay_sensible() {
        let old: Settings = serde_json::from_str(r#"{"menuBar":{"enabled":true},"dock":{"iconSize":40}}"#)
            .expect("an older file must still load");
        assert!(!old.menu_bar.show_seconds, "the clock keeps to minutes until asked");
        assert!(old.menu_bar.media_island && !old.menu_bar.media_island_pinned);
        let mut s = Settings::default();
        s.dock.magnification_lift = f32::NAN;
        s.dock.magnification_reach = 90.0;
        s.dock.tint = 9.0;
        s.sanitize();
        assert_eq!(s.dock.tint, 1.5);
        assert!((s.dock.magnification_lift - 0.12).abs() < f32::EPSILON);
        assert_eq!(s.dock.magnification_reach, 4.5);
        s.dock.magnification_lift = -3.0;
        s.dock.magnification_reach = 0.1;
        s.sanitize();
        assert_eq!(s.dock.magnification_lift, 0.0);
        assert_eq!(s.dock.magnification_reach, 1.5);
    }

    #[test]
    fn animations_default_to_what_the_app_always_did_and_only_known_names_survive() {
        // a file from before these settings existed keeps every animation as it was
        let old: Settings = serde_json::from_str(r#"{"menuBar":{"enabled":true}}"#)
            .expect("an older file must still load");
        assert_eq!(old.animations.menu, "goo");
        assert_eq!(old.animations.flyout, "bloom");
        assert_eq!(old.animations.dock_reveal, "slide");
        assert_eq!(old.animations.launch, "bounce");
        // click is a newer field than this fixture: there is no old behaviour to keep, so an older file just
        // gets the default like any other missing field
        assert_eq!(old.animations.click, "dimple");
        assert_eq!(old.animations.magnify, "soft");
        assert_eq!(old.animations.start, "rise");

        // every default is itself one of the allowed names
        let d = AnimationSettings::default();
        assert!(AnimationSettings::MENU.contains(&d.menu.as_str()));
        assert!(AnimationSettings::FLYOUT.contains(&d.flyout.as_str()));
        assert!(AnimationSettings::DOCK_REVEAL.contains(&d.dock_reveal.as_str()));
        assert!(AnimationSettings::LAUNCH.contains(&d.launch.as_str()));
        assert!(AnimationSettings::CLICK.contains(&d.click.as_str()));
        assert!(AnimationSettings::MAGNIFY.contains(&d.magnify.as_str()));

        // a name that is not known goes back to the default; one that is, stays
        let mut s = Settings::default();
        s.animations.menu = "wobble".into();
        s.animations.flyout = "jelly".into();
        s.animations.dock_reveal = "<script>".into();
        s.animations.launch = String::new();
        s.animations.click = "halo".into();
        s.animations.magnify = "liquid".into();
        s.animations.start = "explode".into();
        s.sanitize();
        assert_eq!(s.animations.menu, "goo");
        assert_eq!(s.animations.flyout, "jelly");
        assert_eq!(s.animations.dock_reveal, "slide");
        assert_eq!(s.animations.launch, "bounce");
        assert_eq!(s.animations.click, "halo", "a known click effect stays");
        assert_eq!(s.animations.magnify, "liquid");
        assert_eq!(s.animations.start, "rise", "an unknown Start animation falls back");

        s.animations.click = "<script>".into();
        s.sanitize();
        assert_eq!(s.animations.click, "dimple", "an unknown click effect falls back");
    }

    #[test]
    fn the_bar_look_settings_are_clamped_and_older_files_get_the_old_look() {
        // a file from before these settings existed keeps the bar as it was
        let old: Settings = serde_json::from_str(r#"{"menuBar":{"enabled":true,"height":30}}"#)
            .expect("an older menu bar block must still load");
        assert_eq!(old.menu_bar.gap, 0);
        assert_eq!(old.menu_bar.corner_radius, 12);
        assert!((old.menu_bar.tint - 1.0).abs() < f32::EPSILON);
        assert!(old.menu_bar.edge_highlight);
        assert_eq!(old.menu_bar.thickness(), 30);

        let mut s = Settings::default();
        s.menu_bar.gap = 900;
        s.menu_bar.corner_radius = 900;
        s.menu_bar.tint = 50.0;
        s.menu_bar.item_spacing = 900;
        s.menu_bar.font_size = 1;
        s.sanitize();
        assert_eq!(s.menu_bar.gap, 24);
        assert_eq!(s.menu_bar.corner_radius, 24);
        assert!((s.menu_bar.tint - 2.0).abs() < f32::EPSILON);
        assert_eq!(s.menu_bar.item_spacing, 16);
        assert_eq!(s.menu_bar.font_size, 11);
        s.menu_bar.tint = f32::NAN;
        s.sanitize();
        assert!((s.menu_bar.tint - 1.0).abs() < f32::EPSILON);
        assert_eq!(s.menu_bar.thickness(), s.menu_bar.height + 24);
    }

    #[test]
    fn a_file_from_when_the_settings_window_had_looks_still_loads() {
        // the window's own look and material are gone (it is always night glass); a file naming them loads as ever
        let s: Settings = serde_json::from_str(r#"{"appearance":{"settingsLook":"sky","settingsSurface":"aero","realBlur":true}}"#).expect("loads");
        assert!(s.appearance.real_blur);
        let json = serde_json::to_string(&s).unwrap();
        assert!(!json.contains("settingsLook") && !json.contains("settingsSurface"), "got {json}");
    }

    #[test]
    fn each_surface_has_its_own_frosting_that_stays_in_range_and_an_old_file_has_the_defaults() {
        let s = Settings::default();
        assert!(s.appearance.frost.dock.blur > 0.0 && s.appearance.frost.start.blur > 0.0 && s.appearance.frost.menu_bar.blur > 0.0);
        // an old file with none of it gets the defaults
        let old: Settings = serde_json::from_str(r#"{"appearance":{"realBlur":true}}"#).expect("loads");
        assert_eq!(old.appearance.frost, FrostSettings::default());
        // one surface can be given a look without the others
        let one: Settings = serde_json::from_str(r#"{"appearance":{"frost":{"start":{"blur":70.0}}}}"#).expect("loads");
        assert_eq!(one.appearance.frost.start.blur, 70.0);
        assert_eq!(one.appearance.frost.start.grain, FrostLook::default().grain);
        assert_eq!(one.appearance.frost.dock, FrostSettings::default().dock);
        // out of range is brought back
        let mut wild = Settings::default();
        wild.appearance.frost.dock = FrostLook { blur: 9000.0, grain: -3.0, glass: None };
        wild.appearance.frost.menu_bar = FrostLook { blur: f32::NAN, grain: f32::INFINITY, glass: None };
        wild.sanitize();
        let kept = wild;
        assert_eq!((kept.appearance.frost.dock.blur, kept.appearance.frost.dock.grain), (120.0, 0.0));
        assert!(kept.appearance.frost.menu_bar.blur.is_finite() && kept.appearance.frost.menu_bar.grain.is_finite());
    }

    #[test]
    fn the_depth_settings_default_on_and_the_blur_off_until_chosen() {
        // a file from before these existed gets the soft light and grain, but
        // not the blur, which is something to switch on and look at
        let s: Settings = serde_json::from_str(r#"{"dock":{"iconSize":40}}"#).expect("old file loads");
        assert!(!s.appearance.real_blur);
        assert!(s.appearance.pointer_light && s.appearance.glass_grain);
        let on: Settings = serde_json::from_str(r#"{"appearance":{"realBlur":true}}"#).expect("loads");
        assert!(on.appearance.real_blur);
        assert!(on.appearance.pointer_light);
    }
    /// Writes the default settings as JSON to the path in `AERO_FIXTURE_OUT`, for
    /// the off-screen test harness in `scripts/offscreen`, which has no Rust of
    /// its own to ask. Run by the harness; ignored in a normal `cargo test`.
    #[test]
    #[ignore]
    fn write_default_settings() {
        let out = std::env::var("AERO_FIXTURE_OUT").expect("AERO_FIXTURE_OUT names the file to write");
        let json = serde_json::to_string_pretty(&Settings::default()).expect("settings serialise");
        std::fs::write(out, json).expect("the fixture can be written");
    }
    #[test]
    fn the_new_bar_and_dock_switches_default_on_and_an_unknown_effect_falls_back() {
        let s: Settings = serde_json::from_str(r#"{"menuBar":{"enabled":true},"dock":{"iconSize":40}}"#).expect("old file loads");
        assert!(s.menu_bar.show_privacy && s.menu_bar.show_stats);
        assert!(s.menu_bar.media_tint && s.menu_bar.media_spectrum);
        assert!(s.dock.attention_bounce);
        assert_eq!(s.dock.minimize_effect, "genie");
        let mut s = Settings::default();
        s.dock.indicator_style = "sparkles".into();
        s.dock.focus_motion = "teleport".into();
        s.dock.ghost_motion = "bounce".into();
        s.dock.minimize_effect = "explode".into();
        s.sanitize();
        assert_eq!(s.dock.minimize_effect, "genie");
        assert_eq!((s.dock.indicator_style.as_str(), s.dock.focus_motion.as_str(), s.dock.ghost_motion.as_str()), ("dots", "glide", "bounce"));
        s.dock.minimize_effect = "scale".into();
        s.sanitize();
        assert_eq!(s.dock.minimize_effect, "scale");
        s.dock.mark_color = " 0A84FF ".into();
        s.sanitize();
        assert_eq!(s.dock.mark_color, "#0a84ff");
        s.dock.mark_color = "not a color".into();
        s.sanitize();
        assert_eq!(s.dock.mark_color, "", "an invalid mark color goes back to following the theme");
    }
    #[test]
    fn accessibility_defaults_follow_the_system_and_keep_sounds_off() {
        let s: Settings = serde_json::from_str(r#"{"dock":{"iconSize":40}}"#).expect("old file loads");
        assert_eq!(s.accessibility.reduce_motion, "system");
        assert_eq!(s.accessibility.reduce_transparency, "system");
        assert!(s.accessibility.keyboard_shortcuts);
        assert!(!s.accessibility.ui_sounds);

        let mut s = Settings::default();
        s.accessibility.reduce_motion = "always".into();
        s.accessibility.reduce_transparency = "on".into();
        s.accessibility.ui_sound_volume = 9.0;
        s.sanitize();
        assert_eq!(s.accessibility.reduce_motion, "system");
        assert_eq!(s.accessibility.reduce_transparency, "on");
        assert!((s.accessibility.ui_sound_volume - 1.0).abs() < f32::EPSILON);
        s.accessibility.ui_sound_volume = f32::NAN;
        s.sanitize();
        assert!((s.accessibility.ui_sound_volume - 0.4).abs() < f32::EPSILON);
    }
    #[test]
    fn the_lens_sizing_settings_have_defaults_and_stay_in_range() {
        let old: Settings = serde_json::from_str(r#"{"menuBar":{"enabled":true}}"#).expect("older block loads");
        assert_eq!(old.menu_bar.lens_grow, 3);
        assert!((old.menu_bar.lens_magnify - 1.07).abs() < f32::EPSILON);
        assert!((old.menu_bar.lens_warp - 1.0).abs() < f32::EPSILON);
        assert!(old.menu_bar.close_on_leave);

        let mut s = Settings::default();
        s.menu_bar.lens_grow = 99;
        s.menu_bar.lens_magnify = 9.0;
        s.menu_bar.lens_warp = -4.0;
        s.sanitize();
        assert_eq!(s.menu_bar.lens_grow, 10);
        assert!((s.menu_bar.lens_magnify - 1.3).abs() < f32::EPSILON);
        assert!(s.menu_bar.lens_warp.abs() < f32::EPSILON);
        s.menu_bar.lens_magnify = f32::NAN;
        s.menu_bar.lens_warp = f32::INFINITY;
        s.sanitize();
        assert!((s.menu_bar.lens_magnify - 1.07).abs() < f32::EPSILON);
        assert!((s.menu_bar.lens_warp - 1.0).abs() < f32::EPSILON);
    }

    #[test]
    fn the_control_center_bubble_colors_default_to_the_theme_and_only_keep_real_colors() {
        let old: Settings = serde_json::from_str(r#"{"menuBar":{"enabled":true}}"#)
            .expect("an older menu bar block must still load");
        assert_eq!(old.menu_bar.wifi_color, "");
        assert_eq!(old.menu_bar.bluetooth_color, "");

        let mut s = Settings::default();
        s.menu_bar.wifi_color = " 0A84FF ".into();
        s.menu_bar.bluetooth_color = "red; background: url(x)".into();
        s.sanitize();
        assert_eq!(s.menu_bar.wifi_color, "#0a84ff");
        assert_eq!(s.menu_bar.bluetooth_color, "");
    }

    #[test]
    fn the_bar_plays_the_ambient_scene_unless_told_not_to() {
        // a file saved before the bar had this setting still loads, with it on
        let s: Settings = serde_json::from_str(r#"{"menuBar":{"enabled":true,"height":30}}"#)
            .expect("an older menu bar block must still load");
        assert!(s.menu_bar.ambient);
        assert_eq!(s.menu_bar.height, 30);
        let off: Settings =
            serde_json::from_str(r#"{"menuBar":{"ambient":false}}"#).expect("explicit off loads");
        assert!(!off.menu_bar.ambient);
    }

    #[test]
    fn a_missing_accent_is_empty_not_a_color() {
        let s = Settings::default();
        assert_eq!(s.appearance.accent, "");
    }

    #[test]
    fn defaults_are_sane() {
        let s = Settings::default();
        assert_eq!(s.schema_version, CURRENT_SCHEMA_VERSION);
        assert_eq!(s.dock.icon_size, 48);
        assert!(s.dock.magnification);
        assert_eq!(s.appearance.theme, "aero");
    }

    #[test]
    fn the_icon_style_defaults_to_glass_and_an_unknown_one_falls_back() {
        let old: Settings = serde_json::from_str(r#"{"dock":{"iconSize":40}}"#).expect("old file loads");
        assert_eq!(old.appearance.icon_style, "glass");
        let mut s = Settings::default();
        s.appearance.icon_style = "clear".into();
        s.sanitize();
        assert_eq!(s.appearance.icon_style, "clear");
        s.appearance.icon_style = "rainbow; drop table".into();
        s.sanitize();
        assert_eq!(s.appearance.icon_style, "glass");
    }

    #[test]
    fn the_start_menu_pins_are_cleaned_and_an_old_file_has_none() {
        let old: Settings = serde_json::from_str(r#"{"dock":{"iconSize":40}}"#).expect("old file loads");
        assert!(old.start.pinned.is_empty() && !old.start.seeded && old.start.show_recommended);
        let mut s = Settings::default();
        let pin = |name: &str, target: &str| StartPin { name: name.into(), target: target.into(), args: String::new() };
        s.start.pinned = vec![
            pin("Notepad", r"C:\Windows\notepad.exe"),
            pin("Notepad again", r"c:\windows\NOTEPAD.EXE"),
            pin("Nothing", "   "),
            pin("", "ms-settings:"),
        ];
        s.start.pinned.extend((0..200).map(|i| pin("x", &format!("C:\\a{i}.exe"))));
        s.sanitize();
        assert_eq!(s.start.pinned[0].name, "Notepad");
        assert!(s.start.pinned.iter().all(|p| !p.target.trim().is_empty()));
        assert_eq!(s.start.pinned[1].name, "ms-settings:", "a pin with no name goes by its target");
        assert!(s.start.pinned.len() <= MAX_START_PINS);
        assert_eq!(s.start.pinned.iter().filter(|p| p.target.eq_ignore_ascii_case(r"C:\Windows\notepad.exe")).count(), 1);
    }

    #[test]
    fn sanitize_clamps_out_of_range() {
        let mut s = Settings::default();
        s.appearance.transparency = 0.0;
        s.appearance.animation_speed = 10.0;
        s.dock.icon_size = 500;
        s.dock.magnification_scale = 9.0;
        s.dock.auto_hide_delay_ms = 50;
        s.sanitize();
        assert_eq!(s.appearance.transparency, 0.3);
        assert_eq!(s.appearance.animation_speed, 2.0);
        assert_eq!(s.dock.icon_size, 96);
        assert_eq!(s.dock.magnification_scale, 2.0);
        assert_eq!(s.dock.auto_hide_delay_ms, 200);
    }

    #[test]
    fn auto_hide_delay_upper_bound_is_clamped() {
        let mut s = Settings::default();
        s.dock.auto_hide_delay_ms = 99_000;
        s.sanitize();
        assert_eq!(s.dock.auto_hide_delay_ms, 10_000);
    }

    #[test]
    fn reveal_zone_defaults_smaller_than_it_used_to_be_hardcoded_and_stays_in_range() {
        let d = DockSettings::default();
        assert_eq!(d.reveal_zone, 40, "the default now needs more travel to the edge than the old fixed 80px");
        let mut s = Settings::default();
        s.dock.reveal_zone = 1;
        s.sanitize();
        assert_eq!(s.dock.reveal_zone, 16, "clamped up to the floor");
        s.dock.reveal_zone = 9_000;
        s.sanitize();
        assert_eq!(s.dock.reveal_zone, 120, "clamped down to the ceiling");
    }

    #[test]
    fn built_in_dock_items_default_to_visible() {
        let d = DockSettings::default();
        assert!(d.show_search_button);
        assert!(d.show_settings_button);
        assert!(d.show_clock);
        assert!(d.show_system_status);
        assert_eq!(d.auto_hide_delay_ms, 1400);
    }

    #[test]
    fn settings_from_v1_0_gain_the_new_fields() {
        // a file written by 1.0.0 has none of the v1.1 keys
        let json = r#"{
            "schemaVersion": 1,
            "dock": { "edge": "bottom", "iconSize": 48, "autoHide": true },
            "appearance": { "theme": "ocean" }
        }"#;
        let s: Settings = serde_json::from_str(json).expect("v1.0 settings should still load");
        assert_eq!(s.dock.icon_size, 48);
        assert!(s.dock.auto_hide);
        assert_eq!(s.appearance.theme, "ocean");
        // new fields fall back to their defaults rather than failing
        assert_eq!(s.dock.auto_hide_delay_ms, 1400);
        assert!(s.dock.show_search_button);
        assert!(s.dock.show_system_status);
    }

    #[test]
    fn roundtrips_through_json() {
        let s = Settings::default();
        let json = serde_json::to_string(&s).expect("serialize");
        let back: Settings = serde_json::from_str(&json).expect("deserialize");
        assert_eq!(back.dock.icon_size, s.dock.icon_size);
        assert_eq!(back.appearance.theme, s.appearance.theme);
    }

    #[test]
    fn unknown_fields_and_missing_fields_tolerated() {
        // forward/backward compatibility: extra + missing fields both fine
        let json = r#"{ "schemaVersion": 1, "futureField": true, "dock": { "iconSize": 64 } }"#;
        let s: Settings = serde_json::from_str(json).expect("lenient parse");
        assert_eq!(s.dock.icon_size, 64);
        assert_eq!(s.appearance.theme, "aero");
    }

    fn pin(id: &str) -> PinnedItem {
        PinnedItem {
            id: id.into(),
            kind: PinKind::App,
            path: format!(r"C:\apps\{id}.exe"),
            name: id.into(),
            icon: None,
            children: Vec::new(),
            view: None,
        }
    }

    fn with_two_modes() -> Settings {
        let mut s = Settings {
            pinned: vec![pin("work-a"), pin("work-b")],
            ..Default::default()
        };
        s.enable_modes_with_default("work".into(), "Work".into());
        s.modes.modes.push(DockMode {
            id: "play".into(),
            name: "Play".into(),
            pinned: vec![pin("game")],
            ..DockMode::default()
        });
        s
    }

    #[test]
    fn a_settings_file_saved_with_a_byte_order_mark_still_parses() {
        // what a Windows editor writes when told to save as UTF-8 with BOM
        let json = "\u{feff}{ \"schemaVersion\": 1, \"dock\": { \"iconSize\": 64 } }";
        let s: Settings = serde_json::from_str(strip_bom(json))
            .expect("a BOM must not look like corruption");
        assert_eq!(s.dock.icon_size, 64);
    }

    #[test]
    fn stripping_a_bom_leaves_ordinary_json_alone() {
        let json = "{ \"schemaVersion\": 1 }";
        assert_eq!(strip_bom(json), json);
    }

    #[test]
    fn the_dock_is_liquid_by_default() {
        assert_eq!(AppearanceSettings::default().dock_surface, SurfaceStyle::Liquid);
    }

    #[test]
    fn surfaces_serialize_as_plain_lowercase_names() {
        let json = serde_json::to_string(&AppearanceSettings::default()).unwrap();
        assert!(json.contains(r#""dockSurface":"liquid""#), "got {json}");
    }

    #[test]
    fn the_classic_material_that_was_comes_back_as_liquid() {
        // the glossy `aero` panel is gone; a file that chose it gets Liquid, which kept its colors
        let s: Settings = serde_json::from_str(r#"{ "appearance": { "dockSurface": "aero" } }"#).expect("loads");
        assert_eq!(s.appearance.dock_surface, SurfaceStyle::Liquid);
        let w: Settings = serde_json::from_str(r#"{ "appearance": { "dockSurface": "clear" } }"#).expect("loads");
        assert_eq!(w.appearance.dock_surface, SurfaceStyle::Clear);
    }

    #[test]
    fn an_older_config_gains_a_surface() {
        // a 1.2 file, written before surfaces existed
        let json = r#"{ "schemaVersion": 2, "appearance": { "theme": "ocean" } }"#;
        let s: Settings = serde_json::from_str(json).expect("must still load");
        assert_eq!(s.appearance.theme, "ocean");
        assert_eq!(s.appearance.dock_surface, SurfaceStyle::Liquid);
    }

    #[test]
    fn an_unknown_surface_name_is_rejected_rather_than_guessed() {
        // a hand-edited file naming a material that does not exist should
        // fail the field, not silently pick one
        let json = r#"{ "appearance": { "dockSurface": "chrome" } }"#;
        assert!(serde_json::from_str::<Settings>(json).is_err());
    }

    #[test]
    fn modes_are_off_until_asked_for() {
        let s = Settings::default();
        assert!(!s.modes.enabled);
        assert!(s.modes.modes.is_empty());
        assert!(s.active_mode().is_none());
    }

    #[test]
    fn turning_modes_on_keeps_the_pins_that_were_already_there() {
        let mut s = Settings {
            pinned: vec![pin("a"), pin("b")],
            ..Default::default()
        };
        s.enable_modes_with_default("default".into(), "Everyday".into());
        assert!(s.modes.enabled);
        assert_eq!(s.modes.active_id, "default");
        // the seeded mode carries the existing dock, and the dock is unchanged
        assert_eq!(s.active_mode().unwrap().pinned.len(), 2);
        assert_eq!(s.pinned.len(), 2);
    }

    #[test]
    fn turning_modes_on_twice_does_not_duplicate_the_default() {
        let mut s = Settings {
            pinned: vec![pin("a")],
            ..Default::default()
        };
        s.enable_modes_with_default("default".into(), "Everyday".into());
        s.modes.enabled = false;
        s.enable_modes_with_default("other".into(), "Other".into());
        assert_eq!(s.modes.modes.len(), 1);
        assert_eq!(s.modes.active_id, "default");
    }

    #[test]
    fn switching_gives_each_mode_its_own_pins() {
        let mut s = with_two_modes();
        assert!(s.switch_mode("play"));
        assert_eq!(s.modes.active_id, "play");
        assert_eq!(s.pinned.len(), 1);
        assert_eq!(s.pinned[0].id, "game");

        // and back again, with the Work pins intact
        assert!(s.switch_mode("work"));
        assert_eq!(s.pinned.len(), 2);
        assert_eq!(s.pinned[0].id, "work-a");
    }

    #[test]
    fn pins_added_while_a_mode_is_active_stay_with_that_mode() {
        let mut s = with_two_modes();
        s.switch_mode("play");
        // the same thing pin_item does: edit the live working set
        s.pinned.push(pin("second-game"));
        s.switch_mode("work");
        s.switch_mode("play");
        assert_eq!(s.pinned.len(), 2);
        assert!(s.pinned.iter().any(|p| p.id == "second-game"));
    }

    #[test]
    fn a_pin_added_without_switching_is_not_lost_on_the_next_switch() {
        let mut s = with_two_modes();
        // pin something the way pin_item does, then let the store persist
        s.pinned.push(pin("late-addition"));
        s.sanitize();
        // go away and come back
        s.switch_mode("play");
        s.switch_mode("work");
        assert!(
            s.pinned.iter().any(|p| p.id == "late-addition"),
            "a pin made between switches must survive"
        );
    }

    #[test]
    fn syncing_does_nothing_when_modes_are_off() {
        let mut s = Settings {
            pinned: vec![pin("a")],
            ..Default::default()
        };
        s.enable_modes_with_default("m".into(), "M".into());
        s.modes.enabled = false;
        s.pinned.push(pin("b"));
        s.sanitize();
        // the dormant mode keeps what it had; the dock keeps what it has
        assert_eq!(s.modes.modes[0].pinned.len(), 1);
        assert_eq!(s.pinned.len(), 2);
    }

    #[test]
    fn switching_to_a_mode_that_does_not_exist_changes_nothing() {
        let mut s = with_two_modes();
        let before = s.pinned.clone();
        assert!(!s.switch_mode("nope"));
        assert_eq!(s.modes.active_id, "work");
        assert_eq!(s.pinned.len(), before.len());
    }

    #[test]
    fn per_app_audio_is_stored_once_per_app() {
        let mut mode = DockMode::default();
        mode.set_audio(AppAudioPref {
            exe: r"C:\x\Discord.exe".into(),
            volume: 40,
            muted: false,
            device_id: None,
        });
        mode.set_audio(AppAudioPref {
            exe: "discord.exe".into(),
            volume: 70,
            muted: true,
            device_id: None,
        });
        assert_eq!(mode.audio.len(), 1);
        let pref = mode.audio_for(r"D:\other\DISCORD.EXE").unwrap();
        assert_eq!(pref.volume, 70);
        assert!(pref.muted);
    }

    #[test]
    fn sanitize_repairs_duplicate_and_empty_mode_ids() {
        let mut s = Settings::default();
        s.modes.enabled = true;
        s.modes.modes = vec![
            DockMode { id: "dup".into(), ..DockMode::default() },
            DockMode { id: "dup".into(), ..DockMode::default() },
            DockMode { id: String::new(), ..DockMode::default() },
        ];
        s.sanitize();
        let ids: Vec<&str> = s.modes.modes.iter().map(|m| m.id.as_str()).collect();
        assert_eq!(ids.len(), 3);
        assert!(ids.iter().all(|i| !i.is_empty()));
        let unique: std::collections::HashSet<_> = ids.iter().collect();
        assert_eq!(unique.len(), 3, "ids must be unique after sanitize");
    }

    #[test]
    fn sanitize_points_a_dangling_active_id_at_a_real_mode() {
        let mut s = Settings::default();
        s.modes.enabled = true;
        s.modes.active_id = "ghost".into();
        s.modes.modes = vec![DockMode { id: "real".into(), ..DockMode::default() }];
        s.sanitize();
        assert_eq!(s.modes.active_id, "real");
    }

    #[test]
    fn sanitize_turns_modes_off_when_there_are_none() {
        let mut s = Settings::default();
        s.modes.enabled = true;
        s.modes.modes.clear();
        s.sanitize();
        assert!(!s.modes.enabled, "enabled with no modes would leave the dock empty");
    }

    #[test]
    fn sanitize_clamps_audio_and_normalizes_keys() {
        let mut s = Settings::default();
        s.modes.enabled = true;
        s.modes.modes = vec![DockMode {
            id: "m".into(),
            audio: vec![AppAudioPref {
                exe: r"C:\Games\Game.EXE".into(),
                volume: 200,
                muted: false,
                device_id: None,
            }],
            auto_switch_apps: vec![r"C:\Games\Game.EXE".into(), String::new()],
            ..DockMode::default()
        }];
        s.sanitize();
        let m = &s.modes.modes[0];
        assert_eq!(m.audio[0].volume, 100);
        assert_eq!(m.audio[0].exe, "game.exe");
        assert_eq!(m.auto_switch_apps, vec!["game.exe".to_string()]);
    }

    #[test]
    fn sanitize_caps_runaway_mode_and_window_counts() {
        use crate::core::workspace::{SnapRect, WindowSnapshot, WindowState};
        let mut s = Settings::default();
        s.modes.enabled = true;
        s.modes.modes = (0..40)
            .map(|i| DockMode { id: format!("m{i}"), ..DockMode::default() })
            .collect();
        s.modes.modes[0].workspace.windows = (0..500)
            .map(|i| WindowSnapshot {
                exe: format!(r"C:\a\app{i}.exe"),
                title: String::new(),
                aumid: None,
                monitor: String::new(),
                rect: SnapRect { left: 0, top: 0, right: 1, bottom: 1 },
                state: WindowState::Normal,
            })
            .collect();
        s.sanitize();
        assert_eq!(s.modes.modes.len(), MAX_MODES);
        assert_eq!(s.modes.modes[0].workspace.windows.len(), MAX_SNAPSHOT_WINDOWS);
    }

    #[test]
    fn auto_switching_only_fires_for_a_different_mode() {
        let mut s = with_two_modes();
        s.modes.auto_switch = true;
        s.modes.modes[1].auto_switch_apps = vec!["game.exe".into()];
        s.modes.modes[0].auto_switch_apps = vec!["code.exe".into()];

        // a game while Work is active should pull Play forward
        assert_eq!(
            s.mode_claiming(r"D:\Steam\Game.exe").map(|m| m.id.clone()),
            Some("play".into())
        );
        // the active mode owning the app is not a switch
        assert!(s.mode_claiming(r"C:\dev\code.exe").is_none());
        // an app nobody claims is not a switch
        assert!(s.mode_claiming("notepad.exe").is_none());
    }

    #[test]
    fn auto_switching_stays_quiet_when_it_is_off() {
        let mut s = with_two_modes();
        s.modes.auto_switch = false;
        s.modes.modes[1].auto_switch_apps = vec!["game.exe".into()];
        assert!(s.mode_claiming("game.exe").is_none());
    }

    #[test]
    fn a_v1_1_settings_file_still_loads_and_gains_modes_switched_off() {
        // exactly what 1.1.0 wrote: no modes key at all
        let json = r#"{
            "schemaVersion": 1,
            "dock": { "edge": "bottom", "iconSize": 48, "autoHide": true },
            "appearance": { "theme": "ocean" },
            "pinned": [
                { "id": "p1", "kind": "app", "path": "C:\\a\\x.exe", "name": "X",
                  "icon": null, "children": [] }
            ],
            "hideTaskbar": true,
            "onboardingComplete": true
        }"#;
        let mut s: Settings = serde_json::from_str(json).expect("a 1.1 file must still load");
        s.sanitize();
        // everything that was there survives
        assert_eq!(s.pinned.len(), 1);
        assert_eq!(s.pinned[0].name, "X");
        assert!(s.dock.auto_hide);
        assert!(s.hide_taskbar);
        assert!(s.onboarding_complete);
        assert_eq!(s.appearance.theme, "ocean");
        // and modes arrive dormant, changing nothing about the dock
        assert!(!s.modes.enabled);
        assert!(s.modes.modes.is_empty());
        assert_eq!(s.schema_version, CURRENT_SCHEMA_VERSION);
    }

    #[test]
    fn modes_round_trip_through_json_with_everything_populated() {
        use crate::core::workspace::{SnapRect, WindowSnapshot, WindowState, WorkspaceSnapshot};
        let mut s = with_two_modes();
        s.modes.auto_switch = true;
        s.modes.modes[0].set_audio(AppAudioPref {
            exe: "discord.exe".into(),
            volume: 35,
            muted: true,
            device_id: Some("{0.0.0.00000000}.{abc}".into()),
        });
        s.modes.modes[0].workspace = WorkspaceSnapshot {
            windows: vec![WindowSnapshot {
                exe: r"C:\Windows\notepad.exe".into(),
                title: "Untitled - Notepad".into(),
                aumid: None,
                monitor: r"\\.\DISPLAY1".into(),
                rect: SnapRect { left: 1, top: 2, right: 803, bottom: 604 },
                state: WindowState::Maximized,
            }],
            captured_at: 1_700_000_000,
        };

        let json = serde_json::to_string(&s).unwrap();
        let back: Settings = serde_json::from_str(&json).unwrap();
        assert_eq!(back.modes.modes.len(), 2);
        let work = &back.modes.modes[0];
        assert_eq!(work.audio[0].volume, 35);
        assert_eq!(work.audio[0].device_id.as_deref(), Some("{0.0.0.00000000}.{abc}"));
        assert_eq!(work.workspace.windows[0].rect.right, 803);
        assert_eq!(work.workspace.captured_at, 1_700_000_000);
        assert!(back.modes.auto_switch);
    }
}
