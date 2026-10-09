// An app asking for attention, off screen: its dock icon wears a dot and bounces
// until the app is looked at.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/attention.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const windows = [
  { hwnd: 1, title: "Untitled", exe: "C:\\Windows\\notepad.exe", pid: 1, aumid: null, monitor: "" },
  { hwnd: 2, title: "Chat", exe: "C:\\Apps\\chat.exe", pid: 2, aumid: null, monitor: "" },
];
const h = await startHarness({
  out,
  window: "dock",
  viewport: [1400, 500],
  running: windows,
});
try {
  await h.open(".dock-icon");
  await h.desktop();
  const label = (n) => h.eval(`[...document.querySelectorAll('button.dock-icon')].map((b) => b.getAttribute('aria-label'))[${n}]`);
  const chat = `button.dock-icon[aria-label^="Chat"], button.dock-icon[aria-label^="chat"]`;
  console.log("labels before:", JSON.stringify(await h.eval(`[...document.querySelectorAll('button.dock-icon')].map((b) => b.getAttribute('aria-label'))`)));
  console.log("dots before:", await h.eval("document.querySelectorAll('.dock-attention').length"));

  // the chat app (window 2, in the background: window 1 has the focus) flashes
  await h.record("hop", `(() => { const b = [...document.querySelectorAll('button.dock-icon')].find((e) => /chat/i.test(e.getAttribute('aria-label'))); return b ? getComputedStyle(b).transform : null; })()`);
  await h.emit("apps://attention", 2);
  await h.sleep(1200);
  console.log("dots after the flash:", await h.eval("document.querySelectorAll('.dock-attention').length"));
  console.log("label now:", JSON.stringify(await h.eval(`[...document.querySelectorAll('button.dock-icon')].map((b) => b.getAttribute('aria-label')).find((l) => /attention/.test(l))`)));
  const frames = (await h.recorded("hop")).map((f) => f.v);
  const moved = new Set(frames.filter(Boolean)).size;
  console.log("distinct transforms while it hopped:", moved, "(more than a few means it moved)");

  // looking at it ends the asking
  await h.emit("apps://running-changed", { windows, focused: 2 });
  await h.sleep(600);
  console.log("dots after it was focused:", await h.eval("document.querySelectorAll('.dock-attention').length"));

  // a flash from the window that already has the focus is ignored
  await h.emit("apps://attention", 2);
  await h.sleep(300);
  console.log("dots after a flash from the focused window:", await h.eval("document.querySelectorAll('.dock-attention').length"));
  console.log("calls the mock did not know:", JSON.stringify(await h.unknownCalls()));
} finally {
  h.close();
}
process.exit(0);