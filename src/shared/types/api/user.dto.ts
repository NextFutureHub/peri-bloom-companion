import type { BaseEntity } from "../common";

/**
 * Настройки пользователя
 */
export interface UserSettingsDto {
  notificationsEnabled: boolean;
  aiAssistantTone: "empathetic" | "medical" | "educational";
}

/**
 * Профиль пользователя
 */
export interface UserProfileDto {
  id: string;
  userId: string;
  lifeStage: "pregnancy" | "postpartum" | "childcare";
  name?: string | null;
  language: "ru" | "kk" | "en";
  dateOfBirth?: string | null;
  timezone?: string | null;
  preferredLanguage?: string | null;
  
  // Pregnancy fields
  pregnancyReference?: "LMP" | "EDD" | "IVF" | "unknown" | null;
  lastMenstrualPeriod?: string | null;
  estimatedDueDate?: string | null;
  ivfTransferDate?: string | null;
  pregnancyDueDate?: string | null; // legacy
  conceptionDate?: string | null;
  
  // Postpartum/Childcare fields
  deliveryDate?: string | null;
  deliveryMethod?: "vaginal" | "cesarean" | "assisted" | "unknown" | null;
  babyBirthDate?: string | null; // legacy
  children?: unknown; // JSON array of child objects
  
  // Medical data
  breastfeedingStatus?: string | null;
  medDataConsent: boolean;
  medDataConsentAt?: string | null;
  
  // Settings
  notificationsEnabled: boolean;
  aiAssistantTone: "empathetic" | "medical" | "educational";
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Пользователь с профилем
 */
export interface UserWithProfileResponseDto extends BaseEntity {
  email: string;
  role: "user" | "admin";
  profile?: UserProfileDto;
}

/**
 * DTO для обновления профиля
 */
export interface UpdateProfileDto {
  name?: string;
  language?: "ru" | "kk" | "en";
  dateOfBirth?: string;
  timezone?: string;
  breastfeedingStatus?: string;
  settings?: {
    notificationsEnabled?: boolean;
    aiAssistantTone?: "empathetic" | "medical" | "educational";
  };
}


