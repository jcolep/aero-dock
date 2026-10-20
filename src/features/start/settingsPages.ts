/**
 * The pages of Windows' Settings app, for the Start menu's search: typing
 * "wifi" or "default apps" offers the page. Each opens by its `ms-settings:`
 * address, which Windows itself answers.
 */

import { wordsStart, type MatchOptions } from "./searchMatch";

export interface SettingsPage {
  name: string;
  uri: string;
  /** Other words someone might type for it. */
  keywords: string;
}

export const SETTINGS_PAGES: SettingsPage[] = [
  { name: "Display", uri: "ms-settings:display", keywords: "screen resolution scale brightness night light monitor hdr" },
  { name: "Sound", uri: "ms-settings:sound", keywords: "volume speakers microphone audio output input" },
  { name: "Notifications", uri: "ms-settings:notifications", keywords: "alerts focus do not disturb" },
  { name: "Power & battery", uri: "ms-settings:powersleep", keywords: "sleep screen timeout battery saver energy" },
  { name: "Storage", uri: "ms-settings:storagesense", keywords: "disk space cleanup drives" },
  { name: "Multitasking", uri: "ms-settings:multitasking", keywords: "snap windows desktops alt tab" },
  { name: "Clipboard", uri: "ms-settings:clipboard", keywords: "copy paste history" },
  { name: "About", uri: "ms-settings:about", keywords: "pc name specs version windows edition device" },
  { name: "Bluetooth & devices", uri: "ms-settings:bluetooth", keywords: "pair connect headphones" },
  { name: "Printers & scanners", uri: "ms-settings:printers", keywords: "print scan" },
  { name: "Mouse", uri: "ms-settings:mousetouchpad", keywords: "pointer cursor speed buttons touchpad" },
  { name: "Typing", uri: "ms-settings:typing", keywords: "keyboard autocorrect spelling" },
  { name: "Network & internet", uri: "ms-settings:network", keywords: "connection status online" },
  { name: "Wi-Fi", uri: "ms-settings:network-wifi", keywords: "wireless wifi networks internet" },
  { name: "Ethernet", uri: "ms-settings:network-ethernet", keywords: "wired lan cable network adapter" },
  { name: "VPN", uri: "ms-settings:network-vpn", keywords: "virtual private network" },
  { name: "Airplane mode", uri: "ms-settings:network-airplanemode", keywords: "flight radio wireless" },
  { name: "Proxy", uri: "ms-settings:network-proxy", keywords: "network server" },
  { name: "Personalization", uri: "ms-settings:personalization", keywords: "customise customize look theme" },
  { name: "Background", uri: "ms-settings:personalization-background", keywords: "wallpaper desktop picture" },
  { name: "Colors", uri: "ms-settings:colors", keywords: "dark mode light accent transparency" },
  { name: "Themes", uri: "ms-settings:themes", keywords: "personalization contrast" },
  { name: "Lock screen", uri: "ms-settings:lockscreen", keywords: "login picture" },
  { name: "Taskbar", uri: "ms-settings:taskbar", keywords: "icons tray hide" },
  { name: "Start", uri: "ms-settings:personalization-start", keywords: "menu layout recent folders" },
  { name: "Installed apps", uri: "ms-settings:appsfeatures", keywords: "uninstall programs features apps remove" },
  { name: "Default apps", uri: "ms-settings:defaultapps", keywords: "open with browser file types" },
  { name: "Startup apps", uri: "ms-settings:startupapps", keywords: "run at login boot" },
  { name: "Your info", uri: "ms-settings:yourinfo", keywords: "account profile picture name" },
  { name: "Sign-in options", uri: "ms-settings:signinoptions", keywords: "password pin windows hello fingerprint face" },
  { name: "Accounts", uri: "ms-settings:otherusers", keywords: "users family other people" },
  { name: "Date & time", uri: "ms-settings:dateandtime", keywords: "clock time zone calendar" },
  { name: "Language & region", uri: "ms-settings:regionlanguage", keywords: "locale input keyboard layout" },
  { name: "Game Bar", uri: "ms-settings:gaming-gamebar", keywords: "gaming xbox capture record" },
  { name: "Accessibility", uri: "ms-settings:easeofaccess", keywords: "ease of access narrator magnifier" },
  { name: "Text size", uri: "ms-settings:easeofaccess-display", keywords: "bigger larger font accessibility" },
  { name: "Visual effects", uri: "ms-settings:easeofaccess-visualeffects", keywords: "animation transparency motion accessibility" },
  { name: "Privacy & security", uri: "ms-settings:privacy", keywords: "permissions app access" },
  { name: "Microphone privacy", uri: "ms-settings:privacy-microphone", keywords: "mic permission access" },
  { name: "Camera privacy", uri: "ms-settings:privacy-webcam", keywords: "webcam permission access" },
  { name: "Location privacy", uri: "ms-settings:privacy-location", keywords: "gps permission access" },
  { name: "Windows Update", uri: "ms-settings:windowsupdate", keywords: "updates patches restart check" },
  { name: "Windows Security", uri: "windowsdefender:", keywords: "antivirus defender virus firewall protection" },
];

/** The pages that match what was typed: every word of it begins a word of the name or the keywords ("wor" is not
 *  "networks"), or, with `typos`, is a slip from one. */
export function matchSettings(query: string, limit = 4, options: MatchOptions = {}): SettingsPage[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const scored: { page: SettingsPage; score: number }[] = [];
  for (const page of SETTINGS_PAGES) {
    const name = page.name.toLowerCase();
    if (!wordsStart(query, `${page.name} ${page.keywords}`, options)) continue;
    // a name that starts with the first word comes before one that only mentions it
    scored.push({ page, score: name.startsWith(words[0]) ? 0 : name.includes(words[0]) ? 1 : 2 });
  }
  return scored.sort((a, b) => a.score - b.score).slice(0, limit).map((s) => s.page);
}
