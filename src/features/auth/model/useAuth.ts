import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  login,
  register,
  registerProfile,
  registerContext,
  skipContext,
  logout,
} from "../api/auth.client";
import type {
  LoginDto,
  RegisterDto,
  RegisterProfileDto,
  PregnancyContextDto,
  PostpartumContextDto,
  ChildcareContextDto,
  AuthResponseDto,
} from "@/shared/types/api/auth.dto";
import { QUERY_KEYS } from "@/shared/api/queryKeys";

/**
 * Hook для входа в систему
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginDto) => login(credentials),
    onSuccess: (data: AuthResponseDto) => {
      // Инвалидируем кеш пользователя для получения актуальных данных
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user() });
      
      // Редиректим в зависимости от статуса onboarding
      // Если есть accessToken (не пустой) и нет registrationToken - onboarding завершен
      // Если есть registrationToken - onboarding не завершен
      const hasValidAccessToken = data.accessToken && data.accessToken.trim() !== "";
      const hasRegistrationToken = !!data.registrationToken;
      
      if (hasValidAccessToken && !hasRegistrationToken) {
        // Onboarding завершен - редирект на dashboard
        // Используем window.location для принудительного редиректа
        window.location.href = "/dashboard";
      } else if (hasRegistrationToken) {
        // Onboarding не завершен - остаемся на странице регистрации
        // Обновляем registrationToken в storage (уже сохранен в auth.client.ts)
        navigate("/", { replace: true });
      } else {
        // Fallback - редирект на главную
        navigate("/", { replace: true });
      }
    },
  });
};

/**
 * Hook для регистрации (шаг 1)
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDto) => register(data),
  });
};

/**
 * Hook для заполнения профиля (шаг 2)
 */
export const useRegisterProfile = () => {
  return useMutation({
    mutationFn: (data: RegisterProfileDto) => registerProfile(data),
  });
};

/**
 * Hook для заполнения контекстных данных (шаг 3)
 */
export const useRegisterContext = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (
      context: PregnancyContextDto | PostpartumContextDto | ChildcareContextDto
    ) => registerContext(context),
    onSuccess: (data: AuthResponseDto) => {
      // Инвалидируем кеш пользователя
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user() });
      
      // Редиректим на dashboard
      navigate("/dashboard");
    },
  });
};

/**
 * Hook для пропуска шага 3
 */
export const useSkipContext = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => skipContext(),
    onSuccess: (data: AuthResponseDto) => {
      // Инвалидируем кеш пользователя
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user() });
      
      // Редиректим на dashboard
      navigate("/dashboard");
    },
  });
};

/**
 * Hook для выхода из системы
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      // Очищаем весь кеш
      queryClient.clear();
      
      // Редиректим на главную страницу
      navigate("/");
    },
  });
};
