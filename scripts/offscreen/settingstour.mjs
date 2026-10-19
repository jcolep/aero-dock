// Every section of the settings window, off screen, with the owner's settings: one picture each (settings-<id>.png,
// the whole section scrolled through in slices), for reviewing the window's look as a whole. Also prints, for each
// section, the corner radii and backgrounds its controls use, to see what is not like the rest.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/settingstour.mjs <out folder> [settings.json] [section ids...]

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const real = process.argv[3] && process.argv[3] !== "-" ? JSON.parse(readFileSync(process.argv[3], "utf8")) : null;
const only = process.argv.slice(4);
const merge = (into, from) => {
  for (const [k, v] of Object.entries(from)) {
    if (v && typeof v === "object" && !Array.isArray(v) && into[k] && typeof into[k] === "object") merge(into[k], v);
    else into[k] = v;
  }
};
const W = 1060;
const H = 780;
const h = await startHarness({ out, window: "settings", viewport: [W, H], settings: (s) => real && merge(s, real) });
try {
  await h.open(".settings-root");
  await h.sleep(800);
  const q = (js) => h.eval(`(() => ${js})()`);
  const ids = await q("[...document.querySelectorAll('.sb-item')].map((b) => b.textContent.trim())");
  for (const title of ids) {
    await q(`[...document.querySelectorAll('.sb-item')].find((b) => b.textContent.trim() === ${JSON.stringify(title)}).click()`);
    await h.sleep(500);
    const id = await q("document.querySelector('[data-section]')?.getAttribute('data-section')");
    if (only.length && !only.includes(id)) continue;
    // the page's scroller and its full height
    const scroller = await q("(() => { const p = document.querySelector('[data-section]'); let e = p; while (e && e !== document.body) { const s = getComputedStyle(e); if (/(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 4) break; e = e.parentElement; } window.__sc = e && e !== document.body ? e : document.scrollingElement; return { total: window.__sc.scrollHeight, view: window.__sc.clientHeight }; })()");
    const slices = Math.min(6, Math.ceil(scroller.total / scroller.view));
    const shots = [];
    for (let i = 0; i < slices; i++) {
      await q(`window.__sc.scrollTop = ${i * scroller.view}`);
      await h.sleep(250);
      shots.push(await h.shot(0, 0, W, H));
    }
    await q("window.__sc.scrollTop = 0");
    shots.forEach((s, i) => writeFileSync(join(out, `settings-${id}-${i + 1}.png`), Buffer.from(s, "base64")));
    // what the section's controls look like: radii and fills, counted
    const styles = await q(`(() => {
      const sec = document.querySelector('[data-section]');
      const tally = {};
      for (const e of sec.querySelectorAll('*')) {
        const s = getComputedStyle(e);
        if (s.borderTopLeftRadius === '0px' || e.getBoundingClientRect().width < 8) continue;
        const k = e.tagName.toLowerCase() + '.' + (e.className && typeof e.className === 'string' ? e.className.split(' ')[0] : '') + ' r=' + s.borderTopLeftRadius;
        tally[k] = (tally[k] || 0) + 1;
      }
      return tally;
    })()`);
    console.log(`== ${id} (${slices} slice${slices > 1 ? "s" : ""}):`, JSON.stringify(styles));
  }
  console.log("errors:", JSON.stringify(await h.errors()));
} finally {
  h.close();
}
