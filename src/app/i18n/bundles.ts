import type { Locale } from "./config";
import type { Theme } from "../themes";
import { messages as enMessages, themeCopy as enThemeCopy } from "./messages/en";
import { messages as esMessages, themeCopy as esThemeCopy } from "./messages/es";
import type { ThemeCopy } from "./messages/en";

export const MESSAGES: Record<Locale, Record<string, string>> = {
  en: enMessages,
  "es": esMessages,
};

export const THEME_COPY: Record<Locale, Record<Theme, ThemeCopy>> = {
  en: enThemeCopy,
  "es": esThemeCopy,
};

export type { ThemeCopy };
