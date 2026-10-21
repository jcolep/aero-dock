// High quality icons, off screen: with the setting on, a window asks Rust for its icons at the size it shows them
// (device px: the dock's icon size, swollen by magnification, times the screen's scale), and with it off, or when that
// is as big as the picture itself, asks for none. (Rust rounds the size up to a size it keeps; `cargo test` covers that.)
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/iconquality.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const pins = ["Notes", "Mail"].map((name, i) => ({ id: `p${i}`, kind: "app", path: `C:\\Tools\\${name}.exe`, name, icon: null, children: [] }));

async function asked({ window, on, size, mag, scaleFactor }) {
  const h = await startHarness({
    out,
    window,
    viewport: [1200, 600],
    scale: scaleFactor,
    running: [],
    settings: (s) => {
      s.onboardingComplete = true;
      s.appearance.highQualityIcons = on;
      s.dock.autoHide = false;
      s.dock.iconSize = size;
      s.dock.magnification = mag > 1;
      s.dock.magnificationScale = mag;
      s.pinned = pins;
    },
  });
  try {
    await h.open(window === "dock" ? ".dock-icon" : "body");
    await h.sleep(1200);
    const calls = await h.eval("window.__calls.filter((c) => c.cmd === 'resolve_icons').map((c) => c.args.px ?? null)");
    return calls;
  } finally {
    h.close();
  }
}

const same = (a, v) => a.length > 0 && a.every((x) => x === v);
let r = await asked({ window: "dock", on: true, size: 26, mag: 1.3, scaleFactor: 1 });
check(same(r, 34), `dock, 26 px swollen 1.3x at scale 1: asks for 34 px (${JSON.stringify(r)})`);
r = await asked({ window: "dock", on: true, size: 26, mag: 1.3, scaleFactor: 1.5 });
check(same(r, 51), `...at scale 1.5: asks for 51 px (${JSON.stringify(r)})`);
r = await asked({ window: "dock", on: true, size: 48, mag: 1, scaleFactor: 1 });
check(same(r, 48), `dock, 48 px, no magnification: asks for 48 px (${JSON.stringify(r)})`);
r = await asked({ window: "dock", on: true, size: 96, mag: 2, scaleFactor: 2 });
check(same(r, null), `as big as the picture or bigger: asks for none (${JSON.stringify(r)})`);
r = await asked({ window: "dock", on: false, size: 26, mag: 1.3, scaleFactor: 1 });
check(same(r, null), `setting off: asks for none (${JSON.stringify(r)})`);
process.exit(failed ? 1 : 0);
