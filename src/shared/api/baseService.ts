import { AxiosResponse } from "axios";
import { api } from "./client";

/**
 * Базовый сервис для всех API клиентов
 * Предоставляет общие методы для работы с API
 * 
 * Бэкенд возвращает данные напрямую, без обертки в ApiResponse
 */
export class BaseService {
  /**
   * GET запрос
   */
  protected get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return api.get<T>(url, { params }).then((response) => response.data);
  }

  /**
   * POST запрос
   */
  protected post<T>(url: string, data?: unknown): Promise<T> {
    return api.post<T>(url, data).then((response) => response.data);
  }

  /**
   * PATCH запрос
   */
  protected patch<T>(url: string, data?: unknown): Promise<T> {
    return api.patch<T>(url, data).then((response) => response.data);
  }

  /**
   * PUT запрос
   */
  protected put<T>(url: string, data?: unknown): Promise<T> {
    return api.put<T>(url, data).then((response) => response.data);
  }

  /**
   * DELETE запрос
   */
  protected delete(url: string): Promise<void> {
    return api.delete(url).then(() => undefined);
  }

  /**
   * GET запрос с полным ответом (для случаев, когда нужны headers, status и т.д.)
   */
  protected getRaw<T>(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<T>> {
    return api.get<T>(url, { params });
  }
}


