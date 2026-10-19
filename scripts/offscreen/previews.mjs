// The dock's window previews, off screen: an app with one window says its title once, at the top, with a close bar as
// wide as the picture under it; an app with several says its name at the top and each window's title over its
// picture. Nothing in them has a hover title (the live picture is drawn by Windows over the page, and a tooltip came
// up behind it and stuck).
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/previews.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const windows = [
  { hwnd: 1, title: "American Equipment Inc. — Slides", exe: "C:\\Apps\\slides.exe", pid: 1, aumid: null, monitor: "" },
  { hwnd: 2, title: "Inbox — Mail", exe: "C:\\Apps\\mail.exe", pid: 2, aumid: null, monitor: "" },
  { hwnd: 3, title: "Calendar — Mail", exe: "C:\\Apps\\mail.exe", pid: 2, aumid: null, monitor: "" },
];
const h = await startHarness({ out, window: "dock", viewport: [1200, 520], running: windows, settings: (s) => { s.dock.autoHide = false; s.dock.magnification = false; } });
const shots = {};
try {
  await h.open(".dock-icon");
  await h.desktop("#dfe6ee");
  await h.sleep(800);
  const iconOf = (re) => h.eval(`(() => { const b = [...document.querySelectorAll('button.dock-icon')].find((e) => ${re}.test(e.getAttribute('aria-label'))); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  const look = () =>
    h.eval(`(() => { const f = document.querySelector('.windows-flyout'); if (!f) return null; const frames = [...f.querySelectorAll('.windows-preview-frame')]; const closes = [...f.querySelectorAll('.windows-flyout-close')]; return { head: f.querySelector('.windows-flyout-title').textContent, titles: [...f.querySelectorAll('.windows-preview-title')].map((e) => e.textContent), widths: frames.map((e, i) => [Math.round(e.getBoundingClientRect().width), Math.round(closes[i].getBoundingClientRect().width)]), hoverTitles: [...f.querySelectorAll('[title]')].length }; })()`);

  for (const [name, re, n] of [["one window", "/slides/i", 1], ["two windows", "/mail/i", 2]]) {
    await h.move(5, 5);
    await h.sleep(500);
    const at = await iconOf(re);
    await h.move(at.x, at.y);
    await h.sleep(1300);
    const l = await look();
    if (!l) {
      check(false, `${name}: the previews open on hover`);
      continue;
    }
    if (n === 1) {
      check(l.head === windows[0].title && l.titles.length === 0, `${name}: its title once, at the top (${JSON.stringify(l)})`);
    } else {
      check(l.head !== windows[1].title && l.titles.length === 2, `${name}: the app at the top, each window's title over its picture (${JSON.stringify(l)})`);
    }
    check(l.widths.every(([f, c]) => Math.abs(f - c) <= 1), `${name}: each close bar is as wide as its picture (${JSON.stringify(l.widths)})`);
    check(l.hoverTitles === 0, `${name}: nothing in the previews has a hover title (${l.hoverTitles})`);
    const r = await h.eval("(() => { const b = document.querySelector('.windows-flyout').getBoundingClientRect(); return { x: b.left - 20, y: b.top - 20, w: b.width + 40, h: b.height + 40 }; })()");
    shots[name] = await h.shot(Math.max(0, r.x), Math.max(0, r.y), r.w, r.h, 2);
    // the close bar warms under the pointer
    const close = await h.rect(".windows-flyout-close");
    await h.move(close.x, close.y);
    await h.sleep(350);
    const warm = await h.eval("getComputedStyle(document.querySelector('.windows-flyout-close:hover')).backgroundImage");
    check(/rgba\(255, 128, 110/.test(warm), `${name}: the close bar warms to red under the pointer`);
    if (n === 1) shots[`${name}, close under the pointer`] = await h.shot(Math.max(0, r.x), Math.max(0, r.y), r.w, r.h, 2);
  }
  // readable over a light window behind: the glass is darkened there (the Start menu's veil), and not over a dark one
  for (const [name, light, want] of [["over a dark window", 0.1, false], ["over a white window", 0.95, true]]) {
    await h.move(5, 5);
    await h.sleep(600);
    await h.eval(`window.__light = ${light}`);
    const at = await iconOf("/mail/i");
    await h.move(at.x, at.y);
    await h.sleep(1300);
    const veiled = await h.eval("(() => { const f = document.querySelector('.windows-flyout'); return f ? { veil: !!f.querySelector('.windows-flyout-veil'), flag: f.hasAttribute('data-veiled') } : null; })()");
    check(veiled && veiled.veil === want && veiled.flag === want, `${name}: ${want ? "the glass is darkened behind the titles and Close" : "nothing is added"} (${JSON.stringify(veiled)})`);
    if (want) {
      const r = await h.eval("(() => { const b = document.querySelector('.windows-flyout').getBoundingClientRect(); return { x: b.left - 20, y: b.top - 20, w: b.width + 40, h: b.height + 40 }; })()");
      await h.desktop("#f4f6f8");
      await h.sleep(200);
      shots[name] = await h.shot(Math.max(0, r.x), Math.max(0, r.y), r.w, r.h, 2);
    }
  }
  check((await h.errors()).length === 0, "no errors in the page");
  console.log("sheet:", await h.sheet(shots, "previews", 700));
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
