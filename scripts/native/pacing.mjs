// Native frame pacing: a running Aero Dock started with WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9444
// (never 9333, the harness's port), every page checked for having rendered, then the dock swept, menus and the Control
// Center opened and Start toggled through the debugger (the real cursor is not moved), timing every frame on the real GPU.
//   node --experimental-websocket scripts/native/pacing.mjs 9444
const port = process.argv[2];
const pages = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).filter((p) => p.type === "page");
const conn = (url) => new Promise((res) => { const ws = new WebSocket(url); let n = 0; const wait = new Map();
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (wait.has(m.id)) { wait.get(m.id)(m); wait.delete(m.id); } });
  ws.addEventListener("open", () => res({ send: (method, params = {}) => new Promise((r) => { const id = ++n; wait.set(id, r); ws.send(JSON.stringify({ id, method, params })); }), close: () => ws.close() })); });
const ev = async (c, expression) => (await c.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
const name = (p) => (p.url.match(/window=([^&]+)/) ?? [, "dock"])[1];
const byName = {};
for (const p of pages) { const c = await conn(p.webSocketDebuggerUrl); const k = name(p); (byName[k] ??= []).push(c);
  const h = await ev(c, `({ kids: document.getElementById("root")?.childElementCount ?? -1, ready: document.documentElement.hasAttribute("data-ready"), w: innerWidth, h: innerHeight, chunks: performance.getEntriesByType("resource").filter(r => r.name.endsWith(".js")).length })`);
  console.log(`${k.padEnd(14)} rendered ${h.kids > 0 ? "yes" : "NO"}  ready ${h.ready}  ${h.w}x${h.h}  js files ${h.chunks}`); }
// each recording is a generation of its own, so a loop left from the one before stops instead of adding its frames
const REC = `(() => { const gen = (window.__fpGen = (window.__fpGen || 0) + 1); window.__fp = []; window.__fpOn = true; const loop = (t) => { if (window.__fpGen !== gen) return; window.__fp.push(t); if (window.__fpOn) requestAnimationFrame(loop); }; requestAnimationFrame(loop); return 1; })()`;
const STOP = `(() => { window.__fpOn = false; const t = window.__fp; const d = t.slice(1).map((x, i) => x - t[i]).sort((a, b) => a - b); const med = d[Math.floor(d.length / 2)] || 0; const slow = d.filter((x) => x > med * 1.6).length; return { frames: t.length, med: +med.toFixed(1), p95: +(d[Math.floor(d.length * 0.95)] || 0).toFixed(1), max: +(d[d.length - 1] || 0).toFixed(1), dropped: slow }; })()`;
const report = (what, r) => console.log(`${what.padEnd(30)} ${r.frames} frames, frame ${r.med} ms, 95% under ${r.p95} ms, worst ${r.max} ms, late frames ${r.dropped}`);
const mouse = (c, type, x, y, button = "none") => c.send("Input.dispatchMouseEvent", { type, x, y, button, buttons: button === "left" ? 1 : 0, clickCount: type === "mouseMoved" ? 0 : 1 });
// ---- the dock: a sweep across the icons ----
const dock = byName.dock?.[0];
if (dock) {
  const bar = await ev(dock, `(() => { const r = document.querySelector(".dock-bar")?.getBoundingClientRect(); return r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null; })()`);
  const vh = await ev(dock, "innerHeight");
  await mouse(dock, "mouseMoved", bar ? bar.x + bar.w / 2 : 400, vh - 2); await new Promise((r) => setTimeout(r, 900));
  const bar2 = await ev(dock, `(() => { const r = document.querySelector(".dock-bar").getBoundingClientRect(); return { x: r.left, y: r.top + r.height / 2, w: r.width }; })()`);
  await ev(dock, REC);
  for (let i = 0; i <= 120; i++) { await mouse(dock, "mouseMoved", bar2.x + 10 + (bar2.w - 20) * (i % 61) / 60 * (i < 61 ? 1 : 1), bar2.y); await new Promise((r) => setTimeout(r, 16)); }
  report("dock: magnify sweep", await ev(dock, STOP));
  await mouse(dock, "mouseMoved", 5, 5); 
}
// ---- the menu bar: open and close a menu, then the Control Center ----
const mb = byName.menubar?.[0];
if (mb) {
  const apple = await ev(mb, `(() => { const r = document.querySelector('[data-menu="apple"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  await ev(mb, REC);
  for (let i = 0; i < 2; i++) { await mouse(mb, "mousePressed", apple.x, apple.y, "left"); await mouse(mb, "mouseReleased", apple.x, apple.y, "left"); await new Promise((r) => setTimeout(r, 900)); await mouse(mb, "mousePressed", apple.x, apple.y, "left"); await mouse(mb, "mouseReleased", apple.x, apple.y, "left"); await new Promise((r) => setTimeout(r, 700)); }
  report("menu bar: menu open/close x2", await ev(mb, STOP));
  const cc = await ev(mb, `(() => { const r = document.querySelector('.mb-item[title="Control Center"], .mb-item[aria-label="Control Center"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  await ev(mb, REC);
  await mouse(mb, "mousePressed", cc.x, cc.y, "left"); await mouse(mb, "mouseReleased", cc.x, cc.y, "left"); await new Promise((r) => setTimeout(r, 1500));
  await mouse(mb, "mousePressed", cc.x, cc.y, "left"); await mouse(mb, "mouseReleased", cc.x, cc.y, "left"); await new Promise((r) => setTimeout(r, 900));
  report("menu bar: Control Center", await ev(mb, STOP));
  await mouse(mb, "mouseMoved", 900, 300);
}
// ---- Start: open from the dock's command, then close ----
const st = byName.start?.[0];
if (st && dock) {
  await ev(st, REC);
  await ev(dock, "window.__TAURI_INTERNALS__.invoke('toggle_start').then(() => 1)");
  await new Promise((r) => setTimeout(r, 1300));
  const open = await ev(st, `!!document.querySelector(".st-panel") && getComputedStyle(document.querySelector(".st-panel")).opacity`);
  await ev(dock, "window.__TAURI_INTERNALS__.invoke('toggle_start').then(() => 1)");
  await new Promise((r) => setTimeout(r, 1200));
  report(`start: open + close (opacity ${open})`, await ev(st, STOP));
}
for (const list of Object.values(byName)) for (const c of list) c.close();
process.exit(0);