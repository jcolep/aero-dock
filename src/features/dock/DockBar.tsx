/**
 * The dock bar: a glass shelf of icons. Owns the cursor motion value the
 * icons magnify against, drag-reordering of the pinned section, and the
 * deterministic window-size report to Rust (window = dock + magnification
 * headroom + tooltip space + flyout space when a menu is open).
 */

import { listen } from "@tauri-apps/api/event";
import { useGlass } from "../../engine/backdrop/useGlass";
import { layoutRect } from "./layoutRect";
import { animate, AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";
import { spring } from "../../engine/motion/tokens";
import { DIVIDER, moved, sides, useDockOrder } from "./dockOrder";
import { targetKey } from "../../state/runningStore";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { animationsOf, PANEL_EXIT_MS, revealMotion } from "../../engine/animation/presets";
import { idleFloat, springs } from "../../engine/animation/springs";
import { effectsBus } from "../../engine/effects/effectsBus";
import { ipc } from "../../ipc/commands";
import { Toasts } from "../feedback/Toasts";
import { notify, useToasts } from "../feedback/toastStore";
import { EVENTS, type Settings } from "../../ipc/types";
import type { DockItemView } from "../../state/dockStore";
import { useAmbient } from "../../state/ambientStore";
import { useFileDrag } from "../../state/dragStore";
import { Welcome } from "../onboarding/Welcome";
import { WidgetCluster } from "../widgets/WidgetCluster";
import { ContextMenu } from "./ContextMenu";
import { DockMenu } from "./DockMenu";
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";
import { LiquidockButton, SettingsButton, StartSlot } from "./DockControls";
import { useReduced } from "../../engine/accessibility/policy";
import { GlyphFilters } from "./GlyphFilters";
import { playCue } from "../../engine/sound/ui";
import { usePointerLight } from "../../engine/light/usePointerLight";
import { DockSatellite } from "./DockSatellite";
import { LABEL_SPACE, LABEL_SPACE_SIDE } from "./geometry";
import { MODE_FLYOUT_HEIGHT, ModeSwitcher, useModeSwitcher } from "./ModeSwitcher";
import { DockIcon } from "./DockIcon";
import { measureRest, newMagnifyField } from "./magnifyField";
import { tokensFromAccent } from "../../engine/themes/accent";
import { FolderFlyout } from "./FolderFlyout";
import { StackFlyout } from "./StackFlyout";
import { WindowsFlyout } from "./WindowsFlyout";
import { anchorFor, MENU_ROOM, useMenu } from "./menuStore";
import { warmAll } from "./jumpCache";
import { pinRunningItem } from "./pinRunning";
import "./dock.css";

const PAD_MAIN = 18; // dock padding along the axis
// Window slack so magnified end-icons never clip, and so an underestimate of
// the bar's width (the window size is computed, not measured) costs a bit of
// empty window rather than a clipped end.
const EDGE_SLACK = 48;
// extra cross-axis room while a context menu is open (menuStore: the menu holds itself to it, its Jump List scrolling)
const MENU_SPACE = MENU_ROOM;
const FLYOUT_GAP = 16; // breathing room between a flyout and the window edge
const TOAST_SPACE = 210; // extra cross-axis room while toasts are on screen
// How close to the dock's end the pointer must get for that end's button to
// bud out is a setting now (settings.dock.revealZone); see `revealZone` below.
const PULL_OFF = 40; // px past the bar, away from the edge, that unpins on release
const CLOCK_SPACE = 76; // the clock and date
const CONTROLS_SPACE = 76; // Search and Settings buttons, when they sit in the bar
// the Liquidock button's slot in the bar when Settings is revealed from outside it (the button, a well's width, its
// divider and the gaps), and the divider alone when both buttons sit in the bar (CONTROLS_SPACE has the button)
/** A handler on a motion element, only so that it has one: with an update handler the fade and the move are driven
 *  frame by frame here, not handed to the browser's own animation engine. That engine puts the element on a layer
 *  of its own while it plays (the bar and the layer of satellites over it), and when it ended, about 0.75 s after the
 *  dock came in, the layers were redrawn and the icons landed a fraction of a pixel from where they had been. */
const noop = () => {};
const START_SLOT_ROOM = 64;
const START_DIVIDER_ROOM = 18;
// room each end needs for a revealed control: 8px gap, a 30px button that
// overshoots to about 1.3x on entrance, and some margin
const SATELLITE_ROOM = 60;
const MODE_TILE_SPACE = 38; // the Modes tile, when Modes is switched on
const REVEAL_STRIP = 8; // window height while auto-hidden (mouse sensor)
const DOCK_ZONE_BUFFER = 14;
/** The dock's glass with the theme color taken out (Settings > Dock > Tinted with the theme color, off): the color
 *  tokens of a white pick, which every material reads as plain glass. Only the bar's glass: the marks keep theirs. */
const NEUTRAL_GLASS = Object.fromEntries(
  Object.entries(tokensFromAccent("#ffffff")).filter(([k]) => /^--(glass-tint|glass-border|clear-)/.test(k)),
) as React.CSSProperties; // px beyond what is drawn of the dock that still counts as on it, for auto-hide
// How long the room a flyout took is kept after it closes: its exit animation
// (up to PANEL_EXIT_MS, whichever preset is chosen) plays inside that room.
const FLYOUT_EXIT_MS = PANEL_EXIT_MS;
// ambient animations (float, sweep) pause after this much no-interaction
// so an idle dock costs ~zero GPU; they wake the moment the cursor returns
const SLEEP_AFTER_MS = 45_000;

/**
 * A value that rises at once and falls late: the largest it has been within
 * the last `ms`.
 *
 * The part of the window that shows is sized to whatever is open above the
 * dock. A flyout that closes plays a short exit, but its space was given back
 * the instant it closed, so the window was clipped out from under the
 * animation and the flyout simply vanished. Holding the space for the length
 * of the exit lets it be seen.
 */
function useLinger(value: number, ms: number): number {
  const [held, setHeld] = useState(value);
  useEffect(() => {
    // no linger asked for, or the value is rising: follow it at once
    if (ms === 0 || value >= held) {
      if (value !== held) setHeld(value);
      return;
    }
    const timer = setTimeout(() => setHeld(value), ms);
    return () => clearTimeout(timer);
  }, [value, held, ms]);
  return ms === 0 ? value : Math.max(value, held);
}

/**
 * Sliding to a new place in the list. After every render, if the element is laid out somewhere other than where it was
 * (a neighbour carried past it, an app arriving or leaving), it is drawn where it was and springs to where it is: the
 * icons make way smoothly, the same for every icon. (Motion's own layout animation did this for the pinned apps and
 * never for the unpinned running ones after the divider, which jumped a whole slot at once; no difference in how they
 * were made explained it, so this does it plainly.) `enabled` is off while the dock is away or coming in, when
 * nothing should slide; `skip` is the icon being carried, which is placed under the pointer instead.
 */
function useSlide(node: React.RefObject<HTMLElement | null>, enabled: boolean, skip: boolean) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const last = useRef<{ left: number; top: number } | null>(null);
  const running = useRef<{ stop: () => void }[]>([]);
  const stop = () => running.current.forEach((a) => a.stop());
  useLayoutEffect(() => {
    const el = node.current;
    if (!el) return;
    // its place within the list, not on the page: the whole bar moves as it grows and shrinks (the Liquidock button
    // coming and going re-centres it every frame), and that is not the icon moving
    const at = layoutRect(el);
    const list = el.parentElement ? layoutRect(el.parentElement) : { left: 0, top: 0 };
    const r = { left: at.left - list.left, top: at.top - list.top };
    const before = last.current;
    last.current = r;
    if (skip || !enabled || !before) return;
    const dx = before.left - r.left;
    const dy = before.top - r.top;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    stop();
    // where it is drawn now, less how far it has moved: the slide in progress carries on from there
    x.set(x.get() + dx);
    y.set(y.get() + dy);
    running.current = [animate(x, 0, springs.reorder), animate(y, 0, springs.reorder)];
  });
  useEffect(() => stop, []);
  return { x, y, stop };
}

