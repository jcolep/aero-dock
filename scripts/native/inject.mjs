// Tries a stylesheet or a script on the dock windows of a running app (started with
// WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9444), to see its effect before building it in.
//
//   node --experimental-websocket scripts/native/inject.mjs css ".dock-bar { will-change: transform; }"
//   node --experimental-websocket scripts/native/inject.mjs css ""        (takes the experiment out again)
//   node --experimental-websocket scripts/native/inject.mjs js "document.title"

const [kind, body = "", port = "9444"] = process.argv.slice(2);
const pages = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).filter((p) => p.type === "page" && !/window=/.test(p.url));
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
  const expression =
    kind === "css"
      ? `(() => { let s = document.getElementById('exp-style'); if (!s) { s = document.createElement('style'); s.id = 'exp-style'; document.head.appendChild(s); } s.textContent = ${JSON.stringify(body)}; return 'css ' + s.textContent.length; })()`
      : body;
  const r = await send("Runtime.evaluate", { expression, returnByValue: true });
  console.log(p.url.slice(-40), "->", JSON.stringify(r?.result?.value ?? r?.exceptionDetails?.text ?? null));
  ws.close();
}
console.log(pages.length, "dock page(s)");
process.exit(0);
