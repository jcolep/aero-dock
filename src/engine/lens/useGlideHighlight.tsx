/**
 * A highlight that glides: one blob of glass that travels between the things
 * under the pointer in a panel, instead of each one lighting up on its own, the
 * way the menu bar's lens travels between its buttons (see `menubar/Lens.tsx`).
 *
 * It is a single element that is moved, and it moves as liquid does: its four
 * edges are springs of two speeds, the edges on the side it is heading for quick
 * and the ones it is leaving slow, so it stretches toward where it is going and
 * then pulls itself together there. It takes the shape of what it sits on (a
 * round button gets a round highlight, a tile a rounded square), is held to the
 * visible part of a scrolling list, and rests where the pointer is, or on the
 * item chosen with the keys, and fades when the pointer leaves.
 *
 * Like the menu bar's lens it lies above the things it highlights, so it has
 * them to bend: its backdrop filter pushes the pixels near its rim inward, and the
 * item under it is enlarged a little (`data-lensed`), as if seen through the glass.
 */

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { lens } from "../motion/tokens";
import { refraction } from "./refraction";
import { usePress, useSubpixelBox } from "../motion/subpixelBox";
import { playCue } from "../sound/ui";
import "./glide.css";

/** Spring of the edges that lead and of the edges that follow. */
const LEAD = lens.lead;
const TRAIL = lens.trail;
/** For an item that is not a hop away (the same one resizing). */
const SETTLE = lens.settle;
/** The most it stretches beyond the item it is heading for, however far the hop. */
const MAX_STRETCH = 70;

interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
  radius: number;
}

export interface GlideOptions {
  /** What can be highlighted: a selector for the items. */
  items: string;
  /** What scrolls and so clips them: a selector for the lists (an item is held to the part of its list in view). */
  clips?: string;
  /** How far the highlight reaches past an item, in px. */
  grow?: number;
  /** Move at once instead of gliding, for reduced motion. */
  still?: boolean;
  /** How strongly it bends what is under it; 0 is not at all. */
  warp?: number;
  /** `y` for a list of full-width rows (the settings sidebar): it keeps the rows' width and only glides and stretches
   *  along the list, without narrowing as it stretches, which on a wide row read as it sliding off sideways. */
  axis?: "both" | "y";
  /** The most it stretches beyond the item it is heading for, in px. */
  stretch?: number;
}

/** The first corner radius of an element, in px (a percentage is of the smaller side). */
function radiusOf(el: HTMLElement, width: number, height: number): number {
  const raw = getComputedStyle(el).borderTopLeftRadius;
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return 0;
  const px = raw.endsWith("%") ? (n / 100) * Math.min(width, height) : n;
  return Math.min(px, Math.min(width, height) / 2);
}

