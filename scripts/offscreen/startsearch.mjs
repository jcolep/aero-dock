// The Start menu's search and its pinned grid, off screen.
//
// Search finds apps as Windows' Start search does: by initials ("vsc" for Visual Studio Code, "rdc" for Remote Desktop
// Connection), the starts of words ("stu co"), the program's own name ("code" for Code.exe, "msedge"), slips ("vsiual"),
// and learns: what was opened for some letters comes first for them the next time. Its last row hands the letters to
// Windows' own search.
//
// The pinned grid: a tile dragged to another place goes there (the others make room), one dragged out of the grid is
// unpinned, and an app dragged from All apps is pinned where it is let go; a plain click still opens it.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/startsearch.mjs <out folder>
//
// Writes `startsearch.png`.

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const app = (name, targetPath) => ({ name, shortcutPath: null, targetPath, args: "", icon: null, source: "start-menu", addedMs: Date.now() - 400 * 86_400_000 });
const apps = [
  app("Visual Studio Code", "C:\\Users\\me\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"),
  app("Visual Studio 2022", "C:\\Program Files\\Microsoft Visual Studio\\2022\\Common7\\IDE\\devenv.exe"),
  app("Remote Desktop Connection", "C:\\Windows\\system32\\mstsc.exe"),
  app("Microsoft Edge", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"),
  app("Word", "C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE"),
  app("Windows PowerShell", "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"),
  app("Terminal", "shell:AppsFolder\\Microsoft.WindowsTerminal_8wekyb3d8bbwe!App"),
  app("Notepad", "C:\\Windows\\notepad.exe"),
  app("Snipping Tool", "C:\\Windows\\SnippingTool.exe"),
  app("Calculator", "C:\\Windows\\calc.exe"),
  app("Paint", "C:\\Windows\\paint.exe"),
  app("Vivaldi", "C:\\Apps\\vivaldi.exe"),
];
const pins = ["Microsoft Edge", "Word", "Terminal", "Notepad", "Calculator", "Paint", "Snipping Tool"];

const h = await startHarness({
  out,
  window: "start",
  viewport: [760, 800],
  apps,
  settings: (s) => {
    s.start.seeded = true;
    s.start.pinned = pins.map((n) => {
      const a = apps.find((x) => x.name === n);
      return { name: a.name, target: a.targetPath, args: "" };
    });
  },
});
const shots = {};
try {
  await h.open(".st-root");
  await h.desktop("linear-gradient(120deg,#1b2742,#4a3b6b 55%,#7a4a5a)");
  await h.eval("localStorage.clear()");
  await h.eval(`window.__emit("start://open", { previous: 1 })`);
  await h.sleep(900);
  const type = async (text) => {
    await h.eval(`(() => { const i = document.querySelector('.st-search input'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ${JSON.stringify(text)}); i.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    await h.sleep(350);
  };
  const results = () => h.eval("[...document.querySelectorAll('.st-section')].map((s) => [s.querySelector('.st-heading').textContent, [...s.querySelectorAll('.st-row strong')].map((e) => e.textContent)])");
  const appsFound = async () => ((await results()).find(([t]) => t === "Apps") ?? ["", []])[1];

  for (const [typed, want, how] of [
    ["vsc", "Visual Studio Code", "initials"],
    ["rdc", "Remote Desktop Connection", "initials"],
    ["stu co", "Visual Studio Code", "starts of words"],
    ["vscode", "Visual Studio Code", "initials and a word"],
    ["code", "Visual Studio Code", "the program's name (Code.exe)"],
    ["msedge", "Microsoft Edge", "the program's name"],
    ["winword", "Word", "the program's name"],
    ["mstsc", "Remote Desktop Connection", "the program's name"],
    ["vsiual", "Visual Studio Code", "a slip"],
    ["powershel", "Windows PowerShell", "the start of a word"],
    ["termnal", "Terminal", "a slip"],
    ["snip", "Snipping Tool", "the name's start"],
  ]) {
    await type(typed);
    const found = await appsFound();
    check(found[0] === want || (how === "a slip" && found.includes(want)), `"${typed}" finds ${want} (${how}): ${JSON.stringify(found.slice(0, 4))}`);
  }
  await type("vsc");
  shots["vsc"] = await h.shot(0, 0, 760, 800);
  // a word with no match finds nothing in apps, and Windows' own search is offered last
  await type("zzqx");
  const none = await results();
  check(!none.some(([t]) => t === "Apps") && none.at(-1)?.[0] === "Windows" && /Search Windows for “zzqx”/.test(none.at(-1)[1][0]), `"zzqx": no apps, and "Search Windows" last (${JSON.stringify(none)})`);
  // choosing it asks Rust to hand the letters over, and the menu closes
  await h.eval("window.__calls.length = 0");
  const winRow = await h.eval("(() => { const rows = [...document.querySelectorAll('.st-row')]; const r = rows.at(-1).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()");
  await h.click(winRow.x, winRow.y);
  await h.sleep(300);
  const asked = await h.eval("window.__calls.filter((c) => c.cmd === 'windows_search').map((c) => c.args.query)");
  check(JSON.stringify(asked) === JSON.stringify(["zzqx"]), `"Search Windows" hands over what was typed (${JSON.stringify(asked)})`);
  await h.sleep(800);

  // learning: for "vis" both Visual Studios match alike (2022 first, by name); open Visual Studio Code for "vis"
  // twice, and it comes first for "vis", and for "v"
  await h.eval(`window.__emit("start://open", { previous: 1 })`);
  await h.sleep(900);
  await type("vis");
  const before = await appsFound();
  for (let n = 0; n < 2; n++) {
    await type("v");
    await type("vis");
    const row = await h.eval("(() => { const b = [...document.querySelectorAll('.st-row')].find((e) => e.querySelector('strong')?.textContent === 'Visual Studio Code'); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()");
    await h.click(row.x, row.y);
    await h.sleep(800);
    await h.eval(`window.__emit("start://open", { previous: 1 })`);
    await h.sleep(900);
  }
  await type("vis");
  const learned = await appsFound();
  await type("v");
  const learnedV = await appsFound();
  check(before[0] !== "Visual Studio Code" && learned[0] === "Visual Studio Code" && learnedV[0] === "Visual Studio Code", `what was opened for "vis" comes first for it, and for "v" (before ${JSON.stringify(before.slice(0, 3))}, after ${JSON.stringify(learned.slice(0, 3))}, "v" ${JSON.stringify(learnedV.slice(0, 3))})`);
  await type("");
  await h.sleep(300);

  // ---- the pinned grid ----
  const tiles = () => h.eval("[...document.querySelectorAll('.st-pinned .st-tile:not([data-gap])')].map((e) => e.querySelector('span').textContent)");
  const tileAt = (i) => h.eval(`(() => { const r = document.querySelectorAll('.st-pinned .st-tile')[${i}].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; })()`);
  const saved = () => h.eval("(window.__calls.filter((c) => c.cmd === 'set_settings').at(-1)?.args.settings.start.pinned || []).map((p) => p.name)");
  const dragTo = async (from, to, steps = 12, record) => {
    await h.down(from.x, from.y);
    for (let i = 1; i <= steps; i++) {
      await h.held(from.x + ((to.x - from.x) * i) / steps, from.y + ((to.y - from.y) * i) / steps);
      await h.sleep(16);
    }
    await h.sleep(300);
    if (record) shots[record] = await h.shot(0, 0, 760, 800);
    await h.up(to.x, to.y);
    await h.sleep(700);
  };
  const start = await tiles();
  check(JSON.stringify(start) === JSON.stringify(pins), `the pins as set (${JSON.stringify(start)})`);
  // a click still opens
  await h.eval("window.__calls.length = 0");
  const t0 = await tileAt(0);
  await h.click(t0.x, t0.y);
  await h.sleep(300);
  check((await h.eval("window.__calls.filter((c) => c.cmd === 'launch').length")) === 1, "a click on a pinned tile still opens it");
  await h.sleep(700);
  await h.eval(`window.__emit("start://open", { previous: 1 })`);
  await h.sleep(900);

  // Edge (first) to the fourth place
  await h.eval("window.__calls.length = 0");
  await dragTo(await tileAt(0), await tileAt(3), 12, "dragging Edge to the fourth place");
  const moved = await tiles();
  check(JSON.stringify(moved) === JSON.stringify(["Word", "Terminal", "Notepad", "Microsoft Edge", "Calculator", "Paint", "Snipping Tool"]) && JSON.stringify(await saved()) === JSON.stringify(moved), `dragged to the fourth place, it goes there and is saved (${JSON.stringify(moved)})`);
  check((await h.eval("window.__calls.filter((c) => c.cmd === 'launch').length")) === 0, "letting go of a drag opens nothing");

  // Paint out of the grid, below it: unpinned
  const paint = await tileAt(5);
  await dragTo(paint, { x: paint.x, y: 700 }, 12, "dragging Paint out (unpin)");
  const unpinned = await tiles();
  check(!unpinned.includes("Paint") && unpinned.length === 6 && JSON.stringify(await saved()) === JSON.stringify(unpinned), `dragged out of the grid, it is unpinned (${JSON.stringify(unpinned)})`);

  // Vivaldi from All apps, onto the second place: pinned there
  const allPill = await h.rect(".st-bar .st-pill");
  await h.click(allPill.x, allPill.y);
  await h.sleep(600);
  const viv = await h.eval("(() => { const b = [...document.querySelectorAll('.st-all-list .st-row')].find((e) => e.textContent.includes('Vivaldi')); b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return { x: r.left + 60, y: r.top + r.height / 2 }; })()");
  await h.down(viv.x, viv.y);
  await h.held(viv.x + 10, viv.y - 10);
  await h.sleep(400);
  const onHome = await h.eval("!!document.querySelector('.st-pinned')");
  const second = await tileAt(1);
  for (let i = 1; i <= 12; i++) {
    await h.held(viv.x + 10 + ((second.x - viv.x - 10) * i) / 12, viv.y - 10 + ((second.y - viv.y + 10) * i) / 12);
    await h.sleep(16);
  }
  await h.sleep(300);
  shots["dragging Vivaldi in from All apps"] = await h.shot(0, 0, 760, 800);
  await h.up(second.x, second.y);
  await h.sleep(700);
  const withViv = await tiles();
  check(onHome && withViv[1] === "Vivaldi" && withViv.length === 7 && (await saved())[1] === "Vivaldi", `dragged from All apps, Pinned comes up and it is pinned where let go (${JSON.stringify(withViv)})`);
  shots["after"] = await h.shot(0, 0, 760, 800);

  check((await h.errors()).length === 0, "no errors in the page");
} finally {
  h.close();
}

// A tile dragged past its neighbour: the neighbour slides over several frames instead of jumping a whole tile, and a name
// too long for the carried tile is cut with an ellipsis inside it (two lines at most; one long word is cut as well).
{
  const long = "Extraordinarily-Long-Application-Name-With-No-Spaces-To-Wrap-At Professional Enterprise Edition";
  const set = [...apps.slice(0, 4), app(long, "C:\\Apps\\long.exe")];
  const g = await startHarness({
    out,
    window: "start",
    viewport: [760, 800],
    apps: set,
    settings: (s) => {
      s.start.seeded = true;
      s.start.pinned = set.map((a) => ({ name: a.name, target: a.targetPath, args: "" }));
    },
  });
  try {
    await g.open(".st-root");
    await g.eval(`window.__emit("start://open", { previous: 1 })`);
    await g.sleep(900);
    const tile = (i) => g.eval(`(() => { const r = document.querySelectorAll('.st-pinned .st-tile')[${i}].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    const from = await tile(4);
    const to = await tile(0);
    await g.down(from.x, from.y);
    await g.held(from.x - 14, from.y);
    await g.sleep(150);
    await g.eval("window.__nb = document.querySelectorAll('.st-pinned .st-tile')[0]; true");
    await g.record("nb", "Math.round(window.__nb.getBoundingClientRect().left * 10) / 10");
    for (let i = 1; i <= 24; i++) {
      await g.held(from.x + ((to.x - from.x) * i) / 24, from.y);
      await g.sleep(16);
    }
    await g.sleep(300);
    const film = (await g.recorded("nb")).map((s) => s.v);
    const steps = film.map((v, i) => (i ? +(v - film[i - 1]).toFixed(1) : 0)).filter((d) => d !== 0);
    const tileW = await g.eval("Math.round(document.querySelectorAll('.st-pinned .st-tile')[1].getBoundingClientRect().width)");
    const big = Math.max(0, ...steps.map(Math.abs));
    check(steps.length > 6 && big < tileW * 0.4, `a neighbour slides over ${steps.length} frames, never more than ${big}px in one (a tile is ${tileW}px)`);
    const ghost = await g.eval(`(() => { const gh = document.querySelector('.st-ghost'); if (!gh) return null; const s = gh.querySelector('span'); const cs = getComputedStyle(s); return { w: Math.round(gh.getBoundingClientRect().width), spanW: Math.round(s.getBoundingClientRect().width), clipped: s.scrollHeight > s.clientHeight || s.scrollWidth > s.clientWidth, overflow: cs.overflow, ellipsis: cs.textOverflow, clamp: cs.webkitLineClamp, text: s.textContent.length }; })()`);
    check(ghost && ghost.spanW <= ghost.w && ghost.ellipsis === "ellipsis" && ghost.clamp === "2" && ghost.overflow === "hidden", `the carried tile keeps its name inside it: ellipsis, two lines (${JSON.stringify(ghost)})`);
    shots["a long name, carried"] = await g.shot(0, 0, 760, 800);
    await g.up(to.x, to.y);
    await g.sleep(500);
    check((await g.errors()).length === 0, "no errors in the page");
    console.log("sheet:", await g.sheet(shots, "startsearch", 500));
  } finally {
    g.close();
  }
}
process.exit(failed ? 1 : 0);
