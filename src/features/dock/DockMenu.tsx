/**
 * The dock's own menu: a right-click on the dock's empty space (the bar between and around its icons, its clock and
 * status corner) opens it, as a right-click on the Windows taskbar opens the taskbar's. Liquidock's settings first,
 * then two of the dock's own switches, then what the taskbar's menu has always offered for the apps' windows (cascade,
 * stacked, side by side, show the desktop: only the apps' windows on this monitor, never Liquidock's, arrange.rs),
 * Task Manager, and Windows' taskbar settings.
 *
 * The same glass sheet as an icon's menu (ContextMenu), opening from the dock above where it was clicked, and closing
 * the same ways: a click elsewhere, Escape, or the pointer leaving the window for a moment.
 */

import { useGlass } from "../../engine/backdrop/useGlass";
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";
import { Droplet } from "../../engine/brand/droplet";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { ipc } from "../../ipc/commands";
import { notify } from "../feedback/toastStore";
import type { Settings } from "../../ipc/types";
import { useSettings } from "../../state/settingsStore";
import { flyoutStyle, useMenu } from "./menuStore";
import { usePanelMotion } from "./usePanelMotion";
import { useReadableVeil } from "./useReadableVeil";

const MENU_WIDTH = 252;

interface Row {
  label: string;
  /** Something before the label (the drop by Liquidock's settings). */
  lead?: ReactNode;
  /** A switch shown at the end of the row, on or off. */
  on?: boolean;
  separatorAbove?: boolean;
  /** What a failure says. */
  fails: string;
  run: () => void | Promise<unknown>;
}

function rows(settings: Settings): Row[] {
  const flip = (fn: (d: Settings) => void) => () => useSettings.getState().apply(fn);
  return [
    { label: "Liquidock Settings…", lead: <Droplet size={16} />, fails: "Could not open the settings", run: () => ipc.openSettings() },
    {
      label: "Automatically hide the dock",
      on: settings.dock.autoHide,
      separatorAbove: true,
      fails: "Could not change auto-hide",
      run: flip((d) => void (d.dock.autoHide = !d.dock.autoHide)),
    },
    {
      label: "Magnification",
      on: settings.dock.magnification,
      fails: "Could not change magnification",
      run: flip((d) => void (d.dock.magnification = !d.dock.magnification)),
    },
    { label: "Cascade windows", separatorAbove: true, fails: "Could not cascade the windows", run: () => ipc.systemAction("cascade") },
    { label: "Show windows stacked", fails: "Could not stack the windows", run: () => ipc.systemAction("stacked") },
    { label: "Show windows side by side", fails: "Could not lay the windows side by side", run: () => ipc.systemAction("sideBySide") },
    { label: "Show the desktop", fails: "Could not show the desktop", run: () => ipc.systemAction("desktop") },
    { label: "Task Manager", separatorAbove: true, fails: "Could not open Task Manager", run: () => ipc.systemAction("taskmgr") },
    { label: "Taskbar settings", fails: "Could not open the taskbar settings", run: () => ipc.launch("ms-settings:taskbar") },
  ];
}

export function DockMenu({ settings, edge }: { settings: Settings; edge: Settings["dock"]["edge"] }) {
  const dockGlass = useGlass("dock");
  const { kind, anchor, close } = useMenu();
  const open = kind === "dock" && anchor !== null;

  // close on any click outside, Escape, or the pointer leaving the window and not coming back promptly (a click
  // outside the window never reaches it)
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dock-menu")) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    let leaveTimer: ReturnType<typeof setTimeout> | undefined;
    const onLeave = () => {
      leaveTimer = setTimeout(close, 450);
    };
    const onEnter = () => clearTimeout(leaveTimer);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      clearTimeout(leaveTimer);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [open, close]);

  const style = anchor ? flyoutStyle(edge, anchor, MENU_WIDTH, 12, 380) : {};
  const pm = usePanelMotion(edge);
  // readable over a light window behind
  const menuRef = useRef<HTMLDivElement>(null);
  const { veil } = useReadableVeil(open, menuRef, anchor ? `${anchor.cx},${anchor.cy}` : null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          className="aero-menu dock-menu glass"
          role="menu"
          aria-label="Dock"
          data-veiled={veil ? "" : undefined}
          style={{ ...style, transformOrigin: pm.origin, ...(veil ? { ["--veil-shadow" as string]: veil.shadow.toFixed(3) } : {}) }}
          initial={pm.initial}
          animate={pm.animate}
          exit={pm.exit}
          transition={pm.transition}
        >
          <BackdropLayer active={dockGlass.active} blur={dockGlass.blur} grain={dockGlass.grain} />
          {veil && <span className="aero-menu-veil" aria-hidden style={{ backgroundImage: `url(${veil.image})` }} />}
          {rows(settings).map((row) => (
            <div key={row.label}>
              {row.separatorAbove && <div className="aero-menu-separator" />}
              <button
                className="aero-menu-item"
                role={row.on === undefined ? "menuitem" : "menuitemcheckbox"}
                aria-checked={row.on}
                onClick={() => {
                  Promise.resolve(row.run()).catch(notify.on(row.fails));
                  close();
                }}
              >
                <span className="dock-menu-label">
                  {row.lead}
                  {row.label}
                </span>
                {row.on !== undefined && <span className="dock-menu-switch" data-on={row.on} aria-hidden />}
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
