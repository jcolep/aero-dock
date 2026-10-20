/**
 * The widgets about time: Timer (Pomodoro, a countdown or a stopwatch), Countdown to a date, World clocks, Time
 * progress, the Date tile and a Flip clock. All of it is computed here; nothing goes online.
 */

import { useEffect, useRef } from "react";
import { playCue } from "../../../engine/sound/ui";
import { clamp, opt, useExtra, useNow } from "../kit";
import type { WidgetProps } from "../registry";

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

// ---- Timer ----

interface Run {
  phase: "work" | "break" | "long";
  running: boolean;
  endsAt: number;
  left: number;
  startedAt: number;
  elapsed: number;
  cycle: number;
  done: boolean;
}
const FRESH: Run = { phase: "work", running: false, endsAt: 0, left: 0, startedAt: 0, elapsed: 0, cycle: 0, done: false };

export function TimerWidget({ widget }: WidgetProps) {
  const mode = opt(widget, "mode", "pomodoro");
  const workMin = opt(widget, "workMin", 25);
  const breakMin = opt(widget, "breakMin", 5);
  const longMin = opt(widget, "longMin", 15);
  const every = opt(widget, "longEvery", 4);
  const countdownMin = opt(widget, "countdownMin", 10);
  const autoNext = opt(widget, "autoNext", true);
  const sound = opt(widget, "sound", true);
  const ringOn = opt(widget, "ring", true);
  const [run, setRun] = useExtra<Run>(widget, "run", FRESH);
  const now = useNow(run.running ? 250 : null);

  const dur = (phase: Run["phase"]) => (mode === "countdown" ? countdownMin : phase === "work" ? workMin : phase === "break" ? breakMin : longMin) * 60_000;
  const left = run.running ? Math.max(0, run.endsAt - now) : run.left > 0 ? run.left : dur(run.phase);
  const elapsed = run.running ? run.elapsed + (now - run.startedAt) : run.elapsed;

  // a phase ending: a chime, and on to the next one (or stopped, where there is not one)
  const ended = useRef(0);
  useEffect(() => {
    if (mode === "stopwatch" || !run.running || now < run.endsAt || ended.current === run.endsAt) return;
    ended.current = run.endsAt;
    if (sound) playCue("attention");
    if (mode === "countdown") {
      setRun({ ...FRESH, done: true }, true);
      return;
    }
    const cycle = run.phase === "work" ? run.cycle + 1 : run.cycle;
    const phase: Run["phase"] = run.phase === "work" ? (cycle % every === 0 ? "long" : "break") : "work";
    setRun(autoNext ? { ...run, phase, cycle, running: true, endsAt: Date.now() + dur(phase), left: 0, done: false } : { ...FRESH, phase, cycle }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, run.running, run.endsAt]);

  const toggle = () => {
    const t = Date.now();
    if (mode === "stopwatch") setRun(run.running ? { ...run, running: false, elapsed: elapsed } : { ...run, running: true, startedAt: t, done: false }, true);
    else if (run.running) setRun({ ...run, running: false, left: Math.max(1, run.endsAt - t) }, true);
    else setRun({ ...run, running: true, endsAt: t + (run.left > 0 ? run.left : dur(run.phase)), done: false }, true);
  };
  const skip = () => setRun({ ...FRESH, phase: run.phase === "work" ? "break" : "work", cycle: run.cycle }, true);

  const total = mode === "stopwatch" ? 60_000 : dur(run.phase);
  const frac = mode === "stopwatch" ? (elapsed % 60_000) / 60_000 : 1 - left / total;
  const ms = mode === "stopwatch" ? elapsed : left;
  const h = Math.floor(ms / 3_600_000);
  const text = `${h > 0 ? h + ":" : ""}${pad((ms / 60_000) % 60)}:${pad((ms / 1000) % 60)}`;
  const R = 44;
  const C = 2 * Math.PI * R;
  const label = run.done ? "Time's up" : mode === "pomodoro" ? (run.phase === "work" ? "Focus" : run.phase === "break" ? "Short break" : "Long break") : mode === "countdown" ? "Countdown" : "Stopwatch";
  return (
    <div className="w-timer" data-phase={mode === "pomodoro" ? run.phase : mode} data-done={run.done || undefined}>
      <div className="w-timer-dial">
        {ringOn && (
          <svg viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
            <circle cx="50" cy="50" r={R} fill="none" stroke={run.phase === "work" || mode !== "pomodoro" ? "var(--aero-accent, #2f9de3)" : "var(--aero-life, #7ad03a)"} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${C * clamp(frac, 0, 1)} ${C}`} transform="rotate(-90 50 50)" />
          </svg>
        )}
        <div className="w-timer-center">
          <strong>{text}</strong>
          <small>{label}{mode === "pomodoro" && run.cycle > 0 ? ` · ${run.cycle}` : ""}</small>
        </div>
      </div>
      <div className="w-timer-buttons">
        <button data-nodrag className="w-primary" onClick={toggle}>{run.running ? "Pause" : mode === "stopwatch" || elapsed > 0 || run.left > 0 ? "Resume" : "Start"}</button>
        <button data-nodrag onClick={() => setRun({ ...FRESH, cycle: mode === "pomodoro" ? run.cycle : 0 }, true)}>Reset</button>
        {mode === "pomodoro" && <button data-nodrag onClick={skip} title="Skip to the next">Skip</button>}
      </div>
    </div>
  );
}

// ---- Countdown to a date ----

export function CountdownWidget({ widget }: WidgetProps) {
  const label = opt(widget, "label", "New Year");
  const target = opt(widget, "target", "2027-01-01T00:00");
  const icon = opt(widget, "icon", "🎉");
  const style = opt(widget, "style", "days");
  const showSeconds = opt(widget, "showSeconds", false);
  const now = useNow(style === "detailed" || showSeconds ? 1000 : 30_000);
  const at = new Date(target).getTime();
  if (!Number.isFinite(at)) return <div className="w-empty">Set a date in Settings › Widgets</div>;
  const diff = at - now;
  const past = diff < 0;
  const abs = Math.abs(diff);
  const d = Math.floor(abs / 86_400_000);
  const hh = Math.floor((abs / 3_600_000) % 24);
  const mm = Math.floor((abs / 60_000) % 60);
  const ss = Math.floor((abs / 1000) % 60);
  return (
    <div className="w-countdown">
      <div className="w-countdown-icon">{icon}</div>
      {style === "detailed" ? (
        <div className="w-countdown-units">
          {[[d, "days"], [hh, "hrs"], [mm, "min"], [ss, "sec"]].map(([v, u]) => (
            <div key={u as string}><strong>{pad(v as number)}</strong><small>{u}</small></div>
          ))}
        </div>
      ) : (
        <div className="w-countdown-big">
          <strong>{d}</strong>
          <span>{d === 1 ? "day" : "days"}{style === "days" && hh > 0 && d < 3 ? ` ${hh}h` : ""}{showSeconds && style === "days" ? ` ${pad(mm)}:${pad(ss)}` : ""}</span>
        </div>
      )}
      <div className="w-countdown-label">{past ? `since ${label}` : `until ${label}`}</div>
    </div>
  );
}

// ---- World clocks ----

function cityOf(zone: string): string {
  return zone.split("/").pop()?.replace(/_/g, " ") ?? zone;
}

function MiniFace({ date, zone }: { date: Date; zone: string }) {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(date);
  const h = Number(p.find((x) => x.type === "hour")?.value ?? 0);
  const m = Number(p.find((x) => x.type === "minute")?.value ?? 0);
  return (
    <svg viewBox="0 0 40 40" className="w-wc-face" aria-hidden>
      <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
      <line x1="20" y1="20" x2="20" y2="10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${m * 6} 20 20)`} />
      <line x1="20" y1="20" x2="20" y2="13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${(h % 12) * 30 + m / 2} 20 20)`} />
    </svg>
  );
}

export function WorldClockWidget({ widget }: WidgetProps) {
  const zonesText = opt(widget, "zones", "America/New_York, Europe/London, Asia/Tokyo, Australia/Sydney");
  const h24 = opt(widget, "twentyFour", false);
  const seconds = opt(widget, "seconds", false);
  const faces = opt(widget, "faces", true);
  const diff = opt(widget, "showDay", true);
  const now = useNow(seconds ? 1000 : 15_000);
  const date = new Date(now);
  const zones = zonesText.split(/[,\n]/).map((z: string) => z.trim()).filter(Boolean).slice(0, 6);
  const local = date.toLocaleDateString();
  return (
    <div className="w-wc">
      {zones.map((zone: string) => {
        let time = "—";
        let day = "";
        try {
          time = new Intl.DateTimeFormat(undefined, { timeZone: zone, hour: "numeric", minute: "2-digit", second: seconds ? "2-digit" : undefined, hour12: !h24 }).format(date);
          const there = new Intl.DateTimeFormat(undefined, { timeZone: zone }).format(date);
          day = there === local ? "Today" : new Date(there) > new Date(local) ? "Tomorrow" : "Yesterday";
        } catch {
          time = "Unknown zone";
        }
        return (
          <div key={zone} className="w-wc-row">
            {faces && time !== "Unknown zone" && <MiniFace date={date} zone={zone} />}
            <div className="w-wc-city"><strong>{cityOf(zone)}</strong>{diff && day && <small>{day}</small>}</div>
            <div className="w-wc-time">{time}</div>
          </div>
        );
      })}
      {zones.length === 0 && <div className="w-empty">Add time zones in Settings › Widgets (like Europe/Paris)</div>}
    </div>
  );
}

// ---- Time progress ----

export function ProgressWidget({ widget }: WidgetProps) {
  const style = opt(widget, "style", "bars");
  const decimals = opt(widget, "decimals", 0);
  const weekStart = opt(widget, "weekStart", "mon");
  const now = useNow(decimals > 0 ? 1000 : 30_000);
  const d = new Date(now);
  const startDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (d.getDay() - (weekStart === "mon" ? 1 : 0) + 7) % 7;
  const rows = [
    opt(widget, "day", true) && ["Today", (now - startDay.getTime()) / 86_400_000],
    opt(widget, "week", true) && ["This week", (dow + (now - startDay.getTime()) / 86_400_000) / 7],
    opt(widget, "month", true) && ["This month", (d.getDate() - 1 + (now - startDay.getTime()) / 86_400_000) / new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()],
    opt(widget, "year", true) && ["This year", (now - new Date(d.getFullYear(), 0, 1).getTime()) / (new Date(d.getFullYear() + 1, 0, 1).getTime() - new Date(d.getFullYear(), 0, 1).getTime())],
  ].filter(Boolean) as [string, number][];
  if (rows.length === 0) return <div className="w-empty">Choose something to track in Settings › Widgets</div>;
  return (
    <div className="w-progress" data-style={style}>
      {rows.map(([name, f]) => {
        const pct = clamp(f, 0, 1) * 100;
        return style === "rings" ? (
          <div key={name} className="w-progress-ring">
            <svg viewBox="0 0 40 40" aria-hidden>
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <circle cx="20" cy="20" r="16" fill="none" stroke="var(--aero-accent, #2f9de3)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 100.5} 100.5`} transform="rotate(-90 20 20)" />
            </svg>
            <strong>{pct.toFixed(decimals)}%</strong>
            <small>{name}</small>
          </div>
        ) : (
          <div key={name} className="w-progress-row">
            <div><span>{name}</span><strong>{pct.toFixed(decimals)}%</strong></div>
            <div className="w-bar"><i style={{ width: `${pct}%` }} /></div>
          </div>
        );
      })}
    </div>
  );
}

// ---- Date tile ----

function isoWeek(d: Date): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  return Math.ceil(((t.getTime() - Date.UTC(t.getUTCFullYear(), 0, 1)) / 86_400_000 + 1) / 7);
}

export function DateTileWidget({ widget }: WidgetProps) {
  const now = useNow(30_000);
  const d = new Date(now);
  const upper = opt(widget, "uppercase", true);
  const showYear = opt(widget, "showYear", false);
  const showWeek = opt(widget, "showWeek", false);
  const top = opt(widget, "top", "weekday");
  const fix = (s: string) => (upper ? s.toUpperCase() : s);
  const weekday = d.toLocaleDateString(undefined, { weekday: "long" });
  const month = d.toLocaleDateString(undefined, { month: "long" });
  return (
    <div className="w-date">
      <div className="w-date-top">{fix(top === "weekday" ? weekday : month)}</div>
      <div className="w-date-day">{d.getDate()}</div>
      <div className="w-date-bottom">{fix(top === "weekday" ? month : weekday)}{showYear ? ` ${d.getFullYear()}` : ""}</div>
      {showWeek && <div className="w-date-week">Week {isoWeek(d)}</div>}
    </div>
  );
}

// ---- Flip clock ----

function Flip({ value }: { value: string }) {
  return (
    <span className="w-flip-card">
      <span key={value} className="w-flip-digit">{value}</span>
      <i />
    </span>
  );
}

export function FlipClockWidget({ widget }: WidgetProps) {
  const seconds = opt(widget, "seconds", false);
  const h24 = opt(widget, "twentyFour", false);
  const ampm = opt(widget, "ampm", true);
  const now = useNow(seconds ? 1000 : 5000);
  const d = new Date(now);
  const hour = h24 ? d.getHours() : d.getHours() % 12 || 12;
  const parts = [pad(hour), pad(d.getMinutes()), ...(seconds ? [pad(d.getSeconds())] : [])];
  return (
    <div className="w-flip" data-card={opt(widget, "card", "glass")}>
      {parts.map((p, i) => (
        <span key={i} className="w-flip-pair">
          <Flip value={p[0]} />
          <Flip value={p[1]} />
        </span>
      ))}
      {!h24 && ampm && <span className="w-flip-ampm">{d.getHours() < 12 ? "AM" : "PM"}</span>}
    </div>
  );
}
