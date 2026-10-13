// Dock magnification, off screen: where each icon is, and how big, as the pointer moves along the dock.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/magnify.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

const pins = ["Notes", "Mail", "Maps", "Music", "Photos", "Files", "Chat"].map((name, i) => ({
  id: `p${i}`,
  kind: "app",
  path: `C:\\Tools\\${name}.exe`,
  name,
  icon: null,
  children: [],
}));

const h = await startHarness({
  out,
  window: "dock",
  viewport: [1400, 500],
  running: [],
  settings: (s) => {
    s.dock.magnification = true;
    s.dock.magnificationScale = 1.7;
    s.pinned = pins;
  },
});
try {
  await h.open(".dock-icon");
  await h.desktop("#c8d0e0");
  await h.sleep(800);
  const q = (js) => h.eval(`(() => ${js})()`);
  const read = () =>
    q(`[...document.querySelectorAll('.dock-bar .dock-icon')].slice(0, 7).map((b) => { const r = b.querySelector('.dock-icon-mag').getBoundingClientRect(); return { x: +(r.left + r.width / 2).toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), bottom: +r.bottom.toFixed(1) }; })`);
  const rest = await read();
  console.log("at rest:", JSON.stringify(rest));
  const bar = await q("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { top: b.top, bottom: b.bottom, height: b.height }; })()");
  const target = rest[3];
  await h.move(target.x, bar.top + bar.height / 2);
  await h.sleep(900);
  const lifted = await read();
  console.log("pointer on the fourth:", JSON.stringify(lifted));
  const bar2 = await q("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { top: b.top, bottom: b.bottom, height: b.height }; })()");
  console.log("bar at rest:", JSON.stringify(bar), "bar with pointer:", JSON.stringify(bar2));
  check(lifted[3].w > rest[3].w * 1.3, `the icon under the pointer is wider (${rest[3].w} -> ${lifted[3].w})`);
  check(lifted[3].h > rest[3].h * 1.3, `and taller (${rest[3].h} -> ${lifted[3].h})`);
  check(lifted[3].bottom < rest[3].bottom - 2, `and it has risen: its bottom is above where it rested (${rest[3].bottom} -> ${lifted[3].bottom})`);
  check(Math.abs(lifted[3].w - lifted[3].h) < 1.5, `and it is still square (${lifted[3].w} by ${lifted[3].h})`);
  const tip = await q("(() => { const l = document.querySelector('.dock-label'); const i = document.querySelectorAll('.dock-icon')[3].querySelector('.dock-icon-mag').getBoundingClientRect(); return l ? { gap: i.top - l.getBoundingClientRect().bottom } : null; })()");
  check(tip && tip.gap > 4, `and the name above it clears the grown icon (${tip ? tip.gap.toFixed(1) : "no name"} px)`);
  check(lifted[2].w > rest[2].w && lifted[2].w < lifted[3].w, `its neighbour swells less (${lifted[2].w.toFixed(1)})`);
  check(Math.abs(lifted[0].w - rest[0].w) < 1, `one far away is unchanged (${lifted[0].w})`);
  check(Math.abs(lifted[0].bottom - rest[0].bottom) < 0.6, `a far one has not moved (${rest[0].bottom} -> ${lifted[0].bottom})`);
  const shot = await h.shot(Math.max(0, bar.top < 100 ? 0 : 0), Math.max(0, bar.top - 120), 1400, bar.height + 200, 1);
  console.log("sheet:", await h.sheet({ magnify: shot }, "magnify"));
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
