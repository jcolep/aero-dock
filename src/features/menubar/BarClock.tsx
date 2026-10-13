/**
 * The menu bar's clock. It is a component of its own so that its tick, once a second when the seconds are shown,
 * redraws only the clock and not the whole bar.
 */

import { Roll } from "../../engine/type/Roll";
import { useClock } from "../widgets/WidgetCluster";

export function BarClock({ showDate, showSeconds }: { showDate: boolean; showSeconds: boolean }) {
  const now = useClock(showSeconds);
  const time = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    ...(showSeconds ? { second: "2-digit" as const } : {}),
  });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  return <Roll className="roll-steady" text={showDate ? `${date}  ${time}` : time} />;
}
