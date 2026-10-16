/**
 * Where each dock icon rests, for magnification to measure the pointer against.
 *
 * The bar keeps centred, so as icons swell every icon slides: an icon measured where it is drawn moves under a still
 * pointer, and the swell chases its own tail (the icons shook, most near the ends). So each icon reports the spring of
 * the space it takes (`widths`), and as the pointer moves the bar works out, from those, where each would be if
 * nothing were swollen (`rest`). The swell is then a function of the pointer alone.
 */

import type { MotionValue } from "motion/react";

export interface MagnifyField {
  /** Each icon's button and the spring of the space it takes along the dock. */
  widths: Map<HTMLElement, MotionValue<number>>;
  /** Each icon's centre along the dock as it would be with nothing swollen, in window px. */
  rest: Map<HTMLElement, number>;
}

export function newMagnifyField(): MagnifyField {
  return { widths: new Map(), rest: new Map() };
}

/**
 * Work out the resting centres from where the icons are now. An icon's centre is where it rests, plus all the swell
 * of the icons before it, plus half its own, less half the swell of the whole bar (which grows both ways from its
 * middle).
 */
export function measureRest(field: MagnifyField, restSize: number, vertical: boolean): void {
  field.rest.clear();
  const icons = [...field.widths.keys()].filter((el) => el.isConnected);
  if (icons.length === 0) return;
  icons.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  const grown = icons.map((el) => field.widths.get(el)!.get() - restSize);
  const total = grown.reduce((a, g) => a + g, 0);
  let before = 0;
  icons.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    const drawn = vertical ? r.top + r.height / 2 : r.left + r.width / 2;
    field.rest.set(el, drawn - (before + grown[i] / 2 - total / 2));
    before += grown[i];
  });
}
