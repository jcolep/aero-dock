/**
 * What is playing, for the Control Center's card: the session as Windows
 * describes it, read every couple of seconds while the card is open, plus the
 * cover, fetched once per track (it is a large thing to send, so it is not
 * part of the reading).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ipc } from "../../ipc/commands";
import type { NowPlaying } from "../../ipc/types";

const POLL_MS = 2000;

export function useNowPlaying() {
  const [np, setNp] = useState<NowPlaying | null>(null);
  const [art, setArt] = useState<string | null>(null);
  const alive = useRef(true);

  const refresh = useCallback(() => {
    return ipc
      .widgetNowPlaying()
      .then((p) => alive.current && setNp(p))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    alive.current = true;
    void refresh();
    const timer = setInterval(refresh, POLL_MS);
    return () => {
      alive.current = false;
      clearInterval(timer);
    };
  }, [refresh]);

  // the cover, when the track changes; players often post it a moment after the
  // title, so it is read once more shortly after
  const key = np?.active && np.hasArtwork ? np.key : "";
  useEffect(() => {
    if (!key) {
      setArt(null);
      return;
    }
    let live = true;
    const load = (fresh: boolean) =>
      ipc
        .mediaArtwork(fresh)
        // a track that has no cover yet keeps the last one until it does
        .then((url) => live && url && setArt(url))
        .catch(() => undefined);
    void load(false);
    const again = setTimeout(() => void load(true), 1600);
    return () => {
      live = false;
      clearTimeout(again);
    };
  }, [key]);

  // show a change at once, before the player has confirmed it
  const patch = useCallback((change: Partial<NowPlaying>) => setNp((p) => (p ? { ...p, ...change } : p)), []);

  return { np, art, refresh, patch };
}
