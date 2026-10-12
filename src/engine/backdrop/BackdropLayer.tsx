/**
 * What is behind a piece of glass, blurred, under its tint.
 *
 * The windows here are transparent web views, so `backdrop-filter` has nothing to sample (Windows does
 * not hand the page the desktop), and Windows' own blur can only be a rectangle. So the glass gets a
 * picture: Rust takes one of the screen behind it, with this program's windows left out of it, already
 * shrunk and blurred (`capture_backdrop`), and this lays it under the glass's tint, where the glass's own
 * rounded shape clips it, antialiased, to any corner.
 *
 * Put it as the first child of the glass (which must be positioned, round and have its own stacking
 * context, as `.glass` and the Start panel are). While there is a picture it sets `data-bd="on"` on that
 * element, which turns off the element's own tint (`--bd-tint`, which every glass rule keeps its tint in)
 * and has this layer draw the tint over the picture instead. With no picture (the blur is off, or cannot
 * be had) the element is as it always was.
 *
 * The picture is of a little more than the glass (`margin`), and is placed under it from where the glass
 * is now, at every frame while it moves, so that it stays where the desktop is as the glass slides.
 */

import { useEffect, useRef } from "react";

import { ipc } from "../../ipc/commands";

interface Props {
  /** Whether to keep the picture up to date. */
  active: boolean;
  /** How often to look again, in ms. */
  interval?: number;
  /** How much more than the glass is pictured, in px, for the glass to move or grow into. */
  margin?: number;
}

/** A picture's place in the window, in the page's pixels. */
interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
}

function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/** A custom property's number on an element, or a fallback. */
function numberOf(style: CSSStyleDeclaration, name: string, fallback: number): number {
  const v = parseFloat(style.getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
}

export function BackdropLayer({ active, interval = 220, margin = 48 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;
    if (!active) {
      delete host.dataset.bd;
      return;
    }

    let alive = true;
    let frame: Frame | null = null;
    let current = "";
    let timer: ReturnType<typeof setTimeout> | undefined;
    let raf = 0;
    let still = 0;
    let lastPose = "";
    let askedAt = 0;
    let busy = false;
    // the last picture's bytes, and how many looks in a row have found the same one
    let lastBytes: Uint8Array | null = null;
    let quiet = 0;

    /** Where the glass is, as its layout box and where it shows (it may be moved and scaled). */
    const pose = () => {
      const r = layer.getBoundingClientRect();
      const sx = layer.offsetWidth > 0 ? r.width / layer.offsetWidth : 1;
      const sy = layer.offsetHeight > 0 ? r.height / layer.offsetHeight : 1;
      return { r, sx: sx || 1, sy: sy || 1 };
    };

    /** Put the picture under the glass from where the glass is now; false when it is not covered. */
    const place = (): boolean => {
      if (!frame) return false;
      const { r, sx, sy } = pose();
      const key = `${r.left.toFixed(1)},${r.top.toFixed(1)},${r.width.toFixed(1)},${r.height.toFixed(1)}`;
      if (key !== lastPose) {
        lastPose = key;
        layer.style.setProperty("--bd-x", `${((frame.x - r.left) / sx).toFixed(2)}px`);
        layer.style.setProperty("--bd-y", `${((frame.y - r.top) / sy).toFixed(2)}px`);
        layer.style.setProperty("--bd-w", `${(frame.width / sx).toFixed(2)}px`);
        layer.style.setProperty("--bd-h", `${(frame.height / sy).toFixed(2)}px`);
      }
      return (
        frame.x <= r.left + 1 &&
        frame.y <= r.top + 1 &&
        frame.x + frame.width >= r.right - 1 &&
        frame.y + frame.height >= r.bottom - 1
      );
    };

    /** Follow the glass while it moves, and rest when it has not for a while. */
    const follow = () => {
      raf = 0;
      const before = lastPose;
      const covered = place();
      still = before === lastPose ? still + 1 : 0;
      // gone out from under the picture: a new one soon, without waiting for the next look
      if (!covered && frame && Date.now() - askedAt > 90) look();
      if (still < 24) raf = requestAnimationFrame(follow);
    };
    const wake = () => {
      quiet = 0;
      still = 0;
      if (!raf) raf = requestAnimationFrame(follow);
    };

    const look = async () => {
      if (busy) return;
      busy = true;
      clearTimeout(timer);
      askedAt = Date.now();
      const { r } = pose();
      const visible = r.width > 1 && r.height > 1 && getComputedStyle(host).visibility !== "hidden";
      if (visible && alive) {
        const style = getComputedStyle(host);
        const dpr = window.devicePixelRatio || 1;
        const blur = numberOf(style, "--glass-blur", 24) * numberOf(style, "--glass-intensity", 1);
        try {
          const buf = await ipc.captureBackdrop({
            x: r.left - margin,
            y: r.top - margin,
            width: r.width + 2 * margin,
            height: r.height + 2 * margin,
            dpr,
            blur,
            saturate: numberOf(style, "--glass-saturate", 1.2),
            brightness: numberOf(style, "--glass-brightness", 1),
          });
          if (!alive) return;
          const bytes = new Uint8Array(buf);
          const same = lastBytes !== null && sameBytes(lastBytes, bytes);
          if (same) {
            // nothing behind the glass has changed: nothing to swap, and no hurry to look again
            quiet = Math.min(quiet + 1, 6);
          } else if (buf.byteLength > 20) {
            quiet = 0;
            lastBytes = bytes;
            const header = new DataView(buf);
            const next = URL.createObjectURL(new Blob([new Uint8Array(buf, 16)], { type: "image/png" }));
            // decoded before it is shown, or the glass shows its bare tint for a moment at each look
            const img = new Image();
            img.src = next;
            await img.decode().catch(() => undefined);
            if (!alive) {
              URL.revokeObjectURL(next);
              return;
            }
            frame = {
              x: header.getInt32(0, true) / dpr,
              y: header.getInt32(4, true) / dpr,
              width: header.getInt32(8, true) / dpr,
              height: header.getInt32(12, true) / dpr,
            };
            layer.style.setProperty("--bd-image", `url("${next}")`);
            host.dataset.bd = "on";
            lastPose = "";
            place();
            const old = current;
            current = next;
            if (old) setTimeout(() => URL.revokeObjectURL(old), 600);
          } else {
            frame = null;
            lastBytes = null;
            delete host.dataset.bd;
          }
        } catch {
          frame = null;
          delete host.dataset.bd;
        }
      }
      busy = false;
      // looking less often while the desktop behind stands still
      if (alive) timer = setTimeout(look, interval * (1 + quiet));
    };

    // what moves it: its own style or class changing (motion writes the transform inline), its size,
    // and a stylesheet animation starting
    const observer = new MutationObserver(wake);
    let node: HTMLElement | null = host;
    for (let i = 0; i < 3 && node; i++, node = node.parentElement) {
      observer.observe(node, { attributes: true, attributeFilter: ["style", "class", "data-phase"] });
    }
    const sizes = new ResizeObserver(wake);
    sizes.observe(host);
    host.addEventListener("animationstart", wake);
    host.addEventListener("transitionrun", wake);

    look();
    wake();
    return () => {
      alive = false;
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      sizes.disconnect();
      host.removeEventListener("animationstart", wake);
      host.removeEventListener("transitionrun", wake);
      delete host.dataset.bd;
      if (current) URL.revokeObjectURL(current);
    };
  }, [active, interval, margin]);

  return <span ref={ref} className="bd-layer" aria-hidden />;
}
