/**
 * Whether the person at the machine has gone idle (no keyboard or mouse for
 * a while). Pushed from Rust, which is the only side that can see input
 * going to other programs. Decoration that nobody is there to look at (the
 * menu bar's ambient scene) rests while this is true.
 */

import { listen } from "@tauri-apps/api/event";
import { create } from "zustand";
import { EVENTS } from "../ipc/types";

interface IdleState {
  idle: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
}

export const useUserIdle = create<IdleState>((set, get) => ({
  idle: false,
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated) return;
    set({ hydrated: true });
    await listen<boolean>(EVENTS.userIdle, (event) => set({ idle: event.payload }));
  },
}));
