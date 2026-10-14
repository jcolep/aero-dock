// When each page of a just-started app (debug port as in pacing.mjs) was made and first painted, in ms since the process
// started (pass the process start time in epoch ms).
//   node --experimental-websocket scripts/native/startup.mjs 9444 <started-ms>
const [,, port, startedAt] = process.argv;
const list = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).filter((p) => p.type === "page");
const rows = [];
for (const p of list) {
  const ws = new WebSocket(p.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener("open", r));
  ws.send(JSON.stringify({ id: 1, method: "Runtime.evaluate", params: { expression: `JSON.stringify({ origin: performance.timeOrigin, fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? null, script: performance.getEntriesByType("resource").filter(r => r.name.endsWith(".js")).reduce((a, r) => Math.max(a, r.responseEnd), 0) })`, returnByValue: true } }));
  const m = await new Promise((r) => ws.addEventListener("message", (e) => r(JSON.parse(e.data))));
  const v = JSON.parse(m.result.result.value); ws.close();
  rows.push({ w: (p.url.match(/window=([^&]+)/) ?? [, "dock"])[1], page: Math.round(v.origin - Number(startedAt)), fcp: v.fcp === null ? null : Math.round(v.origin + v.fcp - Number(startedAt)), js: Math.round(v.script) });
}
rows.sort((a, b) => a.page - b.page);
for (const r of rows) console.log(`${r.w.padEnd(14)} page made at ${String(r.page).padStart(5)} ms   first paint ${r.fcp === null ? "  (none: hidden)" : String(r.fcp).padStart(5) + " ms"}   scripts loaded ${r.js} ms after the page`);
process.exit(0);