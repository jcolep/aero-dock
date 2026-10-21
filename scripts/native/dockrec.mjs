// Records, frame by frame inside the real dock page(s) of a running app (WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=
// --remote-debugging-port=9444): where its icons and status icons are laid out and what transforms they carry, so that
// a shift seen on screen (scripts/native/dockfilm.ps1) can be traced to what the page did at that moment.
//
//   node --experimental-websocket scripts/native/dockrec.mjs start
//   ... reveal and hide the dock (dockfilm.ps1) ...
//   node --experimental-websocket scripts/native/dockrec.mjs dump [screenXMax]
//
// `dump` prints, for each time the dock came in, every change of the tracked values 380 ms or more after it did.

const [cmd = "dump", arg = "1920", port = "9444"] = process.argv.slice(2);
const pages = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).filter((p) => p.type === "page" && !/window=/.test(p.url));

async function on(page, expression) {
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  const result = await new Promise((res) => {
    ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id === 1) res(d.result);
    };
    ws.send(JSON.stringify({ id: 1, method: "Runtime.evaluate", params: { expression, returnByValue: true, awaitPromise: true } }));
    setTimeout(() => res(null), 8000);
  });
  ws.close();
  return result?.result?.value ?? result?.exceptionDetails?.text ?? null;
}

const START = `(() => {
  if (window.__rec) return 'already';
  const rec = (window.__rec = { frames: [], muts: [] });
  const r2 = (v) => Math.round(v * 100) / 100;
  const tick = () => {
    const bar = document.querySelector('.dock-bar');
    if (bar) {
      const top = (e) => (e ? r2(e.getBoundingClientRect().top) : null);
      const left = (e) => (e ? r2(e.getBoundingClientRect().left) : null);
      const mags = [...document.querySelectorAll('.dock-icon-mag')];
      const chips = [...document.querySelectorAll('.widget-chip-button')];
      rec.frames.push({
        t: Date.now(),
        rev: document.querySelector('.dock-viewport')?.dataset.reveal,
        bar: bar.style.transform || '',
        body: top(document.querySelector('.dock-body')),
        mag: mags.slice(0, 3).map((m) => top(m) + '/' + left(m) + '/' + (m.style.transform || '').slice(0, 40)),
        chips: chips.map((c) => top(c) + '/' + left(c)),
        pad: bar.style.getPropertyValue('--end-pad'),
        // the window itself: moved or resized by the app (the page's own geometry is relative to it)
        win: [window.screenX, window.screenY, window.innerWidth, window.innerHeight, window.outerWidth, window.outerHeight].join(','),
        // everything else that could change what is drawn: the viewport's state, what is animating, the glass flags
        state: JSON.stringify(document.querySelector('.dock-viewport')?.dataset ?? {}) + ' bd=' + (document.querySelector('.dock-body')?.dataset.bd ?? '') + ' body=' + (document.querySelector('.dock-body')?.className ?? ''),
        anims: document.getAnimations().map((a) => (a.animationName || a.transitionProperty || 'anim') + '@' + ((a.effect && a.effect.target && (a.effect.target.className || a.effect.target.tagName)) || '?').toString().slice(0, 22)).filter((s) => !/dock-icon-fade|glass-sweep/.test(s)).sort().join(','),
        cls: bar.className + '|' + [...document.querySelectorAll('.dock-icon')].map((e) => e.className.length).join(','),
      });
      if (rec.frames.length > 6000) rec.frames.shift();
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return 'started';
})()`;

const DUMP = `(() => {
  const f = (window.__rec && window.__rec.frames) || [];
  const out = [];
  for (let i = 1; i < f.length; i++) {
    if (f[i - 1].rev !== 'in' && f[i].rev === 'in') out.push({ at: f[i].t });
  }
  const events = out.map((e, n) => {
    const frames = f.filter((x) => x.t >= e.at && x.t < (out[n + 1]?.at ?? Infinity) && x.t - e.at < 2200);
    const changes = [];
    for (let i = 1; i < frames.length; i++) {
      const a = frames[i - 1], b = frames[i], dt = b.t - e.at;
      if (dt < 380 || dt > 1300) continue;
      const diff = [];
      const tops = (s) => parseFloat(String(s).split('/')[0]);
      if (Math.abs(a.body - b.body) >= 0.04) diff.push('body ' + a.body + '->' + b.body);
      if (a.pad !== b.pad) diff.push('pad ' + a.pad + '->' + b.pad);
      // the bar's transform going from something to nothing (or back): the compositing of everything in it changes
      if ((a.bar === '') !== (b.bar === '')) diff.push('bar transform ' + JSON.stringify(a.bar.slice(0, 24)) + '->' + JSON.stringify(b.bar.slice(0, 24)));
      a.mag.forEach((m, k) => { if (Math.abs(tops(m) - tops(b.mag[k])) >= 0.04) diff.push('icon' + k + ' ' + m + '->' + b.mag[k]); });
      a.chips.forEach((c, k) => { if (Math.abs(tops(c) - tops(b.chips[k])) >= 0.04) diff.push('chip' + k + ' ' + c + '->' + b.chips[k]); });
      if (a.win !== b.win) diff.push('WINDOW (x,y,innerW,innerH,outerW,outerH) ' + a.win + '->' + b.win);
      if (a.state !== b.state) diff.push('state ' + b.state.slice(0, 120));
      if (a.anims !== b.anims) diff.push('anims ' + (b.anims || '(none)'));
      if (a.cls !== b.cls) diff.push('classes changed');
      if (diff.length) changes.push(dt + 'ms: ' + diff.join(' | '));
    }
    const settled = frames.find((x) => x.bar === '');
    return { revealAt: e.at, frames: frames.length, barTransformGoneAt: settled ? settled.t - e.at : null, changes: changes.slice(0, 40) };
  });
  return JSON.stringify(events, null, 1);
})()`;

for (const p of pages) {
  if (cmd === "start") console.log(await on(p, START));
  else {
    const sx = Number(await on(p, "screenX"));
    if (sx > Number(arg)) continue;
    console.log("dock at screenX", sx);
    console.log(await on(p, DUMP));
  }
}
process.exit(0);
