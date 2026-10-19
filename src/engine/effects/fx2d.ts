/**
 * Effects on a plain 2D canvas: click ripples, launch bursts, and the ambient
 * scenes (dust, rain, snow, ocean bubbles, aurora). Used by the dock and by
 * the menu bar.
 *
 * This replaced a WebGL layer, for three reasons that all come from how the
 * dock is hosted. Its web view renders in software (`--disable-gpu`, which
 * keeps the GPU process small), so WebGL meant a software GL implementation
 * started up to draw a few dozen soft sprites. The layer's render loop woke
 * the page at the display's refresh rate for as long as a scene existed,
 * which also kept every CSS animation on the page on the main thread, so an
 * idle dock was recalculating style for each of its icons on every frame.
 * And the whole graphics library was loaded by every window, including ones
 * that never draw a particle.
 *
 * What is drawn and how it moves is the same as before. What changed is when
 * the page is woken:
 *
 *   - a short effect (ripple, burst) runs a frame every display refresh, for
 *     the second or so it lives;
 *   - an ambient scene on its own runs at about 30 frames a second, paced by
 *     a timer that wakes just ahead of a frame and hands the drawing to the
 *     next animation frame, so it stays in step with the display;
 *   - with nothing to draw, nothing is scheduled at all.
 */

/** Frame interval for a scene on its own when it does not say, in milliseconds. */
const AMBIENT_FRAME_MS = 1000 / 30;

/** Wake this long before a frame is due, so the animation frame it asks for
 *  is the one that lands on time. */
const WAKE_AHEAD_MS = 5;

/** The tallest frame step a catch-up after a stall is allowed to take, in
 *  seconds. Without it, a page that was throttled for a while would see its
 *  particles leap. */
const MAX_STEP = 0.1;

const TAU = Math.PI * 2;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

// ---------------------------------------------------------------------------
// glow sprites
// ---------------------------------------------------------------------------

const glowCache = new Map<number, HTMLCanvasElement>();

/**
 * A soft round glow in one color, 64 px square, drawn once and shared. The
 * falloff is a stack of translucent discs, which is how it was built before,
 * so lights look the same as they did.
 */
export function glow(color: number): HTMLCanvasElement {
  const hit = glowCache.get(color);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const g = canvas.getContext("2d");
  if (g) {
    const r = (color >> 16) & 255;
    const gr = (color >> 8) & 255;
    const b = color & 255;
    const steps = 12;
    for (let i = steps; i >= 1; i--) {
      g.beginPath();
      g.arc(32, 32, (i / steps) * 32, 0, TAU);
      g.fillStyle = `rgba(${r},${gr},${b},${(1 - i / steps) ** 2 * 0.35})`;
      g.fill();
    }
  }
  glowCache.set(color, canvas);
  return canvas;
}

/** `rgba(...)` for a `0xrrggbb` color. */
function rgba(color: number, alpha: number): string {
  return `rgba(${(color >> 16) & 255},${(color >> 8) & 255},${color & 255},${alpha})`;
}

// ---------------------------------------------------------------------------
// effects
// ---------------------------------------------------------------------------

export interface Effect {
  /** Advance by `dt` seconds (already scaled by the animation speed). */
  update(dt: number): void;
  /** Draw in canvas pixels, origin at the top left. */
  draw(ctx: CanvasRenderingContext2D): void;
  done(): boolean;
}

/** An ambient scene: lives until replaced, fades in and out. */
export interface Scene extends Effect {
  /** How often it wants a frame, in milliseconds. A scene that drifts a pixel
   *  or two a second looks the same at 24 frames a second as at 60, and
   *  costs less than half as much to keep running. */
  readonly frameMs: number;
  /** Fade in and run (true), or fade out and rest (false). `instant` skips the fade. */
  setAwake(awake: boolean, instant?: boolean): void;
  /** Faded out and resting: nothing to draw, so the loop may stop. */
  idle(): boolean;
  /** Replaced by another scene: fade out, then be dropped. */
  retire(): void;
}

function isScene(fx: Effect): fx is Scene {
  return typeof (fx as Scene).idle === "function";
}

/** Where an icon is right now, read fresh — a click effect that lives on the icon's own glass rather than the
 *  dock's has to track it as it moves and swells with magnification, not just where it was at the click. `null`
 *  once the icon is gone (closed, unpinned, scrolled off) mid-effect. */
export interface IconTrack {
  (): { x: number; y: number; w: number; h: number } | null;
}

/** A point in window space, as it falls on the canvas right now (the dock's own window can move or resize
 *  between a click and a later frame, so this is called again every frame rather than cached). */
export interface ToCanvas {
  (xWindow: number, yWindow: number): { x: number; y: number };
}

/** The icon's own drawn content, read fresh each frame — the actual `<img>` DockIcon.tsx renders, not a
 *  shape of our own. `null` for a stack mosaic or the no-icon-found glyph, neither of which is a plain image,
 *  and for a real icon's `<img>` before it has finished loading. */
export interface IconSource {
  (): CanvasImageSource | null;
}

/** How a click effect is to play (Settings > Animations, under the click effect: `animations.clickTune`): speed,
 *  strength and size as multiples of the effect as designed, and its light's color (`null` for its own: white, or
 *  the theme's tint for the bloom). */
export interface Tune {
  speed: number;
  opacity: number;
  size: number;
  color: number | null;
}
export const PLAIN_TUNE: Tune = { speed: 1, opacity: 1, size: 1, color: null };
export function tuneOf(t: { speed?: number; opacity?: number; size?: number; color?: string } | undefined): Tune {
  const hex = t?.color && /^#[0-9a-f]{6}$/i.test(t.color) ? parseInt(t.color.slice(1), 16) : null;
  return { speed: t?.speed ?? 1, opacity: t?.opacity ?? 1, size: t?.size ?? 1, color: hex };
}
/** The effect's light at `alpha`: white unless it was given a color. */
function light(tune: Tune, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  return tune.color === null ? `rgba(255,255,255,${a})` : rgba(tune.color, a);
}

