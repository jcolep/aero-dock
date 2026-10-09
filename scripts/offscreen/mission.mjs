// Mission Control, off screen: the overview of every window.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/mission.mjs <out folder>
//
// The backend is a mock, so "going to a window" is only the call being recorded.
// Writes `mission.png`.

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const win = (hwnd, title, exe) => ({ hwnd, title, exe, pid: hwnd, aumid: null, monitor: "" });
const h = await startHarness({
  out,
  window: "mission",
  viewport: [1920, 1080],
  running: [
    win(1, "Quarterly report.docx - Word", "C:\\Office\\winword.exe"),
    win(2, "Calendar | Microsoft Teams", "C:\\Apps\\teams.exe"),
    win(3, "aero-dock - Visual Studio Code", "C:\\Apps\\code.exe"),
    win(4, "Inbox - Outlook", "C:\\Office\\outlook.exe"),
    win(5, "Downloads", "C:\\Windows\\explorer.exe"),
    win(6, "Notes (minimised)", "C:\\Windows\\notepad.exe"),
  ],
});
const open = { monitor: "", x: 0, y: 0, width: 1920, height: 1080, scale: 1, previous: 4242 };
try {
  await h.open(".mc-root");
  await h.desktop("linear-gradient(120deg,#2b3a66,#6a5a9a)");
  await h.eval("window.__minimised = [6]");

  const cards = () => h.eval("document.querySelectorAll('.mc-card').length");
  const calls = async (name) => (await h.calls()).filter((c) => c.cmd === name);

  await h.emit("mission://open", open);
  await h.sleep(1500);
  console.log("cards:", await cards(), "(six windows)");
  const slots = (await calls("show_window_previews")).at(-1)?.args.slots ?? [];
  console.log("live pictures placed:", slots.length, "(five: the minimised window has none)");
  const inside = slots.every((s) => s.x >= 0 && s.y >= 0 && s.x + s.w <= 1920 && s.y + s.h <= 1080);
  console.log("every picture inside the screen:", inside);
  const overlap = slots.some((a, i) => slots.some((b, j) => i < j && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h));
  console.log("pictures overlap each other:", overlap);
  const shots = { grid: await h.shot(0, 0, 1920, 1080, 0.5) };

  // typing filters
  await h.eval("document.querySelector('.mc-search input').focus()");
  for (const ch of "teams") await h.send("Input.dispatchKeyEvent", { type: "char", text: ch });
  await h.sleep(900);
  console.log("cards after typing 'teams':", await cards());
  shots.filtered = await h.shot(0, 0, 1920, 1080, 0.5);

  // Enter goes to the selected window
  await h.key("Enter");
  await h.sleep(300);
  const goes = await calls("activate_window");
  console.log("Enter activated window:", JSON.stringify(goes.at(-1)?.args.hwnd), "and closed the overview:", (await calls("close_mission")).length > 0);

  // a second opening starts clean, and Escape gives the keyboard back
  await h.emit("mission://open", open);
  await h.sleep(900);
  console.log("second opening: cards", await cards(), " filter empty:", (await h.eval("document.querySelector('.mc-search input').value")) === "");
  await h.key("Escape");
  await h.sleep(300);
  const back = (await calls("activate_window")).at(-1)?.args.hwnd;
  console.log("Escape handed the keyboard back to:", back, "(4242 was in front before)");

  console.log("sheet:", await h.sheet(shots, "mission", 600));
  console.log("calls the mock did not know:", JSON.stringify(await h.unknownCalls()));
} finally {
  h.close();
}
process.exit(0);