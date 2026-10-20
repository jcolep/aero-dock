/**
 * The widget catalogue.
 *
 * Adding a kind means adding a component and one entry here (and its name in `core/widgets.rs`). Nothing else in the
 * desktop layer knows what kinds exist: the frame, the dragging, the materials and the settings list all read from
 * this table. A kind's own settings are `fields`: the Settings window draws them from the list, and the widget reads
 * them with `opt(widget, key, default)` (kit.ts), where the default is the same one written here.
 */

import type { ComponentType } from "react";
import type { WidgetInstance, WidgetKind } from "../../ipc/types";
import { CalendarWidget } from "./widgets/CalendarWidget";
import { ClockWidget } from "./widgets/ClockWidget";
import { MusicWidget } from "./widgets/MusicWidget";
import { StatsWidget } from "./widgets/StatsWidget";
import { WeatherWidget } from "./widgets/WeatherWidget";
import { PictureWidget } from "./widgets/PictureWidget";
import { ChecklistWidget, CounterWidget, NotesWidget } from "./widgets/NoteWidgets";
import { CountdownWidget, DateTileWidget, FlipClockWidget, ProgressWidget, TimerWidget, WorldClockWidget } from "./widgets/TimeWidgets";
import { BatteryWidget, CalculatorWidget, ControlsWidget, MoonWidget, QuoteWidget, RandomizerWidget } from "./widgets/MoreWidgets";

/** Every widget component gets the instance it is rendering. */
export interface WidgetProps {
  widget: WidgetInstance;
  /** Whether the user has allowed the one widget that goes online to do
   *  so. Passed to every widget rather than read globally, so a kind that
   *  needs the network cannot forget to ask. */
  allowNetwork: boolean;
}

/** One of a widget's own settings, as the Settings window draws it. */
export type Field = { key: string; label: string; hint?: string; when?: (extra: Record<string, unknown>) => boolean } & (
  | { type: "toggle"; default: boolean }
  | { type: "slider"; default: number; min: number; max: number; step: number; unit?: string }
  | { type: "choice"; default: string; options: [string, string][] }
  | { type: "text"; default: string; placeholder?: string; max?: number }
  | { type: "textarea"; default: string; placeholder?: string; rows?: number }
  | { type: "datetime"; default: string }
);

export type WidgetGroup = "Pictures" | "Time" | "Notes" | "Fun" | "System" | "Desktop";

export interface WidgetDefinition {
  kind: WidgetKind;
  label: string;
  /** One line for the settings list. */
  description: string;
  group: WidgetGroup;
  component: ComponentType<WidgetProps>;
  /** Smallest size that still reads, in CSS pixels. */
  minWidth: number;
  minHeight: number;
  /** True for anything that leaves the machine. Only weather does. */
  network?: boolean;
  /** The kind's own settings (the older five have theirs written out in WidgetsCard). */
  fields?: Field[];
}

const px = (key: string, label: string, def: number, min: number, max: number, step = 1, hint?: string): Field => ({ key, label, hint, type: "slider", default: def, min, max, step, unit: "px" });
const pct = (key: string, label: string, def: number, min: number, max: number, step = 0.05, hint?: string): Field => ({ key, label, hint, type: "slider", default: def, min, max, step, unit: "%" });
const num = (key: string, label: string, def: number, min: number, max: number, unit = "", step = 1, hint?: string, when?: Field["when"]): Field => ({ key, label, hint, when, type: "slider", default: def, min, max, step, unit });
const on = (key: string, label: string, def: boolean, hint?: string): Field => ({ key, label, hint, type: "toggle", default: def });
const pick = (key: string, label: string, def: string, options: [string, string][], hint?: string, when?: Field["when"]): Field => ({ key, label, hint, when, type: "choice", default: def, options });

