/**
 * A picker for one kind of animation: a row of named presets and, under it, a
 * stage that plays the chosen one. The stage replays when the choice changes
 * and when it is clicked, so every preset can be seen before it is picked.
 *
 * The previews are the real thing, not pictures of it: the menu bar's own
 * classes and keyframes, the dock's own bar and icons, and the same preset
 * functions the dock calls (see engine/animation/presets.ts), so a preview
 * cannot drift from what it stands for.
 */

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  magnifySpring,
  menuExitMs,
  panelMotion,
  playLaunch,
  revealMotion,
  type PresetInfo,
} from "../../engine/animation/presets";
import "../menubar/menubar.css";
import "./animations.css";

interface PickerProps {
  label: string;
  /** What this setting changes, in a line. */
  summary: string;
  value: string;
  options: PresetInfo[];
  onChange: (id: string) => void;
  /** The stage's content for a preset; `run` changes to ask for a replay. */
  preview: (id: string, run: number) => ReactNode;
}

export function AnimationPicker({ label, summary, value, options, onChange, preview }: PickerProps) {
  // bumped to replay: when the choice changes, and when the stage is clicked
  const [run, setRun] = useState(0);
  const chosen = options.find((o) => o.id === value) ?? options[0];

  return (
    <div className="anim-picker">
      <div className="anim-head">
        <span className="ctl-label">{label}</span>
        <span className="anim-summary">{summary}</span>
      </div>
      <div className="anim-chips" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.id}
            className="anim-chip"
            role="radio"
            aria-checked={o.id === value}
            data-on={o.id === value}
            title={o.hint}
            onClick={() => {
              if (o.id !== value) onChange(o.id);
              setRun((n) => n + 1);
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <button
        className="anim-stage"
        onClick={() => setRun((n) => n + 1)}
        title="Replay"
        aria-label={`Replay the ${chosen.label} animation`}
      >
        {preview(value, run)}
        <span className="anim-replay" aria-hidden>
          ↻ {chosen.hint}
        </span>
      </button>
    </div>
  );
}

// ---- previews ----

/** How long a preview holds the thing it shows before taking it away again. */
const HOLD_MS = 1500;

/** A timeline of one cycle: in at once, out after `HOLD_MS`, gone `exitMs`
 *  later. Restarts when `run` or `key` changes. */
function useCycle(key: string, run: number, exitMs: number) {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");
  useEffect(() => {
    setPhase("in");
    const out = setTimeout(() => setPhase("out"), HOLD_MS);
    const gone = setTimeout(() => setPhase("gone"), HOLD_MS + exitMs);
    return () => {
      clearTimeout(out);
      clearTimeout(gone);
    };
  }, [key, run, exitMs]);
  return phase;
}

/** A menu bar menu, using the bar's own styles. */
export function MenuPreview({ preset, run, speed }: { preset: string; run: number; speed: number }) {
  const phase = useCycle(preset, run, menuExitMs(preset, speed));
  return (
    <div
      className="menubar-root anim-menu-stage"
      data-anim={preset}
      style={{ ["--anim-speed" as string]: speed } as React.CSSProperties}
    >
      <div className="menubar" data-rim="true">
        <div className="mb-side">
          <span className="mb-item anim-bar-item">
            <span className="anim-orb" />
          </span>
          <span className="mb-item anim-bar-item anim-bar-text" />
        </div>
        <div className="mb-side">
          <span className="mb-item anim-bar-item anim-bar-text" />
          <span className="mb-item anim-bar-item" data-active={phase === "in"}>
            <span className="anim-toggle" />
          </span>
          <span className="mb-item anim-bar-item anim-bar-text" />
        </div>
      </div>
      {phase !== "gone" && (
        <div className="mb-panel anim-mini-panel" data-leaving={phase === "out"} data-instant="false">
          <div className="cc">
            <div className="cc-card anim-line-card">
              <span className="anim-line" style={{ width: "55%" }} />
              <span className="anim-line" style={{ width: "85%" }} />
            </div>
            <div className="cc-card anim-line-card">
              <span className="anim-line" style={{ width: "40%" }} />
              <span className="anim-track" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** A dock flyout, using the same preset function as the real ones, opening
 *  above a miniature dock. */
export function FlyoutPreview({ preset, run, speed }: { preset: string; run: number; speed: number }) {
  const pm = useMemo(() => panelMotion(preset, "bottom", speed), [preset, speed]);
  const phase = useCycle(preset, run, 320);
  return (
    <div className="anim-flyout-stage">
      <AnimatePresence>
        {phase !== "out" && phase !== "gone" && (
          <motion.div
            key={`${preset}-${run}`}
            className="glass anim-flyout"
            style={{ transformOrigin: pm.origin }}
            initial={pm.initial}
            animate={pm.animate}
            exit={pm.exit}
            transition={pm.transition}
          >
            <span className="anim-line" style={{ width: "46%" }} />
            <div className="anim-flyout-grid">
              <span className="anim-thumb" />
              <span className="anim-thumb" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="glass anim-mini-dock">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="anim-dot" data-i={i} />
        ))}
      </div>
    </div>
  );
}

const DOT_COLORS = ["#4fb3ff", "#6ee0b0", "#ffc861", "#ff8f8f", "#b894ff", "#7be0ff"];

/** The dock appearing and going, with the real bar and the real Cascade rules. */
export function RevealPreview({ preset, run, speed }: { preset: string; run: number; speed: number }) {
  const m = useMemo(() => revealMotion(preset, "bottom", false, speed), [preset, speed]);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    setHidden(false);
    const out = setTimeout(() => setHidden(true), HOLD_MS);
    const back = setTimeout(() => setHidden(false), HOLD_MS + m.hideMs + 350);
    return () => {
      clearTimeout(out);
      clearTimeout(back);
    };
  }, [preset, run, m.hideMs]);
  return (
    <div
      className="dock-viewport anim-reveal-stage"
      data-edge="bottom"
      data-anim={preset}
      data-reveal={hidden ? "out" : "in"}
      style={{ ["--anim-speed" as string]: speed } as React.CSSProperties}
    >
      <motion.div
        key={`${preset}-${run}`}
        className="dock-bar glass glass-open anim-reveal-bar"
        style={{ transformOrigin: m.origin }}
        initial={m.initial}
        animate={hidden ? m.hidden : m.shown}
      >
        {DOT_COLORS.map((c, i) => (
          <span key={c} className="anim-slot">
            <span className="dock-icon-float" style={{ ["--i" as string]: i } as React.CSSProperties}>
              <span className="anim-icon" style={{ background: c }} />
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/** An icon being launched. */
export function LaunchPreview({ preset, run }: { preset: string; run: number }) {
  const lift = useMotionValue(0);
  const squashX = useMotionValue(1);
  const squashY = useMotionValue(1);
  useEffect(() => {
    lift.set(0);
    squashX.set(1);
    squashY.set(1);
    // a short beat first, so the replay is seen starting
    const t = setTimeout(() => {
      void playLaunch(preset, { lift, squashX, squashY }, false);
    }, 250);
    return () => clearTimeout(t);
  }, [preset, run, lift, squashX, squashY]);
  return (
    <div className="anim-launch-stage">
      <div className="glass anim-mini-dock">
        {DOT_COLORS.slice(0, 5).map((c, i) => (
          <span key={c} className="anim-slot">
            {i === 2 ? (
              <motion.span
                className="anim-icon"
                style={{ background: c, y: lift, scaleX: squashX, scaleY: squashY, transformOrigin: "50% 100%" }}
              />
            ) : (
              <span className="anim-icon" style={{ background: c }} />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

/** One icon of the magnification demo: it swells as the pretend pointer nears. */
function MagDot({ index, pointer, feel, color }: { index: number; pointer: MotionValue<number>; feel: string; color: string }) {
  const target = useTransform(pointer, (p) => {
    const d = Math.abs(p - index);
    return 26 + Math.max(0, 1 - d / 2.2) * 24;
  });
  const size = useSpring(target, magnifySpring(feel));
  return <motion.span className="anim-icon" style={{ width: size, height: size, background: color }} />;
}

/** The pointer sweeps along a row of icons and back, and they swell after it. */
export function MagnifyPreview({ feel, run }: { feel: string; run: number }) {
  const pointer = useMotionValue(-1.5);
  useEffect(() => {
    pointer.set(-1.5);
    let cancelled = false;
    const sweep = async () => {
      await animate(pointer, 6.5, { duration: 1.6, ease: "easeInOut" });
      if (cancelled) return;
      await animate(pointer, 2.2, { duration: 0.7, ease: "easeInOut" });
    };
    void sweep();
    return () => {
      cancelled = true;
    };
  }, [feel, run, pointer]);
  return (
    <div className="anim-launch-stage anim-mag-stage">
      <div className="glass anim-mini-dock anim-mag-dock">
        {DOT_COLORS.concat("#ffd0e8").map((c, i) => (
          <span key={c} className="anim-slot anim-mag-slot">
            <MagDot index={i} pointer={pointer} feel={feel} color={c} />
          </span>
        ))}
      </div>
    </div>
  );
}
