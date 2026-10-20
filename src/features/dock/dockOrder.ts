/**
 * The order of the dock's apps while they are dragged: pinned apps, the divider, running apps, as ONE list.
 *
 * They were two lists (one reorder group each side of the divider), so an icon could be reordered within its own side
 * but never travel to the other: dragged across, it hung over the far side while its own side kept its place, and on
 * letting go it vanished from one list and popped into the other. As one list an icon moves across the divider like
 * any other neighbour, the icons it passes slide aside to make room, and where it is let go is where it already is.
 *
 * Each icon is known by the app it is (its target), not its item id: pinning a running app gives it a new id (`run-…`
 * becomes `pin-…`), and keyed by id it would be a new icon, drawn afresh where the old one had been. Keyed by its app it
 * is the same icon, and just stays.
 *
 * After a drop the order is held as it was let go until the dock's items say the same (the change has been saved and
 * come back), or two seconds have passed: following the items at once would put things back for the moment in between.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { DockItemView } from "../../state/dockStore";
import { targetKey } from "../../state/runningStore";

/** The divider's place in the list. */
export const DIVIDER = "|divider|";
const HOLD_MS = 2000;

/** What an app is known by in the order: its target, or its id for something without one. */
export function keysOf(items: DockItemView[]): Map<string, DockItemView> {
  const out = new Map<string, DockItemView>();
  for (const item of items) {
    let key = item.target ? `app:${targetKey(item.target)}` : `id:${item.id}`;
    // the same app twice (pinned twice): the second is known by its id
    if (out.has(key)) key = `id:${item.id}`;
    out.set(key, item);
  }
  return out;
}

/** The order the items themselves give: pinned, the divider, running. */
export function naturalOrder(byKey: Map<string, DockItemView>): string[] {
  const pinned: string[] = [];
  const running: string[] = [];
  for (const [key, item] of byKey) (item.pinned ? pinned : running).push(key);
  return [...pinned, DIVIDER, ...running];
}

/** `current` kept as it is, but holding exactly the keys of `natural`: gone ones dropped, new ones added at the end of
 *  the side they belong to. */
export function reconcile(current: string[], natural: string[]): string[] {
  const have = new Set(natural);
  const next = current.filter((k) => have.has(k));
  if (!next.includes(DIVIDER)) next.push(DIVIDER);
  const split = natural.indexOf(DIVIDER);
  natural.forEach((k, i) => {
    if (next.includes(k)) return;
    if (i < split) next.splice(next.indexOf(DIVIDER), 0, k);
    else next.push(k);
  });
  return next;
}

/** The list with the item at `from` moved to `to`. */
export function moved<T>(list: T[], from: number, to: number): T[] {
  const next = list.slice();
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}

/** The two sides of an order. */
export function sides(order: string[]): { pinned: string[]; running: string[] } {
  const at = order.indexOf(DIVIDER);
  return { pinned: order.slice(0, at), running: order.slice(at + 1) };
}

export interface DockOrder {
  order: string[];
  setOrder: (next: string[]) => void;
  byKey: Map<string, DockItemView>;
  /** Hold the order as it is now until the items agree with it (after a drop). */
  hold: (order: string[]) => void;
}

export function useDockOrder(items: DockItemView[], dragging: boolean): DockOrder {
  const byKey = useMemo(() => keysOf(items), [items]);
  const natural = useMemo(() => naturalOrder(byKey), [byKey]);
  const [order, setOrderState] = useState<string[]>(natural);
  const held = useRef(0);
  const draggingNow = useRef(dragging);
  draggingNow.current = dragging;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setOrderState((current) => {
      const same = current.length === natural.length && current.every((k, i) => k === natural[i]);
      if (same) {
        held.current = 0;
        return natural;
      }
      const holding = draggingNow.current || Date.now() < held.current;
      if (!holding) {
        held.current = 0;
        return natural;
      }
      return reconcile(current, natural);
    });
  }, [natural, tick]);

  // a hold that the items never agreed with lets go after a while (the icons glide to where the items say)
  useEffect(() => {
    if (!held.current) return;
    const t = setTimeout(() => setTick((n) => n + 1), Math.max(0, held.current - Date.now()) + 20);
    return () => clearTimeout(t);
  }, [order]);

  return {
    order,
    byKey,
    setOrder: setOrderState,
    hold: (next) => {
      held.current = Date.now() + HOLD_MS;
      setOrderState(next);
    },
  };
}
