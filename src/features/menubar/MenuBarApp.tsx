/**
 * The menu bar: a strip along the top of the screen, after the macOS one.
 *
 * Left: the Aero menu (about, settings, sleep, restart, shut down, lock, log
 * out), then the name of the app in front, in bold, with its own menu (hide,
 * hide others, quit). Right: the battery, the Control Center (which also
 * holds the Wi-Fi and volume controls), search, Windows Settings, and the
 * date and time, which opens the notification centre.
 *
 * This is a window of its own, much taller than the strip, with all but the
 * strip clipped away by Rust until a menu is open. An open menu takes the
 * keyboard focus so that a click anywhere else, in another app, closes it,
 * and gives the focus back to the app that had it when the menu closes.
 */

import { Roll } from "../../engine/type/Roll";
import { useGlass } from "../../engine/backdrop/useGlass";
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";
import { Droplet } from "../../engine/brand/droplet";
import { GlassTips } from "../../engine/tooltip/GlassTips";
import { listen } from "@tauri-apps/api/event";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isSceneKind } from "../../engine/effects/fx2d";
import { animationsOf, menuExitMs } from "../../engine/animation/presets";
import { useReduced } from "../../engine/accessibility/policy";
import { applyAppearance } from "../../engine/themes/applyTheme";
import { ipc } from "../../ipc/commands";
import { EVENTS } from "../../ipc/types";
import { reverseEntrance } from "./interrupt";
import { playCue } from "../../engine/sound/ui";
import { usePointerLight } from "../../engine/light/usePointerLight";
import { useUserIdle } from "../../state/idleStore";
import { appName as officialAppName, useAppNames, useRunning } from "../../state/runningStore";
import { useSettings } from "../../state/settingsStore";
import { useSystem } from "../../state/systemStore";
import { notify } from "../feedback/toastStore";
import { BatteryGlyph } from "../widgets/WidgetCluster";
import { BarClock } from "./BarClock";
import { MediaIsland } from "./MediaIsland";
import { MediaPeek, usePeek } from "./MediaPeek";
import { BarScene } from "./BarScene";
import { Calendar } from "./Calendar";
import { PrivacyDots, PrivacyPanel, privacySummary, usePrivacyUse } from "./Privacy";
import { StatsPanel, StatsSparkline, useStatsLabel } from "./Stats";
import { startStatsPolling } from "../../state/statsStore";
import { ControlCenter } from "./ControlCenter";
import { useLens, type LensLook } from "./Lens";
import "./menubar.css";

/** Logical px of window under the bar, for an open menu or the Control
 *  Center. Matches PANEL_ROOM in menubar.rs. */
const PANEL_ROOM = 700;

/** Width of the Control Center panel. Matches `.mb-panel` in the stylesheet. */
const PANEL_WIDTH = 340;
/** and the calendar's. */
const CALENDAR_WIDTH = 300;
/** and the stats popover's and the privacy note's. */
const STATS_WIDTH = 320;
const PRIVACY_WIDTH = 280;


type MenuId = "apple" | "app" | "control" | "calendar" | "stats" | "privacy";

interface OpenMenu {
  id: MenuId;
  /** Left edge of the item that opened it, where a dropdown lines up. */
  x: number;
  /** Middle of that item: the point the menu grows out of. */
  cx: number;
  /** Opened by moving from another menu rather than from none: it appears
   *  in place without the entrance, as menus do when you slide along a bar. */
  instant: boolean;
}

interface MenuItem {
  label: string;
  /** The action moves the focus somewhere itself (a window is hidden or
   *  closed), so it must not be handed back to the app that had it. */
  movesFocus?: boolean;
  run?: () => void | Promise<unknown>;
  separatorAbove?: boolean;
}

