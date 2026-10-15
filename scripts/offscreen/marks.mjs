// How the dock marks running apps, off screen: the dots (one under each running app), and the focus mark (one, under
// the app in front, a ghost of it under the app the pointer is on, travelling between icons as chosen).
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/marks.mjs <out folder>

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
process.exit(failed ? 1 : 0);
