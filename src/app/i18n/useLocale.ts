"use client";

import { useLocaleContext } from "./IntlClientProvider";
import type { Theme } from "../themes";
import type { ThemeCopy } from "./messages/en";

export function useLocale() {
  const { locale, setLocale, themeCopy } = useLocaleContext();
  return {
    locale,
    setLocale,
    themeCopy: themeCopy as Record<Theme, ThemeCopy>,
  };
}
