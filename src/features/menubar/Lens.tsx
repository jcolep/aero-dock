/**
 * The sliding lens: one blob of glass that travels between the menu bar's
 * buttons under the pointer, instead of each button lighting up on its own.
 *
 * It is a single element that is moved, never one per button, and it moves the
 * way liquid does: its two edges are springs of different speeds, the leading
 * edge quick and the trailing one slow, so it stretches out across the gap
 * and then pulls itself together on the new button. Its own height dips a
 * little as it stretches. The button under it is enlarged slightly, as if seen
 * through it.
 *
 * It rests where the pointer is, or on the button whose menu is open, and
 * dissolves when the pointer leaves the bar with no menu open.
 */

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { lens } from "../../engine/motion/tokens";
import { playCue } from "../../engine/sound/ui";
import { displacementFilter } from "../../engine/glass/displacement";
import { usePress, useSubpixelBox } from "../../engine/motion/subpixelBox";

/**
 * What the lens does to what is under it: bend it. One filter for every size it
 * takes, because the map stretches with the lens (so the warp stretches with the
 * blob), then a touch of brightness and colour as light through glass has.
 * Drawn above the buttons, so it is their symbols it bends.
 */
function refraction(warp: number): string {
  const light = "brightness(1.1) saturate(1.45)";
  if (warp <= 0.01) return light;
  const url = displacementFilter({
    width: 96,
    height: 30,
    radius: 15,
    depth: 4,
    strength: Math.round(7 * warp * 10) / 10,
    chromaticAberration: Math.round(1 * warp * 10) / 10,
    stretch: true,
  });
  return `url('${url}') ${light}`;
}

/** The buttons the lens can sit on. */
const ITEM = ".mb-item";

/** Spring of the edge that leads and of the edge that follows. */
const LEAD = lens.lead;
const TRAIL = lens.trail;
/** The most it stretches beyond the button it is heading for, however far the
 *  hop: a blob, not a bar. The leading edge keeps its pace and the trailing one
 *  is held within this of it. */
const MAX_STRETCH = 84;
/** For a button that is not a hop away (the same one resizing). */
const SETTLE = lens.settle;

interface Box {
  left: number;
  right: number;
  top: number;
  height: number;
}

/** Where a button is within the bar, grown by `grow` on each side (a little
 *  less up and down, where the bar has only a few pixels to spare). */
function boxOf(item: HTMLElement, bar: HTMLElement, grow: number): Box {
  const b = bar.getBoundingClientRect();
  const r = item.getBoundingClientRect();
  const up = Math.min(grow, 3);
  return { left: r.left - b.left - grow, right: r.right - b.left + grow, top: r.top - b.top - up, height: r.height + 2 * up };
}

/** The ways the lens can be set. */
export interface LensLook {
  /** How far it reaches past its button, in px. */
  grow: number;
  /** How strongly it bends what is under it; 0 is not at all. */
  warp: number;
  /** Move to a button at once instead of sliding, for reduced motion. */
  still: boolean;
}

/**
 * Drives the lens. `Lens` is what to draw inside the bar, behind its buttons,
 * and `handlers` go on the bar itself. `activeKey` changes when a menu opens or
 * closes, so the lens can move to the button that is open.
 */
