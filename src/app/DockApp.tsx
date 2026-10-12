/**
 * Dock window root: hydrates settings + running windows, applies
 * appearance tokens, performs the first-run app import, resolves icons,
 * and renders the bar.
 */

import { GlassTips } from "../engine/tooltip/GlassTips";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useMemo } from "react";
import { DockBar } from "../features/dock/DockBar";
import { EffectsLayer } from "../engine/effects/EffectsLayer";
import { applyAppearance } from "../engine/themes/applyTheme";
import { notify } from "../features/feedback/toastStore";
import { useSearch } from "../features/search/SearchOverlay";
import { ipc } from "../ipc/commands";
import { EVENTS } from "../ipc/types";
import { useAppAudio } from "../state/audioStore";
import { buildDockItems, useDockIcons, type DockItemView } from "../state/dockStore";
import { useFileDrag } from "../state/dragStore";
import { useRunning } from "../state/runningStore";
import { useSettings } from "../state/settingsStore";
import { useState } from "react";

/** Which side of an icon its tip goes: the one facing into the screen, as the dock's labels do. */
const TIP_SIDE = { bottom: "above", top: "below", left: "right", right: "left" } as const;

export function DockApp() {
  const { settings, hydrate } = useSettings();
  const { windows, focused, hydrate: hydrateRunning } = useRunning();
  const { iconUrls, resolveIcons } = useDockIcons();

  // With a dock on every monitor there is one of these per window. The first
  // dock does the things that must happen once (the welcome card, switching
  // modes); the rest only draw.
  const isPrimary = useMemo(() => getCurrentWindow().label === "dock", []);

  // Which monitor this dock is on, so it can list that screen's windows.
  const [myMonitor, setMyMonitor] = useState<string | null>(null);
  useEffect(() => {
    ipc
      .dockMonitor()
      .then(setMyMonitor)
      .catch(() => setMyMonitor(null));
  }, [settings?.dock.monitor, settings?.dock.allMonitors]);

  // With "each dock shows only its own screen's windows", the windows on
  // other screens are left out. A window whose screen is not known is shown
  // everywhere rather than nowhere.
  const perScreen = settings?.dock.allMonitors && settings.dock.perMonitorWindows;
  const shownWindows = useMemo(
    () =>
      perScreen && myMonitor
        ? windows.filter((w) => !w.monitor || w.monitor === myMonitor)
        : windows,
    [perScreen, myMonitor, windows],
  );

  useEffect(() => {
    hydrate();
    hydrateRunning();
  }, [hydrate, hydrateRunning]);

  // Read the mixer whenever the set of running apps changes. Sessions
  // appear and disappear with the apps that own them, and this is the
  // only signal for that; there is no polling anywhere.
  const refreshAudio = useAppAudio((a) => a.refresh);
  useEffect(() => {
    void refreshAudio();
  }, [refreshAudio, windows.length]);

  // Auto-switching: when the foreground app changes, ask Rust whether a
  // mode claims it. Rust owns the decision so the rules live in exactly
  // one place, and it answers null when nothing should happen.
  const autoSwitch = isPrimary && settings?.modes.enabled && settings.modes.autoSwitch;
  const focusedExe = useMemo(
    () => windows.find((w) => w.hwnd === focused)?.exe ?? "",
    [windows, focused],
  );
  useEffect(() => {
    if (!autoSwitch || !focusedExe) return;
    let cancelled = false;
    // a short settle avoids switching on windows that are only passing
    // through the foreground during a restore or an alt-tab sweep
    const timer = setTimeout(() => {
      ipc
        .foregroundChanged(focusedExe)
        .then((report) => {
          if (cancelled || !report) return;
          // the new settings arrive on their own through
          // `settings://changed`; this only says what happened
          notify.info(`Switched to ${report.modeName}`);
        })
        .catch((e) => console.warn("auto mode switch failed", e));
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [autoSwitch, focusedExe]);

  // the menu bar's search button asks for the search, which lives here, in
  // the first dock (the others would each open their own copy)
  useEffect(() => {
    if (!isPrimary) return;
    const unlisten = listen(EVENTS.searchOpen, () => useSearch.getState().setOpen(true));
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [isPrimary]);

  // pin files/shortcuts dropped onto the dock from Explorer
  useEffect(() => {
    const setOverDock = useFileDrag.getState().setOverDock;
    const unlisten = getCurrentWebview().onDragDropEvent(async (event) => {
      // Hold the dock open while a drag is in flight. Sliding away from
      // the thing someone is aiming at is the worst moment to auto-hide.
      if (event.payload.type === "enter" || event.payload.type === "over") {
        setOverDock(true);
        return;
      }
      if (event.payload.type === "leave") {
        setOverDock(false);
        return;
      }
      if (event.payload.type !== "drop") return;
      setOverDock(false);
      for (const path of event.payload.paths) {
        try {
          const entry = await ipc.resolveDrop(path);
          const current = await ipc.getSettings();
          const exists = current.pinned.some(
            (p) => p.path.toLowerCase() === entry.targetPath.toLowerCase(),
          );
          if (exists) continue;
          await ipc.pinItem({
            id: `pin-${crypto.randomUUID()}`,
            kind: entry.source === "folder" ? "folder" : "app",
            path: entry.targetPath,
            name: entry.name,
            icon: entry.icon,
            children: [],
          });
        } catch (e) {
          notify.error(`Could not pin ${path.split("\\").pop()}`, e);
        }
      }
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  // wallpaper accent, fetched when sync is enabled
  const [accent, setAccent] = useState<string | null>(null);
  useEffect(() => {
    if (settings?.appearance.wallpaperSync) {
      ipc
        .getWallpaperAccent()
        .then(setAccent)
        .catch((e) => console.warn("wallpaper accent unavailable", e));
    } else {
      setAccent(null);
    }
  }, [settings?.appearance.wallpaperSync]);

  // appearance tokens track settings
  useEffect(() => {
    if (settings) applyAppearance(settings, accent);
  }, [settings, accent]);

  // first-run onboarding lives in DockBar (Welcome card)

  const items = useMemo(
    () =>
      settings
        ? buildDockItems(
            settings.pinned,
            shownWindows,
            focused,
            iconUrls,
            settings.dock.showRunningApps,
            settings.dock.runningOrder,
          )
        : [],
    [settings, shownWindows, focused, iconUrls],
  );

  // resolve icons for everything visible (pinned + running + stack children)
  useEffect(() => {
    const targets = items.filter((i) => !i.iconSrc && i.target).map((i) => i.target);
    for (const item of items) {
      item.children.forEach((c, idx) => {
        if (c.path && !item.childIcons[idx]) targets.push(c.path);
      });
    }
    if (targets.length) resolveIcons(targets).catch(() => undefined);
  }, [items, resolveIcons]);

  if (!settings) return null;

  const activate = (item: DockItemView, target?: HTMLElement) => {
    if (item.windows.length === 0) {
      ipc.launch(item.target, item.args).catch(notify.on(`Could not open ${item.name}`));
      return;
    }
    // one window: behave like the taskbar (restore / minimize / focus),
    // decided in Rust from live window state
    if (item.windows.length === 1) {
      // the icon's place goes along so the window can pour into it (or out of it)
      const box = target?.getBoundingClientRect();
      const icon = box ? { x: box.left, y: box.top, width: box.width, height: box.height } : undefined;
      ipc.toggleWindow(item.windows[0].hwnd, icon).catch(notify.on("Could not switch to that window"));
      return;
    }
    // several windows: focus the first, or cycle if one is already focused
    const focusedIdx = item.windows.findIndex((w) => w.hwnd === focused);
    if (focusedIdx === -1) {
      ipc.activateWindow(item.windows[0].hwnd).catch(notify.on("Could not focus that window"));
    } else {
      const next = item.windows[(focusedIdx + 1) % item.windows.length];
      ipc.activateWindow(next.hwnd).catch(notify.on("Could not focus that window"));
    }
  };

  return (
    <>
      <EffectsLayer settings={settings} wallpaperAccent={accent} />
      <DockBar settings={settings} items={items} onLaunch={activate} primary={isPrimary} />
      {/* the same side as the dock's own labels: away from the screen's edge it sits on */}
      <GlassTips side={TIP_SIDE[settings.dock.edge]} />
    </>
  );
}
