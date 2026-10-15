/**
 * The frame's ring: the margin of glass round the free space of a monitor.
 *
 * This is a window of its own, as large as the free space, kept behind every
 * ordinary window, with Rust clipping it to the margin so the opening in the
 * middle neither draws nor takes clicks (see commands/frame.rs). What is drawn
 * here is the glass: the theme's colour as a flat translucent body, exactly the
 * menu bar's, and the ambient scene in the four bands of the margin, as in the
 * menu bar. The pieces laid over a maximised app's corners are drawn natively
 * (platform/windows/corners.rs); this page tells them what colour its glass is.
 */

import { useEffect, useRef, useState } from "react";
import { applyAppearance } from "../../engine/themes/applyTheme";
import { ipc } from "../../ipc/commands";
import { useSettings } from "../../state/settingsStore";
import { StripScene } from "../menubar/BarScene";
import { fitShape, openingPath, ringPath } from "./frameGeometry";
import "./frame.css";

/** The size of the window, which Rust sets to the free space. */
export function useWindowSize() {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const onResize = () =>
      setSize((was) => (was.w === window.innerWidth && was.h === window.innerHeight ? was : { w: window.innerWidth, h: window.innerHeight }));
    window.addEventListener("resize", onResize);
    // and once more now: the window is made small and then sized to the screen, and a resize between the first render
    // and this listener would be missed, leaving the border drawn for the old size (its right and bottom edges lost)
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

/** The glass border's light: lit from above, so the top edge of the bevel catches the light, the middle lets go of
 *  it, and the bottom takes a little back as light from the glass itself. Across the whole window, so the corner
 *  window, which is the same size and place, draws the same light where it continues the border round the curve. */
export function BevelGradient({ h }: { h: number }) {
  return (
    <linearGradient id="frame-bevel" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={h}>
      <stop offset="0" stopColor="#fff" stopOpacity="0.78" />
      <stop offset="0.2" stopColor="#fff" stopOpacity="0.3" />
      <stop offset="0.55" stopColor="#fff" stopOpacity="0.1" />
      <stop offset="0.88" stopColor="#fff" stopOpacity="0.17" />
      <stop offset="1" stopColor="#fff" stopOpacity="0.36" />
    </linearGradient>
  );
}

export function FrameApp() {
  const { settings, hydrate } = useSettings();
  const { w, h } = useWindowSize();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // the same colours and material as the dock
  useEffect(() => {
    if (settings) applyAppearance(settings, null, "dock");
  }, [settings]);

  // the corner pieces lay this same glass over the wallpaper, so they are told what it is: what the stylesheet makes
  // of the theme's colour and the tint, as drawn (Rust ignores a repeat)
  const glass = useRef<SVGPathElement>(null);
  useEffect(() => {
    const fill = glass.current && getComputedStyle(glass.current).fill;
    if (fill) ipc.reportFrameGlass(fill).catch(() => undefined);
  });

  if (!settings) return null;
  const f = settings.frame;
  const shape = fitShape(w, h, f.padding, f.cornerRadius);
  const { pad } = shape;
  // the glass border: as wide as asked for, but never past the screen edge or out of the margin
  const edge = f.glassBorder && pad > 1 ? Math.min(f.borderWidth, pad - 1) : 0;
  const outer = { ...shape, pad: pad - edge, radius: shape.radius + edge };

  return (
    <div
      className="frame-root"
      style={{ ["--frame-tint" as string]: f.tint * settings.menuBar.tint } as React.CSSProperties}
    >
      {/* flat, as the menu bar's body is: the same colour at the same strength,
          so the two read as one material */}
      <svg className="frame-body" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
        <path ref={glass} className="frame-glass" d={ringPath(shape)} fillRule="evenodd" />
        {edge > 0 && (
          <>
            <defs>
              <BevelGradient h={h} />
            </defs>
            {/* the bevel itself: a band of the margin along the opening */}
            <path
              className="frame-bevel"
              d={`${openingPath(outer)}${openingPath(shape)}`}
              fillRule="evenodd"
            />
            {/* a bright hairline on its outer edge, and a dark one where the apps begin */}
            <path className="frame-bevel-lit" d={openingPath(outer)} />
            <path className="frame-bevel-edge" d={openingPath(shape)} />
          </>
        )}
      </svg>

      {f.ambient && pad > 0 && (
        <>
          <StripScene settings={settings} width={w} height={pad} className="frame-strip" style={{ left: 0, top: 0 }} />
          <StripScene settings={settings} width={w} height={pad} className="frame-strip" style={{ left: 0, top: h - pad }} />
          <StripScene settings={settings} width={pad} height={Math.max(1, h - 2 * pad)} className="frame-strip" style={{ left: 0, top: pad }} />
          <StripScene settings={settings} width={pad} height={Math.max(1, h - 2 * pad)} className="frame-strip" style={{ left: w - pad, top: pad }} />
        </>
      )}
    </div>
  );
}
