/**
 * The table of frame timings: a small window at the top left of the main screen, out of the way of the pointer.
 * One line to a window: which, the screen it is on and that screen's rate, frames a second, the average gap, the
 * slowest 5%, the worst in ten seconds, and the late frames. A line is green when the slowest 5% are within a
 * quarter of a frame of the screen's own gap, amber within 60%, and red past that.
 */

import { useEffect, useState } from "react";
import { ipc } from "../../ipc/commands";
import type { FrameRow } from "../../ipc/types";
import "./perf.css";

/** How a line did, from its slowest 5% against what one frame of its screen is. */
export function grade(row: FrameRow): "good" | "fair" | "poor" | "idle" {
  if (row.frames < 3) return "idle";
  const frame = row.refreshHz > 0 ? 1000 / row.refreshHz : row.avgMs;
  if (row.p95Ms <= frame * 1.25) return "good";
  if (row.p95Ms <= frame * 1.6) return "fair";
  return "poor";
}

const ms = (v: number) => (v > 0 ? v.toFixed(1) : "–");

export function PerfApp() {
  const [rows, setRows] = useState<FrameRow[]>([]);
  useEffect(() => {
    let alive = true;
    const look = () => ipc.frameStats().then((r) => alive && setRows(r)).catch(() => undefined);
    look();
    const t = window.setInterval(look, 500);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);
  return (
    <div className="perf-root">
      <table className="perf">
        <thead>
          <tr>
            <th>window</th>
            <th>screen</th>
            <th>Hz</th>
            <th>fps</th>
            <th>avg</th>
            <th>p95</th>
            <th>worst</th>
            <th>late</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} data-grade={grade(r)}>
              <td>{r.label.replace(/^dock-/, "dock ")}</td>
              <td>{r.monitor.replace(/^\\\\\.\\/, "")}</td>
              <td>{r.refreshHz || "?"}</td>
              <td>{r.fps.toFixed(0)}</td>
              <td>{ms(r.avgMs)}</td>
              <td>{ms(r.p95Ms)}</td>
              <td>{ms(r.worstMs)}</td>
              <td>{r.late}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={8}>waiting for the windows to say how they are drawing…</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
