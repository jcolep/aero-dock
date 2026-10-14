/**
 * The media pill: a small island of glass in the middle of the menu bar that holds what is playing and its
 * controls. It is not there while nothing plays; while something does it waits out of sight until the pointer
 * rests in the middle of the bar, comes out in the way chosen under Settings > Animations (a drop that swells
 * and wobbles into shape, a jelly, a fall from the top of the bar, and others: see `islandMotion`), and goes back
 * when the pointer leaves. With the setting on it stays out instead.
 *
 * It reads the same media session as the Control Center's card, a little less often while it is away, and not at
 * all (nor is it drawn) when the setting is off. Clicking the cover or the title opens that card; the hairline
 * along its foot is a scrubber.
 */

import { motion } from "motion/react";
import { useGlass } from "../../engine/backdrop/useGlass";
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useReduced } from "../../engine/accessibility/policy";
import { animationsOf, islandMotion } from "../../engine/animation/presets";
import { playCue } from "../../engine/sound/ui";
import { ipc } from "../../ipc/commands";
import type { MenuBarSettings, NowPlaying, Settings } from "../../ipc/types";
import { notify } from "../feedback/toastStore";
import { Glyph } from "./MediaCard";
import { useCoverTint } from "./useCoverTint";
import { useNowPlaying } from "./useNowPlaying";
import "./media.css";
import "./island.css";

/** The island's width when it is out, at most, in px. */
export const ISLAND_WIDTH = 318;

/** How long the pointer has to rest in the middle of the bar before it comes out: long enough that crossing the bar
 *  does not raise it, short enough that it never feels like waiting. */
const INTENT_MS = 110;
/** How long after the pointer has gone before it goes back: long enough to cross the seam between the zone and the
 *  pill, or to be bumped off it and return. */
const LINGER_MS = 480;

/** How wide the pill may be in a bar this wide: the middle third, so it never reaches the items on either side. */
export function islandWidth(barWidth: number): number {
  return Math.max(200, Math.min(ISLAND_WIDTH, Math.floor(barWidth / 3)));
}

interface Props {
  settings: Settings;
  look: MenuBarSettings;
  /** The bar's width, in px. */
  barWidth: number;
  /** A menu or the Control Center is open: the island steps aside. */
  suspended: boolean;
  /** Open the Control Center from this element. */
  onOpenCard: (from: HTMLElement) => void;
}

