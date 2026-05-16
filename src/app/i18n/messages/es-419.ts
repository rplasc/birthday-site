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

  "share.button": "🔗 Compartir enlace",
  "share.modal.vibeLabel": "Elige su vibra",
  "share.modal.langLabel": "Elige su idioma",
  "share.modal.nameLabel": "¿Quién está de cumpleaños?",
  "share.modal.namePlaceholder": "Su nombre (opcional)",
  "share.modal.previewLead": "Verán: ",
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
      "🥳 MODO FIESTA ACTIVADO 🥳   ",
      "🎂 OTRA VUELTA AL SOL 🎂   ",
    ],
    celebrateBottomMarquees: [
      "🎂 PIDE UN DESEO 🎂   ",
      "🎈 COME MÁS PASTEL 🎈   ",
      "🪩 LICENCIA PARA BAILAR 🪩   ",
    ],
    celebrateCaptions: [
      "Modo fiesta certificado.",
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
      "👑  Se acerca una ocasión real...  👑     ",
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
      "Fiesta de princesa certificada.",
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
      "🦋  Una pequeña ocasión gentil...  🦋     ",
    ],
    celebrateMarquees: [
      "🌻 ¡Feliz cumpleaños! 🌻   ",
      "🦋 Fiesta en el jardín 🦋   ",
      "🌷 Modo florecer activado 🌷   ",
    ],
    celebrateBottomMarquees: [
      "🌿 CRECE LIBRE HOY 🌿   ",
      "🐝 OCUPADAS CELEBRANDO 🐝   ",
      "🌷 PODER PÉTALO ACTIVADO 🌷   ",
    ],
    celebrateCaptions: [
      "Fiesta de jardín certificada.",
      "Conteo de polen: festivo.",
      "Las flores hacen su mejor esfuerzo.",
    ],
    noEgg: ["¿Seguro?", "El jardín ya está listo…", "Último pétalo."],
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
      "Fiesta estelar certificada.",
      "Deseo concedido (pendiente de revisión).",
      "Alineación cósmica: perfecta.",
    ],
    noEgg: ["Las estrellas dicen que no…", "¿Los planetas están seguros?", "Último deseo."],
    modalTitle: "¡Manda la magia! ✨",
  },
};
