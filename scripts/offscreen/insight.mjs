// The menu bar's privacy dots and stats, off screen.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/insight.mjs <out folder>
//
// Writes `insight.png`: the bar with a microphone and a camera dot and the load
// graph, the privacy popover, and the stats popover.

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const h = await startHarness({
  out,
  window: "menubar",
  privacy: [
    { sensor: "microphone", app: "Teams" },
    { sensor: "camera", app: "Teams" },
  ],
});
try {
  await h.open(".menubar");
  await h.desktop();
  await h.sleep(7000); // a few readings for the graph to draw
  const shots = {};
  shots.bar = await h.shot(1380, 0, 540, 40, 2);
  console.log("dots in the bar:", await h.eval("document.querySelectorAll('.mb-privacy .mb-dot').length"));
  console.log("graph points:", await h.eval("document.querySelector('.mb-spark polyline')?.getAttribute('points')?.split(' ').length ?? 0"));
  console.log("bar item labels:", JSON.stringify(await h.eval("[...document.querySelectorAll('.mb-privacy, .mb-stats')].map((e) => e.getAttribute('aria-label'))")));

  const dots = await h.rect(".mb-privacy");
  await h.click(dots.x, dots.y);
  await h.sleep(900);
  shots.privacy = await h.shot(1380, 0, 540, 300);
  await h.click(900, 600);
  await h.sleep(800);

  const stats = await h.rect(".mb-stats");
  await h.click(stats.x, stats.y);
  await h.sleep(1300);
  shots.stats = await h.shot(1380, 0, 540, 640);
  console.log("top programs listed:", await h.eval("document.querySelectorAll('.stats-list li').length"));
  console.log("sheet:", await h.sheet(shots, "insight"));
  console.log("commands the mock did not know:", JSON.stringify(await h.unknownCalls()));
} finally {
  h.close();
}
process.exit(0);