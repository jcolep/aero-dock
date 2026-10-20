/**
 * The widgets you write in or tap: Notes, Checklist, Counter. What they hold (the text, the items, the count) is kept
 * as the widget's own settings, so it is saved with everything else and goes with an exported settings file.
 */

import { useEffect, useRef, useState } from "react";
import { clamp, opt, typing, useExtra } from "../kit";
import type { WidgetProps } from "../registry";

export function NotesWidget({ widget }: WidgetProps) {
  const [text, setText] = useExtra(widget, "text", "");
  const title = opt(widget, "title", "");
  const fontSize = opt(widget, "fontSize", 15);
  const mono = opt(widget, "mono", false);
  const paper = opt(widget, "paper", "glass");
  const spell = opt(widget, "spellcheck", false);
  const count = opt(widget, "showCount", false);
  return (
    <div className="w-notes" data-paper={paper}>
      {title && <div className="w-notes-title">{title}</div>}
      <textarea
        className="w-notes-text"
        value={text}
        spellCheck={spell}
        placeholder="Write something…"
        maxLength={6000}
        style={{ fontSize, fontFamily: mono ? "ui-monospace, Consolas, monospace" : undefined }}
        onChange={(e) => setText(e.target.value)}
        {...typing()}
      />
      {count && <div className="w-notes-count">{text.trim() ? text.trim().split(/\s+/).length : 0} words</div>}
    </div>
  );
}

interface Item {
  t: string;
  d: boolean;
}
const MAX_ITEMS = 40;

export function ChecklistWidget({ widget }: WidgetProps) {
  const [items, setItems] = useExtra<Item[]>(widget, "items", []);
  const [draft, setDraft] = useState("");
  const title = opt(widget, "title", "To do");
  const strike = opt(widget, "strike", true);
  const hideDone = opt(widget, "hideDone", false);
  const progress = opt(widget, "progress", true);
  const newAtTop = opt(widget, "newAtTop", false);
  const done = items.filter((i) => i.d).length;
  const add = () => {
    const t = draft.trim().slice(0, 140);
    if (!t || items.length >= MAX_ITEMS) return;
    setItems((cur) => (newAtTop ? [{ t, d: false }, ...cur] : [...cur, { t, d: false }]), true);
    setDraft("");
  };
  return (
    <div className="w-list">
      <div className="w-list-head">
        <strong>{title}</strong>
        {progress && items.length > 0 && <span>{done}/{items.length}</span>}
      </div>
      {progress && items.length > 0 && <div className="w-bar"><i style={{ width: `${(done / items.length) * 100}%` }} /></div>}
      <div className="w-list-items">
        {items.map((it, i) =>
          hideDone && it.d ? null : (
            <div key={i} className="w-list-row" data-done={it.d} data-strike={strike}>
              <button data-nodrag className="w-check" aria-label={it.d ? "Mark not done" : "Mark done"} onClick={() => setItems((cur) => cur.map((x, j) => (j === i ? { ...x, d: !x.d } : x)), true)}>
                {it.d && <svg viewBox="0 0 12 12"><path d="m2.5 6.4 2.4 2.4 4.6-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>
              <span>{it.t}</span>
              <button data-nodrag className="w-x" aria-label="Remove" onClick={() => setItems((cur) => cur.filter((_, j) => j !== i), true)}>×</button>
            </div>
          ),
        )}
        {items.length === 0 && <div className="w-empty">Nothing to do</div>}
      </div>
      <input
        className="w-list-add"
        value={draft}
        placeholder={items.length >= MAX_ITEMS ? "The list is full" : "Add an item…"}
        disabled={items.length >= MAX_ITEMS}
        maxLength={140}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && add()}
        {...typing()}
      />
    </div>
  );
}

const today = () => new Date().toDateString();

export function CounterWidget({ widget }: WidgetProps) {
  const [count, setCount] = useExtra(widget, "count", 0);
  const [day, setDay] = useExtra(widget, "countDay", today());
  const label = opt(widget, "label", "Glasses of water");
  const icon = opt(widget, "icon", "💧");
  const goal = opt(widget, "goal", 8);
  const step = opt(widget, "step", 1);
  const resetDaily = opt(widget, "resetDaily", true);
  const ring = opt(widget, "ring", true);
  const checked = useRef(false);
  // a new day starts again at nothing (when asked to)
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    if (resetDaily && day !== today()) {
      setCount(0, true);
      setDay(today(), true);
    }
  }, [resetDaily, day, setCount, setDay]);
  const bump = (by: number) => {
    setCount((c) => clamp(c + by, 0, 99999), true);
    if (day !== today()) setDay(today(), true);
  };
  const frac = goal > 0 ? clamp(count / goal, 0, 1) : 0;
  const R = 40;
  const C = 2 * Math.PI * R;
  return (
    <div className="w-counter">
      <div className="w-counter-ring">
        {ring && goal > 0 && (
          <svg viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="7" />
            <circle cx="50" cy="50" r={R} fill="none" stroke="var(--aero-life, #7ad03a)" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${C * frac} ${C}`} transform="rotate(-90 50 50)" style={{ transition: "stroke-dasharray 0.4s ease" }} />
          </svg>
        )}
        <div className="w-counter-center">
          <span className="w-counter-icon">{icon}</span>
          <strong>{count}</strong>
          {goal > 0 && <small>of {goal}</small>}
        </div>
      </div>
      <div className="w-counter-label">{label}</div>
      <div className="w-counter-buttons">
        <button data-nodrag onClick={() => bump(-step)} aria-label="Less">−</button>
        <button data-nodrag onClick={() => bump(step)} aria-label="More" className="w-primary">+</button>
        <button data-nodrag onClick={() => setCount(0, true)} aria-label="Start again" title="Start again">↺</button>
      </div>
    </div>
  );
}
