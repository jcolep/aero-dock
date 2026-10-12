/**
 * Tooltips in the app's own glass, for every element that has a `title`.
 *
 * The browser draws a title as a plain square of its own, which is the one
 * thing on screen that does not look like the rest. This takes that over: when
 * the pointer rests on something with a title, the title is set aside (so the
 * browser has nothing to draw), a pill of liquid glass is shown beside the
 * element, and the title is given back when the pointer leaves. Nothing else
 * has to change: every `title="..."` already in the pages, and every one added
 * later, is picked up. `data-tip` does the same for an element that should have
 * a tip but no title (a title is also its accessible name, which is not always
 * wanted).
 *
 * One of these is mounted per window. A window whose visible area is clipped
 * (the menu bar's, which is only as tall as what is in use) is told by
 * `onRoom` how far down the tip reaches, to make room for it.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReduced } from "../accessibility/policy";
import "./tooltip.css";

export type TipSide = "above" | "below" | "left" | "right";

interface Props {
  /** Which side of the element the tip prefers. It goes to the other if there is no room. */
  side?: TipSide;
  /** Called with how far down the page the tip reaches (in px) while one is showing, and null when none is. */
  onRoom?: (bottom: number | null) => void;
  /** How long the pointer rests before the tip appears. */
  delayMs?: number;
  /** No tips at all while true (a menu is open: its panel is what the pointer is dealing with). */
  off?: boolean;
}

/** The space between the element and the tip, and between the tip and the window's edge. */
const GAP = 9;
const MARGIN = 8;
/** After a tip went away, the next one comes quickly: moving along a row of buttons reads as one gesture. */
const WARM_MS = 500;

interface Showing {
  text: string;
  rect: DOMRect;
}

interface Placed {
  x: number;
  y: number;
  side: TipSide;
}

/** Where a tip of this size goes: on the wanted side if it fits, else on the opposite one, and always inside the window. */
export function placeTip(
  rect: { left: number; top: number; right: number; bottom: number },
  size: { w: number; h: number },
  view: { w: number; h: number },
  wanted: TipSide,
): Placed {
  const at = (s: TipSide): [number, number] => {
    const cx = (rect.left + rect.right) / 2;
    const cy = (rect.top + rect.bottom) / 2;
    switch (s) {
      case "below":
        return [cx - size.w / 2, rect.bottom + GAP];
      case "above":
        return [cx - size.w / 2, rect.top - GAP - size.h];
      case "right":
        return [rect.right + GAP, cy - size.h / 2];
      default:
        return [rect.left - GAP - size.w, cy - size.h / 2];
    }
  };
  const fits = (s: TipSide) => {
    const [x, y] = at(s);
    return x >= MARGIN && y >= MARGIN && x + size.w <= view.w - MARGIN && y + size.h <= view.h - MARGIN;
  };
  const opposite: Record<TipSide, TipSide> = { above: "below", below: "above", left: "right", right: "left" };
  const side = fits(wanted) || !fits(opposite[wanted]) ? wanted : opposite[wanted];
  let [x, y] = at(side);
  x = Math.max(MARGIN, Math.min(x, view.w - size.w - MARGIN));
  y = Math.max(MARGIN, Math.min(y, view.h - size.h - MARGIN));
  return { x, y, side };
}

