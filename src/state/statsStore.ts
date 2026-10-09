/**
 * The machine's recent load, for the menu bar's sparkline and its popover.
 *
 * Asked of Rust every couple of seconds while the bar is showing stats and the
 * person is at the machine (it rests with the idle state, like the ambient
 * scene, so a bar nobody is looking at costs nothing). Only the last half
 * minute or so is kept.
 */

import { create } from "zustand";
import { ipc } from "../ipc/commands";
import type { Stats } from "../ipc/types";
import { useUserIdle } from "./idleStore";

/** How many readings are kept: about a minute, at one every two seconds. */
const KEEP = 30;
const EVERY_MS = 2000;

interface StatsState {
  history: Stats[];
  latest: Stats | null;
  push: (s: Stats) => void;
}

export const useStats = create<StatsState>((set) => ({
  history: [],
  latest: null,
  push: (s) => set((state) => ({ latest: s, history: [...state.history, s].slice(-KEEP) })),
}));

/** Begin reading; returns what stops it. */
export function startStatsPolling(): () => void {
  let stopped = false;
  const read = () => {
    if (stopped || useUserIdle.getState().idle) return;
    ipc
      .getStats()
      .then((s) => !stopped && useStats.getState().push(s))
      .catch(() => undefined);
  };
  read();
  const timer = setInterval(read, EVERY_MS);
  return () => {
    stopped = true;
    clearInterval(timer);
  };
}

/** Bytes a second as a person reads it. */
export function formatRate(bytesPerSecond: number): string {
  const units = ["B/s", "KB/s", "MB/s", "GB/s"];
  let v = bytesPerSecond;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v >= 100 || i === 0 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}

/** Megabytes as gigabytes when there are a lot of them. */
export function formatMemory(mb: number): string {
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`;
}