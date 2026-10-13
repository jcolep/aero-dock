/**
 * The animation presets: what each choice under Settings > Animations
 * actually does.
 *
 * Everything that animates reads its preset from here, and so does the live
 * preview in settings, so a preview is the real thing and cannot drift from it.
 * The ids are checked on the Rust side against the same lists (see
 * `AnimationSettings` in settings.rs); add one in both places.
 *
 * Nothing here blurs. A blur filter on a moving panel has to be redrawn every
 * frame, and the dock's web views are drawn in software; the presets get their
 * depth from scale, perspective and light instead.
 *
 * The menu bar's presets are CSS (menubar.css, keyed by `data-anim`); what is
 * here for them is their names and how long each takes to leave.
 */

import type { MotionValue, TargetAndTransition, Transition } from "motion/react";
import { animate } from "motion/react";
import type { AnimationSettings, DockEdge } from "../../ipc/types";
import { atSpeed, character, spring, time } from "../motion/tokens";
import { springs } from "./springs";

export interface PresetInfo {
  id: string;
  label: string;
  /** A few words on how it moves. */
  hint: string;
}

// ---- names ----

export const MENU_ANIMS: PresetInfo[] = [
  { id: "goo", label: "Goo", hint: "Swells out of its button like a drop, wobbles, settles" },
  { id: "spring", label: "Spring", hint: "A quick pop with a soft overshoot" },
  { id: "unfurl", label: "Unfurl", hint: "Folds down from the bar like a flap" },
  { id: "reveal", label: "Reveal", hint: "A circle opens out from the button" },
  { id: "drift", label: "Drift", hint: "Glides down and settles, no bounce" },
  { id: "fade", label: "Fade", hint: "Just fades" },
  { id: "none", label: "None", hint: "Appears at once" },
];

export const FLYOUT_ANIMS: PresetInfo[] = [
  { id: "bloom", label: "Bloom", hint: "Rises from the dock with a soft spring" },
  { id: "pop", label: "Pop", hint: "Snaps open, a touch of overshoot" },
  { id: "glide", label: "Glide", hint: "Slides out and eases to a stop" },
  { id: "unfurl", label: "Unfurl", hint: "Folds up from the dock like a lid" },
  { id: "jelly", label: "Jelly", hint: "Squashes and stretches, then wobbles still" },
  { id: "fade", label: "Fade", hint: "Just fades" },
  { id: "none", label: "None", hint: "Appears at once" },
];

export const REVEAL_ANIMS: PresetInfo[] = [
  { id: "slide", label: "Slide", hint: "Slides in from the screen edge" },
  { id: "rise", label: "Rise", hint: "Floats up and settles" },
  { id: "pop", label: "Pop", hint: "Springs out from the edge" },
  { id: "genie", label: "Genie", hint: "Grows out of the edge like a blob" },
  { id: "cascade", label: "Cascade", hint: "The icons rise in one after another" },
  { id: "fade", label: "Fade", hint: "Just fades" },
  { id: "none", label: "None", hint: "Appears at once" },
];

export const LAUNCH_ANIMS: PresetInfo[] = [
  { id: "bounce", label: "Bounce", hint: "Hops twice, the classic" },
  { id: "hop", label: "Hop", hint: "One clean leap" },
  { id: "jelly", label: "Jelly", hint: "Squashes down, springs up, wobbles" },
  { id: "pulse", label: "Pulse", hint: "Swells and settles in place" },
  { id: "none", label: "None", hint: "Stays still" },
];

export const START_ANIMS: PresetInfo[] = [
  { id: "rise", label: "Rise", hint: "Floats up from the dock and settles; sinks away again" },
  { id: "bloom", label: "Bloom", hint: "Swells open from the bottom with a soft overshoot" },
  { id: "genie", label: "Genie", hint: "Pours up out of the dock like the minimise effect" },
  { id: "slide", label: "Slide", hint: "Slides up from below, and back down" },
  { id: "fade", label: "Fade", hint: "Just fades" },
  { id: "none", label: "None", hint: "Appears at once" },
];

