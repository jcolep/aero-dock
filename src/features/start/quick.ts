/**
 * Quick answers in the Start menu's search: what Windows' search and the launchers answer on the spot, without opening
 * anything. `5 km in miles`, `72 f to c`, `time in tokyo`, `3pm est in pst`, `days until dec 25`, `#ff8800`, `255 in hex`,
 * `15% of 80`, `flip a coin`. (Sums are `calc.ts`.)
 *
 * Every answer is made here, from the text and the clock, with nothing sent anywhere and nothing run: only words and numbers
 * this file knows are understood, and anything else gives no answer at all (it is a search box first). No currency: that
 * needs a rate from the network, which this does not ask for.
 *
 * Pure (no imports), so it is tested alone (`scripts/unit/quick.mjs`).
 */

export interface QuickAnswer {
  key: string;
  /** What kind of answer, for the row's heading. */
  label: string;
  /** The answer, big. */
  answer: string;
  /** The question as understood, and anything worth knowing. */
  detail: string;
  /** What Enter copies. */
  copy: string;
  /** A color to show beside it, for a color. */
  swatch?: string;
}

// ---------------------------------------------------------------------------------------------------------------------
// numbers
// ---------------------------------------------------------------------------------------------------------------------

const NUM = String.raw`[-+]?(?:\d[\d,]*\.?\d*|\.\d+)`;
const toNumber = (s: string): number => Number(s.replace(/,/g, ""));

/** A number as it is read: separated thousands, up to eight decimals, no trailing noise. */
export function fmt(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  const abs = Math.abs(n);
  if (abs !== 0 && (abs >= 1e15 || abs < 1e-7)) return n.toExponential(6).replace(/\.?0+e/, "e");
  return Number(n.toPrecision(10)).toLocaleString("en-US", { maximumFractionDigits: 8 });
}

// ---------------------------------------------------------------------------------------------------------------------
// units
// ---------------------------------------------------------------------------------------------------------------------

interface UnitDef {
  category: string;
  /** How many of the category's base unit one of these is. */
  factor: number;
  /** What it is called in an answer. */
  name: string;
}

