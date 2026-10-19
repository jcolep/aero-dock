// The Liquidock button in the dock, off screen: its three looks (solid drop, fine outline, well) with the divider after
// it; "comes in near the start": shut (the dock as if it had none), it opens as the pointer nears the bar's start, the
// bar growing to take it and its divider in, and shuts once the pointer moves on past the divider; and a click plays
// its own click effect. Writes startslot.png.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/startslot.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const shots = {};
const base = (s) => { s.dock.revealControls = false; s.dock.showSearchButton = true; s.dock.magnification = false; s.dock.autoHide = false; };
const barShot = async (h) => {
  const r = await h.eval("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()");
  return h.shot(Math.max(0, r.x - 16), r.y - 16, Math.min(260, r.w + 32), r.h + 32, 2);
};

// the looks
for (const look of ["solid", "outline", "well"]) {
  const h = await startHarness({ out, window: "dock", viewport: [900, 360], settings: (s) => { base(s); s.dock.startStyle = look; if (look === "well") s.dock.startWellColor = "#2a3b5a"; } });
  try {
    await h.open(".dock-drop-btn");
    await h.desktop("#eef1f5");
    await h.sleep(700);
    const info = await h.eval("(() => { const b = document.querySelector('.dock-drop-btn'); const next = b.parentElement.querySelector('.dock-divider'); return { look: b.dataset.look, divider: !!next, solid: !!b.querySelector('path[fill^=\"url(\"]') }; })()");
    check(info.look === look && info.divider, `${look}: the button in its look, a divider after it (${JSON.stringify(info)})`);
    shots[`${look} over white`] = await barShot(h);
    check((await h.errors()).length === 0, `${look}: no errors`);
  } finally {
    h.close();
  }
}

// comes in near the start
{
  const h = await startHarness({ out, window: "dock", viewport: [900, 360], settings: (s) => { base(s); s.dock.startReveal = "expand"; s.dock.revealZone = 40; s.dock.startClick = "halo"; } });
  try {
    await h.open(".dock-bar");
    await h.desktop("#5b6f8f");
    await h.sleep(700);
    const q = (js) => h.eval(`(() => ${js})()`);
    const state = () => q("(() => { const s = document.querySelector('.dock-start-slot').getBoundingClientRect(); const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { slot: Math.round(s.width), barLeft: Math.round(b.left), barW: Math.round(b.width) }; })()");
    const shut = await state();
    check(shut.slot <= 1, `shut: no room taken (slot ${shut.slot}px)`);
    shots["shut"] = await barShot(h);
    const bar = await q("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { l: b.left, t: b.top, b: b.bottom }; })()");
    const y = (bar.t + bar.b) / 2;
    // toward the start end, along the bar
    await h.move(bar.l + 60, y);
    await h.sleep(120);
    await h.move(bar.l + 20, y);
    await h.sleep(160);
    shots["opening"] = await barShot(h);
    await h.sleep(600);
    const open = await state();
    check(open.slot > 30 && open.barW > shut.barW + 30, `near the start: it opens and the bar grows to take it (slot ${open.slot}px, bar ${shut.barW} -> ${open.barW})`);
    shots["open"] = await barShot(h);
    // on the button itself: it stays
    const btn = await q("(() => { const b = document.querySelector('.dock-drop-btn').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()");
    await h.move(btn.x, btn.y);
    await h.sleep(500);
    check((await state()).slot > 30, "it stays while the pointer is on it");
    // a click plays the click effect on it
    await h.click(btn.x, btn.y);
    await h.sleep(160);
    shots["clicked (halo)"] = await barShot(h);
    check((await q("window.__calls.map((c) => c.cmd)")).includes("toggle_start"), "a click opens Start");
    // on along the dock, past the divider: it goes
    await h.move(btn.x + 200, btn.y);
    await h.sleep(900);
    const gone = await state();
    check(gone.slot <= 1 && Math.abs(gone.barW - shut.barW) <= 2, `moving on past it, it goes and the dock is as before (slot ${gone.slot}px, bar ${gone.barW})`);
    check((await h.errors()).length === 0, "no errors");
    await h.sheet(shots, "startslot", 600);
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
