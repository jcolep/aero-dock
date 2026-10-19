// The click effects' preview in Settings > Animations, off screen: each of the four played on the middle (yellow)
// icon, captured through its life, so the halo can be seen running round the icon's own square (not its padded box)
// and the bloom can be seen at all. Writes clickfx.png (rows: effects; columns: moments).
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/clickfx.mjs <out folder> [settings.json]

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
const h = await startHarness({ out, window: "settings", viewport: [1100, 900], settings: (s) => real && merge(s, real) });
const shots = {};
try {
  await h.open(".settings-root");
  await h.sleep(600);
  const q = (js) => h.eval(`(() => ${js})()`);
  await q("[...document.querySelectorAll('.sb-item')].find((b) => b.textContent.trim() === 'Animations').click()");
  await h.sleep(700);
  // the click picker's stage, scrolled into view
  await q("(() => { const p = [...document.querySelectorAll('.anim-picker')].find((p) => p.querySelector('.ctl-label')?.textContent === 'Click effect'); p.scrollIntoView({ block: 'center' }); window.__picker = p; })()");
  await h.sleep(500);
  for (const label of ["Edge Halo", "Light Bloom", "Shine Sweep", "Press Dimple"]) {
    await q(`[...window.__picker.querySelectorAll('.anim-chip')].find((b) => b.textContent === ${JSON.stringify(label)}).click()`);
    const icon = await q("(() => { const r = window.__picker.querySelector('.anim-icon-padded').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()");
    const box = { x: icon.x - 42, y: icon.y - 34, w: icon.w + 84, h: icon.h + 62 };
    // the effect starts 250ms after the click
    let at = 0;
    for (const ms of [340, 440, 540, 640, 800, 1000]) {
      await h.sleep(ms - at);
      at = ms;
      shots[`${label} ${ms - 250}ms`] = await h.shot(box.x, box.y, box.w, box.h, 3);
    }
    await h.sleep(700);
  }
  // the halo on a glass-look icon (see-through inside, a solid mark in the middle): only its outer edge is traced
  await q(`[...window.__picker.querySelectorAll('.anim-chip')].find((b) => b.textContent === "Edge Halo").click()`);
  await h.sleep(1200);
  await q(`(() => { const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="14" y="14" width="72" height="72" rx="17" fill="#ffd060" fill-opacity="0.35"/><circle cx="50" cy="50" r="15" fill="#fff"/></svg>'; window.__picker.querySelector('.anim-icon-padded').src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg); })()`);
  await h.sleep(300);
  await q("window.__picker.querySelector('.anim-stage').click()");
  {
    const icon = await q("(() => { const r = window.__picker.querySelector('.anim-icon-padded').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()");
    const box = { x: icon.x - 42, y: icon.y - 34, w: icon.w + 84, h: icon.h + 62 };
    let at = 0;
    for (const ms of [300, 360, 420, 480, 560, 700]) {
      await h.sleep(ms - at);
      at = ms;
      shots[`glass icon halo ${ms - 250}ms`] = await h.shot(box.x, box.y, box.w, box.h, 3);
    }
  }
  // the tuning under the picker
  const tune = await q("(() => { const r = document.querySelector('.click-tune').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, labels: [...document.querySelectorAll('.click-tune .ctl-label')].map((l) => l.textContent) }; })()");
  console.log("tuning:", JSON.stringify(tune.labels));
  shots["tuning"] = await h.shot(tune.x, tune.y, tune.w, Math.min(tune.h, 260));
  console.log("errors:", JSON.stringify(await h.errors()));
  await h.sheet(shots, "clickfx", 1900);
} finally {
  h.close();
}
