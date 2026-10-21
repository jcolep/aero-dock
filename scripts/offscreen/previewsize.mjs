// The dock's window previews, off screen: Settings > Dock > Window preview size sets how wide each live picture is (its
// height follows at 3:5) and the rectangles handed to Windows to draw the pictures into are those; a middle press on a
// preview closes that window. (How the live picture is fitted into its rectangle at the window's own proportions is
// Windows' and Rust's: `cargo test fit_in` covers the arithmetic, and a real window is needed to see it.)
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/previewsize.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what, got) => {
  console.log(ok ? "ok  " : "FAIL", what, ok || got === undefined ? "" : `  got ${JSON.stringify(got)}`);
  if (!ok) failed = true;
};
const windows = [
  { hwnd: 2, title: "Inbox — Mail", exe: "C:\\Apps\\mail.exe", pid: 2, aumid: null, monitor: "" },
  { hwnd: 3, title: "Calendar — Mail", exe: "C:\\Apps\\mail.exe", pid: 2, aumid: null, monitor: "" },
];

async function shelf(width) {
  const h = await startHarness({
    out,
    window: "dock",
    viewport: [1200, 560],
    running: windows,
    settings: (s) => {
      s.dock.autoHide = false;
      s.dock.magnification = false;
      if (width) s.dock.previewWidth = width;
    },
  });
  try {
    await h.open(".dock-icon");
    await h.desktop("#dfe6ee");
    await h.sleep(800);
    const at = await h.eval(`(() => { const b = [...document.querySelectorAll('button.dock-icon')].find((e) => /mail/i.test(e.getAttribute('aria-label'))); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    await h.move(5, 5);
    await h.sleep(400);
    await h.move(at.x, at.y);
    await h.sleep(1400);
    const look = await h.eval(`(() => { const f = [...document.querySelectorAll('.windows-preview-frame')].map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }); const calls = window.__calls.filter((c) => c.cmd === 'show_window_previews'); return { frames: f, last: calls.length ? calls[calls.length - 1].args.slots.map((s) => [s.w, s.h]) : null }; })()`);
    // a middle press on the second preview
    await h.eval("document.querySelectorAll('.windows-preview-frame')[1].dispatchEvent(new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 }))");
    await h.sleep(250);
    const closed = await h.eval("window.__calls.filter((c) => c.cmd === 'close_window').map((c) => c.args.hwnd)");
    const plain = await h.eval("window.__calls.filter((c) => c.cmd === 'activate_window').length");
    await h.eval("document.querySelectorAll('.windows-preview-frame')[0]?.dispatchEvent(new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 2 }))");
    await h.sleep(150);
    const afterRight = await h.eval("window.__calls.filter((c) => c.cmd === 'close_window').length");
    return { look, closed, plain, afterRight, errors: await h.errors() };
  } finally {
    h.close();
  }
}

let r = await shelf(null);
check(r.look.frames.length === 2 && r.look.frames.every(([w, h]) => w === 200 && h === 120), "by default 200 x 120", r.look.frames);
check(JSON.stringify(r.look.last) === JSON.stringify([[200, 120], [200, 120]]), "...and those are the rectangles handed to Windows", r.look.last);
check(JSON.stringify(r.closed) === JSON.stringify([3]), "a middle press on a preview closes that window (and no other)", r.closed);
check(r.plain === 0, "...without focusing it", r.plain);
check(r.afterRight === 1, "a press of another button does not close one", r.afterRight);
check(r.errors.length === 0, "no errors in the page");

r = await shelf(280);
check(r.look.frames.every(([w, h]) => w === 280 && h === 168), "set to 280: 280 x 168", r.look.frames);
check(JSON.stringify(r.look.last) === JSON.stringify([[280, 168], [280, 168]]), "...and handed to Windows so", r.look.last);

r = await shelf(140);
check(r.look.frames.every(([w, h]) => w === 140 && h === 84), "set to 140: 140 x 84", r.look.frames);
process.exit(failed ? 1 : 0);
