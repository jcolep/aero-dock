// The menu bar's lens and the gliding highlight, pressed: the glass draws in a little where it is, and lets go when
// the press does, wherever the pointer is let go (it flew off toward the bar's left end, further the further right
// the item was, and stayed there until something else was clicked).
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/lenspress.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const h = await startHarness({ out, window: "menubar", viewport: [1600, 700], settings: (s) => { s.menuBar.enabled = true; } });
try {
  await h.open(".menubar");
  await h.sleep(600);
  const lens = () => h.eval("(() => { const r = document.querySelector('.mb-lens').getBoundingClientRect(); return { cx: r.left + r.width / 2, w: r.width }; })()");
  // the right-most items, where it showed most
  const items = await h.eval("[...document.querySelectorAll('.mb-item')].map((e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, title: e.title || e.textContent.trim().slice(0, 12) }; }).filter((i) => i.x > 900)");
  for (const it of items.slice(-3)) {
    await h.move(it.x, it.y);
    await h.sleep(700);
    const before = await lens();
    await h.down(it.x, it.y);
    await h.sleep(250);
    const held = await lens();
    check(Math.abs(held.cx - it.x) < 2 && held.w < before.w, `${it.title}: pressed, the lens draws in where it is (${held.cx.toFixed(1)} for ${it.x.toFixed(1)}, ${before.w.toFixed(1)} -> ${held.w.toFixed(1)} wide)`);
    // let go somewhere else (a menu opened under the pointer, say)
    await h.up(it.x, it.y + 200);
    await h.sleep(400);
    const after = await lens();
    check(Math.abs(after.w - before.w) < 1.5, `${it.title}: let go anywhere, it lets go too (${before.w.toFixed(1)} -> ${after.w.toFixed(1)} wide)`);
    await h.eval("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))");
    await h.sleep(300);
  }
  check((await h.errors()).length === 0, "no errors in the page");
} finally {
  h.close();
}

// the hover effect: a dropdown's row swells a little under the pointer (magnify, the default), and does nothing at none
for (const fx of ["magnify", "none"]) {
  const m = await startHarness({ out, window: "menubar", viewport: [1600, 700], settings: (s) => { s.menuBar.enabled = true; s.appearance.hoverEffect = fx; } });
  try {
    await m.open(".menubar");
    await m.sleep(600);
    const apple = await m.rect('[data-menu="apple"]');
    await m.click(apple.x, apple.y);
    await m.sleep(900);
    const row = await m.rect(".mb-menu-item");
    await m.move(row.x, row.y);
    await m.sleep(600);
    const scale = await m.eval("(() => { const t = getComputedStyle(document.querySelector('.mb-menu-item:hover')).transform; const k = t.match(/matrix\\(([^,]+)/); return k ? +k[1] : 1; })()");
    if (fx === "magnify") check(scale > 1.02 && scale < 1.05, `hover effect magnify: the row under the pointer swells (${scale.toFixed(3)})`);
    else check(Math.abs(scale - 1) < 0.001, `hover effect none: it stays as it is (${scale.toFixed(3)})`);
  } finally {
    m.close();
  }
}
process.exit(failed ? 1 : 0);
