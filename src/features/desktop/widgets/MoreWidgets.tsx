/**
 * Moon, Quote, Dice and coins, Calculator, Volume and brightness, Battery. The moon, the quotes and the dice are all
 * worked out here (no network); the volume, brightness and battery are the same readings the dock and the Control
 * Center use.
 */

import { useEffect, useRef, useState } from "react";
import { ipc } from "../../../ipc/commands";
import type { BrightnessInfo } from "../../../ipc/types";
import { calculate } from "../../start/calc";
import { ElasticSlider } from "../../menubar/ElasticSlider";
import { useSystem } from "../../../state/systemStore";
import { clamp, opt, useNow } from "../kit";
import type { WidgetProps } from "../registry";

// ---- Moon ----

const SYNODIC = 29.530588853;
/** The phase as a fraction of the cycle, 0 new, 0.5 full (from the new moon of 6 January 2000, 18:14 UTC). */
function phaseAt(ms: number): number {
  const jd = ms / 86_400_000 + 2440587.5;
  const age = (((jd - 2451550.1) % SYNODIC) + SYNODIC) % SYNODIC;
  return age / SYNODIC;
}
function phaseName(p: number): string {
  const names = ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"];
  return names[Math.floor(((p + 1 / 16) % 1) * 8)];
}

export function MoonWidget({ widget }: WidgetProps) {
  const south = opt(widget, "south", false);
  const showName = opt(widget, "showName", true);
  const showLit = opt(widget, "showLit", true);
  const showNext = opt(widget, "showNext", true);
  const now = useNow(60_000);
  const p = phaseAt(now);
  const k = Math.cos(2 * Math.PI * p);
  const lit = (1 - k) / 2;
  const waxing = p < 0.5;
  const rx = Math.abs(k) * 40;
  const d = `M50 10 A40 40 0 0 1 50 90 A${rx.toFixed(2)} 40 0 0 ${k > 0 ? 0 : 1} 50 10 Z`;
  const toFull = (((0.5 - p) % 1) + 1) % 1 * SYNODIC;
  const toNew = (((1 - p) % 1) + 1) % 1 * SYNODIC;
  const next = toFull < toNew ? ["Full moon", toFull] : ["New moon", toNew];
  const flip = (waxing ? 1 : -1) * (south ? -1 : 1);
  return (
    <div className="w-moon">
      <svg viewBox="0 0 100 100" aria-hidden className="w-moon-disc">
        <defs>
          <radialGradient id="w-moon-lit" cx="40%" cy="38%" r="70%">
            <stop offset="0" stopColor="#fffbe8" />
            <stop offset="1" stopColor="#d9d4bd" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="rgba(14,28,52,0.55)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <g transform={`translate(50 0) scale(${flip} 1) translate(-50 0)`}>
          <path d={d} fill="url(#w-moon-lit)" />
        </g>
      </svg>
      {showName && <strong>{phaseName(p)}</strong>}
      {showLit && <small>{Math.round(lit * 100)}% lit</small>}
      {showNext && <small>{next[0] as string} in {Math.max(0, Math.round(next[1] as number))} days</small>}
    </div>
  );
}

// ---- Quote ----

const QUOTES: [string, string][] = [
  ["The only way to do great work is to love what you do.", "Steve Jobs"],
  ["Well done is better than well said.", "Benjamin Franklin"],
  ["Simplicity is the ultimate sophistication.", "Leonardo da Vinci"],
  ["What we think, we become.", "Buddha"],
  ["Stay hungry, stay foolish.", "Stewart Brand"],
  ["The best way out is always through.", "Robert Frost"],
  ["Done is better than perfect.", "Sheryl Sandberg"],
  ["Make it work, make it right, make it fast.", "Kent Beck"],
  ["Premature optimization is the root of all evil.", "Donald Knuth"],
  ["Programs must be written for people to read.", "Harold Abelson"],
  ["Talk is cheap. Show me the code.", "Linus Torvalds"],
  ["Every great design begins with an even better story.", "Lorinda Mamo"],
  ["Design is not just what it looks like. Design is how it works.", "Steve Jobs"],
  ["Little by little, one travels far.", "J. R. R. Tolkien"],
  ["Fall seven times, stand up eight.", "Japanese proverb"],
  ["It always seems impossible until it's done.", "Nelson Mandela"],
  ["The journey of a thousand miles begins with a single step.", "Lao Tzu"],
  ["Not all those who wander are lost.", "J. R. R. Tolkien"],
  ["Whether you think you can or you think you can't, you're right.", "Henry Ford"],
  ["Quality is not an act, it is a habit.", "Aristotle"],
  ["The secret of getting ahead is getting started.", "Mark Twain"],
  ["Action is the foundational key to all success.", "Pablo Picasso"],
  ["Energy and persistence conquer all things.", "Benjamin Franklin"],
  ["We are what we repeatedly do.", "Will Durant"],
  ["Nothing will work unless you do.", "Maya Angelou"],
  ["The harder I work, the luckier I get.", "Samuel Goldwyn"],
  ["Keep it simple, stupid.", "Kelly Johnson"],
  ["First, solve the problem. Then, write the code.", "John Johnson"],
  ["Imagination is more important than knowledge.", "Albert Einstein"],
  ["Turn your wounds into wisdom.", "Oprah Winfrey"],
];

