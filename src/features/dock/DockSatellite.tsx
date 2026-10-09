/**
 * A control that buds out of one end of the dock when the pointer goes near
 * that end, then pulls back in when it leaves. It sits outside the glass,
 * beside the bar, so appearing never moves the icons.
 *
 * The motion is a squash and stretch: it starts as a flat sliver stuck to
 * the dock's edge, overshoots wide and short, rebounds tall and narrow, and
 * settles. Scaling from the edge it grows out of is what reads as a droplet
 * pulling away from the dock instead of a button fading in.
 */

import { motion } from "motion/react";
import type { ReactNode } from "react";

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
      initial={{ scaleX: 0.15, scaleY: 0.15, opacity: 0 }}
      animate={{
        scaleX: [0.15, 1.28, 0.9, 1],
        scaleY: [0.15, 0.8, 1.1, 1],
        opacity: 1,
        transition: {
          scaleX: { duration: 0.55, times: [0, 0.45, 0.75, 1], ease: "easeOut" },
          scaleY: { duration: 0.55, times: [0, 0.45, 0.75, 1], ease: "easeOut" },
          opacity: { duration: 0.14 },
        },
      }}
      exit={{
        scaleX: 0.15,
        scaleY: 0.15,
        opacity: 0,
        transition: { duration: 0.18, ease: "easeIn" },
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {children}
    </motion.div>
  );
}
