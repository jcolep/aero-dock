/**
 * Ambient-motion state, written by the dock bar's interaction tracking and
 * read by the effects layer.
 *
 * `asleep` is true once the dock has been left alone long enough that
 * decorative animation (float, sweep, dust) should pause. `dockHidden` is
 * true while the dock is slid out of sight, when none of it can be seen at
 * all.
 */

import { create } from "zustand";

interface AmbientState {
  asleep: boolean;
  dockHidden: boolean;
  setAsleep: (asleep: boolean) => void;
  setDockHidden: (hidden: boolean) => void;
}

export const useAmbient = create<AmbientState>((set) => ({
  asleep: false,
  dockHidden: false,
  setAsleep: (asleep) => set({ asleep }),
  setDockHidden: (dockHidden) => set({ dockHidden }),
}));
