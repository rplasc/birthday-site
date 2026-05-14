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
  name: string;
  swatch: string;
  balloon: string;
  star: string;
  hero: string;
  confettiColors: string[];
  teaseText: string;
  celebrateMarquee: string;
  celebrateCaption: string;
  modalTitle: string;
  music: MusicConfig;
}

export const THEMES: Record<Theme, ThemeDef> = {
  default: {
    name: "Party",
    swatch: "#dc2626",
    balloon: "🎈",
    star: "⭐",
    hero: "🎂",
    confettiColors: ["#dc2626", "#2563eb", "#16a34a", "#f59e0b", "#ec4899", "#8b5cf6"],
    teaseText: "✨  It's that time of year...  ✨     ",
    celebrateMarquee: "🎉 HAPPY BIRTHDAY! 🎉   ",
    celebrateCaption: "Certified party mode activated.",
    modalTitle: "Send the party! 🎉",
    music: { waveType: "triangle", transpose: 0, tempoMul: 1.0, masterGain: 0.22 },
  },
  pink: {
    name: "Princess",
    swatch: "#ec4899",
    balloon: "🎀",
    star: "💖",
    hero: "👑",
    confettiColors: ["#f9a8d4", "#fbcfe8", "#fda4af", "#fcd5ce", "#f472b6"],
    teaseText: "💖  It's your special day...  💖     ",
    celebrateMarquee: "💖 Happy Birthday, Princess! 💖   ",
    celebrateCaption: "Certified princess party activated.",
    modalTitle: "Send the sparkle! 💖",
    music: { waveType: "sine", transpose: 5, tempoMul: 1.1, masterGain: 0.22, harmonyInterval: 12, harmonyGain: 0.25 },
  },
  mint: {
    name: "Garden",
    swatch: "#10b981",
    balloon: "🌸",
    star: "🍃",
    hero: "🌻",
    confettiColors: ["#a7f3d0", "#bef264", "#99f6e4", "#fef9c3", "#fbcfe8"],
    teaseText: "🌿  A sweet day to celebrate...  🌿     ",
    celebrateMarquee: "🌻 Happy Birthday! 🌻   ",
    celebrateCaption: "Certified garden party activated.",
    modalTitle: "Send the bloom! 🌸",
    music: { waveType: "triangle", transpose: 7, tempoMul: 0.88, masterGain: 0.22, harmonyInterval: 7, harmonyGain: 0.3 },
  },
  lavender: {
    name: "Stardust",
    swatch: "#a78bfa",
    balloon: "🪐",
    star: "✨",
    hero: "🔮",
    confettiColors: ["#ddd6fe", "#c4b5fd", "#fbcfe8", "#bae6fd", "#f5d0fe"],
    teaseText: "✨  Make a wish tonight...  ✨     ",
    celebrateMarquee: "✨ Make a wish! ✨   ",
    celebrateCaption: "Certified stardust party activated.",
    modalTitle: "Send the magic! ✨",
    music: { waveType: "sine", transpose: 3, tempoMul: 1.2, masterGain: 0.22, harmonyInterval: -12, harmonyGain: 0.18 },
  },
};

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEME_KEYS as readonly string[]).includes(value);
}
