// The dock's buttons, off screen: Search and Settings bud out when the pointer comes at an end of
// the dock from outside it, and the clock and status buttons share one gliding glass.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/dockglass.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const h = await startHarness({
  out,
  window: "dock",
  viewport: [1400, 500],
  running: [{ hwnd: 1, title: "Untitled", exe: "C:\\Windows\\notepad.exe", pid: 1, aumid: null, monitor: "" }],
  settings: (s) => {
    s.dock.revealControls = true;
    s.dock.showSearchButton = true;
    s.dock.showSettingsButton = true;
    s.pinned = [
      { id: "idle", kind: "app", path: "C:\\Tools\\idle.exe", name: "Idle App", icon: null, children: [] },
      { id: "notes", kind: "app", path: "C:\\Windows\\notepad.exe", name: "Notes", icon: null, children: [] },
    ];
  },
});
const shots = {};
try {
  await h.open(".dock-icon");
  await h.desktop();
  await h.sleep(1200);
  const q = (js) => h.eval(`(() => ${js})()`);
  const bar = await q("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, mid: (b.top + b.bottom) / 2 }; })()");
  console.log("bar:", JSON.stringify(bar));
  const satellites = () => q("[...document.querySelectorAll('.dock-satellite')].map((e) => e.dataset.side).join('+') || 'none'");

  // from the left of the window, level with the bar, in steps, until it is over the bar's zone
  console.log("before:", await satellites());
  await h.move(bar.left - 150, bar.mid);
  await h.sleep(250);
  console.log("pointer still outside the room:", await satellites());
  const over = await q("document.elementFromPoint(" + (bar.left - 40) + ", " + bar.mid + ")?.className");
  await h.move(bar.left - 40, bar.mid);
  await h.sleep(500);
  console.log(`pointer 40px left of the bar (over '${over}', not over the bar): satellites =`, await satellites());
  shots.left = await h.shot(Math.max(0, bar.left - 200), bar.top - 90, 760, 180, 1);

  // and from the right
  await h.move(bar.right + 150, bar.mid);
  await h.sleep(600);
  console.log("away again:", await satellites());
  await h.move(bar.right + 40, bar.mid);
  await h.sleep(500);
  console.log("pointer 40px right of the bar:", await satellites());

  // the status buttons: the glass appears on one and swells it, and moves to the next
  await h.move(bar.left + 100, bar.mid - 200);
  await h.sleep(500);
  const chips = await q("[...document.querySelectorAll('.widget-chip-button')].map((e) => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })");
  console.log("status buttons:", chips.length);
  await h.move(chips[0].x, chips[0].y);
  await h.sleep(400);
  const glass = () => q("(() => { const g = document.querySelector('.widget-cluster .glide-highlight'); if (!g) return null; const b = g.getBoundingClientRect(); return { opacity: +getComputedStyle(g).opacity, w: Math.round(b.width), left: Math.round(b.left) }; })()");
  console.log("glass on the first:", JSON.stringify(await glass()), " swollen:", await q("document.querySelectorAll('.widget-cluster [data-lensed=\"true\"]').length"));
  shots.status = await h.shot(Math.max(0, chips[0].x - 220), bar.top - 40, 520, 140, 2);
  await h.move(chips[chips.length - 1].x, chips[chips.length - 1].y);
  await h.sleep(60);
  const mid = await glass();
  await h.sleep(500);
  const end = await glass();
  console.log("mid-hop:", JSON.stringify(mid), " settled:", JSON.stringify(end));
  console.log("sheet:", await h.sheet(shots, "dockglass"));
  console.log("commands the mock did not know:", JSON.stringify(await h.unknownCalls()));
} finally {
  h.close();
}
process.exit(0);