export const MAGNIFY_FEELS: PresetInfo[] = [
  { id: "soft", label: "Soft", hint: "Smooth and unhurried" },
  { id: "snappy", label: "Snappy", hint: "Tight, follows the pointer closely" },
  { id: "bouncy", label: "Bouncy", hint: "Overshoots and rebounds" },
  { id: "liquid", label: "Liquid", hint: "Heavy, drags behind the pointer" },
];

// ---- geometry ----

/** Which way is "toward the dock" for something that opens next to it. */
function toward(edge: DockEdge): { x: number; y: number } {
  switch (edge) {
    case "bottom":
      return { x: 0, y: 1 };
    case "top":
      return { x: 0, y: -1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
  }
}

/** The side of a panel that faces the dock, as a transform-origin. */
export function nearSide(edge: DockEdge): string {
  switch (edge) {
    case "bottom":
      return "50% 100%";
    case "top":
      return "50% 0%";
    case "left":
      return "0% 50%";
    case "right":
      return "100% 50%";
  }
}

// ---- panels and flyouts ----

export interface PanelMotion {
  initial: TargetAndTransition | false;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
  transition: Transition;
  /** Where the panel grows from: the side facing the dock. */
  origin: string;
}

/** How long a panel's exit takes at most, which the dock keeps the room for. */
export const PANEL_EXIT_MS = 300;

/**
 * The entrance, resting state and exit of a panel that opens beside the dock
 * on `edge`. `speed` is the global animation speed (2 = twice as fast).
 */
export function panelMotion(preset: string, edge: DockEdge, speed = 1): PanelMotion {
  const dir = toward(edge);
  const origin = nearSide(edge);
  const at = (k: number) => ({ x: dir.x * k, y: dir.y * k });
  const rest = { opacity: 1, scale: 1, scaleX: 1, scaleY: 1, rotateX: 0, rotateY: 0, x: 0, y: 0 };
  const fast = (t: number) => t / speed;
  // the dock's own axis tilts: a panel above or below it folds about a
  // horizontal hinge, one beside it about a vertical one
  const horizontalHinge = edge === "bottom" || edge === "top";
  const tilt = (deg: number) =>
    horizontalHinge
      ? { rotateX: edge === "bottom" ? deg : -deg }
      : { rotateY: edge === "left" ? deg : -deg };

  switch (preset) {
    case "pop":
      return {
        origin,
        initial: { opacity: 0, scale: 0.78 },
        animate: { ...rest },
        exit: { opacity: 0, scale: 0.9, transition: { duration: fast(0.12), ease: "easeIn" } },
        transition: atSpeed(character.pop, speed),
      };
    case "glide":
      return {
        origin,
        initial: { opacity: 0, ...at(22) },
        animate: { ...rest },
        exit: {
          opacity: 0,
          ...at(8),
          transition: { duration: fast(0.16), ease: [0.5, 0, 0.75, 0] },
        },
        transition: { type: "tween", duration: fast(0.34), ease: [0.16, 1, 0.3, 1] },
      };
    case "unfurl":
      return {
        origin,
        initial: { opacity: 0, scale: 0.94, transformPerspective: 800, ...tilt(68) },
        animate: { ...rest, transformPerspective: 800 },
        exit: {
          opacity: 0,
          scale: 0.96,
          transformPerspective: 800,
          ...tilt(42),
          transition: { duration: fast(0.17), ease: [0.5, 0, 0.8, 0.45] },
        },
        transition: atSpeed(spring.settle, speed),
      };
    case "jelly":
      return {
        origin,
        initial: { opacity: 0, scaleX: 0.5, scaleY: 0.2 },
        animate: {
          ...rest,
          scaleX: [0.5, 1.05, 0.98, 1.012, 1],
          scaleY: [0.2, 1.1, 0.95, 1.03, 1],
          transition: {
            default: {
              duration: fast(0.62),
              times: [0, 0.3, 0.5, 0.74, 1],
              ease: ["easeOut", "easeInOut", "easeInOut", "easeInOut"],
            },
            opacity: { duration: fast(0.14) },
          },
        },
        exit: {
          opacity: [1, 1, 0],
          scaleX: [1, 1.03, 0.55],
          scaleY: [1, 1.08, 0.3],
          transition: { duration: fast(0.26), times: [0, 0.4, 1], ease: ["easeOut", "easeIn"] },
        },
        transition: { duration: fast(0.62) },
      };
    case "fade":
      return {
        origin,
        initial: { opacity: 0, scale: 0.985 },
        animate: { ...rest },
        exit: { opacity: 0, transition: { duration: fast(0.12) } },
        transition: { type: "tween", duration: fast(0.18), ease: "easeOut" },
      };
    case "none":
      return {
        origin,
        initial: false,
        animate: { ...rest },
        exit: { opacity: 0, transition: { duration: 0 } },
        transition: { duration: 0 },
      };
    case "bloom":
    default:
      return {
        origin,
        initial: { opacity: 0, scale: 0.86, ...at(12) },
        animate: { ...rest },
        exit: { opacity: 0, scale: 0.93, transition: { duration: fast(0.15) } },
        transition: springs.bloom,
      };
  }
}

export interface ItemMotion {
  initial: TargetAndTransition | false;
  animate: TargetAndTransition;
  transition: Transition;
}

/**
 * How the things inside a panel (the apps in a folder, the items of a stack)
 * arrive, each a little after the one before. They follow the panel's own
 * character: pops spring up, glides and fades rise and fade, jelly squashes
 * into shape, none appear with the panel.
 */
export function itemMotion(preset: string, i: number, step = 0.022, cap = 0.35, speed = 1): ItemMotion {
  const delay = Math.min(i * step, cap) / speed;
  switch (preset) {
    case "none":
      return { initial: false, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0 } };
    case "fade":
    case "glide":
    case "unfurl":
      return {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0, scale: 1, scaleX: 1, scaleY: 1 },
        transition: { type: "tween", duration: 0.3 / speed, ease: [0.16, 1, 0.3, 1], delay },
      };
    case "jelly":
      return {
        initial: { opacity: 0, y: 8, scaleX: 0.8, scaleY: 0.5 },
        animate: { opacity: 1, y: 0, scale: 1, scaleX: 1, scaleY: 1 },
        transition: { ...atSpeed(character.jelly, speed), delay },
      };
    case "pop":
      return {
        initial: { opacity: 0, y: 10, scale: 0.8 },
        animate: { opacity: 1, y: 0, scale: 1, scaleX: 1, scaleY: 1 },
        transition: { ...atSpeed(character.pop, speed), delay },
      };
    case "bloom":
    default:
      return {
        initial: { opacity: 0, y: 10, scale: 0.85 },
        animate: { opacity: 1, y: 0, scale: 1, scaleX: 1, scaleY: 1 },
        transition: { ...springs.bloom, delay },
      };
  }
}

