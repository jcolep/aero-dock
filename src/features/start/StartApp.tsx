/**
 * The Start menu, in liquid glass, with what Windows' has: a search box that
 * finds apps, Settings pages, files and sums; the pinned apps; the list of every
 * app; recent files; who is signed in; and the power menu.
 *
 * It is the page of a window of its own (see `commands/start.rs`), which is only
 * as big as the panel and its shadow and is shown over the dock's search button.
 * Rust tells the page when it has been opened (`start://open`) and when a click
 * landed anywhere else (`start://outside`); the page animates away and asks Rust
 * to hide the window.
 *
 * The pinned apps are our own list (Windows keeps its own in a file that cannot
 * be read), started from the dock's pins the first time and the user's after that.
 */

import { listen } from "@tauri-apps/api/event";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReduced } from "../../engine/accessibility/policy";
import { animationsOf, startExitMs } from "../../engine/animation/presets";
import { playCue } from "../../engine/sound/ui";
import { useGlideHighlight } from "../../engine/lens/useGlideHighlight";
import { applyAppearance } from "../../engine/themes/applyTheme";
import { GlassTips } from "../../engine/tooltip/GlassTips";
import { ipc } from "../../ipc/commands";
import type { AppEntry, Download, FoundFile, PinnedItem, Profile, RecentFile, StartPin } from "../../ipc/types";
import { useDockIcons } from "../../state/dockStore";
import { useSettings } from "../../state/settingsStore";
import { notify } from "../feedback/toastStore";
import { calculate, formatResult } from "./calc";
import { sizeText, timeAgo } from "./format";
import { matchSettings } from "./settingsPages";
import "./start.css";

type Kind = "app" | "file" | "folder" | "setting" | "calc";

/** Anything the menu can show and open. */
interface Item {
  key: string;
  kind: Kind;
  name: string;
  detail?: string;
  /** What to launch (a path, an address, or `shell:AppsFolder\...`); also what its icon is asked for by. */
  target: string;
  args?: string;
  /** For a sum: the answer. */
  value?: number;
}

interface Opening {
  previous: number;
}

type Phase = "closed" | "open" | "closing";

/** What the highlight can glide to, and the lists it is held inside. */
const LENS_ITEMS = ".st-tile, .st-rec, .st-row, .st-link, .st-user, .st-pill";
const LENS_CLIPS = "[data-lens-clip]";

const EXPLORER: StartPin = { name: "File Explorer", target: "C:\\Windows\\explorer.exe", args: "" };
const SETTINGS_APP: StartPin = {
  name: "Settings",
  target: "shell:AppsFolder\\windows.immersivecontrolpanel_cw5n1h2txyewy!microsoft.windows.immersivecontrolpanel",
  args: "",
};

const sameApp = (a: { target: string; args?: string }, b: { target: string; args?: string }) =>
  a.target.toLowerCase() === b.target.toLowerCase() && (a.args ?? "") === (b.args ?? "");

const fromApp = (a: AppEntry): Item => ({ key: `app:${a.targetPath}|${a.args}`, kind: "app", name: a.name, target: a.targetPath, args: a.args });
const fromPin = (p: StartPin): Item => ({ key: `pin:${p.target}|${p.args}`, kind: "app", name: p.name, target: p.target, args: p.args });

function folderOf(path: string): string {
  const parts = path.split(/[\\/]/).filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 2] : path;
}

const fromDownload = (d: Download): Item => ({
  key: `download:${d.path}`,
  kind: d.folder ? "folder" : "file",
  name: d.name,
  detail: d.folder ? timeAgo(d.modifiedMs) : `${timeAgo(d.modifiedMs)}  ·  ${sizeText(d.size)}`,
  target: d.path,
});
const fromRecent = (r: RecentFile): Item => ({ key: `recent:${r.path}`, kind: "file", name: r.name, detail: folderOf(r.path), target: r.path });
const fromFound = (f: FoundFile): Item => ({
  key: `found:${f.path}`,
  kind: f.folder ? "folder" : "file",
  name: f.name,
  detail: folderOf(f.path),
  target: f.path,
});