/** A canvas shared by every icon-surface effect, large enough for whichever one is using it this frame, kept
 *  around rather than made fresh each time — a canvas element is not cheap to create, and at most one or two of
 *  these effects are ever drawing at once. */
let maskCanvas: HTMLCanvasElement | null = null;
let maskCtx: CanvasRenderingContext2D | null = null;

/**
 * Paint `paint` (in the icon's own local 0,0..w,h, same as `iconClip` callers already draw in) masked to exactly
 * the icon's own drawn pixels — not its rounded-square tile, which usually has empty padding around the actual
 * glyph (`normalize_icon` centres a small source on a square canvas; most real icons have some margin). Falls
 * back to the plain rounded-rect clip when `source` has nothing usable yet (not loaded, or a stack/fallback tile,
 * which is not an image `drawImage` can read).
 *
 * How: `paint` is drawn onto a small offscreen canvas of its own, in whatever blend mode it chooses (unlike
 * `iconClip`'s callers, which draw straight onto the shared effects canvas, `lighter` and all); then
 * `destination-in` composited against the icon's own image, which keeps only the pixels where the icon itself
 * is opaque, feathered exactly as the icon's own edge anti-aliasing is; then that result is drawn onto the real
 * canvas with normal blending, since it is already the correctly-blended picture — forcing `lighter` here too
 * would have been wrong for anything meant to darken (`PressDimple`'s press is a dark gradient, not a light
 * one, and `lighter` cannot darken). No `getImageData`/pixel array anywhere: `drawImage` reads the `<img>`'s own
 * bitmap directly, the same operation the browser already does to paint it on screen.
 */
function drawMaskedToIcon(
  mainCtx: CanvasRenderingContext2D,
  origin: { x: number; y: number },
  w: number,
  h: number,
  source: CanvasImageSource | null,
  paint: (ctx: CanvasRenderingContext2D) => void,
): void {
  if (!source || (source instanceof HTMLImageElement && !(source.complete && source.naturalWidth > 0))) {
    mainCtx.save();
    mainCtx.translate(origin.x, origin.y);
    iconClip(mainCtx, w, h);
    paint(mainCtx);
    mainCtx.restore();
    return;
  }
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const pw = Math.max(1, Math.ceil(w * dpr));
  const ph = Math.max(1, Math.ceil(h * dpr));
  maskCanvas ??= document.createElement("canvas");
  maskCtx ??= maskCanvas.getContext("2d");
  const m = maskCtx;
  if (!m) return;
  if (maskCanvas.width !== pw || maskCanvas.height !== ph) {
    maskCanvas.width = pw;
    maskCanvas.height = ph;
  } else {
    m.clearRect(0, 0, pw, ph);
  }
  m.setTransform(dpr, 0, 0, dpr, 0, 0);
  m.save();
  paint(m);
  m.restore();
  m.globalCompositeOperation = "destination-in";
  m.drawImage(source, 0, 0, w, h);
  m.globalCompositeOperation = "source-over";
  mainCtx.drawImage(maskCanvas, origin.x, origin.y, w, h);
}

/** The rounded-square every icon-surface effect clips itself to: 22% corner radius, the app's own convention for
 *  a rounded icon tile (`.dock-icon-glyph`, `.dock-stack`, dock.css) applied to whatever the icon's live size is
 *  this frame, not a radius read once and left stale as the icon grows or shrinks under the pointer. */
function iconClip(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const r = Math.min(w, h) * 0.22;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(w, 0, w, h, r);
  ctx.arcTo(w, h, 0, h, r);
  ctx.arcTo(0, h, 0, 0, r);
  ctx.arcTo(0, 0, w, 0, r);
  ctx.closePath();
  ctx.clip();
}

/** Scratch canvases for the effects that build a picture of their own before drawing it (the halo, the bloom),
 *  kept rather than made each frame. */
const scratch = new Map<string, { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }>();
function scratchCanvas(name: string, pw: number, ph: number): CanvasRenderingContext2D | null {
  let s = scratch.get(name);
  if (!s) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    s = { canvas, ctx };
    scratch.set(name, s);
  }
  if (s.canvas.width !== pw || s.canvas.height !== ph) {
    s.canvas.width = pw;
    s.canvas.height = ph;
  } else {
    s.ctx.setTransform(1, 0, 0, 1, 0, 0);
    s.ctx.clearRect(0, 0, pw, ph);
  }
  return s.ctx;
}

/** Whether `source` has pixels `drawImage` can read now (an `<img>` that has loaded). */
function readable(source: CanvasImageSource | null): source is CanvasImageSource {
  return !!source && !(source instanceof HTMLImageElement && !(source.complete && source.naturalWidth > 0));
}

/** Draw the icon's shape at (x, y), w × h: its own image if it has one, else the rounded tile. */
function drawShape(c: CanvasRenderingContext2D, source: CanvasImageSource | null, x: number, y: number, w: number, h: number): void {
  if (readable(source)) {
    c.drawImage(source, x, y, w, h);
    return;
  }
  const r = Math.min(w, h) * 0.22;
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
  c.fillStyle = "#fff";
  c.fill();
}

const EIGHT: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7]];

/** An SVG filter, put in the page once, that makes a picture's shape solid: white wherever it is a quarter opaque or
 *  more, nothing elsewhere. Canvas filters can use it (`ctx.filter = "url(#…)"`), which needs no reading back of
 *  pixels, so it works on an icon from another origin (reading one back would throw). */
const SOLID_FILTER = "fx-solid-shape";
function ensureSolidFilter(): void {
  if (document.getElementById(SOLID_FILTER)) return;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  svg.innerHTML = `<filter id="${SOLID_FILTER}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/><feComponentTransfer><feFuncA type="discrete" tableValues="0 1 1 1"/></feComponentTransfer></filter>`;
  document.body.appendChild(svg);
}