// ---- the dock appearing ----

export interface RevealMotion {
  /** Where the bar starts when the dock first appears: plain values (a
   *  keyframe list is not allowed as a starting point). */
  initial: TargetAndTransition;
  /** The bar out of sight. */
  hidden: TargetAndTransition;
  /** The bar in place. */
  shown: TargetAndTransition;
  /** Where the bar grows from. */
  origin: string;
  /** How long it takes to be out of sight, after which the window can be
   *  trimmed to its strip. */
  hideMs: number;
}

/**
 * How the dock bar comes and goes: on launch, and with auto-hide. Every
 * target names every property it touches, so changing preset while the dock
 * is up cannot leave a stale one behind.
 */
export function revealMotion(
  preset: string,
  edge: DockEdge,
  vertical: boolean,
  speed = 1,
): RevealMotion {
  const m = revealCore(preset, edge, vertical, speed);
  // where the dock first appears from: the hidden pose, and where a list of
  // keyframes ends up is the pose it was heading for
  const initial: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(m.hidden)) {
    if (key === "transition") continue;
    initial[key] = Array.isArray(value) ? value[value.length - 1] : value;
  }
  return { ...m, initial: initial as TargetAndTransition };
}

function revealCore(
  preset: string,
  edge: DockEdge,
  vertical: boolean,
  speed: number,
): Omit<RevealMotion, "initial"> {
  const dir = toward(edge);
  const origin = nearSide(edge);
  const base = { x: 0, y: 0, opacity: 1, scale: 1, scaleX: 1, scaleY: 1 };
  const away = (k: number) => ({ x: dir.x * k, y: dir.y * k });
  const fast = (t: number) => t / speed;
  const pct = (k: number) =>
    vertical ? { x: `${dir.x * k}%`, y: 0 } : { x: 0, y: `${dir.y * k}%` };

  switch (preset) {
    case "rise":
      return {
        origin,
        hidden: {
          ...base,
          ...pct(36),
          scale: 0.92,
          opacity: 0,
          transition: atSpeed(spring.standard, speed),
        },
        shown: {
          ...base,
          transition: atSpeed(spring.heavy, speed),
        },
        hideMs: fast(460),
      };
    case "pop":
      return {
        origin,
        hidden: {
          ...base,
          ...pct(14),
          scale: 0.5,
          opacity: 0,
          transition: { duration: fast(0.22), ease: [0.5, 0, 0.8, 0.45] },
        },
        shown: {
          ...base,
          transition: atSpeed(character.reveal, speed),
        },
        hideMs: fast(300),
      };
    case "genie":
      return {
        origin,
        hidden: {
          ...base,
          scaleX: [1, 1.03, 0.16],
          scaleY: [1, 1.07, 0.04],
          opacity: [1, 1, 0],
          transition: { duration: fast(0.36), times: [0, 0.38, 1], ease: ["easeOut", "easeIn"] },
        },
        shown: {
          ...base,
          scaleX: [null, 1.05, 0.985, 1.012, 1],
          scaleY: [null, 1.12, 0.95, 1.03, 1],
          transition: {
            default: {
              duration: fast(0.7),
              times: [0, 0.3, 0.52, 0.76, 1],
              ease: ["easeOut", "easeInOut", "easeInOut", "easeInOut"],
            },
            opacity: { duration: fast(0.16) },
          },
        },
        hideMs: fast(400),
      };
    case "cascade":
      // the bar itself only fades up a little; the icons do the arriving,
      // each a beat after the one before (see dock.css)
      return {
        origin,
        hidden: {
          ...base,
          ...away(-14),
          scale: 0.98,
          opacity: 0,
          transition: { duration: fast(0.26), ease: [0.5, 0, 0.75, 0] },
        },
        shown: { ...base, transition: { duration: fast(0.38), ease: [0.16, 1, 0.3, 1] } },
        hideMs: fast(320),
      };
    case "fade":
      return {
        origin,
        hidden: {
          ...base,
          scale: 0.985,
          opacity: 0,
          transition: { duration: fast(0.22), ease: "easeIn" },
        },
        shown: { ...base, transition: { duration: fast(0.26), ease: "easeOut" } },
        hideMs: fast(280),
      };
    case "none":
      return {
        origin,
        hidden: { ...base, opacity: 0, transition: { duration: 0 } },
        shown: { ...base, transition: { duration: 0 } },
        hideMs: 40,
      };
    case "slide":
    default:
      return {
        origin,
        hidden: {
          ...base,
          ...(vertical
            ? { x: edge === "left" ? "-118%" : "118%", y: 0 }
            : { y: edge === "top" ? "-118%" : "118%", x: 0 }),
          opacity: 0.6,
          transition: springs.slide,
        },
        shown: { ...base, transition: springs.slide },
        hideMs: fast(380),
      };
  }
}

