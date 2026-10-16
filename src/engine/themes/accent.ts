/**
 * One color in, a whole look out.
 *
 * The dock used to be tinted by choosing one of six hand-made themes, each a
 * set of a dozen or so design tokens. A color picker gives a single color
 * instead, so the rest are derived from it here: the same tokens, computed
 * from the pick. Components still read only tokens and never a color, so
 * everything restyles at once, exactly as it did for themes.
 *
 * The glass body is the picked color itself, flat: the same color at the
 * same strength all the way across, in every material. Light, shine and
 * depth come from the materials' own highlights and rims, not from varying
 * the body, so what you pick is what the dock is. Black gives black glass,
 * white gives white glass, and greys give grey glass; a grey never falls
 * back to anything else.
 *
 * The one judgement call is dark versus light, which decides how strong the
 * body is and what color the controls drawn on it are. Where the line falls
 * is `DARK_BELOW`.
 */

export const DEFAULT_ACCENT = "#2f9de3";

/** Below this lightness the glass counts as dark: a denser body, and light
 *  controls and text instead of dark ones. */
const DARK_BELOW = 0.38;

/** Where each of the old named themes starts, for settings saved before the
 *  color picker existed. */
const LEGACY_THEMES: Record<string, string> = {
  aero: "#2f9de3",
  ocean: "#1ba7c9",
  forest: "#5cb84a",
  aurora: "#7c6cf0",
  sunset: "#f2884b",
  night: "#2c3a70",
};

export function accentForTheme(id: string): string {
  return LEGACY_THEMES[id] ?? DEFAULT_ACCENT;
}

type Rgb = [number, number, number];

/** `#rrggbb` (or `#rgb`, with or without the `#`) as lowercase `#rrggbb`, or
 *  null if it is not a color. */
export function normalizeHex(input: string): string | null {
  const text = input.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(text)) {
    return `#${text
      .split("")
      .map((c) => c + c)
      .join("")
      .toLowerCase()}`;
  }
  if (/^[0-9a-f]{6}$/i.test(text)) return `#${text.toLowerCase()}`;
  return null;
}

