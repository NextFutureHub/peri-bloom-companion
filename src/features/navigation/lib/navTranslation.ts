import type { NavigationItem } from "@/shared/types/api/navigation.dto";

/**
 * Получить ключ перевода для элемента навигации на основе route или id
 */
export const getNavTranslationKey = (item: NavigationItem): string => {
  // Сначала пробуем по route
  const routeMap: Record<string, string> = {
    "/dashboard": "nav.dashboard",
    "/ai-chat": "nav.aiChat",
    "/symptoms": "nav.symptoms",
    "/education": "nav.education",
    "/settings": "nav.settings",
    "/iot": "nav.iot",
  };

  if (routeMap[item.route]) {
    return routeMap[item.route];
  }

  // Если не нашли по route, пробуем по id
  const idMap: Record<string, string> = {
    dashboard: "nav.dashboard",
    "ai-chat": "nav.aiChat",
    symptoms: "nav.symptoms",
    education: "nav.education",
    settings: "nav.settings",
    iot: "nav.iot",
  };

  return idMap[item.id] || item.label; // Fallback на оригинальную метку
};

