# Aero Dock architecture

> Bring beauty back to the desktop.

Aero Dock is a Windows dock built on Tauri v2. A Rust core owns all native
Windows integration; a React + Canvas 2D frontend owns the visual experience.
The two communicate over a strictly typed IPC surface.

If you're about to change something non-trivial, this is the map. Start here,
then read the module you're touching.

## Process model

```
┌──────────────────────────────────────────────────────────────┐
│ Rust core (src-tauri)                                        │
│  • Window management (transparent, undecorated, per-monitor) │
│  • Platform layer (Win32/COM), isolated in platform/windows  │
│  • Settings engine (atomic JSON in the app config dir)       │
│  • Event push → frontend (running apps, system status, …)    │
├──────────────────────── typed IPC ───────────────────────────┤
│ WebView2 frontend (src)                                      │
│  • Dock UI (React 19, spring physics via motion)             │
│  • Effects engine (Canvas 2D: ripples, bursts, scenes)       │
│  • Theme engine (design tokens as CSS custom properties)     │
│  • Settings / onboarding / search / toast surfaces           │
└──────────────────────────────────────────────────────────────┘
```

### Windows (the OS kind)

- **`dock`**: the main window. Transparent, undecorated, always-on-top,
  skip-taskbar, sized to its monitor's edge. `WS_EX_TOOLWINDOW` keeps it out
  of Alt-Tab; `WS_EX_NOACTIVATE` keeps it from stealing focus.
- **`settings`**: a normal decorated window, created on demand. Same bundle,
  routed by `?window=settings` in `src/main.tsx`.
- **Flyouts** (context menus, folders, stacks, window previews, search,
  toasts) are *not* separate OS windows. They render inside the dock window's
  canvas, which grows transparently to make room. This avoids window-spawn
  latency entirely.

## Folder structure

```
aero-dock/
├─ .github/                     issue/PR templates + CI
├─ docs/ARCHITECTURE.md         this file
├─ src/                         frontend
│  ├─ main.tsx                  entry; routes dock vs. settings window
│  ├─ app/DockApp.tsx           dock root: hydrate, drag-drop, icon resolution
│  ├─ features/
│  │  ├─ dock/                  DockBar, DockIcon, ContextMenu, flyouts, menuStore
│  │  ├─ widgets/               clock, battery, network, volume, Recycle Bin
│  │  ├─ start/                 the Start menu: pinned, all apps, search, power
│  │  ├─ mission/               Mission Control: every window as live pictures (own window)
│  │  ├─ menubar/               menu bar, Control Center, Stats and Privacy panels
│  │  ├─ search/                search overlay
│  │  ├─ settings/              settings window + Aero form controls
│  │  ├─ onboarding/            first-run welcome card
│  │  └─ feedback/              toast store + stack
│  ├─ engine/
│  │  ├─ animation/springs.ts   every spring constant in the app
│  │  ├─ animation/presets.ts   the choosable animations (Settings > Animations)
│  │  ├─ effects/               Canvas 2D engine (fx2d), the dock's layer, effect bus
│  │  └─ themes/                theme definitions + token applier
│  ├─ ipc/                      typed command bindings + event names
│  ├─ state/                    zustand stores (settings, dock, running, system, ambient)
│  └─ styles/                   tokens.css, global.css
├─ src-tauri/
│  ├─ src/
│  │  ├─ main.rs                thin entry
│  │  ├─ lib.rs                 app builder, window setup, tray, state wiring
│  │  ├─ commands/              IPC surface, one module per feature
│  │  │                         apps, dock, settings, system_cmd, windows_cmd
│  │  ├─ core/                  settings engine + unified error type; glassicon.rs bakes glass icons
│  │  └─ platform/
│  │     ├─ mod.rs              shared types + the COM apartment guard
│  │     └─ windows/            every Win32/COM call lives here
│  │        ├─ apps.rs          Start Menu/Desktop .lnk + AppsFolder (UWP)
│  │        ├─ icons.rs         IShellItemImageFactory → PNG cache
│  │        ├─ running.rs       shell-hook window, live running-app tracking
│  │        ├─ thumbnails.rs    DWM live window previews (per destination window)
│  │        ├─ genie.rs         minimise into / restore out of a dock icon: PrintWindow
│  │        │                   capture, CPU row warp, layered click-through overlay
│  │        ├─ media.rs         system media session: cover, timeline, controls, source app
│  │        ├─ downloads.rs     the newest files in the Downloads folder (Start menu)
│  │        ├─ profile.rs       who is signed in: display name and account picture
│  │        ├─ filesearch.rs    files and folders from Windows' search index (Start menu search)
│  │        ├─ system_backdrop.rs  keeps Mica/acrylic (put on by other programs) off our windows
│  │        ├─ spectrum.rs      loopback capture + FFT for the Now Playing sound wave
│  │        ├─ privacy.rs       which apps use the camera / microphone (registry)
│  │        ├─ procstats.rs     CPU / memory / network figures and top programs
│  │        ├─ recent.rs        Recent folder items
│  │        ├─ system.rs        battery, network, volume (WASAPI), Recycle Bin
│  │        ├─ wallpaper.rs     wallpaper path + dominant color extraction
│  │        ├─ monitors.rs      work areas + per-monitor DPI
│  │        ├─ dock_window.rs   toolwindow/no-activate style bits
│  │        ├─ taskbar.rs       SHAppBarMessage auto-hide, kept hidden and transparent
│  │        ├─ packaged.rs      packaged (MSIX/Store) apps: AUMID from the process or the manifest
│  │        └─ util.rs          small shared helpers
│  ├─ capabilities/default.json Tauri permission set
│  ├─ icons/                    generated app icon set
│  └─ tauri.conf.json
└─ package.json / vite.config.ts / tsconfig.json
```

