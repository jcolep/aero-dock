// How the dock marks running apps, off screen: the dots (one under each running app), and the focus mark (one, under
// the app in front, a ghost of it under the app the pointer is on, travelling between icons as chosen).
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/marks.mjs <out folder>

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const windows = [
  { hwnd: 1, title: "Untitled", exe: "C:\\Windows\\notepad.exe", pid: 1, aumid: null, monitor: "" },
  { hwnd: 2, title: "Chat", exe: "C:\\Apps\\chat.exe", pid: 2, aumid: null, monitor: "" },
  { hwnd: 3, title: "Paint", exe: "C:\\Apps\\paint.exe", pid: 3, aumid: null, monitor: "" },
];
// the middle of the icon whose name matches, and of each mark
const iconAt = (h, name) => h.eval(`(() => { const b = [...document.querySelectorAll('button.dock-icon')].find((e) => new RegExp(${JSON.stringify(name)}, 'i').test(e.getAttribute('aria-label'))); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
const marks = (h) => h.eval(`[...document.querySelectorAll('.dock-mark')].map((m) => { const r = m.getBoundingClientRect(); return { ghost: m.classList.contains('dock-mark-ghost'), x: Math.round(r.left + r.width / 2), w: Math.round(r.width), o: +getComputedStyle(m).opacity }; })`);

// a close look at the bar, for the eye (in the out folder)
async function snap(h, name) {
  const b = await h.eval("(() => { const r = document.querySelector('.dock-bar').getBoundingClientRect(); return { x: r.left - 20, y: r.top - 30, w: r.width + 40, h: r.height + 50 }; })()");
  writeFileSync(join(out, `${name}.png`), Buffer.from(await h.shot(b.x, b.y, b.w, b.h, 2), "base64"));
}

async function dock(set) {
  const h = await startHarness({ out, window: "dock", viewport: [1400, 500], running: windows, settings: (s) => { s.dock.autoHide = false; s.dock.magnification = false; set(s); } });
  await h.open(".dock-icon");
  await h.sleep(900);
  return h;
}

{
  const h = await dock(() => {});
  try {
    const dots = await h.eval("document.querySelectorAll('.dock-indicator').length");
    check(dots === 3 && (await marks(h)).length === 0, `as it was: a dot under each running app (${dots}), no focus mark`);
  } finally {
    h.close();
  }
}

for (const motion of ["glide", "bounce", "snap", "float", "fade"]) {
  const h = await dock((s) => { s.dock.indicatorStyle = "focus"; s.dock.focusMotion = motion; s.dock.ghostMotion = motion; });
  try {
    const note = await iconAt(h, "untitled|notepad");
    const chat = await iconAt(h, "chat");
    const m0 = (await marks(h)).filter((m) => !m.ghost);
    if (motion === "glide") {
      check((await h.eval("document.querySelectorAll('.dock-indicator').length")) === 0, "the focus way: no dots");
      check(m0.length === 1 && Math.abs(m0[0].x - note.x) <= 1, `one mark, under the app in front (${JSON.stringify(m0)} for ${note.x})`);
      check(m0[0].w >= 14, `a pill (${m0[0].w}px wide)`);
    }
    // the pointer on another app: a ghost slides under it, the mark stays
    await h.move(chat.x, chat.y);
    await h.sleep(700);
    const hovering = await marks(h);
    const ghost = hovering.find((m) => m.ghost);
    const mark = hovering.find((m) => !m.ghost);
    check(ghost && Math.abs(ghost.x - chat.x) <= 1 && mark && Math.abs(mark.x - note.x) <= 1, `${motion}: pointing at another app, its ghost is under it and the mark stays put`);
    // it is clicked and comes to the front: the mark travels over, the ghost goes
    await h.record("marks", `[...document.querySelectorAll('.dock-mark:not(.dock-mark-ghost)')].map((m) => { const r = m.getBoundingClientRect(); return Math.round(r.left + r.width / 2); })`);
    await h.emit("apps://running-changed", { windows, focused: 2 });
    await h.sleep(motion === "float" || motion === "bounce" ? 1400 : 900);
    const path = (await h.recorded("marks")).map((f) => f.v).filter((v) => v && v.length);
    const xs = path.flat();
    const between = xs.filter((x) => x > Math.min(note.x, chat.x) + 3 && x < Math.max(note.x, chat.x) - 3).length;
    // (one leaving can stay a moment longer, wholly see-through, while a springy travel settles)
    const after = (await marks(h)).filter((m) => m.o > 0.01);
    check(after.length === 1 && !after[0].ghost && Math.abs(after[0].x - chat.x) <= 1, `${motion}: it ends under the new app, the ghost gone (${JSON.stringify(after)})`);
    if (motion === "fade") check(between === 0, `fade: it does not travel, it fades over (${between} frames on the way)`);
    else check(between >= 2, `${motion}: it travels there (${between} frames on the way)`);
    if (motion === "bounce") {
      const past = xs.some((x) => (chat.x > note.x ? x > chat.x + 1 : x < chat.x - 1));
      check(past, "bounce: it overshoots and comes back");
    }
    // the pointer goes: no ghost
    await h.move(5, 5);
    await h.sleep(600);
    check((await marks(h)).filter((m) => m.ghost).length === 0, `${motion}: the pointer gone, the ghost goes too`);
    check((await h.errors()).length === 0, `${motion}: no errors in the page`);
  } finally {
    h.close();
  }
}

{
  const h = await dock((s) => { s.dock.indicatorStyle = "focus"; s.dock.indicatorShape = "dot"; });
  try {
    const m = (await marks(h)).filter((x) => !x.ghost);
    check(m.length === 1 && m[0].w === 7, `the glowing dot instead of the pill (${JSON.stringify(m)})`);
  } finally {
    h.close();
  }
}
for (const stretch of [0, 0.5, 1]) {
  // Stretch with speed: drawn longer the faster it goes, longest midway, back to itself when it arrives
  const h = await dock((s) => { s.dock.indicatorStyle = "focus"; s.dock.markStretch = stretch; });
  try {
    const from = await iconAt(h, "untitled|notepad");
    const to = await iconAt(h, "paint");
    // the one most seen (the one leaving fades out as it is carried over), as drawn: its box, by its stretch
    await h.record("stretch", `(() => { const m = [...document.querySelectorAll('.dock-mark:not(.dock-mark-ghost)')].sort((a, b) => getComputedStyle(b).opacity - getComputedStyle(a).opacity)[0]; if (!m) return null; const r = m.getBoundingClientRect(); const cs = getComputedStyle(m); const sx = +(cs.getPropertyValue('--stretch-x') || 1); const sy = +(cs.getPropertyValue('--stretch-y') || 1); return { x: r.left + r.width / 2, w: r.width * sx, h: r.height * sy, sx, sy }; })()`);
    await h.emit("apps://running-changed", { windows, focused: 3 });
    if (stretch === 1) {
      await h.sleep(70);
      await snap(h, "marks-stretch");
    }
    await h.sleep(1000);
    const f =(await h.recorded("stretch")).map((x) => x.v).filter(Boolean);
    const rest = f[0].w;
    const most = f.reduce((a, b) => (b.sx > a.sx ? b : a));
    const end = f[f.length - 1];
    const along = (most.x - from.x) / (to.x - from.x);
    console.log(`     stretch ${stretch}: rest ${rest.toFixed(1)}px, most ${most.sx.toFixed(2)}x by ${most.sy.toFixed(2)} (${most.w.toFixed(1)}x${most.h.toFixed(1)}px) at ${(along * 100).toFixed(0)}% of the way, end ${end.w.toFixed(1)}px`);
    if (stretch === 0) check(most.sx === 1 && most.sy === 1, "stretch off: it is never stretched");
    else {
      check(most.sx >= 1 + stretch * 0.5 && most.sx <= 1 + stretch * 1.8 + 0.01, `stretch ${stretch}: it draws out on the way (${most.sx.toFixed(2)}x)`);
      check(most.sy < 1, `stretch ${stretch}: and thins a little as it does (${most.sy.toFixed(2)})`);
      check(along > 0.15 && along < 0.85, `stretch ${stretch}: longest along the way, not at either end`);
    }
    check(Math.abs(end.w - rest) <= 0.5 && Math.abs(end.x - to.x) <= 1, `stretch ${stretch}: arrives its own size, under the app`);
    check((await h.errors()).length === 0, `stretch ${stretch}: no errors in the page`);
  } finally {
    h.close();
  }
}
{
  // the icon jumps when it is clicked (its launch bounce): the marks stay level in their track along the bottom
  const h = await dock((s) => { s.dock.indicatorStyle = "focus"; });
  try {
    const chat = await iconAt(h, "chat");
    await h.move(chat.x, chat.y);
    await h.sleep(600);
    await h.record("levels", `(() => { const b = [...document.querySelectorAll('button.dock-icon')].find((e) => /chat/i.test(e.getAttribute('aria-label'))); const g = document.querySelector('.dock-mark-ghost'); const m = document.querySelector('.dock-mark:not(.dock-mark-ghost)'); return { icon: Math.round(b.getBoundingClientRect().top * 10) / 10, ghost: g ? Math.round(g.getBoundingClientRect().top * 10) / 10 : null, mark: m ? Math.round(m.getBoundingClientRect().top * 10) / 10 : null }; })()`);
    await h.click(chat.x, chat.y);
    await h.sleep(1100);
    const frames = (await h.recorded("levels")).map((f) => f.v);
    const icon = frames.map((f) => f.icon);
    const ghost = frames.map((f) => f.ghost).filter((v) => v !== null);
    const mark = frames.map((f) => f.mark).filter((v) => v !== null);
    const spread = (v) => (v.length ? Math.max(...v) - Math.min(...v) : 0);
    check(spread(icon) > 4, `the icon jumped when clicked (${spread(icon).toFixed(1)}px)`);
    check(ghost.length > 0 && spread(ghost) <= 1 && spread(mark) <= 1, `and the ghost and the mark stayed level in their track (moved ${spread(ghost).toFixed(1)} and ${spread(mark).toFixed(1)}px)`);
  } finally {
    h.close();
  }
}
{
  // the other running apps: faint dots in the track, or the apps that are not running dimmed
  const pins = [{ id: "p0", kind: "app", path: "C:\\Tools\\Maps.exe", name: "Maps", icon: null, children: [] }];
  const h = await dock((s) => { s.dock.indicatorStyle = "focus"; s.pinned = pins; });
  try {
    check((await h.eval("document.querySelectorAll('.dock-mark-trace').length")) === 3, "faint marks under the three running apps");
    const w = await h.eval("[...document.querySelectorAll('.dock-mark-trace, .dock-mark:not(.dock-mark-ghost)')].map((m) => Math.round(m.getBoundingClientRect().width))");
    check(w.every((x) => x === w[0]) && w[0] >= 14, `of the mark's shape (${JSON.stringify(w)})`);
    check((await h.eval("document.querySelectorAll('.dock-icon[data-idle]').length")) === 0, "and nothing dimmed");
    await snap(h, "marks-faint");
  } finally {
    h.close();
  }
  const g = await dock((s) => { s.dock.indicatorStyle = "focus"; s.dock.runningCue = "halo"; s.pinned = pins; });
  try {
    check((await g.eval("document.querySelectorAll('.dock-mark-halo').length")) === 3 && (await g.eval("document.querySelectorAll('.dock-mark-trace').length")) === 0, "a halo under each of the three running apps instead");
    await snap(g, "marks-halo");
    await g.eval("(() => { document.documentElement.dataset.surface = 'clear'; return 1; })()");
    await g.sleep(300);
    await snap(g, "marks-halo-clear");
    check((await g.errors()).length === 0, "halo: no errors in the page");
  } finally {
    g.close();
  }
  const d = await dock((s) => { s.dock.indicatorStyle = "focus"; s.dock.runningCue = "dim"; s.pinned = pins; });
  try {
    const idle = await d.eval("[...document.querySelectorAll('.dock-icon[data-idle]')].map((b) => b.getAttribute('aria-label'))");
    check(idle.length === 1 && /maps/i.test(idle[0]) && (await d.eval("document.querySelectorAll('.dock-mark-trace').length")) === 0, `dimmed instead: only the app that is not running (${JSON.stringify(idle)})`);
  } finally {
    d.close();
  }
}
process.exit(failed ? 1 : 0);
