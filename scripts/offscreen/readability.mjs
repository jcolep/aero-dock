// The Start menu's text over a light backdrop, off screen: told as it opens how light it is behind it, region by region
// (as start.rs measures it), the panel darkens its glass where it is light and nowhere else, gives its text a soft
// shadow, and holds that still for as long as it is open. Over a dark backdrop, or with the switch off, nothing changes.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/readability.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const COLS = 6;
const ROWS = 6;
// light on the right half (a white window behind it), dark on the left
const halves = Array.from({ length: COLS * ROWS }, (_, i) => (i % COLS >= COLS / 2 ? 0.97 : 0.12));
const dark = Array.from({ length: COLS * ROWS }, () => 0.15);
const open = (h, light) => h.eval(`window.__emit("start://open", { previous: 4242, backdrop: ${light ? JSON.stringify({ cols: COLS, rows: ROWS, light }) : "null"} })`);
// the veil, read back: how dark it is over the left and right halves of the panel
const veil = (h) =>
  h.eval(`new Promise((done) => { const v = document.querySelector('.st-veil'); if (!v) return done(null); const url = getComputedStyle(v).backgroundImage.slice(5, -2); const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; let l = 0, r = 0; for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const a = d[(y * c.width + x) * 4 + 3] / 255; if (x < c.width / 2) l = Math.max(l, a); else r = Math.max(r, a); } done({ left: l, right: r, url: url.length, shadow: getComputedStyle(document.querySelector('.st-panel')).textShadow }); }; img.src = url; })`);

const shots = {};
for (const adaptive of [true, false]) {
  const h = await startHarness({ out, window: "start", viewport: [900, 900], settings: (s) => { s.start.adaptiveTint = adaptive; s.appearance.dockSurface = "liquid"; } });
  try {
    await h.open(".st-root");
    // a white page behind the right of the panel, a dark wallpaper behind the left
    await h.desktop("linear-gradient(90deg, #1b2440 0 50%, #ffffff 50% 100%)");
    await open(h, halves);
    await h.sleep(900);
    const v = await veil(h);
    if (adaptive) {
      check(v && v.right > 0.45 && v.left < 0.02, `over a light half the glass is darkened there and not elsewhere (${JSON.stringify(v && { left: +v.left.toFixed(2), right: +v.right.toFixed(2) })})`);
      check(v && v.shadow !== "none", `and the text has a soft shadow (${v?.shadow})`);
      shots["light behind the right half: darkened there"] = await h.shot(0, 0, 900, 900);
      // held still while open: the same veil a second later
      const before = await h.eval("getComputedStyle(document.querySelector('.st-veil')).backgroundImage.length + ':' + document.querySelector('.st-veil').isConnected");
      await h.record("veil", "(() => { const v = document.querySelector('.st-veil'); return v ? getComputedStyle(v).backgroundImage.length : 0; })()");
      await h.sleep(1200);
      const frames = (await h.recorded("veil")).map((f) => f.v);
      check(frames.length > 10 && frames.every((f) => f === frames[0]), `it does not change while the menu is open (${frames.length} frames, ${new Set(frames).size} looks; ${before})`);
      // the next opening, over dark: no veil, no shadow
      await h.eval(`window.__emit("start://outside", null)`);
      await h.sleep(900);
      await open(h, dark);
      await h.sleep(900);
      const d = await veil(h);
      const shadow = await h.eval("getComputedStyle(document.querySelector('.st-panel')).textShadow");
      check(d === null && shadow === "none", `opened over a dark backdrop, nothing is added (${JSON.stringify(d)}, ${shadow})`);
      // and when nothing could be looked at, nothing is guessed
      await h.eval(`window.__emit("start://outside", null)`);
      await h.sleep(900);
      await open(h, null);
      await h.sleep(600);
      check((await veil(h)) === null, "with no look at what is behind, nothing is added");
    } else {
      check(v === null, "with the switch off, nothing is added however light it is behind");
      shots["the same, switch off"] = await h.shot(0, 0, 900, 900);
    }
    check((await h.errors()).length === 0, `${adaptive ? "on" : "off"}: no errors in the page`);
  } finally {
    h.close();
  }
}
{
  const h = await startHarness({ out, window: "start", viewport: [900, 900] });
  try {
    console.log("sheet:", await h.sheet(shots, "readability", 960));
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
