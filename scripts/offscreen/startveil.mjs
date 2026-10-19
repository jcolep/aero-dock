// The Start menu's lens over a light backdrop, off screen: with the readability veil on (Rust says what is behind is
// bright), the lens should look like the same glass it is over a dark backdrop, not a dark slab. Measures how much
// darker the lens is than the panel beside it, with and without the veil, and writes startveil.png.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/startveil.mjs <out folder> [settings.json]

import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const real = process.argv[3] ? JSON.parse(readFileSync(process.argv[3], "utf8")) : null;
const merge = (into, from) => {
  for (const [k, v] of Object.entries(from)) {
    if (v && typeof v === "object" && !Array.isArray(v) && into[k] && typeof into[k] === "object") merge(into[k], v);
    else into[k] = v;
  }
};
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

// mean lightness of an RGBA png (8-bit, no interlace), enough for a screenshot from Chrome
function meanLight(b64) {
  const buf = Buffer.from(b64, "base64");
  let pos = 8;
  let w = 0, h = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); }
    if (type === "IDAT") idat.push(data);
    pos += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const bpp = 4, stride = w * bpp;
  const px = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const a = raw[y * (stride + 1) + 1 + x];
      const left = x >= bpp ? px[y * stride + x - bpp] : 0;
      const up = y > 0 ? px[(y - 1) * stride + x] : 0;
      const ul = x >= bpp && y > 0 ? px[(y - 1) * stride + x - bpp] : 0;
      let v = a;
      if (f === 1) v = a + left;
      else if (f === 2) v = a + up;
      else if (f === 3) v = a + ((left + up) >> 1);
      else if (f === 4) { const p = left + up - ul; const pa = Math.abs(p - left), pb = Math.abs(p - up), pc = Math.abs(p - ul); v = a + (pa <= pb && pa <= pc ? left : pb <= pc ? up : ul); }
      px[y * stride + x] = v & 255;
    }
  }
  let sum = 0;
  for (let i = 0; i < px.length; i += 4) sum += 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
  return sum / (px.length / 4);
}

const shots = {};
const h = await startHarness({ out, window: "start", viewport: [900, 900], settings: (s) => real && merge(s, real) });
try {
  await h.open(".st-root");
  await h.desktop("#e8eaee"); // a light window behind, as DriveWorks was
  await h.sleep(500);
  const light = Array.from({ length: 8 * 8 }, () => 0.93);
  const q = (js) => h.eval(`(() => ${js})()`);
  async function measure(label, css) {
    await q(`(() => { let s = document.getElementById('__try'); if (!s) { s = document.createElement('style'); s.id = '__try'; document.head.appendChild(s); } s.textContent = ${JSON.stringify(css ?? "")}; })()`);
    await h.eval(`window.__emit("start://open", { previous: 4242, backdrop: { cols: 8, rows: 8, light: ${JSON.stringify(light)} } })`);
    await h.sleep(900);
    const tile = await q("(() => { const r = document.querySelectorAll('.st-tile')[1].getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()");
    await h.move(tile.x + tile.w / 2, tile.y + tile.h / 2);
    await h.sleep(700);
    // a strip of the lens's own glass (above the icon) and of the panel just beside the lens, at the same height
    const lensRect = await q("(() => { const r = document.querySelector('.glide-highlight').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()");
    // the lens's body at its middle height, left of the tile's icon and text, and the panel the same distance right of it
    const midY = lensRect.y + lensRect.h * 0.35;
    const inLens = meanLight(await h.shot(lensRect.x + 6, midY, 10, 8));
    const beside = meanLight(await h.shot(lensRect.x + lensRect.w + 8, midY, 10, 8));
    const veiled = await q("!!document.querySelector('.st-veil')");
    console.log(`${label}: veil ${veiled}, lens glass ${inLens.toFixed(0)} vs panel beside ${beside.toFixed(0)} (ratio ${(inLens / beside).toFixed(2)})`);
    const panel = await q("(() => { const r = document.querySelector('.st-panel').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; })()");
    shots[label] = await h.shot(panel.x, panel.y, panel.w, 280);
    await h.move(5, 5);
    await h.eval(`window.__emit("start://outside")`);
    await h.sleep(800);
    return inLens / beside;
  }
  const base = await measure("light behind");
  if (process.argv[4]) await measure("tried", process.argv[4]);
  check(base > 0.85, "over a light backdrop the lens is no darker than the panel beside it");
  // and over a dark one (the Samsung's case), for comparison
  await h.desktop("#141a26");
  light.fill(0.08);
  await measure("dark behind");
  await h.sheet(shots, "startveil", 400);
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
