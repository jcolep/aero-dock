// The Start menu turns back from where it is: closed while it is still arriving it goes back the way it came,
// and opened while it is leaving it comes back from where it had got to. Neither starts again from a first frame.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/startturn.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

const h = await startHarness({ out, window: "start", viewport: [900, 900], settings: () => {} });
// the panel's opacity at every frame for a while, as a list of [ms, opacity]
const record = (ms) =>
  h.eval(`new Promise((done) => { const p = document.querySelector('.st-panel'); const t0 = performance.now(); const rows = []; const tick = () => { const t = performance.now() - t0; rows.push([Math.round(t), +(+getComputedStyle(p).opacity).toFixed(3)]); if (t < ${ms}) requestAnimationFrame(tick); else done(rows); }; tick(); })`);
const calls = (cmd) => h.eval(`window.__calls.filter((c) => c.cmd === ${JSON.stringify(cmd)}).length`);
try {
  await h.open(".st-root");
  await h.desktop("#c8d0e0");

  // ---- closed while arriving ----
  await h.eval(`window.__emit("start://open", { previous: 4242 })`);
  await h.sleep(110);
  const during = await h.eval(`+(+getComputedStyle(document.querySelector('.st-panel')).opacity).toFixed(3)`);
  console.log("opacity 110 ms into the arrival:", during);
  const sampling = record(900);
  await h.eval(`window.__emit("start://outside", null)`);
  const back = await sampling;
  const first = back[0][1];
  console.log("going back:", JSON.stringify(back.slice(0, 16)));
  check(during > 0.05 && during < 0.97, `it was part way (${during})`);
  check(Math.abs(first - during) < 0.2, `and went back from there, not from a first frame (${first})`);
  check(back.slice(1).every((r, i) => r[1] <= back[i][1] + 0.02), "going down all the way");
  check(back[back.length - 1][1] < 0.05, "and it is gone");
  await h.sleep(300);
  check((await calls("close_start")) === 1, "and the window was told to hide, once");

  // ---- opened while leaving ----
  await h.eval(`window.__emit("start://open", { previous: 4242 })`);
  await h.sleep(900);
  await h.eval(`window.__emit("start://outside", null)`);
  await h.sleep(110);
  const leaving = await h.eval(`+(+getComputedStyle(document.querySelector('.st-panel')).opacity).toFixed(3)`);
  console.log("opacity 110 ms into the leaving:", leaving);
  const resumed = record(900);
  await h.eval(`window.__emit("start://reopen", null)`);
  const up = await resumed;
  console.log("coming back:", JSON.stringify(up.filter((_, i) => i % 6 === 0)));
  check(leaving > 0.05 && leaving < 0.97, `it was part way out (${leaving})`);
  check(Math.abs(up[0][1] - leaving) < 0.2, `and came back from there (${up[0][1]})`);
  check(up.slice(1).every((r, i) => r[1] >= up[i][1] - 0.02), "going up all the way");
  check(up[up.length - 1][1] > 0.97, "and it is open");
  await h.sleep(300);
  check((await calls("close_start")) === 1, "and it was not hidden after all");
  check((await h.eval(`document.querySelector('.st-root').dataset.phase`)) === "open", "it says it is open");
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
