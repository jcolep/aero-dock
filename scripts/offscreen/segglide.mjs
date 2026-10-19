// A segmented choice in the settings window, off screen: what is chosen sits under one piece of glass that glides to
// the new choice (on the standard spring) rather than jumping, and comes to rest exactly on it.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/segglide.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const h = await startHarness({ out, window: "settings", viewport: [1060, 780] });
try {
  await h.open(".settings-root");
  await h.sleep(600);
  const q = (js) => h.eval(`(() => ${js})()`);
  await q("[...document.querySelectorAll('.sb-item')].find((b) => b.textContent.trim() === 'Dock').click()");
  await h.sleep(600);
  // the Position choice: Bottom, Top, Left, Right
  const where = (label) => q(`(() => { const b = [...document.querySelectorAll('.ctl-segmented button')].find((x) => x.textContent === ${JSON.stringify(label)}); const r = b.getBoundingClientRect(); return { x: r.left, w: r.width, cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; })()`);
  const thumbOf = "document.querySelector('.ctl-segmented').querySelector('.ctl-seg-thumb')";
  const right = await where("Right");
  await h.record("thumb", `(() => { const r = ${thumbOf}.getBoundingClientRect(); return Math.round(r.left); })()`);
  await h.click(right.cx, right.cy);
  await h.sleep(700);
  const xs = (await h.recorded("thumb")).map((s) => s.v);
  const distinct = new Set(xs).size;
  const rest = await q(`(() => { const r = ${thumbOf}.getBoundingClientRect(); return { x: r.left, w: r.width }; })()`);
  const nowRight = await where("Right");
  check(distinct > 5, `it glides there through ${distinct} places, not in one jump`);
  check(Math.abs(rest.x - nowRight.x) <= 1 && Math.abs(rest.w - nowRight.w) <= 1, `and rests on the new choice (${Math.round(rest.x)} vs ${Math.round(nowRight.x)})`);
  check((await h.errors()).length === 0, "no errors in the page");
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
