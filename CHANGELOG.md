# Changelog

All notable changes to Aero Dock are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Liquidock (October 17)

- **The running-app mark's color is a setting now** (Settings › Dock › Running app mark, the same color picker
  the Control Center's Wi-Fi/Bluetooth circles use): the theme's accent, or any color of your own. The ghost
  (the ring under whatever the pointer rests on) stays white regardless, as asked — it was never touched by the
  theme either. Fixed a bug along the way: the mark's own dark edge and glow were hardcoded to a fixed green,
  left over from before the theme-picker existed, so even "the theme's color" was only half right until now.
- **The window frame's glass border is lit the way the rest of the app is** — one light, high on the upper left,
  the same `--rim` every glass surface (including the menu bar's own border) already uses — instead of its old
  light-from-directly-above gradient, which was a second, different recipe nobody had asked for.
- **The settings sidebar no longer closes when you click a section in it.** Only the pointer actually leaving it
  (or the header button, for one brought out by hand) closes it now, matching how it already behaved when you
  didn't click anything. Found and fixed two quieter bugs on the way: clicking a section left that button
  focused, and the close-when-the-pointer-leaves logic treated any focus inside the sidebar as "still using the
  search box" and refused to close, which would have silently stopped the sidebar closing on its own the first
  time anything in it was clicked; and the sidebar's "is the pointer near it" tracking, based on the panel's own
  hover events, could be fooled by its own slide-in animation sweeping past a pointer that was resting still right
  at the window's edge, closing and reopening it over and over for as long as the pointer stayed there without
  moving further onto the panel. That tracking now reads the pointer's real position against the panel's live
  position instead (the same fix already used for the dock's own auto-hide edge), which an animation underneath
  cannot confuse.
- **The sliding lens is in the settings window now too**, on the sidebar's own list of sections — the same glass
  that already travels the menu bar's buttons, the Start menu's rows and the dock's clock/status cluster, and the
  same three sliders (Settings › Menu bar) set its grow/size/warp here as well. The sidebar's own flat `:hover`
  background is gone, same reason the Start menu's was: the lens is the hover feedback now, not a second one.
- **The click-effect settings preview works now.** It never actually drew anything: `track()` was already
  returning stage-relative coordinates, and `toCanvas()` subtracted the stage's position again on top of that,
  landing every effect's origin far outside the small preview canvas — no error anywhere, since an origin outside
  the canvas just draws nothing. Found off screen, not guessed at: the effect was genuinely running every frame,
  with a sensible-looking rect, for its whole lifetime — it just never once landed inside the canvas it was
  drawing to. The real dock was never affected; only this preview built its own (wrong) coordinate math.
- **The menu bar's gliding lens, the widget cluster's and the Start menu's, were tested rigorously** (asked for
  explicitly, after "it does some weird stuff"), across rapid reversals, a menu staying open while hovering a
  different button, floating through the gaps between buttons, growing from a narrow button to a much wider one,
  and keyboard selection in the Start menu's search. Most of what looked wrong at first was a false alarm from
  the test itself (a single pointer jump instead of a swept movement does not reliably fire a real `pointerleave`
  — not a concern for an actual mouse, but it produced a misleading reading more than once before that was
  caught). Two real, smaller things came out of it, left open rather than guessed at: the widget cluster's lens
  settles about 5px wider than the target button specifically when growing from a narrow one to a much wider one
  (not present shrinking the other way); and the Start menu's arrow keys only ever navigate while a search query
  is typed — the default view (pinned tiles, Recommended) has no keyboard navigation at all. Both are plausibly
  intentional, not obviously bugs, so left for a real decision rather than changed on a guess.

### Settings search finds settings, and a backup that carries the widget pictures (October 21)

- **Search looks at the settings themselves.** Typing in the settings window's search box narrows the page to the rows
  that answer it (every word in a row's label, hint, group heading or section title: "dock tint" finds Tint in the
  dock's section), puts away groups and sections with none, marks the words found, lists only those sections in the
  sidebar, and says "3 settings in 3 sections". A section named by the search whose rows say nothing more particular is
  shown whole, as before. It works on what is on the page (`rowSearch.ts`), so a new setting is found without being added
  to a list. `settingssearch.mjs`.
- **Export saves the whole setup.** The file (`liquidock-setup-<date>.json`, in Downloads) now holds the settings and the
  pictures the Picture widgets show (base64, `core::bundle`), which used to be left behind. Import reads that or an older
  plain settings file, puts the pictures in this machine's media folder (names that could mean another place are
  refused), points the widgets at them, and keeps what you had as `settings-before-import-<time>.json` beside the settings so
  it can be taken back; the status line says what happened. The row says what it does ("Back up or share your setup").
- **The glass heals itself.** Lock, unlock, resume from sleep, a display change and a compositor change (the machine
  hears them through the hidden shell-hook window) re-place every glass window, now and again 1.5 s later (that one a
  pixel wider for a moment), which is what a menu opening did by resizing the page's window; each event is written to
  `trace.log` (turn it on with `trace.on` in the data folder) with how many windows were refreshed. Not yet seen to
  cure the menu bar's glass going off, which was not reproduced here: lock the machine once with this build and read
  the trace.

### High quality icons (October 21)

- **Settings › Appearance › High quality icons** (off by default). Every app icon is read at 256 px and was shrunk by the
  browser as it was drawn (26 px in the dock, 40-odd in Start). On: each window asks for the icon at the size it shows
  it, a copy made once with a Lanczos3 resample and kept beside the picture (`name-p48.png`), so the browser draws it
  about 1:1. The dock's size is its icon size swollen by magnification, times the screen's scale (a 26 px dock at 1.3x
  swell on a 1:1 screen asks for 34 px); Start 64, the overview 96, the menu bar's media card 48 (CSS px, times the
  scale). Everywhere app icons are shown follows, as they all come through the same place (the dock, its flyouts, Start,
  the overview, the media card). A copy is one of 32, 48, 64, 96, 128, 192 px, the nearest above what is wanted, so a
  handful serve every dock size; wanting more than 192 uses the 256 px picture.
- The resample weights colour by coverage (premultiplied alpha), so an icon's edge does not pick up a dark or pale
  fringe from the transparent pixels round it, and works in floating point (the `image` crate clamps float pixels to
  0-1; a test caught the first version scaling in 0-255). Also lighter in memory: a 48 px picture decodes to 9 KB, the
  256 px one to 256 KB.
- Changing the setting, the dock size or the magnification makes each window ask for its icons again (the same reset
  the icon style uses). `iconquality.mjs` checks the sizes asked for (scales 1 and 1.5, no swell, too big, off);
  `cargo test` covers the step rounding, the fringe and the cached copy.

### The dock settles without a shift, and its glass leaves with it (October 21)

- **No more drop half a second after the dock arrives.** The dock's fade and move were handed to the browser's own
  animation engine (the bar, and the layer of satellite buttons over it), which makes each a layer of its own while it
  plays; when they ended, about 0.75 s in, the layers were redrawn and every icon landed on a whole pixel a few tenths
  from where it had been drawn. Each item rounds its own way, which is why the Recycle Bin could stay put while the
  app icons and status icons seemed to drop. Both are now driven frame by frame (an `onUpdate` handler on the motion
  element is all it takes), so nothing is rebuilt when they finish. The reveal spring also runs on to its end instead
  of stopping a hair short and jumping the rest, which was a few tenths of a pixel at the top of the bar.
