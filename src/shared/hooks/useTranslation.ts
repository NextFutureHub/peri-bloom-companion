import { useContext } from "react";
import { translations, type Language } from "@/shared/config/i18n";
import { useLanguage } from "@/app/providers/LanguageProvider";

export const useTranslation = () => {
  const { language } = useLanguage();
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

