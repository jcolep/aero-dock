/**
 * The dock bar: a glass shelf of icons. Owns the cursor motion value the
 * icons magnify against, drag-reordering of the pinned section, and the
 * deterministic window-size report to Rust (window = dock + magnification
 * headroom + tooltip space + flyout space when a menu is open).
 */

import { listen } from "@tauri-apps/api/event";
import { AnimatePresence, motion, Reorder, useMotionValue } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";
import { SearchButton, SettingsButton } from "./DockControls";
import { playCue } from "../../engine/sound/ui";
import { usePointerLight } from "../../engine/light/usePointerLight";
import { DockSatellite } from "./DockSatellite";
import { LABEL_SPACE, LABEL_SPACE_SIDE } from "./geometry";
import { MODE_FLYOUT_HEIGHT, ModeSwitcher, useModeSwitcher } from "./ModeSwitcher";
import { DockIcon } from "./DockIcon";
import { FolderFlyout } from "./FolderFlyout";
import { StackFlyout } from "./StackFlyout";
import { WindowsFlyout } from "./WindowsFlyout";
import { anchorFor, useMenu } from "./menuStore";
import { pinRunningItem } from "./pinRunning";
import "./dock.css";

const PAD_MAIN = 18; // dock padding along the axis
// Window slack so magnified end-icons never clip, and so an underestimate of
// the bar's width (the window size is computed, not measured) costs a bit of
// empty window rather than a clipped end.
const EDGE_SLACK = 48;
const MENU_SPACE = 360; // extra cross-axis room while a context menu is open
const FLYOUT_GAP = 16; // breathing room between a flyout and the window edge
const TOAST_SPACE = 210; // extra cross-axis room while toasts are on screen
const REVEAL_ZONE = 80; // px at the dock's left end that reveals Search
const PULL_OFF = 40; // px past the bar, away from the edge, that unpins on release
const CLOCK_SPACE = 76; // the clock and date
const CONTROLS_SPACE = 76; // Search and Settings buttons, when they sit in the bar
// room each end needs for a revealed control: 8px gap, a 30px button that
// overshoots to about 1.3x on entrance, and some margin
const SATELLITE_ROOM = 60;
const MODE_TILE_SPACE = 38; // the Modes tile, when Modes is switched on
const REVEAL_STRIP = 8; // window height while auto-hidden (mouse sensor)
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
 * The order of a group of dock items while the user drags them. It follows
 * the items it is given between drags, and belongs to the drag while one is
 * in flight, so a settings refresh cannot snap an icon back mid-gesture.
 *
 * The group has to know every member by id, or it cannot reorder it. An app
 * pinned by dropping it here arrives as a new member just as the drag ends;
 * if the order did not take it in, the app would draw (at the end) but could
 * never be dragged to another place.
 *
 * `dragging` is read as the current value rather than being a dependency:
 * re-syncing the instant a drag ends would, after a reorder, briefly put the
 * icons back in the old order until the saved one arrived.
 */
