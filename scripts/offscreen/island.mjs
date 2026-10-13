// The media pill in the middle of the menu bar, off screen: out of sight until the pointer rests in the middle of
// the bar, out for as long as it stays there, back when it leaves; kept out by its setting; not there when nothing
// plays; its buttons do what they say; a click on the cover opens the card.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/island.mjs <out folder>

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

const cover = (a, b, c) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><circle cx="210" cy="110" r="70" fill="${c}"/><rect x="0" y="230" width="300" height="70" fill="#0b0b10"/></svg>`,
  );
const media = { title: "The hero never dies", artist: "Quadeca", source: "Spotify.exe", sourceName: "Spotify", hasArtwork: true, key: "warm" };
const art = cover("#e8501f", "#7a1220", "#ffd166");

const state = (h) =>
  h.eval(`(() => {
    const p = document.querySelector('.mb-island');
    if (!p) return null;
    const s = getComputedStyle(p);
    return { width: p.getBoundingClientRect().width, opacity: +s.opacity, visible: s.visibility === 'visible' };
  })()`);

async function open(settings, mediaOverride = media) {
  return startHarness({
    out,
    window: "menubar",
    viewport: [1400, 300],
    media: mediaOverride,
    art,
    settings: (s) => {
      s.menuBar.enabled = true;
      s.menuBar.ambient = false;
      Object.assign(s.menuBar, settings);
    },
  });
}

const shots = {};

// ---- out of sight until the pointer rests in the middle ----
{
  const h = await open({});
  try {
    await h.open(".menubar");
    await h.desktop("#8aa0c0");
    await h.sleep(900);
    let s = await state(h);
    check(s && !s.visible && s.opacity < 0.05, `away from it, it cannot be seen (${JSON.stringify(s)})`);
    // the pointer crossing the middle of the bar does not raise it
    await h.move(500, 14);
    await h.move(700, 14);
    await h.move(900, 14);
    await h.sleep(30);
    s = await state(h);
    check(s && !s.visible, "crossing the bar does not raise it");
    await h.move(700, 14);
    await h.sleep(1100);
    s = await state(h);
    check(s && s.visible && s.width > 300 && s.opacity > 0.95, `resting in the middle, it is out (${JSON.stringify(s)})`);
    const tinted = await h.eval("getComputedStyle(document.querySelector('.mb-island')).getPropertyValue('--isl-a')");
    check(tinted.trim().length > 0, `and tinted by the cover (${tinted.trim()})`);
    check((await h.eval("!!document.querySelector('.isl-art img')")) === true, "with the cover on it");
    check((await h.eval("document.querySelector('.isl-title').textContent")).includes("The hero never dies"), "and the title");
    shots.out = await h.shot(380, 0, 640, 70, 3);
    // partway out (the spring), not just all or nothing
    await h.move(300, 14);
    await h.sleep(20);
    const mid = [];
    for (let i = 0; i < 12; i++) {
      mid.push((await state(h)).width);
      await h.sleep(60);
    }
    check(mid.some((w) => w > 10 && w < 300), `it goes back on a spring, through the widths between (${mid.map((w) => Math.round(w)).join(" ")})`);
    await h.sleep(900);
    s = await state(h);
    check(s && !s.visible, "and is out of sight again after the pointer leaves");
    // the buttons
    await h.move(700, 14);
    await h.sleep(1000);
    const play = await h.rect(".isl-play");
    await h.click(play.x, play.y);
    await h.sleep(300);
    check((await h.eval("window.__calls.filter((c) => c.cmd === 'widget_media_control').map((c) => c.args.action)")).includes("playpause"), "the play button asks the player to play or pause");
    const next = await h.rect('.isl-btn[aria-label="Next track"]');
    await h.click(next.x, next.y);
    await h.sleep(300);
    check((await h.eval("window.__calls.filter((c) => c.cmd === 'widget_media_control').map((c) => c.args.action)")).includes("next"), "and the next button asks for the next track");
    const cov = await h.rect(".isl-art");
    await h.click(cov.x, cov.y);
    await h.sleep(900);
    check((await h.eval("!!document.querySelector('.mb-panel')")) === true, "a click on the cover opens the Control Center's card");
    s = await state(h);
    check(s && !s.visible, "and the pill steps aside while it is open");
  } finally {
    h.close();
  }
}

// ---- kept out ----
{
  const h = await open({ mediaIslandPinned: true });
  try {
    await h.open(".menubar");
    await h.desktop("#8aa0c0");
    await h.move(200, 160);
    await h.sleep(1400);
    const s = await state(h);
    check(s && s.visible && s.width > 300, `pinned, it is out with no pointer near it (${JSON.stringify(s)})`);
    shots.pinned = await h.shot(380, 0, 640, 70, 3);
  } finally {
    h.close();
  }
}

// ---- nothing playing ----
{
  const h = await open({ mediaIslandPinned: true }, { active: false });
  try {
    await h.open(".menubar");
    await h.sleep(1500);
    check((await h.eval("document.querySelectorAll('.mb-island, .mb-island-zone').length")) === 0, "with nothing playing there is no pill and nothing to hover");
  } finally {
    h.close();
  }
}

// ---- switched off ----
{
  const h = await open({ mediaIsland: false });
  try {
    await h.open(".menubar");
    await h.move(700, 14);
    await h.sleep(1200);
    check((await h.eval("document.querySelectorAll('.mb-island-layer').length")) === 0, "switched off, it is not drawn");
    const asked = await h.eval("window.__calls.filter((c) => c.cmd === 'widget_now_playing').length");
    check(asked === 0, `and the player is not asked about (${asked} asks)`);
  } finally {
    h.close();
  }
}

console.log("sheet:", await (async () => {
  const h = await open({});
  try {
    return await h.sheet(shots, "island");
  } finally {
    h.close();
  }
})());
process.exit(failed ? 1 : 0);
