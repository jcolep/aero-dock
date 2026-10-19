/**
 * Liquidock's mark: a drop of frosted glass, tinted with the theme's color.
 *
 * True alpha transparency rather than an opaque fill shaded to look translucent: the shape is a turbulence-and-blur
 * diffusion (`frost`) over a soft radial glow, so whatever sits behind the mark shows through it, softened, the way
 * light comes through sandblasted glass. This was picked after comparing five real rendering techniques side by
 * side (an artifact built for that comparison, October 2026) over a sharper, sheener look this drew before. A
 * pooled highlight at the foot, one soft catch of light near the top, and an inset inner edge for thickness carry
 * over from that older drawing; a crisp directional streak down the left side did not, since a hard-edged highlight
 * reads as polished glass, not frosted. Below about 32px the grain softens into a plain glow, which is ordinary icon
 * behavior at small sizes, not a defect.
 *
 * `Droplet` draws it in the page and follows the theme's color as it changes (its colors are CSS, mixed from
 * `--aero-accent`). `dropletSvg` (dropletSvg.js) writes the same drawing in one fixed color, for the tray icon and the
 * app's icon files: change one, change the other.
 */

import { useId } from "react";
import { DROP_PATH } from "./dropletSvg";

/**
 * `solid` paints the body in the colour as solid glass (light at the top, the colour, deeper at the foot) instead of
 * frosting it: the dock's Liquidock button by default (picked from a comparison, October 2026), where a see-through
 * drop all but vanished over a white window.
 */
export function Droplet({ size = 20, tint = "var(--aero-accent, #8fb3d9)", shadow = false, solid = false, className }: { size?: number; tint?: string; shadow?: boolean; solid?: boolean; className?: string }) {
  const id = `drop${useId().replace(/:/g, "")}`;
  const g = (name: string) => `${id}-${name}`;
  const mix = (pct: number, other: string) => `color-mix(in srgb, ${tint} ${pct}%, ${other})`;
  return (
    <svg className={className} viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <defs>
        <filter id={g("frost")} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="11" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0" result="speck" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.6" result="soft" />
          <feMerge>
            <feMergeNode in="soft" />
            <feMergeNode in="speck" />
          </feMerge>
        </filter>
        {/* the body: a soft bright-to-tinted pool, diffused by the frost filter below rather than a flat fill */}
        <radialGradient id={g("glow")} cx="0.46" cy="0.38" r="0.68">
          <stop offset="0" style={{ stopColor: "white", stopOpacity: 0.55 }} />
          <stop offset="0.45" style={{ stopColor: tint, stopOpacity: 0.32 }} />
          <stop offset="1" style={{ stopColor: tint, stopOpacity: 0.14 }} />
        </radialGradient>
        {/* the light gathered at the foot */}
        <radialGradient id={g("caustic")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "white", stopOpacity: 0.8 }} />
          <stop offset="0.45" style={{ stopColor: mix(18, "white"), stopOpacity: 0.5 }} />
          <stop offset="1" style={{ stopColor: mix(18, "white"), stopOpacity: 0 }} />
        </radialGradient>
        {/* one soft catch of light, not a sharp glint: frosted glass still breaks a highlight, just diffused */}
        <radialGradient id={g("catch")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "white", stopOpacity: 0.8 }} />
          <stop offset="0.4" style={{ stopColor: "white", stopOpacity: 0.6 }} />
          <stop offset="1" style={{ stopColor: "white", stopOpacity: 0 }} />
        </radialGradient>
        {/* the inner wall of the glass: a second, inset edge lit from the same
            corner as the rim, which is what makes the outer edge read as having
            real thickness instead of being a flat outline */}
        <linearGradient id={g("inner")} x1="0.15" y1="0.1" x2="0.75" y2="0.85">
          <stop offset="0" style={{ stopColor: "white", stopOpacity: 0.6 }} />
          <stop offset="0.5" style={{ stopColor: "white", stopOpacity: 0.1 }} />
          <stop offset="1" style={{ stopColor: "white", stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id={g("rim")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "white", stopOpacity: 0.85 }} />
          <stop offset="0.6" style={{ stopColor: "white", stopOpacity: 0.4 }} />
          <stop offset="1" style={{ stopColor: mix(55, "#0b1626") }} />
        </linearGradient>
        <radialGradient id={g("shadow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "#06101e", stopOpacity: 0.32 }} />
          <stop offset="1" style={{ stopColor: "#06101e", stopOpacity: 0 }} />
        </radialGradient>
        <clipPath id={g("clip")}>
          <path d={DROP_PATH} />
        </clipPath>
        {/* the solid body: light at the top, the colour through the middle, deeper at the foot */}
        <linearGradient id={g("solid")} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" style={{ stopColor: mix(70, "#ffffff") }} />
          <stop offset="0.6" style={{ stopColor: tint }} />
          <stop offset="1" style={{ stopColor: mix(70, "#0b1626") }} />
        </linearGradient>
      </defs>
      {shadow && <ellipse cx="50" cy="95" rx="27" ry="4.2" fill={`url(#${g("shadow")})`} />}
      {solid ? (
        <path d={DROP_PATH} fill={`url(#${g("solid")})`} />
      ) : (
        <g clipPath={`url(#${g("clip")})`} filter={`url(#${g("frost")})`}>
          <path d={DROP_PATH} fill={`url(#${g("glow")})`} />
        </g>
      )}
      <g clipPath={`url(#${g("clip")})`}>
        <ellipse cx="51" cy="81" rx="21" ry="10" fill={`url(#${g("caustic")})`} />
        <ellipse cx="38" cy="23" rx="4.2" ry="10.5" fill={`url(#${g("catch")})`} transform="rotate(-15 38 23)" />
        <ellipse cx="37" cy="85.5" rx="3.6" ry="2.1" fill="white" fillOpacity="0.7" transform="rotate(-22 37 85.5)" />
      </g>
      <path d={DROP_PATH} fill="none" stroke={`url(#${g("rim")})`} strokeWidth="1.6" />
      <path
        d={DROP_PATH}
        fill="none"
        stroke={`url(#${g("inner")})`}
        strokeWidth="1.1"
        transform="translate(50 54) scale(0.93) translate(-50 -54)"
      />
    </svg>
  );
}
