/**
 * The media pill: a small island of glass in the middle of the menu bar that holds what is playing and its
 * controls. It is not there while nothing plays; while something does it waits out of sight until the pointer
 * rests in the middle of the bar, grows out of that spot (the way the iPhone's island does, from nothing to its
 * width on a spring, its contents coming into focus a beat behind it), and goes back when the pointer leaves.
 * With the setting on it stays out instead.
 *
 * It reads the same media session as the Control Center's card, a little less often while it is away, and not at
 * all (nor is it drawn) when the setting is off. Clicking the cover or the title opens that card.
 */

import { motion, type Transition, type Variants } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReduced } from "../../engine/accessibility/policy";
import { playCue } from "../../engine/sound/ui";
import { ipc } from "../../ipc/commands";
import type { MenuBarSettings } from "../../ipc/types";
import { notify } from "../feedback/toastStore";
import { Glyph } from "./MediaCard";
import { useCoverTint } from "./useCoverTint";
import { useNowPlaying } from "./useNowPlaying";
import "./media.css";
import "./island.css";

/** The island's width when it is out, in px. */
export const ISLAND_WIDTH = 318;

/** How long the pointer has to rest in the middle of the bar before it comes out: long enough that crossing the bar
 *  does not raise it, short enough that it never feels like waiting. */
const INTENT_MS = 110;
/** How long after the pointer has gone before it goes back: long enough to cross the seam between the zone and the
 *  pill, or to be bumped off it and return. */
const LINGER_MS = 480;

const OUT: Transition = { type: "spring", stiffness: 360, damping: 28, mass: 0.95 };
const BACK: Transition = { type: "spring", stiffness: 520, damping: 40, mass: 0.8 };

const shell: Variants = {
  open: { width: ISLAND_WIDTH, opacity: 1, scale: 1, transition: OUT },
  closed: { width: 0, opacity: 0, scale: 0.55, transition: BACK },
};

const body: Variants = {
  open: { opacity: 1, filter: "blur(0px)", scale: 1, transition: { delay: 0.07, duration: 0.24, ease: [0.2, 0.7, 0.2, 1] } },
  closed: { opacity: 0, filter: "blur(7px)", scale: 0.92, transition: { duration: 0.1 } },
};

interface Props {
  look: MenuBarSettings;
  /** A menu or the Control Center is open: the island steps aside. */
  suspended: boolean;
  /** Open the Control Center from this element. */
  onOpenCard: (from: HTMLElement) => void;
}

