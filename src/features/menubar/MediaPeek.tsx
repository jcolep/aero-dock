/**
 * The peek: rest the pointer on the Control Center button while something is playing and its Now Playing card
 * comes out of the button, hanging from the bar where the Control Center itself would open, in the way chosen under
 * Settings > Animations (the same ones as the media pill). It is the whole card: cover, scrubber, ten seconds each
 * way, shuffle and repeat, the list of players. It goes when the pointer has left both the button and the card, and
 * a click on the button opens the Control Center as ever (which takes its place).
 */

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReduced } from "../../engine/accessibility/policy";
import { animationsOf, islandMotion } from "../../engine/animation/presets";
import { ipc } from "../../ipc/commands";
import type { Settings } from "../../ipc/types";
import { MediaCard } from "./MediaCard";
import "./island.css";

/** How long the pointer rests on the button before the card comes out. */
const INTENT_MS = 380;
/** How long after it has gone before the card goes back: long enough to cross the gap to the card. */
const LINGER_MS = 520;
/** The card's width: the Control Center's. */
export const PEEK_WIDTH = 340;

interface PeekOptions {
  enabled: boolean;
  /** Something else is open (a menu, the Control Center): there is no peek. */
  suspended: boolean;
}

export function usePeek({ enabled, suspended }: PeekOptions) {
  // where it hangs from: the middle of the button, in the page
  const [at, setAt] = useState<{ cx: number } | null>(null);
  const enter = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const leave = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // each rest of the pointer is its own, so that an answer that arrives after the pointer has gone is not acted on
  const ask = useRef(0);
  const shown = useRef(false);
  shown.current = at !== null;

  const stop = useCallback(() => {
    ask.current++;
    clearTimeout(enter.current);
    clearTimeout(leave.current);
  }, []);

  const hoverIn = useCallback(
    (el: HTMLElement) => {
      clearTimeout(leave.current);
      if (!enabled || suspended || shown.current) return;
      clearTimeout(enter.current);
      const mine = ++ask.current;
      enter.current = setTimeout(() => {
        // only worth showing if something is playing
        ipc
          .widgetNowPlaying()
          .then((np) => {
            if (ask.current !== mine || !np?.active) return;
            const r = el.getBoundingClientRect();
            setAt({ cx: r.left + r.width / 2 });
          })
          .catch(() => undefined);
      }, INTENT_MS);
    },
    [enabled, suspended],
  );

  const hoverOut = useCallback(() => {
    ask.current++;
    clearTimeout(enter.current);
    clearTimeout(leave.current);
    leave.current = setTimeout(() => setAt(null), LINGER_MS);
  }, []);

  const keep = useCallback(() => clearTimeout(leave.current), []);

  useEffect(() => {
    if (suspended || !enabled) {
      stop();
      setAt(null);
    }
  }, [suspended, enabled, stop]);
  useEffect(() => stop, [stop]);

  return {
    at,
    /** Put these on the button the pointer rests on. */
    trigger: {
      onPointerEnter: (e: React.PointerEvent<HTMLElement>) => hoverIn(e.currentTarget),
      onPointerLeave: hoverOut,
    },
    /** And these on the card. */
    card: { onPointerEnter: keep, onPointerLeave: hoverOut },
  };
}

interface Props {
  settings: Settings;
  at: { cx: number } | null;
  handlers: { onPointerEnter: () => void; onPointerLeave: () => void };
  /** The window must (true) or need no longer (false) keep room under the bar for the card. */
  onRoom: (room: boolean) => void;
}

export function MediaPeek({ settings, at, handlers, onRoom }: Props) {
  const reduced = useReduced();
  const preset = animationsOf(settings).island;
  const speed = settings.appearance.animationSpeed;
  const m = useMemo(() => islandMotion(reduced.motion ? "none" : preset, "card", speed), [reduced.motion, preset, speed]);
  const gap = settings.menuBar.gap;

  useEffect(() => {
    if (at) onRoom(true);
  }, [at, onRoom]);

  // the card is pinned to the right of the bar, as the Control Center is, and grows out of the button: its origin is
  // the button's middle, measured from the card's own left edge
  const origin = at ? at.cx - (window.innerWidth - gap - 8 - PEEK_WIDTH) : PEEK_WIDTH / 2;

  return (
    <AnimatePresence onExitComplete={() => onRoom(false)}>
      {at && (
        <motion.div
          key="peek"
          className="mb-panel mb-peek"
          data-kind="peek"
          data-instant="true"
          role="dialog"
          aria-label="Now playing"
          style={{ width: PEEK_WIDTH, transformOrigin: `${origin}px 0px` }}
          initial={m.closed}
          animate={m.open}
          exit={m.closed}
          {...handlers}
        >
          <motion.div
            className="cc"
            initial={{ opacity: 0, filter: m.bodyBlur ? "blur(6px)" : "blur(0px)" }}
            animate={{ opacity: 1, filter: "blur(0px)", transition: { delay: m.bodyDelay, duration: 0.22 } }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
          >
            <MediaCard />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
