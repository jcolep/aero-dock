/**
 * Every section of the settings window, and how they are grouped.
 *
 * The window shows them under their group's heading, the sidebar lists them the
 * same way, and the search box matches what is typed against a section's title,
 * its blurb and its keywords (the names of what is inside), so a setting can be
 * found without knowing which section it lives in. A section is drawn by
 * `SettingsSection`, which looks itself up here by `id`.
 */

export interface SectionDef {
  id: string;
  title: string;
  /** What is in it, in a line: shown when it is collapsed. */
  blurb: string;
  /** The names of the settings inside, for the search box. */
  keywords: string;
}

export interface GroupDef {
  id: string;
  title: string;
  sections: SectionDef[];
}

export const GROUPS: GroupDef[] = [
  {
    id: "look",
    title: "Look & feel",
    sections: [
      {
        id: "colour",
        title: "Colour & materials",
        blurb: "Theme colour, glass material, app icon style",
        keywords:
          "color colour theme accent picker wallpaper material classic liquid clear dock material settings material app icons plain glass tinted icon style",
      },
      {
        id: "glass",
        title: "Glass & light",
        blurb: "Blur, grain, bloom, reflections, scene, speed",
        keywords:
          "frosted glass blur real blur frosting dock start menu bar menubar picture report square corners pointer light grain opacity transparency intensity bloom reflections dock shadow ambient scene dust rain snow ocean aurora particles tint from wallpaper animation speed",
      },
      {
        id: "animations",
        title: "Animations",
        blurb: "How menus, flyouts, the dock and Start open and close",
        keywords: "hardware acceleration gpu graphics card software rendering restart frame timings smoothness fps stutter refresh rate hz overlay performance animation animations menu bar menus dock appears reveal flyouts launching bounce magnification feel start menu open close",
      },
    ],
  },
  {
    id: "dock",
    title: "Dock",
    sections: [
      {
        id: "dock",
        title: "Dock",
        blurb: "Position, size, magnification, auto-hide",
        keywords:
          "dock position edge bottom top left right monitor screen every monitor icon size spacing magnification padding corner radius floating edge gap reserve screen space running applications running dot minimise effect genie scale bounce attention auto hide",
      },
      {
        id: "dock-items",
        title: "Dock items",
        blurb: "Search, settings, clock and status buttons",
        keywords: "search button reveal settings button clock date battery network volume recycle bin status icon size",
      },
      {
        id: "modes",
        title: "Modes",
        blurb: "Pinned apps and layouts you can switch between",
        keywords: "modes mode work focus pinned apps window layout snapshot auto switch glyph",
      },
      {
        id: "audio",
        title: "App volume",
        blurb: "Remembered volume for each app",
        keywords: "app volume audio per app mixer mute sound level",
      },
    ],
  },
  {
    id: "desktop",
    title: "Desktop",
    sections: [
      {
        id: "menubar",
        title: "Menu bar",
        blurb: "The bar along the top, the lens, the Control Center",
        keywords:
          "menu bar height gap corner radius tint item spacing text size edge light lens size magnification warp control center wi-fi bluetooth circle colour now playing cover sound wave spectrum camera microphone dots privacy cpu memory network readout stats date clock status icons close menus pointer away ambient scene",
      },
      {
        id: "start",
        title: "Start menu",
        blurb: "Pinned apps, recent files and downloads, shortcuts",
        keywords: "start menu pinned apps recent files downloads recommended reset ctrl alt space ctrl esc keyboard",
      },
      {
        id: "frame",
        title: "Window frame",
        blurb: "A margin of glass round maximised windows",
        keywords: "window frame glass margin maximized maximised padding corner radius tint rounded corners ambient",
      },
      {
        id: "widgets",
        title: "Desktop widgets",
        blurb: "Widgets that sit on the desktop",
        keywords: "desktop widgets clock weather music system load notes layer edit position network",
      },
    ],
  },
  {
    id: "system",
    title: "System",
    sections: [
      {
        id: "accessibility",
        title: "Accessibility & feel",
        blurb: "Reduce motion, transparency, shortcuts, sounds",
        keywords:
          "accessibility reduce motion reduced transparency keyboard shortcuts ctrl alt screen reader narrator interface sounds soft sounds volume",
      },
      {
        id: "behavior",
        title: "Startup & data",
        blurb: "Start with Windows, the taskbar, settings file, quit",
        keywords: "startup sign in login launch windows taskbar hide settings file export import backup quit exit tray",
      },
    ],
  },
  {
    id: "about",
    title: "About",
    sections: [
      { id: "support", title: "Support Aero Dock", blurb: "Ko-fi", keywords: "support donate ko-fi coffee" },
      { id: "about", title: "About", blurb: "Version, where your data is, the project", keywords: "about version storage portable data folder github project" },
    ],
  },
];

export const ALL_SECTIONS: SectionDef[] = GROUPS.flatMap((g) => g.sections);

export function sectionById(id: string): SectionDef | undefined {
  return ALL_SECTIONS.find((s) => s.id === id);
}

/** Whether a section answers what was typed: every word of it is somewhere in the section's names. */
export function matches(section: SectionDef, query: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const hay = `${section.title} ${section.blurb} ${section.keywords}`.toLowerCase();
  return words.every((w) => hay.includes(w));
}