/**
 * The sounds of the interface, made on the spot, as one system.
 *
 *  - **One key.** Every note is in E (the pentatonic scale on E: E F# G# B C#), so any two cues played together or
 *    one after another agree, and a run of hovers along the dock is a small tune and never a clash. The Start
 *    menu's chime, the model for the rest, was already in E.
 *  - **Pitch says what a thing is.** A menu is in the octave of E4 to E5; a switch is an octave above that (on
 *    rises into it, off falls out of it), so a switch always sounds brighter and lighter than a menu; the lens
 *    arriving at a button is a tick near E6, barely there; opening an app is a rising arpeggio from E4.
 *  - **A voice of glass.** Each note is a sine with a faint second and a fainter third partial that die away
 *    quicker than the note does, an attack that is rounded (nothing clicks) and a decay that is natural, not cut.
 *  - **A little room.** A very short reverb is under everything, so the notes sit somewhere and are not pasted
 *    on; a compressor keeps notes that overlap from stacking into a shout.
 *  - **Quiet, and quieter under music.** The loudest a cue gets is low even at full volume. While something is
 *    playing (what the media session says) every cue is about half as loud and a little duller, so the interface
 *    sits under the music and not across it.
 *
 * There are no sound files. Off by default (Settings > Accessibility). A cue plays only from a page that has had a
 * click, as browsers require; the first hover before any click is silent.
 */

import { ipc } from "../../ipc/commands";
import { useSettings } from "../../state/settingsStore";

export type Cue = "open" | "close" | "on" | "off" | "tick" | "launch" | "hover" | "notch" | "startOpen" | "startClose";

export interface Note {
  /** Frequency at the start and at the end, in Hz. */
  from: number;
  to: number;
  /** Seconds after the cue starts, and how long it lasts. */
  at: number;
  length: number;
  /** Loudness relative to the cue's own ceiling. */
  gain: number;
  /** How much of the upper partials it has, 0 (a plain tone) to 1 (bright). */
  bright?: number;
}

// ---- the key ----

/** E4, the tonic. */
const E4 = 329.63;
/** The frequency `n` semitones above E4. */
export const st = (n: number): number => E4 * 2 ** (n / 12);
/** The pentatonic scale, in semitones above the tonic: E F# G# B C#. */
export const PENTATONIC = [0, 2, 4, 7, 9];

/** Whether a frequency is a note of the scale, within `cents` of it. */
export function inKey(frequency: number, cents = 18): boolean {
  const semitones = 12 * Math.log2(frequency / E4);
  const nearest = Math.round(semitones);
  const inScale = PENTATONIC.includes(((nearest % 12) + 12) % 12);
  return inScale && Math.abs(semitones - nearest) * 100 <= cents;
}

const note = (from: number, to: number, at: number, length: number, gain = 1, bright = 0.5): Note => ({
  from,
  to,
  at,
  length,
  gain,
  bright,
});
/** A held note at a scale step. */
const tone = (n: number, at: number, length: number, gain = 1, bright = 0.5): Note => note(st(n), st(n), at, length, gain, bright);
/** A glide between two scale steps. */
const glide = (a: number, b: number, at: number, length: number, gain = 1, bright = 0.5): Note => note(st(a), st(b), at, length, gain, bright);

/** What each cue is made of (steps are semitones above E4). */
export const CUES: Record<Cue, Note[]> = {
  // a menu rises: B4, then E5
  open: [tone(7, 0, 0.13, 0.62, 0.35), tone(12, 0.055, 0.18, 0.5, 0.4)],
  // and settles back: E5, then B4, softer
  close: [tone(12, 0, 0.1, 0.48, 0.3), tone(7, 0.05, 0.15, 0.38, 0.3)],
  // a switch goes on: an octave above a menu, rising: B5, then E6
  on: [tone(19, 0, 0.11, 0.7, 0.55), tone(24, 0.065, 0.2, 0.62, 0.6)],
  // and off: the same two, falling, softer
  off: [tone(24, 0, 0.1, 0.52, 0.45), tone(19, 0.06, 0.17, 0.46, 0.4)],
  // the lens arriving at a button: barely there, near E6
  tick: [note(st(24), st(24), 0, 0.035, 0.2, 0.1)],
  // an app opening: a small arpeggio from E4
  launch: [tone(0, 0, 0.2, 0.62, 0.3), tone(7, 0.05, 0.2, 0.55, 0.4), tone(12, 0.1, 0.22, 0.5, 0.5), tone(16, 0.15, 0.26, 0.4, 0.55)],
  // the Start menu arriving: a sweep that rises into a small airy chord, like a glass being tapped
  startOpen: [glide(0, 7, 0, 0.2, 0.62, 0.3), tone(7, 0.035, 0.24, 0.54, 0.45), glide(12, 14, 0.075, 0.28, 0.45, 0.5), tone(19, 0.12, 0.34, 0.27, 0.6)],
  // and leaving: the same, falling and shorter
  startClose: [glide(14, 9, 0, 0.14, 0.55, 0.3), glide(7, 4, 0.04, 0.18, 0.5, 0.3), glide(0, -5, 0.08, 0.22, 0.38, 0.2)],
  // these two depend on what they are played for (see notesFor)
  hover: [],
  notch: [],
};

