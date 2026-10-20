/**
 * Aero context menu: a glass sheet that blooms open above the icon and
 * dissolves closed. Window list on top (for running apps), then actions.
 */

import { Roll } from "../../engine/type/Roll";
import { useGlass } from "../../engine/backdrop/useGlass";
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ipc } from "../../ipc/commands";
import { playCue } from "../../engine/sound/ui";
import { notify } from "../feedback/toastStore";
import type { AudioDevice, JumpList, Settings, StackView } from "../../ipc/types";
import { exeKey, useAppAudio } from "../../state/audioStore";
import type { DockItemView } from "../../state/dockStore";
import { flyoutStyle, MENU_AIR, useMenu } from "./menuStore";
import { usePanelMotion } from "./usePanelMotion";
import { useReadableVeil } from "./useReadableVeil";
import { exeOf, keptJump, readJump, sameJump } from "./jumpCache";
import { pinRunningItem } from "./pinRunning";
import "./contextmenu.css";

const MENU_WIDTH = 240;

/** The output an app is set to in the active mode, if any. */
function chosenDevice(settings: Settings, exe: string): string | null {
  const key = exeKey(exe);
  const mode = settings.modes.modes.find((m) => m.id === settings.modes.activeId);
  return mode?.audio.find((a) => a.exe === key)?.deviceId ?? null;
}

interface ContextMenuProps {
  settings: Settings;
  edge: Settings["dock"]["edge"];
}

interface Action {
  label: string;
  danger?: boolean;
  separatorAbove?: boolean;
  run: () => void | Promise<unknown>;
}

/** Merge a pinned item into (or onto) its left neighbor as a stack. */
async function stackWithPrevious(settings: Settings, itemId: string): Promise<unknown> {
  const pinned = structuredClone(settings.pinned);
  const idx = pinned.findIndex((p) => p.id === itemId);
  if (idx < 1) return;
  const current = pinned[idx];
  const prev = pinned[idx - 1];
  if (prev.kind === "stack") {
    prev.children.push(current);
  } else {
    pinned[idx - 1] = {
      id: `pin-${crypto.randomUUID()}`,
      kind: "stack",
      path: "",
      name: `${prev.name} & more`,
      icon: null,
      children: [prev, current],
    };
  }
  pinned.splice(idx, 1);
  const next = structuredClone(settings);
  next.pinned = pinned;
  return ipc.setSettings(next);
}

/** Explode a stack back into its pinned children. */
async function unstack(settings: Settings, stackId: string): Promise<unknown> {
  const pinned = structuredClone(settings.pinned);
  const idx = pinned.findIndex((p) => p.id === stackId);
  if (idx === -1) return;
  const stack = pinned[idx];
  pinned.splice(idx, 1, ...stack.children);
  const next = structuredClone(settings);
  next.pinned = pinned;
  return ipc.setSettings(next);
}

/** Choose how a stack opens. */
async function setStackView(
  settings: Settings,
  stackId: string,
  view: StackView,
): Promise<unknown> {
  const next = structuredClone(settings);
  const stack = next.pinned.find((p) => p.id === stackId);
  if (!stack) return;
  stack.view = view;
  return ipc.setSettings(next);
}

