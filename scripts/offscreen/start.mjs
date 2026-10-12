// The Start menu, off screen: its home (search, pinned, recommended, footer),
// search (apps, Settings pages, files, a sum), the list of every app, an app's
// context menu, the keys, and what it asks of Rust when it closes.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/start.mjs <out folder>
//
// Writes `start.png`: home, a search, all apps, the context menu.

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
const names = ["Calculator", "Calendar", "Camera", "Chrome", "Clock", "Code", "Discord", "Edge", "Excel", "Files", "Firefox", "Git Bash", "Mail", "Maps", "Notepad", "OneNote", "Outlook", "Paint", "Photos", "PowerPoint", "Settings", "Spotify", "Teams", "Terminal", "Word", "7-Zip", "Xbox"];
const apps = names.map((name) => ({ name, shortcutPath: null, targetPath: `C:\\apps\\${name}.exe`, args: "", icon: null, source: "start-menu" }));
const recent = [
  { name: "Q3 budget.xlsx", path: "C:\\Users\\me\\Documents\\Finance\\Q3 budget.xlsx", icon: "", usedAt: 1 },
  { name: "Trip photos.zip", path: "C:\\Users\\me\\Downloads\\Trip photos.zip", icon: "", usedAt: 2 },
  { name: "notes.md", path: "C:\\Users\\me\\Desktop\\notes.md", icon: "", usedAt: 3 },
  { name: "Design review.pptx", path: "C:\\Users\\me\\Documents\\Design review.pptx", icon: "", usedAt: 4 },
  { name: "invoice-0412.pdf", path: "C:\\Users\\me\\Documents\\invoice-0412.pdf", icon: "", usedAt: 5 },
  { name: "wallpaper.png", path: "C:\\Users\\me\\Pictures\\wallpaper.png", icon: "", usedAt: 6 },
];
const files = [
  { name: "Weekly report.docx", path: "C:\\Users\\me\\Documents\\Weekly report.docx", folder: false },
  { name: "Reports", path: "C:\\Users\\me\\Documents\\Reports", folder: true },
];

