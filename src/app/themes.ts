export const THEME_KEYS = ["default", "pink", "mint", "lavender"] as const;
export type Theme = (typeof THEME_KEYS)[number];

export interface MusicConfig {
  waveType: OscillatorType;
  transpose: number;
  tempoMul: number;
  masterGain: number;
  harmonyInterval?: number;
  harmonyGain?: number;
}

export interface ThemeDef {
  swatch: string;
  balloons: string[];
  stars: string[];
  heroes: string[];
  surpriseStickers: string[];
  confettiColors: string[];
  music: MusicConfig;
}

export const THEMES: Record<Theme, ThemeDef> = {
  default: {
    swatch: "#dc2626",
    balloons: ["🎈", "🎀", "🪅"],
    stars: ["⭐", "🌟", "💫"],
    heroes: ["🎂", "🥳", "🎉"],
    surpriseStickers: ["🎁", "🥳", "🎊", "🍰", "🪩"],
    confettiColors: ["#dc2626", "#2563eb", "#16a34a", "#f59e0b", "#ec4899", "#8b5cf6"],
    music: { waveType: "triangle", transpose: 0, tempoMul: 1.0, masterGain: 0.22 },
  },
  pink: {
    swatch: "#ec4899",
    balloons: ["🎀", "💝", "🌷"],
    stars: ["💖", "💗", "✨"],
    heroes: ["👑", "🦄", "🧁"],
    surpriseStickers: ["🦄", "💝", "🧁", "🌸", "💍"],
    confettiColors: ["#db2777", "#f472b6", "#7c3aed", "#facc15", "#38bdf8", "#fcd5ce"],
    music: { waveType: "sine", transpose: 5, tempoMul: 1.1, masterGain: 0.22, harmonyInterval: 12, harmonyGain: 0.25 },
  },
  mint: {
    swatch: "#10b981",
    balloons: ["🌸", "🌷", "🌼"],
    stars: ["🍃", "🌿", "🌱"],
    heroes: ["🌻", "🌺", "🌼"],
    surpriseStickers: ["🦋", "🐝", "🌷", "🍄", "🐞"],
    confettiColors: ["#059669", "#0284c7", "#facc15", "#ec4899", "#84cc16", "#fb923c"],
    music: { waveType: "triangle", transpose: 7, tempoMul: 0.88, masterGain: 0.22, harmonyInterval: 7, harmonyGain: 0.3 },
  },
  lavender: {
    swatch: "#a78bfa",
    balloons: ["🪐", "🌙", "🔮"],
    stars: ["✨", "💫", "⭐"],
    heroes: ["🔮", "🌙", "🦄"],
    surpriseStickers: ["🌙", "💫", "🌟", "🦄", "🔭"],
    confettiColors: ["#7c3aed", "#ec4899", "#06b6d4", "#facc15", "#a3e635", "#f472b6"],
    music: { waveType: "sine", transpose: 3, tempoMul: 1.2, masterGain: 0.22, harmonyInterval: -12, harmonyGain: 0.18 },
  },
};

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEME_KEYS as readonly string[]).includes(value);
}
