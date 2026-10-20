//! Desktop widgets: what one is, and the rules that keep a set of them
//! sane.
//!
//! Every widget is the same shape regardless of what it shows. A kind
//! decides which component renders and which of the options below it
//! reads; everything about placement and material is shared. Adding a
//! kind means adding a variant and a component, and nothing else here
//! has to change.
//!
//! Positions are offsets from the top left of the widget overlay, which
//! covers every monitor, so a widget can sit on any of them. They are not
//! virtual-desktop coordinates: the overlay's own origin is already the
//! leftmost, topmost point of the desktop, so a monitor left of the
//! primary is reached with a small offset rather than a negative one.

use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};
use serde_json::Value;

use super::settings::SurfaceStyle;

/// Widgets smaller than this stop being readable; larger than this and a
/// stray resize can cover the screen.
pub const MIN_SIZE: u32 = 90;
pub const MAX_SIZE: u32 = 1600;

/// A hand-editable file should not be able to spawn a thousand windows.
pub const MAX_WIDGETS: usize = 24;

/// How far off the virtual desktop a widget may sit before it is pulled
/// back. Generous, because monitor layouts move around.
const POSITION_LIMIT: i32 = 20_000;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum WidgetKind {
    Clock,
    Calendar,
    Weather,
    SystemStats,
    Music,
    /// Your own picture or GIF in a glass frame.
    Picture,
    Notes,
    Checklist,
    Timer,
    Countdown,
    WorldClock,
    Progress,
    Moon,
    Quote,
    Counter,
    DateTile,
    FlipClock,
    Calculator,
    Randomizer,
    Controls,
    Battery,
}

impl WidgetKind {
    /// A sensible starting size for each kind, in logical pixels.
    pub fn default_size(self) -> (u32, u32) {
        match self {
            Self::Clock => (260, 260),
            Self::Calendar => (300, 300),
            Self::Weather => (280, 190),
            Self::SystemStats => (260, 220),
            Self::Music => (340, 150),
            Self::Picture => (260, 260),
            Self::Notes => (260, 240),
            Self::Checklist => (260, 280),
            Self::Timer => (260, 240),
            Self::Countdown => (260, 200),
            Self::WorldClock => (300, 230),
            Self::Progress => (270, 220),
            Self::Moon => (220, 240),
            Self::Quote => (320, 190),
            Self::Counter => (210, 210),
            Self::DateTile => (200, 200),
            Self::FlipClock => (330, 170),
            Self::Calculator => (240, 330),
            Self::Randomizer => (230, 230),
            Self::Controls => (290, 170),
            Self::Battery => (200, 200),
        }
    }

    /// Whether this kind ever leaves the machine. Only weather does, and
    /// only once the user has asked for it.
    pub fn uses_network(self) -> bool {
        matches!(self, Self::Weather)
    }

    pub fn label(self) -> &'static str {
        match self {
            Self::Clock => "Clock",
            Self::Calendar => "Calendar",
            Self::Weather => "Weather",
            Self::SystemStats => "System stats",
            Self::Music => "Music",
            Self::Picture => "Picture",
            Self::Notes => "Notes",
            Self::Checklist => "Checklist",
            Self::Timer => "Timer",
            Self::Countdown => "Countdown",
            Self::WorldClock => "World clocks",
            Self::Progress => "Time progress",
            Self::Moon => "Moon",
            Self::Quote => "Quote",
            Self::Counter => "Counter",
            Self::DateTile => "Date",
            Self::FlipClock => "Flip clock",
            Self::Calculator => "Calculator",
            Self::Randomizer => "Dice and coins",
            Self::Controls => "Volume and brightness",
            Self::Battery => "Battery",
        }
    }
}

/// Per-kind settings. Flat and all optional so a new kind can add a field
/// without a migration, and so an older build ignores what it does not
/// understand instead of failing to parse.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct WidgetOptions {
    /// Clock: sweep a second hand and show seconds.
    pub seconds: bool,
    /// Clock: 24 hour face instead of 12.
    pub twenty_four_hour: bool,
    /// Clock: analogue face rather than digital readout.
    pub analog: bool,
    /// Weather: where to report for. Without these the widget asks to be
    /// set up rather than guessing.
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub place: Option<String>,
    /// Weather: Celsius when true, Fahrenheit when false.
    pub celsius: bool,
    /// Everything the newer widgets keep: each reads its own keys (see src/features/desktop/registry.ts, which
    /// has the defaults), so a widget can have settings of its own without a field here. Checked and capped by
    /// [sanitize_extra].
    pub extra: BTreeMap<String, Value>,
}

