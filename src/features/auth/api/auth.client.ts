import { BaseService } from "@/shared/api/baseService";
import { tokenStorage } from "@/shared/api/client";
import type {
  LoginDto,
  RegisterDto,
  RegisterProfileDto,
  RegisterResponseDto,
  PregnancyContextDto,
  PostpartumContextDto,
  ChildcareContextDto,
  AuthResponseDto,
  RefreshTokenDto,
  LogoutDto,
} from "@/shared/types/api/auth.dto";

/**
 * Auth Service - работа с аутентификацией
 * Поддерживает 3-шаговую регистрацию
 */
class AuthService extends BaseService {
  /**
   * Вход пользователя
   */
  async login(credentials: LoginDto): Promise<AuthResponseDto> {
    const response = await this.post<AuthResponseDto>("/auth/login", credentials);
    
    // Сохраняем токены
    if (response.accessToken) {
      tokenStorage.setAccessToken(response.accessToken);
    }
    if (response.refreshToken) {
      tokenStorage.setRefreshToken(response.refreshToken);
    }
    
    return response;
  }

  /**
   * Регистрация пользователя (шаг 1: email + password)
   */
  async register(data: RegisterDto): Promise<RegisterResponseDto> {
    const response = await this.post<RegisterResponseDto>("/auth/register", data);
    
    // Сохраняем registration token
    if (response.registrationToken) {
      tokenStorage.setRegistrationToken(response.registrationToken);
    }
    
    return response;
  }

  /**
   * Заполнение профиля (шаг 2: name + lifeStage)
   */
  async registerProfile(data: RegisterProfileDto): Promise<RegisterResponseDto> {
    const response = await this.post<RegisterResponseDto>("/auth/register/profile", data);
    
    // Обновляем registration token
    if (response.registrationToken) {
      tokenStorage.setRegistrationToken(response.registrationToken);
    }
    
    return response;
  }

  /**
   * Заполнение контекстных данных (шаг 3: контекст в зависимости от lifeStage)
   */
  async registerContext(
    context: PregnancyContextDto | PostpartumContextDto | ChildcareContextDto
  ): Promise<AuthResponseDto> {
    const response = await this.post<AuthResponseDto>("/auth/register/context", context);
    
    // Сохраняем токены и очищаем registration token
    if (response.accessToken) {
      tokenStorage.setAccessToken(response.accessToken);
    }
    if (response.refreshToken) {
      tokenStorage.setRefreshToken(response.refreshToken);
    }
    tokenStorage.setRegistrationToken(""); // Очищаем registration token
    
    return response;
  }

  /**
   * Пропустить шаг 3 и завершить базовую регистрацию
   */
  async skipContext(): Promise<AuthResponseDto> {
    const response = await this.post<AuthResponseDto>("/auth/register/skip");
    
    // Сохраняем токены и очищаем registration token
    if (response.accessToken) {
      tokenStorage.setAccessToken(response.accessToken);
    }
    if (response.refreshToken) {
      tokenStorage.setRefreshToken(response.refreshToken);
    }
    tokenStorage.setRegistrationToken(""); // Очищаем registration token
    
    return response;
  }

  /**
   * Обновление access token через refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    const response = await this.post<AuthResponseDto>("/auth/refresh", { refreshToken });
    
    // Обновляем токены
    if (response.accessToken) {
      tokenStorage.setAccessToken(response.accessToken);
    }
    if (response.refreshToken) {
      tokenStorage.setRefreshToken(response.refreshToken);
    }
    
    return response;
  }

  /**
   * Выход пользователя
   */
  async logout(): Promise<{ message: string }> {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (refreshToken) {
      await this.post<{ message: string }>("/auth/logout", { refreshToken });
    }
    
    // Очищаем все токены
    tokenStorage.clearAll();
    
    return { message: "Выход выполнен успешно" };
  }
}

export const authService = new AuthService();

// Экспортируем методы для удобства
export const login = (credentials: LoginDto) => authService.login(credentials);
export const register = (data: RegisterDto) => authService.register(data);
export const registerProfile = (data: RegisterProfileDto) => authService.registerProfile(data);
export const registerContext = (
  context: PregnancyContextDto | PostpartumContextDto | ChildcareContextDto
) => authService.registerContext(context);
export const skipContext = () => authService.skipContext();
export const refreshToken = (refreshToken: string) => authService.refreshToken(refreshToken);
export const logout = () => authService.logout();

// Re-export типы
export type {
  LoginDto,
  RegisterDto,
  RegisterProfileDto,
  RegisterResponseDto,
  PregnancyContextDto,
  PostpartumContextDto,
  ChildcareContextDto,
  AuthResponseDto,
  RefreshTokenDto,
  LogoutDto,
} from "@/shared/types/api/auth.dto";

