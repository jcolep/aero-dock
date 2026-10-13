/**
 * The settings window: a Frutiger Aero control panel. Every change goes
 * through the settings store → Rust → broadcast, so the dock restyles
 * live while you drag a slider.
 */

import { GlassTips } from "../../engine/tooltip/GlassTips";
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";
import { Fragment, useEffect, useRef, useState } from "react";
import { applyAppearance } from "../../engine/themes/applyTheme";
import { accentForTheme, normalizeHex } from "../../engine/themes/accent";
import { BubbleColor } from "./BubbleColor";
import { ColorSpectrum } from "./ColorSpectrum";
import { ipc } from "../../ipc/commands";
import type {
  DockEdge,
  DockSettings,
  IconStyle,
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
  START_ANIMS,
} from "../../engine/animation/presets";
import {
  AnimationPicker,
  FlyoutPreview,
  LaunchPreview,
  MagnifyPreview,
  MenuPreview,
  RevealPreview,
  StartPreview,
} from "./AnimationPicker";
import { AeroSegmented, AeroSlider, AeroToggle } from "./controls";
import { SettingsNav } from "./SettingsNav";
import { SettingsGroup, SettingsNoMatch, SettingsSection, SettingsSub } from "./SettingsSection";
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
      <GlassTips side="below" />
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

      <div className="settings-body">
        <SettingsNav />
        <main className="settings-scroll">
        <SettingsGroup id="look" />

        <SettingsSection id="colour">
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
          <AeroSegmented<IconStyle>
            label="App icons"
            value={appearance.iconStyle}
            options={[
              { value: "plain", label: "Plain" },
              { value: "glass", label: "Glass" },
              { value: "clear", label: "Clear" },
              { value: "tinted", label: "Tinted" },
            ]}
            onChange={(v) => set((d) => void (d.appearance.iconStyle = v))}
          />
          <p className="settings-note">
            Every app's icon, in the dock and the Start menu. Glass keeps the colours and adds a body of glass
            with light along its edge. Clear leaves only a frosted shape of the drawing. Tinted is the same in
            your theme colour. Each is made once and kept, so it costs nothing to show, and none puts a tile
            behind the icon.
          </p>
          <p className="settings-note">
            Classic is the glossy Aero panel. Liquid keeps the same colours but
            renders as thin glass: less tint in the body, the light moved to the
            rim. Clear drops the colour altogether for neutral, Apple-style
            glass with a bright specular edge. The two windows are set
            separately, so you can mix them.
          </p>
        </SettingsSection>

        <SettingsSection id="glass">
          <AeroToggle
            label="Frosted glass: blur what is behind the dock, the Start menu and the menu bar"
            checked={appearance.realBlur}
            hint="Your wallpaper and windows, blurred, show through the glass instead of the glass only being tinted. The dock, the Start menu and the menu bar blur a picture of what is behind them (a couple of times a second, and only while it is on), so their corners are as round as the glass. Off until you choose it; turn it off again if anything looks wrong"
            onChange={(v) => set((d) => void (d.appearance.realBlur = v))}
          />
          <div className="ctl-row">
            <span className="ctl-label">Frosted glass report</span>
            <div className="ctl-actions">
              <button
                className="aero-button"
                onClick={() =>
                  ipc
                    .blurReport()
                    .then(() => setStatus({ tone: "ok", text: "Saved blur-report.txt in Aero Dock's data folder." }))
                    .catch((e) => setStatus({ tone: "error", text: `Could not save the report: ${e}` }))
                }
              >
                Save a report
              </button>
            </div>
          </div>
          <p className="settings-note">
            The picture is taken with Aero Dock's own windows left out of it, so the dock is not in the picture of what
            is behind the dock. If the glass looks wrong on one of your screens, the report says whether a picture can be
            taken here, how long it takes, and where each window is.
          </p>
          <SettingsSub>Frosting, for each surface</SettingsSub>
          {(
            [
              ["dock", "Dock"],
              ["start", "Start menu"],
              ["menuBar", "Menu bar"],
            ] as const
          ).map(([key, name]) => (
            <Fragment key={key}>
              <AeroSlider
                label={`${name}: blur`}
                value={appearance.frost[key].blur}
                min={0}
                max={120}
                step={1}
                commitOnRelease
                format={(v) => (v < 1 ? "Sharp" : `${Math.round(v)} px`)}
                onChange={(v) => set((d) => void (d.appearance.frost[key].blur = v))}
              />
              <AeroSlider
                label={`${name}: grain`}
                value={appearance.frost[key].grain}
                min={0}
                max={1}
                step={0.01}
                format={(v) => (v < 0.01 ? "None" : pctFmt(v))}
                onChange={(v) => set((d) => void (d.appearance.frost[key].grain = v))}
              />
            </Fragment>
          ))}
          <p className="settings-note">
            The grain is always on the glass. The blur is how far what is behind the surface is blurred: the picture of
            your desktop when Frosted glass is on, and, with it off, only whatever the page itself has behind the glass
            (the ambient scene), since there is no desktop for it to blur. The grain switch below turns all grain off.
          </p>
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
        </SettingsSection>

        <SettingsSection id="animations">
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
            label="Start menu"
            summary="Opening and closing the Start menu"
            value={settings.animations.start}
            options={START_ANIMS}
            onChange={(id) => set((d) => void (d.animations.start = id))}
            preview={(id, run) => (
              <StartPreview preset={id} run={run} speed={appearance.animationSpeed} />
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
          <SettingsSub>Smoothness</SettingsSub>
          <AeroToggle
            label="Hardware acceleration"
            checked={appearance.hardwareAcceleration}
            hint="Draw the dock, the Start menu and the menu bar with the graphics card instead of the processor. Smoother on a fast screen, and it costs about 60 MB more memory. It is read when Aero Dock starts, so a change waits for a restart"
            onChange={(v) => set((d) => void (d.appearance.hardwareAcceleration = v))}
          />
          <div className="ctl-row">
            <span className="ctl-label">Apply it</span>
            <div className="ctl-actions">
              <button
                className="aero-button"
                onClick={() => ipc.restartApp().catch((e) => setStatus({ tone: "error", text: `Could not restart: ${e}` }))}
              >
                Restart Aero Dock
              </button>
            </div>
          </div>
          <AeroToggle
            label="Show frame timings"
            checked={appearance.frameOverlay}
            hint="A small table at the top left of the main screen: for every window, the screen it is on and that screen's rate, its frames a second, the average gap between frames, the slowest 5% and the worst in ten seconds, in green, amber or red. It is how to tell whether something is smooth on each of your screens with numbers. A diagnostic: it keeps every window drawing at its screen's rate while it is on, so turn it off when you are done"
            onChange={(v) => set((d) => void (d.appearance.frameOverlay = v))}
          />
          <div className="ctl-row">
            <span className="ctl-label">Frame timings report</span>
            <div className="ctl-actions">
              <button
                className="aero-button"
                disabled={!appearance.frameOverlay}
                onClick={() =>
                  ipc
                    .frameReport()
                    .then(() => setStatus({ tone: "ok", text: "Saved frame-report.txt in Aero Dock's data folder." }))
                    .catch((e) => setStatus({ tone: "error", text: `Could not save the report: ${e}` }))
                }
              >
                Save a report
              </button>
            </div>
          </div>
        </SettingsSection>

        <SettingsGroup id="dock" />

        <SettingsSection id="dock">
          <SettingsSub>Placement</SettingsSub>
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
          <AeroToggle
            label="A dock on every monitor"
            checked={dock.allMonitors}
            hint="Each screen gets its own dock, with the same apps and settings"
            onChange={(v) => set((d) => void (d.dock.allMonitors = v))}
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
            label="A dock on every monitor"
            checked={dock.allMonitors}
            hint="Each screen gets its own dock, with the same apps and settings"
            onChange={(v) => set((d) => void (d.dock.allMonitors = v))}
          />
          <AeroToggle
            label="A dock on every monitor"
            checked={dock.allMonitors}
            hint="Each screen gets its own dock, with the same apps and settings"
            onChange={(v) => set((d) => void (d.dock.allMonitors = v))}
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
          <SettingsSub>Icons</SettingsSub>
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
            label="Icon size"
            value={dock.iconSize}
            min={16}
            max={80}
            step={2}
            format={(v) => `${v}px`}
            onChange={(v) => set((d) => void (d.dock.iconSize = v))}
          />
          <AeroToggle
            label="A dock on every monitor"
            checked={dock.allMonitors}
            hint="Each screen gets its own dock, with the same apps and settings"
            onChange={(v) => set((d) => void (d.dock.allMonitors = v))}
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
            label="Icon size"
            value={dock.iconSize}
            min={16}
            max={80}
            step={2}
            format={(v) => `${v}px`}
            onChange={(v) => set((d) => void (d.dock.iconSize = v))}
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
          <SettingsSub>Shape</SettingsSub>
          <AeroToggle
            label="A dock on every monitor"
            checked={dock.allMonitors}
            hint="Each screen gets its own dock, with the same apps and settings"
            onChange={(v) => set((d) => void (d.dock.allMonitors = v))}
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
          <SettingsSub>Behaviour</SettingsSub>
          <AeroToggle
            label="A dock on every monitor"
            checked={dock.allMonitors}
            hint="Each screen gets its own dock, with the same apps and settings"
            onChange={(v) => set((d) => void (d.dock.allMonitors = v))}
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
            label="A dock on every monitor"
            checked={dock.allMonitors}
            hint="Each screen gets its own dock, with the same apps and settings"
            onChange={(v) => set((d) => void (d.dock.allMonitors = v))}
          />
        </SettingsSection>

        <SettingsSection id="dock-items">
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
        </SettingsSection>

        <ModesCard
          settings={settings}
          onStatus={(tone, text) => setStatus({ tone, text })}
        />

        <AudioCard
          settings={settings}
          onStatus={(tone, text) => setStatus({ tone, text })}
        />

        <SettingsGroup id="desktop" />

        <SettingsSection id="menubar">
          <AeroToggle
            label="Show a menu bar along the top"
            checked={settings.menuBar.enabled}
            hint="After the macOS one: the Aero menu and the app in front on the left, status items, search, the Control Center and the clock on the right. Windows stop below it"
            onChange={(v) => set((d) => void (d.menuBar.enabled = v))}
          />
          {settings.menuBar.enabled && (
            <>
              <SettingsSub>The bar</SettingsSub>
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
              <AeroToggle
                label="Play the ambient scene in the bar"
                checked={settings.menuBar.ambient}
                hint="The scene chosen under Glass & Light (dust, rain, snow, ocean or aurora), drawn inside the bar and kept to it. It rests while you are away from the keyboard. Needs a scene other than None"
                onChange={(v) => set((d) => void (d.menuBar.ambient = v))}
              />
              <SettingsSub>The lens</SettingsSub>
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
                The glass that slides between the menu bar&apos;s buttons, and between what you point at in the Start menu. Size is
                how far it reaches past a button, magnification is how much the button under it swells, and warp is how
                much it bends what is beneath its edge.
              </p>
              <SettingsSub>What the bar shows</SettingsSub>
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
              <SettingsSub>The Control Center</SettingsSub>
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
              <SettingsSub>Menus</SettingsSub>
              <AeroToggle
                label="Close menus when the pointer moves away"
                checked={settings.menuBar.closeOnLeave}
                hint="A menu or the Control Center goes when you move off it, instead of staying until you click somewhere else. Opened from the keyboard, they stay until you choose or press Escape"
                onChange={(v) => set((d) => void (d.menuBar.closeOnLeave = v))}
              />
            </>
          )}
        </SettingsSection>

        <SettingsSection id="start">
          <p className="settings-note">
            The search button on the dock opens it. It can also be opened from the keyboard with Ctrl+Alt+Space or Ctrl+Esc
            (while keyboard shortcuts are on, under Accessibility). The Windows key still opens Windows' own Start menu.
          </p>
          <AeroToggle
            label="Show recent downloads and files"
            checked={settings.start.showRecommended}
            hint="Under the pinned apps: what was lately downloaded, and the files opened lately"
            onChange={(v) => set((d) => void (d.start.showRecommended = v))}
          />
          <div className="ctl-row">
            <span className="ctl-label">Pinned apps</span>
            <div className="ctl-actions">
              <button
                className="aero-button"
                onClick={() =>
                  set((d) => {
                    // starts again from the dock's pins the next time it opens
                    d.start.pinned = [];
                    d.start.seeded = false;
                  })
                }
              >
                Reset to the dock's
              </button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection id="frame">
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
        </SettingsSection>

        <WidgetsCard
          settings={settings}
          onStatus={(tone, text) => setStatus({ tone, text })}
        />

        <SettingsGroup id="system" />

        <SettingsSection id="accessibility">
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
            hint="Ctrl+Alt+W opens the window overview and Ctrl+Alt+Space (or Ctrl+Esc) the Start menu. Ctrl+Alt+M opens the menu bar and Ctrl+Alt+D the dock, and gives them the keyboard: arrow keys move, Enter chooses, Shift+F10 opens an icon's menu, Escape gives the keyboard back. Screen readers can reach them this way too"
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
        </SettingsSection>

        <SettingsSection id="behavior">
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
        </SettingsSection>

        <SettingsGroup id="about" />

        <SettingsSection id="support" className="settings-support">
          <p className="settings-note settings-support-copy">
            Aero Dock is free and independently developed. If you enjoy using
            it, you can support continued development.
          </p>
          <div className="settings-support-actions">
            <button className="settings-support-cta" onClick={() => void openLink(KOFI_URL)}>
              Support on Ko-fi <span aria-hidden>&rarr;</span>
            </button>
          </div>
        </SettingsSection>

        <SettingsSection id="about">
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
        </SettingsSection>

        <SettingsNoMatch />

        <footer className="settings-footer">
          Aero Dock {__APP_VERSION__} - made with light, water, and glass.
        </footer>
        </main>
      </div>
    </div>
  );
}
