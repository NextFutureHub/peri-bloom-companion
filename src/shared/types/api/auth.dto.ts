/**
 * DTO для входа в систему
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * DTO для регистрации (шаг 1)
 */
export interface RegisterDto {
  email: string;
  password: string;
}

/**
 * DTO для заполнения профиля (шаг 2)
 */
export interface RegisterProfileDto {
  name?: string;
  lifeStage: "pregnancy" | "postpartum" | "childcare";
}

/**
 * DTO для контекстных данных беременности (шаг 3)
 */
export interface PregnancyContextDto {
  pregnancyReference: "LMP" | "EDD" | "IVF" | "unknown";
  lastMenstrualPeriod?: string;
  estimatedDueDate?: string;
  ivfTransferDate?: string;
  medDataConsent?: boolean;
}

/**
 * DTO для контекстных данных послеродового периода (шаг 3)
 */
export interface PostpartumContextDto {
  deliveryDate: string;
  deliveryMethod?: "vaginal" | "cesarean" | "assisted" | "unknown";
  medDataConsent?: boolean;
}

/**
 * DTO для данных о ребёнке
 */
export interface ChildDataDto {
  name?: string;
  dateOfBirth: string;
  sex?: "male" | "female" | "other";
  prematurityWeeks?: number;
}

/**
 * DTO для контекстных данных ухода за ребёнком (шаг 3)
 */
export interface ChildcareContextDto {
  children: ChildDataDto[];
  medDataConsent?: boolean;
}

/**
 * Ответ регистрации (шаги 1 и 2)
 */
export interface RegisterResponseDto {
  registrationToken: string;
  onboardingStatus: "step1" | "step2";
}

/**
 * Ответ аутентификации
 */
export interface AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    role: "user" | "admin";
  };
  registrationToken?: string;
  onboardingStatus?: "step1" | "step2" | "complete";
}

/**
 * DTO для обновления токена
 */
export interface RefreshTokenDto {
  refreshToken: string;
}

/**
 * DTO для выхода
 */
export interface LogoutDto {
  refreshToken: string;
}


