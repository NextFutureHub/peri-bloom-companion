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
      if (data.onboardingStatus === "complete") {
        navigate("/dashboard");
      } else {
        navigate("/");
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