## Subsystems

### 1. Platform layer (Rust, `platform/`)

All Win32 and COM lives below `platform/windows` so a macOS or Linux backend
can slot in later. **Nothing outside that directory touches the `windows`
crate.** Every COM call happens on a thread that called `CoInitializeEx`.
`ComApartment` in `platform/mod.rs` is the RAII guard for that, and blocking
work is pushed off the async pool.

Key APIs:

- **App enumeration**: walk the machine and user Start Menus and the Desktop,
  resolving `.lnk` files via `IShellLink`/`IPersistFile`. Packaged (UWP) apps
  come from `shell:AppsFolder`, with `SIGDN_PARENTRELATIVEPARSING` giving the
  AUMID.
- **Launching**: `ShellExecuteW` for normal targets. UWP apps need
  `IApplicationActivationManager`; `ShellExecuteW` silently no-ops on an AUMID.
- **Icons**: `IShellItemImageFactory::GetImage` at 256px → BGRA → a PNG file
  cache, served to the WebView through the `asset` protocol. Icons never cross
  the IPC boundary as base64.
- **Running apps**: a dedicated thread owns a `RegisterShellHookWindow`
  message loop and pushes snapshots. UWP windows are hosted by
  `ApplicationFrameHost.exe`, so their identity comes from
  `PKEY_AppUserModel_ID` via `SHGetPropertyStoreForWindow`.
- **Window previews**: `DwmRegisterThumbnail` composites live miniatures
  directly into the dock window. The OS draws these *over* our DOM, so every
  teardown path must unregister them.
- **System status**: `GetSystemPowerStatus`, `INetworkListManager`,
  `IAudioEndpointVolume`, `SHQueryRecycleBin`.

### 2. Settings engine (Rust, `core/settings.rs`)

One typed `Settings` struct, versioned by `schema_version` and forward
compatible via `#[serde(default)]` everywhere, so an older build reading a newer
file fills in defaults rather than failing. Persisted as JSON in the app config
dir with an atomic write (temp file + rename). A corrupt file is backed up to
`settings.json.bak` and replaced with defaults rather than blocking startup.

`sanitize()` clamps every numeric field into its documented range, so a
hand-edited or imported file can never push the renderer into a broken state.

Every mutation emits `settings://changed` carrying the **full struct**, so the
frontend stays a pure function of settings and can't drift from disk.

### 3. IPC surface (`commands/` ↔ `src/ipc/`)