/** The notes for a cue. `step` is which icon the pointer is on, for `hover`, and
 *  which way a wheel notch turned (1 up, -1 down), for `notch`. */
export function notesFor(cue: Cue, step: number): Note[] {
  if (cue === "hover") {
    // up the scale along the dock from E5, and round again an octave higher
    const i = ((Math.round(step) % 10) + 10) % 10;
    const semitones = 12 + PENTATONIC[i % 5] + 12 * Math.floor(i / 5);
    return [tone(semitones, 0, 0.13, 0.32, 0.3)];
  }
  if (cue === "notch") {
    // a wheel turned up rises, and turned down falls: G#5 and B5
    return step >= 0 ? [glide(16, 19, 0, 0.05, 0.5, 0.2)] : [glide(19, 16, 0, 0.05, 0.5, 0.2)];
  }
  return CUES[cue];
}

/** Where a cue sits between the speakers, -1 to 1: a hover follows the pointer along the dock. */
export function panFor(cue: Cue, step: number): number {
  if (cue !== "hover") return 0;
  const i = ((Math.round(step) % 10) + 10) % 10;
  return (i / 9 - 0.5) * 0.6;
}

/** The loudest a cue gets at full volume, so even then it is not a shout. */
export const CEILING = 0.16;
/** How loud everything is while something is playing, against when nothing is. */
export const DUCK = 0.5;

/** The fewest milliseconds between two plays of one cue, so a quick sweep of
 *  the pointer is a trickle and not a rattle. */
const THROTTLE_MS: Record<Cue, number> = {
  open: 60,
  close: 60,
  on: 60,
  off: 60,
  tick: 70,
  launch: 120,
  hover: 45,
  notch: 40,
  startOpen: 200,
  startClose: 200,
};

// ---- the graph ----

export interface Bus {
  /** Where the notes go in. */
  input: AudioNode;
  /** The overall level, which music pulls down. */
  level: GainNode;
  /** The room's part of the sound. */
  wet: GainNode;
  /** The filter that softens everything (closes a little under music). */
  soften: BiquadFilterNode;
}

/** A short room: a quarter of a second of fading noise, a little different in each ear, softened. */
function roomImpulse(ctx: BaseAudioContext): AudioBuffer {
  const seconds = 0.38;
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let seed = 1234567 + channel * 7919;
    let lowpassed = 0;
    for (let i = 0; i < length; i++) {
      // a small deterministic noise (so that the room is the same every time)
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const noise = seed / 2 ** 31 - 1;
      lowpassed += (noise - lowpassed) * 0.35;
      const decay = Math.exp((-6.5 * i) / length);
      // the first few milliseconds are bare, so that the note is heard before its room
      const onset = Math.min(1, i / (ctx.sampleRate * 0.006));
      data[i] = lowpassed * decay * onset;
    }
  }
  return buffer;
}

/** The chain every note goes through: a little room beside the dry sound, a compressor to keep overlapping notes
 *  from stacking, and a low-pass that takes the edge off. */
export function buildBus(ctx: BaseAudioContext): Bus {
  const input = ctx.createGain();
  const level = ctx.createGain();
  const room = ctx.createConvolver();
  room.buffer = roomImpulse(ctx);
  const wet = ctx.createGain();
  wet.gain.value = 0.2;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -20;
  compressor.knee.value = 12;
  compressor.ratio.value = 3;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.12;
  const soften = ctx.createBiquadFilter();
  soften.type = "lowpass";
  soften.frequency.value = 5200;
  soften.Q.value = 0.5;
  input.connect(level);
  level.connect(compressor);
  level.connect(room);
  room.connect(wet);
  wet.connect(compressor);
  compressor.connect(soften);
  soften.connect(ctx.destination);
  return { input, level, wet, soften };
}