function buildActions(item: DockItemView, settings: Settings): Action[] {
  const actions: Action[] = [];

  // stacks have their own compact menu
  if (item.kind === "stack") {
    const current = settings.pinned.find((p) => p.id === item.id)?.view ?? "grid";
    const views: [StackView, string][] = [
      ["fan", "Fan"],
      ["grid", "Grid"],
      ["list", "List"],
    ];
    for (const [view, name] of views) {
      actions.push({
        label: `${current === view ? "✓ " : ""}View as ${name}`,
        run: () => setStackView(settings, item.id, view),
      });
    }
    actions.push({
      label: "Unstack",
      separatorAbove: true,
      run: () => unstack(settings, item.id),
    });
    actions.push({
      label: "Unpin from Dock",
      run: () => {
        playCue("unpin");
        return ipc.unpinItem(item.id);
      },
    });
    return actions;
  }

  actions.push({
    label: item.windows.length > 0 ? "New window" : "Open",
    run: () => {
      playCue("launch");
      return ipc.launch(item.target, item.args);
    },
  });
  actions.push({
    label: "Run as administrator",
    run: () => ipc.launchAsAdmin(item.target, item.args),
  });
  actions.push({
    label: "Open file location",
    run: () => ipc.openFileLocation(item.target),
  });

  if (item.pinned) {
    actions.push({
      label: "Unpin from Dock",
      separatorAbove: true,
      run: () => {
        playCue("unpin");
        return ipc.unpinItem(item.id);
      },
    });
    const idx = settings.pinned.findIndex((p) => p.id === item.id);
    if (idx > 0) {
      actions.push({
        label:
          settings.pinned[idx - 1].kind === "stack"
            ? "Add to stack on the left"
            : "Stack with previous item",
        run: () => stackWithPrevious(settings, item.id),
      });
    }
  } else {
    actions.push({
      label: "Pin to Dock",
      separatorAbove: true,
      run: () => {
        playCue("pin");
        return pinRunningItem(item, settings.pinned.length);
      },
    });
  }

  if (item.windows.length === 1) {
    actions.push({
      label: "Minimize",
      separatorAbove: true,
      run: () => {
        playCue("minimize");
        return ipc.minimizeWindow(item.windows[0].hwnd);
      },
    });
    actions.push({
      label: "Close window",
      danger: true,
      run: () => ipc.closeWindow(item.windows[0].hwnd),
    });
  } else if (item.windows.length > 1) {
    actions.push({
      label: `Close all (${item.windows.length})`,
      danger: true,
      separatorAbove: true,
      run: () => Promise.all(item.windows.map((w) => ipc.closeWindow(w.hwnd))),
    });
  }
  if (item.windows.length > 0) {
    // ends it at once, whatever it is doing: for an app that will not close (the middle click does the same)
    actions.push({
      label: "End Task",
      danger: true,
      run: () => ipc.endTask(item.windows.map((w) => w.hwnd)),
    });
  }

  return actions;
}