- **The frosted glass hides with the dock.** It used to be taken at the first frame of going, leaving the bar bare and
  looking different as it left. It now stays until the dock has gone (the window shrinks then), following the bar's
  shape and fade exactly as it does coming in. The glass sheen keeps going until then too.
- `dockhideglass.mjs` checks, for every preset, that in the first 250 ms of going the glass is there, on the bar's
  shape, and fading with it, and gone at the end. `revealpix.mjs` films an icon, a status icon and the bin through a
  reveal (display scaling, magnification and the preset can be set) and reports any step; it only reports, because its
  figure also moves with the glass tint.
- **The bar's transform now always carries a scale of 1.0001** (`keepScale`, a Motion `transformTemplate`): that is what
  stopped the shift on the real display, tried live first. Motion drops the scale term when the spring finishes, and
  the bar, drawn at a scale a hair under 1 until then, was redrawn at exactly 1, every icon and edge landing on its own
  whole pixel (a diff of frames either side showed outlines on everything at once, about 500 ms after the reveal
  began). Kept at a scale 0.0001 off, it is drawn the same before and after (0.06 px over the bar).
- **Also: the Pop's overshoot.** Filmed on the Dell
  (`scripts/native/dockfilm.ps1`, which moves the real pointer over the dock's edge and grabs the screen every few
  ms; `dockrec.mjs` records the page's own geometry alongside, `inject.mjs` tries a stylesheet on the live page): the
  page's layout, window and animations were all still from 380 ms on, but the bar's top read 611.71 at 240 ms and
  settled at 612.24 by 450 ms. The reveal spring overshot its size by ~1.5% (scale about the screen edge, so the top
  of the bar rose half a pixel and sank back), and on a 1:1 display a slow half-pixel settle is drawn as one sudden
  1 px drop when it crosses a rounding boundary, about half a second in. The icons and status icons near the top of
  the bar cross it, the Recycle Bin low in it does not. `character.reveal` is now just over critically damped
  (damping 32), so it springs in and stops at its size. (A permanent compositor layer on the bar, `will-change:
  transform`, hid some of it and a resting `translateZ(0)` did nothing; neither is kept.)

### Snapping for desktop widgets (October 20)

- **Optional snapping** while a widget is moved or resized (Settings › Widgets, off until asked for). To a **grid** (its top
  left on a line; resizing lands the bottom right corner on one), and to **the other widgets and the screen**: the
  edges and middles of the others, and the screen's edges, pull a widget to them. Alignment comes before the grid, so a
  widget set beside another is not pushed off its edge by a grid that disagrees.
- Settings: snap on or off, grid on or off and its size (8-200 px), line up on or off, how near is near (3-30 px), the
  room from the screen's edge (0-120 px), snap resizing too, show the grid while moving, and **Put every widget on the
  grid** to tidy what is already there. **Alt** held does the opposite for one move (free where it snaps, snapping
  where it does not).
- The grid is drawn over the desktop while a widget is held (and only then), and a line is drawn where something lines
  up. Only the overlay's own edges are the screen's: on more than one monitor the edge between two is not one.
- `snap.ts` is plain number-in, number-out; `widgetsnap.mjs` checks the grid, alignment with its guide, the margin,
  Alt both ways, resizing and the grid showing only while held.
### Sixteen new desktop widgets, with a Picture / GIF one (October 20)

- **Picture / GIF**: your own picture or GIF in a pane of glass, chosen in Settings (kept in the data folder, so it
  survives the file moving; up to 40 MB, GIF, PNG, JPG, WebP, APNG, AVIF, BMP). Settings: fit, size in the pane, shape
  (rounded, circle, square), room round it, opacity, look (gray, sepia, invert), brightness, mirror, a glow in the
  tint color, a caption and its size, and **play only while the pointer is on it** (a still of the first frame the rest
  of the time, which also stops the page redrawing it).
- **Notes** (paper colors, text size, typewriter font, spell check, word count), **Checklist**, **Counter** (a daily goal
  with a ring), **Timer** (Pomodoro with long breaks, a countdown or a stopwatch, with a chime), **Countdown** (days, or
  days to seconds, until or since a date), **World clocks** (up to six, with little faces), **Time progress** (day,
  week, month, year, as bars or rings), **Date**, **Flip clock**, **Moon** (phase, how much is lit, the next full or
  new moon, worked out on the machine), **Quote** (built in or yours, daily / hourly / every 10 minutes), **Dice and
  coins** (dice, a coin, a number, the 8 ball), **Calculator**, **Volume and brightness**, **Battery**.
- **Every widget** now has a corner radius (the clickable part follows it), an option for no glass behind it, and a soft
  shadow. The Settings list of widgets to add is grouped (Pictures, Time, Notes, Fun, System, Desktop), and each
  widget's own settings are drawn from its description in `desktop/registry.ts`.
- **Fixed**: a widget's glass was only as tall as its content (a stylesheet that loads later made it
  `position: relative`); it fills the widget's frame now.
- A widget with a field to type in (Notes, Checklist) takes the keyboard while it has the focus (the overlay never
  does otherwise). **This part is not yet tried on the real desktop.**
### Sounds for everything that should have one (October 20)

- **Minimising has its own sound**: a sweep that falls into the icon and lands on a soft note; a window coming back, or
  forward, has the same turned over. A click on an icon used to play the "app opening" arpeggio whatever it did; now that
  is only for an app that opens, and Rust says what a click did (`minimized`, `restored`, `focused`) so the page plays
  the matching one. The context menu's Minimize and the menu bar's Hide / Hide Others / Show All too.
- **Touching the drop makes a sound**, in the dock (the Liquidock button) and the menu bar (the logo): a drip that falls
  and rings. The menu bar's lens no longer ticks over it (a button can ask for its own cue with `data-cue`).
- **Moving apps in the dock and Start**: picked up (a short rise), each place passed (a tick), put down (a soft
  thump), pinned (a rising three notes), unpinned (falling, airy). The same for pinning from a menu, by dropping a
  file on the dock, and from Start's menu.
- **Menus and flyouts**: the dock's right-click menu, folder and stack flyouts, the dock's own menu, the modes flyout,
  Start's account / power / item menus, and Mission Control open and close; the previews of a window's apps come up with
  a barely-there tick. The items inside menus tick as the pointer reaches each (dock and menu bar).
- **Settings**: switches go on and off, choices and sliders notch, buttons lift, animation and color choices notch.
- **Also**: the Control Center's sliders notch as they move; the media card's buttons (play/pause and shuffle/repeat
  as switches, the rest a lift); the clock, status chips, gear and Recycle Bin on the dock (opening, muting, emptying);
  an error toast has a low short note and an info toast a soft pair; an app asking for attention chimes once, with its
  first hop (not at every reminder); an app opened from Start has the launch arpeggio.
- Ten new cues, all in the key of E; `sound.mjs` also checks that no two cues are the same sound, and `soundmap.mjs`
  checks what plays for each interaction (the engine logs its cues when `__aeroCueLog` is set).
### The icons passed while dragging glide into place (October 20)

