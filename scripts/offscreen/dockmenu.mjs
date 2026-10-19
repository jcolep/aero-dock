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
  check((await h.errors()).length === 0, "no errors in the page");
  console.log("sheet:", await h.sheet(shots, "dockmenu", 600));
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
