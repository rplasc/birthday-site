"use client";

import { useIntl } from "react-intl";
import { LOCALES, type Locale } from "../i18n/config";
import { useLocale } from "../i18n/useLocale";

const LABELS: Record<Locale, string> = {
  en: "EN",
  "es-419": "ES",
};

export function LanguageSwitcher() {
  const intl = useIntl();
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="lang-switcher"
      role="radiogroup"
      aria-label={intl.formatMessage({ id: "lang.switcher.aria" })}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={locale === l}
          aria-label={LABELS[l]}
          onClick={() => setLocale(l)}
          className={`lang-switcher-btn${locale === l ? " lang-switcher-btn--active" : ""}`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
