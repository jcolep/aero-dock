/**
 * The Control Center: one panel for the controls you reach for most, after
 * the macOS one. Wi-Fi and Bluetooth, each a real switch with the networks or
 * devices it sees a click away, brightness, sound, what is playing, and the
 * battery.
 *
 * The switches are the machine's own radios (Windows' radio API), and the
 * lists are what Windows reports. What Windows will not let a program do from
 * here is handed to its own pages: a network it has no saved password for opens
 * the network picker, and Bluetooth devices connect from the Bluetooth page.
 * A machine without a radio, or a screen that does not take brightness
 * commands, simply shows less.
 */

import { Roll } from "../../engine/type/Roll";
import { useCallback, useEffect, useRef, useState } from "react";
import { playCue } from "../../engine/sound/ui";
import { normalizeHex } from "../../engine/themes/accent";
import { ipc } from "../../ipc/commands";
import type { BluetoothDevice, BrightnessInfo, RadioInfo, WifiNetwork } from "../../ipc/types";
import { useSettings } from "../../state/settingsStore";
import { useSystem } from "../../state/systemStore";
import { notify } from "../feedback/toastStore";
import {
  BatteryGlyph,
  BluetoothGlyph,
  CheckGlyph,
  ChevronGlyph,
  DeviceGlyph,
  LockGlyph,
  NetworkGlyph,
  SignalGlyph,
  SunGlyph,
  VolumeGlyph,
} from "../widgets/SystemGlyphs";
import { ElasticSlider } from "./ElasticSlider";
import { MediaCard } from "./MediaCard";

/** Open a Windows settings page. */
function openSettingsPage(uri: string): void {
  ipc.launch(uri).catch(notify.on("Could not open that settings page"));
}

/** The variables that give a tile's circle the color chosen for it in
 *  settings, or nothing at all to leave it the theme's. The symbol stays the
 *  light one the rest of the bar uses, whatever the color. */
function bubbleStyle(color: string | undefined): React.CSSProperties | undefined {
  const hex = normalizeHex(color ?? "");
  if (!hex) return undefined;
  return {
    ["--cc-on" as string]: hex,
    ["--cc-hover" as string]: `color-mix(in srgb, ${hex} 78%, black)`,
    ["--aero-glyph" as string]: "var(--aero-text-on-glass, #fff)",
  };
}

type Section = "wifi" | "bluetooth";