export function ContextMenu({ settings, edge }: ContextMenuProps) {
  const dockGlass = useGlass("dock");
  const { kind, item: openItem, anchor, close } = useMenu();
  const item = kind === "menu" ? openItem : null;

  const audio = useAppAudio((a) => (item ? a.levels[exeKey(item.audioExe)] : undefined));
  const toggleMute = useAppAudio((a) => a.toggleMute);
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [showDevices, setShowDevices] = useState(false);

  // collapse the device list whenever the menu moves to another icon
  useEffect(() => {
    setShowDevices(false);
  }, [item?.id]);

  // The app's Jump List (recent connections, recent files, its own tasks): the one kept for it at once (jumpCache:
  // read ahead on hover and at start), and a fresh read behind it that replaces it only if it changed. Read only when
  // the menu opened, the list arrived a moment after the menu and the menu grew.
  const [jump, setJump] = useState<JumpList | null>(null);
  const exe = item ? exeOf(item) : "";
  useEffect(() => {
    setJump(item && item.kind !== "stack" ? (keptJump(item) ?? null) : null);
    if (!item || item.kind === "stack") return;
    let live = true;
    void readJump(item).then((list) => {
      if (live) setJump((now) => (sameJump(now, list) ? now : list));
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  // endpoints are only listed once the user asks for them
  useEffect(() => {
    if (!showDevices || devices.length > 0) return;
    ipc
      .listAudioDevices()
      .then(setDevices)
      .catch((e) => console.warn("audio device list failed", e));
  }, [showDevices, devices.length]);

  // close on any click outside / Escape
  useEffect(() => {
    if (!item) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".aero-menu")) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // clicks outside the OS window never reach us, so also dismiss when
    // the cursor leaves the window and doesn't come back promptly
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
  }, [item, close]);

  const style = anchor ? flyoutStyle(edge, anchor, MENU_WIDTH, 12, 360) : {};
  // The most the menu may be: the room between the dock's bar and the window's far edge, less a little air (the
  // window keeps MENU_ROOM for it). Its Jump List gives up height and scrolls, so the menu's own items are always in
  // view and its top is never cut off.
  const room = anchor
    ? edge === "bottom"
      ? anchor.top - 12 - MENU_AIR
      : edge === "top"
        ? anchor.winH - anchor.bottom - 12 - MENU_AIR
        : anchor.winH - 16
    : 0;
  const pm = usePanelMotion(edge);
  // readable over a light window behind
  const menuRef = useRef<HTMLDivElement>(null);
  const { veil, props: veiled } = useReadableVeil(!!item && !!anchor, menuRef, item?.id);
  const showOutput = settings.dock.menuAudioOutput === true;

  // The Jump List, when it has to scroll, ends on a whole row: its height is cut back to the last row (or separator)
  // that fits entirely, never leaving a heading at the foot with nothing under it, so nothing shows half cut off. The
  // edge where there is more fades (data-more), and the top fades once it has been scrolled (data-scrolled).
  const jumpRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ more: false, scrolled: false });
  const readEdges = () => {
    const j = jumpRef.current;
    if (!j) return;
    const more = j.scrollTop + j.clientHeight < j.scrollHeight - 2;
    const scrolled = j.scrollTop > 2;
    setEdges((e) => (e.more === more && e.scrolled === scrolled ? e : { more, scrolled }));
  };
  useLayoutEffect(() => {
    const j = jumpRef.current;
    if (!j) return;
    j.style.maxHeight = "";
    if (j.scrollHeight > j.clientHeight + 1) {
      const rows = [...j.querySelectorAll<HTMLElement>(".aero-menu-heading, .aero-menu-jump-item, .aero-menu-separator")];
      let cut = 0;
      for (let i = 0; i < rows.length; i++) {
        const bottom = rows[i].offsetTop + rows[i].offsetHeight;
        if (bottom > j.clientHeight) break;
        // a heading counts only with its first row under it
        if (rows[i].classList.contains("aero-menu-heading")) continue;
        cut = bottom;
      }
      if (cut > 0) j.style.maxHeight = `${cut}px`;
    }
    readEdges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jump, room, item?.id, showDevices]);

  return (
    <AnimatePresence>
      {item && anchor && (
        <motion.div
          ref={menuRef}
          className="aero-menu aero-menu-app glass"
          {...("data-veiled" in veiled ? { "data-veiled": "" } : {})}
          style={{ ...style, maxHeight: Math.max(160, room), transformOrigin: pm.origin, ...("style" in veiled ? veiled.style : {}) }}
          initial={pm.initial}
          animate={pm.animate}
          exit={pm.exit}
          transition={pm.transition}
        >
          <BackdropLayer active={dockGlass.active} blur={dockGlass.blur} grain={dockGlass.grain} />
          {veil && <span className="aero-menu-veil" aria-hidden style={{ backgroundImage: `url(${veil.image})` }} />}
          {jump && jump.sections.length > 0 && (
            // the app's own list first, as on the taskbar; held to a height of its own so the menu's items below it
            // are always in view
            // the arrows sit in the fades, outside what scrolls (its mask would fade them too): down while there is
            // more below, up once it has been scrolled
            <div className="aero-menu-jump-wrap">
            <span className="aero-menu-jump-arrow" data-dir="up" data-on={edges.scrolled || undefined} aria-hidden>
              <svg viewBox="0 0 12 8"><path d="M2.5 6 6 2.5 9.5 6" /></svg>
            </span>
            <span className="aero-menu-jump-arrow" data-dir="down" data-on={edges.more || undefined} aria-hidden>
              <svg viewBox="0 0 12 8"><path d="M2.5 2 6 5.5 9.5 2" /></svg>
            </span>
            <div ref={jumpRef} className="aero-menu-jump" data-more={edges.more || undefined} data-scrolled={edges.scrolled || undefined} onScroll={readEdges}>
              {jump.sections.map((section) => (
                <div key={section.title} className="aero-menu-jump-section">
                  <div className="aero-menu-heading">{section.title}</div>
                  {section.items.map((entry, i) => (
                    <button
                      key={`${entry.path}|${entry.args}|${i}`}
                      className="aero-menu-item aero-menu-jump-item"
                      title={entry.kind === "file" ? entry.path : entry.title}
                      onClick={() => {
                        ipc.jumpOpen(entry, exe).catch(notify.on(`Could not open ${entry.title}`));
                        close();
                      }}
                    >
                      <span className="aero-menu-window-title">{entry.title}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            </div>
          )}
          {/* the line under the list stays put, outside what scrolls */}
          {jump && jump.sections.length > 0 && <div className="aero-menu-separator aero-menu-jump-end" />}
          {item.windows.length > 1 && (
            <div className="aero-menu-windows">
              {item.windows.slice(0, 6).map((w) => (
                <button
                  key={w.hwnd}
                  className="aero-menu-item aero-menu-window"
                  onClick={() => {
                    ipc.activateWindow(w.hwnd).catch(notify.on("Could not focus that window"));
                    close();
                  }}
                >
                  <span className="aero-menu-window-title">{w.title}</span>
                </button>
              ))}
              <div className="aero-menu-separator" />
            </div>
          )}
          {item.kind !== "stack" && (audio || showOutput) && (
            <div className="aero-menu-audio">
              {audio && (
                <button
                  className="aero-menu-item"
                  onClick={() => {
                    void toggleMute(item.audioExe);
                    close();
                  }}
                >
                  {audio.muted ? "Unmute" : "Mute"}
                  <span className="aero-menu-hint">
                    <Roll text={audio.muted ? "muted" : `${audio.volume}%`} />
                  </span>
                </button>
              )}
              {showOutput && (
                <button
                  className="aero-menu-item"
                  aria-expanded={showDevices}
                  onClick={() => setShowDevices((v) => !v)}
                >
                  Audio output
                  <span className="aero-menu-hint">{showDevices ? "hide" : "choose"}</span>
                </button>
              )}
              {showOutput && showDevices && (
                <div className="aero-menu-devices">
                  {devices.length === 0 && (
                    <div className="aero-menu-note">Looking for outputs…</div>
                  )}
                  {devices.map((d) => {
                    const current = chosenDevice(settings, item.audioExe);
                    const active = current === null ? d.isDefault : current === d.id;
                    return (
                      <button
                        key={d.id}
                        className="aero-menu-item aero-menu-device"
                        data-active={active}
                        onClick={() => {
                          ipc
                            .setAppOutputDevice(item.audioExe, d.id, true)
                            .then((choice) => {
                              if (choice.openedSettings) {
                                notify.info(
                                  `Saved. Pick ${d.name} for ${item.name} in the Windows page that just opened.`,
                                );
                              } else {
                                notify.info(`Saved ${d.name} for ${item.name}.`);
                              }
                            })
                            .catch(notify.on("Could not set the audio output"));
                          close();
                        }}
                      >
                        <span className="aero-menu-device-name">{d.name}</span>
                        {d.isDefault && <span className="aero-menu-hint">system</span>}
                      </button>
                    );
                  })}
                  <div className="aero-menu-note">
                    Windows performs the routing itself, so the last step happens
                    on its own settings page.
                  </div>
                </div>
              )}
              <div className="aero-menu-separator" />
            </div>
          )}
          {buildActions(item, settings).map((action) => (
            <div key={action.label}>
              {action.separatorAbove && <div className="aero-menu-separator" />}
              <button
                className="aero-menu-item"
                data-danger={action.danger}
                onClick={() => {
                  Promise.resolve(action.run()).catch(
                    notify.on(`"${action.label}" failed`),
                  );
                  close();
                }}
              >
                {action.label}
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
