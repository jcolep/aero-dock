/**
 * The dock's own controls: the Liquidock button (Start) and settings.
 *
 * Settings is a round glass button with a single clean symbol on it, after
 * Apple's: a gear, drawn in one weight with round ends. The
 * symbol is the light one the menu bar's icons use, on glass tinted with the
 * theme's color, with a soft shadow that lifts it off the glass.
 */

import { useId, type ReactNode } from "react";
import { useGlass } from "../../engine/backdrop/useGlass";
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";
import { Droplet } from "../../engine/brand/droplet";
import { DROP_PATH } from "../../engine/brand/dropletSvg";

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

/**
 * The Liquidock button, where the search button was: Liquidock's drop on its own, no glass circle behind it, opening
 * Start the way the Windows button does on the taskbar. Under the pointer light plays over it, laid on top of the drop
 * and clipped to its shape (dock.css, `.dock-drop-btn`): a glint sweeping across (`sweep`, the default), the light at
 * its foot swelling with a glow behind (`caustic`), or a bright line tracing its outline (`rim`). All three are
 * transitions on `:hover`, so leaving part way turns them back.
 */
export function LiquidockButton({ onClick, shine }: { onClick: () => void; shine: "sweep" | "caustic" | "rim" }) {
  const id = `ldb${useId().replace(/:/g, "")}`;
  return (
    <button className="dock-drop-btn" data-shine={shine} title="Start" aria-label="Start" onClick={onClick}>
      <Droplet size={100} className="dock-drop-mark" />
      <svg className="dock-drop-shine" viewBox="0 0 100 100" aria-hidden>
        <defs>
          <clipPath id={`${id}-clip`}>
            <path d={DROP_PATH} />
          </clipPath>
          <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset="0.5" stopColor="white" stopOpacity="0.85" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${id}-hot`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="white" stopOpacity="1" />
            <stop offset="0.5" style={{ stopColor: "color-mix(in srgb, var(--aero-accent) 30%, white)", stopOpacity: 0.7 }} />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-halo`} cx="0.5" cy="0.6" r="0.5">
            <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--aero-accent) 60%, white)", stopOpacity: 0.65 }} />
            <stop offset="1" style={{ stopColor: "var(--aero-accent)", stopOpacity: 0 }} />
          </radialGradient>
        </defs>
        {shine === "sweep" && (
          <g clipPath={`url(#${id}-clip)`}>
            <rect className="dock-drop-band" x="-30" y="-20" width="34" height="160" fill={`url(#${id}-band)`} />
          </g>
        )}
        {shine === "caustic" && (
          <>
            <ellipse className="dock-drop-halo" cx="50" cy="60" rx="56" ry="54" fill={`url(#${id}-halo)`} />
            <g clipPath={`url(#${id}-clip)`}>
              <ellipse className="dock-drop-pool" cx="51" cy="80" rx="26" ry="13" fill={`url(#${id}-hot)`} />
            </g>
          </>
        )}
        {shine === "rim" && (
          <path className="dock-drop-trace" d={DROP_PATH} pathLength={100} fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
        )}
      </svg>
    </button>
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
    <ControlButton label="Liquidock settings" onClick={onClick}>
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
