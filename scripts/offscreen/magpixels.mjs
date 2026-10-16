// Dock magnification, as painted: the pointer stepped half a pixel at a time beyond the dock's last icon (where it
// moves the most), the icon left to settle each time, and where its pixels are found in a screenshot compared with
// where it is meant to be. Painted by layout it lands on whole pixels and steps; by translate it follows to the
// fraction. The icons are drawn as plain squares of one blue, so their pixels are easy to find.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/magpixels.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const pins = ["Notes", "Mail", "Maps", "Music", "Photos"].map((name, i) => ({
  id: `p${i}`, kind: "app", path: `C:\\Tools\\${name}.exe`, name, icon: null, children: [],
}));
const h = await startHarness({
  out, window: "dock", viewport: [1000, 500], running: [],
  settings: (s) => {
    s.dock.autoHide = false;
    s.dock.magnification = true;
    s.dock.magnificationScale = 1.8;
    // the clock off, the status icons on: the room between the last icon and them is where it showed most
    s.dock.showClock = false;
    s.dock.showSystemStatus = true;
    if (s.menuBar) s.menuBar.enabled = false;
    s.pinned = pins;
  },
});
try {
  await h.open(".dock-icon");
  await h.desktop("#ffffff");
  await h.sleep(800);
  const last = await h.eval("(() => { const r = [...document.querySelectorAll('.dock-icon')].pop().getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; })()");
  const rows = [];
  for (let i = 0; i < 24; i++) {
    const px = last.x + last.w * 0.55 + i * 0.5;
    await h.move(px, last.y);
    await h.sleep(450);
    const meant = await h.eval("(() => { const r = [...document.querySelectorAll('.dock-icon-mag')].pop().getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height }; })()");
    const x0 = Math.floor(meant.l) - 6;
    const y0 = Math.floor(meant.t + meant.h * 0.12);
    const png = await h.shot(x0, y0, Math.ceil(meant.w) + 12, 4, 1);
    // the middle of the icon's pixels, weighed by how blue each is (its edges are partly covered)
    const found = await h.eval(`new Promise((done) => { const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; let sum = 0, wt = 0; for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const k = (y * c.width + x) * 4; const blue = Math.max(0, Math.min(1, (d[k + 2] - d[k]) / 120)); sum += blue * (x + 0.5); wt += blue; } done(wt ? sum / wt : -1); }; img.src = 'data:image/png;base64,${png}'; })`);
    rows.push({ meant: meant.l + meant.w / 2 - x0, found });
  }
  const errs = rows.map((r) => r.found - r.meant);
  const steps = rows.slice(1).map((r, i) => ({ meant: r.meant - rows[i].meant, found: r.found - rows[i].found }));
  console.log("     meant vs found:", rows.map((r) => `${r.meant.toFixed(2)}/${r.found.toFixed(2)}`).join(" "));
  const spread = Math.max(...errs) - Math.min(...errs);
  check(spread < 0.35, `the last icon is painted where it is meant to be, to the fraction (error varies by ${spread.toFixed(2)}px)`);
  const jumps = steps.filter((s) => Math.abs(s.found - s.meant) > 0.3).length;
  check(jumps === 0, `and it moves as smoothly as it is meant to (${jumps} of ${steps.length} steps jumped)`);
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
