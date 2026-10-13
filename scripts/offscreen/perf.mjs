// The table of frame timings: with the overlay on a window times its own frames and says how they went, and the
// table window draws what it is told (graded by how the slowest 5% compare with one frame of the screen).
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/perf.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

{
  const h = await startHarness({ out, window: "dock", viewport: [900, 400], running: [], settings: (s) => { s.appearance.frameOverlay = true; } });
  try {
    await h.open(".dock-icon");
    await h.sleep(2600);
    const said = await h.eval("window.__calls.filter((c) => c.cmd === 'report_frame_stats').map((c) => c.args.stats)");
    console.log("said:", JSON.stringify(said.slice(-1)));
    check(said.length >= 3, `it says how it is going about twice a second (${said.length} reports in 2.6 s)`);
    const last = said[said.length - 1];
    check(last.frames >= 20 && last.fps > 20, `with frames in them (${last.frames} frames, ${last.fps.toFixed(0)} fps)`);
    check(last.avgMs > 5 && last.avgMs < 60 && last.p95Ms >= last.avgMs * 0.9, `and gaps that make sense (avg ${last.avgMs.toFixed(1)} ms, p95 ${last.p95Ms.toFixed(1)} ms)`);
  } finally {
    h.close();
  }
}
{
  const h = await startHarness({ out, window: "dock", viewport: [900, 400], running: [], settings: (s) => { s.appearance.frameOverlay = false; } });
  try {
    await h.open(".dock-icon");
    await h.sleep(1600);
    const n = await h.eval("window.__calls.filter((c) => c.cmd === 'report_frame_stats').length");
    check(n === 0, `with it off nothing is timed or said (${n} reports)`);
  } finally {
    h.close();
  }
}
{
  const rows = [
    { label: "dock-1", monitor: "\\\\.\\DISPLAY2", refreshHz: 75, fps: 75, avgMs: 13.3, p95Ms: 14.2, worstMs: 22.0, late: 0, frames: 75, dpr: 1 },
    { label: "dock-2", monitor: "\\\\.\\DISPLAY1", refreshHz: 165, fps: 160, avgMs: 6.2, p95Ms: 8.9, worstMs: 41.5, late: 3, frames: 160, dpr: 1 },
    { label: "menubar", monitor: "\\\\.\\DISPLAY2", refreshHz: 75, fps: 41, avgMs: 24.4, p95Ms: 33.2, worstMs: 80.1, late: 17, frames: 41, dpr: 1 },
    { label: "start", monitor: "\\\\.\\DISPLAY2", refreshHz: 75, fps: 0, avgMs: 0, p95Ms: 0, worstMs: 0, late: 0, frames: 0, dpr: 1 },
  ];
  const h = await startHarness({ out, window: "perf", viewport: [700, 260], running: [], settings: () => {} });
  try {
    await h.open(".perf");
    await h.eval(`window.__frameRows = ${JSON.stringify(rows)}`);
    await h.sleep(1200);
    const grades = await h.eval("[...document.querySelectorAll('.perf tbody tr')].map((r) => r.dataset.grade).join(' ')");
    check(grades === "good fair poor idle", `lines are graded by their screen's own frame (${grades})`);
    console.log("sheet:", await h.sheet({ perf: await h.shot(0, 0, 700, 260, 2) }, "perf-table"));
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