impl Default for WidgetOptions {
    fn default() -> Self {
        Self {
            seconds: true,
            twenty_four_hour: false,
            analog: true,
            latitude: None,
            longitude: None,
            place: None,
            celsius: true,
            extra: BTreeMap::new(),
        }
    }
}

/// One widget on the desktop.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct WidgetInstance {
    pub id: String,
    pub kind: WidgetKind,
    /// Virtual-desktop position of the top left corner.
    pub x: i32,
    pub y: i32,
    pub width: u32,
    pub height: u32,
    /// 0.3..=1.0. Below a third the text stops being readable.
    pub opacity: f32,
    /// Which material the widget is made of, independent of the dock.
    pub surface: SurfaceStyle,
    /// Hex tint (`#rrggbb`) overriding the theme accent for this widget.
    pub accent: Option<String>,
    /// Bubbles and light drifting inside the widget.
    pub ambient: bool,
    /// Pinned in place, so a stray drag cannot move it.
    pub locked: bool,
    pub options: WidgetOptions,
}

impl Default for WidgetInstance {
    fn default() -> Self {
        Self {
            id: String::new(),
            kind: WidgetKind::Clock,
            x: 80,
            y: 80,
            width: 260,
            height: 260,
            opacity: 0.92,
            surface: SurfaceStyle::Liquid,
            accent: None,
            ambient: true,
            locked: false,
            options: WidgetOptions::default(),
        }
    }
}

impl WidgetInstance {
    /// A new widget of a kind, at a position, sized for that kind.
    pub fn new(id: String, kind: WidgetKind, x: i32, y: i32) -> Self {
        let (width, height) = kind.default_size();
        Self {
            id,
            kind,
            x,
            y,
            width,
            height,
            ..Self::default()
        }
    }

    /// The rectangle this widget occupies, as `(x, y, width, height)`.
    /// The overlay window uses these to decide where clicks land.
    pub fn rect(&self) -> (i32, i32, u32, u32) {
        (self.x, self.y, self.width, self.height)
    }
}

/// The widget layer as a whole.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct WidgetsSettings {
    /// Off until asked for, so upgrading puts nothing on the desktop.
    pub enabled: bool,
    pub widgets: Vec<WidgetInstance>,
    /// Weather is the only widget that makes a network request, so it
    /// carries its own switch on top of being added at all.
    pub allow_weather_network: bool,
    /// Snapping, when a widget is moved or resized (Alt held does the opposite for that one move). Off until asked for:
    /// widgets go where they are put.
    pub snap_enabled: bool,
    /// Move to the grid (the widget's top left on a line, its bottom right on one when resized).
    pub snap_grid: bool,
    /// The grid's squares, in pixels.
    pub snap_size: u32,
    /// Line up with the edges and middles of the other widgets and of the screen.
    pub snap_align: bool,
    /// How near an edge must be to be pulled to it, in pixels.
    pub snap_threshold: u32,
    /// How far in from the screen's edges that alignment holds them.
    pub snap_margin: u32,
    /// Resizing snaps too (the bottom right corner).
    pub snap_resize: bool,
    /// Show the grid and the guides while one is moved.
    pub snap_show_grid: bool,
}

impl Default for WidgetsSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            widgets: Vec::new(),
            allow_weather_network: false,
            snap_enabled: false,
            snap_grid: true,
            snap_size: 40,
            snap_align: true,
            snap_threshold: 10,
            snap_margin: 20,
            snap_resize: true,
            snap_show_grid: true,
        }
    }
}

