/**
 * Choosing the color of one of the Control Center's circles: a row of colors
 * to pick from, "Theme" to follow the theme's own, and a custom color from the
 * full spectrum for anything else.
 */

import { useState } from "react";
import { normalizeHex } from "../../engine/themes/accent";
import { ColorSpectrum } from "./ColorSpectrum";
import "./bubblecolor.css";

/** The colors offered at a click: the system colors Apple's controls use. */
const SWATCHES: { name: string; hex: string }[] = [
  { name: "Blue", hex: "#0a84ff" },
  { name: "Teal", hex: "#30b0c7" },
  { name: "Green", hex: "#30d158" },
  { name: "Yellow", hex: "#ffd60a" },
  { name: "Orange", hex: "#ff9f0a" },
  { name: "Red", hex: "#ff453a" },
  { name: "Pink", hex: "#ff375f" },
  { name: "Purple", hex: "#bf5af2" },
  { name: "Indigo", hex: "#5e5ce6" },
  { name: "Graphite", hex: "#636366" },
];

interface BubbleColorProps {
  label: string;
  /** `#rrggbb`, or "" for the theme's color. */
  value: string;
  /** What "Theme" looks like, to draw its swatch. */
  themeColor: string;
  /** What the first swatch (the empty value) is called, where it is not the theme's color (a click effect's own
   *  white light, say). */
  defaultName?: string;
  onChange: (hex: string) => void;
}

export function BubbleColor({ label, value, themeColor, defaultName = "Follow the theme", onChange }: BubbleColorProps) {
  const chosen = normalizeHex(value) ?? "";
  const isPreset = SWATCHES.some((s) => s.hex === chosen);
  const [open, setOpen] = useState(false);

  return (
    <div className="bubble-color">
      <div className="ctl-row">
        <span className="ctl-label">{label}</span>
        <div className="bubble-swatches" role="radiogroup" aria-label={label}>
          <button
            type="button"
            role="radio"
            aria-checked={chosen === ""}
            aria-label={defaultName}
            title={defaultName}
            className="bubble-swatch bubble-swatch-theme"
            data-on={chosen === ""}
            style={{ ["--swatch" as string]: themeColor } as React.CSSProperties}
            onClick={() => {
              setOpen(false);
              onChange("");
            }}
          />
          {SWATCHES.map((s) => (
            <button
              key={s.hex}
              type="button"
              role="radio"
              aria-checked={chosen === s.hex}
              aria-label={s.name}
              title={s.name}
              className="bubble-swatch"
              data-on={chosen === s.hex}
              style={{ ["--swatch" as string]: s.hex } as React.CSSProperties}
              onClick={() => {
                setOpen(false);
                onChange(s.hex);
              }}
            />
          ))}
          <button
            type="button"
            role="radio"
            aria-checked={chosen !== "" && !isPreset}
            aria-label="Choose a color"
            title="Any color…"
            className="bubble-swatch bubble-swatch-custom"
            data-on={chosen !== "" && !isPreset}
            style={chosen !== "" && !isPreset ? ({ ["--swatch" as string]: chosen } as React.CSSProperties) : undefined}
            onClick={() => setOpen((o) => !o)}
          />
        </div>
      </div>
      {open && (
        <div className="bubble-spectrum">
          <ColorSpectrum value={chosen || themeColor} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