/** Liquidock's drop, in the theme's color, where a Mac has its apple. */
function Logo() {
  return <Droplet size={17} />;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <line x1="15" y1="15" x2="20.5" y2="20.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The outline of a gear, after Apple's: eight broad teeth with softened
 * corners round a hub, drawn as one stroked path (round joins do the
 * softening) with a ring in the middle. Worked out from the angles once, here,
 * rather than written out as numbers.
 */
const GEAR_PATH = (() => {
  const teeth = 8;
  const tip = 9.6; // radius to the outside of a tooth
  const root = 7.5; // radius of the body between teeth
  const point = (radius: number, degrees: number) => {
    const a = ((degrees - 90) * Math.PI) / 180;
    return `${(12 + radius * Math.cos(a)).toFixed(2)} ${(12 + radius * Math.sin(a)).toFixed(2)}`;
  };
  const step = 360 / teeth;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    d += `${i === 0 ? "M" : "L"}${point(root, a - 13)} `;
    d += `L${point(tip, a - 7.5)} L${point(tip, a + 7.5)} L${point(root, a + 13)} `;
    d += `A${root} ${root} 0 0 1 ${point(root, a + step - 13)} `;
  }
  return `${d}Z`;
})();

/** Windows Settings: a gear, as the Mac's System Settings has. */
function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        d={GEAR_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/**
 * The Control Center's own icon: two toggle switches, one on and one off, so
 * it reads as "controls" at a glance. The top one is a solid pill with the
 * knob cut out of it, on the right; the bottom one is an outline with the
 * knob on the left. At bar size the old pair of thin outlines blurred into
 * each other.
 */
function ControlIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <defs>
        <mask id="mb-cc-knob">
          <rect width="24" height="24" fill="#fff" />
          <circle cx="16.8" cy="7.5" r="2.7" fill="#000" />
        </mask>
      </defs>
      <rect x="2" y="3" width="20" height="9" rx="4.5" fill="currentColor" mask="url(#mb-cc-knob)" />
      <rect x="2.85" y="13.35" width="18.3" height="7.8" rx="3.9" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="7.2" cy="17.25" r="2.5" fill="currentColor" />
    </svg>
  );
}