export function ControlCenter() {
  const status = useSystem((s) => s.status);
  const menuBar = useSettings((s) => s.settings?.menuBar);
  // the sliders follow the system, except while they are being dragged
  const [dragging, setDragging] = useState(false);
  // starts at the volume the system last reported, not at nothing
  const [level, setLevel] = useState(() => useSystem.getState().status?.volume.level ?? 0);

  const [radios, setRadios] = useState<RadioInfo[]>([]);
  const [section, setSection] = useState<Section | null>(null);
  const [networks, setNetworks] = useState<WifiNetwork[] | null>(null);
  const [devices, setDevices] = useState<BluetoothDevice[] | null>(null);
  const [brightness, setBrightness] = useState<BrightnessInfo | null>(null);
  const [bright, setBright] = useState(0);

  useEffect(() => {
    if (!dragging && status?.volume.available) setLevel(status.volume.level);
  }, [status?.volume.level, status?.volume.available, dragging]);

  // the radios, the network joined and the screen's brightness, read when the
  // panel opens (each waits on the system, so none is polled)
  const readRadios = useCallback(() => ipc.getRadios().then(setRadios).catch(() => undefined), []);
  const readNetworks = useCallback(
    (rescan: boolean) => ipc.listWifi(rescan).then(setNetworks).catch(() => undefined),
    [],
  );
  useEffect(() => {
    void readRadios();
    void readNetworks(false);
    ipc
      .getBrightness()
      .then((b) => {
        setBrightness(b);
        setBright(b.percent);
      })
      .catch(() => undefined);
  }, [readRadios, readNetworks]);

  // a list is read as it opens; the adapter is asked to look again, and what it
  // finds is read a moment later
  useEffect(() => {
    if (section === "wifi") {
      void readNetworks(true);
      const later = setTimeout(() => void readNetworks(false), 2500);
      return () => clearTimeout(later);
    }
    if (section === "bluetooth") {
      setDevices(null);
      ipc.listBluetooth().then(setDevices).catch(() => setDevices([]));
    }
  }, [section, readNetworks]);

  const radio = (kind: RadioInfo["kind"]) => radios.find((r) => r.kind === kind);

  const toggleRadio = (kind: RadioInfo["kind"]) => {
    const r = radio(kind);
    if (!r?.switchable) {
      // no radio here, or it is off at a switch: Windows' own page is the place
      openSettingsPage(kind === "wifi" ? "ms-settings:network-wifi" : "ms-settings:bluetooth");
      return;
    }
    const on = !r.on;
    playCue(on ? "on" : "off");
    setRadios((all) => all.map((x) => (x.kind === kind ? { ...x, on } : x)));
    ipc
      .setRadio(kind, on)
      .catch(notify.on(`Could not switch ${kind === "wifi" ? "Wi-Fi" : "Bluetooth"} ${on ? "on" : "off"}`))
      .finally(() => {
        // the radio takes a moment to settle
        setTimeout(() => {
          void readRadios();
          void readNetworks(on);
        }, 900);
      });
  };

  const join = (n: WifiNetwork) => {
    if (n.connected) return;
    if (!n.known) {
      // Windows asks for the password; this does not handle one
      openSettingsPage("ms-availablenetworks:");
      return;
    }
    ipc
      .connectWifi(n.ssid)
      .catch(notify.on(`Could not join ${n.ssid}`))
      .finally(() => setTimeout(() => void readNetworks(false), 2500));
  };

  // brightness goes to the monitor over a slow link, so it is sent a moment
  // after the slider settles rather than at every step of a drag
  const brightTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(brightTimer.current), []);
  const sendBrightness = (v: number) => {
    setBright(v);
    clearTimeout(brightTimer.current);
    brightTimer.current = setTimeout(
      () => ipc.setBrightness(Math.round(v)).catch(notify.on("Could not change the brightness")),
      140,
    );
  };

  const online = status?.internet ?? false;
  const wired = status?.link === "ethernet";
  const muted = status?.volume.muted ?? false;
  const wifi = radio("wifi");
  const bluetooth = radio("bluetooth");
  const wifiOn = wifi ? wifi.on : online;
  const joined = networks?.find((n) => n.connected)?.ssid;
  const pick = (s: Section) => setSection((cur) => (cur === s ? null : s));

  return (
    <div className="cc">
      <div className="cc-tiles">
        <div className="cc-tile" data-open={section === "wifi"}>
          <button
            className="cc-tile-main"
            aria-pressed={wifiOn}
            aria-label={`Wi-Fi, ${wifiOn ? "on" : "off"}`}
            onClick={() => toggleRadio("wifi")}
          >
            <span
              className="cc-tile-icon"
              data-on={wifiOn}
              style={wifiOn ? bubbleStyle(menuBar?.wifiColor) : undefined}
            >
              <NetworkGlyph online={wifiOn && (online || !wifi)} link={wifiOn ? status?.link : "wifi"} />
            </span>
            <span className="cc-tile-text">
              <strong>Wi-Fi</strong>
              <small>
                {!wifiOn ? "Off" : joined ? joined : wired ? "On · Ethernet in use" : online ? "Connected" : "On"}
              </small>
            </span>
          </button>
          {wifi && (
            <button
              className="cc-chevron"
              aria-label="Wi-Fi networks"
              aria-expanded={section === "wifi"}
              onClick={() => pick("wifi")}
            >
              <ChevronGlyph open={section === "wifi"} />
            </button>
          )}
        </div>

        <div className="cc-tile" data-open={section === "bluetooth"}>
          <button
            className="cc-tile-main"
            aria-pressed={bluetooth ? bluetooth.on : true}
            aria-label={`Bluetooth, ${bluetooth ? (bluetooth.on ? "on" : "off") : "settings"}`}
            onClick={() => toggleRadio("bluetooth")}
          >
            <span
              className="cc-tile-icon"
              data-on={bluetooth ? bluetooth.on : true}
              style={!bluetooth || bluetooth.on ? bubbleStyle(menuBar?.bluetoothColor) : undefined}
            >
              <BluetoothGlyph />
            </span>
            <span className="cc-tile-text">
              <strong>Bluetooth</strong>
              <small>{bluetooth ? (bluetooth.on ? "On" : "Off") : "Settings"}</small>
            </span>
          </button>
          {bluetooth && (
            <button
              className="cc-chevron"
              aria-label="Bluetooth devices"
              aria-expanded={section === "bluetooth"}
              onClick={() => pick("bluetooth")}
            >
              <ChevronGlyph open={section === "bluetooth"} />
            </button>
          )}
        </div>
      </div>

      {section === "wifi" && (
        <div className="cc-card" role="group" aria-label="Wi-Fi networks">
          <div className="cc-card-title">Wi-Fi networks</div>
          <div className="cc-list">
            {networks === null && <div className="cc-empty">Looking…</div>}
            {networks?.length === 0 && (
              <div className="cc-empty">{wifiOn ? "No networks in range. It is quiet out there" : "Wi-Fi is off"}</div>
            )}
            {networks?.map((n) => (
              <button
                key={n.ssid}
                className="cc-row"
                data-connected={n.connected}
                aria-label={`${n.ssid}, ${n.connected ? "connected" : n.known ? "saved" : n.secured ? "secured" : "open"}`}
                onClick={() => join(n)}
              >
                <SignalGlyph signal={n.signal} />
                <span className="cc-row-name">{n.ssid}</span>
                {n.secured && !n.connected && <LockGlyph />}
                {n.connected && <CheckGlyph />}
              </button>
            ))}
          </div>
        </div>
      )}

      {section === "bluetooth" && (
        <div className="cc-card" role="group" aria-label="Bluetooth devices">
          <div className="cc-card-title">Bluetooth devices</div>
          <div className="cc-list">
            {devices === null && <div className="cc-empty">Looking…</div>}
            {devices?.length === 0 && (
              <div className="cc-empty">{bluetooth?.on ? "No paired devices yet" : "Bluetooth is off"}</div>
            )}
            {devices?.map((d) => (
              <button
                key={d.name}
                className="cc-row"
                data-connected={d.connected}
                aria-label={`${d.name}, ${d.connected ? "connected" : "not connected"}`}
                onClick={() => openSettingsPage("ms-settings:bluetooth")}
              >
                <DeviceGlyph sort={d.sort} />
                <span className="cc-row-name">{d.name}</span>
                <small className="cc-row-note">{d.connected ? "Connected" : ""}</small>
              </button>
            ))}
          </div>
        </div>
      )}

      {brightness?.available && (
        <div className="cc-card">
          <div className="cc-card-title">Display</div>
          <div className="cc-slider-row">
            <span className="cc-icon-button cc-icon-static" aria-hidden>
              <SunGlyph level={bright} />
            </span>
            <ElasticSlider
              value={bright}
              muted={false}
              label="Brightness"
              onDragging={() => undefined}
              onChange={sendBrightness}
            />
          </div>
        </div>
      )}

      {status?.volume.available && (
        <div className="cc-card">
          <div className="cc-card-title">Sound</div>
          <div className="cc-slider-row">
            <button
              className="cc-icon-button"
              title={muted ? "Unmute" : "Mute"}
              aria-label={muted ? "Unmute" : "Mute"}
              aria-pressed={muted}
              onClick={() => {
                playCue(muted ? "on" : "off");
                ipc.setVolume(undefined, !muted).catch(notify.on("Could not change the volume"));
              }}
            >
              <VolumeGlyph level={level} muted={muted} />
            </button>
            <ElasticSlider
              value={level}
              muted={muted}
              label="Volume"
              onDragging={setDragging}
              onChange={(next) => {
                setLevel(next);
                ipc.setVolume(next).catch(notify.on("Could not change the volume"));
              }}
            />
          </div>
        </div>
      )}

      {/* what is playing: the card reads the system's media session while the panel is open */}
      <MediaCard />

      {status?.battery.present && (
        <div className="cc-card cc-battery">
          <span className="cc-battery-glyph">
            <BatteryGlyph percent={status.battery.percent} charging={status.battery.charging} />
          </span>
          <span className="cc-card-title">Battery</span>
          <span className="cc-battery-value">
            <Roll text={`${status.battery.percent}%${status.battery.charging ? " · Charging" : ""}`} />
          </span>
        </div>
      )}

      <div className="cc-links">
        <button onClick={() => openSettingsPage("ms-settings:sound")}>Sound settings…</button>
        <button onClick={() => openSettingsPage("ms-settings:network")}>Network settings…</button>
      </div>
    </div>
  );
}
