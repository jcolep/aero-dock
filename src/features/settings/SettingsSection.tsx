/**
 * One section of the settings window: a card of glass with a title that folds
 * it away. Folded, it shows its blurb (what is inside) in one line. While
 * something is typed in the search box a section that answers it is shown open
 * and the others are hidden, without touching which ones were folded by hand.
 */

import type { ReactNode } from "react";
import { ALL_SECTIONS, GROUPS, matches, sectionById } from "./sections";
import { isOpen, useSettingsUi } from "./useSettingsUi";

export function SettingsSection({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  const def = sectionById(id);
  const query = useSettingsUi((s) => s.query);
  const stored = useSettingsUi((s) => s.open);
  const setOpen = useSettingsUi((s) => s.setOpen);
  if (!def) return <>{children}</>;
  if (query && !matches(def, query)) return null;

  const open = query ? true : isOpen(stored, id);
  return (
    <section id={`section-${id}`} data-section={id} data-open={open} className={`settings-card glass settings-section${className ? ` ${className}` : ""}`}>
      <h2>
        <button
          type="button"
          className="settings-section-head"
          aria-expanded={open}
          aria-controls={`section-body-${id}`}
          onClick={() => setOpen(id, !open)}
        >
          <span className="settings-section-title">{def.title}</span>
          {!open && <span className="settings-section-blurb">{def.blurb}</span>}
          <svg className="settings-section-chevron" viewBox="0 0 16 16" aria-hidden>
            <path d="m4.5 6 3.5 3.5L11.5 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h2>
      <div id={`section-body-${id}`} className="settings-section-body" data-open={open} role="region" aria-label={def.title}>
        <div className="settings-section-inner">{children}</div>
      </div>
    </section>
  );
}

/** A heading inside a section, to split a long one into parts. */
export function SettingsSub({ children }: { children: ReactNode }) {
  return <h3 className="settings-sub">{children}</h3>;
}

/** The heading over a group of sections; not shown when the search has hidden all of them. */
export function SettingsGroup({ id }: { id: string }) {
  const query = useSettingsUi((s) => s.query);
  const group = GROUPS.find((g) => g.id === id);
  if (!group || !group.sections.some((s) => matches(s, query))) return null;
  return (
    <h2 className="settings-group" id={`group-${id}`}>
      {group.title}
    </h2>
  );
}

/** What the page says when the search matches nothing. */
export function SettingsNoMatch() {
  const query = useSettingsUi((s) => s.query);
  const setQuery = useSettingsUi((s) => s.setQuery);
  if (!query || ALL_SECTIONS.some((s) => matches(s, query))) return null;
  return (
    <p className="settings-nomatch">
      Nothing in the settings matches “{query}”.{" "}
      <button type="button" onClick={() => setQuery("")}>
        Clear the search
      </button>
    </p>
  );
}
