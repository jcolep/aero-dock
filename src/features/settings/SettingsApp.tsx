/**
 * The settings window, laid out as the system settings of a Mac are: a sidebar of sections with their icons (and a
 * search over all of them), and the section chosen on the right, its settings in rounded groups. Every change goes
 * through the settings store → Rust → broadcast, so the dock restyles live while you drag a slider.
 *
 * It is night glass over a dark ground, the same clear material as the dock and Start, and fits itself to any size:
 * rows put their control under their label when there is no room beside it, and a narrow window (or the choice in
 * General) slides the sidebar away off the left edge, to come out when the pointer reaches that edge.
 */

import { humane } from "../../engine/errors/humane";
import { playCue, type Cue } from "../../engine/sound/ui";
import { GlassTips } from "../../engine/tooltip/GlassTips";
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";
import { Fragment, useEffect, useRef, useState } from "react";
import { applyAppearance } from "../../engine/themes/applyTheme";
import { accentForTheme, normalizeHex } from "../../engine/themes/accent";
import { BubbleColor } from "./BubbleColor";
import { ColorSpectrum } from "./ColorSpectrum";
import { ipc } from "../../ipc/commands";
import type { AppearanceSettings, ClickTune, ClickTunes, DockEdge, DockSettings, IconStyle, MarkMotion, MonitorInfoEx, Settings, StorageInfo, SurfaceStyle } from "../../ipc/types";
import { useSettings } from "../../state/settingsStore";
import { KOFI_URL, REPO_URL } from "../../links";
import { AudioCard } from "./AudioCard";
import { ModesCard } from "./ModesCard";
import { WidgetsCard } from "./WidgetsCard";
import { CLICK_ANIMS, FLYOUT_ANIMS, ISLAND_ANIMS, LAUNCH_ANIMS, MAGNIFY_FEELS, MENU_ANIMS, REVEAL_ANIMS, START_ANIMS } from "../../engine/animation/presets";
import { AnimationPicker, ClickPreview, FlyoutPreview, IslandPreview, LaunchPreview, MagnifyPreview, MenuPreview, RevealPreview, StartPreview } from "./AnimationPicker";
import { AeroSegmented, AeroSlider, AeroToggle } from "./controls";
import { SettingsNav } from "./SettingsNav";
import { SettingsNoMatch, SettingsSection, SettingsSub } from "./SettingsSection";
import { SectionIcon } from "./SectionIcon";
import { Droplet } from "../../engine/brand/droplet";
import { ALL_SECTIONS, matches, sectionById } from "./sections";
import { useSettingsUi, type SidebarMode } from "./useSettingsUi";
import "./settings.css";

const pctFmt = (v: number) => `${Math.round(v * 100)}%`;
const pxFmt = (v: number) => `${v}px`;

/** How the dock's focus mark and its ghost can move from app to app. */
const MARK_MOTION_OPTIONS: { value: MarkMotion; label: string }[] = [
  { value: "glide", label: "Glide" },
  { value: "bounce", label: "Bounce" },
  { value: "snap", label: "Snap" },
  { value: "float", label: "Float" },
  { value: "fade", label: "Fade" },
];

/** Below this width the sidebar slides away off the left edge, whatever it is set to. */
const NARROW_PX = 760;
/** How long a message stays at the foot of the page, in ms. */
const STATUS_MS = 6000;