export function QuoteWidget({ widget }: WidgetProps) {
  const source = opt(widget, "source", "builtin");
  const custom = opt(widget, "custom", "");
  const change = opt(widget, "change", "daily");
  const showAuthor = opt(widget, "showAuthor", true);
  const serif = opt(widget, "serif", true);
  const size = opt(widget, "size", 18);
  const align = opt(widget, "align", "center");
  const launched = useRef(Math.floor(Math.random() * 1e6));
  const now = useNow(60_000);
  const mine: [string, string][] = custom
    .split("\n")
    .map((l: string) => l.trim())
    .filter(Boolean)
    .map((l: string) => {
      const [text, ...by] = l.split(/\s+[—–-]\s+/);
      return [text, by.join(" — ")] as [string, string];
    });
  const pool = source === "custom" ? (mine.length ? mine : QUOTES) : source === "both" ? [...QUOTES, ...mine] : QUOTES;
  const period = change === "hourly" ? 3_600_000 : change === "tenMin" ? 600_000 : change === "launch" ? 0 : 86_400_000;
  const index = period === 0 ? launched.current : Math.floor(now / period);
  // a stride that is not a factor of the pool, so the order does not look like the list
  const [text, by] = pool[(index * 7) % pool.length];
  return (
    <div className="w-quote" style={{ textAlign: align as React.CSSProperties["textAlign"] }}>
      <blockquote style={{ fontSize: size, fontFamily: serif ? "Georgia, 'Times New Roman', serif" : undefined }}>“{text}”</blockquote>
      {showAuthor && by && <cite>— {by}</cite>}
    </div>
  );
}

// ---- Dice, coins and the 8 ball ----

const BALL = ["It is certain.", "Without a doubt.", "You may rely on it.", "Yes, definitely.", "Most likely.", "Outlook good.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful.", "Yes.", "No.", "Maybe."];

export function RandomizerWidget({ widget }: WidgetProps) {
  const mode = opt(widget, "mode", "dice");
  const sides = Number(opt(widget, "sides", 6));
  const count = opt(widget, "count", 2);
  const animate = opt(widget, "animate", true);
  const history = opt(widget, "history", true);
  const [shown, setShown] = useState<string>("");
  const [past, setPast] = useState<string[]>([]);
  const [rolling, setRolling] = useState(false);
  const pick = (n: number) => 1 + Math.floor(Math.random() * n);
  const roll = () => {
    const make = () =>
      mode === "dice" ? Array.from({ length: count }, () => pick(sides)).join(" · ") : mode === "coin" ? (Math.random() < 0.5 ? "Heads" : "Tails") : mode === "number" ? String(pick(sides === 6 ? 100 : sides * 10)) : BALL[Math.floor(Math.random() * BALL.length)];
    const final = make();
    if (!animate) {
      setShown(final);
      setPast((p) => [final, ...p].slice(0, 5));
      return;
    }
    setRolling(true);
    let n = 0;
    const id = window.setInterval(() => {
      if (++n < 7) setShown(make());
      else {
        window.clearInterval(id);
        setShown(final);
        setRolling(false);
        setPast((p) => [final, ...p].slice(0, 5));
      }
    }, 70);
  };
  useEffect(() => setShown(""), [mode]);
  const total = mode === "dice" && shown && !rolling ? shown.split(" · ").reduce((a, b) => a + Number(b), 0) : null;
  return (
    <div className="w-rand" data-mode={mode}>
      <button data-nodrag className="w-rand-main" data-rolling={rolling || undefined} onClick={roll}>
        <span className="w-rand-result" data-long={mode === "ball" || undefined}>{shown || (mode === "ball" ? "Ask a question" : mode === "coin" ? "Flip" : "Roll")}</span>
        {total !== null && count > 1 && <small>total {total}</small>}
        <small className="w-rand-hint">{mode === "dice" ? `${count}d${sides}` : mode === "number" ? `1–${sides === 6 ? 100 : sides * 10}` : mode === "coin" ? "coin" : "8 ball"} · click</small>
      </button>
      {history && past.length > 1 && <div className="w-rand-past">{past.slice(1).join("   ")}</div>}
    </div>
  );
}

// ---- Calculator ----

const KEYS = ["C", "(", ")", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ".", "⌫", "="];

