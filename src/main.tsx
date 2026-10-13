import { MotionConfig } from "motion/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { DockApp } from "./app/DockApp";
import { useEffect, useRef } from "react";
import { useReduced } from "./engine/accessibility/policy";
import { accentForTheme, normalizeHex } from "./engine/themes/accent";
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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Policy />
  </React.StrictMode>,
);
