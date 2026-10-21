// The Start menu's quick answers, result actions and right-click menus, off screen.
//
// Quick answers: a conversion, a time, a color come up as the first result (a color with its swatch), Enter copies the
// answer, a quick answer can be turned off. Actions: Ctrl+Enter runs an app as administrator, Alt+Enter shows it in its
// folder, Ctrl+C copies its path, the right arrow opens its menu beside the row (and the arrows and Enter work in it); the
// keys that do these are said under the list. Menus: an app's has its groups and its recent files (read when it opens), a
// folder's can open a terminal, the empty places of the home view have one of their own.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/startquick.mjs <out folder>
//
// Writes `startquick.png`.

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what, got) => {
  console.log(ok ? "ok  " : "FAIL", what, ok || got === undefined ? "" : `  got ${JSON.stringify(got)}`);
  if (!ok) failed = true;
};
const app = (name, targetPath) => ({ name, shortcutPath: null, targetPath, args: "", icon: null, source: "start-menu", addedMs: Date.now() - 400 * 86_400_000 });
const apps = [
  app("Notepad", "C:\\Windows\\notepad.exe"),
  app("Calculator", "C:\\Windows\\calc.exe"),
  app("Terminal", "shell:AppsFolder\\Microsoft.WindowsTerminal_8wekyb3d8bbwe!App"),
  app("Word", "C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE"),
];
const files = [
  { name: "Quarterly report.docx", path: "C:\\Docs\\Quarterly report.docx", folder: false },
  { name: "Quarterly plans", path: "C:\\Projects\\Quarterly plans", folder: true },
];