export function useLens(activeKey: string | null, look: LensLook) {
  const lookRef = useRef(look);
  lookRef.current = look;
  const backdrop = useMemo(() => refraction(look.warp), [look.warp]);
  const barRef = useRef<HTMLDivElement>(null);
  const left = useMotionValue(0);
  const right = useMotionValue(0);
  const top = useMotionValue(0);
  const height = useMotionValue(0);
  const opacity = useMotionValue(0);
  const current = useRef<HTMLElement | null>(null);
  // the last button it ticked for, and whether a menu is open (it then stays on that menu's button)
  const ticked = useRef<HTMLElement | null>(null);
  const activeRef = useRef(activeKey);
  activeRef.current = activeKey;
  const placed = useRef(false);
  const hovering = useRef(false);
  const pressedEl = useRef<HTMLSpanElement>(null);
  const controls = useRef<{ stop: () => void }[]>([]);
  const observer = useRef<ResizeObserver | null>(null);
  const observed = useRef<HTMLElement | null>(null);
  // the width of the button itself, to tell a resize of it from a first report
  const itemWidth = useRef(0);

  // the width of the button it is heading for, and which way it is going
  const target = useRef(1);
  const heading = useRef(1);
  // what is drawn: the two edges as they spring, but with the trailing one kept
  // within MAX_STRETCH of the leading one
  const shownLeft = useTransform([left, right], ([l, r]: number[]) =>
    heading.current > 0 ? Math.max(l, r - (target.current + MAX_STRETCH)) : l,
  );
  const shownRight = useTransform([left, right], ([l, r]: number[]) =>
    heading.current > 0 ? r : Math.min(r, l + (target.current + MAX_STRETCH)),
  );
  const width = useTransform([shownLeft, shownRight], ([l, r]: number[]) => Math.max(0, r - l));
  // how far it has stretched beyond the button it is heading for: it gets a
  // little thinner as it does
  const squash = useTransform([width], ([w]: number[]) => 1 / Math.max(1, w / Math.max(1, target.current)) ** 0.3);
  // pressing draws it in a little, about its own middle
  const press = usePress();
  const squashY = useTransform(() => squash.get() * press.amount.get());
  // placed by transform, to the fraction of a pixel (by layout it stepped a pixel at a time as it slid)
  const box = useSubpixelBox(shownLeft, top, width, height, press.amount, squashY);

  const setLensed = (el: HTMLElement | null) => {
    current.current?.removeAttribute("data-lensed");
    current.current = el;
    el?.setAttribute("data-lensed", "true");
  };

  /** Start the edges' springs from where the edges are drawn. The edge it is leaving is held within MAX_STRETCH of
   *  the one it is heading for only as it is drawn; its spring could be far behind (after a long hop), and the next
   *  move set off from there, so the lens stood stretched and off its button until that slow spring caught up. */
  const rebase = () => {
    const l = shownLeft.get();
    const r = shownRight.get();
    if (Math.abs(left.get() - l) > 0.5) left.jump(l);
    if (Math.abs(right.get() - r) > 0.5) right.jump(r);
  };

  /** Spring the edges to a box: the edge on the side it is heading for leads, the other follows. Setting off for a
   *  button it starts from where it is drawn (`rebase`); following the pointer, every move would take the edges'
   *  speed away that way, so it keeps it. */
  const travel = (to: { left: number; right: number }, fromDrawn = true) => {
    if (fromDrawn) rebase();
    const forward = to.left + to.right > left.get() + right.get();
    heading.current = forward ? 1 : -1;
    controls.current.push(animate(left, to.left, forward ? TRAIL : LEAD), animate(right, to.right, forward ? LEAD : TRAIL));
  };

  const goTo = useCallback(
    (item: HTMLElement) => {
      const bar = barRef.current;
      if (!bar) return;
      const box = boxOf(item, bar, lookRef.current.grow);
      const same = current.current === item;
      // a tick for each new button, not for coming back to the one just left across the gap beside it
      if (ticked.current !== item) playCue("tick");
      ticked.current = item;
      setLensed(item);
      observer.current ??= new ResizeObserver(() => {
        const el = current.current;
        if (!el || !barRef.current) return;
        // observing starts with a report of the size it already has, which is
        // not a change and must not cut short a slide that is under way
        if (Math.abs(el.getBoundingClientRect().width - itemWidth.current) < 0.5) return;
        goTo(el);
      });
      // watch only the button it is on (observing starts with a first report, so
      // watching the same one again would be a loop)
      if (observed.current !== item) {
        observer.current.disconnect();
        observer.current.observe(item);
        observed.current = item;
      }
      target.current = box.right - box.left;
      itemWidth.current = item.getBoundingClientRect().width;
      controls.current.forEach((c) => c.stop());
      controls.current = [];
      top.set(box.top);
      height.set(box.height);
      if (!placed.current || lookRef.current.still) {
        // the first button it meets: it appears there rather than travelling
        placed.current = true;
        left.set(box.left);
        right.set(box.right);
      } else if (same) {
        rebase();
        controls.current.push(animate(left, box.left, SETTLE), animate(right, box.right, SETTLE));
      } else {
        travel(box);
      }
      controls.current.push(animate(opacity, 1, { duration: 0.14 }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [left, right, top, height, opacity],
  );

  /** The pointer between buttons (the open middle of the bar, the gaps between buttons): the lens goes along under
   *  it, the size of the button it was last on, instead of waiting where it was. A long way across the bar is then a
   *  glide with the hand, and the button it comes to is a short hop away. It does not while a menu is open (it stays
   *  on that menu's button), nor once it has faded (it next appears on a button, in place). */
  const floatTo = (clientX: number) => {
    const bar = barRef.current;
    if (!bar || !placed.current || lookRef.current.still || activeRef.current || opacity.get() < 0.05) return;
    const b = bar.getBoundingClientRect();
    const x = clientX - b.left;
    const w = target.current;
    setLensed(null);
    observer.current?.disconnect();
    observed.current = null;
    controls.current.forEach((c) => c.stop());
    controls.current = [];
    travel({ left: x - w / 2, right: x + w / 2 }, false);
  };

  const fade = useCallback(() => {
    controls.current.push(animate(opacity, 0, { duration: 0.22, delay: 0.05 }));
    // the next time it appears it appears in place
    placed.current = false;
    setLensed(null);
    observer.current?.disconnect();
    observed.current = null;
  }, [opacity]);

  // a menu opening or closing moves the lens to the open button, or lets it go
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const open = bar.querySelector<HTMLElement>(`${ITEM}[data-active="true"]`);
    if (open) goTo(open);
    else if (!hovering.current) fade();
  }, [activeKey, goTo, fade]);

  // changing the size in settings re-fits the lens to the button it is on
  useEffect(() => {
    if (current.current) goTo(current.current);
  }, [look.grow, goTo]);

  useEffect(() => () => observer.current?.disconnect(), []);

  const handlers = {
    onPointerOver: (e: React.PointerEvent<HTMLElement>) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>(ITEM);
      if (!item) return;
      hovering.current = true;
      // with a menu open the lens stays on its button until another is chosen
      goTo(item);
    },
    // between buttons, the lens goes along under the pointer; over the media pill when it is out, it steps aside
    onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
      const el = e.target as HTMLElement;
      if (el.closest(ITEM)) return;
      if (el.closest(".mb-island-zone[data-out] .mb-island")) {
        if (placed.current) fade();
        return;
      }
      hovering.current = true;
      floatTo(e.clientX);
    },
    onPointerLeave: () => {
      hovering.current = false;
      const bar = barRef.current;
      const open = bar?.querySelector<HTMLElement>(`${ITEM}[data-active="true"]`);
      if (open) goTo(open);
      else fade();
    },
    onPointerDown: () => press.press(),
    onPointerUp: () => press.release(),
  };

  const Lens = (
    <motion.span
      ref={pressedEl}
      className="mb-lens"
      aria-hidden
      style={{ ...box, opacity, backdropFilter: backdrop }}
    />
  );

  return { barRef, Lens, handlers };
}
