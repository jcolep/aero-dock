/**
 * Measurements of the dock that more than one place needs.
 *
 * The OS window is much taller than the dock (it has to hold the tallest
 * flyout), with the dock pinned to one edge of it. "The dock band" is the
 * strip along that edge that the dock itself, its magnified icons and its
 * tooltips occupy; it is what ambient effects are confined to, and what the
 * window-size maths starts from.
 */

import type { Settings } from "../../ipc/types";

/** Tooltip pill above the icons of a horizontal dock, in px. */
export const LABEL_SPACE = 44;
/** Tooltip pill beside the icons of a vertical dock, in px. */
export const LABEL_SPACE_SIDE = 150;

/** Thickness of the dock band across the dock's axis, in px: the icons at
 *  full magnification, the bar's padding, and room for a tooltip. */
export function dockBandSize(dock: Settings["dock"]): number {
  const vertical = dock.edge === "left" || dock.edge === "right";
  const peak = dock.magnification ? dock.magnificationScale : 1;
  // the gap between the bar and the screen edge is inside the window too
  const edgeGap = dock.floating ? dock.floatingMargin : 0;
  const lift = dock.magnification ? dock.iconSize * dock.magnificationLift : 0;
  return (
    dock.iconSize * peak + lift + dock.padding * 2 + (vertical ? LABEL_SPACE_SIDE : LABEL_SPACE) + edgeGap
  );
}