- **Dock**: the icons a carried icon passes now slide into their new places over a few frames. Those after the divider
  (the unpinned running apps) used to jump a whole slot at once; only the pinned ones glided. They are moved by a slide
  of our own now, the same for every icon and for the divider.
- **Start**: the tile passed jumped a whole tile when the first swap of a drag happened; it glides now too.
- **A long name on the tile being carried** in Start stays inside it: two lines, then an ellipsis (a single very long
  word is cut with one too); the same on the tiles at rest.

### Dragging in the dock and Start; the dock coming in; the menu bar at launch (October 20)

- **Dock apps drag across the divider**: pinned apps, the divider and running apps are one list now, so an icon carried
  from one side to the other moves past the divider like any neighbour and the icons slide aside to make room. Let go
  on the pinned side, a running app is pinned there; let go on the running side, a pinned app is unpinned (it stays as
  a running app if it has windows, and goes, with "Remove from Dock" shown on the way, if it has none). The icon is the
  same one before and after (it used to vanish from one side and pop into the other), stays exactly under the pointer,
  lifts a little and leans into the way it is going, and springs into its place when let go.
- **Start's pinned grid**: the carried tile leans with its speed, the place it would go shows as a soft empty well, and
  it settles with a little give.
- **The dock coming in no longer shifts its icons**: with Pop, the bar went 6.5% past its size from the screen edge, so
  the icons rose ~4 px and sank back a moment after they seemed to arrive (now about half a pixel); and every icon was
  drawn drifting ~20 px inside its glass as the dock came in (a re-fit by the drag library to the bar's changing scale,
  there since the icons were first draggable).
- **The menu bar stays at the top at launch**: a move into the frame's opening that the shell made without asking first
  got past the pin; the bar now notices it has been moved and goes back. A start that failed with "the underlying
  handle is not available" now carries on instead.

### Start: drag to arrange pins; search that finds apps the way Windows' does (October 20)

- **Drag pinned apps** in Start to move them; the others slide aside to make room. Drag one out of the grid to unpin it
  (a red minus shows it will go). Drag an app from All apps and Pinned comes up so it can be put down among the pins.
  A click still opens. "Move left" and "Move right" in a pin's right-click menu do the same from the keyboard.
- **Search finds apps as Windows' Start search does**: by initials ("vsc" for Visual Studio Code, "rdc" for Remote
  Desktop Connection), the starts of words ("stu co"), the program's own name ("code", "msedge", "winword", "mstsc"),
  and with a slip of a key ("vsiual", "termnal"); better kinds of match come first.
- **It learns**: what you open after typing some letters comes first for them the next time (and for the shorter
  starts you typed on the way). Settings › Start menu › Search: Learn what I open, Forgive typos, "Search Windows" at
  the end, and Forget.
- **"Search Windows for …"** is the last result: it opens Windows' own search with what you typed (there is no public
  way to hand it a query, so Win+S is pressed and the text typed once its box is in front).

### Scroll arrows in Jump Lists; the dock's ends even (October 19)

- **A Jump List that scrolls shows a small chevron in its fade**: down while there is more below, up once it has been
  scrolled, each gone at its own end.
- **The dock's two ends are always even**: the empty glass before the first thing in the bar now matches the space
  after the last (the Recycle Bin, the clock or the gear), whether the Liquidock button is showing, out of sight, off,
  in a well or resized. It was about 6 px narrower at the start when the button was hidden. They stay even while the
  button comes in and goes back into the dock too: the drop no longer drifts in from the end as it goes, and the start
  no longer comes out a few px short after the pointer has brought the button in.

### The drop's size and colour; text left alone under the lens (October 19)

- **Settings › Dock items › The Liquidock button**: a **Size** slider (60–160%) and a **Drop colour** that overrides
  the theme's colour for the drop in the dock.
- **Text under a lens looks exactly as it does without it**: the lens (menu bar, Start, the settings sidebar, the
  dock's clock and chips) is now drawn behind the items, so its filter no longer thinned, recoloured or bent their
  text, and only symbols swell under it, never text.

### Polish (October 19)

- **The Liquidock button's drop is shaded for its size**: at icon size the foot's bright pool, glint and dark rim read
  as a smudge; it now has one soft catch of light at the top and a faint glow at the foot (the large drops elsewhere
  are unchanged).
- **"Comes in near the start" shuts smoothly**: the dock no longer sprang back to its open width for a moment after
  the drop had gone.
- **Closing a window from its preview** takes the shelf away at once, gracefully, instead of leaving a little pill of
  glass over the dock for a moment.

### The Liquidock button, in the dock (October 19)

- **A solid coloured drop by default**, easy to find over a white window: the drop's body in your theme colour. Two
  other looks: the frosted drop with a fine outline, or in a well pressed into the bar (with its own colour).
- **Its own click effect**, chosen apart from its hover effect, with the same tuning.
- **A divider** between it and your apps, as in the mockups.
- **Where it is**: always in the dock, or out of sight until the pointer nears the dock's start; then the dock grows
  to take it and its divider in, and gives them up again when you move on past the divider, looking as if it had no
  button at all. (The Settings button keeps its own reveal at the clock end.)

### The Liquidock button's hover, readability strength, menus that open whole (October 19)

- **The Liquidock button plays the click effects on hover**: Press Dimple, Edge Halo, Shine Sweep or Light Bloom, on the
  drop's own outline, with their own speed, opacity, size and colour (Settings › Dock items › On hover). Its old
  glint, swell and rim trace became Shine Sweep, Light Bloom and Edge Halo.
- **Readability strength**: one slider for how dark the glass goes over a light background, for the Start menu, the
  window previews and the dock's menus (Settings › Glass & light › Readability, where the switch now lives too).
- **An app's menu opens with its Jump List in it**: lists are read ahead (the pointer on an icon, and every app a
  little after start) and the last one shown at once while a fresh one is read behind it.
- **No half rows**: a Jump List that scrolls ends on a whole row and fades at the edge; the line under it stays put.

### Dock menus (October 19)

- **An app's menu is never cut off**: with a long Jump List the menu keeps to the room above the dock, and the list
  scrolls while the menu's own items stay in view.
- **"Dock settings…" is gone from an app's menu, and "Audio output" is an option** (Dock › Behaviour, off).
- **The dock's menus stay readable over a light window behind them**, as the window previews and the Start menu do.
- **No white flash opening Settings**: the first "Liquidock Settings…" after the window had been closed showed a frame
  of white before its page drew; it now opens on its own colour once the page has loaded.

### The settings window, tidied and restyled (October 19)

- **One look with the rest of Liquidock**: groups and cards have the dock menus' corners (14px) and the glass's light
  on their edges, as the sidebar and the menus do; every control inside has the same 8px corners; the sidebar the
  Start menu's 16px.
- **A choice slides**: in every segmented choice, what is chosen sits under one piece of glass that glides to the new
  choice. The animation pickers' choices look and behave the same way.
- **Tidier sections**: hardware acceleration and frame timings moved to General › Performance; the click effect's
  tuning is inside its card; Dock items, Start menu and Window frame have headings; "Hide for full-screen apps" is
  with the bar's other settings; the lens sliders say they set every lens.
