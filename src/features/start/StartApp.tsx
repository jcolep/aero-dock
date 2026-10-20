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
import { useGlass } from "../../engine/backdrop/useGlass";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReduced } from "../../engine/accessibility/policy";
import { animationsOf, startExitMs } from "../../engine/animation/presets";
import { playCue } from "../../engine/sound/ui";
import { useGlideHighlight } from "../../engine/lens/useGlideHighlight";
import { applyAppearance } from "../../engine/themes/applyTheme";
import { BackdropLayer } from "../../engine/backdrop/BackdropLayer";
import { turnBack, type Turning } from "../menubar/interrupt";
import { GlassTips } from "../../engine/tooltip/GlassTips";
import { ipc } from "../../ipc/commands";
import type { AppEntry, Download, FoundFile, PinnedItem, Profile, RecentFile, StartPin } from "../../ipc/types";
import { useDockIcons } from "../../state/dockStore";
import { useSettings } from "../../state/settingsStore";
import { veilFor, type Backdrop, type Veil } from "./readability";
import { notify } from "../feedback/toastStore";
import { calculate, formatResult } from "./calc";
import { sizeText, timeAgo } from "./format";
import { matchSettings } from "./settingsPages";
import { scoreApp } from "./searchMatch";
import { boost, reload as reloadLearned, remember } from "./learned";
import { usePinDrag } from "./usePinDrag";
import { motion, useSpring, useTransform, useVelocity } from "motion/react";
import { spring } from "../../engine/motion/tokens";
import "./start.css";

