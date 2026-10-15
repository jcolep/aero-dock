// Style diff between two builds: each window, in each build, every element's computed style (and its ::before and
// ::after), compared element by element. Animations are frozen first so that timing does not show up as a difference.
//   node --experimental-websocket scripts/offscreen/stylediff.mjs <out> <dist A> <dist B>
import { startHarness } from "./harness.mjs";

const [,, out, distA, distB] = process.argv;
const pins = ["Notes", "Mail", "Maps"].map((name, i) => ({ id: `p${i}`, kind: "app", path: `C:\\Tools\\${name}.exe`, name, icon: null, children: [] }));
const CASES = [
  { name: "dock", window: "dock", ready: ".dock-icon", vp: [1400, 400], set: (s) => { s.pinned = pins; } },
  { name: "menubar", window: "menubar", ready: ".menubar", vp: [1400, 800], set: (s) => { s.menuBar.enabled = true; } },
  { name: "menubar+menu", window: "menubar", ready: ".menubar", vp: [1400, 800], set: (s) => { s.menuBar.enabled = true; }, act: async (h) => { const r = await h.rect('[data-menu="apple"]'); await h.click(r.x, r.y); } },
  { name: "menubar+cc", window: "menubar", ready: ".menubar", vp: [1400, 900], set: (s) => { s.menuBar.enabled = true; }, act: async (h) => { const r = await h.rect('.mb-item[title="Control Center"]'); await h.click(r.x, r.y); } },
  { name: "start", window: "start", ready: ".st-root", vp: [1000, 900], set: () => {}, act: async (h) => { await h.eval(`window.__emit("start://open", { previous: 1 })`); } },
  { name: "settings", window: "settings", ready: ".ctl-value", vp: [1200, 900], set: () => {} },
  { name: "frame", window: "frame", ready: ".frame-root", vp: [1200, 700], set: (s) => { s.frame.enabled = true; s.frame.glassBorder = true; } },
  { name: "mission", window: "mission", ready: "#root", vp: [1400, 900], set: () => {} },
  { name: "widgets", window: "widgets", ready: "#root", vp: [1400, 900], set: () => {} },
  { name: "perf", window: "perf", ready: "#root", vp: [600, 400], set: () => {} },
];
const COLLECT = `(() => {
  const st = document.createElement("style");
  st.textContent = "*,*::before,*::after{animation-play-state:paused!important;transition:none!important;caret-color:transparent!important}";
  document.head.appendChild(st);
  const props = Array.from(getComputedStyle(document.documentElement));
  const skip = new Set(["transition", "transition-duration", "transition-property", "transition-timing-function", "transition-delay", "transition-behavior", "animation-play-state", "caret-color"]);
  const look = (el, pseudo) => { const cs = getComputedStyle(el, pseudo); if (pseudo && (cs.content === "none" || cs.content === "normal")) return null; const o = {}; for (const p of props) if (!skip.has(p)) o[p] = cs.getPropertyValue(p); return o; };
  const out = [];
  for (const el of document.querySelectorAll("html, html *")) {
    if (el.tagName === "STYLE" || el.tagName === "SCRIPT" || el.tagName === "LINK") continue;
    out.push({ key: el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\\s+/).join(".") : ""), s: look(el), b: look(el, "::before"), a: look(el, "::after") });
  }
  return out;
})()`;
async function collect(dist, c) {
  const h = await startHarness({ dist, out, window: c.window, viewport: c.vp, settings: c.set });
  try {
    await h.open(c.ready);
    await h.sleep(900);
    if (c.act) { await c.act(h); await h.sleep(1500); }
    const els = await h.eval(COLLECT);
    return { els, errors: await h.errors() };
  } finally { h.close(); }
}
let failed = false;
for (const c of CASES) {
  const A = await collect(distA, c);
  const B = await collect(distB, c);
  const diffs = [];
  if (A.els.length !== B.els.length) diffs.push(`element count ${A.els.length} vs ${B.els.length}`);
  for (let i = 0; i < Math.min(A.els.length, B.els.length); i++) {
    const a = A.els[i], b = B.els[i];
    if (a.key !== b.key) { diffs.push(`#${i} ${a.key} vs ${b.key}`); break; }
    for (const part of ["s", "b", "a"]) {
      const x = a[part], y = b[part];
      if (!x && !y) continue;
      if (!x || !y) { diffs.push(`${a.key} ${part}: ${!!x} vs ${!!y}`); continue; }
      const props = Object.keys(x).filter((p) => x[p] !== y[p]);
      if (props.length) diffs.push(`${a.key}${part === "s" ? "" : part === "b" ? "::before" : "::after"}: ${props.slice(0, 6).map((p) => `${p}: ${x[p].slice(0, 40)} -> ${y[p].slice(0, 40)}`).join("; ")}`);
    }
  }
  const errs = B.errors.filter((e) => !A.errors.includes(e));
  console.log(`${diffs.length || errs.length ? "DIFF" : "same"} ${c.name} (${A.els.length} elements)${errs.length ? " new errors: " + errs.join(" | ").slice(0, 300) : ""}`);
  for (const d of diffs.slice(0, 12)) console.log("   ", d);
  if (diffs.length || errs.length) failed = true;
}
process.exit(failed ? 1 : 0);