/** The icon's shape made solid (`SOLID_FILTER`), on a scratch canvas: so its outline is the edge of its silhouette
 *  only. Taken from the picture as it is, a glass-look icon is partly see-through inside, and the faint edges
 *  across its middle were outlined too (the halo's light swept across the icon like a clock's hand). */
function solidShape(source: CanvasImageSource | null, w: number, h: number, dpr: number): CanvasImageSource | null {
  if (!readable(source)) return null;
  const c = scratchCanvas("solid-shape", Math.ceil(w * dpr), Math.ceil(h * dpr));
  if (!c) return source;
  ensureSolidFilter();
  c.filter = `url(#${SOLID_FILTER})`;
  c.drawImage(source, 0, 0, c.canvas.width, c.canvas.height);
  c.filter = "none";
  return c.canvas;
}

/**
 * A thin band along the icon's own outline, as an alpha mask on the scratch canvas `name`: its shape spread out by
 * half of `thick` (drawn eight ways offset) less its shape pulled in by half (eight ways intersected). For an
 * icon's real silhouette, not its tile — the empty margin round most icons is transparent, so it is not in it. In
 * device pixels, with `pad` of room round the icon for the band's outer half and a glow. Returns the canvas.
 */
function outlineBand(name: string, source: CanvasImageSource | null, w: number, h: number, thick: number, pad: number, dpr: number): HTMLCanvasElement | null {
  const pw = Math.ceil((w + pad * 2) * dpr);
  const ph = Math.ceil((h + pad * 2) * dpr);
  source = solidShape(source, w, h, dpr);
  const inner = scratchCanvas(`${name}-in`, pw, ph);
  const band = scratchCanvas(name, pw, ph);
  if (!inner || !band) return null;
  const d = thick / 2;
  for (const c of [inner, band]) c.setTransform(dpr, 0, 0, dpr, pad * dpr, pad * dpr);
  // pulled in: the shape where every one of its eight shifted copies is too
  drawShape(inner, source, 0, 0, w, h);
  inner.globalCompositeOperation = "destination-in";
  for (const [dx, dy] of EIGHT) drawShape(inner, source, dx * d, dy * d, w, h);
  inner.globalCompositeOperation = "source-over";
  // spread out, less the pulled-in shape
  for (const [dx, dy] of EIGHT) drawShape(band, source, dx * d, dy * d, w, h);
  band.globalCompositeOperation = "destination-out";
  band.setTransform(1, 0, 0, 1, 0, 0);
  band.drawImage(inner.canvas, 0, 0);
  band.globalCompositeOperation = "source-over";
  return band.canvas;
}

/**
 * Light bloom: a soft light that swells out from behind the icon and fades, white at its heart through the theme's
 * tint at its edge. Picked in a side-by-side comparison (October 2026) as the one closest to "a light catching the
 * glass". Behind the icon, not on it: the effects canvas is above the icons, so the icon's own shape is cut out of
 * the light (its image where it has one), and what shows is the glow round its silhouette.
 *
 * It was a small flattened flash at the icon's foot (10 to 56 px across, squashed to half height), most of which fell
 * under the icon or in the dock's padding: picked, it could hardly be seen, least of all with a grey theme. Now it is
 * round the whole icon, reaching past it by about half its size, and bright enough to read with any tint.
 */
export class LightBloom implements Effect {
  private t = 0;
  private readonly life = 0.75;

  constructor(
    private track: IconTrack,
    private toCanvas: ToCanvas,
    private source: IconSource,
    private tint: number,
    /** `appearance.bloomAmount`, 0..1. */
    private amount = 0.7,
    private tune: Tune = PLAIN_TUNE,
  ) {
    if (tune.color !== null) this.tint = tune.color;
  }

  update(dt: number): void {
    this.t += dt * this.tune.speed;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const lt = this.t / this.life;
    if (lt >= 1) return;
    const r = this.track();
    if (!r) {
      this.t = this.life;
      return;
    }
    // up quickly, then a long fall; the light reaches out as it fades
    const a = (lt < 0.14 ? lt / 0.14 : (1 - (lt - 0.14) / 0.86) ** 1.6) * (0.55 + 0.6 * this.amount) * this.tune.opacity;
    // from just past the icon's edge to about half its size beyond, short of the icons beside it (at size 1)
    const reach = Math.max(r.w, r.h) * (0.6 + 0.32 * this.tune.size * (1 - (1 - lt) ** 3));
    const pad = Math.ceil(Math.max(r.w, r.h) * (0.45 + 0.32 * this.tune.size));
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const c = scratchCanvas("bloom", Math.ceil((r.w + pad * 2) * dpr), Math.ceil((r.h + pad * 2) * dpr));
    if (!c) return;
    c.setTransform(dpr, 0, 0, dpr, pad * dpr, pad * dpr);
    const cx = r.w / 2;
    const cy = r.h / 2;
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, reach);
    // the inner half is under the icon (cut out below): the light that shows is from its edge outward
    g.addColorStop(0, light(this.tune, a));
    g.addColorStop(0.55, light(this.tune, 0.85 * a));
    g.addColorStop(0.78, rgba(this.tint, Math.min(1, 0.45 * a)));
    g.addColorStop(1, rgba(this.tint, 0));
    c.fillStyle = g;
    c.fillRect(-pad, -pad, r.w + pad * 2, r.h + pad * 2);
    // behind the icon: its own shape is not lit
    c.globalCompositeOperation = "destination-out";
    drawShape(c, this.source(), 0, 0, r.w, r.h);
    c.globalCompositeOperation = "source-over";
    const o = this.toCanvas(r.x, r.y);
    ctx.drawImage(c.canvas, o.x - pad, o.y - pad, r.w + pad * 2, r.h + pad * 2);
  }

  done(): boolean {
    return this.t >= this.life;
  }
}

