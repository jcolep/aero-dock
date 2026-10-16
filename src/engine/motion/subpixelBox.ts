/**
 * A box that moves and changes size smoothly, to the fraction of a pixel.
 *
 * A box moved or sized by layout (`left`, `top`, `width`, `height`) lands on whole pixels when it is painted, so one
 * that travels or stretches frame by frame (the menu bar's lens, a panel's gliding highlight) steps a pixel at a time
 * and shimmers at its edges. This lays the box out at the top left, a whole number of pixels big, and puts it where it
 * should be with a translate, drawn a hair smaller to come out exactly the size it should be (by under a pixel in the
 * whole width or height: no one can see corners rounded a fraction of a percent off).
 *
 * Spread the result into a motion element's `style`; `squashX`/`squashY`, if given, are scales of its own about its
 * middle (a stretch), folded into the same scale.
 */

import { useTransform, type MotionValue } from "motion/react";

export function useSubpixelBox(
  left: MotionValue<number>,
  top: MotionValue<number>,
  width: MotionValue<number>,
  height: MotionValue<number>,
  squashX?: MotionValue<number>,
  squashY?: MotionValue<number>,
) {
  // the layout box: whole pixels, at least one (a box of none would scale by nothing into nothing, which is right)
  const boxW = useTransform(() => Math.max(1, Math.ceil(width.get() - 0.001)));
  const boxH = useTransform(() => Math.max(1, Math.ceil(height.get() - 0.001)));
  // scaled about its middle, so moved by its own left plus half of what the scale takes off
  const x = useTransform(() => left.get() - (boxW.get() - width.get()) / 2);
  const y = useTransform(() => top.get() - (boxH.get() - height.get()) / 2);
  const scaleX = useTransform(() => (Math.max(0, width.get()) / boxW.get()) * (squashX?.get() ?? 1));
  const scaleY = useTransform(() => (Math.max(0, height.get()) / boxH.get()) * (squashY?.get() ?? 1));
  return { left: 0, top: 0, width: boxW, height: boxH, x, y, scaleX, scaleY };
}
