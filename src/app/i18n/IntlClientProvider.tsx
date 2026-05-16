"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { IntlProvider } from "react-intl";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { detectLocale } from "./config";
import { MESSAGES, THEME_COPY, type ThemeCopy } from "./bundles";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  themeCopy: Record<string, ThemeCopy>;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocaleContext must be used inside <IntlClientProvider>");
  return ctx;
}

export function IntlClientProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useLayoutEffect(() => {
    const detected = detectLocale(window.location.search, navigator.language);
    if (detected !== locale) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(detected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (next === DEFAULT_LOCALE) params.delete("lang");
      else params.set("lang", next);
      const qs = params.toString();
      const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
      window.history.replaceState(null, "", url);
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, themeCopy: THEME_COPY[locale] }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>
      <IntlProvider locale={locale} defaultLocale={DEFAULT_LOCALE} messages={MESSAGES[locale]}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}
