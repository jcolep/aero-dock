// Dock magnification, smoothness: the pointer slid slowly and quickly along the dock, in from beyond its end, and each
// icon's size read every frame. As the pointer passes an icon its swell should rise once and fall once; every extra
// turn is a wobble that is seen as the icons shaking. Then the pointer held still: the icons should come to rest.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/magsmooth.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const pins = ["Notes", "Mail", "Maps", "Music", "Photos", "Files", "Chat", "Paint", "Clock"].map((name, i) => ({
  id: `p${i}`, kind: "app", path: `C:\\Tools\\${name}.exe`, name, icon: null, children: [],
}));

for (const feel of ["soft", "liquid", "snappy"]) {
  const h = await startHarness({
    out, window: "dock", viewport: [1400, 500], running: [],
    settings: (s) => {
      s.dock.autoHide = false;
      s.dock.magnification = true;
      s.dock.magnificationScale = 1.8;
      s.animations = { ...(s.animations ?? {}), magnify: feel };
      s.pinned = pins;
    },
  });
  try {
    await h.open(".dock-icon");
    await h.sleep(800);
    const q = (js) => h.eval(`(() => ${js})()`);
    const bar = await q("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { left: b.left, right: b.right, y: (b.top + b.bottom) / 2 }; })()");
    const sizes = `[...document.querySelectorAll('.dock-bar .dock-icon-mag')].map((b) => +b.getBoundingClientRect().width.toFixed(2))`;
    // where layout puts each thing in the bar (whole pixels, which is how it is painted), apart from any translate
    // (less the translates of what holds it too, up to the bar: the Liquidock button's divider rides in its slot)
    const laidOut = `[...document.querySelectorAll('.dock-bar .dock-icon, .dock-bar .dock-divider:not([data-hidden]), .dock-bar .widget-cluster')].map((e) => { const r = e.getBoundingClientRect(); let t = 0; for (let n = e; n && !n.classList.contains('dock-bar'); n = n.parentElement) t += parseFloat(n.style.translate) || 0; return r.left + r.width / 2 - t; })`;
    const layoutAtRest = await h.eval(laidOut);
    // the turns in each icon's size, over a run of frames (a change of under a hundredth of a pixel is not a turn)
    const turns = (frames) => {
      const n = frames[0].length;
      const out = [];
      for (let i = 0; i < n; i++) {
        let dir = 0;
        let count = 0;
        let last = frames[0][i];
        for (const f of frames) {
          const d = f[i] - last;
          if (Math.abs(d) < 0.01) continue;
          const s = Math.sign(d);
          if (dir !== 0 && s !== dir) count++;
          dir = s;
          last = f[i];
        }
        out.push(count);
      }
      return out;
    };
    for (const [speed, step] of [["slowly", 1], ["at a walk", 4], ["quickly", 14]]) {
      // (out of the window and back, and long enough for the last pass to have settled)
      await h.move(bar.left - 60, 5);
      await h.sleep(1500);
      await h.move(bar.left - 60, bar.y);
      await h.sleep(200);
      await h.record("s", sizes);
      // in from beyond the left end, across the first half of the dock
      let moved = 0;
      for (let x = bar.left - 60; x < bar.left + (bar.right - bar.left) * 0.45; x += step) {
        await h.move(x, bar.y);
        await h.sleep(8);
        if (speed === "slowly" && x % 40 < 1) {
          const now = await h.eval(laidOut);
          moved = Math.max(moved, ...now.map((v, i) => Math.abs(v - layoutAtRest[i])));
        }
      }
      if (speed === "slowly") check(moved < 0.05, `${feel}: while it swells nothing in the bar moves by layout, only by translate (${moved.toFixed(3)}px)`);
      await h.sleep(600);
      const frames = (await h.recorded("s")).map((f) => f.v).filter((v) => v && v.length);
      const t = turns(frames);
      // rising then falling is one turn; an icon the pointer stops on, or never reaches, has none or one
      const extra = t.reduce((a, c) => a + Math.max(0, c - 1), 0);
      console.log(`     ${feel}, ${speed}: turns per icon ${JSON.stringify(t)} over ${frames.length} frames`);
      if (process.env.MAGDEBUG) t.forEach((c, i) => { if (c > 1) console.log(`       icon ${i}:`, frames.map((f) => f[i].toFixed(2)).filter((v, k, a) => k === 0 || v !== a[k - 1]).join(" ")); });
      check(extra === 0, `${feel}, ${speed}: each icon swells and settles without wobbling (${extra} extra turns)`);
    }
    // held still near the end: it comes to rest and stays there
    await h.move(bar.left + 30, bar.y);
    await h.sleep(900);
    await h.record("still", sizes);
    await h.sleep(500);
    const still = (await h.recorded("still")).map((f) => f.v).filter((v) => v && v.length);
    const drift = Math.max(...still[0].map((_, i) => Math.max(...still.map((f) => f[i])) - Math.min(...still.map((f) => f[i]))));
    check(drift < 0.05, `${feel}: the pointer held still by the end, the icons are still (${drift.toFixed(3)} px)`);
    check((await h.errors()).length === 0, `${feel}: no errors in the page`);
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
