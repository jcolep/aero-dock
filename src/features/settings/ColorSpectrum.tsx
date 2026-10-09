/**
 * A colour picker: a square for how vivid and how bright, a spectrum bar for
 * the hue, and a box for typing a hex value.
 *
 * It works in hue, saturation and value rather than in hex because hex loses
 * information the picker needs. Drag the square to black and the hue has
 * nowhere to live in `#000000`, so the bar would jump to red; keeping the
 * three numbers here means the hue stays where it was left.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { hexToHsv, hsvToHex, normalizeHex } from "../../engine/themes/accent";
import "./colorspectrum.css";

interface ColorSpectrumProps {
  /** Current colour, `#rrggbb`. */
  value: string;
  onChange: (hex: string) => void;
}

/** Pointer handlers that report where inside the element the pointer is, as
 *  fractions from 0 to 1, for as long as it is held down. */
function useDrag(onMove: (x: number, y: number) => void) {
  const report = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onMove(
      Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
    );
  };
  return {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      report(e);
    },
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) report(e);
    },
  };
}

export function ColorSpectrum({ value, onChange }: ColorSpectrumProps) {
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(value));
  const [text, setText] = useState(value);
  // the last colour this picker produced, to tell its own echo from a change
  // made elsewhere (a reset, an import)
  const own = useRef(value.toLowerCase());

  useEffect(() => {
    if (value.toLowerCase() !== own.current) {
      own.current = value.toLowerCase();
      setHsv(hexToHsv(value));
      setText(value);
    }
  }, [value]);

  const commit = useCallback(
    (next: [number, number, number]) => {
      setHsv(next);
      const hex = hsvToHex(...next);
      own.current = hex;
      setText(hex);
      onChange(hex);
    },
    [onChange],
  );

  const [h, s, v] = hsv;
  const pad = useDrag((x, y) => commit([h, x, 1 - y]));
  const bar = useDrag((x) => commit([x * 360, s, v]));

  return (
    <div className="spectrum">
      <div
        className="spectrum-pad"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${h} 100% 50%))`,
        }}
        {...pad}
      >
        <span
          className="spectrum-knob"
          style={{ left: `${s * 100}%`, top: `${(1 - v) * 100}%`, background: hsvToHex(h, s, v) }}
        />
      </div>
      <div className="spectrum-hue" {...bar}>
        <span
          className="spectrum-knob spectrum-knob-hue"
          style={{ left: `${(h / 360) * 100}%`, background: hsvToHex(h, 1, 1) }}
        />
      </div>
      <div className="spectrum-row">
        <span className="spectrum-swatch" style={{ background: hsvToHex(h, s, v) }} aria-hidden />
        <input
          className="spectrum-hex ctl-text"
          value={text}
          spellCheck={false}
          maxLength={7}
          aria-label="Colour as a hex code"
          onChange={(e) => {
            setText(e.target.value);
            const hex = normalizeHex(e.target.value);
            if (hex) commit(hexToHsv(hex));
          }}
          onBlur={() => setText(hsvToHex(...hsv))}
        />
      </div>
    </div>
  );
}
