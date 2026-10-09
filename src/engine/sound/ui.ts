/**
 * Soft interface sounds, made on the spot: a short pure tone or two with a
 * rounded attack and a quick fade, through a low-pass so nothing is sharp.
 * There are no sound files to ship or to load.
 *
 * Off by default (Settings > Accessibility). When on, they are quiet: loud
 * enough to be a texture, never an alert. A cue plays only from a page that has
 * had a click, as browsers require; the first hover before any click is silent.
 */

import { useSettings } from "../../state/settingsStore";

export type Cue = "open" | "close" | "on" | "off" | "tick" | "launch" | "hover" | "notch";

interface Note {
  /** Frequency at the start and at the end, in Hz. */
  from: number;
  to: number;
  /** Seconds after the cue starts, and how long it lasts. */
  at: number;
  length: number;
  /** Loudness relative to the cue's own ceiling. */
  gain: number;
}

const note = (from: number, to: number, at: number, length: number, gain = 1): Note => ({ from, to, at, length, gain });

/** What each cue is made of. */
export const CUES: Record<Cue, Note[]> = {
  // a menu rises
  open: [note(540, 760, 0, 0.11)],
  // and settles back
  close: [note(720, 470, 0, 0.1, 0.8)],
  // a switch goes on: two notes, upward
  on: [note(660, 660, 0, 0.09, 0.9), note(990, 990, 0.07, 0.13, 0.8)],
  // and off: the same two, downward
  off: [note(880, 880, 0, 0.09, 0.8), note(587, 587, 0.07, 0.13, 0.7)],
  // the lens arriving at a button: barely there
  tick: [note(2100, 1700, 0, 0.03, 0.22)],
  // an app opening: a small chord, rising
  launch: [note(392, 392, 0, 0.16), note(588, 588, 0.05, 0.16, 0.8), note(784, 784, 0.1, 0.2, 0.6)],
  // these two depend on what they are played for (see notesFor)
  hover: [],
  notch: [],
};

/** The semitones of a pentatonic scale, so that any run of notes agrees with
 *  itself: sweeping across a row of icons plays a little tune, never a clash. */
const PENTATONIC = [0, 2, 4, 7, 9];

/** The notes for a cue. `step` is which icon the pointer is on, for `hover`, and
 *  which way a wheel notch turned (1 up, -1 down), for `notch`. */
export function notesFor(cue: Cue, step: number): Note[] {
  if (cue === "hover") {
    // up the scale along the dock, and round again an octave higher
    const i = ((Math.round(step) % 10) + 10) % 10;
    const semitones = PENTATONIC[i % 5] + 12 * Math.floor(i / 5);
    const f = 523.25 * 2 ** (semitones / 12);
    return [note(f, f, 0, 0.1, 0.34)];
  }
  if (cue === "notch") {
    // a wheel turned up rises, and turned down falls
    return step >= 0 ? [note(900, 1120, 0, 0.045, 0.5)] : [note(1020, 780, 0, 0.045, 0.5)];
  }
  return CUES[cue];
}

/** The loudest a cue gets at full volume, so even then it is not a shout. */
const CEILING = 0.2;

/** The fewest milliseconds between two plays of one cue, so a quick sweep of
 *  the pointer is a trickle and not a rattle. */
const THROTTLE_MS: Record<Cue, number> = { open: 60, close: 60, on: 60, off: 60, tick: 70, launch: 120, hover: 45, notch: 40 };

let context: AudioContext | null = null;
let master: GainNode | null = null;
const lastAt: Partial<Record<Cue, number>> = {};

function audio(): { ctx: AudioContext; out: AudioNode } | null {
  try {
    if (!context) {
      context = new AudioContext();
      const soften = context.createBiquadFilter();
      soften.type = "lowpass";
      soften.frequency.value = 3200;
      master = context.createGain();
      master.connect(soften);
      soften.connect(context.destination);
    }
    return { ctx: context, out: master as AudioNode };
  } catch {
    return null;
  }
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
  const { ctx, out } = a;
  if (ctx.state === "suspended") void ctx.resume().catch(() => undefined);

  const start = ctx.currentTime + 0.005;
  for (const n of notesFor(cue, step)) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    const t0 = start + n.at;
    osc.frequency.setValueAtTime(n.from, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, n.to), t0 + n.length);
    const peak = CEILING * volume * volume * n.gain;
    env.gain.setValueAtTime(0.0001, t0);
    // a rounded start, then a fade that never quite clicks
    env.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + n.length);
    osc.connect(env);
    env.connect(out);
    osc.start(t0);
    osc.stop(t0 + n.length + 0.02);
  }
}