export const WIDGETS: WidgetDefinition[] = [
  { kind: "clock", label: "Clock", group: "Time", description: "Analogue or digital, with a sweeping second hand", component: ClockWidget, minWidth: 140, minHeight: 140 },
  { kind: "calendar", label: "Calendar", group: "Time", description: "The month, with today marked", component: CalendarWidget, minWidth: 210, minHeight: 210 },
  { kind: "weather", label: "Weather", group: "Desktop", description: "Current conditions for a place you choose", component: WeatherWidget, minWidth: 200, minHeight: 150, network: true },
  { kind: "systemStats", label: "System stats", group: "System", description: "Processor, memory and uptime", component: StatsWidget, minWidth: 190, minHeight: 160 },
  { kind: "music", label: "Music", group: "Desktop", description: "Whatever Windows is playing, with transport controls", component: MusicWidget, minWidth: 240, minHeight: 120 },

  {
    kind: "picture", label: "Picture / GIF", group: "Pictures", description: "Your own picture or GIF in a pane of glass", component: PictureWidget, minWidth: 110, minHeight: 110,
    fields: [
      pick("fit", "Fit", "contain", [["contain", "Whole"], ["cover", "Fill"], ["fill", "Stretch"]], "Whole shows all of it; Fill crops to cover the pane"),
      pct("scale", "Size in the pane", 1, 0.3, 2, 0.05),
      pick("shape", "Shape", "rounded", [["rounded", "Rounded"], ["circle", "Circle"], ["square", "Square"]]),
      px("pad", "Room round it", 14, 0, 60),
      pct("imageOpacity", "Picture opacity", 1, 0.2, 1, 0.02),
      pick("filter", "Look", "none", [["none", "As is"], ["grayscale", "Gray"], ["sepia", "Sepia"], ["invert", "Invert"]]),
      num("brightness", "Brightness", 1, 0.4, 1.6, "x", 0.05),
      on("flip", "Mirror it", false),
      on("glow", "Glow in the tint color", false),
      on("playOnHover", "Play only while the pointer is on it", false, "A GIF shows its first frame the rest of the time, and is not redrawn"),
      { key: "caption", label: "Caption", type: "text", default: "", placeholder: "Under the picture", max: 80 },
      num("captionSize", "Caption size", 13, 9, 30, "px", 1, undefined, (e) => !!e.caption),
    ],
  },
  {
    kind: "notes", label: "Notes", group: "Notes", description: "A note to write on, kept on the desktop", component: NotesWidget, minWidth: 160, minHeight: 120,
    fields: [
      { key: "title", label: "Title", type: "text", default: "", placeholder: "Above the note", max: 60 },
      px("fontSize", "Text size", 15, 10, 32),
      pick("paper", "Paper", "glass", [["glass", "Glass"], ["yellow", "Yellow"], ["pink", "Pink"], ["blue", "Blue"], ["green", "Green"]]),
      on("mono", "Typewriter font", false),
      on("spellcheck", "Check spelling", false),
      on("showCount", "Show the word count", false),
    ],
  },
  {
    kind: "checklist", label: "Checklist", group: "Notes", description: "Things to do, ticked off", component: ChecklistWidget, minWidth: 180, minHeight: 160,
    fields: [
      { key: "title", label: "Title", type: "text", default: "To do", max: 40 },
      on("strike", "Strike through what is done", true),
      on("hideDone", "Hide what is done", false),
      on("progress", "Show progress", true),
      on("newAtTop", "New items at the top", false),
    ],
  },
  {
    kind: "counter", label: "Counter", group: "Notes", description: "Count something towards a daily goal", component: CounterWidget, minWidth: 160, minHeight: 170,
    fields: [
      { key: "label", label: "What it counts", type: "text", default: "Glasses of water", max: 40 },
      { key: "icon", label: "Icon", type: "text", default: "💧", placeholder: "An emoji", max: 4 },
      num("goal", "Goal", 8, 0, 200, "", 1, "0 for no goal"),
      num("step", "Each press adds", 1, 1, 50),
      on("ring", "Show the ring", true),
      on("resetDaily", "Start again each day", true),
    ],
  },
  {
    kind: "timer", label: "Timer", group: "Time", description: "Pomodoro, a countdown or a stopwatch", component: TimerWidget, minWidth: 190, minHeight: 190,
    fields: [
      pick("mode", "Mode", "pomodoro", [["pomodoro", "Pomodoro"], ["countdown", "Countdown"], ["stopwatch", "Stopwatch"]]),
      num("workMin", "Focus", 25, 1, 120, " min", 1, undefined, (e) => (e.mode ?? "pomodoro") === "pomodoro"),
      num("breakMin", "Short break", 5, 1, 60, " min", 1, undefined, (e) => (e.mode ?? "pomodoro") === "pomodoro"),
      num("longMin", "Long break", 15, 1, 60, " min", 1, undefined, (e) => (e.mode ?? "pomodoro") === "pomodoro"),
      num("longEvery", "Long break after", 4, 2, 8, " rounds", 1, undefined, (e) => (e.mode ?? "pomodoro") === "pomodoro"),
      on("autoNext", "Start the next round by itself", true),
      num("countdownMin", "Countdown", 10, 1, 600, " min", 1, undefined, (e) => e.mode === "countdown"),
      on("ring", "Show the ring", true),
      on("sound", "Chime when it ends", true, "Uses the interface sounds setting (Accessibility)"),
    ],
  },
  {
    kind: "countdown", label: "Countdown", group: "Time", description: "Days until (or since) a date that matters", component: CountdownWidget, minWidth: 190, minHeight: 150,
    fields: [
      { key: "label", label: "What it is", type: "text", default: "New Year", max: 40 },
      { key: "target", label: "Date and time", type: "datetime", default: "2027-01-01T00:00" },
      { key: "icon", label: "Icon", type: "text", default: "🎉", placeholder: "An emoji", max: 4 },
      pick("style", "Shows", "days", [["days", "Days"], ["detailed", "Days, hours, minutes"]]),
      on("showSeconds", "Show the seconds", false, undefined),
    ],
  },
  {
    kind: "worldClock", label: "World clocks", group: "Time", description: "The time in up to six places", component: WorldClockWidget, minWidth: 220, minHeight: 130,
    fields: [
      { key: "zones", label: "Time zones", type: "textarea", default: "America/New_York, Europe/London, Asia/Tokyo, Australia/Sydney", placeholder: "Europe/Paris, Asia/Kolkata", rows: 3, hint: "Names like Europe/Paris, separated by commas. Up to six" },
      on("faces", "Little clock faces", true),
      on("showDay", "Say Yesterday and Tomorrow", true),
      on("twentyFour", "24 hour", false),
      on("seconds", "Show seconds", false),
    ],
  },
  {
    kind: "progress", label: "Time progress", group: "Time", description: "How far through the day, week, month and year", component: ProgressWidget, minWidth: 190, minHeight: 130,
    fields: [
      pick("style", "Look", "bars", [["bars", "Bars"], ["rings", "Rings"]]),
      on("day", "Today", true),
      on("week", "This week", true),
      on("month", "This month", true),
      on("year", "This year", true),
      pick("weekStart", "The week starts on", "mon", [["mon", "Monday"], ["sun", "Sunday"]]),
      num("decimals", "Decimal places", 0, 0, 4),
    ],
  },
  {
    kind: "dateTile", label: "Date", group: "Time", description: "Today's date, large", component: DateTileWidget, minWidth: 130, minHeight: 130,
    fields: [
      pick("top", "On top", "weekday", [["weekday", "Weekday"], ["month", "Month"]]),
      on("uppercase", "Capitals", true),
      on("showYear", "Show the year", false),
      on("showWeek", "Show the week number", false),
    ],
  },
  {
    kind: "flipClock", label: "Flip clock", group: "Time", description: "A clock of flipping cards", component: FlipClockWidget, minWidth: 200, minHeight: 100,
    fields: [
      on("seconds", "Show seconds", false),
      on("twentyFour", "24 hour", false),
      on("ampm", "Show AM and PM", true),
      pick("card", "Cards", "glass", [["glass", "Glass"], ["dark", "Dark"]]),
    ],
  },
  {
    kind: "moon", label: "Moon", group: "Fun", description: "The phase of the moon, worked out on the machine", component: MoonWidget, minWidth: 140, minHeight: 160,
    fields: [
      on("south", "Southern hemisphere", false, "The moon is seen the other way up"),
      on("showName", "Name of the phase", true),
      on("showLit", "How much is lit", true),
      on("showNext", "The next full or new moon", true),
    ],
  },
  {
    kind: "quote", label: "Quote", group: "Fun", description: "A thought for the day, built in or your own", component: QuoteWidget, minWidth: 200, minHeight: 110,
    fields: [
      pick("source", "From", "builtin", [["builtin", "Built in"], ["custom", "Mine"], ["both", "Both"]]),
      { key: "custom", label: "My quotes", type: "textarea", default: "", placeholder: "One a line. Add — and a name after it for the author", rows: 4, when: (e) => e.source === "custom" || e.source === "both" },
      pick("change", "Changes", "daily", [["daily", "Daily"], ["hourly", "Hourly"], ["tenMin", "Every 10 min"], ["launch", "At start"]]),
      on("showAuthor", "Show who said it", true),
      on("serif", "Serif type", true),
      num("size", "Text size", 18, 11, 40, "px"),
      pick("align", "Aligned", "center", [["left", "Left"], ["center", "Centre"], ["right", "Right"]]),
    ],
  },
  {
    kind: "randomizer", label: "Dice and coins", group: "Fun", description: "Roll dice, flip a coin, ask the 8 ball", component: RandomizerWidget, minWidth: 160, minHeight: 150,
    fields: [
      pick("mode", "What", "dice", [["dice", "Dice"], ["coin", "Coin"], ["number", "Number"], ["ball", "8 ball"]]),
      pick("sides", "Sides", "6", [["4", "4"], ["6", "6"], ["8", "8"], ["10", "10"], ["12", "12"], ["20", "20"]], undefined, (e) => e.mode === "dice" || e.mode === "number" || e.mode === undefined),
      num("count", "Dice", 2, 1, 6, "", 1, undefined, (e) => e.mode === "dice" || e.mode === undefined),
      on("animate", "Tumble before it settles", true),
      on("history", "Show the last rolls", true),
    ],
  },
  {
    kind: "calculator", label: "Calculator", group: "Fun", description: "A small calculator for the desktop", component: CalculatorWidget, minWidth: 190, minHeight: 250,
    fields: [num("decimals", "Decimal places", 8, 0, 12), on("showLast", "Show the last sum", true)],
  },
  {
    kind: "controls", label: "Volume and brightness", group: "System", description: "The two sliders, on the desktop", component: ControlsWidget, minWidth: 220, minHeight: 100,
    fields: [on("showVolume", "Volume", true), on("showBrightness", "Brightness", true), on("showPercent", "Show the numbers", true)],
  },
  {
    kind: "battery", label: "Battery", group: "System", description: "Charge, as a ring or a bar", component: BatteryWidget, minWidth: 130, minHeight: 130,
    fields: [
      pick("style", "Look", "ring", [["ring", "Ring"], ["bar", "Bar"]]),
      num("lowAt", "Warn below", 20, 5, 50, "%", 5),
      on("showState", "Say what it is doing", true),
    ],
  },
];

/** What every widget has, whatever its kind: the shape of its glass. */
export const SHARED_FIELDS: Field[] = [
  px("radius", "Corner radius", 20, 0, 60, 1, "How round the glass is; the clickable part follows it"),
  on("frameless", "No glass behind it", false, "Just what it shows, floating on the wallpaper"),
  on("shadow", "Soft shadow", false),
];

const BY_KIND = new Map(WIDGETS.map((w) => [w.kind, w]));

export function definitionFor(kind: WidgetKind): WidgetDefinition | undefined {
  return BY_KIND.get(kind);
}
