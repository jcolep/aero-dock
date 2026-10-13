/**
 * The dock's own controls: search and settings.
 *
 * Round glass buttons with a symbol made of glass on them, the way the rest of
 * the theme is: a lens with a glint in it on a metal handle, and a gear of
 * polished metal with its hole cut through to the orb. Both are lit from above
 * (bright along the top edge, a thin dark line along the bottom) and have a
 * soft shadow that lifts them off the orb, which is tinted with the theme's
 * colour and has the gloss of the dock's own glass across its top.
 */

import type { ReactNode } from "react";

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button className="dock-control-btn" title={label} aria-label={label} onClick={onClick}>
      <svg viewBox="0 0 24 24">
        <defs>
          {/* polished metal: white on top, a cool pale blue at the bottom */}
          <linearGradient id="dcb-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#e4f2fc" />
            <stop offset="1" stopColor="#b9d9f2" />
          </linearGradient>
          {/* the lens: clear glass, a little brighter where the light hits it */}
          <radialGradient id="dcb-lens" cx="0.34" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.62" />
            <stop offset="0.55" stopColor="#d6ecfb" stopOpacity="0.16" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.3" />
          </radialGradient>
        </defs>
        {children}
      </svg>
    </button>
  );
}

export function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <ControlButton label="Search apps and files" onClick={onClick}>
      {/* the handle, behind the rim */}
      <path d="M15.2 15.2 L20.1 20.1" fill="none" stroke="rgba(6,34,66,0.45)" strokeWidth="4.1" strokeLinecap="round" />
      <path d="M15.2 15.2 L20.1 20.1" fill="none" stroke="url(#dcb-metal)" strokeWidth="3.2" strokeLinecap="round" />
      {/* the lens, inside its metal rim */}
      <circle cx="10.2" cy="10.2" r="6.5" fill="url(#dcb-lens)" stroke="rgba(6,34,66,0.45)" strokeWidth="3.4" />
      <circle cx="10.2" cy="10.2" r="6.5" fill="none" stroke="url(#dcb-metal)" strokeWidth="2.5" />
      {/* the glint */}
      <path d="M6.6 9.3 A4 4 0 0 1 9.6 6.7" fill="none" stroke="#fff" strokeOpacity="0.95" strokeWidth="1.3" strokeLinecap="round" />
    </ControlButton>
  );
}

/**
 * A gear of eight teeth with rounded corners and a round hole, built from its
 * geometry so the teeth are even: each tooth is a short flat top on a wider
 * root, and the valleys between are arcs of one circle.
 */
const GEAR_TEETH = 8;
const GEAR_OUTER = 10;
const GEAR_ROOT = 7.7;
function gearPath(): string {
  const at = (radius: number, degrees: number) => {
    const a = (degrees * Math.PI) / 180;
    return `${(12 + radius * Math.sin(a)).toFixed(2)} ${(12 - radius * Math.cos(a)).toFixed(2)}`;
  };
  const pitch = 360 / GEAR_TEETH;
  const top = 8.5;
  const foot = 14.5;
  let d = "";
  for (let i = 0; i < GEAR_TEETH; i++) {
    const c = i * pitch;
    d += `${i === 0 ? "M" : "A " + GEAR_ROOT + " " + GEAR_ROOT + " 0 0 1"} ${at(GEAR_ROOT, c - foot)} `;
    d += `L ${at(GEAR_OUTER, c - top)} `;
    d += `A ${GEAR_OUTER} ${GEAR_OUTER} 0 0 1 ${at(GEAR_OUTER, c + top)} `;
    d += `L ${at(GEAR_ROOT, c + foot)} `;
  }
  return `${d}A ${GEAR_ROOT} ${GEAR_ROOT} 0 0 1 ${at(GEAR_ROOT, -foot)} Z`;
}
const GEAR = gearPath();

export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <ControlButton label="Aero Dock settings" onClick={onClick}>
      {/* the hole is cut out of the gear, so what is behind shows through it */}
      <g transform="translate(12 12) scale(0.94) translate(-12 -12)">
        {/* the edge it casts on the orb, then the metal */}
        <path
          d={`${GEAR} M 8.5 12 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 Z`}
          fill="rgba(6,34,66,0.5)"
          fillRule="evenodd"
          stroke="rgba(6,34,66,0.5)"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
        <path
          d={`${GEAR} M 8.5 12 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 Z`}
          fill="url(#dcb-metal)"
          fillRule="evenodd"
          stroke="url(#dcb-metal)"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        {/* the light along the top of the teeth */}
        <path d="M5.4 5.6 A9 9 0 0 1 12 2.9" fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.2" strokeLinecap="round" />
        {/* a lip round the hole */}
        <circle cx="12" cy="12" r="3.5" fill="none" stroke="rgba(6,34,66,0.35)" strokeWidth="0.9" />
      </g>
    </ControlButton>
  );
}
