/**
 * The settings window's controls: slider, switch and segmented choice, each a row with its label (and, if it has one,
 * a line under the label saying what it does). Purely presentational; parents own the values.
 *
 * Each row says what kind it is (`ctl-row-slider`, `-toggle`, `-seg`), which is how settings.css lays it out at any
 * width: label and control side by side where there is room, the control under its label where there is not.
 */

import { Roll } from "../../engine/type/Roll";
import { animate, motion, useMotionValue } from "motion/react";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { spring } from "../../engine/motion/tokens";
import { useSubpixelBox } from "../../engine/motion/subpixelBox";
import { useReduced } from "../../engine/accessibility/policy";
import { playCue } from "../../engine/sound/ui";

/** A row's label, and under it what the setting does (two lines at most; the whole of it on hover). */
function Label({ label, hint, htmlFor }: { label: string; hint?: string; htmlFor?: string }) {
  return (
    <div className="ctl-text-block">
      {htmlFor ? (
        <label className="ctl-label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <span className="ctl-label">{label}</span>
      )}
      {hint && (
        <span className="ctl-hint" title={hint}>
          {hint}
        </span>
      )}
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  hint?: string;
  /** Apply the value only when the slider is let go, not on every step of
   *  the drag. The thumb and the readout still follow the drag. For settings
   *  whose every change makes Rust rebuild windows or re-claim screen space,
   *  where a drag would otherwise do that dozens of times a second. */
  commitOnRelease?: boolean;
}

export function AeroSlider({ label, value, min, max, step = 0.01, format, onChange, hint, commitOnRelease = false }: SliderProps) {
  const id = useId();
  // the value last heard: a notch as it moves a tenth of the way along, up or down (the throttle keeps a fast drag a trickle)
  const heard = useRef(value);
  // the value being dragged to, until it is let go (commitOnRelease only)
  const [draft, setDraft] = useState<number | null>(null);
  const shown = draft ?? value;
  const pct = ((shown - min) / (max - min)) * 100;

  const commit = () => {
    if (draft === null) return;
    setDraft(null);
    if (draft !== value) onChange(draft);
  };

  return (
    <div className="ctl-row ctl-row-slider">
      <Label label={label} hint={hint} htmlFor={id} />
      <input
        id={id}
        className="ctl-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={shown}
        style={{ "--fill": `${pct}%` } as React.CSSProperties}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (Math.abs(next - heard.current) >= (max - min) / 40) {
            playCue("notch", next > heard.current ? 1 : -1);
            heard.current = next;
          }
          if (commitOnRelease) setDraft(next);
          else onChange(next);
        }}
        // the end of a mouse or touch drag, a key press, or leaving the
        // slider partway
        onPointerUp={commitOnRelease ? commit : undefined}
        onPointerCancel={commitOnRelease ? commit : undefined}
        onKeyUp={commitOnRelease ? commit : undefined}
        onBlur={commitOnRelease ? commit : undefined}
      />
      <span className="ctl-value">
        <Roll text={format ? format(shown) : shown.toFixed(2)} />
      </span>
    </div>
  );
}

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}

export function AeroToggle({ label, checked, onChange, hint }: ToggleProps) {
  return (
    <div className="ctl-row ctl-row-toggle">
      <Label label={label} hint={hint} />
      <button className="ctl-toggle" role="switch" aria-checked={checked} aria-label={label} data-on={checked} onClick={() => { playCue(checked ? "off" : "on"); onChange(!checked); }}>
        <span className="ctl-toggle-thumb" />
      </button>
    </div>
  );
}

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  hint?: string;
}

/**
 * A choice of a few. What is chosen sits under one piece of glass (`ctl-seg-thumb`) that glides from choice to choice
 * on the standard spring, as the app's lenses travel, instead of each choice lighting up on its own; placed by
 * transform (useSubpixelBox), and at once with reduced motion or the first time it is drawn.
 */
export function AeroSegmented<T extends string>({ label, value, options, onChange, hint }: SegmentedProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const reduced = useReduced();
  const left = useMotionValue(0);
  const top = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const shown = useMotionValue(0);
  const placed = useRef(false);
  const box = useSubpixelBox(left, top, width, height);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const place = (glide: boolean) => {
      const active = group.querySelector<HTMLElement>("button[data-active='true']");
      if (!active) {
        shown.set(0);
        return;
      }
      const to = { l: active.offsetLeft, t: active.offsetTop, w: active.offsetWidth, h: active.offsetHeight };
      if (!glide || !placed.current || reduced.motion) {
        left.jump(to.l);
        top.jump(to.t);
        width.jump(to.w);
        height.jump(to.h);
      } else {
        animate(left, to.l, spring.standard);
        animate(top, to.t, spring.standard);
        animate(width, to.w, spring.standard);
        animate(height, to.h, spring.standard);
      }
      placed.current = true;
      shown.set(1);
    };
    place(true);
    // a row that wraps, or the chosen word turning bold, moves the choices under it: follow them (gliding, so a change
    // of choice, which also changes the widths, is not cut short by a jump)
    const observer = new ResizeObserver(() => place(true));
    observer.observe(group);
    return () => observer.disconnect();
  }, [value, options.length, reduced.motion, left, top, width, height, shown]);

  return (
    <div className="ctl-row ctl-row-seg">
      <Label label={label} hint={hint} />
      <div ref={groupRef} className="ctl-segmented" role="radiogroup" aria-label={label}>
        <motion.span className="ctl-seg-thumb" aria-hidden style={{ ...box, opacity: shown }} />
        {options.map((opt) => (
          <button key={opt.value} role="radio" aria-checked={opt.value === value} data-active={opt.value === value} onClick={() => { if (opt.value !== value) playCue("notch", 1); onChange(opt.value); }}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
