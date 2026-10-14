/**
 * The dock's own controls: search and settings.
 *
 * Round glass buttons with a single clean symbol on them, after Apple's:
 * a magnifying glass and a gear, drawn in one weight with round ends. The
 * symbol is the light one the menu bar's icons use, on glass tinted with the
 * theme's colour, with a soft shadow that lifts it off the glass.
 */

import type { ReactNode } from "react";
import { useGlass } from "../../engine/backdrop/useGlass";
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  const dockGlass = useGlass("dock");
  return (
    <button className="dock-control-btn" title={label} aria-label={label} onClick={onClick}>
    <BackdropLayer active={dockGlass.active} blur={dockGlass.blur} grain={dockGlass.grain} tint="own" />
      <svg viewBox="0 0 24 24">{children}</svg>
    </button>
  );
}

export function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <ControlButton label="Search apps and files" onClick={onClick}>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <circle cx="10.4" cy="10.4" r="6.1" strokeWidth="2.3" />
        <path d="M15.1 15.1 L20 20" strokeWidth="2.6" />
      </g>
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
      <path
        d={`${GEAR} M 8.5 12 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 Z`}
        fill="currentColor"
        fillRule="evenodd"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        transform="translate(12 12) scale(0.94) translate(-12 -12)"
      />
    </ControlButton>
  );
}
