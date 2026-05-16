export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

// Any Spanish variant maps to our shared Spanish bundle, including older
// `es-419` links that may already be in circulation.
function normalizeSpanish(tag: string): Locale | null {
  const lower = tag.toLowerCase();
  if (lower === "es" || lower.startsWith("es-") || lower.startsWith("es_")) {
    return "es";
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
