/**
 * The calendar that opens from the clock: a month at a time, today ringed,
 * arrows to move between months and a button to come back to now. Weeks start
 * on the day the system's locale starts them on.
 *
 * Windows' own notification centre, which used to open from the clock, is a
 * button at the bottom, since it also holds notifications this does not.
 */

import { useMemo, useState } from "react";
import { ipc } from "../../ipc/commands";
import { notify } from "../feedback/toastStore";

/** The first day of the week in the user's locale: 0 is Sunday, 1 Monday. */
export function firstWeekday(locale: string = navigator.language): number {
  try {
    const info = (new Intl.Locale(locale) as unknown as { weekInfo?: { firstDay: number }; getWeekInfo?: () => { firstDay: number } });
    const first = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay;
    // Intl numbers the week from Monday as 1 to Sunday as 7
    return first === undefined ? 0 : first % 7;
  } catch {
    return 0;
  }
}

/** The days to draw for a month: blanks to line the first one up under its
 *  weekday, then the days, in whole weeks. */
export function monthCells(year: number, month: number, firstDay: number): (number | null)[] {
  const lead = (new Date(year, month, 1).getDay() - firstDay + 7) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array<null>(lead).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function Calendar() {
  const today = new Date();
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const first = useMemo(() => firstWeekday(), []);
  const cells = monthCells(view.getFullYear(), view.getMonth(), first);

  const weekdays = useMemo(() => {
    // a week in the locale's own order and abbreviations; 2023-01-01 was a Sunday
    return Array.from({ length: 7 }, (_, i) =>
      new Date(2023, 0, 1 + ((first + i) % 7)).toLocaleDateString([], { weekday: "narrow" }),
    );
  }, [first]);

  const move = (months: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + months, 1));
  const here = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();

  return (
    <div className="cc cal">
      <div className="cc-card cal-head">
        <div className="cal-title" aria-live="polite">
          <strong>{view.toLocaleDateString([], { month: "long" })}</strong>
          <span>{view.getFullYear()}</span>
        </div>
        <div className="cal-nav">
          <button className="cc-icon-button" aria-label="Previous month" onClick={() => move(-1)}>
            ‹
          </button>
          <button className="cc-icon-button cal-today" disabled={here} onClick={() => setView(new Date(today.getFullYear(), today.getMonth(), 1))}>
            Today
          </button>
          <button className="cc-icon-button" aria-label="Next month" onClick={() => move(1)}>
            ›
          </button>
        </div>
      </div>

      <div className="cc-card cal-grid" role="grid" aria-label={view.toLocaleDateString([], { month: "long", year: "numeric" })}>
        <div className="cal-row" role="row">
          {weekdays.map((d, i) => (
            <span key={i} className="cal-weekday" role="columnheader">
              {d}
            </span>
          ))}
        </div>
        {Array.from({ length: cells.length / 7 }, (_, week) => (
          <div key={week} className="cal-row" role="row">
            {cells.slice(week * 7, week * 7 + 7).map((day, i) => {
              const isToday = here && day === today.getDate();
              return (
                <span
                  key={i}
                  className="cal-day"
                  role="gridcell"
                  data-today={isToday}
                  data-blank={day === null}
                  aria-current={isToday ? "date" : undefined}
                >
                  {day ?? ""}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <div className="cc-links">
        <button onClick={() => ipc.openNotificationCenter().catch(notify.on("Could not open the notifications"))}>
          Notifications…
        </button>
        <button onClick={() => ipc.launch("ms-settings:dateandtime").catch(notify.on("Could not open the date settings"))}>
          Date &amp; time settings…
        </button>
      </div>
    </div>
  );
}
