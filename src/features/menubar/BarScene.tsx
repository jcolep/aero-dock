/**
 * The ambient scene inside a strip of glass: the same dust, rain, snow, bubbles
 * or aurora the dock plays, drawn on a canvas exactly the size of the strip and
 * clipped to it, so nothing ever drifts out. The menu bar's strip is one, and
 * each of the four bands of the frame round the screen is another.
 *
 * It rests (fades out and stops scheduling frames) while nobody is at the
 * machine, and entirely while the page is not showing.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { createScene, Fx2D, isSceneKind, lighten, stripBox } from "../../engine/effects/fx2d";
import { ambientTint } from "../../engine/themes/applyTheme";
import type { Settings } from "../../ipc/types";
import { useUserIdle } from "../../state/idleStore";

interface StripSceneProps {
  settings: Settings;
  width: number;
  height: number;
  className?: string;
  /** Where it goes, for a strip that is not at the corner of its parent. */
  style?: React.CSSProperties;
}

/** A scene on a canvas of the given size. */
export function StripScene({ settings, width, height, className = "mb-fx", style }: StripSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Fx2D | null>(null);
  const idle = useUserIdle((s) => s.idle);

  const kind = settings.appearance.scene;
  const density = settings.appearance.particleDensity;
  const speed = settings.appearance.animationSpeed;
  // The strip's body is the theme's colour, so specks in that colour would be
  // lost against it. They are drawn lighter, the way light looks on glass.
  const { accent, theme } = settings.appearance;
  const tint = useMemo(
    () => lighten(ambientTint(settings, null), 0.6),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accent, theme],
  );

  // ---- the engine: once ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new Fx2D(canvas);
    // A strip lives in a window that is the width of a screen. Each frame drawn there is that whole window to put
    // together and hand to Windows, which is where the cost is, not in the few motes: twelve a second is as smooth as
    // dust drifting a few pixels a second needs to be, and costs half of twenty-four.
    engine.setFrameFloor(1000 / 12);
    engineRef.current = engine;
    const onVisibility = () => engine.setHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    engineRef.current?.resize(width, height);
  }, [width, height]);

  // ---- the scene ----
  const idleRef = useRef(idle);
  idleRef.current = idle;
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (density <= 0 || !isSceneKind(kind)) {
      engine.setScene(null, false);
      return;
    }
    engine.setScene(createScene(kind, tint, density, stripBox(0, 0, width, height)), !idleRef.current);
  }, [kind, density, tint, width, height]);

  useEffect(() => {
    engineRef.current?.setSceneAwake(!idle);
  }, [idle]);

  return <canvas ref={canvasRef} className={className} aria-hidden style={{ ...style, width, height }} />;
}

/** The menu bar's scene: as wide as the bar, as tall as it is. */
export function BarScene({ settings }: { settings: Settings }) {
  // the bar runs the width of the window, less the gap kept at either side
  const gap = settings.menuBar.gap;
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const width = Math.max(1, windowWidth - gap * 2);
  return <StripScene settings={settings} width={width} height={settings.menuBar.height} />;
}