const UNITS = new Map<string, UnitDef>();
function define(category: string, name: string, factor: number, aliases: string[]) {
  for (const a of aliases) UNITS.set(a, { category, factor, name });
}
// length (base: metre)
define("length", "mm", 0.001, ["mm", "millimeter", "millimetre"]);
define("length", "cm", 0.01, ["cm", "centimeter", "centimetre"]);
define("length", "m", 1, ["m", "meter", "metre"]);
define("length", "km", 1000, ["km", "kilometer", "kilometre"]);
define("length", "in", 0.0254, ["in", "inch", "inches", '"']);
define("length", "ft", 0.3048, ["ft", "foot", "feet", "'"]);
define("length", "yd", 0.9144, ["yd", "yard"]);
define("length", "mi", 1609.344, ["mi", "mile"]);
define("length", "nmi", 1852, ["nmi", "nautical mile"]);
// mass (base: kilogram)
define("mass", "mg", 1e-6, ["mg", "milligram"]);
define("mass", "g", 0.001, ["g", "gram", "gramme"]);
define("mass", "kg", 1, ["kg", "kilogram", "kilo", "kilogramme"]);
define("mass", "t", 1000, ["t", "tonne", "metric ton"]);
define("mass", "oz", 0.028349523125, ["oz", "ounce"]);
define("mass", "lb", 0.45359237, ["lb", "lbs", "pound"]);
define("mass", "st", 6.35029318, ["st", "stone"]);
// volume (base: litre; the US measures)
define("volume", "ml", 0.001, ["ml", "milliliter", "millilitre"]);
define("volume", "cl", 0.01, ["cl", "centiliter", "centilitre"]);
define("volume", "l", 1, ["l", "liter", "litre"]);
define("volume", "tsp", 0.00492892159375, ["tsp", "teaspoon"]);
define("volume", "tbsp", 0.01478676478125, ["tbsp", "tablespoon"]);
define("volume", "fl oz", 0.0295735295625, ["floz", "fl oz", "fluid ounce"]);
define("volume", "cup", 0.2365882365, ["cup"]);
define("volume", "pt", 0.473176473, ["pt", "pint"]);
define("volume", "qt", 0.946352946, ["qt", "quart"]);
define("volume", "gal", 3.785411784, ["gal", "gallon"]);
// speed (base: metre per second)
define("speed", "m/s", 1, ["m/s", "mps"]);
define("speed", "km/h", 1 / 3.6, ["km/h", "kmh", "kph", "kmph"]);
define("speed", "mph", 0.44704, ["mph", "mi/h"]);
define("speed", "kn", 1852 / 3600, ["kn", "kt", "knot"]);
define("speed", "ft/s", 0.3048, ["ft/s", "fps"]);
// area (base: square metre)
define("area", "m²", 1, ["m2", "m²", "sqm", "square meter", "square metre"]);
define("area", "cm²", 1e-4, ["cm2", "cm²", "square centimeter", "square centimetre"]);
define("area", "km²", 1e6, ["km2", "km²", "square kilometer", "square kilometre"]);
define("area", "ha", 1e4, ["ha", "hectare"]);
define("area", "acre", 4046.8564224, ["acre"]);
define("area", "ft²", 0.09290304, ["ft2", "ft²", "sqft", "square foot", "square feet"]);
define("area", "in²", 6.4516e-4, ["in2", "in²", "sqin", "square inch", "square inches"]);
define("area", "yd²", 0.83612736, ["yd2", "yd²", "square yard"]);
define("area", "mi²", 2589988.110336, ["mi2", "mi²", "sqmi", "square mile"]);
// data (base: byte). kB, MB, GB, TB are thousands; KiB, MiB, GiB, TiB are 1024s
define("data", "bit", 0.125, ["bit"]);
define("data", "B", 1, ["b", "byte"]);
define("data", "KB", 1e3, ["kb", "kilobyte"]);
define("data", "MB", 1e6, ["mb", "megabyte"]);
define("data", "GB", 1e9, ["gb", "gigabyte"]);
define("data", "TB", 1e12, ["tb", "terabyte"]);
define("data", "PB", 1e15, ["pb", "petabyte"]);
define("data", "KiB", 1024, ["kib", "kibibyte"]);
define("data", "MiB", 1024 ** 2, ["mib", "mebibyte"]);
define("data", "GiB", 1024 ** 3, ["gib", "gibibyte"]);
define("data", "TiB", 1024 ** 4, ["tib", "tebibyte"]);
// time (base: second)
define("time", "ms", 0.001, ["ms", "millisecond"]);
define("time", "s", 1, ["s", "sec", "second"]);
define("time", "min", 60, ["min", "minute"]);
define("time", "h", 3600, ["h", "hr", "hour"]);
define("time", "days", 86400, ["d", "day"]);
define("time", "weeks", 604800, ["wk", "week"]);
define("time", "months", 2629800, ["month"]);
define("time", "years", 31557600, ["yr", "year"]);
// temperature is not a ratio: its own
const TEMPS = new Map<string, "c" | "f" | "k">([
  ["c", "c"], ["celsius", "c"], ["centigrade", "c"],
  ["f", "f"], ["fahrenheit", "f"],
  ["k", "k"], ["kelvin", "k"],
]);
const TEMP_NAME = { c: "°C", f: "°F", k: "K" } as const;

/** A unit as typed: lowercase, no degree sign, singular. */
function unitOf(text: string): UnitDef | null {
  const t = text.toLowerCase().replace(/°/g, "").replace(/\.$/, "").replace(/\s+/g, " ").trim();
  return UNITS.get(t) ?? UNITS.get(t.replace(/(es|s)$/, "")) ?? UNITS.get(t.replace(/s$/, "")) ?? null;
}
function tempOf(text: string): "c" | "f" | "k" | null {
  const t = text.toLowerCase().replace(/°/g, "").replace(/\s+/g, " ").trim();
  return TEMPS.get(t) ?? TEMPS.get(t.replace(/s$/, "")) ?? null;
}
const toCelsius = (v: number, u: "c" | "f" | "k") => (u === "c" ? v : u === "f" ? ((v - 32) * 5) / 9 : v - 273.15);
const fromCelsius = (c: number, u: "c" | "f" | "k") => (u === "c" ? c : u === "f" ? (c * 9) / 5 + 32 : c + 273.15);

const CONVERT = new RegExp(String.raw`^(${NUM})\s*([^\d\s].*?)\s+(?:to|in|into|as|=)\s+(.+)$`, "i");

function convertUnits(q: string): QuickAnswer[] {
  const m = CONVERT.exec(q);
  if (!m) return [];
  const value = toNumber(m[1]);
  if (!Number.isFinite(value)) return [];
  const [fromText, toText] = [m[2], m[3]];
  const ta = tempOf(fromText);
  const tb = tempOf(toText);
  if (ta && tb) {
    const out = fromCelsius(toCelsius(value, ta), tb);
    const answer = `${fmt(out)} ${TEMP_NAME[tb]}`;
    return [{ key: `quick:unit:${q}`, label: "Conversion", answer, detail: `${fmt(value)} ${TEMP_NAME[ta]} =  ·  Enter copies the answer`, copy: fmt(out) }];
  }
  const a = unitOf(fromText);
  const b = unitOf(toText);
  if (!a || !b || a.category !== b.category) return [];
  const out = (value * a.factor) / b.factor;
  const note = a.category === "data" && /^[KMGTP]B$/.test(b.name + "") ? "  ·  decimal (1,000s); GiB, MiB are 1,024s" : "";
  return [
    {
      key: `quick:unit:${q}`,
      label: "Conversion",
      answer: `${fmt(out)} ${b.name}`,
      detail: `${fmt(value)} ${a.name} =${note}  ·  Enter copies the answer`,
      copy: fmt(out),
    },
  ];
}