/** The width of the window, which is the width of the screen the bar is on. */
function useWindowWidth(): number {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    // a resize before this listener was there would otherwise be missed
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

export function MenuBarApp() {
  const menuBarGlass = useGlass("menuBar");
  const { settings, hydrate } = useSettings();
  const windowWidth = useWindowWidth();
  const { windows, focused, hydrate: hydrateRunning } = useRunning();
  const { status, hydrate: hydrateSystem } = useSystem();
  const hydrateIdle = useUserIdle((s) => s.hydrate);

  const [open, setOpen] = useState<OpenMenu | null>(null);
  // the Now Playing card that hangs from the Control Center button while the pointer rests on it
  const peek = usePeek({ enabled: settings?.menuBar.mediaPeek ?? false, suspended: open !== null });
  const [peekRoom, setPeekRoom] = useState(false);
  // the sliding lens under the buttons, and light that follows the pointer
  const reduced = useReduced();
  // the privacy dots, and the load graph (read while the bar is showing it)
  const privacyUses = usePrivacyUse(settings?.menuBar.showPrivacy ?? false);
  const statsOn = settings?.menuBar.showStats ?? false;
  useEffect(() => (statsOn ? startStatsPolling() : undefined), [statsOn]);
  const statsLabel = useStatsLabel();
  const lensLook = useMemo<LensLook>(() => ({ grow: settings?.menuBar.lensGrow ?? 3, warp: settings?.menuBar.lensWarp ?? 1, still: reduced.motion }), [settings?.menuBar.lensGrow, settings?.menuBar.lensWarp, reduced.motion]);
  const { barRef, Lens, handlers: lensHandlers } = useLens(open?.id ?? null, lensLook);
  const pointerLight = usePointerLight();
  // A menu that has just closed, kept on screen while its exit plays. The part
  // of the window that shows is sized to what is open, and giving that space
  // back the moment a menu closes would clip the exit away. It is set in the
  // same step that closes the menu (see `closeMenu`), never afterwards: set
  // from an effect, there is one render in between with nothing shown, which
  // removes the menu and puts it back as a new one, so its entrance
  // animations start over just as it is meant to be leaving.
  const [leaving, setLeaving] = useState<OpenMenu | null>(null);
  // A menu closed while it was still opening is not given the usual exit: it is
  // turned round and played back from where it had got to (see interrupt.ts),
  // and taken away when it is back at the start.
  const [interrupted, setInterrupted] = useState(false);
  // whether the keyboard is driving the bar, after its shortcut
  const [kbd, setKbd] = useState(false);
  const kbdRef = useRef(false);
  kbdRef.current = kbd;
  // who had the keyboard before the shortcut brought it here
  const kbdPrevious = useRef(0);
  // how long the chosen animation takes to leave, which the window keeps the
  // room for (the exit itself is in the stylesheet; see `menuExitMs`)
  const anim = animationsOf(settings);
  const exitMs = menuExitMs(anim.menu, settings?.appearance.animationSpeed ?? 1);
  const exitMsRef = useRef(exitMs);
  exitMsRef.current = exitMs;
  useEffect(() => {
    if (open) {
      setLeaving(null);
      setInterrupted(false);
      return;
    }
    // an interrupted one goes when its way back is finished, not on a timer
    if (!leaving || interrupted) return;
    const timer = setTimeout(() => setLeaving(null), exitMs);
    return () => clearTimeout(timer);
  }, [open, leaving, exitMs, interrupted]);
  const shown = open ?? leaving;

  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    hydrate();
    hydrateRunning();
    void hydrateSystem();
    void hydrateIdle();
  }, [hydrate, hydrateRunning, hydrateSystem, hydrateIdle]);

  // borrow the dock's material and colors
  useEffect(() => {
    if (settings) applyAppearance(settings, null, "dock");
  }, [settings]);

  const barHeight = settings?.menuBar.height ?? 28;
  const gap = settings?.menuBar.gap ?? 0;

  // tell Rust how much of the window is in use: the bar and the gap above it,
  // and the room under them while a menu is open
  const inUse = shown !== null;
  // a tip below a button hangs under the bar, so it needs the window to reach that far too
  const [tipBottom, setTipBottom] = useState<number | null>(null);
  useEffect(() => {
    ipc.resizeMenubar(Math.max(barHeight + gap + (inUse || peekRoom ? PANEL_ROOM : 0), tipBottom ?? 0)).catch(() => undefined);
  }, [barHeight, gap, inUse, peekRoom, tipBottom]);

  // Clicking the bar makes its window the foreground one (Chromium takes the
  // focus for the web view whatever the window asks), so the app the user was
  // in loses the keyboard. It is remembered when a menu opens and given back
  // when the menu closes, unless the close was a click on something else, which
  // takes the focus where it is aimed, or an action that moves it itself.
  const previous = useRef(0);

  // Rust watches for a click elsewhere, and for Escape, while a menu is open
  // (see `set_menubar_menu_open`), so the bar does not have to hold the focus
  // to notice either.
  const closeMenu = useCallback((handFocusBack: boolean) => {
    const closing = openRef.current;
    if (!closing) return;
    playCue("close");
    // if it was still opening, it turns back from where it is
    const panel = document.querySelector<HTMLElement>(".mb-menu, .mb-panel");
    const turning = panel && !closing.instant ? reverseEntrance(panel) : null;
    setOpen(null);
    if (turning) {
      setInterrupted(true);
      setLeaving(closing);
      void turning.then(() => {
        setInterrupted(false);
        setLeaving((now) => (now === closing ? null : now));
      });
    } else if (exitMsRef.current > 0) {
      // with no exit to play there is nothing to keep on screen
      setLeaving(closing);
    }
    ipc.setMenubarMenuOpen(false).catch(() => undefined);
    // the keyboard visit is over: the window goes back to never taking the focus
    if (kbdRef.current) {
      setKbd(false);
      ipc.setDockFocusable(false).catch(() => undefined);
    }
    if (handFocusBack && previous.current) {
      ipc.activateWindow(previous.current).catch(() => undefined);
    }
  }, []);

  const openMenu = (id: MenuId, element: HTMLElement) => {
    if (!openRef.current) {
      playCue("open");
      previous.current = kbdPrevious.current || focused;
      kbdPrevious.current = 0;
      ipc.setMenubarMenuOpen(true).catch(() => undefined);
    }
    const box = element.getBoundingClientRect();
    setOpen({
      id,
      x: box.left,
      cx: box.left + box.width / 2,
      instant: openRef.current !== null,
    });
  };

  // a click anywhere else, or Escape, closes the menu
  useEffect(() => {
    const unlisten = [
      // the click goes on to whatever it was aimed at, which takes the focus
      listen(EVENTS.menubarOutside, () => closeMenu(false)),
      listen(EVENTS.menubarEscape, () => closeMenu(true)),
    ];
    return () => {
      unlisten.forEach((u) => u.then((fn) => fn()));
    };
  }, [closeMenu]);

  // The shortcut (Ctrl+Alt+M) brings the keyboard here: the Aero menu opens and
  // takes the focus, and the arrow keys then walk the menu (see `onKeyDown`).
  const openMenuRef = useRef(openMenu);
  openMenuRef.current = openMenu;
  useEffect(() => {
    const un = listen<number>("keyboard://enter", (e) => {
      if (openRef.current) {
        closeMenu(true);
        return;
      }
      kbdPrevious.current = e.payload || 0;
      setKbd(true);
      const logo = document.querySelector<HTMLElement>('[data-menu="apple"]');
      if (logo) openMenuRef.current("apple", logo);
    });
    return () => {
      un.then((fn) => fn());
    };
  }, [closeMenu]);

  // What the keyboard can reach in an open menu or panel, in reading order.
  const reachable = () =>
    Array.from(
      document.querySelectorAll<HTMLElement>(
        '.mb-menu .mb-menu-item, .mb-panel button:not([disabled]), .mb-panel [role="slider"]',
      ),
    );

  // a visit by keyboard puts the focus on the first thing in the menu that opens
  useEffect(() => {
    if (!kbd || !open) return;
    const timer = setTimeout(() => reachable()[0]?.focus(), 40);
    return () => clearTimeout(timer);
  }, [kbd, open?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // With the setting on, a menu goes when the pointer has left both the bar and
  // the menu, after a moment (long enough to cross the gap between them, which
  // is not leaving). A visit by keyboard is not closed by the pointer.
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeOnLeave = settings?.menuBar.closeOnLeave ?? true;
  const pointerIn = useCallback(() => clearTimeout(leaveTimer.current), []);
  const pointerOut = useCallback(() => {
    if (!closeOnLeave) return;
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      if (openRef.current && !kbdRef.current) closeMenu(true);
    }, 320);
  }, [closeOnLeave, closeMenu]);
  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const MENU_ORDER: MenuId[] = ["apple", "app", "control", "stats", "calendar"];
  const onKeyDown = (e: React.KeyboardEvent) => {
    const current = openRef.current;
    // a slider that took the key for itself (the arrows) keeps it
    if (!current || e.defaultPrevented) return;
    const list = reachable();
    const at = list.indexOf(document.activeElement as HTMLElement);
    const go = (i: number) => {
      e.preventDefault();
      list[(i + list.length) % list.length]?.focus();
    };
    switch (e.key) {
      case "ArrowDown":
        go(at + 1);
        break;
      case "ArrowUp":
        go(at < 0 ? -1 : at - 1);
        break;
      case "Home":
        go(0);
        break;
      case "End":
        go(-1);
        break;
      case "ArrowLeft":
      case "ArrowRight": {
        // along the bar: the next menu opens, as sliding along a menu bar does
        e.preventDefault();
        const step = e.key === "ArrowRight" ? 1 : -1;
        const next = MENU_ORDER[(MENU_ORDER.indexOf(current.id) + step + MENU_ORDER.length) % MENU_ORDER.length];
        const anchor = document.querySelector<HTMLElement>(`[data-menu="${next}"]`);
        if (anchor) openMenuRef.current(next, anchor);
        break;
      }
      case "Escape":
        e.preventDefault();
        closeMenu(true);
        break;
    }
  };

  // Switching to another app (Alt+Tab, the Windows key) leaves a menu open
  // with nothing to close it, since no click is involved
  useEffect(() => closeMenu(false), [focused, closeMenu]);

  const front = windows.find((w) => w.hwnd === focused) ?? null;
  // the app's own name ("Microsoft Teams"), drawn again when it has been looked up
  useAppNames((s) => s.epoch);
  const appName = front ? officialAppName(front.exe) : "Desktop";

  const act = (item: MenuItem) => {
    closeMenu(!item.movesFocus);
    Promise.resolve(item.run?.()).catch(notify.on(`Could not ${item.label.toLowerCase()}`));
  };

  const appleItems: MenuItem[] = [
    { label: "About Liquidock", run: () => ipc.openSettings() },
    { label: "Liquidock Settings…", run: () => ipc.openSettings() },
    { label: "Windows Settings…", run: () => ipc.launch("ms-settings:") },
    { label: "Mission Control", separatorAbove: true, run: () => ipc.toggleMission() },
    { label: "Force Quit…", separatorAbove: true, run: () => ipc.systemAction("taskmgr") },
    { label: "Sleep", separatorAbove: true, movesFocus: true, run: () => ipc.systemAction("sleep") },
    { label: "Restart…", movesFocus: true, run: () => ipc.systemAction("restart") },
    { label: "Shut Down…", movesFocus: true, run: () => ipc.systemAction("shutdown") },
    { label: "Lock Screen", separatorAbove: true, movesFocus: true, run: () => ipc.systemAction("lock") },
    { label: "Log Out…", movesFocus: true, run: () => ipc.systemAction("logoff") },
  ];

  const appItems: MenuItem[] = front
    ? [
        {
          label: `Hide ${appName}`,
          movesFocus: true,
          run: () => ipc.hideApp(front.exe),
        },
        { label: "Hide Others", movesFocus: true, run: () => ipc.hideOthers(front.exe) },
        { label: "Show All", run: () => ipc.showAllApps() },
        {
          label: `Quit ${appName}`,
          separatorAbove: true,
          movesFocus: true,
          run: () => ipc.quitAppWindows(front.exe),
        },
      ]
    : [{ label: "Show All", run: () => ipc.showAllApps() }];

  /** A top-level item: click opens its menu, and hovering over it while
   *  another is open switches to it, as on the Mac. */
  const trigger = (id: MenuId) => ({
    "data-menu": id,
    "aria-haspopup": true,
    "aria-expanded": open?.id === id,
    "data-active": open?.id === id,
    onClick: (e: React.MouseEvent<HTMLElement>) =>
      open?.id === id ? closeMenu(true) : openMenu(id, e.currentTarget),
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (open && open.id !== id) openMenu(id, e.currentTarget);
    },
  });

  if (!settings) return null;

  const menuItems = shown?.id === "apple" ? appleItems : shown?.id === "app" ? appItems : null;

  // the dock's ambient scene, inside the bar, when there is one to show
  const showScene =
    settings.menuBar.ambient &&
    isSceneKind(settings.appearance.scene) &&
    settings.appearance.particleDensity > 0;

  const look = settings.menuBar;
  const rootStyle = {
    "--menubar-height": `${barHeight}px`,
    "--mb-gap": `${look.gap}px`,
    "--mb-radius": `${look.cornerRadius}px`,
    "--mb-tint": look.tint,
    "--mb-spacing": `${look.itemSpacing}px`,
    "--mb-font": `${look.fontSize}px`,
    "--mb-lens-scale": look.lensMagnify,
  } as React.CSSProperties;

  return (
    <div
      className="menubar-root"
      data-anim={anim.menu}
      data-kbd={kbd}
      style={rootStyle}
      onKeyDown={onKeyDown}
    >
      {/* anywhere in the window outside the bar and the open menu */}
      {open && <div className="mb-backdrop" onMouseDown={() => closeMenu(true)} />}
      <GlassTips side="below" onRoom={setTipBottom} off={inUse || peek.at !== null} />

      <div
        ref={barRef}
        className="menubar"
        data-floating={look.gap > 0}
        data-rim={look.edgeHighlight}
        {...lensHandlers}
        onPointerEnter={pointerIn}
        onPointerLeave={() => {
          lensHandlers.onPointerLeave();
          pointerOut();
        }}
        onPointerMove={(e) => {
          lensHandlers.onPointerMove(e);
          pointerLight(e);
        }}
      >
        <BackdropLayer
          track="follow"
          active={menuBarGlass.active}
          blur={menuBarGlass.blur}
          grain={menuBarGlass.grain}
        />
        {showScene && <BarScene settings={settings} />}
        {Lens}
        {look.mediaIsland && (
          <MediaIsland
            settings={settings}
            look={look}
            barWidth={windowWidth - look.gap * 2}
            suspended={open !== null}
            onOpenCard={(el) => openMenu("control", el)}
          />
        )}
        <div className="mb-side">
          <button className="mb-item mb-logo" title="Liquidock" {...trigger("apple")}>
            <Logo />
          </button>
          <button className="mb-item mb-app" {...trigger("app")}>
            {appName}
          </button>
        </div>

        <div className="mb-side">
          {settings.menuBar.showPrivacy && privacyUses.length > 0 && (
            <button
              className="mb-item mb-privacy"
              title={privacySummary(privacyUses)}
              aria-label={privacySummary(privacyUses)}
              {...trigger("privacy")}
            >
              <PrivacyDots uses={privacyUses} />
            </button>
          )}
          {settings.menuBar.showStats && (
            <button className="mb-item mb-stats" title={statsLabel} aria-label={statsLabel} {...trigger("stats")}>
              <StatsSparkline />
            </button>
          )}
          {status?.battery.present && (
            <button className="mb-item" title="Battery" {...trigger("control")}>
              <BatteryGlyph percent={status.battery.percent} charging={status.battery.charging} />
              <span className="mb-battery"><Roll text={`${status.battery.percent}%`} /></span>
            </button>
          )}
          <button className="mb-item" title="Control Center" {...trigger("control")} {...peek.trigger}>
            <ControlIcon />
          </button>
          <button
            className="mb-item"
            title="Search"
            onClick={() => {
              closeMenu(false);
              ipc.openDockSearch().catch(notify.on("Could not open the search"));
            }}
          >
            <SearchIcon />
          </button>
          <button
            className="mb-item"
            title="Windows Settings"
            onClick={() => {
              closeMenu(false);
              ipc.launch("ms-settings:").catch(notify.on("Could not open Windows Settings"));
            }}
          >
            <GearIcon />
          </button>
          <button className="mb-item mb-clock" title="Calendar" {...trigger("calendar")}>
            <BarClock showDate={settings.menuBar.showDate} showSeconds={settings.menuBar.showSeconds} />
          </button>
        </div>
      </div>

      {shown && menuItems && (
        <div
          className="mb-menu"
          data-leaving={!open}
          data-interrupted={interrupted && !open}
          data-instant={shown.instant}
          onPointerEnter={pointerIn}
          onPointerLeave={pointerOut}
          // it grows out of the middle of the item that opened it
          style={{
            left: shown.x,
            transformOrigin: `${shown.cx - shown.x}px 0px`,
            ["--ox" as string]: `${shown.cx - shown.x}px`,
          }}
          role="menu"
        >
          <BackdropLayer active={menuBarGlass.active} blur={menuBarGlass.blur} grain={menuBarGlass.grain} tint="own" />
          {menuItems.map((item, i) => (
            <div key={item.label} style={{ ["--i" as string]: i }}>
              {item.separatorAbove && <div className="mb-separator" />}
              <button className="mb-menu-item" role="menuitem" onClick={() => act(item)}>
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}

      {settings.menuBar.mediaPeek && <MediaPeek settings={settings} at={peek.at} handlers={peek.card} onRoom={setPeekRoom} />}

      {(shown?.id === "control" || shown?.id === "calendar" || shown?.id === "stats" || shown?.id === "privacy") && (
        <div
          className="mb-panel"
          data-kind={shown.id}
          data-leaving={!open}
          data-interrupted={interrupted && !open}
          data-instant={shown.instant}
          onPointerEnter={pointerIn}
          onPointerLeave={pointerOut}
          // the panel is pinned to the right of the bar; it grows out of the
          // button that opened it, which is somewhere along its top edge
          style={(() => {
            const width =
              shown.id === "calendar"
                ? CALENDAR_WIDTH
                : shown.id === "stats"
                  ? STATS_WIDTH
                  : shown.id === "privacy"
                    ? PRIVACY_WIDTH
                    : PANEL_WIDTH;
            const origin = shown.cx - (window.innerWidth - look.gap - 8 - width);
            return { width, transformOrigin: `${origin}px 0px`, ["--ox" as string]: `${origin}px` };
          })()}
          role="dialog"
          aria-label={
            shown.id === "calendar" ? "Calendar" : shown.id === "stats" ? "System load" : shown.id === "privacy" ? "Privacy" : "Control Center"
          }
        >
          <BackdropLayer active={menuBarGlass.active} blur={menuBarGlass.blur} grain={menuBarGlass.grain} tint="own" />
          {shown.id === "calendar" ? (
            <Calendar />
          ) : shown.id === "stats" ? (
            <StatsPanel />
          ) : shown.id === "privacy" ? (
            <PrivacyPanel uses={privacyUses} />
          ) : (
            <ControlCenter />
          )}
        </div>
      )}
    </div>
  );
}
