/**
 * What a gliding lens does to what is under it: bend it. One filter for every size
 * the lens takes, because the displacement map stretches with the lens (so the warp
 * stretches with the blob), then a touch of brightness and color, as light through
 * glass has. The menu bar's lens uses the same recipe (see `menubar/Lens.tsx`).
 */

import { displacementFilter } from "../glass/displacement";

/** The value of `backdrop-filter` for a lens that bends by `warp` (0 is not at all). */
export function refraction(warp: number, size = { width: 96, height: 64, radius: 22 }): string {
  const light = "brightness(1.1) saturate(1.45)";
  if (warp <= 0.01) return light;
  const url = displacementFilter({
    ...size,
    depth: 4.5,
    strength: Math.round(7 * warp * 10) / 10,
    chromaticAberration: Math.round(1 * warp * 10) / 10,
    stretch: true,
  });
  return `url('${url}') ${light}`;
}