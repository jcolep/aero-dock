// The menu bar's lens on a long journey: from the system-load readout on the right across the whole bar to the app's
// name on the left, the pointer kept in the bar all the way, at a hand's pace. Every frame, how far the lens is from the
// pointer on the way, and once there, how long it takes to sit on the app's name. (It waited at the last button while
// the pointer crossed the open middle, then made one long hop and stayed stretched and off its button for a second.)
// Once with the media pill (it steps aside over the pill when it is out), once without (it follows all the way).
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/lensglide.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

for (const pill of [false, true]) {
  const name = pill ? "with the media pill" : "without the pill";
  const h = await startHarness({ out, window: "menubar", viewport: [1600, 600], settings: (s) => { s.menuBar.enabled = true; s.menuBar.showStats = true; s.menuBar.mediaIsland = pill; } });
  try {
    await h.open(".menubar");
    await h.sleep(700);
    const at = (sel) => h.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, l: r.left, r: r.right }; })()`);
    const stats = await at(".mb-stats");
    const app = await at(".mb-app");
    const zone = await at(".mb-island-zone");
    await h.eval("(() => { window.__px = 0; window.addEventListener('pointermove', (e) => (window.__px = e.clientX), true); return 1; })()");
    await h.record(
      "lens",
      `(() => { const l = document.querySelector('.mb-lens').getBoundingClientRect(); const on = document.querySelector('.mb-item[data-lensed="true"]'); const b = on ? on.getBoundingClientRect() : null; return { t: performance.now(), px: window.__px, l: l.left, r: l.right, op: +getComputedStyle(document.querySelector('.mb-lens')).opacity, bl: b ? b.left : null, br: b ? b.right : null, on: on ? (on.className.split(' ')[1] || on.title) : null }; })()`,
    );
    await h.move(stats.x, stats.y);
    await h.sleep(700);
    // across the bar at a brisk hand's pace, staying in the bar
    const steps = 60;
    for (let i = 1; i <= steps; i++) {
      await h.move(stats.x + ((app.x - stats.x) * i) / steps, stats.y);
      await h.sleep(10);
    }
    await h.sleep(1600);
    const frames = (await h.recorded("lens")).map((f) => f.v).filter(Boolean);
    const onApp = frames.filter((f) => f.on === "mb-app");
    const first = onApp[0];
    const off = (f) => Math.abs((f.l + f.r) / 2 - (f.bl + f.br) / 2);
    const settledAt = onApp.find((f, i) => onApp.slice(i).every((g) => off(g) < 1));
    const settleMs = settledAt && first ? settledAt.t - first.t : Infinity;
    const tail = onApp.filter((f) => f.t - first.t > 500);
    const late = tail.length ? Math.max(...tail.map(off)) : 0;
    console.log(`     ${name}: on the app's name, to a pixel, ${settleMs.toFixed(0)}ms after reaching it`);
    check(settleMs < 650, `${name}: the lens sits on the app's name within 650 ms of reaching it (${settleMs.toFixed(0)}ms)`);
    // one long hop now (it waits at the last button), so it may still be settling by a hair
    check(late < 2, `${name}: and is not visibly off it half a second later (${late.toFixed(1)}px)`);
    // on the way: across the open bar it stays on the button it was last on (as it first did), not gliding under the
    // pointer in that button's shape, which read as a lens floating on nothing (the owner's call, October 19)
    const until = pill && zone ? zone.r : app.r + 40;
    const crossing = frames.filter((f) => f.px < stats.l - 120 && f.px > until && f.op > 0.5);
    const startCentre = crossing.length ? (crossing[0].l + crossing[0].r) / 2 : 0;
    const drift = crossing.length ? Math.max(...crossing.map((f) => Math.abs((f.l + f.r) / 2 - startCentre))) : 0;
    check(drift < 4, `${name}: across the open bar it waits on its last button, not under the pointer (moved ${drift.toFixed(0)}px)`);
    // the trailing edge is never left far behind: the lens is a blob, not a bar
    const widest = Math.max(...frames.map((f) => f.r - f.l));
    check(widest < 260, `${name}: never stretched into a bar across the menu bar (${widest.toFixed(0)}px at most)`);
    if (process.env.LENSDEBUG) console.log("      ", frames.filter((_, i) => i % 3 === 0).map((f) => `${Math.round(f.px)}:${Math.round((f.l + f.r) / 2)}${f.op < 0.5 ? "x" : ""}`).join(" "));
    check((await h.errors()).length === 0, `${name}: no errors in the page`);
  } finally {
    h.close();
  }
}

// the lens still does what it did: it sits on the button under the pointer, travels between neighbours, stays on an
// open menu's button while the pointer wanders, and fades when the pointer leaves the bar
{
  const h = await startHarness({ out, window: "menubar", viewport: [1600, 600], settings: (s) => void (s.menuBar.enabled = true) });
  try {
    await h.open(".menubar");
    await h.sleep(700);
    const lens = () => h.eval("(() => { const l = document.querySelector('.mb-lens').getBoundingClientRect(); return { c: (l.left + l.right) / 2, op: +getComputedStyle(document.querySelector('.mb-lens')).opacity }; })()");
    const items = await h.eval("[...document.querySelectorAll('.mb-item')].map((e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, menu: e.dataset.menu ?? null }; })");
    const right = items.filter((i) => i.x > 800);
    // it appears in place: its very first frame is already on the button, not half its width off
    await h.record("appear", "(() => { const l = document.querySelector('.mb-lens').getBoundingClientRect(); return { c: (l.left + l.right) / 2, op: +getComputedStyle(document.querySelector('.mb-lens')).opacity }; })()");
    await h.move(right[0].x, right[0].y);
    await h.sleep(600);
    const shown = (await h.recorded("appear")).map((f) => f.v).filter((f) => f && f.op > 0.01);
    const firstOff = shown.length ? Math.max(...shown.slice(0, 6).map((f) => Math.abs(f.c - right[0].x))) : Infinity;
    check(firstOff < 1, `it appears in place, on the button from its first frame (off by ${firstOff.toFixed(1)}px)`);
    check(Math.abs((await lens()).c - right[0].x) < 1, "it sits on the button under the pointer");
    await h.move(right[1].x, right[1].y);
    await h.sleep(600);
    check(Math.abs((await lens()).c - right[1].x) < 1, "and on its neighbour when the pointer moves there");
    // a menu open: the lens stays on its button, even as the pointer crosses the open bar
    const apple = items.find((i) => i.menu === "apple");
    await h.click(apple.x, apple.y);
    await h.sleep(600);
    await h.move(700, apple.y);
    await h.sleep(500);
    check(Math.abs((await lens()).c - apple.x) < 1.5, "with a menu open it stays on that menu's button while the pointer crosses the bar");
    await h.eval("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))");
    await h.sleep(400);
    await h.move(700, 300);
    await h.sleep(700);
    check((await lens()).op < 0.05, "and fades once the pointer leaves the bar");
    check((await h.errors()).length === 0, "no errors in the page");
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
