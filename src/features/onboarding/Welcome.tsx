/**
 * First-launch welcome: a glass card blooming above the empty dock.
 * One choice, zero clutter: bring your apps over, or start clean.
 */

import { motion } from "motion/react";
import { useGlass } from "../../engine/backdrop/useGlass";
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";
import { useState } from "react";
import { ipc } from "../../ipc/commands";
import { KOFI_URL } from "../../links";
import type { DockEdge } from "../../ipc/types";
import { bloomOffset, edgePanelStyle } from "../dock/menuStore";
import { springs } from "../../engine/animation/springs";
import { notify } from "../feedback/toastStore";
import { importStarterApps, startEmpty } from "./firstRun";
import "./welcome.css";

export function Welcome({ edge }: { edge: DockEdge }) {
  const dockGlass = useGlass("dock");
  const [busy, setBusy] = useState(false);

  const run = (action: () => Promise<void>) => {
    setBusy(true);
    action().catch((e) => {
      notify.error("Setup failed - you can still drag apps onto the dock", e);
      setBusy(false);
    });
    // success needs no cleanup: the settings event flips
    // onboardingComplete and this card unmounts
  };

  return (
    <motion.div
      className="welcome-card glass"
      style={{
        ...edgePanelStyle(edge, "calc(var(--icon-size) * 1.2 + 52px)"),
        width: 380,
        zIndex: 90,
      }}
      initial={{ opacity: 0, scale: 0.85, ...bloomOffset(edge) }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      transition={{ ...springs.bloom, delay: 0.25 }}
    >
      <BackdropLayer active={dockGlass.active} blur={dockGlass.blur} grain={dockGlass.grain} />
      <span className="welcome-orb" aria-hidden />
      <h1>Welcome to Aero Dock</h1>
      <p>Glass, water, and light for your desktop. Let's set up your dock.</p>
      <div className="welcome-actions">
        <button className="welcome-primary" disabled={busy} onClick={() => run(importStarterApps)}>
          {busy ? "Importing…" : "Import my apps"}
        </button>
        <button className="welcome-secondary" disabled={busy} onClick={() => run(startEmpty)}>
          Start empty
        </button>
      </div>
      <ul className="welcome-tips">
        <li>
          <b>Hover</b> over the dock and the icons swell toward you.
        </li>
        <li>
          <b>Drop</b> an app or folder from Explorer onto it to pin it; drag an icon off to unpin it.
        </li>
        <li>
          <b>Press Ctrl + Alt + Space</b> for Start, or use the magnifier beside the dock.
        </li>
        <li>
          <b>Right-click</b> anything for its options; the gear opens Settings.
        </li>
      </ul>
      <p className="welcome-support">
        Free and independently developed.{" "}
        <button
          className="welcome-support-link"
          onClick={() =>
            ipc
              .launch(KOFI_URL)
              .catch((e) => notify.error("Could not open the browser", e))
          }
        >
          Support on Ko-fi ☕
        </button>
      </p>
    </motion.div>
  );
}
