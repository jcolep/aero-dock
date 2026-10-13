/**
 * The privacy dots: an orange one while an app is using the microphone, a green
 * one while one is using the camera, as on a Mac. Clicking them says which app.
 *
 * What is using what is read by Rust from the record Windows keeps for its own
 * indicators (see platform/windows/privacy.rs), and arrives as an event when it
 * changes.
 */

import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { ipc } from "../../ipc/commands";
import type { PrivacyUse } from "../../ipc/types";

export function usePrivacyUse(enabled: boolean): PrivacyUse[] {
  const [uses, setUses] = useState<PrivacyUse[]>([]);
  useEffect(() => {
    if (!enabled) {
      setUses([]);
      return;
    }
    let alive = true;
    ipc.getPrivacyUse().then((u) => alive && setUses(u)).catch(() => undefined);
    const un = listen<PrivacyUse[]>("privacy://changed", (e) => alive && setUses(e.payload));
    return () => {
      alive = false;
      un.then((fn) => fn());
    };
  }, [enabled]);
  return uses;
}

/** The dots for what is in use. */
export function PrivacyDots({ uses }: { uses: PrivacyUse[] }) {
  const mic = uses.some((u) => u.sensor === "microphone");
  const cam = uses.some((u) => u.sensor === "camera");
  return (
    <span className="mb-dots" aria-hidden>
      {mic && <span className="mb-dot" data-sensor="microphone" />}
      {cam && <span className="mb-dot" data-sensor="camera" />}
    </span>
  );
}

/** A sentence for a screen reader and for the button's tooltip. */
export function privacySummary(uses: PrivacyUse[]): string {
  const names = (sensor: PrivacyUse["sensor"]) => uses.filter((u) => u.sensor === sensor).map((u) => u.app).join(", ");
  const parts = [];
  if (names("microphone")) parts.push(`Microphone in use by ${names("microphone")}`);
  if (names("camera")) parts.push(`Camera in use by ${names("camera")}`);
  return parts.join(". ");
}

/** The popover: who is using what, and where to change it. */
export function PrivacyPanel({ uses }: { uses: PrivacyUse[] }) {
  const mic = uses.filter((u) => u.sensor === "microphone");
  const cam = uses.filter((u) => u.sensor === "camera");
  const section = (title: string, sensor: PrivacyUse["sensor"], list: PrivacyUse[]) =>
    list.length > 0 && (
      <div className="cc-card privacy-card">
        <div className="privacy-head">
          <span className="mb-dot" data-sensor={sensor} aria-hidden />
          <span className="cc-card-title">{title}</span>
        </div>
        <ul className="stats-list">
          {list.map((u) => (
            <li key={u.app}>
              <span className="stats-name">{u.app}</span>
              <span className="stats-value">in use</span>
            </li>
          ))}
        </ul>
      </div>
    );
  return (
    <div className="cc">
      {section("Microphone", "microphone", mic)}
      {section("Camera", "camera", cam)}
      {uses.length === 0 && <div className="cc-card privacy-card">All quiet: nothing is using the microphone or camera.</div>}
      <div className="cc-links">
        <button onClick={() => ipc.launch("ms-settings:privacy-microphone").catch(() => undefined)}>Microphone settings…</button>
        <button onClick={() => ipc.launch("ms-settings:privacy-webcam").catch(() => undefined)}>Camera settings…</button>
      </div>
    </div>
  );
}