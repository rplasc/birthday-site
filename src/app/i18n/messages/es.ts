import type { Theme } from "../../themes";
import type { ThemeCopy } from "./en";

export const messages: Record<string, string> = {
  "prompt.title.named.line1": "{name},",
  "prompt.title.named.line2": "¿es tu cumpleaños?",
  "prompt.title.anon.line1": "¿Es tu",
  "prompt.title.anon.line2": "cumpleaños?",
  "prompt.yes": "Sí",
  "prompt.no": "No",
  "prompt.wrongDevice": "Dispositivo equivocado.",

  "share.button": "💌 Hazle una tarjeta",
  "share.modal.vibeLabel": "Elige su vibra",
  "share.modal.langLabel": "Elige su idioma",
  "share.modal.nameLabel": "¿Quién está de cumpleaños?",
  "share.modal.namePlaceholder": "Su nombre (opcional)",
  "share.modal.previewStamp": "MUESTRA",
  "share.modal.previewGreeting": "¡Feliz cumpleaños, {name}! {hero}",
  "share.modal.copy": "🔗 Copiar enlace",
  "share.modal.copied": "✓ ¡Copiado! Ya envíalo 🎉",
  "share.modal.maybeLater": "Tal vez después",
  "share.modal.close": "Cerrar",

  "celebrate.title.named.line1": "¡Feliz cumple,",
  "celebrate.title.named.line2": "{name}!",
  "celebrate.title.anon.line1": "¡Feliz",
  "celebrate.title.anon.line2": "cumple!",
  "celebrate.heroAria": "Celebración {themeName}",

  "music.play": "♪ Reproducir",
  "music.pause": "♫ Pausar",
  "music.playLabel": "Reproducir música",
  "music.pauseLabel": "Pausar música",

  "theme.aria": "Tema",
};

export const themeCopy: Record<Theme, ThemeCopy> = {
  default: {
    name: "Fiesta",
    teaseTexts: [
      "✨  Es esa época del año...  ✨     ",
      "🎉  Algo se está cocinando hoy...  🎉     ",
      "🎂  Un día muy específico...  🎂     ",
    ],
    celebrateMarquees: [
      "🎉 ¡FELIZ CUMPLE! 🎉   ",
      "🥳 TÚ ERES LA FIESTA 🥳   ",
      "🎂 OTRA VUELTA AL SOL 🎂   ",
    ],
    celebrateBottomMarquees: [
      "🎂 PIDE UN DESEO 🎂   ",
      "🎈 COME MÁS PASTEL 🎈   ",
      "🪩 LICENCIA PARA BAILAR 🪩   ",
    ],
    celebrateCaptions: [
      "El ambiente es obligatorio.",
      "Permiso de fiesta: APROBADO.",
      "Nivel de confeti: crítico.",
    ],
    noEgg: ["¿En serio?", "¿Segurísimo?", "Última oportunidad…"],
    modalTitle: "¡Manda la fiesta! 🎉",
  },
  pink: {
    name: "Princesa",
    teaseTexts: [
      "💖  Es tu día especial...  💖     ",
      "👑  La corona ha sido avistada...  👑     ",
      "🌸  Algo brillante hoy...  🌸     ",
    ],
    celebrateMarquees: [
      "💖 ¡Feliz cumple, princesa! 💖   ",
      "👑 REALEZA DETECTADA 👑   ",
      "🌸 Brillo al máximo 🌸   ",
    ],
    celebrateBottomMarquees: [
      "👑 LARGA VIDA AL CUMPLE 👑   ",
      "🌸 DÍA ELEGANTE EN CURSO 🌸   ",
      "💝 SAQUEN LA ESCARCHA 💝   ",
    ],
    celebrateCaptions: [
      "Hoy eres la protagonista.",
      "Tiara obligatoria desde ahora.",
      "Permiso de brillo: concedido.",
    ],
    noEgg: ["¿Segura, su alteza?", "Pero la corona ya está lista…", "¿Respuesta final?"],
    modalTitle: "¡Manda el brillo! 💖",
  },
  mint: {
    name: "Jardín",
    teaseTexts: [
      "🌿  Un día dulce para celebrar...  🌿     ",
      "🌸  Algo está floreciendo hoy...  🌸     ",
      "🦋  Las mariposas ya salieron...  🦋     ",
    ],
    celebrateMarquees: [
      "🌻 ¡Feliz cumpleaños! 🌻   ",
      "🦋 Fiesta en el jardín 🦋   ",
      "🌷 Todo está floreciendo 🌷   ",
    ],
    celebrateBottomMarquees: [
      "🌿 CRECE LIBRE HOY 🌿   ",
      "🐝 OCUPADAS CELEBRANDO 🐝   ",
      "🌷 PODER PÉTALO DESBLOQUEADO 🌷   ",
    ],
    celebrateCaptions: [
      "Las abejas también vinieron.",
      "Conteo de polen: festivo.",
      "Las flores hacen su mejor esfuerzo.",
    ],
    noEgg: ["¿Seguro?", "El jardín ya está listo…", "No pises los tulipanes."],
    modalTitle: "¡Manda el jardín! 🌸",
  },
  lavender: {
    name: "Estrellada",
    teaseTexts: [
      "✨  Pide un deseo esta noche...  ✨     ",
      "🌙  Las estrellas se están alineando...  🌙     ",
      "🔮  Algo mágico se acerca...  🔮     ",
    ],
    celebrateMarquees: [
      "✨ ¡Pide un deseo! ✨   ",
      "🌙 MODO POLVO DE ESTRELLAS 🌙   ",
      "🔮 El cosmos aprueba 🔮   ",
    ],
    celebrateBottomMarquees: [
      "🌙 LAS ESTRELLAS APRUEBAN 🌙   ",
      "🪐 PASTEL CÓSMICO 24/7 🪐   ",
      "💫 DESEO RECIBIDO 💫   ",
    ],
    celebrateCaptions: [
      "El universo llamó. Es para ti.",
      "Deseo concedido (pendiente de revisión).",
      "Alineación cósmica: perfecta.",
    ],
    noEgg: ["Las estrellas dicen que no…", "Mercurio está retrógrado, igual.", "Último deseo."],
    modalTitle: "¡Manda la magia! ✨",
  },
};