// ---------------------------------------------------------------------------------------------------------------------
// time
// ---------------------------------------------------------------------------------------------------------------------

/** Places and zone names, as people say them, to the time zone they mean. */
const ZONES: Record<string, string> = {
  utc: "UTC", gmt: "UTC", z: "UTC", zulu: "UTC",
  est: "America/New_York", edt: "America/New_York", et: "America/New_York", eastern: "America/New_York",
  cst: "America/Chicago", cdt: "America/Chicago", ct: "America/Chicago", central: "America/Chicago",
  mst: "America/Denver", mdt: "America/Denver", mt: "America/Denver", mountain: "America/Denver",
  pst: "America/Los_Angeles", pdt: "America/Los_Angeles", pt: "America/Los_Angeles", pacific: "America/Los_Angeles",
  akst: "America/Anchorage", hst: "Pacific/Honolulu",
  bst: "Europe/London", cet: "Europe/Paris", cest: "Europe/Paris", eet: "Europe/Athens", eest: "Europe/Athens", msk: "Europe/Moscow",
  ist: "Asia/Kolkata", jst: "Asia/Tokyo", kst: "Asia/Seoul", hkt: "Asia/Hong_Kong", sgt: "Asia/Singapore", pht: "Asia/Manila",
  aest: "Australia/Sydney", aedt: "Australia/Sydney", acst: "Australia/Adelaide", awst: "Australia/Perth", nzst: "Pacific/Auckland", nzdt: "Pacific/Auckland",
  "new york": "America/New_York", nyc: "America/New_York", boston: "America/New_York", miami: "America/New_York", atlanta: "America/New_York",
  washington: "America/New_York", philadelphia: "America/New_York", toronto: "America/Toronto", montreal: "America/Toronto",
  chicago: "America/Chicago", dallas: "America/Chicago", houston: "America/Chicago", austin: "America/Chicago", "mexico city": "America/Mexico_City",
  denver: "America/Denver", phoenix: "America/Phoenix", "salt lake city": "America/Denver",
  "los angeles": "America/Los_Angeles", la: "America/Los_Angeles", "san francisco": "America/Los_Angeles", sf: "America/Los_Angeles",
  "san diego": "America/Los_Angeles", seattle: "America/Los_Angeles", portland: "America/Los_Angeles", "las vegas": "America/Los_Angeles",
  vancouver: "America/Vancouver", anchorage: "America/Anchorage", honolulu: "Pacific/Honolulu", hawaii: "Pacific/Honolulu",
  bogota: "America/Bogota", lima: "America/Lima", santiago: "America/Santiago", "buenos aires": "America/Argentina/Buenos_Aires",
  "sao paulo": "America/Sao_Paulo", "são paulo": "America/Sao_Paulo", "rio de janeiro": "America/Sao_Paulo", rio: "America/Sao_Paulo",
  london: "Europe/London", uk: "Europe/London", dublin: "Europe/Dublin", lisbon: "Europe/Lisbon", paris: "Europe/Paris", madrid: "Europe/Madrid",
  barcelona: "Europe/Madrid", berlin: "Europe/Berlin", munich: "Europe/Berlin", rome: "Europe/Rome", milan: "Europe/Rome", amsterdam: "Europe/Amsterdam",
  brussels: "Europe/Brussels", zurich: "Europe/Zurich", geneva: "Europe/Zurich", vienna: "Europe/Vienna", prague: "Europe/Prague",
  warsaw: "Europe/Warsaw", budapest: "Europe/Budapest", stockholm: "Europe/Stockholm", oslo: "Europe/Oslo", copenhagen: "Europe/Copenhagen",
  helsinki: "Europe/Helsinki", athens: "Europe/Athens", istanbul: "Europe/Istanbul", moscow: "Europe/Moscow", kyiv: "Europe/Kyiv", kiev: "Europe/Kyiv",
  cairo: "Africa/Cairo", johannesburg: "Africa/Johannesburg", "cape town": "Africa/Johannesburg", lagos: "Africa/Lagos", nairobi: "Africa/Nairobi",
  casablanca: "Africa/Casablanca", dubai: "Asia/Dubai", "abu dhabi": "Asia/Dubai", riyadh: "Asia/Riyadh", "tel aviv": "Asia/Jerusalem", jerusalem: "Asia/Jerusalem",
  tehran: "Asia/Tehran", karachi: "Asia/Karachi", mumbai: "Asia/Kolkata", delhi: "Asia/Kolkata", "new delhi": "Asia/Kolkata", kolkata: "Asia/Kolkata",
  bangalore: "Asia/Kolkata", dhaka: "Asia/Dhaka", bangkok: "Asia/Bangkok", hanoi: "Asia/Ho_Chi_Minh", jakarta: "Asia/Jakarta", singapore: "Asia/Singapore",
  "kuala lumpur": "Asia/Kuala_Lumpur", "hong kong": "Asia/Hong_Kong", shanghai: "Asia/Shanghai", beijing: "Asia/Shanghai", taipei: "Asia/Taipei",
  manila: "Asia/Manila", seoul: "Asia/Seoul", tokyo: "Asia/Tokyo", osaka: "Asia/Tokyo", sydney: "Australia/Sydney", melbourne: "Australia/Melbourne",
  brisbane: "Australia/Brisbane", perth: "Australia/Perth", adelaide: "Australia/Adelaide", auckland: "Pacific/Auckland", wellington: "Pacific/Auckland",
};

