/**
 * Readable over whatever is behind: for a panel of the dock's (the window previews, an app's menu, the dock's own
 * menu), the screen behind where it will be is looked at once as it opens, and a veil worked out from it darkens its
 * glass where that is light (the Start menu's veil, start/readability.ts), so its text does not wash out over a white
 * window. Follows the Start menu's "Keep text readable" setting.
 *
 * `ref` is the panel; `key` changes for each opening (the item it is for). Returns the veil (or null) and the props to
 * spread on the panel: a flag for CSS, and the strength of the text's shadow.
 */

import { useEffect, useState, type RefObject } from "react";
import { ipc } from "../../ipc/commands";
import { useSettings } from "../../state/settingsStore";
import { veilFor, type Veil } from "../start/readability";
import { layoutRect } from "./layoutRect";

export function useReadableVeil(open: boolean, ref: RefObject<HTMLElement | null>, key: string | null | undefined) {
  const [veil, setVeil] = useState<Veil | null>(null);
  const readable = useSettings((s) => s.settings?.start.adaptiveTint !== false);
  useEffect(() => {
    setVeil(null);
    if (!open || !readable) return;
    let live = true;
    const frame = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      // where it will finally be: layout, not its bounding box, which an entrance's transform shrinks
      const r = layoutRect(el);
      ipc
        .backdropLight(r.left, r.top, r.width, r.height, 4, 4)
        .then((b) => live && setVeil(veilFor(b)))
        .catch(() => undefined);
    });
    return () => {
      live = false;
      cancelAnimationFrame(frame);
    };
    // looked at once per opening
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, key, readable]);
  const props = veil ? { "data-veiled": "", style: { ["--veil-shadow" as string]: veil.shadow.toFixed(3) } } : {};
  return { veil, props };
}
