/**
 * The sidebar of the settings window: the app's name, a search box that narrows the list to the sections that answer
 * it, and the sections under their groups, each with its icon. A click shows that section; the one shown is lit.
 *
 * Kept always in view, or (Settings > General > This window, and always in a narrow window) slid away off the left
 * edge, to come out when the pointer reaches that edge or the button at the top of the page is pressed. Out by the
 * pointer, it goes again when the pointer leaves it; out by a click, when a section is chosen or the page is clicked.
 */

import { useEffect, useRef } from "react";
import { GROUPS, matches } from "./sections";
import { SectionIcon } from "./SectionIcon";
import { Droplet } from "../../engine/brand/droplet";
import { goToSection, useSettingsUi } from "./useSettingsUi";

/** How long the pointer can be off a sidebar that came out at the edge before it goes again, in ms. */
const LEAVE_MS = 320;

export function SettingsNav({ sliding }: { sliding: boolean }) {
  const query = useSettingsUi((s) => s.query);
  const active = useSettingsUi((s) => s.active);
  const out = useSettingsUi((s) => s.sidebarOut);
  const setQuery = useSettingsUi((s) => s.setQuery);
  const setOut = useSettingsUi((s) => s.setSidebarOut);
  const leaving = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(leaving.current), []);

  // Escape puts a sliding sidebar away
  useEffect(() => {
    if (!sliding || !out) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && !query && setOut(null);
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [sliding, out, query, setOut]);

  /** The pointer is off a sidebar that came out at the edge: it goes after a moment, unless it comes back. */
  const away = () => {
    if (!sliding || useSettingsUi.getState().sidebarOut !== "edge") return;
    window.clearTimeout(leaving.current);
    leaving.current = window.setTimeout(() => {
      // not while the search box has the keyboard: the pointer is not the only way to be using it
      if (!document.activeElement?.closest(".sb")) setOut(null);
    }, LEAVE_MS);
  };

  const anyShown = GROUPS.some((g) => g.sections.some((s) => matches(s, query)));
  return (
    <>
      {/* the strip along the window's left edge that brings a sliding sidebar out */}
      {sliding && !out && <div className="sb-edge" aria-hidden onPointerEnter={() => setOut("edge")} />}
      <aside
        className="sb glass"
        data-sliding={sliding}
        data-out={!sliding || !!out}
        aria-label="Settings sections"
        onPointerEnter={() => window.clearTimeout(leaving.current)}
        onPointerLeave={away}
      >
        <div className="sb-brand">
          <Droplet size={26} className="settings-orb" />
          <span className="sb-name">Liquidock</span>
        </div>

        <div className="settings-search">
          <svg viewBox="0 0 20 20" aria-hidden>
            <circle cx="8.5" cy="8.5" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="m12.4 12.4 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            placeholder="Search"
            aria-label="Search settings"
            spellCheck={false}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          />
        </div>

        <nav className="sb-list">
          {GROUPS.map((group) => {
            const items = group.sections.filter((s) => matches(s, query));
            if (items.length === 0) return null;
            return (
              <div key={group.id} className="sb-group">
                <div className="sb-heading">{group.title}</div>
                {items.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="sb-item"
                    data-active={active === s.id && !query}
                    aria-current={active === s.id && !query ? "page" : undefined}
                    onClick={() => goToSection(s.id)}
                  >
                    <SectionIcon id={s.id} />
                    <span>{s.title}</span>
                  </button>
                ))}
              </div>
            );
          })}
          {!anyShown && <div className="sb-none">Nothing matches “{query}”.</div>}
        </nav>
      </aside>
      {/* the page beside a sidebar that is out: clicked, it puts it away; moved over, a sidebar that came out at the
          edge goes (also when the pointer touched the edge and turned back without going into the sidebar) */}
      {sliding && out && <div className="sb-scrim" aria-hidden data-dim={out === "click"} onPointerDown={() => setOut(null)} onPointerMove={away} />}
    </>
  );
}