/** The divider between the pinned and the running apps, in the list so an icon can be carried across it. */
function DockDivider({ hidden, arranging, register }: { hidden: boolean; arranging: boolean; register: (key: string, el: HTMLElement | null) => void }) {
  const el = useRef<HTMLSpanElement | null>(null);
  const slide = useSlide(el, arranging, false);
  return (
    <motion.span
      ref={(node) => {
        el.current = node;
        register(DIVIDER, node);
      }}
      className="dock-divider"
      data-hidden={hidden || undefined}
      style={{ x: slide.x, y: slide.y }}
      aria-hidden
    />
  );
}
/**
 * One app's icon in the dock's list, which can be picked up and dragged: free in both directions (so a pinned app can
 * be pulled off the dock), exactly under the pointer. Picked up it lifts and swells a little, and leans into the way it
 * is going, as something held does; its neighbours slide aside as it passes them (layout), and let go it springs into
 * its place. The order itself is DockBar's (dockOrder.ts), told of every move through `onMove`.
 *
 * The drag is its own, not motion's: as the icon takes a new place in the list its box moves, and motion's drag is
 * meant to make up for that, but for the icons after the divider it did not (each place passed left the icon a slot
 * further from the pointer; found by tracking pointer against icon). Here the offset is worked out from the box where
 * it is laid out now, every move and after every reorder, so it cannot drift. Motion's drag also re-fitted the icons
 * when the bar's scale changed as the dock came in, which drew them drifting ~20 px inside their glass.
 */
function DockDragItem({
  dragKey,
  vertical,
  removing,
  arranging,
  register,
  onStart,
  onMove,
  onEnd,
  children,
}: {
  dragKey: string;
  vertical: boolean;
  removing: boolean;
  /** The icons slide to their places as the order changes (layout). Off while the dock is away or coming in: the bar
   *  springs up by a scale motion does not measure through, so each icon read as having moved ~20 px and was drawn
   *  sliding inside its glass (motion measures every layout element whenever any one changes, so keying it to the
   *  order did not keep it out). */
  arranging: boolean;
  register: (key: string, el: HTMLElement | null) => void;
  onStart: (key: string) => void;
  onMove: (key: string, p: { x: number; y: number }) => void;
  onEnd: (key: string, p: { x: number; y: number }) => void;
  children: React.ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // a lean of up to 9 degrees with the speed it is carried along a horizontal dock, sprung so it eases in and out
  const speed = useVelocity(x);
  const lean = useSpring(useTransform(speed, [-1600, 0, 1600], [-9, 0, 9], { clamp: true }), spring.quick);
  const el = useRef<HTMLDivElement | null>(null);
  // the press: where the pointer went down, where the icon was laid out then, and where the pointer is now
  const press = useRef<{ id: number; sx: number; sy: number; lx: number; ly: number; px: number; py: number; moved: boolean } | null>(null);
  const [held, setHeld] = useState(false);
  const settle = useRef<{ stop: () => void }[]>([]);
  // as the others make way for the one carried, it slides to where it is laid out now
  const slide = useSlide(el, arranging, held);
  const drawnX = useTransform(() => x.get() + slide.x.get());
  const drawnY = useTransform(() => y.get() + slide.y.get());

  /** Put the icon under the pointer: the pointer's travel, less how far its own box has moved in the list since. */
  const place = () => {
    const p = press.current;
    const node = el.current;
    if (!p || !node) return;
    const r = layoutRect(node);
    x.set(p.px - p.sx - (r.left - p.lx));
    y.set(p.py - p.sy - (r.top - p.ly));
  };
  // after every render while held: a reorder has just moved its box
  useLayoutEffect(() => {
    if (held) place();
  });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const p = press.current;
      if (!p || e.pointerId !== p.id) return;
      p.px = e.clientX;
      p.py = e.clientY;
      if (!p.moved) {
        if (Math.hypot(p.px - p.sx, p.py - p.sy) < 5) return;
        p.moved = true;
        try {
          el.current?.setPointerCapture(p.id);
        } catch {
          /* the pointer has gone */
        }
        setHeld(true);
        onStart(dragKey);
      }
      place();
      onMove(dragKey, { x: p.px, y: p.py });
    };
    const up = (e: PointerEvent) => {
      const p = press.current;
      if (!p || e.pointerId !== p.id) return;
      press.current = null;
      if (!p.moved) return;
      setHeld(false);
      onEnd(dragKey, { x: e.clientX, y: e.clientY });
      // home, from wherever it was let go
      settle.current = [animate(x, 0, spring.standard), animate(y, 0, spring.standard)];
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    // the handlers read the latest props through the closure each render
  });

  return (
    <motion.div
      ref={(node) => {
        el.current = node;
        register(dragKey, node);
      }}
      style={{ x: drawnX, y: drawnY, rotate: vertical ? 0 : lean, zIndex: held ? 30 : undefined, touchAction: "none" }}
      // neighbours make way quickly (the gap opens before the pointer arrives); its lift springs in and out with a
      // little give
      transition={{ default: spring.standard, scale: spring.settle }}
      animate={{ opacity: removing ? 0.45 : 1, scale: held ? 1.12 : 1 }}
      onPointerDown={(e) => {
        if (e.button !== 0 || !arranging) return;
        settle.current.forEach((a) => a.stop());
        // pressed while still sliding into place: it is taken from where it is drawn
        x.set(x.get() + slide.x.get());
        y.set(y.get() + slide.y.get());
        slide.stop();
        const node = el.current;
        const r = node ? layoutRect(node) : { left: 0, top: 0 };
        // (from where it is drawn: a press while it is still settling home takes it from there)
        press.current = { id: e.pointerId, sx: e.clientX - x.get(), sy: e.clientY - y.get(), lx: r.left, ly: r.top, px: e.clientX, py: e.clientY, moved: false };
      }}
    >
      {children}
    </motion.div>
  );
}

interface DockBarProps {
  settings: Settings;
  items: DockItemView[];
  onLaunch: (item: DockItemView, target?: HTMLElement) => void;
  /** The first dock. With a dock on every monitor only this one shows the
   *  first-run welcome card, which pins the starter apps once. */
  primary: boolean;
}

