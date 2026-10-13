/**
 * Timing a window's own frames, for the table of frame timings (Settings > Animations).
 *
 * The gaps between animation frames are what a person sees as smoothness: on a 165 Hz screen they should be
 * 6 ms, and on a 75 Hz one 13 ms; a gap twice that is a frame dropped. While the overlay is on, every window
 * times its frames and says how they went twice a second (`report_frame_stats`); a window of its own shows the
 * table (`features/perf`). Off, none of this runs.
 *
 * The numbers are of the last second (rate, average, the slowest 5%, late frames) and of the last ten (the
 * worst), so that a stutter that happened while something was opened is still on the table a moment later.
 */

import { useEffect } from "react";
import { ipc } from "../../ipc/commands";
import { useSettings } from "../../state/settingsStore";

/** A gap longer than this is the window having been hidden, not a frame. */
const HIDDEN_MS = 2000;

/** Sort ascending and take the value a fraction of the way up. */
export function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1))];
}

export interface Summary {
  fps: number;
  avgMs: number;
  p95Ms: number;
  worstMs: number;
  late: number;
  frames: number;
}

/** What the last second's gaps (and the last ten seconds' worst) come to. */
export function summarise(second: number[], worstOfTen: number): Summary {
  const n = second.length;
  if (n === 0) return { fps: 0, avgMs: 0, p95Ms: 0, worstMs: worstOfTen, late: 0, frames: 0 };
  const sorted = [...second].sort((a, b) => a - b);
  const total = second.reduce((a, b) => a + b, 0);
  const median = percentile(sorted, 0.5);
  return {
    fps: (n / total) * 1000,
    avgMs: total / n,
    p95Ms: percentile(sorted, 0.95),
    worstMs: Math.max(worstOfTen, sorted[n - 1]),
    late: second.filter((g) => g > 1.5 * median).length,
    frames: n,
  };
}

export function useFrameMeter(): void {
  const on = useSettings((s) => s.settings?.appearance.frameOverlay ?? false);
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    let last = performance.now();
    // [when, gap] for the last ten seconds
    let gaps: Array<[number, number]> = [];
    const tick = (now: number) => {
      const gap = now - last;
      last = now;
      if (gap < HIDDEN_MS) gaps.push([now, gap]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const say = window.setInterval(() => {
      const now = performance.now();
      gaps = gaps.filter(([t]) => now - t < 10_000);
      const second = gaps.filter(([t]) => now - t < 1000).map(([, g]) => g);
      const worst = gaps.reduce((m, [, g]) => Math.max(m, g), 0);
      ipc.reportFrameStats({ ...summarise(second, worst), dpr: window.devicePixelRatio || 1 }).catch(() => undefined);
    }, 500);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(say);
    };
  }, [on]);
}
