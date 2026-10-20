/**
 * Snapping a widget as it is moved or resized: to a grid, and to the edges and middles of the other widgets and of the
 * screen. Pure (numbers in, numbers out), so that it can be checked on its own.
 *
 * Alignment comes before the grid: a widget near another's edge is pulled to it, and only where nothing is near does it
 * fall to the grid, so that a widget set beside another is not pushed off its edge by a grid that does not agree. The
 * guides it returns are the lines it aligned to, which the overlay draws while the widget is held.
 */

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SnapConfig {
  /** Snapping is on (Alt held inverts it for one move: the caller decides). */
  enabled: boolean;
  grid: boolean;
  size: number;
  align: boolean;
  threshold: number;
  margin: number;
  resize: boolean;
}

export interface Guides {
  /** x of vertical lines, y of horizontal ones. */
  v: number[];
  h: number[];
}

export const NO_GUIDES: Guides = { v: [], h: [] };

/** The points of the others along one axis that something can line up with: their start, middle and end. */
function targets(others: Box[], axis: "x" | "y", extent: number, margin: number): number[] {
  const out = [margin, extent / 2, extent - margin];
  for (const o of others) {
    const start = axis === "x" ? o.x : o.y;
    const len = axis === "x" ? o.w : o.h;
    out.push(start, start + len / 2, start + len);
  }
  return out;
}

/** The nearest of `points` to any of `held` within `threshold`: how far to move, and the line it lands on. */
function nearest(held: number[], points: number[], threshold: number): { delta: number; line: number } | null {
  let best: { delta: number; line: number } | null = null;
  for (const p of held) {
    for (const t of points) {
      const d = t - p;
      if (Math.abs(d) <= threshold && (!best || Math.abs(d) < Math.abs(best.delta))) best = { delta: d, line: t };
    }
  }
  return best;
}

const toGrid = (v: number, size: number) => Math.round(v / size) * size;

/** Where a widget being moved lands. */
export function snapMove(box: Box, others: Box[], bounds: { w: number; h: number }, cfg: SnapConfig): { x: number; y: number; guides: Guides } {
  const guides: Guides = { v: [], h: [] };
  let { x, y } = box;
  if (!cfg.enabled) return { x, y, guides };
  const found = (axis: "x" | "y") => {
    if (!cfg.align) return null;
    const start = axis === "x" ? box.x : box.y;
    const len = axis === "x" ? box.w : box.h;
    return nearest([start, start + len / 2, start + len], targets(others, axis, axis === "x" ? bounds.w : bounds.h, cfg.margin), cfg.threshold);
  };
  const ax = found("x");
  if (ax) {
    x += ax.delta;
    guides.v.push(ax.line);
  } else if (cfg.grid) {
    x = toGrid(x, cfg.size);
  }
  const ay = found("y");
  if (ay) {
    y += ay.delta;
    guides.h.push(ay.line);
  } else if (cfg.grid) {
    y = toGrid(y, cfg.size);
  }
  return { x, y, guides };
}

/** Where the bottom right corner of a widget being resized lands, as the size that gives. */
export function snapResize(box: Box, others: Box[], bounds: { w: number; h: number }, cfg: SnapConfig): { w: number; h: number; guides: Guides } {
  const guides: Guides = { v: [], h: [] };
  let { w, h } = box;
  if (!cfg.enabled || !cfg.resize) return { w, h, guides };
  const edge = (axis: "x" | "y") => {
    const start = axis === "x" ? box.x : box.y;
    const len = axis === "x" ? box.w : box.h;
    const found = cfg.align ? nearest([start + len], targets(others, axis, axis === "x" ? bounds.w : bounds.h, cfg.margin), cfg.threshold) : null;
    if (found) return { end: start + len + found.delta, line: found.line as number | null };
    return { end: cfg.grid ? toGrid(start + len, cfg.size) : start + len, line: null };
  };
  const ex = edge("x");
  const ey = edge("y");
  w = ex.end - box.x;
  h = ey.end - box.y;
  if (ex.line !== null) guides.v.push(ex.line);
  if (ey.line !== null) guides.h.push(ey.line);
  return { w, h, guides };
}
