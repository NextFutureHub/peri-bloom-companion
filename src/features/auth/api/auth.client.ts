import { BaseService } from "@/shared/api/baseService";
import type {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  RefreshTokenDto,
} from "@/shared/types/api/auth.dto";

/**
 * Auth Service - работа с аутентификацией
 */
class AuthService extends BaseService {
  /**
   * Вход пользователя
   */
  login(credentials: LoginDto): Promise<AuthResponseDto> {
    return this.post<AuthResponseDto>("/auth/login", credentials);
  }

  /**
   * Регистрация пользователя (шаг 1)
   */
  register(data: RegisterDto): Promise<AuthResponseDto> {
    return this.post<AuthResponseDto>("/auth/register", data);
  }

  /**
   * Обновление access token через refresh token
   */
  refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    return this.post<{ accessToken: string }>("/auth/refresh", { refreshToken });
  }

  /**
   * Выход пользователя
   */
  async logout(): Promise<void> {
    await this.post("/auth/logout", {});
    // Очищаем токены из хранилища
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export const authService = new AuthService();

// Экспортируем методы для удобства
export const login = (credentials: LoginDto) => authService.login(credentials);
export const register = (data: RegisterDto) => authService.register(data);
export const refreshToken = (refreshToken: string) => authService.refreshToken(refreshToken);
export const logout = () => authService.logout();

// Re-export типы
export type {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  RefreshTokenDto,
} from "@/shared/types/api/auth.dto";

