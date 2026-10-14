/**
 * Settings state: hydrated once from Rust, then kept in sync by the
 * `settings://changed` event. Mutations go through Rust and come back as
 * events, so this store never diverges from the persisted truth.
 */

import { listen } from "@tauri-apps/api/event";
import { create } from "zustand";
import { ipc } from "../ipc/commands";
import { EVENTS, type Settings } from "../ipc/types";

type Mutation = (draft: Settings) => void;

interface SettingsState {
  settings: Settings | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  /** Apply a partial change on top of current settings and persist. */
  apply: (mutate: Mutation) => Promise<void>;
}

/**
 * Sending is one at a time, newest wins. Dragging a slider changes a setting
 * dozens of times a second, and each change is a save to disk plus every
 * window re-laying itself out. Sent one per change they queue up behind each
 * other and the window falls further behind the pointer; sent one at a time
 * with only the latest kept, it stays level with it.
 */
let sending = false;
let waiting = false;

/**
 * Changes made here that Rust has not confirmed yet. Whatever state arrives
 * (an echo of an earlier save, or a change made in another window) is taken
 * as the base and these are replayed over it, so the control under the
 * pointer never snaps back to an older value and nothing changed elsewhere is
 * lost. Each is a plain assignment to a setting, so replaying one that the
 * base already includes changes nothing.
 */
let unconfirmed: Mutation[] = [];

function rebase(base: Settings): Settings {
  if (unconfirmed.length === 0) return base;
  const draft: Settings = structuredClone(base);
  for (const mutate of unconfirmed) mutate(draft);
  return draft;
}

export const useSettings = create<SettingsState>((set, get) => ({
  settings: null,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    const settings = await ipc.getSettings();
    set({ settings, hydrated: true });
    await listen<Settings>(EVENTS.settingsChanged, (event) => {
      const next = rebase(event.payload);
      // the same settings again (the echo of a save this window has already shown): a new object would have the
      // whole window drawn again for nothing
      if (JSON.stringify(next) === JSON.stringify(get().settings)) return;
      set({ settings: next });
    });
  },

  apply: async (mutate) => {
    const current = get().settings;
    if (!current) return;
    const draft: Settings = structuredClone(current);
    mutate(draft);
    unconfirmed.push(mutate);
    // optimistic update; the confirmed struct replaces it once sent
    set({ settings: draft });
    waiting = true;
    if (sending) return;
    sending = true;
    try {
      while (waiting) {
        waiting = false;
        const included = unconfirmed.length;
        const confirmed = await ipc.setSettings(get().settings as Settings);
        // what was just saved is no longer waiting to be; anything changed
        // while it was in flight still is
        unconfirmed = unconfirmed.slice(included);
        // Rust may have clamped something; show what it kept
        set({ settings: rebase(confirmed) });
      }
    } catch (e) {
      // the save failed: stop replaying what was lost, and show what is
      // really saved rather than leave controls showing values that are not
      unconfirmed = [];
      waiting = false;
      ipc
        .getSettings()
        .then((saved) => set({ settings: saved }))
        .catch(() => undefined);
      throw e;
    } finally {
      sending = false;
    }
  },
}));