// ---- launching ----

/** The motion values an icon's launch animation drives. */
export interface LaunchControls {
  /** Offset along the axis away from the edge. */
  lift: MotionValue<number>;
  squashX: MotionValue<number>;
  squashY: MotionValue<number>;
}

/** Play the launch animation. Resolves when it has come to rest. */
export async function playLaunch(
  preset: string,
  c: LaunchControls,
  vertical: boolean,
): Promise<void> {
  // away from the edge, along the axis the lift is applied on
  const reach = (px: number) => -px;
  const spring = (stiffness: number, damping: number, mass = 0.6): Transition => ({
    type: "spring",
    stiffness,
    damping,
    mass,
  });
  switch (preset) {
    case "none":
      return;
    case "hop":
      await animate(c.lift, reach(vertical ? 16 : 32), {
        type: "tween",
        duration: 0.2,
        ease: [0.2, 0.8, 0.4, 1],
      });
      await animate(c.lift, 0, spring(430, 21));
      return;
    case "jelly": {
      // crouch, spring off the ground stretched, land squashed, wobble still
      await Promise.all([
        animate(c.squashY, 0.8, { duration: 0.09, ease: "easeOut" }),
        animate(c.squashX, 1.14, { duration: 0.09, ease: "easeOut" }),
      ]);
      await Promise.all([
        animate(c.lift, reach(vertical ? 14 : 26), { duration: 0.17, ease: [0.2, 0.8, 0.4, 1] }),
        animate(c.squashY, 1.16, { duration: 0.17, ease: "easeOut" }),
        animate(c.squashX, 0.9, { duration: 0.17, ease: "easeOut" }),
      ]);
      await Promise.all([
        animate(c.lift, 0, spring(380, 20)),
        animate(c.squashY, 1, spring(340, 8, 0.5)),
        animate(c.squashX, 1, spring(340, 8, 0.5)),
      ]);
      return;
    }
    case "pulse":
      await Promise.all([
        animate(c.squashX, 1.22, spring(560, 14, 0.5)),
        animate(c.squashY, 1.22, spring(560, 14, 0.5)),
      ]);
      await Promise.all([
        animate(c.squashX, 1, spring(300, 16, 0.6)),
        animate(c.squashY, 1, spring(300, 16, 0.6)),
      ]);
      return;
    case "bounce":
    default:
      // water-drop bounce away from the edge, then settle
      await animate(c.lift, vertical ? -14 : -22, springs.bounce);
      await animate(c.lift, 0, springs.bounce);
  }
}