- **The Start menu: the dock while it is open** (Usable or Hidden). Usable, the dock comes up and can be clicked (it
  used to slide away again under the menu's invisible margin, and a click only closed the menu).
- **The Start menu's names no longer re-render** as the lens arrives: only the icon swells.

### Jump Lists, readable previews (October 19)

- **Right-clicking an app in the dock shows its Jump List**, as the taskbar does, above the menu's own items: Remote
  Desktop's recent connections, VS Code's recent folders and files and its "New Window", a browser's frequent sites,
  File Explorer's pinned and frequent folders, an app's recent documents. A click opens it the way the taskbar would
  (a file in an app's list opens in that app). Read only; nothing is written to an app's list.
- **The window previews keep their titles and Close readable** over a light window behind them, as the Start menu
  does (the same "Keep text readable" setting).

### Fixes (October 19)

- **Restart Liquidock works**: it showed "Windows cannot find '\\'" and did not come back.
- **The dock's menu opens only on the dock's empty glass**, not on an app, the Recycle Bin (whose right-click empties
  it), the clock or the status icons.
- **The menu bar names the app in front properly**: "Microsoft Teams" and "Microsoft Outlook", not "Ms-teams" and
  "Olk" (each program's own name for itself; File Explorer for Explorer). The same names in Mission Control and the
  dock's tooltips.
- **The menu bar's lens is as it first was**: between buttons it stays on the one it was on until the pointer reaches
  another or leaves the bar, instead of floating over empty bar in the last button's shape.
- **The Start menu's lens is never left floating** on nothing as it opens: a tile met while the menu was still rising
  put the lens where the tile was in the shrunken panel.

### Click effects, tuned (October 19)

- **Each click effect can be tuned** under its picker in Settings › Animations: speed, opacity, size (the halo's line,
  the shine's band, the dimple's ring, the bloom's reach) and color (white light by default; the theme's color for the
  bloom). The preview plays again a moment after a slider stops.
- **Edge Halo is only the outline**: on glass-look icons (see-through inside) its light no longer swept across the
  middle like a clock's hand. The line is thinner and the lap faster.
- **The Settings sidebar's lens stays on the row under the pointer** when the list has been scrolled (it sat as far
  below it as the list was scrolled).
- **The menu bar's lens goes when the pointer is on nothing**: over the bar's empty space it fades a moment after,
  and leaving the bar by any route lets it go (it could stay lit, in the last button's shape).

### Click effects (October 19)

- **Edge Halo traces the icon's own outline**, like the Liquidock button's rim trace: a bright line with a fading
  tail runs once round the icon's actual shape, then the outline glows a moment and fades. It used to run round the
  icon's square box, which for most icons (with a margin round their picture) was empty space.
- **Light Bloom can be seen**: a soft light swelling from behind the whole icon, past its edge, instead of a small
  squashed flash at its foot that the icon mostly hid. It follows the Bloom amount slider.
- **The preview's middle icon is its neighbours' size** (it was half), and the preview no longer cuts off a glow.

### Full screen (October 19)

- **The menu bar gets out of the way of a full-screen app** on its monitor (a YouTube video, a game, a slideshow) and
  comes back when it leaves full screen, is minimised or closes. A maximised window keeps the bar. Settings › Menu bar ›
  "Hide for full-screen apps" (on).

### Lenses (October 19)

- **The Settings window's sidebar lens is the row now**: the same size as the section it is on, gliding straight up
  and down the list with a little stretch, and magnifying the section's icon. It used to be bigger than the rows (lying
  over the ones above and below), narrowed and slid sideways as it travelled, and grew the whole row from its middle so
  the icon jumped left and the row poked out past it.
- **The Start menu's lens no longer turns dark over light windows.** With "Keep text readable" darkening the glass,
  the lens drew that darkening twice and became a near-black slab (seen on the Dell, over DriveWorks).

### The Windows key (October 19)

- **The Windows key can open Liquidock's Start menu** (Settings › Start menu › "The Windows key opens it", off until
  switched on). Press and let go of it on its own for Liquidock's; Ctrl+Win opens Windows' own. Win+E, Win+D and
  every other Windows shortcut work as before. While an app running as administrator has the keyboard, the key opens
  Windows' menu.
- **Fixed the same day:** pressing it while Liquidock's own Start menu (or another of its windows) had the keyboard
  opened Windows' menu as well, which then took the keyboard and closed Liquidock's a moment later.

### The Liquidock button (October 19)

- **The dock's search button is now the Liquidock button**: Liquidock's frosted drop on its own, with no glass circle
  behind it, in the theme's color, opening Start the way the Windows button does on the taskbar. Under the pointer a
  glint sweeps across it; Settings › Dock items › "It shines with" offers a swell of light at its foot or a line
  tracing its rim instead.
- **The app's own icon is the drop now** (the Settings window in the dock and taskbar, the exe in Explorer). New icon
  files never reached the exe before: the build didn't notice they had changed.

### The dock's own menu (October 19)

- **Right-click the dock's empty space for its menu**, as on the Windows taskbar: Liquidock Settings, switches for
  auto-hide and magnification, Cascade windows, Show windows stacked, Show windows side by side, Show the desktop,
  Task Manager and Taskbar settings. The window arrangements and Show the desktop act only on the apps' windows on that
  monitor, never on Liquidock's own (Show the desktop chosen again brings them back). An icon keeps its own menu.
- **An icon's right-click menu no longer turns into the window previews** if the pointer rests on the icon: the
  previews that come up on hover used to replace the menu after half a second.

### Liquidock (October 16)

- **Press Dimple and Shine Sweep clip to the icon's own drawn pixels now, not its tile.** Most real icons have
  some empty padding around their actual glyph (apps draw their own icon differently), and the first version
  pressed or swept across that empty margin too, which read as doing something to the tile, not the icon. They
  now mask themselves to exactly the icon's own alpha, accurate to its real silhouette, feathered at its real
  edges — confirmed with a high-contrast test icon off screen, not just by reading the code. Edge Halo stays as
  it was: it traces the tile's edge on purpose, and masking a stroke this way wouldn't trace the icon's real
  outline, just cut away whatever part of it happens to cross opaque pixels.
- **The click effect is a setting now**, with four looks (Settings › Animations › Click effect, each with a live
  preview): **Press Dimple** (new default) presses the icon's own glass in at the click point and releases with a
  bright recoil ring; **Edge Halo** traces once around the icon's outline; **Shine Sweep** crosses it with a band
  of light; **Light Bloom** is last round's glow behind the icon, kept as a fourth option. The first three are
  clipped to the icon's own shape rather than the dock's glass, and track the icon live, frame by frame, so a
  still-magnified or shrinking icon carries the effect with it rather than leaving it anchored to where the icon
  was at the moment of the click.
- **The click ripple behind a dock icon is a soft light bloom now**, not three overlapping rings. Six real
  Canvas 2D effects were built and compared side by side (an artifact made for that comparison); this one won —
  quieter, and reads as light catching the glass rather than water or impact. Same cost to draw, same place in
  the code (`ClickRipple` in `fx2d.ts`, still fired by the dock's `ripple` effects-bus event).
- **The drop of glass is frosted, and truly transparent.** Five real rendering techniques were built and compared
  side by side (an artifact made for that comparison); the mark is now a turbulence-and-blur diffusion over true
  alpha fill — whatever sits behind it shows through, softened — rather than an opaque shape shaded to look
  translucent. Everywhere the mark is drawn, and in the app's own icon files, regenerated from it.
- **How close the pointer has to get before Search and Settings bud out of the dock is a setting now**
  (Settings › Dock items › How close to the end), not a fixed 80px. The default asks for a more deliberate approach
  (40px): further to travel toward the dock's end before the button appears. Fixed a bug where the right-hand
  (Settings) zone ignored this setting and triggered the moment the pointer reached the clock/status cluster,
  well before the dock's actual edge — both ends now measure from the bar's own edge, as the slider says.
- **Search and Settings arrive the way every other flyout does.** Their own bespoke squash-and-stretch entrance is
  gone; they bloom open with the dock's one settle spring, same as a menu or a panel does. Their whole look and feel
  is still under review.
- **The Start menu stays readable over light backgrounds.** As it opens, Liquidock looks at what is behind it, region
  by region, and darkens the glass only where that is light (a white page behind one half darkens that half), with a
  soft shadow under the text when anything is light enough to need it. Measured once as it opens, so nothing shifts
  or flickers while it is open. Settings › Start menu › Keep text readable over light backgrounds.

- **A new mark: a drop of glass**, tinted with your theme color in the menu bar, the settings window, the welcome card
  and the tray. The app's own icon is the drop in silver.
- **Window previews say a window's title once.** One window: its title at the top and a close bar of glass as wide as
  the picture under it, warming to red under the pointer. Several: the app's name at the top and each window's title
  over its picture. The close button's tooltip, which came up behind the live picture and stuck there, is gone.
- **The menu bar's lens keeps up on a long way across the bar**: it glides along under the pointer between buttons
  (stepping aside over the media pill) instead of waiting at the last button and then standing stretched and off its
  target for a second. It also no longer appears half its width off for its first few frames.
- **"Color", not "colour"**, everywhere in the app.
- **Aero Dock is now Liquidock.** Everything you see says so; your settings and data are where they were.
- **A new settings window**, laid out like a Mac's System Settings: a sidebar of sections with colored icons and a search,
  and one section at a time, its settings in rounded groups with a short line under each saying what it does. It fits
  any size: controls drop under their labels when there is no room, and a narrow window slides the sidebar away, to
  come out when the pointer reaches the left edge (or always, if you choose: General › This window › Sidebar).
  Messages appear at the foot of the page, whichever section you are on.
- **The dock's switches that had gone missing from settings are back**: auto-hide, floating, reserve screen space,
  magnification, show running apps, icon spacing, dock padding and the attention bounce.
- **Hover effect** (Animations): menu items, the dock's right-click menu and the Control Center's sections magnify a
  little under the pointer, as the Wi-Fi and Bluetooth tiles do; or lift, glow, or do nothing.
- **The menu bar's lens no longer flies off when you press on an item**, and lets go when you do, wherever that is.
- **Removed:** the settings window's Classic sky look and the Classic dock material. A dock set to Classic becomes
  Liquid, which kept its colours.

### Fixed and added (October 15)

- **Apps opened or brought forward from the dock no longer show their keyboard shortcut badges.** The dock pressed a hidden Alt key to be allowed to bring a window forward, and Office, File Explorer and others answer Alt by showing their shortcuts. It now sends a mouse move of nothing instead.
- **The frame's glass border shows on all four sides again.** The frame's page could take its size before the window was made the size of the screen, and drew the border's right and bottom edges where they were clipped away.
- **The frosted glass under the menu bar's dropdowns comes in as the menu lands,** and fades in softly (260 ms, eased), instead of popping in a moment after the menu had finished opening.
- **A new way to mark running apps** (Settings > Dock > Running apps): one mark, a pill or the glowing dot, under the app in front. Point at another app and a ghostly outline of it slides over; click, and the mark itself travels there. Glide, Bounce, Snap, Float or Fade, chosen separately for the mark and the ghost. The dots stay the default.
- **The mark and its ghost keep to their own track** along the bottom of the dock: when an icon jumps on a click, the mark under it stays level instead of jumping with it.
- **With the focus mark, the other running apps can still show they are running** (Settings > Dock > Running apps > Running apps show): faint glowing marks of the same shape, which the mark glides over; a soft halo of light behind each running icon; the apps that are not running dimmed; or nothing.
- **The frosted glass on menus, flyouts, previews and labels comes in once and stays.** It came in as a menu all but landed, went away at the last hair of its spring, and came back a few frames later. Once in, it now follows the surface until it leaves, fading and shrinking with it on its way out.
- **Smooth to the fraction of a pixel everywhere it moves:** the menu bar's lens, the gliding highlight in Start and the panels, the dock's app names as icons swell, the Now Playing progress and its knob, the Control Center memory bar, the dock's per-app volume bar, the desktop stats widget, and the running dot's swell on focus. Each moved by layout and stepped a pixel at a time; each now moves by transform.
- **The dock's glass grows and shrinks smoothly with magnification, and its frosted glass keeps up.** The bar's glass is now a layer of its own that grows to hold the swollen icons to the fraction of a pixel; the bar itself, and everything in it, no longer changes size. The frosted glass under it is told where it is in the same step that moves it (it could look a frame late and trail the bar's ends).
- **"Tinted with the theme colour"** replaces "Tinted like the menu bar" (Settings > Dock > Shape): on, the dock's glass takes the colour from Colour & materials (at its Tint); off, it is plain glass.
- **Magnification is smooth to the fraction of a pixel.** Icons took their swollen room by layout, which is painted on whole pixels, so as the dock swelled every icon stepped a pixel at a time while its drawing grew smoothly, and the last icon shimmered as the pointer moved beside it. Icons now keep their place and slide by a sub-pixel translate; measured from screenshots, the last icon is painted within 0.07 px of where it should be (it was up to a whole pixel off, then jumped).
- **Magnification no longer shakes**, most noticeable moving slowly near the ends of the dock. The bar stays centred, so as icons swell they all slide, and each icon measured the pointer against where it had slid to: the swell moved the icons, which moved the swell. Icons now measure against where they rest, so the swell follows the pointer alone. Measured frame by frame, every icon now swells and settles once at every speed and with every magnification feel.
- **Stretch with speed** (Settings > Dock > Running apps): the focus mark and its ghost draw out longer the faster they travel, longest about midway, and gather back in to their own size as they arrive, thinning a little as they stretch. A long jump across the dock stretches more than a hop to the next icon.
- **An auto-hiding dock only stays or comes back when the pointer is on the dock itself** (the strip from the screen edge to just above the bar), not anywhere in the much taller room kept above it for magnification and menus.
- **A Tint for the dock,** and a switch to tint it like the menu bar, so the dock, the bar and the frame read as one glass.

### Frame corners, rebuilt

- **The rounded corners over maximised and snapped apps are drawn natively.** Four tiny windows per monitor, drawn pixel by pixel, replace the web page that drew them. They are in place the moment they are wanted, look the same, and the two page processes they needed are gone (about 67 MB).
- **No more square corner after a maximise**: the corner pieces now arrive before Windows' maximise animation lands, so the app's square corners are never seen. Before, they showed for about a tenth of a second each time.
- **Corners no longer vanish when a fullscreen video plays on the other monitor**, or when a program puts an invisible overlay over the screen (graphics and recording tools do). Fullscreen is now decided per window and per monitor, and click-through overlays are ignored.
- **Corners are right within 3 seconds of starting** with an app already maximised (it was 7). Looking at the wallpaper under them is now one copy of the screen instead of hundreds of single pixels.
- **The second monitor's corners show the wallpaper again** instead of a flat colour: the check that the wallpaper lines up now ignores the dust drifting through the margin, and a corner that does not line up is looked at again by itself a few seconds later.
- Clicks at the very corner of a maximised app now reach the app.

### Performance

- **About a third less memory**: each window now loads only its own code (the frame and corner windows no longer load the animation library or the other windows' code). Measured on the whole app at idle: 1003 MB down to 697 MB.
- **No hitch the first time a menu, the Control Center or Start opens**: the sound engine is built quietly after start instead of on the first click, which took about 25 ms of it. The worst frame on opening a menu went from 40 ms to 15 ms, and the Control Center from 80 ms to 15 ms, on a 75 Hz screen.
- **Sounds sleep when quiet**: the audio engine is suspended four seconds after the last cue, instead of rendering silence for as long as the app runs.
- **The frame's dust draws on one beat**: its four bands are redrawn together, 12 frames a second instead of up to 17, for each screen.
- **Less work while idle and while you move windows**: the dock's float restyles only its icons, and the frame's corner check stops as soon as it has its answer instead of asking Windows about every window.

### Changed (frosted glass)

- **Frosted glass is rebuilt on Windows' compositor.** The dock, the menu bar and the Start menu each have a click-through glass window beneath them, where the compositor blurs what is behind, on the graphics card, clipped to the glass's own rounded corners. Nothing is captured or sent between frames, so it no longer flickers, follows the glass as it moves, and costs almost nothing: idle CPU with the glass on fell from about 55% of a core to about 13%. The Frost slider is how much of the blur shows. The old screen-capture machinery is removed.
- **Frosted glass on everything, with a switch for each group.** Dock, Start and menu bar each have their own switch under Frosted glass. Each switch covers everything in its group: the dock's menus, flyouts, labels, buttons and notifications; Start's popovers; the menu bar's menus, Control Center, media pill and peek; and the tooltips of each. The old single switch carries over as the starting value for all three.
- **No flicker crossing the dock**: a dock label vanished in one frame while its glass stayed a frame or two longer, a bare patch of blur at full strength. Labels now fade out with their glass. Every glass is now updated before the page is drawn, and glass pieces are reused.
- **Menus, cards and labels get their glass once they are open.** A dropdown flies out squashed, tilted or clipped to a circle, shapes the glass cannot take, so the glass showed around its edges. Now the glass waits until the menu is at rest and fades in, and it goes the moment the menu starts to leave.
- **A menu closed by moving the pointer away left its blur behind** until the next click. Glass changes are now drawn right away.
- **The menu bar's glass flickered while a menu was open** (or a tooltip or the peek came up). Each of these re-placed the bar's window, and the glass window under it, in the same spot, and Windows refreshed the blur each time. Now only the visible part of the bar changes, and the glass window is moved only when it has actually moved.
- **The Control Center's glass flickered four times a second while open**: its waveform and progress animations kept restarting the wait for the panel to come to rest. Only the panel's own movement counts now.
- **The menu bar's glass changed whenever a menu opened.** Windows blurs only within the box around everything drawn on the glass. The bar alone blurred just its own thin strip, and any open menu stretched that box over the windows below. Each piece of glass now always reaches 96 px around itself, so the bar looks the same whatever is open, and it now looks properly frosted.
- A bar whose glass was measured before the bar came into view now gets its glass when it appears.

### Changed (frame corners, type)

- **San Francisco** is the type where installed: SF Pro Text for reading sizes, SF Pro Display for large text, SF Pro Rounded for dock names and the pills; Inter otherwise.
- **The frame rounds every window corner that sits in a corner of the opening**, not only a maximised window's: two windows snapped side by side get their outer corners rounded, a quarter-snapped window its one. Each corner piece shows the real wallpaper under the margin's glass.
- **No more flicker in the corners**: the wallpaper is looked at again when Windows says it changed (a registry notification), not whenever the margin's colours move, which the ambient scene's motes did.

### Added

- **Seconds in the menu bar clock**, with a switch for it under Menu bar. The clock is a component of its own, so a tick redraws only the clock.
- **A media pill in the menu bar.** While something is playing, resting the pointer in the middle of the bar slides out a pill (cover, title and artist, previous / play / next, a hairline of progress), tinted by the cover; it grows out of the middle on a spring and goes back when the pointer leaves. A setting keeps it slid out instead. A click on the cover opens the Control Center card. Not drawn, and the player not asked about, when the setting is off.
- **A glass border for the frame**, with a width: a bevel along the opening the apps sit in, lit from above.
- **Dock magnification is Mac-like**: the icon under the pointer is drawn larger, growing away from the screen edge and rising a little further, along a cosine hill that is flat at both ends. New sliders for the lift and for how many icons either side swell (Reach). Before, icons only spread apart and did not grow.

### Fixed

- **Programs that use WebView2 crashed when started from the dock or Start in the portable build** (DriveWorks Administrator, with a NullReferenceException in `WebView2_CoreWebViewInitialized`). The portable profile folder was put in the environment, every program started from here inherited it, and was told to use a folder that was open here with other arguments. Each window is now given the folder by name, and nothing is left in the environment.
- **Clock digits stood a little askew**: each rested at a fraction of a pixel of its own and the characters shared no baseline. The cell is a whole number of device pixels and every character is in one, and a clock turns over without overshoot.
- Settings had eight copies of one toggle and two of a slider.

### Changed

- **Middle click on a dock icon is End Task** (the app is ended at once, with what it started, so a hung one goes too; the shell is never ended and a Store app is ended through its own process). A setting returns it to closing the windows politely. End Task is also in the right-click menu.
- **The dock's own symbols follow the icon look** as an app's icon does: plain is white as ever, and glass, clear and tinted treat Search, Settings and the glyphs by the clock the way an app's icon is treated.
- **The media pill and the peek**: eight ways to come out (Gloop, Jelly, Drop, Unfurl, Bloom, Spring, Fade, None) chosen under Animations. The pill is robust: it narrows in a narrow bar, leaves with its contents when the music stops, changes track with a slide, and its hairline is a scrubber. Resting the pointer on the Control Center button hangs its Now Playing card from the button, by the same motion.
- **The frame's rounded corners are the frame's, not the app's.** Windows are no longer cut round with a window region, which meant a message to every app, apps that took the region off again, and square corners on any app that could not be cut (elevated, hung, or managing its own shape). A small window kept on top is clipped to the four corner pieces of the opening and draws the margin's colour there, edged by the curve, so every maximised app has rounded corners and nothing is done to it. The colour is read off the screen beside each corner (the glass over the wallpaper as drawn), not guessed from one colour for the whole wallpaper, and the pieces wait until Windows has finished growing the window.

- **Lighter ambient scenes.** The scenes in the menu bar and the frame round the screen are drawn at 12 frames a second, not 24-30; idle CPU with the frame on fell from about 55% to 25% of a core.

### Added

- **Start menu.** A centred, liquid-glass Start menu (Ctrl+Alt+Space, or the magnifier beside the dock) with pinned
  apps, Recommended, Recently downloaded, a calculator and settings search, its own animations and sounds, and a
  closing animation. It turns back from where it is if it is closed while arriving or opened while leaving, and its
  lists are read before it is first opened, with placeholders of their own size.
- **Frosted glass that is as round as the glass.** What is behind the dock, the Start menu and the menu bar is
  blurred from a picture of the screen taken with Aero Dock's own windows left out, so the corners are true curves
  (Windows' own blur is only ever a rectangle). Per surface blur and grain sliders; the glass adapts to how bright
  the wallpaper behind it is. Off until chosen, and nothing runs while it is off.
- **A motion language.** Four springs, durations and curves that everything moves with; every surface is lit by one
  light and sits at one of four heights.
- **Type and numbers.** Inter, bundled as a variable font; numbers that change (the clock, percentages, sliders)
  roll, digit by digit.
- **Sound as a system.** One key (E), a glassy voice and a little room; a switch is an octave above a menu; every
  cue is half as loud while music is playing.
- **Night glass.** The settings window is dark liquid glass by default (the classic sky is an option), and opens in
  its look from the first frame.
- **Frame timings.** A table of how smoothly each window draws on each screen (Settings > Animations > Smoothness).
- **Hardware acceleration** is a setting, on by default (it was software rendering, to save memory), read at start.
- Pressed and keyboard-focus states on every control; hairlines one device pixel wide at 125% and 150%.

### Changed

- Errors are said in a few plain words and not as what Windows or Rust said.
- Middle-clicking an app on the dock now closes it: every window it has open is
  asked to close, as its own close button would, so an app with unsaved work still
  asks first. It works for pinned and running apps alike. Muting an app, which
  middle-click used to do, is in the icon's right-click menu.

## [1.3.2] - 2026-09-29

### Added

- A support link, for anyone who wants to put something toward continued
  development. It sits beside the title in settings, on a card of its own
  further down, in About next to the GitHub link, and in the tray menu.
  Aero Dock stays free, with no paid tier and nothing held back, and there
  is no prompt on launch and nothing that asks twice.

### Fixed

- **A widget drag that never ended could stop the whole desktop taking
  clicks.** Dragging opens the overlay up so the pointer cannot slip out of
  it, and only the release put it back. If that release never arrived,
  because focus moved or the pointer capture was lost, the overlay kept
  swallowing every click on the desktop. It is now restored whatever
  becomes of the pointer.
- The clickable region went stale when the desktop changed shape. 1.3.1
  resized the overlay but never recalculated which parts of it were solid,
  so after a resolution change parts of the screen could stop responding
  while the overlay held space no widget was in.
- Right-clicking a widget started a drag and carried it off with the
  pointer. Only the primary button moves a widget now.
- Prose in settings wrapped by breaking words in half. The rule suited the
  long file path it was written for and nothing else; paths have their own.
- Corrected what the widget code says about its own coordinates. They are
  offsets from the corner of the overlay, not virtual-desktop positions,
  which matters to anyone taking the multi-monitor work further.

## [1.3.1] - 2026-09-29

### Fixed

- **Weather could reach the network without permission.** Setting
  coordinates was enough to make the widget fetch, so the switch in
  settings decided only what the settings window said, not what the
  widget did. The permission is now checked next to the request itself,
  and a widget that is not allowed says so on its face. This was the
  promise 1.3.0 made in its own release notes, and the code did not keep
  it.
- **"Use theme" did not clear a widget tint.** Clearing sent a null, which
  was indistinguishable from sending nothing at all by the time it reached
  the settings store, so the button did nothing. Clearing and not touching
  are now told apart.
- A widget could be dragged past the edge of the desktop until there was
  nothing left to grab it by. A drag now stops with part of the widget
  still reachable, and the saved position is held to the same rule however
  it was set.
- Resizing past the maximum size snapped back after the drop, because the
  frontend allowed what the settings store then clamped. Both ends now
  agree.
- The widget overlay kept the size of the desktop it was built for, so
  changing resolution or adding a monitor left widgets clipped and clicks
  landing in the wrong place. Its geometry is now rechecked whenever the
  widgets redraw.
- A latitude or longitude that is not a real coordinate is dropped rather
  than sent, where it would only have come back as an error.

## [1.3.0] - 2026-09-25

### Added

- **Aero Widgets.** Glass widgets that sit on the desktop: clock, calendar,
  weather, system stats and a music player. Drag one to move it, drag its
  bottom right corner to resize, and everywhere else on the desktop keeps
  working normally.
- Each widget picks its own material, Classic or Liquid, independently of
  the dock and the settings window, along with its own tint, opacity and
  ambient bubbles.
- The clock has an analogue face with a sweeping second hand or a digital
  readout, 12 or 24 hour. The calendar starts the week where your locale
  starts it. System stats reads processor, memory and uptime. The music
  widget follows whatever Windows is playing and can skip and pause it,
  with no per-app setup.
- Widgets are off until you turn them on, and turning them on adds a clock
  rather than leaving an empty desktop.

### Changed

- The Liquid material can now be applied to any element rather than only a
  whole window, which is what lets a single widget use it.

### Privacy

- Weather is the first and only part of Aero Dock that makes a network
  request, and it takes two deliberate steps to reach that point: adding
  the widget, and allowing it in settings. It then asks Open-Meteo for
  conditions at coordinates you type in, and sends nothing else. There is
  no account and no key. Every other widget runs entirely offline, and the
  rest of the app still makes no network requests at all.

### Notes

- All the widgets share one window rather than taking one each. A second
  webview costs about what the dock costs in memory, so five of them would
  have undone the work in 1.2.1. The shared window covers the whole desktop
  and is given a region matching the widget rectangles, so Windows treats
  it as existing only where a widget actually is.

## [1.2.2] - 2026-09-20

### Changed

- The Liquid material now actually refracts. It bends what is behind it
  through a generated displacement map rather than only blurring, which is
  the difference between glass and frosted plastic. Technique from
  "Liquid Glass in CSS and SVG" by ekino.
- Cards in the settings window carry the refraction, and the bubbles
  behind them are larger so there is something worth bending. Bending a
  smooth gradient only produces another smooth gradient.
- Under Liquid the bubbles hold still and the travelling light sweep stands
  down. Anything moving behind a refracting card forces it to redraw on
  every frame, which costs more than the motion is worth.
- The dock keeps the same rim treatment: one continuous inner glow instead
  of a top bevel, no gloss cap, and more transparency.

### Known limitation

- The dock cannot refract. A backdrop filter can only bend what is painted
  behind it inside the page, and the dock is a transparent window, so
  Windows never hands it the desktop pixels. The dock gets the rim and the
  transparency; the bending happens only in the settings window.

## [1.2.1] - 2026-09-18

### Changed

- Uses much less memory. Measured on the same machine, the dock went from
  about 240 MB to about 180 MB while in use, and to about 140 MB once it
  has been left alone for a minute.
- The dock now renders in software. The GPU process was the single largest
  cost, and most of it was cache. In testing this made no measurable
  difference to CPU use, to the transparent window, or to the ripples, bursts
  and ambient scenes, which still run.
- After 45 seconds with no interaction the dock asks WebView2 to drop its
  caches, and goes back to normal the moment the cursor returns. A WebView2
  runtime too old to support this just keeps its caches, as before.

## [1.2.0] - 2026-09-08

Modes, and the two things a mode is made of.

### Added

- **Per-app audio.** Scroll an app on the dock to change that app's
  volume, middle-click to mute or unmute it, and right-click to pick an
  output. A readout appears while you scroll and a muted app keeps a
  badge so silence never looks like a broken app. This is the same knob
  the Windows volume mixer shows, so the two always agree. An app that
  holds several audio sessions, which is normal for browsers and games,
  is treated as one.
- **Workspace snapshots.** Save which apps are open, where their windows
  sit, how big they are and which monitor they are on, then put it all
  back. Windows that are still open are moved rather than relaunched,
  apps that have closed are opened once, and anything saved on a monitor
  that is no longer plugged in comes back onto a screen that exists
  instead of off the edge of the desktop.
- **Dock Modes.** A mode holds its own pinned apps, its own workspace and
  its own per-app volumes. Switching restores all three from the tile on
  the dock. Modes can also switch on their own: name the apps that belong
  to a mode and bringing one of them to the front loads it. Automatic
  switching changes pins and volumes only, never window positions, so it
  cannot fight the app you just clicked on.
- Settings gained a Modes card for making, renaming, deleting and
  switching modes, and an App volume card that mirrors the dock.
- **Two glass materials.** Classic is the glossy, beveled Aero panel the
  app has always used. Liquid keeps the same palette but renders as thin
  glass: most of the tint leaves the body and the light moves to the rim,
  with deeper corners and no hard gloss cap. The dock and the settings
  window pick their material separately, so either can be glossy while
  the other is a lens. Both start on Classic, so upgrading changes
  nothing on screen; Liquid is one control away in Settings, then Theme.
- Each mode picks its own tile icon from a grid of presets grouped by
  what people name modes after, or any character you type. Without one it
  falls back to the first letter of the mode's name.

### Changed

- Picking an output for an app records the choice on the mode and opens
  the Windows page that performs the routing. Windows has no public API
  for per-application endpoint routing, so the last step is its own.
- The settings file gained a `modes` section. It is dormant on upgrade:
  existing configs load unchanged and the dock behaves exactly as it did
  until Modes is switched on, at which point the current dock becomes the
  first mode.

## [1.1.0] - 2026-09-07

### Added

- A portable build. Unpack the zip anywhere and run it; settings, pinned
  apps and the icon cache go in a `data` folder beside the exe instead of
  `%APPDATA%`, and WebView2 is pointed at that folder too, so a portable
  copy leaves nothing on the host machine. The switch is a `portable.txt`
  file next to the executable, so one binary covers both. Settings, then
  About, shows which mode is active and where the files are.

## [1.0.1] - 2026-09-04

### Fixed

- Windows Search, the Start menu, the input host and other shell surfaces
  no longer appear in the dock as if they were running apps. Filtering now
  matches on process name, window class and package identity, and drops
  ApplicationFrameHost frames that carry no AppUserModelID.
- **Open file location** opens the real folder with the file selected.
  Explorer needs its `/select,` path quoted inside the same argument and
  passed through verbatim; the previous call was escaped in a way Explorer
  answered by opening Documents. Packaged apps open the Apps folder, and a
  pin whose target has gone falls back to the parent folder.
- Dragging an icon to reorder tracks the cursor with no lag. Drag momentum
  and elasticity are off, neighbours move on a stiffer spring, and icons
  snap to their base size at drag start instead of animating down while
  the cursor is on top of them.
- Icons from apps that ship only a 16 or 32 px resource, such as Core Temp,
  are cropped to their drawn pixels and scaled up, so every tile carries
  the same optical weight. Non-square icons are padded rather than
  stretched, at any dock size. The icon cache is versioned, so existing
  installs regenerate on upgrade.
- Auto-hide no longer slides the dock away while files are being dragged
  onto it, which was the one moment it moved out from under the cursor on
  purpose.
- Quitting is reliable and easier to find. The tray menu keeps its Quit,
  now below a separator, and Settings gained a **Quit** button next to the
  settings file controls. Both paths restore the Windows taskbar before
  exiting, so an unclean shutdown cannot leave you without one.

### Changed

- The auto-hide delay is configurable, from 200ms to 5 seconds. It was
  fixed at 1.4 seconds before.
- The built-in dock items can each be turned off: search button, settings
  button, clock and date, and the battery, network, volume and Recycle Bin
  glyphs. They were always shown before.
- The search and settings icons are drawn as glass, with a gradient body,
  a specular highlight and a seated centre, to match the app icons beside
  them. They still take their colour from the active theme.

## [1.0.0] - 2026-08-26

First public release.

### Added

- **Floating glass dock** on any screen edge (bottom, top, left, or right),
  floating or flush, with per-monitor DPI-aware positioning and a monitor
  picker for multi-display setups.
- **Cursor magnification** with spring physics, idle float, launch bounce,
  glass tooltips, and icon reflections.
- **Live running-app tracking** via a Windows shell hook: running indicators,
  click to focus, cycle, or minimize, and a window list in the context menu.
- **Live window previews**: real DWM thumbnails framed in glass, opened by
  hovering an app with open windows. Click a preview to focus that window.
- **Pinning**: drag to reorder, drop apps, files, or folders from Explorer,
  folder flyouts with a bloom-open grid, and stacks that group several pinned
  items behind one tile.
- **Search overlay** covering installed apps (including packaged/UWP apps) and
  recent files, keyboard-first.
- **System corner**: clock, battery, network, scroll-to-adjust volume, and the
  Recycle Bin.
- **Six themes** (Aero, Ocean, Forest, Aurora, Sunset, Night) plus optional
  wallpaper color sync and sliders for glass, bloom, reflections, particles,
  and animation speed.
- **Ambient scenes**: dust, rain, snow, bubbles, or aurora drifting behind the
  dock, all density-scaled and frame-capped.
- **Effects engine** (WebGL): click ripples and launch bursts, with a ticker
  that stops entirely when nothing is animating.
- **Auto-hide** with an 8px reveal strip, a tray icon, and launch-at-sign-in.
- **First-run welcome** offering to import a starter set of apps or start empty.
- Settings export and import as a plain JSON file.
- Optional Windows taskbar auto-hide, restored when Aero Dock quits.

### Notes

- Aero Dock makes no network requests and contains no telemetry or analytics.
  All state is a single JSON file in your app config directory.
- Packaged (UWP) apps are grouped by AppUserModelID. This covers the common
  cases and misses a few. See the README.

[1.3.2]: https://github.com/TheAgencyMGE/aero-dock/releases/tag/v1.3.2
[1.3.1]: https://github.com/TheAgencyMGE/aero-dock/releases/tag/v1.3.1
[1.3.0]: https://github.com/TheAgencyMGE/aero-dock/releases/tag/v1.3.0
[1.2.2]: https://github.com/TheAgencyMGE/aero-dock/releases/tag/v1.2.2
[1.2.1]: https://github.com/TheAgencyMGE/aero-dock/releases/tag/v1.2.1
[1.2.0]: https://github.com/TheAgencyMGE/aero-dock/releases/tag/v1.2.0
[1.1.0]: https://github.com/TheAgencyMGE/aero-dock/releases/tag/v1.1.0
[1.0.1]: https://github.com/TheAgencyMGE/aero-dock/releases/tag/v1.0.1
[1.0.0]: https://github.com/TheAgencyMGE/aero-dock/releases/tag/v1.0.0
