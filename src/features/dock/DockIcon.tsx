/**
 * A single dock icon: cursor-distance magnification, hover label,
 * launch bounce, idle float. All motion is springs on transform.
 */

import { Roll } from "../../engine/type/Roll";
import { useGlass } from "../../engine/backdrop/useGlass";
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";
import { FocusMarks } from "./FocusMarks";
import type { MagnifyField } from "./magnifyField";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { magnifySpring, nearSide, playLaunch } from "../../engine/animation/presets";
import { idleFloat, springs } from "../../engine/animation/springs";
import { effectsBus } from "../../engine/effects/effectsBus";
import { motionReduced } from "../../engine/effects/fx2d";
import { ipc } from "../../ipc/commands";
import type { DockEdge } from "../../ipc/types";
import { notify } from "../feedback/toastStore";
import type { DockItemView } from "../../state/dockStore";
import { exeKey, useAppAudio } from "../../state/audioStore";
import { useRunning } from "../../state/runningStore";
import { useSettings } from "../../state/settingsStore";
import { playCue } from "../../engine/sound/ui";
import { SpeakerShape } from "../widgets/SystemGlyphs";
import { useMenu } from "./menuStore";

interface DockIconProps {
  item: DockItemView;
  /** Cursor position along the dock axis; Infinity = cursor away. */
  mouseAxis: MotionValue<number>;
  /** Where the icons rest, which magnification measures the pointer against (magnifyField.ts). */
  field: MagnifyField;
  iconSize: number;
  magnify: boolean;
  magScale: number;
  /** How far the icon under the pointer rises as it grows, as a fraction of the icon size. */
  lift: number;
  /** How far from the pointer an icon still swells, in icon widths. */
  reach: number;
  vertical: boolean;
  edge: DockEdge;
  /** A reorder drag is in progress somewhere in the dock. */
  dragging: boolean;
  index: number;
  onLaunch: (item: DockItemView, target?: HTMLElement) => void;
  onContext: (item: DockItemView, target: HTMLElement) => void;
  /** Fired after dwelling on an icon that has open windows. */
  onHoverPreview: (item: DockItemView, target: HTMLElement) => void;
}

/** How far round the idle float's cycle each icon sits from the one before,
 *  in radians: 0.9s of its 5.2s period. */
const FLOAT_STEP = (2 * Math.PI * idleFloat.stagger) / idleFloat.period;

const PREVIEW_DWELL_MS = 550;
/** How a label goes: a quick fade, quick enough that crossing the dock never leaves a trail of them. */
const LABEL_EXIT = { opacity: 0, transition: { duration: 0.09 } };
/** How long a scroll keeps the window previews away. Matches the volume
 *  indicator's own lifetime so the two never overlap. */
const VOLUME_PREVIEW_MUTE_MS = 1500;

/** The speaker with as many waves as the volume lights, or a cross when muted:
 *  the same drawing as the status glyph, in the surrounding text's colour. */
function Speaker({ level, muted }: { level: number; muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="dock-volume-icon" aria-hidden>
      <SpeakerShape level={level} muted={muted} ink="currentColor" alert="currentColor" />
    </svg>
  );
}
/** Tooltip entrance offset: the pill drifts in from the dock's edge.
 * Centering lives in CSS `translate` because motion owns `transform`. */
function labelFrom(edge: DockEdge): { x: number; y: number } {
  switch (edge) {
    case "bottom":
      return { x: 0, y: 6 };
    case "top":
      return { x: 0, y: -6 };
    case "left":
      return { x: -6, y: 0 };
    case "right":
      return { x: 6, y: 0 };
  }
}

