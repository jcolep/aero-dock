/**
 * What a gliding lens does to what is under it: bend it. One filter for every size
 * the lens takes, because the displacement map stretches with the lens (so the warp
 * stretches with the blob), then a touch of brightness and color, as light through
 * glass has. The menu bar's lens uses the same recipe (see `menubar/Lens.tsx`).
 *
 * Before any of that, what is see-through under the lens is thinned out of what it
 * bends (`SOLID_ONLY`): the browser lays the bent copy over the original, so a layer
 * that is half see-through came out twice as dense inside the lens. Over a light window
 * the Start menu's readability veil (55% dark ink) went nearly black in the lens; the
 * glass's own tint was doubled too, more faintly. Text and icons are solid, so they are
 * bent as before.
 */

import { displacementFilter } from "../glass/displacement";

/** Alpha to the fourth: 0.55 becomes 0.09, 0.9 becomes 0.66, solid stays solid. */
const SOLID_ONLY =
  "url('data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg"><filter id="solid" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="gamma" exponent="4"/></feComponentTransfer></filter></svg>`,
  ) +
  "#solid')";

/** The value of `backdrop-filter` for a lens that bends by `warp` (0 is not at all). */
export function refraction(warp: number, size = { width: 96, height: 64, radius: 22 }): string {
  const light = "brightness(1.1) saturate(1.45)";
  if (warp <= 0.01) return `${SOLID_ONLY} ${light}`;
  const url = displacementFilter({
    ...size,
    depth: 4.5,
    strength: Math.round(7 * warp * 10) / 10,
    chromaticAberration: Math.round(1 * warp * 10) / 10,
    stretch: true,
  });
  return `${SOLID_ONLY} url('${url}') ${light}`;
}
