"use client";

import { LOCALES, type Locale } from "../i18n/config";

const LABELS: Record<Locale, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  es: { short: "ES", full: "Español" },
};

interface Props {
  value: Locale;
  onChange: (next: Locale) => void;
}

export function LanguageSwitcher({ value, onChange }: Props) {
  return (
    <div className="lang-switcher" role="radiogroup">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={value === l}
          aria-label={LABELS[l].full}
          onClick={() => onChange(l)}
          className={`lang-switcher-btn${value === l ? " lang-switcher-btn--active" : ""}`}
        >
          {LABELS[l].short}
        </button>
      ))}
    </div>
  );
}
