/**
 * Whether a surface's glass is frosted, and how: the switch for its group (the dock and its flyouts, the menu bar and
 * its menus, the Start menu and its popovers), its frost and grain, and never while transparency is to be reduced.
 */

import { useReduced } from "../accessibility/policy";
import { useSettings } from "../../state/settingsStore";

export type GlassGroup = "dock" | "start" | "menuBar";

export function useGlass(group: GlassGroup): { active: boolean; blur: number; grain: number } {
  const appearance = useSettings((s) => s.settings?.appearance);
  const reduced = useReduced();
  const look = appearance?.frost[group];
  return {
    active: !!appearance && (look?.glass ?? appearance.realBlur) && !reduced.transparency,
    blur: look?.blur ?? 30,
    grain: look?.grain ?? 0.35,
  };
}
