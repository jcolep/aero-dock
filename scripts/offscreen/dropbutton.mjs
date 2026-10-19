// The Liquidock button, off screen: the drop with no circle behind it, at the dock's left end; each of its three
// shines (glint, swell, rim trace) comes up under the pointer and goes again when it leaves; a click opens Start.
// Writes dropbutton.png, a sheet of each shine at rest, part way and full.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/dropbutton.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};
const shots = {};
const layer = { sweep: ".dock-drop-band", caustic: ".dock-drop-pool", rim: ".dock-drop-trace" };
let h;
for (const shine of ["sweep", "caustic", "rim"]) {
  h = await startHarness({ out, window: "dock", viewport: [900, 400], settings: (s) => { s.dock.revealControls = false; s.dock.showSearchButton = true; s.dock.startShine = shine; s.dock.magnification = false; } });
  try {
    await h.open(".dock-drop-btn");
    await h.desktop("#5b6f8f");
    await h.sleep(600);
    const q = (js) => h.eval(`(() => ${js})()`);
    const r = await q("(() => { const r = document.querySelector('.dock-drop-btn').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()");
    const look = await q("(() => { const b = getComputedStyle(document.querySelector('.dock-drop-btn')); return b.backgroundImage + '|' + b.backgroundColor + '|' + b.borderTopWidth + '|' + b.boxShadow; })()");
    if (shine === "sweep") {
      check(look === "none|rgba(0, 0, 0, 0)|0px|none", `no circle behind the drop (${look})`);
      const first = await q("document.querySelector('.dock-section, .dock-drop-btn').className");
      check(first.includes("dock-drop-btn"), "it sits before the pinned apps");
      check((await q("document.querySelector('.dock-drop-btn').getAttribute('aria-label')")) === "Start", "it is labelled Start");
    }
    const sel = layer[shine];
    const opacity = () => q(`+getComputedStyle(document.querySelector('${sel}')).opacity`);
    const pad = 8;
    const grab = () => h.shot(r.x - pad, r.y - pad, r.w + pad * 2, r.h + pad * 2, 4);
    check((await opacity()) === 0, `${shine}: nothing over the drop at rest`);
    shots[`${shine} rest`] = await grab();
    await h.move(r.x + r.w / 2, r.y + r.h / 2);
    await h.sleep(shine === "sweep" ? 230 : 160);
    shots[`${shine} part way`] = await grab();
    await h.sleep(500);
    shots[`${shine} full`] = await grab();
    if (shine === "sweep") {
      const m = await q(`getComputedStyle(document.querySelector('${sel}')).transform`);
      check(/matrix\([^)]*,\s*1[0-9]{2}(\.\d+)?,/.test(m), `sweep: the glint has crossed to the far side (${m})`);
    } else check((await opacity()) > 0.7, `${shine}: lit while the pointer is on it`);
    await h.move(r.x + 300, r.y - 150);
    await h.sleep(700);
    check((await opacity()) === 0, `${shine}: gone again when the pointer leaves`);
    if (shine === "sweep") {
      await h.click(r.x + r.w / 2, r.y + r.h / 2);
      await h.sleep(200);
      check((await q("window.__calls.map((c) => c.cmd)")).includes("toggle_start"), "a click opens Start");
    }
    if (shine === "rim") await h.sheet(shots, "dropbutton", 500);
  } finally {
    h.close();
  }
}
process.exit(failed ? 1 : 0);