function useLocalOrder(items: DockItemView[], dragging: boolean) {
  const [order, setOrder] = useState<string[]>(() => items.map((i) => i.id));
  const draggingNow = useRef(dragging);
  draggingNow.current = dragging;
  useEffect(() => {
    const ids = items.map((i) => i.id);
    setOrder((current) => {
      // no drag in flight: follow the items exactly
      if (!draggingNow.current) return ids;
      // a drag is reordering them: keep its order, but take in newcomers (at
      // the end) and drop anything that has gone, so every member is known
      const sameMembers =
        current.length === ids.length && ids.every((id) => current.includes(id));
      if (sameMembers) return current;
      return [
        ...current.filter((id) => ids.includes(id)),
        ...ids.filter((id) => !current.includes(id)),
      ];
    });
  }, [items]);

  const ordered = useMemo(() => {
    const byId = new Map(items.map((i) => [i.id, i]));
    const seq = order.map((id) => byId.get(id)).filter(Boolean) as DockItemView[];
    for (const item of items) if (!order.includes(item.id)) seq.push(item);
    return seq;
  }, [order, items]);

  return { order, setOrder, ordered };
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
  const {
    edge,
    iconSize,
    magnification,
    magnificationScale,
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
  const mouseAxis = useMotionValue(Infinity);
  const menu = useMenu();
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  const pinnedItems = useMemo(() => items.filter((i) => i.pinned), [items]);
  const runningItems = useMemo(() => items.filter((i) => !i.pinned), [items]);

  // Local order during a drag; resynced from settings between drags. Both
  // groups, pinned and running, are draggable and share this logic.
  const { order, setOrder, ordered: orderedPinned } = useLocalOrder(pinnedItems, dragging);
  const {
    order: runOrder,
    setOrder: setRunOrder,
    ordered: orderedRunning,
  } = useLocalOrder(runningItems, dragging);

  const peak = magnification ? magnificationScale : 1;
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
  const menuOpen = menu.item !== null || welcomeOpen || modesOpen || trayOpen;
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

  const autoHide = settings.dock.autoHide;
  const autoHideDelay = settings.dock.autoHideDelayMs;
  useEffect(() => {
    clearTimeout(hideTimer.current);
    clearTimeout(shrinkTimer.current);
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
  }, [autoHide, pointerInside, menuOpen, fileDragOver, autoHideDelay, reveal.hideMs]);

  // Slid away, nothing of the dock can be seen, so none of its decoration
  // needs to run (the effects layer and the CSS float and sweep both stand
  // down on this).
  const slidAway = hidden || windowShrunk;
  useEffect(() => {
    setDockHidden(slidAway);
  }, [slidAway, setDockHidden]);

  // The bar's real thickness across the dock axis, for the strip Rust
  // reserves on screen. It can exceed icon + padding: the clock and the
  // status glyphs are taller than a small icon and set the height then.
  // Measured rather than estimated, and safe next to the "no
  // ResizeObserver" rule below because it only moves the reserved strip,
  // never the window, so it cannot feed back into its own measurement.
  const barRef = useRef<HTMLDivElement>(null);
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

  // Real frosted glass: Windows blurs what is behind the bar, in a pane of its
  // own that Rust keeps exactly under it (see platform/windows/backdrop.rs).
  // This says where the bar is within the window: the bar alone, not the room
  // the window keeps for flyouts, at its resting place (layout offsets, which a
  // transform does not move). It is there once the dock has arrived and goes
  // the moment it starts to leave.
  const realBlur = settings.appearance.realBlur;
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    let last = "";
    /** Say where the bar is now; true if that is not where it was last said to be. */
    const send = (): boolean => {
      // where it is drawn, not where layout puts it: while a bar grows or shrinks to fit
      // an app that came or went it is moved by a transform, and the glass behind it has
      // to follow that, not the size layout jumps to at once
      const box = el.getBoundingClientRect();
      const w = el.offsetWidth ? box.width : 0;
      const h = el.offsetHeight ? box.height : 0;
      const radius = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
      const shown = realBlur && !slidAway && w > 0 && h > 0;
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
  }, [realBlur, slidAway, vertical]);  // and none left behind when the dock goes
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
          "button.dock-icon, button.dock-control-btn, button.widget-chip-button, button.widget-clock-button",
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
      bar.style.setProperty("--float-t", floatPhase.current.toFixed(3));
    };
    write();
    const timer = setInterval(write, idleFloat.updateMs);
    return () => clearInterval(timer);
  }, [asleep, slidAway]);

  // Deterministic window size: no ResizeObserver, no feedback loops.
  const windowSize = useMemo(() => {
    const n = Math.max(items.length, 1);
    const dividers = runningItems.length > 0 ? 1 : 0;
    const mainBase = n * iconSize + (n - 1 + dividers) * iconSpacing + dividers * 8 + PAD_MAIN * 2;
    // neighbors near the cursor grow too; ~2.5 icons' worth covers the worst case
    const mainGrowth = iconSize * (peak - 1) * 2.5;
    // the clock and the row of status glyphs, which grows with their size
    const cluster =
      (showClock ? CLOCK_SPACE : 0) + (showStatus ? 4 * (statusIconSize + 9) : 0) + 24;
    // Search and Settings take room in the bar, unless they are revealed
    // from outside it, in which case the window needs room at each end for
    // them instead, including the overshoot of their entrance
    const controls = revealMode ? 2 * SATELLITE_ROOM : CONTROLS_SPACE;
    const main =
      mainBase +
      mainGrowth +
      EDGE_SLACK +
      cluster +
      controls +
      (modesOn ? MODE_TILE_SPACE : 0);
    const label = vertical ? LABEL_SPACE_SIDE : LABEL_SPACE;
    // The dock band itself: icons at full magnification plus tooltip room.
    const band = iconSize * peak + PAD_CROSS * 2 + label;
    // Open surfaces are taller than the band. Each reports the total cross
    // size it needs, and the window takes the largest.
    const crossFull = Math.max(
      band,
      menu.item !== null || welcomeOpen ? band + MENU_SPACE : 0,
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
    vertical,
    menu.item,
    welcomeOpen,
    toastCount,
    windowShrunk,
    modesOn,
    modesOpen,
    edgeGap,
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
  const [revealLeft, setRevealLeft] = useState(false);
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

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingRef.current) mouseAxis.set(vertical ? e.clientY : e.clientX);
      if (!revealMode || draggingRef.current) return;
      const bar = e.currentTarget.getBoundingClientRect();
      // the right-hand zone is the clock/status section, wherever it lands
      const cluster = e.currentTarget.querySelector(".widget-cluster")?.getBoundingClientRect();
      const rightEdge = cluster ? cluster.left - 12 : bar.right - REVEAL_ZONE;
      const left = e.clientX - bar.left < REVEAL_ZONE;
      const right = e.clientX > rightEdge;
      if (left || right) cancelRevealHide();
      setRevealLeft(left);
      setRevealRight(right);
    },
    [mouseAxis, vertical, revealMode, cancelRevealHide],
  );

  // Coming at the dock's end from outside it, along the screen, never crosses the bar before the
  // place the buttons bud from, so the bar's own handler (above) never sees the pointer there. The
  // window is wider than the bar by the room the buttons need, so this watches that room too.
  const handleOutside = useCallback(
    (e: React.MouseEvent) => {
      if (!revealMode || draggingRef.current) return;
      const barEl = barRef.current;
      if (!barEl || barEl.contains(e.target as Node)) return;
      const bar = barEl.getBoundingClientRect();
      const cluster = barEl.querySelector(".widget-cluster")?.getBoundingClientRect();
      const rightEdge = cluster ? cluster.left - 12 : bar.right - REVEAL_ZONE;
      // level with the bar, give or take a little
      const level = e.clientY >= bar.top - 14 && e.clientY <= bar.bottom + 14;
      const left = level && e.clientX < bar.left + REVEAL_ZONE && e.clientX > bar.left - SATELLITE_ROOM - 24;
      const right = level && e.clientX > rightEdge && e.clientX < bar.right + SATELLITE_ROOM + 24;
      if (left || right) {
        cancelRevealHide();
        setRevealLeft(left);
        setRevealRight(right);
      } else {
        // moving about the window, away from the places the buttons come from
        scheduleRevealHide();
      }
    },
    [revealMode, cancelRevealHide, scheduleRevealHide],
  );

  const handleLeave = useCallback(() => {
    mouseAxis.set(Infinity);
    if (revealMode) scheduleRevealHide();
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
      playCue("launch");
      onLaunch(item, target);
    },
    [onLaunch, menu],
  );

  const openPreview = useCallback(
    (item: DockItemView, target: HTMLElement) => {
      if (!draggingRef.current) menu.open("windows", item, anchorFor(target));
    },
    [menu],
  );

  const iconProps = {
    mouseAxis,
    iconSize,
    magnify: magnification,
    magScale: magnificationScale,
    vertical,
    edge,
    dragging,
    onLaunch: launchGuarded,
    onContext: openMenu,
    onHoverPreview: openPreview,
  };

  // ---- dragging apps on and off the dock ----
  // Pull a pinned app clear of the dock and let go: it is unpinned. Drag a
  // running app that is not pinned onto the pinned side of the divider: it is
  // pinned there. Anything else is just a reorder within its own group.

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

  /** Where, among the pinned apps, a drop at this point would put a new one. */
  const pinnedIndexAt = (p: { x: number; y: number }): number => {
    const section = barRef.current?.querySelectorAll(".dock-section")[0];
    if (!section) return 0;
    let before = 0;
    for (const child of Array.from(section.children)) {
      const r = child.getBoundingClientRect();
      const centre = vertical ? r.top + r.height / 2 : r.left + r.width / 2;
      if ((vertical ? p.y : p.x) > centre) before++;
    }
    return before;
  };

  /** Whether a point is on the pinned side of the divider and still at the
   *  bar, rather than off somewhere else. */
  const onPinnedSide = (p: { x: number; y: number }): boolean => {
    const bar = barRef.current?.getBoundingClientRect();
    const divider = barRef.current?.querySelector(".dock-divider")?.getBoundingClientRect();
    if (!bar || !divider) return false;
    const atBar =
      p.x > bar.left - PULL_OFF &&
      p.x < bar.right + PULL_OFF &&
      p.y > bar.top - PULL_OFF &&
      p.y < bar.bottom + PULL_OFF;
    return atBar && (vertical ? p.y < divider.top : p.x < divider.left);
  };

  /** Act on a drop. True if it pinned or unpinned something, in which case
   *  the group's order does not need saving. */
  const dropOnDock = (
    item: DockItemView,
    kind: "pinned" | "running",
    p: { x: number; y: number },
  ): boolean => {
    if (kind === "pinned") {
      if (!pulledOff(p)) return false;
      ipc.unpinItem(item.id).catch(notify.on(`Could not remove ${item.name}`));
      // a small puff where it was let go
      effectsBus.emit("burst", {
        x: p.x,
        y: p.y,
        winW: window.innerWidth,
        winH: window.innerHeight,
      });
      return true;
    }
    if (!onPinnedSide(p)) return false;
    pinRunningItem(item, pinnedIndexAt(p)).catch(notify.on(`Could not pin ${item.name}`));
    return true;
  };

  /** One icon in a draggable group; `save` persists the group's new order. */
  const draggableItem = (
    item: DockItemView,
    index: number,
    kind: "pinned" | "running",
    save: () => Promise<unknown>,
  ) => (
    <Reorder.Item
      as="div"
      key={item.id}
      value={item.id}
      /* Free in both directions, not only along the dock, so an icon can be
         pulled off it. Reordering still only looks at the dock's own axis. */
      drag
      /* Only the siblings animate. Momentum and elasticity both
         make the dragged tile trail the cursor, which is what
         read as lag, so the tile itself tracks 1:1. */
      transition={springs.reorder}
      dragMomentum={false}
      dragElastic={0.04}
      whileDrag={{ zIndex: 30 }}
      onDragStart={() => {
        draggingRef.current = true;
        setDragging(true);
        mouseAxis.set(Infinity);
      }}
      onDrag={(_, info) => {
        // tell the user what letting go here would do
        setPullOut(kind === "pinned" && pulledOff(info.point) ? info.point : null);
      }}
      onDragEnd={(_, info) => {
        setPullOut(null);
        if (!dropOnDock(item, kind, info.point)) {
          save().catch(notify.on("Could not save the new order"));
        }
        setDragging(false);
        // let the trailing click event pass before re-enabling launch
        setTimeout(() => {
          draggingRef.current = false;
        }, 50);
      }}
    >
      <DockIcon item={item} index={index} {...iconProps} />
    </Reorder.Item>
  );

  return (
    <div
      ref={viewportRef}
      className="dock-viewport"
      role="toolbar"
      aria-label="Dock"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      data-kbd={kbd}
      onKeyDown={onKeyDown}
      data-edge={edge}
      data-asleep={asleep || slidAway}
      // which appearing animation, and whether the dock is in or out: the
      // cascade's icons are timed from these (see dock.css)
      data-anim={animations.dockReveal}
      data-reveal={hidden ? "out" : "in"}
      onMouseEnter={() => setPointerInside(true)}
      onMouseLeave={() => {
        setPointerInside(false);
        // a button budded from the room beside the bar (see handleOutside) is not put away by
        // the bar's own leave, which the pointer never made
        if (revealMode) scheduleRevealHide();
      }}
      onMouseMove={handleOutside}
    >
      <div className="dock-shell">
      <motion.div
        ref={barRef}
        className="dock-bar glass glass-open"
        data-vertical={vertical}
        style={{ transformOrigin: reveal.origin }}
        // it arrives when the dock first appears, and comes and goes with
        // auto-hide, in the way chosen under Settings > Animations
        initial={reveal.initial}
        animate={hidden ? reveal.hidden : reveal.shown}
        onMouseMove={handleMove}
        onPointerMove={pointerLight}
        onMouseLeave={handleLeave}
      >
        {/* the bar can't clip itself (tooltips float above it), so the
            ambient sweep gets its own clipping layer */}
        <BackdropLayer active={realBlur && !slidAway} interval={asleep ? 1500 : 220} margin={56} />
        <span className="glass-sweep" aria-hidden />
        <ModeSwitcher settings={settings} edge={edge} />
        {!revealMode && settings.dock.showSearchButton && (
          <SearchButton onClick={() => ipc.toggleStart().catch(notify.on("Could not open the Start menu"))} />
        )}
        <Reorder.Group
          as="div"
          className="dock-section"
          axis={vertical ? "y" : "x"}
          values={order}
          onReorder={setOrder}
        >
          {orderedPinned.map((item, i) =>
            draggableItem(item, i, "pinned", () => ipc.reorderPinned(order)),
          )}
        </Reorder.Group>
        {runningItems.length > 0 && <span className="dock-divider" aria-hidden />}
        {runningItems.length > 0 && (
          <Reorder.Group
            as="div"
            className="dock-section"
            axis={vertical ? "y" : "x"}
            values={runOrder}
            onReorder={setRunOrder}
          >
            {orderedRunning.map((item, i) =>
              draggableItem(item, orderedPinned.length + i, "running", () =>
                ipc.reorderRunning(runOrder),
              ),
            )}
          </Reorder.Group>
        )}
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
        >
          <AnimatePresence>
            {settings.dock.showSearchButton && revealLeft && (
              <DockSatellite
                key="search"
                side="left"
                onHover={(over) => (over ? cancelRevealHide() : scheduleRevealHide())}
              >
                <SearchButton onClick={() => ipc.toggleStart().catch(notify.on("Could not open the Start menu"))} />
              </DockSatellite>
            )}
          </AnimatePresence>
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
      <FolderFlyout edge={edge} />
      <StackFlyout edge={edge} />
      <WindowsFlyout edge={edge} />
      <Toasts edge={edge} />
      <AnimatePresence>{welcomeOpen && <Welcome edge={edge} />}</AnimatePresence>
    </div>
  );
}
