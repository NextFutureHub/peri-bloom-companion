import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/types";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

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

export interface RefreshTokenDto {
  refreshToken: string;
}

/**
 * Вход пользователя
 */
export const login = (credentials: LoginDto): Promise<AuthResponseDto> => {
  return api.post<ApiResponse<AuthResponseDto>>("/auth/login", credentials).then((r) => r.data.data);
};

/**
 * Регистрация пользователя (шаг 1)
 */
export const register = (data: RegisterDto): Promise<AuthResponseDto> => {
  return api.post<ApiResponse<AuthResponseDto>>("/auth/register", data).then((r) => r.data.data);
};

/**
 * Обновление access token через refresh token
 */
export const refreshToken = (refreshToken: string): Promise<{ accessToken: string }> => {
  return api.post<ApiResponse<{ accessToken: string }>>("/auth/refresh", { refreshToken }).then((r) => r.data.data);
};

/**
 * Выход пользователя
 */
export const logout = (): Promise<void> => {
  return api.post("/auth/logout").then(() => {
    // Очищаем токены из хранилища
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  });
};

