# Aero Dock: working notes

A customised fork of [TheAgencyMGE/aero-dock](https://github.com/TheAgencyMGE/aero-dock)
(MIT, Windows only): Tauri v2, Rust and React 19. A dock, plus a menu bar, a
Control Center, a window frame and a lot of glass.

Read `docs/ARCHITECTURE.md` first for how it fits together. This file is what is
**not** in the code: how to build and test, the rules the owner has set, the traps
already fallen into, and which things have and have not been seen working.

## Keeping this file current

It is maintained as we go. When a task teaches something that would have saved
the next session time (a trap, a decision, a rule from the owner, a change in
what is verified), add it here in the same change. Remove what stops being true.
Keep it terse: detail belongs in `docs/ARCHITECTURE.md` or a comment beside the
code. When a feature ships or is removed, update "State of the features" below.

## Git

- `main` is the project as it was at v1.3.2. The fork's work is on `custom-fork`.
- `origin` is the owner's own repository; `upstream` is the original. Never push
  to `upstream`. Do not open pull requests unless asked.
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
  `dist-portable/Aero Dock.vNN.exe` with the next version number. Their data sits
  in `dist-portable/data`, marked by `portable.txt`.
- A new exe cannot start while an older copy runs (the single-instance plugin is
  keyed on the identifier), so the owner must quit from the tray first. Old
  versions they are running are locked; they delete those themselves.

## Conventions

- **Settings** follow one pattern: a Rust struct with serde `camelCase` and
  defaults, a `sanitize()` that clamps numbers and checks strings against an
  allowed list (`keep_known`), tests, a mirror in `src/ipc/types.ts`, and a card
  in `SettingsApp.tsx`. A file saved before a setting existed must still load
  (every group is `#[serde(default)]`).
- **Colour** comes from the tokens (`--aero-*`, `--clear-tint`, ...), never raw
  values in components, so every theme and the picked colour keep working.
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
node --experimental-websocket scripts/offscreen/backdrop.mjs src-tauri/target/offscreen    # the frosted picture under the dock, Start and menu bar (and that off means off)
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

- **Do not test with their real mouse or their running dock.** They work on the
  same machine while changes are tested. Use the harness. Ask before any test that
  needs the native app, and do not start a second dock (its bar overlaps theirs and
  reserves a second strip of screen).
- **Never change real system state in a test.** A scripted drag of the Control
  Center slider once set their real volume to 100% (stubbing `invoke` from the
  outside does not intercept the app's own bundled copy). Do not drive volume,
  mute, radios, brightness, sleep, taskbar or app launching on a live instance.
  Read a value before touching anything stateful, and report any change made.
- Desktop screenshots aimed at the screen are blocked by the permission
  classifier; capture only the page's own pages and delete them afterwards.

## Design decisions and traps

- **The frame keeps appbar claims, not queries.** While the frame is on the menu
  bar and dock register no appbars (`appbar::reserve` records a claim); the shell
  stacks appbars per edge in registration order, and a later query would push the
  bar inside the frame's strip.
- **Rounded app corners are the app's own window region** (`SetWindowRgn`,
  `platform/windows/shaper.rs`), not a drawn overlay (that looked scuffed and
  dark). The region is read back and re-applied, because custom-chrome apps clear
  their own, and abandoned for a window that keeps removing it. Apps run as
  administrator cannot be shaped. GDI quirks: `CreateRoundRectRgn` is one pixel
  short on the right and bottom (ask for right+1, bottom+1) and a zero ellipse is
  an empty region.
- **Never leave a window shaped**: regions come off on disable and on quit.
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
- **Real blur is a picture, not the system's blur.** The windows are transparent web views (`backdrop-filter`
  has nothing to sample) and **the system's blur is a rectangle only**: measured by `blurlab.rs` (`cargo test
  --lib blur_lab -- --ignored --nocapture`, `BLUR_LAB_OUT` set to a folder; it shows a window of stripes on each
  screen for a few seconds, so ask the owner first) it ignores a window region, a layered window's alpha,
  `DwmEnableBlurBehindWindow`'s region and acrylic's, on every screen. Do not shape a pane with `SetWindowRgn`
  again: that was the grey square behind the dock and Start (both monitors, from the first frosted-glass version
  on). So the dock and Start blur a *picture*: `capture_backdrop` (`backdrop_capture.rs`) takes one of the
  screen with this program's windows left out (the Magnification API's window + `MagSetWindowFilterList`; its
  host must be shown, on the primary screen and kept on top of our other topmost windows, or a window of ours lying over it makes the picture come back black there; found by `capturelab.rs`), shrinks, blurs and grades it, and
  `engine/backdrop/BackdropLayer.tsx` lays it under the glass's tint, clipped by the glass's own corners. A glass
  with a picture has `data-bd="on"`, which drops its own `background`; **every glass rule keeps its tint in
  `--bd-tint`** (global.css, clear.css, start.css) and the layer draws it over the picture. A new glass surface
  that should be frosted: give it `isolation: isolate`, a `--bd-tint`, and `<BackdropLayer>` as its first child
  (and keep content rules like `.st-panel > :not(...)` off `.bd-layer`). The dock, Start and the menu bar all have
  one, each with its own blur and grain sliders (`appearance.frost.*`, passed as the layer's `blur`/`grain`).
  The old pane code (system blur on a plain window, tiled with `tile_rects`) is gone from the program;
  `backdrop.rs` and `blurlab.rs` are test-only. **Off must mean off**: with `realBlur` false no layer is active,
  nothing is asked, and the capture thread and the magnifier host are never made (`backdrop.mjs` asserts it
  for all three windows). It is off by default until the owner confirms it looks right.- **A `ResizeObserver` reports once on `observe()`**: reacting to that first report
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
  Control, takes the keyboard, and has a blur pane (`"start"` in `glass::sync_all`). It is closed
  by a 25 ms poll of the mouse buttons while open (`watch`), **not** a hook: `outside_click` is a
  single shared instance owned by the menu bar and cannot serve two. Pins are our own list
  (`settings.start`; Windows' real layout is an unreadable file), started from the dock's pins
  once. Files come from Windows' index (`filesearch.rs`, WinRT `QueryOptions`), the account
  from the registry (`profile.rs`). Shortcuts: Ctrl+Alt+Space and Ctrl+Esc. **The Windows key is
  deliberately not taken over**: that needs a permanent low-level keyboard hook (and a stray key
  press to cancel Windows' own Start), which the owner chose not to do for now; PowerToys is not
  installable on their machine.
- **Gliding highlight** (`engine/lens/useGlideHighlight.tsx`): the menu bar lens made general (four
  edge springs, the leading edges quick, stretch capped, shaped like what it sits on, held inside
  `data-lens-clip` lists) **and drawn like it**: *above* the items with a refraction backdrop filter
  (`engine/lens/refraction.ts`, the same recipe as `Lens.tsx`), the item under it enlarged by
  `--lens-scale`. It takes `menuBar.lensGrow/lensMagnify/lensWarp`, so one set of sliders sets both
  lenses. The Start menu uses it for every hover and for the key-selected search result; its own
  `:hover` backgrounds are gone on purpose.
- **The backdrop layer follows what is drawn, not what layout says** (`BackdropLayer.tsx`). A glass moves by a
  transform (the dock bar slides, the Start panel pours in by a CSS animation) while layout does not, so the
  picture is placed from `getBoundingClientRect()` against `offsetWidth` (which gives the scale), at every
  frame while the glass moves (a MutationObserver on the glass and two ancestors, a ResizeObserver,
  `animationstart`: they wake a rAF loop that rests after 24 still frames). A picture is of the glass plus
  `margin` px; when the glass leaves it a new one is asked for at once. It is decoded (`img.decode()`) before
  it is shown, or the glass shows its bare tint at every look; a look that finds the same bytes does not
  swap, and the next is later (up to 7x `interval`). A new picture fades in over the last (`fade`; two
  `.bd-img` children, the newer on top), a surface that opens and stays still takes `looks={2}` and then holds
  (Start), and the grain (`--grain`) is laid over the picture: a blurred picture's gradients show their 8-bit
  steps, which move as the picture changes, and that looked like a moving gradient. `minBlur` keeps whatever
  changes behind the glass a soft wash. Pictures are in physical pixels from the window's top
  left (the 16-byte header) and the page divides by `devicePixelRatio`. **Unverified natively as of this
  note**: Display affinity, Mag host behaviour on a locked screen or secure desktop, and a magnifier already
  running (the Windows Magnifier app) were not tried. "Save a report" in Settings (Glass & light) writes
  `blur-report.txt`: screens, docks, Start, panes, and whether and how fast a picture can be taken.- **Search and Settings (the dock's satellites) hang on `.dock-satellites`**, a layer the size of the bar that
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
  `frame-report.txt`. Grading is the slowest 5% against one frame of the window's own screen.- **Type, numbers, edges, sound** (the "premium" pass, second half). Type: Inter, a bundled variable font (latin subset,
  `@fontsource-variable/inter`, OFL), is the one face (`global.css`); anything that changes uses tabular figures, and
  a changing number is `<Roll text="42%" />` (`engine/type/Roll.tsx`: only the digits that changed move, 9 to 0 keeps
  going up, only transforms run). Edges: `--hair` is one device pixel at any scale (`trackScale` writes `--dpr`), the
  rim is built from it, and a nested shape's radius is its container's less its padding (`--r`/`--pad`, e.g. the
  menu bar's panel and cards, the context menu, the folder flyout; `crisp.mjs` checks both). Pressed and focus-visible
  states are global (`global.css`, low specificity). Sound (`engine/sound/ui.ts`): one key, E (pentatonic: E F# G# B C#),
  a menu is E4-E5, a switch an octave above, the tick near E6; a voice of three partials with a natural decay; a short
  room (convolver) and a compressor under everything; everything halves while the media session is playing
  (`DUCK`). `renderCue` takes any audio context, so `sound.mjs` renders every cue offline, checks key, level, tail and
  ducking, and writes WAV files to `<out>/sounds` for listening. A new cue must have every note in `inKey`.- **First frames, errors, empty states, adaptive glass, night settings** (same pass). A page is clear until its typeface is
  in (`data-ready`, `main.tsx`), a hidden window is ready before it is shown, Start reads its lists when the page starts
  and shows placeholders of the right size until they arrive (`Skeletons`), and the settings window opens in its
  remembered look (`aero-settings-look`) from the first frame. An error reaches a person through `humane()`
  (`engine/errors`, tested by `errors.mjs`), never as Windows or Rust said it. `capture_backdrop` also says how bright
  the desktop behind is (the 20-byte header); the glass thins its tint over a dark one and lays a scrim under it over a
  bright one (`--bd-luma`, a registered property, so it eases). The settings window is night glass by default
  (`html[data-look="night"]` overrides at the end of `settings.css`, on the `clear` material); `sky` is the old look.- **Sounds need no click**: `--autoplay-policy=no-user-gesture-required` is in the shared browser args, or a
  page that has not been clicked (the Start menu, opened from the dock) plays its cues silently.
- **The settings window** is a sidebar and a column of collapsible sections in groups (`sections.ts` is the
  registry: id, title, blurb, search keywords, group). A new section is a `<SettingsSection id="...">`
  **and an entry in `sections.ts`** (otherwise it renders unwrapped and is not in the sidebar). A new
  setting inside an existing section should add its name to that section's `keywords`, which is what
  the search box matches. Folded state is remembered in localStorage (`useSettingsUi`); Colour starts
  open, the rest folded. Long sections are split with `<SettingsSub>`. The restructure was done by a
  script; controls are plain JSX, so moving one is moving its lines.
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
  PNG and kept beside it (`<key>.glass-b1.png`, `tinted-rrggbb` for the colour), so showing it costs
  nothing. It follows the icon's own alpha (rim light from the upper left, sheen, no tile) and never
  makes a pixel more opaque. A change of look or theme colour calls `useDockIcons.reset()` (see `main.tsx`);
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

**Never exercised natively** (needs the owner to try, or a native test they have
agreed to): the Start menu (its window, focus, placement above the dock, closing on a click
elsewhere, the blur pane, Ctrl+Esc being taken from Windows), the Now Playing card while sound is playing (the sound wave with real audio, the
live view of a real window, seeking in a player that allows it; the session read itself works,
checked against Apple Music), the genie minimise and restore (capture, overlay, timing, windows that
refuse `PrintWindow`), Mission Control (the hotkey taking focus, live thumbnails in
the overlay), the flash notice reaching the dock, the privacy registry reads with a
real app on the microphone or camera, switching a radio, setting a brightness, joining a network, the global
hotkeys taking focus, Narrator reading the bars, the blur panes (the first
version showed a black backing; the plain-blur rework is unconfirmed), shaping a
real maximised app on every kind of window, a visible taskbar, multi-monitor
frames, the dock's blur pane following a magnifying dock.

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

## Environment notes (the owner's Windows machines)

- Windows PowerShell 5.1 is the shell. `Get-Content -Raw` then `Set-Content` corrupts
  non-ASCII text (the "…" in menu labels became "â€¦"); edit with the editor tools
  or `[IO.File]::ReadAllText/WriteAllText` with `UTF8Encoding($false)`.
- Inside a double-quoted PowerShell string a backtick is an escape: a backticked
  `` `name` `` in Markdown or a comment becomes a newline plus text. Use here-strings
  or the edit tool for text that contains backticks.
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
- **No window regions any more.** `shaper.rs` only watches (which maximised window fills each opening, and `cover_wanted` 330 ms after it arrived: Windows' maximise animation); the corners window (`frame-corners`) is clipped by `corner_region` to the four pieces outside the opening's curve and draws the colour read by `corner_colours` (`screenpick.rs`, `GetPixel` on the screen: a few pixels of margin either side of each corner) with per-corner clip paths. `clear_old_regions` takes off the regions an older version left on maximised windows. Not verified live with a maximise: ask before running a native test that maximises a window.
- Roll cells: `--roll-h` is rounded to whole device pixels; `scripts/offscreen/clock.mjs` checks it at 100/150/200%.
- The dock window is declared with `"create": false` in tauri.conf.json and made in `setup` with `from_config(...).data_directory(...)`: a config window can only be given a data folder *relative* to the app's local data folder, never the portable one (checked by looking at the `--user-data-dir` of the msedgewebview2 processes: there must be exactly one folder, `data\webview\EBWebView`).
- Frame corners, take two: a maximised window is drawn exactly in the opening, whatever `DWMWA_EXTENDED_FRAME_BOUNDS` says (File Explorer reports 8px more at the top: its resize border, which is not drawn; checked pixel by pixel, and cropping it changes nothing). So the pieces cover the opening's corners (`cover_rect` = the opening). Colours are read mid-margin (`pad / 2` out, clear of the glass border and the menu bar) and again every 1.5 s while covering (`start_repaint`), so a new wallpaper is picked up. With the glass border on, the pieces draw its arc (`BevelGradient` is shared with the ring).
- **Quick native build without the CLI:** `cargo build --release --features tauri/custom-protocol` (plain `cargo build --release` makes a build that loads pages from the dev server: every window shows an error page). Stop the running copy before copying the exe over it.
