/**
 * The frame's fringe: the thin anti-aliased edge along the four rounded corners.
 *
 * A maximised app is given rounded corners by shaping its own window (see
 * platform/windows/shaper.rs), and a window shape is stepped: a pixel is in or
 * out. This window is kept on top and Rust clips it to a band a few pixels wide
 * along each arc, just inside that cut. What is drawn here is the margin's
 * colour outside the ideal curve, smoothly edged, so over the stepped edge it
 * blends into the app a pixel at a time instead of leaving a staircase.
 *
 * Only a few pixels of the app's own edge are ever covered, so the colour only
 * has to be near: the margin's tint over the wallpaper's dominant colour. It is
 * shown only while the app on top is one that has been shaped.
 */

import { useEffect, useState } from "react";
import { applyAppearance } from "../../engine/themes/applyTheme";
import { ipc } from "../../ipc/commands";
import { useSettings } from "../../state/settingsStore";
import { fitShape, ringPath } from "./frameGeometry";
import { useWindowSize } from "./FrameApp";
import "./frame.css";

/** Used until the wallpaper's colour is known, or if it cannot be read. */
const FALLBACK_WALLPAPER = "#1b2236";

export function FrameCornersApp() {
  const { settings, hydrate } = useSettings();
  const { w, h } = useWindowSize();
  const [wallpaper, setWallpaper] = useState(FALLBACK_WALLPAPER);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (settings) applyAppearance(settings, null, "dock");
  }, [settings]);

  // the wallpaper's own colour is what the margin shows through to
  useEffect(() => {
    ipc
      .getWallpaperAccent()
      .then((hex) => hex && setWallpaper(hex))
      .catch(() => undefined);
  }, []);

  if (!settings) return null;
  const f = settings.frame;
  const shape = fitShape(w, h, f.padding, f.cornerRadius);

  return (
    <div
      className="frame-root frame-corners"
      style={
        {
          ["--frame-tint" as string]: f.tint * settings.menuBar.tint,
          ["--frame-wallpaper" as string]: wallpaper,
        } as React.CSSProperties
      }
    >
      <svg className="frame-body" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
        <path className="frame-solid" d={ringPath(shape)} fillRule="evenodd" />
      </svg>
    </div>
  );
}
