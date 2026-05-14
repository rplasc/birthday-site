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
  balloons: string[];
  stars: string[];
  heroes: string[];
  surpriseStickers: string[];
  confettiColors: string[];
  teaseTexts: string[];
  celebrateMarquees: string[];
  celebrateCaptions: string[];
  noEgg: string[];
  modalTitle: string;
  music: MusicConfig;
}

export const THEMES: Record<Theme, ThemeDef> = {
  default: {
    name: "Party",
    swatch: "#dc2626",
    balloons: ["🎈", "🎀", "🪅"],
    stars: ["⭐", "🌟", "💫"],
    heroes: ["🎂", "🥳", "🎉"],
    surpriseStickers: ["🎁", "🥳", "🎊", "🍰", "🪩"],
    confettiColors: ["#dc2626", "#2563eb", "#16a34a", "#f59e0b", "#ec4899", "#8b5cf6"],
    teaseTexts: [
      "✨  It's that time of year...  ✨     ",
      "🎉  Something's up today...  🎉     ",
      "🎂  A very specific kind of day...  🎂     ",
    ],
    celebrateMarquees: [
      "🎉 HAPPY BIRTHDAY! 🎉   ",
      "🥳 PARTY MODE ENGAGED 🥳   ",
      "🎂 ANOTHER TRIP AROUND THE SUN 🎂   ",
    ],
    celebrateCaptions: [
      "Certified party mode activated.",
      "Party permit: APPROVED.",
      "Confetti levels: critical.",
    ],
    noEgg: ["Are you sure?", "Really though?", "Last chance…"],
    modalTitle: "Send the party! 🎉",
    music: { waveType: "triangle", transpose: 0, tempoMul: 1.0, masterGain: 0.22 },
  },
  pink: {
    name: "Princess",
    swatch: "#ec4899",
    balloons: ["🎀", "💝", "🌷"],
    stars: ["💖", "💗", "✨"],
    heroes: ["👑", "🦄", "🧁"],
    surpriseStickers: ["🦄", "💝", "🧁", "🌸", "💍"],
    confettiColors: ["#db2777", "#f472b6", "#7c3aed", "#facc15", "#38bdf8", "#fcd5ce"],
    teaseTexts: [
      "💖  It's your special day...  💖     ",
      "👑  A royal occasion approaches...  👑     ",
      "🌸  Something sparkly today...  🌸     ",
    ],
    celebrateMarquees: [
      "💖 Happy Birthday, Princess! 💖   ",
      "👑 ROYALTY DETECTED 👑   ",
      "🌸 Sparkle level: maximum 🌸   ",
    ],
    celebrateCaptions: [
      "Certified princess party activated.",
      "Tiara required from this point on.",
      "Sparkle clearance: granted.",
    ],
    noEgg: ["Are you sure, your highness?", "But the crown is ready…", "Final answer?"],
    modalTitle: "Send the sparkle! 💖",
    music: { waveType: "sine", transpose: 5, tempoMul: 1.1, masterGain: 0.22, harmonyInterval: 12, harmonyGain: 0.25 },
  },
  mint: {
    name: "Garden",
    swatch: "#10b981",
    balloons: ["🌸", "🌷", "🌼"],
    stars: ["🍃", "🌿", "🌱"],
    heroes: ["🌻", "🌺", "🌼"],
    surpriseStickers: ["🦋", "🐝", "🌷", "🍄", "🐞"],
    confettiColors: ["#059669", "#0284c7", "#facc15", "#ec4899", "#84cc16", "#fb923c"],
    teaseTexts: [
      "🌿  A sweet day to celebrate...  🌿     ",
      "🌸  Something's blooming today...  🌸     ",
      "🦋  A gentle little occasion...  🦋     ",
    ],
    celebrateMarquees: [
      "🌻 Happy Birthday! 🌻   ",
      "🦋 Garden party in progress 🦋   ",
      "🌷 Bloom mode engaged 🌷   ",
    ],
    celebrateCaptions: [
      "Certified garden party activated.",
      "Pollen count: festive.",
      "The flowers are doing their best.",
    ],
    noEgg: ["You sure?", "The garden's already set up…", "Last petal."],
    modalTitle: "Send the bloom! 🌸",
    music: { waveType: "triangle", transpose: 7, tempoMul: 0.88, masterGain: 0.22, harmonyInterval: 7, harmonyGain: 0.3 },
  },
  lavender: {
    name: "Stardust",
    swatch: "#a78bfa",
    balloons: ["🪐", "🌙", "🔮"],
    stars: ["✨", "💫", "⭐"],
    heroes: ["🔮", "🌙", "🦄"],
    surpriseStickers: ["🌙", "💫", "🌟", "🦄", "🔭"],
    confettiColors: ["#7c3aed", "#ec4899", "#06b6d4", "#facc15", "#a3e635", "#f472b6"],
    teaseTexts: [
      "✨  Make a wish tonight...  ✨     ",
      "🌙  The stars are aligning...  🌙     ",
      "🔮  Something magical's afoot...  🔮     ",
    ],
    celebrateMarquees: [
      "✨ Make a wish! ✨   ",
      "🌙 STARDUST MODE 🌙   ",
      "🔮 The cosmos approves 🔮   ",
    ],
    celebrateCaptions: [
      "Certified stardust party activated.",
      "Wish granted (pending review).",
      "Cosmic alignment: perfect.",
    ],
    noEgg: ["The stars say otherwise…", "Are the planets sure?", "Last wish."],
    modalTitle: "Send the magic! ✨",
    music: { waveType: "sine", transpose: 3, tempoMul: 1.2, masterGain: 0.22, harmonyInterval: -12, harmonyGain: 0.18 },
  },
};

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEME_KEYS as readonly string[]).includes(value);
}
