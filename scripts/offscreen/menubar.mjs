// The menu bar, off screen: the sliding lens, the Control Center and the
// calendar, with what the page does when the pointer leaves them.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/menubar.mjs <out folder>
//
// Prints numbers, and writes `menubar.png` (a contact sheet) into the folder.

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const h = await startHarness({ out, window: "menubar" });
try {
  await h.open(".menubar");
  await h.desktop();
  const shots = {};

  // ---- the lens: it travels, stretches, settles and dissolves ----
  const logo = await h.rect(".mb-logo");
  const gear = await h.rect('.mb-item[title="Windows Settings"]');
  await h.record("lens", `(() => { const l = document.querySelector('.mb-lens'); const r = l.getBoundingClientRect(); return { left: r.left, width: r.width, op: +getComputedStyle(l).opacity }; })()`);
  await h.move(logo.x, logo.y);
  await h.sleep(700);
  shots.lensOnLogo = await h.shot(0, 0, 700, 60);
  await h.move(gear.x, gear.y);
  await h.sleep(60);
  shots.lensTravelling = await h.shot(1300, 0, 620, 60);
  await h.sleep(900);
  const rec = await h.recorded("lens");
  const widths = rec.map((r) => r.v.width).filter(Boolean);
  console.log(`lens: widest ${Math.max(...widths).toFixed(0)}px, narrowest ${Math.min(...widths).toFixed(0)}px (a long hop should stay a blob, not a bar)`);
  await h.move(900, 400);
  await h.sleep(700);
  console.log("lens opacity after leaving the bar:", await h.eval("getComputedStyle(document.querySelector('.mb-lens')).opacity"));

  // ---- the Control Center: its volume slider, its Wi-Fi list ----
  const volume = `(() => { const es = document.querySelector('.mb-panel .es[aria-label="Volume"]'); if (!es) return null; const k = es.querySelector('.es-knob').getBoundingClientRect(); const f = es.querySelector('.es-fill').getBoundingClientRect(); const t = es.getBoundingClientRect(); return { value: es.getAttribute('aria-valuenow'), knobRight: +(k.right - t.left).toFixed(1), fillRight: +(f.right - t.left).toFixed(1) }; })()`;
  const cc = await h.rect('.mb-item[title="Control Center"]');
  const clock = await h.rect(".mb-clock");
  await h.click(cc.x, cc.y);
  await h.sleep(1000);
  console.log("volume slider, fresh open:   ", JSON.stringify(await h.eval(volume)));
  shots.controlCenter = await h.shot(1380, 0, 540, 760);
  const chevron = await h.rect('.cc-chevron[aria-label="Wi-Fi networks"]');
  await h.click(chevron.x, chevron.y);
  await h.sleep(1100);
  shots.wifiList = await h.shot(1380, 0, 540, 760);
  await h.click(chevron.x, chevron.y);
  // hover to the calendar and back: the volume must still be where it was
  await h.sweep(cc, clock);
  await h.sleep(800);
  shots.calendar = await h.shot(1380, 0, 540, 760);
  await h.sweep(clock, cc);
  await h.sleep(1000);
  console.log("volume slider, after hovering to the calendar and back:", JSON.stringify(await h.eval(volume)));

  // ---- leaving closes: crossing into the panel does not, moving away does ----
  const panel = await h.eval(`(() => { const r = document.querySelector('.mb-panel').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 40 }; })()`);
  await h.sweep(cc, panel, 10);
  await h.sleep(700);
  console.log("into the panel, still open:", await h.eval("!!document.querySelector('.mb-panel')"));
  await h.sweep(panel, { x: 300, y: 600 }, 10);
  await h.sleep(1300);
  console.log("moved away, still open:    ", await h.eval("!!document.querySelector('.mb-panel')"));

  console.log("sheet:", await h.sheet(shots, "menubar"));
  console.log("commands the mock did not know:", JSON.stringify(await h.unknownCalls()));
} finally {
  h.close();
}
process.exit(0);
