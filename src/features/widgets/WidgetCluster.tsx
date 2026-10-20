/**
 * The dock's system corner: clock, battery, network, volume, and
 * Recycle Bin, rendered as a compact glass cluster.
 *
 * Interactions: scroll on the volume glyph adjusts level, click mutes;
 * click the bin to open it, right-click to empty (system confirmation).
 */

import { Roll } from "../../engine/type/Roll";
import { useEffect, useState } from "react";
import { useReduced } from "../../engine/accessibility/policy";
import { useGlideHighlight } from "../../engine/lens/useGlideHighlight";
import { useSettings } from "../../state/settingsStore";
import { playCue } from "../../engine/sound/ui";
import { ipc } from "../../ipc/commands";
import { useSystem } from "../../state/systemStore";
import { notify } from "../feedback/toastStore";
import { BatteryGlyph, BinGlyph, NetworkGlyph, TrayGlyph, VolumeGlyph } from "./SystemGlyphs";
import "./widgets.css";

export { BatteryGlyph };

/** The time, ticking exactly on the minute, or on the second when the seconds are shown. */
export function useClock(everySecond = false): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const step = everySecond ? 1000 : 60_000;
    setNow(new Date());
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setNow(new Date());
        schedule();
      }, step - (Date.now() % step) + 20);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [everySecond]);
  return now;
}

interface WidgetClusterProps {
  showClock?: boolean;
  showStatus?: boolean;
}

export function WidgetCluster({ showClock = true, showStatus = true }: WidgetClusterProps) {
  const { status, hydrate } = useSystem();
  const now = useClock();
  const reduced = useReduced();
  // the same gliding glass as the menu bar's lens, set by the same three settings: one piece of glass
  // that travels between the clock and the buttons, and swells the one it is on
  const mb = useSettings((s) => s.settings?.menuBar);
  const lens = useGlideHighlight({
    items: ".widget-clock-button, .widget-chip-button",
    grow: mb?.lensGrow ?? 3,
    warp: mb?.lensWarp ?? 1,
    still: reduced.motion,
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  const onVolumeWheel = (e: React.WheelEvent) => {
    if (!status?.volume.available) return;
    const next = Math.max(0, Math.min(100, status.volume.level + (e.deltaY < 0 ? 4 : -4)));
    playCue("notch", e.deltaY < 0 ? 1 : -1);
    ipc.setVolume(next).catch(notify.on("Could not change the volume"));
  };

  const binTooltip = status
    ? status.recycleBin.items === 0
      ? "Recycle Bin (empty)"
      : `Recycle Bin - ${status.recycleBin.items} item${status.recycleBin.items === 1 ? "" : "s"}`
    : "Recycle Bin";

  if (!showClock && !showStatus) return null;

  return (
    <div
      ref={lens.rootRef}
      className="widget-cluster"
      style={{ ["--lens-scale" as string]: mb?.lensMagnify ?? 1.07 } as React.CSSProperties}
      {...lens.handlers}
    >
      {lens.Highlight}
      {showClock && (
      <button
        className="widget-clock widget-clock-button"
        title={`${date} - click for notifications and the calendar`}
        onClick={() => {
          playCue("open");
          ipc.openNotificationCenter().catch(notify.on("Could not open the calendar"));
        }}
      >
        <span className="widget-time"><Roll className="roll-steady" text={time} /></span>
        <span className="widget-date">{date}</span>
      </button>
      )}
      {showStatus && (
      <div className="widget-glyphs">
        <button
          className="widget-chip widget-chip-button"
          title="Show hidden icons"
          onClick={(e) => {
            playCue("open");
            // the flyout opens centred above this button
            const r = e.currentTarget.getBoundingClientRect();
            const scale = window.devicePixelRatio;
            ipc
              .openTrayOverflow(Math.round((r.left + r.width / 2) * scale), Math.round(r.top * scale))
              .then((opened) => {
                if (!opened) notify.error("Could not open the hidden icons");
              })
              .catch(notify.on("Could not open the hidden icons"));
          }}
        >
          <TrayGlyph />
        </button>
        {status?.battery.present && (
          <button
            className="widget-chip widget-chip-button"
            title={`Battery ${status.battery.percent}%${status.battery.charging ? " (charging)" : ""} - click for power settings`}
            onClick={() => {
              playCue("open");
              ipc.launch("ms-settings:batterysaver").catch(notify.on("Could not open power settings"));
            }}
          >
            <BatteryGlyph percent={status.battery.percent} charging={status.battery.charging} />
          </button>
        )}
        <button
          className="widget-chip widget-chip-button"
          title={`${status?.internet ? (status.link === "ethernet" ? "Connected by Ethernet" : "Connected") : "No internet"} - click for network settings`}
          onClick={() => {
            playCue("open");
            ipc.launch("ms-settings:network").catch(notify.on("Could not open network settings"));
          }}
        >
          <NetworkGlyph online={status?.internet ?? false} link={status?.link} />
        </button>
        {status?.volume.available && (
          <button
            className="widget-chip widget-chip-button"
            title={`Volume ${status.volume.level}%${status.volume.muted ? " (muted)" : ""} - scroll to adjust, click to mute`}
            onWheel={onVolumeWheel}
            onClick={() => {
              // unmuting is a switch going on
              playCue(status.volume.muted ? "on" : "off");
              ipc.setVolume(undefined, !status.volume.muted).catch(notify.on("Could not change the volume"));
            }}
          >
            <VolumeGlyph level={status.volume.level} muted={status.volume.muted} />
          </button>
        )}
        <button
          className="widget-chip widget-chip-button"
          title={`${binTooltip} - click to open, right-click to empty`}
          onClick={() => {
            playCue("open");
            ipc.openRecycleBin().catch(notify.on("Could not open the Recycle Bin"));
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            playCue("unpin");
            ipc.emptyRecycleBin().catch(notify.on("Could not empty the Recycle Bin"));
          }}
        >
          <BinGlyph full={(status?.recycleBin.items ?? 0) > 0} />
        </button>
      </div>
      )}
    </div>
  );
}
