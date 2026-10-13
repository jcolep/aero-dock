/**
 * The motion language: every spring, duration and curve the app moves with, in one set of four.
 *
 *   quick     a tap, a hover, a press, something small leaving. No overshoot.
 *   standard  most things: a menu, a flyout, a button settling. Critically damped.
 *   settle    a panel arriving, with a breath of overshoot, so it lands rather than stops.
 *   heavy     a large thing moving a long way (the dock sliding, the overview). Slow, no bounce.
 *
 * Expensive things feel the same everywhere because they move the same way: a new surface uses
 * one of these four and does not invent a fifth. Playful ones (a jelly, a bounce) are *characters*
 * a person picks under Settings > Animations; they are listed below on purpose, apart from the set.
 *
 * The same four are in CSS (`--m-quick`, `--m-standard`, `--m-settle`, `--m-heavy` for time,
 * `--e-out`, `--e-in`, `--e-inout`, `--e-spring`, `--e-overshoot` for curves; see tokens.css), and
 * the two files must agree: `time` here is what the stylesheet has, in seconds.
 *
 * Everything that moves must be interruptible: turned round from where it is, never restarted from
 * its first frame. Springs and CSS transitions do that by themselves; a keyframe animation does
 * not, and is turned back with `reverseEntrance` (menubar/interrupt.ts).
 */

export const spring = {
  quick: { type: "spring", stiffness: 520, damping: 38, mass: 0.5 },
  standard: { type: "spring", stiffness: 340, damping: 30, mass: 0.7 },
  settle: { type: "spring", stiffness: 240, damping: 22, mass: 0.7 },
  heavy: { type: "spring", stiffness: 170, damping: 24, mass: 0.95 },
} as const;

/** Durations of the tweens, in seconds (the CSS `--m-*` are these in ms). */
export const time = { quick: 0.14, standard: 0.24, settle: 0.36, heavy: 0.56 } as const;

/** The curves, as the animation library takes them (the CSS `--e-*` are the same). */
export const ease = {
  out: [0.16, 1, 0.3, 1],
  in: [0.5, 0, 0.75, 0],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** Playful springs: a character someone picks, not the language. */
export const character = {
  pop: { type: "spring", stiffness: 560, damping: 26, mass: 0.55 },
  jelly: { type: "spring", stiffness: 380, damping: 12, mass: 0.6 },
  bounce: { type: "spring", stiffness: 320, damping: 13, mass: 0.6 },
  reveal: { type: "spring", stiffness: 330, damping: 17, mass: 0.75 },
} as const;

/** The gliding lens: its leading edge runs ahead, the trailing edge follows, and it settles. */
export const lens = {
  lead: { type: "spring", stiffness: 640, damping: 36, mass: 0.7 },
  trail: { type: "spring", stiffness: 210, damping: 24, mass: 0.9 },
  settle: { type: "spring", stiffness: 420, damping: 34, mass: 0.8 },
} as const;

/** A spring made faster or slower by the global animation speed (2 is twice as fast). */
export function atSpeed<T extends { stiffness: number }>(s: T, speed: number): T {
  return { ...s, stiffness: s.stiffness * speed };
}