// ---- glyphs ----

/** The outline of a cog: `teeth` teeth, each rising from the valley circle to the tip circle. */
function gearPath(teeth = 8, valley = 7.1, tip = 9.4, cx = 12, cy = 12): string {
  const points: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const half = Math.PI / teeth; // half the width of a tooth and its gap together
    for (const [offset, r] of [[-half * 0.92, valley], [-half * 0.5, tip], [half * 0.5, tip], [half * 0.92, valley]] as const) {
      const x = cx + Math.cos(a + offset - Math.PI / 2) * r;
      const y = cy + Math.sin(a + offset - Math.PI / 2) * r;
      points.push(`${points.length === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
    }
  }
  return points.join("") + "Z";
}
const GEAR_PATH = gearPath();

function Glyph({ name }: { name: "search" | "docs" | "downloads" | "gear" | "folder" | "power" | "back" | "chevron" | "lock" | "out" | "sleep" | "restart" | "page" | "calc" | "file" }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (name) {
    case "search":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <circle cx="10.5" cy="10.5" r="6.2" />
          <path d="m15.2 15.2 5 5" />
        </svg>
      );
    case "docs":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <path d="M6.5 3.5h7l4 4v13h-11z" />
          <path d="M13.5 3.5v4h4M9 12h6M9 15.5h6" />
        </svg>
      );
    case "downloads":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" />
        </svg>
      );
    case "gear":
    case "page":
      // a cog: eight teeth round a hub (the old sun-like spokes read as a brightness icon)
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <path d={GEAR_PATH} />
          <circle cx="12" cy="12" r="3.1" />
        </svg>
      );
    case "folder":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <path d="M3.5 7.5a1.5 1.5 0 0 1 1.5-1.5h4l2 2.2h8a1.5 1.5 0 0 1 1.5 1.5v8.3a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z" />
        </svg>
      );
    case "power":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <path d="M12 3.5v8" />
          <path d="M7.2 6.6a7.2 7.2 0 1 0 9.6 0" />
        </svg>
      );
    case "back":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
        </svg>
      );
    case "chevron":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <rect x="5.5" y="10.5" width="13" height="9.5" rx="2.2" />
          <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
        </svg>
      );
    case "out":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <path d="M10 4.5H6.5a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5H10M15 8l4 4-4 4M19 12H9.5" />
        </svg>
      );
    case "sleep":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" />
        </svg>
      );
    case "restart":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <path d="M19.5 12a7.5 7.5 0 1 1-2.3-5.4" />
          <path d="M19.5 4.5v4h-4" />
        </svg>
      );
    case "calc":
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
          <path d="M8.5 8h7M9 12.5h.01M12 12.5h.01M15 12.5h.01M9 16.5h.01M12 16.5h.01M15 16.5h.01" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden {...p}>
          <path d="M6.5 3.5h7l4 4v13h-11z" />
          <path d="M13.5 3.5v4h4" />
        </svg>
      );
  }
}

/** An app's icon, or its first letter while the icon is being found. */
function AppIcon({ target, name, big }: { target: string; name: string; big?: boolean }) {
  const url = useDockIcons((s) => s.iconUrls[target]);
  return url ? (
    <img className="st-icon" data-big={big || undefined} src={url} alt="" draggable={false} />
  ) : (
    <span className="st-icon st-icon-letter" data-big={big || undefined} aria-hidden>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function ItemIcon({ item, big }: { item: Item; big?: boolean }) {
  if (item.kind === "setting") {
    return (
      <span className="st-icon st-icon-glyph">
        <Glyph name="page" />
      </span>
    );
  }
  if (item.kind === "calc") {
    return (
      <span className="st-icon st-icon-glyph">
        <Glyph name="calc" />
      </span>
    );
  }
  if (item.kind === "folder") {
    return (
      <span className="st-icon st-icon-glyph">
        <Glyph name="folder" />
      </span>
    );
  }
  return <AppIcon target={item.target} name={item.name} big={big} />;
}

interface MenuState {
  x: number;
  y: number;
  item: Item;
}

export function StartApp() {
  const { settings, hydrate } = useSettings();
  const reduced = useReduced();
  const resolveIcons = useDockIcons((s) => s.resolveIcons);
  const iconEpoch = useDockIcons((s) => s.epoch);
  const anim = animationsOf(settings).start;
  const speed = settings?.appearance.animationSpeed ?? 1;
  // the same glass as the menu bar's lens, set by the same three settings (Menu bar > the lens)
  const mb = settings?.menuBar;
  const lens = useGlideHighlight({
    items: LENS_ITEMS,
    clips: LENS_CLIPS,
    grow: mb?.lensGrow ?? 3,
    warp: mb?.lensWarp ?? 1,
    still: reduced.motion,
  });

  const [phase, setPhase] = useState<Phase>("closed");
  const [view, setView] = useState<"home" | "all" | "more">("home");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [recent, setRecent] = useState<RecentFile[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [files, setFiles] = useState<FoundFile[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [pop, setPop] = useState<"user" | "power" | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const allList = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("closed");
  phaseRef.current = phase;

  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  useEffect(() => {
    if (!settings) return;
    applyAppearance(settings, null, "dock");
    // the panel can be clearer when the real blur is behind it
    document.documentElement.dataset.realBlur = String(settings.appearance.realBlur);
  }, [settings]);

  const pins = settings?.start.pinned;

  // ---- the blur behind the panel ----
  // Windows blurs what is behind the panel in a pane of its own (see backdrop.rs). The panel
  // opens and closes by moving, so the page tells Rust where it is at every frame while it is
  // on the move, and the pane is its shape at each moment. It is only there while the panel is
  // solid enough to be worth blurring behind: a pane under a panel that is fading in or out
  // would show as a blurred rectangle with nothing in front of it.
  useEffect(() => {
    if (phase === "closed") {
      ipc.reportStartPane(0, 0, 0, 0, 0, false).catch(() => undefined);
      return;
    }
    let last = "";
    let frame = 0;
    let still = 0;
    const send = (): boolean => {
      const el = document.querySelector<HTMLElement>(".st-panel");
      if (!el) return false;
      const box = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const dpr = window.devicePixelRatio;
      // the corner as drawn: its size in the page, as large as the panel is now
      const radius = (parseFloat(style.borderTopLeftRadius) || 0) * (box.width / Math.max(1, el.offsetWidth)) * dpr;
      const shown = +style.opacity >= 0.72;
      const half = (v: number) => Math.round(v * 2) / 2;
      const key = [box.left, box.top, box.width, box.height, radius, shown].map((v) => (typeof v === "number" ? half(v) : v)).join();
      if (key === last) return false;
      last = key;
      ipc.reportStartPane(box.left * dpr, box.top * dpr, box.width * dpr, box.height * dpr, radius, shown).catch(() => undefined);
      return true;
    };
    const tick = () => {
      frame = 0;
      still = send() ? 0 : still + 1;
      if (still < 30) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  // ---- closing ----
  const close = useCallback(
    (restore: boolean) => {
      if (phaseRef.current !== "open") return;
      setPhase("closing");
      playCue("startClose");
      setMenu(null);
      setPop(null);
      lens.fade();
      window.setTimeout(
        () => {
          setPhase("closed");
          ipc.closeStart(restore).catch(() => undefined);
        },
        reduced.motion ? 0 : startExitMs(anim, speed),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduced.motion, anim, speed, lens.fade],
  );

  // ---- opening ----
  useEffect(() => {
    const un = listen<Opening>("start://open", () => {
      setQuery("");
      setSelected(0);
      setView("home");
      setMenu(null);
      setPop(null);
      setFiles([]);
      setPhase("open");
      playCue("startOpen");
      window.setTimeout(() => input.current?.focus(), 40);
      // what the lists are made of, read fresh each time (cheap, and an app may have been installed)
      ipc.listApps().then(setApps).catch(() => undefined);
      ipc.listRecentFiles(20).then(setRecent).catch(() => undefined);
      ipc.listRecentDownloads(4).then(setDownloads).catch(() => undefined);
      ipc.userProfile().then(setProfile).catch(() => undefined);
    });
    const outside = listen("start://outside", () => close(false));
    return () => {
      void un.then((fn) => fn());
      void outside.then((fn) => fn());
    };
  }, [close]);

  // the pins are started from the dock's, once
  useEffect(() => {
    if (phase !== "open" || !settings || settings.start.seeded) return;
    void useSettings.getState().apply((d) => {
      if (d.start.seeded) return;
      const fromDock: StartPin[] = d.pinned
        .filter((p: PinnedItem) => p.kind === "app" && p.path)
        .map((p: PinnedItem) => ({ name: p.name, target: p.path, args: "" }));
      const extras = [EXPLORER, SETTINGS_APP].filter((e) => !fromDock.some((f) => sameApp(f, e)));
      d.start.pinned = [...fromDock, ...extras].slice(0, 30);
      d.start.seeded = true;
    });
  }, [phase, settings]);

  // ---- what is listed ----
  const uniqueApps = useMemo(() => {
    const seen = new Set<string>();
    return apps
      .filter((a) => {
        const k = a.name.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
  }, [apps]);

  const pinned = useMemo(() => (pins ?? []).map(fromPin), [pins]);
  // Recommended, as Windows has it: what was installed lately and what was opened lately, together,
  // newest first. An app counts as new for two weeks.
  const recommendedAll = useMemo(() => {
    const now = Date.now();
    const added = uniqueApps
      .filter((a) => a.addedMs > now - 14 * 86_400_000)
      .sort((a, b) => b.addedMs - a.addedMs)
      .slice(0, 8)
      .map((a) => ({ at: a.addedMs, item: { ...fromApp(a), detail: "Recently added" } }));
    const opened = recent.map((r) => ({
      at: r.usedAt * 1000,
      item: { ...fromRecent(r), detail: `${timeAgo(r.usedAt * 1000)}  ·  ${folderOf(r.path)}` },
    }));
    return [...added, ...opened].sort((a, b) => b.at - a.at).map((x) => x.item);
  }, [uniqueApps, recent]);
  const recommended = useMemo(() => recommendedAll.slice(0, 6), [recommendedAll]);
  const downloaded = useMemo(() => downloads.slice(0, 4).map(fromDownload), [downloads])

  const q = query.trim();
  // files: asked of Windows' index a moment after typing stops
  useEffect(() => {
    if (q.length < 2) {
      setFiles([]);
      return;
    }
    let live = true;
    const timer = window.setTimeout(() => {
      ipc
        .searchFiles(q)
        .then((f) => live && setFiles(f))
        .catch(() => undefined);
    }, 220);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [q]);

  const sections = useMemo(() => {
    if (!q) return [];
    const out: { title: string; items: Item[] }[] = [];
    const sum = calculate(q);
    if (sum !== null) {
      out.push({
        title: "Calculator",
        items: [{ key: "calc", kind: "calc", name: formatResult(sum), detail: `${q} =  ·  Enter copies the answer`, target: "", value: sum }],
      });
    }
    const lower = q.toLowerCase();
    const found = uniqueApps.filter((a) => a.name.toLowerCase().includes(lower));
    // names that start with it come first
    found.sort((a, b) => Number(!a.name.toLowerCase().startsWith(lower)) - Number(!b.name.toLowerCase().startsWith(lower)));
    if (found.length) out.push({ title: "Apps", items: found.slice(0, 7).map(fromApp) });
    const pages = matchSettings(q);
    if (pages.length) {
      out.push({
        title: "Settings",
        items: pages.map((p) => ({ key: `set:${p.uri}`, kind: "setting" as const, name: p.name, detail: "Settings", target: p.uri })),
      });
    }
    const named = files.filter((f) => f.name.toLowerCase().includes(lower));
    const rest = files.filter((f) => !named.includes(f));
    const fileItems = [...named, ...rest].map(fromFound);
    if (fileItems.length) out.push({ title: "Files and folders", items: fileItems });
    return out;
  }, [q, uniqueApps, files]);
  const flat = useMemo(() => sections.flatMap((s) => s.items), [sections]);
  useEffect(() => setSelected(0), [q]);
  useEffect(() => setSelected((i) => Math.min(i, Math.max(0, flat.length - 1))), [flat.length]);

  // ---- icons ----
  useEffect(() => {
    if (phase !== "open") return;
    void resolveIcons([...pinned, ...recommended, ...downloaded].map((i) => i.target));
  }, [phase, pinned, recommended, downloaded, resolveIcons, iconEpoch]);
  useEffect(() => {
    if (phase !== "open") return;
    const wanted = flat.filter((i) => i.kind === "app" || i.kind === "file").map((i) => i.target);
    if (wanted.length) void resolveIcons(wanted);
  }, [phase, flat, resolveIcons, iconEpoch]);
  useEffect(() => {
    if (phase !== "open" || view !== "more") return;
    void resolveIcons(recommendedAll.slice(0, 30).map((i) => i.target));
  }, [phase, view, recommendedAll, resolveIcons, iconEpoch]);
  // all of the apps, a screenful at a time so the first rows are not waiting for the last
  useEffect(() => {
    if (phase !== "open" || view !== "all") return;
    let live = true;
    const targets = uniqueApps.map((a) => a.targetPath);
    (async () => {
      for (let i = 0; i < targets.length && live; i += 40) {
        await resolveIcons(targets.slice(i, i + 40));
      }
    })();
    return () => {
      live = false;
    };
  }, [phase, view, uniqueApps, resolveIcons, iconEpoch]);

  // ---- doing things ----
  const launch = useCallback(
    (item: Item) => {
      if (item.kind === "calc") {
        void navigator.clipboard?.writeText(String(item.value ?? "")).catch(() => undefined);
        return;
      }
      ipc.launch(item.target, item.args || undefined).catch(notify.on(`Could not open ${item.name}`));
      close(false);
    },
    [close],
  );

  const apply = (mutate: (s: NonNullable<typeof settings>) => void) => void useSettings.getState().apply(mutate);
  const isPinned = (item: Item) => (pins ?? []).some((p) => sameApp(p, item));
  const pin = (item: Item) =>
    apply((d) => {
      if (!d.start.pinned.some((p) => sameApp(p, item))) d.start.pinned.push({ name: item.name, target: item.target, args: item.args ?? "" });
    });
  const unpin = (item: Item) =>
    apply((d) => {
      d.start.pinned = d.start.pinned.filter((p) => !sameApp(p, item));
    });
  const toFront = (item: Item) =>
    apply((d) => {
      const at = d.start.pinned.findIndex((p) => sameApp(p, item));
      if (at > 0) d.start.pinned.unshift(...d.start.pinned.splice(at, 1));
    });

  const menuItems = (item: Item): { label: string; run: () => void; danger?: boolean }[] => {
    const out: { label: string; run: () => void }[] = [{ label: "Open", run: () => launch(item) }];
    if (item.kind === "app") {
      const at = (pins ?? []).findIndex((p) => sameApp(p, item));
      out.push(isPinned(item) ? { label: "Unpin from Start", run: () => unpin(item) } : { label: "Pin to Start", run: () => pin(item) });
      if (at > 0) out.push({ label: "Move to front", run: () => toFront(item) });
      out.push({
        label: "Pin to dock",
        run: () =>
          void ipc
            .pinItem({ id: crypto.randomUUID(), kind: "app", path: item.target, name: item.name, icon: null, children: [] })
            .catch(notify.on("Could not pin it to the dock")),
      });
      if (!/^shell:/i.test(item.target)) {
        out.push({
          label: "Run as administrator",
          run: () => {
            ipc.launchAsAdmin(item.target, item.args).catch(notify.on(`Could not run ${item.name} as administrator`));
            close(false);
          },
        });
        out.push({ label: "Open file location", run: () => void ipc.openFileLocation(item.target).catch(notify.on("Could not open its folder")) });
      }
      out.push({ label: "Uninstall", run: () => ipc.launch("ms-settings:appsfeatures").catch(notify.on("Could not open Installed apps")) });
    } else if (item.kind === "file" || item.kind === "folder") {
      out.push({ label: "Open file location", run: () => void ipc.openFileLocation(item.target).catch(notify.on("Could not open its folder")) });
      out.push({ label: "Copy path", run: () => void navigator.clipboard?.writeText(item.target).catch(() => undefined) });
    }
    return out;
  };

  const onContext = (e: React.MouseEvent, item: Item) => {
    if (item.kind === "calc" || item.kind === "setting") return;
    e.preventDefault();
    const panel = (e.currentTarget as HTMLElement).closest(".st-panel")?.getBoundingClientRect();
    const x = Math.min(e.clientX, (panel?.right ?? window.innerWidth) - 190);
    const y = Math.min(e.clientY, (panel?.bottom ?? window.innerHeight) - 230);
    setPop(null);
    setMenu({ x, y, item });
  };

  // ---- keys ----
  // on the page, not on the panel: after a click the keyboard is on nothing in particular
  const onKeyDown = (e: KeyboardEvent) => {
    if (phaseRef.current !== "open") return;
    if (e.key === "Escape") {
      e.preventDefault();
      if (menu || pop) {
        setMenu(null);
        setPop(null);
      } else if (query) {
        setQuery("");
      } else if (view !== "home") {
        setView("home");
      } else {
        close(true);
      }
      return;
    }
    if (!q) {
      // typing anywhere starts a search; the box is always there to take it
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey && document.activeElement !== input.current) input.current?.focus();
      return;
    }
    if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
      e.preventDefault();
      setSelected((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
      e.preventDefault();
      setSelected((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[selected];
      if (item) launch(item);
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });
  // the highlight rests on the result chosen with the keys, and goes when there is no list
  useEffect(() => {
    if (!q) {
      lens.fade();
      return;
    }
    const row = document.querySelector<HTMLElement>(".st-row[data-selected='true']");
    row?.scrollIntoView({ block: "nearest" });
    // after the rows have been laid out
    const frame = requestAnimationFrame(() => row && lens.goTo(row));
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, q, flat.length]);

  // ---- the lists of all apps, by letter ----
  const groups = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const a of uniqueApps) {
      const first = a.name.charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(first) ? first : "#";
      map.set(letter, [...(map.get(letter) ?? []), fromApp(a)]);
    }
    return [...map.entries()].sort(([a], [b]) => (a === "#" ? -1 : b === "#" ? 1 : a.localeCompare(b)));
  }, [uniqueApps]);
  const jump = (letter: string) => allList.current?.querySelector(`[data-letter="${letter}"]`)?.scrollIntoView({ block: "start" });

  const footerLink = (label: string, glyph: "docs" | "downloads" | "gear" | "folder", target: string) => (
    <button
      type="button"
      className="st-link"
      title={label}
      aria-label={label}
      onClick={() => {
        ipc.launch(target).catch(notify.on(`Could not open ${label}`));
        close(false);
      }}
    >
      <Glyph name={glyph} />
    </button>
  );

  const power = (kind: "lock" | "sleep" | "restart" | "shutdown" | "logoff") => {
    setPop(null);
    ipc.systemAction(kind).catch(notify.on("That did not work"));
    if (kind === "lock" || kind === "sleep") close(false);
  };

  const showRecommended = settings?.start.showRecommended ?? true;
  const initial = (profile?.name ?? "?").charAt(0).toUpperCase();

  return (
    <div className="st-root" style={{ ["--lens-scale" as string]: mb?.lensMagnify ?? 1.07 } as React.CSSProperties} data-anim={anim} data-phase={phase} data-still={reduced.motion || undefined} data-solid={reduced.transparency || undefined}>
      <GlassTips side="above" />
      <div
        ref={lens.rootRef}
        className="st-panel"
        role="dialog"
        aria-label="Start"
        {...lens.handlers}
        onMouseDown={(e) => {
          // a press that is not on a popup closes it
          if (!(e.target as HTMLElement).closest(".st-menu, .st-pop, .st-user, .st-power")) {
            setMenu(null);
            setPop(null);
          }
        }}
      >
        {lens.Highlight}
        <div className="st-search">
          <Glyph name="search" />
          <input
            ref={input}
            value={query}
            placeholder="Search for apps, settings, and documents"
            aria-label="Search"
            spellCheck={false}
            autoComplete="off"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {q ? (
          <div className="st-results" data-lens-clip role="listbox" aria-label="Search results">
            {sections.length === 0 && <div className="st-none">Nothing found for “{q}”</div>}
            {sections.map((section) => (
              <div key={section.title} className="st-section">
                <div className="st-heading">{section.title}</div>
                {section.items.map((item) => {
                  const at = flat.indexOf(item);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      role="option"
                      aria-selected={at === selected}
                      className="st-row"
                      data-selected={at === selected}
                      onMouseMove={() => setSelected(at)}
                      onClick={() => launch(item)}
                      onContextMenu={(e) => onContext(e, item)}
                    >
                      <ItemIcon item={item} />
                      <span className="st-row-text">
                        <strong>{item.name}</strong>
                        {item.detail && <small>{item.detail}</small>}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        ) : view === "home" ? (
          <>
            <div className="st-bar">
              <h2>Pinned</h2>
              <button type="button" className="st-pill" onClick={() => setView("all")}>
                All apps
                <Glyph name="chevron" />
              </button>
            </div>
            <div className="st-pinned" data-lens-clip>
              {pinned.length === 0 && <div className="st-none">Nothing pinned yet. Right-click an app in All apps to pin it.</div>}
              {pinned.map((item) => (
                <button key={item.key} type="button" className="st-tile" onClick={() => launch(item)} onContextMenu={(e) => onContext(e, item)}>
                  <ItemIcon item={item} big />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
            {showRecommended && (
              <>
                <div className="st-bar st-bar-tight">
                  <h2>Recommended</h2>
                  <button type="button" className="st-pill" onClick={() => setView("more")}>
                    More
                    <Glyph name="chevron" />
                  </button>
                </div>
                <div className="st-rec-grid">
                  {recommended.length === 0 && <div className="st-none">Apps you install and files you open will appear here.</div>}
                  {recommended.map((item) => (
                    <button key={item.key} type="button" className="st-rec" onClick={() => launch(item)} onContextMenu={(e) => onContext(e, item)}>
                      <ItemIcon item={item} />
                      <span className="st-row-text">
                        <strong>{item.name}</strong>
                        <small>{item.detail}</small>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="st-bar st-bar-tight">
                  <h2>Recently downloaded</h2>
                </div>
                <div className="st-rec-grid">
                  {downloaded.length === 0 && <div className="st-none">Nothing downloaded lately.</div>}
                  {downloaded.map((item) => (
                    <button key={item.key} type="button" className="st-rec" onClick={() => launch(item)} onContextMenu={(e) => onContext(e, item)}>
                      <ItemIcon item={item} />
                      <span className="st-row-text">
                        <strong>{item.name}</strong>
                        <small>{item.detail}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}          </>
        ) : view === "more" ? (
          <>
            <div className="st-bar">
              <button type="button" className="st-pill" onClick={() => setView("home")}>
                <Glyph name="back" />
                Back
              </button>
              <h2>Recommended</h2>
            </div>
            <div className="st-all">
              <div className="st-all-list" data-lens-clip>
                {recommendedAll.slice(0, 30).map((item) => (
                  <button key={item.key} type="button" className="st-row" onClick={() => launch(item)} onContextMenu={(e) => onContext(e, item)}>
                    <ItemIcon item={item} />
                    <span className="st-row-text">
                      <strong>{item.name}</strong>
                      <small>{item.detail}</small>
                    </span>
                  </button>
                ))}
                {recommendedAll.length === 0 && <div className="st-none">Apps you install and files you open will appear here.</div>}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="st-bar">
              <button type="button" className="st-pill" onClick={() => setView("home")}>
                <Glyph name="back" />
                Back
              </button>
              <h2>All apps</h2>
            </div>
            <div className="st-all">
              <div ref={allList} className="st-all-list" data-lens-clip>
                {groups.map(([letter, items]) => (
                  <div key={letter} data-letter={letter}>
                    <div className="st-letter">{letter}</div>
                    {items.map((item) => (
                      <button key={item.key} type="button" className="st-row" onClick={() => launch(item)} onContextMenu={(e) => onContext(e, item)}>
                        <ItemIcon item={item} />
                        <span className="st-row-text">
                          <strong>{item.name}</strong>
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <div className="st-index" aria-hidden>
                {groups.map(([letter]) => (
                  <button key={letter} type="button" tabIndex={-1} onClick={() => jump(letter)}>
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="st-footer">
          <button type="button" className="st-user" onClick={() => setPop(pop === "user" ? null : "user")} aria-haspopup="menu" aria-expanded={pop === "user"}>
            {profile?.picture ? <img src={profile.picture} alt="" draggable={false} /> : <span className="st-avatar">{initial}</span>}
            <span>{profile?.name ?? "Account"}</span>
          </button>
          <div className="st-links">
            {footerLink("Documents", "docs", "shell:Personal")}
            {footerLink("Downloads", "downloads", "shell:Downloads")}
            {footerLink("File Explorer", "folder", "C:\\Windows\\explorer.exe")}
            {footerLink("Settings", "gear", "ms-settings:")}
            <button type="button" className="st-link st-power" title="Power" aria-label="Power" aria-haspopup="menu" aria-expanded={pop === "power"} onClick={() => setPop(pop === "power" ? null : "power")}>
              <Glyph name="power" />
            </button>
          </div>
        </div>

        {pop === "user" && (
          <div className="st-pop st-pop-user" role="menu">
            <button type="button" role="menuitem" onClick={() => { ipc.launch("ms-settings:yourinfo").catch(notify.on("Could not open Settings")); close(false); }}>
              <Glyph name="gear" />
              Change account settings
            </button>
            <button type="button" role="menuitem" onClick={() => power("lock")}>
              <Glyph name="lock" />
              Lock
            </button>
            <button type="button" role="menuitem" onClick={() => power("logoff")}>
              <Glyph name="out" />
              Sign out
            </button>
          </div>
        )}
        {pop === "power" && (
          <div className="st-pop st-pop-power" role="menu">
            <button type="button" role="menuitem" onClick={() => power("sleep")}>
              <Glyph name="sleep" />
              Sleep
            </button>
            <button type="button" role="menuitem" onClick={() => power("shutdown")}>
              <Glyph name="power" />
              Shut down
            </button>
            <button type="button" role="menuitem" onClick={() => power("restart")}>
              <Glyph name="restart" />
              Restart
            </button>
          </div>
        )}

        {menu && (
          <div className="st-menu" role="menu" style={{ left: menu.x, top: menu.y }}>
            {menuItems(menu.item).map((m) => (
              <button
                key={m.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenu(null);
                  m.run();
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