Every Rust command has exactly one TypeScript binding in `src/ipc/commands.ts`
and a matching type in `src/ipc/types.ts`. These are kept in sync by hand and
**must change in the same commit**. `src/ipc/commands.ts` is the only file in
the frontend allowed to call `invoke` directly.

Events flow one way, Rust → frontend:

| Event | Payload |
| ----- | ------- |
| `settings://changed` | the complete `Settings` struct |
| `apps://running-changed` | `RunningSnapshot` (windows + focused hwnd) |
| `system://status` | battery, network, volume, Recycle Bin |

### 4. Theme engine (frontend, `engine/themes/`)

A theme is a typed set of design-token overrides. The applier writes them to
CSS custom properties on `:root`; **components read only tokens, never raw
colors**, which is why switching themes restyles everything at once. The effects
layer gets its tint from the same place: `ambientTint()` in `applyTheme.ts`
derives the bloom colour from the settings, so it is right on the first render.

Built-in themes: Aero (default), Ocean, Forest, Aurora, Sunset, Night. The
defaults in `tokens.css` *are* the Aero theme, so its override map is empty.
`THEMED_TOKENS` collects every token any theme touches; they're all cleared
before a theme is applied so switching back to Aero restores the stylesheet
defaults.

Wallpaper sync derives an accent from the current wallpaper's dominant hue
(extracted in Rust) and tints any theme on top.

### 5. Animation engine (frontend, `engine/animation/`)

`motion` springs drive all interactive movement: magnification, drag, bloom.
Every spring constant lives in `springs.ts` so the app's feel is tuned in one
place.

**Presets** (`presets.ts`) are the animations a user can choose between, under
Settings > Animations: how the menu bar's menus open and close, how the dock
appears, how its flyouts open, what an icon does when launched, and the feel of
the magnification. Each setting holds a preset id, validated on the Rust side
against the same list (`AnimationSettings` in `settings.rs`; a new preset is
added in both places). The motion-driven ones are plain functions that return
the initial, animate and exit targets for an edge and a speed (`panelMotion`,
`revealMotion`, `itemMotion`, `playLaunch`), which the dock's components read
through `usePanelMotion` and which the settings previews call too, so a preview
is the real animation and not a picture of it. The menu bar's are CSS keyframes
selected by a `data-anim` attribute (`menubar.css`), because that window has no
motion library of its own to carry; `menuExitMs` says how long each takes to
leave, and has to match the stylesheet, since the window holds the room a menu
needs until then. No preset blurs: a blur on something moving is redrawn every
frame, and the web views draw in software.

Ambient motion (icon float, glass sweep) is deliberately **low frame rate**.
The web views can render in software (`--disable-gpu`, which keeps the GPU process
small; it is what `tauri.conf.json` says, and it is taken out at launch when Settings > Animations > Smoothness >
Hardware acceleration is on, the default), and in software a smooth animation has a hidden cost: while one plays,
the page draws a frame at the display's refresh rate, 165 a second on a fast
monitor, each one composited and handed to the window system on the CPU. Nine
icons floating as a CSS keyframe animation cost a quarter of a core to move
under two pixels a second. So the float is a phase that `DockBar` writes 20
times a second (the stylesheet turns it into a cosine), and the glass sweep is
a `steps()` animation, which only draws when a step lands. Anything new that
moves a pixel or two a second should do the same. `prefers-reduced-motion`
disables decorative motion globally.

> **Gotcha:** `motion` writes an inline `transform`, which beats any CSS
> `transform` on the same element. Centering therefore rides on the CSS
> `translate` property instead. See `.dock-label` and `edgePanelStyle`. Put
> centering in a CSS `transform` and it will silently vanish the moment an
> animation runs.

**The frame** (`commands/frame.rs`, `features/frame/`) is a margin of glass round
the free space of every monitor, between the menu bar and the dock, that holds
maximised apps in from the screen edges with rounded corners. Four pieces:

