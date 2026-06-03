import type { Theme } from "../../themes";

export interface ThemeCopy {
  name: string;
  teaseTexts: string[];
  celebrateMarquees: string[];
  celebrateBottomMarquees: string[];
  celebrateCaptions: string[];
  noEgg: string[];
  modalTitle: string;
}

export const messages: Record<string, string> = {
  "prompt.title.named.line1": "{name},",
  "prompt.title.named.line2": "is it your birthday?",
  "prompt.title.anon.line1": "Is it your",
  "prompt.title.anon.line2": "birthday?",
  "prompt.yes": "Yes",
  "prompt.no": "No",
  "prompt.wrongDevice": "Wrong device.",

  "share.button": "💌 Make their card",
  "share.modal.vibeLabel": "Pick their vibe",
  "share.modal.langLabel": "Pick their language",
  "share.modal.nameLabel": "Who's celebrating?",
  "share.modal.namePlaceholder": "Their name (optional)",
  "share.modal.previewStamp": "PREVIEW",
  "share.modal.previewGreeting": "Happy Birthday, {name}! {hero}",
  "share.modal.copy": "🔗 Copy link",
  "share.modal.copied": "✓ Copied! Now send it 🎉",
  "share.modal.maybeLater": "Maybe later",
  "share.modal.close": "Close",

  "celebrate.title.named.line1": "Happy Birthday,",
  "celebrate.title.named.line2": "{name}!",
  "celebrate.title.anon.line1": "Happy",
  "celebrate.title.anon.line2": "Birthday!",
  "celebrate.heroAria": "{themeName} celebration",

  "music.play": "♪ Play",
  "music.pause": "♫ Pause",
  "music.playLabel": "Play music",
  "music.pauseLabel": "Pause music",

  "theme.aria": "Theme",
};

export const themeCopy: Record<Theme, ThemeCopy> = {
  default: {
    name: "Party",
    teaseTexts: [
      "✨  It's that time of year...  ✨     ",
      "🎉  Big day incoming...  🎉     ",
      "🎂  A very specific kind of day...  🎂     ",
    ],
    celebrateMarquees: [
      "🎉 HAPPY BIRTHDAY! 🎉   ",
      "🥳 YOU ARE THE PARTY 🥳   ",
      "🎂 ANOTHER TRIP AROUND THE SUN 🎂   ",
    ],
    celebrateBottomMarquees: [
      "🎂 MAKE A WISH 🎂   ",
      "🎈 EAT MORE CAKE 🎈   ",
      "🪩 GROOVE LICENSE GRANTED 🪩   ",
    ],
    celebrateCaptions: [
      "The vibe is mandatory.",
      "Party permit: APPROVED.",
      "Confetti levels: critical.",
    ],
    noEgg: ["Are you sure?", "Really though?", "Last chance…"],
    modalTitle: "Send the party! 🎉",
  },
  pink: {
    name: "Princess",
    teaseTexts: [
      "💖  It's your special day...  💖     ",
      "👑  The crown has been sighted...  👑     ",
      "🌸  Something sparkly today...  🌸     ",
    ],
    celebrateMarquees: [
      "💖 Happy Birthday, Princess! 💖   ",
      "👑 ROYALTY DETECTED 👑   ",
      "🌸 Sparkle level: maximum 🌸   ",
    ],
    celebrateBottomMarquees: [
      "👑 LONG LIVE THE BIRTHDAY 👑   ",
      "🌸 FANCY DAY IN PROGRESS 🌸   ",
      "💝 BRING THE GLITTER 💝   ",
    ],
    celebrateCaptions: [
      "You're the main character today.",
      "Tiara required from this point on.",
      "Sparkle clearance: granted.",
    ],
    noEgg: ["Are you sure, your highness?", "But the crown is ready…", "Final answer?"],
    modalTitle: "Send the sparkle! 💖",
  },
  mint: {
    name: "Garden",
    teaseTexts: [
      "🌿  A sweet day to celebrate...  🌿     ",
      "🌸  Something's blooming today...  🌸     ",
      "🦋  The butterflies are out...  🦋     ",
    ],
    celebrateMarquees: [
      "🌻 Happy Birthday! 🌻   ",
      "🦋 Garden party in progress 🦋   ",
      "🌷 Everything's in bloom 🌷   ",
    ],
    celebrateBottomMarquees: [
      "🌿 GROW WILD TODAY 🌿   ",
      "🐝 BUSY CELEBRATING 🐝   ",
      "🌷 PETAL POWER UNLOCKED 🌷   ",
    ],
    celebrateCaptions: [
      "The bees are here for it.",
      "Pollen count: festive.",
      "The flowers are doing their best.",
    ],
    noEgg: ["You sure?", "The garden's already set up…", "Don't step on the tulips."],
    modalTitle: "Send the bloom! 🌸",
  },
  lavender: {
    name: "Stardust",
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
    celebrateBottomMarquees: [
      "🌙 THE STARS APPROVE 🌙   ",
      "🪐 COSMIC CAKE 24/7 🪐   ",
      "💫 WISH RECEIVED 💫   ",
    ],
    celebrateCaptions: [
      "The universe called. It's for you.",
      "Wish granted (pending review).",
      "Cosmic alignment: perfect.",
    ],
    noEgg: ["The stars say otherwise…", "Mercury's retrograde though.", "Last wish."],
    modalTitle: "Send the magic! ✨",
  },
};
