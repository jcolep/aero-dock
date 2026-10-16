// The dock's glass as it swells, off screen: the bar's glass (.dock-body) grows to hold the swollen icons to the
// fraction of a pixel, and the frosted glass under it (what the page tells the compositor, `set_glass_pane`) is where
// the bar's glass is drawn at every frame, not a frame behind (which was seen as flicker at the bar's ends).
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/docksync.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const pins = ["Notes", "Mail", "Maps", "Music", "Photos", "Files", "Chat"].map((name, i) => ({
  id: `p${i}`, kind: "app", path: `C:\\Tools\\${name}.exe`, name, icon: null, children: [],
}));

for (const tinted of [true, false]) {
  const h = await startHarness({
    out, window: "dock", viewport: [1400, 500], running: [],
    settings: (s) => {
      s.dock.autoHide = false;
      s.dock.magnification = true;
      s.dock.magnificationScale = 1.8;
      s.dock.tintWithTheme = tinted;
      s.appearance.realBlur = true;
      s.appearance.frost = { ...(s.appearance.frost ?? {}), dock: { blur: 36, grain: 0.5, glass: true } };
      s.pinned = pins;
    },
  });
  try {
    await h.open(".dock-icon");
    await h.sleep(900);
    const q = (js) => h.eval(`(() => ${js})()`);
    const bar = await q("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { left: b.left, right: b.right, y: (b.top + b.bottom) / 2, w: b.width }; })()");
    if (tinted) {
      // each frame: where the glass is drawn, where the frosted glass was last put, and how much the icons swell
      await h.record("f", `(() => { const b = document.querySelector('.dock-body').getBoundingClientRect(); const p = window.__calls.filter((c) => c.cmd === 'set_glass_pane' && c.args.pane.shown && Math.abs(c.args.pane.height - b.height) < 2).pop()?.args.pane; const mags = [...document.querySelectorAll('.dock-icon-mag')].map((m) => m.getBoundingClientRect().width); return { l: b.left, w: b.width, pl: p ? p.x : null, pw: p ? p.width : null, swell: mags.reduce((a, w) => a + w, 0) }; })()`);
      for (let x = bar.left - 30; x < bar.left + bar.w * 0.6; x += 3) {
        await h.move(x, bar.y);
        await h.sleep(8);
      }
      await h.move(bar.left + bar.w * 0.3, 5);
      await h.sleep(700);
      const f = (await h.recorded("f")).map((r) => r.v).filter((v) => v && v.pw !== null);
      const off = f.map((v) => Math.max(Math.abs(v.pl - v.l), Math.abs(v.pw - v.w)));
      const worst = Math.max(...off);
      const grew = Math.max(...f.map((v) => v.w)) - bar.w;
      console.log(`     ${f.length} frames, the glass grew by up to ${grew.toFixed(1)}px; frost off the glass by up to ${worst.toFixed(2)}px`);
      check(grew > 20, "the bar's glass grows to hold the swollen icons");
      check(worst <= 0.1, "and at every frame the frosted glass is where the bar's glass is (not a frame behind)");
      // to the fraction: the glass is as wide as the bar at rest plus all the swell, and the bar itself never changes size
      await h.move(bar.left + bar.w * 0.35, bar.y);
      await h.sleep(900);
      const now = await q("(() => { const b = document.querySelector('.dock-body').getBoundingClientRect(); const bar = document.querySelector('.dock-bar').getBoundingClientRect(); const s = [...document.querySelectorAll('.dock-icon')].reduce((a, e) => a + (parseFloat(e.style.getPropertyValue('--grow')) || 0), 0); return { body: b.width, bar: bar.width, swell: s }; })()");
      check(Math.abs(now.bar - bar.w) < 0.01, `the bar keeps its size (${bar.w.toFixed(2)} -> ${now.bar.toFixed(2)})`);
      check(Math.abs(now.body - (bar.w + now.swell)) < 0.02, `the glass is exactly the bar and the swell (${now.body.toFixed(3)} for ${(bar.w + now.swell).toFixed(3)})`);
      const shot = await h.shot(0, Math.max(0, bar.y - 120), 1400, 200, 1);
      console.log("     sheet:", await h.sheet({ swollen: shot }, "docksync"));
    } else {
      const look = await q("(() => { const b = document.querySelector('.dock-body'); const cs = getComputedStyle(b); return { tint: cs.getPropertyValue('--clear-tint').trim(), glow: getComputedStyle(document.querySelector('.dock-viewport')).getPropertyValue('--clear-glow').trim() }; })()");
      check(look.tint === "255, 255, 255", `untinted, the bar's glass is plain (${look.tint})`);
    }
    check((await h.errors()).length === 0, `${tinted ? "tinted" : "plain"}: no errors in the page`);
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
