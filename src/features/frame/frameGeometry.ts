/**
 * The frame's shape, as the ring (the margin itself) draws it. The corner pieces laid over a maximised app are drawn
 * natively from the same numbers (platform/windows/corners.rs), so they meet the ring exactly.
 *
 * The clamping mirrors `geometry` in commands/frame.rs: the margin can never be
 * so wide that nothing is left, and the corners can never be rounder than the
 * opening allows. Keep the two in step.
 */

export interface Shape {
  w: number;
  h: number;
  pad: number;
  radius: number;
}

/** The margin and radius that fit in a window of this size. */
export function fitShape(w: number, h: number, padding: number, cornerRadius: number): Shape {
  const pad = Math.max(0, Math.min(padding, Math.floor((Math.min(w, h) - 2) / 2)));
  const opening = Math.max(0, Math.min(w - 2 * pad, h - 2 * pad));
  const radius = Math.max(0, Math.min(cornerRadius, Math.floor(opening / 2)));
  return { w, h, pad, radius };
}

/** The opening: a rounded rectangle, `pad` in from every side. */
export function openingPath({ w, h, pad, radius: r }: Shape): string {
  const x0 = pad;
  const y0 = pad;
  const x1 = w - pad;
  const y1 = h - pad;
  if (r <= 0) return `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;
  return (
    `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}` +
    `V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}` +
    `H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}` +
    `V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
  );
}

/** The whole window with the opening cut out of it (fill it evenodd). */
export function ringPath(shape: Shape): string {
  return `M0 0H${shape.w}V${shape.h}H0Z${openingPath(shape)}`;
}