/**
 * Press dimple: the icon's glass looks pressed in at the click point, a dark dimple that grows for the first
 * fifth of its life, then releases into a bright ring springing outward. The winner of a second side-by-side
 * comparison (October 2026), this one of effects clipped to the icon's own surface rather than drawn behind it —
 * picked as the most tactile, the one where the click itself seems to do something physical to the glass.
 *
 * Tracks the icon live, every frame (`track`), rather than the rect at the moment of the click: the user asked
 * for this specifically, to see whether a dock icon still swollen from magnification — or shrinking back as the
 * pointer leaves — should visibly carry the effect with it. `fx`/`fy` are the click point as a fraction of the
 * icon's own width/height (0..1), not a pixel offset, so the dimple stays at the same place on the icon's face
 * no matter how much the icon resizes while this plays. Masked to the icon's own drawn pixels (`source`,
 * `drawMaskedToIcon`), not its tile: asked for after seeing the first version press a visible dent into the
 * empty padding around a real icon's glyph, which read as pressing the tile, not the icon.
 */
export class PressDimple implements Effect {
  private t = 0;
  private readonly life = 0.5;

  constructor(
    private track: IconTrack,
    private toCanvas: ToCanvas,
    private source: IconSource,
    private fx: number,
    private fy: number,
    private tune: Tune = PLAIN_TUNE,
  ) {}

  update(dt: number): void {
    this.t += dt * this.tune.speed;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const lt = this.t / this.life;
    if (lt >= 1) return;
    const r = this.track();
    if (!r) {
      this.t = this.life;
      return;
    }
    const press = Math.min(1, lt / 0.22);
    const release = lt < 0.22 ? 0 : (lt - 0.22) / 0.78;
    const origin = this.toCanvas(r.x, r.y);
    drawMaskedToIcon(ctx, origin, r.w, r.h, this.source(), (c) => {
      c.translate(this.fx * r.w, this.fy * r.h);
      const dimR = r.w * 0.12 + press * r.w * 0.32;
      const dim = c.createRadialGradient(0, 0, 0, 0, 0, dimR);
      dim.addColorStop(0, `rgba(0,10,25,${Math.min(1, 0.4 * (1 - release) * this.tune.opacity)})`);
      dim.addColorStop(1, "rgba(0,10,25,0)");
      c.beginPath();
      c.arc(0, 0, dimR, 0, TAU);
      c.fillStyle = dim;
      c.fill();
      if (release > 0) {
        c.globalCompositeOperation = "lighter";
        const ringR = release * Math.max(r.w, r.h) * 0.8;
        c.beginPath();
        c.arc(0, 0, ringR, 0, TAU);
        c.lineWidth = Math.max(0.6, r.w * 0.03 * this.tune.size);
        c.strokeStyle = light(this.tune, (1 - release) ** 1.6 * 0.75 * this.tune.opacity);
        c.stroke();
      }
    });
  }

  done(): boolean {
    return this.t >= this.life;
  }
}

/**
 * Edge halo: a bright line runs once round the icon's own outline — its real silhouette, not its tile — with a
 * fading tail, and then the whole outline glows a moment and fades, as the Liquidock button's rim trace does.
 *
 * The outline is a thin band along the edge of the icon's own image (`outlineBand`: the shape spread out a little
 * less the shape pulled in a little), so it follows whatever the icon is (a round icon gets a round trace, a glyph
 * with a margin is traced where its pixels are, not round the box). The running light is a narrow wedge of a conic
 * gradient sweeping round the icon's middle, kept to that band; for an outline that goes round its middle once, as
 * an icon's does, that is a light travelling along it. It was a dashed stroke round the rounded square, which on a
 * real icon (with its margin) traced empty space round it. Tracks the icon live, same as `PressDimple`.
 */
export class EdgeHalo implements Effect {
  private t = 0;
  private readonly life = 0.62;

  constructor(
    private track: IconTrack,
    private toCanvas: ToCanvas,
    private source: IconSource = () => null,
    private tune: Tune = PLAIN_TUNE,
  ) {}

  update(dt: number): void {
    this.t += dt * this.tune.speed;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const lt = this.t / this.life;
    if (lt >= 1) return;
    const r = this.track();
    if (!r) {
      this.t = this.life;
      return;
    }
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    // a fine line at size 1 (about a pixel and a half on a 48px icon)
    const thick = Math.max(0.8, Math.min(r.w, r.h) * 0.03 * this.tune.size);
    const pad = Math.ceil(thick * 3) + 2;
    const band = outlineBand("halo-band", this.source(), r.w, r.h, thick, pad, dpr);
    const c = band && scratchCanvas("halo", band.width, band.height);
    if (!band || !c) return;
    // the running light: once round in the first 55%, in quickly and out after the lap
    const lap = Math.min(1, lt / 0.55);
    const head = -Math.PI / 2 + lap * TAU;
    const k = this.tune.opacity;
    const runA = (lt < 0.06 ? lt / 0.06 : lt < 0.55 ? 1 : Math.max(0, 1 - (lt - 0.55) / 0.15)) * k;
    // then the whole outline, up as the lap ends and fading away
    const glowA = (lt < 0.45 ? 0 : lt < 0.6 ? ((lt - 0.45) / 0.15) * 0.55 : 0.55 * (1 - (lt - 0.6) / 0.4) ** 1.5) * k;
    c.setTransform(dpr, 0, 0, dpr, pad * dpr, pad * dpr);
    if (glowA > 0) {
      c.fillStyle = light(this.tune, glowA);
      c.fillRect(-pad, -pad, r.w + pad * 2, r.h + pad * 2);
    }
    if (runA > 0) {
      const TAIL = 1.7;
      const g = c.createConicGradient(head - TAIL, r.w / 2, r.h / 2);
      g.addColorStop(0, light(this.tune, 0));
      g.addColorStop((TAIL / TAU) * 0.999, light(this.tune, runA));
      g.addColorStop(TAIL / TAU, light(this.tune, 0));
      g.addColorStop(1, light(this.tune, 0));
      c.fillStyle = g;
      c.fillRect(-pad, -pad, r.w + pad * 2, r.h + pad * 2);
    }
    // only along the outline
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalCompositeOperation = "destination-in";
    c.drawImage(band, 0, 0);
    c.globalCompositeOperation = "source-over";
    const o = this.toCanvas(r.x, r.y);
    const at = [o.x - pad, o.y - pad, r.w + pad * 2, r.h + pad * 2] as const;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    // a faint glow under the line, then the line itself
    ctx.filter = `blur(${(thick * 1.5).toFixed(1)}px)`;
    ctx.globalAlpha = 0.6;
    ctx.drawImage(c.canvas, ...at);
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    ctx.drawImage(c.canvas, ...at);
    ctx.restore();
  }

