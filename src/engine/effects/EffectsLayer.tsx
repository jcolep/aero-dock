/**
 * The dock's effects layer: one transparent canvas over the part of the window
 * the dock lives in, pointer-events none. It listens to the effects bus and
 * draws ripples and launch bursts, and keeps the ambient scene (dust, rain,
 * snow, bubbles, aurora) running in the dock band.
 *
 * Performance contract: with nothing to draw, nothing is scheduled. The
 * ambient scene runs only while the dock is awake and showing, and it fades
 * out rather than freezing when the dock goes idle. See `fx2d.ts` for how
 * frames are paced.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { dockBandSize } from "../../features/dock/geometry";
import type { DockEdge, Settings } from "../../ipc/types";
import { useAmbient } from "../../state/ambientStore";
import { ambientTint } from "../themes/applyTheme";
import { effectsBus } from "./effectsBus";
import {
  bandBox,
  createScene,
  EdgeHalo,
  Fx2D,
  isSceneKind,
  LaunchBurst,
  LightBloom,
  PressDimple,
  ShineSweep,
  tuneOf,
} from "./fx2d";

/** Where the dock is glued; effect coordinates anchor there so they
 * survive the window growing/shrinking for flyouts. */
function anchorPoint(edge: DockEdge, w: number, h: number): { x: number; y: number } {
  switch (edge) {
    case "bottom":
      return { x: w / 2, y: h };
    case "top":
      return { x: w / 2, y: 0 };
    case "left":
      return { x: 0, y: h / 2 };
    case "right":
      return { x: w, y: h / 2 };
  }
}

/** Room, beyond the dock band, for a launch burst to fly up into. */
const BURST_ROOM = 120;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface EffectsLayerProps {
  settings: Settings;
  /** The wallpaper's color, when the dock is tinted from it. */
  wallpaperAccent: string | null;
}

export function EffectsLayer({ settings, wallpaperAccent }: EffectsLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Fx2D | null>(null);

  const edge = settings.dock.edge;
  const density = settings.appearance.particleDensity;
  const sceneKind = settings.appearance.scene;
  const speed = settings.appearance.animationSpeed;
  const bloom = settings.appearance.bloomAmount;
  const band = dockBandSize(settings.dock);
  // only the color settings change it, and this renders on every running-app
  // update, so it is not worked out afresh each time
  const { accent, theme, wallpaperSync } = settings.appearance;
  const tint = useMemo(
    () => ambientTint(settings, wallpaperAccent),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accent, theme, wallpaperSync, wallpaperAccent],
  );

  // dust sleeps with the rest of the ambient motion, and rests entirely while
  // the dock is slid away
  const asleep = useAmbient((s) => s.asleep);
  const dockHidden = useAmbient((s) => s.dockHidden);

  // The window is much taller than the dock (it has to hold the tallest
  // flyout), with the dock at one edge of it. The canvas covers only the part
  // that effects can reach: the dock band and room above it for a burst. It
  // is redrawn when the window changes size, which it does right after launch.
  const [viewport, setViewport] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));
  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const vertical = edge === "left" || edge === "right";
  // whole pixels, so the canvas's store and its box agree to the last row
  const reach = Math.ceil(band + BURST_ROOM);
  const box: Box = vertical
    ? {
        w: Math.min(reach, viewport.w),
        h: viewport.h,
        x: edge === "right" ? viewport.w - Math.min(reach, viewport.w) : 0,
        y: 0,
      }
    : {
        w: viewport.w,
        h: Math.min(reach, viewport.h),
        x: 0,
        y: edge === "bottom" ? viewport.h - Math.min(reach, viewport.h) : 0,
      };

  // the latest of everything the event handlers need, without resubscribing
  const clickEffect = settings.animations.click;
  const clickTune = settings.animations.clickTune;
  const live = useRef({ edge, viewport, box, tint, bloom, clickEffect, clickTune });
  live.current = { edge, viewport, box, tint, bloom, clickEffect, clickTune };

  // ---- the engine: once ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new Fx2D(canvas);
    engineRef.current = engine;

    /** Window coordinates at emit time, onto the canvas now. The dock window
     *  can change size between the two, so the point is kept relative to the
     *  dock's own edge. */
    const place = (x: number, y: number, winW: number, winH: number) => {
      const l = live.current;
      const then = anchorPoint(l.edge, winW, winH);
      const now = anchorPoint(l.edge, l.viewport.w, l.viewport.h);
      return {
        x: now.x + (x - then.x) - l.box.x,
        y: now.y + (y - then.y) - l.box.y,
      };
    };

    const offRipple = effectsBus.on("ripple", ({ winW, winH, track, iconSource, clickX, clickY }) => {
      const toCanvas = (wx: number, wy: number) => place(wx, wy, winW, winH);
      const tunes = live.current.clickTune;
      switch (live.current.clickEffect) {
        case "halo":
          engine.spawn(new EdgeHalo(track, toCanvas, iconSource, tuneOf(tunes?.halo)));
          return;
        case "shine":
          engine.spawn(new ShineSweep(track, toCanvas, iconSource, tuneOf(tunes?.shine)));
          return;
        case "dimple":
          engine.spawn(new PressDimple(track, toCanvas, iconSource, clickX, clickY, tuneOf(tunes?.dimple)));
          return;
        case "bloom":
        default:
          engine.spawn(new LightBloom(track, toCanvas, iconSource, live.current.tint, live.current.bloom, tuneOf(tunes?.bloom)));
      }
    });
    const offBurst = effectsBus.on("burst", ({ x, y, winW, winH }) => {
      const p = place(x, y, winW, winH);
      engine.spawn(new LaunchBurst(p.x, p.y, live.current.tint, live.current.bloom));
    });
    const onVisibility = () => engine.setHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();

    return () => {
      offRipple();
      offBurst();
      document.removeEventListener("visibilitychange", onVisibility);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // live tuning, without rebuilding anything
  useEffect(() => {
    engineRef.current?.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    engineRef.current?.resize(box.w, box.h);
  }, [box.w, box.h]);

  // ---- the ambient scene ----
  // It lives in the dock band, pinned to the dock's edge. Rebuilt when the
  // scene, its density, its color, or the band changes.
  const awake = !asleep && !dockHidden;
  const awakeRef = useRef(awake);
  awakeRef.current = awake;
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (density <= 0 || !isSceneKind(sceneKind)) {
      engine.setScene(null, false);
      return;
    }
    const bandW = vertical ? Math.min(band, box.w) : box.w;
    const bandH = vertical ? box.h : Math.min(band, box.h);
    const x = edge === "right" ? box.w - bandW : 0;
    const y = edge === "bottom" ? box.h - bandH : 0;
    engine.setScene(createScene(sceneKind, tint, density, bandBox(x, y, bandW, bandH)), awakeRef.current);
    // `box` is read for its size only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneKind, density, tint, edge, vertical, band, box.w, box.h]);

  useEffect(() => {
    engineRef.current?.setSceneAwake(awake);
  }, [awake]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}
