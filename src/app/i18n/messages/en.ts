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

  "share.button": "🔗 Share a link",
  "share.modal.vibeLabel": "Pick their vibe",
  "share.modal.langLabel": "Pick their language",
  "share.modal.nameLabel": "Who's celebrating?",
  "share.modal.namePlaceholder": "Their name (optional)",
  "share.modal.previewLead": "They'll see: ",
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
      "🎉  Something's up today...  🎉     ",
      "🎂  A very specific kind of day...  🎂     ",
    ],
    celebrateMarquees: [
      "🎉 HAPPY BIRTHDAY! 🎉   ",
      "🥳 PARTY MODE ENGAGED 🥳   ",
      "🎂 ANOTHER TRIP AROUND THE SUN 🎂   ",
    ],
    celebrateBottomMarquees: [
      "🎂 MAKE A WISH 🎂   ",
      "🎈 EAT MORE CAKE 🎈   ",
      "🪩 GROOVE LICENSE GRANTED 🪩   ",
    ],
    celebrateCaptions: [
      "Certified party mode activated.",
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
      "👑  A royal occasion approaches...  👑     ",
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
      "Certified princess party activated.",
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
      "🦋  A gentle little occasion...  🦋     ",
    ],
    celebrateMarquees: [
      "🌻 Happy Birthday! 🌻   ",
      "🦋 Garden party in progress 🦋   ",
      "🌷 Bloom mode engaged 🌷   ",
    ],
    celebrateBottomMarquees: [
      "🌿 GROW WILD TODAY 🌿   ",
      "🐝 BUSY CELEBRATING 🐝   ",
      "🌷 PETAL POWER ENGAGED 🌷   ",
    ],
    celebrateCaptions: [
      "Certified garden party activated.",
      "Pollen count: festive.",
      "The flowers are doing their best.",
    ],
    noEgg: ["You sure?", "The garden's already set up…", "Last petal."],
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
      "Certified stardust party activated.",
      "Wish granted (pending review).",
      "Cosmic alignment: perfect.",
    ],
    noEgg: ["The stars say otherwise…", "Are the planets sure?", "Last wish."],
    modalTitle: "Send the magic! ✨",
  },
};
