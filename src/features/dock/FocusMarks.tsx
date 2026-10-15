/**
 * The "focus" way of marking running apps (Settings > Dock > Running apps): one mark, a pill or the glowing dot, under
 * the app in front, and a ghost of it, an outline, under the app the pointer is on. Each is drawn inside the icon it
 * belongs under and carries a shared `layoutId`, so when it moves to another icon the animation library carries it
 * there from where it was (and it rides with the icon through magnification, as the dots do). Clicking the app the
 * ghost is under brings it to the front: the ghost goes and the mark itself travels over to take its place.
 *
 * How each travels is a setting: glide, bounce, snap, float, or fade (no travel: it fades out where it was and in where
 * it goes).
 */

import { AnimatePresence, motion, type Transition } from "motion/react";
import type { MarkMotion } from "../../ipc/types";

/** How the mark travels to another icon, by setting. */
const TRAVEL: Record<Exclude<MarkMotion, "fade">, Transition> = {
  glide: { type: "spring", stiffness: 520, damping: 44, mass: 0.8 },
  bounce: { type: "spring", stiffness: 430, damping: 15, mass: 0.8 },
  snap: { type: "tween", duration: 0.14, ease: [0.2, 0.8, 0.2, 1] },
  float: { type: "spring", stiffness: 130, damping: 19, mass: 1 },
};

/** How a mark comes and goes where it does not travel (none before it, or fade). */
const APPEAR = { opacity: 1, scale: 1 };
const GONE = { opacity: 0, scale: 0.5 };

interface Props {
  /** This icon's app is the one in front. */
  focused: boolean;
  /** The pointer is on this icon. */
  hovered: boolean;
  shape: "pill" | "dot";
  focusMotion: MarkMotion;
  ghostMotion: MarkMotion;
}

function Mark({ ghost, shape, motion: how }: { ghost: boolean; shape: "pill" | "dot"; motion: MarkMotion }) {
  const fades = how === "fade";
  return (
    <motion.span
      // one of each per dock: the library carries it from the icon it was under to this one
      layoutId={fades ? undefined : ghost ? "dock-ghost-mark" : "dock-focus-mark"}
      className={ghost ? "dock-mark dock-mark-ghost" : "dock-mark"}
      data-shape={shape}
      aria-hidden
      initial={GONE}
      animate={APPEAR}
      exit={{ ...GONE, transition: { duration: ghost ? 0.12 : 0.16 } }}
      transition={{ layout: fades ? undefined : TRAVEL[how], default: { duration: 0.16, ease: [0.2, 0.8, 0.2, 1] } }}
    />
  );
}

export function FocusMarks({ focused, hovered, shape, focusMotion, ghostMotion }: Props) {
  return (
    <AnimatePresence initial={false}>
      {focused && <Mark key="focus" ghost={false} shape={shape} motion={focusMotion} />}
      {hovered && !focused && <Mark key="ghost" ghost shape={shape} motion={ghostMotion} />}
    </AnimatePresence>
  );
}
