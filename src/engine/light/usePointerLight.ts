/**
 * Where the pointer is on a piece of glass, written onto it as `--lx` and
 * `--ly` (px from its top left) for the stylesheet to place a soft highlight
 * at: light that follows the pointer across the surface.
 *
 * Writing a custom property makes the page restyle and repaint the glass, and
 * in a software-rendered web view that is not free, so this is held to about
 * 30 writes a second however fast the pointer reports, and does nothing at all
 * when the setting is off (`<html data-pointer-light="off">`, written by
 * applyAppearance).
 */

import { useCallback, useEffect, useRef } from "react";

/** The least time between two writes, in milliseconds. */
const EVERY_MS = 32;

export function usePointerLight() {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastWrite = useRef(0);
  const latest = useRef<{ x: number; y: number; el: HTMLElement } | null>(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const write = useCallback(() => {
    timer.current = undefined;
    const at = latest.current;
    if (!at) return;
    lastWrite.current = performance.now();
    const r = at.el.getBoundingClientRect();
    at.el.style.setProperty("--lx", `${(at.x - r.left).toFixed(1)}px`);
    at.el.style.setProperty("--ly", `${(at.y - r.top).toFixed(1)}px`);
  }, []);

  return useCallback(
    (e: { clientX: number; clientY: number; currentTarget: HTMLElement }) => {
      if (document.documentElement.dataset.pointerLight !== "on") return;
      latest.current = { x: e.clientX, y: e.clientY, el: e.currentTarget };
      if (timer.current !== undefined) return;
      const wait = Math.max(0, EVERY_MS - (performance.now() - lastWrite.current));
      timer.current = setTimeout(write, wait);
    },
    [write],
  );
}
