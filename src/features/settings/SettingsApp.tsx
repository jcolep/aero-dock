/**
 * The settings window: a Frutiger Aero control panel. Every change goes
 * through the settings store → Rust → broadcast, so the dock restyles
 * live while you drag a slider.
 */

import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";
import { useEffect, useRef, useState } from "react";
import { applyAppearance } from "../../engine/themes/applyTheme";
import { accentForTheme, normalizeHex } from "../../engine/themes/accent";
import { BubbleColor } from "./BubbleColor";
import { ColorSpectrum } from "./ColorSpectrum";
import { ipc } from "../../ipc/commands";
import type {
  DockEdge,
  DockSettings,
  MonitorInfoEx,
  Settings,
  StorageInfo,
  SurfaceStyle,
} from "../../ipc/types";
import { useSettings } from "../../state/settingsStore";
import { KOFI_URL, REPO_URL } from "../../links";
import { AudioCard } from "./AudioCard";
import { ModesCard } from "./ModesCard";
import { WidgetsCard } from "./WidgetsCard";
import {
  FLYOUT_ANIMS,
  LAUNCH_ANIMS,
  MAGNIFY_FEELS,
  MENU_ANIMS,
  REVEAL_ANIMS,
} from "../../engine/animation/presets";
import {
  AnimationPicker,
  FlyoutPreview,
  LaunchPreview,
  MagnifyPreview,
  MenuPreview,
  RevealPreview,
} from "./AnimationPicker";
import { AeroSegmented, AeroSlider, AeroToggle } from "./controls";
import "./settings.css";


const pctFmt = (v: number) => `${Math.round(v * 100)}%`;

/** One inline status line under the settings-file controls. The window
 * has room to say what happened, so nothing here needs a modal. */
interface Status {
  tone: "ok" | "error";
  text: string;
}