export function MediaIsland({ settings, look, barWidth, suspended, onOpenCard }: Props) {
  const menuBarGlass = useGlass("menuBar");
  const reduced = useReduced();
  const pinned = look.mediaIslandPinned;
  const width = islandWidth(barWidth);
  const speed = settings.appearance.animationSpeed;
  const preset = animationsOf(settings).island;
  const m = useMemo(() => islandMotion(reduced.motion ? "none" : preset, "pill", speed, width), [reduced.motion, preset, speed, width]);

  // whether the pointer (or the keyboard) is in the middle of the bar, after the intent delay
  const [near, setNear] = useState(false);
  const enter = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const leave = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wanted = (pinned || near) && !suspended;

  // asked for the cover only once it is wanted, and less often while it is away
  const { np: live, art, refresh, patch } = useNowPlaying({ art: wanted, pollMs: wanted ? 2000 : 4500 });
  // what was playing last, kept so that the pill can leave with its contents when the music stops under it
  const last = useRef<NowPlaying | null>(null);
  if (live?.active) last.current = live;
  const np = live?.active ? live : last.current;
  const active = !!live?.active;
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
    if (show) {
      setGone(false);
      return;
    }
    // and a timer too, because a way back that is cut short by another way out never completes
    const t = setTimeout(() => setGone(true), m.exitMs + 400);
    return () => clearTimeout(t);
  }, [show, m.exitMs]);

  // ---- where in the track it is ----
  const [pos, setPos] = useState(0);
  const anchor = useRef({ at: 0, ms: 0 });
  const holdUntil = useRef(0);
  useEffect(() => {
    if (!live?.active || performance.now() < holdUntil.current) return;
    anchor.current = { at: performance.now(), ms: live.positionMs };
    setPos(live.positionMs);
  }, [live]);
  useEffect(() => {
    if (!show || !live?.playing || live.durationMs <= 0) return;
    const id = setInterval(() => {
      const a = anchor.current;
      setPos(Math.min(live.durationMs, a.ms + (performance.now() - a.at)));
    }, 500);
    return () => clearInterval(id);
  }, [show, live?.playing, live?.durationMs]);

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
  }, [line, show, width]);

  if (!np || (!active && gone)) return null;

  const style = tint
    ? ({ ["--isl-a" as string]: tint.a, ["--isl-b" as string]: tint.b, ["--isl-accent" as string]: tint.accent } as React.CSSProperties)
    : undefined;
  const progress = np.durationMs > 0 ? Math.min(1, Math.max(0, pos / np.durationMs)) : 0;
  const canScrub = np.canSeek && np.durationMs > 0;

  /** A click on the hairline along the foot of the pill: go there. */
  const scrub = (e: React.PointerEvent<HTMLElement>) => {
    if (!canScrub) return;
    const r = e.currentTarget.getBoundingClientRect();
    const to = Math.round(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * np.durationMs);
    holdUntil.current = performance.now() + 1500;
    anchor.current = { at: performance.now(), ms: to };
    setPos(to);
    playCue("tick", 3);
    void run(ipc.mediaSeek(to));
  };

  return (
    <div className="mb-island-layer" aria-hidden={!show || undefined}>
      <div
        className="mb-island-zone"
        data-out={show || undefined}
        style={{ ["--isl-w" as string]: `${width}px` }}
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
          data-anim={reduced.motion ? "none" : preset}
          style={{ ...style, visibility: gone ? "hidden" : "visible" }}
          initial={false}
          animate={show ? m.open : m.closed}
        >
          <BackdropLayer active={menuBarGlass.active} blur={menuBarGlass.blur} grain={menuBarGlass.grain} tint="own" />
          <motion.div
            className="mb-island-body"
            style={{ width }}
            initial={false}
            animate={
              show
                ? { opacity: 1, filter: "blur(0px)", scale: 1, transition: { delay: m.bodyDelay, duration: 0.24, ease: [0.2, 0.7, 0.2, 1] } }
                : { opacity: 0, filter: m.bodyBlur ? "blur(7px)" : "blur(0px)", scale: m.bodyBlur ? 0.92 : 1, transition: { duration: 0.1 } }
            }
          >
            <button
              type="button"
              className="isl-art"
              data-empty={!art || undefined}
              title="Open Now Playing"
              aria-label="Open Now Playing"
              onClick={(e) => onOpenCard(e.currentTarget)}
            >
              {art ? <img key={np.key} src={art} alt="" draggable={false} /> : <Glyph name="note" />}
            </button>
            <div
              ref={titleBox}
              className="isl-title"
              data-scroll={over > 0 && !reduced.motion ? "" : undefined}
              style={{ ["--np-over" as string]: `${over}px` }}
              title={over > 0 ? line : undefined}
            >
              <span ref={titleText} key={np.key}>
                <b>{np.title || "Unknown"}</b>
                {(np.artist || np.album) && <i>{np.artist || np.album}</i>}
              </span>
            </div>
            <div className="isl-controls">
              <button
                type="button"
                className="isl-btn"
                aria-label="Previous track"
                title="Previous track"
                aria-disabled={!np.canPrevious || undefined}
                onClick={() => {
                  if (!np.canPrevious) return;
                  playCue("tick", 0);
                  void run(ipc.widgetMediaControl("previous"));
                }}
              >
                <Glyph name="prev" />
              </button>
              <button
                type="button"
                className="isl-btn isl-play"
                aria-label={np.playing ? "Pause" : "Play"}
                title={np.playing ? "Pause" : "Play"}
                onClick={() => {
                  playCue("tick", 2);
                  patch({ playing: !np.playing });
                  void run(ipc.widgetMediaControl("playpause"));
                }}
              >
                <Glyph name={np.playing ? "pause" : "play"} />
              </button>
              <button
                type="button"
                className="isl-btn"
                aria-label="Next track"
                title="Next track"
                aria-disabled={!np.canNext || undefined}
                onClick={() => {
                  if (!np.canNext) return;
                  playCue("tick", 4);
                  void run(ipc.widgetMediaControl("next"));
                }}
              >
                <Glyph name="next" />
              </button>
            </div>
            <span
              className="isl-progress"
              data-seek={canScrub || undefined}
              role={canScrub ? "slider" : undefined}
              aria-label={canScrub ? "Position in the track" : undefined}
              aria-valuemin={canScrub ? 0 : undefined}
              aria-valuemax={canScrub ? Math.round(np.durationMs / 1000) : undefined}
              aria-valuenow={canScrub ? Math.round(pos / 1000) : undefined}
              onPointerDown={scrub}
            >
              <span style={{ transform: `scaleX(${progress})` }} />
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
