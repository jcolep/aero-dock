// A menu closed in the middle of opening should turn back from where it is,
// not jump. Opens the Control Center, clicks away 110 ms in, and reads the
// panel's opacity on every frame afterwards.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/interrupt.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const h = await startHarness({ out, window: "menubar" });
try {
  await h.open(".menubar");
  await h.desktop();
  const cc = await h.rect('.mb-item[title="Control Center"]');
  await h.record(
    "panel",
    `(() => { const p = document.querySelector('.mb-panel'); if (!p) return null; const cs = getComputedStyle(p); return { op: +(+cs.opacity).toFixed(3), leaving: p.dataset.leaving, turning: p.dataset.interrupted || "" }; })()`,
  );
  await h.click(cc.x, cc.y);
  await h.sleep(110);
  const mark = (await h.recorded("panel")).length;
  await h.click(900, 500);
  await h.sleep(900);
  const frames = (await h.recorded("panel")).slice(Math.max(0, mark - 2));
  const t0 = frames[0]?.t ?? 0;
  for (const f of frames.filter((_, i) => i % 3 === 0).slice(0, 12)) {
    console.log(`${f.t - t0}ms`.padStart(6), f.v ? `opacity ${f.v.op}  leaving=${f.v.leaving}  turning back=${f.v.turning || "no"}` : "gone");
  }
  const ops = frames.map((f) => f.v?.op).filter((v) => v !== undefined);
  console.log("ends gone:", frames.at(-1)?.v === null, " frames seen while turning:", ops.length);
} finally {
  h.close();
}
process.exit(0);
