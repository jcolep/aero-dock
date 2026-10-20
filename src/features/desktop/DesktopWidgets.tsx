/**
 * The widget overlay: one transparent window across the whole desktop,
 * with every widget positioned inside it.
 *
 * One window rather than one per widget, because a second webview costs
 * roughly what the dock costs in memory, and five would undo the work in
 * 1.2.1. The cost of sharing is that the window covers the whole screen,
 * so it has to be told which parts of itself are real: the hit region is
 * the union of the widget rectangles, and everything else passes straight
 * through to the desktop.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { applyAppearance } from "../../engine/themes/applyTheme";
import { ipc } from "../../ipc/commands";
import type { HitRect, WidgetInstance } from "../../ipc/types";
import { useSettings } from "../../state/settingsStore";
import { opt } from "./kit";
import type { Guides, SnapConfig } from "./snap";
import { WIDGET_RADIUS, WidgetFrame } from "./WidgetFrame";
import "./desktop.css";

/** Editing chrome (resize grips) shows while the cursor is over a widget. */
function useHover(): [boolean, (v: boolean) => void] {
  const [hover, setHover] = useState(false);
  return [hover, setHover];
}

export function DesktopWidgets() {
  const { settings, hydrate } = useSettings();
  const [hover, setHover] = useHover();
  const dragging = useRef(false);
  // whether one is held (for the grid) and the lines it has lined up to
  const [holding, setHolding] = useState(false);
  const [guides, setGuides] = useState<Guides | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // The overlay carries no material of its own; each widget picks one. It
  // still needs the theme tokens, so it borrows the dock's appearance.
  useEffect(() => {
    if (settings) applyAppearance(settings, null, "dock");
  }, [settings]);

  const stored = useMemo(() => settings?.widgets.widgets ?? [], [settings]);

  /** Live geometry during a drag, before anything is persisted. */
  const [draft, setDraft] = useState<Record<string, Partial<WidgetInstance>>>({});
  const widgets = useMemo(
    () => stored.map((w) => ({ ...w, ...(draft[w.id] ?? {}) })),
    [stored, draft],
  );

  // A settled drag has nothing left to override, and leaving stale entries
  // would pin a widget to where it was dropped even after a later edit.
  useEffect(() => {
    setDraft((d) => (Object.keys(d).length === 0 ? d : {}));
  }, [stored]);

  const onGeometry = useCallback(
    (id: string, x: number, y: number, width: number, height: number) => {
      setDraft((d) => ({ ...d, [id]: { x, y, width, height } }));
    },
    [],
  );

  /** Tell Windows which parts of the overlay are solid. */
  const syncRegion = useCallback((list: WidgetInstance[]) => {
    const dpr = window.devicePixelRatio || 1;
    const rects: HitRect[] = list.map((w) => ({
      x: Math.round(w.x * dpr),
      y: Math.round(w.y * dpr),
      width: Math.round(w.width * dpr),
      height: Math.round(w.height * dpr),
      radius: Math.round(opt(w, "radius", WIDGET_RADIUS) * dpr),
    }));
    ipc.setWidgetHitRects(rects).catch((e) => console.warn("hit region failed", e));
  }, []);

  useEffect(() => {
    if (dragging.current) return;
    syncRegion(widgets);
  }, [widgets, syncRegion]);

  // Listeners below outlive the render that created them, so they read the
  // geometry from here rather than closing over a stale copy.
  const latest = useRef<WidgetInstance[]>([]);
  useEffect(() => {
    latest.current = widgets;
  }, [widgets]);

  // A drag opens the whole overlay to input, and only the release puts the
  // region back. If that release never arrives, because focus moved or the
  // pointer capture was lost, the overlay would keep swallowing every click
  // on the desktop. These put it back whatever happened to the pointer.
  useEffect(() => {
    const release = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setHolding(false);
      setGuides(null);
      syncRegion(latest.current);
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
    };
  }, [syncRegion]);

  // The region is in physical pixels measured against this window, so it
  // goes stale the moment the desktop changes shape: parts of the screen
  // stop taking clicks while the overlay claims space no widget is in.
  // Nothing in the page notices a resolution change on its own, so the
  // screen is checked now and then. Reading three numbers costs nothing and
  // the call only goes out when they actually differ.
  useEffect(() => {
    const resync = () => {
      if (dragging.current) return;
      syncRegion(latest.current);
    };
    window.addEventListener("resize", resync);
    let seen = `${screen.width}x${screen.height}@${window.devicePixelRatio}`;
    const watch = window.setInterval(() => {
      const now = `${screen.width}x${screen.height}@${window.devicePixelRatio}`;
      if (now === seen) return;
      seen = now;
      resync();
    }, 4000);
    return () => {
      window.removeEventListener("resize", resync);
      window.clearInterval(watch);
    };
  }, [syncRegion]);

  const onDragState = useCallback(
    (isDragging: boolean) => {
      dragging.current = isDragging;
      setHolding(isDragging);
      if (isDragging) {
        // open the whole window up so the pointer cannot escape the region
        ipc.setWidgetDragMode(true).catch(() => undefined);
      } else {
        syncRegion(widgets);
      }
    },
    [widgets, syncRegion],
  );

  const w = settings?.widgets;
  const snap: SnapConfig = useMemo(
    () => ({ enabled: w?.snapEnabled ?? false, grid: w?.snapGrid ?? true, size: w?.snapSize ?? 40, align: w?.snapAlign ?? true, threshold: w?.snapThreshold ?? 10, margin: w?.snapMargin ?? 20, resize: w?.snapResize ?? true }),
    [w?.snapEnabled, w?.snapGrid, w?.snapSize, w?.snapAlign, w?.snapThreshold, w?.snapMargin, w?.snapResize],
  );
  // the others, as they are now (read when a move is made, not when this was rendered)
  const others = useCallback((id: string) => latest.current.filter((x) => x.id !== id).map((x) => ({ x: x.x, y: x.y, w: x.width, h: x.height })), []);

  if (!settings) return null;

  return (
    <div
      className="aero-desktop"
      onPointerOver={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      {holding && snap.enabled && snap.grid && w?.snapShowGrid && (
        <div className="aero-grid" style={{ backgroundSize: `${snap.size}px ${snap.size}px` }} aria-hidden />
      )}
      {holding && guides?.v.map((x) => <i key={`v${x}`} className="aero-guide aero-guide-v" style={{ left: x }} aria-hidden />)}
      {holding && guides?.h.map((y) => <i key={`h${y}`} className="aero-guide aero-guide-h" style={{ top: y }} aria-hidden />)}
      {widgets.map((widget) => (
        <WidgetFrame
          key={widget.id}
          widget={widget}
          allowNetwork={settings.widgets.allowWeatherNetwork}
          editing={hover}
          onGeometry={onGeometry}
          onDragState={onDragState}
          snap={snap}
          others={others}
          onGuides={setGuides}
        />
      ))}
    </div>
  );
}
