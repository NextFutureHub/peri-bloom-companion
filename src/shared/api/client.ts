import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Конфигурация API клиента
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

/**
 * Флаг для предотвращения множественных одновременных refresh запросов
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Обработка очереди запросов после обновления токена
 */
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Утилиты для работы с токенами
 */
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },
  setAccessToken: (token: string): void => {
    localStorage.setItem("accessToken", token);
  },
  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },
  setRefreshToken: (token: string): void => {
    localStorage.setItem("refreshToken", token);
  },
  getRegistrationToken: (): string | null => {
    return sessionStorage.getItem("registrationToken");
  },
  setRegistrationToken: (token: string): void => {
    sessionStorage.setItem("registrationToken", token);
  },
  clearAll: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("registrationToken");
  },
};

/**
 * Request interceptor - добавляет токен авторизации или registration token
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Добавляем access token если есть
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Добавляем registration token если есть (для регистрации)
    const registrationToken = tokenStorage.getRegistrationToken();
    if (registrationToken && config.headers) {
      config.headers["X-Registration-Token"] = registrationToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - обрабатывает ошибки и refresh токенов
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ message?: string; statusCode?: number }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Если ошибка 401 и это не запрос на refresh/login
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Если уже идет процесс обновления токена, добавляем запрос в очередь
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();

      // Если нет refresh token, очищаем все и редиректим на логин
      if (!refreshToken) {
        tokenStorage.clearAll();
        processQueue(error, null);
        window.dispatchEvent(new CustomEvent("unauthorized"));
        return Promise.reject(error);
      }

      try {
        // Пытаемся обновить токен
        const response = await axios.post<{
          accessToken: string;
          refreshToken?: string;
        }>(`${api.defaults.baseURL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Сохраняем новые токены
        tokenStorage.setAccessToken(accessToken);
        if (newRefreshToken) {
          tokenStorage.setRefreshToken(newRefreshToken);
        }

        // Обновляем заголовок оригинального запроса
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Обрабатываем очередь запросов
        processQueue(null, accessToken);

        // Повторяем оригинальный запрос
        return api(originalRequest);
      } catch (refreshError) {
        // Ошибка при обновлении токена - очищаем все и редиректим
        tokenStorage.clearAll();
        processQueue(refreshError as AxiosError, null);
        window.dispatchEvent(new CustomEvent("unauthorized"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Слушатель события unauthorized для редиректа
 */
if (typeof window !== "undefined") {
  window.addEventListener("unauthorized", () => {
    // Очищаем токены
    tokenStorage.clearAll();
    // Редиректим на главную страницу (onboarding)
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  });
}


