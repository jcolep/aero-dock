/**
 * Dragging in the Start menu's pinned grid: a pinned tile picked up and moved makes the others slide aside to make
 * room where it would go, and is put down there; carried out of the grid and let go, it is unpinned. An app picked up
 * in All apps takes the panel back to Pinned (the grid is not on show beside it, as on Windows' own Start) and can be
 * put down among the pins, which pins it there; let go anywhere else, All apps comes back as it was.
 *
 * It is a press that becomes a drag once the pointer has moved 6 px, so a click still opens the app. What is carried is
 * a copy (the ghost) that follows the pointer on the panel; the tile it came from leaves a gap that moves with the place
 * it would go (`order`), and the grid's tiles slide into place (motion `layout`). The pointer is captured by the panel
 * for the drag, so its click lands on the panel, not on a tile, and nothing opens when it is let go.
 *
 * The grid's cells are worked out from its own style (columns, gaps, padding, row height, scroll), not from its tiles'
 * boxes, which move while they slide.
 */

import { animate, useMotionValue, type MotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { spring } from "../../engine/motion/tokens";

/** How far the pointer must move before a press becomes a drag. */
const SLOP = 6;
/** How near the grid's top or bottom the pointer scrolls it, and how fast at the very edge (px a frame). */
const SCROLL_EDGE = 28;
const SCROLL_MAX = 10;

export interface Pin {
  key: string;
  name: string;
  target: string;
  args?: string;
}

export interface Drag<T extends Pin> {
  item: T;
  from: "pinned" | "all";
  /** Where it would go among the pins (without it), or null if it is outside the grid. */
  insert: number | null;
  width: number;
  height: number;
  /** Going back to its place, or away, after it was let go. */
  landing: boolean;
}

interface Press<T> {
  x: number;
  y: number;
  item: T;
  from: "pinned" | "all";
  pointerId: number;
  /** Where in the tile it was taken, as a fraction of its size. */
  gx: number;
  gy: number;
}

interface Options<T extends Pin> {
  panel: () => HTMLElement | null;
  grid: () => HTMLElement | null;
  pinned: T[];
  same: (a: Pin, b: Pin) => boolean;
  /** A drag began (from All apps: show Pinned). */
  onBegin: (from: "pinned" | "all") => void;
  /** Put down in the grid: the pins in their new order. */
  onDrop: (order: T[]) => void;
  /** A pinned tile let go outside the grid. */
  onUnpin: (item: T) => void;
  /** An app from All apps let go outside the grid. */
  onCancel: () => void;
  /** Turned off (reduced motion only changes how it lands). */
  still?: boolean;
}

export interface PinDrag<T extends Pin> {
  drag: Drag<T> | null;
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** The pins as they are drawn now: during a drag, without the one carried and with a gap where it would go. */
  order: (T & { gap?: boolean })[];
  press: (e: React.PointerEvent<HTMLElement>, item: T, from: "pinned" | "all") => void;
}

export function usePinDrag<T extends Pin>(o: Options<T>): PinDrag<T> {
  const opts = useRef(o);
  opts.current = o;
  const [drag, setDrag] = useState<Drag<T> | null>(null);
  const dragRef = useRef<Drag<T> | null>(null);
  dragRef.current = drag;
  const pressed = useRef<Press<T> | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scrollFrame = useRef(0);

  /** The grid's cells, in the panel's coordinates. */
  const geometry = () => {
    const g = opts.current.grid();
    const p = opts.current.panel();
    if (!g || !p) return null;
    const cs = getComputedStyle(g);
    const gr = g.getBoundingClientRect();
    const pr = p.getBoundingClientRect();
    const cols = Math.max(1, cs.gridTemplateColumns.split(" ").filter(Boolean).length);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    const padT = parseFloat(cs.paddingTop) || 0;
    const gapX = parseFloat(cs.columnGap) || 0;
    const gapY = parseFloat(cs.rowGap) || 0;
    const colW = (g.clientWidth - padL - padR - gapX * (cols - 1)) / cols;
    const rowH = parseFloat(cs.gridAutoRows) || 92;
    return {
      cols,
      colW,
      rowH,
      gapX,
      gapY,
      left: gr.left - pr.left + padL,
      top: gr.top - pr.top + padT - g.scrollTop,
      box: { left: gr.left - pr.left, top: gr.top - pr.top, right: gr.right - pr.left, bottom: gr.bottom - pr.top },
    };
  };

  const cell = (i: number) => {
    const g = geometry();
    if (!g) return null;
    const col = i % g.cols;
    const row = Math.floor(i / g.cols);
    return { x: g.left + col * (g.colW + g.gapX), y: g.top + row * (g.rowH + g.gapY), w: g.colW, h: g.rowH };
  };

  /** Where among `count` pins a point on the panel would put it, or null outside the grid. */
  const insertAt = (px: number, py: number, count: number): number | null => {
    const g = geometry();
    if (!g) return null;
    const { box } = g;
    if (px < box.left - 12 || px > box.right + 12 || py < box.top - 16 || py > box.bottom + 16) return null;
    const col = Math.min(g.cols - 1, Math.max(0, Math.floor((px - g.left + g.gapX / 2) / (g.colW + g.gapX))));
    const row = Math.max(0, Math.floor((py - g.top + g.gapY / 2) / (g.rowH + g.gapY)));
    return Math.min(count, row * g.cols + col);
  };

  const others = (d: Drag<T>) => opts.current.pinned.filter((p) => !opts.current.same(p, d.item));

  const toPanel = (cx: number, cy: number) => {
    const pr = opts.current.panel()?.getBoundingClientRect();
    return { px: cx - (pr?.left ?? 0), py: cy - (pr?.top ?? 0) };
  };

  const follow = useCallback(() => {
    const d = dragRef.current;
    const p = pressed.current;
    if (!d || !p || d.landing) return;
    const { px, py } = toPanel(pointer.current.x, pointer.current.y);
    x.set(px - p.gx * d.width);
    y.set(py - p.gy * d.height);
    const insert = insertAt(px, py, others(d).length);
    if (insert !== d.insert) setDrag({ ...d, insert });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y]);

  // near the grid's top or bottom edge, it scrolls, and the place under the pointer follows
  const scrollLoop = useCallback(() => {
    cancelAnimationFrame(scrollFrame.current);
    const step = () => {
      const d = dragRef.current;
      const g = opts.current.grid();
      if (!d || d.landing || !g) return;
      const r = g.getBoundingClientRect();
      const py = pointer.current.y;
      const px = pointer.current.x;
      let dy = 0;
      if (px >= r.left && px <= r.right) {
        if (py < r.top + SCROLL_EDGE && py > r.top - SCROLL_EDGE) dy = -SCROLL_MAX * (1 - (py - (r.top - SCROLL_EDGE)) / (2 * SCROLL_EDGE));
        else if (py > r.bottom - SCROLL_EDGE && py < r.bottom + SCROLL_EDGE) dy = SCROLL_MAX * (1 - (r.bottom + SCROLL_EDGE - py) / (2 * SCROLL_EDGE));
      }
      if (dy !== 0) {
        g.scrollTop += dy;
        follow();
      }
      scrollFrame.current = requestAnimationFrame(step);
    };
    scrollFrame.current = requestAnimationFrame(step);
  }, [follow]);

  const begin = (p: Press<T>) => {
    const o = opts.current;
    // an app from All apps that is pinned already is the pinned tile moved
    const from = p.from === "all" && o.pinned.some((q) => o.same(q, p.item)) ? "pinned" : p.from;
    const item = from === "pinned" ? (o.pinned.find((q) => o.same(q, p.item)) ?? p.item) : p.item;
    // the ghost is a tile of the grid's size (a row from All apps becomes one), taken where it was pressed
    const c = cell(0);
    const width = c?.w ?? 88;
    const height = c?.h ?? 92;
    if (p.from === "all") {
      p.gx = 0.5;
      p.gy = 0.4;
    }
    const panel = o.panel();
    try {
      panel?.setPointerCapture(p.pointerId);
    } catch {
      /* the pointer has gone */
    }
    o.onBegin(p.from);
    const d: Drag<T> = { item, from, insert: null, width, height, landing: false };
    dragRef.current = d;
    setDrag(d);
    // where it is now, once the view it needs (Pinned) is laid out
    requestAnimationFrame(() => {
      if (dragRef.current?.from === "all" || p.from === "all") {
        const g = cell(0);
        if (g && dragRef.current) {
          const next = { ...dragRef.current, width: g.w, height: g.h };
          dragRef.current = next;
          setDrag(next);
        }
      }
      follow();
    });
    scrollLoop();
  };

  const finish = useCallback(() => {
    const d = dragRef.current;
    const o = opts.current;
    cancelAnimationFrame(scrollFrame.current);
    if (!d || d.landing) return;
    const rest = others(d);
    const done = () => {
      dragRef.current = null;
      setDrag(null);
      pressed.current = null;
    };
    const land = (to: { x: number; y: number } | null, then: () => void) => {
      const landing = { ...d, landing: true };
      dragRef.current = landing;
      setDrag(landing);
      if (!to || o.still) {
        then();
        done();
        return;
      }
      const ax = animate(x, to.x, spring.standard);
      const ay = animate(y, to.y, spring.standard);
      void Promise.all([ax, ay]).then(() => {
        then();
        done();
      });
    };
    if (d.insert !== null) {
      const order = [...rest.slice(0, d.insert), d.item, ...rest.slice(d.insert)];
      const c = cell(d.insert);
      land(c ? { x: c.x, y: c.y } : null, () => o.onDrop(order));
    } else if (d.from === "pinned") {
      land(null, () => o.onUnpin(d.item));
    } else {
      land(null, () => o.onCancel());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const p = pressed.current;
      if (!p || e.pointerId !== p.pointerId) return;
      pointer.current = { x: e.clientX, y: e.clientY };
      if (!dragRef.current) {
        if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < SLOP) return;
        begin(p);
        return;
      }
      follow();
    };
    const up = (e: PointerEvent) => {
      const p = pressed.current;
      if (!p || e.pointerId !== p.pointerId) return;
      if (dragRef.current) finish();
      else pressed.current = null;
    };
    const cancel = (e: PointerEvent) => {
      if (pressed.current && e.pointerId === pressed.current.pointerId) up(e);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      cancelAnimationFrame(scrollFrame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [follow, finish]);

  const press = useCallback((e: React.PointerEvent<HTMLElement>, item: T, from: "pinned" | "all") => {
    if (e.button !== 0 || dragRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    pressed.current = {
      x: e.clientX,
      y: e.clientY,
      item,
      from,
      pointerId: e.pointerId,
      gx: r.width > 0 ? (e.clientX - r.left) / r.width : 0.5,
      gy: r.height > 0 ? (e.clientY - r.top) / r.height : 0.5,
    };
    pointer.current = { x: e.clientX, y: e.clientY };
  }, []);

  let order: (T & { gap?: boolean })[] = o.pinned;
  if (drag) {
    const rest = o.pinned.filter((p) => !o.same(p, drag.item));
    order = drag.insert === null ? rest : [...rest.slice(0, drag.insert), { ...drag.item, gap: true }, ...rest.slice(drag.insert)];
  }
  return { drag, x, y, order, press };
}
