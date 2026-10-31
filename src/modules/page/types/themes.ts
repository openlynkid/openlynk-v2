// --- THEME PRESETS: src/modules/page/types/themes.ts ---

export type ThemePresetId =
  | "obsidian"
  | "emerald"
  | "cyberpunk"
  | "sunset"
  | "monochrome";

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  description: string;
  accentColor: string;
  badgeClass: string;
  activeBorder: string;
  swatchGradient: string;
  glows: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
  obsidian: {
    id: "obsidian",
    name: "Obsidian Violet",
    description: "Glassmorphism gelap klasik dengan pendar ungu-indigo dan cyan",
    accentColor: "#6366f1",
    badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    activeBorder: "border-indigo-500 ring-2 ring-indigo-500/20",
    swatchGradient: "from-indigo-600 via-violet-600 to-cyan-500",
    glows: {
      primary: "bg-indigo-500/15",
      secondary: "bg-cyan-500/10",
      tertiary: "bg-violet-500/10",
    },
  },
  emerald: {
    id: "emerald",
    name: "Emerald Luxe",
    description: "Nuansa hijau zamrud hutan dengan kilau mint dan aksen emas",
    accentColor: "#10b981",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    activeBorder: "border-emerald-500 ring-2 ring-emerald-500/20",
    swatchGradient: "from-emerald-600 via-teal-600 to-amber-400",
    glows: {
      primary: "bg-emerald-500/15",
      secondary: "bg-teal-500/10",
      tertiary: "bg-lime-500/10",
    },
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk Neon",
    description: "Pendar magenta fuchsia dan neon cyan dengan kontras tajam",
    accentColor: "#ec4899",
    badgeClass: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    activeBorder: "border-pink-500 ring-2 ring-pink-500/20",
    swatchGradient: "from-pink-500 via-fuchsia-600 to-cyan-400",
    glows: {
      primary: "bg-fuchsia-500/15",
      secondary: "bg-cyan-500/10",
      tertiary: "bg-pink-500/10",
    },
  },
  sunset: {
    id: "sunset",
    name: "Sunset Amber",
    description: "Kehangatan senja musim gugur dengan pendar amber dan rose",
    accentColor: "#f59e0b",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    activeBorder: "border-amber-500 ring-2 ring-amber-500/20",
    swatchGradient: "from-amber-500 via-orange-600 to-rose-500",
    glows: {
      primary: "bg-amber-500/15",
      secondary: "bg-rose-500/10",
      tertiary: "bg-orange-500/10",
    },
  },
  monochrome: {
    id: "monochrome",
    name: "Monochrome Stealth",
    description: "Minimalisme murni hitam pekat dan kristal perak",
    accentColor: "#ffffff",
    badgeClass: "bg-neutral-800 text-neutral-200 border-white/10",
    activeBorder: "border-white ring-2 ring-white/20",
    swatchGradient: "from-neutral-200 via-neutral-500 to-neutral-900",
    glows: {
      primary: "bg-white/5",
      secondary: "bg-neutral-400/5",
      tertiary: "bg-neutral-600/5",
    },
  },
};

export function getThemePreset(presetId?: string): ThemePreset {
  if (presetId && presetId in THEME_PRESETS) {
    return THEME_PRESETS[presetId as ThemePresetId];
  }
  return THEME_PRESETS.obsidian;
}
