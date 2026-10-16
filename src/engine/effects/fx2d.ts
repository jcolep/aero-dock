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

/** Water ripple: expanding rings that thin and fade, on a floor plane. */
export class ClickRipple implements Effect {
  private t = 0;
  private readonly life = 0.9;

  constructor(
    private x: number,
    private y: number,
    private tint: number,
  ) {}

  update(dt: number): void {
    this.t += dt;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.translate(this.x, this.y);
    // rippling on a floor, not a wall: the circles are flattened
    ctx.scale(1, 0.35);
    for (let i = 0; i < 3; i++) {
      const lt = (this.t - i * 0.12) / this.life;
      if (lt <= 0 || lt >= 1) continue;
      ctx.beginPath();
      ctx.arc(0, 0, 6 + lt * 46, 0, TAU);
      ctx.lineWidth = Math.max(1, 3.5 * (1 - lt));
      ctx.strokeStyle = rgba(this.tint, (1 - lt) ** 1.6 * 0.85);
      ctx.stroke();
    }
    ctx.restore();
  }

  done(): boolean {
    return this.t >= this.life + 0.3;
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