/** A zone's name as it is said back. */
function zoneTitle(key: string): string {
  const short = key.length <= 4 && !key.includes(" ");
  return short ? key.toUpperCase() : key.replace(/\b\w/g, (c) => c.toUpperCase());
}

function zoneOf(text: string): { tz: string; title: string } | null {
  const key = text.toLowerCase().replace(/[?.!]+$/g, "").replace(/^(?:the )?(?:time )?(?:in|at|for) /, "").replace(/\s+/g, " ").trim();
  const tz = ZONES[key];
  return tz ? { tz, title: zoneTitle(key) } : null;
}

/** How many minutes `tz` is ahead of UTC at `date`. */
function offsetMinutes(tz: string, date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric",
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
}

/** The moment that is `h:mi` on the given day in `tz`. */
function instantIn(tz: string, y: number, m: number, d: number, h: number, mi: number): Date {
  const wall = Date.UTC(y, m - 1, d, h, mi);
  let t = wall - offsetMinutes(tz, new Date(wall)) * 60000;
  t = wall - offsetMinutes(tz, new Date(t)) * 60000;
  return new Date(t);
}

/** Today's date as the clocks in `tz` show it. */
function dayIn(tz: string, now: Date): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return { y: get("year"), m: get("month"), d: get("day") };
}

