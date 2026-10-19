/**
 * Apps' Jump Lists, kept, so an app's menu opens with its list already in it.
 *
 * Reading a list asks Windows (jumplist.rs: COM, and the Start menu's IDs the first time), which takes long enough
 * that a menu waiting for it opened with its own items and then grew a moment later as the list arrived. So a list is
 * read ahead of being wanted (the pointer resting on an icon, and every app on the dock a little after it starts), the
 * last one read is shown at once, and a fresh one is read behind it, replacing it only if it changed. One read at a time
 * per app: asking again while one is under way waits for that one.
 */

import { ipc } from "../../ipc/commands";
import type { JumpList } from "../../ipc/types";
import type { DockItemView } from "../../state/dockStore";

/** Older than this, a kept list is read again before the menu would want it (on a hover). */
const FRESH_MS = 60_000;

const kept = new Map<string, { list: JumpList | null; at: number }>();
const reading = new Map<string, Promise<JumpList | null>>();

const keyOf = (item: DockItemView) => item.target.toLowerCase();

/** The program an item runs, for finding its list. */
export function exeOf(item: DockItemView): string {
  return item.windows[0]?.exe ?? (item.target.toLowerCase().endsWith(".exe") ? item.target : item.audioExe ?? "");
}

/** The list last read for an item: `undefined` if it has never been read, `null` if it has none. */
export function keptJump(item: DockItemView): JumpList | null | undefined {
  return kept.get(keyOf(item))?.list;
}

/** Read an item's list now (or join the read already under way), keeping it. */
export function readJump(item: DockItemView): Promise<JumpList | null> {
  const key = keyOf(item);
  const under = reading.get(key);
  if (under) return under;
  const read = ipc
    .jumpList(item.target, exeOf(item), item.windows.map((w) => w.hwnd), [...new Set(item.windows.map((w) => w.pid))])
    .catch(() => null)
    .then((list) => {
      kept.set(key, { list, at: Date.now() });
      return list;
    })
    .finally(() => reading.delete(key));
  reading.set(key, read);
  return read;
}

/** Read an item's list ahead of its menu, unless what is kept is fresh. */
export function warmJump(item: DockItemView): void {
  if (item.kind === "stack" || !item.target) return;
  const k = kept.get(keyOf(item));
  if (k && Date.now() - k.at < FRESH_MS) return;
  void readJump(item);
}

/** Whether two lists show the same thing (so a fresh read that changed nothing does not redraw the menu). */
export function sameJump(a: JumpList | null | undefined, b: JumpList | null | undefined): boolean {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

/** Read the lists of the dock's apps one after another, gently, while the page is idle. */
export function warmAll(items: DockItemView[]): void {
  const queue = items.filter((i) => i.kind !== "stack" && i.target && keptJump(i) === undefined);
  const next = () => {
    const item = queue.shift();
    if (!item) return;
    void readJump(item).finally(() => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (idle) idle(next, { timeout: 1500 });
      else setTimeout(next, 150);
    });
  };
  next();
}
