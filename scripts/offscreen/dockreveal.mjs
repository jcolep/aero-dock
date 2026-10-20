// The dock coming back in with auto-hide, off screen, filmed frame by frame, for each way it can appear. The icons keep
// their place in the glass all the way (motion's drag once re-fitted every icon to the bar's changing scale and drew
// them drifting ~20 px inside it), and never go more than a pixel past where they come to rest (Pop's spring went 6.5%
// over its size from the screen edge, so the icons rode up ~4 px and then sank back, a moment after they had seemed to
// arrive).
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/dockreveal.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

for (const anim of ["pop", "slide", "rise"]) {
  const h = await startHarness({
    out,
    window: "dock",
    viewport: [1100, 520],
    settings: (s) => {
      s.dock.autoHide = true;
      s.dock.autoHideDelayMs = 400;
      // (nothing swells under the pointer, so where the icons rest is one place)
      s.dock.magnification = false;
      s.onboardingComplete = true;
      s.animations.dockReveal = anim;
      s.pinned = ["Edge", "Mail", "Word"].map((name) => ({ id: name, kind: "app", path: `C:\\apps\\${name}.exe`, name, icon: null, children: [] }));
    },
  });
  try {
    await h.open(".dock-icon");
    const q = (js) => h.eval(`(() => ${js})()`);
    await h.sleep(1200);
    const bar = await q("(() => { const b = document.querySelector('.dock-bar'); const r = b.getBoundingClientRect(); return { left: r.left, y: b.offsetTop + b.offsetHeight / 2 }; })()");
    // away: the page told the pointer has left, and the dock slides out (waited for, however long it takes here)
    await h.move(bar.left + 100, 60);
    await q("(() => { document.querySelector('.dock-viewport').dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: null })); return 1; })()");
    let away = false;
    for (let i = 0; i < 40 && !away; i++) {
      await h.sleep(150);
      away = (await q("document.querySelector('.dock-viewport').dataset.reveal")) === "out";
    }
    await h.sleep(700);
    check(away, `${anim}: it slid away`);
    await q("(() => { document.querySelector('.dock-viewport').dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: null })); return 1; })()");    // the icon's place in the glass, as a fraction of the bar's own scale (10 px from the glass's top at rest)
    await h.record("f", "(() => { const i = document.querySelector('.dock-icon-mag').getBoundingClientRect(); const b = document.querySelector('.dock-body').getBoundingClientRect(); const s = new DOMMatrix(getComputedStyle(document.querySelector('.dock-bar')).transform).a || 1; return { top: i.top, inGlass: (i.top - b.top) / s }; })()");
    await h.move(bar.left + 4, 517);
    await h.sleep(1800);
    const film = (await h.recorded("f")).map((s) => s.v);
    const atRest = film.at(-1).inGlass;
    // where they rest: where they are once it has settled
    const rest = film.at(-1).top;
    const drift = Math.max(...film.map((f) => Math.abs(f.inGlass - atRest)));
    const over = Math.max(0, ...film.map((f) => rest - f.top));
    check(drift < 0.6, `${anim}: the icons keep their place in the glass all the way in (drift ${drift.toFixed(2)}px)`);
    check(over < 1, `${anim}: they go no more than a pixel past where they rest (${over.toFixed(2)}px)`);
    check(film[0].top - rest > 20, `${anim}: it came in from away (${(film[0].top - rest).toFixed(0)}px)`);
    check((await h.errors()).length === 0, `${anim}: no errors`);
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
