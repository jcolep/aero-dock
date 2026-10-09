/**
 * Pin an app that is running but not yet on the dock.
 *
 * What a running app's entry knows about itself is the title of its first
 * window ("Mail - Jake Pascoe - Outlook"), which is no name to pin it under, so
 * its own name is asked for first and the title is only the fallback. The
 * target is whatever launches it: its exe, or `shell:AppsFolder\<AUMID>` for a
 * packaged app (see platform/windows/packaged.rs).
 */

import { ipc } from "../../ipc/commands";
import type { DockItemView } from "../../state/dockStore";

export async function pinRunningItem(item: DockItemView, index: number) {
  const own = await ipc.appDisplayName(item.target).catch(() => null);
  return ipc.pinItem(
    {
      id: `pin-${crypto.randomUUID()}`,
      kind: "app",
      path: item.target,
      name: own?.trim() || item.name,
      icon: null,
      children: [],
    },
    index,
  );
}
