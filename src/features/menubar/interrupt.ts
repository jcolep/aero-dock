/**
 * Turning back in the middle of an entrance.
 *
 * A menu that opens with a stylesheet animation and is closed a moment later,
 * before the entrance has finished, jumps: the exit starts from its first frame,
 * which is a different pose from wherever the entrance had got to. What a person
 * expects is the thing they were watching to turn round and go back the way it
 * came, from where it is.
 *
 * Web Animations can do exactly that (play an animation in reverse from its
 * current time), but not to a CSS animation, which the stylesheet owns and drops
 * when its class changes. So each running entrance animation under an element is
 * copied into an animation of the same keyframes and timing that script owns,
 * set to the same moment and played backwards. The caller then switches the
 * stylesheet's animations off for that element, and takes the element away when
 * the copies have finished.
 */

/** Reverse every entrance animation still running under `root`. Returns a
 *  promise for when they have all got back to the start, or null if there was
 *  nothing running to reverse (so the normal exit should play). */
export function reverseEntrance(root: HTMLElement): Promise<unknown> | null {
  // one that has finished has nothing to turn back (it is not "running"); one
  // that has not started, waiting out its delay, turns back by staying where it is
  const running = root
    .getAnimations({ subtree: true })
    .filter((a) => a instanceof CSSAnimation && a.playState === "running");
  if (running.length === 0) return null;

  const done: Promise<unknown>[] = [];
  for (const original of running) {
    const effect = original.effect as KeyframeEffect;
    const target = effect.target;
    if (!target) continue;
    const timing = effect.getTiming();
    const copy = target.animate(effect.getKeyframes(), {
      duration: timing.duration,
      delay: timing.delay,
      endDelay: timing.endDelay,
      easing: timing.easing,
      direction: timing.direction,
      iterations: 1,
      fill: "both",
      pseudoElement: effect.pseudoElement ?? undefined,
    });
    copy.pause();
    copy.currentTime = original.currentTime;
    copy.reverse();
    done.push(copy.finished.catch(() => undefined));
  }
  return Promise.all(done);
}
