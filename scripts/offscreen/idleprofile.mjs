// Where a window spends its time when nobody touches it: a CPU profile over some seconds of idle, with the owner's
// real settings (dist-portable/data/settings.json if it is there), the functions with the most self time.
//   node --experimental-websocket scripts/offscreen/idleprofile.mjs <out> <window> [seconds]
import { readFileSync, existsSync } from "node:fs";
import { startHarness } from "./harness.mjs";
const [,, out, win = "menubar", secs = "10"] = process.argv;
const mine = existsSync("dist-portable/data/settings.json") ? JSON.parse(readFileSync("dist-portable/data/settings.json", "utf8")) : null;
const ready = { menubar: ".menubar", dock: ".dock-icon", frame: ".frame-root", framecorners: "#root", start: ".st-root" }[win] ?? "#root";
const pins = ["Notes", "Mail", "Maps", "Edge", "Code", "Teams"].map((name, i) => ({ id: `p${i}`, kind: "app", path: `C:\\Tools\\${name}.exe`, name, icon: null, children: [] }));
const h = await startHarness({ out, window: win, viewport: win === "frame" || win === "framecorners" ? [1920, 1036] : [1920, 700], settings: (s) => { if (mine) Object.assign(s, mine); if (win === "dock") s.pinned = pins; } });
try {
  await h.open(ready);
  await h.sleep(3000);
  await h.send("Profiler.enable");
  await h.send("Profiler.setSamplingInterval", { interval: 200 });
  await h.send("Profiler.start");
  await h.sleep(Number(secs) * 1000);
  const { result } = await h.send("Profiler.stop", {}, 60000);
  const p = result.profile;
  const dt = new Map(); // node id -> self time
  for (let i = 0; i < p.samples.length; i++) dt.set(p.samples[i], (dt.get(p.samples[i]) ?? 0) + (p.timeDeltas[i] ?? 0));
  const byFn = new Map(); let total = 0;
  for (const n of p.nodes) { const t = (dt.get(n.id) ?? 0) / 1000; const f = n.callFrame; if (f.functionName === "(idle)" || f.functionName === "(program)") continue; total += t; const key = `${f.functionName || "(anon)"} ${f.url.split("/").pop()}:${f.lineNumber}`; byFn.set(key, (byFn.get(key) ?? 0) + t); }
  console.log(`${win}: ${(total / Number(secs)).toFixed(2)} ms of script a second (sampled)`);
  for (const [k, t] of [...byFn].sort((a, b) => b[1] - a[1]).slice(0, 18)) console.log(`${(t / Number(secs)).toFixed(3).padStart(8)} ms/s  ${k}`);
  console.log("errors:", JSON.stringify(await h.errors()).slice(0, 300));
} finally { h.close(); }
process.exit(0);