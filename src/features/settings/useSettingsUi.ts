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
  sidebar: SidebarMode;
  /** A sliding sidebar is out: put out by the pointer at the edge (it goes when the pointer leaves) or by a click (it
   *  stays until something is chosen or the page is clicked). */
  sidebarOut: null | "edge" | "click";
  setActive: (id: string) => void;
  setQuery: (query: string) => void;
  setSidebar: (mode: SidebarMode) => void;
  setSidebarOut: (out: null | "edge" | "click") => void;
}

export const useSettingsUi = create<UiState>((set, get) => ({
  active: sectionById(read(PANE_KEY) ?? "")?.id ?? ALL_SECTIONS[0].id,
  query: "",
  sidebar: read(SIDEBAR_KEY) === "edge" ? "edge" : "always",
  sidebarOut: null,
  setActive: (active) => {
    if (get().active === active) return;
    write(PANE_KEY, active);
    set({ active });
  },
  setQuery: (query) => set({ query }),
  setSidebar: (sidebar) => {
    write(SIDEBAR_KEY, sidebar);
    set({ sidebar, sidebarOut: null });
  },
  setSidebarOut: (sidebarOut) => (get().sidebarOut === sidebarOut ? undefined : set({ sidebarOut })),
}));

/** Show a section: leaves the search, puts a sliding sidebar away, and starts the page at its top. */
export function goToSection(id: string) {
  const ui = useSettingsUi.getState();
  if (ui.query) ui.setQuery("");
  ui.setActive(id);
  ui.setSidebarOut(null);
  document.querySelector(".settings-scroll")?.scrollTo({ top: 0 });
}
