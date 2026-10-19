// Liquidock's mark as a standalone SVG in one color, for pictures made from it: the tray icon (tinted with the theme
// color) and the app's icon files (scripts/brand/make-icons.mjs). Plain JavaScript so a Node script can use it as it
// is. The drawing is the same as `Droplet` in droplet.tsx: change one, change the other.

/** The drop, in a 100 × 100 box: a point at the top, a round foot. */
export const DROP_PATH = "M50 5 C57 19 81 39 81 63 A31 31 0 0 1 19 63 C19 39 43 19 50 5 Z";

/** The light down its left side, and near its tip. */
export const STREAK_PATH = "M44 15 C35 31 25 44 25.5 62 C26 70 28.5 76 32 80 C30 72 29.5 66 30.5 58 C32 43 39 30 44 15 Z";
export const TIP_PATH = "M54 17 C59 26 66 33 69 42 C64 37 58 30 54 17 Z";

/**
 * The drop tinted with `hex` (`#rrggbb`), `px` square, with a soft shadow under it if asked. Colors are resolved to
 * plain values: an SVG drawn as a picture has no page around it to take variables from.
 *
 * Frosted glass, picked after comparing five real techniques (an artifact built for that comparison): true alpha
 * transparency (the shape is never filled opaque), diffused by a turbulence-and-blur filter so it reads as
 * sandblasted rather than polished. Chosen over a crisper, sharper-sheen look (what this drew before) because that
 * is the one the owner wants; it keeps its grain down to about 32px and softens to a plain glow below that, which is
 * normal icon behavior, not a bug.
 */
export function dropletSvg(hex, px = 256, shadow = false) {
  const tint = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const mix = (pct, other) => `rgb(${tint.map((c, i) => Math.round((c * pct + other[i] * (100 - pct)) / 100)).join(",")})`;
  const D = [11, 22, 38];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${px}" height="${px}">
<defs>
<filter id="frost" x="-20%" y="-20%" width="140%" height="140%">
<feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="11" result="n"/>
<feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0" result="speck"/>
<feGaussianBlur in="SourceGraphic" stdDeviation="2.6" result="soft"/>
<feMerge><feMergeNode in="soft"/><feMergeNode in="speck"/></feMerge>
</filter>
<radialGradient id="glow" cx="0.46" cy="0.38" r="0.68"><stop offset="0" stop-color="#fff" stop-opacity="0.55"/><stop offset="0.45" stop-color="${hex}" stop-opacity="0.32"/><stop offset="1" stop-color="${hex}" stop-opacity="0.14"/></radialGradient>
<radialGradient id="caustic" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff" stop-opacity="0.8"/><stop offset="0.45" stop-color="${mix(18, [255, 255, 255])}" stop-opacity="0.5"/><stop offset="1" stop-color="${mix(18, [255, 255, 255])}" stop-opacity="0"/></radialGradient>
<radialGradient id="catch" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff" stop-opacity="0.8"/><stop offset="0.4" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="inner" x1="0.15" y1="0.1" x2="0.75" y2="0.85"><stop offset="0" stop-color="#fff" stop-opacity="0.6"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.85"/><stop offset="0.6" stop-color="#fff" stop-opacity="0.4"/><stop offset="1" stop-color="${mix(55, D)}"/></linearGradient>
<radialGradient id="shadow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#06101e" stop-opacity="0.32"/><stop offset="1" stop-color="#06101e" stop-opacity="0"/></radialGradient>
<clipPath id="clip"><path d="${DROP_PATH}"/></clipPath>
</defs>
${shadow ? `<ellipse cx="50" cy="95" rx="27" ry="4.2" fill="url(#shadow)"/>` : ""}
<g clip-path="url(#clip)" filter="url(#frost)">
<path d="${DROP_PATH}" fill="url(#glow)"/>
</g>
<g clip-path="url(#clip)">
<ellipse cx="51" cy="81" rx="21" ry="10" fill="url(#caustic)"/>
<ellipse cx="38" cy="23" rx="4.2" ry="10.5" fill="url(#catch)" transform="rotate(-15 38 23)"/>
<ellipse cx="37" cy="85.5" rx="3.6" ry="2.1" fill="#fff" fill-opacity="0.7" transform="rotate(-22 37 85.5)"/>
</g>
<path d="${DROP_PATH}" fill="none" stroke="url(#rim)" stroke-width="1.6"/>
<path d="${DROP_PATH}" fill="none" stroke="url(#inner)" stroke-width="1.1" transform="translate(50 54) scale(0.93) translate(-50 -54)"/>
</svg>`;
}
