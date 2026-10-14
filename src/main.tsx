import React, { lazy, Suspense, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { accentForTheme, normalizeHex } from "./engine/themes/accent";
import { trackScale } from "./engine/themes/scale";
import { useDockIcons } from "./state/dockStore";
import { useSettings } from "./state/settingsStore";
import { useFrameMeter } from "./engine/perf/useFrameMeter";
// Every stylesheet, here and in this order: the order the windows were always styled in, when they were one bundle. The
// code is split by window, the styles are not: some windows lean on rules that live in another's stylesheet (the dock's
// clock takes its figures from the menu bar's, the settings window's previews are the menu bar's own), and one sheet in
// one order keeps every window exactly as it was. `scripts/cssorder.mjs` lists the order from an older main.tsx.
import "./engine/tooltip/tooltip.css";
import "./features/feedback/toasts.css";
import "./features/onboarding/welcome.css";
import "./engine/type/roll.css";
import "./engine/lens/glide.css";
import "./features/widgets/widgets.css";
import "./features/dock/contextmenu.css";
import "./features/dock/modes.css";
import "./features/dock/folderflyout.css";
import "./features/dock/windowsflyout.css";
import "./features/dock/dock.css";
import "./features/desktop/desktop.css";
import "./features/frame/frame.css";
import "./features/menubar/media.css";
import "./features/menubar/island.css";
import "./features/menubar/menubar.css";
import "./features/mission/mission.css";
import "./features/perf/perf.css";
import "./features/settings/colorspectrum.css";
import "./features/settings/bubblecolor.css";
import "./features/start/start.css";
import "./features/settings/animations.css";
import "./features/settings/settings.css";
import "./styles/global.css";

// Several windows, told apart by ?window=, each loading only its own app: a window is a renderer process of its own,
// and the frame's corners have no use for the settings window's code (or its stylesheet). The dock is the default
// because it is the one that always exists.
const requested = new URLSearchParams(window.location.search).get("window");
const isSettings = requested === "settings" || window.location.hash.startsWith("#/settings");

type Loaded = Promise<{ default: React.ComponentType }>;

/** A window's app, as it is. */
const plain = (app: Promise<React.ComponentType>): Loaded => app.then((C) => ({ default: C }));
/** A window's app that animates with the motion library, inside the reduced-motion policy (which loads the library). */
const animated = (app: Promise<React.ComponentType>): Loaded =>
  Promise.all([app, import("./app/MotionPolicy")]).then(([C, { MotionPolicy }]) => ({
    default: () => (
      <MotionPolicy>
        <C />
      </MotionPolicy>
    ),
  }));

const App = lazy((): Loaded => {
  if (isSettings) return animated(import("./features/settings/SettingsApp").then((m) => m.SettingsApp));
  switch (requested) {
    case "widgets":
      return animated(import("./features/desktop/DesktopWidgets").then((m) => m.DesktopWidgets));
    case "menubar":
      return animated(import("./features/menubar/MenuBarApp").then((m) => m.MenuBarApp));
    case "frame":
      return plain(import("./features/frame/FrameApp").then((m) => m.FrameApp));
    case "framecorners":
      return plain(import("./features/frame/FrameCornersApp").then((m) => m.FrameCornersApp));
    case "mission":
      return animated(import("./features/mission/MissionApp").then((m) => m.MissionApp));
    case "start":
      return animated(import("./features/start/StartApp").then((m) => m.StartApp));
    case "perf":
      return plain(import("./features/perf/PerfApp").then((m) => m.PerfApp));
    default:
      return animated(import("./app/DockApp").then((m) => m.DockApp));
  }
});

function Root() {
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
}

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
  return <Root />;
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
