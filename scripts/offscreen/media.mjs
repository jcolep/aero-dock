// The Control Center's Now Playing card, off screen: the cover and its colors,
// the program it comes from, the scrubber, the ten-second buttons, shuffle and
// repeat, the list of players, and the sound wave fed by real events.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/media.mjs <out folder>
//
// Writes `media.png`: the card with a warm cover, the same with a cool one, and
// a track that cannot be sought.

import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";

// two covers drawn here, so the card has something to take colors from
const cover = (a, b, c) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><circle cx="210" cy="110" r="70" fill="${c}"/><rect x="0" y="230" width="300" height="70" fill="#0b0b10"/></svg>`,
  );
const warm = cover("#e8501f", "#7a1220", "#ffd166");
const cool = cover("#1d4ed8", "#0b1e4a", "#7dd3fc");

const media = {
  title: "The hero never dies",
  artist: "Quadeca — Life 1",
  source: "Spotify.exe",
  sourceName: "Spotify",
  sourceTarget: "C:\\apps\\Spotify.exe",
  sourceHwnd: 7,
  hasArtwork: true,
  key: "warm",
  shuffle: false,
  repeat: "none",
};
const h = await startHarness({ out, window: "menubar", media, art: warm });
const shots = {};
try {
  await h.open(".menubar");
  await h.desktop();
  const cc = await h.rect('.mb-item[title="Control Center"]');
  await h.click(cc.x, cc.y);
  await h.sleep(1600);

  const card = (js) => h.eval(`(() => { const c = document.querySelector('.np'); return c ? (${js}) : null; })()`);
  console.log("card shown:", await card("true"));
  console.log("program:", JSON.stringify(await card("c.querySelector('.np-source span')?.textContent")));
  console.log("cover set:", await card("!!c.querySelector('.np-art img')"));
  console.log("tinted:", await card("c.hasAttribute('data-tinted')"), "accent:", await card("c.style.getPropertyValue('--np-accent')"));
  console.log("layers:", await card("c.querySelectorAll('.np-bg').length"));
  shots.warm = await h.shot(1380, 0, 540, 760);

  // feed the sound wave a few frames, as Rust does
  const frames = (n) => Array.from({ length: 24 }, (_, i) => Math.round(255 * Math.max(0, Math.sin((i + n) / 3) * 0.5 + 0.45 - i * 0.012)));
  for (let n = 0; n < 6; n++) {
    await h.eval(`window.__emit("media://spectrum", ${JSON.stringify(frames(n * 2))})`);
    await h.sleep(60);
  }
  await h.sleep(120);
  console.log("wave drawn:", await card("(() => { const k = c.querySelector('.np-wave'); const x = k.getContext('2d').getImageData(0, 0, k.width, k.height).data; let n = 0; for (let i = 3; i < x.length; i += 4) if (x[i]) n++; return n > 200; })()"));
  console.log("spectrum asked for:", (await h.eval("window.__calls.filter((c) => c.cmd === 'media_spectrum').length")) > 0);

  // the position moves on by itself while it plays
  const t0 = await card("c.querySelector('.np-time').textContent");
  await h.sleep(2600);
  console.log("elapsed moved:", t0, "->", await card("c.querySelector('.np-time').textContent"));

  // ten seconds each way
  await h.click(...Object.values(await h.rect('.np-btn[aria-label="Forward 10 seconds"]')).slice(0, 2));
  await h.sleep(300);
  await h.click(...Object.values(await h.rect('.np-btn[aria-label="Back 10 seconds"]')).slice(0, 2));
  await h.sleep(300);
  console.log("seek-by calls:", JSON.stringify(await h.eval("window.__calls.filter((c) => c.cmd === 'media_seek_by').map((c) => c.args.deltaMs)")));

  // drag the scrubber to the middle: the seek goes out once, on release
  const track = await h.rect(".np-track");
  await h.move(track.left + 10, track.y);
  await h.send("Input.dispatchMouseEvent", { type: "mousePressed", x: track.left + 10, y: track.y, button: "left", buttons: 1, clickCount: 1 });
  await h.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: track.x, y: track.y, button: "left", buttons: 1 });
  console.log("none sent while dragging:", (await h.eval("window.__calls.filter((c) => c.cmd === 'media_seek').length")) === 0);
  await h.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: track.x, y: track.y, button: "left", buttons: 0, clickCount: 1 });
  await h.sleep(300);
  const seeks = await h.eval("window.__calls.filter((c) => c.cmd === 'media_seek').map((c) => c.args.positionMs)");
  console.log("seek on release (ms, about half of 215000):", JSON.stringify(seeks));

  // shuffle and repeat
  await h.click(...Object.values(await h.rect('.np-btn[aria-label="Shuffle off"]')).slice(0, 2));
  await h.sleep(300);
  for (let i = 0; i < 2; i++) {
    const r = await h.rect(".np-controls .np-btn:last-child");
    await h.click(r.x, r.y);
    await h.sleep(300);
  }
  console.log("shuffle:", await h.eval("window.__media.shuffle"), " repeat after two presses:", await h.eval("window.__media.repeat"));

  // pause
  await h.click(...Object.values(await h.rect('.np-btn[aria-label="Pause"]')).slice(0, 2));
  await h.sleep(2600);
  console.log("paused, wave hidden:", await card("getComputedStyle(c.querySelector('.np-wave')).display === 'none'"));

  // the live picture of the playing window is asked for at the box on the card
  const view = await h.rect(".np-view-btn");
  await h.click(view.x, view.y);
  await h.sleep(1200);
  const placed = await h.eval("window.__calls.filter((c) => c.cmd === 'show_window_previews').map((c) => c.args.slots[0])");
  const box = await h.rect(".np-view");
  console.log("live view asked for:", JSON.stringify(placed.at(-1)), "box on the page:", JSON.stringify({ x: Math.round(box.left), y: Math.round(box.top), w: Math.round(box.width), h: Math.round(box.height) }));
  await h.click(view.x, view.y);
  await h.sleep(300);
  console.log("live view removed on switching off:", (await h.eval("window.__calls.filter((c) => c.cmd === 'hide_window_previews').length")) > 0);

  // another track with a cool cover: the colors follow
  await h.eval(`window.__art = ${JSON.stringify(cool)}; Object.assign(window.__media, { key: "cool", title: "A very long title that has to scroll across the card to be read in full", artist: "Someone", playing: true, hasArtwork: true, players: [{ id: "Spotify.exe", name: "Spotify", title: "The hero", playing: true, current: true }, { id: "chrome.exe", name: "Google Chrome", title: "Some video", playing: false, current: false }] })`);
  await h.sleep(5200);
  console.log("accent now:", await card("c.style.getPropertyValue('--np-accent')"));
  console.log("long title scrolls:", await card("c.querySelector('.np-title').hasAttribute('data-scroll')"));
  const more = await h.rect(".np-more");
  if (more) {
    await h.click(more.x, more.y);
    await h.sleep(400);
  }
  console.log("players listed:", await card("c.querySelectorAll('.np-players button').length"));
  shots.cool = await h.shot(1380, 0, 540, 760);

  // closing the Control Center while a long title scrolls: it turns back and goes in well under a second
  // (the scrolling, which never ends, was once taken for an entrance to be played backwards, which took seconds)
  const trigger = await h.rect('.mb-item[title="Control Center"]');
  const shutAt = Date.now();
  await h.click(trigger.x, trigger.y);
  let gone = false;
  for (let i = 0; i < 60 && !gone; i++) {
    await h.sleep(50);
    gone = !(await h.eval("!!document.querySelector('.mb-panel')"));
  }
  console.log("Control Center gone after", Date.now() - shutAt, "ms with the long title scrolling:", gone);
  await h.click(trigger.x, trigger.y);
  await h.sleep(900);

  // a track that cannot be sought: a bar to look at and buttons that say why
  await h.eval(`Object.assign(window.__media, { key: "noseek", title: "Apple Music song", canSeek: false, shuffle: null, repeat: null, hasArtwork: false, players: [], sourceName: "Apple Music" })`);
  await h.sleep(2600);
  console.log("not seekable: knob", await card("!!c.querySelector('.np-knob')"), "disabled ten-second buttons:", await card("c.querySelectorAll('.np-btn[aria-disabled=\"true\"]').length"));
  shots.noseek = await h.shot(1380, 0, 540, 760);

  // live stream: no bar
  await h.eval(`Object.assign(window.__media, { key: "live", durationMs: 0, positionMs: 0, canSeek: false })`);
  await h.sleep(2600);
  console.log("live: bar", await card("!!c.querySelector('.np-track')"), "live mark", await card("!!c.querySelector('.np-live')"));

  console.log("sheet:", await h.sheet(shots, "media"));
  console.log("commands the mock did not know:", JSON.stringify(await h.unknownCalls()));
} finally {
  h.close();
}
process.exit(0);
