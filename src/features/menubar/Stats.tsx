/**
 * The load graph in the menu bar and the popover it opens.
 *
 * The graph is the processor's last minute, as a small filled line. The popover
 * has the processor and the network as larger graphs, memory as a bar, and the
 * programs using the most, by processor or by memory (a browser's dozen
 * processes are one row). It only reads; Task Manager is a click away for
 * anything more.
 */

import { Roll } from "../../engine/type/Roll";
import { useEffect, useState } from "react";
import { ipc } from "../../ipc/commands";
import type { Program } from "../../ipc/types";
import { formatMemory, formatRate, useStats } from "../../state/statsStore";
import { notify } from "../feedback/toastStore";

/** A line over `values` (0 to `max`), in a box of `width` by `height`. */
function Line({ values, max, width, height, fill = true }: { values: number[]; max: number; width: number; height: number; fill?: boolean }) {
  if (values.length < 2) return <svg width={width} height={height} aria-hidden />;
  const step = width / (values.length - 1);
  const y = (v: number) => height - 1 - (Math.min(v, max) / max) * (height - 2);
  const points = values.map((v, i) => `${(i * step).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {fill && <polygon points={`0,${height} ${points} ${width},${height}`} fill="currentColor" opacity="0.22" />}
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** The graph in the bar. */
export function StatsSparkline() {
  const history = useStats((s) => s.history);
  const cpu = history.map((s) => s.cpuPercent);
  return (
    <span className="mb-spark">
      <Line values={cpu} max={100} width={34} height={14} />
    </span>
  );
}

/** What it says for a screen reader, and as the button's tooltip. */
export function useStatsLabel(): string {
  const latest = useStats((s) => s.latest);
  return latest ? `System load: processor ${latest.cpuPercent} percent, memory ${latest.memoryPercent} percent` : "System load";
}

export function StatsPanel() {
  const history = useStats((s) => s.history);
  const latest = useStats((s) => s.latest);
  const [byCpu, setByCpu] = useState(true);
  const [programs, setPrograms] = useState<Program[]>([]);

  // the list of programs is read only while the popover is open
  useEffect(() => {
    let alive = true;
    const read = () =>
      ipc
        .getTopProcesses(byCpu, 6)
        .then((p) => alive && setPrograms(p))
        .catch(() => undefined);
    void read();
    const timer = setInterval(read, 2000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [byCpu]);

  const cpu = history.map((s) => s.cpuPercent);
  const down = history.map((s) => s.netDown);
  const up = history.map((s) => s.netUp);
  const netMax = Math.max(64 * 1024, ...down, ...up);

  return (
    <div className="cc stats">
      <div className="cc-card">
        <div className="stats-head">
          <span className="cc-card-title">Processor</span>
          <strong className="stats-big">{latest ? <Roll text={`${latest.cpuPercent}%`} /> : "…"}</strong>
        </div>
        <div className="stats-graph">
          <Line values={cpu} max={100} width={290} height={46} />
        </div>
      </div>

      <div className="cc-card">
        <div className="stats-head">
          <span className="cc-card-title">Memory</span>
          <strong className="stats-big">{latest ? <Roll text={`${latest.memoryPercent}%`} /> : "…"}</strong>
        </div>
        <div className="stats-bar" role="meter" aria-label="Memory in use" aria-valuenow={latest?.memoryPercent ?? 0} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${latest?.memoryPercent ?? 0}%` }} />
        </div>
        <small className="stats-note">
          {latest ? `${formatMemory(latest.memoryUsedMb)} of ${formatMemory(latest.memoryTotalMb)}` : ""}
        </small>
      </div>

      <div className="cc-card">
        <div className="stats-head">
          <span className="cc-card-title">Network</span>
          <span className="stats-rates">
            <span title="Download">↓ {latest ? formatRate(latest.netDown) : "…"}</span>
            <span title="Upload">↑ {latest ? formatRate(latest.netUp) : "…"}</span>
          </span>
        </div>
        <div className="stats-graph">
          <Line values={down} max={netMax} width={290} height={34} />
        </div>
      </div>

      <div className="cc-card">
        <div className="stats-head">
          <span className="cc-card-title">Using the most</span>
          <span className="stats-switch" role="group" aria-label="Sort by">
            <button data-on={byCpu} onClick={() => setByCpu(true)}>
              Processor
            </button>
            <button data-on={!byCpu} onClick={() => setByCpu(false)}>
              Memory
            </button>
          </span>
        </div>
        <ul className="stats-list">
          {programs.map((p) => (
            <li key={p.name}>
              <span className="stats-name">
                {p.name}
                {p.processes > 1 && <small> ×{p.processes}</small>}
              </span>
              <span className="stats-value">{byCpu ? `${p.cpuPercent.toFixed(1)}%` : formatMemory(p.memoryMb)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="cc-links">
        <button onClick={() => ipc.systemAction("taskmgr").catch(notify.on("Could not open Task Manager"))}>Task Manager…</button>
      </div>
    </div>
  );
}