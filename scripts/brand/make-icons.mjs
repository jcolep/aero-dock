// Liquidock's app icons, made from its mark: the drop of glass (src/engine/brand/dropletSvg.js) drawn at 1024 px on a
// clear ground by a headless browser, then every size and format Tauri wants made from that by `tauri icon`. The icon
// is the drop in a cool silver that reads on light and dark alike (an exe's icon cannot follow the theme; the tray
// icon does, at run time: useTrayDroplet).
//
//   node --experimental-websocket scripts/brand/make-icons.mjs [out folder]

import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dropletSvg } from "../../src/engine/brand/dropletSvg.js";
import { startHarness } from "../offscreen/harness.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const out = process.argv[2] ?? join(root, "offscreen-out");
const SILVER = "#9fb4cc";
const PX = 1024;

const h = await startHarness({ out, window: "menubar", viewport: [PX, PX] });
try {
  const svg = dropletSvg(SILVER, PX, false);
  // (no scrollbars: an inline SVG sits on a text line, a few pixels taller than itself, and they were drawn too)
  await h.eval(`(() => { document.open(); document.write(${JSON.stringify(`<!doctype html><html style="background:transparent;overflow:hidden"><body style="margin:0;background:transparent;overflow:hidden"><div style="width:${PX}px;height:${PX}px;line-height:0">${svg.replace("<svg ", '<svg style="display:block" ')}</div></body></html>`)}); document.close(); return 1; })()`);
  await h.send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
  await h.sleep(400);
  const png = (await h.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: PX, height: PX, scale: 1 } })).result.data;
  const source = join(root, "src-tauri", "icons", "source.png");
  writeFileSync(source, Buffer.from(png, "base64"));
  console.log("drew", source);
} finally {
  h.close();
}
execSync(`pnpm tauri icon "${join(root, "src-tauri", "icons", "source.png")}"`, { cwd: root, stdio: "inherit" });
process.exit(0);
