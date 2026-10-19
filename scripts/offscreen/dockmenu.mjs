// The dock's own menu, off screen: a right-click on the dock's empty space opens it above the click (Liquidock's
// settings, auto-hide and magnification switches, the taskbar's window arrangements, Task Manager, taskbar
// settings), each item asks for the right thing, and a right-click on an icon still opens the icon's menu, while
// one in the empty room above the dock opens nothing.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/dockmenu.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const windows = [{ hwnd: 1, title: "Untitled", exe: "C:\\Windows\\notepad.exe", pid: 1, aumid: null, monitor: "" }];
const h = await startHarness({ out, window: "dock", viewport: [1300, 560], running: windows, settings: (s) => { s.dock.autoHide = false; s.dock.magnification = true; } });
const shots = {};
try {
  await h.open(".dock-icon");
  await h.desktop("#5b6f8f");
  await h.sleep(800);
  const q = (js) => h.eval(`(() => ${js})()`);
  const bar = await q("(() => { const r = document.querySelector('.dock-body').getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; })()");
  const menuRows = () => q("[...document.querySelectorAll('.dock-menu .aero-menu-item')].map((b) => ({ text: b.textContent.trim(), on: b.getAttribute('aria-checked') }))");
  const calls = () => q("window.__calls.map((c) => c.cmd + (c.args?.kind ? ':' + c.args.kind : '') + (c.args?.target ? ':' + c.args.target : ''))");
  const rightAt = async (x, y) => {
    await h.move(x, y);
    await h.sleep(200);
    await h.click(x, y, "right");
    await h.sleep(500);
  };
  const awayClick = async () => {
    await h.click(bar.r + 200, bar.t - 150);
    await h.sleep(400);
  };

  // the bar's empty padding at its left end
  await rightAt(bar.l + 5, (bar.t + bar.b) / 2);
  const rows = await menuRows();
  console.log("     rows:", rows.map((r) => r.text + (r.on ? ` [${r.on}]` : "")).join(" | "));
  check(rows[0]?.text === "Liquidock Settings…", "a right-click on the dock's empty space opens its menu, Liquidock's settings first");
  for (const want of ["Automatically hide the dock", "Magnification", "Cascade windows", "Show windows stacked", "Show windows side by side", "Show the desktop", "Task Manager", "Taskbar settings"]) {
    check(rows.some((r) => r.text === want), `it has "${want}"`);
  }
  check(rows.find((r) => r.text === "Automatically hide the dock")?.on === "false" && rows.find((r) => r.text === "Magnification")?.on === "true", "its switches say how they are set");
  const menuBox = await q("(() => { const r = document.querySelector('.dock-menu').getBoundingClientRect(); return { b: r.bottom, t: r.top }; })()");
  check(menuBox.b <= bar.t + 1, `it opens above the dock (${menuBox.b.toFixed(0)} over the bar's top at ${bar.t.toFixed(0)})`);
  await h.sleep(500);
  shots["right-click on the dock"] = await h.shot(0, 0, 1300, 560);

  // each item asks for the right thing
  const tries = [
    ["Liquidock Settings…", "open_settings"],
    ["Cascade windows", "system_action:cascade"],
    ["Show windows stacked", "system_action:stacked"],
    ["Show windows side by side", "system_action:sideBySide"],
    ["Show the desktop", "system_action:desktop"],
    ["Task Manager", "system_action:taskmgr"],
    ["Taskbar settings", "launch:ms-settings:taskbar"],
  ];
  for (const [label, want] of tries) {
    await rightAt(bar.l + 5, (bar.t + bar.b) / 2);
    const before = (await calls()).length;
    const at = await q(`(() => { const b = [...document.querySelectorAll('.dock-menu .aero-menu-item')].find((x) => x.textContent.trim() === ${JSON.stringify(label)}); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    await h.click(at.x, at.y);
    await h.sleep(500);
    const made = (await calls()).slice(before);
    const open = await q("!!document.querySelector('.dock-menu')");
    check(made.includes(want) && !open, `"${label}" asks for ${want}, and the menu closes (${made.filter((c) => !c.startsWith("set_glass") && !c.startsWith("resize")).join(", ")})`);
  }
  // an icon keeps its own menu
  const icon = await q("(() => { const r = document.querySelector('button.dock-icon').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()");
  await awayClick();
  await rightAt(icon.x, icon.y);
  const iconMenu = await q("({ icon: !!document.querySelector('.aero-menu:not(.dock-menu)'), dock: !!document.querySelector('.dock-menu') })");
  check(iconMenu.icon && !iconMenu.dock, `a right-click on an icon still opens the icon's menu, not the dock's (${JSON.stringify(iconMenu)})`);
  // and it stays, with the pointer resting on the icon (the hover previews used to replace it after half a second)
  await h.sleep(1100);
  const later = await q("({ menu: !!document.querySelector('.aero-menu:not(.dock-menu)'), previews: !!document.querySelector('.windows-flyout') })");
  check(later.menu && !later.previews, `the icon's menu stays open with the pointer resting on the icon (${JSON.stringify(later)})`);
  await h.eval("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))");
  await h.sleep(500);

  // a switch flips its setting
  await rightAt(bar.l + 5, (bar.t + bar.b) / 2);
  const before = (await q("window.__calls.length"));
  const sw = await q("(() => { const b = [...document.querySelectorAll('.dock-menu .aero-menu-item')].find((x) => x.textContent.trim() === 'Automatically hide the dock'); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()");
  await h.click(sw.x, sw.y);
  await h.sleep(500);
  const saved = await q(`window.__calls.slice(${before}).filter((c) => c.cmd === 'set_settings').map((c) => c.args.settings?.dock?.autoHide ?? c.args.next?.dock?.autoHide ?? null)`);
  check(saved.includes(true), `"Automatically hide the dock" turns auto-hide on (${JSON.stringify(saved)})`);

  // the empty room above the dock is not the dock
  await rightAt((bar.l + bar.r) / 2, bar.t - 140);
  check(!(await q("!!document.querySelector('.dock-menu')")), "a right-click in the empty room above the dock opens nothing");

  // an app's Jump List, at the top of its menu, as on the taskbar: Remote Desktop's recent connections and a task
  await h.eval(`window.__jump = { appId: "Microsoft.Windows.RemoteDesktop", sections: [
    { title: "Recent", items: [
      { title: "sw-dwa-03", kind: "link", path: "C:\\\\Windows\\\\System32\\\\mstsc.exe", args: '/v:"sw-dwa-03"', dir: "" },
      { title: "sw-dwl-01", kind: "link", path: "C:\\\\Windows\\\\System32\\\\mstsc.exe", args: '/v:"sw-dwl-01"', dir: "" } ] },
    { title: "Tasks", items: [ { title: "New connection", kind: "link", path: "C:\\\\Windows\\\\System32\\\\mstsc.exe", args: "", dir: "" } ] } ] }`);
  await rightAt(icon.x, icon.y);
  await h.sleep(300);
  const jumpRows = await q("[...document.querySelectorAll('.aero-menu:not(.dock-menu) .aero-menu-jump .aero-menu-heading, .aero-menu:not(.dock-menu) .aero-menu-jump-item')].map((e) => e.textContent.trim())");
  check(JSON.stringify(jumpRows) === JSON.stringify(["Recent", "sw-dwa-03", "sw-dwl-01", "Tasks", "New connection"]), `the app's Jump List heads its menu (${JSON.stringify(jumpRows)})`);
  const firstItem = await q("(() => { const items = [...document.querySelectorAll('.aero-menu:not(.dock-menu) .aero-menu-item')]; return items[0]?.classList.contains('aero-menu-jump-item'); })()");
  check(firstItem, "above the menu's own items");
  shots["jump list"] = await h.shot(Math.max(0, icon.x - 160), Math.max(0, icon.y - 470), 320, 450);
  const before2 = await q("window.__calls.length");
  const conn = await q("(() => { const r = document.querySelector('.aero-menu-jump-item').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()");
  await h.click(conn.x, conn.y);
  await h.sleep(400);
  const opened = await q(`window.__calls.slice(${before2}).filter((c) => c.cmd === 'jump_open').map((c) => c.args.item.args)`);
  check(JSON.stringify(opened) === JSON.stringify(['/v:"sw-dwa-03"']) && !(await q("!!document.querySelector('.aero-menu:not(.dock-menu)')")), `clicking a connection opens it, and the menu closes (${JSON.stringify(opened)})`);
  // a long list: four sections of ten. The menu keeps to the window (its top is not cut off), its own items stay in
  // view at the bottom, and the list scrolls instead
  await h.eval(`window.__jump = { appId: "x", sections: ["Pinned", "Recent", "Frequent", "Tasks"].map((t) => ({ title: t, items: Array.from({ length: 10 }, (_, i) => ({ title: t + " " + (i + 1), kind: "link", path: "C:\\\\x.exe", args: String(i), dir: "" })) })) }`);
  await rightAt(icon.x, icon.y);
  await h.sleep(400);
  const fit = await q(`(() => {
    const m = document.querySelector('.aero-menu:not(.dock-menu)'); const r = m.getBoundingClientRect();
    const items = [...m.querySelectorAll(':scope > div > .aero-menu-item')]; const last = items[items.length - 1]?.getBoundingClientRect();
    const j = m.querySelector('.aero-menu-jump');
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), lastBottom: last ? Math.round(last.bottom) : null, lastText: items[items.length - 1]?.textContent, scrolls: j.scrollHeight > j.clientHeight + 4, labels: [...m.querySelectorAll('.aero-menu-item')].map((b) => b.textContent.trim()) };
  })()`);
  check(fit.top >= 0, `a long Jump List: the menu's top stays inside the window (top ${fit.top})`);
  check(fit.lastBottom !== null && fit.lastBottom <= fit.bottom, `and its own last item is in view ("${fit.lastText}")`);
  check(fit.scrolls, "the Jump List scrolls instead");
  const whole = await q(`(() => {
    const j = document.querySelector('.aero-menu-jump'); const top = j.getBoundingClientRect().top; const h = j.clientHeight;
    const rows = [...j.querySelectorAll('.aero-menu-heading, .aero-menu-jump-item')].map((e) => { const r = e.getBoundingClientRect(); return { t: r.top - top, b: r.bottom - top, heading: e.classList.contains('aero-menu-heading') }; });
    const cut = rows.filter((r) => r.t < h - 0.5 && r.b > h + 0.5);
    const lastShown = rows.filter((r) => r.b <= h + 0.5).pop();
    return { cut: cut.length, lastIsHeading: !!lastShown?.heading, more: j.hasAttribute('data-more') };
  })()`);
  check(whole.cut === 0 && !whole.lastIsHeading, `the list ends on a whole row, not half of one or a lone heading (${JSON.stringify(whole)})`);
  check(whole.more, "and fades at its foot, where there is more");
  check(!fit.labels.includes("Dock settings…") && !fit.labels.some((l) => l.startsWith("Audio output")), "no \"Dock settings…\", and no \"Audio output\" unless it is switched on");
  shots["long jump list"] = await h.shot(Math.max(0, icon.x - 160), 0, 320, Math.min(560, fit.bottom + 20));
  await awayClick();

  // read ahead: with Windows slow to answer (0.8 s), an app whose icon the pointer has rested on opens its menu with
  // the list already in it
  await h.eval(`window.__jumpDelay = 800; window.__jump = { appId: "y", sections: [{ title: "Recent", items: [{ title: "kept one", kind: "link", path: "C:\\\\y.exe", args: "", dir: "" }] }] }`);
  await h.move(icon.x + 2, icon.y);
  await h.sleep(1200);
  await h.click(icon.x + 2, icon.y, "right");
  await h.sleep(120);
  const early = await q("[...document.querySelectorAll('.aero-menu-jump-item')].map((b) => b.textContent.trim())");
  check(early.length > 0, `the list kept for the app is in the menu as it opens (${early.length} entries at 120 ms)`);
  await h.sleep(1000);
  const fresh = await q("[...document.querySelectorAll('.aero-menu-jump-item')].map((b) => b.textContent.trim())");
  check(JSON.stringify(fresh) === JSON.stringify(["kept one"]), `and the fresh read replaces it when it comes (${JSON.stringify(fresh)})`);
  await h.eval("window.__jump = null; window.__jumpDelay = 0");
  await awayClick();

  // nor on the dock's own things: the Recycle Bin (which empties on a right-click, its own) and the clock
  for (const [what, sel] of [["the Recycle Bin", ".widget-chip-button:last-of-type"], ["the clock", ".widget-clock-button"]]) {
    const r = await q(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) {
      console.log(`     (no ${what} in this dock)`);
      continue;
    }
    await rightAt(r.x, r.y);
    check(!(await q("!!document.querySelector('.dock-menu')")), `a right-click on ${what} does not open the dock's menu`);
    await awayClick();
  }
  check((await h.errors()).length === 0, "no errors in the page");
  console.log("sheet:", await h.sheet(shots, "dockmenu", 600));
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
