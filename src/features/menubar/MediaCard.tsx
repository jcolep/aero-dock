/**
 * The Now Playing card of the Control Center.
 *
 * It is the system's media session made visible: the cover (a browser hands
 * over the video's thumbnail), the program it comes from, a scrubber that can
 * be dragged, transport buttons that go back and forward ten seconds as well as
 * between tracks, shuffle and repeat where the player has them, a live
 * sound-wave of what is playing, and a card that takes its colours from the
 * cover. Players give as much or as little as they like, so each part appears
 * only when there is something behind it: a player that cannot seek gets a
 * progress bar that cannot be dragged, a live stream has no bar at all.
 */

import { listen } from "@tauri-apps/api/event";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReduced } from "../../engine/accessibility/policy";
import { ipc } from "../../ipc/commands";
import type { NowPlaying } from "../../ipc/types";
import { useDockIcons } from "../../state/dockStore";
import { useSettings } from "../../state/settingsStore";
import { layoutRect } from "../dock/layoutRect";
import { notify } from "../feedback/toastStore";
import { pickTint, type Tint } from "./tint";
import { useNowPlaying } from "./useNowPlaying";
import "./media.css";

const BANDS = 24;

/** m:ss, or h:mm:ss for a long one. */
export function clock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

// ---- glyphs: drawn here, not letters from a font, so they are the same everywhere ----

export type GlyphName = "play" | "pause" | "prev" | "next" | "back" | "forward" | "shuffle" | "repeat" | "repeat-one" | "note" | "live";

export function Glyph({ name }: { name: GlyphName }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (name) {
    case "play":
      return (
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M8 5.6v12.8a1 1 0 0 0 1.5.86l10.4-6.4a1 1 0 0 0 0-1.72L9.5 4.74A1 1 0 0 0 8 5.6z" fill="currentColor" />
        </svg>
      );
    case "pause":
      return (
        <svg viewBox="0 0 24 24" aria-hidden>
          <rect x="6.2" y="5" width="4.2" height="14" rx="1.3" fill="currentColor" />
          <rect x="13.6" y="5" width="4.2" height="14" rx="1.3" fill="currentColor" />
        </svg>
      );
    case "prev":
    case "next":
      return (
        <svg viewBox="0 0 24 24" aria-hidden style={name === "next" ? { transform: "scaleX(-1)" } : undefined}>
          <rect x="4.6" y="5" width="2.6" height="14" rx="1.3" fill="currentColor" />
          <path d="M19.2 6.3v11.4a.9.9 0 0 1-1.4.75L9.5 12.75a.9.9 0 0 1 0-1.5l8.3-5.7a.9.9 0 0 1 1.4.75z" fill="currentColor" />
        </svg>
      );
    case "back":
    case "forward":
      return (
        <svg viewBox="0 0 24 24" aria-hidden>
          <g transform={name === "forward" ? "matrix(-1 0 0 1 24 0)" : undefined} {...stroke}>
            <path d="M12 4.8a7.2 7.2 0 1 1-6.9 5.2" />
            <path d="M12 1.9 8.7 4.8 12 7.7" />
          </g>
          <text x="12" y="15.4" fontSize="7.4" fontWeight="700" textAnchor="middle" fill="currentColor">
            10
          </text>
        </svg>
      );
    case "shuffle":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...stroke}>
          <path d="M3.5 7.3h3.2c1.6 0 2.8.7 3.7 2l3.2 4.9c.9 1.3 2.1 2 3.7 2h3.2" />
          <path d="M17.6 12.7l3 2.8-3 2.8" />
          <path d="M3.5 16.7h3.2c1.4 0 2.5-.5 3.4-1.6M13.7 9c.9-1 2.1-1.7 3.6-1.7h3.2" />
          <path d="M17.6 4.5l3 2.8-3 2.8" />
        </svg>
      );
    case "repeat":
    case "repeat-one":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...stroke}>
          <path d="M4 11.2V10a3.5 3.5 0 0 1 3.5-3.5h12" />
          <path d="M16.6 3.4l3 3.1-3 3.1" />
          <path d="M20 12.8V14a3.5 3.5 0 0 1-3.5 3.5h-12" />
          <path d="M7.4 14.4l-3 3.1 3 3.1" />
          {name === "repeat-one" && (
            <text x="12" y="14.4" fontSize="7" fontWeight="700" textAnchor="middle" fill="currentColor" stroke="none">
              1
            </text>
          )}
        </svg>
      );
    case "live":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...stroke}>
          <rect x="3.5" y="5" width="17" height="11.5" rx="2.4" />
          <path d="M8.5 20h7" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
          <path d="M9 4.2v10.3a3.2 3.2 0 1 0 1.8 2.9V8.6l7.2-1.6v5.5a3.2 3.2 0 1 0 1.8 2.9V4.9a.7.7 0 0 0-.85-.68l-9.1 2z" />
        </svg>
      );
  }
}