export function hexToRgb(hex: string): Rgb {
  const v = parseInt((normalizeHex(hex) ?? DEFAULT_ACCENT).slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

export function rgbToHex([r, g, b]: Rgb): string {
  const part = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`;
}

/** Hue in degrees, saturation and lightness 0..1. */
export function rgbToHsl([r, g, b]: Rgb): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return [0, 0, l];
  const s = delta / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === rn) h = ((gn - bn) / delta) % 6;
  else if (max === gn) h = (bn - rn) / delta + 2;
  else h = (rn - gn) / delta + 4;
  return [(h * 60 + 360) % 360, s, l];
}

export function hslToRgb(h: number, s: number, l: number): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const sector = Math.floor(((h % 360) + 360) % 360 / 60);
  const [r, g, b] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][sector];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

/** Hue in degrees, saturation and value 0..1: what a spectrum picker's
 *  square works in. */
export function hexToHsv(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((n) => n / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = (h * 60 + 360) % 360;
  }
  return [h, max === 0 ? 0 : delta / max, max];
}

export function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  const sector = Math.floor(((h % 360) + 360) % 360 / 60);
  const [r, g, b] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][sector];
  return rgbToHex([(r + m) * 255, (g + m) * 255, (b + m) * 255]);
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** A CSS color from hue (degrees), saturation and lightness (0..1) and an
 *  optional alpha. */
const hsl = (h: number, s: number, l: number, a = 1): string =>
  `hsl(${h.toFixed(0)} ${(clamp(s, 0, 1) * 100).toFixed(0)}% ${(clamp(l, 0, 1) * 100).toFixed(0)}%${
    a < 1 ? ` / ${a}` : ""
  })`;

const triple = ([r, g, b]: Rgb) => `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`;

/** Like [`hsl`] but written as `rgba(...)`. The effects layer reads the
 *  bloom color back out of the stylesheet by parsing exactly that form. */
const rgba = (h: number, s: number, l: number, a: number): string =>
  `rgba(${triple(hslToRgb(h, clamp(s, 0, 1), clamp(l, 0, 1)))}, ${a})`;

/** A color moved part of the way toward white, `t` from 0 (unchanged) to 1. */
const toward = ([r, g, b]: Rgb, t: number): Rgb => [
  r + (255 - r) * t,
  g + (255 - g) * t,
  b + (255 - b) * t,
];

/**
 * Every color token the look depends on, derived from one accent color.
 * All of them are returned every time (none is "left alone"), so switching
 * between a dark pick and a light one cannot leave a stale token behind.
 */
export function tokensFromAccent(accentHex: string): Record<string, string> {
  const hex = normalizeHex(accentHex) ?? DEFAULT_ACCENT;
  const pick = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(pick);
  const dark = l < DARK_BELOW;

  // A saturation for a color that is a lightened or darkened relation of
  // the pick. Scaled by the pick's own saturation, so a grey pick gives
  // greys and not the faint red or blue that a fixed saturation at hue 0
  // would add.
  const sat = (k: number) => Math.min(k, s * 1.6);

  // the pick itself, at a strength, as the flat body of the glass
  const body = (alpha: number) => `rgba(${triple(pick)}, ${alpha})`;

  // the Clear material's body is the pick; its inner light is the pick
  // lifted toward white
  const clearTint = triple(pick);
  const clearGlow = triple(toward(pick, 0.55));

  if (dark) {
    return {
      "--aero-accent": hex,
      "--aero-accent-deep": hsl(h, clamp(s, 0, 0.8), clamp(l * 0.7, 0.05, 0.25)),
      "--aero-life": hsl(h, sat(0.8), 0.72),
      "--aero-text-on-glass": `rgb(${triple(toward(pick, 0.92))})`,
      "--aero-control-ink": hsl(h, sat(0.55), 0.2),
      "--aero-glyph": hsl(h, sat(0.6), 0.9),
      "--glass-tint-top": body(0.6),
      "--glass-tint-mid": body(0.6),
      "--glass-tint-bottom": body(0.6),
      "--glass-border": hsl(h, sat(0.9), 0.82, 0.4),
      "--glass-border-dark": hsl(h, sat(0.6), 0.3, 0.35),
      "--bloom-color": rgba(h, sat(0.9), 0.75, 0.85),
      "--bloom-soft": rgba(h, sat(0.9), 0.75, 0.3),
      "--ambient-glow": hsl(h, sat(0.6), 0.5, 0.3),
      "--gloss-strength": "0.2",
      "--clear-tint": clearTint,
      "--clear-glow": clearGlow,
      // a dark body needs more strength than a light one to read as a surface
      "--clear-strength": "1.4",
    };
  }

  return {
    "--aero-accent": hex,
    "--aero-accent-deep": hsl(h, clamp(s, 0, 0.9), clamp(l * 0.45, 0.14, 0.34)),
    "--aero-life": hsl(h, sat(0.8), 0.66),
    "--aero-text-on-glass": "#ffffff",
    "--aero-control-ink": hsl(h, Math.min(s, 0.7), 0.27),
    "--aero-glyph": hsl(h, sat(0.75), 0.93),
    "--glass-tint-top": body(0.5),
    "--glass-tint-mid": body(0.5),
    "--glass-tint-bottom": body(0.5),
    "--glass-border": "rgba(255, 255, 255, 0.65)",
    "--glass-border-dark": hsl(h, sat(0.7), 0.3, 0.35),
    "--bloom-color": rgba(h, sat(1), 0.78, 0.9),
    "--bloom-soft": rgba(h, sat(1), 0.78, 0.35),
    "--ambient-glow": hsl(h, sat(0.8), 0.55, 0.25),
    "--gloss-strength": "0.3",
    "--clear-tint": clearTint,
    "--clear-glow": clearGlow,
    "--clear-strength": "1",
  };
}
