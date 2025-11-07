import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - добавляет токен авторизации
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthTokenFromMemory();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - обрабатывает ошибки
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Токен истек или невалиден - редирект на логин
      clearAuthToken();
      window.dispatchEvent(new CustomEvent("unauthorized"));
      // Можно добавить логику refresh token здесь
    }
    return Promise.reject(error);
  }
);

// Утилиты для работы с токеном в памяти
function getAuthTokenFromMemory(): string | null {
  return sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
}

function clearAuthToken(): void {
  sessionStorage.removeItem("accessToken");
  localStorage.removeItem("accessToken");
}

// Слушатель события unauthorized для редиректа
if (typeof window !== "undefined") {
  window.addEventListener("unauthorized", () => {
    window.location.href = "/auth/login";
  });
}


