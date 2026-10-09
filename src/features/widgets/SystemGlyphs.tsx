/**
 * The status glyphs: network, volume, battery, the Recycle Bin, Bluetooth and
 * the little tray arrow. One family, drawn after Apple's symbols: a single
 * weight with round ends, shapes made of whole curves rather than fragments,
 * and "variable" parts (the volume's waves, the signal's arcs) drawn dimmed
 * when they are not lit instead of being left out, so a glyph keeps its shape
 * as its state changes.
 *
 * All are 24 by 24, take their colour from the theme's glyph tokens so every
 * theme stays legible, and are sized by the stylesheet that places them.
 */

import type { BluetoothDevice, SystemStatus } from "../../ipc/types";

/** Ink and warning colours come from theme tokens. */
const GLYPH = "var(--aero-glyph)";
const ALERT = "var(--aero-glyph-alert)";
/** What an unlit part of a glyph is drawn at. */
const DIM = 0.3;

/** A struck-through glyph's slash: red, on a dark edge so it reads over any ink. */
function Slash() {
  return (
    <>
      <line x1="4.8" y1="4.2" x2="19.2" y2="19.8" stroke="rgba(8,20,40,0.45)" strokeWidth="4" strokeLinecap="round" />
      <line x1="4.8" y1="4.2" x2="19.2" y2="19.8" stroke={ALERT} strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

// ---- network ----

/** A wireless fan: a dot and three arcs opening upward from it. */
const FAN_APEX = 19.2;
function fanArc(radius: number): string {
  const half = Math.PI / 4;
  const dx = radius * Math.sin(half);
  const dy = radius * Math.cos(half);
  return `M ${(12 - dx).toFixed(2)} ${(FAN_APEX - dy).toFixed(2)} A ${radius} ${radius} 0 0 1 ${(12 + dx).toFixed(2)} ${(FAN_APEX - dy).toFixed(2)}`;
}
const FAN_RADII = [5.2, 9.2, 13.2];

function WifiShape({ online }: { online: boolean }) {
  const dim = online ? 1 : DIM;
  return (
    <>
      {FAN_RADII.map((r) => (
        <path
          key={r}
          d={fanArc(r)}
          fill="none"
          stroke={GLYPH}
          strokeWidth="2.1"
          strokeLinecap="round"
          opacity={dim}
        />
      ))}
      <circle cx="12" cy={FAN_APEX} r="1.95" fill={GLYPH} opacity={dim} />
    </>
  );
}

/** A network plug: the housing with its contacts, and the cable leaving it. */
function EthernetShape({ online }: { online: boolean }) {
  const dim = online ? 1 : DIM;
  return (
    <g opacity={dim} fill="none" stroke={GLYPH} strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M5 6.4 a2.4 2.4 0 0 1 2.4 -2.4 h9.2 a2.4 2.4 0 0 1 2.4 2.4 v6.1 a2.4 2.4 0 0 1 -2.4 2.4 h-9.2 a2.4 2.4 0 0 1 -2.4 -2.4 z"
        strokeWidth="1.9"
      />
      <path d="M8.9 7 v3.4 M12 7 v3.4 M15.1 7 v3.4" strokeWidth="1.7" />
      <path d="M9.4 14.9 v2.3 h5.2 v-2.3" strokeWidth="1.9" />
      <path d="M12 17.2 v3.6" strokeWidth="1.9" />
    </g>
  );
}

/** Wi-Fi, or a plug when the connection in use is wired. */
export function NetworkGlyph({
  online,
  link = "wifi",
}: {
  online: boolean;
  link?: SystemStatus["link"];
}) {
  return (
    <svg viewBox="0 0 24 24" className="widget-glyph" aria-hidden>
      {link === "ethernet" ? <EthernetShape online={online} /> : <WifiShape online={online} />}
      {!online && <Slash />}
    </svg>
  );
}

// ---- volume ----

/** How many of the three waves a volume lights: none at silence, then a third
 *  of the range each. */
export function waveCount(level: number): 0 | 1 | 2 | 3 {
  if (level <= 0) return 0;
  if (level <= 33) return 1;
  if (level <= 66) return 2;
  return 3;
}

const WAVES = [
  "M15.76 9.7 A3.6 3.6 0 0 1 15.76 14.3",
  "M17.9 7.9 A6.4 6.4 0 0 1 17.9 16.1",
  "M20.05 6.1 A9.2 9.2 0 0 1 20.05 17.9",
];

/** The speaker and its waves, in whatever ink it is given: the speaker's cone,
 *  then waves that are lit up to the level and dim beyond it, or a cross when
 *  muted. */
export function SpeakerShape({
  level,
  muted,
  ink,
  alert,
}: {
  level: number;
  muted: boolean;
  ink: string;
  alert: string;
}) {
  const lit = muted ? 0 : waveCount(level);
  const body = muted ? 0.45 : 1;
  return (
    <>
      <path
        d="M3.5 9.6 a1.4 1.4 0 0 1 1.4 -1.4 h2.6 l4.4 -3.7 a1 1 0 0 1 1.65 .77 v13.46 a1 1 0 0 1 -1.65 .77 l-4.4 -3.7 H4.9 a1.4 1.4 0 0 1 -1.4 -1.4 z"
        fill={ink}
        opacity={body}
      />
      {muted ? (
        <>
          <path d="M16 9.4 l5.2 5.2 M21.2 9.4 l-5.2 5.2" stroke={alert} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      ) : (
        WAVES.map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={ink}
            strokeWidth="1.9"
            strokeLinecap="round"
            opacity={i < lit ? 1 : DIM}
          />
        ))
      )}
    </>
  );
}

