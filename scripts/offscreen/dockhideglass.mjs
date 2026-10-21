// The frosted glass under the dock going away with it: while the bar is still visibly leaving, its glass is still there,
// on the bar's shape and fading with it (it used to be taken at the first frame, leaving the bar bare as it went), and
// it is gone once the dock has gone.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/dockhideglass.mjs <out folder> [reveal preset]

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const anim = process.argv[3] ?? "pop";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const h = await startHarness({
  out,
  window: "dock",
  viewport: [1100, 520],
  settings: (s) => {
    s.dock.autoHide = true;
    s.dock.autoHideDelayMs = 200;
    s.dock.magnification = false;
    s.onboardingComplete = true;
    s.appearance.realBlur = true;
    s.appearance.frost = { ...(s.appearance.frost ?? {}), dock: { blur: 36, grain: 0.5, glass: true } };
    s.animations.dockReveal = anim;
    s.pinned = ["Edge", "Mail", "Word"].map((name) => ({ id: name, kind: "app", path: `C:\\apps\\${name}.exe`, name, icon: null, children: [] }));
  },
});
try {
  await h.open(".dock-icon");
  await h.desktop("#5b6f8f");
  const q = (js) => h.eval(`(() => ${js})()`);
  // the pointer on the dock from the first moment, or it slides away before it is measured
  const first = await q("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { x: (b.left + b.right) / 2, y: (b.top + b.bottom) / 2 }; })()");
  await h.move(first.x, first.y);
  await h.sleep(1200);
  // (it can have gone already, in the 200 ms before the pointer got there: bring it back)
  if ((await q("document.querySelector('.dock-viewport').dataset.reveal")) !== "in") {
    await q("(() => { document.querySelector('.dock-viewport').dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: null })); return 1; })()");
    await h.move(first.x, 517);
    await h.sleep(1500);
  }
  check((await q("document.querySelector('.dock-viewport').dataset.reveal")) === "in", "the dock is in before it goes");
  // the pane that is the bar's: the one posted with the bar's own size
  const id = await q(`(() => { const b = document.querySelector('.dock-body').getBoundingClientRect(); return window.__calls.filter((c) => c.cmd === 'set_glass_pane' && c.args.pane.shown && Math.abs(c.args.pane.width - b.width) < 2 && Math.abs(c.args.pane.height - b.height) < 2).pop()?.args.pane.id ?? null; })()`);
  check(!!id, `the bar has a glass pane (${id})`);
  if (process.env.DEBUG) console.log(JSON.stringify(await q("window.__calls.filter((c) => c.cmd === 'set_glass_pane').slice(-4).map((c) => c.args)")), JSON.stringify(await q("(() => { const b = document.querySelector('.dock-body').getBoundingClientRect(); return [b.width, b.height, document.querySelector('.dock-body').dataset.bd]; })()")));
  const bar = await q("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { left: b.left, y: (b.top + b.bottom) / 2 }; })()");
  await h.move(bar.left + 100, 60);
  await h.record(
    "g",
    `(() => { const b = document.querySelector('.dock-body').getBoundingClientRect(); const op = parseFloat(getComputedStyle(document.querySelector('.dock-bar')).opacity); const p = window.__calls.filter((c) => c.cmd === 'set_glass_pane' && c.args.pane.id === ${JSON.stringify(id)}).pop()?.args.pane; return { op, bx: b.left, by: b.top, bw: b.width, bh: b.height, p: p ? { shown: p.shown, x: p.x, y: p.y, w: p.width, h: p.height, o: p.opacity } : null, reveal: document.querySelector('.dock-viewport').dataset.reveal }; })()`,
  );
  await q("(() => { document.querySelector('.dock-viewport').dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: null })); return 1; })()");
  await h.sleep(2200);
  const raw = await h.recorded("g");
  if (process.env.DEBUG) { const i = raw.findIndex((f) => f.v.reveal === "out"); console.log("first out at index", i, "of", raw.length, JSON.stringify(raw.slice(Math.max(0, i - 3), i + 12).map((f) => [f.t - raw[0].t, f.v.reveal, +f.v.op.toFixed(2), Math.round(f.v.by), f.v.p ? [f.v.p.shown, Math.round(f.v.p.y ?? 0)] : null]))); }
  const tOut = raw.find((f) => f.v.reveal === "out")?.t ?? 0;
  // the first 250 ms of going, when the dock is plainly still on its way out (not slid off screen, still drawn at its opacity)
  const frames = raw.map((f) => ({ ...f.v, since: f.t - tOut }));
  if (process.env.DEBUG) console.log(frames.length, JSON.stringify(frames.filter((_, i) => i % 6 === 0).slice(0, 14)));
  const leaving = frames.filter((f) => f.reveal === "out" && f.since < 250 && f.op > 0.15);
  console.log(`${leaving.length} frames in the first 250 ms of going, with the bar still drawn`);
  check(leaving.length >= 2, "the hide is seen part way (at least two frames)");
  const bare = leaving.filter((f) => !f.p || !f.p.shown);
  check(bare.length === 0, `the glass is there in every one of them (${bare.length} frames without)`);
  const off = leaving.filter((f) => f.p && f.p.shown && (Math.abs(f.p.x - f.bx) > 8 || Math.abs(f.p.y - f.by) > 8 || Math.abs(f.p.w - f.bw) > 12 || Math.abs(f.p.h - f.bh) > 12));
  check(off.length === 0, `and on the bar's shape (${off.length} frames off by more than a few px)${off.length ? " e.g. " + JSON.stringify(off[0]) : ""}`);
  const faded = leaving.filter((f) => f.p && f.p.shown && f.p.o > f.op + 0.2);
  check(faded.length === 0, `and fading with it, not standing at full (${faded.length} frames brighter than the bar)`);
  const last = frames.at(-1);
  check(last.reveal === "out" && (!last.p || !last.p.shown), "once the dock has gone, so has its glass");
  const errs = await h.errors();
  check(errs.length === 0, "no errors in the page");
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);