type Kind = "app" | "file" | "folder" | "setting" | "calc" | "windows";

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
  /** How light the screen behind the panel is, looked at as it opened. */
  backdrop?: Backdrop | null;
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
  if (item.kind === "windows") {
    return (
      <span className="st-icon st-icon-glyph">
        <Glyph name="search" />
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

/** Placeholders for a list that has not arrived: rows of the size of the real ones, resting softly. */
function Skeletons({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="st-rec st-skel" aria-hidden>
          <span className="st-skel-icon" />
          <span className="st-row-text">
            <span className="st-skel-line" style={{ width: `${62 + ((i * 17) % 30)}%` }} />
            <span className="st-skel-line st-skel-small" style={{ width: `${34 + ((i * 11) % 24)}%` }} />
          </span>
        </div>
      ))}
    </>
  );
}
export function StartApp() {
  const startGlass = useGlass("start");
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
  // darker tint where what is behind the panel is light (readability.ts), set as it opens and kept until it opens again
  const [veil, setVeil] = useState<Veil | null>(null);
  const [view, setView] = useState<"home" | "all" | "more">("home");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [recent, setRecent] = useState<RecentFile[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  // whether each list has been read yet: until it has, the section shows placeholders of its own size, so that nothing
  // jumps when the lists arrive
  const [loaded, setLoaded] = useState({ recent: false, downloads: false });
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

  // The frosted glass behind the panel is a picture of the desktop under it, made by Rust and laid under the panel's
  // tint by the layer inside it (see BackdropLayer); the panel's own corners shape it.

  // ---- closing ----
  // Opening, closing and opening again in a moment must go where it is asked from where the panel is, never
  // restart from its first frame: a close that comes while the panel is still arriving turns the arrival back,
  // and an open that comes while it is leaving turns the leaving back (see turnBack). Each ask is a "turn";
  // what a turn was going to do when it finished is dropped if another has come since.
  const turn = useRef(0);
  const turning = useRef<Turning | null>(null);
  const [turned, setTurned] = useState(false);
  const panelEl = () => document.querySelector<HTMLElement>(".st-panel");

  const close = useCallback(
    (restore: boolean) => {
      // told to close a menu that is not open (it was never opened here, or has gone since): the window is shown
      // all the same, and is put away rather than left for the next press to find
      if (phaseRef.current === "closed") {
        ipc.closeStart(false).catch(() => undefined);
        return;
      }
      if (phaseRef.current !== "open") return;
      const mine = ++turn.current;
      const finish = () => {
        if (turn.current !== mine) return;
        // the copies stay (holding the panel away) until it is opened again, which lets them go: letting go
        // now would show the open panel for a frame before the window is hidden
        setPhase("closed");
        ipc.closeStart(restore).catch(() => undefined);
      };
      const panel = panelEl();
      const back = !reduced.motion && panel ? turnBack(panel) : null;
      setPhase("closing");
      playCue("startClose");
      setMenu(null);
      setPop(null);
      lens.fade();
      if (back) {
        // still arriving: it goes back the way it came, and is let go of when it is there
        turning.current = back;
        setTurned(true);
        void back.done.then(finish);
      } else {
        window.setTimeout(finish, reduced.motion ? 0 : startExitMs(anim, speed));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduced.motion, anim, speed, lens.fade],
  );

  // the listeners below are set up once and ask for whatever `close` is now, so that none of them is ever taken down and put
  // up again (an event that arrives in between is lost)
  const closeRef = useRef(close);
  closeRef.current = close;

  // asked to open while it is on its way out (the shortcut pressed again, a moment after it was let go)
  useEffect(() => {
    const un = listen("start://reopen", () => {
      if (phaseRef.current !== "closing") return;
      const mine = ++turn.current;
      const panel = panelEl();
      const back = !reduced.motion && panel ? turnBack(panel) : null;
      setPhase("open");
      playCue("startOpen");
      window.setTimeout(() => input.current?.focus(), 40);
      if (back) {
        turning.current = back;
        setTurned(true);
        // back in place: the stylesheet shows the open panel itself again, and the animation it plays when it
        // opens is held off (`data-turned`) until the next time it is opened
        void back.done.then(() => {
          if (turn.current !== mine) return;
          back.release();
          turning.current = null;
        });
      } else {
        setTurned(false);
      }
    });
    return () => void un.then((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced.motion]);

  // ---- what the lists are made of ----
  const readLists = useCallback(() => {
    ipc.listApps().then(setApps).catch(() => undefined);
    ipc
      .listRecentFiles(20)
      .then(setRecent)
      .catch(() => undefined)
      .finally(() => setLoaded((l) => ({ ...l, recent: true })));
    ipc
      .listRecentDownloads(4)
      .then(setDownloads)
      .catch(() => undefined)
      .finally(() => setLoaded((l) => ({ ...l, downloads: true })));
    ipc.userProfile().then(setProfile).catch(() => undefined);
  }, []);
  // read once when the page starts, while the window is still hidden, so that the first time it opens it is already full
  useEffect(() => {
    readLists();
  }, [readLists]);

  // ---- opening ----
  useEffect(() => {
    const un = listen<Opening>("start://open", (e) => {
      // the tint that keeps the text readable over what is behind it, for this opening (and only this one)
      const s = useSettings.getState().settings?.start;
      setVeil(s?.adaptiveTint === false ? null : veilFor(e.payload.backdrop, s?.adaptiveTintStrength ?? 1));
      setQuery("");
      setSelected(0);
      setView("home");
      setMenu(null);
      setPop(null);
      setFiles([]);
      // what search has learned, read again (Settings may have cleared it)
      reloadLearned();
      // nothing lit from the last time it was open (the window was hidden under a pointer that never left it)
      lens.reset();
      turn.current += 1;
      turning.current?.release();
      turning.current = null;
      setTurned(false);
      setPhase("open");
      playCue("startOpen");
      window.setTimeout(() => input.current?.focus(), 40);
      // what the lists are made of, read again each time (cheap, and an app may have been installed); what was
      // read last time stays on show until then
      readLists();
    });
    const outside = listen("start://outside", () => closeRef.current(false));
    // listening: only now can it be opened (an event sent before this is lost)
    void Promise.all([un, outside]).then(() => ipc.startReady().catch(() => undefined));
    return () => {
      void un.then((fn) => fn());
      void outside.then((fn) => fn());
    };
  }, [readLists]);

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

  // ---- dragging pins (usePinDrag): reorder, drag out to unpin, drag in from All apps to pin ----
  const pinnedGrid = useRef<HTMLDivElement>(null);
  // where All apps was scrolled to, for a drag from it that is let go outside the grid (All apps comes back as it was)
  const allScroll = useRef(0);
  const savePins = (order: Item[]) =>
    void useSettings.getState().apply((d) => {
      d.start.pinned = order.map((i) => ({ name: i.name, target: i.target, args: i.args ?? "" }));
    });
  const pinDrag = usePinDrag<Item>({
    panel: () => document.querySelector<HTMLElement>(".st-panel"),
    grid: () => pinnedGrid.current,
    pinned,
    same: sameApp,
    still: reduced.motion,
    onBegin: (from) => {
      lens.fade();
      setMenu(null);
      setPop(null);
      if (from === "all") {
        allScroll.current = allList.current?.scrollTop ?? 0;
        setView("home");
      }
    },
    onDrop: (order) => {
      playCue("tick");
      savePins(order);
    },
    onUnpin: (item) => {
      playCue("tick");
      void useSettings.getState().apply((d) => {
        d.start.pinned = d.start.pinned.filter((p) => !sameApp(p, item));
      });
    },
    onCancel: () => {
      setView("all");
      requestAnimationFrame(() => {
        if (allList.current) allList.current.scrollTop = allScroll.current;
      });
    },
  });
  const dragging = pinDrag.drag !== null;
  const orderKey = pinDrag.order.map((i) => i.key + (i.gap ? "*" : "")).join("|");
  // the carried tile leans into the way it is going (up to 8 degrees, with its sideways speed), as something held does
  const ghostSpeed = useVelocity(pinDrag.x);
  const ghostLean = useSpring(useTransform(ghostSpeed, [-1400, 0, 1400], [-8, 0, 8], { clamp: true }), spring.quick);
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
  const searchLearn = settings?.start.searchLearn ?? true;
  const searchTypos = settings?.start.searchTypos ?? true;
  const searchWindowsRow = settings?.start.searchWindowsRow ?? true;
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
    // Apps, the way Windows' search finds them (searchMatch.ts: initials, word starts, the program's name, slips),
    // with what was opened before for these letters lifted (learned.ts); one picked before for exactly these letters
    // is offered even if they no longer match it
    const typos = searchTypos;
    const scoreOf = (s: number | null, target: string) => {
      const lift = searchLearn ? boost(q, target) : 0;
      if (s === null) return lift > 0 ? 300 + lift : null;
      return s + lift;
    };
    const found = uniqueApps
      .map((a) => ({ a, s: scoreOf(scoreApp(q, { name: a.name, target: a.targetPath }, { typos }), a.targetPath) }))
      .filter((x): x is { a: AppEntry; s: number } => x.s !== null)
      .sort((x, y) => y.s - x.s || x.a.name.localeCompare(y.a.name));
    if (found.length) out.push({ title: "Apps", items: found.slice(0, 7).map((x) => fromApp(x.a)) });
    const pages = matchSettings(q, 4, { typos })
      .map((p, i) => ({ p, s: (searchLearn ? boost(q, p.uri) : 0) - i }))
      .sort((a, b) => b.s - a.s)
      .map((x) => x.p);
    if (pages.length) {
      out.push({
        title: "Settings",
        items: pages.map((p) => ({ key: `set:${p.uri}`, kind: "setting" as const, name: p.name, detail: "Settings", target: p.uri })),
      });
    }
    // files whose names match come first, best first; the rest Windows' index found by their contents
    const named = files
      .map((f) => ({ f, s: scoreApp(q, { name: f.name, target: "" }, { typos }) }))
      .filter((x): x is { f: FoundFile; s: number } => x.s !== null)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.f);
    const rest = files.filter((f) => !named.includes(f));
    const fileItems = [...named, ...rest].map(fromFound);
    if (fileItems.length) out.push({ title: "Files and folders", items: fileItems });
    // and last, the same letters in Windows' own search, for anything this does not find
    if (searchWindowsRow) {
      out.push({
        title: "Windows",
        items: [{ key: "windows-search", kind: "windows", name: `Search Windows for “${q}”`, detail: "Opens Windows' own search with this", target: "" }],
      });
    }
    return out;
  }, [q, uniqueApps, files, searchLearn, searchTypos, searchWindowsRow]);
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
      if (item.kind === "windows") {
        // ours goes first, so that Windows' search has the keyboard to itself
        close(false);
        ipc.windowsSearch(q).catch(notify.on("Windows search did not open"));
        return;
      }
      // what was opened for these letters comes first next time
      if (q && searchLearn) remember(q, item.target);
      ipc.launch(item.target, item.args || undefined).catch(notify.on(`Could not open ${item.name}`));
      close(false);
    },
    [close, q, searchLearn],
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
  /** One place left or right among the pins (the keyboard's way to reorder; dragging is the pointer's). */
  const nudge = (item: Item, by: -1 | 1) =>
    apply((d) => {
      const at = d.start.pinned.findIndex((p) => sameApp(p, item));
      const to = at + by;
      if (at < 0 || to < 0 || to >= d.start.pinned.length) return;
      const [moved] = d.start.pinned.splice(at, 1);
      d.start.pinned.splice(to, 0, moved);
    });

  const menuItems = (item: Item): { label: string; run: () => void; danger?: boolean }[] => {
    const out: { label: string; run: () => void }[] = [{ label: "Open", run: () => launch(item) }];
    if (item.kind === "app") {
      const at = (pins ?? []).findIndex((p) => sameApp(p, item));
      out.push(isPinned(item) ? { label: "Unpin from Start", run: () => unpin(item) } : { label: "Pin to Start", run: () => pin(item) });
      if (at > 0) out.push({ label: "Move to front", run: () => toFront(item) });
      if (at > 0) out.push({ label: "Move left", run: () => nudge(item, -1) });
      if (at >= 0 && at < (pins ?? []).length - 1) out.push({ label: "Move right", run: () => nudge(item, 1) });
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
    if (item.kind === "calc" || item.kind === "setting" || item.kind === "windows") return;
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
    <div className="st-root" style={{ ["--lens-scale" as string]: mb?.lensMagnify ?? 1.07 } as React.CSSProperties} data-anim={anim} data-phase={phase} data-turned={turned || undefined} data-still={reduced.motion || undefined} data-solid={reduced.transparency || undefined}>
      <GlassTips side="above" />
      <div
        ref={lens.rootRef}
        className="st-panel"
        role="dialog"
        aria-label="Start"
        data-veiled={veil ? "" : undefined}
        style={veil ? ({ ["--st-shadow" as string]: veil.shadow.toFixed(3) } as React.CSSProperties) : undefined}
        {...lens.handlers}
        // the lens rests while something is carried (it would chase every tile passed over)
        onPointerOver={(e) => !dragging && lens.handlers.onPointerOver(e)}
        data-dragging={dragging || undefined}
        onMouseDown={(e) => {
          // a press that is not on a popup closes it
          if (!(e.target as HTMLElement).closest(".st-menu, .st-pop, .st-user, .st-power")) {
            setMenu(null);
            setPop(null);
          }
        }}
      >
        <BackdropLayer
          track="follow"
          active={startGlass.active && phase !== "closed"}
          blur={startGlass.blur}
          grain={startGlass.grain}
        />
        {veil && <span className="st-veil" aria-hidden style={{ backgroundImage: `url(${veil.image})` }} />}
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
            {sections.length === 0 && <div className="st-none">Nothing found for “{q}”. Try a shorter word, or fewer letters.</div>}
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
            <div ref={pinnedGrid} className="st-pinned" data-lens-clip data-dragging={dragging || undefined}>
              {pinDrag.order.length === 0 && !dragging && (
                <div className="st-none">Nothing pinned yet. Drag an app here from All apps, or right-click it and pin it.</div>
              )}
              {/* tiles slide to their places as a dragged one moves among them (layout); the one carried leaves a gap */}
              {pinDrag.order.map((item) => (
                <motion.button
                  key={item.key}
                  // always a layout item, measured only when the order changes: switched on at the start of a drag,
                  // the first swap had no earlier place to slide from and the neighbour jumped
                  layout="position"
                  layoutDependency={orderKey}
                  transition={spring.standard}
                  type="button"
                  className="st-tile"
                  data-gap={item.gap || undefined}
                  onPointerDown={(e) => pinDrag.press(e, item, "pinned")}
                  onClick={() => launch(item)}
                  onContextMenu={(e) => onContext(e, item)}
                >
                  <ItemIcon item={item} big />
                  <span>{item.name}</span>
                </motion.button>
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
                  {!loaded.recent && recommended.length === 0 && <Skeletons count={6} />}
                  {loaded.recent && recommended.length === 0 && (
                    <div className="st-none">Nothing here yet. Install something new or open a file, and it turns up here.</div>
                  )}
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
                  {!loaded.downloads && downloaded.length === 0 && <Skeletons count={4} />}
                  {loaded.downloads && downloaded.length === 0 && <div className="st-none">Nothing downloaded lately. A clean slate.</div>}
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
                      <button
                        key={item.key}
                        type="button"
                        className="st-row"
                        // dragged, it is carried back to Pinned to be put down among the pins (as the pin's own key)
                        onPointerDown={(e) => pinDrag.press(e, { ...item, key: `pin:${item.target}|${item.args ?? ""}` }, "all")}
                        onClick={() => launch(item)}
                        onContextMenu={(e) => onContext(e, item)}
                      >
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
          <BackdropLayer active={startGlass.active} blur={startGlass.blur} grain={startGlass.grain} tint="own" />
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
          <BackdropLayer active={startGlass.active} blur={startGlass.blur} grain={startGlass.grain} tint="own" />
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

        {/* what is being carried: a tile that follows the pointer, lifted; faded, with a minus, where letting go unpins */}
        {pinDrag.drag && (
          <motion.div
            className="st-ghost"
            aria-hidden
            data-out={(pinDrag.drag.insert === null && !pinDrag.drag.landing) || undefined}
            data-unpin={(pinDrag.drag.insert === null && pinDrag.drag.from === "pinned") || undefined}
            style={{ x: pinDrag.x, y: pinDrag.y, rotate: ghostLean, width: pinDrag.drag.width, height: pinDrag.drag.height }}
            initial={{ scale: 1 }}
            animate={
              pinDrag.drag.landing
                ? pinDrag.drag.insert === null
                  ? { scale: 0.7, opacity: 0 }
                  : { scale: 1, opacity: 1 }
                : { scale: 1.08, opacity: pinDrag.drag.insert === null ? 0.6 : 1 }
            }
            // its lift and its landing spring with a little give; fading is quick
            transition={{ default: spring.quick, scale: spring.settle }}
          >
            <ItemIcon item={pinDrag.drag.item} big />
            <span>{pinDrag.drag.item.name}</span>
            <i className="st-ghost-minus" />
          </motion.div>
        )}

        {menu && (
          <div className="st-menu" role="menu" style={{ left: menu.x, top: menu.y }}>
          <BackdropLayer active={startGlass.active} blur={startGlass.blur} grain={startGlass.grain} tint="own" />
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