impl WidgetsSettings {
    /// Clamp everything into range, drop duplicates, and keep the list a
    /// sane length. Called from the settings sanitizer, so a hand-edited
    /// file cannot produce a widget nobody can see or reach.
    pub fn sanitize(&mut self) {
        self.snap_size = self.snap_size.clamp(8, 200);
        self.snap_threshold = self.snap_threshold.clamp(3, 30);
        self.snap_margin = self.snap_margin.min(120);
        self.widgets.truncate(MAX_WIDGETS);

        let mut seen: Vec<String> = Vec::with_capacity(self.widgets.len());
        let mut spare = 1;
        for w in self.widgets.iter_mut() {
            if w.id.trim().is_empty() || seen.contains(&w.id) {
                loop {
                    let candidate = format!("widget-{spare}");
                    spare += 1;
                    if !seen.contains(&candidate) {
                        w.id = candidate;
                        break;
                    }
                }
            }
            seen.push(w.id.clone());

            w.width = w.width.clamp(MIN_SIZE, MAX_SIZE);
            w.height = w.height.clamp(MIN_SIZE, MAX_SIZE);
            w.x = w.x.clamp(-POSITION_LIMIT, POSITION_LIMIT);
            w.y = w.y.clamp(-POSITION_LIMIT, POSITION_LIMIT);
            w.opacity = w.opacity.clamp(0.3, 1.0);

            // A coordinate outside the globe is a typo, and sending it
            // anywhere would only come back as an error. Dropping it puts
            // the widget back to asking for a location.
            if let Some(lat) = w.options.latitude {
                if !lat.is_finite() || lat.abs() > 90.0 {
                    w.options.latitude = None;
                }
            }
            if let Some(lon) = w.options.longitude {
                if !lon.is_finite() || lon.abs() > 180.0 {
                    w.options.longitude = None;
                }
            }
            if let Some(accent) = &w.accent {
                if !is_hex_color(accent) {
                    w.accent = None;
                }
            }
            sanitize_extra(&mut w.options.extra);
        }

        // Nothing to show means the layer should not be holding a window
        // open, and an empty desktop with the feature "on" reads as broken.
        if self.widgets.is_empty() {
            self.enabled = false;
        }
    }

    /// Rectangles for every widget, for the overlay's hit region.
    pub fn rects(&self) -> Vec<(i32, i32, u32, u32)> {
        self.widgets.iter().map(WidgetInstance::rect).collect()
    }

    /// True when any widget present would actually reach the network.
    pub fn wants_network(&self) -> bool {
        self.allow_weather_network
            && self.widgets.iter().any(|w| w.kind.uses_network())
    }
}

/// The most keys, and the most text, one widget's own settings may hold: a hand-edited file cannot make one widget
/// carry a megabyte, and a runaway note or list is cut rather than stored.
pub const MAX_EXTRA_KEYS: usize = 48;
pub const MAX_EXTRA_VALUE_BYTES: usize = 12_000;
pub const MAX_EXTRA_BYTES: usize = 40_000;

