/**
 * Liquidock's mark: a drop of glass, tinted with the theme's color.
 *
 * Drawn in layers as glass is: the body (pale at the top, deeper toward its round foot), a darkening near the edge
 * that gives it thickness, the light caught down its left side and near its tip, the bright pool where light comes
 * through and gathers at the bottom (a caustic), a glint at the foot, and a rim of light round it.
 *
 * `Droplet` draws it in the page and follows the theme's color as it changes (its colors are CSS, mixed from
 * `--aero-accent`). `dropletSvg` (dropletSvg.js) writes the same drawing in one fixed color, for the tray icon and the
 * app's icon files: change one, change the other.
 */

import { useId } from "react";
import { DROP_PATH, STREAK_PATH, TIP_PATH } from "./dropletSvg";

export function Droplet({ size = 20, tint = "var(--aero-accent, #8fb3d9)", shadow = false, className }: { size?: number; tint?: string; shadow?: boolean; className?: string }) {
  const id = `drop${useId().replace(/:/g, "")}`;
  const g = (name: string) => `${id}-${name}`;
  const mix = (pct: number, other: string) => `color-mix(in srgb, ${tint} ${pct}%, ${other})`;
  return (
    <svg className={className} viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <defs>
        <linearGradient id={g("body")} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" style={{ stopColor: mix(14, "white") }} />
          <stop offset="0.55" style={{ stopColor: mix(34, "white") }} />
          <stop offset="1" style={{ stopColor: mix(62, "white") }} />
        </linearGradient>
        <radialGradient id={g("depth")} cx="0.46" cy="0.6" r="0.58">
          <stop offset="0.62" style={{ stopColor: mix(70, "#0b1626"), stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: mix(70, "#0b1626"), stopOpacity: 0.42 }} />
        </radialGradient>
        <radialGradient id={g("caustic")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "white", stopOpacity: 0.95 }} />
          <stop offset="0.45" style={{ stopColor: mix(18, "white"), stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: mix(18, "white"), stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id={g("streak")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "white", stopOpacity: 0.95 }} />
          <stop offset="0.7" style={{ stopColor: "white", stopOpacity: 0.35 }} />
          <stop offset="1" style={{ stopColor: "white", stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id={g("rim")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "white", stopOpacity: 0.95 }} />
          <stop offset="0.6" style={{ stopColor: "white", stopOpacity: 0.45 }} />
          <stop offset="1" style={{ stopColor: mix(55, "#0b1626") }} />
        </linearGradient>
        <radialGradient id={g("shadow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "#06101e", stopOpacity: 0.32 }} />
          <stop offset="1" style={{ stopColor: "#06101e", stopOpacity: 0 }} />
        </radialGradient>
        <clipPath id={g("clip")}>
          <path d={DROP_PATH} />
        </clipPath>
      </defs>
      {shadow && <ellipse cx="50" cy="95" rx="27" ry="4.2" fill={`url(#${g("shadow")})`} />}
      <path d={DROP_PATH} fill={`url(#${g("body")})`} />
      <g clipPath={`url(#${g("clip")})`}>
        <path d={DROP_PATH} fill={`url(#${g("depth")})`} />
        {/* the light gathered at the foot */}
        <ellipse cx="51" cy="81" rx="21" ry="10" fill={`url(#${g("caustic")})`} />
        {/* light down the left side, and near the tip on the right */}
        <path d={STREAK_PATH} fill={`url(#${g("streak")})`} />
        <path d={TIP_PATH} fill="white" fillOpacity="0.85" />
        {/* a glint at the foot */}
        <ellipse cx="37" cy="85.5" rx="3.6" ry="2.1" fill="white" fillOpacity="0.9" transform="rotate(-22 37 85.5)" />
      </g>
      <path d={DROP_PATH} fill="none" stroke={`url(#${g("rim")})`} strokeWidth="1.6" />
    </svg>
  );
}
