import { useContext, createContext } from "react";
import { translations } from "@/shared/lib/i18n";
import type { TranslationKey } from "@/shared/lib/i18n";
import type { Language } from "@/shared/types";

// Context для языка (можно использовать из провайдера)
const LanguageContext = createContext<Language>("ru");

export const useTranslation = () => {
  const language = useContext(LanguageContext) || "ru";
  const t = translations[language];

  const translate = (key: string): string => {
    const keys = key.split(".");
    let value: any = t;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return { t: translate, language };
};

