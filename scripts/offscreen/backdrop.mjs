// Frosted glass, off screen: each glassy surface tells Rust where its glass is (`set_glass_pane`), in its own
// pixels, with the corner radius of the glass and how much of the blur shows; follows it while it moves and goes
// quiet when it stands still; takes it away when it goes; and asks for nothing at all with the glass switched off.
// (The blur itself is the compositor's, beneath the page: see platform/windows/glass.rs and its bench, complab.)
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/backdrop.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const panes = (h) => h.eval("window.__calls.filter((c) => c.cmd === 'set_glass_pane').map((c) => c.args.pane)");

// ---- the menu bar ----
{
  const h = await startHarness({
    out,
    window: "menubar",
    viewport: [1200, 300],
    settings: (s) => {
      s.appearance.realBlur = true;
      s.menuBar.enabled = true;
      s.menuBar.gap = 8;
      s.appearance.frost.menuBar = { blur: 20, grain: 0.2 };
    },
  });
  try {
    await h.open(".menubar");
    await h.sleep(1500);
    const all = await panes(h);
    const last = all.at(-1);
    const bar = await h.eval("(() => { const r = document.querySelector('.menubar').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, radius: parseFloat(getComputedStyle(document.querySelector('.menubar')).borderTopLeftRadius) }; })()");
    check(last && last.shown, "the menu bar has its glass");
    check(Math.abs(last.x - bar.x) < 1 && Math.abs(last.y - bar.y) < 1 && Math.abs(last.width - bar.w) < 1 && Math.abs(last.height - bar.h) < 1, `exactly where the bar is (${JSON.stringify(last)} for ${JSON.stringify(bar)})`);
    check(Math.abs(last.radius - bar.radius) < 0.5, `with the bar's own corners (${last.radius})`);
    check(Math.abs(last.opacity - 0.5) < 0.02, `and as much of the blur as its frost asks for (${last.opacity})`);
    check((await h.eval("document.querySelector('.menubar').dataset.bd")) === "on", "the bar's tint is drawn over the glass");
    // standing still: nothing more is said
    const before = (await panes(h)).length;
    await h.sleep(1200);
    check((await panes(h)).length === before, `standing still, nothing more is sent (${before} in all)`);
  } finally {
    h.close();
  }
}

// ---- the dock: follows the bar as it moves, and takes the glass away when the dock slides off ----
{
  const pins = ["Notes", "Mail", "Maps"].map((name, i) => ({ id: `p${i}`, kind: "app", path: `C:\\Tools\\${name}.exe`, name, icon: null, children: [] }));
  const h = await startHarness({
    out,
    window: "dock",
    viewport: [1200, 400],
    running: [],
    settings: (s) => {
      s.appearance.realBlur = true;
      s.pinned = pins;
      s.appearance.frost.dock = { blur: 40, grain: 0.3 };
    },
  });
  try {
    await h.open(".dock-icon");
    await h.sleep(1200);
    const at = (await panes(h)).at(-1);
    const bar = await h.eval("(() => { const r = document.querySelector('.dock-bar').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()");
    check(at && at.shown && Math.abs(at.x - bar.x) < 1 && Math.abs(at.width - bar.w) < 1, `the dock's glass is under its bar (${JSON.stringify(at)})`);
    check(Math.abs(at.opacity - 1) < 0.02, "fully frosted at full frost");
    // the bar grows when the icons swell under the pointer: the glass follows it, frame by frame
    // (the bar's own piece: the label that comes up over the icon has one of its own)
    const barPanes = async () => (await panes(h)).filter((p) => p.id === at.id);
    const n0 = (await barPanes()).length;
    await h.move(bar.x + 60, bar.y + bar.h / 2);
    await h.sleep(900);
    const grown = (await barPanes()).at(-1);
    const bar2 = await h.eval("(() => { const r = document.querySelector('.dock-bar').getBoundingClientRect(); return { x: r.left, w: r.width }; })()");
    check((await barPanes()).length > n0 + 2 && Math.abs(grown.width - bar2.w) < 1, `the glass followed the bar as it grew (${n0} then ${(await barPanes()).length} reports; ${grown.width} for a bar ${bar2.w} wide)`);
    const label = new Set((await panes(h)).filter((p) => p.shown && p.id !== at.id).map((p) => p.id)).size;
    check(label >= 1, `the label over the icon has glass of its own (${label})`);
    // the pointer leaves: the label's glass goes as the label starts to leave, rather than standing for a frame or
    // two after it has gone (which flickered as the pointer crossed the dock)
    await h.move(bar.x + bar.w / 2, 5);
    await h.sleep(900);
    const labels = (await panes(h)).filter((p) => p.id !== at.id);
    const byId = {};
    for (const p of labels) (byId[p.id] ??= []).push(p);
    const ends = Object.values(byId).map((list) => ({ gone: !list.at(-1).shown, shapes: new Set(list.filter((p) => p.shown).map((p) => `${p.x},${p.y},${p.width},${p.height},${p.opacity}`)).size }));
    check(ends.length > 0 && ends.every((e) => e.gone), `every label's glass is taken away with it (${JSON.stringify(ends)})`);
    check(ends.every((e) => e.shapes <= 1), "and it was only ever where the label came to rest, never part way in or out");
  } finally {
    h.close();
  }
}

