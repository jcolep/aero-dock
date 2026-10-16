// The settings window, off screen: the sidebar and the section it shows, the search, the sidebar that slides in at the
// window's edge, and every section laid out without spilling sideways at any size.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/settings.mjs <out folder>
//
// Writes `settings.png`: the window wide, with its sidebar out over a narrow one, and with a search.

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const typeInto = (h, text) =>
  h.eval(`(() => { const i = document.querySelector('.settings-search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ${JSON.stringify(text)}); i.dispatchEvent(new Event('input', { bubbles: true })); })()`);
const shots = {};
const settings = (s) => {
  s.menuBar.enabled = true;
  s.appearance.accent = "#3b7dd8";
};

{
  const h = await startHarness({ out, window: "settings", viewport: [1100, 760], settings });
  try {
    await h.open(".settings-root");
    await h.eval(`localStorage.clear()`);
    await h.open(".settings-root");
    await h.sleep(800);
    const q = (js) => h.eval(`(() => ${js})()`);
    const items = await q("[...document.querySelectorAll('.sb-item')].map((e) => e.textContent)");
    check(items.length === 15 && items.includes("General") && items.includes("Support Liquidock"), `the sidebar lists every section (${items.length})`);
    check((await q("document.querySelectorAll('.sb-item .section-icon').length")) === 15, "each with its icon");
    check((await q("document.querySelector('.sb-name').textContent")) === "Liquidock", "under the app's name, Liquidock");
    check((await q("document.querySelectorAll('[data-section]').length")) === 1 && (await q("document.querySelector('.pane-title h1').textContent")) === "Color & materials", "one section shown at a time, the first to begin with");
    check((await q("getComputedStyle(document.querySelector('.sb')).position")) !== "absolute", "wide, the sidebar stands beside the page");
    shots.wide = await h.shot(0, 0, 1100, 760);

    // the sidebar shows a section, lit
    const target = await q("(() => { const e = [...document.querySelectorAll('.sb-item')].find((x) => x.textContent === 'Menu bar'); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()");
    await h.click(target.x, target.y);
    await h.sleep(500);
    check((await q("document.querySelector('[data-section]').dataset.section")) === "menubar" && (await q("document.querySelector('.sb-item[data-active=\"true\"]').textContent")) === "Menu bar", "a click on Menu bar shows it, and lights it");
    const subs = await q("[...document.querySelectorAll('.settings-sub')].map((e) => e.textContent)");
    check(subs.includes("The lens") && subs.includes("The Control Center"), `its groups have their headings (${subs.join(", ")})`);
    // rows in a group: the first rounded at the top, the last at the bottom, a hairline between
    const groups = await q("(() => { const rows = [...document.querySelectorAll('.settings-section-inner > .ctl-row')]; const second = rows.find((r) => r.previousElementSibling?.classList.contains('ctl-row')); const first = second.previousElementSibling; return { first: getComputedStyle(first).borderTopLeftRadius, mid: getComputedStyle(second).borderTopLeftRadius, line: getComputedStyle(second, '::before').content }; })()");
    check(groups.first === "12px" && groups.mid === "0px" && groups.line !== "none", `rows sit in rounded groups with hairlines between them (${JSON.stringify(groups)})`);

    // remembered: opened again, it is on Menu bar
    await h.open(".settings-root");
    await h.sleep(600);
    check((await q("document.querySelector('[data-section]')?.dataset.section")) === "menubar", "opened again, it shows the section it was left on");

    // search
    await typeInto(h, "lens");
    await h.sleep(500);
    const found = await q("[...document.querySelectorAll('[data-section]')].map((e) => e.dataset.section)");
    check(found.includes("menubar") && found.length >= 1 && (await q("document.querySelector('.pane-title h1').textContent")) === "Search", `a search for "lens" shows the sections that answer it, each under its title (${found.join(", ")})`);
    check((await q("document.querySelectorAll('.settings-section-title').length")) === found.length, "each found section has its title");
    check((await q("document.querySelectorAll('.sb-item').length")) === found.length, "and the sidebar narrows to them");
    shots.search = await h.shot(0, 0, 1100, 760);
    await typeInto(h, "magnification");
    await h.sleep(300);
    const mag = await q("[...document.querySelectorAll('[data-section]')].map((e) => e.dataset.section)");
    check(mag.includes("dock") && mag.includes("animations"), `"magnification" finds the dock and the animations (${mag.join(", ")})`);
    await typeInto(h, "zzzzqq");
    await h.sleep(300);
    check(((await q("document.querySelector('.settings-nomatch')?.textContent")) ?? "").startsWith("Nothing in the settings matches"), "a search that finds nothing says so");
    await typeInto(h, "");
    await h.sleep(300);

    // the switches that went missing are back
    await h.eval(`localStorage.setItem("liquidock.settings.pane", "dock")`);
    await h.open(".settings-root");
    await h.sleep(500);
    const labels = await q("[...document.querySelectorAll('.ctl-label')].map((e) => e.textContent)");
    for (const l of ["Automatically hide the dock", "Floating", "Magnification", "Show running apps", "Icon spacing", "Dock padding", "Bounce an icon when its app needs you"]) {
      check(labels.includes(l), `the dock has "${l}"`);
    }

    // the sidebar set to slide in at the edge: away, out at the edge, away again when the pointer leaves it
    await h.eval(`localStorage.setItem("liquidock.settings.sidebar", "edge")`);
    await h.open(".settings-root");
    await h.sleep(600);
    const sb = () => q("(() => { const r = document.querySelector('.sb').getBoundingClientRect(); return { right: r.right, out: document.querySelector('.sb').dataset.out }; })()");
    check((await sb()).right <= 0, "set to slide in at the edge, the sidebar is away");
    await h.move(400, 300);
    await h.move(3, 300);
    await h.sleep(600);
    check((await sb()).right > 200, "the pointer at the window's left edge brings it out");
    await h.move(700, 300);
    await h.sleep(1100);
    check((await sb()).right <= 0, "and it goes when the pointer leaves it");
    // the button at the top of the page brings it out until something is chosen
    const btn = await h.rect(".pane-sidebar-button");
    await h.click(btn.x, btn.y);
    await h.sleep(600);
    await h.move(700, 300);
    await h.sleep(700);
    check((await sb()).right > 200, "out by the button, it stays when the pointer goes elsewhere");
    const item = await q("(() => { const e = [...document.querySelectorAll('.sb-item')].find((x) => x.textContent === 'Animations'); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()");
    await h.click(item.x, item.y);
    await h.sleep(700);
    check((await sb()).right <= 0 && (await q("document.querySelector('[data-section]').dataset.section")) === "animations", "and goes once a section is chosen");
    await h.eval(`localStorage.setItem("liquidock.settings.sidebar", "always")`);
    check((await h.errors()).length === 0, "no errors in the page");
  } finally {
    h.close();
  }
}

