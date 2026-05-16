export const LOCALES = ["en", "es-419"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

// Any Spanish variant maps to Latin American Spanish — we don't ship a separate
// peninsular bundle, so es-ES visitors get LATAM Spanish too.
function normalizeSpanish(tag: string): Locale | null {
  const lower = tag.toLowerCase();
  if (lower === "es" || lower.startsWith("es-") || lower.startsWith("es_")) {
    return "es-419";
  }
  return null;
}

export function detectLocale(search: string, navLang: string | undefined): Locale {
  const params = new URLSearchParams(search);
  const fromQuery = params.get("lang");
  if (fromQuery) {
    if (isLocale(fromQuery)) return fromQuery;
    const spanish = normalizeSpanish(fromQuery);
    if (spanish) return spanish;
  }

  if (navLang) {
    const spanish = normalizeSpanish(navLang);
    if (spanish) return spanish;
    const base = navLang.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}
