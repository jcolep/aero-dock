import k from "katex";
let c = !1;
globalThis.addEventListener("message", (t) => {
  var i, l, g, h;
  const e = t.data || {};
  if (e.type === "init") {
    c = !!e.debug;
    try {
      c && console.debug("[katexRenderer.worker] debug enabled");
    } catch (r) {
    }
    return;
  }
  const o = (i = e.id) != null ? i : "", a = (l = e.content) != null ? l : "", n = (g = e.displayMode) != null ? g : !0;
  try {
    try {
      c && console.debug("[katexRenderer.worker] render start", { id: o, displayMode: n, content: a });
    } catch (s) {
    }
    const r = k.renderToString(a, {
      throwOnError: !0,
      displayMode: n,
      output: "html",
      strict: "ignore"
    }), d = { id: o, html: r, content: a, displayMode: n };
    try {
      globalThis.postMessage(d);
      try {
        c && console.debug("[katexRenderer.worker] render success", { id: o });
      } catch (s) {
      }
    } catch (s) {
      try {
        console.error("[katexRenderer.worker] failed to postMessage result", s);
      } catch (u) {
      }
    }
  } catch (r) {
    const d = { id: o, error: String((h = r == null ? void 0 : r.message) != null ? h : r), content: a, displayMode: n };
    try {
      globalThis.postMessage(d);
    } catch (s) {
      try {
        console.error("[katexRenderer.worker] failed to postMessage error", s);
      } catch (u) {
      }
    }
  }
});
globalThis.addEventListener("error", (t) => {
  var e;
  try {
    console.error("[katexRenderer.worker] uncaught error", t.message, t.error);
  } catch (o) {
  }
  try {
    globalThis.postMessage({ id: "__worker_uncaught__", error: String((e = t.message) != null ? e : t.error), content: "", displayMode: !0 });
  } catch (o) {
  }
});
