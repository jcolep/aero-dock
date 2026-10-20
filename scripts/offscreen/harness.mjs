// Off-screen test harness for Liquidock's pages.
//
// It serves the built `dist` to a separate headless Edge (its own profile, no
// window on screen), stands in for the Tauri backend with a mock, and drives
// the page with the browser's own synthetic input over the Chrome DevTools
// Protocol. No Liquidock process runs, nothing appears on the desktop, and no
// real mouse or keyboard is used, so it is safe to run while someone is working.
//
// What it cannot show is native behaviour (window regions, focus, activation,
// the real blur, the taskbar): that needs a built exe on a real desktop.
//
// Needs Node 20+ with `--experimental-websocket`, and Microsoft Edge. Build the
// page first (`pnpm build`). Scenarios in this folder are short scripts on top
// of this; see them for examples.

import { execFileSync, spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, "..", "..");

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const EDGES = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml" };

/** The default settings, as the app itself makes them (asked of Rust once and kept). */
function defaultSettings(out) {
  const file = join(out, "default-settings.json");
  // asked of Rust again whenever the settings code is newer than the copy kept
  const source = join(projectRoot, "src-tauri", "src", "core", "settings.rs");
  if (!existsSync(file) || statSync(file).mtimeMs < statSync(source).mtimeMs) {
    execFileSync(
      "cargo",
      ["test", "--manifest-path", join(projectRoot, "src-tauri", "Cargo.toml"), "write_default_settings", "--", "--ignored"],
      { env: { ...process.env, AERO_FIXTURE_OUT: file }, stdio: "ignore" },
    );
  }
  return JSON.parse(readFileSync(file, "utf8"));
}

/** A small icon, so the dock page has something for every target it asks about.
 *  (A mock that answers `{}` makes the page ask again forever and freeze.) */
const ICON =
  "data:image/svg+xml;utf8," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="6" y="6" width="52" height="52" rx="14" fill="#3b82c4"/></svg>');

/**
 * Start a harness.
 *
 * @param {object} o
 * @param {string} [o.dist]      the built page (default: `dist` of this project)
 * @param {string} o.out         a folder for profiles and results
 * @param {string} [o.window]    which window the page is: menubar | dock | settings | frame ...
 * @param {[number, number]} [o.viewport]
 * @param {(settings: object) => void} [o.settings]  change the settings the mock serves
 * @param {object} [o.status]    overrides for what `get_system_status` returns
 * @param {object[]} [o.privacy] the apps `get_privacy_use` reports (microphone/camera in use)
 * @param {object[]} [o.running] the windows `get_running` reports (default: one Notepad window)
 * @param {object} [o.media]     overrides for what `widget_now_playing` reports (the session starts as a seekable track)
 * @param {string} [o.art]       the cover `media_artwork` returns (a data: address), or none
 * @param {object[]} [o.apps]    what `list_apps` returns (the Start menu's list of every app)
 * @param {object[]} [o.recent]  what `list_recent_files` returns
 * @param {object[]} [o.files]   what `search_files` returns
 * @param {object[]} [o.downloads] what `list_recent_downloads` returns
 * @param {object}   [o.profile] what `user_profile` returns
 */
