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
process.exit(failed ? 1 : 0);
