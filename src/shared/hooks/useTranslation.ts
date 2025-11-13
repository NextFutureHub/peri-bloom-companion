import { useMemo } from "react";
import { translations, type Language } from "@/shared/config/i18n";
import { useLanguage } from "@/app/providers/LanguageProvider";

export const useTranslation = () => {
  const { language } = useLanguage();

  const translate = useMemo(() => {
    const t = translations[language];
    return (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split(".");
      let value: any = t;
      for (const k of keys) {
        value = value?.[k];
      }
      let result = value || key;
      
      // Интерполяция параметров: заменяем {param} на значения
      if (params && typeof result === "string") {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          result = result.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramValue));
        });
      }
      
      return result;
    };
  }, [language]);

  return { t: translate, language };
};

