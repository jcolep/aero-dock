/**
 * The sidebar of the settings window: a search box that narrows the sections to
 * those that answer it, the sections listed under their groups (a click goes to
 * one, opening it), and buttons to open or fold them all. The section the page
 * is at is lit.
 */

import { useEffect } from "react";
import { ALL_SECTIONS, GROUPS, matches } from "./sections";
import { useSettingsUi } from "./useSettingsUi";

/** Scroll to a section, opening it first. */
export function goToSection(id: string) {
  const ui = useSettingsUi.getState();
  // searching narrows the list; leaving the search is what shows the rest
  if (ui.query) ui.setQuery("");
  ui.setOpen(id, true);
  // after it has been laid out open
  window.setTimeout(() => document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
}

export function SettingsNav() {
  const query = useSettingsUi((s) => s.query);
  const active = useSettingsUi((s) => s.active);
  const setQuery = useSettingsUi((s) => s.setQuery);
  const setMany = useSettingsUi((s) => s.setMany);

  // which section the page is at: the first one whose top has come up under the header
  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>(".settings-scroll");
    if (!scroller) return;
    const update = () => {
      const top = scroller.getBoundingClientRect().top + 24;
      let current = "";
      for (const el of scroller.querySelectorAll<HTMLElement>("[data-section]")) {
        if (el.getBoundingClientRect().top <= top) current = el.dataset.section ?? current;
      }
      useSettingsUi.getState().setActive(current || ALL_SECTIONS[0].id);
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    return () => scroller.removeEventListener("scroll", update);
  }, [query]);

  const shown = ALL_SECTIONS.filter((s) => matches(s, query));
  return (
    <nav className="settings-nav" aria-label="Settings sections">
      <div className="settings-search">
        <svg viewBox="0 0 20 20" aria-hidden>
          <circle cx="8.5" cy="8.5" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="m12.4 12.4 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          placeholder="Search settings"
          aria-label="Search settings"
          spellCheck={false}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQuery("")}
        />
      </div>

      <div className="settings-nav-list">
        {GROUPS.map((group) => {
          const items = group.sections.filter((s) => matches(s, query));
          if (items.length === 0) return null;
          return (
            <div key={group.id} className="settings-nav-group">
              <div className="settings-nav-heading">{group.title}</div>
              {items.map((s) => (
                <button key={s.id} type="button" className="settings-nav-item" data-active={active === s.id && !query} onClick={() => goToSection(s.id)}>
                  {s.title}
                </button>
              ))}
            </div>
          );
        })}
        {shown.length === 0 && <div className="settings-nav-none">Nothing matches “{query}”.</div>}
      </div>

      <div className="settings-nav-actions">
        <button type="button" onClick={() => setMany(ALL_SECTIONS.map((s) => s.id), true)}>
          Expand all
        </button>
        <button type="button" onClick={() => setMany(ALL_SECTIONS.map((s) => s.id), false)}>
          Collapse all
        </button>
      </div>
    </nav>
  );
}