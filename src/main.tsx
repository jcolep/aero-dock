import { MotionConfig } from "motion/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { DockApp } from "./app/DockApp";
import { useEffect, useRef } from "react";
import { useReduced } from "./engine/accessibility/policy";
import { accentForTheme, normalizeHex } from "./engine/themes/accent";
import { trackScale } from "./engine/themes/scale";
import { useDockIcons } from "./state/dockStore";
import { useSettings } from "./state/settingsStore";
import { DesktopWidgets } from "./features/desktop/DesktopWidgets";
import { FrameApp } from "./features/frame/FrameApp";
import { FrameCornersApp } from "./features/frame/FrameCornersApp";
import { MenuBarApp } from "./features/menubar/MenuBarApp";
import { MissionApp } from "./features/mission/MissionApp";
import { PerfApp } from "./features/perf/PerfApp";
import { useFrameMeter } from "./engine/perf/useFrameMeter";
import { SettingsApp } from "./features/settings/SettingsApp";
import { StartApp } from "./features/start/StartApp";
import "./styles/global.css";

// One bundle, several windows, told apart by ?window=. The dock is the
// default because it is the one that always exists.
const requested = new URLSearchParams(window.location.search).get("window");
const isSettings = requested === "settings" || window.location.hash.startsWith("#/settings");
const isWidgets = requested === "widgets";
const isMenuBar = requested === "menubar";
const isFrame = requested === "frame";
const isFrameCorners = requested === "framecorners";
const isMission = requested === "mission";
const isStart = requested === "start";
const isPerf = requested === "perf";

function Root() {
  if (isSettings) return <SettingsApp />;
  if (isWidgets) return <DesktopWidgets />;
  if (isMenuBar) return <MenuBarApp />;
  if (isFrame) return <FrameApp />;
  if (isFrameCorners) return <FrameCornersApp />;
  if (isMission) return <MissionApp />;
  if (isStart) return <StartApp />;
  if (isPerf) return <PerfApp />;
  return <DockApp />;
}

/** With motion to be kept down, the animation library moves things at once and
 *  only fades them, which is what its reduced-motion mode does. */
/** Icons are made in the look chosen (and, for the tinted one, in the theme's colour), so a
 *  change of either throws away what has been fetched, and what shows them asks again. */
function useIconLook() {
  const look = useSettings((s) => {
    const a = s.settings?.appearance;
    if (!a) return null;
    return a.iconStyle === "tinted" ? `tinted:${normalizeHex(a.accent) ?? accentForTheme(a.theme)}` : a.iconStyle;
  });
  const before = useRef<string | null>(null);
  useEffect(() => {
    if (look !== null && before.current !== null && look !== before.current) useDockIcons.getState().reset();
    before.current = look;
  }, [look]);
}

function Policy() {
  useIconLook();
  // how smoothly this window draws, for the table of frame timings (only while that is on)
  useFrameMeter();
  const reduced = useReduced();
  return (
    <MotionConfig reducedMotion={reduced.motion ? "always" : "never"}>
      <Root />
    </MotionConfig>
  );
}

trackScale();

// the settings window is in the look it had last time from its first frame, and not the sky for a moment before its settings arrive
if (isSettings) {
  let look = "night";
  try {
    look = localStorage.getItem("aero-settings-look") === "sky" ? "sky" : "night";
  } catch {
    /* the night look */
  }
  document.documentElement.dataset.look = look;
  if (look === "night") document.documentElement.dataset.surface = "clear";
}

// No rough first frame: the page is clear until the typeface is in (it would otherwise show a moment of another face and
// then jump), and fades in. A window that is hidden when it loads (Start, the overview) is ready before it is shown, since
// this does not wait for a frame. If the font never comes, the page shows anyway after a second.
{
  const show = () => document.documentElement.setAttribute("data-ready", "");
  const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
  const limit = window.setTimeout(show, 1000);
  (fonts ? fonts.ready : Promise.resolve()).then(() => {
    window.clearTimeout(limit);
    window.setTimeout(show, 0);
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Policy />
  </React.StrictMode>,
);
