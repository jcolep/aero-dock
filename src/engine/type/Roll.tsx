/**
 * A number that rolls: when 41% becomes 42% the 1 slides up out of the cell and the 2 slides in after it,
 * instead of the text jumping. Only the digits that changed move, and a digit going from 9 to 0 keeps going
 * the way it was going (up) rather than winding back through all ten, which is how a clock should turn over.
 *
 * Each digit is a column of the digits twice over, shifted by a transform: no layout, no repaint of the text,
 * only the compositor moves it, and only when the digit changes. The text is read out whole (`aria-label`).
 * With motion to be kept down the digits simply change.
 */

import { memo, useLayoutEffect, useRef, useState } from "react";
import "./roll.css";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function Digit({ value }: { value: number }) {
  // where in the column of twenty it is; a turn over from 9 to 0 goes to the second 0 and then
  // quietly back to the first
  const [at, setAt] = useState(value);
  const [snap, setSnap] = useState(false);
  const last = useRef(value);
  useLayoutEffect(() => {
    if (value === last.current) return;
    const from = last.current;
    last.current = value;
    if (from === 9 && value === 0) {
      setSnap(false);
      setAt(10);
    } else if (from === 0 && value === 9) {
      // coming down off the top: start from the second 0 and roll to the second 9
      setSnap(true);
      setAt(10);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setSnap(false);
          setAt(9);
        }),
      );
    } else {
      setSnap(false);
      setAt(value);
    }
  }, [value]);
  return (
    <span className="roll-d" aria-hidden>
      <span
        className="roll-col"
        data-snap={snap || undefined}
        style={{ transform: `translateY(calc(${at} * var(--roll-h) * -1))` }}
        onTransitionEnd={() => {
          // arrived at the second 0: it is the first, as far as anyone can see
          if (at === 10) {
            setSnap(true);
            setAt(0);
          }
        }}
      >
        {DIGITS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </span>
    </span>
  );
}

/** Text with its digits rolling. Anything that is not a digit is as it is. */
export const Roll = memo(function Roll({ text, className }: { text: string; className?: string }) {
  const chars = [...text];
  return (
    <span className={`roll${className ? ` ${className}` : ""}`} role="text" aria-label={text}>
      {chars.map((ch, i) => {
        // keyed from the right, so that 9% becoming 10% keeps the units where they were
        const key = chars.length - i;
        return /[0-9]/.test(ch) ? (
          <Digit key={key} value={Number(ch)} />
        ) : (
          <span key={`s${key}`} className="roll-ch" aria-hidden>
            {ch === " " ? "\u00a0" : ch}
          </span>
        );
      })}
    </span>
  );
});