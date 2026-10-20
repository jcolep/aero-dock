/**
 * Your own picture or GIF, centred in a pane of glass.
 *
 * The file is chosen in Settings and kept in the data folder (so it survives the original moving). Everything about how
 * it sits is a setting: how it fits, its scale and shape, the room round it, filters, a glow, a caption, and whether a
 * GIF plays all the time or only while the pointer is on it (a still of its first frame the rest of the time, which
 * also saves the page redrawing it).
 */

import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect, useRef, useState } from "react";
import { opt } from "../kit";
import type { WidgetProps } from "../registry";

/** The first frame of a picture, drawn to a canvas of its own size (an `<img>` of a GIF cannot be paused). */
function Still({ url, className, style }: { url: string; className: string; style: React.CSSProperties }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const c = canvas.current;
      if (!c) return;
      c.width = img.naturalWidth || 1;
      c.height = img.naturalHeight || 1;
      c.getContext("2d")?.drawImage(img, 0, 0);
    };
    img.src = url;
    return () => {
      img.onload = null;
    };
  }, [url]);
  return <canvas ref={canvas} className={className} style={style} />;
}

export function PictureWidget({ widget }: WidgetProps) {
  const src = opt(widget, "src", "");
  const fit = opt(widget, "fit", "contain");
  const scale = opt(widget, "scale", 1);
  const shape = opt(widget, "shape", "rounded");
  const pad = opt(widget, "pad", 14);
  const imageOpacity = opt(widget, "imageOpacity", 1);
  const flip = opt(widget, "flip", false);
  const filter = opt(widget, "filter", "none");
  const brightness = opt(widget, "brightness", 1);
  const glow = opt(widget, "glow", false);
  const playOnHover = opt(widget, "playOnHover", false);
  const caption = opt(widget, "caption", "");
  const captionSize = opt(widget, "captionSize", 13);
  const [hovered, setHovered] = useState(false);

  if (!src) return <div className="w-empty">Choose a picture or GIF in Settings › Widgets</div>;
  const url = convertFileSrc(src);
  const still = playOnHover && !hovered && /\.(gif|apng|webp|avif)$/i.test(src);

  const css: React.CSSProperties = {
    objectFit: fit as React.CSSProperties["objectFit"],
    opacity: imageOpacity,
    transform: `scale(${scale})${flip ? " scaleX(-1)" : ""}`,
    filter: [filter === "none" ? "" : `${filter}(1)`, brightness === 1 ? "" : `brightness(${brightness})`].filter(Boolean).join(" ") || undefined,
  };

  return (
    <div className="w-pic" style={{ padding: pad }} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
      <div className="w-pic-frame" data-shape={shape} data-glow={glow || undefined}>
        {still ? <Still url={url} className="w-pic-img" style={css} /> : <img className="w-pic-img" src={url} alt="" draggable={false} style={css} />}
      </div>
      {caption && (
        <div className="w-pic-caption" style={{ fontSize: captionSize }}>
          {caption}
        </div>
      )}
    </div>
  );
}
