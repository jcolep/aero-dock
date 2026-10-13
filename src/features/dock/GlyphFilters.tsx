/**
 * The dock's own symbols (Search, Settings, and the clock's neighbours: network, volume, battery, the Recycle Bin)
 * follow the icon look chosen for apps, as an app's icon does: plain leaves them as drawn (white), and glass, clear
 * and tinted treat the drawing the way `glassicon.rs` treats an icon's pixels, here as SVG filters on the symbol.
 *
 * - glass keeps the symbol's colours and gives it a body of glass: a rim of light on the edges that face the light
 *   (the upper left), a soft shade on those that face away, and a shadow under it;
 * - clear keeps only a frosted, see-through shape of it;
 * - tinted is the same in the theme's colour.
 *
 * The filters are in pixels (the symbol's size on the page), so the rim is as thin on a 16px symbol as on a 30px one.
 * `--glyph-tint` and `--glyph-tint-deep` come from the theme (see applyAppearance); the stylesheet applies the filter
 * for the look that is on (dock.css). One set of filters per window, drawn nowhere.
 */

/** The light and the shade of an edge, from the shape's own silhouette: the shape less a copy of it moved away from
 *  the light is the edge that faces the light, and the other way round is the edge that faces away. */
function Edges({ rim, shade }: { rim: { color: string; opacity: number }; shade: { color: string; opacity: number } }) {
  return (
    <>
      <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" result="soft" />
      <feOffset in="soft" dx="0.9" dy="1" result="toward" />
      <feComposite in="SourceAlpha" in2="toward" operator="out" result="lit" />
      <feOffset in="soft" dx="-0.9" dy="-1" result="away" />
      <feComposite in="SourceAlpha" in2="away" operator="out" result="shaded" />
      <feFlood floodColor={rim.color} floodOpacity={rim.opacity} />
      <feComposite in2="lit" operator="in" result="rim" />
      <feFlood floodColor={shade.color} floodOpacity={shade.opacity} />
      <feComposite in2="shaded" operator="in" result="shade" />
    </>
  );
}

function Shadow({ opacity }: { opacity: number }) {
  return (
    <>
      <feGaussianBlur in="SourceAlpha" stdDeviation="0.9" result="sh" />
      <feOffset in="sh" dy="1" result="sh2" />
      <feFlood floodColor="#03142a" floodOpacity={opacity} />
      <feComposite in2="sh2" operator="in" result="drop" />
    </>
  );
}

const REGION = { x: "-30%", y: "-30%", width: "160%", height: "160%", colorInterpolationFilters: "sRGB" } as const;

export function GlyphFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
      <defs>
        <filter id="aero-glyph-glass" {...REGION}>
          <Edges rim={{ color: "#ffffff", opacity: 0.92 }} shade={{ color: "#04203e", opacity: 0.4 }} />
          {/* its own colours, a touch lighter and livelier, and a little see-through */}
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1.04 0 0 0 0.02  0 1.04 0 0 0.03  0 0 1.06 0 0.05  0 0 0 0.92 0"
            result="body"
          />
          <Shadow opacity={0.42} />
          <feMerge>
            <feMergeNode in="drop" />
            <feMergeNode in="body" />
            <feMergeNode in="shade" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>

        <filter id="aero-glyph-clear" {...REGION}>
          <Edges rim={{ color: "#ffffff", opacity: 0.8 }} shade={{ color: "#04203e", opacity: 0.16 }} />
          {/* a frosted shape: soft, pale and half there */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="frost" />
          <feColorMatrix
            in="frost"
            type="matrix"
            values="0.4 0.3 0.3 0 0.2  0.3 0.4 0.3 0 0.24  0.3 0.3 0.4 0 0.28  0 0 0 0.5 0"
            result="body"
          />
          <Shadow opacity={0.2} />
          <feMerge>
            <feMergeNode in="drop" />
            <feMergeNode in="body" />
            <feMergeNode in="shade" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>

        <filter id="aero-glyph-tinted" {...REGION}>
          <Edges rim={{ color: "#ffffff", opacity: 0.8 }} shade={{ color: "#04203e", opacity: 0.3 }} />
          {/* the symbol, in the theme's colour: its shape and how much of it there is, in one colour */}
          <feFlood style={{ floodColor: "var(--glyph-tint, #9fd0f5)" }} floodOpacity="0.96" />
          <feComposite in2="SourceAlpha" operator="in" result="body" />
          <Shadow opacity={0.42} />
          <feMerge>
            <feMergeNode in="drop" />
            <feMergeNode in="body" />
            <feMergeNode in="shade" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
