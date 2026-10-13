/**
 * The frame's corner pieces: what the margin's glass is in each corner of the window on top, drawn over it.
 *
 * A maximised app fills the opening, and its own corners are square. This window is kept on top and Rust clips it
 * to the four little corner pieces, what is outside the app's rounded edge and inside its square one, so that is
 * the only part of it that draws or takes a click. What is drawn here is the margin's colour, edged by the curve,
 * anti-aliased, so the app's square corners are behind the frame there and the app looks to have rounded ones.
 * Nothing is done to the app's window, so it works for every app, and costs nothing while nothing changes.
 *
 * Rust says where the app's window is (it is the opening's, or a few pixels off for a program that has not been
 * told of a change to the work area) and what the margin looks like beside each corner, read off the screen: a
 * wallpaper is rarely one colour, so each corner is drawn in its own. It is shown only while the app on top fills
 * the opening, and nothing is drawn until Rust has said where it is.
 */

import { listen } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect, useMemo, useState } from "react";
import { applyAppearance } from "../../engine/themes/applyTheme";
import { ipc } from "../../ipc/commands";
import type { CornerPaint } from "../../ipc/types";
import { useSettings } from "../../state/settingsStore";
import { outsidePath, roundedRectPath } from "./frameGeometry";
import { BevelGradient, useWindowSize } from "./FrameApp";
import "./frame.css";

/** A square of RGBA rows as an address an SVG image can show. */
function patchUrl(p: { width: number; height: number; rgba: number[] }): string | null {
  const c = document.createElement("canvas");
  c.width = p.width;
  c.height = p.height;
  const ctx = c.getContext("2d");
  if (!ctx || p.rgba.length !== p.width * p.height * 4) return null;
  ctx.putImageData(new ImageData(new Uint8ClampedArray(p.rgba), p.width, p.height), 0, 0);
  return c.toDataURL("image/png");
}

export function FrameCornersApp() {
  const { settings, hydrate } = useSettings();
  const { w, h } = useWindowSize();
  const [paint, setPaint] = useState<CornerPaint | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (settings) applyAppearance(settings, null, "dock");
  }, [settings]);

  // listened for before it is asked for, so that nothing sent in between is missed
  useEffect(() => {
    const label = getCurrentWebviewWindow().label;
    let live = true;
    const heard = listen<CornerPaint>("frame://corners", (e) => live && setPaint(e.payload));
    void heard.then(() =>
      ipc
        .frameCornerColours(label)
        .then((p) => live && p && setPaint((was) => was ?? p))
        .catch(() => undefined),
    );
    return () => {
      live = false;
      void heard.then((un) => un());
    };
  }, []);

  // the wallpaper squares, made into pictures once each time they change
  const urls = useMemo(() => (paint?.patches ?? []).map((p) => (p ? patchUrl(p) : null)), [paint?.patches]);

  if (!settings || !paint || paint.colours.length !== 4) return null;
  // Rust measures in the screen's pixels, the page in its own
  const dpr = window.devicePixelRatio || 1;
  const radius = paint.radius / dpr;
  const colours = paint.colours;
  const rect = { x: paint.rect.x / dpr, y: paint.rect.y / dpr, width: paint.rect.width / dpr, height: paint.rect.height / dpr };
  // each corner's own square of the window, as far along each edge as the curve reaches (and a little more)
  const reach = Math.min(radius + 4, Math.floor(Math.min(rect.width, rect.height) / 2));
  const boxes = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width - reach, y: rect.y },
    { x: rect.x + rect.width - reach, y: rect.y + rect.height - reach },
    { x: rect.x, y: rect.y + rect.height - reach },
  ];
  const outside = outsidePath(w, h, rect.x, rect.y, rect.width, rect.height, radius);
  // The glass border runs round the opening's rounded edge, just outside it, which in a corner is inside the app's
  // square corner: the piece covers it, so the piece draws it again, the same as the ring draws it everywhere else.
  const f = settings.frame;
  const bw = f.glassBorder ? Math.max(1, Math.min(f.borderWidth, radius)) : 0;
  const inner = roundedRectPath(rect.x, rect.y, rect.width, rect.height, radius);
  const outer = roundedRectPath(rect.x - bw, rect.y - bw, rect.width + 2 * bw, rect.height + 2 * bw, radius + bw);

  return (
    <div
      className="frame-root frame-corners"
      style={{ ["--frame-tint" as string]: settings.frame.tint * settings.menuBar.tint } as React.CSSProperties}
    >
      <svg className="frame-body" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
        <defs>
          {bw > 0 && <BevelGradient h={h} />}
          {/* only what is outside the opening's curve: the dark line along the edge must not reach over the app */}
          <clipPath id="frame-corner-outside">
            <path d={outside} clipRule="evenodd" />
          </clipPath>
          {boxes.map((b, i) => (
            <clipPath key={i} id={`frame-corner-${i}`}>
              <rect x={b.x} y={b.y} width={reach} height={reach} />
            </clipPath>
          ))}
        </defs>
        {boxes.map((_, i) =>
          // only the corners that have an app's corner in them (a window snapped to one side holds two)
          (paint.mask ?? 15) & (1 << i) ? (
          <g key={i} clipPath={`url(#frame-corner-${i})`}>
            {urls[i] && paint.patches[i] ? (
              // the wallpaper that is under the corner, with the margin's own glass over it: what the margin is there
              <>
                <image
                  href={urls[i]!}
                  x={paint.patches[i]!.x / dpr}
                  y={paint.patches[i]!.y / dpr}
                  width={paint.patches[i]!.width / dpr}
                  height={paint.patches[i]!.height / dpr}
                  preserveAspectRatio="none"
                  clipPath="url(#frame-corner-outside)"
                />
                <path className="frame-glass" d={outside} fillRule="evenodd" />
              </>
            ) : (
              <path d={outside} fillRule="evenodd" fill={colours[i]} />
            )}
            {bw > 0 && (
              <g clipPath="url(#frame-corner-outside)">
                <path className="frame-bevel" d={`${outer}${inner}`} fillRule="evenodd" />
                <path className="frame-bevel-lit" d={outer} />
                <path className="frame-bevel-edge" d={inner} />
              </g>
            )}
          </g>
          ) : null,
        )}
      </svg>
    </div>
  );
}
