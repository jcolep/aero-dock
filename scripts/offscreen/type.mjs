// Type and numbers: the bundled typeface is the one in use, and a number rolls (only the digits that change move,
// and in between they are part way) instead of jumping.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/type.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

const h = await startHarness({ out, window: "settings", viewport: [1100, 900], settings: () => {} });
try {
  await h.open(".ctl-value");
  await h.sleep(800);
  const face = await h.eval(`getComputedStyle(document.body).fontFamily`);
  check(face.startsWith("\"Inter Variable\""), `the typeface is Inter (${face.slice(0, 40)})`);
  check(await h.eval(`document.fonts.check('600 16px "Inter Variable"')`), "and it is loaded, at a weight of its own");
  // a slider, moved by one step
  const info = await h.eval(`(() => { const s = document.querySelector('input[type=range]'); const v = s.closest('.ctl-row').querySelector('.ctl-value .roll'); return { before: v.getAttribute('aria-label'), min: +s.min, max: +s.max, value: +s.value, step: +s.step || 1 }; })()`);
  console.log("a slider:", JSON.stringify(info));
  const read = () => h.eval(`(() => { const s = document.querySelector('input[type=range]'); const v = s.closest('.ctl-row').querySelector('.ctl-value .roll'); return { text: v.getAttribute('aria-label'), cols: [...v.querySelectorAll('.roll-col')].map((c) => +(new DOMMatrixReadOnly(getComputedStyle(c).transform).m42).toFixed(1)) }; })()`);
  const first = await read();
  // move it by a tenth of its range
  const target = info.value + (info.max - info.min) * 0.1 * (info.value + (info.max - info.min) * 0.1 > info.max ? -1 : 1);
  await h.eval(`(() => { const s = document.querySelector('input[type=range]'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(s, ${target}); s.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  const mids = [];
  for (let i = 0; i < 8; i++) {
    await h.sleep(40);
    mids.push(await read());
  }
  const mid = mids[1];
  await h.sleep(500);
  const end = await read();
  console.log("columns: before", JSON.stringify(first.cols), "mid", JSON.stringify(mid.cols), "end", JSON.stringify(end.cols), "|", first.text, "->", end.text);
  check(first.text !== end.text, `the value changed (${first.text} to ${end.text})`);
  const moved = end.cols.map((e, i) => e !== first.cols[i]);
  const partway = mids.some((r) => r.cols.some((m, i) => m !== first.cols[i] && m !== end.cols[i]));
  check(moved.some(Boolean), "a digit moved");
  check(partway, "and was part way a moment after, not already there");
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