export function useGlideHighlight({ items, clips, grow = 3, still = false, warp = 1, axis = "both", stretch = MAX_STRETCH }: GlideOptions) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lensEl = useRef<HTMLSpanElement>(null);
  const backdrop = useMemo(() => refraction(warp), [warp]);
  const left = useMotionValue(0);
  const right = useMotionValue(0);
  const top = useMotionValue(0);
  const bottom = useMotionValue(0);
  const radius = useMotionValue(10);
  const opacity = useMotionValue(0);
  const current = useRef<HTMLElement | null>(null);
  const placed = useRef(false);
  const running = useRef<{ stop: () => void }[]>([]);
  const optionsRef = useRef({ items, clips, grow, still, axis, stretch });
  optionsRef.current = { items, clips, grow, still, axis, stretch };

  // the size of what it is heading for, and which way it is going on each axis
  const target = useRef({ w: 1, h: 1 });
  const heading = useRef({ x: 1, y: 1 });
  // what is drawn: the edges as they spring, with the trailing ones held within
  // MAX_STRETCH of the leading ones, so a long hop is a blob and not a bar
  const reach = () => optionsRef.current.stretch;
  const shownLeft = useTransform([left, right], ([l, r]: number[]) =>
    heading.current.x > 0 ? Math.max(l, r - (target.current.w + reach())) : l,
  );
  const shownRight = useTransform([left, right], ([l, r]: number[]) =>
    heading.current.x > 0 ? r : Math.min(r, l + (target.current.w + reach())),
  );
  const shownTop = useTransform([top, bottom], ([t, b]: number[]) =>
    heading.current.y > 0 ? Math.max(t, b - (target.current.h + reach())) : t,
  );
  const shownBottom = useTransform([top, bottom], ([t, b]: number[]) =>
    heading.current.y > 0 ? b : Math.min(b, t + (target.current.h + reach())),
  );
  const width = useTransform([shownLeft, shownRight], ([l, r]: number[]) => Math.max(0, r - l));
  const height = useTransform([shownTop, shownBottom], ([t, b]: number[]) => Math.max(0, b - t));
  // stretched one way it grows thinner the other, as a drop does (not in a list of rows: there it keeps their width)
  const squashY = useTransform([width], ([w]: number[]) => 1 / Math.max(1, w / Math.max(1, target.current.w)) ** 0.3);
  const squashX = useTransform([height], ([h]: number[]) =>
    optionsRef.current.axis === "y" ? 1 : 1 / Math.max(1, h / Math.max(1, target.current.h)) ** 0.3,
  );
  // pressing draws it in a little, about its own middle
  const press = usePress();
  const pressedX = useTransform(() => squashX.get() * press.amount.get());
  const pressedY = useTransform(() => squashY.get() * press.amount.get());
  const box = useSubpixelBox(shownLeft, shownTop, width, height, pressedX, pressedY);

  const setLensed = (el: HTMLElement | null) => {
    current.current?.removeAttribute("data-lensed");
    current.current = el;
    el?.setAttribute("data-lensed", "true");
  };

  /** Where an item is within the root, grown, and held to what its list shows. */
  const boxOf = (item: HTMLElement): Box | null => {
    const root = rootRef.current;
    if (!root) return null;
    const o = optionsRef.current;
    const rootRect = root.getBoundingClientRect();
    const r = item.getBoundingClientRect();
    let l = r.left;
    let t = r.top;
    let rr = r.right;
    let b = r.bottom;
    const clip = o.clips ? item.closest<HTMLElement>(o.clips) : null;
    if (clip) {
      const c = clip.getBoundingClientRect();
      l = Math.max(l, c.left);
      rr = Math.min(rr, c.right);
      t = Math.max(t, c.top);
      b = Math.min(b, c.bottom);
    }
    if (rr - l < 4 || b - t < 4) return null;
    // The highlight is placed in the root's own content, unscaled and unscrolled. A root that scrolls (the settings
    // sidebar's list) has its scroll added back: without it, once the list was scrolled the lens sat that far below
    // the row it was on. A root that is scaled (the Start menu while it rises or blooms open) is measured back into
    // its own size: a tile hovered mid-animation put the lens where the tile was in the shrunken panel, and with the
    // pointer then still, nothing moved it, so it was left floating over nothing.
    const kx = root.offsetWidth > 0 ? rootRect.width / root.offsetWidth : 1;
    const ky = root.offsetHeight > 0 ? rootRect.height / root.offsetHeight : 1;
    const sx = root.scrollLeft;
    const sy = root.scrollTop;
    return {
      left: (l - rootRect.left) / kx + sx - o.grow,
      right: (rr - rootRect.left) / kx + sx + o.grow,
      top: (t - rootRect.top) / ky + sy - o.grow,
      bottom: (b - rootRect.top) / ky + sy + o.grow,
      radius: radiusOf(item, (rr - l) / kx, (b - t) / ky) + o.grow,
    };
  };

  const goTo = useCallback(
    (item: HTMLElement) => {
      const box = boxOf(item);
      if (!box) return;
      const same = current.current === item;
      if (!same) playCue("tick");
      setLensed(item);
      target.current = { w: box.right - box.left, h: box.bottom - box.top };
      running.current.forEach((c) => c.stop());
      running.current = [];
      if (!placed.current || optionsRef.current.still) {
        // the first item it meets: it appears there rather than travelling
        placed.current = true;
        left.set(box.left);
        right.set(box.right);
        top.set(box.top);
        bottom.set(box.bottom);
        radius.set(box.radius);
      } else if (same) {
        running.current.push(
          animate(left, box.left, SETTLE),
          animate(right, box.right, SETTLE),
          animate(top, box.top, SETTLE),
          animate(bottom, box.bottom, SETTLE),
          animate(radius, box.radius, SETTLE),
        );
      } else {
        // the edges on the side it is heading for lead, the others follow
        const forwardX = box.left + box.right > left.get() + right.get();
        const forwardY = box.top + box.bottom > top.get() + bottom.get();
        heading.current = { x: forwardX ? 1 : -1, y: forwardY ? 1 : -1 };
        const alongOnly = optionsRef.current.axis === "y";
        running.current.push(
          animate(left, box.left, alongOnly ? SETTLE : forwardX ? TRAIL : LEAD),
          animate(right, box.right, alongOnly ? SETTLE : forwardX ? LEAD : TRAIL),
          animate(top, box.top, forwardY ? TRAIL : LEAD),
          animate(bottom, box.bottom, forwardY ? LEAD : TRAIL),
          animate(radius, box.radius, SETTLE),
        );
      }
      running.current.push(animate(opacity, 1, { duration: 0.14 }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [left, right, top, bottom, radius, opacity],
  );

  const fade = useCallback(() => {
    running.current.push(animate(opacity, 0, { duration: 0.2, delay: 0.04 }));
    // the next time it appears it appears in place
    placed.current = false;
    setLensed(null);
  }, [opacity]);

  /** Gone at once, and nothing lensed: for a panel that opens again (the Start menu), so nothing of the last time it
   *  was open is left lit. */
  const reset = useCallback(() => {
    running.current.forEach((c) => c.stop());
    running.current = [];
    opacity.jump(0);
    placed.current = false;
    setLensed(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opacity]);

  // a list scrolling moves what is under the pointer away from the highlight
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onScroll = () => fade();
    root.addEventListener("scroll", onScroll, true);
    return () => root.removeEventListener("scroll", onScroll, true);
  }, [fade]);

  const handlers = {
    onPointerOver: (e: React.PointerEvent<HTMLElement>) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>(optionsRef.current.items);
      if (item && rootRef.current?.contains(item)) goTo(item);
    },
    onPointerLeave: () => {
      press.release();
      fade();
    },
    // pressing draws the glass in a little
    onPointerDown: () => press.press(),
    onPointerUp: () => press.release(),
  };

  const Highlight = (
    <motion.span
      ref={lensEl}
      className="glide-highlight"
      aria-hidden
      // placed by transform, to the fraction of a pixel (by layout it stepped a pixel at a time as it glided)
      style={{ ...box, opacity, borderRadius: radius, backdropFilter: backdrop }}
    />
  );

  return { rootRef, Highlight, handlers, goTo, fade, reset };
}
