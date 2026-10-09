// The dock, off screen: middle-click closes an app.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/dock.mjs <out folder>
//
// The backend is a mock, so "closing" is only the call being recorded: no real
// window is touched.

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const h = await startHarness({
  out,
  window: "dock",
  viewport: [1400, 500],
  // a window is matched to a pin by the full path of its program
  running: [{ hwnd: 1, title: "Untitled", exe: "C:\\Windows\\notepad.exe", pid: 1, aumid: null, monitor: "" }],
  settings: (s) => {
    // one pin that is not running, and one that is (the running window below is
    // that program's, so it joins the pin and the dock shows one icon for it)
    s.pinned = [
      { id: "idle", kind: "app", path: "C:\\Tools\\idle.exe", name: "Idle App", icon: null, children: [] },
      { id: "notes", kind: "app", path: "C:\\Windows\\notepad.exe", name: "Notes", icon: null, children: [] },
    ];
  },
});
try {
  await h.open(".dock-icon");
  await h.desktop();
  const icons = await h.eval(`[...document.querySelectorAll('button.dock-icon')].map((b) => b.getAttribute('aria-label'))`);
  console.log("icons:", JSON.stringify(icons));
  const closes = async () => (await h.calls()).filter((c) => c.cmd === "close_window").map((c) => c.args.hwnd);

  const idle = await h.rect('button.dock-icon[aria-label^="Idle App"]');
  // the running app is the icon that says it has an open window
  const running = await h.rect('button.dock-icon[aria-label$="open window"]');

  await h.click(idle.x, idle.y, "middle");
  await h.sleep(200);
  console.log("middle-click on a pin that is not running, closes asked for:", JSON.stringify(await closes()));

  await h.click(running.x, running.y, "middle");
  await h.sleep(200);
  console.log("middle-click on a pinned, running app, closes asked for:", JSON.stringify(await closes()), "(its one window has hwnd 1)");

  // and a plain left click still does not close anything
  const before = (await closes()).length;
  await h.click(running.x, running.y, "left");
  await h.sleep(200);
  console.log("a left click closes nothing more:", (await closes()).length === before);
  console.log("calls the mock did not know:", JSON.stringify(await h.unknownCalls()));
} finally {
  h.close();
}
process.exit(0);