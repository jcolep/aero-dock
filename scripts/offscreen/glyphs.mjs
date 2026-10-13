// The dock's own symbols follow the icon look, off screen: plain leaves them as drawn (white), and glass, clear and
// tinted change them, the buttons beside the dock and the glyphs by the clock alike.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/glyphs.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

const pins = ["Notes", "Mail", "Maps"].map((name, i) => ({ id: `p${i}`, kind: "app", path: `C:\\Tools\\${name}.exe`, name, icon: null, children: [] }));
const shots = {};
const filters = {};
for (const look of (process.env.LOOKS ?? "plain,glass,clear,tinted").split(",")) {
  const h = await startHarness({
    out,
    window: "dock",
    viewport: [900, 260],
    running: [],
    scale: 2,
    settings: (s) => {
      s.pinned = pins;
      s.appearance.iconStyle = look;
      s.appearance.accent = "#2d6fd6";
    },
  });
  try {
    await h.open(".dock-icon");
    await h.desktop("#7f93b5");
    const bar = await h.eval("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, b: b.bottom }; })()");
    const mid = (bar.t + bar.b) / 2;
    await h.move(bar.l - 30, mid);
    await h.sleep(1000);
    filters[look] = await h.eval(`(() => ({
      style: document.documentElement.dataset.iconStyle,
      control: getComputedStyle(document.querySelector('.dock-control-btn svg')).filter,
      status: getComputedStyle(document.querySelector('.widget-glyph')).filter,
    }))()`);
    shots[`${look}: search`] = await h.shot(bar.l - 54, bar.t + 8, 60, bar.b - bar.t - 16, 3);
    await h.move(bar.r + 30, mid);
    await h.sleep(1000);
    shots[`${look}: clock and settings`] = await h.shot(bar.r - 150, bar.t + 8, 210, bar.b - bar.t - 16, 3);
  } finally {
    h.close();
  }
}
const has = (f, name) => f.includes(name);
if (filters.plain) check(filters.plain.style === "plain" && !has(filters.plain.control, "aero-glyph") && !has(filters.plain.status, "aero-glyph"), "plain: the symbols are as drawn");
if (filters.glass) check(has(filters.glass.control, "aero-glyph-glass") && has(filters.glass.status, "aero-glyph-glass"), "glass: the buttons and the status glyphs have the glass look");
if (filters.clear) check(has(filters.clear.control, "aero-glyph-clear") && has(filters.clear.status, "aero-glyph-clear"), "clear: both have the clear look");
if (filters.tinted) check(has(filters.tinted.control, "aero-glyph-tinted") && has(filters.tinted.status, "aero-glyph-tinted"), "tinted: both have the tinted look");
console.log("sheet:", await (async () => {
  const h = await startHarness({ out, window: "dock", viewport: [200, 200], settings: () => {} });
  try {
    return await h.sheet(shots, "glyphs");
  } finally {
    h.close();
  }
})());
process.exit(failed ? 1 : 0);
