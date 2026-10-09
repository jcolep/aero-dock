/**
 * Window previews: hover (or click) an app with open windows and a
 * glass shelf rises with LIVE miniatures of each window — real DWM
 * thumbnails composited by Windows into our dock window, zero-copy.
 * Click a preview to focus that window; ✕ closes it.
 */

import { layoutRect } from "./layoutRect";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ipc } from "../../ipc/commands";
import { notify } from "../feedback/toastStore";
import type { Settings } from "../../ipc/types";
import { targetKey, useRunning, windowKey } from "../../state/runningStore";
import { flyoutStyle, useMenu } from "./menuStore";
import { usePanelMotion } from "./usePanelMotion";
import "./windowsflyout.css";

const SLOT_W = 200;
const SLOT_H = 120;
const COLS_MAX = 2;


interface WindowsFlyoutProps {
  edge: Settings["dock"]["edge"];
}

export function WindowsFlyout({ edge }: WindowsFlyoutProps) {
  const { kind, item, anchor, close } = useMenu();
  const allWindows = useRunning((s) => s.windows);
  const focused = useRunning((s) => s.focused);
  const slotRefs = useRef(new Map<number, HTMLDivElement>());
  // Peek: hovering a preview shows the real window. Both directions are
  // delayed a little so sweeping across several previews does not make
  // windows flash forward and back.
  const peekTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const peek = useCallback((hwnd: number | null) => {
    clearTimeout(peekTimer.current);
    peekTimer.current = setTimeout(
      () => {
        ipc.peekWindow(hwnd).catch(() => undefined);
      },
      hwnd === null ? 80 : 130,
    );
  }, []);

  const active = kind === "windows" && item !== null && anchor !== null;

  // live view of this app's windows; flyout dissolves when they're gone
  const windows = useMemo(() => {
    if (!item) return [];
    const key = targetKey(item.target);
    return allWindows.filter((w) => windowKey(w) === key);
  }, [item, allWindows]);

  // A moment with no windows is not necessarily the end of them: the running
  // list is rebuilt as windows change state, and a snapshot taken half way
  // through can miss one. So the flyout waits a beat before going, and stays if
  // they come back.
  useEffect(() => {
    if (!active || windows.length > 0) return;
    const timer = setTimeout(close, 400);
    return () => clearTimeout(timer);
  }, [active, windows.length, close]);

  /**
   * Measure slot rects and hand them to DWM (physical px).
   *
   * Rects come from layout, not `getBoundingClientRect()`. The flyout blooms
   * in with a scale and an offset, and a bounding rect includes that
   * transform: measured while the animation runs it reports a smaller,
   * shifted box, and the live preview lands there instead of where the
   * flyout ends up. Offsets ignore transforms, so they give the final place.
   */
  const placeThumbnails = useCallback(() => {
    const scale = window.devicePixelRatio;
    const slots = windows
      .map((w) => {
        const el = slotRefs.current.get(w.hwnd);
        if (!el) return null;
        const r = layoutRect(el);
        return {
          hwnd: w.hwnd,
          x: Math.round(r.left * scale),
          y: Math.round(r.top * scale),
          w: Math.round(r.width * scale),
          h: Math.round(r.height * scale),
        };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);
    if (slots.length) {
      ipc.showWindowPreviews(slots).catch((e) => console.error("previews failed", e));
    }
  }, [windows]);

  // tear down live previews whenever the flyout goes away; the second,
  // delayed hide catches anything a straggling animation callback
  // re-registered after the first (DWM draws over our DOM, so a leaked
  // thumbnail floats with no glass behind it)
  //
  // The delayed hide has to be cancellable. Moving from one app to the next
  // closes the first flyout about when the second opens, and a hide that
  // lands after that open would wipe the new previews a moment after they
  // appeared, which is what "up for a split second, then gone" looked like.
  const lateHide = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!active) return;
    clearTimeout(lateHide.current);
    return () => {
      slotRefs.current.clear();
      // a pending peek must not fire after the flyout is gone
      clearTimeout(peekTimer.current);
      // this also puts any peeked window back (see hide_window_previews)
      ipc.hideWindowPreviews().catch(() => undefined);
      lateHide.current = setTimeout(() => {
        ipc.hideWindowPreviews().catch(() => undefined);
      }, 300);
    };
  }, [active]);

  // Place the previews once the flyout is in the DOM, and again if the set
  // of windows changes while it is open. Positions are the flyout's final
  // ones (see placeThumbnails), so there is no need to wait out the entrance
  // animation, and re-registering them a second time after it would only
  // make them flicker. The short delay lets the glass start to appear first.
  useEffect(() => {
    if (active && windows.length > 0) {
      const t = setTimeout(placeThumbnails, 90);
      return () => clearTimeout(t);
    }
  }, [active, windows, placeThumbnails]);

  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".windows-flyout")) close();
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

  const cols = Math.min(windows.length, COLS_MAX);
  const flyoutWidth = cols * (SLOT_W + 10) + 18;

  // rows of previews, capped by COLS_MAX -> approximate height for clamping
  const rows = Math.ceil(windows.length / COLS_MAX);
  const style = anchor
    ? flyoutStyle(edge, anchor, flyoutWidth, 14, rows * (SLOT_H + 26) + 30)
    : {};
  const pm = usePanelMotion(edge);

  return (
    <AnimatePresence>
      {active && item && (
        <motion.div
          className="windows-flyout glass"
          style={{ ...style, transformOrigin: pm.origin }}
          initial={pm.initial}
          animate={pm.animate}
          exit={pm.exit}
          transition={pm.transition}
          onMouseEnter={() => useMenu.getState().cancelScheduledClose()}
          onMouseLeave={() => useMenu.getState().scheduleClose(350)}
        >
          <div className="windows-flyout-title">{item.name}</div>
          <div
            className="windows-flyout-grid"
            style={{ gridTemplateColumns: `repeat(${cols}, ${SLOT_W}px)` }}
          >
            {windows.map((w) => (
              <div
                key={w.hwnd}
                className="windows-preview"
                data-focused={w.hwnd === focused}
                onMouseEnter={() => peek(w.hwnd)}
                onMouseLeave={() => peek(null)}
              >
                <div
                  className="windows-preview-frame"
                  style={{ height: SLOT_H }}
                  ref={(el) => {
                    if (el) slotRefs.current.set(w.hwnd, el);
                    else slotRefs.current.delete(w.hwnd);
                  }}
                  onClick={() => {
                    ipc.activateWindow(w.hwnd).catch(notify.on("Could not focus that window"));
                    close();
                  }}
                  title={w.title}
                />
                <div className="windows-preview-caption">
                  <span className="windows-preview-title">{w.title}</span>
                  <button
                    className="windows-flyout-close"
                    title="Close window"
                    onClick={() => ipc.closeWindow(w.hwnd).catch(notify.on("Could not close that window"))}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
