import { AxiosResponse } from "axios";
import { api } from "./client";
import type { ApiResponse } from "../types";

/**
 * Базовый сервис для всех API клиентов
 * Предоставляет общие методы для работы с API
 */
export class BaseService {
  /**
   * GET запрос
   */
  protected get<T>(url: string, params?: any): Promise<T> {
    return api.get<ApiResponse<T>>(url, { params }).then((response) => response.data.data);
  }

  /**
   * POST запрос
   */
  protected post<T>(url: string, data?: any): Promise<T> {
    return api.post<ApiResponse<T>>(url, data).then((response) => response.data.data);
  }

  /**
   * PATCH запрос
   */
  protected patch<T>(url: string, data?: any): Promise<T> {
    return api.patch<ApiResponse<T>>(url, data).then((response) => response.data.data);
  }

  /**
   * PUT запрос
   */
  protected put<T>(url: string, data?: any): Promise<T> {
    return api.put<ApiResponse<T>>(url, data).then((response) => response.data.data);
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
  protected getRaw<T>(url: string, params?: any): Promise<AxiosResponse<ApiResponse<T>>> {
    return api.get<ApiResponse<T>>(url, { params });
  }
}


