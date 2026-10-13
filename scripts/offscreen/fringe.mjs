// The frame's corner pieces, off screen: nothing is drawn until Rust says where the window on top is; then each
// corner is drawn in the colour Rust read off the screen beside it (sent while the page runs, or asked for if it
// was sent before the page started), edged by the curve of that window's own corners, so a window that stands a few
// pixels off the opening has its corners covered where they are.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/fringe.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

const colours = ["#c04040", "#40c040", "#4040c0", "#c0c040"];
const paint = (rect, c = colours) => ({ colours: c, rect, radius: 22 });
const settings = (s) => {
  s.frame.enabled = true;
  s.frame.padding = 28;
  s.frame.cornerRadius = 22;
  s.frame.glassBorder = true;
  s.frame.borderWidth = 2;
};
const fills = (h) => h.eval("[...document.querySelectorAll('svg.frame-body > g > path')].map((p) => p.getAttribute('fill') || 'none')");

{
  const h = await startHarness({ out, window: "framecorners", viewport: [900, 560], settings });
  const shots = {};
  try {
    await h.open(".frame-corners, body");
    await h.desktop("#7f93b5");
    await h.sleep(400);
    check((await fills(h)).length === 0, "before Rust has said anything nothing is drawn");
    // the opening: 28px in
    await h.eval(`window.__emit("frame://corners", ${JSON.stringify(paint({ x: 28, y: 28, width: 844, height: 504 }))})`);
    await h.sleep(300);
    const got = await fills(h);
    check(JSON.stringify(got) === JSON.stringify(colours), `then each corner has its own colour (${got.join(" ")})`);
    check((await h.eval("document.querySelectorAll('svg.frame-body .frame-bevel').length")) === 4, "with the glass border on, each piece carries it round its curve");
    shots["on the opening, top left"] = await h.shot(0, 0, 90, 90, 4);
    shots["on the opening, bottom right"] = await h.shot(810, 470, 90, 90, 4);
    // a window eight pixels higher than the opening: its corners are where it is
    await h.eval(`window.__emit("frame://corners", ${JSON.stringify(paint({ x: 28, y: 20, width: 844, height: 512 }))})`);
    await h.sleep(300);
    const box = await h.eval("[...document.querySelectorAll('clipPath rect')].map((r) => [+r.getAttribute('x'), +r.getAttribute('y')])");
    check(box[0][1] === 20 && box[1][1] === 20, `a window that stands higher has its top corners where it is (${JSON.stringify(box.slice(0, 2))})`);
    shots["eight pixels higher, top left"] = await h.shot(0, 0, 90, 90, 4);
    await h.eval(`window.__emit("frame://corners", ${JSON.stringify(paint({ x: 28, y: 28, width: 844, height: 504 }, ["#101010", "#202020", "#303030", "#404040"]))})`);
    await h.sleep(300);
    const again = await fills(h);
    check(again[0] === "#101010", `and the colours follow when they change (${again.join(" ")})`);
    console.log("sheet:", await h.sheet(shots, "fringe"));
  } finally {
    h.close();
  }
}

// asked for at the start, because it was sent before the page was there
{
  const h = await startHarness({ out, window: "framecorners", viewport: [900, 560], settings });
  try {
    await h.open("body");
    await h.sleep(800);
    const asked = await h.eval("window.__calls.filter((c) => c.cmd === 'frame_corner_colours').map((c) => c.args.label)");
    check(asked.length > 0 && asked[0] === "framecorners", `it asks for what was sent before it started (${JSON.stringify(asked)})`);
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