export async function startHarness({ dist = join(projectRoot, "dist"), out: outFolder, window = "menubar", viewport = [1920, 700], settings: patch, status = {}, running, privacy = [], media = {}, art = null, apps = [], recent = [], files = [], downloads = [], profile = { name: "Jake Pascoe", picture: "" }, scale = 1 }) {
  // absolute, because the browser reads its profile path from its own directory,
  // not from this script's
  const out = resolve(outFolder);
  mkdirSync(out, { recursive: true });
  const settings = defaultSettings(out);
  if (window === "menubar") settings.menuBar.enabled = true;
  patch?.(settings);

  // ---- the page, served ----
  const server = createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = join(dist, p);
    if (!existsSync(f)) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { "content-type": TYPES[extname(f)] ?? "application/octet-stream" });
    res.end(readFileSync(f));
  });
  const port = Number(process.env.AERO_PAGE_PORT ?? 4173);
  await new Promise((r) => server.listen(port, "127.0.0.1", r));

  // ---- a headless Edge of its own ----
  const edgePath = EDGES.find(existsSync);
  if (!edgePath) throw new Error("Microsoft Edge was not found");
  const debugPort = Number(process.env.AERO_CDP_PORT ?? 9333);
  const edge = spawn(
    edgePath,
    ["--headless=new", `--remote-debugging-port=${debugPort}`, `--user-data-dir=${join(out, "profile")}`, `--window-size=${viewport[0]},${viewport[1]}`, "--disable-gpu", "--no-first-run", "--no-default-browser-check", "about:blank"],
    { stdio: "ignore" },
  );
  let page;
  for (let i = 0; i < 60 && !page; i++) {
    try {
      page = (await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json()).find((t) => t.type === "page");
    } catch {}
    if (!page) await sleep(200);
  }
  if (!page) throw new Error("the browser did not start");
  // Only ever drive the headless browser started above. If the port was taken (a real Liquidock started with
  // remote debugging, say), whatever answers there is someone else's, and navigating its page would take over one of
  // their windows: that happened once. So check, and stop.
  const version = await (await fetch(`http://127.0.0.1:${debugPort}/json/version`)).json();
  if (!/Headless/i.test(version["User-Agent"] ?? "") || page.url.startsWith("http://tauri.localhost")) {
    edge.kill();
    throw new Error(`port ${debugPort} belongs to another browser (${version.Browser}): set AERO_CDP_PORT to a free port`);
  }
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let nextId = 0;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  });
  // every call has a timeout: a stuck page otherwise hangs the script silently
  const send = (method, params = {}, ms = 15000) =>
    new Promise((resolveCall, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => reject(new Error(`${method} timed out`)), ms);
      pending.set(id, (m) => {
        clearTimeout(timer);
        resolveCall(m);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  const evalJs = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text));
    return r.result.result.value;
  };

  // ---- the backend, mocked ----
  const mock = `
(() => {
  const settings = ${JSON.stringify(settings)};
  const status = Object.assign({
    battery: { present: true, percent: 80, charging: false },
    internet: true, link: "wifi",
    volume: { available: true, level: 55, muted: false },
    recycleBin: { items: 0, bytes: 0 },
  }, ${JSON.stringify(status)});
  const ICON = ${JSON.stringify(ICON)};
  const RUNNING = ${JSON.stringify(running ?? [{ hwnd: 1, title: "Notes", exe: "notepad.exe", pid: 1, aumid: null, monitor: "" }])};
  window.__unknown = [];
  window.__calls = [];
  // what went wrong in the page: an uncaught error, a rejected promise no one caught, or React's own report of a
  // render that threw (which takes the whole page down)
  window.__errors = [];
  window.addEventListener("error", (e) => window.__errors.push(String(e.error?.stack ?? e.message)));
  window.addEventListener("unhandledrejection", (e) => window.__errors.push("rejected: " + String(e.reason?.stack ?? e.reason)));
  const consoleError = console.error.bind(console);
  console.error = (...a) => { window.__errors.push(a.map((x) => String(x?.stack ?? x)).join(" ")); consoleError(...a); };
  // the media session: commands change it, and reading it moves a playing track on
  window.__media = Object.assign({
    active: true, title: "A song", artist: "An artist", album: "", playing: true, source: "Player", sourceName: "Player",
    sourceTarget: "", sourceHwnd: 0, key: "k1", hasArtwork: false, positionMs: 42000, durationMs: 215000, canSeek: true,
    canPrevious: true, canNext: true, shuffle: false, repeat: "none", players: [],
  }, ${JSON.stringify(media)});
  window.__art = ${JSON.stringify(art)};
  window.__reduceT = false;
  const callbacks = {};
  const listeners = {};
  // deliver an event to whoever listened for it, as the real backend would
  window.__emit = (event, payload) => (listeners[event] || []).forEach((h) => callbacks[h] && callbacks[h]({ event, id: h, payload }));
  window.__TAURI_INTERNALS__ = {
    metadata: { currentWindow: { label: ${JSON.stringify(window)} }, currentWebview: { windowLabel: ${JSON.stringify(window)}, label: ${JSON.stringify(window)} } },
    transformCallback(cb) { const i = Math.floor(Math.random() * 1e9); callbacks[i] = cb; return i; },
    unregisterCallback(i) { delete callbacks[i]; },
    convertFileSrc: (p) => p,
    async invoke(cmd, args) {
      window.__calls.push({ cmd, args });
      switch (cmd) {
        case "get_settings": return JSON.parse(JSON.stringify(settings));
        case "set_settings": return args && args.settings ? args.settings : settings;
        case "get_running": return { windows: RUNNING, focused: 1 };
        case "get_system_status": return status;
        case "get_system_accessibility": return { reduceMotion: false, reduceTransparency: !!window.__reduceT };
        case "widget_now_playing": {
          const m = window.__media, now = Date.now();
          if (m.playing) m.positionMs = Math.min(m.durationMs || 1e12, m.positionMs + (now - (m._at || now)));
          m._at = now;
          return JSON.parse(JSON.stringify(m));
        }
        case "widget_media_control": {
          const m = window.__media;
          if (args.action === "playpause") m.playing = !m.playing;
          else { m.title = args.action === "next" ? "The next song" : "The song before"; m.key = "k" + Date.now(); m.positionMs = 0; }
          return true;
        }
        case "list_apps": return ${JSON.stringify(apps)};
        case "list_recent_files": return ${JSON.stringify(recent)};
        case "search_files": return ${JSON.stringify(files)}.filter((f) => f.name.toLowerCase().includes(String(args.query || "").toLowerCase()));
        case "windows_search": return null;
        case "blur_report": return "";
        case "report_frame_stats": return null;
        case "frame_stats": return window.__frameRows || [];
        case "frame_report": return "";
        // a picture of the desktop behind a region: red, to yellow, to blue, from left to right, so that where the page
        // puts it shows (the real one is a blurred picture of the screen)
        case "capture_backdrop": {
          const r = args.request, dpr = r.dpr || 1;
          const w = Math.max(2, Math.round(r.width / 4)), h = Math.max(2, Math.round(r.height / 4));
          const c = document.createElement("canvas");
          c.width = w; c.height = h;
          const g = c.getContext("2d");
          const grad = g.createLinearGradient(0, 0, w, 0);
          // the middle moves a little at every look, as a desktop that changes would
          window.__bdTick = (window.__bdTick || 0) + 1;
          grad.addColorStop(0, "#d03030"); grad.addColorStop(0.25 + (window.__bdTick % 5) * 0.12, "#e8c030"); grad.addColorStop(1, "#3050d0");
          g.fillStyle = grad; g.fillRect(0, 0, w, h);
          const bin = atob(c.toDataURL("image/png").split(",")[1]);
          const buf = new ArrayBuffer(20 + bin.length), dv = new DataView(buf), bytes = new Uint8Array(buf);
          [r.x, r.y, r.width, r.height].forEach((v, i) => dv.setInt32(i * 4, Math.round(v * dpr), true));
          dv.setFloat32(16, window.__bdLuma ?? 0.5, true);
          for (let i = 0; i < bin.length; i++) bytes[20 + i] = bin.charCodeAt(i);
          return buf;
        }
        case "list_recent_downloads": return ${JSON.stringify(downloads)};
        case "user_profile": return ${JSON.stringify(profile)};
        case "toggle_start": case "close_start": case "launch_as_admin": case "open_file_location": case "system_action": case "pin_item": return null;
        case "media_artwork": return window.__art;
        case "report_frame_glass": return null;
        case "set_glass_pane": return null;
        case "media_seek": window.__media.positionMs = args.positionMs; return true;
        case "media_seek_by": window.__media.positionMs = Math.max(0, window.__media.positionMs + args.deltaMs); return true;
        case "media_shuffle": window.__media.shuffle = args.on; return true;
        case "media_repeat": window.__media.repeat = args.mode; return true;
        case "media_select": window.__media.players.forEach((p) => { p.current = p.id === args.id; }); return null;
        case "media_spectrum": case "media_focus_source": return null;
        case "get_radios": return [{ kind: "wifi", name: "Wi-Fi", on: true, switchable: true }, { kind: "bluetooth", name: "Bluetooth", on: true, switchable: true }];
        case "list_wifi": return [{ ssid: "Office", signal: 80, secured: true, connected: true, known: true }, { ssid: "Guest", signal: 45, secured: false, connected: false, known: false }];
        case "list_bluetooth": return [{ name: "Headphones", sort: "audio", connected: true }];
        case "get_brightness": return { available: true, percent: 70 };
        case "window_rects": return ((args && args.hwnds) || []).filter((h) => !(window.__minimised || []).includes(h)).map((h, i) => ({ hwnd: h, x: 120 + i * 90, y: 90 + i * 50, width: i % 2 ? 900 : 1280, height: i % 2 ? 700 : 760 }));
        case "get_privacy_use": return ${JSON.stringify(privacy)};
        case "get_stats": { window.__statsTick = (window.__statsTick || 0) + 1; const t = window.__statsTick; return { cpuPercent: 20 + ((t * 7) % 50), memoryPercent: 61, memoryUsedMb: 19800, memoryTotalMb: 32500, netDown: 180000 + t * 9000, netUp: 24000 }; }
        case "get_top_processes": return [{ name: "msedge", cpuPercent: 6.2, memoryMb: 1660, processes: 14 }, { name: "Code", cpuPercent: 3.1, memoryMb: 2526, processes: 19 }, { name: "Teams", cpuPercent: 1.4, memoryMb: 640, processes: 7 }, { name: "explorer", cpuPercent: 0.4, memoryMb: 180, processes: 1 }];
        case "resolve_icons": { const out = {}; for (const t of (args && args.targets) || []) out[t] = ICON; return out; }
        // an app's Jump List: a script sets window.__jump (null, the default, is an app with none)
        case "jump_list": { const j = window.__jump ?? null; const ms = window.__jumpDelay ?? 0; return ms ? new Promise((r) => setTimeout(() => r(j), ms)) : j; }
        case "jump_open": return null;
        // how light the screen is behind a panel: a script sets window.__light (0..1, everywhere); dark by default
        case "backdrop_light": return { cols: args.cols, rows: args.rows, light: Array.from({ length: args.cols * args.rows }, () => window.__light ?? 0.1) };
        case "plugin:event|listen": (listeners[args.event] = listeners[args.event] || []).push(args.handler); return args.handler;
        case "plugin:event|unlisten": return null;
        case "get_user_idle": case "get_idle": return false;
        case "dock_monitor": return "";
        case "app_display_name": {
          // the file's name without its folder or extension, capitalised (no backslashes here: this is inside a template literal)
          const last = String(args && args.target || "").split(String.fromCharCode(92)).pop().split("/").pop().replace(".exe", "");
          return last ? last.charAt(0).toUpperCase() + last.slice(1) : null;
        }
        // commands with a real effect are acknowledged and recorded, never run
        case "resize_menubar": case "resize_dock": case "set_menubar_menu_open": case "activate_window":
        case "set_dock_focusable": case "set_tray_icon": case "report_dock_bar": case "close_window": case "minimize_window": case "show_window_previews": case "hide_window_previews": case "toggle_mission": case "close_mission": case "toggle_window": case "set_memory_saver": case "set_volume": case "set_radio":
        case "connect_wifi": case "disconnect_wifi": case "set_brightness": case "launch": return null;
        default:
          if (cmd.startsWith("list_")) return [];
          window.__unknown.push(cmd);
          return null;
      }
    },
  };
})();`;
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: mock });
  await send("Emulation.setDeviceMetricsOverride", { width: viewport[0], height: viewport[1], deviceScaleFactor: scale, mobile: false });

  const api = {
    out,
    settings,
    send,
    eval: evalJs,
    sleep,
    /** What went wrong in the page so far: uncaught errors, unhandled rejections, console errors. */
    errors: () => evalJs("window.__errors || []"),
    /** Open the page and wait for something in it (a selector). */
    async open(ready = ".menubar", query = "") {
      await send("Page.navigate", { url: `http://127.0.0.1:${port}/index.html?window=${window}${query}` });
      for (let i = 0; i < 60; i++) {
        if (await evalJs(`!!document.querySelector(${JSON.stringify(ready)})`)) break;
        await sleep(200);
      }
      await sleep(500);
    },
    /** A dark, slightly blue backdrop under the transparent page, like a desktop. */
    async desktop(css = "linear-gradient(120deg,#12182e,#2b3a66)") {
      await evalJs(`document.documentElement.style.background = ${JSON.stringify(css)}; document.body.style.background = "transparent"`);
    },
    /** The middle of an element, in page coordinates. */
    rect: (selector) =>
      evalJs(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, left: r.left, top: r.top, width: r.width, height: r.height }; })()`),
    move: (x, y) => send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, button: "none", buttons: 0 }),
    /** A click of the pointer's "left" (default), "middle" or "right" button. */
    /** Press the left button at a place, and let it go at another (a press held, then released elsewhere). */
    async down(x, y) {
      await api.move(x, y);
      await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", buttons: 1, clickCount: 1 });
    },
    /** Move the pointer with the left button held (between `down` and `up`: a drag). */
    held: (x, y) => send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, button: "left", buttons: 1 }),
    async up(x, y) {
      await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, button: "left", buttons: 1 });
      await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", buttons: 0, clickCount: 1 });
    },
    async click(x, y, button = "left") {
      const held = { left: 1, right: 2, middle: 4 }[button];
      await api.move(x, y);
      await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button, buttons: held, clickCount: 1 });
      await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button, buttons: 0, clickCount: 1 });
    },
    /** Move the pointer from one place to another in small steps, as a hand does. */
    async sweep(from, to, steps = 8) {
      for (let i = 1; i <= steps; i++) {
        await api.move(from.x + ((to.x - from.x) * i) / steps, from.y + ((to.y - from.y) * i) / steps);
        await sleep(12);
      }
    },
    key: (key) => send("Input.dispatchKeyEvent", { type: "keyDown", key, code: key }).then(() => send("Input.dispatchKeyEvent", { type: "keyUp", key, code: key })),
    /** A screenshot of part of the page, as base64 (page coordinates, not viewport). */
    async shot(x, y, w, h, scale = 1) {
      return (await send("Page.captureScreenshot", { format: "png", clip: { x, y, width: w, height: h, scale } })).result.data;
    },
    /** Record a property of an element on every animation frame, to read afterwards. */
    async record(name, expression) {
      await evalJs(`window.__rec_${name} = []; (function tick(){ try { window.__rec_${name}.push({ t: Math.round(performance.now()), v: (${expression}) }); } catch (e) {} requestAnimationFrame(tick); })()`);
    },
    recorded: (name) => evalJs(`window.__rec_${name}`),
    /** The commands the page called that the mock did not know. */
    unknownCalls: () => evalJs("window.__unknown"),
    /** Send the page an event, as the backend would. */
    emit: (event, payload) => evalJs(`window.__emit(${JSON.stringify(event)}, ${JSON.stringify(payload)})`),
    /** Commands the page called, in order. */
    calls: () => evalJs("window.__calls"),
    /** Lay screenshots side by side in one image (file in `out`). */
    async sheet(shots, name = "sheet", height = 800) {
      const html =
        `<!doctype html><body style="margin:0;background:#1a1d2b;font:12px sans-serif;color:#fff"><div style="display:flex;gap:8px;padding:6px;flex-wrap:wrap">` +
        Object.entries(shots).map(([k, v]) => `<div><b>${k}</b><br><img style="border:1px solid #666" src="data:image/png;base64,${v}"></div>`).join("") +
        `</div></body>`;
      writeFileSync(join(out, `${name}.html`), html);
      await send("Page.navigate", { url: "file:///" + join(out, `${name}.html`).replaceAll("\\", "/") });
      await sleep(1000);
      await send("Emulation.setDeviceMetricsOverride", { width: 2200, height, deviceScaleFactor: 1, mobile: false });
      const png = join(out, `${name}.png`);
      writeFileSync(png, Buffer.from((await send("Page.captureScreenshot", { format: "png" })).result.data, "base64"));
      return png;
    },
    close() {
      try {
        ws.close();
      } catch {}
      edge.kill();
      server.close();
    },
  };
  return api;
}