export function SettingsApp() {
  const { settings, hydrate, apply } = useSettings();
  const [status, setStatus] = useState<Status | null>(null);
  const [monitors, setMonitors] = useState<MonitorInfoEx[]>([]);
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const [hydrateFailed, setHydrateFailed] = useState(false);
  useEffect(() => {
    hydrate().catch((e) => {
      console.error("settings hydrate failed", e);
      setHydrateFailed(true);
    });
    ipc
      .listMonitors()
      .then(setMonitors)
      .catch((e) => console.warn("monitor list unavailable", e));
    ipc
      .storageInfo()
      .then(setStorage)
      .catch((e) => console.warn("storage info unavailable", e));
  }, [hydrate]);

  // settings window uses the same token system for its own glass
  useEffect(() => {
    if (settings) applyAppearance(settings, null, "settings");
  }, [settings]);

  // The Classic material's bubbles rise behind the glass cards, which makes
  // every card re-draw its backdrop on every frame. Nobody is looking at them
  // while the window is behind another one, so they rest until it is in front.
  useEffect(() => {
    const mark = () => {
      document.documentElement.dataset.active = document.hasFocus() ? "true" : "false";
    };
    mark();
    window.addEventListener("focus", mark);
    window.addEventListener("blur", mark);
    return () => {
      window.removeEventListener("focus", mark);
      window.removeEventListener("blur", mark);
    };
  }, []);

  // The window paints its sky immediately; this is what fills it until
  // settings arrive from Rust (or says so if they never do).
  if (!settings) {
    return (
      <div className="settings-root settings-root-centered">
        {hydrateFailed ? (
          <div className="settings-splash">
            <span className="settings-orb" aria-hidden />
            <p>Aero Dock could not read its settings.</p>
            <p className="settings-splash-hint">
              Close this window and restart Aero Dock from the tray icon.
            </p>
          </div>
        ) : (
          <div className="settings-splash">
            <span className="settings-orb settings-orb-pulse" aria-hidden />
            <p>Loading your dock…</p>
          </div>
        )}
      </div>
    );
  }
  const { dock, appearance } = settings;

  const set = (fn: (draft: Settings) => void) => {
    apply(fn).catch((e) => {
      console.error("settings update failed", e);
      setStatus({ tone: "error", text: `Could not save that change: ${e}` });
    });
  };

  const toggleStartup = async (on: boolean) => {
    try {
      if (on) await enable();
      else await disable();
      const actual = await isEnabled();
      set((d) => {
        d.launchAtStartup = actual;
      });
    } catch (e) {
      console.error("autostart toggle failed", e);
      setStatus({ tone: "error", text: `Could not change the startup setting: ${e}` });
    }
  };

  const doImport = async (file: File) => {
    try {
      const json = await file.text();
      await ipc.importSettings(json);
      setStatus({ tone: "ok", text: `Imported settings from ${file.name}.` });
    } catch (e) {
      console.error("import failed", e);
      setStatus({ tone: "error", text: `Could not import that file: ${e}` });
    }
  };

  const openLink = (url: string) =>
    ipc
      .launch(url)
      .catch((e) => setStatus({ tone: "error", text: `Could not open the browser: ${e}` }));

  return (
    <div className="settings-root">
      {/* ambient scenery: slow bubbles rising through the light */}
      <div className="settings-bubbles" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="settings-bubble" style={{ ["--i" as string]: i }} />
        ))}
      </div>
      <header className="settings-header">
        <span className="settings-orb" aria-hidden />
        <div>
          <h1>Aero Dock</h1>
          <p>Bring beauty back to the desktop.</p>
        </div>
        <button
          className="settings-support-chip"
          title="Support Aero Dock on Ko-fi"
          onClick={() => void openLink(KOFI_URL)}
        >
          <span aria-hidden>☕</span>
          Support
        </button>
      </header>

      <main className="settings-scroll">
        {/* ---- colour ---- */}
        <section className="settings-card glass">
          <h2>Colour</h2>
          <ColorSpectrum
            value={normalizeHex(appearance.accent) ?? accentForTheme(appearance.theme)}
            onChange={(hex) =>
              set((d) => {
                d.appearance.accent = hex;
                // With "tint from wallpaper" on, the wallpaper's colour is
                // used in place of this one, which would make the picker
                // look broken. Choosing a colour is choosing it over that.
                d.appearance.wallpaperSync = false;
              })
            }
          />
          <p className="settings-note">
            Pick any colour and the whole dock is tinted from it. A dark colour makes dark
            glass with light text; a pale or bright one makes light glass.
            {appearance.wallpaperSync &&
              " Tint from wallpaper is on, so the wallpaper's colour is being used instead. Choosing a colour here turns it off."}
          </p>

          <AeroSegmented<SurfaceStyle>
            label="Dock material"
            value={appearance.dockSurface}
            options={[
              { value: "aero", label: "Classic" },
              { value: "liquid", label: "Liquid" },
              { value: "clear", label: "Clear" },
            ]}
            onChange={(v) => set((d) => void (d.appearance.dockSurface = v))}
          />
          <AeroSegmented<SurfaceStyle>
            label="Settings material"
            value={appearance.settingsSurface}
            options={[
              { value: "aero", label: "Classic" },
              { value: "liquid", label: "Liquid" },
              { value: "clear", label: "Clear" },
            ]}
            onChange={(v) => set((d) => void (d.appearance.settingsSurface = v))}
          />
          <p className="settings-note">
            Classic is the glossy Aero panel. Liquid keeps the same colours but
            renders as thin glass: less tint in the body, the light moved to the
            rim. Clear drops the colour altogether for neutral, Apple-style
            glass with a bright specular edge. The two windows are set
            separately, so you can mix them.
          </p>

        </section>

        {/* ---- menu bar ---- */}
        <section className="settings-card glass">
          <h2>Menu bar</h2>
          <AeroToggle
            label="Show a menu bar along the top"
            checked={settings.menuBar.enabled}
            hint="After the macOS one: the Aero menu and the app in front on the left, status items, search, the Control Center and the clock on the right. Windows stop below it"
            onChange={(v) => set((d) => void (d.menuBar.enabled = v))}
          />
          {settings.menuBar.enabled && (
            <>
              <AeroSlider
                label="Height"
                value={settings.menuBar.height}
                min={22}
                max={44}
                step={1}
                format={(v) => `${v}px`}
                // Each change makes Rust re-claim the bar's strip of screen
                // and re-place the docks around it, so it is applied when
                // the slider is let go, not on every step of the drag.
                commitOnRelease
                onChange={(v) => set((d) => void (d.menuBar.height = v))}
              />
              <AeroSlider
                label="Gap from the screen edge"
                value={settings.menuBar.gap}
                min={0}
                max={24}
                step={1}
                format={(v) => (v === 0 ? "Flush" : `${v}px`)}
                // like the height, this changes the strip of screen the bar
                // claims, so it is applied when the slider is let go
                commitOnRelease
                onChange={(v) => set((d) => void (d.menuBar.gap = v))}
              />
              <AeroSlider
                label="Corner radius"
                value={settings.menuBar.cornerRadius}
                min={0}
                max={24}
                step={1}
                format={(v) => `${v}px`}
                onChange={(v) => set((d) => void (d.menuBar.cornerRadius = v))}
              />
              <AeroSlider
                label="Tint"
                value={settings.menuBar.tint}
                min={0.2}
                max={2}
                step={0.05}
                format={(v) => `${Math.round(v * 100)}%`}
                onChange={(v) => set((d) => void (d.menuBar.tint = v))}
              />
              <AeroSlider
                label="Item spacing"
                value={settings.menuBar.itemSpacing}
                min={0}
                max={16}
                step={1}
                format={(v) => `${v}px`}
                onChange={(v) => set((d) => void (d.menuBar.itemSpacing = v))}
              />
              <AeroSlider
                label="Text size"
                value={settings.menuBar.fontSize}
                min={11}
                max={17}
                step={1}
                format={(v) => `${v}px`}
                onChange={(v) => set((d) => void (d.menuBar.fontSize = v))}
              />
              <AeroToggle
                label="Light along the bar's edge"
                checked={settings.menuBar.edgeHighlight}
                hint="The thin bright rim that makes the bar read as glass"
                onChange={(v) => set((d) => void (d.menuBar.edgeHighlight = v))}
              />
              <AeroSlider
                label="Lens size"
                value={settings.menuBar.lensGrow}
                min={0}
                max={10}
                step={1}
                format={(v) => (v === 0 ? "Snug" : `+${v}px`)}
                onChange={(v) => set((d) => void (d.menuBar.lensGrow = v))}
              />
              <AeroSlider
                label="Lens magnification"
                value={settings.menuBar.lensMagnify}
                min={1}
                max={1.3}
                step={0.01}
                format={(v) => (v <= 1.001 ? "None" : `${Math.round((v - 1) * 100)}%`)}
                onChange={(v) => set((d) => void (d.menuBar.lensMagnify = v))}
              />
              <AeroSlider
                label="Lens warp"
                value={settings.menuBar.lensWarp}
                min={0}
                max={2}
                step={0.05}
                format={(v) => (v < 0.02 ? "Clear" : `${Math.round(v * 100)}%`)}
                onChange={(v) => set((d) => void (d.menuBar.lensWarp = v))}
              />
              <p className="settings-note">
                The glass that slides between the menu bar&apos;s buttons. Size is how far it reaches past a
                button, magnification is how much the button under it swells, and warp is how much it bends
                what is beneath its edge.
              </p>
              <BubbleColor
                label="Wi-Fi circle in the Control Center"
                value={settings.menuBar.wifiColor}
                themeColor={normalizeHex(appearance.accent) ?? accentForTheme(appearance.theme)}
                onChange={(hex) => set((d) => void (d.menuBar.wifiColor = hex))}
              />
              <BubbleColor
                label="Bluetooth circle in the Control Center"
                value={settings.menuBar.bluetoothColor}
                themeColor={normalizeHex(appearance.accent) ?? accentForTheme(appearance.theme)}
                onChange={(hex) => set((d) => void (d.menuBar.bluetoothColor = hex))}
              />
              <AeroToggle
                label="Close menus when the pointer moves away"
                checked={settings.menuBar.closeOnLeave}
                hint="A menu or the Control Center goes when you move off it, instead of staying until you click somewhere else. Opened from the keyboard, they stay until you choose or press Escape"
                onChange={(v) => set((d) => void (d.menuBar.closeOnLeave = v))}
              />
              <AeroToggle
                label="Clock and status icons live in the bar, not the dock"
                checked={settings.menuBar.takesOverDockStatus}
                hint="The dock keeps to apps. Turn off to show them in both"
                onChange={(v) => set((d) => void (d.menuBar.takesOverDockStatus = v))}
              />
              <AeroToggle
                label="Camera and microphone dots"
                checked={settings.menuBar.showPrivacy}
                hint="A green dot while an app is using the camera, an orange one for the microphone. Click it to see which"
                onChange={(v) => set((d) => void (d.menuBar.showPrivacy = v))}
              />
              <AeroToggle
                label="Now Playing takes its colours from the cover"
                checked={settings.menuBar.mediaTint}
                hint="The card in the Control Center is tinted with the album art, or a video's thumbnail from a browser"
                onChange={(v) => set((d) => void (d.menuBar.mediaTint = v))}
              />
              <AeroToggle
                label="Show the sound wave while music plays"
                checked={settings.menuBar.mediaSpectrum}
                hint="Moving bars in the Now Playing card. This listens to what is coming out of the speakers while the card is open; nothing is recorded or kept. Off while Reduce motion is on"
                onChange={(v) => set((d) => void (d.menuBar.mediaSpectrum = v))}
              />
              <AeroToggle
                label="CPU, memory and network readout"
                checked={settings.menuBar.showStats}
                hint="A live readout in the bar. Click it for the busiest apps"
                onChange={(v) => set((d) => void (d.menuBar.showStats = v))}
              />
              <AeroToggle
                label="Show the date beside the time"
                checked={settings.menuBar.showDate}
                onChange={(v) => set((d) => void (d.menuBar.showDate = v))}
              />
              <AeroToggle
                label="Play the ambient scene in the bar"
                checked={settings.menuBar.ambient}
                hint="The scene chosen under Glass & Light (dust, rain, snow, ocean or aurora), drawn inside the bar and kept to it. It rests while you are away from the keyboard. Needs a scene other than None"
                onChange={(v) => set((d) => void (d.menuBar.ambient = v))}
              />
            </>
          )}
        </section>

        {/* ---- window frame ---- */}
        <section className="settings-card glass">
          <h2>Window frame</h2>
          <AeroToggle
            label="Hold maximized apps inside a frame of glass"
            checked={settings.frame.enabled}
            hint="A margin of tinted glass round the free space on every monitor, between the menu bar and the dock. Maximized apps sit inside it with rounded corners, and the scene from Glass & Light drifts in the margin. It takes that margin off the screen, as the menu bar does, and steps aside for full-screen games and video"
            onChange={(v) => set((d) => void (d.frame.enabled = v))}
          />
          {settings.frame.enabled && (
            <>
              <AeroSlider
                label="Padding"
                value={settings.frame.padding}
                min={4}
                max={64}
                step={1}
                format={(v) => `${v}px`}
                // every change makes Windows re-lay-out every maximized window,
                // so it is applied when the slider is let go
                commitOnRelease
                onChange={(v) => set((d) => void (d.frame.padding = v))}
              />
              <AeroSlider
                label="Corner radius"
                value={settings.frame.cornerRadius}
                min={0}
                max={48}
                step={1}
                format={(v) => (v === 0 ? "Square" : `${v}px`)}
                onChange={(v) => set((d) => void (d.frame.cornerRadius = v))}
              />
              <AeroSlider
                label="Tint (relative to the menu bar)"
                value={settings.frame.tint}
                min={0.2}
                max={2}
                step={0.05}
                format={(v) => `${Math.round(v * 100)}%`}
                onChange={(v) => set((d) => void (d.frame.tint = v))}
              />
              <AeroToggle
                label="Play the ambient scene in the margin"
                checked={settings.frame.ambient}
                hint="The scene chosen under Glass & Light, drawn only inside the margin. It rests while you are away from the keyboard. Needs a scene other than None"
                onChange={(v) => set((d) => void (d.frame.ambient = v))}
              />
              <p className="settings-note">
                Maximized apps are given rounded corners by shaping their windows, so the glass shows
                through the cut corners. An app running as administrator cannot be shaped by Aero Dock
                and keeps its square corners.
              </p>
            </>
          )}
        </section>

        {/* ---- dock ---- */}
        <section className="settings-card glass">
          <h2>Dock</h2>
          <AeroSegmented<DockEdge>
            label="Position"
            value={dock.edge}
            options={[
              { value: "bottom", label: "Bottom" },
              { value: "top", label: "Top" },
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ]}
            onChange={(edge) => set((d) => void (d.dock.edge = edge))}
          />
          {monitors.length > 1 && (
            <>
              <AeroSegmented<string>
                label={dock.allMonitors ? "Main monitor" : "Monitor"}
                value={dock.monitor ?? ""}
                options={monitors.map((m) => ({
                  value: m.isPrimary ? "" : m.name,
                  label: `${m.name.replace(/^\\\\\.\\/, "")}${m.isPrimary ? " (primary)" : ""}`,
                }))}
                onChange={(name) => set((d) => void (d.dock.monitor = name || null))}
              />
              <AeroToggle
                label="A dock on every monitor"
                checked={dock.allMonitors}
                hint="Each screen gets its own dock, with the same apps and settings"
                onChange={(v) => set((d) => void (d.dock.allMonitors = v))}
              />
              {dock.allMonitors && (
                <AeroToggle
                  label="Each dock shows only its own screen's windows"
                  checked={dock.perMonitorWindows}
                  hint="A window appears on the dock of the screen it is on. Off, every dock lists every window"
                  onChange={(v) => set((d) => void (d.dock.perMonitorWindows = v))}
                />
              )}
            </>
          )}
          <AeroSlider
            label="Icon size"
            value={dock.iconSize}
            min={16}
            max={80}
            step={2}
            format={(v) => `${v}px`}
            onChange={(v) => set((d) => void (d.dock.iconSize = v))}
          />
          <AeroSlider
            label="Icon spacing"
            value={dock.iconSpacing}
            min={0}
            max={32}
            step={1}
            format={(v) => `${v}px`}
            onChange={(v) => set((d) => void (d.dock.iconSpacing = v))}
          />
          <AeroToggle
            label="Magnification"
            checked={dock.magnification}
            onChange={(v) => set((d) => void (d.dock.magnification = v))}
          />
          {dock.magnification && (
            <AeroSlider
              label="Magnification amount"
              value={dock.magnificationScale}
              min={1.1}
              max={1.9}
              step={0.05}
              format={(v) => `${Math.round((v - 1) * 100)}%`}
              onChange={(v) => set((d) => void (d.dock.magnificationScale = v))}
            />
          )}
          <AeroSlider
            label="Dock padding"
            value={dock.padding}
            min={2}
            max={24}
            step={1}
            format={(v) => `${v}px`}
            onChange={(v) => set((d) => void (d.dock.padding = v))}
          />
          {dock.showRunningApps && (
            <AeroSlider
              label="Running dot gap"
              value={dock.indicatorGap}
              min={0}
              max={16}
              step={1}
              format={(v) => `${v}px`}
              onChange={(v) => set((d) => void (d.dock.indicatorGap = v))}
            />
          )}
          <AeroToggle
            label="Custom corner radius"
            checked={dock.cornerRadius !== null}
            hint="Off uses the rounding that belongs to the dock material"
            onChange={(on) =>
              set((d) => {
                // start from what the material gives the bar now, so
                // switching this on does not change how it looks
                const surface = d.appearance.dockSurface;
                d.dock.cornerRadius = on
                  ? surface === "clear"
                    ? Math.round(d.dock.iconSize * 0.46 + d.dock.padding)
                    : surface === "liquid"
                      ? 26
                      : 20
                  : null;
              })
            }
          />
          {dock.cornerRadius !== null && (
            <AeroSlider
              label="Corner radius"
              value={dock.cornerRadius}
              min={0}
              max={48}
              step={1}
              format={(v) => `${v}px`}
              onChange={(v) => set((d) => void (d.dock.cornerRadius = v))}
            />
          )}
          <AeroToggle
            label="Floating (detached from edge)"
            checked={dock.floating}
            onChange={(v) => set((d) => void (d.dock.floating = v))}
          />
          {dock.floating && (
            <AeroSlider
              label="Edge gap"
              value={dock.floatingMargin}
              min={0}
              max={32}
              step={1}
              format={(v) => `${v}px`}
              onChange={(v) => set((d) => void (d.dock.floatingMargin = v))}
            />
          )}
          <AeroToggle
            label="Reserve screen space"
            checked={dock.reserveSpace}
            hint="Maximised windows stop at the dock, like the Windows taskbar. Ignored while auto-hide is on"
            onChange={(v) => set((d) => void (d.dock.reserveSpace = v))}
          />
          <AeroToggle
            label="Show running applications"
            checked={dock.showRunningApps}
            onChange={(v) => set((d) => void (d.dock.showRunningApps = v))}
          />
          <AeroSegmented<DockSettings["minimizeEffect"]>
            label="Minimise effect"
            value={dock.minimizeEffect}
            options={[
              { value: "genie", label: "Genie" },
              { value: "scale", label: "Scale" },
              { value: "off", label: "None" },
            ]}
            onChange={(v) => set((d) => void (d.dock.minimizeEffect = v))}
          />
          <p className="settings-note">
            A window pours into its dock icon when you minimise it from the dock, and back out when you open it.
            Windows minimised any other way just minimise. Follows Reduce motion.
          </p>
          <AeroToggle
            label="Bounce an icon when its app needs you"
            checked={dock.attentionBounce}
            hint="An app that flashes its taskbar button makes its dock icon hop and shows a dot, until you switch to it"
            onChange={(v) => set((d) => void (d.dock.attentionBounce = v))}
          />
          <AeroToggle
            label="Automatically hide the dock"
            checked={dock.autoHide}
            hint="The dock slides away and returns when you move the mouse to the screen edge"
            onChange={(v) => set((d) => void (d.dock.autoHide = v))}
          />
          {dock.autoHide && (
            <AeroSlider
              label="Hide after"
              value={dock.autoHideDelayMs}
              min={200}
              max={5000}
              step={100}
              format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${v}ms`)}
              onChange={(v) => set((d) => void (d.dock.autoHideDelayMs = v))}
            />
          )}
        </section>

        {/* ---- what the dock shows ---- */}
        <section className="settings-card glass">
          <h2>Dock items</h2>
          <AeroToggle
            label="Search button"
            checked={dock.showSearchButton}
            onChange={(v) => set((d) => void (d.dock.showSearchButton = v))}
          />
          <AeroToggle
            label="Reveal Search and Settings on hover"
            checked={dock.revealControls}
            hint="They stay hidden until you move to the left end (Search) or the clock end (Settings) of the dock. Horizontal docks only"
            onChange={(v) => set((d) => void (d.dock.revealControls = v))}
          />
          <AeroToggle
            label="Settings button"
            checked={dock.showSettingsButton}
            onChange={(v) => set((d) => void (d.dock.showSettingsButton = v))}
          />
          <AeroToggle
            label="Clock and date"
            checked={dock.showClock}
            onChange={(v) => set((d) => void (d.dock.showClock = v))}
          />
          <AeroToggle
            label="Battery, network, volume, Recycle Bin"
            checked={dock.showSystemStatus}
            onChange={(v) => set((d) => void (d.dock.showSystemStatus = v))}
          />
          {dock.showSystemStatus && (
            <AeroSlider
              label="Status icon size"
              value={dock.statusIconSize}
              min={10}
              max={32}
              step={1}
              format={(v) => `${v}px`}
              onChange={(v) => set((d) => void (d.dock.statusIconSize = v))}
            />
          )}
        </section>

        {/* ---- appearance ---- */}
        <section className="settings-card glass">
          <h2>Glass &amp; Light</h2>
          <AeroToggle
            label="Frosted glass: blur what is behind the dock, menu bar and frame"
            checked={appearance.realBlur}
            hint="Windows blurs your wallpaper and windows behind the glass, instead of the glass only being tinted. Depends on how Windows draws it on your machine, so it is off until you choose it; turn it off again if anything looks wrong"
            onChange={(v) => set((d) => void (d.appearance.realBlur = v))}
          />
          <AeroToggle
            label="Light that follows the pointer"
            checked={appearance.pointerLight}
            hint="A soft highlight drifts across the dock and the menu bar under the pointer"
            onChange={(v) => set((d) => void (d.appearance.pointerLight = v))}
          />
          <AeroToggle
            label="Fine grain on the glass"
            checked={appearance.glassGrain}
            hint="A barely-there texture that keeps soft gradients from banding, as real glass and Apple's materials have"
            onChange={(v) => set((d) => void (d.appearance.glassGrain = v))}
          />
          <AeroSlider
            label="Opacity"
            value={appearance.transparency}
            min={0.3}
            max={1}
            format={pctFmt}
            onChange={(v) => set((d) => void (d.appearance.transparency = v))}
          />
          <AeroSlider
            label="Glass intensity"
            value={appearance.glassIntensity}
            min={0}
            max={1}
            format={pctFmt}
            onChange={(v) => set((d) => void (d.appearance.glassIntensity = v))}
          />
          <AeroSlider
            label="Bloom"
            value={appearance.bloomAmount}
            min={0}
            max={1}
            format={pctFmt}
            onChange={(v) => set((d) => void (d.appearance.bloomAmount = v))}
          />
          <AeroSlider
            label="Reflections"
            value={appearance.reflectionStrength}
            min={0}
            max={1}
            format={pctFmt}
            onChange={(v) => set((d) => void (d.appearance.reflectionStrength = v))}
          />
          <AeroSlider
            label="Dock shadow"
            value={appearance.dockShadow}
            min={0}
            max={1}
            step={0.05}
            format={(v) => (v < 0.01 ? "Off" : pctFmt(v))}
            onChange={(v) => set((d) => void (d.appearance.dockShadow = v))}
          />
          <AeroSegmented<string>
            label="Ambient scene"
            value={appearance.scene}
            options={[
              { value: "none", label: "None" },
              { value: "dust", label: "Dust" },
              { value: "rain", label: "Rain" },
              { value: "snow", label: "Snow" },
              { value: "bubbles", label: "Ocean" },
              { value: "aurora", label: "Aurora" },
            ]}
            onChange={(v) => set((d) => void (d.appearance.scene = v))}
          />
          <AeroSlider
            label="Particles"
            value={appearance.particleDensity}
            min={0}
            max={1}
            format={pctFmt}
            onChange={(v) => set((d) => void (d.appearance.particleDensity = v))}
          />
          <AeroToggle
            label="Tint from wallpaper"
            checked={appearance.wallpaperSync}
            hint="Derives the accent color from your current wallpaper"
            onChange={(v) => set((d) => void (d.appearance.wallpaperSync = v))}
          />
          <AeroSlider
            label="Animation speed"
            value={appearance.animationSpeed}
            min={0.5}
            max={2}
            format={(v) => `${v.toFixed(2)}×`}
            onChange={(v) => set((d) => void (d.appearance.animationSpeed = v))}
          />
        </section>

        {/* ---- animations ---- */}
        <section className="settings-card glass">
          <h2>Animations</h2>
          <p className="settings-note">
            Pick how things open, close and arrive. Each stage plays the choice as you make it; click
            one to see it again. The speed slider under Glass &amp; Light scales all of them.
          </p>
          <AnimationPicker
            label="Menu bar menus"
            summary="The menus and the Control Center"
            value={settings.animations.menu}
            options={MENU_ANIMS}
            onChange={(id) => set((d) => void (d.animations.menu = id))}
            preview={(id, run) => (
              <MenuPreview key={`${id}-${run}`} preset={id} run={run} speed={appearance.animationSpeed} />
            )}
          />
          <AnimationPicker
            label="Dock appears"
            summary="At launch, and with auto-hide"
            value={settings.animations.dockReveal}
            options={REVEAL_ANIMS}
            onChange={(id) => set((d) => void (d.animations.dockReveal = id))}
            preview={(id, run) => (
              <RevealPreview preset={id} run={run} speed={appearance.animationSpeed} />
            )}
          />
          <AnimationPicker
            label="Dock flyouts"
            summary="Window previews, menus, folders, search"
            value={settings.animations.flyout}
            options={FLYOUT_ANIMS}
            onChange={(id) => set((d) => void (d.animations.flyout = id))}
            preview={(id, run) => (
              <FlyoutPreview preset={id} run={run} speed={appearance.animationSpeed} />
            )}
          />
          <AnimationPicker
            label="Launching an app"
            summary="What the icon does when you click it"
            value={settings.animations.launch}
            options={LAUNCH_ANIMS}
            onChange={(id) => set((d) => void (d.animations.launch = id))}
            preview={(id, run) => <LaunchPreview preset={id} run={run} />}
          />
          <AnimationPicker
            label="Icon magnification"
            summary="How icons swell under the pointer"
            value={settings.animations.magnify}
            options={MAGNIFY_FEELS}
            onChange={(id) => set((d) => void (d.animations.magnify = id))}
            preview={(id, run) => <MagnifyPreview feel={id} run={run} />}
          />
        </section>

        {/* ---- behavior ---- */}
        {/* ---- accessibility and feel ---- */}
        <section className="settings-card glass">
          <h2>Accessibility &amp; feel</h2>
          <AeroSegmented<"system" | "on" | "off">
            label="Reduce motion"
            value={settings.accessibility.reduceMotion}
            options={[
              { value: "system", label: "Follow Windows" },
              { value: "on", label: "Always" },
              { value: "off", label: "Never" },
            ]}
            onChange={(v) => set((d) => void (d.accessibility.reduceMotion = v))}
          />
          <AeroSegmented<"system" | "on" | "off">
            label="Reduce transparency"
            value={settings.accessibility.reduceTransparency}
            options={[
              { value: "system", label: "Follow Windows" },
              { value: "on", label: "Always" },
              { value: "off", label: "Never" },
            ]}
            onChange={(v) => set((d) => void (d.accessibility.reduceTransparency = v))}
          />
          <p className="settings-note">
            Reduced motion lets things arrive without travelling: no sliding lens, no particles, no
            bounces. Reduced transparency makes the glass solid and turns the frosted blur off. Follow
            Windows uses the Animation effects and Transparency effects switches in Windows
            Settings &gt; Accessibility &gt; Visual effects.
          </p>
          <AeroToggle
            label="Keyboard shortcuts for the menu bar and the dock"
            checked={settings.accessibility.keyboardShortcuts}
            hint="Ctrl+Alt+M opens the menu bar and Ctrl+Alt+D the dock, and gives them the keyboard: arrow keys move, Enter chooses, Shift+F10 opens an icon's menu, Escape gives the keyboard back. Screen readers can reach them this way too"
            onChange={(v) => set((d) => void (d.accessibility.keyboardShortcuts = v))}
          />
          <AeroToggle
            label="Soft interface sounds"
            checked={settings.accessibility.uiSounds}
            hint="Quiet tones for menus opening and closing, switches, the lens and launching an app. Off unless you want them"
            onChange={(v) => set((d) => void (d.accessibility.uiSounds = v))}
          />
          {settings.accessibility.uiSounds && (
            <AeroSlider
              label="Sound volume"
              value={settings.accessibility.uiSoundVolume}
              min={0}
              max={1}
              step={0.05}
              format={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => set((d) => void (d.accessibility.uiSoundVolume = v))}
            />
          )}
        </section>
        <section className="settings-card glass">
          <h2>Behavior</h2>
          <AeroToggle
            label="Start Aero Dock when I sign in"
            checked={settings.launchAtStartup}
            onChange={toggleStartup}
          />
          <AeroToggle
            label="Hide the Windows taskbar"
            checked={settings.hideTaskbar}
            hint="Puts the Windows taskbar into auto-hide so Aero Dock is your bar; restored when you quit"
            onChange={(v) => {
              ipc.setTaskbarHidden(v).catch((e) => {
                console.error("taskbar toggle failed", e);
                setStatus({ tone: "error", text: `Could not change the taskbar: ${e}` });
              });
              set((d) => void (d.hideTaskbar = v));
            }}
          />
          <div className="ctl-row">
            <span className="ctl-label">Settings file</span>
            <div className="ctl-actions">
              <button
                className="aero-button"
                onClick={() =>
                  ipc
                    .exportSettingsFile()
                    .then((path) => setStatus({ tone: "ok", text: `Saved to ${path}` }))
                    .catch((e) => {
                      console.error("export failed", e);
                      setStatus({ tone: "error", text: `Could not export settings: ${e}` });
                    })
                }
              >
                Export…
              </button>
              <button className="aero-button" onClick={() => importRef.current?.click()}>
                Import…
              </button>
              <input
                ref={importRef}
                type="file"
                accept=".json"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) doImport(f);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
          <div className="ctl-row">
            <span className="ctl-label">Quit Aero Dock</span>
            <div className="ctl-actions">
              <button
                className="aero-button aero-button-danger"
                onClick={() =>
                  ipc
                    .quitApp()
                    .catch((e) =>
                      setStatus({ tone: "error", text: `Could not quit: ${e}` }),
                    )
                }
              >
                Quit
              </button>
            </div>
          </div>
          <p className="settings-note">
            Also available by right-clicking the Aero Dock tray icon.
          </p>
          {status && (
            <p className="settings-note" data-tone={status.tone} role="status">
              {status.text}
            </p>
          )}
        </section>

        <ModesCard
          settings={settings}
          onStatus={(tone, text) => setStatus({ tone, text })}
        />

        <AudioCard
          settings={settings}
          onStatus={(tone, text) => setStatus({ tone, text })}
        />

        <WidgetsCard
          settings={settings}
          onStatus={(tone, text) => setStatus({ tone, text })}
        />

        {/* ---- support ---- */}
        <section className="settings-card glass settings-support">
          <h2>
            Support Aero Dock <span aria-hidden>☕</span>
          </h2>
          <p className="settings-note settings-support-copy">
            Aero Dock is free and independently developed. If you enjoy using
            it, you can support continued development.
          </p>
          <div className="settings-support-actions">
            <button className="settings-support-cta" onClick={() => void openLink(KOFI_URL)}>
              Support on Ko-fi <span aria-hidden>&rarr;</span>
            </button>
          </div>
        </section>

        {/* ---- about ---- */}
        <section className="settings-card glass">
          <h2>About</h2>
          <div className="ctl-row">
            <span className="ctl-label">Version</span>
            <span className="settings-about-value">Aero Dock {__APP_VERSION__}</span>
          </div>
          {storage && (
            <>
              <div className="ctl-row">
                <span className="ctl-label">Storage</span>
                <span className="settings-about-value">
                  {storage.portable ? "Portable" : "Installed"}
                </span>
              </div>
              <p className="settings-note settings-path">{storage.dataDir}</p>
            </>
          )}
          <div className="ctl-row">
            <span className="ctl-label">Project</span>
            <div className="ctl-actions">
              <button className="aero-button" onClick={() => void openLink(REPO_URL)}>
                View on GitHub
              </button>
              <button className="aero-button" onClick={() => void openLink(KOFI_URL)}>
                Support on Ko-fi
              </button>
            </div>
          </div>
        </section>

        <footer className="settings-footer">
          Aero Dock {__APP_VERSION__} - made with light, water, and glass.
        </footer>
      </main>
    </div>
  );
}