- *Strips.* One appbar strip per edge, registered through hidden anchor windows
  (`platform/windows/anchor.rs`), as thick as the menu bar, the dock, a visible
  taskbar and the margin together. The shell fits every maximised window to
  what is left, so apps and snap layouts respect it with nothing done to them.
  While the frame is on, the menu bar and dock register nothing: `appbar::reserve`
  records a *claim* (how far in their strip reaches) and the frame covers it.
  This is deliberate. The shell stacks appbars on one edge in registration
  order, so a frame registered after the bar and dock would, on any later change
  to either, push them inside its own strip. Nothing is queried in frame mode,
  so there is no order to get wrong.
- *The ring.* A transparent window the size of the free space, kept behind
  every ordinary window and clipped by Rust to the margin (`ring_region`).
  `FrameApp` draws the glass and plays the ambient scene in four small canvases,
  one per band, so nothing is drawn where it could not be seen.
- *The shaped window.* The corners are the app's own: `platform/windows/shaper.rs`
  finds each monitor's topmost maximised window (`EnumWindows` z-order, `IsZoomed`,
  `DWMWA_EXTENDED_FRAME_BOUNDS` for its visible bounds) and gives it a window
  region (`SetWindowRgn`) that is the opening, rounded. Nothing is drawn over the
  app, so there is no border and no seam: the ring's glass shows through the cut
  corners. A WinEvent hook on location changes plus a slow timer keep it current;
  a window that stops being maximised, or the feature switching off, or quitting,
  gets its shape back (`unshape_all`). Apps run as administrator refuse the call
  and stay square. The region is checked, not trusted: it is read back
  (`region_in_place`), put again if a program removed it, and abandoned for that
  window if it keeps doing so.
- *The fringe.* A window region is stepped, so a thin window (`FrameCornersApp`,
  kept on top, clipped to a few pixels along each arc, shown only while the app on
  top is shaped) draws the margin colour with a smooth edge over the step. Hidden
  while a fullscreen app runs.
- *One shape.* Both pages draw the path from `frameGeometry.ts` and Rust clips
  each to its part of it, so they always meet. The clamping there mirrors
  `geometry` in `frame.rs`; keep them in step. GDI quirks handled in `round_rect`:
  `CreateRoundRectRgn` is a pixel short on the right and bottom, and a zero
  ellipse yields an empty region.

**Frosted glass** (`platform/windows/glass.rs`, `commands/glass.rs`, `engine/backdrop/BackdropLayer.tsx`,
`engine/backdrop/useGlass.ts`). The windows are transparent web views, so `backdrop-filter` has nothing to
sample, and **the system's own window blur is a rectangle and nothing else**: a window region, a layered
window's alpha, `DwmEnableBlurBehindWindow` with a region and acrylic all blur the whole rectangle, so a
rounded dock or panel cannot have it without a grey square at its corners. (A version that blurred a captured
picture of the screen came between; it flickered and cost about half a core, and is gone.)