  done(): boolean {
    return this.t >= this.life;
  }
}

/** Shine sweep: a bright diagonal band crosses the icon's surface once, like light catching polished glass.
 *  Tracked the same way as `PressDimple`, and masked to the icon's own drawn pixels the same way too — a sweep
 *  that lit up the empty padding around a real icon's glyph looked like it was polishing the tile, not the icon. */
export class ShineSweep implements Effect {
  private t = 0;
  private readonly life = 0.55;

  constructor(
    private track: IconTrack,
    private toCanvas: ToCanvas,
    private source: IconSource,
    private tune: Tune = PLAIN_TUNE,
  ) {}

  update(dt: number): void {
    this.t += dt * this.tune.speed;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const lt = this.t / this.life;
    if (lt >= 1) return;
    const r = this.track();
    if (!r) {
      this.t = this.life;
      return;
    }
    const origin = this.toCanvas(r.x, r.y);
    drawMaskedToIcon(ctx, origin, r.w, r.h, this.source(), (c) => {
      c.globalCompositeOperation = "lighter";
      const span = r.w * 1.6;
      const cx = -span * 0.3 + lt * span;
      c.translate(cx, r.h / 2);
      c.rotate(-0.4);
      const a = Math.sin(Math.PI * Math.min(1, lt * 1.15)) * 0.9 * this.tune.opacity;
      const bandW = Math.max(4, r.w * 0.26 * this.tune.size);
      const g = c.createLinearGradient(-bandW, 0, bandW, 0);
      g.addColorStop(0, light(this.tune, 0));
      g.addColorStop(0.5, light(this.tune, a));
      g.addColorStop(1, light(this.tune, 0));
      c.fillStyle = g;
      c.fillRect(-bandW, -r.h, bandW * 2, r.h * 2);
    });
  }

  done(): boolean {
    return this.t >= this.life;
  }
}

/** Launch burst: a flash of light and a fountain of sparks. */
export class LaunchBurst implements Effect {
  private sparks: { x: number; y: number; vx: number; vy: number; size: number; white: boolean }[] = [];
  private t = 0;
  private readonly life = 0.85;

