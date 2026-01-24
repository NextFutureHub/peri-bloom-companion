/**
 * API клиент для аналитических метрик из Femli приложения
 * Интеграция с системой аналитики согласно ТЗ
 */
import { api } from "@/shared/api/client";

export interface AnalyticsMetricsDto {
  date: string;
  activation_rate: number; // activation_event / app_install
  day1_retention: number;
  day7_retention: number;
  core_action_frequency: number; // среднее число core_action_complete на пользователя
  repeat_users_percent: number; // % пользователей с core_action ≥ 2 раз
  north_star_metric: number; // % пользователей с core_action ≥ 2 раз за 7 дней
}

export interface AnalyticsFunnelStepDto {
  step_name: 'app_install' | 'app_open' | 'activation_event' | 'core_action_repeat';
  users_count: number;
  conversion_from_previous: number; // %
}

export interface AnalyticsFunnelDto {
  date: string;
  steps: AnalyticsFunnelStepDto[];
}

export interface AnalyticsEventDto {
  event_name: string;
  timestamp: string;
  user_id: string;
  session_id: string;
  // Дополнительные поля в зависимости от типа события
  [key: string]: any;
}

export interface AnalyticsFeedbackDto {
  id: string;
  user_id: string;
  trigger: 'after_second_core_action' | 'exit_without_core_action';
  expectations?: string;
  unclear_points?: string;
  exit_reason?: string;
  created_at: string;
}

export interface AnalyticsLossesDto {
  funnel: AnalyticsFunnelDto;
  errorsByScreen: Array<{
    screen: string;
    errors: number;
    errorRate: number;
  }>;
  exitPoints: Array<{
    point: string;
    exits: number;
    exitRate: number;
  }>;
}

export interface AnalyticsOverviewDto {
  metrics: AnalyticsMetricsDto;
  funnel: AnalyticsFunnelDto;
  losses: AnalyticsLossesDto;
  totalEvents: number;
  uniqueUsers: number;
  lastUpdated: string;
}

/**
 * Получить обзор аналитических метрик
 */
export const fetchAnalyticsOverview = async (periodDays?: number): Promise<AnalyticsOverviewDto> => {
  const params = periodDays ? { periodDays } : {};
  const response = await api.get<AnalyticsOverviewDto>("/admin/analytics/overview", { params });
  return response.data;
};

/**
 * Получить детальные метрики за период
 */
export const fetchAnalyticsMetrics = async (
  startDate?: string,
  endDate?: string,
  periodDays?: number
): Promise<AnalyticsMetricsDto> => {
  const params = { startDate, endDate, periodDays };
  const response = await api.get<AnalyticsMetricsDto>("/admin/analytics/metrics", { params });
  return response.data;
};

/**
 * Получить анализ воронки
 */
export const fetchAnalyticsFunnel = async (periodDays?: number): Promise<AnalyticsFunnelDto> => {
  const params = periodDays ? { periodDays } : {};
  const response = await api.get<AnalyticsFunnelDto>("/admin/analytics/funnel", { params });
  return response.data;
};

/**
 * Получить анализ потерь пользователей
 */
export const fetchAnalyticsLosses = async (): Promise<AnalyticsLossesDto> => {
  const response = await api.get<AnalyticsLossesDto>("/admin/analytics/losses");
  return response.data;
};

/**
 * Получить события за период (для отладки)
 */
export const fetchAnalyticsEvents = async (
  limit: number = 100,
  userId?: string,
  eventName?: string
): Promise<{ events: AnalyticsEventDto[]; total: number }> => {
  const params = { limit, userId, eventName };
  const response = await api.get<{ events: AnalyticsEventDto[]; total: number }>(
    "/admin/analytics/events", 
    { params }
  );
  return response.data;
};

/**
 * Получить качественную обратную связь
 */
export const fetchAnalyticsFeedback = async (
  limit: number = 50
): Promise<{ feedback: AnalyticsFeedbackDto[]; total: number }> => {
  const params = { limit };
  const response = await api.get<{ feedback: AnalyticsFeedbackDto[]; total: number }>(
    "/admin/analytics/feedback",
    { params }
  );
  return response.data;
};