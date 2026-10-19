/**
 * How a click effect plays: speed, opacity, size (what that is depends on the effect) and the color of its light. Used
 * for an app icon's click effect (Animations) and for the Liquidock button's hover (Dock items), each with its own
 * values.
 */

import type { ClickTune } from "../../ipc/types";
import { AeroSlider } from "./controls";
import { BubbleColor } from "./BubbleColor";

export const PLAIN_CLICK_TUNE: ClickTune = { speed: 1, opacity: 1, size: 1, color: "" };

const SIZE_LABEL: Record<string, string> = { halo: "Line thickness", shine: "Band width", dimple: "Ring thickness", bloom: "Size" };

export function ClickTuneControls({
  effect,
  tune,
  themeColor,
  onChange,
}: {
  effect: string;
  tune: ClickTune | undefined;
  themeColor: string;
  onChange: (change: (t: ClickTune) => void) => void;
}) {
  const t = tune ?? PLAIN_CLICK_TUNE;
  const times = (v: number) => `${v.toFixed(2)}×`;
  return (
    <div className="click-tune">
      <AeroSlider label="Speed" value={t.speed} min={0.25} max={3} step={0.05} format={times} onChange={(v) => onChange((x) => void (x.speed = v))} />
      <AeroSlider label="Opacity" value={t.opacity} min={0.1} max={1.5} step={0.05} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => onChange((x) => void (x.opacity = v))} />
      <AeroSlider label={SIZE_LABEL[effect] ?? "Size"} value={t.size} min={0.25} max={3} step={0.05} format={times} onChange={(v) => onChange((x) => void (x.size = v))} />
      <BubbleColor
        label="Color"
        value={t.color}
        themeColor={effect === "bloom" ? themeColor : "#ffffff"}
        defaultName={effect === "bloom" ? "Follow the theme" : "White light"}
        onChange={(hex) => onChange((x) => void (x.color = hex))}
      />
    </div>
  );
}
