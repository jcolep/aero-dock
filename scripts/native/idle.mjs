// Each page's own work over some seconds of idle in a running app (debug port as in pacing.mjs): script, style and
// layout time, recalcs, heap and nodes.
//   node --experimental-websocket scripts/native/idle.mjs 9444 15
const [,, port, secs] = process.argv;
const list = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).filter((p) => p.type === "page");
const open = (url) => new Promise((res) => { const ws = new WebSocket(url); let n = 0; const wait = new Map();
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (wait.has(m.id)) { wait.get(m.id)(m.result); wait.delete(m.id); } });
  ws.addEventListener("open", () => res({ call: (method, params = {}) => new Promise((r) => { const id = ++n; wait.set(id, r); ws.send(JSON.stringify({ id, method, params })); }), close: () => ws.close() })); });
const pages = [];
for (const p of list) { const c = await open(p.webSocketDebuggerUrl); await c.call("Performance.enable"); pages.push({ p, c, a: (await c.call("Performance.getMetrics")).metrics }); }
await new Promise((r) => setTimeout(r, secs * 1000));
const pick = (ms, k) => ms.find((m) => m.name === k)?.value ?? 0;
for (const { p, c, a } of pages) {
  const b = (await c.call("Performance.getMetrics")).metrics;
  const d = (k) => pick(b, k) - pick(a, k);
  const w = (p.url.match(/window=([^&]+)/) ?? [, "dock?"])[1];
  console.log(`${w.padEnd(14)} task ${(d("TaskDuration") * 1000 / secs).toFixed(1).padStart(6)} ms/s  script ${(d("ScriptDuration") * 1000 / secs).toFixed(1).padStart(5)}  style ${(d("RecalcStyleDuration") * 1000 / secs).toFixed(1).padStart(5)}  layout ${(d("LayoutDuration") * 1000 / secs).toFixed(1).padStart(5)}  frames? recalcs ${d("RecalcStyleCount")} layouts ${d("LayoutCount")}  heap ${(pick(b, "JSHeapUsedSize") / 1048576).toFixed(1)} MB  nodes ${pick(b, "Nodes")}`);
  c.close();
}
process.exit(0);