const clock = (date: Date, tz: string, locale: string) => new Intl.DateTimeFormat(locale, { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(date);
const dayName = (date: Date, tz: string, locale: string) => new Intl.DateTimeFormat(locale, { timeZone: tz, weekday: "long", day: "numeric", month: "long" }).format(date);

function gmtLabel(minutes: number): string {
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  return `UTC${sign}${Math.floor(abs / 60)}${abs % 60 ? `:${String(abs % 60).padStart(2, "0")}` : ""}`;
}

function relativeTo(minutes: number): string {
  if (minutes === 0) return "the same time as here";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const rest = abs % 60;
  const span = `${h ? `${h} h` : ""}${h && rest ? " " : ""}${rest ? `${rest} min` : ""}`;
  return `${span} ${minutes > 0 ? "ahead of" : "behind"} you`;
}

const localZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

function timeIn(q: string, now: Date, locale: string, here: string): QuickAnswer[] {
  const m = /^(?:what(?:'s| is)(?: the)? |what )?time(?: is it)?(?:\s+(?:in|at|for))?\s*(.*?)\??$/i.exec(q) ?? /^(.+?)\s+time\??$/i.exec(q);
  if (!m) return [];
  const where = m[1].trim();
  if (!where) {
    return [{ key: `quick:time:${q}`, label: "Time", answer: clock(now, here, locale), detail: `${dayName(now, here, locale)}  ·  Enter copies the time`, copy: clock(now, here, locale) }];
  }
  const zone = zoneOf(where);
  if (!zone) return [];
  const there = offsetMinutes(zone.tz, now);
  const answer = clock(now, zone.tz, locale);
  return [
    {
      key: `quick:time:${q}`,
      label: "Time",
      answer,
      detail: `${zone.title}  ·  ${dayName(now, zone.tz, locale)}  ·  ${gmtLabel(there)}, ${relativeTo(there - offsetMinutes(here, now))}`,
      copy: answer,
    },
  ];
}

function convertClock(q: string, now: Date, locale: string, here: string): QuickAnswer[] {
  const full = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s+(.+?)\s+(?:to|in|into)\s+(.+)$/i.exec(q);
  const short = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s+(?:to|in|into)\s+(.+)$/i.exec(q) ?? /^(\d{1,2}):(\d{2})()\s+(?:to|in|into)\s+(.+)$/i.exec(q);
  let hour: number, minute: number, meridiem: string | undefined, from: { tz: string; title: string } | null, to: { tz: string; title: string } | null;
  if (full && (full[3] || full[2])) {
    [hour, minute, meridiem] = [Number(full[1]), Number(full[2] ?? 0), full[3]];
    from = zoneOf(full[4]);
    to = zoneOf(full[5]);
    if (!from || !to) return [];
  } else if (short) {
    [hour, minute, meridiem] = [Number(short[1]), Number(short[2] ?? 0), short[3] || undefined];
    from = { tz: here, title: "here" };
    to = zoneOf(short[4]);
    if (!to) return [];
  } else return [];
  if (meridiem) {
    if (hour < 1 || hour > 12) return [];
    hour = (hour % 12) + (meridiem.toLowerCase() === "pm" ? 12 : 0);
  }
  if (hour > 23 || minute > 59) return [];
  const day = dayIn(from.tz, now);
  const at = instantIn(from.tz, day.y, day.m, day.d, hour, minute);
  const there = clock(at, to.tz, locale);
  const sameDay = new Intl.DateTimeFormat("en-CA", { timeZone: to.tz }).format(at) === new Intl.DateTimeFormat("en-CA", { timeZone: from.tz }).format(at);
  const dayNote = sameDay ? "" : new Intl.DateTimeFormat("en-CA", { timeZone: to.tz }).format(at) > new Intl.DateTimeFormat("en-CA", { timeZone: from.tz }).format(at) ? " (next day)" : " (previous day)";
  return [
    {
      key: `quick:time:${q}`,
      label: "Time",
      answer: `${there}${dayNote}`,
      detail: `${clock(at, from.tz, locale)} ${from.title} is ${there} in ${to.title}  ·  Enter copies the time`,
      copy: there,
    },
  ];
}

// ---------------------------------------------------------------------------------------------------------------------
// dates
// ---------------------------------------------------------------------------------------------------------------------

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const monthIndex = (word: string): number => {
  const w = word.toLowerCase().replace(/\.$/, "");
  if (w.length < 3) return -1;
  return MONTHS.findIndex((m) => m === w || (w.length >= 3 && m.startsWith(w) && (w.length >= 3)));
};
const FIXED: Record<string, [number, number]> = {
  christmas: [11, 25], "christmas day": [11, 25], "christmas eve": [11, 24], halloween: [9, 31], valentines: [1, 14], "valentine's day": [1, 14],
  "valentines day": [1, 14], "new year": [0, 1], "new years": [0, 1], "new year's": [0, 1], "new years day": [0, 1], "new year's day": [0, 1],
  "new years eve": [11, 31], "new year's eve": [11, 31], "independence day": [6, 4], "april fools": [3, 1],
};

/** Midnight UTC of a calendar day, which is how days are counted (a clock change is not a day lost). */
const dayNumber = (y: number, m: number, d: number) => Date.UTC(y, m, d) / 86_400_000;

/** A day from words: today, a weekday, a holiday, `dec 25`, `25 december 2026`, `2026-12-25`, `12/25/2026`. */
export function parseDay(text: string, now: Date): { y: number; m: number; d: number } | null {
  const t = text.toLowerCase().replace(/[?,]/g, " ").replace(/\s+/g, " ").trim();
  const today = { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
  const shift = (days: number) => {
    const x = new Date(today.y, today.m, today.d + days);
    return { y: x.getFullYear(), m: x.getMonth(), d: x.getDate() };
  };
  if (t === "today" || t === "now") return today;
  if (t === "tomorrow") return shift(1);
  if (t === "yesterday") return shift(-1);
  const wd = WEEKDAYS.indexOf(t.replace(/^(?:next|this) /, ""));
  if (wd >= 0) {
    const ahead = ((wd - now.getDay() + 7) % 7) || 7;
    return shift(ahead);
  }
  const next = (month: number, day: number, year?: number) => {
    if (year !== undefined) return { y: year, m: month, d: day };
    const thisYear = { y: today.y, m: month, d: day };
    return dayNumber(thisYear.y, thisYear.m, thisYear.d) >= dayNumber(today.y, today.m, today.d) ? thisYear : { y: today.y + 1, m: month, d: day };
  };
  if (FIXED[t]) return next(FIXED[t][0], FIXED[t][1]);
  let m: RegExpExecArray | null;
  if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(t))) return valid(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if ((m = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/.exec(t))) {
    const year = m[3] ? (m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3])) : undefined;
    const day = valid(year ?? 2000, Number(m[1]) - 1, Number(m[2]));
    return day ? next(day.m, day.d, year) : null;
  }
  if ((m = /^([a-z]+)\.? (\d{1,2})(?:st|nd|rd|th)?(?: (\d{4}))?$/.exec(t)) && monthIndex(m[1]) >= 0) {
    const day = valid(m[3] ? Number(m[3]) : 2000, monthIndex(m[1]), Number(m[2]));
    return day ? next(day.m, day.d, m[3] ? Number(m[3]) : undefined) : null;
  }
  if ((m = /^(\d{1,2})(?:st|nd|rd|th)? ([a-z]+)\.?(?: (\d{4}))?$/.exec(t)) && monthIndex(m[2]) >= 0) {
    const day = valid(m[3] ? Number(m[3]) : 2000, monthIndex(m[2]), Number(m[1]));
    return day ? next(day.m, day.d, m[3] ? Number(m[3]) : undefined) : null;
  }
  return null;
}

function valid(y: number, m: number, d: number): { y: number; m: number; d: number } | null {
  const x = new Date(Date.UTC(y, m, d));
  return x.getUTCFullYear() === y && x.getUTCMonth() === m && x.getUTCDate() === d ? { y, m, d } : null;
}

const longDay = (day: { y: number; m: number; d: number }, locale: string) =>
  new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(day.y, day.m, day.d)));

