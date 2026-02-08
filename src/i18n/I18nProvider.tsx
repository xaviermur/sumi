import React, { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { GameLanguage } from "@/core/types/game";
import { STRINGS, type Strings } from "./strings";

type I18nContextValue = {
  lang: GameLanguage;
  setLang: (lang: GameLanguage) => void;
  strings: Strings;
  t: (text: string, vars?: Record<string, string | number>) => string;
};

const I18nCtx = createContext<I18nContextValue | null>(null);

function formatText(text: string, vars?: Record<string, string | number>) {
  if (!vars) return text;
  return Object.keys(vars).reduce(
    (acc, key) => acc.replaceAll(`{${key}}`, String(vars[key])),
    text
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<GameLanguage>("es");

  const value = useMemo<I18nContextValue>(() => {
    const strings = STRINGS[lang];
    return {
      lang,
      setLang,
      strings,
      t: (text, vars) => formatText(text, vars),
    };
  }, [lang]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
