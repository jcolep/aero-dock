/**
 * What the settings window remembers about itself: which sections are folded
 * (kept between visits), what is typed in the search box, and which section the
 * page is at (for the sidebar to light up).
 */

import { create } from "zustand";

const KEY = "aero.settings.sections";

/** Which sections have been opened or folded by hand. Anything not in it is as the section's own default. */
function load(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function save(open: Record<string, boolean>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(open));
  } catch {
    // remembering is a convenience
  }
}

interface UiState {
  open: Record<string, boolean>;
  query: string;
  active: string;
  setOpen: (id: string, open: boolean) => void;
  /** Open (or fold) every section in `ids`. */
  setMany: (ids: string[], open: boolean) => void;
  setQuery: (query: string) => void;
  setActive: (id: string) => void;
}

export const useSettingsUi = create<UiState>((set, get) => ({
  open: load(),
  query: "",
  active: "",
  setOpen: (id, open) => {
    const next = { ...get().open, [id]: open };
    save(next);
    set({ open: next });
  },
  setMany: (ids, open) => {
    const next = { ...get().open };
    for (const id of ids) next[id] = open;
    save(next);
    set({ open: next });
  },
  setQuery: (query) => set({ query }),
  setActive: (active) => (get().active === active ? undefined : set({ active })),
}));

/** Folded unless a section says it starts open. */
export const DEFAULT_OPEN: Record<string, boolean> = {
  // the first thing in the window, and what most visits are for
  colour: true,
};

export function isOpen(open: Record<string, boolean>, id: string): boolean {
  return open[id] ?? DEFAULT_OPEN[id] ?? false;
}