function Button({
  glyph,
  label,
  onClick,
  size,
  on,
  disabled,
}: {
  glyph: GlyphName;
  label: string;
  onClick: () => void;
  size?: "big";
  on?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="np-btn"
      data-size={size}
      data-on={on || undefined}
      aria-label={label}
      aria-pressed={on === undefined ? undefined : on}
      aria-disabled={disabled || undefined}
      title={label}
      onClick={() => !disabled && onClick()}
    >
      <Glyph name={glyph} />
    </button>
  );
}

// ---- the sound wave ----

function SoundWave({ active, color }: { active: boolean; color: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const target = useRef<number[]>(new Array(BANDS).fill(0));

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!active || !el || !ctx) return;
    let live = true;
    const ratio = window.devicePixelRatio || 1;
    el.width = Math.round(el.clientWidth * ratio);
    el.height = Math.round(el.clientHeight * ratio);

    // the listener on the Rust side runs only while it is asked for every few seconds
    void ipc.mediaSpectrum(true).catch(() => undefined);
    const keep = setInterval(() => void ipc.mediaSpectrum(true).catch(() => undefined), 1200);
    const unlisten = listen<number[]>("media://spectrum", (e) => {
      if (live) target.current = e.payload;
    });

    const shown = new Array<number>(BANDS).fill(0);
    let raf = 0;
    let last = 0;
    let flat = false;
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (t - last < 33) return;
      last = t;
      let tallest = 0;
      for (let i = 0; i < BANDS; i++) {
        const want = (target.current[i] ?? 0) / 255;
        // quick to rise, slow to fall: the bars breathe instead of flickering
        shown[i] += (want - shown[i]) * (want > shown[i] ? 0.6 : 0.16);
        tallest = Math.max(tallest, shown[i]);
      }
      if (tallest < 0.004 && flat) return;
      flat = tallest < 0.004;
      const { width: w, height: h } = el;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      const gap = 2.5 * ratio;
      const bar = (w - gap * (BANDS - 1)) / BANDS;
      for (let i = 0; i < BANDS; i++) {
        const bh = Math.max(2 * ratio, shown[i] * h);
        const x = i * (bar + gap);
        ctx.beginPath();
        ctx.roundRect(x, (h - bh) / 2, bar, bh, bar / 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      live = false;
      cancelAnimationFrame(raf);
      clearInterval(keep);
      void unlisten.then((fn) => fn());
      void ipc.mediaSpectrum(false).catch(() => undefined);
      target.current = new Array(BANDS).fill(0);
    };
  }, [active, color]);

  return <canvas ref={canvas} className="np-wave" aria-hidden data-on={active || undefined} />;
}

// ---- the scrubber ----

