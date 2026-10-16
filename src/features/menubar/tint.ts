/**
 * The colors of a cover: what the Now Playing card is tinted with.
 *
 * A cover is shrunk to a few hundred pixels and each one voted into one of
 * twelve hues, with a stronger vote for color that is vivid and not too dark,
 * so a mostly-black sleeve with one red shape comes out red and not grey. The
 * card gets the two strongest hues (deepened, so white text reads on them) and
 * a lighter version of the first for the things that should stand out on it.
 */

export interface Tint {
  /** The deep color the card fades from. */
  a: string;
  /** The deep color it fades to. */
  b: string;
  /** A lighter color of the same hue, for fills and glows. */
  accent: string;
}

type Hsv = [number, number, number];

function toHsv(r: number, g: number, b: number): Hsv {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d > 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : d / max, max / 255];
}

function css([h, s, v]: Hsv): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  const byte = (n: number) => Math.round((n + m) * 255);
  return `rgb(${byte(r)} ${byte(g)} ${byte(b)})`;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** `pixels` is RGBA, as a canvas gives it. Null if there is nothing to read. */
export function pickTint(pixels: Uint8ClampedArray): Tint | null {
  const buckets = Array.from({ length: 12 }, () => ({ weight: 0, r: 0, g: 0, b: 0 }));
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i + 3 < pixels.length; i += 4) {
    if (pixels[i + 3] < 128) continue;
    const pr = pixels[i];
    const pg = pixels[i + 1];
    const pb = pixels[i + 2];
    r += pr;
    g += pg;
    b += pb;
    n++;
    const [h, s, v] = toHsv(pr, pg, pb);
    // a vote for vivid color, and almost none for greys, near-black or near-white
    let weight = s * s * (0.35 + v);
    if (v < 0.16 || s < 0.14) weight *= 0.05;
    const bucket = buckets[Math.floor(h / 30) % 12];
    bucket.weight += weight;
    bucket.r += pr * weight;
    bucket.g += pg * weight;
    bucket.b += pb * weight;
  }
  if (n === 0) return null;

  const ranked = buckets
    .map((bk, hue) => ({ ...bk, hue }))
    .filter((bk) => bk.weight > 0)
    .sort((x, y) => y.weight - x.weight);

  // a grey cover: the card is a shade of the average, quietly
  if (ranked.length === 0 || ranked[0].weight < n * 0.004) {
    const [, , v] = toHsv(r / n, g / n, b / n);
    const level = clamp(v * 0.5, 0.16, 0.34);
    return { a: css([220, 0.12, level]), b: css([220, 0.1, level * 0.7]), accent: css([220, 0.1, 0.92]) };
  }

  const first = ranked[0];
  const [h1, s1, v1] = toHsv(first.r / first.weight, first.g / first.weight, first.b / first.weight);
  // the second color: the next hue with real weight that is not a neighbour of the first
  const apart = (x: number, y: number) => Math.min((x - y + 12) % 12, (y - x + 12) % 12) >= 2;
  const other = ranked.find((bk) => bk !== first && apart(bk.hue, first.hue) && bk.weight > first.weight * 0.3);
  let h2 = (h1 + 28) % 360;
  let s2 = s1;
  let v2 = v1;
  if (other) [h2, s2, v2] = toHsv(other.r / other.weight, other.g / other.weight, other.b / other.weight);

  return {
    a: css([h1, clamp(s1, 0.35, 0.9), clamp(v1 * 0.5, 0.2, 0.42)]),
    b: css([h2, clamp(s2, 0.3, 0.9), clamp(v2 * 0.36, 0.13, 0.3)]),
    accent: css([h1, clamp(s1, 0.45, 0.85), clamp(v1 + 0.25, 0.78, 1)]),
  };
}
