export const THEME_KEYS = ["default", "pink", "mint", "lavender"] as const;
export type Theme = (typeof THEME_KEYS)[number];

export interface ThemeDef {
  name: string;
  swatch: string;
  balloon: string;
  star: string;
  confettiColors: string[];
  teaseText: string;
  celebrateCaption: string;
  modalTitle: string;
}

export const THEMES: Record<Theme, ThemeDef> = {
  default: {
    name: "Party",
    swatch: "#dc2626",
    balloon: "🎈",
    star: "⭐",
    confettiColors: ["#dc2626", "#2563eb", "#16a34a", "#f59e0b", "#ec4899", "#8b5cf6"],
    teaseText: "✨  It's that time of year...  ✨     ",
    celebrateCaption: "Certified party mode activated.",
    modalTitle: "Send the party! 🎉",
  },
  pink: {
    name: "Princess",
    swatch: "#ec4899",
    balloon: "🎀",
    star: "💖",
    confettiColors: ["#f9a8d4", "#fbcfe8", "#fda4af", "#fcd5ce", "#f472b6"],
    teaseText: "💖  It's your special day...  💖     ",
    celebrateCaption: "Certified princess party activated.",
    modalTitle: "Send the sparkle! 💖",
  },
  mint: {
    name: "Garden",
    swatch: "#10b981",
    balloon: "🌸",
    star: "🍃",
    confettiColors: ["#a7f3d0", "#bef264", "#99f6e4", "#fef9c3", "#fbcfe8"],
    teaseText: "🌿  A sweet day to celebrate...  🌿     ",
    celebrateCaption: "Certified garden party activated.",
    modalTitle: "Send the bloom! 🌸",
  },
  lavender: {
    name: "Stardust",
    swatch: "#a78bfa",
    balloon: "🪐",
    star: "✨",
    confettiColors: ["#ddd6fe", "#c4b5fd", "#fbcfe8", "#bae6fd", "#f5d0fe"],
    teaseText: "✨  Make a wish tonight...  ✨     ",
    celebrateCaption: "Certified stardust party activated.",
    modalTitle: "Send the magic! ✨",
  },
};

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEME_KEYS as readonly string[]).includes(value);
}
