/**
 * The springs the dock's own pieces use, named for what they do. The vocabulary they are made of is in
 * `engine/motion/tokens.ts` (quick, standard, settle, heavy); what is here is where each of them is used.
 */

import { character, spring } from "../motion/tokens";

export const springs = {
  /** Icon magnification following the cursor (tuned by the feel chosen; see `magnifySpring`). */
  magnify: { mass: 0.08, stiffness: 190, damping: 16 },
  /** Launch bounce: a character, playful but quick to settle. */
  bounce: character.bounce,
  /** Drag: icons feel like they're suspended in water. */
  drag: { stiffness: 260, damping: 22, mass: 0.5 },
  /** Neighbours getting out of the way during a reorder. Stiffer than
   * `drag` on purpose: the gap has to open before the cursor arrives,
   * or the drag reads as laggy even though the tile is tracking 1:1. */
  reorder: spring.quick,
  /** Panels/menus blooming open. */
  bloom: spring.settle,
  /** Dock slide for auto-hide. */
  slide: spring.heavy,
} as const;
/** Idle float: gentle vertical drift, phase-offset per icon. The drift itself
 *  is drawn by dock.css from a phase DockBar writes; this is its timing. The
 *  amplitude is written in the stylesheet beside the curve it scales. */
export const idleFloat = {
  amplitude: 1.6, // px
  period: 5.2, // seconds
  /** How much later in the cycle each icon is than the one before. */
  stagger: 0.9, // seconds
  /** How often the phase is written: 20 times a second. The motion is under
   *  2px a second, so a step is about a tenth of a pixel and this is as smooth
   *  as it looks, at an eighth of a fast display's rate. */
  updateMs: 50,
};
