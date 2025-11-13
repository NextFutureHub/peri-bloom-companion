import type { BaseEntity } from "../common";

export type BloomGrowthStage = "seed" | "emerging" | "bloom" | "renewal" | "companions";
export type BloomMood = "radiant" | "balanced" | "resting";
export type BloomStoryCue = "rise" | "restore" | "glow";
export type BloomBadgeType = "care_streak" | "harmony_days" | "ai_interaction" | "stage_milestone" | "companion_unlocked";

export interface BloomSnapshotDto extends BaseEntity {
  userId: string;
  stage: BloomGrowthStage;
  mood: BloomMood;
  harmonyScore: number;
  careScore: number;
  balanceScore: number;
  petals: number;
  storyCue: BloomStoryCue;
  companionVisible: boolean;
  aiNote?: string | null;
  isDuplicate: boolean;
}

export interface CreateBloomSnapshotDto {
  stage: BloomGrowthStage;
  mood: BloomMood;
  harmonyScore: number;
  careScore: number;
  balanceScore: number;
  petals: number;
  storyCue: BloomStoryCue;
  companionVisible: boolean;
}

export interface BloomAchievementDto extends BaseEntity {
  userId: string;
  badgeType: BloomBadgeType;
  badgeName: string;
  description?: string | null;
  criteria?: unknown;
  progress: number;
  target: number;
  isCompleted: boolean;
  completedAt?: string | null;
}

export interface BloomPreferences {
  bloomDetailLevel: "minimal" | "standard" | "immersive";
  bloomAnimationSpeed: "auto" | "slow" | "normal" | "fast";
  bloomCompanionEnabled: boolean;
}

export interface BloomHistoryMetaDto {
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BloomHistoryPageDto {
  items: BloomSnapshotDto[];
  meta: BloomHistoryMetaDto;
}
