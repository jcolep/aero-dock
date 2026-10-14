/**
 * With motion to be kept down, the animation library moves things at once and only fades them, which is what its
 * reduced-motion mode does. Only the windows that animate with the library load it (and this): the frame's windows
 * draw with CSS and a canvas, and have no use for it.
 */

import { MotionConfig } from "motion/react";
import { useReduced } from "../engine/accessibility/policy";

export function MotionPolicy({ children }: { children: React.ReactNode }) {
  const reduced = useReduced();
  return <MotionConfig reducedMotion={reduced.motion ? "always" : "never"}>{children}</MotionConfig>;
}
