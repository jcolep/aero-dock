// What makes a sound, off screen: the engine records each cue it plays (window.__aeroCueLog), and each interaction is
// checked for the cue it should make. Dock: the drop's hover, an icon's hover, a click that launches / minimises /
// restores, a flyout opening and closing, a drag (lifted, each place passed, put down, pinned, unpinned). Menu bar: the
// drop's hover (its own, not the lens's tick). Settings: a switch, a choice, a slider, a button. Start: launching, a
// pin dragged. Nothing here is heard (there are no speakers); the notes themselves are checked by sound.mjs.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/soundmap.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const win = (hwnd, title, exe) => ({ hwnd, title, exe, pid: hwnd, aumid: null, monitor: "" });
const sounds = (s) => {
  s.accessibility.uiSounds = true;
  s.accessibility.uiSoundVolume = 0.5;
};
const logging = (h) => h.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__aeroCueLog = [];" });
/** The cues played since the last call. */
const heard = async (h) => {
  const log = await h.eval("(() => { const l = window.__aeroCueLog.slice(); window.__aeroCueLog.length = 0; return l; })()");
  return log;
};
const has = (log, ...cues) => cues.every((c) => log.includes(c));

// ---- the dock ----
{
  const h = await startHarness({
    out,
    window: "dock",
    viewport: [1100, 420],
    running: [win(1, "Untitled - Notepad", "C:\\Windows\\notepad.exe"), win(3, "Paint", "C:\\apps\\Paint.exe")],
    settings: (s) => {
      sounds(s);
      s.dock.autoHide = false;
      s.dock.magnification = false;
      s.dock.showSearchButton = true;
      s.dock.startReveal = "static";
      s.onboardingComplete = true;
      s.pinned = ["Edge", "Mail"].map((name) => ({ id: `pin-${name}`, kind: "app", path: `C:\\apps\\${name}.exe`, name, icon: null, children: [] }));
    },
  });
  try {
    await logging(h);
    await h.open(".dock-icon");
    await h.eval("window.__aeroCueLog = []");
    await h.sleep(900);
    const at = (name) => h.eval(`(() => { const b = [...document.querySelectorAll('button.dock-icon')].find((e) => e.getAttribute('aria-label').split(',')[0].includes(${JSON.stringify(name)})); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    await heard(h);

    // the drop
    const drop = await h.rect(".dock-drop-btn");
    await h.move(5, 5);
    await h.sleep(300);
    await heard(h);
    await h.move(drop.x, drop.y);
    await h.sleep(250);
    let log = await heard(h);
    check(has(log, "droplet") && !log.includes("hover"), `the dock's drop, touched: its own sound (${JSON.stringify(log)})`);

    // an icon
    const edge = await at("Edge");
    await h.move(edge.x, edge.y);
    await h.sleep(250);
    log = await heard(h);
    check(has(log, "hover"), `an icon, touched: a note (${JSON.stringify(log)})`);

    // clicks: an app that is not running opens; its one window goes into its icon, comes back, comes forward
    await h.click(edge.x, edge.y);
    await h.sleep(300);
    log = await heard(h);
    check(has(log, "launch"), `an app that is not running, clicked: it launches (${JSON.stringify(log)})`);
    const pad = await at("Notepad");
    for (const [did, cue] of [["minimized", "minimize"], ["restored", "restore"], ["focused", "restore"]]) {
      await h.eval(`window.__toggled = ${JSON.stringify(did)}`);
      await h.click(pad.x, pad.y);
      await h.sleep(300);
      log = await heard(h);
      check(has(log, cue) && !log.includes("launch"), `a window ${did} by a click on its icon: ${cue}, and no launch (${JSON.stringify(log)})`);
    }

    // a menu
    await h.click(pad.x, pad.y, "right");
    await h.sleep(500);
    log = await heard(h);
    check(has(log, "open"), `a right-click menu opens: the menu's sound (${JSON.stringify(log)})`);
    await h.move(900, 40);
    await h.sleep(100);
    await h.click(900, 40);
    await h.sleep(600);
    log = await heard(h);
    check(has(log, "close"), `and goes: its closing (${JSON.stringify(log)})`);

    // a drag: Edge across Mail (lifted, a place passed, put down); Notepad onto the pinned side (pinned); Mail (no windows) to the running side (unpinned)
    const drag = async (name, dx) => {
      const from = await at(name);
      await h.down(from.x, from.y);
      for (let i = 1; i <= 16; i++) {
        await h.held(from.x + (dx * i) / 16, from.y);
        await h.sleep(18);
      }
      await h.sleep(200);
      const mid = await heard(h);
      await h.up(from.x + dx, from.y);
      await h.sleep(500);
      return [...mid, ...(await heard(h))];
    };
    await h.move(5, 5);
    await h.sleep(300);
    await heard(h);
    let moved = await drag("Edge", 70);
    check(has(moved, "lift", "tick", "place"), `a pinned app carried past another and put down: lift, tick, place (${JSON.stringify(moved.filter((c) => c !== "hover"))})`);
    const pads = await at("Notepad");
    const mail = await at("Mail");
    moved = await drag("Notepad", mail.x - pads.x - 20);
    check(has(moved, "lift", "pin"), `a running app put down among the pinned: lift, pin (${JSON.stringify(moved.filter((c) => c !== "hover" && c !== "tick"))})`);
    const paint = await at("Paint");
    const m2 = await at("Mail");
    moved = await drag("Mail", paint.x - m2.x + 40);
    check(has(moved, "lift", "unpin"), `a pinned app with no windows taken to the running side: lift, unpin (${JSON.stringify(moved.filter((c) => c !== "hover" && c !== "tick"))})`);
    check((await h.errors()).length === 0, "the dock: no errors in the page");
  } finally {
    h.close();
  }
}

// ---- the menu bar: the drop in the corner has its own sound, and the lens's tick does not play over it ----
{
  const h = await startHarness({ out, window: "menubar", viewport: [1100, 200], settings: sounds });
  try {
    await logging(h);
    await h.open(".mb-item");
    await h.eval("window.__aeroCueLog = []");
    await h.sleep(800);
    const logo = await h.rect(".mb-logo");
    await h.move(900, 100);
    await h.sleep(300);
    await heard(h);
    await h.move(logo.x, logo.y);
    await h.sleep(400);
    let log = await heard(h);
    check(has(log, "droplet") && !log.includes("tick"), `the menu bar's drop, touched: its own sound, not the lens's tick (${JSON.stringify(log)})`);
    const app = await h.rect(".mb-app");
    await h.move(app.x, app.y);
    await h.sleep(400);
    log = await heard(h);
    check(has(log, "tick") && !log.includes("droplet"), `another button on the bar: the lens's tick (${JSON.stringify(log)})`);
    check((await h.errors()).length === 0, "the menu bar: no errors in the page");
  } finally {
    h.close();
  }
}

// ---- Settings: a switch, a choice, a slider, a button ----
{
  const h = await startHarness({ out, window: "settings", viewport: [1100, 800], settings: sounds });
  try {
    await logging(h);
    await h.open(".ctl-toggle");
    await h.eval("window.__aeroCueLog = []");
    await h.sleep(800);
    const sw = await h.rect(".ctl-toggle");
    await h.click(sw.x, sw.y);
    await h.sleep(300);
    let log = await heard(h);
    check(has(log, "on") || has(log, "off"), `a switch: on or off (${JSON.stringify(log)})`);
    await h.click(sw.x, sw.y);
    await h.sleep(300);
    const second = await heard(h);
    check((has(second, "on") || has(second, "off")) && JSON.stringify(second) !== JSON.stringify(log), `and the other way: the other sound (${JSON.stringify(second)})`);
    const seg = await h.eval("(() => { const b = [...document.querySelectorAll('.ctl-segmented button')].find((e) => e.getAttribute('aria-checked') === 'false'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()");
    if (seg) {
      await h.click(seg.x, seg.y);
      await h.sleep(300);
      log = await heard(h);
      check(has(log, "notch"), `a choice made: a notch (${JSON.stringify(log)})`);
    }
    check((await h.errors()).length === 0, "settings: no errors in the page");
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
