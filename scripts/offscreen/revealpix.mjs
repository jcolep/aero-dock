// What the eye sees as the dock comes in: the vertical centre of what is drawn at an app icon, a status chip and the
// Recycle Bin, measured from screenshots (zoomed 4x, so a fraction of a pixel shows) every ~45 ms through a reveal.
// A step half a second after it arrived is the "shift down" that was seen. Prints each series and the biggest step
// (env: SCALE=1.5 for display scaling, MAG=0 magnification off, SERIES=1 the raw series, PROBE=1 layout and animations,
// MUT=1 the DOM changes). Reported only: the centroid also moves with the glass tint, about 0.3px.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/revealpix.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const anim = process.argv[3] ?? "pop";
const h = await startHarness({
  out,
  window: "dock",
  viewport: [1100, 520],
  scale: Number(process.env.SCALE ?? 1),
  settings: (s) => {
    s.dock.autoHide = true;
    s.dock.autoHideDelayMs = 200;
    s.dock.magnification = process.env.MAG !== "0"; s.dock.magnificationScale = 1.3; s.dock.magnificationLift = 0.12; s.dock.magnificationReach = 2.6; s.dock.iconSize = 26; s.dock.floating = true; s.dock.floatingMargin = 9; s.dock.padding = 10; s.dock.iconSpacing = 10;
    s.onboardingComplete = true;
    s.animations.dockReveal = anim;
    s.pinned = ["Edge", "Mail", "Word"].map((name) => ({ id: name, kind: "app", path: `C:\\apps\\${name}.exe`, name, icon: null, children: [] }));
  },
});
try {
  await h.open(".dock-icon");
  await h.desktop("#5b6f8f");
  const q = (js) => h.eval(`(() => ${js})()`);
  // the idle float is a drift of its own, not what is being looked for here
  await q("(() => { const s = document.createElement('style'); s.textContent = '.dock-icon-float { transform: none !important; }'; document.head.appendChild(s); return 1; })()");
  await h.sleep(1500);
  const bar = await q("(() => { const b = document.querySelector('.dock-bar'); const r = b.getBoundingClientRect(); return { left: r.left, y: b.offsetTop + b.offsetHeight / 2 }; })()");
  // where the three things rest (the dock is up now)
  const spots = await q(`(() => {
    const box = (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
    const chips = [...document.querySelectorAll('.widget-chip-button')];
    return { icon: box(document.querySelector('.dock-icon-mag')), chip: box(chips[chips.length - 2] ?? chips[0]), bin: box(chips[chips.length - 1]) };
  })()`);
  await h.move(bar.left + 100, 60);
  await q("(() => { document.querySelector('.dock-viewport').dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: null })); return 1; })()");
  for (let i = 0; i < 40; i++) {
    await h.sleep(150);
    if ((await q("document.querySelector('.dock-viewport').dataset.reveal")) === "out") break;
  }
  await h.sleep(900);
  if (process.env.MUT) await q("(() => { window.__mut = []; window.__t0 = performance.now(); new MutationObserver((list) => { for (const m of list) { const el = m.target.nodeType === 1 ? m.target : m.target.parentElement; if (!el || el.closest('.dock-icon-float, .glass-sweep')) continue; window.__mut.push([Math.round(performance.now() - window.__t0), (el.className && el.className.baseVal === undefined ? el.className : el.tagName).toString().slice(0, 40), m.type === 'attributes' ? m.attributeName + '=' + String(el.getAttribute(m.attributeName)).slice(0, 60) : m.type]); } }).observe(document.querySelector('.dock-viewport'), { subtree: true, attributes: true, childList: true, characterData: true }); return 1; })()");
  await q("(() => { document.querySelector('.dock-viewport').dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: null })); return 1; })()");
  // the vertical centre of what differs from the corner pixel, in a box round each spot, for each screenshot
  const centroid = (b64) =>
    h.eval(`(async () => {
      const blob = await (await fetch('data:image/png;base64,${b64}')).blob();
      const bmp = await createImageBitmap(blob);
      const c = new OffscreenCanvas(bmp.width, bmp.height); const g = c.getContext('2d'); g.drawImage(bmp, 0, 0);
      const d = g.getImageData(0, 0, bmp.width, bmp.height).data;
      const ref = [d[0], d[1], d[2]]; let sum = 0, wy = 0;
      for (let y = 0; y < bmp.height; y++) for (let x = 0; x < bmp.width; x++) { const i = (y * bmp.width + x) * 4; const w = Math.abs(d[i] - ref[0]) + Math.abs(d[i + 1] - ref[1]) + Math.abs(d[i + 2] - ref[2]); sum += w; wy += w * y; }
      return sum ? wy / sum / 4 : null;
    })()`);
  await h.move(bar.left + 4, 517);
  const series = { icon: [], chip: [], bin: [] };
  const t0 = Date.now();
  const probe = [];
  const probeJs = `(() => { const top = (e) => e ? Math.round(e.getBoundingClientRect().top * 100) / 100 : null; const chips = [...document.querySelectorAll('.widget-chip-button')]; const mag = document.querySelector('.dock-icon-mag'); return { vp: top(document.querySelector('.dock-viewport')), body: top(document.querySelector('.dock-body')), bar: top(document.querySelector('.dock-bar')), icon: top(mag), tf: document.querySelector('.dock-bar').style.transform, anims: document.getAnimations().map((a) => (a.animationName || a.transitionProperty || a.constructor.name) + '@' + (a.effect && a.effect.target ? (a.effect.target.className || a.effect.target.tagName).toString().slice(0, 28) : '?') + ':' + Math.round(a.currentTime || 0) + '/' + Math.round(a.effect.getComputedTiming().endTime)).slice(0, 8), op: document.querySelector('.dock-bar').style.opacity, chip: top(chips[chips.length - 2]), bin: top(chips[chips.length - 1]), h: innerHeight }; })()`;
  while (Date.now() - t0 < 1800) {
    if (process.env.PROBE) probe.push([Date.now() - t0, await h.eval(probeJs)]);
    for (const [name, b] of Object.entries(spots)) {
      const shot = await h.shot(b.x - 4, b.y - 4, b.w + 8, b.h + 8, 4);
      series[name].push([Date.now() - t0, await centroid(shot)]);
    }
  }
  for (const [name, s] of Object.entries(series)) {
    const settled = s.filter(([t]) => t > 1200).map(([, v]) => v).filter((v) => v !== null);
    const rest = settled.reduce((a, b) => a + b, 0) / Math.max(1, settled.length);
    const late = s.filter(([t, v]) => t > 450 && v !== null);
    // after the reveal has all but finished (450 ms on), how far is it from where it ends up?
    const worst = Math.max(0, ...late.map(([, v]) => Math.abs(v - rest)));
    const stepAt = late.reduce((m, [t, v], i) => (i && Math.abs(v - late[i - 1][1]) > Math.abs(m.d) ? { d: v - late[i - 1][1], t } : m), { d: 0, t: 0 });
    const ok = worst < 0.25;
    // reported, not gated: the centroid also moves with the glass tint and the pointer light under it (about 0.3px)
    console.log(`${ok ? "ok  " : "note"} ${anim} ${name}: after 450 ms it is at most ${worst.toFixed(2)}px from where it settles; biggest step ${stepAt.d.toFixed(2)}px at ${stepAt.t} ms`);
    if (process.env.SERIES) console.log("     ", s.map(([t, v]) => `${t}:${v === null ? "-" : v.toFixed(2)}`).join(" "));
  }
  if (process.env.MUT) console.log(JSON.stringify((await q("window.__mut")).filter((m) => m[0] > 500 && m[0] < 1100)));
  if (process.env.PROBE) for (const [t, p] of probe) console.log(t, JSON.stringify(p));
  check_errors: {
    const e = await h.errors();
    if (e.length) {
      failed = true;
      console.log("FAIL errors", e.slice(0, 2));
    }
  }
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);








