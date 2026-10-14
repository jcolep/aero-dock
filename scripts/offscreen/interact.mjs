// What the interactions cost the page: for each, the main thread's work per second (script, style, layout), how many
// style recalculations and layouts, and the long animation frames (over 20 ms) with what ran in them. The browser
// draws in software here, so absolute times are not the real app's; what costs most, relative to the rest, is.
//   node --experimental-websocket scripts/offscreen/interact.mjs <out> [only]
import { startHarness } from "./harness.mjs";
const [,, out, only] = process.argv;
const pins = ["Notes", "Mail", "Maps", "Edge", "Code", "Teams", "Files", "Music", "Photos"].map((name, i) => ({ id: `p${i}`, kind: "app", path: `C:\\Tools\\${name}.exe`, name, icon: null, children: [] }));
const LOAF = `window.__loaf = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.duration > 20) window.__loaf.push({ d: Math.round(e.duration), block: Math.round(e.blockingDuration), scripts: e.scripts.slice(0, 3).map((s) => (s.sourceFunctionName || s.invoker || "?") + "@" + (s.sourceURL || "").split("/").pop() + " " + Math.round(s.duration)) }); }).observe({ type: "long-animation-frame", buffered: false });`;
async function measure(h, name, run) {
  await h.eval(LOAF);
  await h.send("Performance.enable");
  const a = (await h.send("Performance.getMetrics")).result.metrics;
  const t0 = Date.now(); await run(); const secs = (Date.now() - t0) / 1000;
  const b = (await h.send("Performance.getMetrics")).result.metrics;
  const d = (k) => (b.find((m) => m.name === k)?.value ?? 0) - (a.find((m) => m.name === k)?.value ?? 0);
  const loaf = await h.eval("window.__loaf");
  console.log(`${name.padEnd(26)} ${secs.toFixed(1)}s  script ${(d("ScriptDuration") * 1000 / secs).toFixed(0).padStart(4)} ms/s  style ${(d("RecalcStyleDuration") * 1000 / secs).toFixed(0).padStart(4)} ms/s (${(d("RecalcStyleCount") / secs).toFixed(0)}/s)  layout ${(d("LayoutDuration") * 1000 / secs).toFixed(0).padStart(4)} ms/s (${(d("LayoutCount") / secs).toFixed(0)}/s)  long frames ${loaf.length}${loaf.length ? ", worst " + Math.max(...loaf.map((l) => l.d)) + " ms" : ""}`);
  const worst = loaf.sort((x, y) => y.d - x.d).slice(0, 2);
  for (const l of worst) console.log(`      ${l.d} ms: ${l.scripts.join(" | ")}`);
}
const sweep = async (h, y, x0, x1, ms) => { const steps = Math.round(ms / 16); for (let i = 0; i <= steps; i++) { await h.move(x0 + ((x1 - x0) * i) / steps, y); await h.sleep(16); } };
const cases = {
  async dock() {
    const h = await startHarness({ out, window: "dock", viewport: [1400, 400], running: [], settings: (s) => { s.pinned = pins; } });
    try { await h.open(".dock-icon"); await h.sleep(1500); const bar = await h.rect(".dock-bar");
      await measure(h, "dock: magnify sweep", async () => { await sweep(h, bar.y, bar.left + 10, bar.left + bar.width - 10, 1500); await sweep(h, bar.y, bar.left + bar.width - 10, bar.left + 10, 1500); });
      await measure(h, "dock: idle", () => h.sleep(3000));
    } finally { h.close(); }
  },
  async menubar() {
    const h = await startHarness({ out, window: "menubar", viewport: [1600, 900], settings: (s) => { s.menuBar.enabled = true; } });
    try { await h.open(".menubar"); await h.sleep(1500); const bar = await h.rect(".menubar");
      await measure(h, "menubar: lens sweep", () => sweep(h, bar.y, bar.left + bar.width - 400, bar.left + bar.width - 10, 1500));
      const apple = await h.rect('[data-menu="apple"]');
      await measure(h, "menubar: open + close menu", async () => { for (let i = 0; i < 3; i++) { await h.click(apple.x, apple.y); await h.sleep(700); await h.click(apple.x, apple.y); await h.sleep(600); } });
      const cc = await h.rect('.mb-item[title="Control Center"]');
      await measure(h, "menubar: Control Center", async () => { await h.click(cc.x, cc.y); await h.sleep(1500); await h.click(cc.x, cc.y); await h.sleep(800); });
      await measure(h, "menubar: idle", () => h.sleep(3000));
    } finally { h.close(); }
  },
  async start() {
    const h = await startHarness({ out, window: "start", viewport: [1000, 900], settings: () => {} });
    try { await h.open(".st-root"); await h.sleep(1000);
      await measure(h, "start: open, search, close", async () => { await h.eval(`window.__emit("start://open", { previous: 1 })`); await h.sleep(900); await h.send("Input.insertText", { text: "note" }); await h.sleep(600); await h.eval(`window.__emit("start://outside")`); await h.sleep(900); });
    } finally { h.close(); }
  },
  async settings() {
    const h = await startHarness({ out, window: "settings", viewport: [1200, 900], settings: () => {} });
    try { await h.open(".ctl-value"); await h.sleep(1500);
      await measure(h, "settings: scroll", async () => { for (let i = 0; i < 30; i++) { await h.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: 700, y: 500, deltaX: 0, deltaY: 120 }); await h.sleep(40); } });
      await measure(h, "settings: idle", () => h.sleep(3000));
    } finally { h.close(); }
  },
};
for (const [k, run] of Object.entries(cases)) if (!only || only === k) await run();
process.exit(0);