/**
 * React Query хуки для аналитических метрик в админ-панели
 * Интеграция с системой аналитики из Femli приложения
 */
import { useQuery } from "@tanstack/react-query";
import {
  fetchFirstTimeAppOpens,
  fetchD7AppOpenAfterRegistration,
  fetchRiskEngineOverview,
} from "../api/analytics.client";

/**
 * Сколько пользователей впервые открыли приложение (first-time app_open) за период
 */
export const useFirstTimeAppOpens = (periodDays: number = 7) => {
  return useQuery({
    queryKey: ['analytics', 'app-open', 'first-time', periodDays],
    queryFn: () => fetchFirstTimeAppOpens(periodDays),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * D7 app_open от регистрации (сколько открыли на 7-й день после createdAt)
 */
export const useD7AppOpenAfterRegistration = (periodDays: number = 7) => {
  return useQuery({
    queryKey: ['analytics', 'retention', 'app-open', 'd7', periodDays],
    queryFn: () => fetchD7AppOpenAfterRegistration(periodDays),
    staleTime: 1000 * 60 * 10,
  });
};

export const useRiskEngineOverview = (periodDays: number = 7) => {
  return useQuery({
    queryKey: ['analytics', 'risk', 'overview', periodDays],
    queryFn: () => fetchRiskEngineOverview(periodDays),
    staleTime: 1000 * 60 * 5,
  });
};