/** What happened, said at the foot of the page whichever section it came from; nothing here needs a modal. */
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
  const rootRef = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  const active = useSettingsUi((s) => s.active);
  const query = useSettingsUi((s) => s.query);
  const sidebar = useSettingsUi((s) => s.sidebar);
  const setSidebar = useSettingsUi((s) => s.setSidebar);
  const setSidebarOut = useSettingsUi((s) => s.setSidebarOut);
  const sidebarOut = useSettingsUi((s) => s.sidebarOut);

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

  // how wide the window is, for the sidebar
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setNarrow(el.clientWidth < NARROW_PX);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [settings === null]);

  // a message goes after a while
  useEffect(() => {
    if (!status) return;
    const t = window.setTimeout(() => setStatus(null), STATUS_MS);
    return () => window.clearTimeout(t);
  }, [status]);

  // The window paints its ground immediately; this is what fills it until
  // settings arrive from Rust (or says so if they never do).
  if (!settings) {
    return (
      <div className="settings-root settings-root-centered" ref={rootRef}>
        {hydrateFailed ? (
          <div className="settings-splash">
            <Droplet size={60} shadow className="settings-orb" />
            <p>Liquidock could not read its settings.</p>
            <p className="settings-splash-hint">Close this window and restart Liquidock from the tray icon.</p>
          </div>
        ) : (
          <div className="settings-splash">
            <Droplet size={60} shadow className="settings-orb settings-orb-pulse" />
            <p>Loading your dock…</p>
          </div>
        )}
      </div>
    );
  }
  const { dock, appearance } = settings;
  const themeColor = normalizeHex(appearance.accent) ?? accentForTheme(appearance.theme);
  const sliding = sidebar === "edge" || narrow;

  const set = (fn: (draft: Settings) => void) => {
    apply(fn).catch((e) => {
      console.error("settings update failed", e);
      setStatus({ tone: "error", text: `Could not save that change: ${humane(e)}` });
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
      setStatus({ tone: "error", text: `Could not change the startup setting: ${humane(e)}` });
    }
  };

  const doImport = async (file: File) => {
    try {
      const json = await file.text();
      await ipc.importSettings(json);
      setStatus({ tone: "ok", text: `Imported settings from ${file.name}.` });
    } catch (e) {
      console.error("import failed", e);
      setStatus({ tone: "error", text: `Could not import that file: ${humane(e)}` });
    }
  };

  const openLink = (url: string) => ipc.launch(url).catch((e) => setStatus({ tone: "error", text: `Could not open the browser: ${humane(e)}` }));
  const onStatus = (tone: "ok" | "error", text: string) => setStatus({ tone, text });

  const shownSection = sectionById(active) ?? ALL_SECTIONS[0];
  const found = query ? ALL_SECTIONS.filter((s) => matches(s, query)).length : 0;

  return (
    <div className="settings-root" ref={rootRef} data-sliding={sliding}>
      <GlassTips side="below" />
      <SettingsNav sliding={sliding} />

      <main className="pane">
        <header className="pane-head">
          {sliding && (
            <button
              type="button"
              className="pane-sidebar-button"
              aria-label={sidebarOut ? "Hide the sidebar" : "Show the sidebar"}
              title={sidebarOut ? "Hide the sidebar" : "Show the sidebar"}
              onClick={() => setSidebarOut(sidebarOut ? null : "click")}
            >
              <svg viewBox="0 0 20 20" aria-hidden>
                <rect x="2.8" y="4" width="14.4" height="12" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7.6 4v12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          )}
          {query ? (
            <div className="pane-title">
              <h1>Search</h1>
              <p>{found === 0 ? "No section matches" : `${found} section${found === 1 ? "" : "s"} for “${query}”`}</p>
            </div>
          ) : (
            <>
              <SectionIcon id={shownSection.id} size={34} />
              <div className="pane-title" key={shownSection.id}>
                <h1>{shownSection.title}</h1>
                <p>{shownSection.blurb}</p>
              </div>
            </>
          )}
        </header>

        <div className="settings-scroll">
          <div className="pane-body" key={query ? "search" : active}>
            {/* ---- Look & feel ---- */}

            <SettingsSection id="color">
              <ColorSpectrum
                value={themeColor}
                onChange={(hex) =>
                  set((d) => {
                    d.appearance.accent = hex;
                    // With "tint from wallpaper" on, the wallpaper's color is
                    // used in place of this one, which would make the picker
                    // look broken. Choosing a color is choosing it over that.
                    d.appearance.wallpaperSync = false;
                  })
                }
              />
              <AeroToggle
                label="Tint from wallpaper"
                checked={appearance.wallpaperSync}
                hint="Take the color from your wallpaper instead. Picking a color above turns this off"
                onChange={(v) => set((d) => void (d.appearance.wallpaperSync = v))}
              />
              <p className="settings-note">Everything is tinted from one color. A dark one makes dark glass with light text; a pale or bright one, light glass.</p>

              <SettingsSub>Materials</SettingsSub>
              <AeroSegmented<SurfaceStyle>
                label="Dock material"
                hint="Liquid carries the color as a thin lens with light at its rim. Clear is neutral glass with a bright edge"
                value={appearance.dockSurface}
                options={[
                  { value: "liquid", label: "Liquid" },
                  { value: "clear", label: "Clear" },
                ]}
                onChange={(v) => set((d) => void (d.appearance.dockSurface = v))}
              />
              <AeroSegmented<IconStyle>
                label="App icons"
                hint="In the dock and the Start menu. Glass adds a body of glass; Clear leaves a frosted shape; Tinted is that in your color"
                value={appearance.iconStyle}
                options={[
                  { value: "plain", label: "Plain" },
                  { value: "glass", label: "Glass" },
                  { value: "clear", label: "Clear" },
                  { value: "tinted", label: "Tinted" },
                ]}
                onChange={(v) => set((d) => void (d.appearance.iconStyle = v))}
              />
            </SettingsSection>

            <SettingsSection id="glass">
              <SettingsSub>Frosted glass</SettingsSub>
              {(
                [
                  ["dock", "Dock", "The dock, its flyouts and menus, its name tags, buttons and notices"],
                  ["menuBar", "Menu bar", "The menu bar, its menus, the Control Center, the media pill and its tips"],
                  ["start", "Start menu", "The Start menu and its menus"],
                ] as const
              ).map(([key, name, what]) => (
                <Fragment key={key}>
                  <AeroToggle
                    label={name}
                    checked={appearance.frost[key].glass ?? appearance.realBlur}
                    hint={what}
                    onChange={(v) => set((d) => void (d.appearance.frost[key].glass = v))}
                  />
                  {(appearance.frost[key].glass ?? appearance.realBlur) && (
                    <AeroSlider
                      label={`${name} frost`}
                      value={Math.min(40, appearance.frost[key].blur)}
                      min={0}
                      max={40}
                      step={1}
                      format={(v) => (v < 1 ? "Clear" : pctFmt(v / 40))}
                      onChange={(v) => set((d) => void (d.appearance.frost[key].blur = v))}
                    />
                  )}
                  <AeroSlider
                    label={`${name} grain`}
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
                Your wallpaper and windows show through, blurred by Windows itself on the graphics card, so standing glass costs
                nothing. Follows Windows' Transparency effects.
              </p>

              <SettingsSub>Light &amp; depth</SettingsSub>
              <AeroToggle
                label="Light that follows the pointer"
                checked={appearance.pointerLight}
                hint="A soft highlight drifts across the dock and the menu bar under the pointer"
                onChange={(v) => set((d) => void (d.appearance.pointerLight = v))}
              />
              <AeroToggle
                label="Fine grain on the glass"
                checked={appearance.glassGrain}
                hint="A barely-there texture that keeps soft gradients from banding. Off turns every grain above off too"
                onChange={(v) => set((d) => void (d.appearance.glassGrain = v))}
              />
              <AeroSlider label="Opacity" value={appearance.transparency} min={0.3} max={1} format={pctFmt} onChange={(v) => set((d) => void (d.appearance.transparency = v))} />
              <AeroSlider label="Glass intensity" value={appearance.glassIntensity} min={0} max={1} format={pctFmt} onChange={(v) => set((d) => void (d.appearance.glassIntensity = v))} />
              <AeroSlider label="Bloom" value={appearance.bloomAmount} min={0} max={1} format={pctFmt} onChange={(v) => set((d) => void (d.appearance.bloomAmount = v))} />
              <AeroSlider label="Reflections" value={appearance.reflectionStrength} min={0} max={1} format={pctFmt} onChange={(v) => set((d) => void (d.appearance.reflectionStrength = v))} />
              <AeroSlider
                label="Dock shadow"
                value={appearance.dockShadow}
                min={0}
                max={1}
                step={0.05}
                format={(v) => (v < 0.01 ? "Off" : pctFmt(v))}
                onChange={(v) => set((d) => void (d.appearance.dockShadow = v))}
              />

              <SettingsSub>Ambient scene</SettingsSub>
              <AeroSegmented<string>
                label="Scene"
                hint="Drifts behind the dock, and in the menu bar and the window frame if they are set to play it"
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
              {appearance.scene !== "none" && (
                <AeroSlider label="Particles" value={appearance.particleDensity} min={0} max={1} format={pctFmt} onChange={(v) => set((d) => void (d.appearance.particleDensity = v))} />
              )}
            </SettingsSection>

            <SettingsSection id="animations">
              <AeroSlider
                label="Animation speed"
                hint="Scales every animation below"
                value={appearance.animationSpeed}
                min={0.5}
                max={2}
                format={(v) => `${v.toFixed(2)}×`}
                onChange={(v) => set((d) => void (d.appearance.animationSpeed = v))}
              />
              <AeroSegmented<AppearanceSettings["hoverEffect"]>
                label="Hover effect"
                hint="What a menu's items and the Control Center's sections do under the pointer"
                value={appearance.hoverEffect ?? "magnify"}
                options={[
                  { value: "magnify", label: "Magnify" },
                  { value: "lift", label: "Lift" },
                  { value: "glow", label: "Glow" },
                  { value: "none", label: "None" },
                ]}
                onChange={(v) => set((d) => void (d.appearance.hoverEffect = v))}
              />

              <SettingsSub>Opening and closing</SettingsSub>
              <p className="settings-note settings-note-lead">Each stage plays your choice as you make it; click it to see it again.</p>
              <AnimationPicker
                label="Menu bar menus"
                summary="The menus and the Control Center"
                value={settings.animations.menu}
                options={MENU_ANIMS}
                onChange={(id) => set((d) => void (d.animations.menu = id))}
                preview={(id, run) => <MenuPreview key={`${id}-${run}`} preset={id} run={run} speed={appearance.animationSpeed} />}
              />
              <AnimationPicker
                label="Media pill and peek"
                summary="The pill in the menu bar, and the card that hangs from the Control Center button"
                value={settings.animations.island}
                options={ISLAND_ANIMS}
                onChange={(id) => set((d) => void (d.animations.island = id))}
                preview={(id, run) => <IslandPreview preset={id} run={run} speed={appearance.animationSpeed} />}
              />
              <AnimationPicker
                label="Start menu"
                summary="Opening and closing the Start menu"
                value={settings.animations.start}
                options={START_ANIMS}
                onChange={(id) => set((d) => void (d.animations.start = id))}
                preview={(id, run) => <StartPreview preset={id} run={run} speed={appearance.animationSpeed} />}
              />
              <AnimationPicker
                label="Dock appears"
                summary="At launch, and with auto-hide"
                value={settings.animations.dockReveal}
                options={REVEAL_ANIMS}
                onChange={(id) => set((d) => void (d.animations.dockReveal = id))}
                preview={(id, run) => <RevealPreview preset={id} run={run} speed={appearance.animationSpeed} />}
              />
              <AnimationPicker
                label="Dock flyouts"
                summary="Window previews, menus, folders, search"
                value={settings.animations.flyout}
                options={FLYOUT_ANIMS}
                onChange={(id) => set((d) => void (d.animations.flyout = id))}
                preview={(id, run) => <FlyoutPreview preset={id} run={run} speed={appearance.animationSpeed} />}
              />
              <AnimationPicker
                label="Launching an app"
                summary="How the icon itself moves when you click it"
                value={settings.animations.launch}
                options={LAUNCH_ANIMS}
                onChange={(id) => set((d) => void (d.animations.launch = id))}
                preview={(id, run) => <LaunchPreview preset={id} run={run} />}
              />
              <AnimationPicker
                label="Click effect"
                summary="What plays on the icon's glass, or behind it, every click"
                value={settings.animations.click}
                options={CLICK_ANIMS}
                onChange={(id) => set((d) => void (d.animations.click = id))}
                preview={(id, run) => <ClickPreview preset={id} run={run} tune={settings.animations.clickTune?.[id as keyof ClickTunes]} />}
              />
              {(() => {
                // the chosen click effect's own tuning: what "size" is depends on the effect
                const effect = settings.animations.click as keyof ClickTunes;
                const tune = settings.animations.clickTune?.[effect] ?? { speed: 1, opacity: 1, size: 1, color: "" };
                const setTune = (change: (t: ClickTune) => void) =>
                  set((d) => {
                    d.animations.clickTune ??= {} as ClickTunes;
                    d.animations.clickTune[effect] ??= { speed: 1, opacity: 1, size: 1, color: "" };
                    change(d.animations.clickTune[effect]);
                  });
                const sizeLabel = { halo: "Line thickness", shine: "Band width", dimple: "Ring thickness", bloom: "Size" }[effect] ?? "Size";
                const times = (v: number) => `${v.toFixed(2)}×`;
                return (
                  <div className="click-tune">
                    <AeroSlider label="Speed" value={tune.speed} min={0.25} max={3} step={0.05} format={times} onChange={(v) => setTune((t) => void (t.speed = v))} />
                    <AeroSlider label="Opacity" value={tune.opacity} min={0.1} max={1.5} step={0.05} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => setTune((t) => void (t.opacity = v))} />
                    <AeroSlider label={sizeLabel} value={tune.size} min={0.25} max={3} step={0.05} format={times} onChange={(v) => setTune((t) => void (t.size = v))} />
                    <BubbleColor
                      label="Color"
                      value={tune.color}
                      themeColor={effect === "bloom" ? themeColor : "#ffffff"}
                      defaultName={effect === "bloom" ? "Follow the theme" : "White light"}
                      onChange={(hex) => setTune((t) => void (t.color = hex))}
                    />
                  </div>
                );
              })()}
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
                hint="Draw with the graphics card instead of the processor: smoother on a fast screen, about 60 MB more memory. Takes effect after a restart"
                onChange={(v) => set((d) => void (d.appearance.hardwareAcceleration = v))}
              />
              <div className="ctl-row">
                <span className="ctl-label">Apply it</span>
                <div className="ctl-actions">
                  <button className="aero-button" onClick={() => ipc.restartApp().catch((e) => setStatus({ tone: "error", text: `Could not restart: ${humane(e)}` }))}>
                    Restart Liquidock
                  </button>
                </div>
              </div>
              <AeroToggle
                label="Show frame timings"
                checked={appearance.frameOverlay}
                hint="A small table at the top left of the main screen: every window's frames a second, its slowest frames, in green, amber or red. A diagnostic: it keeps every window drawing, so turn it off when you are done"
                onChange={(v) => set((d) => void (d.appearance.frameOverlay = v))}
              />
              {appearance.frameOverlay && (
                <div className="ctl-row">
                  <span className="ctl-label">Frame timings report</span>
                  <div className="ctl-actions">
                    <button
                      className="aero-button"
                      onClick={() =>
                        ipc
                          .frameReport()
                          .then(() => setStatus({ tone: "ok", text: "Saved frame-report.txt in Liquidock's data folder." }))
                          .catch((e) => setStatus({ tone: "error", text: `Could not save the report: ${humane(e)}` }))
                      }
                    >
                      Save a report
                    </button>
                  </div>
                </div>
              )}
            </SettingsSection>

            {/* ---- Dock ---- */}

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
                label="Automatically hide the dock"
                checked={dock.autoHide}
                hint="It slides away, and comes back when the pointer reaches the screen edge"
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
              <AeroToggle
                label="Floating"
                checked={dock.floating}
                hint="Held a little way off the screen edge"
                onChange={(v) => set((d) => void (d.dock.floating = v))}
              />
              {dock.floating && (
                <AeroSlider label="Edge gap" value={dock.floatingMargin} min={0} max={32} step={1} format={pxFmt} onChange={(v) => set((d) => void (d.dock.floatingMargin = v))} />
              )}
              {!dock.autoHide && (
                <AeroToggle
                  label="Reserve screen space"
                  checked={dock.reserveSpace}
                  hint="Maximised windows stop at the dock, as they do at the Windows taskbar"
                  onChange={(v) => set((d) => void (d.dock.reserveSpace = v))}
                />
              )}

              <SettingsSub>Icons</SettingsSub>
              <AeroSlider label="Icon size" value={dock.iconSize} min={16} max={80} step={2} format={pxFmt} onChange={(v) => set((d) => void (d.dock.iconSize = v))} />
              <AeroSlider label="Icon spacing" value={dock.iconSpacing} min={0} max={32} step={1} format={pxFmt} onChange={(v) => set((d) => void (d.dock.iconSpacing = v))} />
              <AeroSlider label="Dock padding" value={dock.padding} min={2} max={24} step={1} format={pxFmt} onChange={(v) => set((d) => void (d.dock.padding = v))} />
              <AeroToggle label="Magnification" checked={dock.magnification} hint="Icons swell under the pointer" onChange={(v) => set((d) => void (d.dock.magnification = v))} />
              {dock.magnification && (
                <>
                  <AeroSlider
                    label="Amount"
                    value={dock.magnificationScale}
                    min={1.1}
                    max={2}
                    step={0.05}
                    format={(v) => `${Math.round((v - 1) * 100)}%`}
                    onChange={(v) => set((d) => void (d.dock.magnificationScale = v))}
                  />
                  <AeroSlider
                    label="Lift"
                    value={dock.magnificationLift}
                    min={0}
                    max={0.5}
                    step={0.01}
                    format={(v) => (v === 0 ? "None" : `${Math.round(v * 100)}%`)}
                    onChange={(v) => set((d) => void (d.dock.magnificationLift = v))}
                  />
                  <AeroSlider
                    label="Reach"
                    value={dock.magnificationReach}
                    min={1.5}
                    max={4.5}
                    step={0.1}
                    format={(v) => `${v.toFixed(1)} icons`}
                    onChange={(v) => set((d) => void (d.dock.magnificationReach = v))}
                  />
                </>
              )}

              <SettingsSub>Running apps</SettingsSub>
              <AeroToggle
                label="Show running apps"
                checked={dock.showRunningApps}
                hint="Apps that are open but not pinned get a place on the dock, after a divider"
                onChange={(v) => set((d) => void (d.dock.showRunningApps = v))}
              />
              <AeroSegmented<"dots" | "focus">
                label="Marks"
                value={dock.indicatorStyle}
                hint={dock.indicatorStyle === "focus" ? "Point at another app and a ghost slides over; click, and the mark moves there" : undefined}
                options={[
                  { value: "dots", label: "A dot under each" },
                  { value: "focus", label: "One, under the front app" },
                ]}
                onChange={(v) => set((d) => void (d.dock.indicatorStyle = v))}
              />
              <BubbleColor
                label="Running app mark"
                value={dock.markColor}
                themeColor={themeColor}
                onChange={(hex) => set((d) => void (d.dock.markColor = hex))}
              />
              {dock.indicatorStyle === "focus" && (
                <>
                  <AeroSegmented<"pill" | "dot">
                    label="Shape"
                    value={dock.indicatorShape}
                    options={[
                      { value: "pill", label: "Pill" },
                      { value: "dot", label: "Glowing dot" },
                    ]}
                    onChange={(v) => set((d) => void (d.dock.indicatorShape = v))}
                  />
                  <AeroSegmented<"dots" | "halo" | "dim" | "none">
                    label="Other running apps show"
                    value={dock.runningCue}
                    options={[
                      { value: "dots", label: "Faint marks" },
                      { value: "halo", label: "Halo" },
                      { value: "dim", label: "Others dimmed" },
                      { value: "none", label: "Nothing" },
                    ]}
                    onChange={(v) => set((d) => void (d.dock.runningCue = v))}
                  />
                  <AeroSegmented<MarkMotion> label="Mark moves" value={dock.focusMotion} options={MARK_MOTION_OPTIONS} onChange={(v) => set((d) => void (d.dock.focusMotion = v))} />
                  <AeroSegmented<MarkMotion> label="Ghost moves" value={dock.ghostMotion} options={MARK_MOTION_OPTIONS} onChange={(v) => set((d) => void (d.dock.ghostMotion = v))} />
                  <AeroSlider
                    label="Stretch with speed"
                    hint="Drawn out longer the faster it goes"
                    value={dock.markStretch}
                    min={0}
                    max={1}
                    step={0.05}
                    format={(v) => (v === 0 ? "Off" : `${Math.round(v * 100)}%`)}
                    onChange={(v) => set((d) => void (d.dock.markStretch = v))}
                  />
                </>
              )}
              <AeroSlider label="Gap under the icons" value={dock.indicatorGap} min={0} max={16} step={1} format={pxFmt} onChange={(v) => set((d) => void (d.dock.indicatorGap = v))} />
              <AeroToggle
                label="Bounce an icon when its app needs you"
                checked={dock.attentionBounce}
                hint="An app that flashes its taskbar button makes its icon hop, until you switch to it"
                onChange={(v) => set((d) => void (d.dock.attentionBounce = v))}
              />

              <SettingsSub>Look</SettingsSub>
              {dock.cornerRadius !== null && (
                <AeroSlider label="Corner radius" value={dock.cornerRadius} min={0} max={48} step={1} format={pxFmt} onChange={(v) => set((d) => void (d.dock.cornerRadius = v))} />
              )}
              <AeroToggle
                label="Tinted with the theme color"
                checked={dock.tintWithTheme}
                hint="The dock's glass takes the color from Color & materials. Off, it is plain glass"
                onChange={(v) => set((d) => void (d.dock.tintWithTheme = v))}
              />
              {dock.tintWithTheme && (
                <AeroSlider label="Tint" value={dock.tint} min={0} max={1.5} step={0.05} format={pctFmt} onChange={(v) => set((d) => void (d.dock.tint = v))} />
              )}

              <SettingsSub>Behaviour</SettingsSub>
              <AeroSegmented<"endTask" | "close">
                label="Middle click on an app"
                hint={
                  dock.middleClick === "endTask"
                    ? "Ends the app at once, as Task Manager does, so a hung one goes too; anything unsaved is lost"
                    : "Asks each window to close, so an app with unsaved work can ask first"
                }
                value={dock.middleClick}
                options={[
                  { value: "endTask", label: "End Task" },
                  { value: "close", label: "Close windows" },
                ]}
                onChange={(v) => set((d) => void (d.dock.middleClick = v))}
              />
              <AeroSegmented<DockSettings["minimizeEffect"]>
                label="Minimise effect"
                hint="A window minimised from the dock pours into its icon, and back out. Follows Reduce motion"
                value={dock.minimizeEffect}
                options={[
                  { value: "genie", label: "Genie" },
                  { value: "scale", label: "Scale" },
                  { value: "off", label: "None" },
                ]}
                onChange={(v) => set((d) => void (d.dock.minimizeEffect = v))}
              />
            </SettingsSection>

            <SettingsSection id="dock-items">
              <AeroToggle label="Liquidock button" checked={dock.showSearchButton} hint="The drop at the left end of the dock, which opens Start" onChange={(v) => set((d) => void (d.dock.showSearchButton = v))} />
              {dock.showSearchButton && (
                <AeroSegmented<"sweep" | "caustic" | "rim">
                  label="It shines with"
                  value={dock.startShine}
                  options={[
                    { value: "sweep", label: "A glint" },
                    { value: "caustic", label: "A swell" },
                    { value: "rim", label: "A rim trace" },
                  ]}
                  onChange={(v) => set((d) => void (d.dock.startShine = v))}
                />
              )}
              <AeroToggle label="Settings button" checked={dock.showSettingsButton} onChange={(v) => set((d) => void (d.dock.showSettingsButton = v))} />
              <AeroToggle
                label="Reveal them on hover"
                checked={dock.revealControls}
                hint="Hidden until the pointer reaches the left end (Search) or the clock end (Settings). Horizontal docks only"
                onChange={(v) => set((d) => void (d.dock.revealControls = v))}
              />
              {dock.revealControls && (
                <AeroSlider
                  label="How close to the end"
                  value={dock.revealZone}
                  min={16}
                  max={120}
                  step={4}
                  format={pxFmt}
                  hint="How near the pointer must get to the dock's end before its button appears. Smaller means further to travel"
                  onChange={(v) => set((d) => void (d.dock.revealZone = v))}
                />
              )}
              <AeroToggle label="Clock and date" checked={dock.showClock} onChange={(v) => set((d) => void (d.dock.showClock = v))} />
              <AeroToggle label="Battery, network, volume, Recycle Bin" checked={dock.showSystemStatus} onChange={(v) => set((d) => void (d.dock.showSystemStatus = v))} />
              {dock.showSystemStatus && (
                <AeroSlider label="Status icon size" value={dock.statusIconSize} min={10} max={32} step={1} format={pxFmt} onChange={(v) => set((d) => void (d.dock.statusIconSize = v))} />
              )}
              {settings.menuBar.enabled && settings.menuBar.takesOverDockStatus && (
                <p className="settings-note">The clock and status icons are in the menu bar while it is on (Menu bar › What the bar shows).</p>
              )}
            </SettingsSection>

            <ModesCard settings={settings} onStatus={onStatus} />
            <AudioCard settings={settings} onStatus={onStatus} />

            {/* ---- Desktop ---- */}

            <SettingsSection id="menubar">
              <AeroToggle
                label="Show a menu bar along the top"
                checked={settings.menuBar.enabled}
                hint="The app in front on the left; status items, search, the Control Center and the clock on the right. Windows stop below it"
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
                    format={pxFmt}
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
                  <AeroSlider label="Corner radius" value={settings.menuBar.cornerRadius} min={0} max={24} step={1} format={pxFmt} onChange={(v) => set((d) => void (d.menuBar.cornerRadius = v))} />
                  <AeroSlider label="Tint" value={settings.menuBar.tint} min={0.2} max={2} step={0.05} format={pctFmt} onChange={(v) => set((d) => void (d.menuBar.tint = v))} />
                  <AeroSlider label="Item spacing" value={settings.menuBar.itemSpacing} min={0} max={16} step={1} format={pxFmt} onChange={(v) => set((d) => void (d.menuBar.itemSpacing = v))} />
                  <AeroSlider label="Text size" value={settings.menuBar.fontSize} min={11} max={17} step={1} format={pxFmt} onChange={(v) => set((d) => void (d.menuBar.fontSize = v))} />
                  <AeroToggle
                    label="Light along the bar's edge"
                    checked={settings.menuBar.edgeHighlight}
                    hint="The thin bright rim that makes the bar read as glass"
                    onChange={(v) => set((d) => void (d.menuBar.edgeHighlight = v))}
                  />
                  <AeroToggle
                    label="Play the ambient scene in the bar"
                    checked={settings.menuBar.ambient}
                    hint="The scene from Glass & light, kept inside the bar. Rests while you are away"
                    onChange={(v) => set((d) => void (d.menuBar.ambient = v))}
                  />

                  <SettingsSub>The lens</SettingsSub>
                  <AeroSlider
                    label="Size"
                    hint="How far the sliding glass reaches past a button, here and in the Start menu"
                    value={settings.menuBar.lensGrow}
                    min={0}
                    max={10}
                    step={1}
                    format={(v) => (v === 0 ? "Snug" : `+${v}px`)}
                    onChange={(v) => set((d) => void (d.menuBar.lensGrow = v))}
                  />
                  <AeroSlider
                    label="Magnification"
                    hint="How much the button under it swells"
                    value={settings.menuBar.lensMagnify}
                    min={1}
                    max={1.3}
                    step={0.01}
                    format={(v) => (v <= 1.001 ? "None" : `${Math.round((v - 1) * 100)}%`)}
                    onChange={(v) => set((d) => void (d.menuBar.lensMagnify = v))}
                  />
                  <AeroSlider
                    label="Warp"
                    hint="How much it bends what is under its edge"
                    value={settings.menuBar.lensWarp}
                    min={0}
                    max={2}
                    step={0.05}
                    format={(v) => (v < 0.02 ? "Clear" : `${Math.round(v * 100)}%`)}
                    onChange={(v) => set((d) => void (d.menuBar.lensWarp = v))}
                  />

                  <SettingsSub>What the bar shows</SettingsSub>
                  <AeroToggle
                    label="Clock and status icons live here, not in the dock"
                    checked={settings.menuBar.takesOverDockStatus}
                    hint="The dock keeps to apps. Off, they show in both"
                    onChange={(v) => set((d) => void (d.menuBar.takesOverDockStatus = v))}
                  />
                  <AeroToggle
                    label="Camera and microphone dots"
                    checked={settings.menuBar.showPrivacy}
                    hint="Green while an app uses the camera, orange for the microphone. Click to see which"
                    onChange={(v) => set((d) => void (d.menuBar.showPrivacy = v))}
                  />
                  <AeroToggle
                    label="CPU, memory and network"
                    checked={settings.menuBar.showStats}
                    hint="A live readout. Click it for the busiest apps"
                    onChange={(v) => set((d) => void (d.menuBar.showStats = v))}
                  />
                  <AeroToggle label="Date beside the time" checked={settings.menuBar.showDate} onChange={(v) => set((d) => void (d.menuBar.showDate = v))} />
                  <AeroToggle
                    label="Seconds in the clock"
                    checked={settings.menuBar.showSeconds}
                    hint="The bar wakes once a second to turn them over"
                    onChange={(v) => set((d) => void (d.menuBar.showSeconds = v))}
                  />

                  <SettingsSub>Now Playing</SettingsSub>
                  <AeroToggle
                    label="Media pill in the middle of the bar"
                    checked={settings.menuBar.mediaIsland}
                    hint="While something plays, rest the pointer in the middle of the bar and a pill slides out with the cover and the controls"
                    onChange={(v) => set((d) => void (d.menuBar.mediaIsland = v))}
                  />
                  {settings.menuBar.mediaIsland && (
                    <AeroToggle
                      label="Keep it out while something plays"
                      checked={settings.menuBar.mediaIslandPinned}
                      hint="Instead of waiting for the pointer"
                      onChange={(v) => set((d) => void (d.menuBar.mediaIslandPinned = v))}
                    />
                  )}
                  <AeroToggle
                    label="Peek from the Control Center button"
                    checked={settings.menuBar.mediaPeek}
                    hint="Rest the pointer on the button while something plays and its Now Playing card hangs from it"
                    onChange={(v) => set((d) => void (d.menuBar.mediaPeek = v))}
                  />

                  <SettingsSub>The Control Center</SettingsSub>
                  <BubbleColor label="Wi-Fi circle" value={settings.menuBar.wifiColor} themeColor={themeColor} onChange={(hex) => set((d) => void (d.menuBar.wifiColor = hex))} />
                  <BubbleColor label="Bluetooth circle" value={settings.menuBar.bluetoothColor} themeColor={themeColor} onChange={(hex) => set((d) => void (d.menuBar.bluetoothColor = hex))} />
                  <AeroToggle
                    label="Now Playing takes its colors from the cover"
                    checked={settings.menuBar.mediaTint}
                    hint="Tinted with the album art, or a video's thumbnail from a browser"
                    onChange={(v) => set((d) => void (d.menuBar.mediaTint = v))}
                  />
                  <AeroToggle
                    label="Sound wave while music plays"
                    checked={settings.menuBar.mediaSpectrum}
                    hint="Moving bars in the Now Playing card. Listens to what the speakers play while the card is open; nothing is recorded"
                    onChange={(v) => set((d) => void (d.menuBar.mediaSpectrum = v))}
                  />

                  <SettingsSub>Menus</SettingsSub>
                  <AeroToggle
                    label="Close when the pointer moves away"
                    checked={settings.menuBar.closeOnLeave}
                    hint="A menu or the Control Center goes when you move off it. Opened from the keyboard, they stay until you choose or press Escape"
                    onChange={(v) => set((d) => void (d.menuBar.closeOnLeave = v))}
                  />
                  <AeroToggle
                    label="Hide for full-screen apps"
                    checked={settings.menuBar.hideForFullscreen !== false}
                    hint="A video, game or slideshow gone full screen on the bar's monitor has the whole screen; the bar comes back when it leaves full screen"
                    onChange={(v) => set((d) => void (d.menuBar.hideForFullscreen = v))}
                  />
                </>
              )}
            </SettingsSection>

            <SettingsSection id="start">
              <AeroToggle
                label="The Windows key opens it"
                checked={settings.start.windowsKey}
                hint="Press and let go of the Windows key on its own for this Start menu; Ctrl+Win opens Windows' own. Shortcuts like Win+E and Win+D work as always. Not while an app running as administrator has the keyboard"
                onChange={(v) => set((d) => void (d.start.windowsKey = v))}
              />
              <AeroSegmented<"usable" | "hidden">
                label="The dock while it is open"
                value={settings.start.dockWhileOpen ?? "usable"}
                options={[
                  { value: "usable", label: "Usable" },
                  { value: "hidden", label: "Hidden" },
                ]}
                hint="Usable: the dock comes up and can be clicked, which closes the menu and does what you clicked, as with the taskbar. Hidden: the dock stays out of sight until the menu closes"
                onChange={(v) => set((d) => void (d.start.dockWhileOpen = v))}
              />
              <AeroToggle
                label="Recent downloads and files"
                checked={settings.start.showRecommended}
                hint="Under the pinned apps: what was lately downloaded, and the files opened lately"
                onChange={(v) => set((d) => void (d.start.showRecommended = v))}
              />
              <AeroToggle
                label="Keep text readable over light backgrounds"
                checked={settings.start.adaptiveTint !== false}
                hint="Where what is behind the menu (or the dock's window previews) is light, its glass is darkened there, and the text given a soft shadow. Measured once as it opens, so nothing shifts while it is open"
                onChange={(v) => set((d) => void (d.start.adaptiveTint = v))}
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
              <p className="settings-note">
                Opened by the Liquidock button on the dock, or Ctrl+Alt+Space and Ctrl+Esc while keyboard shortcuts are on,
                and by the Windows key if that is switched on above.
              </p>
            </SettingsSection>

            <SettingsSection id="frame">
              <AeroToggle
                label="Hold maximised apps in a frame of glass"
                checked={settings.frame.enabled}
                hint="A margin of tinted glass round the free space on every monitor. Maximised apps sit inside it with rounded corners. Steps aside for full-screen games and video"
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
                    format={pxFmt}
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
                    label="Tint"
                    hint="Relative to the menu bar's"
                    value={settings.frame.tint}
                    min={0.2}
                    max={2}
                    step={0.05}
                    format={pctFmt}
                    onChange={(v) => set((d) => void (d.frame.tint = v))}
                  />
                  <AeroToggle
                    label="Play the ambient scene in the margin"
                    checked={settings.frame.ambient}
                    hint="The scene from Glass & light, kept inside the margin. Rests while you are away"
                    onChange={(v) => set((d) => void (d.frame.ambient = v))}
                  />
                  <AeroToggle
                    label="A glass border round the apps"
                    checked={settings.frame.glassBorder}
                    hint="A bevel of glass along the opening: a bright edge catching the light from above"
                    onChange={(v) => set((d) => void (d.frame.glassBorder = v))}
                  />
                  {settings.frame.glassBorder && (
                    <AeroSlider label="Border width" value={settings.frame.borderWidth} min={1} max={10} step={1} format={pxFmt} onChange={(v) => set((d) => void (d.frame.borderWidth = v))} />
                  )}
                  <p className="settings-note">An app running as administrator cannot be shaped by Liquidock, and keeps its square corners.</p>
                </>
              )}
            </SettingsSection>

            <WidgetsCard settings={settings} onStatus={onStatus} />

            {/* ---- System ---- */}

            <SettingsSection id="accessibility">
              <AeroSegmented<"system" | "on" | "off">
                label="Reduce motion"
                hint="Things arrive without travelling: no sliding lens, no particles, no bounces"
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
                hint="The glass turns solid and the frosted blur off"
                value={settings.accessibility.reduceTransparency}
                options={[
                  { value: "system", label: "Follow Windows" },
                  { value: "on", label: "Always" },
                  { value: "off", label: "Never" },
                ]}
                onChange={(v) => set((d) => void (d.accessibility.reduceTransparency = v))}
              />
              <p className="settings-note">Follow Windows uses Animation effects and Transparency effects in Windows Settings › Accessibility › Visual effects.</p>

              <SettingsSub>Keyboard and sound</SettingsSub>
              <AeroToggle
                label="Keyboard shortcuts"
                checked={settings.accessibility.keyboardShortcuts}
                hint="Ctrl+Alt+W the window overview, Ctrl+Alt+Space the Start menu, Ctrl+Alt+M the menu bar and Ctrl+Alt+D the dock: arrow keys move, Enter chooses, Escape gives the keyboard back"
                onChange={(v) => set((d) => void (d.accessibility.keyboardShortcuts = v))}
              />
              <AeroToggle
                label="Soft interface sounds"
                checked={settings.accessibility.uiSounds}
                hint="Quiet tones, all in one key, that sit under music that is playing"
                onChange={(v) => set((d) => void (d.accessibility.uiSounds = v))}
              />
              {settings.accessibility.uiSounds && (
                <>
                  <AeroSlider
                    label="Sound volume"
                    value={settings.accessibility.uiSoundVolume}
                    min={0}
                    max={1}
                    step={0.05}
                    format={pctFmt}
                    onChange={(v) => set((d) => void (d.accessibility.uiSoundVolume = v))}
                  />
                  <div className="ctl-row">
                    <span className="ctl-label">Hear them</span>
                    <div className="ctl-actions">
                      <button
                        className="aero-button"
                        onClick={() => {
                          // a menu, a switch on and off, the lens, and the Start menu: in the order they are met
                          const run: Array<[Cue, number]> = [["open", 0], ["close", 450], ["on", 900], ["off", 1350], ["tick", 1800], ["startOpen", 2200], ["startClose", 3000]];
                          for (const [cue, at] of run) window.setTimeout(() => playCue(cue), at);
                        }}
                      >
                        Play the sounds
                      </button>
                    </div>
                  </div>
                </>
              )}
            </SettingsSection>

            <SettingsSection id="behavior">
              <AeroToggle label="Start Liquidock when I sign in" checked={settings.launchAtStartup} onChange={toggleStartup} />
              <AeroToggle
                label="Hide the Windows taskbar"
                checked={settings.hideTaskbar}
                hint="Puts the taskbar into auto-hide so Liquidock is your bar; it comes back when you quit"
                onChange={(v) => {
                  ipc.setTaskbarHidden(v).catch((e) => {
                    console.error("taskbar toggle failed", e);
                    setStatus({ tone: "error", text: `Could not change the taskbar: ${humane(e)}` });
                  });
                  set((d) => void (d.hideTaskbar = v));
                }}
              />

              <SettingsSub>This window</SettingsSub>
              <AeroSegmented<SidebarMode>
                label="Sidebar"
                hint="Slid away, it comes out when the pointer reaches the window's left edge. A narrow window always slides it away"
                value={sidebar}
                options={[
                  { value: "always", label: "Always shown" },
                  { value: "edge", label: "Slides in at the edge" },
                ]}
                onChange={setSidebar}
              />

              <SettingsSub>Your settings</SettingsSub>
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
                          setStatus({ tone: "error", text: `Could not export settings: ${humane(e)}` });
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
                      if (f) void doImport(f);
                      e.target.value = "";
                    }}
                  />
                </div>
              </div>
              <div className="ctl-row">
                <span className="ctl-label">Quit Liquidock</span>
                <div className="ctl-actions">
                  <button className="aero-button aero-button-danger" onClick={() => ipc.quitApp().catch((e) => setStatus({ tone: "error", text: `Could not quit: ${humane(e)}` }))}>
                    Quit
                  </button>
                </div>
              </div>
              <p className="settings-note">Quit is also on the tray icon's right-click menu.</p>
            </SettingsSection>

            {/* ---- Liquidock ---- */}

            <SettingsSection id="support" className="settings-support">
              <div className="settings-support-card">
                <Droplet size={56} shadow className="settings-orb" />
                <p>Liquidock is free and independently made. If you enjoy it, you can help keep it going.</p>
                <button className="settings-support-cta" onClick={() => void openLink(KOFI_URL)}>
                  Support on Ko-fi <span aria-hidden>&rarr;</span>
                </button>
              </div>
            </SettingsSection>

            <SettingsSection id="about">
              <div className="ctl-row">
                <span className="ctl-label">Version</span>
                <span className="settings-about-value">Liquidock {__APP_VERSION__}</span>
              </div>
              {storage && (
                <div className="ctl-row">
                  <div className="ctl-text-block">
                    <span className="ctl-label">Storage</span>
                    <span className="ctl-hint settings-path" title={storage.dataDir}>
                      {storage.dataDir}
                    </span>
                  </div>
                  <span className="settings-about-value">{storage.portable ? "Portable" : "Installed"}</span>
                </div>
              )}
              <div className="ctl-row">
                <span className="ctl-label">Project</span>
                <div className="ctl-actions">
                  <button className="aero-button" onClick={() => void openLink(REPO_URL)}>
                    View on GitHub
                  </button>
                </div>
              </div>
              <p className="settings-note">Liquidock {__APP_VERSION__}, made with light, water and glass.</p>
            </SettingsSection>

            <SettingsNoMatch />
          </div>
        </div>

        {status && (
          <p className="settings-status" data-tone={status.tone} role="status" onClick={() => setStatus(null)}>
            {status.text}
          </p>
        )}
      </main>
    </div>
  );
}
