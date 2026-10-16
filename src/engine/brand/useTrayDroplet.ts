/**
 * The tray icon in the theme's color: Liquidock's drop, drawn by the page as a PNG and handed to Rust, which puts it
 * in the tray (`set_tray_icon`). Done by the main dock window only, once its colors are applied, and again whenever
 * the theme's color settles on another (a drag on the color picker sends one, not dozens).
 */

import { useEffect, useRef } from "react";
import { ipc } from "../../ipc/commands";
import { dropletSvg } from "./dropletSvg";

/** How big it is drawn: the tray shows it at 16 to 32 px, and Windows shrinks a larger one cleanly. */
const PX = 64;
/** How long the color must hold before the icon is drawn again, in ms. */
const SETTLE_MS = 400;

/** The drop in `hex` as a PNG's bytes. */
async function render(hex: string): Promise<number[]> {
  const img = new Image(PX, PX);
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dropletSvg(hex, PX))}`;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = PX;
  canvas.height = PX;
  canvas.getContext("2d")!.drawImage(img, 0, 0, PX, PX);
  const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/png"));
  if (!blob) throw new Error("the tray icon could not be drawn");
  return Array.from(new Uint8Array(await blob.arrayBuffer()));
}

/** Keep the tray icon in `hex` (`#rrggbb`); nothing while it is null or this is not the window to do it. */
export function useTrayDroplet(hex: string | null, enabled: boolean) {
  const sent = useRef("");
  useEffect(() => {
    if (!enabled || !hex || !/^#[0-9a-f]{6}$/i.test(hex) || hex.toLowerCase() === sent.current) return;
    const t = window.setTimeout(() => {
      render(hex)
        .then((png) => ipc.setTrayIcon(png))
        .then(() => {
          sent.current = hex.toLowerCase();
        })
        .catch((e) => console.warn("tray icon not tinted", e));
    }, SETTLE_MS);
    return () => window.clearTimeout(t);
  }, [hex, enabled]);
}