const h = await startHarness({
  out,
  window: "start",
  viewport: [760, 800],
  apps,
  recent,
  files,
  settings: (s) => {
    // pinned in the dock: the first time the menu opens it starts from these
    s.pinned = ["Edge", "Mail", "Teams", "Outlook", "Excel", "Word", "Spotify", "Code", "Terminal", "Photos", "Calendar", "Notepad"].map((name, i) => ({
      id: String(i), kind: "app", path: `C:\\apps\\${name}.exe`, name, icon: null, children: [],
    }));
  },
});
const shots = {};
try {
  await h.open(".st-root");
  await h.desktop("linear-gradient(120deg,#1b2742,#4a3b6b 55%,#7a4a5a)");
  await h.sleep(400);
  const calls = (cmd) => h.eval(`window.__calls.filter((c) => c.cmd === ${JSON.stringify(cmd)}).map((c) => c.args)`);
  const q = (js) => h.eval(`(() => { const r = document.querySelector('.st-root'); return ${js}; })()`);

  console.log("hidden before it is opened:", await q("getComputedStyle(r.querySelector('.st-panel')).visibility === 'hidden'"));
  await h.eval(`window.__emit("start://open", { previous: 4242 })`);
  await h.sleep(900);
  console.log("open:", await q("r.dataset.phase"), " search box focused:", await q("document.activeElement === r.querySelector('input')"));
  console.log("pinned tiles (started from the dock's 12 and two more):", await q("r.querySelectorAll('.st-tile').length"));
  console.log("seeded in settings:", await h.eval("(window.__calls.filter((c) => c.cmd === 'set_settings').at(-1)?.args.settings.start.seeded)"));
  console.log("recommended files:", await q("r.querySelectorAll('.st-rec').length"), " user:", await q("r.querySelector('.st-user span')?.textContent"));
  shots.home = await h.shot(0, 0, 760, 800);

  // the search box: a thick blue border of its own, and nothing drawn by the input inside it
  console.log("input draws no ring:", await q("(() => { const s = getComputedStyle(r.querySelector('.st-search input')); return s.outlineStyle === 'none' && s.boxShadow === 'none'; })()"));
  console.log("box border (focus ring) is 3px:", await q("getComputedStyle(r.querySelector('.st-search')).boxShadow.includes(' 3px')"));
  // the shadow fades out inside the window: the panel sits 48px in from every side
  console.log("panel inset:", JSON.stringify(await q("(() => { const b = r.querySelector('.st-panel').getBoundingClientRect(); return { left: Math.round(b.left), top: Math.round(b.top), right: Math.round(innerWidth - b.right), bottom: Math.round(innerHeight - b.bottom) }; })()")));

  // the highlight glides: it appears on the first tile, and on the next it is stretched toward it part way there
  const tiles = await h.eval("[...document.querySelectorAll('.st-tile')].slice(0, 8).map((e) => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, left: b.left, top: b.top, w: b.width, h: b.height }; })");
  await h.move(tiles[0].x, tiles[0].y);
  await h.sleep(500);
  const lensAt = () => h.eval("(() => { const l = document.querySelector('.glide-highlight'); if (!l) return null; const b = l.getBoundingClientRect(); return { left: Math.round(b.left), top: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height), opacity: +getComputedStyle(l).opacity }; })()");
  console.log("on the first tile:", JSON.stringify(await lensAt()), " tile:", JSON.stringify({ left: Math.round(tiles[0].left), top: Math.round(tiles[0].top), w: Math.round(tiles[0].w), h: Math.round(tiles[0].h) }));
  shots.glide = await h.shot(0, 0, 760, 800);
  await h.move(tiles[5].x, tiles[5].y);
  const widths = [];
  for (let i = 0; i < 14; i++) {
    await h.sleep(30);
    const a = await lensAt();
    widths.push(a ? a.w : 0);
  }
  console.log("widths while it hops 5 tiles along (it stretches, then settles):", widths.join(" "), "target", Math.round(tiles[5].w) + 6);
  await h.sleep(500);
  console.log("settled on the sixth tile:", JSON.stringify(await lensAt()), " tile left:", Math.round(tiles[5].left));
  await h.move(tiles[6].x, tiles[6].y);
  await h.sleep(500);
  console.log("the glass bends what is under it:", await h.eval("getComputedStyle(document.querySelector('.glide-highlight')).backdropFilter.includes('url(')"), " above the items:", await h.eval("+getComputedStyle(document.querySelector('.glide-highlight')).zIndex > 1"));
  console.log("the lensed tile swells:", await h.eval("getComputedStyle(document.querySelector('[data-lensed]')).transform"));
  console.log("settings is a cog, not a sun:", await q("((r.querySelector('.st-link[aria-label=\"Settings\"] svg path')?.getAttribute('d') || '').match(/L/g) || []).length > 20"));
  console.log("lensed tile marked:", await q("r.querySelectorAll('[data-lensed]').length"));

  // typing goes to the box: apps, a Settings page, files
  await h.eval(`(() => { const i = document.querySelector('.st-search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, 'wor'); i.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await h.sleep(700);
  console.log("search 'wor': sections", JSON.stringify(await q("[...r.querySelectorAll('.st-heading')].map((e) => e.textContent)")), " rows", await q("r.querySelectorAll('.st-row').length"));
  console.log("first result:", await q("r.querySelector('.st-row strong')?.textContent"));
  shots.search = await h.shot(0, 0, 760, 800);

  // a sum
  await h.eval(`(() => { const i = document.querySelector('.st-search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, '12*(3+4)'); i.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await h.sleep(500);
  console.log("sum 12*(3+4):", await q("r.querySelector('.st-row strong')?.textContent"));
  // Settings pages
  await h.eval(`(() => { const i = document.querySelector('.st-search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, 'wifi'); i.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await h.sleep(500);
  console.log("'wifi' finds:", JSON.stringify(await q("[...r.querySelectorAll('.st-row strong')].map((e) => e.textContent)")));

  // Enter launches the first result and closes
  await h.eval(`(() => { const i = document.querySelector('.st-search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, 'spot'); i.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await h.sleep(500);
  await h.send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await h.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await h.sleep(500);
  console.log("Enter launched:", JSON.stringify(await calls("launch")), " closed without giving the keyboard back:", JSON.stringify(await calls("close_start")));

  // open again: all apps
  await h.eval(`window.__emit("start://open", { previous: 4242 })`);
  await h.sleep(700);
  console.log("reopened with an empty box:", await q("r.querySelector('input').value === ''"));
  const all = await h.rect(".st-pill");
  await h.click(all.x, all.y);
  await h.sleep(500);
  console.log("all apps: letters", await q("[...r.querySelectorAll('.st-letter')].map((e) => e.textContent).join('')"), " rows", await q("r.querySelectorAll('.st-all .st-row').length"));
  shots.all = await h.shot(0, 0, 760, 800);

  // right-click an app: its menu
  const row = await h.rect(".st-all .st-row");
  await h.click(row.x, row.y, "right");
  await h.sleep(400);
  console.log("menu:", JSON.stringify(await q("[...r.querySelectorAll('.st-menu button')].map((e) => e.textContent)")));
  shots.menu = await h.shot(0, 0, 760, 800);
  // pin it
  const pin = await h.rect(".st-menu button:nth-child(2)");
  await h.click(pin.x, pin.y);
  await h.sleep(500);
  console.log("pinned one more:", await h.eval("(window.__calls.filter((c) => c.cmd === 'set_settings').at(-1)?.args.settings.start.pinned.length)"));

  // Escape: the menu, then the list, then the menu itself closes and gives the keyboard back
  await h.send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await h.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await h.sleep(300);
  console.log("Escape in all apps goes back to home:", await q("!!r.querySelector('.st-pinned')"));
  await h.send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await h.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await h.sleep(500);
  console.log("Escape on home closes and restores:", JSON.stringify(await calls("close_start")), " phase:", await q("r.dataset.phase"));

  // a click elsewhere, told by Rust
  await h.eval(`window.__emit("start://open", { previous: 0 })`);
  await h.sleep(600);
  // a click elsewhere: the closing animation plays, and the window is hidden only after it
  const sent = Date.now();
  await h.eval(`window.__emit("start://outside", null)`);
  await h.sleep(40);
  console.log("40 ms in: phase", await q("r.dataset.phase"), " animation", await q("getComputedStyle(r.querySelector('.st-panel')).animationName"), " window asked to hide yet:", (await calls("close_start")).length > 3);
  await h.sleep(460);
  console.log("outside click closes:", await q("r.dataset.phase"), JSON.stringify(await calls("close_start")));

  // START_SHOTS=all,menu picks which pictures go on the sheet (it only has room for two)
  if (process.env.START_SHOTS) for (const k of Object.keys(shots)) if (!process.env.START_SHOTS.split(",").includes(k)) delete shots[k];
  // each choice of animation names its own keyframes, for opening and for closing
  const names = {};
  for (const preset of ["rise", "bloom", "genie", "slide", "fade", "none"]) {
    await h.eval(`document.querySelector(".st-root").dataset.anim = ${JSON.stringify(preset)}`);
    await h.eval(`window.__emit("start://open", { previous: 0 })`);
    await h.sleep(120);
    const open = await q("getComputedStyle(r.querySelector('.st-panel')).animationName");
    await h.eval(`window.__emit("start://outside", null)`);
    await h.sleep(60);
    const shut = await q("getComputedStyle(r.querySelector('.st-panel')).animationName");
    names[preset] = `${open} / ${shut}`;
    await h.sleep(500);
  }
  console.log("animations (open / close):", JSON.stringify(names));
  console.log("sheet:", await h.sheet(shots, "start"));
  console.log("commands the mock did not know:", JSON.stringify(await h.unknownCalls()));
} finally {
  h.close();
}
process.exit(0);