/** Set the bus for music playing (quieter, duller, a little drier) or not. Ramps, so it never clicks. */
export function setDucked(bus: Bus, ctx: BaseAudioContext, ducked: boolean, at = ctx.currentTime): void {
  bus.level.gain.cancelScheduledValues(at);
  bus.level.gain.setTargetAtTime(ducked ? DUCK : 1, at, 0.08);
  bus.soften.frequency.cancelScheduledValues(at);
  bus.soften.frequency.setTargetAtTime(ducked ? 3200 : 5200, at, 0.1);
  bus.wet.gain.cancelScheduledValues(at);
  bus.wet.gain.setTargetAtTime(ducked ? 0.12 : 0.2, at, 0.1);
}

/** One voice: a sine with two faint partials that fade quicker than the note, a rounded start and a natural fade. */
function voice(ctx: BaseAudioContext, into: AudioNode, n: Note, t0: number, peak: number): void {
  const length = n.length;
  const bright = n.bright ?? 0.5;
  const partials: Array<[number, number, number]> = [
    // [multiple of the pitch, level, how quickly it fades against the note's own length]
    [1, 1, 1],
    [2, 0.2 * bright, 0.55],
    [3.01, 0.07 * bright, 0.35],
  ];
  const attack = Math.min(0.012, length * 0.2);
  for (const [multiple, level, life] of partials) {
    if (level <= 0) continue;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(n.from * multiple, t0);
    if (n.to !== n.from) osc.frequency.exponentialRampToValueAtTime(Math.max(1, n.to * multiple), t0 + length);
    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(peak * level, t0 + attack);
    // a decay that is the shape of a struck thing: it drops fast and trails
    env.gain.setTargetAtTime(0, t0 + attack, (length * life) / 3.2);
    osc.connect(env);
    env.connect(into);
    osc.start(t0);
    osc.stop(t0 + length * 1.2 + 0.05);
  }
}

/** Play a cue into a bus: what `playCue` does, with the context and the time given, so that it can be rendered offline. */
export function renderCue(ctx: BaseAudioContext, bus: Bus, cue: Cue, step: number, volume: number, when: number): void {
  let into: AudioNode = bus.input;
  const pan = panFor(cue, step);
  if (pan !== 0 && "createStereoPanner" in ctx) {
    const panner = ctx.createStereoPanner();
    panner.pan.value = pan;
    panner.connect(bus.input);
    into = panner;
  }
  for (const n of notesFor(cue, step)) {
    voice(ctx, into, n, when + n.at, CEILING * volume * volume * n.gain);
  }
}

// ---- playing ----

let context: AudioContext | null = null;
let bus: Bus | null = null;
const lastAt: Partial<Record<Cue, number>> = {};

/** Whether something is playing, as far as the media session said a moment ago. */
let musicPlaying = false;
let askedAt = -1e9;

function audio(): { ctx: AudioContext; bus: Bus } | null {
  try {
    if (!context) {
      context = new AudioContext({ latencyHint: "interactive" });
      bus = buildBus(context);
    }
    return { ctx: context, bus: bus as Bus };
  } catch {
    return null;
  }
}

/** Ask whether music is playing, at most every few seconds, and bring the cues down or up when it changes. */
function listenForMusic(ctx: AudioContext, b: Bus): void {
  const now = performance.now();
  if (now - askedAt < 3000) return;
  askedAt = now;
  ipc
    .widgetNowPlaying()
    .then((m) => {
      const playing = !!m?.active && !!m?.playing;
      if (playing !== musicPlaying) {
        musicPlaying = playing;
        setDucked(b, ctx, playing);
      }
    })
    .catch(() => undefined);
}

/** Play a cue, if sounds are on. */
export function playCue(cue: Cue, step = 0): void {
  const settings = useSettings.getState().settings?.accessibility;
  if (!settings?.uiSounds) return;
  const volume = Math.max(0, Math.min(1, settings.uiSoundVolume));
  if (volume < 0.01) return;
  const now = performance.now();
  if (now - (lastAt[cue] ?? -1e9) < THROTTLE_MS[cue]) return;
  lastAt[cue] = now;

  const a = audio();
  if (!a) return;
  if (a.ctx.state === "suspended") void a.ctx.resume().catch(() => undefined);
  listenForMusic(a.ctx, a.bus);
  renderCue(a.ctx, a.bus, cue, step, volume, a.ctx.currentTime + 0.005);
}

// for the bench (scripts/offscreen/sound.mjs), which renders the cues and measures them
if (typeof window !== "undefined" && (window as unknown as { __AERO_TEST__?: boolean }).__AERO_TEST__) {
  (window as unknown as { __aeroSound: unknown }).__aeroSound = { CUES, notesFor, inKey, buildBus, setDucked, renderCue, st, CEILING, DUCK };
}
