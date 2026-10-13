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

import { useEffect, useId, useRef } from "react";

import { ipc } from "../../ipc/commands";

interface Props {
  /** Whether there is glass under the surface. */
  active: boolean;
  /** How frosted, the frost setting (0 none, 40 and up all of it). */
  blur?: number;
  /** How much grain lies over the glass, 0 to 1. */
  grain?: number;
}

/** How much of the blur shows for a frost setting. */
export function frostOpacity(blur: number): number {
  return Math.max(0, Math.min(1, blur / 40));
}

export function BackdropLayer({ active, blur = 30, grain = 0.35 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;
    const gone = () => ipc.setGlassPane({ id, shown: false }).catch(() => undefined);
    if (!active) {
      delete host.dataset.bd;
      void gone();
      return;
    }
    host.dataset.bd = "on";
    const frost = frostOpacity(blur);

    let raf = 0;
    let still = 0;
    let last = "";

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

    const send = () => {
      const { r, radius, opacity, shown } = measure();
      const key = shown
        ? `${r.left.toFixed(1)},${r.top.toFixed(1)},${r.width.toFixed(1)},${r.height.toFixed(1)},${radius.toFixed(1)},${opacity.toFixed(2)}`
        : "off";
      if (key === last) return false;
      last = key;
      void ipc
        .setGlassPane(
          shown
            ? { id, shown, x: r.left, y: r.top, width: r.width, height: r.height, radius, opacity, dpr: window.devicePixelRatio || 1 }
            : { id, shown: false },
        )
        .catch(() => undefined);
      return true;
    };

    /** Follow the glass while it moves, and rest when it has stood still for a moment. */
    const follow = () => {
      raf = 0;
      still = send() ? 0 : still + 1;
      if (still < 20) raf = requestAnimationFrame(follow);
    };
    const wake = () => {
      still = 0;
      if (!raf) raf = requestAnimationFrame(follow);
    };

    // what moves it: its own style or class changing (motion writes the transform inline), its size,
    // and a stylesheet animation starting
    const observer = new MutationObserver(wake);
    let node: HTMLElement | null = host;
    for (let i = 0; i < 4 && node; i++, node = node.parentElement) {
      observer.observe(node, { attributes: true, attributeFilter: ["style", "class", "data-phase", "data-reveal"] });
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
  }, [active, blur, id]);

  return <span ref={ref} className="bd-layer" aria-hidden style={{ ["--bd-grain" as string]: grain } as React.CSSProperties} />;
}
