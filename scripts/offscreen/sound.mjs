// The sound system, measured: every note of every cue is in the key of E; a cue is quiet, does not clip, does not
// click at its end, is not silent; a switch is higher than a menu; and with music playing everything is about
// half as loud. Each cue is also rendered to a WAV file in <out>/sounds, to listen to.
//
//   pnpm build
//   node --experimental-websocket scripts/offscreen/sound.mjs <out folder>

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { startHarness } from "./harness.mjs";

const out = process.argv[2] ?? "offscreen-out";
let failed = false;
const check = (ok, what) => {
  console.log(ok ? "ok  " : "FAIL", what);
  if (!ok) failed = true;
};

const h = await startHarness({ out, window: "settings", viewport: [800, 600], settings: () => {} });
try {
  await h.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__AERO_TEST__ = true;" });
  await h.open(".ctl-value");
  await h.sleep(500);
  check(await h.eval("!!window.__aeroSound"), "the sound bench is there");
  const report = await h.eval(`(async () => {
    const S = window.__aeroSound;
    const rate = 44100;
    const render = async (cue, step, ducked) => {
      const ctx = new OfflineAudioContext(2, Math.floor(rate * 1.3), rate);
      const bus = S.buildBus(ctx);
      if (ducked) { bus.level.gain.value = S.DUCK; }
      S.renderCue(ctx, bus, cue, step, 1, 0.01);
      const buf = await ctx.startRendering();
      return buf;
    };
    const stats = (buf) => {
      const a = buf.getChannelData(0), b = buf.getChannelData(1);
      let peak = 0, sum = 0, last = 0, lastStart = Math.floor(a.length - rate * 0.04), end = 0;
      for (let i = 0; i < a.length; i++) { const v = Math.max(Math.abs(a[i]), Math.abs(b[i])); if (v > peak) peak = v; sum += a[i] * a[i]; if (i >= lastStart && v > last) last = v; if (v > 0.0005) end = i; }
      return { peak, rms: Math.sqrt(sum / a.length), tail: last, seconds: end / rate, nan: Number.isNaN(peak) };
    };
    const wav = (buf) => {
      const a = buf.getChannelData(0), b = buf.getChannelData(1), n = a.length;
      const bytes = new Uint8Array(44 + n * 4), v = new DataView(bytes.buffer);
      const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
      w(0, "RIFF"); v.setUint32(4, 36 + n * 4, true); w(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
      v.setUint32(24, rate, true); v.setUint32(28, rate * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 4, true);
      for (let i = 0; i < n; i++) { v.setInt16(44 + i * 4, Math.max(-1, Math.min(1, a[i])) * 32767, true); v.setInt16(46 + i * 4, Math.max(-1, Math.min(1, b[i])) * 32767, true); }
      let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return btoa(s);
    };
    const cues = Object.keys(S.CUES);
    const rows = {};
    for (const cue of cues) {
      const steps = cue === "hover" ? [0, 3, 7] : cue === "notch" ? [1, -1] : [0];
      for (const step of steps) {
        const name = steps.length > 1 ? cue + "-" + step : cue;
        const notes = S.notesFor(cue, step);
        const buf = await render(cue, step, false);
        const ducked = await render(cue, step, true);
        rows[name] = { notes: notes.map((n) => [n.from, n.to]), ...stats(buf), duckedRms: stats(ducked).rms, file: wav(buf) };
      }
    }
    return { rows, keys: Object.fromEntries(Object.entries(rows).map(([k, r]) => [k, r.notes.flat().every((f) => S.inKey(f))])), ceiling: S.CEILING, firstOpen: S.notesFor("open", 0)[0].from, firstOn: S.notesFor("on", 0)[0].from, tick: S.notesFor("tick", 0)[0].from };
  })()`);
  mkdirSync(join(out, "sounds"), { recursive: true });
  for (const [name, r] of Object.entries(report.rows)) {
    writeFileSync(join(out, "sounds", `${name}.wav`), Buffer.from(r.file, "base64"));
    const key = report.keys[name];
    console.log(`${name.padEnd(12)} peak ${r.peak.toFixed(3)}  rms ${r.rms.toFixed(4)}  ends ${r.seconds.toFixed(2)} s  tail ${r.tail.toExponential(1)}  ducked x${(r.duckedRms / r.rms).toFixed(2)}  in key ${key}`);
  }
  const rows = Object.entries(report.rows);
  check(Object.values(report.keys).every(Boolean), "every note of every cue is in the key of E");
  check(rows.every(([, r]) => !r.nan && r.peak > 0.01 && r.peak < 0.3), "none is silent, none is loud (peak between 0.01 and 0.3)");
  check(rows.every(([, r]) => r.tail < 0.002), "all fade out before the end: nothing to click");
  check(rows.every(([, r]) => r.seconds < 1.0), "and none outstays a second");
  check(rows.every(([, r]) => r.duckedRms / r.rms > 0.4 && r.duckedRms / r.rms < 0.6), "with music playing every cue is about half as loud");
  check(report.firstOn > report.firstOpen * 1.9, `a switch is an octave above a menu (${report.firstOn.toFixed(0)} Hz against ${report.firstOpen.toFixed(0)} Hz)`);
  // no two cues are the same sound (a new cue once repeated "off" note for note)
  const sig = (r) => JSON.stringify(r.notes.map(([a, b]) => [Math.round(a), Math.round(b)]));
  const same = [];
  for (const [a, ra] of rows) for (const [b, rb] of rows) if (a < b && sig(ra) === sig(rb)) same.push(a + " = " + b);
  check(same.length === 0, "every cue is its own sound" + (same.length ? " (alike: " + same.join(", ") + ")" : ""));
  check(report.tick > report.firstOn, "and the tick is higher than both");
  console.log("the cues, as WAV files:", join(out, "sounds"));
} finally {
  h.close();
}
process.exit(failed ? 1 : 0);
