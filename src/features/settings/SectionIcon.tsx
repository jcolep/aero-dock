/**
 * A section's icon in the settings sidebar and at the top of its page: a small rounded tile of glass in the section's
 * own color, with a white glyph on it, as the system settings of a Mac have.
 */

import type { ReactNode } from "react";
import { sectionById } from "./sections";

/** The glyphs, drawn on a 20-unit grid, white strokes and fills. */
const GLYPHS: Record<string, ReactNode> = {
  color: (
    <>
      <path d="M10 3.2a6.8 6.8 0 1 0 0 13.6c1.2 0 1.8-.8 1.4-1.8-.5-1.2.2-2.2 1.5-2.2h1.4a2.5 2.5 0 0 0 2.5-2.5C16.8 6.2 13.8 3.2 10 3.2Z" fill="none" stroke="#fff" strokeWidth="1.5" />
      <circle cx="6.6" cy="9.4" r="1.15" fill="#fff" />
      <circle cx="8.9" cy="6.4" r="1.15" fill="#fff" />
      <circle cx="12.4" cy="6.6" r="1.15" fill="#fff" />
    </>
  ),
  glass: <path d="M10 3.4c2.6 3.3 4.6 5.8 4.6 8.2a4.6 4.6 0 0 1-9.2 0c0-2.4 2-4.9 4.6-8.2Z" fill="#fff" />,
  animations: (
    <>
      <path d="M8.6 3.6 9.9 7.6l4 1.3-4 1.3-1.3 4-1.3-4-4-1.3 4-1.3Z" fill="#fff" />
      <path d="m14.2 11.6.6 1.8 1.8.6-1.8.6-.6 1.8-.6-1.8-1.8-.6 1.8-.6Z" fill="#fff" />
    </>
  ),
  dock: (
    <>
      <rect x="3" y="12.2" width="14" height="4.4" rx="2.2" fill="none" stroke="#fff" strokeWidth="1.5" />
      <rect x="4.6" y="5.4" width="3.2" height="3.2" rx=".9" fill="#fff" />
      <rect x="8.4" y="4" width="3.2" height="4.6" rx=".9" fill="#fff" />
      <rect x="12.2" y="5.4" width="3.2" height="3.2" rx=".9" fill="#fff" />
    </>
  ),
  "dock-items": (
    <>
      <circle cx="6.5" cy="6.5" r="2.2" fill="#fff" />
      <circle cx="13.5" cy="6.5" r="2.2" fill="none" stroke="#fff" strokeWidth="1.4" />
      <circle cx="6.5" cy="13.5" r="2.2" fill="none" stroke="#fff" strokeWidth="1.4" />
      <circle cx="13.5" cy="13.5" r="2.2" fill="#fff" />
    </>
  ),
  modes: (
    <>
      <path d="m10 3.6 6.4 3.3L10 10.2 3.6 6.9Z" fill="#fff" />
      <path d="m3.6 10 6.4 3.3 6.4-3.3M3.6 13.1 10 16.4l6.4-3.3" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </>
  ),
  audio: (
    <>
      <path d="M4 8h2.6L10 5v10l-3.4-3H4Z" fill="#fff" />
      <path d="M12.6 7.4a3.6 3.6 0 0 1 0 5.2M14.6 5.4a6.4 6.4 0 0 1 0 9.2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  menubar: (
    <>
      <rect x="3" y="3.6" width="14" height="3.4" rx="1.7" fill="#fff" />
      <rect x="3" y="8.8" width="14" height="7.6" rx="2" fill="none" stroke="#fff" strokeWidth="1.4" />
    </>
  ),
  start: (
    <>
      {[4.2, 8.6, 13].flatMap((x) =>
        [4.2, 8.6, 13].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="2.8" height="2.8" rx=".8" fill="#fff" />),
      )}
    </>
  ),
  frame: (
    <>
      <rect x="3" y="3.4" width="14" height="13.2" rx="3" fill="none" stroke="#fff" strokeWidth="1.5" />
      <rect x="6" y="6.4" width="8" height="7.2" rx="1.5" fill="#fff" />
    </>
  ),
  widgets: (
    <>
      <rect x="3.4" y="3.4" width="6" height="6" rx="1.6" fill="#fff" />
      <rect x="10.6" y="3.4" width="6" height="6" rx="3" fill="none" stroke="#fff" strokeWidth="1.4" />
      <rect x="3.4" y="10.6" width="13.2" height="6" rx="1.6" fill="none" stroke="#fff" strokeWidth="1.4" />
    </>
  ),
  accessibility: (
    <>
      <circle cx="10" cy="4.8" r="1.7" fill="#fff" />
      <path d="M4.6 7.6c1.8.6 3.6.9 5.4.9s3.6-.3 5.4-.9M10 8.6v3.6m0 0-2.4 4.6M10 12.2l2.4 4.6" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  behavior: (
    <>
      <circle cx="10" cy="10" r="2.4" fill="none" stroke="#fff" strokeWidth="1.5" />
      <path d="M10 3.2v2.1M10 14.7v2.1M3.2 10h2.1M14.7 10h2.1M5.2 5.2l1.5 1.5M13.3 13.3l1.5 1.5M5.2 14.8l1.5-1.5M13.3 6.7l1.5-1.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  support: <path d="M10 16.2s-6.2-3.7-6.2-8.2a3.4 3.4 0 0 1 6.2-1.9A3.4 3.4 0 0 1 16.2 8c0 4.5-6.2 8.2-6.2 8.2Z" fill="#fff" />,
  about: (
    <>
      <circle cx="10" cy="6" r="1.3" fill="#fff" />
      <path d="M10 9v6.4" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
};

export function SectionIcon({ id, size = 22 }: { id: string; size?: number }) {
  const hue = sectionById(id)?.hue ?? null;
  return (
    <span
      className="section-icon"
      aria-hidden
      data-grey={hue === null}
      style={{ width: size, height: size, ["--h" as string]: hue ?? 0 } as React.CSSProperties}
    >
      <svg viewBox="0 0 20 20">{GLYPHS[id] ?? GLYPHS.about}</svg>
    </span>
  );
}
