/**
 * API клиент для аналитических метрик из Femli приложения
 * Интеграция с системой аналитики согласно ТЗ
 */
import { api } from "@/shared/api/client";

// --- New metrics ---

export interface FirstTimeAppOpenByDayDto {
  day: string; // YYYY-MM-DD
  users: number;
}

export interface FirstTimeAppOpenResponseDto {
  startDate: string;
  endDate: string;
  totalUsers: number;
  byDay: FirstTimeAppOpenByDayDto[];
}

export interface D7AppOpenAfterRegistrationResponseDto {
  cohortStart: string;
  cohortEnd: string;
  eligibleUsers: number;
  returnedUsers: number;
  retentionRate: number;
}

export interface RiskEngineOverviewResponseDto {
  startDate: string;
  endDate: string;
  periodDays: number;
  activeUsersWithData: number;
  validSeriesUsers: number;
  validSeriesRate: number;
  coverageAvgDays: number;
  volatilityAvgRiskChanges: number;
  explainabilityCoverage: number;
  actionAlignment24h: number;
}

export const fetchFirstTimeAppOpens = async (periodDays?: number): Promise<FirstTimeAppOpenResponseDto> => {
  const params = periodDays ? { periodDays } : {};
  const response = await api.get<FirstTimeAppOpenResponseDto>("/admin/analytics/app-open/first-time", { params });
  return response.data;
};

export const fetchD7AppOpenAfterRegistration = async (periodDays?: number): Promise<D7AppOpenAfterRegistrationResponseDto> => {
  const params = periodDays ? { periodDays } : {};
  const response = await api.get<D7AppOpenAfterRegistrationResponseDto>("/admin/analytics/retention/app-open/d7", { params });
  return response.data;
};

export const fetchRiskEngineOverview = async (periodDays?: number): Promise<RiskEngineOverviewResponseDto> => {
  const params = periodDays ? { periodDays } : {};
  const response = await api.get<RiskEngineOverviewResponseDto>("/admin/analytics/risk/overview", { params });
  return response.data;
};