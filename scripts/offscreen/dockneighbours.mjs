// The icons a carried icon is dragged past, off screen: each slides to its new place over several frames instead of
// jumping a whole slot at once, wherever it is: pinned or running, either side of the divider, either direction.
// (Motion's layout animation glided the pinned apps and never the unpinned running ones, which jumped.)
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/dockneighbours.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const win = (hwnd, title, exe) => ({ hwnd, title, exe, pid: hwnd, aumid: null, monitor: "" });
const cases = [
  ["Paint", "Untitled - Notepad", -1],
  ["Untitled - Notepad", "Paint", 1],
  ["Calc", "Paint", -1],
  ["Paint", "Calc", 1],
  ["Mail", "Edge", -1],
  ["Edge", "Mail", 1],
  // across the divider: the neighbour is the one passed, on the far side
  ["Mail", "Untitled - Notepad", 1],
];
for (const [drag, watch, dir] of cases) {
  const h = await startHarness({
    out,
    window: "dock",
    viewport: [1100, 420],
    running: [win(1, "Untitled - Notepad", "C:\\Windows\\notepad.exe"), win(3, "Paint", "C:\\apps\\Paint.exe"), win(4, "Calc", "C:\\apps\\Calc.exe")],
    settings: (s) => {
      s.dock.autoHide = false;
      s.dock.magnification = false;
      s.dock.showSearchButton = false;
      s.onboardingComplete = true;
      s.pinned = ["Edge", "Mail"].map((name) => ({ id: `pin-${name}`, kind: "app", path: `C:\\apps\\${name}.exe`, name, icon: null, children: [] }));
    },
  });
  try {
    await h.open(".dock-icon");
    await h.sleep(1500);
    const nm = "(e) => e.getAttribute('aria-label').split(',')[0]";
    const find = (n) => `[...document.querySelectorAll('button.dock-icon')].find((e) => (${nm})(e).includes(${JSON.stringify(n)}))`;
    const from = await h.eval(`(() => { const b = ${find(drag)}; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    await h.down(from.x, from.y);
    await h.held(from.x + dir * 14, from.y);
    await h.sleep(150);
    await h.eval(`(() => { window.__w = ${find(watch)}; return 1; })()`);
    await h.record("w", "Math.round(window.__w.getBoundingClientRect().left * 10) / 10");
    for (let i = 2; i <= 24; i++) {
      await h.held(from.x + dir * i * 9, from.y);
      await h.sleep(16);
    }
    await h.sleep(500);
    const film = (await h.recorded("w")).map((s) => s.v);
    const steps = film.map((v, i) => (i ? +(v - film[i - 1]).toFixed(1) : 0)).filter((d) => d !== 0);
    const big = Math.max(0, ...steps.map(Math.abs));
    const moved = steps.reduce((a, b) => a + b, 0);
    // it moved a slot or more, and no frame moved it more than a quarter of that... a slot is 54px
    const good = Math.abs(moved) >= 50 && big <= 25 && steps.length > 4;
    if (!good) failed = true;
    console.log(`${good ? "ok  " : "FAIL"} drag ${drag} ${dir > 0 ? "right" : "left"}, watching ${watch}: moved ${moved.toFixed(0)}px over ${steps.length} frames, largest step ${big}px (a slot is 54)`);
    await h.up(from.x + dir * 216, from.y);
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
