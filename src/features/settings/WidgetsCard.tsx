/**
 * Managing desktop widgets from the settings window.
 *
 * Every control here goes through a Rust command and comes back as the
 * whole settings struct on `settings://changed`, so nothing is mirrored
 * twice and the overlay redraws itself.
 */

import { humane } from "../../engine/errors/humane";
import { SettingsSection } from "./SettingsSection";
import { useRef, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { WIDGETS, SHARED_FIELDS, type Field, type WidgetGroup } from "../desktop/registry";
import { opt, saveExtra } from "../desktop/kit";
import { ipc } from "../../ipc/commands";
import type { Settings, SurfaceStyle, WidgetInstance, WidgetKind } from "../../ipc/types";
import { AeroSegmented, AeroSlider, AeroToggle } from "./controls";

interface Props {
  settings: Settings;
  onStatus: (tone: "ok" | "error", text: string) => void;
}

const DEFAULT_ACCENT = "#2f9de3";

/** The text of a slider's value, in the unit its field names. */
function formatFor(f: Extract<Field, { type: "slider" }>): (v: number) => string {
  if (f.unit === "px") return (v) => `${Math.round(v)}px`;
  if (f.unit === "%") return (v) => `${Math.round(v * 100)}%`;
  if (f.unit === "x") return (v) => `${v.toFixed(2)}x`;
  return (v) => `${Math.round(v * 100) / 100}${f.unit ?? ""}`;
}

/** One of a widget's own settings, drawn from its description in the registry. */
function FieldRow({ widget, field }: { widget: WidgetInstance; field: Field }) {
  const value = opt(widget, field.key, field.default as never) as unknown;
  const save = (v: unknown, delay = 150) => saveExtra(widget.id, { [field.key]: v }, delay);
  switch (field.type) {
    case "toggle":
      return <AeroToggle label={field.label} hint={field.hint} checked={value as boolean} onChange={(v) => save(v, 0)} />;
    case "slider":
      return <AeroSlider label={field.label} hint={field.hint} value={value as number} min={field.min} max={field.max} step={field.step} format={formatFor(field)} onChange={(v) => save(v)} />;
    case "choice":
      return <AeroSegmented<string> label={field.label} hint={field.hint} value={String(value)} options={field.options.map(([v, l]) => ({ value: v, label: l }))} onChange={(v) => save(v, 0)} />;
    case "text":
      return (
        <label className="ctl-row">
          <span className="ctl-label">{field.label}</span>
          <input className="ctl-text" key={widget.id + field.key} defaultValue={value as string} placeholder={field.placeholder} maxLength={field.max ?? 200} onBlur={(e) => save(e.target.value, 0)} />
        </label>
      );
    case "datetime":
      return (
        <label className="ctl-row">
          <span className="ctl-label">{field.label}</span>
          <input className="ctl-text" type="datetime-local" key={widget.id + field.key} defaultValue={value as string} onChange={(e) => e.target.value && save(e.target.value, 0)} />
        </label>
      );
    case "textarea":
      return (
        <div className="ctl-row ctl-row-stacked">
          <span className="ctl-label">{field.label}</span>
          {field.hint && <span className="ctl-hint">{field.hint}</span>}
          <textarea className="ctl-text ctl-textarea" key={widget.id + field.key} rows={field.rows ?? 3} defaultValue={value as string} placeholder={field.placeholder} maxLength={2000} onBlur={(e) => save(e.target.value, 0)} />
        </div>
      );
  }
}

const MEDIA_EXT = /\.(gif|png|jpe?g|webp|apng|avif|bmp)$/i;

/** Choosing the picture (or GIF) a Picture widget shows: kept in the data folder, so it survives the file moving. */
function PictureChooser({ widget, onStatus }: { widget: WidgetInstance; onStatus: Props["onStatus"] }) {
  const src = opt(widget, "src", "");
  const name = opt(widget, "name", "");
  const input = useRef<HTMLInputElement>(null);
  const choose = async (file: File | undefined) => {
    if (!file) return;
    if (!MEDIA_EXT.test(file.name)) return onStatus("error", "That is not a picture this can show (GIF, PNG, JPG, WebP, APNG, AVIF or BMP).");
    if (file.size > 40 * 1024 * 1024) return onStatus("error", "That file is over 40 MB.");
    try {
      await ipc.saveWidgetMedia(widget.id, file.name.split(".").pop()!.toLowerCase(), await file.arrayBuffer());
      saveExtra(widget.id, { name: file.name }, 0);
      onStatus("ok", `${file.name} is on the widget.`);
    } catch (e) {
      onStatus("error", `Could not use that file: ${humane(e)}`);
    }
  };
  return (
    <div className="ctl-row ctl-row-stacked">
      <span className="ctl-label">Picture or GIF</span>
      <div className="widget-picture">
        {src ? <img src={convertFileSrc(src)} alt="" className="widget-picture-thumb" /> : <span className="widget-picture-thumb widget-picture-none">none</span>}
        <span className="widget-picture-name">{name || (src ? "Chosen" : "Nothing chosen yet")}</span>
        <input ref={input} type="file" accept=".gif,.png,.jpg,.jpeg,.webp,.apng,.avif,.bmp,image/*" hidden onChange={(e) => { void choose(e.target.files?.[0]); e.target.value = ""; }} />
        <button className="aero-button" onClick={() => input.current?.click()}>{src ? "Replace…" : "Choose…"}</button>
        {src && <button className="aero-button" onClick={() => void ipc.clearWidgetMedia(widget.id).catch((e) => onStatus("error", `Could not remove it: ${humane(e)}`))}>Remove</button>}
      </div>
    </div>
  );
}

const GROUPS: WidgetGroup[] = ["Pictures", "Time", "Notes", "Fun", "System", "Desktop"];

function WidgetRow({
  widget,
  allowWeather,
  onStatus,
}: {
  widget: WidgetInstance;
  allowWeather: boolean;
  onStatus: Props["onStatus"];
}) {
  const [open, setOpen] = useState(false);
  const def = WIDGETS.find((w) => w.kind === widget.kind);
  const fail = (what: string) => (e: unknown) => onStatus("error", `${what}: ${humane(e)}`);
  const style = (patch: Parameters<typeof ipc.styleWidget>[1]) =>
    ipc.styleWidget(widget.id, patch).catch(fail("Could not change the widget"));

  const opts = widget.options;

  return (
    <div className="mode-card">
      <div className="mode-card-head">
        <span className="mode-card-glyph">{(def?.label ?? "?").charAt(0)}</span>
        <div className="mode-card-title">
          <strong>{def?.label ?? widget.kind}</strong>
          <span className="mode-card-meta">
            {Math.round(widget.width)} × {Math.round(widget.height)} ·{" "}
            {widget.surface === "clear" ? "Clear" : "Liquid"}
            {widget.locked && " · locked"}
          </span>
        </div>
        <button className="aero-button" onClick={() => setOpen((v) => !v)}>
          {open ? "Done" : "Edit"}
        </button>
      </div>

      {open && (
        <div className="mode-card-edit">
          <AeroSegmented<SurfaceStyle>
            label="Material"
            value={widget.surface}
            options={[
              { value: "liquid", label: "Liquid" },
              { value: "clear", label: "Clear" },
            ]}
            onChange={(v) => void style({ surface: v })}
          />
          <AeroSlider
            label="Opacity"
            value={widget.opacity}
            min={0.3}
            max={1}
            step={0.02}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={(v) => void style({ opacity: v })}
          />
          <div className="ctl-row">
            <span className="ctl-label">Tint</span>
            <div className="ctl-actions">
              <input
                type="color"
                className="ctl-color"
                aria-label="Widget tint"
                value={widget.accent ?? DEFAULT_ACCENT}
                onChange={(e) => void style({ accent: e.target.value })}
              />
              <button className="aero-button" onClick={() => void style({ accent: null })}>
                Use theme
              </button>
            </div>
          </div>
          <AeroToggle
            label="Ambient bubbles"
            checked={widget.ambient}
            hint="Also what the Liquid material refracts, since the desktop behind cannot be sampled"
            onChange={(v) => void style({ ambient: v })}
          />
          <AeroToggle
            label="Lock in place"
            checked={widget.locked}
            onChange={(v) => void style({ locked: v })}
          />

          {widget.kind === "picture" && <PictureChooser widget={widget} onStatus={onStatus} />}
          {def?.fields?.filter((f) => !f.when || f.when(widget.options.extra ?? {})).map((f) => <FieldRow key={f.key} widget={widget} field={f} />)}
          <p className="settings-note">The shape of the glass</p>
          {SHARED_FIELDS.map((f) => <FieldRow key={f.key} widget={widget} field={f} />)}

          {widget.kind === "clock" && (
            <>
              <AeroSegmented<string>
                label="Face"
                value={opts.analog ? "analog" : "digital"}
                options={[
                  { value: "analog", label: "Analogue" },
                  { value: "digital", label: "Digital" },
                ]}
                onChange={(v) => void style({ options: { ...opts, analog: v === "analog" } })}
              />
              <AeroToggle
                label="Show seconds"
                checked={opts.seconds}
                onChange={(v) => void style({ options: { ...opts, seconds: v } })}
              />
              <AeroToggle
                label="24 hour"
                checked={opts.twentyFourHour}
                onChange={(v) => void style({ options: { ...opts, twentyFourHour: v } })}
              />
            </>
          )}

          {widget.kind === "weather" && (
            <>
              <AeroSegmented<string>
                label="Units"
                value={opts.celsius ? "c" : "f"}
                options={[
                  { value: "c", label: "Celsius" },
                  { value: "f", label: "Fahrenheit" },
                ]}
                onChange={(v) => void style({ options: { ...opts, celsius: v === "c" } })}
              />
              <label className="ctl-row">
                <span className="ctl-label">Place name</span>
                <input
                  className="ctl-text"
                  defaultValue={opts.place ?? ""}
                  placeholder="Shown under the temperature"
                  onBlur={(e) => void style({ options: { ...opts, place: e.target.value || null } })}
                />
              </label>
              <div className="ctl-row">
                <span className="ctl-label">Latitude, longitude</span>
                <div className="ctl-actions">
                  <input
                    className="ctl-text ctl-text-short"
                    defaultValue={opts.latitude ?? ""}
                    placeholder="51.5"
                    aria-label="Latitude"
                    onBlur={(e) =>
                      void style({
                        options: {
                          ...opts,
                          latitude: e.target.value.trim() === "" ? null : Number(e.target.value),
                        },
                      })
                    }
                  />
                  <input
                    className="ctl-text ctl-text-short"
                    defaultValue={opts.longitude ?? ""}
                    placeholder="-0.13"
                    aria-label="Longitude"
                    onBlur={(e) =>
                      void style({
                        options: {
                          ...opts,
                          longitude: e.target.value.trim() === "" ? null : Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
              {!allowWeather && (
                <p className="settings-note">
                  Weather stays offline until you allow it below. Nothing is
                  requested before then.
                </p>
              )}
            </>
          )}

          <div className="mode-card-actions">
            <button
              className="aero-button aero-button-danger"
              onClick={() =>
                ipc
                  .removeWidget(widget.id)
                  .then(() => onStatus("ok", `Removed the ${def?.label ?? "widget"}.`))
                  .catch(fail("Could not remove the widget"))
              }
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function WidgetsCard({ settings, onStatus }: Props) {
  const w = settings.widgets;
  const fail = (what: string) => (e: unknown) => onStatus("error", `${what}: ${humane(e)}`);
  const hasWeather = w.widgets.some((x) => x.kind === "weather");

  return (
    <SettingsSection id="widgets">
            <AeroToggle
        label="Show widgets on the desktop"
        checked={w.enabled}
        hint="Draggable glass widgets that sit on the wallpaper"
        onChange={(v) =>
          ipc
            .enableWidgets(v)
            .then(() =>
              onStatus("ok", v ? "Widgets are on the desktop." : "Widgets are off."),
            )
            .catch(fail("Could not change widgets"))
        }
      />

      {w.enabled && (
        <>
          <p className="settings-note">
            Drag a widget to move it, and drag its bottom right corner to
            resize. Everywhere else on the desktop keeps working normally.
          </p>

          <div className="mode-list">
            {w.widgets.map((widget) => (
              <WidgetRow
                key={widget.id}
                widget={widget}
                allowWeather={w.allowWeatherNetwork}
                onStatus={onStatus}
              />
            ))}
          </div>

          <div className="ctl-row ctl-row-stacked">
            <span className="ctl-label">Add a widget</span>
            <div className="widget-groups">
              {GROUPS.map((group) => (
                <div key={group} className="widget-group">
                  <span className="widget-group-name">{group}</span>
                  <div className="widget-add">
                    {WIDGETS.filter((d) => d.group === group).map((def) => (
                      <button
                        key={def.kind}
                        className="aero-button"
                        title={def.description}
                        onClick={() =>
                          ipc
                            .addWidget(def.kind as WidgetKind)
                            .then(() => onStatus("ok", `Added the ${def.label}.`))
                            .catch(fail("Could not add the widget"))
                        }
                      >
                        {def.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AeroToggle
            label="Let the weather widget use the network"
            checked={w.allowWeatherNetwork}
            hint="Nothing else in Liquidock makes any network request"
            onChange={(v) =>
              ipc
                .allowWeatherNetwork(v)
                .then(() =>
                  onStatus(
                    "ok",
                    v ? "Weather may now fetch conditions." : "Weather is offline again.",
                  ),
                )
                .catch(fail("Could not change that"))
            }
          />
          <p className="settings-note">
            Weather is the only widget that leaves your machine. With this on
            it asks Open-Meteo for conditions at the coordinates you set, and
            sends nothing else. There is no account and no key. Everything
            else here runs entirely offline
            {hasWeather ? "." : ", and no weather widget is on the desktop yet."}
          </p>
        </>
      )}
    </SettingsSection>
  );
}
