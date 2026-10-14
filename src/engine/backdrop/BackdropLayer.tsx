/**
 * Frosted glass under a surface: what is behind the window, blurred, by the compositor.
 *
 * The windows here are transparent web views, and `backdrop-filter` only sees the page, not the desktop. So the blur
 * is the compositor's: Rust keeps a composition visual beneath the page for each piece of glass, painted with what is
 * behind the window, blurred, and clipped to the glass's own rounded rectangle (see `set_glass_pane`). This says
 * where the glass is, in the page's pixels, whenever it moves or changes; nothing comes back, and nothing is done
 * while it is still.
 *
 * Put it as the first child of the glass (which must be positioned, round and have its own stacking context, as
 * `.glass` and the Start panel are). While it is on it sets `data-bd="on"` on that element, which turns off the
 * element's own tint (`--bd-tint`, which every glass rule keeps its tint in) and has this layer draw the tint over
 * the blur instead, with the grain over that. Off, the element is as it always was.
 *
 * The glass is followed at every frame while it moves (its style or class changing, as motion writes its transform
 * inline; its size; a stylesheet animation or transition), and left alone once it has stood still for a moment.
 */

import { useId, useLayoutEffect, useRef } from "react";

import { ipc } from "../../ipc/commands";

interface Props {
  /** Whether there is glass under the surface. */
  active: boolean;
  /** How frosted, the frost setting (0 none, 40 and up all of it). */
  blur?: number;
  /** How much grain lies over the glass, 0 to 1. */
  grain?: number;
  /** Whose tint lies over the blur: the layer's (`layer`: the surface keeps its tint in `--bd-tint`, as `.glass`, the
   *  menu bar and the Start panel do, and the layer draws it over the blur), or the surface's own background, left as
   *  it is (`own`: a menu, a tooltip, a pill, whose own stylesheet says how see-through it is when frosted). */
  tint?: "layer" | "own";
  /** What the glass does while the surface moves: follow it frame by frame (`follow`: a bar, the Start panel, which
   *  move as rectangles), or step away and come back when it has come to rest (`settle`, the default: a menu, a
   *  card, a label, which fly in squashed, tilted or clipped, shapes the glass's rounded rectangle cannot take, and
   *  which a frame's lag would show around the edges). It fades in as it comes back (see glass.rs). */
  track?: "follow" | "settle";
}

/** How many frames a settling surface must stand still before its glass comes back. */
const SETTLE_FRAMES = 3;

/** Whether a finite animation is running on the element (an infinite one, a pulse say, is not travel). */
function animating(el: HTMLElement): boolean {
  return el.getAnimations().some((a) => a.playState === "running" && a.effect?.getComputedTiming().endTime !== Infinity);
}

/** How much of the blur shows for a frost setting. */
export function frostOpacity(blur: number): number {
  return Math.max(0, Math.min(1, blur / 40));
}

export function BackdropLayer({ active, blur = 30, grain = 0.35, tint = "layer", track = "settle" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();

  // a layout effect, not a passive one: it runs before the page is painted, so a surface that goes in one frame takes
  // its glass with it in that frame, instead of leaving the bare blur standing for a frame or two after it (which
  // flickered as the pointer crossed the dock's labels); and a new one says where it is before it is first seen
  useLayoutEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;
    const gone = () => ipc.setGlassPane({ id, shown: false }).catch(() => undefined);
    if (!active) {
      delete host.dataset.bd;
      void gone();
      return;
    }
    host.dataset.bd = tint === "layer" ? "on" : "glass";
    // the layer fills the surface: a surface that is not positioned is made so (which does not move it)
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    const frost = frostOpacity(blur);

    const settle = track === "settle";
    let raf = 0;
    let still = 0;
    let last = "";
    let seen = "";

    /** Where the glass is now (the whole surface, its border too), how round, and how much of it shows (its own
     *  fading, and its parents'). */
    const measure = () => {
      const r = host.getBoundingClientRect();
      const sx = host.offsetWidth > 0 ? r.width / host.offsetWidth : 1;
      const style = getComputedStyle(host);
      let opacity = frost;
      let shown = style.visibility !== "hidden" && style.display !== "none";
      for (let node: HTMLElement | null = host, i = 0; node && i < 5; node = node.parentElement, i++) {
        const s = node === host ? style : getComputedStyle(node);
        opacity *= parseFloat(s.opacity) || 0;
        if (s.visibility === "hidden") shown = false;
      }
      const radius = (parseFloat(style.borderTopLeftRadius) || 0) * (sx || 1);
      return { r, radius, opacity, shown: shown && opacity > 0.01 && r.width >= 1 && r.height >= 1 };
    };

    type Look = ReturnType<typeof measure>;
    const keyOf = ({ r, radius, opacity, shown }: Look) =>
      shown
        ? `${r.left.toFixed(1)},${r.top.toFixed(1)},${r.width.toFixed(1)},${r.height.toFixed(1)},${radius.toFixed(1)},${opacity.toFixed(2)}`
        : "off";

    /** Say where the glass is (or, with `look` null, that there is none just now), unless that is what was said last. */
    const post = (look: Look | null) => {
      const key = look ? keyOf(look) : "off";
      if (key === last) return;
      last = key;
      void ipc
        .setGlassPane(
          look && look.shown
            ? { id, shown: true, x: look.r.left, y: look.r.top, width: look.r.width, height: look.r.height, radius: look.radius, opacity: look.opacity, dpr: window.devicePixelRatio || 1 }
            : { id, shown: false },
        )
        .catch(() => undefined);
    };

    /** Follow the glass while it moves (or, settling, keep it away until the surface is at rest), and rest when it
     *  has stood still for a moment. */
    const follow = () => {
      raf = 0;
      const look = measure();
      const key = keyOf(look);
      still = key === seen ? still + 1 : 0;
      seen = key;
      const atRest = still >= SETTLE_FRAMES && !animating(host);
      post(!settle || atRest ? look : null);
      // a settling surface that has not come back yet is watched until it does
      if (still < 20 || (settle && look.shown && last === "off")) raf = requestAnimationFrame(follow);
    };
    const wake = () => {
      still = 0;
      if (!raf) raf = requestAnimationFrame(follow);
    };

    // what moves it: its own style or class changing (motion writes the transform inline), its size,
    // and a stylesheet animation starting; and a surface that starts to leave gives its glass up at once, before
    // the frame its exit begins in
    const observer = new MutationObserver(() => {
      if (settle && host.dataset.leaving === "true") post(null);
      wake();
    });
    let node: HTMLElement | null = host;
    for (let i = 0; i < 4 && node; i++, node = node.parentElement) {
      observer.observe(node, { attributes: true, attributeFilter: ["style", "class", "data-phase", "data-reveal", "data-leaving"] });
    }
    const sizes = new ResizeObserver(wake);
    sizes.observe(host);
    host.addEventListener("animationstart", wake);
    host.addEventListener("transitionrun", wake);
    window.addEventListener("resize", wake);

    wake();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      sizes.disconnect();
      host.removeEventListener("animationstart", wake);
      host.removeEventListener("transitionrun", wake);
      window.removeEventListener("resize", wake);
      delete host.dataset.bd;
      void gone();
    };
  }, [active, blur, id, tint, track]);

  return <span ref={ref} className="bd-layer" aria-hidden style={{ ["--bd-grain" as string]: grain } as React.CSSProperties} />;
}
