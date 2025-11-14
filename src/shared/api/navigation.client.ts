import { api } from "./client";
import type { NavigationConfig, UpdateNavigationConfigDto, NavigationItem } from "@/shared/types/api/navigation.dto";

/**
 * API клиент для настройки навигации
 */

export const fetchNavigationConfig = async (): Promise<NavigationConfig> => {
  const response = await api.get<NavigationConfig>("/navigation/config");
  return response.data;
};

export const updateNavigationConfig = async (dto: UpdateNavigationConfigDto): Promise<NavigationConfig> => {
  const response = await api.put<NavigationConfig>("/navigation/config", dto);
  return response.data;
};

export const fetchNavigationRecommendations = async (): Promise<NavigationItem[]> => {
  const response = await api.get<NavigationItem[]>("/navigation/recommendations");
  return response.data;
};