export function VolumeGlyph({ level, muted }: { level: number; muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="widget-glyph" aria-hidden>
      <SpeakerShape level={level} muted={muted} ink={GLYPH} alert={ALERT} />
    </svg>
  );
}

// ---- battery ----

export function BatteryGlyph({ percent, charging }: { percent: number; charging: boolean }) {
  const fill = Math.max(0.08, Math.min(1, percent / 100));
  const low = percent <= 20 && !charging;
  const color = low ? ALERT : GLYPH;
  return (
    <svg viewBox="0 0 24 24" className="widget-glyph" aria-hidden>
      <rect x="1.9" y="6.6" width="18.2" height="10.8" rx="3.1" fill="none" stroke={GLYPH} strokeWidth="1.5" opacity="0.6" />
      <path d="M21.7 10.4 v3.2 a1.6 1.6 0 0 0 0 -3.2 z" fill={GLYPH} opacity="0.6" />
      <rect x="3.7" y="8.4" width={Math.max(2.2, 14.6 * fill)} height="7.2" rx="1.7" fill={color} />
      {charging && (
        <path
          d="M12.7 7.7 L8.6 12.5 h3 l-.7 4 4.2 -5.1 h-3 z"
          fill="#fff"
          stroke="rgba(8,24,44,0.55)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

// ---- the rest ----

/** The little up arrow: the system tray's hidden icons. */
export function TrayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="widget-glyph" aria-hidden>
      <path
        d="M6.2 15 L12 9 L17.8 15"
        fill="none"
        stroke={GLYPH}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BluetoothGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="widget-glyph" aria-hidden>
      <path
        d="M7 8.2 L16.6 15.8 L12 19.6 V4.4 L16.6 8.2 L7 15.8"
        fill="none"
        stroke={GLYPH}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A bin with its lid and handle, and the two grooves down its side. It fills
 *  with the ink when there is something in it. */
export function BinGlyph({ full }: { full: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="widget-glyph widget-glyph-bin" aria-hidden>
      <path
        d="M6.1 7.4 l.95 11.2 a2.1 2.1 0 0 0 2.1 1.9 h5.7 a2.1 2.1 0 0 0 2.1 -1.9 l.95 -11.2"
        fill={full ? GLYPH : "none"}
        fillOpacity={full ? 0.3 : 0}
        stroke={GLYPH}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.2 7.4 H19.8 M9.4 7.4 V5.9 a1.6 1.6 0 0 1 1.6 -1.6 h2 a1.6 1.6 0 0 1 1.6 1.6 V7.4"
        fill="none"
        stroke={GLYPH}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.2 11.2 v5.4 M13.8 11.2 v5.4" stroke={GLYPH} strokeWidth="1.6" strokeLinecap="round" opacity={full ? 0.95 : 0.5} />
    </svg>
  );
}

// ---- the Control Center's lists ----

/** The sun: brightness. Its rays are dimmed to a third of the way up and lit
 *  as the level rises, like the volume's waves. */
export function SunGlyph({ level }: { level: number }) {
  const rays = 8;
  const lit = Math.max(2, Math.round((Math.max(0, Math.min(100, level)) / 100) * rays));
  return (
    <svg viewBox="0 0 24 24" className="widget-glyph" aria-hidden>
      <circle cx="12" cy="12" r="4.3" fill={GLYPH} />
      {Array.from({ length: rays }, (_, i) => {
        const a = (i * 2 * Math.PI) / rays;
        const [x1, y1] = [12 + 7.4 * Math.sin(a), 12 - 7.4 * Math.cos(a)];
        const [x2, y2] = [12 + 10 * Math.sin(a), 12 - 10 * Math.cos(a)];
        return (
          <line
            key={i}
            x1={x1.toFixed(2)}
            y1={y1.toFixed(2)}
            x2={x2.toFixed(2)}
            y2={y2.toFixed(2)}
            stroke={GLYPH}
            strokeWidth="1.9"
            strokeLinecap="round"
            opacity={i < lit ? 1 : DIM}
          />
        );
      })}
    </svg>
  );
}

/** Four bars, lit to the signal's strength. */
export function SignalGlyph({ signal }: { signal: number }) {
  const lit = signal >= 75 ? 4 : signal >= 50 ? 3 : signal >= 25 ? 2 : 1;
  return (
    <svg viewBox="0 0 24 24" className="cc-row-glyph" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={3.5 + i * 4.6}
          y={17.5 - (i + 1) * 3.6}
          width="3"
          height={(i + 1) * 3.6}
          rx="1.2"
          fill="currentColor"
          opacity={i < lit ? 1 : DIM}
        />
      ))}
    </svg>
  );
}

export function LockGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="cc-row-mark" aria-hidden>
      <rect x="5.5" y="10.5" width="13" height="9.5" rx="2.6" fill="currentColor" />
      <path d="M8.5 10.5 V8.2 a3.5 3.5 0 0 1 7 0 V10.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="cc-row-mark" aria-hidden>
      <path d="M5.5 12.8 L10 17.2 L18.5 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A chevron, pointing down, that turns to point up when `open`. */
export function ChevronGlyph({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="cc-chevron-glyph" data-open={open} aria-hidden>
      <path d="M7 9.5 L12 14.5 L17 9.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A paired device, drawn as what it is. */
export function DeviceGlyph({ sort }: { sort: BluetoothDevice["sort"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 24 24" className="cc-row-glyph" aria-hidden>
      {sort === "audio" && (
        <>
          <path d="M5 15 V12 a7 7 0 0 1 14 0 V15" {...common} />
          <rect x="4" y="14" width="4" height="6" rx="1.6" fill="currentColor" />
          <rect x="16" y="14" width="4" height="6" rx="1.6" fill="currentColor" />
        </>
      )}
      {sort === "input" && (
        <>
          <rect x="3.5" y="7" width="17" height="10.5" rx="2.4" {...common} />
          <path d="M7.5 11 h.01 M11 11 h.01 M14.5 11 h.01 M17 11 h.01 M8 14.5 h8" {...common} />
        </>
      )}
      {sort === "phone" && (
        <>
          <rect x="7" y="3.5" width="10" height="17" rx="2.6" {...common} />
          <path d="M11 17.6 h2" {...common} />
        </>
      )}
      {sort === "computer" && (
        <>
          <rect x="5" y="5.5" width="14" height="9.5" rx="1.8" {...common} />
          <path d="M3 18.5 h18" {...common} />
        </>
      )}
      {sort === "other" && <path d="M7 8.2 L16.6 15.8 L12 19.6 V4.4 L16.6 8.2 L7 15.8" {...common} />}
    </svg>
  );
}