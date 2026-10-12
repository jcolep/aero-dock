import { MotionConfig } from "motion/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { DockApp } from "./app/DockApp";
import { useReduced } from "./engine/accessibility/policy";
import { DesktopWidgets } from "./features/desktop/DesktopWidgets";
import { FrameApp } from "./features/frame/FrameApp";
import { FrameCornersApp } from "./features/frame/FrameCornersApp";
import { MenuBarApp } from "./features/menubar/MenuBarApp";
import { MissionApp } from "./features/mission/MissionApp";
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

function Root() {
  if (isSettings) return <SettingsApp />;
  if (isWidgets) return <DesktopWidgets />;
  if (isMenuBar) return <MenuBarApp />;
  if (isFrame) return <FrameApp />;
  if (isFrameCorners) return <FrameCornersApp />;
  if (isMission) return <MissionApp />;
  if (isStart) return <StartApp />;
  return <DockApp />;
}

/** With motion to be kept down, the animation library moves things at once and
 *  only fades them, which is what its reduced-motion mode does. */
function Policy() {
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
