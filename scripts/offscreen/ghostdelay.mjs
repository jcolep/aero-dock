// The focus mark's ghost and the pointer sweeping across the dock, off screen. Each frame it records which app the ghost
// is under. With no delay it is under each app the pointer crosses (it hopped from icon to icon); with a delay it stays
// put through a quick sweep and goes only to the app the pointer comes to rest on, gliding there from where it was, and it
// leaves with the pointer a moment after, not at once.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/ghostdelay.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what, got) => {
  console.log(ok ? "ok  " : "FAIL", what, ok || got === undefined ? "" : `  got ${JSON.stringify(got)}`);
  if (!ok) failed = true;
};
const names = ["Edge", "Mail", "Word", "Notes", "Music"];
const pins = names.map((name) => ({ id: name, kind: "app", path: `C:\\apps\\${name}.exe`, name, icon: null, children: [] }));

async function scenario(delay, body) {
  const h = await startHarness({
    out,
    window: "dock",
    viewport: [1000, 420],
    running: [],
    settings: (s) => {
      s.onboardingComplete = true;
      s.dock.autoHide = false;
      s.dock.magnification = false;
      s.dock.indicatorStyle = "focus";
      s.dock.ghostDelayMs = delay;
      s.pinned = pins;
    },
  });
  try {
    await h.open(".dock-icon");
    await h.sleep(900);
    const centres = await h.eval(`[...document.querySelectorAll('button.dock-icon')].map((b) => { const r = b.getBoundingClientRect(); return { name: b.getAttribute('aria-label'), x: r.left + r.width / 2, y: r.top + r.height / 2 }; })`);
    const at = (n) => centres.find((c) => c.name.startsWith(n));
    // the apps the ghost is under each frame (one at rest; two while it is going from one to the other, the old one fading)
    await h.record("g", `[...document.querySelectorAll('.dock-mark-ghost')].map((g) => g.closest('button.dock-icon').getAttribute('aria-label').split(',')[0])`);
    const seen = async () => {
      const frames = (await h.recorded("g")).map((f) => f.v);
      // every app that has had the ghost, in the order it first did
      const hosts = [];
      for (const v of frames) for (const n of v) if (!hosts.includes(n)) hosts.push(n);
      const last = frames.at(-1) ?? [];
      return { frames, hosts, last, under: (n) => last.some((x) => x.startsWith(n)) };
    };
    // the pointer sweeps from one app to another, a few ms on each icon in between
    const sweep = async (from, to, stepMs = 28) => {
      const a = names.indexOf(from);
      const b = names.indexOf(to);
      const dir = a < b ? 1 : -1;
      for (let i = a; i !== b + dir; i += dir) {
        const c = at(names[i]);
        await h.move(c.x, c.y);
        await h.sleep(stepMs);
      }
    };
    await body({ h, at, seen, sweep });
    check((await h.errors()).length === 0, `delay ${delay}: no errors in the page`);
  } finally {
    h.close();
  }
}

await scenario(0, async ({ h, at, seen, sweep }) => {
  await h.move(5, 5);
  await h.sleep(300);
  await sweep("Edge", "Music");
  await h.sleep(500);
  const { hosts } = await seen();
  check(hosts.length >= 4, `no delay: the ghost is under the apps crossed (${hosts.join(" > ")})`, hosts);
});

await scenario(120, async ({ h, at, seen, sweep }) => {
  await h.move(5, 5);
  await h.sleep(300);
  await sweep("Edge", "Music");
  await h.sleep(600);
  let r = await seen();
  check(r.hosts.length === 1 && r.hosts[0].startsWith("Music"), `120 ms: a quick sweep makes no ghost on the way, and it ends under the app it stopped on (${r.hosts.join(" > ")})`, r.hosts);

  // resting on one app, then sweeping to another: it stays until the pointer rests, then goes there
  await h.eval("window.__rec_g.length = 0");
  await sweep("Music", "Edge");
  await h.sleep(600);
  r = await seen();
  check(r.hosts.every((x) => x.startsWith("Music") || x.startsWith("Edge")) && r.hosts.length <= 2, `...from one rest to the next it stays put, then goes to where the pointer stopped (${r.hosts.join(" > ")})`, r.hosts);
  check(r.under("Edge"), "...and ends under the one it stopped on", r.last);
  check(!r.hosts.some((x) => /^(Mail|Word|Notes)/.test(x)), "...never under one it only crossed", r.hosts);

  // resting is what it takes
  await h.eval("window.__rec_g.length = 0");
  const mail = at("Mail");
  await h.move(mail.x, mail.y);
  await h.sleep(60);
  check((await seen()).under("Music"), "60 ms on an app is not yet enough: the ghost is still where it was", (await seen()).last);
  await h.sleep(300);
  check((await seen()).under("Mail"), "and after the delay it is there", (await seen()).last);

  // leaving the dock: it stays a moment, then goes
  await h.move(5, 5);
  await h.sleep(80);
  check((await seen()).under("Mail"), "leaving the dock, it stays for a moment (a pointer crossing the gap to the next icon keeps it)", (await seen()).last);
  await h.sleep(700);
  check((await seen()).last.length === 0, "and then it goes", (await seen()).last);
});
process.exit(failed ? 1 : 0);
