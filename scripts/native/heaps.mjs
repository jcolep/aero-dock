// Each window of a running app (started with WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9444): its JS
// heap, DOM nodes, listeners and documents, to see which window holds the memory.
//
//   node --experimental-websocket scripts/native/heaps.mjs [port]

const port = process.argv[2] ?? "9444";
const pages = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).filter((p) => p.type === "page");
for (const p of pages) {
  const ws = new WebSocket(p.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) pending.get(d.id)(d.result);
  };
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); setTimeout(() => res(null), 4000); });
  await send("Performance.enable");
  const heap = await send("Runtime.getHeapUsage");
  const metrics = Object.fromEntries(((await send("Performance.getMetrics"))?.metrics ?? []).map((m) => [m.name, m.value]));
  const q = (u) => (u.match(/window=(\w+)/) ?? [, u.slice(-30)])[1];
  console.log(
    q(p.url).padEnd(10),
    "heap used", ((heap?.usedSize ?? 0) / 1048576).toFixed(1).padStart(6), "MB  total", ((heap?.totalSize ?? 0) / 1048576).toFixed(1).padStart(6),
    " nodes", String(metrics.Nodes ?? "").padStart(6), " listeners", String(metrics.JSEventListeners ?? "").padStart(5), " docs", metrics.Documents ?? "",
  );
  ws.close();
}
process.exit(0);
