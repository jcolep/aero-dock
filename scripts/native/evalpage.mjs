// Evaluates a script in the pages of a running app (started with WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=
// --remote-debugging-port=9444) whose URL matches a pattern, and prints what it returns for each.
//
//   node --experimental-websocket scripts/native/evalpage.mjs menubar "document.title"
//   node --experimental-websocket scripts/native/evalpage.mjs dock "location.href"      (the dock has no ?window=)

const [which = "menubar", body = "document.title", port = "9444"] = process.argv.slice(2);
const pages = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).filter(
  (p) => p.type === "page" && (which === "dock" ? !/window=/.test(p.url) : p.url.includes(`window=${which}`)),
);
for (const p of pages) {
  const ws = new WebSocket(p.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  const result = await new Promise((res) => {
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id === 1) res(d.result);
    };
    ws.send(JSON.stringify({ id: 1, method: "Runtime.evaluate", params: { expression: body, returnByValue: true, awaitPromise: true } }));
    setTimeout(() => res(null), 8000);
  });
  console.log(p.url.slice(-30), "->", JSON.stringify(result?.result?.value ?? result?.exceptionDetails?.exception?.description ?? null));
  ws.close();
}
console.log(pages.length, "page(s)");
process.exit(0);