  constructor(
    private x: number,
    private y: number,
    private tint: number,
    intensity: number,
  ) {
    const count = Math.round(10 + intensity * 12);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * TAU;
      // fountain bias: mostly upward, like droplets off a splash
      const speed = 90 + Math.random() * 190;
      this.sparks.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed * 0.8,
        vy: Math.sin(angle) * speed * 0.5 - 130,
        size: 64 * (0.12 + Math.random() * 0.2),
        white: i % 3 === 0,
      });
    }
  }

  update(dt: number): void {
    this.t += dt;
    for (const p of this.sparks) {
      p.vy += 420 * dt; // gravity pulls the droplets back down
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const lt = this.t / this.life;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.translate(this.x, this.y);

    const flashAlpha = Math.max(0, (1 - lt * 2.2) * 0.9);
    if (flashAlpha > 0) {
      const d = 64 * (1.4 + lt * 2.4);
      ctx.globalAlpha = flashAlpha;
      ctx.drawImage(glow(this.tint), -d / 2, -d / 2, d, d);
    }

    ctx.globalAlpha = Math.max(0, (1 - lt) ** 1.3);
    const white = glow(0xffffff);
    const tinted = glow(this.tint);
    for (const p of this.sparks) {
      ctx.drawImage(p.white ? white : tinted, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.restore();
  }

  done(): boolean {
    return this.t >= this.life;
  }
}

// ---------------------------------------------------------------------------
// ambient scenes
// ---------------------------------------------------------------------------

/** What a scene needs to know about the box it lives in. */
export interface SceneBox {
  /** Where the scene's top left sits on the canvas, in canvas px. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** How many particles, relative to the dock's own band: 1 is the dock's
   *  count. A thin strip like the menu bar asks for fewer. */
  amount: number;
  /** How far things travel, relative to the dock's band height: a strip a
   *  fifth as tall wants streaks and drifts a fraction as long, or they would
   *  cross it before being seen. */
  reach: number;
  /** How bright, relative to the dock's. In the dock the scene is drawn over
   *  nothing, so a faint light reads; in a bar it is drawn over a tinted body
   *  and needs a little more to be seen at all. */
  gain: number;
  /** How big the specks are, relative to the dock's. Soft specks a few pixels
   *  across are lost against a body of nearly their own color. */
  grain: number;
}

abstract class SceneBase implements Scene {
  readonly frameMs: number = 1000 / 24;
  protected alpha = 0;
  protected t = 0;
  private awake = true;
  private retired = false;

  constructor(protected box: SceneBox) {}

  setAwake(awake: boolean, instant = false): void {
    this.awake = awake;
    if (instant) this.alpha = awake ? 1 : 0;
  }

  retire(): void {
    this.retired = true;
    this.awake = false;
  }

  idle(): boolean {
    return !this.awake && this.alpha <= 0.002;
  }

  done(): boolean {
    return this.retired && this.alpha <= 0.002;
  }

  update(dt: number): void {
    const target = this.awake ? 1 : 0;
    const rate = (this.awake ? 1.1 : 1.8) * dt;
    const gap = target - this.alpha;
    this.alpha += Math.sign(gap) * Math.min(Math.abs(gap), rate);
    if (this.alpha > 0.002) {
      this.t += dt;
      this.step(dt);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.alpha <= 0.002) return;
    ctx.save();
    // everything the scene draws stays inside its own box
    ctx.beginPath();
    ctx.rect(this.box.x, this.box.y, this.box.w, this.box.h);
    ctx.clip();
    ctx.translate(this.box.x, this.box.y);
    this.paint(ctx, this.alpha);
    ctx.restore();
  }

  protected abstract step(dt: number): void;
  protected abstract paint(ctx: CanvasRenderingContext2D, alpha: number): void;
}

/** Ambient dust: tiny motes drifting up through the light. */
export class DustScene extends SceneBase {
  private motes: {
    x: number;
    y: number;
    baseX: number;
    speed: number;
    sway: number;
    phase: number;
    twinkle: number;
    size: number;
  }[] = [];

  constructor(
    private color: number,
    density: number,
    box: SceneBox,
  ) {
    super(box);
    const count = Math.max(1, Math.round(density * 26 * box.amount));
    for (let i = 0; i < count; i++) {
      const baseX = Math.random() * box.w;
      this.motes.push({
        x: baseX,
        y: Math.random() * box.h,
        baseX,
        speed: (5 + Math.random() * 11) * box.reach,
        sway: 4 + Math.random() * 9,
        phase: Math.random() * TAU,
        twinkle: 0.5 + Math.random() * 1.2,
        size: 64 * (0.045 + Math.random() * 0.075) * box.grain,
      });
    }
  }

  protected step(dt: number): void {
    const { w, h } = this.box;
    for (const m of this.motes) {
      m.y -= m.speed * dt;
      if (m.y < -8) {
        m.y = h + 8;
        m.baseX = Math.random() * w;
      }
      m.x = m.baseX + Math.sin(this.t * 0.6 + m.phase) * m.sway;
    }
  }

  protected paint(ctx: CanvasRenderingContext2D, alpha: number): void {
    ctx.globalCompositeOperation = "lighter";
    const tex = glow(this.color);
    const gain = this.box.gain;
    for (const m of this.motes) {
      const tw = 0.55 + Math.sin(this.t * m.twinkle + m.phase) * 0.45;
      ctx.globalAlpha = Math.min(1, 0.5 * tw * alpha * gain);
      ctx.drawImage(tex, m.x - m.size / 2, m.y - m.size / 2, m.size, m.size);
    }
  }
}

/** Rain: thin streaks falling past, with a whisper of wind. */
export class RainScene extends SceneBase {
  // streaks cover a dozen pixels or more between frames, so rain keeps the
  // higher rate
  override readonly frameMs: number = 1000 / 30;
  private drops: { x: number; y: number; speed: number; len: number; alpha: number }[] = [];

  constructor(
    private color: number,
    density: number,
    box: SceneBox,
  ) {
    super(box);
    const count = Math.max(1, Math.round((14 + density * 30) * box.amount));
    for (let i = 0; i < count; i++) {
      this.drops.push({
        x: Math.random() * box.w,
        y: Math.random() * box.h,
        speed: (260 + Math.random() * 220) * box.reach,
        len: (10 + Math.random() * 16) * box.reach,
        alpha: 0.28 + Math.random() * 0.25,
      });
    }
  }

  protected step(dt: number): void {
    const { w, h } = this.box;
    for (const d of this.drops) {
      d.y += d.speed * dt;
      d.x += 18 * dt;
      if (d.y > h + 10) {
        d.y = -d.len - Math.random() * 40 * this.box.reach;
        d.x = Math.random() * w;
      }
    }
  }

  protected paint(ctx: CanvasRenderingContext2D, alpha: number): void {
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 1.2;
    const gain = this.box.gain;
    for (const d of this.drops) {
      ctx.strokeStyle = rgba(this.color, Math.min(1, d.alpha * alpha * gain));
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + 1.5, d.y + d.len);
      ctx.stroke();
    }
  }
}

/** Snow: fat soft flakes swaying down. */
export class SnowScene extends SceneBase {
  private flakes: {
    x: number;
    y: number;
    speed: number;
    sway: number;
    phase: number;
    size: number;
    alpha: number;
  }[] = [];

  constructor(density: number, box: SceneBox) {
    super(box);
    const count = Math.max(1, Math.round((10 + density * 26) * box.amount));
    for (let i = 0; i < count; i++) {
      this.flakes.push({
        x: Math.random() * box.w,
        y: Math.random() * box.h,
        speed: (22 + Math.random() * 30) * box.reach,
        sway: 8 + Math.random() * 14,
        phase: Math.random() * TAU,
        size: 64 * (0.06 + Math.random() * 0.1) * box.grain,
        alpha: 0.5 + Math.random() * 0.4,
      });
    }
  }

  protected step(dt: number): void {
    const { w, h } = this.box;
    for (const f of this.flakes) {
      f.y += f.speed * dt;
      f.x += Math.sin(this.t * 0.8 + f.phase) * f.sway * dt;
      if (f.y > h + 8) {
        f.y = -8;
        f.x = Math.random() * w;
      }
    }
  }

  protected paint(ctx: CanvasRenderingContext2D, alpha: number): void {
    const tex = glow(0xffffff);
    const gain = this.box.gain;
    for (const f of this.flakes) {
      ctx.globalAlpha = Math.min(1, f.alpha * alpha * gain);
      ctx.drawImage(tex, f.x - f.size / 2, f.y - f.size / 2, f.size, f.size);
    }
  }
}

/** Bubbles: the ocean under the glass, rising, wobbling. */
export class BubblesScene extends SceneBase {
  private bubbles: { x: number; y: number; speed: number; sway: number; phase: number; r: number }[] = [];

  constructor(
    private color: number,
    density: number,
    box: SceneBox,
  ) {
    super(box);
    const count = Math.max(1, Math.round((8 + density * 18) * box.amount));
    for (let i = 0; i < count; i++) {
      this.bubbles.push({
        x: Math.random() * box.w,
        // start below the box, so they rise into view rather than all being
        // there on the first frame
        y: box.h + Math.random() * box.h,
        speed: (18 + Math.random() * 26) * box.reach,
        sway: 6 + Math.random() * 10,
        phase: Math.random() * TAU,
        r: (2.5 + Math.random() * 5) * Math.max(0.55, box.reach),
      });
    }
  }

  protected step(dt: number): void {
    const { w, h } = this.box;
    for (const b of this.bubbles) {
      b.y -= b.speed * dt;
      b.x += Math.sin(this.t * 1.1 + b.phase) * b.sway * dt;
      if (b.y < -b.r * 2) {
        b.y = h + b.r * 2;
        b.x = Math.random() * w;
      }
    }
  }

  protected paint(ctx: CanvasRenderingContext2D, alpha: number): void {
    ctx.globalCompositeOperation = "lighter";
    const shine = Math.min(1, alpha * this.box.gain);
    for (const b of this.bubbles) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.globalAlpha = shine;
      ctx.beginPath();
      ctx.arc(0, 0, b.r, 0, TAU);
      ctx.fillStyle = rgba(this.color, 0.1);
      ctx.fill();
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-b.r * 0.3, -b.r * 0.35, b.r * 0.28, 0, TAU);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fill();
      ctx.restore();
    }
  }
}