export function DockBar({ settings, items, onLaunch, primary }: DockBarProps) {
  const dockGlass = useGlass("dock");
  const {
    edge,
    iconSize,
    magnification,
    magnificationScale,
    magnificationLift,
    magnificationReach,
    padding: PAD_CROSS,
    iconSpacing,
    statusIconSize,
  } = settings.dock;
  // With the menu bar on, the clock and the status icons live there and the
  // dock keeps to apps (unless it is set to show them in both places)
  const barHasStatus = settings.menuBar.enabled && settings.menuBar.takesOverDockStatus;
  const showClock = settings.dock.showClock && !barHasStatus;
  const showStatus = settings.dock.showSystemStatus && !barHasStatus;
  const vertical = edge === "left" || edge === "right";
  // how the dock comes and goes (Settings > Animations)
  const animations = animationsOf(settings);
  const speed = settings.appearance.animationSpeed;
  const reveal = useMemo(
    () => revealMotion(animations.dockReveal, edge, vertical, speed),
    [animations.dockReveal, edge, vertical, speed],
  );
  // the gap between the bar and the screen edge, when the dock floats
  const edgeGap = settings.dock.floating ? settings.dock.floatingMargin : 0;
  // Search and Settings hang off the ends of the dock instead of sitting in
  // it. Horizontal docks only: a vertical dock keeps them in the bar.
  const revealMode = settings.dock.revealControls && !vertical;
  // how close to the bar's end the pointer must get for that end's button to
  // bud out (Settings > Dock items > How close to the end)
  const revealZone = settings.dock.revealZone;
  const mouseAxis = useMotionValue(Infinity);
  const [magnifyField] = useState(newMagnifyField);
  magnifyField.restSize = iconSize;
  magnifyField.vertical = vertical;
  const menu = useMenu();
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  const pinnedItems = useMemo(() => items.filter((i) => i.pinned), [items]);
  const runningItems = useMemo(() => items.filter((i) => !i.pinned), [items]);

  // every app's Jump List read a little after the dock has settled (and for an app that appears later), one at a
  // time while the page is idle, so even a first right-click opens the menu complete (jumpCache)
  const itemKeys = items.map((i) => i.target).join("|");
  useEffect(() => {
    const t = setTimeout(() => warmAll(items), 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemKeys]);

  // Pinned apps, the divider and running apps as one list, so an icon can be dragged across the divider (dockOrder.ts)
  const dockOrder = useDockOrder(items, dragging);
  const orderRef = useRef(dockOrder.order);
  orderRef.current = dockOrder.order;

  const peak = magnification ? magnificationScale : 1;
  // how far above where it rests the icon under the pointer reaches, in px, beyond what its growth gives it
  const liftPx = magnification ? iconSize * magnificationLift : 0;
  const welcomeOpen = primary && !settings.onboardingComplete && pinnedItems.length === 0;
  const modesOpen = useModeSwitcher((m) => m.open);
  const modesOn = settings.modes.enabled && settings.modes.modes.length > 0;
  // The tray's hidden-icons flyout belongs to Windows, so the dock hears
  // about it from Rust. While it is up the dock counts as in use: it would
  // otherwise auto-hide out from under a flyout that was opened from it.
  const [trayOpen, setTrayOpen] = useState(false);
  useEffect(() => {
    const unlisten = listen<boolean>(EVENTS.trayFlyout, (e) => setTrayOpen(e.payload));
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);
  const menuOpen = menu.anchor !== null || welcomeOpen || modesOpen || trayOpen;
  // toasts sit in the band above the dock, which is only tall enough for a
  // tooltip — without extra room the window would clip them
  const toastCount = useToasts((s) => s.items.length);

  // ---- auto-hide state machine ----
  // hidden=false + hover/menu keeps it visible; idle slides it out,
  // then the window shrinks to a reveal strip; any mouse contact with
  // the strip brings it back.
  const [hidden, setHidden] = useState(false);
  const [windowShrunk, setWindowShrunk] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const shrinkTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // A file drag aimed at the dock must not make it slide away.
  const fileDragOver = useFileDrag((s) => s.overDock);

  // ambient-motion sleep: cheap idle, alive on approach
  const asleep = useAmbient((s) => s.asleep);
  const setAsleep = useAmbient((s) => s.setAsleep);
  const setDockHidden = useAmbient((s) => s.setDockHidden);
  const sleepTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    clearTimeout(sleepTimer.current);
    if (pointerInside || menuOpen || fileDragOver) {
      setAsleep(false);
      return;
    }
    sleepTimer.current = setTimeout(() => setAsleep(true), SLEEP_AFTER_MS);
    return () => clearTimeout(sleepTimer.current);
  }, [pointerInside, menuOpen, fileDragOver, setAsleep]);

  // Asleep is also when the dock hands memory back. Chromium keeps its
  // raster caches until told otherwise; on a real desktop this took the
  // GPU process from about 125 MB to about 61 MB. Waking restores normal
  // behaviour before the cursor can notice.
  useEffect(() => {
    ipc.setMemorySaver(asleep).catch((e) => console.debug("memory saver unavailable", e));
  }, [asleep]);

  // The Start menu open, with the dock to stay out of sight meanwhile (Settings > Start menu): it slides away and
  // nothing brings it back until the menu closes. (Usable, the other choice, needs nothing here: Rust cuts the
  // menu's window off at the dock's edge so the dock gets the pointer.)
  const [startOpen, setStartOpen] = useState(false);
  useEffect(() => {
    const un = listen<boolean>("start://state", (e) => setStartOpen(e.payload));
    return () => void un.then((f) => f());
  }, []);
  const awayForStart = startOpen && settings.start?.dockWhileOpen === "hidden";

  const autoHide = settings.dock.autoHide;
  const autoHideDelay = settings.dock.autoHideDelayMs;
  useEffect(() => {
    clearTimeout(hideTimer.current);
    clearTimeout(shrinkTimer.current);
    if (awayForStart) {
      setHidden(true);
      if (autoHide) shrinkTimer.current = setTimeout(() => setWindowShrunk(true), reveal.hideMs);
      return () => clearTimeout(shrinkTimer.current);
    }
    if (!autoHide) {
      setHidden(false);
      setWindowShrunk(false);
      return;
    }
    if (pointerInside || menuOpen || fileDragOver) {
      setHidden(false);
      setWindowShrunk(false);
      return;
    }
    hideTimer.current = setTimeout(() => {
      setHidden(true);
      // shrink the OS window only after the slide-out finishes
      shrinkTimer.current = setTimeout(() => setWindowShrunk(true), reveal.hideMs);
    }, autoHideDelay);
    return () => {
      clearTimeout(hideTimer.current);
      clearTimeout(shrinkTimer.current);
    };
  }, [autoHide, pointerInside, menuOpen, fileDragOver, autoHideDelay, reveal.hideMs, awayForStart]);

  // Slid away, nothing of the dock can be seen, so none of its decoration
  // needs to run (the effects layer and the CSS float and sweep both stand
  // down on this).
  const slidAway = hidden || windowShrunk;
  useEffect(() => {
    setDockHidden(slidAway);
  }, [slidAway, setDockHidden]);

  // Where the pointer counts as on the dock. The window is much taller than the bar (it keeps room above for the
  // icons' magnification, menus and flyouts), and counting all of it kept a dock that was waiting to hide coming back
  // whenever the pointer crossed that empty room. So it is the strip from the screen edge to what is drawn of the dock
  // (the bar, or an icon swollen up out of it, wherever it is in sliding away), and a little more, and never less than
  // the strip along the edge that brings it back once it has gone.
  const pointerInsideRef = useRef(false);
  pointerInsideRef.current = pointerInside;
  const inDockZone = (e: { clientX: number; clientY: number }): boolean => {
    const bar = barRef.current;
    if (!bar || !autoHide || draggingRef.current) return true;
    if (edge === "bottom" && e.clientY >= window.innerHeight - REVEAL_STRIP) return true;
    if (edge === "top" && e.clientY <= REVEAL_STRIP) return true;
    if (edge === "left" && e.clientX <= REVEAL_STRIP) return true;
    if (edge === "right" && e.clientX >= window.innerWidth - REVEAL_STRIP) return true;
    // (shrunk, the window is the strip, so this only matters for a move that lands before the window has shrunk)
    if (windowShrunk) return false;
    let r = bar.getBoundingClientRect();
    let { top, bottom, left, right } = r;
    for (const icon of bar.querySelectorAll<HTMLElement>(".dock-icon-mag")) {
      r = icon.getBoundingClientRect();
      top = Math.min(top, r.top);
      bottom = Math.max(bottom, r.bottom);
      left = Math.min(left, r.left);
      right = Math.max(right, r.right);
    }
    switch (edge) {
      case "bottom":
        return e.clientY >= top - DOCK_ZONE_BUFFER;
      case "top":
        return e.clientY <= bottom + DOCK_ZONE_BUFFER;
      case "left":
        return e.clientX <= right + DOCK_ZONE_BUFFER;
      case "right":
        return e.clientX >= left - DOCK_ZONE_BUFFER;
    }
  };

  // The bar's real thickness across the dock axis, for the strip Rust
  // reserves on screen. It can exceed icon + padding: the clock and the
  // status glyphs are taller than a small icon and set the height then.
  // Measured rather than estimated, and safe next to the "no
  // ResizeObserver" rule below because it only moves the reserved strip,
  // never the window, so it cannot feed back into its own measurement.
  const barRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  // the bar that magnification places things in, and its glass; placed again after every render, for anything new
  useLayoutEffect(() => {
    magnifyField.bar = barRef.current;
    magnifyField.body = bodyRef.current;
    magnifyField.schedule();
  });
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerLight = usePointerLight();
  const [barThickness, setBarThickness] = useState(0);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const measure = () => setBarThickness(vertical ? el.offsetWidth : el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [vertical]);

  // How far the drop is drawn in from its box (DROP_PATH spans x 19..81 and starts at its tip, y 5): the button's size
  // (dock.css --control-size) times that; a well's edge is its box's.
  const dropInset = useMemo(() => {
    if (settings.dock.startStyle === "well") return { x: 0, y: 0 };
    const box = Math.min(34, Math.max(20, iconSize + 6)) * (settings.dock.startSize ?? 1);
    return { x: box * 0.19, y: box * 0.05 };
  }, [settings.dock.startStyle, settings.dock.startSize, iconSize]);

  // The two ends look alike. What ends the bar (the Recycle Bin, the clock, the gear) is drawn inset in its own box
  // and the cluster it sits in has padding of its own, so the empty glass after it is wider than the bar's padding;
  // an app's icon fills its box, so with nothing before it the start was the narrower end (the drop is inset in its box
  // too, which is why the two looked alike with it showing). So the space after the last thing drawn is measured, and
  // the start is given exactly that (`--end-pad`); the drop's own inset is taken back as its slot opens (StartSlot).
  // Sizes, not where things are drawn, are what change it, so it is measured when the bar's size changes. It cannot
  // feed back: the start's padding moves nothing at the far end.
  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const measure = () => {
      const kids = [...bar.children].filter(
        (e): e is HTMLElement => e instanceof HTMLElement && !e.classList.contains("dock-body") && e.offsetWidth > 0 && e.offsetHeight > 0,
      );
      const last = kids[kids.length - 1];
      if (!last) return;
      // In layout, not as drawn: magnification moves what is at the end outward by transforms while the pointer is in
      // the dock, and the bar resizes (the drop coming in) just then; measured as drawn, the end read 3.6 px short
      // and the start kept that. Each mark's far edge is its box's (layout) less how far in its box it is drawn.
      const marks = [...last.querySelectorAll("svg, img, .widget-clock")];
      let end = -Infinity;
      for (const m of marks.length ? marks : [last]) {
        const host = m instanceof HTMLElement ? m : m.parentElement;
        if (!host || host.offsetWidth === 0) continue;
        const hb = layoutRect(host);
        const hr = host.getBoundingClientRect();
        const mr = m.getBoundingClientRect();
        if (mr.width === 0) continue;
        const s = (vertical ? hr.height / host.offsetHeight : hr.width / host.offsetWidth) || 1;
        const far = vertical ? hb.top + hb.height - (hr.bottom - mr.bottom) / s : hb.left + hb.width - (hr.right - mr.right) / s;
        end = Math.max(end, far);
      }
      const bb = layoutRect(bar);
      const gap = vertical ? bb.top + bar.offsetHeight - end : bb.left + bar.offsetWidth - end;
      if (!Number.isFinite(gap) || gap < 0) return;
      const now = parseFloat(bar.style.getPropertyValue("--end-pad")) || 0;
      if (Math.abs(now - gap) > 0.25) bar.style.setProperty("--end-pad", `${gap.toFixed(2)}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    return () => observer.disconnect();
  }, [vertical]);

  // Where the bar is within the window (the bar alone, not the room the window keeps for flyouts), for Rust: the
  // Start menu rests above it. It is there once the dock has arrived and goes the moment it starts to leave. (The
  // frosted glass under the bar follows it by itself: see BackdropLayer.)
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    let last = "";
    /** Say where the bar is now; true if that is not where it was last said to be. */
    const send = (): boolean => {
      // where it is drawn, not where layout puts it: while a bar grows or shrinks to fit
      // an app that came or went it is moved by a transform, and the glass behind it has
      // to follow that, not the size layout jumps to at once
      // (its glass, which is as wide as the bar is drawn, swollen icons and all)
      const glass = bodyRef.current ?? el;
      const box = glass.getBoundingClientRect();
      const w = el.offsetWidth ? box.width : 0;
      const h = el.offsetHeight ? box.height : 0;
      const radius = Math.min(parseFloat(getComputedStyle(glass).borderTopLeftRadius) || 0, w / 2, h / 2);
      const shown = !slidAway && w > 0 && h > 0;
      const half = (v: number) => Math.round(v * 2) / 2;
      const key = shown ? [box.left, box.top, w, h, radius].map(half).join() : "off";
      if (key === last) return false;
      last = key;
      ipc.reportDockBar(box.left, box.top, w, h, radius, shown).catch(() => undefined);
      return true;
    };
    // While anything is moving it looks at every frame, and rests when the bar has been
    // the same for a while (half a second: a spring takes a while to be sure it has stopped).
    let frame = 0;
    let still = 0;
    const tick = () => {
      frame = 0;
      still = send() ? 0 : still + 1;
      if (still < 30) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      still = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    wake();
    const resized = new ResizeObserver(wake);
    resized.observe(el);
    // an icon coming or going moves the bar by a transform before layout has anything to say
    const changed = new MutationObserver(wake);
    changed.observe(el, { childList: true, subtree: true });
    window.addEventListener("resize", wake);
    return () => {
      cancelAnimationFrame(frame);
      resized.disconnect();
      changed.disconnect();
      window.removeEventListener("resize", wake);
    };
  }, [slidAway, vertical]);  // and none left behind when the dock goes
  useEffect(
    () => () => {
      ipc.reportDockBar(0, 0, 0, 0, 0, false).catch(() => undefined);
    },
    [],
  );

  // ---- the keyboard ----
  // The shortcut (Ctrl+Alt+D) brings the keyboard here: the dock takes the focus,
  // shows itself if it was hidden, and the arrow keys walk its icons. Enter opens
  // one, Shift+F10 its menu, and Escape gives the keyboard back to whoever had it.
  const [kbd, setKbd] = useState(false);
  const kbdRef = useRef(false);
  kbdRef.current = kbd;
  const kbdPrevious = useRef(0);
  const reachable = useCallback(
    () =>
      Array.from(
        viewportRef.current?.querySelectorAll<HTMLElement>(
          "button.dock-icon, button.dock-control-btn, button.dock-drop-btn, button.widget-chip-button, button.widget-clock-button",
        ) ?? [],
      ),
    [],
  );
  const leaveKeyboard = useCallback((handBack: boolean) => {
    if (!kbdRef.current) return;
    setKbd(false);
    setPointerInside(false);
    (document.activeElement as HTMLElement | null)?.blur();
    ipc.setDockFocusable(false).catch(() => undefined);
    if (handBack && kbdPrevious.current) ipc.activateWindow(kbdPrevious.current).catch(() => undefined);
  }, []);
  useEffect(() => {
    if (!primary) return;
    const un = listen<number>("keyboard://enter", (e) => {
      if (kbdRef.current) {
        leaveKeyboard(true);
        return;
      }
      kbdPrevious.current = e.payload || 0;
      setKbd(true);
      setPointerInside(true);
      setTimeout(() => reachable()[0]?.focus(), 80);
    });
    return () => {
      un.then((fn) => fn());
    };
  }, [primary, leaveKeyboard, reachable]);
  // losing the keyboard to something else (an app opened, a click elsewhere) ends the visit
  useEffect(() => {
    if (!kbd) return;
    const onBlur = () => leaveKeyboard(false);
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [kbd, leaveKeyboard]);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!kbd) return;
    const list = reachable();
    const at = list.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => {
      e.preventDefault();
      list[(i + list.length) % list.length]?.focus();
    };
    const next = vertical ? "ArrowDown" : "ArrowRight";
    const prev = vertical ? "ArrowUp" : "ArrowLeft";
    if (e.key === next) go(at + 1);
    else if (e.key === prev) go(at < 0 ? -1 : at - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(-1);
    else if (e.key === "Escape") {
      e.preventDefault();
      leaveKeyboard(true);
    } else if (e.key === "ContextMenu" || (e.key === "F10" && e.shiftKey)) {
      // the icon's menu, from the middle of the icon
      e.preventDefault();
      const el = document.activeElement as HTMLElement | null;
      if (el) {
        const r = el.getBoundingClientRect();
        el.dispatchEvent(
          new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }),
        );
      }
    }
  };
  // ---- idle float ----
  // The icons' gentle drift is drawn by the stylesheet from a phase written
  // here (see the note on `.dock-icon-float` for why it is not a CSS
  // animation). It runs only while the dock is awake and on screen, and
  // carries on from where it stopped.
  const floatPhase = useRef(0);
  useEffect(() => {
    const bar = barRef.current;
    if (!bar || asleep || slidAway) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const perMs = (2 * Math.PI) / (idleFloat.period * 1000);
    let last = performance.now();
    const write = () => {
      const now = performance.now();
      floatPhase.current = (floatPhase.current + (now - last) * perMs) % (2 * Math.PI);
      last = now;
      // on each icon's own float, not on the bar: a variable changed on the bar has every element inside it looked at
      // again (the clock, the glyphs, the satellites: some 230), twenty times a second, for the nine that use it
      const t = floatPhase.current.toFixed(3);
      for (const el of bar.querySelectorAll<HTMLElement>(".dock-icon-float")) el.style.setProperty("--float-t", t);
    };
    write();
    const timer = setInterval(write, idleFloat.updateMs);
    return () => clearInterval(timer);
  }, [asleep, slidAway]);

  // Deterministic window size: no ResizeObserver, no feedback loops.
  const windowSize = useMemo(() => {
    const n = Math.max(items.length, 1);
    // (the divider shows while an app is dragged, even with one side empty, so it can be dropped on either side)
    const dividers = runningItems.length > 0 || dragging ? 1 : 0;
    const mainBase = n * iconSize + (n - 1 + dividers) * iconSpacing + dividers * 8 + PAD_MAIN * 2;
    // neighbors near the cursor grow too: the swollen stretch is as wide as the reach, and the growth over it adds
    // up to no more than the peak times the reach, in icons
    const mainGrowth = iconSize * (peak - 1) * Math.max(1, magnificationReach);
    // the clock and the row of status glyphs, which grows with their size
    const cluster =
      (showClock ? CLOCK_SPACE : 0) + (showStatus ? 4 * (statusIconSize + 9) : 0) + 24;
    // Search and Settings take room in the bar, unless they are revealed
    // from outside it, in which case the window needs room at each end for
    // them instead, including the overshoot of their entrance
    // the Liquidock button now always sits in the bar, with a divider after it (StartSlot): its room, and the divider's
    // a button sized up (startSize) takes that much more: up to 34px wide, 1.2 times that in a well
    const startGrow = Math.max(0, (settings.dock.startSize ?? 1) - 1) * 42;
    const startRoom = settings.dock.showSearchButton ? (revealMode ? START_SLOT_ROOM : START_DIVIDER_ROOM) + startGrow : 0;
    // (and a little for the start matching the far end, --end-pad, which can be a few px more than the padding)
    const controls = (revealMode ? 2 * SATELLITE_ROOM : CONTROLS_SPACE) + startRoom + 10;
    const main =
      mainBase +
      mainGrowth +
      EDGE_SLACK +
      cluster +
      controls +
      (modesOn ? MODE_TILE_SPACE : 0);
    const label = vertical ? LABEL_SPACE_SIDE : LABEL_SPACE;
    // The dock band itself: icons at full magnification plus tooltip room.
    const band = iconSize * peak + liftPx + PAD_CROSS * 2 + label;
    // Open surfaces are taller than the band. Each reports the total cross
    // size it needs, and the window takes the largest.
    const crossFull = Math.max(
      band,
      menu.anchor !== null || welcomeOpen ? band + MENU_SPACE : 0,
      // the mode flyout is taller than the tooltip band it hangs off
      modesOpen ? band + MODE_FLYOUT_HEIGHT + FLYOUT_GAP : 0,
      toastCount > 0 ? band + TOAST_SPACE : 0,
    );
    // The OS window is as tall as the tallest thing that can ever open, and
    // stays that size. Resizing it when a flyout opens (every hover over a
    // running app) shows up as the dock jumping and the flyout being
    // clipped, because the web view repaints a frame behind the window.
    // What changes instead is `visible`: the part of the window that takes
    // mouse input and shows pixels. Rust clips the window to it.
    const crossMax = Math.max(
      band + MENU_SPACE,
      band + MODE_FLYOUT_HEIGHT + FLYOUT_GAP,
      band + TOAST_SPACE,
    );
    // The edge gap is part of the window, not space outside it. The window
    // runs right to the screen edge and the bar sits `edgeGap` in from it
    // (see .dock-viewport), so the pointer crossing that gap on the way to
    // the very edge of the screen is still over the dock. When the window
    // stopped short of the edge, that strip was not the dock, and the dock
    // took the pointer leaving it as a reason to hide.
    //
    // The window keeps that size even while the dock is hidden: what shrinks
    // is the part of it that shows, down to a thin strip at the screen edge
    // that waits for the pointer. Shrinking the window itself made every hide
    // and every reveal resize the web view too, and a resize lags a frame or
    // more behind the bar sliding in, so it popped into view part way along.
    const crossWindow = crossMax + edgeGap;
    const crossVisible = windowShrunk ? REVEAL_STRIP : crossFull + edgeGap;
    return vertical
      ? { width: crossWindow, height: main, visibleWidth: crossVisible, visibleHeight: main }
      : { width: main, height: crossWindow, visibleWidth: main, visibleHeight: crossVisible };
  }, [
    items.length,
    runningItems.length,
    iconSize,
    iconSpacing,
    statusIconSize,
    showClock,
    showStatus,
    revealMode,
    PAD_CROSS,
    peak,
    liftPx,
    magnificationReach,
    vertical,
    menu.anchor,
    welcomeOpen,
    toastCount,
    windowShrunk,
    modesOn,
    modesOpen,
    edgeGap,
    settings.dock.showSearchButton,
    settings.dock.startSize,
    dragging,
  ]);

  // The room a flyout takes is given back only after its exit has played. A
  // dock that has slid away has no exit to wait for: its strip shrinks at once.
  const heldCross = useLinger(
    vertical ? windowSize.visibleWidth : windowSize.visibleHeight,
    windowShrunk ? 0 : FLYOUT_EXIT_MS,
  );
  const visibleWidth = vertical ? heldCross : windowSize.visibleWidth;
  const visibleHeight = vertical ? windowSize.visibleHeight : heldCross;

  useEffect(() => {
    ipc
      .resizeDock(windowSize.width, windowSize.height, visibleWidth, visibleHeight, barThickness)
      .catch((e) => {
        // geometry is re-sent on every layout change; a single miss is
        // self-healing, so log it rather than interrupting the user
        console.warn("resize_dock failed", e);
      });
  }, [windowSize.width, windowSize.height, visibleWidth, visibleHeight, barThickness]);

  // ---- Search and Settings, revealed when the pointer nears their end ----
  // Search hangs off the left end of the dock and Settings off the right,
  // beside the clock and status glyphs.
  // where a pinned app is being held when it has been pulled far enough off
  // the dock that letting go would unpin it
  const [pullOut, setPullOut] = useState<{ x: number; y: number } | null>(null);
  // (the left end's button, the Liquidock button, is in the bar now: StartSlot; this is only tracked for symmetry)
  const [, setRevealLeft] = useState(false);
  const [revealRight, setRevealRight] = useState(false);
  const revealHideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cancelRevealHide = useCallback(() => clearTimeout(revealHideTimer.current), []);
  const scheduleRevealHide = useCallback(() => {
    clearTimeout(revealHideTimer.current);
    // long enough to cross the gap between the bar and the control
    revealHideTimer.current = setTimeout(() => {
      setRevealLeft(false);
      setRevealRight(false);
    }, 180);
  }, []);
  useEffect(() => () => clearTimeout(revealHideTimer.current), []);

  // The Liquidock button out of sight until the pointer nears the bar's start (dock.startReveal "expand", horizontal
  // docks): within the reveal zone of the bar's start edge it opens (StartSlot), and it stays open while the pointer is
  // over it or not far past its divider; moving on (or leaving) shuts it a moment later.
  const startExpands = settings.dock.showSearchButton && settings.dock.startReveal === "expand" && !vertical;
  const [startNear, setStartNear] = useState(false);
  const startNearRef = useRef(false);
  startNearRef.current = startNear;
  const reducedMotion = useReduced().motion;
  const startShutTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(startShutTimer.current), []);
  const trackStart = useCallback(
    (x: number, y: number) => {
      if (!startExpands || draggingRef.current) return;
      const barEl = barRef.current;
      if (!barEl) return;
      const bar = barEl.getBoundingClientRect();
      const level = y >= bar.top - 14 && y <= bar.bottom + 14;
      let near: boolean;
      if (!startNearRef.current) {
        near = level && x < bar.left + revealZone && x > bar.left - SATELLITE_ROOM - 24;
      } else {
        const slot = barEl.querySelector(".dock-start-slot")?.getBoundingClientRect();
        const end = slot ? slot.right : bar.left;
        near = level && x < end + Math.max(16, revealZone * 0.6) && x > bar.left - SATELLITE_ROOM - 24;
      }
      if (near) {
        clearTimeout(startShutTimer.current);
        startShutTimer.current = undefined;
        if (!startNearRef.current) setStartNear(true);
      } else if (startNearRef.current && startShutTimer.current === undefined) {
        startShutTimer.current = setTimeout(() => {
          startShutTimer.current = undefined;
          setStartNear(false);
        }, 180);
      }
    },
    [startExpands, revealZone],
  );

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingRef.current) {
        measureRest(magnifyField);
        mouseAxis.set(vertical ? e.clientY : e.clientX);
      }
      trackStart(e.clientX, e.clientY);
      if (!revealMode || draggingRef.current) return;
      const bar = e.currentTarget.getBoundingClientRect();
      const left = e.clientX - bar.left < revealZone;
      const right = bar.right - e.clientX < revealZone;
      if (left || right) cancelRevealHide();
      setRevealLeft(left);
      setRevealRight(right);
    },
    [mouseAxis, magnifyField, vertical, revealMode, revealZone, cancelRevealHide, trackStart],
  );

  // Coming at the dock's end from outside it, along the screen, never crosses the bar before the
  // place the buttons bud from, so the bar's own handler (above) never sees the pointer there. The
  // window is wider than the bar by the room the buttons need, so this watches that room too.
  const handleOutside = useCallback(
    (e: React.MouseEvent) => {
      const barEl = barRef.current;
      if (barEl && !barEl.contains(e.target as Node)) trackStart(e.clientX, e.clientY);
      if (!revealMode || draggingRef.current) return;
      if (!barEl || barEl.contains(e.target as Node)) return;
      const bar = barEl.getBoundingClientRect();
      // level with the bar, give or take a little
      const level = e.clientY >= bar.top - 14 && e.clientY <= bar.bottom + 14;
      const left = level && e.clientX < bar.left + revealZone && e.clientX > bar.left - SATELLITE_ROOM - 24;
      const right = level && e.clientX > bar.right - revealZone && e.clientX < bar.right + SATELLITE_ROOM + 24;
      if (left || right) {
        cancelRevealHide();
        setRevealLeft(left);
        setRevealRight(right);
      } else {
        // moving about the window, away from the places the buttons come from
        scheduleRevealHide();
      }
    },
    [revealMode, revealZone, cancelRevealHide, scheduleRevealHide, trackStart],
  );

  const handleLeave = useCallback(() => {
    mouseAxis.set(Infinity);
    if (revealMode) scheduleRevealHide();
    // off the bar altogether: the button goes, unless the pointer is only crossing to the room beside the bar (the
    // window's own move handler keeps it then)
    if (startNearRef.current && startShutTimer.current === undefined) {
      startShutTimer.current = setTimeout(() => {
        startShutTimer.current = undefined;
        setStartNear(false);
      }, 260);
    }
  }, [mouseAxis, revealMode, scheduleRevealHide]);

  // The dock slid away: a button still out goes with it (the layer they are on takes the same
  // motion as the bar), and is let go of once that has played, so it is not there to be seen
  // when the dock comes back.
  useEffect(() => {
    if (!hidden) return;
    cancelRevealHide();
    const t = setTimeout(() => {
      setRevealLeft(false);
      setRevealRight(false);
    }, reveal.hideMs);
    return () => clearTimeout(t);
  }, [hidden, reveal.hideMs, cancelRevealHide]);

  const openMenu = useCallback(
    (item: DockItemView, target: HTMLElement) => {
      menu.open("menu", item, anchorFor(target));
    },
    [menu],
  );

  const launchGuarded = useCallback(
    (item: DockItemView, target?: HTMLElement) => {
      if (draggingRef.current) return;
      if (item.kind === "folder" && target) {
        menu.open("folder", item, anchorFor(target));
        return;
      }
      if (item.kind === "stack" && target) {
        menu.open("stack", item, anchorFor(target));
        return;
      }
      // several windows: show them instead of blind-cycling
      if (item.windows.length > 1 && target) {
        menu.open("windows", item, anchorFor(target));
        return;
      }
      // (the sound is made by what the click does: DockApp)
      onLaunch(item, target);
    },
    [onLaunch, menu],
  );

  const openPreview = useCallback(
    (item: DockItemView, target: HTMLElement) => {
      if (draggingRef.current) return;
      // a right-click menu that is open (an icon's, or the dock's own) is not swept away by the previews that come up
      // when the pointer rests on the icon: it opened with the pointer resting there, and its own hover would replace it
      const m = useMenu.getState();
      if (m.anchor && (m.kind === "menu" || m.kind === "dock")) return;
      menu.open("windows", item, anchorFor(target));
    },
    [menu],
  );

  const iconProps = {
    mouseAxis,
    field: magnifyField,
    iconSize,
    magnify: magnification,
    magScale: magnificationScale,
    lift: magnificationLift,
    reach: magnificationReach,
    vertical,
    edge,
    dragging,
    onLaunch: launchGuarded,
    onContext: openMenu,
    onHoverPreview: openPreview,
  };

  // ---- dragging apps on and off the dock ----
  // One list (dockOrder.ts): an icon dragged along it moves past its neighbours, the divider included, and they slide
  // aside to make room. Let go on the pinned side, a running app is pinned there; let go on the running side, a pinned
  // app is unpinned (and goes, if it has no windows); pulled clear of the dock, a pinned app is unpinned. Anything else
  // is a reorder of its own side.

  /** Whether a point is far enough past the bar, on the side away from the
   *  screen edge, to count as "pulled off the dock". Kept inside the window's
   *  visible band, which only reaches so far above the bar. */
  const pulledOff = (p: { x: number; y: number }): boolean => {
    const bar = barRef.current?.getBoundingClientRect();
    if (!bar) return false;
    switch (edge) {
      case "bottom":
        return p.y < bar.top - PULL_OFF;
      case "top":
        return p.y > bar.bottom + PULL_OFF;
      case "left":
        return p.x > bar.right + PULL_OFF;
      case "right":
        return p.x < bar.left - PULL_OFF;
    }
  };

  // the icons' elements by key, to measure where they are laid out
  const dragEls = useRef(new Map<string, HTMLElement>());
  const registerDragEl = useCallback((key: string, el: HTMLElement | null) => {
    if (el) dragEls.current.set(key, el);
    else dragEls.current.delete(key);
  }, []);
  // what was picked up: whether it was pinned, and whether the app is running (an app with no windows that is unpinned
  // goes from the dock altogether)
  const dragFrom = useRef<{ key: string; wasPinned: boolean; running: boolean } | null>(null);
  // the icon that letting go now would unpin and take away (drawn faded, with "Remove from Dock" by the pointer)
  const [removing, setRemoving] = useState<string | null>(null);
  // The icons slide to their places (layout) except while the dock is away and while it comes back in (see
  // DockDragItem): the bar springs up by a scale motion does not measure through, so each icon read as having moved
  // ~20 px and was drawn sliding inside its glass to catch up. Switched off then, and on again once the bar is at rest.
  const [comingIn, setComingIn] = useState(false);
  useEffect(() => {
    if (hidden) return;
    setComingIn(true);
    const t = setTimeout(() => setComingIn(false), 700 / Math.max(0.25, speed));
    return () => clearTimeout(t);
  }, [hidden, speed]);
  const arranging = !hidden && !comingIn;
  // a move was just made: the next is weighed against the new layout, not the one before it
  const reordering = useRef(false);
  useLayoutEffect(() => {
    reordering.current = false;
  }, [dockOrder.order]);

  /** Where along the dock an icon (or the divider) is laid out: the middle of its box, ignoring any transform. */
  const middleOf = (key: string): number | null => {
    const el = dragEls.current.get(key);
    if (!el || el.offsetParent === null) return null;
    const r = layoutRect(el);
    return vertical ? r.top + r.height / 2 : r.left + r.width / 2;
  };

  /** Whether letting go of the icon picked up, at this point and in this order, would unpin and take it away. */
  const wouldRemove = (key: string, p: { x: number; y: number }, seq: string[]) => {
    const from = dragFrom.current;
    if (!from?.wasPinned) return false;
    return pulledOff(p) || (!from.running && sides(seq).running.includes(key));
  };

  const onIconDragStart = (key: string) => {
    const item = dockOrder.byKey.get(key);
    dragFrom.current = { key, wasPinned: sides(orderRef.current).pinned.includes(key), running: (item?.windows.length ?? 0) > 0 };
    draggingRef.current = true;
    setDragging(true);
    mouseAxis.set(Infinity);
    playCue("lift");
  };

  const onIconDrag = (key: string, p: { x: number; y: number }) => {
    const seq = orderRef.current;
    // past the middle of a neighbour (or the divider), it takes that place, and the neighbour slides into its own
    if (!reordering.current) {
      const at = seq.indexOf(key);
      const along = vertical ? p.y : p.x;
      let to = at;
      while (to + 1 < seq.length) {
        const m = middleOf(seq[to + 1]);
        if (m === null || along <= m) break;
        to++;
      }
      if (to === at) {
        while (to - 1 >= 0) {
          const m = middleOf(seq[to - 1]);
          if (m === null || along >= m) break;
          to--;
        }
      }
      if (to !== at) {
        reordering.current = true;
        // each place passed is felt
        playCue("tick");
        const next = moved(seq, at, to);
        orderRef.current = next;
        dockOrder.setOrder(next);
      }
    }
    // tell the user what letting go here would do
    const gone = wouldRemove(key, p, orderRef.current);
    setRemoving(gone ? key : null);
    setPullOut(gone ? p : null);
  };

  const onIconDragEnd = (key: string, p: { x: number; y: number }) => {
    const seq = orderRef.current;
    const item = dockOrder.byKey.get(key);
    const from = dragFrom.current;
    setPullOut(null);
    setRemoving(null);
    dragFrom.current = null;
    if (item && from) {
      const { pinned, running } = sides(seq);
      const idOf = (k: string) => dockOrder.byKey.get(k)?.id ?? k;
      const puff = () => effectsBus.emit("burst", { x: p.x, y: p.y, winW: window.innerWidth, winH: window.innerHeight });
      if (wouldRemove(key, p, seq)) {
        // unpinned, and with no windows it leaves the dock: gone at once, with a puff, and the gap closes
        dockOrder.hold(seq.filter((k) => k !== key));
        puff();
        playCue("unpin");
        ipc.unpinItem(item.id).catch(notify.on(`Could not remove ${item.name}`));
      } else if (from.wasPinned && pinned.includes(key)) {
        dockOrder.hold(seq);
        playCue("place");
        ipc.reorderPinned(pinned.map(idOf)).catch(notify.on("Could not save the new order"));
      } else if (!from.wasPinned && running.includes(key)) {
        dockOrder.hold(seq);
        playCue("place");
        ipc.reorderRunning(running.map(idOf)).catch(notify.on("Could not save the new order"));
      } else if (!from.wasPinned) {
        // a running app let go among the pinned ones: pinned there
        dockOrder.hold(seq);
        playCue("pin");
        pinRunningItem(item, pinned.indexOf(key)).catch(notify.on(`Could not pin ${item.name}`));
      } else {
        // a pinned app with windows let go among the running ones: unpinned, and it stays there as running
        dockOrder.hold(seq);
        playCue("unpin");
        const runId = `run-${targetKey(item.target)}`;
        ipc
          .unpinItem(item.id)
          .then(() => ipc.reorderRunning(running.map((k) => (k === key ? runId : idOf(k)))))
          .catch(notify.on(`Could not unpin ${item.name}`));
      }
    }
    setDragging(false);
    // let the trailing click event pass before re-enabling launch
    setTimeout(() => {
      draggingRef.current = false;
    }, 50);
  };

  // A custom running-mark color (Settings > Dock items > Running app mark): the same color math the theme's own
  // accent gets (tokensFromAccent), computed once more for whatever color was picked, so the mark's gradient and
  // glow are built the same way regardless of where the color came from. Empty (the default) leaves these unset
  // and dock.css's own theme-accent fallback applies instead.
  const markColorVars = useMemo(() => {
    if (!settings.dock.markColor) return null;
    const t = tokensFromAccent(settings.dock.markColor);
    return {
      ["--mark-custom-life" as string]: t["--aero-life"],
      ["--mark-custom-deep" as string]: t["--aero-accent-deep"],
      ["--mark-custom-glow" as string]: t["--clear-glow"],
    } as React.CSSProperties;
  }, [settings.dock.markColor]);

  return (
    <div
      ref={viewportRef}
      className="dock-viewport"
      data-mark-color={markColorVars ? "custom" : "theme"}
      role="toolbar"
      aria-label="Dock"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      data-kbd={kbd}
      onKeyDown={onKeyDown}
      data-edge={edge}
      data-asleep={asleep || windowShrunk}
      // which appearing animation, and whether the dock is in or out: the
      // cascade's icons are timed from these (see dock.css)
      data-anim={animations.dockReveal}
      data-reveal={hidden ? "out" : "in"}
      // how strongly the theme's color tints the glass (clear.css, global.css): the dock's own, or the menu bar's put in
      // the dock's terms (the bar's body is half the color at its Tint, the dock's a third), so the two match
      style={{ ["--dock-tint" as string]: settings.dock.tint ?? 1, ...markColorVars } as React.CSSProperties}
      onMouseEnter={(e) => setPointerInside(inDockZone(e))}
      // a right-click on the dock's empty space (not an icon, which has its own menu) opens the dock's menu, as the
      // taskbar's does; only on the dock itself, not the empty room above it the window keeps for flyouts
      onContextMenu={(e) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        // only the dock's empty glass: nothing that is a thing of its own (an app, the Recycle Bin, the clock, the
        // status icons, a button, a menu or flyout), each of which has its own right-click or none
        const OWN = "button, a, input, [role='button'], [role='menu'], [role='dialog'], .dock-icon, .widget-cluster, .aero-menu, .windows-flyout, .folder-flyout, .stack-flyout";
        if (draggingRef.current || target.closest(OWN)) return;
        if (!inDockZone(e)) return;
        const glass = (bodyRef.current ?? barRef.current)?.getBoundingClientRect();
        if (!glass) return;
        menu.open("dock", null, {
          left: glass.left,
          top: glass.top,
          right: glass.right,
          bottom: glass.bottom,
          cx: e.clientX,
          cy: e.clientY,
          winW: window.innerWidth,
          winH: window.innerHeight,
        });
      }}
      onMouseLeave={() => {
        setPointerInside(false);
        // a button budded from the room beside the bar (see handleOutside) is not put away by
        // the bar's own leave, which the pointer never made
        if (revealMode) scheduleRevealHide();
      }}
      onMouseMove={(e) => {
        const inside = inDockZone(e);
        if (inside !== pointerInsideRef.current) setPointerInside(inside);
        handleOutside(e);
      }}
    >
      <GlyphFilters />
      <div className="dock-shell">
      <motion.div
        ref={barRef}
        className="dock-bar"
        data-vertical={vertical}
        style={{ transformOrigin: reveal.origin }}
        // it arrives when the dock first appears, and comes and goes with
        // auto-hide, in the way chosen under Settings > Animations
        initial={reveal.initial}
        animate={hidden ? reveal.hidden : reveal.shown}
        onUpdate={noop}
        onMouseMove={handleMove}
        onPointerMove={(e) => bodyRef.current && pointerLight({ clientX: e.clientX, clientY: e.clientY, currentTarget: bodyRef.current })}
        onMouseLeave={handleLeave}
      >
        {/* The glass of the bar, a layer of its own behind what is in it: as the icons swell it grows to hold them to
            the fraction of a pixel (magnifyField.ts), while the bar itself, and so everything in it, keeps its layout */}
        <div
          ref={bodyRef}
          className="dock-body glass glass-open"
          style={settings.dock.tintWithTheme === false ? NEUTRAL_GLASS : undefined}
        >
          {/* on until the dock has finished leaving (the window shrinks then), not from the moment it starts: the glass
              follows the bar's shape and fade as it goes, as it does coming in, instead of being taken first */}
          <BackdropLayer active={dockGlass.active && !windowShrunk} blur={dockGlass.blur} grain={dockGlass.grain} track="follow" />
          {/* the bar can't clip itself (tooltips float above it), so the
              ambient sweep gets its own clipping layer */}
          <span className="glass-sweep" aria-hidden />
        </div>
        <ModeSwitcher settings={settings} edge={edge} />
        {settings.dock.showSearchButton && (
          // always in the bar now, with its divider: open, or opening as the pointer nears the start (startExpands)
          <StartSlot open={!startExpands || startNear} vertical={vertical} still={reducedMotion} inset={dropInset}>
            <LiquidockButton
              effect={settings.dock.startShine}
              tune={settings.dock.startShineTune}
              clickEffect={settings.dock.startClick}
              clickTune={settings.dock.startClickTune}
              look={settings.dock.startStyle}
              wellColor={settings.dock.startWellColor}
              scale={settings.dock.startSize ?? 1}
              color={settings.dock.startColor ?? ""}
              onClick={() => ipc.toggleStart().catch(notify.on("Could not open the Start menu"))}
            />
            <span className="dock-divider" aria-hidden />
          </StartSlot>
        )}
        {/* the pinned apps, the divider and the running apps in one list, so an icon can be dragged across */}
        <div className="dock-section">
          {(() => {
            const { pinned: pinnedKeys, running: runningKeys } = sides(dockOrder.order);
            // between pinned and running apps; with one side empty there is nothing to divide (and beside the
            // Liquidock button's divider it would stand as a double line), unless an app is being dragged, which can
            // then be put down on either side of it
            const showDivider = dragging || (pinnedKeys.length > 0 && runningKeys.length > 0);
            let index = 0;
            return dockOrder.order.map((key) => {
              if (key === DIVIDER) {
                return (
                  <DockDivider key={DIVIDER} hidden={!showDivider} arranging={arranging} register={registerDragEl} />
                );
              }
              const item = dockOrder.byKey.get(key);
              if (!item) return null;
              const at = index++;
              return (
                <DockDragItem
                  key={key}
                  dragKey={key}
                  vertical={vertical}
                  removing={removing === key}
                  arranging={arranging}
                  register={registerDragEl}
                  onStart={onIconDragStart}
                  onMove={onIconDrag}
                  onEnd={onIconDragEnd}
                >
                  <DockIcon item={item} index={at} {...iconProps} />
                </DockDragItem>
              );
            });
          })()}
        </div>
        {(showClock || showStatus) && (
          <span className="dock-divider" aria-hidden />
        )}
        <WidgetCluster
          showClock={showClock}
          showStatus={showStatus}
        />
        {!revealMode && settings.dock.showSettingsButton && (
          <SettingsButton
            onClick={() => ipc.openSettings().catch(notify.on("Could not open settings"))}
          />
        )}
      </motion.div>
      {revealMode && (
        // one layer the size of the bar that moves as the bar does (the same reveal motion, so a
        // button still out when the dock goes slides away with it and comes back with it), and
        // lets everything but the buttons themselves through
        <motion.div
          className="dock-satellites"
          style={{ transformOrigin: reveal.origin }}
          initial={reveal.initial}
          animate={hidden ? reveal.hidden : reveal.shown}
          onUpdate={noop}
        >
          <AnimatePresence>
            {settings.dock.showSettingsButton && revealRight && (
              <DockSatellite
                key="settings"
                side="right"
                onHover={(over) => (over ? cancelRevealHide() : scheduleRevealHide())}
              >
                <SettingsButton
                  onClick={() =>
                    ipc.openSettings().catch(notify.on("Could not open settings"))
                  }
                />
              </DockSatellite>
            )}
          </AnimatePresence>
        </motion.div>
      )}
      </div>
      {pullOut && (
        <div className="dock-remove-hint" style={{ left: pullOut.x + 28, top: pullOut.y - 14 }}>
          Remove from Dock
        </div>
      )}
      <ContextMenu settings={settings} edge={edge} />
      <DockMenu settings={settings} edge={edge} />
      <FolderFlyout edge={edge} />
      <StackFlyout edge={edge} />
      <WindowsFlyout edge={edge} />
      <Toasts edge={edge} />
      <AnimatePresence>{welcomeOpen && <Welcome edge={edge} />}</AnimatePresence>
    </div>
  );
}
