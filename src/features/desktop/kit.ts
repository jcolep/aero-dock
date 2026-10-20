/**
 * What the newer widgets share: reading a widget's own settings (`options.extra`, each key with a default the registry
 * knows), keeping what a widget changes by itself (a note, a list, a count, a timer) and saving it without losing a
 * change to another key, and typing into a widget.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ipc } from "../../ipc/commands";
import type { WidgetInstance } from "../../ipc/types";
import { useSettings } from "../../state/settingsStore";

/** One of a widget's own settings, or `fallback` where it has not been set. */
export type Widen<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T;
export function opt<T>(widget: WidgetInstance, key: string, fallback: T): Widen<T> {
  const v = widget.options.extra?.[key];
  return (v === undefined || v === null ? fallback : v) as Widen<T>;
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

// Changes wait a moment, are merged, and are written on top of the latest settings, so that two keys changed close
// together (a timer's state and a label) are never one lost to the other, and typing is one save, not one a letter.
const pending = new Map<string, { patch: Record<string, unknown>; timer?: number }>();

/** Save some of a widget's own settings, after `delay` ms (0 for now). */
export function saveExtra(id: string, patch: Record<string, unknown>, delay = 450): void {
  const entry = pending.get(id) ?? { patch: {} };
  Object.assign(entry.patch, patch);
  pending.set(id, entry);
  window.clearTimeout(entry.timer);
  entry.timer = window.setTimeout(() => {
    pending.delete(id);
    const w = useSettings.getState().settings?.widgets.widgets.find((x) => x.id === id);
    if (!w) return;
    ipc
      .styleWidget(id, { options: { ...w.options, extra: { ...w.options.extra, ...entry.patch } } })
      .catch((e) => console.warn("could not save the widget", e));
  }, delay);
}

/**
 * A setting the widget changes by itself. It is kept here at once (the widget never waits for the save), saved a
 * moment later, and follows the stored value again when the Settings window changes it.
 */
export function useExtra<T>(widget: WidgetInstance, key: string, fallback: T): [T, (v: T | ((prev: T) => T), now?: boolean) => void] {
  const stored = opt(widget, key, fallback) as unknown as T;
  const [local, setLocal] = useState<T>(stored);
  const mine = useRef(0);
  const latest = useRef(local);
  latest.current = local;
  const storedKey = JSON.stringify(stored);
  useEffect(() => {
    // not while a change of its own is on its way to being saved
    if (Date.now() > mine.current) setLocal(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedKey]);
  const set = useCallback(
    (v: T | ((prev: T) => T), now = false) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(latest.current) : v;
      latest.current = next;
      mine.current = Date.now() + (now ? 900 : 1600);
      setLocal(next);
      saveExtra(widget.id, { [key]: next }, now ? 0 : 450);
    },
    [widget.id, key],
  );
  return [local, set];
}

/** A tick at the rate a widget needs (null for none). */
export function useNow(everyMs: number | null): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (everyMs === null) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), everyMs);
    return () => window.clearInterval(id);
  }, [everyMs]);
  return now;
}

/**
 * Props for something typed into: the overlay never takes the keyboard (a click on a widget must not pull the focus
 * from what is being worked in), so pressing on it asks for the keyboard first, and giving it up again is on blur.
 */
export function typing(): {
  "data-nodrag": boolean;
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onBlur: () => void;
} {
  return {
    "data-nodrag": true,
    onPointerDown: (e) => {
      const el = e.currentTarget;
      if (document.activeElement === el) return;
      e.preventDefault();
      ipc
        .setWidgetKeyboard(true)
        .catch(() => undefined)
        .finally(() => el.focus());
    },
    onBlur: () => {
      // handed back unless another field of ours takes it straight away
      window.setTimeout(() => {
        const a = document.activeElement;
        if (!(a instanceof HTMLInputElement || a instanceof HTMLTextAreaElement)) ipc.setWidgetKeyboard(false).catch(() => undefined);
      }, 120);
    },
  };
}
