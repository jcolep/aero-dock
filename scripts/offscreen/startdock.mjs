// The dock while the Start menu is open (Settings > Start menu > The dock while it is open): with "Hidden" it slides
// away when the menu opens and comes back when it closes; with "Usable" it stays. (Usable's other half, the menu's
// window cut off at the dock's edge so the dock gets the pointer, is Rust's: start.rs place_and_show.)
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/startdock.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
for (const mode of ["hidden", "usable"]) {
  const h = await startHarness({ out, window: "dock", viewport: [1100, 420], settings: (s) => { s.dock.autoHide = false; s.start.dockWhileOpen = mode; } });
  try {
    await h.open(".dock-icon");
    await h.sleep(900);
    // the bar's place on screen (it slides by a transform when it goes)
    const barY = () => h.eval("Math.round(document.querySelector('.dock-body, .dock-bar').getBoundingClientRect().top)");
    const shown = await barY();
    await h.emit("start://state", true);
    await h.sleep(900);
    const during = await barY();
    await h.emit("start://state", false);
    await h.sleep(900);
    const after = await barY();
    if (mode === "hidden") {
      check(during > shown + 20, `hidden: the dock slides away while the menu is open (bar at ${shown}, then ${during})`);
      check(Math.abs(after - shown) <= 1, `hidden: and comes back when it closes (${after})`);
    } else {
      check(Math.abs(during - shown) <= 1 && Math.abs(after - shown) <= 1, `usable: the dock stays while the menu is open (${shown}, ${during}, ${after})`);
    }
    check((await h.errors()).length === 0, `${mode}: no errors in the page`);
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
