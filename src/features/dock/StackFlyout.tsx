/**
 * Stack flyout: a pinned group opens as a fan, a grid or a list, chosen per
 * stack from its context menu.
 *
 * Grid and list are a panel of glass that blooms open above the icon. The fan
 * has no panel: each member is its own icon, and they rise out of the stack's
 * icon one after another along a gentle curve, with the name beside each.
 */

import { AnimatePresence, motion } from "motion/react";
import { useGlass } from "../../engine/backdrop/useGlass";
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";
import { useEffect } from "react";
import { springs } from "../../engine/animation/springs";
import { ipc } from "../../ipc/commands";
import { notify } from "../feedback/toastStore";
import type { PinnedItem, Settings, StackView } from "../../ipc/types";
import { useDockIcons } from "../../state/dockStore";
import { flyoutStyle, useMenu, type MenuAnchor } from "./menuStore";
import { usePanelMotion } from "./usePanelMotion";
import "./folderflyout.css";

const GRID_WIDTH = 300;
const LIST_WIDTH = 250;
const COLUMNS = 3;

/** Fan geometry, in px. */
const FAN_ICON = 44;
const FAN_GAP = 14; // between the dock icon and the first member
const FAN_STEP_MAX = 54;
const FAN_STEP_MIN = 36;
/** More members than this will not fit in the room above the dock, so the
 *  stack opens as a grid instead. */
const FAN_MAX = 9;
/** How much further sideways each member sits than the one before it, as a
 *  multiple of its position squared: the curve of the fan. */
const FAN_CURVE = 3.5;

interface StackFlyoutProps {
  edge: Settings["dock"]["edge"];
}

/** Where each member of a fan sits: its centre, in window coordinates. */
function fanPositions(
  edge: StackFlyoutProps["edge"],
  anchor: MenuAnchor,
  count: number,
): { x: number; y: number; labelFirst: boolean }[] {
  const vertical = edge === "left" || edge === "right";
  // the room the fan has to rise into, along its own direction
  const room = vertical
    ? edge === "left"
      ? anchor.winW - anchor.right
      : anchor.left
    : edge === "bottom"
      ? anchor.top
      : anchor.winH - anchor.bottom;
  const step = Math.max(
    FAN_STEP_MIN,
    Math.min(FAN_STEP_MAX, (room - FAN_GAP * 2) / Math.max(count, 1)),
  );
  // curve toward the middle of the screen, where there is more room
  const across = vertical
    ? anchor.cy < anchor.winH / 2
      ? 1
      : -1
    : anchor.cx < anchor.winW / 2
      ? 1
      : -1;

  return Array.from({ length: count }, (_, i) => {
    const along = FAN_GAP + FAN_ICON / 2 + i * step;
    const bend = across * i * i * FAN_CURVE;
    switch (edge) {
      case "bottom":
        return { x: anchor.cx + bend, y: anchor.top - along, labelFirst: across < 0 };
      case "top":
        return { x: anchor.cx + bend, y: anchor.bottom + along, labelFirst: across < 0 };
      case "left":
        return { x: anchor.right + along, y: anchor.cy + bend, labelFirst: false };
      case "right":
        return { x: anchor.left - along, y: anchor.cy + bend, labelFirst: true };
    }
  });
}

export function StackFlyout({ edge }: StackFlyoutProps) {
  const dockGlass = useGlass("dock");
  const { kind, item, anchor, close } = useMenu();
  const { iconUrls, resolveIcons } = useDockIcons();

  const active = kind === "stack" && item !== null && anchor !== null;
  const requested: StackView = item?.view ?? "grid";
  // a fan of too many members would run off the screen
  const view: StackView =
    requested === "fan" && (item?.children.length ?? 0) > FAN_MAX ? "grid" : requested;

  useEffect(() => {
    if (!active || !item) return;
    resolveIcons(item.children.map((c) => c.path).filter(Boolean));
  }, [active, item, resolveIcons]);

  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".folder-flyout, .stack-fan-item")) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    let leaveTimer: ReturnType<typeof setTimeout> | undefined;
    const onLeave = () => {
      leaveTimer = setTimeout(close, 500);
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
  }, [active, close]);

  const launch = (child: PinnedItem) => {
    ipc.launch(child.path).catch(notify.on(`Could not open ${child.name}`));
    close();
  };

  const width = view === "list" ? LIST_WIDTH : GRID_WIDTH;
  const style = anchor ? flyoutStyle(edge, anchor, width, 14, 320) : {};
  const pm = usePanelMotion(edge);
  const fan = active && item && anchor && view === "fan" ? fanPositions(edge, anchor, item.children.length) : null;

  return (
    <>
      {/* grid and list: a panel of glass */}
      <AnimatePresence>
        {active && item && view !== "fan" && (
          <motion.div
            className="folder-flyout glass"
            data-view={view}
            style={{ ...style, transformOrigin: pm.origin }}
            initial={pm.initial}
            animate={pm.animate}
            exit={pm.exit}
            transition={pm.transition}
          >
            <BackdropLayer active={dockGlass.active} blur={dockGlass.blur} grain={dockGlass.grain} />
            <div className="folder-flyout-header">
              <span className="folder-flyout-title">{item.name}</span>
            </div>
            <div
              className="folder-flyout-grid"
              style={{
                gridTemplateColumns: view === "list" ? "1fr" : `repeat(${COLUMNS}, 1fr)`,
              }}
            >
              {item.children.map((child, i) => (
                <motion.button
                  key={child.id}
                  className="folder-flyout-item"
                  {...pm.item(i, 0.025, 0.3)}
                  onClick={() => launch(child)}
                  title={child.name}
                >
                  {iconUrls[child.path] ? (
                    <img src={iconUrls[child.path]} alt="" draggable={false} />
                  ) : (
                    <span className="folder-flyout-glyph">▶</span>
                  )}
                  <span className="folder-flyout-name">{child.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* fan: the members rise out of the stack's icon one after another */}
      <AnimatePresence>
        {fan &&
          anchor &&
          item &&
          item.children.map((child, i) => {
            const spot = fan[i];
            // each starts on top of the stack's icon and travels out to its place
            const fromX = anchor.cx - spot.x;
            const fromY = anchor.cy - spot.y;
            return (
              <motion.button
                key={child.id}
                className="stack-fan-item"
                data-label-first={spot.labelFirst}
                style={{ left: spot.x - FAN_ICON / 2, top: spot.y - FAN_ICON / 2 }}
                initial={{ opacity: 0, scale: 0.3, x: fromX, y: fromY }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.3,
                  x: fromX,
                  y: fromY,
                  transition: { duration: 0.15, delay: (item.children.length - 1 - i) * 0.015 },
                }}
                transition={{ ...springs.bloom, delay: i * 0.03 }}
                onClick={() => launch(child)}
                title={child.name}
              >
                {iconUrls[child.path] ? (
                  <img src={iconUrls[child.path]} alt="" draggable={false} />
                ) : (
                  <span className="stack-fan-glyph">▶</span>
                )}
                <span className="stack-fan-label">{child.name}</span>
              </motion.button>
            );
          })}
      </AnimatePresence>
    </>
  );
}
