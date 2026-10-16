/**
 * Keeping the Start menu's text readable over whatever is behind it.
 *
 * The panel is glass, and its text is light: over a dark wallpaper it reads at once, over a white page or a light
 * window it washes out. So as it opens Rust looks at the screen where it is about to be (the window still hidden,
 * `start.rs::backdrop_behind`) and says how light it is, region by region; here that becomes a veil of darker tint over
 * the glass, deep where it is light behind and nothing where it is dark, and a soft shadow under the text when any of
 * it is light enough to need one.
 *
 * It is worked out once, as the menu opens, and stays until it opens again: a tint that moved under the text as things
 * moved behind it would be the flicker this is here to prevent. The veil is a picture a few cells across, which the
 * page stretches smoothly over the panel, so one region's tint fades into the next with no edge between them.
 */

export interface Backdrop {
  cols: number;
  rows: number;
  /** How light it is behind each cell, row by row, 0 (black) to 1 (white), as lightness is seen. */
  light: number[];
}

export interface Veil {
  /** A data URL of the tint, `cols` × `rows` pixels, to stretch over the panel. */
  image: string;
  /** How dark the shadow under the text is, 0 (none) to 1. */
  shadow: number;
  /** How much tint there is at most, for tests and for knowing whether there is any. */
  most: number;
}

/** Below this lightness nothing is added: the glass already reads. */
const FROM = 0.42;
/** At this lightness and above, the full tint. */
const TO = 0.92;
/** The most the veil darkens (its opacity, over the glass). */
const DEEPEST = 0.55;
/** The veil's color: the night ground the rest of the glass sits on. */
const INK: [number, number, number] = [6, 10, 20];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** The veil for what is behind the panel; `null` when nothing behind it is light enough to need one. */
export function veilFor(backdrop: Backdrop | null | undefined): Veil | null {
  if (!backdrop || backdrop.cols < 1 || backdrop.rows < 1 || backdrop.light.length !== backdrop.cols * backdrop.rows) return null;
  const alphas = backdrop.light.map((l) => smooth(FROM, TO, l) * DEEPEST);
  const most = Math.max(...alphas);
  if (most < 0.02) return null;
  const canvas = document.createElement("canvas");
  canvas.width = backdrop.cols;
  canvas.height = backdrop.rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const img = ctx.createImageData(backdrop.cols, backdrop.rows);
  alphas.forEach((a, i) => {
    img.data.set([INK[0], INK[1], INK[2], Math.round(a * 255)], i * 4);
  });
  ctx.putImageData(img, 0, 0);
  const lightest = Math.max(...backdrop.light);
  return { image: canvas.toDataURL("image/png"), shadow: smooth(0.6, 0.95, lightest), most };
}
