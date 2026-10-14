// What a late frame was made of: opens a menu and the Control Center in a running app (debug port as in pacing.mjs),
// recording frames, backend calls and long animation frames, and prints what happened around each late frame. Run it on a
// fresh start to see first-use costs.
//   node --experimental-websocket scripts/native/firstopen.mjs 9444
const port = process.argv[2];
const pages = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).filter((p) => p.type === "page");
const p = pages.find((x) => x.url.includes("window=menubar"));
const c = await new Promise((res) => { const ws = new WebSocket(p.webSocketDebuggerUrl); let n = 0; const wait = new Map();
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); } });
  ws.addEventListener("open", () => res({ send: (method, params = {}) => new Promise((r) => { const id = ++n; wait.set(id, r); ws.send(JSON.stringify({ id, method, params })); }), close: () => ws.close() })); });
const ev = async (e) => (await c.send("Runtime.evaluate", { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
const mouse = (type, x, y) => c.send("Input.dispatchMouseEvent", { type, x, y, button: "left", buttons: 1, clickCount: 1 });
await ev(`(() => { const I = window.__TAURI_INTERNALS__; if (!I.__wrapped) { const inv = I.invoke.bind(I); I.invoke = (cmd, args, o) => { const t0 = performance.now(); window.__log?.push([t0, "call " + cmd]); return inv(cmd, args, o).finally(() => window.__log?.push([performance.now(), "done " + cmd + " " + (performance.now() - t0).toFixed(1) + "ms"])); }; I.__wrapped = true; }
  window.__log = []; window.__fp = []; window.__on = true; const loop = (t) => { window.__fp.push(t); if (window.__on) requestAnimationFrame(loop); }; requestAnimationFrame(loop);
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__log.push([e.startTime, "LOAF " + e.duration.toFixed(0) + "ms block " + e.blockingDuration.toFixed(0) + " " + e.scripts.map(s => (s.sourceFunctionName || s.invoker) + " " + s.duration.toFixed(0)).join(", ")]); }).observe({ type: "long-animation-frame" }); return 1; })()`);
for (const sel of ['[data-menu="apple"]', '.mb-item[title="Control Center"]']) {
  const r = await ev(`(() => { const r = document.querySelector('${sel}').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  await ev(`window.__log.push([performance.now(), "CLICK ${sel.replace(/"/g, "")}"])`);
  await mouse("mousePressed", r.x, r.y); await mouse("mouseReleased", r.x, r.y);
  await new Promise((res) => setTimeout(res, 1400));
  await mouse("mousePressed", r.x, r.y); await mouse("mouseReleased", r.x, r.y);
  await new Promise((res) => setTimeout(res, 1000));
}
const out = await ev(`(() => { window.__on = false; const t = window.__fp; const late = []; for (let i = 1; i < t.length; i++) if (t[i] - t[i - 1] > 20) late.push([t[i - 1], t[i] - t[i - 1]]);
  return { late, log: window.__log }; })()`);
for (const [at, d] of out.late) {
  console.log(`LATE FRAME at ${at.toFixed(0)} lasting ${d.toFixed(0)} ms; around it:`);
  for (const [t, what] of out.log.filter(([t]) => t > at - 120 && t < at + d + 20)) console.log(`   ${(t - at).toFixed(0).padStart(5)} ms  ${what}`);
}
c.close(); process.exit(0);