# Liquidock: working notes

Liquidock is the owner's fork of Aero Dock, renamed in October 2026. Everything a person sees says Liquidock; the
identifier (`com.aerodock.desktop`, which names the data folder and the single-instance key), the Cargo package
(`aero-dock`), window class names (`AeroDockCorner`, `AeroDockShellHook`) and the repo stay as they were, so
existing settings and data are found.

A customised fork of [TheAgencyMGE/aero-dock](https://github.com/TheAgencyMGE/aero-dock)
(MIT, Windows 11 only): Tauri v2, Rust and React 19. A macOS-style dock, plus a menu
bar with menus and a Control Center, a Start menu, Mission Control, a frame around
the screen's opening, and frosted glass on all of it.

This file is what is **not** in the code: how to build and test, the rules the owner
has set, the traps already fallen into, and which things have and have not been seen
working. Read `docs/ARCHITECTURE.md` for how the pieces fit together.

"The owner" is the person whose fork this is (GitHub `jcolep`). Notes marked as the
owner's machine describe their setup, not a requirement: another machine's monitors,
paths and settings will differ.

## Start here

1. Install Node 20+ with pnpm, stable Rust with the Visual Studio C++ build tools, and
   the WebView2 runtime (Windows 11 has it). Then `pnpm install`.
2. `pnpm tauri dev` runs it live. Only one copy runs at a time: quit any other first.
3. Before calling a change done, run the gate (below) and the off-screen scenarios
   that touch it.

Where things live:
- `src-tauri/src/commands/`: what the pages can ask Rust for, a file per area (dock,
  menubar, start, frame, glass, media, ...).
- `src-tauri/src/platform/windows/`: the Win32 and WinRT work (windows, appbars, the
  glass, media, radios, the frame's shaper).
- `src-tauri/src/core/`: settings (a struct per group, `sanitize`, tests), paths, the trace.
- `src/features/<area>/`: a React app per window, picked by `?window=` (dock, menubar,
  start, settings, frame, mission, ...).
- `src/engine/`: what the pages share (glass in `backdrop/`, motion, sound, tooltips, type).
- `src/ipc/`: the typed command list, and the settings types that mirror Rust's.
- `scripts/offscreen/`: the off-screen test harness and its scenarios.
- `CHANGELOG.md`: what changed and why, newest first.

## Where things stand (October 2026)

- **Frosted glass** was rebuilt on Windows' compositor, the owner's latest work (see
  "Frosted glass (rebuilt)" at the end). The menu bar's and the Control Center's were
  checked live by recording the screen. The dock's works, but the owner keeps it off:
  on their 75 Hz Dell it felt laggy. To come back to.
- **Frame corners** were rebuilt natively (see "Frame corners (native)" at the end), tested live on the Dell.
- **The optimisation pass** (the owner's whole-codebase request) is under way: see
  "Optimisation pass" at the end for what was measured, changed and learned.

## Working with the owner

How they like the work done, learned over many sessions:
- **Be economical.** Test with the off-screen harness and unit tests as you go. Build the
  native app only when something native has to be seen (each build is about 3 minutes).
- **Find out before rewriting.** Do some R&D on anything tricky, and measure rather than
  guess: the last glass bugs were found by recording the screen and tracing, after two
  plausible guesses had been wrong.
- **Say plainly** what was and was not seen working, natively or off screen.
- **Keep this file and CHANGELOG.md current** in the same change.
- **Their screen, mouse and running copy are theirs.** Ask before a test that shows
  windows, moves the mouse or clicks, unless they asked you to look ("take a look and
  watch it" was such a request: record the screen, drive the click, put the cursor back).
  Swapping a new build in for their running copy is expected when a build is ready.

## Keeping this file current

It is maintained as we go. When a task teaches something that would have saved
the next session time (a trap, a decision, a rule from the owner, a change in
what is verified), add it here in the same change. Remove what stops being true.
Keep it terse: detail belongs in `docs/ARCHITECTURE.md` or a comment beside the
code. When a feature ships or is removed, update "State of the features" below.

## Git

- `main` is the project as it was at v1.3.2. The fork's work is on `custom-fork`,
  which is where to work.
- `origin` is the owner's repository (`github.com/jcolep/aero-dock`); `upstream` is the
  original. Never push to `upstream`. Push to `origin` only when asked, and do not
  open pull requests unless asked.
- Commits end with the `Co-Authored-By` line the session is told to use.
- `dist-portable/` (built exes and the owner's real `settings.json`) is
  git-ignored on purpose. Never add it.

## Build, check, ship

Needs Node with pnpm, the Rust toolchain with the Visual Studio C++ build tools,
and the WebView2 runtime. `pnpm install` first.

- Run live: `pnpm tauri dev`
- The gate, before calling anything done:
  `pnpm exec tsc --noEmit`, then in `src-tauri`: `cargo clippy --all-targets -- -D warnings`
  and `cargo test`, then `pnpm build`
- Release build: `pnpm tauri build --no-bundle` (LTO, about 3 minutes). The owner
  runs the **portable** build: copy `src-tauri/target/release/aero-dock.exe` to
  `dist-portable/Liquidock.vNN.exe` with the next version number (it was `Aero Dock.vNN.exe`
  up to v107) — that copy is always made, it is the build-output drop zone, git-ignored.
  **Where the owner then runs it from differs by machine** (see "Environment notes"): on
  the work computer that `dist-portable/` copy is also the live one; on the home computer
  the same exe is copied again to a separate, non-OneDrive location. Check which machine a
  session is on before assuming either.
- A new exe cannot start while an older copy runs (the single-instance plugin is
  keyed on the identifier), so the owner must quit from the tray first. Old
  versions they are running are locked; they delete those themselves.

## Conventions

- **Settings** follow one pattern: a Rust struct with serde `camelCase` and
  defaults, a `sanitize()` that clamps numbers and checks strings against an
  allowed list (`keep_known`), tests, a mirror in `src/ipc/types.ts`, and a card
  in `SettingsApp.tsx`. A file saved before a setting existed must still load
  (every group is `#[serde(default)]`).
- **Color** comes from the tokens (`--aero-*`, `--clear-tint`, ...), never raw
  values in components, so every theme and the picked color keep working.
- **Comments say why**, in full sentences, as the surrounding code does.
- **Performance rules.** `tauri.conf.json` launches WebView2 with `--disable-gpu` (asserted by a test), and that flag
  is taken out at start when `appearance.hardwareAcceleration` is on, which is the default (`apply_gpu_choice`, read
  from the settings file before any window exists; the setting waits for a restart, `restart_app`). The rules below were
  written for software and still save work on the GPU, but with it the cost model differs: compare with the frame
  timings table (`perf.mjs`, Settings > Animations > Smoothness) before assuming either way. In software, everything is
  composited on the CPU, and the cost of an
  animation is mostly how many frames the page produces (a 165 Hz monitor makes a
  smooth animation 165 frames a second). Prefer `steps()` or a low-rate value
  write to a smooth animation, avoid filters on large surfaces, pace ambient
  scenes at 24 to 30 fps, and aim for about 0% CPU when idle.
- **Windows.** Place windows on the main thread (`on_main_thread`). Never hold a
  lock across `SetWindowRgn` or anything that makes another thread answer.
  Commands that wait on the system (radios, WLAN, monitors) run in
  `spawn_blocking`.
- Rust tests may **read** the system (radios, networks, brightness) but must
  never change it.

## Testing

### Off-screen harness: the default for any page work

`scripts/offscreen/` serves the built `dist` to a separate headless Edge with its
own profile, mocks the Tauri backend, and drives the page with the browser's own
synthetic input. Nothing appears on the desktop, no Aero Dock process runs and no
real mouse is used.

```
pnpm build
node --experimental-websocket scripts/offscreen/menubar.mjs src-tauri/target/offscreen
node --experimental-websocket scripts/offscreen/interrupt.mjs src-tauri/target/offscreen
node --experimental-websocket scripts/offscreen/dock.mjs src-tauri/target/offscreen
node --experimental-websocket scripts/offscreen/dockglass.mjs src-tauri/target/offscreen   # satellites from outside, status buttons' glass
node --experimental-websocket scripts/offscreen/dockhide.mjs src-tauri/target/offscreen    # satellites put away, and moving with the dock
node --experimental-websocket scripts/offscreen/backdrop.mjs src-tauri/target/offscreen    # the glass under every surface: where, when, per-group switches, off means off
node --experimental-websocket scripts/offscreen/startturn.mjs src-tauri/target/offscreen    # Start turns back from where it is
node --experimental-websocket scripts/offscreen/perf.mjs src-tauri/target/offscreen         # the frame timings table
node --experimental-websocket scripts/offscreen/type.mjs src-tauri/target/offscreen         # the typeface, rolling numbers
node --experimental-websocket scripts/offscreen/crisp.mjs src-tauri/target/offscreen        # hairlines at 125%/150%, nested corners
node --experimental-websocket scripts/offscreen/sound.mjs src-tauri/target/offscreen        # every cue rendered and measured
node --experimental-websocket scripts/offscreen/insight.mjs src-tauri/target/offscreen    # privacy dots, stats
node --experimental-websocket scripts/offscreen/attention.mjs src-tauri/target/offscreen  # attention bounce
node --experimental-websocket scripts/offscreen/mission.mjs src-tauri/target/offscreen    # Mission Control
node --experimental-websocket scripts/offscreen/media.mjs src-tauri/target/offscreen      # Now Playing card
node --experimental-websocket scripts/offscreen/tips.mjs src-tauri/target/offscreen       # glass tooltips
node --experimental-websocket scripts/offscreen/start.mjs src-tauri/target/offscreen      # Start menu
node --experimental-websocket scripts/offscreen/settings.mjs src-tauri/target/offscreen   # settings: sections, sidebar, search
node --experimental-websocket scripts/offscreen/startfps.mjs src-tauri/target/offscreen   # its frame rate (a 60 Hz regression check: it cannot show a real window's)
```

(The output folder is any folder; `src-tauri/target/` is git-ignored.)

`harness.mjs` is the library (start a harness, `open`, `click`, `sweep`, `shot`,
`record` a value per animation frame, `sheet` a contact sheet); the two scripts
are examples to copy. Settings come from Rust's own defaults
(`write_default_settings`, an ignored test the harness runs). Pitfalls that cost
time: the mock must answer `resolve_icons` with an icon for every target and
`list_*` with `[]`, or the dock page freezes; every CDP call needs a timeout;
screenshot clips are page coordinates; the page is transparent, so call
`desktop()` for a realistic backdrop (a white one hides what is meant to be seen).
Ask the mock-recorded `unknownCalls()` after a run for commands it did not know.

### What needs a real desktop

Native behaviour: window regions, focus and activation, global hotkeys, the real
blur, appbar space, the taskbar, multi-monitor. The harness cannot show these.
Say plainly in a report when something native was not seen.

### Rules from the owner

- **Do not test with their real mouse or their running dock** unless they ask. They
  work on the same machine while changes are tested. Use the harness. Ask before any
  test that needs the native app, and do not start a second dock (its bar overlaps
  theirs and reserves a second strip of screen).
- **Never change real system state in a test.** A scripted drag of the Control
  Center slider once set their real volume to 100% (stubbing `invoke` from the
  outside does not intercept the app's own bundled copy). Do not drive volume,
  mute, radios, brightness, sleep, taskbar or app launching on a live instance.
  Read a value before touching anything stateful, and report any change made.
- Capturing their screen is for when they have asked you to look. Keep captures in
  the session's scratch folder, never in the repo: they show whatever they are working on.

## Design decisions and traps

- **The frame keeps appbar claims, not queries.** While the frame is on the menu
  bar and dock register no appbars (`appbar::reserve` records a claim); the shell
  stacks appbars per edge in registration order, and a later query would push the
  bar inside the frame's strip.
- **Rounded app corners are native pieces laid over them**, not anything done to the app's window: see "Frame
  corners (native)" near the end. GDI quirks for the ring's region: `CreateRoundRectRgn` is one pixel short on the
  right and bottom (ask for right+1, bottom+1) and a zero ellipse is an empty region.
- **Activating the menu bar window flashed it pale** (Windows repaints the frame
  on every `WM_NCACTIVATE`). Fixed in `dock_window::keep_caption_off` by passing
  `WM_NCACTIVATE` on with `lParam = -1`. A real click still makes the bar the
  foreground window (Chromium takes focus for its web view), so closing a menu
  hands focus back. Do not set Tauri's `set_background_color` on these windows: tao
  paints it opaque on every `WM_ERASEBKGND`.
- **Every window of ours must refuse a title bar** (`keep_caption_off`, called on the
  main thread from each placement: `position_menubar`, `position_one` for the docks,
  `layout_monitor` for the frame). Tauri puts `WS_CAPTION` back at moments of its
  own, and the dock windows are titled "Aero Dock", so a dock without the guard showed
  a strip reading "Aero Dock" with a close button mid-screen whenever a preview
  flyout made its clip tall. A new window type needs the same guard (the widgets
  overlay does not have it yet, as its clip only ever holds widgets).
- **Packaged apps** (Teams, new Outlook, Terminal) are identified by AUMID
  (`GetApplicationUserModelId`, `packaged.rs`), not by exe path, which sits in a
  versioned folder that cannot be executed.
- **The system's window blur is a rectangle only.** The windows are transparent web views (`backdrop-filter`
  has nothing to sample), and the blur Windows puts behind a window ignores a window region, a layered window's
  alpha, `DwmEnableBlurBehindWindow`'s region and acrylic's, on every screen (measured by a bench since deleted).
  Do not shape a pane with `SetWindowRgn` again: that was the grey square behind the dock and Start. A later
  version blurred a captured picture of the screen instead, which flickered and cost ~55% of a core; it is gone
  too. The glass today is the compositor's: see
  "Frosted glass (rebuilt)" at the end. **Every glass rule keeps its tint in `--bd-tint`** (global.css,
  clear.css, start.css), and content rules like `.st-panel > :not(...)` must stay off `.bd-layer`.
- **A `ResizeObserver` reports once on `observe()`**: reacting to that first report
  as if it were a change restarted the lens mid-slide. Compare sizes.
- **Closures made once keep their first value**: the elastic slider's resize
  handler kept the volume it was mounted with (0) and reset the knob. Read through a
  ref.
- **Menu bar menus close on pointer-leave** (setting, default on), after 320 ms so
  crossing the gap to the panel does not close it; not during a keyboard visit.
- **Privacy dots** (`privacy.rs`) read the registry's `CapabilityAccessManager\ConsentStore`
  (an app is using a sensor while its `LastUsedTimeStop` is 0), polled every 2 s by
  `insight.rs`, which emits `privacy://changed` only on a change. **Stats**
  (`procstats.rs`) group processes by exe and use CPU deltas kept in a static, so the
  first sample reads 0.
- **Attention bounce**: `HSHELL_FLASH` (0x8006) from the shell hook becomes
  `apps://attention`; `runningStore` holds the set and clears it when the app is
  focused. The dock icon hops and shows a dot (`dock.attentionBounce`).
- **Mission Control** (Ctrl+Alt+W, or Aero menu) is a window of its own (`mission.rs`,
  label `mission`, built hidden on first use) that takes the keyboard. The live
  pictures are DWM thumbnails (`thumbnails.rs`, one set per destination window, so
  the dock flyouts and this overview do not clear each other). The grid is
  `features/mission/layout.ts`; a picture is never drawn bigger than its window.
- **Genie minimise** (`genie.rs`): the window is photographed with `PrintWindow`
  (`PW_RENDERFULLCONTENT`), a click-through layered overlay plays a CPU row warp
  (`render`, pure and unit-tested) while the real window is minimised underneath with
  DWM transitions disabled for it. Only dock-icon clicks use it (the page sends the
  icon's rect with `toggle_window`); every other minimise is plain. Restore needs the
  picture kept from when it went in (6 kept); without one it restores plainly. One
  effect at a time (`BUSY`); any failure falls back to the plain call. Off for
  reduced motion or `dock.minimizeEffect = "off"`. An icon above the window's middle
  gets the plain shrink, not the pour.
- **Now Playing** (`media.rs`, `MediaCard.tsx`): everything comes from the system media session
  (SMTC). Cover = the session's thumbnail (a browser hands over the video thumbnail; a
  YouTube *channel* icon is not in the session and cannot be had), re-encoded to 360 px JPEG
  and fetched once per track by a separate command, not in the 2 s poll. Position is
  extrapolated from the report time (`position_now`) and ticked locally in the page. The
  card tints from the cover (`tint.ts`; the backdrop is a 5 px copy stretched, because a
  real blur on that surface is slow in software rendering). `seek`/skip-10s need the player
  to enable position (Apple Music does not: the buttons dim). The session is matched to a
  running window by app id (`source_matches`) and, for browsers, by the tab title containing
  the track title; "Live view" draws that window with a DWM thumbnail (the whole window, not
  just the video). WinRT futures are not `Send`: media commands run through `on_own_thread`.
- **Sound wave** (`spectrum.rs`): a WASAPI loopback capture of the default output (no
  permission, not the microphone), FFT into 24 bands, `media://spectrum` at ~30 Hz to the menu
  bar window only. It runs while the card calls `media_spectrum(true)` every ~1.2 s and stops
  3.5 s after the calls stop. It hears everything playing, not one program.
- **Tooltips are ours** (`engine/tooltip/GlassTips.tsx`, one per window): it takes the `title`
  off whatever the pointer rests on (so the browser draws none), shows a glass pill, and gives
  the title back on leaving; `data-tip` is the same without a title. Windows are clipped to
  what is in use, so the menu bar passes `onRoom` and asks Rust for the height under the bar
  while a tip shows; the dock puts tips on the side facing into the screen (as its labels do).
  New `title=` attributes need nothing. Do not add a native-tooltip workaround.
- **Mica For Everyone** (and tools like it) put a system backdrop on every window that has
  `WS_CAPTION`, which showed through our see-through windows as grey squares. It is not
  fixable by styling: `system_backdrop.rs` looks at all our top-level windows every 150 ms
  (2.5 s if it has never been needed) and sets any Mica/acrylic back to none and resets the
  frame margins, because that program puts it back every few seconds. A plain `WS_POPUP`
  is not touched by it; Tauri restores `WS_CAPTION` at moments of its own (see
  `keep_caption_off`). Checked with the real Mica For Everyone 2.0.6 using an off-screen test
  window (`does_mica_for_everyone_fight_back`, ignored); not yet checked on the real bars.
- **The Start menu** (`commands/start.rs`, `features/start/`) replaced the dock's spotlight search
  (deleted; the dock's search button and the menu bar's both call `toggle_start`). It is a window
  only as big as the panel plus a 30 px shadow margin (`MARGIN`), centred on the work area and
  resting above the docks' bars (`glass::dock_bar_rects`), built hidden and kept like Mission
  Control, takes the keyboard, and has glass like the other windows. It is closed
  by a 25 ms poll of the mouse buttons while open (`watch`), **not** a hook: `outside_click` is a
  single shared instance owned by the menu bar and cannot serve two. Pins are our own list
  (`settings.start`; Windows' real layout is an unreadable file), started from the dock's pins
  once. Files come from Windows' index (`filesearch.rs`, WinRT `QueryOptions`), the account
  from the registry (`profile.rs`). Shortcuts: Ctrl+Alt+Space and Ctrl+Esc, and **the Windows key when
  `start.windowsKey` is on** (off by default; `platform/windows/winkey.rs`). That is the AutoHotkey / PowerToys
  way, chosen after researching the options (October 19): a `WH_KEYBOARD_LL` hook, installed only while the
  setting is on, lets the key's press through, and on a lone release returns 1 and `SendInput`s 0xFF down/up
  plus the release (tagged `dwExtraInfo` "LQDK", which the hook passes), so Windows sees Win+<key> and opens
  nothing; if `SendInput` fails, the real release goes through (never a stuck key). Ctrl+Win (no Start for
  Windows) sends a tagged LWin tap once Ctrl is up, which opens Windows' menu. The decision is `Tracker`, plain
  code with tests. **Not** Open-Shell's way (it IAT-hooks twinui's `RegisterHotKey(MOD_WIN, 0)` inside Explorer):
  code in Explorer is not for a work machine. Elevated foreground: the hook isn't shown those keys (UIPI), so
  Windows' menu opens there. **The hook needs `.device_event_filter(DeviceEventFilter::Always)` on the Builder**
  (lib.rs): with tao's default it got no keys at all while our own WebView2 window had the keyboard (tauri-apps/wry
  #1761), so a press with our Start open (or just hidden but still foreground) opened Windows' menu, which then took
  the keyboard and our watch closed ours. Found natively: `trace.on` logs every Win event, its verdict, the send
  and the foreground (`winkey:` lines), and `start: shown/closing`; Win taps sent by a script (untagged) go through
  the hook like real ones. Checked October 19 on both monitors: open/close/open/close, Windows' menu never up.
- **Gliding highlight** (`engine/lens/useGlideHighlight.tsx`): the menu bar lens made general (four
  edge springs, the leading edges quick, stretch capped, shaped like what it sits on, held inside
  `data-lens-clip` lists) **and drawn like it**: *above* the items with a refraction backdrop filter
  (`engine/lens/refraction.ts`, the same recipe as `Lens.tsx`), the item under it enlarged by
  `--lens-scale`. It takes `menuBar.lensGrow/lensMagnify/lensWarp`, so one set of sliders sets both
  lenses. The Start menu uses it for every hover and for the key-selected search result; its own
  `:hover` backgrounds are gone on purpose.
- **The backdrop layer follows what is drawn, not what layout says** (`BackdropLayer.tsx`). A glass moves by a
  transform (the dock bar slides, the Start panel pours in by a CSS animation) while layout does not, so it is
  measured with `getBoundingClientRect()` against `offsetWidth` (which gives the scale).
- **Search and Settings (the dock's satellites) hang on `.dock-satellites`**, a layer the size of the bar that
  takes the bar's reveal motion, so a button still out when the dock auto-hides slides away with it. They bud
  out of the room beside the bar too (`handleOutside` on the viewport), and are put away when the pointer
  leaves the window or moves off about the room (before, a button budded from outside stayed). The dock
  window's mouse-leave does not fire in the harness for a pointer that merely moves away; `dockhide.mjs`
  dispatches `mouseout`/`mouseover` itself.
- **One motion language, one light** (the "premium" pass). Motion: `engine/motion/tokens.ts` has the four springs
  (`quick`, `standard`, `settle`, `heavy`), the durations and curves, and the characters a person picks (pop, jelly,
  bounce); `styles/tokens.css` has the same as `--m-*` (durations, divided by the animation speed, so transitions follow
  the speed slider too) and `--e-*` (curves). A new thing uses these and does not invent a fifth; every CSS
  `transition:` is on them (a one-off script did the existing 50: overshoot curves are `--e-overshoot`). Everything must
  be interruptible: springs and transitions are by themselves; a keyframe animation is turned back with
  `turnBack`/`reverseEntrance` (`menubar/interrupt.ts`), which is what the Start menu does (`startturn.mjs`; Rust says
  `start://reopen` when a press comes more than 350 ms after it was told to close, and ignores one that comes with the
  click that closed it). Light: `tokens.css` has `--rim` (the one rim: bright upper left, fainter lower right, a hairline
  all round) and four heights `--elev-1..4` (bar/card, panel, popover, tooltip); every surface's box-shadow is those
  plus its own glow, and the dock bar's copies are in `dockshadow.css`. Change the light there, nowhere else.
- **Frame timings** (`commands/perf.rs`, `engine/perf/useFrameMeter.ts`, `features/perf`): with
  `appearance.frameOverlay` on, every window times its animation frames and says how they went twice a second; a window
  of its own (`perf`, click-through, top left of the main screen) lists them with each screen's refresh rate. It keeps
  every window drawing at its screen's rate, so it is a diagnostic, off by default; "Save a report" writes
  `frame-report.txt`. Grading is the slowest 5% against one frame of the window's own screen.
- **Type, numbers, edges, sound** (the "premium" pass, second half). Type: SF Pro where installed (see `--font-*`
  near the end), else Inter, a bundled variable font (latin subset, `@fontsource-variable/inter`, OFL)
  (`global.css`); anything that changes uses tabular figures, and
  a changing number is `<Roll text="42%" />` (`engine/type/Roll.tsx`: only the digits that changed move, 9 to 0 keeps
  going up, only transforms run). Edges: `--hair` is one device pixel at any scale (`trackScale` writes `--dpr`), the
  rim is built from it, and a nested shape's radius is its container's less its padding (`--r`/`--pad`, e.g. the
  menu bar's panel and cards, the context menu, the folder flyout; `crisp.mjs` checks both). Pressed and focus-visible
  states are global (`global.css`, low specificity). Sound (`engine/sound/ui.ts`): one key, E (pentatonic: E F# G# B C#),
  a menu is E4-E5, a switch an octave above, the tick near E6; a voice of three partials with a natural decay; a short
  room (convolver) and a compressor under everything; everything halves while the media session is playing
  (`DUCK`). `renderCue` takes any audio context, so `sound.mjs` renders every cue offline, checks key, level, tail and
  ducking, and writes WAV files to `<out>/sounds` for listening. A new cue must have every note in `inKey`.
- **First frames, errors, empty states, night settings** (same pass). A page is clear until its typeface is
  in (`data-ready`, `main.tsx`), a hidden window is ready before it is shown, Start reads its lists when the page starts
  and shows placeholders of the right size until they arrive (`Skeletons`), and the settings window is night glass
  (`data-surface="clear"`, set in `main.tsx`) from the first frame. An error reaches a person through `humane()`
  (`engine/errors`, tested by `errors.mjs`), never as Windows or Rust said it. The settings window's "Classic sky" look
  and its own material setting are gone (old files drop `settingsLook`/`settingsSurface` on load), as is the glossy
  `aero` dock material (`SurfaceStyle` is `liquid | clear`; serde alias maps an old `"aero"` to Liquid).
- **Sounds need no click**: `--autoplay-policy=no-user-gesture-required` is in the shared browser args, or a
  page that has not been clicked (the Start menu, opened from the dock) plays its cues silently.
- **The settings window** is laid out like macOS System Settings: a glass sidebar (`SettingsNav`: brand, search,
  sections with `SectionIcon` tiles) and ONE section shown at a time (`useSettingsUi.active`, remembered in
  localStorage `liquidock.settings.pane`); a search shows every matching section stacked under its title.
  `sections.ts` is the registry (id, title, blurb, keywords, icon hue, group). A new section is a
  `<SettingsSection id="...">` **and an entry in `sections.ts`** (and a glyph in `SectionIcon`). A new setting
  should add its name to that section's `keywords`. Rows are grouped by CSS alone: a run of direct-child
  `.ctl-row`/`.bubble-color`/`.audio-row`/`.mode-icon-field` in `.settings-section-inner` is one rounded group
  with inset hairlines; a `<SettingsSub>` or a `.settings-note` breaks the run (a note after a group reads as its
  footer). Controls take a `hint` (two clamped lines under the label, whole text on hover) and say their kind
  (`ctl-row-slider/-toggle/-seg`) so rows wrap their control under the label when there is no room
  (`@container pane`). Below 760 px, or with General › This window › Sidebar = "Slides in at the edge"
  (`liquidock.settings.sidebar`), the sidebar is an overlay: out on the 10 px left-edge strip (goes on leaving it
  or moving over the page), or by the header button (goes on choosing or clicking the page). Status messages are a
  toast at the foot of the page. `settings.mjs` checks every section at 1280/900/620/340 px for sideways spill.
  The reorganisation in 132d62e had silently dropped the dock's auto-hide/floating/magnification/running-apps/
  spacing/padding/attention switches; they are back.
- **A CSS animation with only a `to` keyframe starts from the element's own value.** The Start menu's
  closing keyframes did, and the panel's own opacity at that moment was 0, so it vanished and the
  animation played on nothing (found only after a first "fix" that hid the window correctly but
  changed nothing the owner could see). Give exit keyframes a `from`, and check opacity partway
  through in the harness, not just the animation's name.
- **`reverseEntrance` (`menubar/interrupt.ts`) must only take finite, short animations.** An infinite one
  (the Now Playing title's marquee) was copied and played backwards from far past its end, so closing
  the Control Center took seconds and showed no exit.
- **Tooltips: a title stays off its element for as long as the pointer is on it**, not only while a tip
  shows; giving it back early let the browser draw its own plain tip (and a title set again by React,
  as on Play / Pause, is taken off again by a MutationObserver).
- **Closing the Start menu**: the page plays the closing animation and only then asks Rust to hide the
  window, so **nothing in Rust may hide it directly**: `toggle` while open emits `start://outside` (the
  page closes itself) and `CLOSING` makes a second ask harmless. The first version hid the window at
  once when the dock's search button was pressed to dismiss it, which looked like no animation at all.
  The panel has no `backdrop-filter` (nothing is behind it in the page; the real blur is the Rust pane)
  and is put on its own layer while showing (`will-change`).
- **Glass icons** (`core/glassicon.rs`): `appearance.iconStyle` plain | glass | clear | tinted. When an icon
  is resolved (`resolve_icons(targets, style, tint)`) a copy in that look is baked from the cached plain
  PNG and kept beside it (`<key>.glass-b1.png`, `tinted-rrggbb` for the color), so showing it costs
  nothing. It follows the icon's own alpha (rim light from the upper left, sheen, no tile) and never
  makes a pixel more opaque. A change of look or theme color calls `useDockIcons.reset()` (see `main.tsx`);
  anything that shows icons from an effect must list `epoch` in its deps. Bump `VERSION` when the pixels
  change. `bake_a_sheet_of_real_icons` (ignored) bakes this machine's icons onto a sheet to look at.
- **Start animations** are a setting (`animations.start`: rise, bloom, genie, slide, fade, none) that
  sets `--st-in` / `--st-out` on the root by `data-anim`; the page waits `startExitMs` before it
  asks Rust to hide the window. The shadow must fade out inside the window's 48 px margin, or it is
  cut off and shows as a pale band down each side.
- **Deleting a stylesheet: check what else it styled.** `search.css` also held `.dock-control-btn`
  (the dock's round search and settings buttons), and removing it left them as slivers. The
  rules now live in `dock.css`.
- **Capabilities** (`capabilities/default.json`) list windows by label; a window not listed has no
  `core:event` permission, so its `listen` fails silently. Every window that listens must be there
  (`mission`, `start`, `widgets` and the frame windows were missing until the Start menu work).
- **Keyboard access** is by global hotkey (Ctrl+Alt+M menu bar, Ctrl+Alt+D dock,
  Ctrl+Alt+W Mission Control, Ctrl+Alt+Space and Ctrl+Esc the Start menu;
  `hotkeys.rs`, the system's hotkey registration, not a hook). The bars are built
  never to take the keyboard, so `keyboard.rs` makes the window activatable for the
  visit and `set_dock_focusable(false)` restores it. Real focus is what lets
  keystrokes and screen readers work.
- **The dock's Search/Settings satellites (`DockSatellite.tsx`) are an open question, not a finished design.**
  Their old bespoke three-phase squash-and-stretch entrance was quietly a fifth motion invented outside the four
  named springs the rest of the app holds to (`engine/motion/tokens.ts` says as much in its own header); it is now
  `springs.bloom`, the same settle spring every other flyout uses. That fixes the motion-language violation, but the
  owner is not sold on the reveal-on-approach mechanic itself (how close the pointer must get is `dock.revealZone`,
  a setting now, default 40px, not the old fixed 80). **The right-hand (Settings) zone used to ignore this setting
  entirely**: `handleMove`/`handleOutside` special-cased the clock/status cluster's own left edge as the trigger line
  whenever the cluster was shown, so the button budded out the moment the pointer reached the cluster — right after
  crossing the running apps — well short of the bar's actual edge, no matter what the slider said. Both handlers now
  measure from `bar.right - revealZone` uniformly, same as the left zone already did. Options discussed and not yet
  chosen between: drop the reveal
  entirely (`revealControls: false` already does this, zero new code), ghost the buttons in place and have the
  existing `appearance.hoverEffect` system (magnify/lift/glow) light them up instead of budding from nothing, or
  have them glide out of the bar's edge the way the menu bar's lens glides between buttons
  (`engine/lens/useGlideHighlight`). Don't treat the current shape as settled; ask before polishing it further.
- **Dock icon gestures:** click launches or focuses, scroll changes that app's volume,
  **middle-click closes the app** (asks each of the icon's windows to close, as its close
  button would, so an app with unsaved work still asks; nothing for a pin that is not
  running). Muting an app is in the icon's right-click menu: middle-click used to mute, and
  the README, the settings hint and the changelog were changed with it. With a dock on
  each monitor and per-monitor windows on, an icon only lists (and so only closes) its own
  screen's windows.
- **Wired vs wireless** icon: `system.rs::read_link` asks `GetAdaptersAddresses`,
  keeps adapters that are up and have a gateway, takes the lowest metric, and skips
  virtual adapters by name.

## State of the features

Seen working in the off-screen harness (pictures or numbers), **not** yet seen
natively by anyone unless noted: menu bar and lens, Control Center layout, Wi-Fi
and Bluetooth lists, calendar, reduced motion and transparency, sounds, menu
reversal when interrupted, the status icons, the frame's look.

Read from the real machine and known to work: Wi-Fi and Bluetooth radio state,
Wi-Fi networks in range, DDC brightness reads on external monitors.

In daily use by the owner, on two monitors (so seen natively, if not every detail
measured): the dock, the menu bar and its menus, the Control Center with its Now Playing card
while something plays, the Start menu opening from the dock, the frame and its corners on
both monitors (corners checked pixel by pixel on the primary), the media pill, middle-click
End Task. The compositor glass under the menu bar and the Control Center was recorded on
screen and is steady; the dock's glass was seen working but is off on the owner's machine.

**Never exercised natively** (needs the owner to try, or a native test they have
agreed to): the Start menu's finer points (focus, closing on a click elsewhere, Ctrl+Esc being
taken from Windows), the sound wave with real audio, the live view of a real window, seeking in
a player that allows it, the genie minimise and restore (capture, overlay, timing, windows that
refuse `PrintWindow`), Mission Control (the hotkey taking focus, live thumbnails in
the overlay), the flash notice reaching the dock, the privacy registry reads with a
real app on the microphone or camera, switching a radio, setting a brightness, joining a network, the global
hotkeys taking focus, Narrator reading the bars, a visible taskbar.

## Deliberately not done, or removed

- **Plates behind dock icons** ("uniform icons") were built and removed: the owner
  does not want app icons encapsulated. Do not bring back any tile behind an icon.
- Taskbar **progress bars and badges** on dock icons: Windows has no public API for
  another app's progress or overlay; the only route is scraping the real taskbar
  with UI Automation, which is fragile.
- An **update flow**: needs a release feed; this fork has none yet.
- Interruptible **dock flyouts** (only menu bar menus reverse mid-entrance).
- **Laptop panel brightness** (WMI; only DDC/CI is done) and connecting Bluetooth
  devices from the list (no public API).
- A hole cut in the app window behind the dock was built and removed: the owner
  preferred it without.

## Environment notes (the owner's machines)

The owner works across two machines, both on the `custom-fork` branch of the same OneDrive-synced
repo (`...\OneDrive\Documents\Dev\aero-dock`), so code and commits move between them by pulling.
**Where the live, running app lives is different on each one** — check which machine a session is
on (ask, or look for the monitors below) before touching either.

- **Work computer.** The repo is at `C:\Users\JakePascoe\source\repos\Aero Dock\data\aero-dock`
  (confirmed by the owner, 19 October 2026: not under `...\OneDrive\Documents\Dev\`, and there is no
  `%LOCALAPPDATA%\Liquidock\` here). Keep the repo and its build output where they are; that is a
  constraint of that machine, not a preference. `dist-portable/` is both the build-output drop zone
  and where the owner runs it (`dist-portable\Liquidock.vNN.exe`, data in `dist-portable\data`, which
  is the real, live data here), exactly as "Build, check, ship" describes by default: swap a new build
  in by stopping the running `Liquidock.v*` and starting the new exe from `dist-portable`. Tell this
  machine from the home one by that path; ask the owner about anything else rather than assume the
  home-machine notes below apply.
- **Home computer.** Two monitors: a Dell, the primary (`DISPLAY2`, 1920x1080 at 100%, 75 Hz over
  a DVI-type link, IPS), and a Samsung to its right (`DISPLAY1`, 2560x1440, 165 Hz, DisplayPort,
  VA). The glass looks best on the Samsung; the Dell shows its limits (lower contrast, coarse grain).
  No admin rights, which rules out the NSIS installer (`installMode: currentUser` still prompts for
  elevation on a locked-down account) — portable is the only shape that works here. **The live copy
  runs from `%LOCALAPPDATA%\Liquidock\`, not from `dist-portable/`** (moved there 16 October 2026):
  the repo itself stays in OneDrive (so it keeps syncing with the work machine), but there is no
  work-computer-style reason the *live install* needs to be there too, and the portable `data\webview`
  folder is a live WebView2 profile (cache, cookies, IndexedDB, SQLite WAL files, written continuously
  while the dock runs) — syncing that from inside OneDrive caused real I/O overhead and file-lock
  risk. `dist-portable/` is still where a release build is dropped first (see "Build, check, ship");
  after copying the exe there, also copy it to `%LOCALAPPDATA%\Liquidock\` (as `Liquidock.vNN.exe`,
  replacing the previous version) — that is what actually runs. The owner's real `settings.json` on
  this machine is `%LOCALAPPDATA%\Liquidock\data\settings.json`; the off-screen harness should load
  that file to reproduce exactly what they see here. The old `dist-portable/data/` from before the
  16 October move was left in place as a one-time backup, not kept in sync — don't read it for "what
  the owner sees" by mistake, and don't assume a `dist-portable/data/` on another machine means the
  same thing (on the work machine it is the real, live data).
- **This machine's Rust toolchain is newer than the one the code was last cleared on**:
  `cargo clippy --all-targets -- -D warnings` fails here on `genie.rs` alone
  (`chunks_exact_to_as_chunks`, a lint new enough to not exist, or not fire, on whatever
  toolchain the work machine last ran clippy with). `cargo build`/`cargo test` are
  unaffected (clippy lints don't block them) — 262 tests pass, including genie's. Not yet
  fixed; genie.rs's pixel-buffer code is exactly the kind of thing to actually understand
  before changing rather than mechanically satisfying a lint.
- **Do not run `cargo fmt`**: the crate is not rustfmt-formatted (its lines are longer), so it
  rewrites some 60 files. Match the surrounding style by hand.
- Windows PowerShell 5.1 is the shell. In a double-quoted string a backtick escapes the next
  letter, so a `` `room` `` or `` `to` `` in text written from one becomes a carriage return or a
  tab (both broke a build), and `"\n"` is a literal backslash-n. `Get-Content -Raw` then `Set-Content` corrupts
  non-ASCII text (the "…" in menu labels became "â€¦"); edit with the editor tools
  or `[IO.File]::ReadAllText/WriteAllText` with `UTF8Encoding($false)`.
- Use single-quoted here-strings or the edit tool for any text that contains backticks.
- The shell may refuse `Remove-Item` on some paths and `rmdir /s`; use
  `Remove-Item -LiteralPath` from outside the target, or `[IO.File]::Delete`.
- Running binaries from `%TEMP%` can be blocked: keep build targets in the project.
  Long `Start-Sleep` may be blocked by the harness running the session.
- Node 20 needs `--experimental-websocket` for the harness.

## Idle cost of the ambient scenes
- Strip scenes (menu bar, and the four frame strips per monitor) draw through `Fx2D.setFrameFloor(1000/12)`: each frame there is a whole screen-wide window handed to Windows, so the cost is per frame, not per mote. Measured idle (sandbox copy, 20 s of process-tree CPU): 55% of a core at 24-30 fps, 25% at 12 fps; scene "none" is ~4%, frame off ~8.5%. The strips are the remaining ~17%; lowering the floor further trades smoothness for CPU.

## Launch races (menu bar, Start)
- The menu bar window is **pinned** (`dock_window::pin`, enforced in the `keep_caption_off` subclass on `WM_WINDOWPOSCHANGING`): when the frame takes over its appbar strip, the shell moves the window into the work area (to the frame opening, (10, 44)), which put the bar below its strip at about half of launches. `set_bounds` updates the pin; anything else that asks the window to move is turned back (traced as "pinned window ... refused").
- Start: an event sent before its page has registered listeners is lost, and the window stayed visible but empty so the next press "closed" it. The page now calls `start_ready` once its listeners are up, Rust waits for that (up to 8 s) before showing, builds the window 4 s after launch (`prebuild`), and the page's listeners are registered once (they call `closeRef`) so none is ever torn down and re-registered. A close told to a page that is closed puts the window away.
- Repro/diagnosis: `AERO_TRACE=1` writes `trace.log` beside the settings; poll the bar's rect during launch.

## Magnification, media pill, glass border, clock seconds
- Dock magnification: `DockIcon` springs the icon's *room* (`width`, from a cosine bell over `dock.magnificationReach` icon widths and `magnificationScale`) and draws the icon in `.dock-icon-mag` at `width / iconSize` scale from the screen-edge side, plus `magnificationLift` of the icon size as it peaks. `--mag-rise` pushes the name tooltip clear. The window's headroom (`band`, `dockBandSize`) includes the lift. Scenario: `magnify.mjs`.
- Media pill: `features/menubar/MediaIsland.tsx` + `island.css`; hover zone in the middle of the bar (intent 110 ms, linger 480 ms), spring shell + blur-in body, `menuBar.mediaIsland` / `mediaIslandPinned`. Only mounted (and only polling `widgetNowPlaying`) when on; art fetched only while out. Scenario: `island.mjs`.
- Glass border: `frame.glassBorder` / `borderWidth`; a bevel band drawn by `FrameApp` just outside the opening (the ring window is clipped to the margin, so nothing can draw inside the opening). Scenario: `frame.mjs`.
- Clock seconds: `BarClock` owns `useClock(everySecond)`; do not call it from `MenuBarApp` (it would redraw the bar every second).
- `scripts/dupes.mjs` lists controls written twice in the settings window (eight copies of one toggle had crept in with the settings reorganisation).
- PowerShell edit scripts: a single-quoted string cannot contain an apostrophe (write `''` or reword), and `WriteAllLines` turns LF files into CRLF.

## WebView2 profile, End Task, glyph looks, island motion, shaper timing
- **Never put `WEBVIEW2_USER_DATA_FOLDER` (or any WEBVIEW2_*) in the process environment**: every app launched from the dock/Start inherits it, and WebView2 apps (DriveWorks Administrator) crash on init. The portable profile is `data_directory` on every window: config windows via `apply_profile`, built windows via `webview_dir()` at each `WebviewWindowBuilder` (a test, `every_window_builder_names_the_profile_folder`, checks every site). Event log source of the diagnosis: Application log, event 1026, `WebView2_CoreWebViewInitialized`.
- End Task: `platform/windows/endtask.rs` (`end_task` command); shell/session processes are protected (their windows are asked to close), a Store app is ended through the process inside its frame, never the frame host. `dock.middleClick` = `endTask` | `close`.
- The dock's symbols: `GlyphFilters.tsx` (SVG filters, in px) + `html[data-icon-style]` rules in dock.css; plain = no filter. Menu bar icons are still flat on purpose.
- Island motion: `islandMotion(preset, "pill" | "card", speed, width)` in presets.ts returns motion targets, so a leave turns round from where the arrival had got to. `animations.island` (Rust list `AnimationSettings::ISLAND`). The peek (`MediaPeek.tsx`) is a `.mb-panel.mb-peek` with the menu's CSS animation switched off.
- Roll cells: `--roll-h` is rounded to whole device pixels; `scripts/offscreen/clock.mjs` checks it at 100/150/200%.
- The dock window is declared with `"create": false` in tauri.conf.json and made in `setup` with `from_config(...).data_directory(...)`: a config window can only be given a data folder *relative* to the app's local data folder, never the portable one (checked by looking at the `--user-data-dir` of the msedgewebview2 processes: there must be exactly one folder, `data\webview\EBWebView`).
- **Quick native build without the CLI:** `cargo build --release --features tauri/custom-protocol` (plain `cargo build --release` makes a build that loads pages from the dev server: every window shows an error page). Stop the running copy before copying the exe over it.
- Type: `--font-text` (SF Pro Text), `--font-display` (h1/h2, big desktop clock/temperature), `--font-rounded` (dock labels, volume pill, media pill, glass tips), falling back to bundled Inter; set in global.css.

## Frosted glass (rebuilt): the compositor's blur
- **How:** each window with glass (dock, menu bar, Start) gets a *glass window* (`platform/windows/glass.rs`): `WS_EX_NOREDIRECTIONBITMAP | LAYERED | TRANSPARENT | TOOLWINDOW | NOACTIVATE` (click-through, no picture of its own), kept at the page window's rect and immediately beneath it in z-order (`SetWindowSubclass` on the page window: follows `WM_WINDOWPOSCHANGED`/`WM_SHOWWINDOW`, goes on `WM_DESTROY`). It holds a `DesktopWindowTarget` with one `SpriteVisual` per pane, painted with `CreateHostBackdropBrush` (needs `DWMWA_USE_HOSTBACKDROPBRUSH` = 17 or it is black) and clipped by a `CompositionRoundedRectangleGeometry`. The GPU compositor blurs; no captures, no IPC per frame at rest, nothing to flicker. Idle: ~13% of a core with glass on (mostly the dust scene), was ~55% with the old capture approach.
- **Why not a layer inside the page's window:** measured: a `DesktopWindowTarget` (not topmost) on the Tauri window is beneath the WebView's own child window and never shows.
- **Page side:** `BackdropLayer` reports the host element's border box, radius and opacity (frost × its own and ancestors' opacity) through `set_glass_pane` (CSS px + dpr), following every frame while it moves (MutationObserver on style/class of 4 ancestors, ResizeObserver, animation/transition events) and resting after 20 still frames. `data-bd="on"`: the layer draws the tint over the blur, and the host's own backdrop-filter is off.
- Composition must be created and used on the main thread (it has the dispatcher queue: `CreateDispatcherQueueController(DQTYPE_THREAD_CURRENT)`). `windows-numerics` gives `Vector2/3`.
- Frost slider is now 0-40 = how much of the blur shows (pane opacity); the blur radius is the system's.
- **Every surface of a group has glass, one switch per group**: `appearance.frost.{dock,start,menuBar}.glass` (old `realBlur` is the default until a group has its own; sanitize migrates it). `useGlass(group)` gives `{active, blur, grain}`; a surface puts `<BackdropLayer>` first inside it. `tint="layer"` (default) is for surfaces whose tint lives in `--bd-tint` (dock bar, menu bar, Start panel, flyouts, toasts); `tint="own"` sets `data-bd="glass"` and leaves the surface's background, which global.css thins (menus, Control Center, peek, media pill, tips, dock labels and control buttons, Start popovers). Tooltips take their group from the window (`?window=`). With a group's switch off, nothing of it is asked (`backdrop.mjs` asserts all of this).
- **Glass must never outlive its surface by a frame**: the pane is the compositor's and lands a frame or so after the page's paint, so a surface that vanishes leaves bare blur behind (the dock-label flicker). Rules: `BackdropLayer` runs as a layout effect, so it reports before paint; Rust hides and pools removed panes (`Host.spare`). Each pane and each of its specks has a host backdrop brush of its own.
- **`track`: `follow` vs `settle` (default)**. Only the dock bar, the menu bar and the Start panel follow frame by frame. Every other glassy surface (menus, Control Center, peek, pill, popovers, flyouts, labels, tips) *settles*: no glass while it moves; it comes back once the surface has stood still `SETTLE_FRAMES` (3) with no finite animation running, and Rust fades it in (`FADE_IN`, 140 ms). It goes at once when the surface moves again, or when `data-leaving="true"` lands on it. Why: the fly-outs squash (goo), tilt (unfurl) or clip (reveal), which a rounded rectangle cannot take, and the pane lags the page by about a frame, so the glass showed around the edges.
- **Commit explicitly**: `glass::set_pane` ends with `Compositor::RequestCommitAsync`. Without it the last change of a run (a menu's glass taken away on a hover-close) stayed on screen until something else woke the thread (a click).
- **Never re-place a glass window that has not moved**: the compositor refreshes a window's host backdrop whenever it is placed, even in the same spot, and all its panes blink. `glass::follow` returns early when the glass is already beneath the page, visible, and the same rect. `resize_menubar` (called for every menu, peek and tooltip) only re-clips, and only when the height changed; re-reserving the strip and `set_bounds` belong to `position_menubar` (settings and display changes).
- **The compositor blurs only within the box around everything drawn in the glass window** (measured on the live bar by adding test panes through CDP). The bar alone was a blur of its own 24 px strip (dark), and turned pale whenever anything else was drawn lower down the window, even a 1 px speck: so every menu opening looked like the bar changing. Each pane therefore has two **specks** (1 px, opacity `SPECK` 0.01, top-level visuals with their own host backdrop brush, `REACH` 96 px beyond two opposite corners, **clamped inside the window**). Specks outside the window, or nested in a container sharing the pane's brush, do not count (measured). The look stops changing once the box reaches 40 px past the glass.
- **`BackdropLayer` wakes vs moves**: `quiet` (frames since a wake) and `still` (frames unmoved) are separate. Only the host's *own* `animationstart`/`transitionrun` wake it (children's bubble up: Control Center's waveform kept a settling panel's glass toggling four times a second). A surface measured invisible is looked at again every 400 ms and on `visibilitychange`, because it can come into view with nothing watched changing.
- **Debugging live glass**: start the exe with `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333` (env for that process only), then evaluate in a page via CDP (`/json` lists pages by `?window=`) and call `window.__TAURI_INTERNALS__.invoke('set_glass_pane', ...)` to add test panes. Trace lines name the window (`menubar/_r_0_`): each window counts its own ids.
- Bench: `cargo test --lib complab -- --ignored --nocapture` (env `COMPLAB_LAYERED=1` for the glass-window recipe, `COMPLAB_TAURI=1` for a window made like Tauri's). The old Magnifier capture (`backdrop_capture`, `blurlab`, `capturelab`, `backdrop`) is gone.

## Optimisation pass (October 2026)
Measured on the owner's machine (Dell 75 Hz primary), their settings, before -> after:
- **Memory** of the whole process tree at idle: 1003 MB -> 697 MB (-31%).
- **Interaction smoothness** on the real GPU (`scripts/native/pacing.mjs`): worst frame on opening a menu 40 ms -> 15.5 ms,
  the Control Center 80 ms -> 14.8 ms, Start 27 ms -> 14.8 ms; dock magnification had no late frame before or after.
- **Idle CPU** is ~11% of one core with the menu bar's scene, the seconds and the frame's scene on, and 1.9% with all three
  off (measured in a sandbox copy). It is the menu bar window producing frames (scene at 12 fps, the seconds' roll at the
  display's rate); the frame's four bands now draw on one beat (17 -> 12 frames a second per frame window).

What changed, and the rules that come with it:
- **Each window loads only its own code** (`main.tsx`: `React.lazy` per `?window=`). A frame window loads 227 KB of JS,
  not 654 KB. **The CSS is not split**: every stylesheet is imported up front in `main.tsx`, in the order the old single
  bundle had them (`scripts/cssorder.mjs` prints it), because some windows rely on rules in another feature's sheet
  (measured with `stylediff.mjs`: the dock's clock figures, the settings window's previews). **A new stylesheet must be
  added to that list in `main.tsx`**, or it lands in one window's chunk and the cascade order changes.
- **motion** loads only in windows wrapped by `animated()` in `main.tsx` (`app/MotionPolicy.tsx` holds the reduced-motion
  config). `vite.config.ts` puts React and motion in chunks of their own. `experimentalMinChunkSize` was tried and made
  the frame windows load motion again: do not.
- **Ambient scenes on one page share a beat** (`fx2d.ts` `queue`, a grid on `performance.now()`).
- **The dock's float** writes `--float-t` on each `.dock-icon-float`, not the bar (a variable on the bar restyles all of it).
- **Sounds** (`engine/sound/ui.ts`): the engine is built ~1.5 s after a sound-making window starts (`useSoundWarmup` in
  main.tsx) and suspended; a cue resumes it, and it sleeps 4 s after the last. `new AudioContext()` is ~25 ms of the main
  thread, and a running one renders silence for ever.
- **Frame corners** (`shaper::windows_on_screen`): rule a window out by `GetWindowRect` before any DWM call, and stop the
  walk once every corner point has its top window.
- **Settings events** identical to what a window has are dropped (`settingsStore`).
- Dead code removed (unused wrappers, constants, ten dead CSS classes); `deadcode.mjs` and `deadcss.mjs` find more.

Tools (all off screen unless said):
- `scripts/offscreen/stylediff.mjs <out> <distA> <distB>`: every window's computed styles, build against build. JS-driven
  animations (float, springs, progress, the settings previews) differ by timing; anything else is real.
- `interact.mjs` (cost of interactions: script/style/layout per second, long frames), `idleprofile.mjs` (CPU profile at
  idle with the owner's settings), `scripts/chunkmap.mjs` (what a built chunk is made of), `deadcode.mjs`, `deadcss.mjs`.
- `scripts/native/*.mjs`: against a running app started with `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9444`
  (`pacing`, `firstopen`, `startup`, `idle`). Run a copy in `dist-portable/sandbox-test` (exe, `portable.txt`, a copy of
  `data`) so the owner's settings are never touched; put their copy back after.
- **Never start the app with debugging on 9333**: that is the harness's port. The harness now checks it is talking to its
  own headless Edge and stops otherwise (it once navigated a window of the running app), and records page errors
  (`h.errors()`).
- Process CPU is noisy on the owner's busy machine (the same setup read 13% then 9%); compare over 30 s and repeat. `dwm.exe`
  cannot be read.

## Frame corners (native, October 2026)
A maximised (or side- or quarter-snapped) app's corners in the opening are square; the frame lays a piece of the
margin over each, so the app looks rounded. Nothing is done to the app's window.
- **Drawing** (`platform/windows/corners.rs`): four layered windows per monitor (class `AeroDockCorner`: layered,
  click-through, topmost, tool window, no activate), each `radius + 4` px square in its corner of the opening, painted
  with `UpdateLayeredWindow` from a bitmap `render()` draws pixel by pixel: the ground (the wallpaper under the piece,
  or a flat color), the margin's glass over it, the glass border (band, bright outer hairline, dark inner one), cut by
  the signed distance to the opening's rounded rectangle (exact anti-aliasing). Drawn again only when its inputs
  change; raised to the top only when it comes in. Replaced the `framecorners` web window (two renderer processes,
  ~67 MB, and a page that had to wake and render on every show).
- **Look**: the glass color is the frame page's own computed `.frame-glass` fill, reported by `FrameApp` with
  `report_frame_glass`; the border's light uses the same stops as `BevelGradient` (`corners::BEVEL`: keep in step).
  Checked against the web version on the Dell: mean difference 1.3 grey levels; the curve's inner edge is a little
  softer (the page's clip let the dark line reach half a pixel over the app).
- **Grounds** (`frame.rs`: `grounds_for`, `look_under`): looked at off the main thread when a monitor's opening is
  first laid out, so a piece is ready before it is wanted, and again when the wallpaper changes (`watch_wallpaper`).
  The desktop's own picture (`Picture::desktop`, Progman's `PrintWindow`) is checked against one copy of the screen
  round the opening (`Picture::screen`, a `BitBlt`: 27 ms for 1920x1080; `GetPixel` per point took ~4 s) with
  `lines_up`, which sets aside the fifth of points that fit worst (the ambient scene's motes broke every look on the
  Samsung). A corner that does not line up uses the margin's color and is looked at again 3, 6, 9 s later, by itself.
- **Which corners** (`shaper.rs`): the window on top at each corner point (z-order, DWM visible bounds) holds it if it
  is maximised and fits the opening (`NEAR` 24 px), or its own corner is within 4 px. Click-through windows
  (`WS_EX_TRANSPARENT`: overlays) and tool windows are not "on top"; a window covering its whole monitor
  (`fullscreen`) holds none, decided per window, so a fullscreen video on one monitor leaves the other's corners alone.
  (The old global `SHQueryUserNotificationState` watcher hid every monitor's corners for any fullscreen app and for a
  screen-sized overlay: a cause of corners going missing.) `COVER_DELAY` is 100 ms: the piece is in place before
  Windows' maximise animation lands (~300 ms on the Dell), so the square corner is never seen; over an empty corner a
  piece draws exactly what the ring does there (measured: mean 1.5-3.8 levels, invisible).
- **Light path**: the shaper's changes, finished looks, glass reports and wallpaper changes call `corners_later`
  (pieces only, from `PLACED`), not the full `layout_later` (strips, ring).
- **Live tests on the primary monitor** (with the app running and the frame on; they make and move windows of their
  own, and read the screen): `powershell -File scripts/native/corners-live.ps1 probe 5` (states: maximised, restored,
  snapped, quarters, side by side, a window over a corner, an invisible overlay, a fullscreen window, minimised and
  back, quick toggles: 230 checks), `timing 10` (is a square corner ever seen after a maximise: 0 of 40), `apps <png>`
  (Notepad, Explorer, Calculator, Settings, Paint, Terminal, Edge: maximised, snapped, small), `shot <png>` (a picture
  of the four corners, for comparing looks). Startup with a window already maximised: pieces in ~3 s (was 7 s).

## Dock marks and tint, window activation (October 2026)
- **Focus mark** (`dock.indicatorStyle = focus`, `FocusMarks.tsx`): drawn inside the icon it belongs under, with a shared `layoutId` (`dock-focus-mark`, `dock-ghost-mark`), so motion carries it between icons and it rides with magnification (checked: 0 px off its icon over a full sweep). Centred with a margin, not `translateX`: motion owns `transform`. `fade` drops the `layoutId` (no travel). A springy exit can leave the old mark in the DOM at opacity 0 until the spring settles. `scripts/offscreen/marks.mjs`.
- **Magnification layout** (`magnifyField.ts`): nothing in the bar moves by layout while it swells. The button's layout size is its `slot` (= `--icon-size`; only animated by layout on arrival); the `width` spring is the room it *should* take. Each DockIcon registers `width` in the field and subscribes it to `field.schedule`, which runs `place` once per frame in motion's render step: every in-flow bar child (and each icon button inside `.dock-section` > Reorder.Item) gets CSS `translate` = Σ swell of icons before it − total/2 (+ own/2 for an icon), and the bar's glass grows by total/2 each end: the glass is `.dock-body` (abs, z-index −1, first child of `.dock-bar`, holds the BackdropLayer and sweep; `.dock-bar` itself is no longer `.glass` and never changes size for the swell), laid out `--grow-extra` (whole px) past each end and `scaleX(--grow-scale)` (≤ 1 px in the whole width) to land exactly; `grow()` then dispatches `bd-sync` on it, which BackdropLayer answers by posting the pane at once (its own rAF could run before motion's in a frame and post a stale rect: `docksync.mjs` checks every frame within 0.1 px). Dock-glass CSS targets `.dock-body.glass` (dock.css, clear.css, dockshadow.css); pointer light writes to the body. Hit area (`.dock-icon::after`) and hover bloom widen by `--grow`. Layout is painted on whole pixels: when the swell was the button's width, icons stepped a pixel at a time against their smoothly scaling drawing and the last icon shimmered (`scripts/offscreen/magpixels.mjs` screenshots it at half-pixel pointer steps: old 0.92 px error spread with whole-pixel jumps, now 0.07). The pointer is measured against rest centres (`measureRest` = drawn centre − written translate, in `handleMove` before `mouseAxis.set`), never the live rect: that was a feedback loop that shook the icons near the ends (`magsmooth.mjs`). Don't put `translate` on bar children or icon buttons for anything else. If the bar ever stops being centred in the viewport, the `total/2` terms must change.
- **Sub-pixel rule (everywhere):** never animate `left/top/width/height/bottom/margin/padding` frame by frame; layout is painted on whole pixels and steps. Moving boxes use `useSubpixelBox` (`engine/motion/subpixelBox.ts`: whole-px layout box at 0,0 + translate + a scale off by < 1 px; folds in squash) — the menu bar lens and `useGlideHighlight` do. Fills/progress bars are full-width and `translateX(calc((var(--p) - 1) * 100%))` inside their rounded `overflow: hidden` track (`--p` 0–1 inline), never `width` or `scaleX` (squashes the round end); a knob rides a full-width runner (`.np-knob-run`). Offsets that follow a per-frame value ride `translate` (dock labels: `--mag-rise`). Size swells use the `scale` property. Left alone on purpose: Mission cards (fast, big, would scale their contents), the slider fill (its end is under the knob).
- **Never put the CSS `scale` property on a box placed by translate**: `scale` applies outside `transform`, so it
  scales the translate too (the menu bar lens flew ~85 px left on every press, `lenspress.mjs`). Presses go through
  `usePress` (subpixelBox.ts): a spring folded into the box's own scale, released by a window-level pointerup.
- **Start readability (adaptive tint)**: `start.rs::place_and_show` BitBlts the panel's area (window still hidden, so
  it is what is behind) before `show()`, `Picture::light_grid(6, 6)` (CIE L*, each cell = ½ mean + ½ lightest tenth)
  rides the `start://open` payload as `backdrop`; `readability.ts::veilFor` turns it into a 6×6 PNG of dark alpha
  (smoothstep 0.42→0.92, at most 0.55) stretched over the panel as `.st-veil` (above the bd-layer, under content;
  bilinear scaling blends cells) plus `--st-shadow` text-shadow. Deliberately once per opening and never while open
  (no flicker); reopen-while-closing keeps the last one. `start.adaptiveTint` turns it off. `readability.mjs`.
- **The mark is a drop of frosted glass** (`engine/brand`): `Droplet` (React, colors are CSS color-mix of
  `--aero-accent`, so it follows the theme live; gradient/filter ids are per instance from `useId`) and
  `dropletSvg(hex, px)` (plain JS + .d.ts so Node scripts can import it; the same drawing with literal colors).
  Change one, change the other (they share `DROP_PATH`). True alpha transparency — a turbulence-and-blur diffusion
  (`feTurbulence` + `feGaussianBlur`, merged) over a soft radial glow, clipped to the shape, rather than an opaque
  fill shaded to look translucent — picked after building and comparing five real techniques side by side (an
  artifact made for that comparison, October 2026); a crisper sheared-highlight look lost out because it read as
  polished glass, not frosted. The grain holds up to about 32px; below that it softens into a plain soft glow, which
  is ordinary icon behavior at small sizes and not a bug. Used by the menu bar logo, the settings sidebar/splash/
  support card, Welcome, the animation previews. Inline SVGs sharing gradient ids in one page all take the first
  one's colors (bit the preview sheet) — render standalone copies as `<img>`. The tray icon is tinted at run time:
  the primary dock renders `dropletSvg` at 64 px to a PNG and calls `set_tray_icon` (`useTrayDroplet`, debounced
  400 ms). The exe/installer icons are the drop in silver `#9fb4cc`:
  `node --experimental-websocket scripts/brand/make-icons.mjs` renders `src-tauri/icons/source.png` (1024,
  transparent; the page must have no scrollbars or they are captured) and runs `pnpm tauri icon` (don't pipe its
  output through `Select-Object -First`: that kills it part way).
- **New icon files only reach the exe because `build.rs` says `cargo:rerun-if-changed=icons`.** tauri_build lists the
  files it watches, which turns off cargo's rerun-on-any-change, so without that line `resource.lib` (the exe's
  embedded icon, `target/release/build/aero-dock-*/out/`) kept the old orb for days. Check an exe's icon with
  System.Drawing `ExtractAssociatedIcon`.
- **Click effects' outline and bloom** (`fx2d.ts`): `outlineBand` makes an alpha band along the icon image's real
  silhouette (shape spread 8 ways, less shape eroded 8 ways; the rounded tile if there is no image), which `EdgeHalo`
  fills with a conic-gradient head sweeping one lap (and a blurred copy for glow). `LightBloom` now tracks the icon
  and cuts the icon's shape out of a radial glow (the effects canvas is above the icons), scaled by `bloomAmount`.
  `clickfx.mjs` films all four in the Settings preview. The preview canvas covers the whole stage. The outline is of
  the icon made solid first (`solidShape`: an SVG filter, `fx-solid-shape`, alpha ≥ 0.25 → white, applied through
  `ctx.filter`; **no `getImageData`**, the icons are cross-origin and reading one back throws). Every click effect
  takes a `Tune` (`animations.clickTune.<effect>`: speed, opacity, size, color; Rust `ClickTune`, clamped).
- **Lens in a scrolling root** (`useGlideHighlight`): boxes add `root.scrollTop/Left` (the settings sidebar's list
  scrolls and holds the lens); `settingslens.mjs` checks a scrolled list. The menu bar's lens (`menubar/Lens.tsx`)
  fades `IDLE_MS` after resting on empty bar, and on any document leave/hide (a no-activate window can miss leaves).
- **The menu bar steps aside for full screen** (`platform/windows/fullscreen.rs`, `menubar.rs::step_aside`,
  `menuBar.hideForFullscreen`): `position_menubar` points the watcher at the bar's monitor; it looks (WinEvents:
  foreground, minimise, show/hide/destroy, location; and every 1 s) at the window on top at the monitor's top middle,
  skipping ours, tool/click-through, cloaked, the desktop and shell hosts, and if it covers the monitor
  (`shaper::fullscreen`) the bar is `SW_HIDE`d (its glass follows), back with `SW_SHOWNOACTIVATE` (only if it was
  hidden for this: `ASIDE`). Not the shell's global full-screen state (wrong for overlays and other monitors). The bar's
  window is 1920x734 (the bar plus room for menus). Checked natively with test windows: 8 of 8.
- **A lens's backdrop filter doubles anything see-through under it** (the bent copy is laid over the original): the
  Start menu's readability veil went near-black in its lens. `refraction.ts` starts with `SOLID_ONLY` (alpha^4), so
  only solid text and icons are bent. `startveil.mjs` reproduces it (sends `start://open` with a light `backdrop`).
  The settings sidebar uses `useGlideHighlight` with `axis: "y"`, `stretch: 14`, `grow: 0` and magnifies only the icon
  (`settingslens.mjs`); the menu bar's reach and squeeze are wrong for full-width rows.
- **Work machine's monitors**: the Dell (DISPLAY2, primary, 75 Hz) is driven by the **Intel UHD 770**, the Samsung
  (DISPLAY1, 165 Hz) by the **NVIDIA RTX 5000**. The frame overlay shows **every** web view at 75 fps, the Samsung's
  too (Chromium paces from the primary display), and the Start menu on the Dell at a clean 75 with 0 late frames, real
  blur on or off. So "low fps on the Dell" is not the page; suspect the cross-adapter copy to the Intel-driven monitor,
  which the frame meter cannot see. Unresolved (October 19).
- **The Liquidock button** (`LiquidockButton`, DockControls; was the search button, still `dock.showSearchButton`):
  `.dock-drop-btn`, deliberately not `.dock-control-btn` (no glass circle, no icon-look filter); a `Droplet` plus an
  overlay svg clipped to `DROP_PATH` with the shine `dock.startShine` (`sweep` | `caustic` | `rim`). The shines are
  `:hover` transitions on the `--m-*`/`--e-*` tokens, not keyframes, so they turn back; the sweep's band starts and
  ends outside the drop, fading before its 0 s jump home. `scripts/offscreen/dropbutton.mjs`.
- **The dock's own menu** (`DockMenu.tsx`, right-click on the viewport where `inDockZone` holds and the target is not
  a `.dock-icon` or a flyout): `useMenu.open("dock", null, anchor)` — a flyout may now have no item, so **"is a
  flyout open" is `menu.anchor !== null`, never `menu.item !== null`** (DockBar's `menuOpen` and window height,
  DockIcon's `flyoutOpen`). Window arrangements and Show the desktop go through `system_action`
  (`cascade|stacked|sideBySide|desktop`) to `platform/windows/arrange.rs`, which only touches `running::snapshot()`
  windows on the monitor under the pointer (never ours: a plain `CascadeWindows` or Win+D would take the dock and bar
  too). `openPreview` refuses to replace an open `menu`/`dock` flyout (the hover dwell used to swap an icon's menu for
  its previews). `dockmenu.mjs`.
- **Window previews** (WindowsFlyout): one window shows its title once (header) and a full-width close bar under the
  picture; several show the app name and each window's title over its picture. No `title` attributes anywhere in it:
  the DWM thumbnail is drawn over the page, so a tooltip comes up behind it and sticks (`previews.mjs`).
- **Spelling**: "color" throughout code and UI (renamed from "colour" in October 2026; section id `color`).
- **Hover effect** (`appearance.hoverEffect`: magnify | lift | glow | none → `html[data-hover-fx]`, global.css)
  applies to `.mb-menu-item`, `.aero-menu-item`, `.cc-card`. The rules sit under `html` so they outrank each item's
  own later `transition`.
- **Settling glass is sticky** (BackdropLayer `landed`): a `settle` surface's glass, once in, follows it until `data-leaving` (or it can't be seen), including through opacity/scale exits; before, the last hair of a spring broke "still" and the glass went away and came back (every menu: `false > true > false > true`, checked in `backdrop.mjs`). Surfaces whose exit is a shape the glass can't take must set `data-leaving`.
- **Stretch with speed** (`dock.markStretch`, `useStretch` in FocusMarks): during a layout animation (`onLayoutAnimationStart`/`Complete`) a rAF reads the mark's on-screen centre, derives smoothed speed, and sets `--stretch-x`/`--stretch-y` on it; the look is drawn on `.dock-mark::before` (colors via `--mark-fill`/`--mark-shadow`, which clear.css overrides), scaled by those vars. Never put the stretch on the mark's own transform (motion `scaleX`): shared-`layoutId` handoffs blend transform values between the old and new mark and it blew up to 10×+. The first reading is taken on the first frame, not at start (the box is still at the destination then, which reads as a leap). The `::before` radius is pre-divided by the stretch so ends stay round.
- **Mark track** (`.dock-mark-track`, DockIcon): the marks sit in a span whose transform is the exact inverse of the button's launch/attention lift (`-y / squashY`) and squash (`1 / squash`), so they stay level while the icon jumps. Declared after `squashX`/`squashY` (TDZ). The halo (`dock.runningCue = halo`) gets its own track drawn *before* `.dock-icon-mag` so it glows from behind the icon; `dots` (faint marks) and the marks share the one after. `--mark-glow` (rgb triplet) on the track; the clear surface swaps in `--clear-glow`. `dim` puts `data-idle` on non-running buttons.
- **Auto-hide zone** (`inDockZone`, DockBar): `pointerInside` counts only from the screen edge to the bar / swollen icons (`.dock-icon-mag` rects, live, so it shrinks as the bar slides away) plus `DOCK_ZONE_BUFFER` (14 px), never less than `REVEAL_STRIP`. The viewport is far taller than the bar (magnification, menus); counting all of it kept a hiding dock coming back. Dragging and auto-hide off count everywhere. Menus/previews keep it up via `menuOpen`. `scripts/offscreen/dockhide.mjs`.
- **Dock tint**: `--dock-tint` on `.dock-viewport` (0-1.5; or the menu bar's Tint scaled 0.5/0.34 with `tintLikeMenuBar`); clear.css scales the veil, global.css `.glass` mixes each gradient stop (`color-mix`, capped at 100%, a no-op at 1).
- **Never synthesise Alt** to win the foreground: apps show their KeyTips. `running::activate_window` tries `SetForegroundWindow`, then sends a zero mouse move and tries again.
- **Read the window size again once a resize listener is attached** (FrameApp, MenuBarApp, BarScene): windows are made at 800x600 and resized, and with lazy-loaded pages that resize could land before the listener (the frame's border lost its right and bottom edges).
- Settling glass comes in when the entrance has under `LANDING_MS` (180) to go, never while `data-leaving`; it fades in over 260 ms, eased.
- **Dock click effects, two layers** (`engine/effects/fx2d.ts` + `EffectsLayer.tsx`, canvas 2D, no WebGL and no
  blur filter — the dock's web view renders in software): every click emits `ripple`, and a launch of an app with
  no window yet also emits `burst` (`LaunchBurst`, a fountain of sparks), so the two stay visually distinct —
  don't make a new `ripple` candidate too close to the burst's look, that was the one problem found comparing
  candidates (a droplet-spray option was shelved for exactly this). `burst` still anchors to the dock's own edge
  (`anchorPoint`) and is re-placed if the window resizes between emit and draw (`place()`), so it survives a
  flyout opening mid-animation. `EffectsLayer`'s canvas is `zIndex: 50`, above the dock's icons and glass,
  `pointer-events: none`; a redesign that forgets the z-index (or the pointer-events) either hides the effect
  behind the glass or steals clicks from the icons under it — both bit a first pass at a demo artifact for an
  earlier comparison, off screen, before it ever reached real code.
- **`animations.click` picks what `ripple` spawns** (`EffectsLayer.tsx`'s handler, keyed on `live.current.clickEffect`):
  `bloom` (`LightBloom`, fx2d.ts) is a glow behind the icon, built the same way `burst` is — a point and a tint,
  fixed at the moment of the click. `dimple`/`halo`/`shine` (`PressDimple`/`EdgeHalo`/`ShineSweep`) are different in
  kind: each clips to the icon's own rounded-square (`iconClip`, 22% corner radius — the app's own convention for a
  rounded icon tile, `.dock-icon-glyph`/`.dock-stack` in dock.css, not a radius read from the DOM) and **tracks the
  icon live, every frame**, not just at the moment of the click — asked for explicitly, to see a swollen or
  shrinking magnified icon carry the effect with it. `DockIcon.tsx`'s click handler hands these three an `IconTrack`
  closure (`() => {x,y,w,h} | null`) that reads `.dock-icon-mag`'s own `getBoundingClientRect()` — not the outer
  `.dock-icon` button's, whose layout box never grows (magnifyField.ts moves it, nothing resizes it; only the inner
  `.dock-icon-mag` span is actually `scale`d) — plus a `ToCanvas` closure (`EffectsLayer`'s existing `place()`,
  called fresh each frame, not cached, so a window resize mid-effect is still handled correctly). `track()` returns
  `null` once `magEl.isConnected` is false (the pin was removed, the app closed) and the effect retires itself that
  frame rather than drawing a stale rect. This per-frame `getBoundingClientRect()` read is deliberately not a
  performance worry here: the dock's whole animation path is `transform`/`translate` only by convention (see the
  sub-pixel rule below), so nothing in a frame where one of these effects is playing ever dirties layout, and the
  read costs nothing beyond combining the cached layout box with the current transform matrix — measured, not
  assumed, before committing to doing it this way rather than snapshotting the rect once at the click. The click
  point itself (`clickX`/`clickY` on the `ripple` event) is a *fraction* of the icon's width/height, not a pixel
  offset, so `PressDimple`'s anchor stays in the same place on the icon's face as the icon's live size changes
  under it. The settings preview (`ClickPreview`, `AnimationPicker.tsx`) spawns the real effect classes through a
  real `Fx2D` instance on a small canvas held over one mock icon, not a reimplementation — same contract as
  `DockIcon.tsx` gives the live engine, so it can't drift from what actually plays; the preview's icon does not
  magnify, so it mostly proves the shape is right, not the live-tracking (an off-screen scenario that swells a real
  icon first, then clicks it mid-swell, is what actually proved that part — screenshotted at two points in the
  effect's life, not just asserted). Its hero tile is a real `<img>` with its own padded content
  (`paddedIconSrc`), not a flat CSS-colored div like the other four dots — a flat tile has no empty margin to
  show the masking below staying off of, so it could not have demonstrated the one thing that changed.
- **`PressDimple`/`ShineSweep` mask to the icon's own drawn pixels, not its rounded-square tile** (`drawMaskedToIcon`,
  fx2d.ts): most real icons have empty padding around their actual glyph, and clipping to the full tile let the
  first version of these two press or sweep across that padding, which read as acting on the tile rather than the
  icon. The fix is `destination-in` canvas compositing, not pixel reads: the effect's own shapes are drawn onto a
  small shared offscreen canvas (`maskCanvas`, module-level, reused across frames and effects — a canvas element
  is not cheap to create and at most one or two of these are ever live at once), then `destination-in`-composited
  against the icon's actual `<img>` (`ctx.drawImage`, which reads its bitmap the same way the browser already
  does to paint it on screen — no `getImageData`, no per-pixel JS, no tainted-canvas/CORS concern since nothing
  is read back into JS), then drawn onto the real canvas with normal blending (not `lighter` — the offscreen
  buffer is already correctly blended light-and-dark, and `lighter` cannot darken, which would have made
  `PressDimple`'s press invisible). `DockIcon.tsx`'s click handler supplies the actual `<img>` ref
  (`glyphImgRef`) as an `IconSource` closure; it is `null`, and the effect falls back to the old rounded-rect
  clip, for a stack mosaic or the no-icon-found glyph (neither is a plain image `drawImage` can read) and before
  a real icon has finished loading. **`EdgeHalo` is deliberately not masked this way**: it strokes a path rather
  than filling one, and masking a stroke to the icon's alpha does not trace the icon's real silhouette, it just
  keeps whatever part of the rounded-rect border happens to cross opaque pixels — usually none of it, since most
  icons' padding sits right where that border is drawn, so the halo would mostly vanish. Tracing an icon's actual
  outline needs finding its silhouette (something like marching squares over its alpha), a materially bigger
  feature than masking a fill is, and not built. Verified off screen with a high-contrast test icon (swapped in
  over the harness's own mock) rather than trusted from the code: the shine band's light stops exactly at the
  icon's own edge with no bleed into the margin around it, confirmed by screenshot, not just by reading the draw
  calls.

## Mark color, the frame's light, the settings sidebar's lens and a click-effect preview bug (October 2026)

- **The running mark's color is theme-accent-derived by default now, with a custom-color option** (`dock.markColor`,
  `#rrggbb` or empty for the theme — `normalize_hex`, same idiom as `menuBar.wifiColor`/`bluetoothColor`; a
  `BubbleColor` control in Settings › Dock, same component those two already use). Fixed a pre-existing bug on the
  way: `.dock-mark`/`.dock-indicator`'s dark gradient stop and glow were hardcoded (`#3f8f1d`, `rgba(122,208,58,…)`)
  rather than reading `--aero-accent-deep`/`--clear-glow` like the rest of the mark already did — a pick other than
  green always showed a faint, wrong green edge until this. A custom color is computed once, in JS, the same way
  the theme's own accent is: `tokensFromAccent(markColor)` in `DockBar.tsx`, exposed as `--mark-custom-life/-deep/
  -glow` on `.dock-viewport`, read by an override in dock.css keyed on `[data-mark-color="custom"]` — four
  selector parts deep specifically so it beats clear.css's own override regardless of which stylesheet loads
  first (`global.css`, which carries `clear.css`, loads *after* dock.css — see "Each window loads only its own
  code" above; a tie goes to whichever loaded last, so this one cannot rely on source order at all). The ghost
  mark is untouched by any of this, same as it already was untouched by the theme.
- **The frame's glass border is lit on the same diagonal every other glass surface is** (`--rim`, tokens.css: bright
  upper left, fainter lower right), not a plain top-to-bottom gradient. `corners::bevel_alpha` now projects each
  pixel onto the frame's own top-left-to-bottom-right diagonal instead of just its vertical position, and
  `FrameApp.tsx`'s matching `BevelGradient` SVG gradient now runs corner to corner (`x2={w} y2={h}`) instead of
  top to bottom — the two are still deliberately kept in step (same stop values), per the comment on both that
  was already there. `Piece` (corners.rs) gained `frame_left`/`frame_width` alongside `frame_top`/`frame_height`
  to make the projection possible; every place that builds one (`frame.rs::place_corners`, the corners.rs test
  helper) had to be updated together. Checked off screen (the SVG straight edges render and the corner math
  passes its own tests, `cargo test corners`); **not yet seen natively** — the actual corner pieces are native
  layered windows this harness cannot show, so whether the new diagonal genuinely reads as "the same light as the
  menu bar" on a real screen is still to be looked at, not assumed from the math alone.
- **The settings sidebar no longer force-closes when a section is chosen** (`goToSection`, `useSettingsUi.ts`,
  which used to call `setSidebarOut(null)` unconditionally — removed). It now leaves by whatever already puts it
  away: the pointer leaving it (a sidebar out at the edge) or the header button/scrim (one brought out by hand).
  **A second bug surfaced fixing the first**: `SettingsNav.tsx`'s `away()` (the pointer-left-it timer) skipped
  closing while `document.activeElement` was anywhere inside `.sb` — meant only to protect the search box while
  typing, but a clicked `.sb-item` button also keeps the keyboard until something else takes it, so *any* section
  click permanently blocked the sidebar from ever closing on its own again, not just that one time. Fixed to check
  specifically for the search input, not "anything inside `.sb`".
- **A third, real bug kept the edge-hover close flaky even after both of the above were fixed, caught only by
  measuring, not by re-reading the code**: the sidebar used to track "is the pointer near it" with its own
  `onPointerEnter`/`onPointerLeave`, but it slides in by a CSS `transform`, which moves its hit box through real
  on-screen coordinates frame by frame while it animates. A pointer parked exactly in the 10px reveal strip at the
  window's left edge (where a user's cursor naturally sits right after triggering the reveal) stayed still while
  the panel's own left edge swept rightward *past* that x position on its way to its resting spot — so the panel
  fired a `pointerleave` on itself, mid-slide, with the real pointer never having moved at all. That scheduled a
  close 320ms later, which took the panel back off-screen, sweeping its edge back past the same still pointer a
  second time — and the reveal strip remounting under that same resting pointer then fired a fresh `pointerenter`
  on its own (Chromium resynthesizes hover state when the DOM changes under a stationary cursor), reopening it,
  forever: a silent, perpetual open/close flicker whenever the pointer held still right at the edge instead of
  drifting onto the panel itself. Found by logging every enter/leave/timer event with real timestamps
  (`window.__navDebug`, removed after) rather than guessing from another round of sleep-timing tweaks — the
  off-screen checks for this had been flipping between pass and fail across unrelated edits, which was the actual
  tell that something was genuinely racing, not that the test's sleeps were merely too short. Fixed the same way
  the dock's own auto-hide zone already solves the identical class of problem (see "Auto-hide zone" above): a
  single `pointermove` listener on `window`, active only while `sliding`, that compares the event's real `clientX`
  against the sidebar's *live* `getBoundingClientRect().right` (plus a small buffer) rather than relying on the
  moving element's own enter/leave events. `.sb`'s and the reveal strip's (`.sb-edge`, now deleted — folded into
  the same geometric check) per-element handlers are gone; one computed zone decides both "should it open" and
  "should it close" from where the pointer actually is, which cannot be confused by what the panel underneath is
  doing. `settings.mjs`'s edge-hover block (holds the pointer still at the very edge for a full second, no
  movement at all, before checking) now passes every run instead of only when its sleep happened to land outside
  the flicker's window — it also covers choosing a section from a button-opened sidebar (stays open, as it always
  did) and from an edge-opened one (stays open while the pointer is still over it, closes once it genuinely
  leaves) — and had to close the button-opened sidebar before testing the edge-opened case, since the edge strip
  that brings one out doesn't even render (`{sliding && !out && …}`) while one is already out from the button.
- **The sliding lens is in the Settings sidebar now** (`SettingsNav.tsx`, `useGlideHighlight` on `.sb-list`,
  `items: ".sb-item"`, `clips: ".sb-list"` since the list scrolls). Reads `menuBar.lensGrow/lensWarp/lensMagnify`
  like the widget cluster already does — "one set of sliders sets both lenses" now covers three. `.sb-list` needed
  `position: relative` added (the Highlight positions itself against it); `.sb-item`'s own `:hover` background is
  gone, same as the Start menu's rows when the lens arrived there — the lens is the hover feedback now, not a
  second one competing with it. `.sb-item[data-active="true"]` (the currently-shown section) is untouched: that's
  a standing "you are here" marker, a different thing from momentary hover, same as a dock icon's own running mark
  stays separate from its magnify-on-hover.
- **The click-effect settings preview drew nothing, ever, since it was added — a coordinate bug, not a motion-reduction
  or load-order issue.** `ClickPreview`'s `track()` was already computing the hero icon's position *relative to the
  stage* (`icon.left - stage.left`), but `toCanvas()` (meant to convert a *window-space* point, same contract as the
  real `EffectsLayer`) subtracted the stage's position again on top of that — every effect's `origin` landed far
  outside the small preview canvas, every single frame, for the effect's whole life, with no error anywhere a
  silent off-canvas `drawImage` doesn't throw. Found by instrumenting `Fx2D.wake`/`spawn` and `drawMaskedToIcon`
  directly and reading the actual numbers back through the harness, not by guessing from the code: the spawn was
  firing, `track()` was returning a plausible-looking rect, the paint step was genuinely drawing pixels — all of
  it just at the wrong place. Two false leads on the way, both worth remembering: `naturalWidth` on the preview's
  inline SVG `<img>` (no explicit width/height attribute) reports a platform default (150), not 0 — it never was
  the suspected cause, and `drawMaskedToIcon`'s fallback path means an unusable source draws unmasked rather than
  nothing anyway; and checking the canvas's pixels too early (before the preview's own 250ms "let the replay be
  seen starting" delay) or too late (after the effect's 500ms life has finished and the canvas naturally clears)
  both read as "broken" when the real window to check was the ~150ms in between. Fixed: `track()` now returns
  `icon.getBoundingClientRect()` directly, in window space, matching what `DockIcon.tsx` hands the real engine.
- **Rigorous lens testing across all three surfaces that use it** (menu bar `useLens`, widget cluster and Start
  menu `useGlideHighlight`) turned up one methodology trap and two small, real, open questions — see the
  CHANGELOG entry for the specifics (widget-cluster settle overshoot growing into a wider button; Start menu
  arrow keys only working with a search query active). The trap, worth remembering for any future lens test: a
  single `move()` straight from inside a hoverable surface to far outside it does not reliably fire a real
  `pointerleave` in the harness, which first read as "the lens stays visible after a menu closes and you leave the
  bar" — a real-looking bug that was actually correct behavior (the menu's own close-on-leave timer firing,
  the lens fading once nothing is left open) caught only by recording a `sweep()` across the same path instead.
