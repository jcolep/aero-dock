// How smooth the Start menu's motion is, off screen: frames per second while it
// opens and closes, and while the glass glides across the tiles.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/startfps.mjs <out folder>
//
// The browser here draws in software, as the app's does (`--disable-gpu`), and is
// held to the screen's refresh, so the numbers are what to compare, not to quote.
// It also measures the panel as it was before the blur was taken off it, to show
// what that bought.

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const names = ["Edge", "Mail", "Teams", "Outlook", "Excel", "Word", "Spotify", "Code", "Terminal", "Photos", "Calendar", "Notepad"];
const h = await startHarness({
  out,
  window: "start",
  viewport: [760, 800],
  apps: names.map((name) => ({ name, shortcutPath: null, targetPath: `C:\\apps\\${name}.exe`, args: "", icon: null, source: "start-menu" })),
  settings: (s) => {
    s.pinned = names.map((name, i) => ({ id: String(i), kind: "app", path: `C:\\apps\\${name}.exe`, name, icon: null, children: [] }));
  },
});

/** Frames drawn over `ms`: how many, and the longest wait for one. */
const measure = (ms) =>
  h.eval(`new Promise((done) => {
    let n = 0, worst = 0;
    const t0 = performance.now();
    let last = t0;
    const frame = (t) => {
      n++;
      worst = Math.max(worst, t - last);
      last = t;
      if (t - t0 < ${ms}) requestAnimationFrame(frame);
      else done({ fps: Math.round((n / ((t - t0) / 1000)) * 10) / 10, worstMs: Math.round(worst) });
    };
    requestAnimationFrame(frame);
  })`);

try {
  await h.open(".st-root");
  await h.desktop("linear-gradient(120deg,#1b2742,#4a3b6b 55%,#7a4a5a)");
  await h.sleep(500);

  for (const legacy of [false, true]) {
    // the panel with the blur it used to carry, redrawn on every frame it moves
    await h.eval(`(() => { let s = document.getElementById("legacy"); if (${legacy} && !s) { s = document.createElement("style"); s.id = "legacy"; s.textContent = ".st-panel { backdrop-filter: blur(30px) saturate(1.8) !important; }"; document.head.append(s); } if (!${legacy}) s?.remove(); })()`);
    const label = legacy ? "with the old blur" : "now";

    for (const anim of ["rise", "bloom", "genie", "slide"]) {
      await h.eval(`document.querySelector(".st-root").dataset.anim = ${JSON.stringify(anim)}`);
      const open = h.eval(`window.__emit("start://open", { previous: 0 })`).then(() => measure(520));
      const opened = await open;
      await h.sleep(300);
      const closing = h.eval(`window.__emit("start://outside", null)`).then(() => measure(420));
      const closed = await closing;
      await h.sleep(300);
      console.log(`${label}: ${anim} opens at ${opened.fps} fps (worst frame ${opened.worstMs} ms), closes at ${closed.fps} fps (worst ${closed.worstMs} ms)`);
    }

    // the glass sweeping along a row of tiles and back
    await h.eval(`window.__emit("start://open", { previous: 0 })`);
    await h.sleep(700);
    const tiles = await h.eval("[...document.querySelectorAll('.st-tile')].slice(0, 6).map((e) => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })");
    await h.move(tiles[0].x, tiles[0].y);
    await h.sleep(300);
    const glide = measure(1400);
    for (const t of [...tiles.slice(1), ...tiles.slice(0, 5).reverse()]) {
      await h.move(t.x, t.y);
      await h.sleep(110);
    }
    const g = await glide;
    console.log(`${label}: the glass glides at ${g.fps} fps (worst frame ${g.worstMs} ms)`);
    await h.eval(`window.__emit("start://outside", null)`);
    await h.sleep(500);
  }
} finally {
  h.close();
}
process.exit(0);
