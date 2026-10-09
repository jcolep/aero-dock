/**
 * The animation props for a panel that opens beside the dock, from the preset
 * chosen under Settings > Animations > Flyouts. Spread onto a `motion.div`:
 *
 *   const pm = usePanelMotion(edge);
 *   <motion.div style={{ ...style, transformOrigin: pm.origin }}
 *               initial={pm.initial} animate={pm.animate}
 *               exit={pm.exit} transition={pm.transition} />
 *
 * Things inside the panel that arrive one at a time use `pm.item(i)`.
 */

import { useMemo } from "react";
import {
  animationsOf,
  itemMotion,
  panelMotion,
  type ItemMotion,
  type PanelMotion,
} from "../../engine/animation/presets";
import type { DockEdge } from "../../ipc/types";
import { useSettings } from "../../state/settingsStore";

export interface PanelProps extends PanelMotion {
  item: (i: number, step?: number, cap?: number) => ItemMotion;
}

export function usePanelMotion(edge: DockEdge): PanelProps {
  const settings = useSettings((s) => s.settings);
  const preset = animationsOf(settings).flyout;
  const speed = settings?.appearance.animationSpeed ?? 1;
  return useMemo(
    () => ({
      ...panelMotion(preset, edge, speed),
      item: (i, step, cap) => itemMotion(preset, i, step, cap, speed),
    }),
    [preset, edge, speed],
  );
}
