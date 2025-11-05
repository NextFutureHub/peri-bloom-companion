import type { BaseEntity } from "../common";

export interface UserDto extends BaseEntity {
  email: string;
  role: "user" | "admin";
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

export interface UserWithProfileResponseDto extends BaseEntity {
  email: string;
  role: "user" | "admin";
  profile?: UserProfileDto;
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

