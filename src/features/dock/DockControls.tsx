/**
 * The dock's own controls: the Liquidock button (Start) and settings.
 *
 * Settings is a round glass button with a single clean symbol on it, after
 * Apple's: a gear, drawn in one weight with round ends. The
 * symbol is the light one the menu bar's icons use, on glass tinted with the
 * theme's color, with a soft shadow that lifts it off the glass.
 */

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { effectsBus } from "../../engine/effects/effectsBus";
import { spring } from "../../engine/motion/tokens";
import { useGlass } from "../../engine/backdrop/useGlass";
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";
import { Droplet } from "../../engine/brand/droplet";
import { DROP_PATH } from "../../engine/brand/dropletSvg";

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  const dockGlass = useGlass("dock");
  return (
    <button className="dock-control-btn" title={label} aria-label={label} onClick={onClick}>
    <BackdropLayer active={dockGlass.active} blur={dockGlass.blur} grain={dockGlass.grain} tint="own" />
      <svg viewBox="0 0 24 24">{children}</svg>
    </button>
  );
}

/** The drop's outline as a picture, for the click effects to mask and outline themselves by (they read an image). */
let dropShape: HTMLImageElement | null = null;
function dropShapeImage(): HTMLImageElement {
  if (!dropShape) {
    dropShape = new Image();
    dropShape.src = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200"><path d="${DROP_PATH}" fill="#fff"/></svg>`)}`;
  }
  return dropShape;
}

/**
 * The Liquidock button, where the search button was: Liquidock's drop, opening Start the way the Windows button does
 * on the taskbar. As the pointer comes onto it, one of the click effects plays on it (Settings › Dock items: the same
 * Press Dimple, Edge Halo, Shine Sweep and Light Bloom an app's icon plays when clicked, with their own tuning), drawn
 * by the dock's effects layer over the drop's own outline (`glint`, EffectsLayer). It used to have shines of its own
 * (a CSS glint, swell and rim trace); the owner preferred the click effects.
 */
type Tune = { speed?: number; opacity?: number; size?: number; color?: string } | undefined;

/**
 * Where the Liquidock button sits in the bar, with its divider: always open, or (Settings › Dock items › Where it is:
 * near the end) shut until the pointer nears the bar's start, then sprung open (spring.settle), the bar growing to
 * take it in, and shut again once the pointer has moved on past the divider. Shut, it is nothing: no width, and the
 * bar's gap after it taken back (`--open`), so the dock looks as if it had no button at all. It hides what does not
 * fit only while it moves, so the drop's shadow is not cut off at rest.
 */
export function StartSlot({ open, vertical, still, children }: { open: boolean; vertical: boolean; still: boolean; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const natural = useRef(0);
  const progress = useMotionValue(open ? 1 : 0);
  const size = useMotionValue(open ? -1 : 0);
  const [settled, setSettled] = useState(true);
  const opacity = useTransform(progress, [0, 0.45, 1], [0, 0.5, 1]);

  const follow = (p: number) => {
    size.set(p >= 0.999 ? -1 : p * natural.current);
    setSettled(p >= 0.999 || p <= 0.001);
  };
  useMotionValueEvent(progress, "change", follow);

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => {
      natural.current = vertical ? el.offsetHeight : el.offsetWidth;
      follow(progress.get());
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vertical]);

  useEffect(() => {
    if (still) {
      progress.set(open ? 1 : 0);
      return;
    }
    const run = animate(progress, open ? 1 : 0, spring.settle);
    return () => run.stop();
  }, [open, still, progress]);

  // -1 is the slot's own size (open and at rest): what it holds may change size, and the slot follows it exactly
  const dim = useTransform(size, (s) => (s < 0 ? "auto" : `${s}px`));
  return (
    <motion.div
      className="dock-start-slot"
      data-open={open || undefined}
      style={{
        [vertical ? "height" : "width"]: dim,
        overflow: settled ? (progress.get() > 0.5 ? "visible" : "hidden") : "hidden",
        opacity,
        ["--open" as string]: progress,
      }}
    >
      <div ref={inner} className="dock-start-inner">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * Its look (`look`, Settings › Dock items): the drop's body in the theme's colour as solid glass (`solid`, the
 * default), the frosted drop with a fine dark rim round its outline (`outline`), or the frosted drop in a groove pressed
 * into the bar (`well`, in `wellColor` or dark glass). What plays on it on hover and on a click are each one of the
 * click effects, chosen apart.
 */
export function LiquidockButton({
  onClick,
  effect,
  tune,
  clickEffect,
  clickTune,
  look = "solid",
  wellColor = "",
}: {
  onClick: () => void;
  effect: string;
  tune: Tune;
  clickEffect?: string;
  clickTune?: Tune;
  look?: "solid" | "outline" | "well";
  wellColor?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const play = (which: string | undefined, how: Tune) => {
    const el = ref.current;
    if (!el || !which) return;
    effectsBus.emit("glint", {
      effect: which,
      tune: how,
      winW: window.innerWidth,
      winH: window.innerHeight,
      track: () => {
        if (!el.isConnected) return null;
        // the drop itself, not the well round it
        const mark = el.querySelector(".dock-drop-mark") ?? el;
        const r = mark.getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height };
      },
      iconSource: () => dropShapeImage(),
    });
  };
  return (
    <button
      ref={ref}
      className="dock-drop-btn"
      data-look={look}
      style={look === "well" && wellColor ? ({ ["--well" as string]: wellColor } as React.CSSProperties) : undefined}
      title="Start"
      aria-label="Start"
      onClick={() => {
        play(clickEffect, clickTune);
        onClick();
      }}
      onPointerEnter={() => play(effect, tune)}
    >
      <Droplet size={100} className="dock-drop-mark" solid={look === "solid"} />
    </button>
  );
}

/**
 * A gear of eight teeth with rounded corners and a round hole, built from its
 * geometry so the teeth are even: each tooth is a short flat top on a wider
 * root, and the valleys between are arcs of one circle.
 */
const GEAR_TEETH = 8;
const GEAR_OUTER = 10;
const GEAR_ROOT = 7.7;
function gearPath(): string {
  const at = (radius: number, degrees: number) => {
    const a = (degrees * Math.PI) / 180;
    return `${(12 + radius * Math.sin(a)).toFixed(2)} ${(12 - radius * Math.cos(a)).toFixed(2)}`;
  };
  const pitch = 360 / GEAR_TEETH;
  const top = 8.5;
  const foot = 14.5;
  let d = "";
  for (let i = 0; i < GEAR_TEETH; i++) {
    const c = i * pitch;
    d += `${i === 0 ? "M" : "A " + GEAR_ROOT + " " + GEAR_ROOT + " 0 0 1"} ${at(GEAR_ROOT, c - foot)} `;
    d += `L ${at(GEAR_OUTER, c - top)} `;
    d += `A ${GEAR_OUTER} ${GEAR_OUTER} 0 0 1 ${at(GEAR_OUTER, c + top)} `;
    d += `L ${at(GEAR_ROOT, c + foot)} `;
  }
  return `${d}A ${GEAR_ROOT} ${GEAR_ROOT} 0 0 1 ${at(GEAR_ROOT, -foot)} Z`;
}
const GEAR = gearPath();

export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <ControlButton label="Liquidock settings" onClick={onClick}>
      {/* the hole is cut out of the gear, so what is behind shows through it */}
      <path
        d={`${GEAR} M 8.5 12 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 Z`}
        fill="currentColor"
        fillRule="evenodd"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        transform="translate(12 12) scale(0.94) translate(-12 -12)"
      />
    </ControlButton>
  );
}
