// The dock's two ends, off screen: the space from the bar's start to the first thing in it (the Liquidock button, or
// the first app when the button is out of sight or off) is the same as from the last thing (the Recycle Bin) to the
// bar's end, in every way the button can be. Writes dockends.png.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/dockends.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const shots = {};
const ends = `(() => {
  const bar = document.querySelector('.dock-bar').getBoundingClientRect();
  // what can be seen in the bar: anything with a size and not see-through, but not the bar's own layers
  // what is drawn: the drop's own shape (x 19..81 of its box; a well's edge is its box), an app's icon, the glyphs
  // and the clock's text, the gear
  const seen = [...document.querySelectorAll('.dock-bar .dock-drop-btn, .dock-bar .dock-icon, .dock-bar .widget-glyph, .dock-bar .widget-clock, .dock-bar .dock-control-btn svg')]
    .filter((e) => { const r = e.getBoundingClientRect(); let o = 1; for (let n = e; n && n !== document.body; n = n.parentElement) o *= +getComputedStyle(n).opacity; return r.width > 1 && o > 0.05 && r.left >= bar.left - 1 && r.right <= bar.right + 1; })
    .map((e) => { const r = e.getBoundingClientRect(); if (e.matches('.dock-drop-btn:not([data-look=well])')) return { left: r.left + r.width * 0.19, right: r.right - r.width * 0.19 }; return r; });
  const first = Math.min(...seen.map((r) => r.left));
  const last = Math.max(...seen.map((r) => r.right));
  return { left: +(first - bar.left).toFixed(1), right: +(bar.right - last).toFixed(1) };
})()`;

for (const [name, set] of [
  ["button always there", (s) => { s.dock.showSearchButton = true; s.dock.startReveal = "static"; }],
  ["button out of sight", (s) => { s.dock.showSearchButton = true; s.dock.startReveal = "expand"; }],
  ["no button", (s) => { s.dock.showSearchButton = false; }],
  ["well", (s) => { s.dock.showSearchButton = true; s.dock.startStyle = "well"; }],
  ["the owner's: no clock, Settings revealed, button out of sight", (s) => { s.dock.showSearchButton = true; s.dock.startReveal = "expand"; s.dock.revealControls = true; s.dock.showClock = false; s.dock.iconSize = 26; }],
  ["the owner's, button there, 1.4x", (s) => { s.dock.showSearchButton = true; s.dock.revealControls = true; s.dock.showClock = false; s.dock.iconSize = 26; s.dock.startSize = 1.4; }],
]) {
  const h = await startHarness({ out, window: "dock", viewport: [1100, 360], settings: (s) => { s.dock.revealControls = false; s.dock.magnification = false; s.dock.autoHide = false; set(s); } });
  try {
    await h.open(".dock-bar");
    await h.desktop("#5b6f8f");
    await h.sleep(900);
    const e = await h.eval(ends);
    check(Math.abs(e.left - e.right) <= 1, `${name}: the two ends match (start ${e.left}px, end ${e.right}px)`);
    const r = await h.eval("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()");
    shots[name] = await h.shot(Math.max(0, r.x - 12), r.y - 12, r.w + 24, r.h + 24, 1);
    check((await h.errors()).length === 0, `${name}: no errors`);
    // out of sight: brought in by the pointer near the start, the ends still match once it is in
    if (name.includes("out of sight")) {
      await h.move(r.x + 14, r.y + r.h / 2);
      await h.sleep(900);
      const o = await h.eval(ends);
      check(Math.abs(o.left - o.right) <= 1, `${name}, brought in: the two ends match (start ${o.left}px, end ${o.right}px)`);
      const r2 = await h.eval("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()");
      shots[`${name}, brought in`] = await h.shot(Math.max(0, r2.x - 12), r2.y - 12, r2.w + 24, r2.h + 24, 1);
    }
  } finally {
    h.close();
  }
}
const h = await startHarness({ out, window: "dock", viewport: [400, 200] });
try {
  await h.open("body");
  console.log("sheet:", await h.sheet(shots, "dockends", 500));
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
