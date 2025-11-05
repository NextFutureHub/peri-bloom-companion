import { api } from "@/shared/api/client";
import type { ApiResponse, PaginatedResponse } from "@/shared/types";

export interface SymptomDto {
  id: string;
  userId: string;
  date: string;
  name: string;
  severity: "low" | "medium" | "high";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSymptomDto {
  date: string;
  name: string;
  severity: "low" | "medium" | "high";
  notes?: string;
}

export interface UpdateSymptomDto extends Partial<CreateSymptomDto> {}

/**
 * Получить все симптомы пользователя
 */
export const fetchSymptoms = (userId?: string): Promise<SymptomDto[]> => {
  const params = userId ? { userId } : {};
  return api.get<ApiResponse<SymptomDto[]>>("/symptoms", { params }).then((r) => r.data.data);
};

/**
 * Получить симптом по ID
 */
export const fetchSymptom = (id: string): Promise<SymptomDto> => {
  return api.get<ApiResponse<SymptomDto>>(`/symptoms/${id}`).then((r) => r.data.data);
};

/**
 * Создать новый симптом
 */
export const createSymptom = (payload: CreateSymptomDto): Promise<SymptomDto> => {
  return api.post<ApiResponse<SymptomDto>>("/symptoms", payload).then((r) => r.data.data);
};

/**
 * Обновить симптом
 */
export const updateSymptom = (id: string, payload: UpdateSymptomDto): Promise<SymptomDto> => {
  return api.patch<ApiResponse<SymptomDto>>(`/symptoms/${id}`, payload).then((r) => r.data.data);
};

/**
 * Удалить симптом
 */
export const deleteSymptom = (id: string): Promise<void> => {
  return api.delete(`/symptoms/${id}`).then(() => undefined);
};

