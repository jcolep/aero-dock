/**
 * A control that buds out of one end of the dock when the pointer goes near
 * that end, then pulls back in when it leaves. It sits outside the glass,
 * beside the bar, so appearing never moves the icons.
 *
 * It arrives the way every other flyout in the dock does: `springs.bloom`
 * (the settle spring, a breath of overshoot so it lands rather than stops),
 * scaling up from 0.86 to 1, from the edge it grows out of. This used to be
 * a bespoke three-phase squash-and-stretch of its own; the motion language
 * (`engine/motion/tokens.ts`) is explicit that a new surface uses one of the
 * four named springs and does not invent a fifth, which the old version did.
 * The look is still under review (it may stop being a reveal-on-approach
 * control at all); this is the shape it should take meanwhile.
 */

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { springs } from "../../engine/animation/springs";

interface DockSatelliteProps {
  /** Which end of the dock it hangs off. */
  side: "left" | "right";
  /** Pointer entered or left the control itself, to keep it from vanishing
   *  while the cursor is crossing the small gap to reach it. */
  onHover: (over: boolean) => void;
  children: ReactNode;
}

export function DockSatellite({ side, onHover, children }: DockSatelliteProps) {
  // grow out of the edge that touches the dock
  const origin = side === "left" ? "right center" : "left center";
  return (
    <motion.div
      className="dock-satellite"
      data-side={side}
      style={{ transformOrigin: origin }}
      initial={{ scale: 0.86, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: springs.bloom }}
      exit={{ scale: 0.93, opacity: 0, transition: { duration: 0.15 } }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {children}
    </motion.div>
  );
}
