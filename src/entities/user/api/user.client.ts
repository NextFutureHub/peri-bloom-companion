import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/types";

export interface UserDto {
  id: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  profile?: UserProfileDto;
}

export interface UserProfileDto {
  name?: string;
  lifeStage: "pregnancy" | "postpartum" | "childcare" | null;
  language: "ru" | "kk" | "en";
  pregnancyReference?: "LMP" | "EDD" | "IVF" | null;
  lastMenstrualPeriod?: string | null;
  estimatedDueDate?: string | null;
  ivfTransferDate?: string | null;
  deliveryDate?: string | null;
  deliveryMethod?: "vaginal" | "cesarean" | null;
  gestationalAgeWeeks?: number;
  settings: {
    notificationsEnabled: boolean;
    aiAssistantTone: "friendly" | "professional" | "supportive";
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserWithProfileResponseDto {
  id: string;
  email: string;
  role: "user" | "admin";
  profile?: UserProfileDto;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  language?: "ru" | "kk" | "en";
  dateOfBirth?: string;
  timezone?: string;
  breastfeedingStatus?: string;
  settings?: {
    notificationsEnabled?: boolean;
    aiAssistantTone?: "friendly" | "professional" | "supportive";
  };
}

/**
 * Получить данные текущего пользователя
 */
export const fetchMe = (include?: string): Promise<UserWithProfileResponseDto> => {
  const params = include ? { include } : {};
  return api.get<ApiResponse<UserWithProfileResponseDto>>("/users/me", { params }).then((r) => r.data.data);
};

/**
 * Обновить профиль пользователя
 */
export const updateProfile = (payload: UpdateProfileDto): Promise<UserWithProfileResponseDto> => {
  return api.patch<ApiResponse<UserWithProfileResponseDto>>("/users/me", payload).then((r) => r.data.data);
};

