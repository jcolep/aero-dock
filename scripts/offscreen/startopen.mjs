// How much work the page does as the Start menu opens, off screen, with a real machine's numbers (hundreds of apps, not a
// dozen): the longest wait between two frames in the first 600 ms after `start://open`, and the long tasks (50 ms or more)
// in it. Each opening used to read the whole list of apps again and put it into state, which drew every row of the list
// again in the middle of the opening; a list that has not changed is now left as it was.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/startopen.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what, got) => {
  console.log(ok ? "ok  " : "FAIL", what, ok || got === undefined ? "" : `  got ${JSON.stringify(got)}`);
  if (!ok) failed = true;
};
const apps = Array.from({ length: 400 }, (_, i) => ({
  name: `Application ${String(i).padStart(3, "0")} ${["Studio", "Editor", "Viewer", "Manager", "Suite"][i % 5]}`,
  shortcutPath: null,
  targetPath: `C:\\Program Files\\Vendor${i % 40}\\app${i}.exe`,
  args: "",
  icon: null,
  source: "start-menu",
  addedMs: Date.now() - (i % 30) * 86_400_000,
}));
const recent = Array.from({ length: 20 }, (_, i) => ({ name: `Document ${i}.docx`, path: `C:\\Docs\\Document ${i}.docx`, usedAt: Math.floor(Date.now() / 1000) - i * 3600 }));
const h = await startHarness({
  out,
  window: "start",
  viewport: [760, 800],
  apps,
  recent,
  settings: (s) => {
    s.start.seeded = true;
    s.start.pinned = apps.slice(0, 12).map((a) => ({ name: a.name, target: a.targetPath, args: "" }));
  },
});
try {
  await h.open(".st-root");
  await h.desktop("linear-gradient(120deg,#1b2742,#4a3b6b 55%,#7a4a5a)");
  await h.sleep(1200);
  // watch long tasks, and every frame, from just before the opening
  await h.eval(`window.__long = []; try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__long.push(Math.round(e.duration)))).observe({ entryTypes: ['longtask'] }); } catch (e) {}; true`);
  const open = () =>
    h.eval(`new Promise((done) => {
      const t0 = performance.now(); let last = t0, worst = 0, n = 0;
      window.__long.length = 0;
      window.__emit("start://open", { previous: 1 });
      const frame = (t) => { n++; worst = Math.max(worst, t - last); last = t; if (t - t0 < 600) requestAnimationFrame(frame); else done({ worstGap: Math.round(worst), frames: n, long: window.__long.slice() }); };
      requestAnimationFrame(frame);
    })`);
  const close = async () => {
    await h.eval(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); true`);
    await h.sleep(900);
  };
  const runs = [];
  for (let i = 0; i < 6; i++) {
    runs.push(await open());
    await h.sleep(500);
    await close();
  }
  console.log("openings:", JSON.stringify(runs));
  // the first is the cold one; the rest read the lists again
  const later = runs.slice(1);
  const worst = Math.max(...later.map((r) => r.worstGap));
  const long = later.reduce((n, r) => n + r.long.length, 0);
  check(worst <= 60, `reopened, the longest wait between frames is ${worst} ms (under 60)`, later.map((r) => r.worstGap));
  check(long === 0, `...with no long task in the first 600 ms (${long})`, later.map((r) => r.long));
  check((await h.errors()).length === 0, "no errors in the page");
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