So the blur is the compositor's. Each window with glass gets a **glass window** of its own: click-through,
with no picture of its own (`WS_EX_NOREDIRECTIONBITMAP`), kept exactly where its page's window is and
immediately beneath it (a subclass on the page's window follows it as it moves, shows, hides and closes).
It holds a Windows.UI.Composition visual tree: one sprite per piece of glass, painted with the host backdrop
brush (what is behind the window, blurred on the GPU) and clipped to the glass's own rounded rectangle. The
page above is transparent where the glass is, save its tint and grain. Nothing is captured or sent while
the glass stands still.

The page side is `BackdropLayer`, the first child of each glassy element. It reports the element's box,
corner radius and how much of the blur shows (the frost setting times its own and its ancestors' opacity)
with `set_glass_pane`. The bars and the Start panel *follow* it frame by frame as they move; menus,
cards, labels and tooltips *settle*: no glass while they fly in (their shapes squash and tilt), then it
fades in once they are at rest, and goes the moment they leave. Each group (dock, Start, menu bar) has
its own switch, frost and grain under Settings > Frosted glass (`appearance.frost.*`), and everything in a
group follows it. Off, or with transparency reduced, nothing is asked and no glass window is made.

CLAUDE.md ("Frosted glass (rebuilt)") has the measured traps: the compositor blurs only within the box
around everything drawn in the glass window (so each piece reaches out with two invisible specks), a glass
window must not be re-placed when it has not moved, and changes must be committed at once.
**Depth.** Grain (`--grain`, an SVG noise tile), light that follows the pointer
(`engine/light/usePointerLight.ts`, which writes `--lx` and `--ly` about 30 times
a second and only while the pointer is over the glass) and a three-layer shadow.
Each is a setting, because each costs frames in a software-rendered view.

**The lens** (`features/menubar/Lens.tsx`): one element moves between the menu
bar's buttons. It is liquid glass, not frosted: nearly clear, with a rim, and a
backdrop filter (`engine/glass/displacement.ts`, whose map stretches with the
element) that bends what is under it, which is why it sits above the buttons.
Its Its two edges are springs of different speeds, the leading one
quick, and the trailing edge is held within a fixed stretch of it so a long hop is
a blob rather than a bar. Observing a button's size starts with a report of the
size it already has; reacting to that cut short every slide, so only a real
change counts.

**The Control Center's real controls** (`commands/control.rs`, the `radios`,
`wifi`, `bluetooth` and `brightness` modules in `platform/windows/`). Wi-Fi and
Bluetooth are switched through the radio API (`Windows.Devices.Radios`), the
networks come from the WLAN service (`wlanapi`), paired devices from
`Windows.Devices.Bluetooth`, and brightness goes over DDC/CI (`dxva2`) to the
monitor the menu bar is on. Each call waits on the system, so each runs on a
worker thread and is read when the panel opens, not polled. Only a network with a
saved profile is joined from here (the profile holds the password); any other
hands over to Windows' picker. Windows has no public call to connect a Bluetooth
device, so that list is read-only. Laptop panels are not on the DDC channel and
are not reached. Tests only ever read: nothing in a test switches a radio or
sets a brightness. The calendar is a month view that opens from the clock.

**Accessibility and feel.** `AccessibilitySettings` holds reduce motion, reduce
transparency (each `system`, `on` or `off`; `system` follows Windows' switches,
read in `accessibility.rs`), the keyboard shortcuts and the sounds.
`applyAppearance` resolves them and writes `data-reduce-motion` and
`data-reduce-transparency` on the page; the stylesheets, the effects engine and
`MotionConfig` read those. Reduced transparency also stops the frosted glass
(`glass.rs`). Global shortcuts (`hotkeys.rs`: the system's own hotkey
registration, not a keyboard hook) bring real focus to the menu bar and the dock
(`keyboard.rs` makes the window activatable, focuses it and tells the page, which
gives the focus back and re-protects the window when the visit ends); real focus
is what makes keystrokes and screen readers work. Sounds (`engine/sound/ui.ts`)
are synthesised tones, no files. A menu closed mid-entrance is turned back from
where it is (`menubar/interrupt.ts`: each running CSS entrance animation is copied
into a script-owned one, set to the same moment and reversed) rather than jumping
to the exit; that is done for the menu bar's menus and panels, not yet for the
dock's flyouts.
### 6. Effects engine (frontend, `engine/effects/`)

One plain 2D canvas above the DOM dock (`fx2d.ts`), driven by a tiny event bus
so components stay decoupled from it. Effects are small classes with
`update(dt)`, `draw(ctx)` and `done()`: `ClickRipple`, `LaunchBurst`, and the
ambient scenes (dust, rain, snow, bubbles, aurora). The same engine draws the
menu bar's scene (`BarScene`), on a canvas exactly the size of the bar and
clipped to it. It replaced a WebGL layer: under software rendering that meant a
software GL implementation, a render loop that never really went idle, and a
graphics library loaded by every window.

Frame pacing is the point of the design. A ripple or burst runs a frame per
display refresh for the second or so it lives. A scene on its own runs at 24 to
30 frames a second, paced by a timer that wakes just ahead of a frame and hands
the drawing to the next animation frame. With nothing to draw, nothing is
scheduled. Scenes fade in and out rather than freezing, and rest while the dock
is slid away or asleep (and, in the bar, while the user is idle: Rust pushes
`system://idle` after 90s without input).

Coordinates are **anchored to the dock's screen edge**, not the window's
top-left, because the window grows and shrinks to host flyouts. An effect
spawned before a flyout opens must not jump when it does.

### 7. Dock feature (frontend, `features/dock/`)

The dock renders from a single `DockModel`: pinned items (from settings) merged
with running apps (from events), keyed by AUMID for packaged apps and exe path
otherwise. Magnification weights icon width by cursor distance along the dock
axis.

The window size is computed **deterministically** from icon count, size,
magnification headroom, and whether a flyout is open. There is no
`ResizeObserver` anywhere, because measuring a window that resizes in response
to the measurement is a feedback loop.

Flyout geometry is shared: `flyoutStyle()` and `edgePanelStyle()` in
`menuStore.ts` are the single source of truth for where a panel sits relative
to each of the four dock edges.

## Performance rules

Treat these as requirements. An always-on-top dock that burns CPU while you
are not using it gets uninstalled.

1. **No timers when idle.** The effects engine schedules nothing when no
   effect is alive. All ambient motion pauses after 45s without interaction
   (and while the dock is slid away) and wakes instantly on hover.
2. **Events over polling.** Running apps and focus changes are push-based via
   the shell hook, batched for 25ms and sent only if they changed. The only
   poll is a 20s battery/network/volume refresh, sent only if it changed.
3. **Icons render once.** PNG cache on disk, plain `<img>` in the DOM,
   transforms only, never layout properties.
4. **Count the frames, not just the work.** In a software-rendered web view the
   cost of an animation is mostly the number of frames the page produces, not
   what each one draws. A page with any smooth animation running produces one
   per display refresh. Use `steps()`, or write a value a few times a second,
   for anything slow, and measure with `Display::DrawAndSwap` in a trace.
5. **Effects budget.** Particle counts scale with the density setting, and
   ambient-only frames are 24 to 30fps. Everything must stay smooth on Intel
   integrated graphics.
6. **No filters on big surfaces.** A backdrop filter is paid for again each
   frame anything inside the element changes. A refracting SVG displacement
   backdrop on the settings cards cost 55ms a frame (scrolling at about 15fps);
   a plain blur of the same cards is a tenth of that. The same goes for `blur()`
   in exit animations.

History: an earlier build idled at ~84% CPU across webviews, then at ~6%. With
the Canvas 2D engine, the float and sweep reworked as above, and the settings
glass made cheap, an idle dock (hidden or asleep, menu bar showing) is about 0%
and an awake one with a scene is roughly a quarter of what it was. Keep it
there.

## Quality gates

`pnpm check` runs all four:

- `tsc --noEmit` clean
- `cargo clippy --all-targets -- -D warnings` clean
- `cargo test` green
- `vite build` succeeds

Plus: no `unwrap()` outside tests, and every command returns
`Result<_, AeroError>`.

## Implementation notes worth knowing

Hard-won details that aren't obvious from the code:

- **`open_settings` must be `async`.** Building a WebView2 inside a synchronous
  Tauri command deadlocks, because the command blocks the main thread WebView2
  creation needs.
- **React StrictMode double-fires effects.** Any first-run or one-shot IPC needs
  an idempotent, atomic transaction on the Rust side. `first_run_import` is the
  example: it only does anything on the first call through the lock.
- **`.glass` sets `position: relative`,** and Vite's HMR reorders stylesheets.
  Flyouts therefore set `position: absolute` inline rather than fighting CSS
  ordering, which is fragile under HMR.
- **Edge switching needs an explicit reposition.** Bottom → top keeps identical
  window dimensions, so the frontend's resize path never fires;
  `set_settings` always calls `position_dock`.
- **Transparency requires both** `"transparent": true` *and* an undecorated
  window in `tauri.conf.json`.
- **`TranscodedWallpaper` has no file extension,** so wallpaper color extraction
  uses `image::load_from_memory` rather than extension sniffing.
- **DWM thumbnails outlive the DOM.** They're composited by the OS over
  everything we draw, so a leaked one floats with no glass behind it. Teardown
  hides them twice, once immediately and once after a delay, to catch anything a
  straggling animation callback re-registered.

## Known limitations

- **Windows only.** The platform layer is trait-isolated and a port is a real
  possibility, but no other backend exists today.
- **UWP window grouping is imperfect.** Packaged apps are identified by AUMID
  from the frame window, which covers the common cases but not every app.