/** Aurora: broad ribbons of light breathing across the sky. */
export class AuroraScene extends SceneBase {
  private static readonly COLORS = [0x63f2c2, 0x7c6cf0, 0x4fc3dd];
  private ribbons: { x: number; phase: number; drift: number; tilt: number; tex: HTMLCanvasElement; fade: number }[] =
    [];

  constructor(density: number, box: SceneBox) {
    super(box);
    const count = 2 + Math.round(density * 2);
    for (let i = 0; i < count; i++) {
      this.ribbons.push({
        x: box.w * (0.25 + i * 0.25),
        phase: i * 1.7,
        drift: 0.12 + i * 0.05,
        // a ribbon is tilted across the sky; in a thin strip that would sweep
        // it clean out of view, so the tilt follows the strip's height
        tilt: (-0.35 + i * 0.18) * Math.max(0.05, box.reach),
        tex: glow(AuroraScene.COLORS[i % AuroraScene.COLORS.length]),
        fade: 0.16,
      });
    }
  }

  protected step(dt: number): void {
    for (const r of this.ribbons) {
      r.x += Math.sin(this.t * r.drift + r.phase) * 6 * dt;
      r.fade = 0.1 + (Math.sin(this.t * 0.35 + r.phase) + 1) * 0.06;
      r.tilt += Math.sin(this.t * 0.2 + r.phase) * 0.004 * dt;
    }
  }

  protected paint(ctx: CanvasRenderingContext2D, alpha: number): void {
    ctx.globalCompositeOperation = "lighter";
    const { w, h } = this.box;
    for (const r of this.ribbons) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, r.fade * alpha * this.box.gain);
      ctx.translate(r.x, h * 0.35);
      ctx.rotate(r.tilt);
      ctx.scale((w / 64) * 0.7, (h / 64) * 0.5);
      ctx.drawImage(r.tex, -32, -32);
      ctx.restore();
    }
  }
}

/** Whether motion is to be kept to a minimum (written on the page by
 *  applyAppearance from the setting and from Windows). */
export function motionReduced(): boolean {
  return document.documentElement.dataset.reduceMotion === "on";
}

export type SceneKind = "dust" | "rain" | "snow" | "bubbles" | "aurora";

export function isSceneKind(kind: string): kind is SceneKind {
  return kind === "dust" || kind === "rain" || kind === "snow" || kind === "bubbles" || kind === "aurora";
}

export function createScene(kind: SceneKind, color: number, density: number, box: SceneBox): Scene {
  switch (kind) {
    case "dust":
      return new DustScene(color, density, box);
    case "rain":
      return new RainScene(color, density, box);
    case "snow":
      return new SnowScene(density, box);
    case "bubbles":
      return new BubblesScene(color, density, box);
    case "aurora":
      return new AuroraScene(density, box);
  }
}

/** The height of the dock band the scene counts and speeds are tuned for. */
const REFERENCE_BAND = 113;
/** And its area, for scaling a scene's particle count to a different box. */
const REFERENCE_AREA = 74_000;

/** A scene's box for a strip much thinner or wider than the dock's band:
 *  particles in step with the area, travel in step with the height, and a
 *  little more light. */
export function stripBox(x: number, y: number, w: number, h: number): SceneBox {
  return {
    x,
    y,
    w,
    h,
    // a thin strip is mostly width, and a scene thinned out over that much
    // width is a few specks; it is thickened a little so it reads as a scene
    amount: clamp(((w * h) / REFERENCE_AREA) * 1.7, 0.45, 2.2),
    reach: clamp(h / REFERENCE_BAND, 0.5, 1),
    gain: 2.2,
    grain: 1.6,
  };
}

/** A scene's box for the dock's own band: the numbers it was tuned for. */
export function bandBox(x: number, y: number, w: number, h: number): SceneBox {
  return { x, y, w, h, amount: 1, reach: 1, gain: 1, grain: 1 };
}

/** A color moved part of the way toward white, `t` from 0 to 1. */
export function lighten(color: number, t: number): number {
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  return (mix((color >> 16) & 255) << 16) | (mix((color >> 8) & 255) << 8) | mix(color & 255);
}

