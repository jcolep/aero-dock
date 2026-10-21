/**
 * What the settings window remembers about itself: the section it is showing (kept between visits), what is typed in
 * the search box, how its sidebar is kept (always there, or sliding in from the window's left edge; kept between
 * visits), and whether a sliding sidebar is out just now, and how it came out.
 */

import { create } from "zustand";
import { ALL_SECTIONS, sectionById } from "./sections";

const PANE_KEY = "liquidock.settings.pane";
const SIDEBAR_KEY = "liquidock.settings.sidebar";

export type SidebarMode = "always" | "edge";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // remembering is a convenience
  }
}

interface UiState {
  /** The section shown. */
  active: string;
  query: string;
  /** How many settings each section has that answer the search (by section id), once the page has been narrowed to it;
   *  null with no search, and until the page has been looked at (see `rowSearch.ts`). */
  hits: Record<string, number> | null;
  sidebar: SidebarMode;
  /** A sliding sidebar is out: put out by the pointer at the edge (it goes when the pointer leaves) or by a click (it
   *  stays until something is chosen or the page is clicked). */
  sidebarOut: null | "edge" | "click";
  setActive: (id: string) => void;
  setQuery: (query: string) => void;
  setHits: (hits: Record<string, number> | null) => void;
  setSidebar: (mode: SidebarMode) => void;
  setSidebarOut: (out: null | "edge" | "click") => void;
}

export const useSettingsUi = create<UiState>((set, get) => ({
  active: sectionById(read(PANE_KEY) ?? "")?.id ?? ALL_SECTIONS[0].id,
  query: "",
  hits: null,
  sidebar: read(SIDEBAR_KEY) === "edge" ? "edge" : "always",
  sidebarOut: null,
  setActive: (active) => {
    if (get().active === active) return;
    write(PANE_KEY, active);
    set({ active });
  },
  // (what was found for the last query is not what is found for this one: until the page is looked at again, the
  // sections are told apart by their titles and keywords, as before)
  setQuery: (query) => set({ query, hits: null }),
  setHits: (hits) => set({ hits }),
  setSidebar: (sidebar) => {
    write(SIDEBAR_KEY, sidebar);
    set({ sidebar, sidebarOut: null });
  },
  setSidebarOut: (sidebarOut) => (get().sidebarOut === sidebarOut ? undefined : set({ sidebarOut })),
}));

/** Show a section: leaves the search and starts the page at its top. A sliding sidebar is left exactly as it
 *  was — choosing a section used to put it away at once, which read as the sidebar closing on you mid-click;
 *  now it goes the same way it always does otherwise (the pointer leaving it, for one that came out at the edge;
 *  the header button, for one brought out by hand), whether or not a click on it was what you were doing. */
export function goToSection(id: string) {
  const ui = useSettingsUi.getState();
  if (ui.query) ui.setQuery("");
  ui.setActive(id);
  document.querySelector(".settings-scroll")?.scrollTo({ top: 0 });
}
