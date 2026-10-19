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
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { EdgeHalo, Fx2D, LightBloom, PressDimple, ShineSweep, tuneOf } from "../../engine/effects/fx2d";
import type { ClickTune } from "../../ipc/types";
import {
  islandExitMs,
  islandMotion,
  magnifySpring,
  menuExitMs,
  panelMotion,
  playLaunch,
  revealMotion,
  startExitMs,
  type PresetInfo,
} from "../../engine/animation/presets";
import "../menubar/menubar.css";
import "../start/start.css";
import "./animations.css";
import { Droplet } from "../../engine/brand/droplet";
import { useSettings } from "../../state/settingsStore";

interface PickerProps {
  label: string;
  /** What this setting changes, in a line. */
  summary: string;
  value: string;
  options: PresetInfo[];
  onChange: (id: string) => void;
  /** The stage's content for a preset; `run` changes to ask for a replay. */
  preview: (id: string, run: number) => ReactNode;
  /** More controls for what is chosen, in the same card under the stage (the click effect's tuning). */
  children?: ReactNode;
}

export function AnimationPicker({ label, summary, value, options, onChange, preview, children }: PickerProps) {
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
      {children}
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
            <Droplet size={11} className="anim-orb" />
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

/** The media pill in the bar, and the card that hangs from the Control Center button, coming out and going back by the
 *  same function the real ones use. */
export function IslandPreview({ preset, run, speed }: { preset: string; run: number; speed: number }) {
  const phase = useCycle(preset, run, islandExitMs(preset, speed) + 200);
  const pill = useMemo(() => islandMotion(preset, "pill", speed, 150), [preset, speed]);
  const card = useMemo(() => islandMotion(preset, "card", speed), [preset, speed]);
  const out = phase === "in";
  return (
    <div
      className="menubar-root anim-menu-stage"
      data-anim="none"
      style={{ ["--anim-speed" as string]: speed } as React.CSSProperties}
    >
      <div className="menubar" data-rim="true">
        <div className="mb-side">
          <span className="mb-item anim-bar-item">
            <Droplet size={11} className="anim-orb" />
          </span>
          <span className="mb-item anim-bar-item anim-bar-text" />
        </div>
        <div className="mb-island-layer">
          <div className="mb-island-zone" style={{ ["--isl-w" as string]: "150px" }}>
            <motion.div key={`${preset}-${run}`} className="mb-island" data-anim={preset} initial={pill.closed} animate={out ? pill.open : pill.closed}>
              <motion.div
                className="mb-island-body"
                style={{ width: 150 }}
                initial={false}
                animate={out ? { opacity: 1, transition: { delay: pill.bodyDelay, duration: 0.24 } } : { opacity: 0, transition: { duration: 0.1 } }}
              >
                <span className="anim-art isl-mini-art" />
                <span className="anim-line isl-mini-line" />
                <span className="isl-mini-dots">
                  <i />
                  <i />
                  <i />
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="mb-side">
          <span className="mb-item anim-bar-item anim-bar-text" />
          <span className="mb-item anim-bar-item" data-active={out}>
            <span className="anim-toggle" />
          </span>
          <span className="mb-item anim-bar-item anim-bar-text" />
        </div>
      </div>
      <motion.div
        key={`card-${preset}-${run}`}
        className="mb-panel mb-peek anim-mini-panel"
        data-instant="true"
        initial={card.closed}
        animate={out ? card.open : card.closed}
      >
        <div className="cc">
          <div className="cc-card anim-line-card">
            <span className="anim-line" style={{ width: "60%" }} />
            <span className="anim-line" style={{ width: "38%" }} />
            <span className="anim-track" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/** The Start menu, using its own panel and keyframes, in miniature. */
export function StartPreview({ preset, run, speed }: { preset: string; run: number; speed: number }) {
  const phase = useCycle(preset, run, startExitMs(preset, speed));
  return (
    <div
      className="st-root st-mini"
      data-anim={preset}
      data-phase={phase === "in" ? "open" : phase === "out" ? "closing" : "closed"}
      style={{ ["--anim-speed" as string]: speed } as React.CSSProperties}
    >
      <div className="st-panel">
        <span className="anim-line st-mini-search" />
        <div className="st-mini-grid">
          {DOT_COLORS.map((c) => (
            <span key={c} className="anim-icon" style={{ background: c }} />
          ))}
        </div>
      </div>
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

/** A packed-int tint for the preview, in `fx2d.ts`'s own `rgba(color, alpha)` form (not a CSS string): close to
 *  the app's default accent, not read from the live theme — this stage uses its own fixed `DOT_COLORS` too. */
const PREVIEW_TINT = 0x4db2f0;

/** A stand-in for a real extracted icon: a filled rounded square well inside its own canvas, with real
 *  transparent padding round it — a flat CSS-colored tile has no padding to speak of, so it could not show
 *  `dimple`/`shine` actually staying off that empty margin instead of pressed into it. */
function paddedIconSrc(hex: string): string {
  // drawn larger than its slot (see `.anim-icon-padded`) so that the square itself is its neighbours' size
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="14" y="14" width="72" height="72" rx="17" fill="${hex}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * The click-effect preview: the real `Fx2D` engine and the real effect classes (`engine/effects/fx2d.ts`), spawned
 * on a small canvas held over the hero icon, exactly as `EffectsLayer` does in the dock itself — so, as with every
 * other preview here, this cannot drift from what actually plays. `dimple`/`halo`/`shine` track the hero icon's
 * live rect every frame, same as the real dock does for a magnified icon; this icon does not magnify, so the
 * preview mostly proves the shape is right, not the live-tracking (that needs the dock itself, or an off-screen
 * scenario that sweeps the pointer across a real icon).
 */
export function ClickPreview({ preset, run, tune }: { preset: string; run: number; tune?: Partial<ClickTune> }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const engineRef = useRef<Fx2D | null>(null);
  const bloom = useSettings((s) => s.settings?.appearance.bloomAmount ?? 0.7);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const engine = new Fx2D(canvas);
    engineRef.current = engine;
    const sizeIt = () => {
      const r = stage.getBoundingClientRect();
      engine.resize(r.width, r.height);
    };
    sizeIt();
    const observer = new ResizeObserver(sizeIt);
    observer.observe(stage);
    return () => {
      observer.disconnect();
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    const icon = iconRef.current;
    const stage = stageRef.current;
    if (!engine || !icon || !stage) return;
    // the icon's live bounds in window space — called fresh every frame by dimple/halo/shine, the same contract
    // `DockIcon.tsx` gives the real engine. `toCanvas` is the one place that subtracts the stage's own position;
    // `track` returning stage-relative coordinates too would subtract it twice over, pushing everything off the
    // canvas without an error anywhere to say so (found off screen: draws were happening, with a sensible rect,
    // every frame for the effect's whole life — just invisible, because `origin` landed far outside the canvas).
    const track = () => {
      if (!icon.isConnected) return null;
      const r = icon.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    };
    const toCanvas = (x: number, y: number) => {
      const s = stage.getBoundingClientRect();
      return { x: x - s.left, y: y - s.top };
    };
    // the same contract DockIcon.tsx's handler builds for the real engine
    const iconSource = () => (icon.isConnected ? icon : null);
    const tuned = tuneOf(tune);
    // a short beat first, so the replay is seen starting (same as LaunchPreview)
    const t = setTimeout(() => {
      switch (preset) {
        case "halo":
          engine.spawn(new EdgeHalo(track, toCanvas, iconSource, tuned));
          return;
        case "shine":
          engine.spawn(new ShineSweep(track, toCanvas, iconSource, tuned));
          return;
        case "bloom":
          engine.spawn(new LightBloom(track, toCanvas, iconSource, PREVIEW_TINT, bloom, tuned));
          return;
        case "dimple":
        default:
          engine.spawn(new PressDimple(track, toCanvas, iconSource, 0.5, 0.5, tuned));
      }
    }, 250);
    return () => clearTimeout(t);
    // replayed when a chip or the stage is clicked, and when a tuning slider comes to rest (each step of it starts
    // the beat above again, so it plays once, a quarter second after the slider stops)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, run, JSON.stringify(tune ?? null)]);

  // the canvas covers the whole stage, not just the little dock, so a glow reaching past the icons is not cut off
  return (
    <div ref={stageRef} className="anim-launch-stage">
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }} aria-hidden />
      <div className="glass anim-mini-dock" style={{ position: "relative" }}>
        {DOT_COLORS.slice(0, 5).map((c, i) =>
          i === 2 ? (
            <span key={c} className="anim-slot">
              <img ref={iconRef} className="anim-icon anim-icon-padded" src={paddedIconSrc(c)} alt="" draggable={false} />
            </span>
          ) : (
            <span key={c} className="anim-slot">
              <span className="anim-icon" style={{ background: c }} />
            </span>
          ),
        )}
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
