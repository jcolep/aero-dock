/**
 * Magnification's layout: where each dock icon rests, and where everything in the bar is drawn as icons swell.
 *
 * Nothing in the bar moves by layout while the pointer swells it. Each icon keeps its slot (`--icon-size`), and every
 * frame a swell spring moves, `place` works out how far each thing in the bar is pushed along by the swelling of the
 * icons before it, and moves it there with the CSS `translate` property; the bar's glass (`.dock-body`, a layer of its
 * own) grows by half the whole swell at each end to hold them, also to the fraction (`grow`). Layout lands on whole pixels when it is painted, so when the icons took their room
 * by layout every icon stepped a pixel at a time while its drawing (a transform) grew smoothly, and the two
 * disagreed by up to half a pixel, back and forth: the icons shimmered, the last one most (it moves the furthest).
 * A translate is drawn where it says, to the fraction.
 *
 * The pointer is measured against where the icons rest (`rest`), not where they are drawn: the bar grows both ways
 * from its middle, so swelling icons slide, and measured where they were drawn the swell moved the icons, which moved
 * the swell (they shook, worst near the ends). From the rest positions the swell is a function of the pointer alone.
 */

import { frame, type MotionValue } from "motion/react";

export interface MagnifyField {
  /** Each icon's button and the spring of the room it takes along the dock with its swell. */
  widths: Map<HTMLElement, MotionValue<number>>;
  /** Each icon's centre along the dock as it rests, in window px. */
  rest: Map<HTMLElement, number>;
  /** What each thing in the bar was last moved along by (`translate`), in px. */
  offset: Map<HTMLElement, number>;
  /** The bar, its glass, what an icon's room is with no swell, and which way the dock runs (DockBar keeps these). */
  bar: HTMLElement | null;
  body: HTMLElement | null;
  restSize: number;
  vertical: boolean;
  /** Ask for everything to be placed again, on the next frame (once however often it is asked). */
  schedule: () => void;
}

export function newMagnifyField(): MagnifyField {
  let pending = false;
  const field: MagnifyField = {
    widths: new Map(),
    rest: new Map(),
    offset: new Map(),
    bar: null,
    body: null,
    restSize: 0,
    vertical: false,
    schedule: () => {
      if (pending) return;
      pending = true;
      // in the frame's render step, with the library's own: the springs have stepped, and the icons' drawings are
      // written in the same frame as their places
      frame.render(() => {
        pending = false;
        place(field);
      });
    },
  };
  return field;
}

// what is taken out of the flow (the glass layers) is not pushed along
const outOfFlow = new WeakMap<Element, boolean>();
function inFlow(el: Element): boolean {
  let out = outOfFlow.get(el);
  if (out === undefined) {
    const p = getComputedStyle(el).position;
    out = p === "absolute" || p === "fixed";
    outOfFlow.set(el, out);
  }
  return !out;
}

function move(field: MagnifyField, el: HTMLElement, by: number) {
  if (field.offset.get(el) === by) return;
  field.offset.set(el, by);
  el.style.translate = by === 0 ? "" : field.vertical ? `0 ${by.toFixed(3)}px` : `${by.toFixed(3)}px 0`;
}

/** The swell of an icon: the room it takes beyond its slot. */
function swell(field: MagnifyField, el: HTMLElement): number {
  const w = field.widths.get(el);
  return w ? w.get() - field.restSize : 0;
}

/**
 * Put everything in the bar where the swell has pushed it. A thing is moved along by all the swell of the icons
 * before it, less half the swell of the whole bar (which grows both ways from its middle); an icon by half its own
 * swell more, to its middle.
 */
export function place(field: MagnifyField): void {
  const bar = field.bar;
  if (!bar) return;
  let total = 0;
  for (const el of field.widths.keys()) if (el.isConnected) total += swell(field, el);
  let before = -total / 2;
  for (const child of bar.children) {
    if (!(child instanceof HTMLElement) || !inFlow(child)) continue;
    if (!child.classList.contains("dock-section")) {
      move(field, child, before);
      continue;
    }
    // a section of icons: each is a draggable item holding the icon's button; the divider between pinned and running
    // apps sits among them and is moved along like anything else in the bar
    for (const item of child.children) {
      const button = item.firstElementChild;
      if (!(button instanceof HTMLElement) || !field.widths.has(button)) {
        // (not one that is hidden: the divider is, with one side empty)
        if (item instanceof HTMLElement && !item.firstElementChild && item.offsetParent !== null) move(field, item, before);
        continue;
      }
      const g = swell(field, button);
      move(field, button, before + g / 2);
      button.style.setProperty("--grow", `${g.toFixed(3)}px`);
      before += g;
    }
  }
  grow(field, bar, total);
}

const lastGrow = new WeakMap<HTMLElement, string>();
/**
 * Draw the bar's glass grown by the swell, to the fraction of a pixel. Its box is the bar's with a whole number of
 * pixels more at each end (layout, which lands on whole pixels), drawn very slightly narrower about its middle (by at
 * most a pixel in the whole width: no one can see a glass narrowed by a fifth of a percent) to come out exactly as
 * wide as it should be. Then the frosted glass under it is told where it is, now, in the step that moved it: left to
 * look for itself on its own next frame, it saw where the bar had been, and trailed it by a frame (seen as flicker at
 * the bar's ends while it grew and shrank).
 */
function grow(field: MagnifyField, bar: HTMLElement, total: number) {
  const body = field.body;
  if (!body) return;
  const cs = getComputedStyle(bar);
  const along = field.vertical
    ? parseFloat(cs.height) + (cs.boxSizing === "border-box" ? 0 : parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom))
    : parseFloat(cs.width) + (cs.boxSizing === "border-box" ? 0 : parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight));
  if (!(along > 0)) return;
  const extra = Math.ceil(Math.max(0, total) / 2);
  const scale = (along + total) / (along + 2 * extra);
  const key = `${extra},${scale.toFixed(5)},${field.vertical}`;
  if (lastGrow.get(body) === key) return;
  lastGrow.set(body, key);
  body.style.setProperty("--grow-extra", `${extra}px`);
  body.style.setProperty("--grow-scale", scale.toFixed(5));
  body.dispatchEvent(new Event("bd-sync"));
}

/** Work out the resting centres: where each icon is drawn, less what it has been moved along by. */
export function measureRest(field: MagnifyField): void {
  field.rest.clear();
  for (const el of field.widths.keys()) {
    if (!el.isConnected) continue;
    const r = el.getBoundingClientRect();
    const drawn = field.vertical ? r.top + r.height / 2 : r.left + r.width / 2;
    field.rest.set(el, drawn - (field.offset.get(el) ?? 0));
  }
}
