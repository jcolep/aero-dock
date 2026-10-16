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

import { useEffect, useRef } from "react";
import { AnimatePresence, animate, motion, type Transition } from "motion/react";
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
  /** How much they stretch with their speed, 0 to 1. */
  stretch: number;
}

/** At full Stretch, how much longer than itself a mark at top speed is drawn (2.8 times). */
const STRETCH_MAX = 1.8;
/** The speed, in px per ms, at which a mark has about two thirds of its stretch. A hop to the next icon peaks at about
 *  0.5; a jump across the dock at 2 or more. */
const STRETCH_SPEED = 0.8;
const SETTLE = { type: "spring", stiffness: 600, damping: 30 } as const;

/**
 * Squash and stretch: while the mark travels, it is drawn longer along the way it is going, by how fast it is going,
 * and a little thinner, so it keeps its weight. The speed is read off the screen each frame of the travel, not
 * worked out from the spring, so it is longest where it is fastest (about midway), gathers back in as it arrives, and
 * stretches again on a bounce's way back. Only while it travels: riding with magnification does not stretch it.
 */
function useStretch(amount: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const now = useRef({ x: 1, y: 1 });
  const settling = useRef<{ stop(): void } | null>(null);
  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      settling.current?.stop();
    },
    [],
  );
  // On the drawing (the mark's ::before, dock.css), not the mark: the animation library owns the mark's transform,
  // and mixes it between the old mark and the new one as it carries it over, which a scale of ours would be caught in
  const draw = (x: number, y: number) => {
    now.current = { x, y };
    ref.current?.style.setProperty("--stretch-x", x.toFixed(3));
    ref.current?.style.setProperty("--stretch-y", y.toFixed(3));
  };

  const centre = () => {
    const r = ref.current?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
  };
  const start = () => {
    cancelAnimationFrame(frame.current);
    settling.current?.stop();
    if (amount <= 0) return;
    // (the first look is on the first frame: at the start the mark is still where it is going, not yet put back where
    // it came from to set off, and that would read as a leap)
    let last: { x: number; y: number } | null = null;
    let then = 0;
    let vx = 0;
    let vy = 0;
    const tick = (now: number) => {
      const at = centre();
      const dt = Math.max(1, now - then);
      if (at && last) {
        // a little smoothing, or a dropped frame reads as a jolt
        vx += ((at.x - last.x) / dt - vx) * 0.5;
        vy += ((at.y - last.y) / dt - vy) * 0.5;
      }
      last = at;
      then = now;
      const s = 1 + amount * STRETCH_MAX * (1 - Math.exp(-Math.hypot(vx, vy) / STRETCH_SPEED));
      const thin = 1 / Math.sqrt(s);
      // along the dock's length: across for a dock along the bottom or top, up and down for one at the side
      const across = Math.abs(vx) >= Math.abs(vy);
      if (across) draw(s, thin);
      else draw(thin, s);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(frame.current);
    const from = now.current;
    if (from.x === 1 && from.y === 1) return;
    settling.current = animate(0, 1, { ...SETTLE, onUpdate: (t) => draw(from.x + (1 - from.x) * t, from.y + (1 - from.y) * t) });
  };
  return { ref, start, stop };
}

function Mark({ ghost, shape, motion: how, stretch }: { ghost: boolean; shape: "pill" | "dot"; motion: MarkMotion; stretch: number }) {
  const fades = how === "fade";
  const s = useStretch(fades ? 0 : stretch);
  return (
    <motion.span
      ref={s.ref}
      // one of each per dock: the library carries it from the icon it was under to this one
      layoutId={fades ? undefined : ghost ? "dock-ghost-mark" : "dock-focus-mark"}
      className={ghost ? "dock-mark dock-mark-ghost" : "dock-mark"}
      data-shape={shape}
      aria-hidden
      onLayoutAnimationStart={s.start}
      onLayoutAnimationComplete={s.stop}
      initial={GONE}
      animate={APPEAR}
      exit={{ ...GONE, transition: { duration: ghost ? 0.12 : 0.16 } }}
      transition={{ layout: fades ? undefined : TRAVEL[how], default: { duration: 0.16, ease: [0.2, 0.8, 0.2, 1] } }}
    />
  );
}

export function FocusMarks({ focused, hovered, shape, focusMotion, ghostMotion, stretch }: Props) {
  return (
    <AnimatePresence initial={false}>
      {focused && <Mark key="focus" ghost={false} shape={shape} motion={focusMotion} stretch={stretch} />}
      {hovered && !focused && <Mark key="ghost" ghost shape={shape} motion={ghostMotion} stretch={stretch} />}
    </AnimatePresence>
  );
}
