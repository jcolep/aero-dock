// Snapping the desktop widgets, off screen: moved onto a grid; pulled to the edges of another widget (with a guide drawn)
// and the screen's, held back from them by the margin; Alt doing the opposite for one move; resizing landing the corner on
// the grid; the grid drawn only while one is held; and nothing snapping when it is off.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/widgetsnap.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const base = { opacity: 0.95, surface: "liquid", accent: null, ambient: false, locked: false, options: { seconds: false, twentyFourHour: false, analog: false, latitude: null, longitude: null, place: null, celsius: true, extra: {} } };
const widgets = [
  { ...base, id: "a", kind: "clock", x: 100, y: 100, width: 200, height: 160 },
  { ...base, id: "b", kind: "dateTile", x: 700, y: 500, width: 200, height: 160 },
];

async function scenario(name, snap, body) {
  const h = await startHarness({
    out,
    window: "widgets",
    viewport: [1400, 900],
    settings: (s) => {
      s.widgets.enabled = true;
      s.widgets.widgets = JSON.parse(JSON.stringify(widgets));
      Object.assign(s.widgets, snap);
    },
  });
  try {
    await h.open(".aero-widget");
    await h.desktop("#35597d");
    await h.sleep(700);
    const placed = async () => (await h.eval("window.__calls.filter((c) => c.cmd === 'place_widget').map((c) => c.args)")).at(-1);
    // press the widget at (fx, fy) of its own box and carry it by (dx, dy) in steps; `alt` holds Alt
    const drag = async (id, fx, fy, dx, dy, { alt = false, during } = {}) => {
      const box = await h.eval(`(() => { const e = [...document.querySelectorAll('.aero-widget')][${id === "a" ? 0 : 1}]; const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()`);
      const px = box.x + fx;
      const py = box.y + fy;
      await h.move(px, py);
      await h.sleep(80);
      await h.send("Input.dispatchMouseEvent", { type: "mousePressed", x: px, y: py, button: "left", buttons: 1, clickCount: 1, modifiers: alt ? 1 : 0 });
      for (let i = 1; i <= 8; i++) {
        await h.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: px + (dx * i) / 8, y: py + (dy * i) / 8, button: "left", buttons: 1, modifiers: alt ? 1 : 0 });
        await h.sleep(30);
      }
      await h.sleep(120);
      const mid = during ? await during() : null;
      await h.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: px + dx, y: py + dy, button: "left", buttons: 0, clickCount: 1, modifiers: alt ? 1 : 0 });
      await h.sleep(250);
      return mid;
    };
    await body({ h, drag, placed });
    check((await h.errors()).length === 0, `${name}: no errors in the page`);
  } finally {
    h.close();
  }
}

// ---- the grid (alone) ----
await scenario("grid", { snapEnabled: true, snapGrid: true, snapSize: 40, snapAlign: false, snapResize: true, snapShowGrid: true }, async ({ h, drag, placed }) => {
  const mid = await drag("a", 60, 60, 53, 27, { during: async () => ({ grid: await h.eval("!!document.querySelector('.aero-grid')") }) });
  const p = await placed();
  check(p.x % 40 === 0 && p.y % 40 === 0 && p.x === 160 && p.y === 120, `moved by 53, 27: its corner is on the grid (${p.x}, ${p.y})`);
  check(mid.grid, "the grid is drawn while it is held");
  check(!(await h.eval("!!document.querySelector('.aero-grid')")), "and gone when it is let go");
  // Alt: free for this one move
  await drag("a", 60, 60, 53, 27, { alt: true });
  const q = await placed();
  check(q.x % 40 !== 0 || q.y % 40 !== 0, `Alt held: it goes where it is put, not to the grid (${q.x}, ${q.y})`);
  // resizing: the bottom right corner on the grid
  await h.move(q.x + 60, q.y + 60);
  await h.sleep(150);
  const handle = await h.eval("(() => { const r = document.querySelector('.aero-widget-resize').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()");
  await h.send("Input.dispatchMouseEvent", { type: "mousePressed", x: handle.x, y: handle.y, button: "left", buttons: 1, clickCount: 1 });
  for (let i = 1; i <= 6; i++) {
    await h.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: handle.x + 37 * (i / 6), y: handle.y + 21 * (i / 6), button: "left", buttons: 1 });
    await h.sleep(30);
  }
  await h.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: handle.x + 37, y: handle.y + 21, button: "left", buttons: 0, clickCount: 1 });
  await h.sleep(250);
  const r = await placed();
  check((r.x + r.width) % 40 === 0 && (r.y + r.height) % 40 === 0, `resized: its bottom right corner is on the grid (${r.x + r.width}, ${r.y + r.height})`);
});

// ---- aligning to another widget and to the screen's edge ----
await scenario("align", { snapEnabled: true, snapGrid: false, snapAlign: true, snapThreshold: 10, snapMargin: 20, snapResize: true, snapShowGrid: true }, async ({ h, drag, placed }) => {
  // b's left edge, 6px short of a's right edge (300): it lands on 300, and a guide is drawn there
  const mid = await drag("b", 20, 20, 300 - 6 - 700 + 20 - 20, 0, { during: async () => ({ v: await h.eval("[...document.querySelectorAll('.aero-guide-v')].map((e) => Math.round(parseFloat(e.style.left)))") }) });
  const p = await placed();
  check(p.x === 300, `six pixels from another widget's edge: it lines up (x ${p.x})`);
  check(mid.v.includes(300), `and a guide is drawn on the line (${JSON.stringify(mid.v)})`);
  // far from everything: free
  await drag("b", 20, 20, 130, 55);
  const far = await placed();
  check(far.x !== 300 && far.x % 40 !== 0 || far.y % 7 !== 0, `away from every edge it moves freely (${far.x}, ${far.y})`);
  // near the screen's left edge: held back by the margin (20)
  await drag("a", 20, 20, -90, 0);
  const edge = await placed();
  check(edge.x === 20, `near the screen's edge: it settles ${edge.x}px in, the margin (20)`);
});

// ---- off: nothing snaps ----
await scenario("off", { snapEnabled: false, snapGrid: true, snapSize: 40, snapAlign: true }, async ({ drag, placed, h }) => {
  const mid = await drag("a", 60, 60, 53, 27, { during: async () => ({ grid: await h.eval("!!document.querySelector('.aero-grid')") }) });
  const p = await placed();
  check(p.x === 153 && p.y === 127, `snapping off: it goes exactly where it is put (${p.x}, ${p.y})`);
  check(!mid.grid, "and no grid is drawn");
  // Alt turns it on for one move
  await drag("a", 60, 60, 53, 27, { alt: true });
  const q = await placed();
  check(q.x % 40 === 0 && q.y % 40 === 0, `Alt held: it snaps for this move (${q.x}, ${q.y})`);
});
process.exit(failed ? 1 : 0);
