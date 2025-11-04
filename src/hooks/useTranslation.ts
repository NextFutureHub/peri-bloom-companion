import { useApp } from "@/contexts/AppContext";
import { translations, TranslationKey } from "@/lib/i18n";

export const useTranslation = () => {
  const { language } = useApp();
  
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  return { t, language };
};
