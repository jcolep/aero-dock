/**
 * Live running-window state, pushed from the Rust shell-hook tracker.
 * Hydrates once from `get_running`, then stays current via events.
 */

import { listen } from "@tauri-apps/api/event";
import { create } from "zustand";
import { ipc } from "../ipc/commands";
import { EVENTS, type RunningSnapshot, type WindowInfo } from "../ipc/types";

interface RunningState {
  windows: WindowInfo[];
  focused: number;
  /** Windows that are flashing for attention: handles, until looked at or gone. */
  attention: Set<number>;
  hydrated: boolean;
  hydrate: () => Promise<void>;
}

export const useRunning = create<RunningState>((set, get) => ({
  windows: [],
  focused: 0,
  attention: new Set(),
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    set({ hydrated: true });
    await listen<RunningSnapshot>(EVENTS.runningChanged, (event) => {
      const { windows, focused } = event.payload;
      // looking at a window, or it going away, ends its asking for attention
      const alive = new Set(windows.map((w) => w.hwnd));
      const attention = new Set([...get().attention].filter((h) => alive.has(h) && h !== focused));
      set({ windows, focused, attention: attention.size === get().attention.size ? get().attention : attention });
    });
    await listen<number>("apps://attention", (event) => {
      // one that is already in front is not asking
      if (event.payload === get().focused) return;
      set({ attention: new Set(get().attention).add(event.payload) });
    });
    const snap = await ipc.getRunning();
    set({ windows: snap.windows, focused: snap.focused });
  },
}));

const APPS_FOLDER_PREFIX = "shell:appsfolder\\";

/** Identity key for a window: AUMID for packaged apps (their exe is
 * always ApplicationFrameHost), exe path otherwise. */
export function windowKey(w: WindowInfo): string {
  return w.aumid ? `aumid:${w.aumid.toLowerCase()}` : w.exe.toLowerCase();
}

/** Identity key for a launch target (pinned item / app entry). */
export function targetKey(path: string): string {
  const lower = path.toLowerCase();
  return lower.startsWith(APPS_FOLDER_PREFIX)
    ? `aumid:${lower.slice(APPS_FOLDER_PREFIX.length)}`
    : lower;
}

/** Group windows by app identity (AUMID or exe). */
export function windowsByExe(windows: WindowInfo[]): Map<string, WindowInfo[]> {
  const map = new Map<string, WindowInfo[]>();
  for (const w of windows) {
    const key = windowKey(w);
    const list = map.get(key);
    if (list) list.push(w);
    else map.set(key, [w]);
  }
  return map;
}

/** Human name for an unpinned running app: exe basename, title-cased. */
export function exeDisplayName(exe: string): string {
  const base = exe.split("\\").pop() ?? exe;
  const stem = base.replace(/\.exe$/i, "");
  return stem.charAt(0).toUpperCase() + stem.slice(1);
}
