/**
 * Searching the settings themselves, not only the sections.
 *
 * While something is typed every section is drawn, and this narrows what is drawn to the rows that answer it: a row
 * answers when every word typed is in its label, its hint, the heading of its group or the title of its section
 * (so "dock tint" finds Tint in the dock's section). A group with no row left is put away with its heading and its
 * footnote, and a section with none is put away too. A section that is itself named by the search (its title, its
 * blurb, its keywords) and has no row of its own that answers is shown whole, as before. The words found are marked
 * with the browser's text highlight.
 *
 * It works on what is on the page (rows are the section's direct children, and a group starts at each `.settings-sub`
 * heading), not on a list of the settings kept beside the screens, so a setting added to a screen is found without
 * being added anywhere else. What it finds is published as `hits` (rows, by section) for the sidebar and the header.
 */

import { useEffect } from "react";
import { matches, sectionById } from "./sections";
import { useSettingsUi } from "./useSettingsUi";

const HIDE = "data-search";
const MARK = "settings-find";

/** The words of a query: lowercase, split on spaces. */
export function wordsOf(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

/** Whether all of `words` are in `text`. */
export function hasAll(text: string, words: string[]): boolean {
  const hay = text.toLowerCase();
  return words.every((w) => hay.includes(w));
}

interface Group {
  heading: HTMLElement | null;
  items: HTMLElement[];
  notes: HTMLElement[];
}

/** A section's children as groups: a `.settings-sub` starts one, a `.settings-note` is the footer of the one before. */
function groupsOf(inner: HTMLElement): Group[] {
  const groups: Group[] = [{ heading: null, items: [], notes: [] }];
  for (const el of Array.from(inner.children) as HTMLElement[]) {
    if (el.classList.contains("settings-sub")) groups.push({ heading: el, items: [], notes: [] });
    else if (el.classList.contains("settings-note")) groups[groups.length - 1].notes.push(el);
    else groups[groups.length - 1].items.push(el);
  }
  return groups;
}

function hide(el: HTMLElement, on: boolean) {
  if (on) el.setAttribute(HIDE, "hide");
  else el.removeAttribute(HIDE);
}

/** Put everything back as it was drawn. */
function clear() {
  document.querySelectorAll(`[${HIDE}]`).forEach((e) => e.removeAttribute(HIDE));
  try {
    CSS.highlights?.delete(MARK);
  } catch {
    // no text highlight in this web view: the rows are narrowed all the same
  }
}

/** Mark where the words are in the text of the rows that are showing. */
function highlight(root: ParentNode, words: string[]) {
  try {
    if (!CSS.highlights) return;
    const ranges: Range[] = [];
    const walker = document.createTreeWalker(root as Node, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = (node as Text).parentElement;
      if (!parent || parent.closest(`[${HIDE}]`) || !parent.closest(".ctl-label, .ctl-hint, .settings-sub, .settings-note")) continue;
      const text = (node.textContent ?? "").toLowerCase();
      for (const w of words) {
        for (let at = text.indexOf(w); at !== -1; at = text.indexOf(w, at + w.length)) {
          const r = new Range();
          r.setStart(node, at);
          r.setEnd(node, at + w.length);
          ranges.push(r);
        }
      }
    }
    CSS.highlights.set(MARK, new Highlight(...ranges));
  } catch {
    // marking is a nicety
  }
}

/** Narrow the page to what `query` finds, and say how many rows each section has (a number per section id). */
export function applyRowSearch(query: string): Record<string, number> {
  const words = wordsOf(query);
  const hits: Record<string, number> = {};
  if (words.length === 0) {
    clear();
    return hits;
  }
  const scroll = document.querySelector(".settings-scroll");
  if (!scroll) return hits;
  for (const section of Array.from(scroll.querySelectorAll<HTMLElement>("section.settings-section"))) {
    const id = section.dataset.section ?? "";
    const def = sectionById(id);
    const inner = section.querySelector<HTMLElement>(".settings-section-inner");
    if (!def || !inner) continue;
    const groups = groupsOf(inner);
    const title = def.title;
    let rows = 0;
    const shown = new Set<HTMLElement>();
    for (const g of groups) {
      const heading = g.heading?.textContent ?? "";
      for (const item of g.items) {
        if (hasAll(`${item.textContent ?? ""} ${heading} ${title}`, words)) {
          shown.add(item);
          rows++;
        }
      }
    }
    // the section itself is what was asked for, and nothing in it is more particular: all of it
    const whole = rows === 0 && matches(def, query);
    for (const g of groups) {
      const any = g.items.some((i) => shown.has(i));
      for (const item of g.items) hide(item, !whole && !shown.has(item));
      if (g.heading) hide(g.heading, !whole && !any);
      for (const n of g.notes) hide(n, !whole && !any);
    }
    const count = whole ? groups.reduce((n, g) => n + g.items.length, 0) : rows;
    hide(section, count === 0);
    hits[id] = count;
  }
  highlight(scroll, words);
  return hits;
}

const same = (a: Record<string, number> | null, b: Record<string, number>) => {
  if (!a) return false;
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
};

/** Keep the page narrowed to the query while the settings window is open: when it changes, and when the page under it
 *  does (a row coming or going as a switch is thrown). */
export function useRowSearch() {
  const query = useSettingsUi((s) => s.query);
  useEffect(() => {
    const run = () => {
      const hits = applyRowSearch(query);
      const now = useSettingsUi.getState().hits;
      if (!query) {
        if (now) useSettingsUi.getState().setHits(null);
      } else if (!same(now, hits)) useSettingsUi.getState().setHits(hits);
    };
    // after the sections for this query are drawn
    let frame = requestAnimationFrame(run);
    const scroll = document.querySelector(".settings-scroll");
    let pending = 0;
    const observer = new MutationObserver(() => {
      if (!pending) {
        pending = requestAnimationFrame(() => {
          pending = 0;
          run();
        });
      }
    });
    // children only: the narrowing itself is an attribute, which must not call this again
    if (query && scroll) observer.observe(scroll, { childList: true, subtree: true, characterData: true });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      observer.disconnect();
      frame = 0;
      if (!useSettingsUi.getState().query) clear();
    };
  }, [query]);
}
