// The glass tooltips, off screen: one appears below a menu bar button after a
// moment, the browser's own title is set aside while it shows and given back
// after, the bar's window is asked for room under it, and it goes away when the
// pointer does.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/tips.mjs <out folder>
//
// Writes `tips.png`: two tips on the bar.

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const h = await startHarness({ out, window: "menubar" });
const shots = {};
try {
  await h.open(".menubar");
  await h.desktop();
  const resizes = () => h.eval("window.__calls.filter((c) => c.cmd === 'resize_menubar').map((c) => Math.round(c.args.visibleHeight))");
  const tip = () => h.eval("(() => { const t = document.querySelector('.glass-tip'); if (!t) return null; const r = t.getBoundingClientRect(); return { text: t.textContent, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), side: t.dataset.side }; })()");
  const titleOf = () => h.eval("document.querySelector('.mb-item[title], .mb-item[data-title]')?.getAttribute('title')");

  const cc = await h.rect('.mb-item[title="Control Center"]');
  console.log("resizes at rest:", JSON.stringify(await resizes()));
  await h.move(cc.x, cc.y);
  await h.sleep(150);
  console.log("tip before the delay:", await tip());
  await h.sleep(600);
  const shown = await tip();
  console.log("tip after the delay:", JSON.stringify(shown));
  console.log("browser title set aside while it shows:", (await h.eval("document.querySelector('.mb-item[data-tip], .mb-item:not([title])') !== null")));
  console.log("button has no title while showing:", await h.eval("document.querySelectorAll('.mb-item[title=\"Control Center\"]').length === 0"));
  const bar = await h.eval("document.querySelector('.menubar').getBoundingClientRect().bottom");
  console.log("tip is below the bar:", shown && shown.y > bar, " bar bottom:", Math.round(bar));
  console.log("window asked for room under it:", JSON.stringify(await resizes()));
  shots.first = await h.shot(1380, 0, 540, 140, 2);

  // along to the next button: it comes quickly
  const search = await h.rect('.mb-item[title="Search"]');
  if (search) {
    await h.move(search.x, search.y);
    await h.sleep(220);
    console.log("next tip came quickly:", JSON.stringify(await tip()));
    shots.second = await h.shot(1380, 0, 540, 140, 2);
  }

  // away: it goes, the title comes back, the window gives the room back
  await h.move(900, 400);
  await h.sleep(500);
  console.log("tip after leaving:", await tip());
  console.log("title given back:", await h.eval("document.querySelectorAll('.mb-item[title=\"Control Center\"]').length === 1"));
  console.log("resizes now:", JSON.stringify(await resizes()));

  // pressing a button ends its tip at once
  await h.move(cc.x, cc.y);
  await h.sleep(700);
  await h.click(cc.x, cc.y);
  await h.sleep(200);
  console.log("tip after pressing:", await tip());

  // with the menu open: move off the button and back on it. The browser must still draw no tip of its
  // own (it would, in its plain style, if the title had been given back while the menu was open)
  await h.sleep(900);
  await h.move(900, 500);
  await h.sleep(200);
  console.log("away from the button, its title is back:", await h.eval("document.querySelector('.mb-item[title=\"Control Center\"]') !== null"));
  await h.move(cc.x, cc.y);
  await h.sleep(900);
  console.log("back on it, no title for the browser to draw:", await h.eval("document.querySelector('.mb-item[title=\"Control Center\"]') === null"));
  // a title that changes under the pointer (Play / Pause) is taken off again, and the tip says the new thing
  await h.move(900, 500);
  await h.sleep(600);
  const again = await h.rect('.mb-item[data-menu="control"]');
  await h.move(again.x, again.y);
  await h.sleep(700);
  await h.eval(`document.querySelector('.mb-item[data-menu="control"]').setAttribute('title', 'Changed')`);
  await h.sleep(150);
  console.log("a title set again under the pointer is taken off again:", await h.eval(`document.querySelector('.mb-item[data-menu="control"]').hasAttribute('title') === false`), " tip now says:", (await tip())?.text);
  console.log("sheet:", await h.sheet(shots, "tips"));
  console.log("commands the mock did not know:", JSON.stringify(await h.unknownCalls()));
} finally {
  h.close();
}
process.exit(0);
