/**
 * The frame's ring: the margin of glass round the free space of a monitor.
 *
 * This is a window of its own, as large as the free space, kept behind every
 * ordinary window, with Rust clipping it to the margin so the opening in the
 * middle neither draws nor takes clicks (see commands/frame.rs). What is drawn
 * here is the glass: the theme's colour as a flat translucent body, exactly the
 * menu bar's, and the ambient scene in the four bands of the margin, as in the
 * menu bar. The thin fringe that smooths a shaped app's corners is the other
 * page, FrameCornersApp.
 */

import { useEffect, useState } from "react";
import { applyAppearance } from "../../engine/themes/applyTheme";
import { useSettings } from "../../state/settingsStore";
import { StripScene } from "../menubar/BarScene";
import { fitShape, ringPath } from "./frameGeometry";
import "./frame.css";

/** The size of the window, which Rust sets to the free space. */
export function useWindowSize() {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
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

  if (!settings) return null;
  const f = settings.frame;
  const shape = fitShape(w, h, f.padding, f.cornerRadius);
  const { pad } = shape;

  return (
    <div
      className="frame-root"
      style={{ ["--frame-tint" as string]: f.tint * settings.menuBar.tint } as React.CSSProperties}
    >
      {/* flat, as the menu bar's body is: the same colour at the same strength,
          so the two read as one material */}
      <svg className="frame-body" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
        <path className="frame-glass" d={ringPath(shape)} fillRule="evenodd" />
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
