// The Liquidock button's hover, off screen: each of the four click effects played on the drop as the pointer comes
// onto it (dock.startShine), filmed. Writes dropglint.png (rows: effects; columns: moments).
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/dropglint.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const shots = {};
let last;
for (const effect of ["halo", "shine", "dimple", "bloom"]) {
  const h = await startHarness({ out, window: "dock", viewport: [900, 380], settings: (s) => { s.dock.revealControls = false; s.dock.showSearchButton = true; s.dock.startShine = effect; s.dock.magnification = false; } });
  last = h;
  try {
    await h.open(".dock-drop-btn");
    await h.desktop("#5b6f8f");
    await h.sleep(600);
    const r = await h.eval("(() => { const b = document.querySelector('.dock-drop-btn').getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()");
    const box = [r.x - 24, r.y - 24, r.w + 48, r.h + 48];
    await h.move(r.x + r.w / 2, r.y + r.h / 2);
    let at = 0;
    for (const ms of [60, 140, 240, 360, 520]) {
      await h.sleep(ms - at);
      at = ms;
      shots[`${effect} ${ms}ms`] = await h.shot(...box, 4);
    }
    console.log(effect, "errors:", JSON.stringify(await h.errors()));
    if (effect === "bloom") await h.sheet(shots, "dropglint", 900);
  } finally {
    h.close();
  }
}
