/**
 * Whether to keep motion and transparency down: what the settings say, and
 * where they say "follow the system", what Windows says (its Animation effects
 * and Transparency effects switches, read by Rust).
 *
 * `applyAppearance` writes the answer on the page as `data-reduce-motion` and
 * `data-reduce-transparency`, which the stylesheets and the effects engine
 * read; React code that needs it asks `useReduced`.
 */

import { useEffect } from "react";
import { create } from "zustand";
import { ipc } from "../../ipc/commands";
import type { AccessibilitySettings, Settings, SystemAccessibility } from "../../ipc/types";
import { useSettings } from "../../state/settingsStore";

interface Flags extends SystemAccessibility {
  refresh: () => Promise<void>;
}

/** What Windows currently says. Quiet (nothing reduced) until it has answered. */
export const useSystemFlags = create<Flags>((set, get) => ({
  reduceMotion: false,
  reduceTransparency: false,
  refresh: async () => {
    try {
      const next = await ipc.getSystemAccessibility();
      const now = get();
      if (next.reduceMotion !== now.reduceMotion || next.reduceTransparency !== now.reduceTransparency) {
        set(next);
      }
    } catch {
      // no answer: leave things as they are
    }
  },
}));

/** What a setting comes to, given what the system says. */
export function resolvePolicy(policy: AccessibilitySettings["reduceMotion"] | undefined, system: boolean): boolean {
  if (policy === "on") return true;
  if (policy === "off") return false;
  return system;
}

export interface Reduced {
  motion: boolean;
  transparency: boolean;
}

/** The answer for some settings and some system flags. */
export function reducedFor(settings: Settings | null | undefined, system: SystemAccessibility): Reduced {
  const a = settings?.accessibility;
  return {
    motion: resolvePolicy(a?.reduceMotion, system.reduceMotion),
    transparency: resolvePolicy(a?.reduceTransparency, system.reduceTransparency),
  };
}

/** React's view of it, for a component that has to choose. Also keeps what
 *  Windows says fresh: read when the window gains the focus (which is when a
 *  person comes back from changing a Windows setting) and now and then. */
export function useReduced(): Reduced {
  const settings = useSettings((s) => s.settings);
  const system = useSystemFlags();
  useEffect(() => {
    void system.refresh();
    const onFocus = () => void useSystemFlags.getState().refresh();
    window.addEventListener("focus", onFocus);
    const timer = setInterval(onFocus, 20_000);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(timer);
    };
    // the store's own function does not change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return reducedFor(settings, system);
}