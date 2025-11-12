import { useMemo } from "react";
import { translations, type Language } from "@/shared/config/i18n";
import { useLanguage } from "@/app/providers/LanguageProvider";

export const useTranslation = () => {
  const { language } = useLanguage();

  const translate = useMemo(() => {
    const t = translations[language];
    return (key: string): string => {
      const keys = key.split(".");
      let value: any = t;
      for (const k of keys) {
        value = value?.[k];
      }
      return value || key;
    };
  }, [language]);

  return { t: translate, language };
};