export function CalculatorWidget({ widget }: WidgetProps) {
  const decimals = opt(widget, "decimals", 8);
  const showLast = opt(widget, "showLast", true);
  const [expr, setExpr] = useState("");
  const [last, setLast] = useState("");
  // after an answer a number starts afresh and an operator carries on from it
  const [fresh, setFresh] = useState(false);
  const evaluate = (e: string): string | null => {
    const v = calculate(e.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-"));
    return v === null || !Number.isFinite(v) ? null : String(parseFloat(v.toFixed(decimals)));
  };
  const press = (k: string) => {
    if (k === "C") {
      setExpr("");
      setFresh(false);
    } else if (k === "⌫") {
      setExpr((e) => e.slice(0, -1));
      setFresh(false);
    } else if (k === "=") {
      const r = evaluate(expr);
      if (r !== null) {
        setLast(`${expr} =`);
        setExpr(r);
        setFresh(true);
      }
    } else {
      setExpr((e) => ((fresh && /[\d.(]/.test(k) ? "" : e) + k).slice(0, 60));
      setFresh(false);
    }
  };
  const live = expr ? evaluate(expr) : null;
  return (
    <div className="w-calc">
      <div className="w-calc-display">
        {showLast && <small>{last}</small>}
        <div className="w-calc-expr">{expr || "0"}</div>
        <div className="w-calc-live">{live !== null && live !== expr ? `= ${live}` : " "}</div>
      </div>
      <div className="w-calc-keys">
        {KEYS.map((k) => (
          <button key={k} data-nodrag data-kind={/\d|\./.test(k) ? "num" : k === "=" ? "eq" : "op"} onClick={() => press(k)}>
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- Volume and brightness ----

export function ControlsWidget({ widget }: WidgetProps) {
  const { status, hydrate } = useSystem();
  const [bright, setBright] = useState<BrightnessInfo | null>(null);
  const showVolume = opt(widget, "showVolume", true);
  const showBrightness = opt(widget, "showBrightness", true);
  const showPercent = opt(widget, "showPercent", true);
  useEffect(() => {
    hydrate();
    ipc.getBrightness().then(setBright).catch(() => undefined);
  }, [hydrate]);
  const vol = status?.volume;
  const sendBright = useRef<number | undefined>(undefined);
  return (
    <div className="w-controls">
      {showVolume && (
        <div className="w-controls-row">
          <button data-nodrag className="w-icon-btn" aria-label={vol?.muted ? "Unmute" : "Mute"} onClick={() => ipc.setVolume(undefined, !vol?.muted).catch(() => undefined)}>
            {vol?.muted ? "🔇" : "🔊"}
          </button>
          <div className="w-controls-slider" data-nodrag>
            <ElasticSlider value={vol?.level ?? 0} muted={!!vol?.muted} label="Volume" onChange={(v) => ipc.setVolume(v).catch(() => undefined)} />
          </div>
          {showPercent && <span className="w-controls-val">{vol?.available ? vol.level : "–"}</span>}
        </div>
      )}
      {showBrightness && (
        <div className="w-controls-row">
          <span className="w-icon-btn" aria-hidden>☀️</span>
          <div className="w-controls-slider" data-nodrag>
            <ElasticSlider
              value={bright?.percent ?? 0}
              muted={false}
              label="Brightness"
              onChange={(v) => {
                setBright((b) => ({ available: b?.available ?? true, percent: v }));
                window.clearTimeout(sendBright.current);
                sendBright.current = window.setTimeout(() => ipc.setBrightness(Math.round(v)).catch(() => undefined), 120);
              }}
            />
          </div>
          {showPercent && <span className="w-controls-val">{bright?.available === false ? "–" : Math.round(bright?.percent ?? 0)}</span>}
        </div>
      )}
      {bright?.available === false && showBrightness && <small className="w-controls-note">This display does not take brightness from here</small>}
    </div>
  );
}

// ---- Battery ----

export function BatteryWidget({ widget }: WidgetProps) {
  const { status, hydrate } = useSystem();
  const style = opt(widget, "style", "ring");
  const low = opt(widget, "lowAt", 20);
  const showState = opt(widget, "showState", true);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  const b = status?.battery;
  if (!b?.present) return <div className="w-empty">No battery in this computer</div>;
  const pct = clamp(b.percent, 0, 100);
  const warn = pct <= low && !b.charging;
  const R = 40;
  const C = 2 * Math.PI * R;
  const color = warn ? "#ff6a5e" : b.charging ? "var(--aero-life, #7ad03a)" : "var(--aero-accent, #2f9de3)";
  const state = b.charging ? "Charging" : pct >= 99 ? "Full" : warn ? "Low" : "On battery";
  return (
    <div className="w-battery" data-warn={warn || undefined}>
      {style === "ring" ? (
        <div className="w-battery-ring">
          <svg viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
            <circle cx="50" cy="50" r={R} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${C * (pct / 100)} ${C}`} transform="rotate(-90 50 50)" style={{ transition: "stroke-dasharray 0.5s ease" }} />
          </svg>
          <strong>{pct}%</strong>
        </div>
      ) : (
        <div className="w-battery-bar">
          <strong>{pct}%</strong>
          <div className="w-bar"><i style={{ width: `${pct}%`, background: color }} /></div>
        </div>
      )}
      {showState && <small>{state}</small>}
    </div>
  );
}
