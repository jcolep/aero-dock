/**
 * Theme applier: projects settings (the accent colour + numeric appearance)
 * onto CSS custom properties. Components never read settings for
 * styling — they read tokens.
 */

import { reducedFor, useSystemFlags } from "../accessibility/policy";
import type { Settings } from "../../ipc/types";
import { accentForTheme, normalizeHex, tokensFromAccent } from "./accent";

/**
 * The shadow under the dock bar, as a `box-shadow` layer.
 *
 * A normal drop shadow is as wide as its blur, so a big soft one reads as a
 * dark haze reaching well past both ends of the dock. The negative spread
 * pulls it back in so it stays under the bar, and it is pushed down rather
 * than out. At 0 it is a fully transparent layer, which keeps the property
 * valid in the surrounding `box-shadow` list.
 */
function dockDropShadow(strength: number): string {
  const s = Math.min(1, Math.max(0, strength));
  if (s < 0.01) return "0 0 0 0 transparent";
  const blur = 10 + 22 * s;
  return `0 ${(6 + 10 * s).toFixed(1)}px ${blur.toFixed(1)}px ${(-blur * 0.45).toFixed(1)}px rgba(4, 26, 48, ${(0.5 * s).toFixed(2)})`;
}

/** Which window is being styled. The two carry their own material, so
 *  the caller has to say which one it is. */
export type SurfaceTarget = "dock" | "settings";

/**
 * The colour everything is derived from: the one picked in settings, or for
 * settings saved before the picker existed, where their old theme started.
 * With "tint from wallpaper" on, the wallpaper's colour is used in its place.
 */
export function effectiveAccent(settings: Settings, wallpaperAccent?: string | null): string {
  const a = settings.appearance;
  const picked = normalizeHex(a.accent) ?? accentForTheme(a.theme);
  const wallpaper = wallpaperAccent ? normalizeHex(wallpaperAccent) : null;
  return a.wallpaperSync && wallpaper ? wallpaper : picked;
}

/**
 * The colour ambient effects are drawn in, as `0xrrggbb`: the bloom colour of
 * the current look. Worked out from settings rather than read back from the
 * page, so it is right on the first render, before the tokens are applied.
 */
export function ambientTint(settings: Settings, wallpaperAccent?: string | null): number {
  const bloom = tokensFromAccent(effectiveAccent(settings, wallpaperAccent))["--bloom-color"];
  // `--bloom-color` is written as rgba(r, g, b, a); take the triple
  const m = bloom?.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!m) return 0xa0e1ff;
  return (Number(m[1]) << 16) | (Number(m[2]) << 8) | Number(m[3]);
}

/** What was last applied, so that a change that touches none of it (a pin
 *  moved, an app reordered) does not rewrite every token. */
let lastApplied = "";
/** The last call's arguments, so a change in what Windows says can apply them again. */
let lastArgs: [Settings, string | null | undefined, SurfaceTarget] | null = null;

export function applyAppearance(
  settings: Settings,
  wallpaperAccent?: string | null,
  target: SurfaceTarget = "dock",
): void {
  const a = settings.appearance;
  const d = settings.dock;
  lastArgs = [settings, wallpaperAccent, target];
  const reduced = reducedFor(settings, useSystemFlags.getState());

  const key = JSON.stringify([
    target,
    a,
    d.iconSize,
    d.padding,
    d.indicatorGap,
    d.iconSpacing,
    d.floating,
    d.floatingMargin,
    d.cornerRadius,
    d.statusIconSize,
    wallpaperAccent ?? null,
    settings.accessibility,
    reduced,
  ]);
  if (key === lastApplied) return;
  lastApplied = key;

  const root = document.documentElement.style;

  // The material is an attribute rather than a token because it swaps a
  // whole block of tokens at once, plus the shape of the gloss layer.
  // the settings window's night look is the clear glass over a dark ground
  const night = target === "settings" && a.settingsLook === "night";
  document.documentElement.dataset.surface = night ? "clear" : target === "settings" ? a.settingsSurface : a.dockSurface;
  if (target === "settings") {
    document.documentElement.dataset.look = a.settingsLook;
    // remembered, so that the next time the window opens it is in its look from the first frame (main.tsx)
    try {
      localStorage.setItem("aero-settings-look", a.settingsLook);
    } catch {
      /* no storage: the default look is the night one */
    }
  }
  else delete document.documentElement.dataset.look;
  // The two windows composite differently, so a material has to know
  // which one it is in. See surfaces.css for why that matters.
  document.documentElement.dataset.window = target;
  // A reflection with no strength is still a second copy of every icon to
  // draw, so it is switched off outright rather than made transparent.
  document.documentElement.dataset.reflect = a.reflectionStrength < 0.01 ? "off" : "on";
  // depth: a fine grain over the glass, and light that follows the pointer
  document.documentElement.dataset.grain = a.glassGrain ? "on" : "off";
  document.documentElement.dataset.pointerLight = a.pointerLight ? "on" : "off";
  // and the two things a person can ask for less of
  const root0 = document.documentElement.dataset;
  const motion = reduced.motion ? "on" : "off";
  const motionChanged = root0.reduceMotion !== motion;
  root0.reduceMotion = motion;
  root0.reduceTransparency = reduced.transparency ? "on" : "off";
  // the effects engine hears of it, to rest its scenes or wake them
  if (motionChanged) window.dispatchEvent(new Event("aero-motion"));

  for (const [token, value] of Object.entries(tokensFromAccent(effectiveAccent(settings, wallpaperAccent)))) {
    root.setProperty(token, value);
  }

  // numeric appearance tokens
  root.setProperty("--icon-size", `${d.iconSize}px`);
  root.setProperty("--dock-pad-y", `${d.padding}px`);
  root.setProperty("--indicator-gap", `${d.indicatorGap}px`);
  root.setProperty("--icon-gap", `${d.iconSpacing}px`);
  // how far in from the screen edge the bar sits; see .dock-viewport
  root.setProperty("--edge-gap", `${d.floating ? d.floatingMargin : 0}px`);
  // unset means "whatever the material gives the bar"
  if (d.cornerRadius === null) root.removeProperty("--dock-radius");
  else root.setProperty("--dock-radius", `${d.cornerRadius}px`);
  root.setProperty("--status-glyph-size", `${d.statusIconSize}px`);
  root.setProperty("--dock-opacity", String(a.transparency));
  root.setProperty("--glass-intensity", String(a.glassIntensity));
  // the blur of each surface's glass, from its own slider (the settings window keeps its material's)
  const surface = new URLSearchParams(window.location.search).get("window");
  const frost = surface === "start" ? a.frost.start : surface === "menubar" ? a.frost.menuBar : target === "dock" && !surface ? a.frost.dock : null;
  if (frost) root.setProperty("--glass-blur", `${frost.blur}px`);
  root.setProperty("--bloom-amount", String(a.bloomAmount));
  root.setProperty("--reflection-strength", String(a.reflectionStrength));
  root.setProperty("--dock-drop-shadow", dockDropShadow(a.dockShadow));
  root.setProperty("--anim-speed", String(a.animationSpeed));
}

// what Windows says can change while the page is open (a person turns Animation
// effects off in Settings), and the look follows
useSystemFlags.subscribe(() => {
  if (!lastArgs) return;
  lastApplied = "";
  applyAppearance(...lastArgs);
});