// ---------------------------------------------------------------------------
// the engine
// ---------------------------------------------------------------------------

export class Fx2D {
  private ctx: CanvasRenderingContext2D | null;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private effects: Effect[] = [];
  private scene: Scene | null = null;
  private speed = 1;
  private hidden = false;
  private disposed = false;
  private frameId = 0;
  private timerId = 0;
  private last = 0;

  /** What the caller last asked of the scene, kept so that reduced motion can
   *  be switched on and off underneath it. */
  private wantAwake = true;
  private readonly onMotion = () => {
    this.scene?.setAwake(this.wantAwake && !motionReduced());
    this.wake();
  };

  constructor(readonly canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d");
    window.addEventListener("aero-motion", this.onMotion);
  }

  /** Size in CSS pixels. The backing store follows the display's scale, so
   *  what is drawn is as sharp as the rest of the page. */
  resize(w: number, h: number): void {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.canvas.width = Math.max(1, Math.ceil(w * dpr));
    this.canvas.height = Math.max(1, Math.ceil(h * dpr));
    // resizing clears the canvas, so what was there is drawn again
    this.wake();
  }

  setSpeed(speed: number): void {
    this.speed = speed;
  }

  /** True while the page is not showing (hidden window, covered dock): no
   *  frames are scheduled until it is false again. */
  setHidden(hidden: boolean): void {
    if (hidden === this.hidden) return;
    this.hidden = hidden;
    if (hidden) {
      this.cancel();
    } else {
      this.wake();
    }
  }

  /** Put a new scene in place of the old one, which fades out. */
  setScene(next: Scene | null, awake: boolean): void {
    if (this.scene) this.scene.retire();
    this.scene = next;
    this.wantAwake = awake;
    if (next) {
      next.setAwake(awake && !motionReduced());
      this.effects.push(next);
    }
    this.wake();
  }

  /** Fade the scene in (true) or out (false). */
  setSceneAwake(awake: boolean): void {
    this.wantAwake = awake;
    this.scene?.setAwake(awake && !motionReduced());
    this.wake();
  }

  spawn(fx: Effect): void {
    // a ripple or a burst is all motion and nothing else
    if (motionReduced()) return;
    this.effects.push(fx);
    this.wake();
  }

  dispose(): void {
    window.removeEventListener("aero-motion", this.onMotion);
    this.disposed = true;
    this.cancel();
    this.effects = [];
    this.scene = null;
  }

  // ---- the loop ----

  private hasWork(): boolean {
    for (const fx of this.effects) {
      if (!(isScene(fx) && fx.idle())) return true;
    }
    return false;
  }

  /** A ripple or burst is alive: it earns a frame every display refresh. */
  private hasFast(): boolean {
    for (const fx of this.effects) {
      if (!isScene(fx)) return true;
    }
    return false;
  }

  /** The slowest the ambient scenes may be drawn, in ms a frame: set for a window that is large (a strip of the frame
   *  round a whole screen), where every frame drawn is a whole window to put together and hand over. */
  private floorMs = 0;

  setFrameFloor(ms: number): void {
    this.floorMs = ms;
  }

  /** The frame interval the scenes now running ask for: the quickest wins (but never quicker than the floor). */
  private ambientFrameMs(): number {
    let ms = Infinity;
    for (const fx of this.effects) {
      if (isScene(fx) && !fx.idle() && fx.frameMs < ms) ms = fx.frameMs;
    }
    return Math.max(this.floorMs, Number.isFinite(ms) ? ms : AMBIENT_FRAME_MS);
  }

  private cancel(): void {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    if (this.timerId) clearTimeout(this.timerId);
    this.frameId = 0;
    this.timerId = 0;
    // nothing is drawn while stopped, and nothing stale should linger on it
    this.clear();
  }

  private clear(): void {
    if (!this.ctx) return;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** Start the loop if there is something to draw and it is not already going. */
  private wake(): void {
    if (this.disposed || this.hidden || this.frameId || this.timerId) return;
    if (this.w === 0 || !this.hasWork()) return;
    this.last = performance.now();
    this.queue();
  }

  private queue(): void {
    if (this.hasFast()) {
      this.frameId = requestAnimationFrame(this.frame);
      return;
    }
    // On a beat shared by every scene on the page, not counted from this engine's own last frame: the frame's four
    // bands are four engines, and each frame any of them draws is the whole screen-wide window put together again, so
    // drawn on four beats of their own they cost up to four times the frames for the same motion.
    const every = this.ambientFrameMs();
    const now = performance.now();
    const wait = Math.max(Math.ceil((now + WAKE_AHEAD_MS) / every) * every, this.last + every * 0.5) - now - WAKE_AHEAD_MS;
    if (wait > 2) {
      this.timerId = window.setTimeout(() => {
        this.timerId = 0;
        this.frameId = requestAnimationFrame(this.frame);
      }, wait);
    } else {
      this.frameId = requestAnimationFrame(this.frame);
    }
  }

  private frame = (now: number): void => {
    this.frameId = 0;
    const ctx = this.ctx;
    if (this.disposed || this.hidden || !ctx) return;

    const dt = clamp((now - this.last) / 1000, 0, MAX_STEP) * this.speed;
    this.last = now;

    // Cleared in canvas pixels, the whole store. Cleared by the CSS size
    // instead, a size that is not a whole number of pixels leaves the last
    // row or column of the store untouched, and whatever was drawn there
    // stays on screen as a faint line after everything else has gone.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    // finished effects are dropped in place, so a frame allocates nothing
    const list = this.effects;
    let kept = 0;
    for (let i = 0; i < list.length; i++) {
      const fx = list[i];
      fx.update(dt);
      if (fx.done()) {
        if (fx === this.scene) this.scene = null;
        continue;
      }
      fx.draw(ctx);
      list[kept++] = fx;
    }
    list.length = kept;

    if (this.hasWork()) this.queue();
  };
}
