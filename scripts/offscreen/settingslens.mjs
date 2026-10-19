// The lens on the settings window's sidebar, off screen, with the owner's own settings: where it sits against the
// row it is on (size, offset), how it travels between rows (including across a group's heading), and what it looks
// like at rest, mid-hop and over the chosen section. Prints the measurements and writes settingslens.png.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/settingslens.mjs <out folder> [settings.json]

import { readFileSync } from "node:fs";
import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const real = process.argv[3] ? JSON.parse(readFileSync(process.argv[3], "utf8")) : null;
const merge = (into, from) => {
  for (const [k, v] of Object.entries(from)) {
    if (v && typeof v === "object" && !Array.isArray(v) && into[k] && typeof into[k] === "object") merge(into[k], v);
    else into[k] = v;
  }
};
const h = await startHarness({ out, window: "settings", viewport: [1100, 760], settings: (s) => real && merge(s, real) });
const shots = {};
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
try {
  await h.open(".settings-root");
  await h.sleep(900);
  const q = (js) => h.eval(`(() => ${js})()`);
  const rows = await q("[...document.querySelectorAll('.sb-item')].map((e) => { const r = e.getBoundingClientRect(); return { t: e.textContent, x: r.left, y: r.top, w: r.width, h: r.height, active: e.dataset.active }; })");
  const sb = await q("(() => { const r = document.querySelector('.sb').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()");
  console.log("sidebar", JSON.stringify(sb));
  console.log("rows", rows.slice(0, 6).map((r) => `${r.t}@${Math.round(r.y)} ${Math.round(r.w)}x${Math.round(r.h)}`).join(" | "));
  const lensVsRow = () =>
    q(`(() => {
      const l = document.querySelector('.glide-highlight'); const row = document.querySelector('.sb-item[data-lensed]');
      if (!l) return null; const a = l.getBoundingClientRect(); const b = row?.getBoundingClientRect();
      return { lens: [a.left, a.top, a.width, a.height].map((n) => +n.toFixed(1)), row: b ? [b.left, b.top, b.width, b.height].map((n) => +n.toFixed(1)) : null, opacity: +getComputedStyle(l).opacity, transform: getComputedStyle(l).transform, rowText: row?.textContent, rowTransform: row ? getComputedStyle(row).transform : null, radius: getComputedStyle(l).borderRadius };
    })()`);
  const at = (r) => [r.x + r.w / 2, r.y + r.h / 2];
  const clip = () => h.shot(sb.x, sb.y, sb.w, Math.min(sb.h, 420), 1.5);

  // rest on the third row
  await h.move(...at(rows[2]));
  await h.sleep(700);
  console.log("at rest on", rows[2].t, JSON.stringify(await lensVsRow()));
  shots["rest"] = await clip();

  // one row down, sampled through the hop
  await h.record("hop", `(() => { const a = document.querySelector('.glide-highlight').getBoundingClientRect(); return [Math.round(a.top), Math.round(a.height), Math.round(a.left), Math.round(a.width)]; })()`);
  await h.move(...at(rows[3]));
  await h.sleep(90);
  shots["hop 90ms"] = await clip();
  await h.sleep(600);
  const hop = await h.recorded("hop");
  console.log("hop to", rows[3].t, "[top,height,left,width] every frame:", JSON.stringify(hop.slice(0, 40).map((s) => s.v)));
  const rested = await lensVsRow();
  console.log("rested on", rows[3].t, JSON.stringify(rested));
  const near = (a, b) => Math.abs(a - b) <= 1;
  const row3 = rows[3];
  check(near(rested.lens[0], row3.x) && near(rested.lens[2], row3.w) && near(rested.lens[1], row3.y) && near(rested.lens[3], row3.h), "at rest the lens is the row: same place, width and height");
  check(rested.rowTransform === "none", "the row itself is not enlarged (only its icon)");
  check(hop.every((s) => near(s.v[2], row3.x) && near(s.v[3], row3.w)), "through the hop it keeps the row's left edge and width");
  check(Math.max(...hop.map((s) => s.v[1])) <= row3.h + 15, `it stretches along the list by at most 14px (tallest ${Math.max(...hop.map((s) => s.v[1]))})`);

  // across the gap to the next group
  const groupStarts = await q("[...document.querySelectorAll('.sb-group')].map((g) => g.querySelector('.sb-item')?.textContent)");
  const firstOfSecond = rows.find((r) => r.t === groupStarts[1]);
  const lastOfFirst = rows[rows.indexOf(firstOfSecond) - 1];
  await h.move(...at(lastOfFirst));
  await h.sleep(600);
  await h.record("cross", `(() => { const a = document.querySelector('.glide-highlight').getBoundingClientRect(); return [Math.round(a.top), Math.round(a.height)]; })()`);
  await h.move(...at(firstOfSecond));
  await h.sleep(100);
  shots["across a heading"] = await clip();
  await h.sleep(600);
  console.log(`across the heading ${lastOfFirst.t} -> ${firstOfSecond.t}:`, JSON.stringify((await h.recorded("cross")).slice(0, 30).map((s) => s.v)));

  // over the chosen (active) row
  const active = rows.find((r) => r.active === "true");
  if (active) {
    await h.move(...at(active));
    await h.sleep(700);
    console.log("on the chosen row", JSON.stringify(await lensVsRow()));
    shots["on the chosen"] = await clip();
  }

  // the pointer between two rows (in the gap) and then out to the side
  await h.move(rows[4].x + rows[4].w / 2, rows[4].y + rows[4].h + 1);
  await h.sleep(500);
  console.log("in the 2px gap below", rows[4].t, JSON.stringify(await lensVsRow()));
  await h.record("frames", "1");
  await h.move(sb.x + sb.w + 120, rows[4].y);
  await h.sleep(900);
  console.log("pointer gone", JSON.stringify(await lensVsRow()), "frames drawn in 900ms:", (await h.recorded("frames")).length);
  shots["pointer gone"] = await clip();
  await h.sheet(shots, "settingslens", 700);
} finally {
  h.close();
}

// a short window, where the list scrolls: scrolled to its end, the lens still sits on the row under the pointer
{
  const s = await startHarness({ out, window: "settings", viewport: [1100, 480], settings: (st) => real && merge(st, real) });
  try {
    await s.open(".settings-root");
    await s.sleep(800);
    const q = (js) => s.eval(`(() => ${js})()`);
    const scrolled = await q("(() => { const l = document.querySelector('.sb-list'); l.scrollTop = l.scrollHeight; return l.scrollTop; })()");
    await s.sleep(300);
    const row = await q("(() => { const r = [...document.querySelectorAll('.sb-item')].find((b) => b.textContent.trim() === 'General').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()");
    await s.move(row.x + row.w / 2, row.y + row.h / 2);
    await s.sleep(700);
    const lens = await q("(() => { const r = document.querySelector('.glide-highlight').getBoundingClientRect(); return { y: r.top, h: r.height }; })()");
    check(scrolled > 20 && Math.abs(lens.y - row.y) <= 1 && Math.abs(lens.h - row.h) <= 1, `with the list scrolled ${Math.round(scrolled)}px, the lens is on the row under the pointer (lens at ${Math.round(lens.y)}, row at ${Math.round(row.y)})`);
  } finally {
    s.close();
  }
}
process.exit(failed ? 1 : 0);
