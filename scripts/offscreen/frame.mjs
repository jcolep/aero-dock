// The frame's glass border, off screen: the ring with and without the bevel along the opening.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/frame.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

const shots = {};
for (const [name, on, width] of [["off", false, 3], ["3px", true, 3], ["8px", true, 8]]) {
  const h = await startHarness({
    out,
    window: "frame",
    viewport: [900, 560],
    settings: (s) => {
      s.frame.enabled = true;
      s.frame.padding = 28;
      s.frame.cornerRadius = 22;
      s.frame.ambient = false;
      s.frame.glassBorder = on;
      s.frame.borderWidth = width;
    },
  });
  try {
    await h.open(".frame-root");
    await h.desktop("#7f93b5");
    await h.sleep(500);
    const n = await h.eval("document.querySelectorAll('.frame-bevel').length");
    check(on ? n === 1 : n === 0, `${name}: the bevel is ${on ? "drawn" : "not drawn"} (${n})`);
    if (on) {
      const box = await h.eval(
        "(() => { const b = document.querySelector('.frame-bevel').getBBox(); return { w: b.width, h: b.height }; })()",
      );
      check(box.w <= 900 && box.h <= 560, `${name}: it stays inside the window (${box.w} by ${box.h})`);
    }
    shots[`${name} top left`] = await h.shot(0, 0, 220, 130, 3);
    shots[`${name} bottom right`] = await h.shot(680, 430, 220, 130, 3);
  } finally {
    h.close();
  }
}
console.log("sheet:", await h_sheet(shots));

async function h_sheet(images) {
  // any harness will do to lay the pictures out; make a throwaway one
  const h = await startHarness({ out, window: "frame", viewport: [200, 200], settings: () => {} });
  try {
    return await h.sheet(images, "frame");
  } finally {
    h.close();
  }
}
// ---- the ambient scene in the four bands: one beat for all of them ----
{
  // every frame the page draws is the whole screen-wide window put together again, so the four bands must draw
  // together, on one beat, not each on a timer of its own (which was up to four times the frames)
  const h = await startHarness({ out, window: "frame", viewport: [1600, 900], settings: (s) => { s.frame.enabled = true; s.frame.padding = 24; s.frame.ambient = true; s.appearance.scene = "dust"; s.appearance.particleDensity = 1; } });
  try {
    await h.open(".frame-root");
    await h.sleep(1500);
    const strips = await h.eval("document.querySelectorAll('canvas.frame-strip').length");
    const frames = await h.eval(`new Promise((done) => {
      const seen = new Set(); const raf = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => raf((t) => { seen.add(Math.round(t)); cb(t); });
      setTimeout(() => done(seen.size / 3), 3000);
    })`);
    check(strips === 4, `four bands, each with its scene (${strips})`);
    check(frames > 6 && frames <= 14, `and the page draws about twelve frames a second for all four together (${frames.toFixed(1)})`);
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