// every section, at every size: nothing spills sideways, and a narrow window slides the sidebar away
const sections = ["color", "glass", "animations", "dock", "dock-items", "modes", "audio", "menubar", "start", "frame", "widgets", "accessibility", "behavior", "support", "about"];
for (const [w, hgt] of [[1280, 800], [900, 700], [620, 700], [340, 640]]) {
  const h = await startHarness({ out, window: "settings", viewport: [w, hgt], settings });
  try {
    await h.open(".settings-root");
    await h.eval(`localStorage.clear()`);
    const spills = [];
    for (const id of sections) {
      await h.eval(`localStorage.setItem("liquidock.settings.pane", "${id}")`);
      await h.open(".settings-root");
      await h.sleep(350);
      const spill = await h.eval(`(() => { const s = document.querySelector('.settings-scroll'); const edge = s.getBoundingClientRect().right; const over = [...s.querySelectorAll('.ctl-row, .ctl-segmented, .ctl-slider, .aero-button, .anim-picker, .spectrum')].filter((e) => e.getBoundingClientRect().right > edge + 0.5).map((e) => e.className.split(' ')[0]); return { scroll: s.scrollWidth - s.clientWidth, over }; })()`);
      if (spill.scroll > 0 || spill.over.length) spills.push(`${id}: ${JSON.stringify(spill)}`);
    }
    check(spills.length === 0, `${w}px wide: every section fits, nothing spills sideways${spills.length ? ` (${spills.join("; ")})` : ""}`);
    const sliding = await h.eval("document.querySelector('.settings-root').dataset.sliding");
    check(sliding === (w < 760 ? "true" : "false"), `${w}px wide: the sidebar ${w < 760 ? "slides away" : "stands beside the page"}`);
    if (w === 620) {
      await h.eval(`localStorage.setItem("liquidock.settings.pane", "dock")`);
      await h.open(".settings-root");
      await h.sleep(400);
      const btn = await h.rect(".pane-sidebar-button");
      await h.click(btn.x, btn.y);
      await h.sleep(600);
      shots.narrow = await h.shot(0, 0, w, hgt);
    }
    check((await h.errors()).length === 0, `${w}px wide: no errors in the page`);
  } finally {
    h.close();
  }
}

{
  const h = await startHarness({ out, window: "settings", viewport: [1100, 760], settings });
  try {
    if (process.env.SETTINGS_SHOTS) for (const k of Object.keys(shots)) if (!process.env.SETTINGS_SHOTS.split(",").includes(k)) delete shots[k];
    console.log("sheet:", await h.sheet(shots, "settings"));
    console.log("commands the mock did not know:", JSON.stringify(await h.unknownCalls()));
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
