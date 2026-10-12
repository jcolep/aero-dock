/**
 * Dock view model: pinned items (from settings) merged with live running
 * windows, plus resolved icon URLs. Icons live in an on-disk PNG cache on
 * the Rust side; here we only hold `target path -> asset URL` so <img>
 * elements load them directly with zero IPC per render.
 */

import { convertFileSrc } from "@tauri-apps/api/core";
import { create } from "zustand";
import { accentForTheme, normalizeHex } from "../engine/themes/accent";
import { ipc } from "../ipc/commands";
import type { PinnedItem, StackView, WindowInfo } from "../ipc/types";
import { exeDisplayName, targetKey, windowsByExe } from "./runningStore";
import { useSettings } from "./settingsStore";

/** The look icons are asked for in, and the colour of the tinted one. */
export function iconLook(): { style: string; tint: string } {
  const a = useSettings.getState().settings?.appearance;
  return { style: a?.iconStyle ?? "plain", tint: normalizeHex(a?.accent ?? "") ?? accentForTheme(a?.theme ?? "aero") };
}

export interface DockItemView {
  id: string;
  name: string;
  target: string;
  args?: string;
  kind: PinnedItem["kind"];
  iconSrc: string | null;
  children: PinnedItem[];
  /** How a stack opens (unset: a grid). Only stacks use it. */
  view: StackView | null;
  /** Resolved icon URLs for stack children (parallel to children). */
  childIcons: (string | null)[];
  pinned: boolean;
  /** Open windows belonging to this app (empty = not running). */
  windows: WindowInfo[];
  /** One of this app's windows is foreground. */
  focused: boolean;
  /** Executable the volume mixer knows this app by. A running window
   *  reports its real process; a pin that is not running falls back to
   *  the launch target, which is the same file. */
  audioExe: string;
}

interface IconState {
  /** target path -> asset:// URL of the cached PNG */
  iconUrls: Record<string, string>;
  /** targets currently being resolved (dedupes in-flight work) */
  pendingIcons: Set<string>;
  resolveIcons: (targets: string[]) => Promise<void>;
  /** Counts how many times the icons have been thrown away (the look was changed), for what
   *  must ask for them again. */
  epoch: number;
  /** Forget every icon, so each is asked for again in the look now chosen. */
  reset: () => void;
}

export const useDockIcons = create<IconState>((set, get) => ({
  iconUrls: {},
  pendingIcons: new Set(),
  epoch: 0,
  reset: () => set((s) => ({ iconUrls: {}, pendingIcons: new Set(), epoch: s.epoch + 1 })),

  resolveIcons: async (targets) => {
    const { iconUrls, pendingIcons } = get();
    const missing = targets.filter((t) => t && !(t in iconUrls) && !pendingIcons.has(t));
    if (missing.length === 0) return;

    set({ pendingIcons: new Set([...pendingIcons, ...missing]) });
    const epoch = get().epoch;
    try {
      const { style, tint } = iconLook();
      const resolved = await ipc.resolveIcons(missing, style, tint);
      // the look was changed while these were being made: they are of the old one
      if (get().epoch !== epoch) return;
      const urls: Record<string, string> = {};
      for (const [target, path] of Object.entries(resolved)) {
        urls[target] = convertFileSrc(path);
      }
      set((s) => ({ iconUrls: { ...s.iconUrls, ...urls } }));
    } catch (e) {
      // a missing icon is cosmetic (the initial-letter glyph stands in);
      // never let it reject into the caller's render effect
      console.warn("icon resolution failed", e);
    } finally {
      set((s) => {
        const pending = new Set(s.pendingIcons);
        for (const t of missing) pending.delete(t);
        return { pendingIcons: pending };
      });
    }
  },
}));

/**
 * Build the dock model: pinned items in user order (with live window
 * state attached), then one icon per running-but-unpinned app.
 */
export function buildDockItems(
  pinned: PinnedItem[],
  runningWindows: WindowInfo[],
  focused: number,
  iconUrls: Record<string, string>,
  showRunningApps: boolean,
  runningOrder: string[] = [],
): DockItemView[] {
  const byExe = windowsByExe(runningWindows);
  const pinnedTargets = new Set(
    pinned.filter((p) => p.path).map((p) => targetKey(p.path)),
  );

  const items: DockItemView[] = pinned.map((p) => {
    const windows = p.path ? (byExe.get(targetKey(p.path)) ?? []) : [];
    return {
      id: p.id,
      name: p.name,
      target: p.path,
      kind: p.kind,
      iconSrc: p.path ? (iconUrls[p.path] ?? null) : null,
      children: p.children,
      view: p.view ?? null,
      childIcons: p.children.map((c) => (c.path ? (iconUrls[c.path] ?? null) : null)),
      pinned: true,
      windows,
      focused: windows.some((w) => w.hwnd === focused),
      audioExe: windows[0]?.exe ?? p.path,
    };
  });

  if (showRunningApps) {
    const running: DockItemView[] = [];
    for (const [key, windows] of byExe) {
      if (pinnedTargets.has(key)) continue;
      const first = windows[0];
      // UWP windows launch (and icon-resolve) through their AUMID
      const target = first.aumid ? `shell:AppsFolder\\${first.aumid}` : first.exe;
      running.push({
        id: `run-${key}`,
        name: windows.length === 1 ? first.title : exeDisplayName(first.exe),
        target,
        kind: "app",
        iconSrc: iconUrls[target] ?? null,
        children: [],
        view: null,
        childIcons: [],
        pinned: false,
        windows,
        focused: windows.some((w) => w.hwnd === focused),
        audioExe: first.exe,
      });
    }
    // Apps the user has dragged keep that order. The rest follow in the
    // order Windows reported them (sort is stable), so a new app lands at
    // the end instead of shuffling the ones already placed.
    const rank = (id: string) => {
      const at = runningOrder.indexOf(id);
      return at === -1 ? Number.MAX_SAFE_INTEGER : at;
    };
    running.sort((a, b) => rank(a.id) - rank(b.id));
    items.push(...running);
  }

  return items;
}
