/**
 * Every section of the settings window, and how they are grouped.
 *
 * The sidebar lists them under their group's heading, each with its icon, and the window shows the one chosen. The
 * search box matches what is typed against a section's title, its blurb and its keywords (the names of what is
 * inside), so a setting can be found without knowing which section it lives in. A section is drawn by
 * `SettingsSection`, which looks itself up here by `id`.
 */

export interface SectionDef {
  id: string;
  title: string;
  /** What is in it, in a line: under its title at the top of the page. */
  blurb: string;
  /** The names of the settings inside, for the search box. */
  keywords: string;
  /** The hue of its icon's tile (0 to 360; `null` for a grey one). */
  hue: number | null;
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
        id: "color",
        title: "Color & materials",
        blurb: "The theme color, the dock's material and the app icons",
        keywords:
          "color color theme accent picker hex wallpaper tint from wallpaper material liquid clear dock material app icons plain glass tinted icon style",
        hue: 285,
      },
      {
        id: "glass",
        title: "Glass & light",
        blurb: "Frosted glass, light, depth and the ambient scene",
        keywords:
          "frosted glass blur real blur frosting frost grain dock start menu bar menubar pointer light opacity transparency intensity bloom reflections dock shadow ambient scene dust rain snow ocean aurora particles",
        hue: 195,
      },
      {
        id: "animations",
        title: "Animations",
        blurb: "How things open, close and answer the pointer",
        keywords:
          "animation animations speed hover effect magnify lift glow menu items sections hardware acceleration gpu graphics card software rendering restart frame timings smoothness fps stutter refresh rate hz overlay performance menu bar menus dock appears reveal flyouts launching bounce magnification feel start menu open close media pill island peek gloop jelly drop unfurl bloom spring click ripple press dimple edge halo shine sweep glass glow",
        hue: 320,
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
        blurb: "Where it sits, its icons, how it marks running apps",
        keywords:
          "dock position edge bottom top left right monitor screen every monitor auto hide automatically hide delay floating edge gap reserve screen space icon size spacing padding magnification amount lift reach running applications running apps marks dot focus mark pill ghost glowing dot glide bounce snap float fade faint marks halo dimmed stretch with speed velocity corner radius tint tinted theme color plain glass middle click end task close windows minimise effect genie scale attention bounce mark color custom running app color",
        hue: 215,
      },
      {
        id: "dock-items",
        title: "Dock items",
        blurb: "The Liquidock button, Settings, the clock and the status icons",
        keywords: "liquidock button start search button shine glint swell rim drop reveal settings button clock date battery network volume recycle bin status icon size",
        hue: 200,
      },
      {
        id: "modes",
        title: "Modes",
        blurb: "Sets of pinned apps and layouts to switch between",
        keywords: "modes mode work focus pinned apps window layout snapshot auto switch glyph",
        hue: 260,
      },
      {
        id: "audio",
        title: "App volume",
        blurb: "The volume of each app that is playing",
        keywords: "app volume audio per app mixer mute sound level",
        hue: 25,
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
        blurb: "The bar along the top, its lens and the Control Center",
        keywords:
          "menu bar height gap corner radius seconds clock time media pill island now playing hover controls play pause next previous tint item spacing text size edge light lens size magnification warp control center wi-fi bluetooth circle color now playing cover sound wave spectrum camera microphone dots privacy cpu memory network readout stats date clock status icons close menus pointer away ambient scene full screen fullscreen video game hide",
        hue: 205,
      },
      {
        id: "start",
        title: "Start menu",
        blurb: "Pinned apps, recent files and downloads",
        keywords: "start menu pinned apps recent files downloads recommended reset ctrl alt space ctrl esc windows key win key keyboard readable readability contrast light background tint shadow",
        hue: 150,
      },
      {
        id: "frame",
        title: "Window frame",
        blurb: "A margin of glass round maximised apps",
        keywords: "window frame glass border bevel edge rim margin maximized maximised padding corner radius tint rounded corners ambient",
        hue: 175,
      },
      {
        id: "widgets",
        title: "Desktop widgets",
        blurb: "Widgets that sit on the desktop",
        keywords: "desktop widgets clock weather music system load notes layer edit position network",
        hue: 45,
      },
    ],
  },
  {
    id: "system",
    title: "System",
    sections: [
      {
        id: "accessibility",
        title: "Accessibility",
        blurb: "Motion, transparency, the keyboard and sounds",
        keywords:
          "accessibility reduce motion reduced transparency keyboard shortcuts ctrl alt screen reader narrator interface sounds soft sounds volume",
        hue: 225,
      },
      {
        id: "behavior",
        title: "General",
        blurb: "Starting up, the taskbar, this window and your settings file",
        keywords:
          "general startup start with windows sign in login launch taskbar hide this window sidebar edge hover settings file export import backup quit exit tray",
        hue: null,
      },
    ],
  },
  {
    id: "about",
    title: "Liquidock",
    sections: [
      { id: "support", title: "Support Liquidock", blurb: "Help keep it going", keywords: "support donate ko-fi coffee", hue: 350 },
      { id: "about", title: "About", blurb: "The version, where your data is, the project", keywords: "about version storage portable data folder github project", hue: 210 },
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