export function DockIcon({
  item,
  mouseAxis,
  field,
  iconSize,
  magnify,
  magScale,
  lift,
  reach,
  vertical,
  edge,
  dragging,
  index,
  onLaunch,
  onContext,
  onHoverPreview,
}: DockIconProps) {
  const dockGlass = useGlass("dock");
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  // a flyout already names what you're pointing at, and the pill would
  // otherwise float over its bottom edge
  const flyoutOpen = useMenu((m) => m.item !== null);
  // chosen under Settings > Animations; read as plain strings so this
  // re-renders only when the choice changes
  const launchPreset = useSettings((s) => s.settings?.animations?.launch ?? "bounce");
  const magnifyFeel = useSettings((s) => s.settings?.animations?.magnify ?? "soft");
  // how running apps are marked (Settings > Dock > Running apps)
  const markStyle = useSettings((s) => s.settings?.dock.indicatorStyle ?? "dots");
  const markShape = useSettings((s) => s.settings?.dock.indicatorShape ?? "pill");
  const focusMotion = useSettings((s) => s.settings?.dock.focusMotion ?? "glide");
  const ghostMotion = useSettings((s) => s.settings?.dock.ghostMotion ?? "glide");
  const markStretch = useSettings((s) => s.settings?.dock.markStretch ?? 0.5);
  const runningCue = useSettings((s) => s.settings?.dock.runningCue ?? "dots");
  const dwellTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // While the volume is being adjusted the window previews stay out of the
  // way. They are a hover affordance, and a deliberate scroll outranks one.
  const previewMutedUntil = useRef(0);

  // per-app audio: scroll to change (muting is in the icon's menu)
  const audio = useAppAudio((a) => a.levels[exeKey(item.audioExe)]);
  const audioTick = useAppAudio((a) => a.tick);
  const nudgeVolume = useAppAudio((a) => a.nudge);
  // `audioTick` is read so the indicator re-renders when its timer runs out
  void audioTick;
  const adjusting = useAppAudio.getState().isVisible(item.audioExe) && audio !== undefined;

  // Distance from the pointer to this icon's centre along the dock, measured to where the icon rests, not to where the
  // swell has pushed it (the bar keeps centred, so as icons swell every icon slides): from where it is drawn, each
  // swell would move the icons, which would move the swell, and they shook, most of all near the ends where that slide
  // is the largest. DockBar works out the resting centres as the pointer moves (`restCentres`).
  const distance = useTransform(mouseAxis, (cursor) => {
    const el = ref.current;
    if (!el || !Number.isFinite(cursor)) return Infinity;
    let center = field.rest.get(el);
    if (center === undefined) {
      const rect = el.getBoundingClientRect();
      center = vertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
    }
    return cursor - center;
  });

  // The swell is a hill of cosine: the icon at the pointer is at the top, and it falls away to nothing `reach` icon
  // widths out, flat at both ends, so there is no point where it starts or stops being swollen. (A straight-sided
  // hill has a ridge at the top and a kink where it meets the floor, and the icons passing under it show both.)
  const reachPx = iconSize * reach;
  const peak = magnify ? magScale : 1;
  const bell = useTransform(distance, (d) => {
    if (!Number.isFinite(d)) return 0;
    const t = Math.min(1, Math.abs(d) / reachPx);
    return 0.5 + 0.5 * Math.cos(Math.PI * t);
  });
  const targetWidth = useTransform(bell, (b) => iconSize * (1 + (peak - 1) * b));
  const width = useSpring(targetWidth, magnifySpring(magnifyFeel));
  // The room it takes with its swell is not given by layout: its slot stays the icon's size and the bar moves it, and
  // everything after it, along by the swell, sub-pixel (magnifyField.ts)
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    field.widths.set(el, width);
    field.schedule();
    const off = width.on("change", field.schedule);
    return () => {
      off();
      field.widths.delete(el);
      field.rest.delete(el);
      field.offset.delete(el);
      field.schedule();
    };
  }, [field, width]);
  // The space it takes is `width`, and the icon is drawn that much larger, from the side of the dock nearest the
  // screen edge: it grows away from the edge, as a Mac dock's does, and rises a little more than it grows.
  const growth = Math.max(1e-6, iconSize * (peak - 1));
  const liftPx = magnify ? iconSize * lift : 0;
  const away = edge === "bottom" || edge === "right" ? -1 : 1;
  const drawn = useTransform(width, (w) => Math.max(1, w / iconSize));
  const risen = useTransform(width, (w) => away * liftPx * Math.min(1.25, Math.max(0, (w - iconSize) / growth)));
  // how far the top of the icon stands above where it rests, for the name that hangs over it
  const rise = useTransform(width, (w) => {
    const grown = Math.max(0, w - iconSize);
    return `${(grown + liftPx * Math.min(1.25, grown / growth)).toFixed(3)}px`;
  });

  // A new icon grows into its place instead of appearing whole, so the ones
  // beside it ease apart to make room rather than jumping. Done before the
  // first paint, so there is no frame of it at full size first. Nothing is
  // measured from the DOM to size the window, so this changes no geometry.
  // (its slot, by layout: the one time an icon's room changes by layout, as it arrives)
  const slot = useMotionValue(iconSize);
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    slot.jump(0);
    void animate(slot, iconSize, { type: "spring", ...magnifySpring(magnifyFeel) });
    // once, on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!slot.isAnimating()) slot.jump(iconSize);
  }, [iconSize, slot]);

  // When a drag starts, every icon springs back to its base size. Letting
  // that animate resizes tiles under the cursor mid-drag, which is a big
  // part of what felt like lag, so jump straight to the end value.
  useEffect(() => {
    if (dragging) width.jump(iconSize);
  }, [dragging, iconSize, width]);

  // launch bounce (offset perpendicular to the dock edge); idle float
  // is pure CSS on the inner wrapper — zero JS per frame
  const bounce = useMotionValue(0);
  const y = useTransform(bounce, (b) => (vertical ? 0 : b));
  const x = useTransform(bounce, (b) => (vertical ? b : 0));
  // An app that flashes for attention (a message, a finished download) bounces its
  // icon, and wears a dot until it is looked at. The bounce is a few hops, and a
  // reminder every few seconds, not a loop: it asks without nagging, and costs
  // nothing between hops. With motion reduced only the dot stays.
  const attentionBounce = useSettings((s) => s.settings?.dock.attentionBounce ?? true);
  const attention = useRunning((s) => item.windows.some((w) => s.attention.has(w.hwnd)));
  useEffect(() => {
    if (!attention || !attentionBounce) return;
    const hop = () => {
      if (motionReduced()) return;
      void animate(bounce, [0, -18, 0, -11, 0, -5, 0], { duration: 0.95, ease: "easeOut" });
    };
    hop();
    const again = setInterval(hop, 7000);
    return () => clearInterval(again);
  }, [attention, attentionBounce, bounce]);
  // squash and stretch, for the launch animations that use them
  const squashX = useMotionValue(1);
  const squashY = useMotionValue(1);
  // what undoes them, for the marks' track (the button moves by its offset, then scales about its near side: undone
  // by scaling back about the same side, then moving back by the offset as it was before scaling)
  const unsquashX = useTransform(() => 1 / (squashX.get() || 1));
  const unsquashY = useTransform(() => 1 / (squashY.get() || 1));
  const trackX = useTransform(() => -x.get() / (squashX.get() || 1));
  const trackY = useTransform(() => -y.get() / (squashY.get() || 1));

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // what the icon does on launch: Settings > Animations > Launch
      void playLaunch(launchPreset, { lift: bounce, squashX, squashY }, vertical);
      const r = e.currentTarget.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const win = { winW: window.innerWidth, winH: window.innerHeight };
      effectsBus.emit("ripple", { x: cx, y: r.bottom - 4, ...win });
      if (item.windows.length === 0 && item.kind !== "folder") {
        effectsBus.emit("burst", { x: cx, y: r.top + r.height / 2, ...win });
      }
      onLaunch(item, e.currentTarget);
    },
    [bounce, squashX, squashY, launchPreset, item, onLaunch, vertical],
  );

  const initial = item.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <motion.button
      ref={ref}
      className="dock-icon"
      data-idle={markStyle === "focus" && runningCue === "dim" && item.windows.length === 0 ? "" : undefined}
      style={
        vertical
          ? {
              height: slot,
              width: "var(--icon-size)",
              x,
              y,
              scaleX: squashX,
              scaleY: squashY,
              transformOrigin: nearSide(edge),
              ["--mag-rise" as string]: rise,
            }
          : { width: slot, x, y, scaleX: squashX, scaleY: squashY, transformOrigin: nearSide(edge), ["--mag-rise" as string]: rise }
      }
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onContext(item, e.currentTarget);
      }}
      onWheel={(e) => {
        // one notch per detent, up scrolls louder
        const notches = -Math.sign(e.deltaY);
        if (notches === 0) return;
        playCue("notch", notches);
        // a preview opened by hovering would sit right on top of the
        // readout, so retire it and keep it away while the pill is up
        clearTimeout(dwellTimer.current);
        previewMutedUntil.current = Date.now() + VOLUME_PREVIEW_MUTE_MS;
        const m = useMenu.getState();
        if (m.kind === "windows" && m.item?.id === item.id) m.close();
        void nudgeVolume(item.audioExe, notches);
      }}
      onMouseDown={(e) => {
        // stop the middle-button autoscroll cursor appearing
        if (e.button === 1) e.preventDefault();
      }}
      onAuxClick={(e) => {
        if (e.button !== 1) return;
        e.preventDefault();
        // Middle-click ends the app, as Task Manager's End Task does: every program that owns one of its
        // windows is terminated at once, with what it started, so one that is hung or sitting on a dialog goes
        // too (Settings > Dock can make it ask the windows to close instead, which lets an app with unsaved
        // work ask first). The windows listed here are the ones this dock shows for the app, which for a pin or
        // a running app alike is all of them; a pin that is not running, a stack or a folder has none, and
        // nothing happens.
        if (item.windows.length === 0) return;
        clearTimeout(dwellTimer.current);
        // a preview of the windows that are closing would be left pointing at nothing
        const m = useMenu.getState();
        if (m.kind === "windows" && m.item?.id === item.id) m.close();
        playCue("close");
        if (useSettings.getState().settings?.dock.middleClick === "close") {
          for (const w of item.windows) {
            ipc.closeWindow(w.hwnd).catch(notify.on(`Could not close ${item.name}`));
          }
          return;
        }
        ipc.endTask(item.windows.map((w) => w.hwnd)).catch(notify.on(`Could not end ${item.name}`));
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        // a note for each icon the pointer crosses
        playCue("hover", index);
        const m = useMenu.getState();
        if (m.kind === "windows" && m.item?.id === item.id) {
          // back onto the icon that owns the open preview: keep it
          m.cancelScheduledClose();
        } else if (item.windows.length > 0) {
          const el = e.currentTarget;
          dwellTimer.current = setTimeout(() => {
            if (Date.now() < previewMutedUntil.current) return;
            onHoverPreview(item, el);
          }, PREVIEW_DWELL_MS);
        }
      }}
      onMouseLeave={() => {
        setHovered(false);
        clearTimeout(dwellTimer.current);
        // leaving the icon that owns the open preview: dismiss it soon
        // unless the cursor lands on the flyout itself
        const m = useMenu.getState();
        if (m.kind === "windows" && m.item?.id === item.id) {
          m.scheduleClose(450);
        }
      }}
      aria-label={
        item.name +
        (item.windows.length > 0
          ? `, ${item.windows.length} open window${item.windows.length === 1 ? "" : "s"}`
          : "") +
        (attention && attentionBounce ? ", needs attention" : "")
      }
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* the label fades as it goes (it does not just vanish), so its glass fades with it rather than standing alone
          for a frame or two after it */}
      <AnimatePresence initial={false}>
      {adjusting && audio ? (
        <motion.span
          key="volume"
          className="dock-label dock-volume-pill"
          data-edge={edge}
          initial={{ opacity: 0, scale: 0.9, ...labelFrom(edge) }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={LABEL_EXIT}
          transition={springs.bloom}
        >
          <BackdropLayer active={dockGlass.active} blur={dockGlass.blur} grain={dockGlass.grain} tint="own" />
          <Speaker level={audio.volume} muted={audio.muted} />
          <span className="dock-volume-value">
            <Roll text={audio.muted ? "Muted" : `${audio.volume}%`} />
          </span>
          <span className="dock-volume-track" aria-hidden>
            <span
              className="dock-volume-fill"
              style={{ ["--p" as string]: (audio.muted ? 0 : audio.volume) / 100 } as React.CSSProperties}
            />
          </span>
        </motion.span>
      ) : (
        hovered &&
        !flyoutOpen &&
        !dragging && (
          <motion.span
            key="name"
            className="dock-label"
            data-edge={edge}
            initial={{ opacity: 0, scale: 0.9, ...labelFrom(edge) }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={LABEL_EXIT}
            transition={springs.bloom}
          >
            <BackdropLayer active={dockGlass.active} blur={dockGlass.blur} grain={dockGlass.grain} tint="own" />
            {item.name}
          </motion.span>
        )
      )}
      </AnimatePresence>
      {markStyle === "focus" && runningCue === "halo" && item.windows.length > 0 && (
        // the halo in the same level track as the marks, but drawn before the icon, so it glows from behind it
        <motion.span className="dock-mark-track" style={{ x: trackX, y: trackY, scaleX: unsquashX, scaleY: unsquashY, transformOrigin: nearSide(edge) }}>
          <span className="dock-mark-halo" aria-hidden />
        </motion.span>
      )}
      <motion.span
        className="dock-icon-mag"
        style={
          vertical
            ? { scale: drawn, x: risen, transformOrigin: nearSide(edge) }
            : { scale: drawn, y: risen, transformOrigin: nearSide(edge) }
        }
      >
      <span
        className="dock-icon-float"
        // each icon a step further round the cycle than the one before
        style={{
          ["--float-phase" as string]: (index * FLOAT_STEP).toFixed(3),
          // for the Cascade way of appearing: how far along the dock it is
          ["--i" as string]: index,
        }}
      >
        {item.kind === "stack" ? (
          <span className="dock-stack">
            {item.children.slice(0, 4).map((child, i) =>
              item.childIcons[i] ? (
                <img key={child.id} src={item.childIcons[i]!} alt="" draggable={false} />
              ) : (
                <span key={child.id} className="dock-stack-slot" />
              ),
            )}
          </span>
        ) : item.iconSrc ? (
          <img src={item.iconSrc} alt="" draggable={false} />
        ) : (
          <span className="dock-icon-glyph">{initial}</span>
        )}
      </span>
      </motion.span>
      {audio?.muted && (
        <span className="dock-muted-badge" title={`${item.name} is muted`}>
          <Speaker level={0} muted />
        </span>
      )}
      {attention && attentionBounce && <span className="dock-attention" aria-hidden />}
      {markStyle === "focus" ? (
        // the marks' own track: the exact undoing of the button's lift and squash, so they stay level along the dock
        // while the icon jumps (a launch, an attention hop), and follow it only along the dock
        <motion.span className="dock-mark-track" style={{ x: trackX, y: trackY, scaleX: unsquashX, scaleY: unsquashY, transformOrigin: nearSide(edge) }}>
          {runningCue === "dots" && item.windows.length > 0 && <span className="dock-mark-trace" data-shape={markShape} aria-hidden />}
          <FocusMarks
            focused={item.focused && item.windows.length > 0}
            hovered={hovered && !dragging}
            shape={markShape}
            focusMotion={focusMotion}
            ghostMotion={ghostMotion}
            stretch={markStretch}
          />
        </motion.span>
      ) : (
        item.windows.length > 0 && <span className="dock-indicator" data-focused={item.focused} />
      )}
    </motion.button>
  );
}