export function GlassTips({ side = "below", onRoom, delayMs = 420, off = false }: Props) {
  const reduced = useReduced();
  const [showing, setShowing] = useState<Showing | null>(null);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const roomRef = useRef(onRoom);
  roomRef.current = onRoom;
  const offRef = useRef(off);
  offRef.current = off;
  /** Ends the tip showing now; set by the effect below so a change of `off` can call it. */
  const endRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    /** The element the pointer is on. Its title stays off for as long as the pointer is on it
     *  (not only while a tip shows), or the browser would draw its own plain one. */
    let current: HTMLElement | null = null;
    const stashed = new Map<HTMLElement, string>();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let watch: ReturnType<typeof setInterval> | undefined;
    let wentAt = 0;
    let shown = false;
    let observer: MutationObserver | null = null;

    const give = (el: HTMLElement) => {
      const title = stashed.get(el);
      if (title !== undefined) {
        // unless the page has since given it a title of its own
        if (!el.hasAttribute("title")) el.setAttribute("title", title);
        stashed.delete(el);
      }
    };

    /** Take the tip away. The pointer may still be on its element, whose title stays off. */
    const hideTip = () => {
      clearTimeout(timer);
      clearInterval(watch);
      if (shown) {
        shown = false;
        wentAt = Date.now();
        setShowing(null);
        setPlaced(null);
        roomRef.current?.(null);
      }
    };

    /** The pointer has left the element: the title goes back on it. */
    const leave = () => {
      hideTip();
      observer?.disconnect();
      observer = null;
      if (current) give(current);
      current = null;
    };

    const over = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("[title],[data-tip]") as HTMLElement | null;
      if (!el || el === current) return;
      leave();
      const title = el.getAttribute("title");
      if (title) {
        stashed.set(el, title);
        el.removeAttribute("title");
      }
      let text = (title ?? el.dataset.tip ?? "").trim();
      if (!text) {
        give(el);
        return;
      }
      current = el;
      // a title that is set again while the pointer is on it (a button that says "Pause", then
      // "Play", once pressed) is taken off again at once, and the tip says the new thing
      observer = new MutationObserver(() => {
        const again = el.getAttribute("title");
        if (!again) return;
        stashed.set(el, again);
        el.removeAttribute("title");
        text = again.trim();
        if (shown) setShowing((s) => (s ? { ...s, text } : s));
      });
      observer.observe(el, { attributes: true, attributeFilter: ["title"] });
      // no tip while a menu is open (the pointer is dealing with that), but no plain one either
      if (offRef.current) return;
      timer = setTimeout(
        () => {
          if (!current?.isConnected) return;
          shown = true;
          setShowing({ text, rect: current.getBoundingClientRect() });
          // an element that goes away under the pointer (a list that redraws) takes its tip with it
          watch = setInterval(() => {
            if (!current?.isConnected) leave();
          }, 250);
        },
        Date.now() - wentAt < WARM_MS ? 70 : delayMs,
      );
    };

    const out = (e: PointerEvent) => {
      if (current && !current.contains(e.relatedTarget as Node | null)) leave();
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && hideTip();

    document.addEventListener("pointerover", over, true);
    document.addEventListener("pointerout", out, true);
    // pressing, scrolling or leaving the window ends a tip: it has said what it had to
    document.addEventListener("pointerdown", hideTip, true);
    document.addEventListener("scroll", hideTip, true);
    document.addEventListener("keydown", key, true);
    window.addEventListener("blur", hideTip);
    endRef.current = hideTip;
    return () => {
      document.removeEventListener("pointerover", over, true);
      document.removeEventListener("pointerout", out, true);
      document.removeEventListener("pointerdown", hideTip, true);
      document.removeEventListener("scroll", hideTip, true);
      document.removeEventListener("keydown", key, true);
      window.removeEventListener("blur", hideTip);
      leave();
      for (const el of [...stashed.keys()]) give(el);
    };
  }, [delayMs]);

  // a menu opening ends the tip that is showing
  useEffect(() => {
    if (off) endRef.current();
  }, [off]);

  // measured before it is painted, so it never shows in the wrong place first
  useLayoutEffect(() => {
    if (!showing || !box.current) return;
    const size = { w: box.current.offsetWidth, h: box.current.offsetHeight };
    const p = placeTip(showing.rect, size, { w: window.innerWidth, h: window.innerHeight }, side);
    setPlaced(p);
    roomRef.current?.(p.y + size.h + GAP);
  }, [showing, side]);

  if (!showing) return null;
  return (
    <div
      ref={box}
      className="glass-tip"
      role="tooltip"
      data-side={placed?.side ?? side}
      data-still={reduced.motion || undefined}
      style={placed ? { left: placed.x, top: placed.y } : { left: 0, top: 0, visibility: "hidden" }}
    >
      {showing.text}
    </div>
  );
}
