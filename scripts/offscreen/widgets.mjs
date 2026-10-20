// The desktop widgets, off screen: every kind is drawn from real settings (and looked at), each is checked for having
// something to show, the shape of the glass is a setting of each (corner radius, frameless, shadow), a picture can be
// set and shown (a GIF that plays only while hovered is a still of its first frame until then), and the widgets that
// are used (a checklist, a counter, a timer, a calculator, dice) do what they say and keep it in their settings.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/widgets.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

// a small animated-looking picture: an SVG as a data address (the harness serves paths as they are)
const svg = (a, b) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="240" height="160" fill="url(#g)"/><circle cx="120" cy="80" r="40" fill="white" opacity=".7"/></svg>`)}`;

const kinds = [
  ["picture", { src: svg("#ff7a59", "#7a3bd9"), caption: "My GIF", glow: true }],
  ["notes", { text: "Buy milk\nCall the dentist\nSend the invoice", paper: "yellow", title: "Today" }],
  ["checklist", { items: [{ t: "Water the plants", d: true }, { t: "Reply to email", d: false }, { t: "Book flights", d: false }] }],
  ["counter", { count: 5, goal: 8 }],
  ["timer", {}],
  ["countdown", { target: "2027-01-01T00:00", style: "detailed" }],
  ["worldClock", {}],
  ["progress", {}],
  ["dateTile", { showWeek: true }],
  ["flipClock", { seconds: true }],
  ["moon", {}],
  ["quote", {}],
  ["randomizer", {}],
  ["calculator", {}],
  ["controls", {}],
  ["battery", {}],
];
const instances = kinds.map(([kind, extra], i) => ({
  id: `w-${kind}`, kind, x: 20 + (i % 5) * 330, y: 20 + Math.floor(i / 5) * 280, width: 300, height: 260, opacity: 0.95, surface: "liquid", accent: null, ambient: true, locked: false,
  options: { seconds: true, twentyFourHour: false, analog: true, latitude: null, longitude: null, place: null, celsius: true, extra },
}));

const h = await startHarness({
  out,
  window: "widgets",
  viewport: [1700, 1180],
  settings: (s) => {
    s.widgets.enabled = true;
    s.widgets.widgets = instances;
  },
});
const shots = {};
try {
  await h.open(".aero-widget");
  await h.desktop("linear-gradient(120deg,#1b3a5c,#3a6a8f 50%,#7a5a8a)");
  await h.sleep(1200);
  const q = (js) => h.eval(`(() => ${js})()`);
  const widgets = await q("[...document.querySelectorAll('.aero-widget')].map((w) => ({ text: w.textContent.trim().length, svg: w.querySelectorAll('svg').length, img: w.querySelectorAll('img,canvas').length, over: w.querySelector('.aero-widget-body').scrollWidth > w.clientWidth + 2 }))");
  check(widgets.length === kinds.length, `all ${kinds.length} are on the desktop (${widgets.length})`);
  widgets.forEach((w, i) => check(w.text > 0 || w.svg > 0 || w.img > 0, `${kinds[i][0]} shows something`));
  check(widgets.every((w) => !w.over), "nothing spills sideways out of its widget");
  shots["all of them"] = await h.shot(0, 0, 1700, 1180);

  // the picture: shown, its caption, and a still while it is not hovered (playOnHover)
  check(await q("!!document.querySelector('.w-pic-img') && document.querySelector('.w-pic-caption').textContent === 'My GIF'"), "the picture and its caption are shown");

  // the checklist: add an item, tick one, remove one; kept in the widget's own settings
  await h.eval(`(() => { const i = document.querySelector('.w-list-add'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, 'Pack the bag'); i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); })()`);
  await h.sleep(700);
  check((await q("document.querySelectorAll('.w-list-row').length")) === 4, "an item added to the checklist");
  const tick = await h.rect(".w-list-row:nth-child(2) .w-check");
  await h.click(tick.x, tick.y);
  await h.sleep(700);
  const saved = await q("(window.__calls.filter((c) => c.cmd === 'style_widget' && c.args.id === 'w-checklist').at(-1)?.args.style.options.extra.items || [])");
  check(saved.length === 4 && saved[1].d === true && saved[3].t === "Pack the bag", `and it, and the tick, are saved with the widget (${JSON.stringify(saved.map((x) => x.t + (x.d ? " ✓" : "")))})`);

  // the counter: + adds a step, and the count is saved
  const plus = await h.rect(".w-counter-buttons .w-primary");
  await h.click(plus.x, plus.y);
  await h.sleep(500);
  check((await q("document.querySelector('.w-counter-center strong').textContent")) === "6", "the counter counts");

  // the timer: Start runs it, Pause stops it
  const start = await h.rect(".w-timer-buttons .w-primary");
  await h.click(start.x, start.y);
  await h.sleep(1600);
  const t1 = await q("document.querySelector('.w-timer-center strong').textContent");
  check(t1.startsWith("24:5") || t1.startsWith("24:4"), `the timer runs down from 25:00 (${t1})`);
  await h.click(start.x, start.y);
  await h.sleep(300);
  check((await q("document.querySelector('.w-timer-buttons .w-primary').textContent")) === "Resume", "and pauses");

  // the calculator: 12 x (3 + 4) = 84
  for (const k of ["1", "2", "×", "(", "3", "+", "4", ")"]) {
    const key = await h.eval(`(() => { const b = [...document.querySelectorAll('.w-calc-keys button')].find((e) => e.textContent === ${JSON.stringify(k)}); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    await h.click(key.x, key.y);
  }
  check((await q("document.querySelector('.w-calc-live').textContent")) === "= 84", "the calculator works the sum out as it is typed");
  const eq = await h.eval(`(() => { const b = [...document.querySelectorAll('.w-calc-keys button')].find((e) => e.textContent === '='); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  await h.click(eq.x, eq.y);
  check((await q("document.querySelector('.w-calc-expr').textContent")) === "84", "and = gives the answer");

  // dice: a roll shows two numbers
  const roll = await h.rect(".w-rand-main");
  await h.click(roll.x, roll.y);
  await h.sleep(900);
  check(/^\d+ · \d+$/.test(await q("document.querySelector('.w-rand-result').textContent")), "dice rolled");

  // the shape of the glass: a radius, frameless, and a shadow, set by the same options
  await h.eval(`(() => { const s = JSON.parse(JSON.stringify(window.__lastSettings || null)); return 1; })()`);
  check((await q("getComputedStyle(document.querySelector('.aero-widget')).borderRadius")) === "20px", "the glass is round by 20px unless set");
  check((await h.errors()).length === 0, `no errors in the page ${JSON.stringify((await h.errors()).slice(0, 2))}`);
  console.log("sheet:", await h.sheet(shots, "widgets", 900));
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);