// ---- the Start menu: glass while it is open, gone when it closes ----
{
  const h = await startHarness({ out, window: "start", viewport: [900, 900], settings: (s) => { s.appearance.realBlur = true; } });
  try {
    await h.open(".st-root");
    await h.eval(`window.__emit("start://open", { previous: 4242 })`);
    await h.sleep(1500);
    const open = (await panes(h)).at(-1);
    const panel = await h.eval("(() => { const r = document.querySelector('.st-panel').getBoundingClientRect(); return { x: r.left, w: r.width }; })()");
    check(open && open.shown && Math.abs(open.x - panel.x) < 1 && Math.abs(open.width - panel.w) < 1, `open, the panel has its glass, where the panel is (${JSON.stringify(open)})`);
    await h.eval(`window.__emit("start://outside")`);
    await h.sleep(1500);
    const closed = (await panes(h)).at(-1);
    check(closed && !closed.shown, "closed, it is taken away");
  } finally {
    h.close();
  }
}

// ---- and with the frosted glass off nothing is asked, anywhere ----
for (const [window, ready, extra] of [["dock", ".dock-icon", ""], ["start", ".st-root", "start"], ["menubar", ".menubar", ""]]) {
  const h = await startHarness({
    out,
    window,
    viewport: [1200, 600],
    running: [],
    settings: (s) => {
      s.appearance.realBlur = false;
      s.menuBar.enabled = true;
    },
  });
  try {
    await h.open(ready);
    if (extra === "start") await h.eval(`window.__emit("start://open", { previous: 4242 })`);
    await h.sleep(2000);
    const shown = (await panes(h)).filter((p) => p.shown).length;
    const on = await h.eval("document.querySelectorAll('[data-bd]').length");
    check(shown === 0 && on === 0, `${window}: with the frosted glass off no glass is put down (${shown} panes, ${on} glasses)`);
    const grain = await h.eval("(() => { const l = document.querySelector('.bd-layer'); return l ? +getComputedStyle(l, '::before').opacity : -1; })()");
    check(grain > 0.3 && grain < 0.4, `${window}: and the grain, which is the glass's own, is still there (${grain})`);
  } finally {
    h.close();
  }
}
// ---- everything that belongs to a group has its glass: the menu bar's Control Center, the dock's context menu ----
{
  const h = await startHarness({ out, window: "menubar", viewport: [1400, 800], settings: (s) => { s.menuBar.enabled = true; s.appearance.frost.menuBar.glass = true; } });
  try {
    await h.open(".menubar");
    await h.sleep(600);
    const cc = await h.rect('.mb-item[title="Control Center"]');
    await h.click(cc.x, cc.y);
    await h.sleep(1400);
    const panel = await h.eval("(() => { const p = document.querySelector('.mb-panel'); return p ? p.dataset.bd : null; })()");
    check(panel === "glass", `the Control Center has the menu bar's glass, under its own body (${panel})`);
    const n = new Set((await panes(h)).filter((p) => p.shown).map((p) => p.id)).size;
    check(n >= 2, `the bar and the panel each have a piece of glass (${n})`);
    // open and still, with a track playing (its waveform and progress move inside it): the glass stays put
    const before = (await panes(h)).length;
    await h.sleep(2000);
    const more = (await panes(h)).slice(before);
    check(more.length === 0, `open and still, its glass is left alone, whatever moves inside it (${more.length} reports in 2 s: ${more.slice(0, 4).map((p) => p.shown).join(",")})`);
    // the bar goes out of sight and comes back without anything the glass watches saying so (an ancestor out of its
    // reach): the glass is looked for again, and comes back
    const barId = (await panes(h)).find((p) => p.shown && p.y < 20)?.id;
    const ofBar = async () => (await panes(h)).filter((p) => p.id === barId);
    await h.eval("document.documentElement.style.opacity = '0'; window.dispatchEvent(new Event('resize'))");
    await h.sleep(1000);
    const hidden = (await ofBar()).at(-1);
    await h.eval("document.documentElement.style.opacity = '1'");
    await h.sleep(1200);
    const back = (await ofBar()).at(-1);
    check(hidden && !hidden.shown && back && back.shown, `out of sight, the bar's glass goes; back in sight, it comes back on its own (${hidden?.shown} then ${back?.shown})`);
  } finally {
    h.close();
  }
}
{
  // a dropdown flies out squashed (goo): its glass waits until it is at rest, and goes when the pointer leaves
  const h = await startHarness({ out, window: "menubar", viewport: [1400, 800], settings: (s) => { s.menuBar.enabled = true; s.menuBar.closeOnLeave = true; s.appearance.frost.menuBar.glass = true; } });
  try {
    await h.open(".menubar");
    await h.sleep(600);
    const bar = new Set((await panes(h)).map((p) => p.id));
    const apple = await h.rect('[data-menu="apple"]');
    await h.click(apple.x, apple.y);
    await h.sleep(1400);
    const menu = (await panes(h)).filter((p) => !bar.has(p.id));
    const rest = await h.eval("(() => { const r = document.querySelector('.mb-menu').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()");
    const seen = menu.filter((p) => p.shown);
    check(seen.length > 0 && seen.every((p) => Math.abs(p.width - rest.w) < 1 && Math.abs(p.height - rest.h) < 1 && Math.abs(p.y - rest.y) < 1), `the dropdown's glass came only once it was at rest, where it rests (${seen.length} reports, ${JSON.stringify(seen[0])})`);
    await h.move(700, 600);
    await h.sleep(2500);
    const after = (await panes(h)).filter((p) => !bar.has(p.id));
    check(after.at(-1) && !after.at(-1).shown && after.filter((p) => p.shown).length === seen.length, "the pointer gone, the menu closes and its glass goes with it, from its first frame of leaving");
  } finally {
    h.close();
  }
}
{
  // the dock's switch on and the menu bar's off: the bar has none
  const h = await startHarness({ out, window: "menubar", viewport: [1200, 300], settings: (s) => { s.menuBar.enabled = true; s.appearance.frost.dock.glass = true; s.appearance.frost.menuBar.glass = false; } });
  try {
    await h.open(".menubar");
    await h.sleep(1200);
    check((await panes(h)).filter((p) => p.shown).length === 0, "each group has its own switch: the menu bar's off, the bar has no glass");
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
