import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register, refreshToken, logout, type LoginDto, type RegisterDto } from "../api/auth.client";
import { QUERY_KEYS } from "@/shared/api/queryKeys";
import { toast } from "sonner";

/**
 * Hook для входа пользователя
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginDto) => login(credentials),
    onSuccess: (data) => {
      // Сохраняем токены
      if (data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // Инвалидируем кеш пользователя для обновления данных
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user() });

      toast.success("Вход выполнен успешно");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Ошибка входа");
    },
  });
};

/**
 * Hook для регистрации пользователя
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDto) => register(data),
    onSuccess: (data) => {
      // Сохраняем registration token если есть
      if (data.registrationToken) {
        localStorage.setItem("registrationToken", data.registrationToken);
      }
      toast.success("Регистрация начата");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Ошибка регистрации");
    },
  });
};

/**
 * Hook для обновления токена
 */
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (refreshTokenValue: string) => refreshToken(refreshTokenValue),
    onSuccess: (data) => {
      if (data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken);
      }
    },
  });
};

/**
 * Hook для выхода
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Очищаем весь кеш
      queryClient.clear();
      toast.success("Выход выполнен");
      // Редирект на страницу входа
      window.location.href = "/";
    },
    onError: () => {
      // Даже если запрос не удался, очищаем локально
      queryClient.clear();
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/";
    },
  });
};


