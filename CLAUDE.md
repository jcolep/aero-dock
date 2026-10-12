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
- **Performance rules.** WebView2 runs with `--disable-gpu` (`tauri.conf.json`,
  asserted by a test), so everything is composited in software, and the cost of an
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
- **Real blur needs windows of its own.** The windows are transparent web views, so
  `backdrop-filter` can only blur page content. `backdrop.rs` makes a bare popup
  pane per bar with the system's blur on, shaped by a region and kept just under
  the window it backs. It is the *plain* blur, not acrylic: acrylic added its own
  dark tint that read as a black backing under a dark theme. It is off by default
  until the owner confirms it looks right.
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
- **Blur panes follow what is drawn, not what layout says** (`glass.rs`, `backdrop.rs`). A dock's bar grows
  and shrinks by a transform while layout jumps to the new size at once, so a pane placed from layout
  offsets was a stale rectangle behind the moving dock. The dock page now reports `getBoundingClientRect()`
  at every frame while anything moves (`DockBar.tsx`: ResizeObserver + MutationObserver wake a rAF loop that
  rests after ~30 still frames) and Rust updates only that dock's pane (`sync_dock`, not `sync_all`). The
  Start menu does the same for its panel (`report_start_pane`), and the pane is only shown while the panel's
  opacity is at least 0.72, so no blurred rectangle is left where a fading panel was. Panes are one pixel
  inside the thing they back, are always redrawn when shaped (`SetWindowRgn(..., true)`), and take their
  scale from the page's `devicePixelRatio` / `GetDpiForWindow`, not from the toolkit's cached scale.
  **Unverified natively**: the owner saw a square blur box round the Start menu on one monitor (Dell,
  primary) and not on the other (Samsung); the cause was not found (a region not honoured by that
  display's driver is one guess). If it persists, look for the "could not be shaped" warning in the log.
- **Sounds need no click**: `--autoplay-policy=no-user-gesture-required` is in the shared browser args, or a
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
