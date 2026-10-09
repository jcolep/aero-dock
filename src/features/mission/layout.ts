/**
 * Where the cards of the window overview go.
 *
 * A grid, because every window must be visible at once and a grid wastes the
 * least of a screen. The number of columns is the one that gives the windows
 * the most picture between them: each window is fitted, keeping its own shape,
 * into a cell, and the layout with the most area wins. A last row that is not
 * full is centred.
 */

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Fit {
  /** The picture's box, centred in its cell. */
  thumb: Box;
  /** The cell the card was given, including the room under the picture for its title. */
  cell: Box;
}

/** The height kept under each picture for the window's title. */
export const LABEL_HEIGHT = 30;

/**
 * `aspects` are widths over heights, one per window, in order. `heights`, if
 * given, are how tall each window really is: a picture is never made bigger than
 * its window, which a small window alone on a big screen would otherwise be.
 */
export function layoutGrid(aspects: number[], area: Box, gap: number, heights?: number[]): Fit[] {
  const n = aspects.length;
  if (n === 0) return [];

  let best: { cols: number; score: number } | null = null;
  for (let cols = 1; cols <= n; cols++) {
    const rows = Math.ceil(n / cols);
    const cellW = (area.w - gap * (cols - 1)) / cols;
    const cellH = (area.h - gap * (rows - 1)) / rows;
    if (cellW <= 0 || cellH <= LABEL_HEIGHT) continue;
    let score = 0;
    aspects.forEach((aspect, i) => {
      const h = Math.min(cellH - LABEL_HEIGHT, cellW / aspect, heights?.[i] ?? Infinity);
      score += h * (h * aspect);
    });
    if (!best || score > best.score) best = { cols, score };
  }
  const cols = best?.cols ?? n;
  const rows = Math.ceil(n / cols);
  const cellW = Math.max(1, (area.w - gap * (cols - 1)) / cols);
  const cellH = Math.max(LABEL_HEIGHT + 1, (area.h - gap * (rows - 1)) / rows);

  const fits: Fit[] = [];
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols);
    const inRow = row === rows - 1 ? n - row * cols : cols;
    // a short last row is centred
    const rowWidth = inRow * cellW + (inRow - 1) * gap;
    const left = area.x + (area.w - rowWidth) / 2;
    const cell: Box = {
      x: left + (i - row * cols) * (cellW + gap),
      y: area.y + row * (cellH + gap),
      w: cellW,
      h: cellH,
    };
    const h = Math.min(cellH - LABEL_HEIGHT, cellW / aspects[i], heights?.[i] ?? Infinity);
    const w = h * aspects[i];
    fits.push({ cell, thumb: { x: cell.x + (cellW - w) / 2, y: cell.y + (cellH - LABEL_HEIGHT - h) / 2, w, h } });
  }
  return fits;
}