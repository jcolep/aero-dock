// The menu bar's clock, off screen: with the seconds on, every character (digit or not) sits in a cell of the same
// height at the same height, the cell is a whole number of device pixels, every digit's column comes to rest at a
// whole number of device pixels, and the clock is centred in the bar. Looked at over several seconds, at 100% and
// at 150%, because it is the digit that has just turned over that used to be out of line.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/clock.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

for (const scale of [1, 1.5, 2]) {
  const h = await startHarness({
    out,
    window: "menubar",
    viewport: [1200, 200],
    scale,
    settings: (s) => {
      s.menuBar.enabled = true;
      s.menuBar.showSeconds = true;
      s.menuBar.ambient = false;
    },
  });
  try {
    await h.open(".menubar");
    await h.desktop("#7f93b5");
    const worst = { cells: 0, rest: 0, centre: 0, steady: true };
    for (let i = 0; i < 6; i++) {
      await h.sleep(i === 0 ? 700 : 1000);
      const m = await h.eval(`(() => {
        const dpr = window.devicePixelRatio;
        const roll = document.querySelector('.mb-clock .roll');
        const cells = [...roll.children].map((c) => c.getBoundingClientRect());
        const tops = cells.map((r) => r.top), heights = cells.map((r) => r.height);
        const cols = [...roll.querySelectorAll('.roll-col')].map((c) => {
          const t = getComputedStyle(c).transform;
          const ty = t === 'none' ? 0 : new DOMMatrix(t).m42;
          return ty * dpr;
        });
        const bar = document.querySelector('.menubar').getBoundingClientRect();
        const r = roll.getBoundingClientRect();
        const item = document.querySelector('.mb-clock').getBoundingClientRect();
        return {
          spread: Math.max(...tops) - Math.min(...tops),
          heightSpread: Math.max(...heights) - Math.min(...heights),
          cellDevice: heights[0] * dpr,
          offDevice: Math.max(...cols.map((v) => Math.abs(v - Math.round(v)))),
          centre: Math.abs((r.top + r.bottom) / 2 - (bar.top + bar.bottom) / 2),
          itemCentre: Math.abs((item.top + item.bottom) / 2 - (bar.top + bar.bottom) / 2),
          steady: document.querySelector('.mb-clock .roll').classList.contains('roll-steady'),
          text: document.querySelector('.mb-clock').textContent,
        };
      })()`);
      worst.cells = Math.max(worst.cells, m.spread, m.heightSpread);
      worst.rest = Math.max(worst.rest, Math.abs(m.cellDevice - Math.round(m.cellDevice)), m.offDevice);
      worst.centre = Math.max(worst.centre, m.centre, m.itemCentre);
      worst.steady = worst.steady && m.steady;
      if (i === 5) console.log(`  ${scale * 100}%: ${JSON.stringify(m)}`);
    }
    check(worst.cells < 0.01, `${scale * 100}%: every character is in a cell at the same height and of the same size (${worst.cells.toFixed(3)} px apart)`);
    check(worst.rest < 0.02, `${scale * 100}%: the cell and every resting column are whole device pixels (${worst.rest.toFixed(3)} off)`);
    check(worst.centre < 0.6, `${scale * 100}%: the clock is centred in the bar (${worst.centre.toFixed(2)} px)`);
    check(worst.steady, `${scale * 100}%: it turns over steadily, without overshoot`);
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
