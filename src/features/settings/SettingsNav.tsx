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
import { useGlideHighlight } from "../../engine/lens/useGlideHighlight";
import { useReduced } from "../../engine/accessibility/policy";
import { useSettings } from "../../state/settingsStore";

/** How long the pointer can be off a sidebar that came out at the edge before it goes again, in ms. */
const LEAVE_MS = 320;

/** How far past the sidebar's own right edge still counts as "near" it, so a slide-in that is still mid-transition
 *  (and so momentarily narrower than its resting width) does not read as a leave of its own accord. */
const EDGE_ZONE = 10;

export function SettingsNav({ sliding }: { sliding: boolean }) {
  const query = useSettingsUi((s) => s.query);
  const active = useSettingsUi((s) => s.active);
  const out = useSettingsUi((s) => s.sidebarOut);
  const setQuery = useSettingsUi((s) => s.setQuery);
  const setOut = useSettingsUi((s) => s.setSidebarOut);
  const leaving = useRef<number | undefined>(undefined);
  const sbRef = useRef<HTMLDivElement>(null);
  useEffect(() => () => window.clearTimeout(leaving.current), []);

  // the same gliding glass every other list in the app uses, on the one list here: the sidebar's own sections. Its
  // bend and the icon's magnification follow the menu bar's lens sliders (one set of sliders); its size does not.
  // The menu bar's reach (4 px all round) made it taller than the rows' own pitch, so it overlapped the rows above
  // and below, and the menu bar's drop-like squeeze made it narrow and slide off sideways as it went down the list.
  // Here it is the row, and it only travels and stretches along the list.
  const reduced = useReduced();
  const mb = useSettings((s) => s.settings?.menuBar);
  const lens = useGlideHighlight({
    items: ".sb-item",
    clips: ".sb-list",
    grow: 0,
    axis: "y",
    stretch: 14,
    warp: mb?.lensWarp ?? 1,
    still: reduced.motion,
  });

  // Escape puts a sliding sidebar away
  useEffect(() => {
    if (!sliding || !out) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && !query && setOut(null);
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [sliding, out, query, setOut]);

  // Whether the pointer counts as near the sidebar: read from real pointer coordinates against the sidebar's own
  // live rect (the dock's auto-hide zone does the same, for the same reason), not from the sidebar's own
  // pointerenter/pointerleave. The sidebar slides in by a transform, which moves its hit box through real
  // coordinates frame by frame; a pointer parked at the window's left edge (where the reveal strip below expects
  // it) sat still while the sliding panel's own left edge swept rightward past it, so the panel's leave fired on
  // its own, mid-slide, with the pointer having never actually moved — scheduling a close that then fought with a
  // reveal strip remounting under that same still pointer, flickering open and shut forever. Geometry does not
  // have that problem: a still pointer stays "near" or "away" by its own coordinates regardless of what the panel
  // is doing underneath it.
  useEffect(() => {
    if (!sliding) return;
    const move = (e: PointerEvent) => {
      const state = useSettingsUi.getState();
      const near = e.clientX <= (state.sidebarOut ? (sbRef.current?.getBoundingClientRect().right ?? EDGE_ZONE) + 4 : EDGE_ZONE);
      if (near) {
        window.clearTimeout(leaving.current);
        if (!state.sidebarOut) setOut("edge");
        return;
      }
      if (state.sidebarOut !== "edge") return;
      window.clearTimeout(leaving.current);
      leaving.current = window.setTimeout(() => {
        // not while the search box itself has the keyboard: the pointer is not the only way to be using it. A
        // click on a section also focuses that button, which used to be read the same way here — the search
        // box's own protection meant a sidebar you had just clicked a section in could never close on its own
        // again, since the clicked button kept the keyboard until something else took it. Only the search input
        // gets this.
        if (document.activeElement !== document.querySelector(".settings-search input")) setOut(null);
      }, LEAVE_MS);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [sliding, setOut]);

  const anyShown = GROUPS.some((g) => g.sections.some((s) => matches(s, query)));
  return (
    <>
      <aside
        ref={sbRef}
        className="sb glass"
        data-sliding={sliding}
        data-out={!sliding || !!out}
        aria-label="Settings sections"
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

        <nav
          className="sb-list"
          ref={lens.rootRef}
          style={{ ["--lens-scale" as string]: mb?.lensMagnify ?? 1.07 } as React.CSSProperties}
          {...lens.handlers}
        >
          {lens.Highlight}
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
      {/* the page beside a sidebar that is out: a click puts it away (leaving it, for one out at the edge, is
          handled by the pointermove geometry above, not by anything on this element) */}
      {sliding && out && <div className="sb-scrim" aria-hidden data-dim={out === "click"} onPointerDown={() => setOut(null)} />}
    </>
  );
}