// ---- magnification ----

/** The spring the icons' swell follows the pointer with. */
export function magnifySpring(feel: string): { mass: number; stiffness: number; damping: number } {
  switch (feel) {
    case "snappy":
      return { mass: 0.06, stiffness: 420, damping: 30 };
    case "bouncy":
      return { mass: 0.1, stiffness: 230, damping: 9 };
    case "liquid":
      return { mass: 0.22, stiffness: 130, damping: 13 };
    case "soft":
    default:
      return springs.magnify;
  }
}

// ---- the menu bar ----

/** How long each menu bar preset takes to leave, in ms at normal speed. The
 *  window keeps the room for it until then (see MenuBarApp). */
const MENU_EXIT_MS: Record<string, number> = {
  goo: 420,
  spring: 260,
  unfurl: 300,
  reveal: 340,
  drift: 260,
  fade: 150,
  none: 0,
};

export function menuExitMs(preset: string, speed = 1): number {
  const ms = MENU_EXIT_MS[preset] ?? MENU_EXIT_MS.goo;
  return ms === 0 ? 0 : Math.ceil(ms / speed) + 20;
}

/** How long the Start menu takes to leave, per preset (the page waits this before hiding the window). */
// (the tokens' own times: see the `--st-out` rules in start.css, which say the same)
const START_EXIT_MS: Record<string, number> = {
  rise: time.standard * 1000,
  bloom: time.standard * 1000,
  genie: time.settle * 1000,
  slide: time.standard * 1000,
  fade: time.quick * 1000,
  none: 0,
};

export function startExitMs(preset: string, speed = 1): number {
  const ms = START_EXIT_MS[preset] ?? START_EXIT_MS.rise;
  return ms === 0 ? 0 : Math.ceil(ms / speed) + 20;
}

/** Read this part of the settings, with anything missing filled in. */
export function animationsOf(settings: { animations?: Partial<AnimationSettings> } | null): AnimationSettings {
  const a = settings?.animations ?? {};
  return {
    menu: a.menu ?? "goo",
    flyout: a.flyout ?? "bloom",
    dockReveal: a.dockReveal ?? "slide",
    launch: a.launch ?? "bounce",
    magnify: a.magnify ?? "soft",
    start: a.start ?? "rise",
  };
}
