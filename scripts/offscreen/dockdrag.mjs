// Dragging the dock's apps, off screen: within the pinned apps, a running app onto the pinned side (pinned there), a
// pinned app with windows onto the running side (unpinned, and it stays there as running), and a pinned app with no
// windows onto the running side (unpinned and gone, "Remove from Dock" shown on the way). In every case the icon is
// the same element after the drop as before it (it is not drawn afresh: that was the pop between the two sides), and
// it never jumps: each is filmed from the moment it is let go until it has settled.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/dockdrag.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const win = (hwnd, title, exe) => ({ hwnd, title, exe, pid: hwnd, aumid: null, monitor: "" });
const running = [win(1, "Untitled - Notepad", "C:\\Windows\\notepad.exe"), win(2, "Inbox - Mail", "C:\\apps\\Mail.exe"), win(3, "Paint", "C:\\apps\\Paint.exe")];
const pins = ["Edge", "Mail", "Word", "Excel"];
const h = await startHarness({
  out,
  window: "dock",
  viewport: [1100, 420],
  running,
  settings: (s) => {
    s.dock.autoHide = false;
    s.dock.magnification = false;
    s.dock.showSearchButton = false;
    s.onboardingComplete = true;
    s.pinned = pins.map((name) => ({ id: `pin-${name}`, kind: "app", path: `C:\\apps\\${name}.exe`, name, icon: null, children: [] }));
  },
});
const shots = {};
try {
  await h.open(".dock-icon");
  await h.desktop("#5b6f8f");
  await h.sleep(900);
  const labels = () => h.eval("[...document.querySelectorAll('.dock-section > div > button.dock-icon, .dock-section > .dock-divider:not([data-hidden])')].map((e) => e.classList.contains('dock-divider') ? '|' : e.getAttribute('aria-label').split(',')[0])");
  const at = (name) => h.eval(`(() => { const b = [...document.querySelectorAll('button.dock-icon')].find((e) => e.getAttribute('aria-label').split(',')[0] === ${JSON.stringify(name)}); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  const calls = (cmd) => h.eval(`window.__calls.filter((c) => c.cmd === ${JSON.stringify(cmd)}).map((c) => c.args)`);
  const bar = await h.eval("(() => { const b = document.querySelector('.dock-bar').getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()");
  const shot = async (name) => (shots[name] = await h.shot(Math.max(0, bar.x - 30), bar.y - 60, bar.w + 60, bar.h + 90, 1));

  /** Drag the icon named `name` to x (along the bar), filming it after it is let go: its left edge each frame. */
  const drag = async (name, toX, { mid, toY } = {}) => {
    const from = await at(name);
    await h.eval(`window.__held = [...document.querySelectorAll('button.dock-icon')].find((e) => e.getAttribute('aria-label').split(',')[0] === ${JSON.stringify(name)}); true`);
    await h.down(from.x, from.y);
    const steps = 16;
    let off = 0;
    const y = toY ?? from.y;
    for (let i = 1; i <= steps; i++) {
      await h.held(from.x + ((toX - from.x) * i) / steps, from.y + ((y - from.y) * i) / steps);
      await h.sleep(18);
      // carried, it stays under the pointer (it once fell a slot behind at every place it passed, after the divider)
      const c = await h.eval('(() => { const r = window.__held.getBoundingClientRect(); return r.left + r.width / 2; })()');
      if (i > 2) off = Math.max(off, Math.abs(c - (from.x + ((toX - from.x) * i) / steps)));
    }
    await h.sleep(250);
    if (mid) await mid();
    await h.record("left", "(() => { const e = window.__held; return e && e.isConnected ? Math.round(e.getBoundingClientRect().left * 10) / 10 : -1; })()");
    await h.up(toX, y);
    await h.sleep(1100);
    const film = (await h.recorded("left")).map((s) => s.v);
    let jump = 0;
    for (let i = 1; i < film.length; i++) if (film[i] >= 0 && film[i - 1] >= 0) jump = Math.max(jump, Math.abs(film[i] - film[i - 1]));
    const same = await h.eval("!!window.__held && window.__held.isConnected");
    return { jump, same, film, off };
  };

  const start = await labels();
  check(JSON.stringify(start) === JSON.stringify(["Edge", "Mail", "Word", "Excel", "|", "Untitled - Notepad", "Paint"]), `as set: pinned, the divider, running (${JSON.stringify(start)})`);
  await shot("as set");

  // 1. Edge to after Word, within the pinned apps
  const word = await at("Word");
  const excel = await at("Excel");
  let r = await drag("Edge", (word.x + excel.x) / 2);
  const one = await labels();
  check(JSON.stringify(one.slice(0, 4)) === JSON.stringify(["Mail", "Word", "Edge", "Excel"]) && JSON.stringify((await calls("reorder_pinned")).at(-1)?.ids) === JSON.stringify(["pin-Mail", "pin-Word", "pin-Edge", "pin-Excel"]), `within the pinned: moved and saved (${JSON.stringify(one)})`);
  check(r.same && r.jump < 12 && r.off < 2, `  under the pointer while carried (off by ${r.off.toFixed(1)}px at most), settles without a jump (largest step ${r.jump.toFixed(1)}px), the same icon`);

  // 2. Notepad (running) to between Mail and Word: pinned there
  const mail = await at("Mail");
  const word2 = await at("Word");
  r = await drag("Untitled - Notepad", (mail.x + word2.x) / 2, { mid: () => shot("Notepad carried onto the pinned side") });
  const two = await labels();
  const pinned = (await calls("pin_item")).at(-1);
  check(pinned?.index === 1 && /notepad/i.test(pinned?.item.path) && two.indexOf("|") === 5 && /notepad/i.test(two[1]), `a running app onto the pinned side: pinned where let go (index ${pinned?.index}; ${JSON.stringify(two)})`);
  check(r.same && r.jump < 12 && r.off < 2, `  under the pointer while carried (off by ${r.off.toFixed(1)}px), the same icon, no pop (largest step ${r.jump.toFixed(1)}px)`);
  await shot("Notepad pinned");

  // 3. Mail (pinned, with a window) onto the running side, after Paint: unpinned, and stays there as running
  const paint = await at("Paint");
  r = await drag("Mail", paint.x + 60);
  const three = await labels();
  check((await calls("unpin_item")).some((a) => a.id === "pin-Mail") && three.indexOf("|") < three.indexOf("Inbox - Mail") && three.at(-1) === "Inbox - Mail", `a pinned app with a window onto the running side: unpinned, running where let go (${JSON.stringify(three)})`);
  check(r.same && r.jump < 12 && r.off < 2, `  under the pointer while carried (off by ${r.off.toFixed(1)}px), the same icon (largest step ${r.jump.toFixed(1)}px)`);
  await shot("Mail unpinned, running");

  // 4. Excel (pinned, no windows) onto the running side: "Remove from Dock" on the way, unpinned and gone
  const div = await h.eval("(() => { const r = document.querySelector('.dock-section > .dock-divider').getBoundingClientRect(); return { x: r.left + r.width / 2 }; })()");
  let hint = false;
  r = await drag("Excel", div.x + 40, {
    mid: async () => {
      hint = await h.eval("!!document.querySelector('.dock-remove-hint')");
      await shot("Excel carried to the running side (to be removed)");
    },
  });
  const four = await labels();
  check(hint && (await calls("unpin_item")).some((a) => a.id === "pin-Excel") && !four.includes("Excel"), `a pinned app with no windows onto the running side: "Remove from Dock" shown, unpinned and gone (${JSON.stringify(four)})`);
  await shot("after");

  check((await h.errors()).length === 0, "no errors in the page");
  console.log("sheet:", await h.sheet(shots, "dockdrag", 560));
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
