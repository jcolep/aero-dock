// Crisp edges: at 125% and 150% the rim of a surface is one device pixel across, bright and sharp, not smeared over two
// (what a 1px hairline becomes at a scale that is not whole), and a nested shape is round by its container's radius less
// the room between them.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/crisp.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

for (const scale of [1, 1.25, 1.5]) {
  const h = await startHarness({ out, window: "start", viewport: [900, 900], scale, settings: () => {} });
  try {
    await h.open(".st-root");
    await h.eval(`window.__emit("start://open", { previous: 4242 })`);
    await h.sleep(1200);
    // a dark, flat backdrop, so that the rim is the only bright thing at the edge
    await h.desktop("#05070d");
    await h.sleep(200);
    const hair = await h.eval(`(() => { const p = document.createElement('div'); p.style.cssText = 'position:absolute;width:var(--hair)'; document.body.appendChild(p); const w = getComputedStyle(p).width; p.remove(); return w; })()`);
    const dpr = await h.eval(`window.devicePixelRatio`);
    // the left edge of the panel, as the device draws it: a row of pixels across it
    const edge = await h.eval(`(() => { const r = document.querySelector('.st-panel').getBoundingClientRect(); return { x: r.left, y: r.top + r.height / 2 }; })()`);
    const shot = (await h.send("Page.captureScreenshot", { format: "png", clip: { x: edge.x - 8, y: edge.y, width: 16, height: 1, scale: dpr } })).result.data;
    const row = await h.eval(`new Promise((done) => { const img = new Image(); img.onload = () => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, img.width, 1).data; const out = []; for (let i = 0; i < img.width; i++) out.push(Math.round(0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2])); done(out); }; img.src = 'data:image/png;base64,${shot}'; })`);
    const peak = Math.max(...row);
    const bright = row.filter((v) => v > peak * 0.5).length;
    console.log(`scale ${scale}: --hair ${hair}, a device pixel is ${(1 / dpr).toFixed(3)} css px; across the edge:`, JSON.stringify(row));
    check(Math.abs(parseFloat(hair) - 1 / dpr) < 0.02, `a hairline is one device pixel (${hair})`);
    check(peak > 150 && bright <= 2, `and the rim is sharp: ${bright} bright pixel(s) across, peak ${peak}`);
  } finally {
    h.close();
  }
}

// nested corners: an item in a panel is round by the panel's radius less its padding, for each pair there is
const h = await startHarness({ out, window: "start", viewport: [900, 900], settings: () => {} });
try {
  await h.open(".st-root");
  await h.eval(`window.__emit("start://open", { previous: 4242 })`);
  await h.sleep(800);
  await h.eval(`document.querySelector('.st-user').click()`);
  await h.sleep(500);
  const pair = await h.eval(`(() => { const o = document.querySelector('.st-pop'); const i = o && o.querySelector('button'); if (!o || !i) return null; const r = (e) => parseFloat(getComputedStyle(e).borderTopLeftRadius); return { outer: r(o), pad: parseFloat(getComputedStyle(o).paddingTop), inner: r(i) }; })()`);
  console.log("the account menu:", JSON.stringify(pair));
  check(pair && Math.abs(pair.inner - (pair.outer - pair.pad)) < 0.6, "its items are round by its radius less its padding");
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);