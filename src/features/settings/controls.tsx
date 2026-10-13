/**
 * Aero-styled form controls for the settings window: slider, toggle,
 * and segmented picker. Purely presentational; parents own the values.
 */

import { Roll } from "../../engine/type/Roll";
import { useId, useState } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  /** Apply the value only when the slider is let go, not on every step of
   *  the drag. The thumb and the readout still follow the drag. For settings
   *  whose every change makes Rust rebuild windows or re-claim screen space,
   *  where a drag would otherwise do that dozens of times a second. */
  commitOnRelease?: boolean;
}

export function AeroSlider({
  label,
  value,
  min,
  max,
  step = 0.01,
  format,
  onChange,
  commitOnRelease = false,
}: SliderProps) {
  const id = useId();
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
    <div className="ctl-row">
      <label className="ctl-label" htmlFor={id}>
        {label}
      </label>
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
    <div className="ctl-row">
      <span className="ctl-label" title={hint}>
        {label}
      </span>
      <button
        className="ctl-toggle"
        role="switch"
        aria-checked={checked}
        data-on={checked}
        onClick={() => onChange(!checked)}
      >
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
}

export function AeroSegmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className="ctl-row">
      <span className="ctl-label">{label}</span>
      <div className="ctl-segmented" role="radiogroup" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.value}
            role="radio"
            aria-checked={opt.value === value}
            data-active={opt.value === value}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
