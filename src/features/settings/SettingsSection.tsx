/**
 * One section of the settings window: its settings, shown when it is the section chosen in the sidebar. While
 * something is typed in the search box every section that answers it is shown instead, one under the other, each
 * under its own title.
 *
 * Inside, the rows (a label, and its switch, slider or choice) are drawn as rounded groups with hairlines between
 * them; a `SettingsSub` heading starts a new group, and a note after a group is its footer (settings.css).
 */

import type { ReactNode } from "react";
import { ALL_SECTIONS, matches, sectionById } from "./sections";
import { SectionIcon } from "./SectionIcon";
import { useSettingsUi } from "./useSettingsUi";

export function SettingsSection({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  const def = sectionById(id);
  const query = useSettingsUi((s) => s.query);
  const active = useSettingsUi((s) => s.active);
  if (!def) return <>{children}</>;
  if (query ? !matches(def, query) : active !== id) return null;
  return (
    <section id={`section-${id}`} data-section={id} className={`settings-section${className ? ` ${className}` : ""}`} aria-label={def.title}>
      {query && (
        <h2 className="settings-section-title">
          <SectionIcon id={id} size={20} />
          {def.title}
        </h2>
      )}
      <div className="settings-section-inner">{children}</div>
    </section>
  );
}

/** A heading inside a section, which starts a new group of rows. */
export function SettingsSub({ children }: { children: ReactNode }) {
  return <h3 className="settings-sub">{children}</h3>;
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
