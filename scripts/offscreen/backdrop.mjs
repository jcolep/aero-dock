// The frosted backdrop, off screen: a picture of the desktop (red to yellow to blue, left to right, made by the
// mock) is laid under the dock bar and the Start panel, under their tint, clipped by their own rounded corners,
// and stays put under the bar as the bar moves.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/backdrop.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

// ---- the dock ----
{
  const h = await startHarness({
    out,
    window: "dock",
    viewport: [1400, 500],
    running: [],
    settings: (s) => {
      s.appearance.realBlur = true;
      s.appearance.frost.dock = { blur: 55, grain: 0.8 };
      s.pinned = [
        { id: "a", kind: "app", path: "C:\\Windows\\notepad.exe", name: "Notes", icon: null, children: [] },
        { id: "b", kind: "app", path: "C:\\Tools\\idle.exe", name: "Idle", icon: null, children: [] },
      ];
    },
  });
  try {
    await h.open(".dock-icon");
    await h.desktop("#c8d0e0");
    await h.sleep(1500);
    const q = (js) => h.eval(`(() => ${js})()`);
    check((await q("document.querySelector('.dock-bar').dataset.bd")) === "on", "the bar has a picture under it");
    check((await q("!!document.querySelector('.dock-bar > .bd-layer')")) === true, "and a layer for it");
    const calls = await q("window.__calls.filter((c) => c.cmd === 'capture_backdrop').length");
    check(calls >= 2, `it looks again every so often (${calls} looks)`);
    // two pictures, the newer fading in over the older: look at the opacities some way into a fade
    await h.sleep(300);
    const fades = [];
    for (let i = 0; i < 14; i++) {
      fades.push(await q("[...document.querySelectorAll('.dock-bar > .bd-layer > .bd-img')].map((e) => +getComputedStyle(e).opacity.toString().slice(0, 4))"));
      await h.sleep(100);
    }
    const seen = new Set(fades.flat().map((v) => v.toFixed(1)));
    check(seen.has("0.0") && seen.has("1.0") && [...seen].some((v) => v !== "0.0" && v !== "1.0"), `a picture fades in over the last, not all at once (opacities seen: ${[...seen].sort().join(" ")})`);
    const asked0 = await q("window.__calls.filter((c) => c.cmd === 'capture_backdrop')[0].args.request");
    check(asked0.blur === 55, `the blur asked for is the dock's own setting (${asked0.blur})`);
    check((await q("getComputedStyle(document.querySelector('.dock-bar > .bd-layer')).getPropertyValue('--bd-grain')")) === "0.8", "and the grain is its own");
    const pose = await q("(() => { const l = document.querySelector('.dock-bar > .bd-layer'); const s = l.style; return { x: s.getPropertyValue('--bd-x'), y: s.getPropertyValue('--bd-y'), w: s.getPropertyValue('--bd-w'), h: s.getPropertyValue('--bd-h') }; })()");
    console.log("picture's place under the bar:", JSON.stringify(pose));
    const bar = await q("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { left: b.left, top: b.top, width: b.width, height: b.height }; })()");
    // where the picture's left edge is, in the page: the bar's left plus its offset (and the layer sits one pixel in for the border)
    const asked = await q("(() => { const c = window.__calls.filter((c) => c.cmd === 'capture_backdrop').pop().args.request; return { x: c.x, width: c.width }; })()");
    check(Math.abs(asked.x - (bar.left - 56)) < 3 && Math.abs(asked.width - (bar.width + 112)) < 4, `it is of the bar and a margin: asked for x ${asked.x.toFixed(1)}, ${asked.width.toFixed(1)} wide for a bar at ${bar.left.toFixed(1)}, ${bar.width.toFixed(1)} wide`);
    const shot = await h.shot(Math.max(0, bar.left - 80), bar.top - 40, bar.width + 160, bar.height + 80, 2);
    console.log("sheet:", await h.sheet({ dock: shot }, "backdrop-dock"));
  } finally {
    h.close();
  }
}

// ---- Start ----
{
  const h = await startHarness({
    out,
    window: "start",
    viewport: [900, 900],
    settings: (s) => {
      s.appearance.realBlur = true;
    },
  });
  try {
    await h.open(".st-root");
    await h.desktop("#c8d0e0");
    await h.eval(`window.__emit("start://open", { previous: 4242 })`);
    await h.sleep(1500);
    const q = (js) => h.eval(`(() => ${js})()`);
    check((await q("document.querySelector('.st-panel').dataset.bd")) === "on", "the Start panel has a picture under it");
    const before = await q("window.__calls.filter((c) => c.cmd === 'capture_backdrop').length");
    await h.sleep(3000);
    const after = await q("window.__calls.filter((c) => c.cmd === 'capture_backdrop').length");
    check(before === after, `and holds it: ${before} looks, ${after} three seconds later`);
    check(before <= 3, `after no more than a couple of looks (${before})`);
    const shot = await h.shot(0, 0, 900, 900, 1);
    console.log("sheet:", await h.sheet({ start: shot }, "backdrop-start"));
  } finally {
    h.close();
  }
}
// ---- the menu bar ----
{
  const h = await startHarness({
    out,
    window: "menubar",
    viewport: [1200, 400],
    settings: (s) => {
      s.appearance.realBlur = true;
      s.menuBar.enabled = true;
      s.appearance.frost.menuBar = { blur: 12, grain: 0.2 };
    },
  });
  try {
    await h.open(".menubar");
    await h.desktop("#c8d0e0");
    await h.sleep(1500);
    const q = (js) => h.eval(`(() => ${js})()`);
    check((await q("document.querySelector('.menubar').dataset.bd")) === "on", "the menu bar has a picture under it");
    const asked = await q("window.__calls.filter((c) => c.cmd === 'capture_backdrop')[0].args.request");
    check(asked.blur === 12, `with its own blur (${asked.blur})`);
    console.log("sheet:", await h.sheet({ menubar: await h.shot(0, 0, 1200, 120, 1) }, "backdrop-menubar"));
  } finally {
    h.close();
  }
}

// ---- and with the frosted glass off nothing is asked, anywhere ----
for (const [window, ready, extra] of [["dock", ".dock-icon", ""], ["start", ".st-root", "start"], ["menubar", ".menubar", ""]]) {
  const h = await startHarness({
    out,
    window,
    viewport: [1200, 600],
    running: [],
    settings: (s) => {
      s.appearance.realBlur = false;
      s.menuBar.enabled = true;
    },
  });
  try {
    await h.open(ready);
    if (extra === "start") await h.eval(`window.__emit("start://open", { previous: 4242 })`);
    await h.sleep(2500);
    const asks = await h.eval("window.__calls.filter((c) => c.cmd === 'capture_backdrop').length");
    const on = await h.eval("document.querySelectorAll('[data-bd]').length");
    check(asks === 0 && on === 0, `${window}: with the frosted glass off nothing is asked for (${asks} asks, ${on} glasses with a picture)`);
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
