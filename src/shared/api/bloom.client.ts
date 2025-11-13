import { api } from "./client";
import type {
  BloomSnapshotDto,
  BloomAchievementDto,
  BloomPreferences,
  BloomHistoryPageDto,
} from "@/shared/types/api/bloom.dto";

/**
 * API клиент для эмоционального цветка
 */

export const createBloomSnapshot = async (dto: {
  stage: string;
  mood: string;
  harmonyScore: number;
  careScore: number;
  balanceScore: number;
  petals: number;
  storyCue: string;
  companionVisible: boolean;
}): Promise<BloomSnapshotDto> => {
  const response = await api.post<BloomSnapshotDto>("/bloom/snapshots", dto);
  return response.data;
};

export const fetchBloomHistory = async (page?: number, pageSize?: number): Promise<BloomHistoryPageDto> => {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  const response = await api.get<BloomHistoryPageDto>(`/bloom/snapshots${params.toString() ? `?${params.toString()}` : ""}`);
  return response.data;
};

export const fetchBloomInsight = async (): Promise<{
  currentStage: string;
  currentMood: string;
  harmonyScore: number;
  careScore: number;
  recentTrend: "improving" | "stable" | "declining";
} | null> => {
  const response = await api.get("/bloom/insight");
  return response.data;
};

export const fetchBloomAchievements = async (): Promise<BloomAchievementDto[]> => {
  const response = await api.get<BloomAchievementDto[]>("/bloom/achievements");
  return response.data;
};

export const updateBloomPreferences = async (preferences: Partial<BloomPreferences>): Promise<void> => {
  await api.patch("/bloom/preferences", preferences);
};