export function MediaIsland({ look, suspended, onOpenCard }: Props) {
  const reduced = useReduced();
  const pinned = look.mediaIslandPinned;
  // whether the pointer (or the keyboard) is in the middle of the bar, after the intent delay
  const [near, setNear] = useState(false);
  const enter = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const leave = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wanted = (pinned || near) && !suspended;

  // asked for the cover only once it is wanted, and less often while it is away
  const { np, art, refresh, patch } = useNowPlaying({ art: wanted, pollMs: wanted ? 2000 : 4500 });
  const active = !!np?.active;
  const show = wanted && active;
  const tint = useCoverTint(art, show && look.mediaTint);

  const pointerIn = useCallback(() => {
    clearTimeout(leave.current);
    clearTimeout(enter.current);
    enter.current = setTimeout(() => setNear(true), INTENT_MS);
  }, []);
  const pointerOut = useCallback(() => {
    clearTimeout(enter.current);
    clearTimeout(leave.current);
    leave.current = setTimeout(() => setNear(false), LINGER_MS);
  }, []);
  useEffect(
    () => () => {
      clearTimeout(enter.current);
      clearTimeout(leave.current);
    },
    [],
  );

  // a sound as it comes out, once, and only for the hover (a pinned island is simply there)
  const wasShown = useRef(false);
  useEffect(() => {
    if (show && !wasShown.current && !pinned && !reduced.motion) playCue("hover", 5);
    wasShown.current = show;
  }, [show, pinned, reduced.motion]);

  // not "gone" until its way back has finished, so it is not left in the way (or in the tab order)
  const [gone, setGone] = useState(true);
  useEffect(() => {
    if (show) setGone(false);
  }, [show]);

  // ---- where in the track it is ----
  const [pos, setPos] = useState(0);
  const anchor = useRef({ at: 0, ms: 0 });
  useEffect(() => {
    if (!np) return;
    anchor.current = { at: performance.now(), ms: np.positionMs };
    setPos(np.positionMs);
  }, [np]);
  useEffect(() => {
    if (!show || !np?.playing || np.durationMs <= 0) return;
    const id = setInterval(() => {
      const a = anchor.current;
      setPos(Math.min(np.durationMs, a.ms + (performance.now() - a.at)));
    }, 500);
    return () => clearInterval(id);
  }, [show, np?.playing, np?.durationMs]);

  // ---- doing things ----
  const after = useCallback(() => {
    setTimeout(() => void refresh(), 250);
    setTimeout(() => void refresh(), 1100);
  }, [refresh]);
  const run = useCallback(
    (what: Promise<unknown>) => what.then(after).catch(notify.on("Could not control the player")),
    [after],
  );

  // a long title scrolls to show the rest of it
  const titleBox = useRef<HTMLDivElement>(null);
  const titleText = useRef<HTMLSpanElement>(null);
  const [over, setOver] = useState(0);
  const line = np ? [np.title || "Unknown", np.artist || np.album].filter(Boolean).join("  ·  ") : "";
  useLayoutEffect(() => {
    const box = titleBox.current;
    const text = titleText.current;
    if (box && text) setOver(Math.max(0, Math.ceil(text.scrollWidth - box.clientWidth)));
  }, [line, show]);

  if (!active) return null;

  const style = tint
    ? ({ ["--isl-a" as string]: tint.a, ["--isl-b" as string]: tint.b, ["--isl-accent" as string]: tint.accent } as React.CSSProperties)
    : undefined;
  const progress = np && np.durationMs > 0 ? Math.min(1, Math.max(0, pos / np.durationMs)) : 0;

  return (
    <div className="mb-island-layer" aria-hidden={!show || undefined}>
      <div
        className="mb-island-zone"
        data-out={show || undefined}
        onPointerEnter={pointerIn}
        onPointerLeave={pointerOut}
        onFocusCapture={() => {
          clearTimeout(leave.current);
          setNear(true);
        }}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) pointerOut();
        }}
      >
        <motion.div
          className="mb-island"
          role="group"
          aria-label="Now playing"
          style={{ ...style, visibility: gone ? "hidden" : "visible" }}
          variants={shell}
          initial={false}
          animate={show ? "open" : "closed"}
          transition={reduced.motion ? { duration: 0 } : undefined}
          onAnimationComplete={() => {
            if (!show) setGone(true);
          }}
        >
          <motion.div className="mb-island-body" variants={body} transition={reduced.motion ? { duration: 0 } : undefined}>
            <button
              type="button"
              className="isl-art"
              data-empty={!art || undefined}
              title="Open Now Playing"
              aria-label="Open Now Playing"
              onClick={(e) => onOpenCard(e.currentTarget)}
            >
              {art ? <img src={art} alt="" draggable={false} /> : <Glyph name="note" />}
            </button>
            <div
              ref={titleBox}
              className="isl-title"
              data-scroll={over > 0 && !reduced.motion ? "" : undefined}
              style={{ ["--np-over" as string]: `${over}px` }}
              title={over > 0 ? line : undefined}
            >
              <span ref={titleText}>
                <b>{np?.title || "Unknown"}</b>
                {(np?.artist || np?.album) && <i>{np.artist || np.album}</i>}
              </span>
            </div>
            <div className="isl-controls">
              <button
                type="button"
                className="isl-btn"
                aria-label="Previous track"
                title="Previous track"
                aria-disabled={!np?.canPrevious || undefined}
                onClick={() => {
                  if (!np?.canPrevious) return;
                  playCue("tick", 0);
                  void run(ipc.widgetMediaControl("previous"));
                }}
              >
                <Glyph name="prev" />
              </button>
              <button
                type="button"
                className="isl-btn isl-play"
                aria-label={np?.playing ? "Pause" : "Play"}
                title={np?.playing ? "Pause" : "Play"}
                onClick={() => {
                  if (!np) return;
                  playCue("tick", 2);
                  patch({ playing: !np.playing });
                  void run(ipc.widgetMediaControl("playpause"));
                }}
              >
                <Glyph name={np?.playing ? "pause" : "play"} />
              </button>
              <button
                type="button"
                className="isl-btn"
                aria-label="Next track"
                title="Next track"
                aria-disabled={!np?.canNext || undefined}
                onClick={() => {
                  if (!np?.canNext) return;
                  playCue("tick", 4);
                  void run(ipc.widgetMediaControl("next"));
                }}
              >
                <Glyph name="next" />
              </button>
            </div>
            <span className="isl-progress" aria-hidden>
              <span style={{ transform: `scaleX(${progress})` }} />
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
