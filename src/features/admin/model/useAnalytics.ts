/**
 * React Query хуки для аналитических метрик в админ-панели
 * Интеграция с системой аналитики из Femli приложения
 */
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/api/queryKeys";
import {
  fetchAnalyticsOverview,
  fetchAnalyticsMetrics,
  fetchAnalyticsFunnel,
  fetchAnalyticsLosses,
  fetchAnalyticsEvents,
  fetchAnalyticsFeedback,
} from "../api/analytics.client";

/**
 * Основной хук для получения обзора аналитики
 */
export const useAnalyticsOverview = (periodDays?: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.dashboard(), 'analytics', 'overview', periodDays],
    queryFn: () => fetchAnalyticsOverview(periodDays),
    staleTime: 1000 * 60 * 5, // 5 минут
    refetchInterval: 1000 * 60 * 10, // Обновляем каждые 10 минут
  });
};

/**
 * Детальные метрики за период
 */
export const useAnalyticsMetrics = (
  startDate?: string,
  endDate?: string,
  periodDays?: number
) => {
  return useQuery({
    queryKey: ['analytics', 'metrics', startDate, endDate, periodDays],
    queryFn: () => fetchAnalyticsMetrics(startDate, endDate, periodDays),
    staleTime: 1000 * 60 * 5,
    enabled: !!(startDate && endDate) || !!periodDays,
  });
};

/**
 * Анализ воронки пользователей
 */
export const useAnalyticsFunnel = (periodDays?: number) => {
  return useQuery({
    queryKey: ['analytics', 'funnel', periodDays],
    queryFn: () => fetchAnalyticsFunnel(periodDays),
    staleTime: 1000 * 60 * 10, // 10 минут
  });
};

/**
 * Анализ потерь пользователей
 */
export const useAnalyticsLosses = () => {
  return useQuery({
    queryKey: ['analytics', 'losses'],
    queryFn: fetchAnalyticsLosses,
    staleTime: 1000 * 60 * 15, // 15 минут
  });
};

/**
 * События для отладки
 */
export const useAnalyticsEvents = (
  limit: number = 100,
  userId?: string,
  eventName?: string
) => {
  return useQuery({
    queryKey: ['analytics', 'events', limit, userId, eventName],
    queryFn: () => fetchAnalyticsEvents(limit, userId, eventName),
    staleTime: 1000 * 60 * 2, // 2 минуты
    enabled: false, // Включаем только при необходимости
  });
};

/**
 * Качественная обратная связь
 */
export const useAnalyticsFeedback = (limit: number = 50) => {
  return useQuery({
    queryKey: ['analytics', 'feedback', limit],
    queryFn: () => fetchAnalyticsFeedback(limit),
    staleTime: 1000 * 60 * 30, // 30 минут
  });
};

/**
 * Хук для получения North Star Metric (главная метрика)
 */
export const useNorthStarMetric = (periodDays: number = 7) => {
  const { data: overview, ...rest } = useAnalyticsOverview(periodDays);
  
  return {
    ...rest,
    northStarMetric: overview?.metrics.north_star_metric,
    data: overview,
  };
};

/**
 * Хук для получения ключевых метрик для дашборда
 */
export const useKeyMetrics = () => {
  const { data: overview, isLoading, error } = useAnalyticsOverview();
  
  return {
    data: overview ? {
      northStar: overview.metrics.north_star_metric,
      activationRate: overview.metrics.activation_rate,
      day1Retention: overview.metrics.day1_retention,
      day7Retention: overview.metrics.day7_retention,
      coreActionFrequency: overview.metrics.core_action_frequency,
      repeatUsersPercent: overview.metrics.repeat_users_percent,
      totalEvents: overview.totalEvents,
      uniqueUsers: overview.uniqueUsers,
    } : undefined,
    isLoading,
    error,
  };
};