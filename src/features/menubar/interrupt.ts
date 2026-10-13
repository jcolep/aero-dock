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
  // An entrance is an animation that ends. One that repeats for ever (a long title
  // scrolling in the Now Playing card) is not one, and turning it back would never
  // finish: the menu stayed up for as long as its copy took to play backwards, which
  // was seconds, and showed no exit. A very long one is not an entrance either.
  const running = root.getAnimations({ subtree: true }).filter((a) => {
    if (!(a instanceof CSSAnimation) || a.playState !== "running") return false;
    const timing = (a.effect as KeyframeEffect).getComputedTiming();
    return Number.isFinite(timing.iterations) && Number(timing.endTime) <= 2500;
  });
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

/** What `turnBack` is playing, and how to let go of it. */
export interface Turning {
  /** Resolves when everything has got back to where it was turned from. */
  done: Promise<void>;
  /** Cancel the copies, so that the stylesheet's own state shows again. */
  release: () => void;
}

/** The copies this file has made, so that turning one back again (a thing opened, closed and opened in a
 *  moment) reverses it where it is rather than copying a copy. */
const copies = new WeakSet<Animation>();

/**
 * The same, for a thing that stays (Start's panel, as against a menu that is taken away): the running
 * animations under `root` are turned back from where they are, whether the stylesheet's or the copies an
 * earlier turn made, and the caller says when it has had enough (`release`). Turning back in the middle of
 * a turn works the same way, so a thing pressed open, shut and open again goes where it was asked at every
 * moment and never restarts from its first frame.
 */
export function turnBack(root: HTMLElement): Turning | null {
  const running = root.getAnimations({ subtree: true }).filter((a) => {
    if (a.playState !== "running") return false;
    const timing = (a.effect as KeyframeEffect | null)?.getComputedTiming();
    return !!timing && Number.isFinite(timing.iterations) && Number(timing.endTime) <= 2500;
  });
  const turned: Animation[] = [];
  for (const a of running) {
    if (copies.has(a)) {
      a.reverse();
      turned.push(a);
    } else if (a instanceof CSSAnimation) {
      const effect = a.effect as KeyframeEffect;
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
      copy.currentTime = a.currentTime;
      copy.reverse();
      copies.add(copy);
      turned.push(copy);
    }
  }
  if (turned.length === 0) return null;
  return {
    done: Promise.all(turned.map((c) => c.finished.then(() => undefined, () => undefined))).then(() => undefined),
    release: () => turned.forEach((c) => c.cancel()),
  };
}