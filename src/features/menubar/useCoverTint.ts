/**
 * The colors of the cover that is showing, for a surface that is tinted by it (see tint.ts for how they are read).
 * The cover is read from a thumbnail-sized copy, so this costs next to nothing.
 */

import { useEffect, useState } from "react";
import { pickTint, type Tint } from "./tint";

export function useCoverTint(art: string | null, on: boolean): Tint | null {
  const [tint, setTint] = useState<Tint | null>(null);
  useEffect(() => {
    if (!art || !on) {
      setTint(null);
      return;
    }
    let live = true;
    const img = new Image();
    img.onload = () => {
      if (!live) return;
      const c = document.createElement("canvas");
      c.width = c.height = 24;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 24, 24);
      setTint(pickTint(ctx.getImageData(0, 0, 24, 24).data));
    };
    img.src = art;
    return () => {
      live = false;
    };
  }, [art, on]);
  return tint;
}
