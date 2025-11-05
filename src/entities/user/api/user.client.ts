import { BaseService } from "@/shared/api/baseService";
import type {
  UserWithProfileResponseDto,
  UpdateProfileDto,
} from "@/shared/types/api/user.dto";

/**
 * User Service - работа с пользователем
 * Использует BaseService для единообразного API
 */
class UserService extends BaseService {
  /**
   * Получить данные текущего пользователя
   */
  fetchMe(include?: string): Promise<UserWithProfileResponseDto> {
    const params = include ? { include } : {};
    return this.get<UserWithProfileResponseDto>("/users/me", params);
  }

  /**
   * Обновить профиль пользователя
   */
  updateProfile(payload: UpdateProfileDto): Promise<UserWithProfileResponseDto> {
    return this.patch<UserWithProfileResponseDto>("/users/me", payload);
  }
}

export const userService = new UserService();

// Экспортируем методы для удобства
export const fetchMe = (include?: string) => userService.fetchMe(include);
export const updateProfile = (payload: UpdateProfileDto) => userService.updateProfile(payload);

// Re-export типы
export type {
  UserWithProfileResponseDto,
  UpdateProfileDto,
} from "@/shared/types/api/user.dto";