function Scrubber({
  np,
  position,
  onScrub,
  onCommit,
  onNudge,
}: {
  np: NowPlaying;
  position: number;
  onScrub: (ms: number) => void;
  onCommit: (ms: number) => void;
  onNudge: (deltaMs: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [held, setHeld] = useState(false);
  const frac = np.durationMs > 0 ? Math.min(1, Math.max(0, position / np.durationMs)) : 0;

  const at = (clientX: number) => {
    const r = track.current?.getBoundingClientRect();
    if (!r || r.width === 0) return 0;
    return Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * np.durationMs;
  };

  return (
    <div className="np-scrub">
      <span className="np-time">{clock(position)}</span>
      <div
        ref={track}
        className="np-track"
        role="slider"
        tabIndex={np.canSeek ? 0 : -1}
        aria-label="Position in the track"
        aria-valuemin={0}
        aria-valuemax={Math.round(np.durationMs / 1000)}
        aria-valuenow={Math.round(position / 1000)}
        aria-valuetext={`${clock(position)} of ${clock(np.durationMs)}`}
        aria-disabled={!np.canSeek || undefined}
        data-seek={np.canSeek || undefined}
        data-held={held || undefined}
        style={{ ["--p" as string]: frac }}
        onPointerDown={(e) => {
          if (!np.canSeek) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setHeld(true);
          onScrub(at(e.clientX));
        }}
        onPointerMove={(e) => held && onScrub(at(e.clientX))}
        onPointerUp={(e) => {
          if (!held) return;
          setHeld(false);
          onCommit(at(e.clientX));
        }}
        onPointerCancel={() => setHeld(false)}
        onKeyDown={(e) => {
          if (!np.canSeek) return;
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") onNudge(-5000);
          else if (e.key === "ArrowRight" || e.key === "ArrowUp") onNudge(5000);
          else return;
          e.preventDefault();
        }}
      >
        <div className="np-rail">
          <div className="np-fill" />
        </div>
        {np.canSeek && <div className="np-knob" />}
      </div>
      <span className="np-time np-time-end">-{clock(Math.max(0, np.durationMs - position))}</span>
    </div>
  );
}

// ---- the card ----

interface Layer {
  id: number;
  url: string;
  tint: Tint | null;
}

export function MediaCard() {
  const menuBar = useSettings((s) => s.settings?.menuBar);
  const reduced = useReduced();
  const { np, art, refresh, patch } = useNowPlaying();
  const resolveIcons = useDockIcons((s) => s.resolveIcons);
  const iconUrls = useDockIcons((s) => s.iconUrls);
  const iconEpoch = useDockIcons((s) => s.epoch);
  const [names, setNames] = useState<Record<string, string>>({});
  const [layers, setLayers] = useState<Layer[]>([]);
  const [listOpen, setListOpen] = useState(false);

  // ---- a live picture of the window that is playing ----
  // The compositor draws it (see thumbnails.rs), over the page: a whole window, so for a
  // browser it is the tab that is showing, which is the video when that is the one playing.
  const [liveView, setLiveView] = useState(false);
  const [viewAspect, setViewAspect] = useState(16 / 9);
  const [viewGone, setViewGone] = useState(false);
  const viewBox = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const viewHwnd = np?.sourceHwnd ?? 0;
  useEffect(() => {
    if (!liveView || !viewHwnd) return;
    let live = true;
    ipc
      .windowRects([viewHwnd])
      .then((r) => {
        if (!live) return;
        // a minimised window has no rectangle, and no picture
        setViewGone(r.length === 0);
        if (r[0]) setViewAspect(Math.min(2.4, Math.max(0.6, r[0].width / r[0].height)));
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [liveView, viewHwnd, np]);
  useEffect(() => {
    if (!liveView || !viewHwnd || viewGone) return;
    const place = () => {
      const el = viewBox.current;
      if (!el) return;
      const r = layoutRect(el);
      const s = window.devicePixelRatio;
      void ipc
        .showWindowPreviews([{ hwnd: viewHwnd, x: Math.round(r.left * s), y: Math.round(r.top * s), w: Math.round(r.width * s), h: Math.round(r.height * s) }])
        .catch(() => undefined);
    };
    // once the panel has finished arriving; and again if anything above it moves it
    const settle = setTimeout(place, 480);
    const watch = new ResizeObserver(() => place());
    if (card.current) watch.observe(card.current);
    return () => {
      clearTimeout(settle);
      watch.disconnect();
      void ipc.hideWindowPreviews().catch(() => undefined);
    };
  }, [liveView, viewHwnd, viewGone, viewAspect, listOpen]);
  // a different program: the picture is of the one before
  useEffect(() => {
    if (!viewHwnd) setLiveView(false);
  }, [viewHwnd]);

  // ---- the program it comes from ----
  const target = np?.sourceTarget ?? "";
  useEffect(() => {
    if (!target) return;
    void resolveIcons([target]);
    // a Store app's own name is in the Start menu, not in the session
    if (/^shell:appsfolder/i.test(target) && !(target in names)) {
      ipc
        .appDisplayName(target)
        .then((n) => n && setNames((all) => ({ ...all, [target]: n })))
        .catch(() => undefined);
    }
  }, [target, resolveIcons, names, iconEpoch]);
  const sourceName = names[target] || np?.sourceName || "";
  const sourceIcon = target ? iconUrls[target] : undefined;

  // ---- the colours of the cover ----
  const tintOn = menuBar?.mediaTint ?? true;
  const seq = useRef(0);
  useEffect(() => {
    if (!art || !tintOn) {
      setLayers([]);
      return;
    }
    let live = true;
    const img = new Image();
    img.onload = () => {
      if (!live) return;
      // a thumbnail-sized copy is read for its colours (a real blur on a surface this size
      // would be slow, so the blur is a tiny copy stretched over the card)
      const c = document.createElement("canvas");
      c.width = c.height = 24;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 24, 24);
      const tint = pickTint(ctx.getImageData(0, 0, 24, 24).data);
      // the backdrop is smaller still, so the cover is a wash of colour and not a picture
      const b = document.createElement("canvas");
      b.width = b.height = 5;
      b.getContext("2d")?.drawImage(c, 0, 0, 5, 5);
      const layer = { id: ++seq.current, url: b.toDataURL("image/png"), tint };
      setLayers((old) => [...old.slice(-1), layer]);
      // the older one has faded under the new by now
      setTimeout(() => live && setLayers((all) => all.slice(-1)), 900);
    };
    img.src = art;
    return () => {
      live = false;
    };
  }, [art, tintOn]);
  const tint = layers[layers.length - 1]?.tint ?? null;

  // ---- where in the track it is ----
  const [pos, setPos] = useState(0);
  const anchor = useRef({ at: 0, ms: 0 });
  const holdUntil = useRef(0);
  const dragging = useRef(false);
  useEffect(() => {
    if (!np || performance.now() < holdUntil.current) return;
    anchor.current = { at: performance.now(), ms: np.positionMs };
    if (!dragging.current) setPos(np.positionMs);
  }, [np]);
  useEffect(() => {
    if (!np?.playing) return;
    const id = setInterval(() => {
      if (dragging.current) return;
      const a = anchor.current;
      const ms = a.ms + (performance.now() - a.at);
      setPos(np.durationMs > 0 ? Math.min(np.durationMs, ms) : ms);
    }, 250);
    return () => clearInterval(id);
  }, [np?.playing, np?.durationMs]);

  // ---- doing things ----
  const after = useCallback(() => {
    setTimeout(() => void refresh(), 250);
    setTimeout(() => void refresh(), 1100);
  }, [refresh]);
  const run = useCallback(
    (what: Promise<unknown>) => what.then(after).catch(notify.on("Could not control the player")),
    [after],
  );
  const moveTo = (ms: number) => {
    holdUntil.current = performance.now() + 1500;
    anchor.current = { at: performance.now(), ms };
    setPos(ms);
  };

  // a long title scrolls to show the rest of it
  const titleBox = useRef<HTMLDivElement>(null);
  const titleText = useRef<HTMLSpanElement>(null);
  const [overflow, setOverflow] = useState(0);
  useLayoutEffect(() => {
    const box = titleBox.current;
    const text = titleText.current;
    if (box && text) setOverflow(Math.max(0, Math.ceil(text.scrollWidth - box.clientWidth)));
  }, [np?.title]);

  if (!np?.active) return null;

  const wave = (menuBar?.mediaSpectrum ?? true) && !reduced.motion && np.playing;
  const live = np.durationMs === 0;
  const repeat = np.repeat;
  const style = tint
    ? ({ ["--np-a" as string]: tint.a, ["--np-b" as string]: tint.b, ["--np-accent" as string]: tint.accent } as React.CSSProperties)
    : undefined;

  const openSource = () => {
    if (np.sourceHwnd) void ipc.mediaFocusSource(np.sourceHwnd);
    else if (np.sourceTarget) ipc.launch(np.sourceTarget).catch(notify.on(`Could not open ${sourceName}`));
  };

  return (
    <div ref={card} className="cc-card np" data-tinted={tint ? "" : undefined} style={style}>
      {layers.map((l) => (
        <div key={l.id} className="np-bg" style={{ backgroundImage: `url(${l.url})` }} aria-hidden />
      ))}

      <div className="np-head">
        <button
          type="button"
          className="np-source"
          onClick={openSource}
          title={`Open ${sourceName || "the player"}`}
          disabled={!np.sourceHwnd && !np.sourceTarget}
        >
          {sourceIcon ? <img src={sourceIcon} alt="" draggable={false} /> : <Glyph name="note" />}
          <span>{sourceName || "Now Playing"}</span>
        </button>
        <div className="np-head-end">
          {np.sourceHwnd !== 0 && (
            <button
              type="button"
              className="np-more np-view-btn"
              aria-label="Live view of the window"
              aria-pressed={liveView}
              data-on={liveView || undefined}
              title="Live view of the window"
              onClick={() => setLiveView((v) => !v)}
            >
              <Glyph name="live" />
            </button>
          )}
          {np.players.length > 1 && (
          <button
            type="button"
            className="np-more"
            aria-label={`${np.players.length} players. Choose which to show`}
            aria-expanded={listOpen}
            onClick={() => setListOpen((v) => !v)}
          >
            {np.players.length}
            <svg viewBox="0 0 12 12" aria-hidden>
              <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          )}
        </div>
      </div>

      {listOpen && np.players.length > 1 && (
        <div className="np-players" role="listbox" aria-label="Players">
          {np.players.map((p) => (
            <button
              key={p.id}
              type="button"
              role="option"
              aria-selected={p.current}
              data-current={p.current || undefined}
              onClick={() => {
                void ipc.mediaSelect(p.id).then(() => {
                  setListOpen(false);
                  void refresh();
                });
              }}
            >
              <span className="np-dot" data-playing={p.playing || undefined} />
              <span className="np-player-name">{p.name}</span>
              <small>{p.title}</small>
            </button>
          ))}
        </div>
      )}

      <div className="np-body">
        <div className="np-art" data-empty={!art || undefined}>
          {art ? <img key={art} src={art} alt="" draggable={false} /> : sourceIcon ? <img src={sourceIcon} alt="" draggable={false} /> : <Glyph name="note" />}
        </div>
        <div className="np-text">
          <div ref={titleBox} className="np-title" data-scroll={overflow > 0 && !reduced.motion ? "" : undefined} style={{ ["--np-over" as string]: `${overflow}px` }}>
            <span ref={titleText} title={np.title}>
              {np.title || "Unknown"}
            </span>
          </div>
          <div className="np-artist" title={np.artist || np.album}>
            {np.artist || np.album || sourceName}
          </div>
          <SoundWave active={wave} color={tint?.accent ?? "rgba(255,255,255,0.85)"} />
        </div>
      </div>

      {liveView && np.sourceHwnd !== 0 && (
        <div
          ref={viewBox}
          className="np-view"
          style={{ aspectRatio: String(viewAspect) }}
          onClick={openSource}
          title={`Open ${sourceName || "the window"}`}
        >
          {viewGone && <span>The window is minimised</span>}
        </div>
      )}

      {live ? (
        <div className="np-live">
          <span className="np-live-dot" data-playing={np.playing || undefined} />
          Live
        </div>
      ) : (
        <Scrubber
          np={np}
          position={pos}
          onScrub={(ms) => {
            dragging.current = true;
            setPos(ms);
          }}
          onCommit={(ms) => {
            dragging.current = false;
            moveTo(ms);
            void run(ipc.mediaSeek(Math.round(ms)));
          }}
          onNudge={(d) => {
            moveTo(Math.min(np.durationMs, Math.max(0, pos + d)));
            void run(ipc.mediaSeekBy(d));
          }}
        />
      )}

      <div className="np-controls">
        {np.shuffle === null ? (
          <span className="np-spacer" />
        ) : (
          <Button
            glyph="shuffle"
            label={np.shuffle ? "Shuffle on" : "Shuffle off"}
            on={np.shuffle}
            onClick={() => {
              patch({ shuffle: !np.shuffle });
              void run(ipc.mediaShuffle(!np.shuffle));
            }}
          />
        )}
        <Button glyph="prev" label="Previous track" disabled={!np.canPrevious} onClick={() => void run(ipc.widgetMediaControl("previous"))} />
        <Button
          glyph="back"
          label={np.canSeek ? "Back 10 seconds" : "This player can't skip within a track"}
          disabled={!np.canSeek}
          onClick={() => {
            moveTo(Math.max(0, pos - 10000));
            void run(ipc.mediaSeekBy(-10000));
          }}
        />
        <Button
          glyph={np.playing ? "pause" : "play"}
          size="big"
          label={np.playing ? "Pause" : "Play"}
          onClick={() => {
            patch({ playing: !np.playing });
            void run(ipc.widgetMediaControl("playpause"));
          }}
        />
        <Button
          glyph="forward"
          label={np.canSeek ? "Forward 10 seconds" : "This player can't skip within a track"}
          disabled={!np.canSeek}
          onClick={() => {
            moveTo(Math.min(np.durationMs, pos + 10000));
            void run(ipc.mediaSeekBy(10000));
          }}
        />
        <Button glyph="next" label="Next track" disabled={!np.canNext} onClick={() => void run(ipc.widgetMediaControl("next"))} />
        {repeat === null ? (
          <span className="np-spacer" />
        ) : (
          <Button
            glyph={repeat === "track" ? "repeat-one" : "repeat"}
            label={repeat === "none" ? "Repeat off" : repeat === "list" ? "Repeat all" : "Repeat one"}
            on={repeat !== "none"}
            onClick={() => {
              // off, then all, then one, then off again
              const next = repeat === "none" ? "list" : repeat === "list" ? "track" : "none";
              patch({ repeat: next });
              void run(ipc.mediaRepeat(next));
            }}
          />
        )}
      </div>
    </div>
  );
}
