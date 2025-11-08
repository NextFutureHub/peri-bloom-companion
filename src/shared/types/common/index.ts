/**
 * Общие типы для всего приложения
 */

export type LifeStage = "pregnancy" | "postpartum" | "childcare" | null;
export type Language = "ru" | "kk" | "en";

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}