/// Keep a widget's free-form settings to plain names and values of a sane size.
pub fn sanitize_extra(extra: &mut BTreeMap<String, Value>) {
    extra.retain(|key, value| {
        key.len() <= 48
            && !key.is_empty()
            && key.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'_')
            && !value.is_null()
            && serde_json::to_string(value).map(|s| s.len() <= MAX_EXTRA_VALUE_BYTES).unwrap_or(false)
    });
    while extra.len() > MAX_EXTRA_KEYS {
        extra.pop_last();
    }
    // over the total: the largest go first
    loop {
        let sizes: Vec<(usize, String)> = extra
            .iter()
            .map(|(k, v)| (serde_json::to_string(v).map(|s| s.len()).unwrap_or(0) + k.len(), k.clone()))
            .collect();
        if sizes.iter().map(|(n, _)| n).sum::<usize>() <= MAX_EXTRA_BYTES {
            break;
        }
        match sizes.into_iter().max_by_key(|(n, _)| *n) {
            Some((_, key)) => {
                extra.remove(&key);
            }
            None => break,
        }
    }
    // a corner radius is a number of pixels that fits a widget
    if let Some(Value::Number(n)) = extra.get("radius") {
        let r = n.as_f64().unwrap_or(20.0).clamp(0.0, 60.0);
        extra.insert("radius".into(), Value::from(r.round() as i64));
    } else {
        extra.remove("radius");
    }
}
/// `#rrggbb`, the only form the pickers produce.
fn is_hex_color(value: &str) -> bool {
    let bytes = value.as_bytes();
    bytes.len() == 7
        && bytes[0] == b'#'
        && bytes[1..].iter().all(|b| b.is_ascii_hexdigit())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn widget(id: &str) -> WidgetInstance {
        WidgetInstance::new(id.into(), WidgetKind::Clock, 10, 10)
    }

    #[test]
    fn a_coordinate_off_the_globe_is_dropped() {
        let mut s = WidgetsSettings {
            enabled: true,
            widgets: vec![WidgetInstance {
                kind: WidgetKind::Weather,
                options: WidgetOptions {
                    latitude: Some(999.0),
                    longitude: Some(-0.13),
                    ..WidgetOptions::default()
                },
                ..widget("w")
            }],
            allow_weather_network: false,
            ..Default::default()
        };
        s.sanitize();
        assert_eq!(s.widgets[0].options.latitude, None, "999 is not a latitude");
        assert_eq!(
            s.widgets[0].options.longitude,
            Some(-0.13),
            "a good longitude survives"
        );
    }

    #[test]
    fn a_new_widget_gets_the_size_its_kind_wants() {
        let w = WidgetInstance::new("a".into(), WidgetKind::Music, 0, 0);
        assert_eq!((w.width, w.height), WidgetKind::Music.default_size());
    }

    #[test]
    fn only_weather_touches_the_network() {
        assert!(WidgetKind::Weather.uses_network());
        for kind in [
            WidgetKind::Clock,
            WidgetKind::Calendar,
            WidgetKind::SystemStats,
            WidgetKind::Music,
        ] {
            assert!(!kind.uses_network(), "{kind:?} must stay offline");
        }
    }

    #[test]
    fn weather_stays_offline_until_both_switches_are_on() {
        let mut s = WidgetsSettings {
            enabled: true,
            widgets: vec![WidgetInstance::new("w".into(), WidgetKind::Weather, 0, 0)],
            allow_weather_network: false,
            ..Default::default()
        };
        assert!(!s.wants_network(), "present but not permitted");
        s.allow_weather_network = true;
        assert!(s.wants_network());
    }

    #[test]
    fn permission_alone_does_not_reach_the_network() {
        let s = WidgetsSettings {
            enabled: true,
            widgets: vec![widget("clock")],
            allow_weather_network: true,
            ..Default::default()
        };
        assert!(!s.wants_network(), "no weather widget means no request");
    }

    #[test]
    fn sanitize_clamps_sizes_and_opacity() {
        let mut s = WidgetsSettings {
            enabled: true,
            widgets: vec![WidgetInstance {
                width: 5,
                height: 99_999,
                opacity: 4.0,
                ..widget("a")
            }],
            allow_weather_network: false,
            ..Default::default()
        };
        s.sanitize();
        assert_eq!(s.widgets[0].width, MIN_SIZE);
        assert_eq!(s.widgets[0].height, MAX_SIZE);
        assert_eq!(s.widgets[0].opacity, 1.0);
    }

    #[test]
    fn sanitize_keeps_negative_positions_for_monitors_left_of_primary() {
        let mut s = WidgetsSettings {
            enabled: true,
            widgets: vec![WidgetInstance {
                x: -1400,
                y: -200,
                ..widget("a")
            }],
            allow_weather_network: false,
            ..Default::default()
        };
        s.sanitize();
        assert_eq!(s.widgets[0].x, -1400);
        assert_eq!(s.widgets[0].y, -200);
    }

    #[test]
    fn sanitize_pulls_back_absurd_positions() {
        let mut s = WidgetsSettings {
            enabled: true,
            widgets: vec![WidgetInstance {
                x: 9_000_000,
                ..widget("a")
            }],
            allow_weather_network: false,
            ..Default::default()
        };
        s.sanitize();
        assert!(s.widgets[0].x <= POSITION_LIMIT);
    }

    #[test]
    fn sanitize_repairs_duplicate_and_empty_ids() {
        let mut s = WidgetsSettings {
            enabled: true,
            widgets: vec![widget("dup"), widget("dup"), widget("")],
            allow_weather_network: false,
            ..Default::default()
        };
        s.sanitize();
        let ids: Vec<&str> = s.widgets.iter().map(|w| w.id.as_str()).collect();
        let unique: std::collections::HashSet<_> = ids.iter().collect();
        assert_eq!(unique.len(), 3, "ids must be unique: {ids:?}");
        assert!(ids.iter().all(|i| !i.is_empty()));
    }

    #[test]
    fn sanitize_rejects_a_malformed_color_rather_than_passing_it_to_css() {
        let mut s = WidgetsSettings {
            enabled: true,
            widgets: vec![
                WidgetInstance { accent: Some("#12ab34".into()), ..widget("good") },
                WidgetInstance { accent: Some("red; content: evil".into()), ..widget("bad") },
            ],
            allow_weather_network: false,
            ..Default::default()
        };
        s.sanitize();
        assert_eq!(s.widgets[0].accent.as_deref(), Some("#12ab34"));
        assert_eq!(s.widgets[1].accent, None);
    }

    #[test]
    fn sanitize_turns_the_layer_off_when_nothing_is_left() {
        let mut s = WidgetsSettings {
            enabled: true,
            widgets: Vec::new(),
            allow_weather_network: false,
            ..Default::default()
        };
        s.sanitize();
        assert!(!s.enabled);
    }

    #[test]
    fn sanitize_caps_a_runaway_list() {
        let mut s = WidgetsSettings {
            enabled: true,
            widgets: (0..200).map(|i| widget(&format!("w{i}"))).collect(),
            allow_weather_network: false,
            ..Default::default()
        };
        s.sanitize();
        assert_eq!(s.widgets.len(), MAX_WIDGETS);
    }

    #[test]
    fn rects_line_up_with_the_widgets() {
        let s = WidgetsSettings {
            enabled: true,
            widgets: vec![WidgetInstance { x: 5, y: 6, width: 100, height: 120, ..widget("a") }],
            allow_weather_network: false,
            ..Default::default()
        };
        assert_eq!(s.rects(), vec![(5, 6, 100, 120)]);
    }

    #[test]
    fn a_widgets_own_settings_are_checked_and_capped() {
        let mut extra: BTreeMap<String, Value> = BTreeMap::new();
        extra.insert("text".into(), Value::from("hello"));
        extra.insert("bad key!".into(), Value::from(1));
        extra.insert("empty".into(), Value::Null);
        extra.insert("huge".into(), Value::from("x".repeat(MAX_EXTRA_VALUE_BYTES + 1)));
        extra.insert("radius".into(), Value::from(9000));
        sanitize_extra(&mut extra);
        assert_eq!(extra.get("text"), Some(&Value::from("hello")));
        assert!(!extra.contains_key("bad key!") && !extra.contains_key("empty") && !extra.contains_key("huge"));
        assert_eq!(extra.get("radius"), Some(&Value::from(60)), "a radius is clamped");
        // too many keys, and too much in total
        let mut many: BTreeMap<String, Value> = (0..200).map(|i| (format!("k{i:03}"), Value::from("y".repeat(2_000)))).collect();
        sanitize_extra(&mut many);
        assert!(many.len() <= MAX_EXTRA_KEYS);
        let total: usize = many.iter().map(|(k, v)| k.len() + serde_json::to_string(v).unwrap().len()).sum();
        assert!(total <= MAX_EXTRA_BYTES, "{total}");
    }

    #[test]
    fn snapping_is_off_by_default_and_its_numbers_are_kept_sane() {
        let s = WidgetsSettings::default();
        assert!(!s.snap_enabled, "widgets go where they are put until it is asked for");
        let mut wild = WidgetsSettings { snap_size: 0, snap_threshold: 9999, snap_margin: 99999, ..Default::default() };
        wild.sanitize();
        assert_eq!((wild.snap_size, wild.snap_threshold, wild.snap_margin), (8, 30, 120));
        let old: WidgetsSettings = serde_json::from_str("{\"enabled\":true}").unwrap();
        assert_eq!((old.snap_enabled, old.snap_size, old.snap_grid), (false, 40, true), "a file from before snapping loads");
    }

    #[test]
    fn a_widget_round_trips_through_json() {
        let w = WidgetInstance {
            surface: SurfaceStyle::Liquid,
            accent: Some("#7ad03a".into()),
            options: WidgetOptions { analog: false, celsius: false, ..Default::default() },
            ..widget("a")
        };
        let back: WidgetInstance =
            serde_json::from_str(&serde_json::to_string(&w).unwrap()).unwrap();
        assert_eq!(back, w);
    }

    #[test]
    fn a_config_written_before_widgets_existed_still_loads() {
        let s: WidgetsSettings = serde_json::from_str("{}").expect("must load");
        assert!(!s.enabled);
        assert!(s.widgets.is_empty());
        assert!(!s.allow_weather_network);
    }
}
