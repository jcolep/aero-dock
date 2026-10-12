// The settings window, off screen: sections that fold, the sidebar, the search, and
// that what was folded is remembered.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/settings.mjs <out folder>
//
// Writes `settings.png`: the window as it first opens, with everything open and with a search.

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const h = await startHarness({ out, window: "settings", viewport: [900, 720], settings: (s) => void (s.menuBar.enabled = true) });
const shots = {};
try {
  await h.open(".settings-root");
  await h.sleep(900);
  const q = (js) => h.eval(`(() => ${js})()`);

  console.log("sections:", await q("document.querySelectorAll('[data-section]').length"), " in the sidebar:", await q("document.querySelectorAll('.settings-nav-item').length"));
  console.log("groups:", JSON.stringify(await q("[...document.querySelectorAll('.settings-group')].map((e) => e.textContent)")));
  console.log("open at first:", JSON.stringify(await q("[...document.querySelectorAll('[data-section][data-open=\"true\"]')].map((e) => e.dataset.section)")));
  console.log("a folded section shows what is in it:", JSON.stringify(await q("document.querySelector('[data-section=\"dock\"] .settings-section-blurb')?.textContent")));
  shots.first = await h.shot(0, 0, 900, 720);

  // open one by its title
  await h.eval(`document.querySelector('[data-section="dock"]').scrollIntoView()`);
  await h.sleep(300);
  const head = await h.rect('[data-section="dock"] .settings-section-head');
  await h.click(head.x, head.y);
  await h.sleep(500);
  console.log("dock opened by a click:", await q("document.querySelector('[data-section=\"dock\"]').dataset.open"), " its sub-headings:", JSON.stringify(await q("[...document.querySelectorAll('[data-section=\"dock\"] .settings-sub')].map((e) => e.textContent)")));
  console.log("a section that is open can be tabbed into, a folded one cannot:", await q("getComputedStyle(document.querySelector('[data-section=\"dock\"] .settings-section-body')).visibility + ' / ' + getComputedStyle(document.querySelector('[data-section=\"frame\"] .settings-section-body')).visibility"));

  // the sidebar goes to a section and opens it
  const nav = await h.rect(".settings-nav-item:nth-of-type(2)");
  const item = await h.eval(`[...document.querySelectorAll('.settings-nav-item')].find((e) => e.textContent === 'Menu bar')?.getBoundingClientRect().top`);
  const target = await h.eval(`(() => { const e = [...document.querySelectorAll('.settings-nav-item')].find((x) => x.textContent === 'Menu bar'); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
  await h.click(target.x, target.y);
  await h.sleep(1200);
  console.log("sidebar: Menu bar is open:", await q("document.querySelector('[data-section=\"menubar\"]').dataset.open"), " lit in the sidebar:", await q("document.querySelector('.settings-nav-item[data-active=\"true\"]')?.textContent"));
  console.log("its sub-headings:", JSON.stringify(await q("[...document.querySelectorAll('[data-section=\"menubar\"] .settings-sub')].map((e) => e.textContent)")));
  shots.menubar = await h.shot(0, 0, 900, 720);

  // remembered: the page opened again has what was left open
  await h.open(".settings-root");
  await h.sleep(700);
  console.log("after reopening, open:", JSON.stringify(await q("[...document.querySelectorAll('[data-section][data-open=\"true\"]')].map((e) => e.dataset.section)")));

  // search
  const box = await h.rect(".settings-search input");
  await h.click(box.x, box.y);
  await h.eval(`(() => { const i = document.querySelector('.settings-search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, 'lens'); i.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await h.sleep(600);
  console.log("search 'lens' shows:", JSON.stringify(await q("[...document.querySelectorAll('[data-section]')].map((e) => e.dataset.section)")), " all open:", await q("[...document.querySelectorAll('[data-section]')].every((e) => e.dataset.open === 'true')"));
  console.log("only the group with a match has a heading:", JSON.stringify(await q("[...document.querySelectorAll('.settings-group')].map((e) => e.textContent)")));
  shots.search = await h.shot(0, 0, 900, 720);
  await h.eval(`(() => { const i = document.querySelector('.settings-search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, 'zzzzqq'); i.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await h.sleep(300);
  console.log("a search that finds nothing says so:", await q("document.querySelector('.settings-nomatch')?.textContent.slice(0, 40)"));
  await h.eval(`(() => { const i = document.querySelector('.settings-search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ''); i.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await h.sleep(300);

  // expand and collapse all
  const expand = await h.rect(".settings-nav-actions button:first-child");
  await h.click(expand.x, expand.y);
  await h.sleep(600);
  console.log("expand all:", await q("[...document.querySelectorAll('[data-section]')].every((e) => e.dataset.open === 'true')"));
  const collapse = await h.rect(".settings-nav-actions button:last-child");
  await h.click(collapse.x, collapse.y);
  await h.sleep(600);
  console.log("collapse all:", await q("[...document.querySelectorAll('[data-section]')].every((e) => e.dataset.open === 'false')"));

  if (process.env.SETTINGS_SHOTS) for (const k of Object.keys(shots)) if (!process.env.SETTINGS_SHOTS.split(",").includes(k)) delete shots[k];
  console.log("sheet:", await h.sheet(shots, "settings"));
  console.log("commands the mock did not know:", JSON.stringify(await h.unknownCalls()));
} finally {
  h.close();
}
process.exit(0);
