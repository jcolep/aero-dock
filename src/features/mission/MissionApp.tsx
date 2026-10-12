/**
 * Mission Control: every window of the screen the pointer is on, as cards in a
 * grid over a dimmed backdrop.
 *
 * Each card opens out from where its window really is, and settles; the live
 * picture in it is drawn by the compositor into this window (Rust places it
 * once the card has stopped, so it is never chasing a moving card). Click a
 * card to go to its window. Typing filters; the arrow keys move; Enter goes;
 * Escape clears the filter, then leaves and hands the keyboard back.
 *
 * The window is built once and kept hidden, so the page stays alive between
 * uses: everything about a showing is reset when Rust says it is open again.
 */

import { GlassTips } from "../../engine/tooltip/GlassTips";
import { listen } from "@tauri-apps/api/event";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReduced } from "../../engine/accessibility/policy";
import { playCue } from "../../engine/sound/ui";
import { applyAppearance } from "../../engine/themes/applyTheme";
import { ipc } from "../../ipc/commands";
import { exeDisplayName, useRunning } from "../../state/runningStore";
import { useDockIcons } from "../../state/dockStore";
import { useSettings } from "../../state/settingsStore";
import { LABEL_HEIGHT, layoutGrid, type Box } from "./layout";
import "./mission.css";

/** What Rust says when the overview opens. */
interface Opening {
  monitor: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  previous: number;
}

/** How long a card takes to settle, after which its picture is placed. */
const SETTLE_MS = 420;