async function scenario(name, patch, body) {
  const h = await startHarness({
    out,
    window: "start",
    viewport: [760, 800],
    apps,
    files,
    settings: (s) => {
      s.start.seeded = true;
      s.start.pinned = apps.slice(0, 3).map((a) => ({ name: a.name, target: a.targetPath, args: "" }));
      patch?.(s);
    },
  });
  try {
    await h.open(".st-root");
    await h.desktop("linear-gradient(120deg,#1b2742,#4a3b6b 55%,#7a4a5a)");
    await h.eval("localStorage.clear()");
    // the clipboard here is a recorder
    await h.eval("window.__copied = []; Object.defineProperty(navigator, 'clipboard', { value: { writeText: (t) => { window.__copied.push(t); return Promise.resolve(); } }, configurable: true })");
    await h.eval(`window.__emit("start://open", { previous: 1 })`);
    await h.sleep(900);
    const q = (js) => h.eval(`(() => ${js})()`);
    const type = async (text) => {
      await q(`(() => { const i = document.querySelector('.st-search input'); i.focus(); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ${JSON.stringify(text)}); i.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
      await h.sleep(450);
    };
    const key = async (k, mods = {}) => {
      await q(`document.dispatchEvent(new KeyboardEvent('keydown', { key: ${JSON.stringify(k)}, bubbles: true, cancelable: true, ctrlKey: ${!!mods.ctrl}, altKey: ${!!mods.alt}, shiftKey: ${!!mods.shift} }))`);
      await h.sleep(160);
    };
    const sections = () => q("[...document.querySelectorAll('.st-section')].map((s) => ({ title: s.querySelector('.st-heading').textContent, rows: [...s.querySelectorAll('.st-row')].map((r) => ({ name: r.querySelector('strong').textContent, small: r.querySelector('small')?.textContent ?? '', swatch: r.querySelector('.st-icon-swatch')?.style.background ?? null, selected: r.dataset.selected })) }))");
    const calls = (cmd) => q(`window.__calls.filter((c) => c.cmd === ${JSON.stringify(cmd)}).map((c) => c.args)`);
    const menu = () => q("(() => { const m = document.querySelector('.st-menu'); return m ? [...m.children].filter((c) => !c.className.includes('bd-layer')).map((c) => (c.className.includes('sep') ? '---' : c.className.includes('heading') ? '# ' + c.textContent : c.textContent)) : null; })()");
    await body({ h, q, type, key, sections, calls, menu });
    check((await h.errors()).length === 0, `${name}: no errors in the page`);
  } finally {
    h.close();
  }
}

await scenario("quick", null, async ({ h, q, type, key, sections }) => {
  await type("5 km in miles");
  let s = await sections();
  check(s[0]?.title === "Conversion" && s[0].rows[0].name === "3.10685596 mi", "5 km in miles: the first result, a Conversion", s[0]);
  check(/Enter copies the answer/.test(s[0].rows[0].small), "...it says what Enter does");
  check((await q("document.querySelector('.st-hints')?.textContent ?? ''")).includes("Copy the answer"), "...and the keys are said under the list");
  await key("Enter");
  check((await q("window.__copied")).at(-1) === "3.10685596", "Enter copies the answer", await q("window.__copied"));
  check((await q("document.querySelector('.st-row small')?.textContent")) === "Copied", "...and the row says Copied");
  await h.sleep(1700);
  check((await q("document.querySelector('.st-row small')?.textContent")) !== "Copied", "...for a moment");

  await type("#ff8800");
  s = await sections();
  check(s[0]?.title === "Color" && s[0].rows[0].name === "#FF8800" && !!s[0].rows[0].swatch, "#ff8800: a Color with its swatch", s[0]);
  await type("time in tokyo");
  s = await sections();
  check(s[0]?.title === "Time" && /\d:\d\d [AP]M/.test(s[0].rows[0].name), "time in tokyo: a Time", s[0]);
  await type("15% of 80");
  check((await sections())[0]?.rows[0].name === "12", "15% of 80: 12");
  await type("notepad");
  s = await sections();
  check(s[0]?.title === "Apps" && !s.some((x) => ["Conversion", "Time", "Color", "Percent"].includes(x.title)), "a name that is not a question: apps first, no quick answer", s.map((x) => x.title));
  await type("12*(3+4)");
  check((await sections())[0]?.title === "Calculator", "sums still go to the calculator");
  await h.shot(0, 0, 760, 800).then(() => undefined);
});

await scenario("off", (s) => void (s.start.searchQuickAnswers = false), async ({ type, sections }) => {
  await type("5 km in miles");
  check(!(await sections()).some((x) => x.title === "Conversion"), "switched off: no quick answer");
});

await scenario("actions", null, async ({ h, q, type, key, sections, calls, menu }) => {
  await type("notepad");
  const hints = await q("document.querySelector('.st-hints')?.textContent ?? ''");
  check(/Ctrl\+Enter/.test(hints) && /Alt\+Enter/.test(hints) && /Ctrl\+C/.test(hints) === false && /→/.test(hints), "an app's keys are said: Enter, Ctrl+Enter, Alt+Enter, right arrow", hints);
  await key("Enter", { ctrl: true });
  check((await calls("launch_as_admin")).length === 1 && /notepad\.exe$/i.test((await calls("launch_as_admin"))[0].target), "Ctrl+Enter runs it as administrator", await calls("launch_as_admin"));
  // (it closes the menu, as opening an app does: open it again)
  const reopen = async () => {
    await h.eval(`window.__emit("start://open", { previous: 1 })`);
    await h.sleep(800);
    await type("");
  };
  await reopen();
  await type("notepad");
  await key("Enter", { alt: true });
  check((await calls("open_file_location")).length === 1, "Alt+Enter shows it in its folder", await calls("open_file_location"));
  await reopen();
  await type("notepad");
  await key("c", { ctrl: true });
  check((await q("window.__copied")).at(-1) === "C:\\Windows\\notepad.exe", "Ctrl+C copies its path", await q("window.__copied"));

  // the right arrow opens its menu; the arrows and Enter work in it
  await key("ArrowRight");
  let m = await menu();
  check(!!m && m[0].startsWith("Open") && m.some((l) => l.startsWith("Run as administrator")) && m.some((l) => l.startsWith("Open file location")) && m.some((l) => l.startsWith("Copy path")) && m.includes("Uninstall") && m.includes("---"), "the right arrow opens its menu, in groups", m);
  check(m.some((l) => /Ctrl\+Enter/.test(l)) && m.some((l) => /Alt\+Enter/.test(l)), "...with the key for each said at the right", m);
  const focused = () => q("document.querySelector('.st-menu [data-focus]')?.textContent ?? ''");
  check((await focused()).startsWith("Open"), "...the first line has the keys");
  await key("ArrowDown");
  check((await focused()).startsWith("Run as administrator"), "...down goes to the next", await focused());
  await key("ArrowUp");
  await key("ArrowUp");
  check((await focused()).startsWith("Uninstall"), "...up from the first wraps to the last", await focused());
  await key("Escape");
  check((await menu()) === null, "...Escape puts it away");
  // Enter on a line does it
  await key("ArrowRight");
  await key("ArrowDown");
  await key("ArrowDown");
  const third = await focused();
  await key("Enter");
  check((await menu()) === null && (third.startsWith("Pin to Start") || third.startsWith("Unpin")), `...Enter does the line (${third})`);

  // a right-click on a result
  await type("calc");
  await q("document.querySelector('.st-row').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 300, clientY: 260 }))");
  await h.sleep(200);
  m = await menu();
  check(!!m && m[0].startsWith("Open"), "a right-click on a result opens its menu", m);
  await key("Escape");

  // files and folders
  await type("quarterly");
  const s = await sections();
  const file = s.find((x) => x.title === "Files and folders");
  check(file?.rows.length === 2, "files and folders are found", s.map((x) => x.title));
  const hintFile = await q("document.querySelector('.st-hints')?.textContent ?? ''");
  check(/Copy path/.test(hintFile) && /File location/.test(hintFile), "a file's keys are said", hintFile);
  // the folder is the row the pointer is put on (which of the two scores higher is not what is being tested)
  await q("[...document.querySelectorAll('.st-row')].find((r) => r.textContent.includes('Quarterly plans')).dispatchEvent(new MouseEvent('mousemove', { bubbles: true }))");
  await h.sleep(120);
  await key("ArrowRight");
  m = await menu();
  check(!!m && m.some((l) => l.startsWith("Open in Terminal")) && m.some((l) => l.startsWith("Copy name")), "a folder's menu can open a terminal and copy its name", m);
  await key("Escape");
  await key("c", { ctrl: true });
  check((await q("window.__copied")).at(-1) === "C:\\Projects\\Quarterly plans", "Ctrl+C on a folder copies its path", await q("window.__copied"));
});

await scenario("jump", null, async ({ h, q, type, key, menu }) => {
  // an app's own recent files, read when its menu opens and put under the rest
  await h.eval("window.__jump = { appId: 'x', sections: [{ title: 'Recent', items: [{ title: 'notes.txt', kind: 'file', path: 'C:\\\\Docs\\\\notes.txt', args: '', dir: '' }, { title: 'todo.txt', kind: 'file', path: 'C:\\\\Docs\\\\todo.txt', args: '', dir: '' }] }] }; window.__jumpDelay = 250");
  await type("notepad");
  await key("ArrowRight");
  let m = await menu();
  check(!!m && !m.some((l) => l.includes("notes.txt")), "the menu opens at once, before the recent files have arrived", m);
  const before = await q("document.querySelector('.st-menu').children[0].getBoundingClientRect().top");
  await h.sleep(600);
  m = await menu();
  check(!!m && m.includes("# Recent") && m.includes("notes.txt") && m.includes("todo.txt"), "then the app's recent files are added", m);
  check(m.indexOf("Uninstall") > m.indexOf("todo.txt"), "...above Uninstall, which stays last", m);
  check(Math.abs((await q("document.querySelector('.st-menu').children[0].getBoundingClientRect().top")) - before) < 40, "...and the menu has not run off the panel");
  await q("[...document.querySelectorAll('.st-menu button')].find((b) => b.textContent.includes('notes.txt')).click()");
  await h.sleep(200);
  check((await q("window.__calls.filter((c) => c.cmd === 'jump_open').length")) === 1, "a recent file opens through the app's own list");
});

await scenario("background", null, async ({ h, q, calls, menu }) => {
  await q("document.querySelector('.st-bar h2').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 330, clientY: 100 }))");
  await h.sleep(250);
  let m = await menu();
  check(!!m && m.includes("Hide Recommended") && m.includes("Sort pinned A to Z") && m.includes("Forget what search has learned") && m.includes("Start menu settings…"), "the empty places of the home view have a menu of their own", m);
  await q("[...document.querySelectorAll('.st-menu button')].find((b) => b.textContent.startsWith('Start menu settings')).click()");
  await h.sleep(250);
  check((await calls("open_settings")).length === 1 && (await q("localStorage.getItem('liquidock.settings.pane')")) === "start", "Start menu settings opens settings on the Start section");
  // a tile has its own menu, not this one
  await h.eval(`window.__emit("start://open", { previous: 1 })`);
  await h.sleep(500);
  await q("document.querySelector('.st-tile').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 200, clientY: 200 }))");
  await h.sleep(250);
  m = await menu();
  check(!!m && m[0].startsWith("Open") && !m.includes("Hide Recommended"), "a pinned tile has its own menu, not the panel's", m);
  check((await q("document.querySelectorAll('.st-menu').length")) === 1, "...one menu only");
});
process.exit(failed ? 1 : 0);