const plural = (n: number, word: string) => `${fmt(n)} ${word}${Math.abs(n) === 1 ? "" : "s"}`;

function dateAnswers(q: string, now: Date, locale: string): QuickAnswer[] {
  const today = { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
  const todayNo = dayNumber(today.y, today.m, today.d);
  let m: RegExpExecArray | null;
  if (/^(?:what(?:'s| is)(?: the| today's)? )?(?:date|today|today's date)(?: today)?\??$/i.test(q)) {
    const start = dayNumber(today.y, 0, 1);
    const dayOfYear = todayNo - start + 1;
    // ISO week number
    const thursday = new Date(Date.UTC(today.y, today.m, today.d + 3 - ((new Date(today.y, today.m, today.d).getDay() + 6) % 7)));
    const week = Math.ceil(((thursday.getTime() - Date.UTC(thursday.getUTCFullYear(), 0, 1)) / 86_400_000 + 1) / 7);
    return [{ key: `quick:date:${q}`, label: "Date", answer: longDay(today, locale), detail: `Week ${week}  ·  day ${dayOfYear} of the year  ·  Enter copies the date`, copy: longDay(today, locale) }];
  }
  if ((m = /^(?:how many )?days?\s+(until|till|to|since)\s+(.+?)\??$/i.exec(q)) || (m = /^(countdown) to (.+?)$/i.exec(q))) {
    const day = parseDay(m[2], now);
    if (!day) return [];
    const diff = dayNumber(day.y, day.m, day.d) - todayNo;
    const since = /since/i.test(m[1]);
    const n = since ? -diff : diff;
    const answer = since ? (n >= 0 ? `${plural(n, "day")} ago` : `in ${plural(-n, "day")}`) : n >= 0 ? plural(n, "day") : `${plural(-n, "day")} ago`;
    const weeks = Math.abs(n) >= 14 ? `  ·  about ${fmt(Math.round(Math.abs(n) / 7))} weeks` : "";
    return [{ key: `quick:date:${q}`, label: "Days", answer, detail: `${longDay(day, locale)}${weeks}  ·  Enter copies the answer`, copy: String(Math.abs(n)) }];
  }
  if ((m = /^(?:what day (?:is|was)|day of|what's the day of|weekday of)\s+(.+?)\??$/i.exec(q))) {
    const day = parseDay(m[1], now);
    if (!day) return [];
    const long = longDay(day, locale);
    return [{ key: `quick:date:${q}`, label: "Date", answer: long.split(",")[0], detail: `${long}  ·  Enter copies the date`, copy: long }];
  }
  if ((m = /^(?:in\s+)?(\d+)\s+(day|week|month|year)s?(?:\s+(from now|ago))?$/i.exec(q)) && (/^in /i.test(q) || m[3])) {
    const n = Number(m[1]) * (/ago/i.test(m[3] ?? "") ? -1 : 1);
    const unit = m[2].toLowerCase();
    const x = new Date(today.y, today.m, today.d);
    if (unit === "day") x.setDate(x.getDate() + n);
    else if (unit === "week") x.setDate(x.getDate() + n * 7);
    else if (unit === "month") x.setMonth(x.getMonth() + n);
    else x.setFullYear(x.getFullYear() + n);
    const day = { y: x.getFullYear(), m: x.getMonth(), d: x.getDate() };
    const long = longDay(day, locale);
    return [{ key: `quick:date:${q}`, label: "Date", answer: long, detail: `${plural(Math.abs(n), unit)} ${n < 0 ? "ago" : "from now"}  ·  Enter copies the date`, copy: long }];
  }
  return [];
}

// ---------------------------------------------------------------------------------------------------------------------
// colors
// ---------------------------------------------------------------------------------------------------------------------

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, "0").toUpperCase();

function hslOf(r: number, g: number, b: number): [number, number, number] {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, Math.round(l * 100)];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === rr ? ((gg - bb) / d + (gg < bb ? 6 : 0)) : max === gg ? (bb - rr) / d + 2 : (rr - gg) / d + 4;
  return [Math.round(h * 60) % 360, Math.round(s * 100), Math.round(l * 100)];
}

function rgbOfHsl(h: number, s: number, l: number): [number, number, number] {
  const [ss, ll] = [s / 100, l / 100];
  const k = (n: number) => (n + h / 30) % 12;
  const a = ss * Math.min(ll, 1 - ll);
  const f = (n: number) => ll - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

function colorAnswers(q: string): QuickAnswer[] {
  let rgb: [number, number, number] | null = null;
  let m: RegExpExecArray | null;
  if ((m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(q))) {
    const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
    rgb = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  } else if ((m = /^rgb\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)$/i.exec(q))) {
    rgb = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (rgb.some((v) => v > 255)) return [];
  } else if ((m = /^hsl\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?\s*\)$/i.exec(q))) {
    const [h, s, l] = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (h > 360 || s > 100 || l > 100) return [];
    rgb = rgbOfHsl(h, s, l);
  }
  if (!rgb) return [];
  const [r, g, b] = rgb.map((v) => Math.round(v));
  const hex = `#${hex2(r)}${hex2(g)}${hex2(b)}`;
  const [h, s, l] = hslOf(r, g, b);
  return [{ key: `quick:color:${q}`, label: "Color", answer: hex, detail: `rgb(${r}, ${g}, ${b})  ·  hsl(${h}, ${s}%, ${l}%)  ·  Enter copies ${hex}`, copy: hex, swatch: hex }];
}

// ---------------------------------------------------------------------------------------------------------------------
// number bases
// ---------------------------------------------------------------------------------------------------------------------

function baseAnswers(q: string): QuickAnswer[] {
  const forms = (n: number) => `${n}  ·  hex 0x${n.toString(16).toUpperCase()}  ·  binary 0b${n.toString(2)}  ·  octal 0o${n.toString(8)}`;
  let m: RegExpExecArray | null;
  if ((m = /^0x([0-9a-f]{1,13})$/i.exec(q))) {
    const n = parseInt(m[1], 16);
    return [{ key: `quick:base:${q}`, label: "Number", answer: fmt(n), detail: `${forms(n)}  ·  Enter copies ${n}`, copy: String(n) }];
  }
  if ((m = /^0b([01]{1,52})$/i.exec(q))) {
    const n = parseInt(m[1], 2);
    return [{ key: `quick:base:${q}`, label: "Number", answer: fmt(n), detail: `${forms(n)}  ·  Enter copies ${n}`, copy: String(n) }];
  }
  if ((m = /^0o([0-7]{1,17})$/i.exec(q))) {
    const n = parseInt(m[1], 8);
    return [{ key: `quick:base:${q}`, label: "Number", answer: fmt(n), detail: `${forms(n)}  ·  Enter copies ${n}`, copy: String(n) }];
  }
  if ((m = /^(\d{1,15})\s+(?:to|in|into|as)\s+(hex|hexadecimal|bin|binary|oct|octal)$/i.exec(q))) {
    const n = Number(m[1]);
    const kind = m[2].toLowerCase().slice(0, 3);
    const text = kind === "hex" ? `0x${n.toString(16).toUpperCase()}` : kind === "bin" ? `0b${n.toString(2)}` : `0o${n.toString(8)}`;
    return [{ key: `quick:base:${q}`, label: "Number", answer: text, detail: `${forms(n)}  ·  Enter copies ${text}`, copy: text }];
  }
  return [];
}

// ---------------------------------------------------------------------------------------------------------------------
// percentages
// ---------------------------------------------------------------------------------------------------------------------

function percentAnswers(q: string): QuickAnswer[] {
  let m: RegExpExecArray | null;
  if ((m = new RegExp(String.raw`^(?:what(?:'s| is) )?(${NUM})\s*(?:%|percent)\s+of\s+(${NUM})$`, "i").exec(q))) {
    const out = (toNumber(m[1]) / 100) * toNumber(m[2]);
    return [{ key: `quick:pct:${q}`, label: "Percent", answer: fmt(out), detail: `${m[1]}% of ${m[2]}  ·  Enter copies the answer`, copy: fmt(out) }];
  }
  if ((m = new RegExp(String.raw`^(${NUM})\s*(?:%|percent)\s+off\s+(${NUM})$`, "i").exec(q))) {
    const price = toNumber(m[2]);
    const off = (toNumber(m[1]) / 100) * price;
    return [{ key: `quick:pct:${q}`, label: "Percent", answer: fmt(price - off), detail: `${m[2]} less ${m[1]}%  ·  saves ${fmt(off)}  ·  Enter copies the answer`, copy: fmt(price - off) }];
  }
  if ((m = new RegExp(String.raw`^tip\s+(${NUM})\s*%?\s+(?:on|of)\s+(${NUM})$`, "i").exec(q))) {
    const bill = toNumber(m[2]);
    const tip = (toNumber(m[1]) / 100) * bill;
    return [{ key: `quick:pct:${q}`, label: "Tip", answer: fmt(Math.round(tip * 100) / 100), detail: `${m[1]}% of ${m[2]}  ·  total ${fmt(Math.round((bill + tip) * 100) / 100)}  ·  Enter copies the tip`, copy: fmt(Math.round(tip * 100) / 100) }];
  }
  if ((m = new RegExp(String.raw`^(${NUM})\s+is\s+what\s+(?:%|percent)\s+of\s+(${NUM})$`, "i").exec(q))) {
    const b = toNumber(m[2]);
    if (b === 0) return [];
    const out = (toNumber(m[1]) / b) * 100;
    return [{ key: `quick:pct:${q}`, label: "Percent", answer: `${fmt(out)}%`, detail: `${m[1]} of ${m[2]}  ·  Enter copies the answer`, copy: `${fmt(out)}%` }];
  }
  return [];
}

// ---------------------------------------------------------------------------------------------------------------------
// chance
// ---------------------------------------------------------------------------------------------------------------------

function randomAnswers(q: string, rng: () => number): QuickAnswer[] {
  let m: RegExpExecArray | null;
  const row = (answer: string, detail: string): QuickAnswer[] => [{ key: `quick:random:${q}`, label: "Random", answer, detail: `${detail}  ·  Type it again for another  ·  Enter copies`, copy: answer }];
  if (/^(?:flip|toss)(?: a)? coin$/i.test(q)) return row(rng() < 0.5 ? "Heads" : "Tails", "A coin");
  if (/^roll(?: a)? (?:die|dice)$/i.test(q)) return row(String(1 + Math.floor(rng() * 6)), "A six-sided die");
  // ("d20" alone could be the name of a program: only when asked to roll it)
  if ((m = /^roll(?: a)? d(\d{1,4})$/i.exec(q))) {
    const sides = Number(m[1]);
    return sides >= 2 ? row(String(1 + Math.floor(rng() * sides)), `A ${sides}-sided die`) : [];
  }
  if ((m = /^random(?: number)?(?: between| from)?\s+(\d{1,9})\s*(?:-|to|and|,)\s*(\d{1,9})$/i.exec(q))) {
    const [a, b] = [Number(m[1]), Number(m[2])].sort((x, y) => x - y);
    return row(String(a + Math.floor(rng() * (b - a + 1))), `A number from ${a} to ${b}`);
  }
  return [];
}

// ---------------------------------------------------------------------------------------------------------------------

/** What `input` is asking, answered; nothing if it is not a question this knows. */
export function quickAnswers(input: string, now: Date = new Date(), options: { locale?: string; zone?: string; random?: () => number } = {}): QuickAnswer[] {
  const q = input.trim().replace(/\s+/g, " ");
  if (q.length < 2 || q.length > 80) return [];
  const locale = options.locale ?? "en-US";
  const here = options.zone ?? localZone();
  const random = options.random ?? Math.random;
  const tries: (() => QuickAnswer[])[] = [
    () => convertUnits(q),
    () => timeIn(q, now, locale, here),
    () => convertClock(q, now, locale, here),
    () => dateAnswers(q, now, locale),
    () => colorAnswers(q),
    () => baseAnswers(q),
    () => percentAnswers(q),
    () => randomAnswers(q, random),
  ];
  for (const attempt of tries) {
    try {
      const found = attempt();
      if (found.length) return found;
    } catch {
      // a question this cannot make sense of is no answer, never an error in the search box
    }
  }
  return [];
}