export function MissionApp() {
  const { settings, hydrate } = useSettings();
  const { windows, hydrate: hydrateRunning } = useRunning();
  const iconUrls = useDockIcons((s) => s.iconUrls);
  const resolveIcons = useDockIcons((s) => s.resolveIcons);
  const reduced = useReduced();

  const [opening, setOpening] = useState<Opening | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  /** Where each window is now, in this page's own pixels (the monitor's top left is 0, 0). */
  const [origins, setOrigins] = useState<Record<number, Box>>({});
  const [gone, setGone] = useState<Set<number>>(new Set());
  const openedAt = useRef(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    hydrate();
    hydrateRunning();
  }, [hydrate, hydrateRunning]);
  useEffect(() => {
    if (settings) applyAppearance(settings, null, "dock");
  }, [settings]);

  // the windows on this screen, in a steady order
  const mine = useMemo(
    () =>
      opening
        ? windows
            .filter((w) => (w.monitor === "" || w.monitor === opening.monitor) && !gone.has(w.hwnd))
            .sort((a, b) => a.hwnd - b.hwnd)
        : [],
    [windows, opening, gone],
  );
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mine;
    return mine.filter((w) => w.title.toLowerCase().includes(q) || exeDisplayName(w.exe).toLowerCase().includes(q));
  }, [mine, query]);

  useEffect(() => {
    void resolveIcons(mine.map((w) => w.exe));
  }, [mine, resolveIcons]);

  // opened: reset, then find out where the windows are
  useEffect(() => {
    const un = listen<Opening>("mission://open", async (e) => {
      const o = e.payload;
      openedAt.current = performance.now();
      setQuery("");
      setSelected(0);
      setGone(new Set());
      setOrigins({});
      setOpening(o);
      const ids = useRunning.getState().windows.map((w) => w.hwnd);
      try {
        const rects = await ipc.windowRects(ids);
        const next: Record<number, Box> = {};
        for (const r of rects) {
          next[r.hwnd] = { x: (r.x - o.x) / o.scale, y: (r.y - o.y) / o.scale, w: r.width / o.scale, h: r.height / o.scale };
        }
        setOrigins(next);
      } catch {
        // without them the cards simply arrive where they are going
      }
      setTimeout(() => input.current?.focus(), 30);
    });
    return () => {
      un.then((fn) => fn());
    };
  }, []);

  const scale = opening?.scale ?? 1;
  const viewport = { w: (opening?.width ?? 1920) / scale, h: (opening?.height ?? 1080) / scale };

  // the grid, from the shapes of the windows
  const fits = useMemo(() => {
    const aspects = shown.map((w) => {
      const o = origins[w.hwnd];
      return o && o.h > 0 ? Math.min(2.4, Math.max(0.6, o.w / o.h)) : 16 / 10;
    });
    const area: Box = { x: viewport.w * 0.05, y: 96, w: viewport.w * 0.9, h: viewport.h - 96 - 56 };
    // never drawn bigger than the window really is
    const heights = shown.map((w) => origins[w.hwnd]?.h ?? Infinity);
    return layoutGrid(aspects, area, 28, heights);
  }, [shown, origins, viewport.w, viewport.h]);

  // the live pictures go in once the cards have settled, and come out of the way
  // while they move
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    clearTimeout(settle.current);
    if (!opening) return;
    ipc.hideWindowPreviews().catch(() => undefined);
    settle.current = setTimeout(() => {
      const slots = shown.flatMap((w, i) => {
        // a minimised window has no picture to show
        if (!origins[w.hwnd] || !fits[i]) return [];
        const t = fits[i].thumb;
        return [{ hwnd: w.hwnd, x: Math.round(t.x * scale), y: Math.round(t.y * scale), w: Math.round(t.w * scale), h: Math.round(t.h * scale) }];
      });
      if (slots.length > 0) ipc.showWindowPreviews(slots).catch(() => undefined);
    }, reduced.motion ? 30 : SETTLE_MS);
    return () => clearTimeout(settle.current);
  }, [opening, shown, fits, origins, scale, reduced.motion]);

  const leave = useCallback(
    (handBack: boolean) => {
      ipc.hideWindowPreviews().catch(() => undefined);
      ipc.closeMission().catch(() => undefined);
      if (handBack && opening?.previous) ipc.activateWindow(opening.previous).catch(() => undefined);
      setOpening(null);
    },
    [opening],
  );

  const go = useCallback(
    (hwnd: number) => {
      playCue("open");
      ipc.hideWindowPreviews().catch(() => undefined);
      ipc.closeMission().catch(() => undefined);
      ipc.activateWindow(hwnd).catch(() => undefined);
      setOpening(null);
    },
    [],
  );

  // how many cards are in a row, for the up and down arrows
  const columns = useMemo(() => {
    if (fits.length < 2) return 1;
    const firstRow = fits.filter((f) => Math.abs(f.cell.y - fits[0].cell.y) < 2).length;
    return Math.max(1, firstRow);
  }, [fits]);

  useEffect(() => {
    if (!opening) return;
    const onKey = (e: KeyboardEvent) => {
      const count = shown.length;
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          if (query) setQuery("");
          else leave(true);
          break;
        case "Enter":
          e.preventDefault();
          if (shown[selected]) go(shown[selected].hwnd);
          break;
        case "ArrowRight":
          e.preventDefault();
          setSelected((s) => Math.min(count - 1, s + 1));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setSelected((s) => Math.max(0, s - 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelected((s) => Math.min(count - 1, s + columns));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelected((s) => Math.max(0, s - columns));
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opening, shown, selected, query, columns, go, leave]);

  // losing the keyboard to something else ends the overview
  useEffect(() => {
    if (!opening) return;
    const onBlur = () => {
      if (performance.now() - openedAt.current > 600) leave(false);
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [opening, leave]);

  // the selection stays on a card that is there
  useEffect(() => {
    setSelected((s) => Math.max(0, Math.min(s, shown.length - 1)));
  }, [shown.length]);

  if (!opening) return <div className="mc-root" data-open="false" />;

  return (
    <div className="mc-root" data-open="true" onMouseDown={(e) => e.target === e.currentTarget && leave(true)}>
      <GlassTips side="below" />
      <div className="mc-search" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
          placeholder="Type to filter windows"
          aria-label="Filter windows"
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {shown.length === 0 && <div className="mc-empty">{mine.length === 0 ? "No windows open on this screen" : "No window matches"}</div>}

      <div className="mc-grid" role="listbox" aria-label="Windows">
        {shown.map((w, i) => {
          const fit = fits[i];
          if (!fit) return null;
          const from = origins[w.hwnd];
          const cell = fit.cell;
          const icon = iconUrls[w.exe];
          return (
            <motion.div
              key={w.hwnd}
              className="mc-card"
              role="option"
              aria-selected={i === selected}
              aria-label={`${w.title || exeDisplayName(w.exe)}, ${exeDisplayName(w.exe)}`}
              data-selected={i === selected}
              initial={
                !reduced.motion && from
                  ? // from where the window is: its picture's place, scaled to its size
                    { left: from.x, top: from.y, width: from.w, height: from.h, opacity: 0.4 }
                  : { left: cell.x, top: cell.y, width: cell.w, height: cell.h, opacity: 0 }
              }
              animate={{ left: cell.x, top: cell.y, width: cell.w, height: cell.h, opacity: 1 }}
              transition={reduced.motion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
              onMouseEnter={() => setSelected(i)}
              onClick={() => go(w.hwnd)}
            >
              <div
                className="mc-thumb"
                style={{
                  left: fit.thumb.x - cell.x,
                  top: fit.thumb.y - cell.y,
                  width: fit.thumb.w,
                  height: fit.thumb.h,
                }}
              >
                {!origins[w.hwnd] && icon && <img className="mc-big-icon" src={icon} alt="" draggable={false} />}
              </div>
              <div className="mc-title">
                {icon && <img src={icon} alt="" draggable={false} />}
                <span>{w.title || exeDisplayName(w.exe)}</span>
                <button
                  className="mc-close"
                  title="Close window"
                  aria-label={`Close ${w.title || exeDisplayName(w.exe)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    ipc.closeWindow(w.hwnd).catch(() => undefined);
                    setGone((g) => new Set(g).add(w.hwnd));
                  }}
                >
                  ×
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="mc-hint">
        {shown.length} window{shown.length === 1 ? "" : "s"} · Enter to go · Esc to close
      </div>
    </div>
  );
}

// the height kept under each picture, shared with the stylesheet through layout.ts
void LABEL_HEIGHT;