# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 1.0.x   | Yes       |
| < 1.0   | No        |

## Reporting a vulnerability

Please **do not** open a public issue for a security problem.

Report it privately through GitHub's
[private vulnerability reporting](https://github.com/TheAgencyMGE/aero-dock/security/advisories/new)
form. Include the version, your Windows build, what an attacker could do, and
steps to reproduce it.

You can expect an initial reply within 7 days. If the report is confirmed,
a fix ships in the next patch release and you get credit in the release notes
unless you'd rather stay anonymous.

## What Liquidock touches

Liquidock is a local desktop application. Knowing its actual footprint helps
you judge whether something is a real vulnerability:

- **No network access.** Liquidock makes no outbound requests. It has no
  telemetry, no analytics, no crash reporting, and no update check. The only
  time a URL is opened is when *you* click a link (the GitHub button in
  Settings, or the Windows Settings pages behind the battery/network chips),
  which hands the URL to your default browser.
- **No accounts, no cloud, no credentials.** Liquidock stores no secrets and
  asks for no sign-in.
- **One data file.** All state lives in
  `%APPDATA%\com.aerodock.desktop\settings.json`, holding your pinned items and
  appearance preferences. Extracted app icons are cached as PNGs beside it.
- **Windows APIs it uses.** Shell shortcut resolution, icon extraction, window
  enumeration and activation, DWM thumbnails, audio endpoint volume, battery
  and network status, and the Recycle Bin. These are the ordinary APIs a dock
  needs; none require elevation.
- **Elevation.** Liquidock itself runs unelevated. The "Run as administrator"
  context-menu action asks Windows to elevate *the app you picked*, which
  triggers the normal UAC prompt.

### Things worth reporting

- A way to make Liquidock run code from a path the user did not choose.
- A settings file that causes a crash, a hang, or arbitrary writes when
  imported.
- A dropped or pinned file that escapes the intended launch behaviour.
- Anything that leaks the contents of `settings.json` off the machine.
