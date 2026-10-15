// The dock's Search and Settings buttons and the dock going away: a button budded from the room beside the
// bar is put away when the pointer leaves the window (it used to stay), and the layer they hang on
// moves with the bar when the dock slides out and back.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/dockhide.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const h = await startHarness({
  out,
  window: "dock",
  viewport: [1400, 500],
  running: [],
  settings: (s) => {
    s.dock.revealControls = true;
    s.dock.showSearchButton = true;
    s.dock.showSettingsButton = true;
    s.dock.autoHide = true;
    s.dock.autoHideDelayMs = 900;
    s.pinned = [
      { id: "notes", kind: "app", path: "C:\\Windows\\notepad.exe", name: "Notes", icon: null, children: [] },
      { id: "idle", kind: "app", path: "C:\\Tools\\idle.exe", name: "Idle App", icon: null, children: [] },
    ];
  },
});
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
try {
  await h.open(".dock-icon");
  await h.desktop();
  const q = (js) => h.eval(`(() => ${js})()`);
  // the pointer on the dock from the first moment, or it slides away before it is measured
  const first = await q("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { x: (b.left + b.right) / 2, y: (b.top + b.bottom) / 2 }; })()");
  await h.move(first.x, first.y);
  await h.sleep(900);
  const bar = await q("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, mid: (b.top + b.bottom) / 2 }; })()");
  const satellites = () => q("[...document.querySelectorAll('.dock-satellite')].map((e) => e.dataset.side).join('+') || 'none'");

  check((await q("!!document.querySelector('.dock-satellites')")) === true, "the layer the buttons hang on is there");

  // out of the room beside the bar, and then out of the window
  await h.move(bar.left - 150, bar.mid);
  await h.sleep(200);
  await h.move(bar.left - 40, bar.mid);
  await h.sleep(500);
  check((await satellites()) === "left", `a button is out with the pointer beside the bar: ${await satellites()}`);
  await q("(() => { document.querySelector('.dock-viewport').dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: null })); return 1; })()");
  await h.sleep(450);
  check((await satellites()) === "none", `and put away when the pointer leaves the window: ${await satellites()}`);

  // the dock slides away after its delay; the layer goes the way the bar goes
  await h.move(bar.left + 100, bar.mid - 220);
  await h.sleep(1900);
  const pose = () => q("(() => { const t = (s) => getComputedStyle(document.querySelector(s)).transform; return { bar: t('.dock-bar'), layer: t('.dock-satellites'), reveal: document.querySelector('.dock-viewport').dataset.reveal }; })()");
  const away = await pose();
  console.log("slid away:", JSON.stringify(away));
  check(away.reveal === "out", "the dock has slid out");
  check(away.bar === away.layer, "the buttons' layer is where the bar is");
  check(away.bar !== "none", "and that is not where it rests");

  // and back (the page was told the pointer had left, so it is told it has come in again)
  await q("(() => { document.querySelector('.dock-viewport').dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: null })); return 1; })()");
  // (the window here stays its full size; on screen it is shrunk to the strip along the bottom, which brings it back)
  await h.move(bar.left + 100, bar.mid);
  await h.sleep(300);
  check((await pose()).reveal === "out", "where the bar rested, now empty, does not bring it back");
  await h.move(bar.left + 100, 497);
  await h.sleep(1300);
  const back = await pose();
  console.log("back:", JSON.stringify(back));
  check(back.reveal === "in" && back.bar === back.layer, "the layer comes back with the bar");

  // Only the strip from the edge to the top of the dock, and a little more, counts as on it: the empty room above it
  // in the window (for magnification and menus) does not keep it, and crossing it does not bring it back
  await h.move(bar.left + 100, bar.mid);
  await h.sleep(300);
  await h.move(bar.left + 100, bar.top - 60);
  await h.sleep(400);
  await h.move(bar.left + 100, bar.top - 8);
  await h.sleep(1300);
  check((await pose()).reveal === "in", "just above the bar (within the buffer) still counts as on the dock");
  await h.move(bar.left + 100, bar.top - 60);
  await h.sleep(1300);
  check((await pose()).reveal === "out", "well above it, in the window's empty room, the dock goes");
  await h.move(bar.left + 100, bar.top - 90);
  await h.sleep(250);
  check((await pose()).reveal === "out", "and moving about up there does not bring it back");
  console.log("commands the mock did not know:", JSON.stringify(await h.unknownCalls()));
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
