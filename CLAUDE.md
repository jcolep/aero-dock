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
- **Keyboard access** is by global hotkey (Ctrl+Alt+M menu bar, Ctrl+Alt+D dock;
  `hotkeys.rs`, the system's hotkey registration, not a hook). The bars are built
  never to take the keyboard, so `keyboard.rs` makes the window activatable for the
  visit and `set_dock_focusable(false)` restores it. Real focus is what lets
  keystrokes and screen readers work.
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
agreed to): switching a radio, setting a brightness, joining a network, the global
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
