/**
 * What the Start menu's search has learned: which result was opened for what was typed, so that next time it comes
 * first for those letters, as Windows' Start search learns. Opening VS Code after typing "v" lifts VS Code for "v",
 * and for "vs" and "vsc" if those were typed on the way.
 *
 * Kept in this machine's web storage (shared by the app's windows, so Settings can clear it), not in settings.json:
 * it changes with every search, and nothing else needs to hear about it. Lost storage only means it learns again.
 * Older picks count for less (half as much after a month), and it keeps the 400 queries used most recently.
 */

import { fold } from "./searchMatch";

export const LEARNED_KEY = "liquidock.start.searchMemory";
const MAX_QUERIES = 400;
const HALF_LIFE_MS = 30 * 86_400_000;

interface Pick {
  n: number;
  at: number;
}
interface Memory {
  /** query (folded) -> target -> how often and when it was last picked */
  picks: Record<string, Record<string, Pick>>;
}

function read(): Memory {
  try {
    const raw = localStorage.getItem(LEARNED_KEY);
    const m = raw ? (JSON.parse(raw) as Memory) : null;
    if (m && typeof m.picks === "object" && m.picks) return m;
  } catch {
    /* storage unavailable or damaged: start afresh */
  }
  return { picks: {} };
}

let memory: Memory | null = null;
const mem = () => (memory ??= read());

function write() {
  try {
    localStorage.setItem(LEARNED_KEY, JSON.stringify(mem()));
  } catch {
    /* nowhere to keep it: it still works for this session */
  }
}

/** Remember that `target` was opened after typing `query` (and every shorter start of it typed on the way). */
export function remember(query: string, target: string, now = Date.now()) {
  const q = fold(query.trim()).replace(/\s+/g, " ");
  if (!q || !target) return;
  const m = mem();
  for (let len = 1; len <= q.length; len++) {
    const key = q.slice(0, len);
    const row = (m.picks[key] ??= {});
    const was = row[target];
    row[target] = { n: (was ? decayed(was, now) : 0) + 1, at: now };
  }
  // keep the queries used most recently
  const keys = Object.keys(m.picks);
  if (keys.length > MAX_QUERIES) {
    const latest = (k: string) => Math.max(...Object.values(m.picks[k]).map((p) => p.at));
    keys.sort((a, b) => latest(a) - latest(b));
    for (const k of keys.slice(0, keys.length - MAX_QUERIES)) delete m.picks[k];
  }
  write();
}

const decayed = (p: Pick, now: number) => p.n * Math.pow(0.5, Math.max(0, now - p.at) / HALF_LIFE_MS);

/** How much what was picked before for this query lifts `target` (0 if never). One pick is worth more than a band of
 *  match quality (100), a few are worth about two. */
export function boost(query: string, target: string, now = Date.now()): number {
  const q = fold(query.trim()).replace(/\s+/g, " ");
  const p = mem().picks[q]?.[target];
  if (!p) return 0;
  const n = decayed(p, now);
  return Math.min(260, 110 + 60 * Math.log2(1 + n));
}

/** The targets picked before for exactly this query: these are offered even if the letters no longer match them. */
export function pickedFor(query: string): string[] {
  const q = fold(query.trim()).replace(/\s+/g, " ");
  return Object.keys(mem().picks[q] ?? {});
}

/** Forget everything learned (Settings › Start). */
export function forget() {
  memory = { picks: {} };
  try {
    localStorage.removeItem(LEARNED_KEY);
  } catch {
    /* nothing kept */
  }
}

/** Read it again from storage (another window may have cleared it). */
export function reload() {
  memory = null;
}
