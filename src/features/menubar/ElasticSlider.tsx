/**
 * A slider with some give in it, for the Control Center's volume.
 *
 * The knob does not sit exactly under the pointer: it is on a spring, so it
 * follows a little behind, overshoots slightly and settles. While it moves it
 * stretches along its travel and squashes across it, more the faster it goes.
 * Holding it makes it swell. Dragging past either end pulls it out past the
 * end of the track against growing resistance (the track stretches with it)
 * and it snaps back when let go.
 *
 * The bar is filled up to the far edge of the knob, under it. A muted slider has no fill
 * at all, wherever the knob is, and the fill grows back from nothing when it
 * is unmuted.
 *
 * Springs only run while something is moving, so a resting slider costs
 * nothing.
 */

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

/** Diameter of the knob, which is also the height of the track. */
const KNOB = 24;
/** Furthest the knob can be pulled past either end, in px. */
const PULL_MAX = 14;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Resistance: the knob follows the pointer less and less the further it is
 *  taken past the end, up to `PULL_MAX`. */
const rubber = (distance: number) => PULL_MAX * (1 - Math.exp(-distance / 46));

interface ElasticSliderProps {
  /** 0 to 100. */
  value: number;
  muted: boolean;
  label: string;
  onChange: (value: number) => void;
  /** Called with true when a drag starts and false when it ends. */
  onDragging?: (dragging: boolean) => void;
}

export function ElasticSlider({ value, muted, label, onChange, onDragging }: ElasticSliderProps) {
  const root = useRef<HTMLDivElement>(null);
  const width = useRef(0);
  const dragging = useRef(false);
  const lastEmitted = useRef(value);
  // the value as of the latest render, for the resize handler below, which is
  // made once and would otherwise keep the value the slider was mounted with
  // (nothing yet, for a panel that reads the volume after it has appeared)
  const latest = useRef(value);
  latest.current = value;
  const [held, setHeld] = useState(false);

  /** Distance the knob travels, in px. */
  const travel = () => Math.max(1, width.current - KNOB);

  // where the knob should be, and the spring that gets it there
  const target = useMotionValue(0);
  const x = useSpring(target, { stiffness: 560, damping: 31, mass: 0.7 });

  // pulled past an end: where the pointer is, and the spring following it
  const pullTarget = useMotionValue(0);
  const pull = useSpring(pullTarget, { stiffness: 340, damping: 15, mass: 0.8 });

  // held down
  const hold = useSpring(0, { stiffness: 520, damping: 24 });
  const knobScale = useTransform(hold, [0, 1], [1, 1.16]);
  const trackThick = useTransform(hold, [0, 1], [1, 1.1]);

  // stretch along the direction of travel with speed, squash across it
  const speed = useTransform(useVelocity(x), (v) => Math.min(Math.abs(v) / 2200, 1));
  const stretch = useSpring(speed, { stiffness: 420, damping: 26 });
  const knobSx = useTransform(stretch, [0, 1], [1, 1.32]);
  const knobSy = useTransform(stretch, [0, 1], [1, 0.9]);

  const knobX = useTransform([x, pull], ([a, b]: number[]) => a + b);

  // The fill runs to the far edge of the knob, and is nothing when muted. Its
  // end is rounded to the knob's own radius, so the end sits exactly behind the
  // knob and is never seen: a bar that stopped at the middle of the knob left its
  // rounded tip showing either side of it.
  const filled = useSpring(muted ? 0 : 1, { stiffness: 300, damping: 30 });
  const fillWidth = useTransform([x, pull, filled], ([a, b, f]: number[]) =>
    Math.max(0, (a + b + KNOB) * f),
  );

  // the track stretches when the knob is pulled past an end, from the far end
  const trackSx = useTransform(pull, (p) => 1 + (Math.abs(p) / Math.max(width.current, 1)) * 1.4);
  const trackSy = useTransform(
    [pull, trackThick],
    ([p, t]: number[]) => t * (1 - (Math.abs(p) / PULL_MAX) * 0.06),
  );
  const trackOrigin = useTransform(pull, (p) => (p < 0 ? "100% 50%" : "0% 50%"));

  // measured before the first paint, so the knob starts where it belongs
  // instead of sliding in from the left
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      width.current = el.offsetWidth;
      if (!dragging.current) {
        target.set((latest.current / 100) * travel());
      }
    };
    measure();
    x.jump(target.get());
    filled.jump(muted ? 0 : 1);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
    // once: later changes of the value go through the effect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // follow the value when it changes from outside (the system volume, a key)
  useLayoutEffect(() => {
    lastEmitted.current = value;
    if (!dragging.current) target.set((value / 100) * travel());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useLayoutEffect(() => {
    filled.set(muted ? 0 : 1);
  }, [muted, filled]);

  /** Move the knob to the pointer, and tell the parent if the value changed. */
  const track = (clientX: number) => {
    const el = root.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // `rect` can be scaled while the panel animates in; offsetWidth cannot
    const scale = rect.width / Math.max(el.offsetWidth, 1) || 1;
    const px = (clientX - rect.left) / scale - KNOB / 2;
    const t = travel();
    const raw = px / t;
    const inside = clamp(raw, 0, 1);
    target.set(inside * t);
    const beyond = raw < 0 ? px : raw > 1 ? px - t : 0;
    pullTarget.set(beyond === 0 ? 0 : Math.sign(beyond) * rubber(Math.abs(beyond)));
    const next = Math.round(inside * 100);
    if (next !== lastEmitted.current) {
      lastEmitted.current = next;
      onChange(next);
    }
  };

  const release = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setHeld(false);
    hold.set(0);
    pullTarget.set(0);
    target.set((lastEmitted.current / 100) * travel());
    onDragging?.(false);
  };

  const nudge = (by: number) => {
    const next = clamp(Math.round(lastEmitted.current + by), 0, 100);
    if (next === lastEmitted.current) return;
    lastEmitted.current = next;
    target.set((next / 100) * travel());
    onChange(next);
  };

  return (
    <div
      ref={root}
      className="es"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={muted ? "Muted" : `${value}%`}
      data-held={held}
      data-muted={muted}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        setHeld(true);
        hold.set(1);
        onDragging?.(true);
        track(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) track(e.clientX);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      onWheel={(e) => nudge(-Math.sign(e.deltaY) * 3)}
      onKeyDown={(e) => {
        const by =
          e.key === "ArrowRight" || e.key === "ArrowUp"
            ? 2
            : e.key === "ArrowLeft" || e.key === "ArrowDown"
              ? -2
              : e.key === "PageUp"
                ? 10
                : e.key === "PageDown"
                  ? -10
                  : e.key === "Home"
                    ? -100
                    : e.key === "End"
                      ? 100
                      : 0;
        if (by === 0) return;
        e.preventDefault();
        nudge(by);
      }}
    >
      <motion.div
        className="es-track"
        style={{ scaleX: trackSx, scaleY: trackSy, transformOrigin: trackOrigin }}
      >
        <motion.div className="es-fill" style={{ width: fillWidth }} />
      </motion.div>
      <motion.div
        className="es-knob"
        style={{ x: knobX, scale: knobScale, scaleX: knobSx, scaleY: knobSy }}
      />
    </div>
  );
}
