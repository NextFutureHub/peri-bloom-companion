import { BaseService } from "@/shared/api/baseService";
import type {
  SymptomDto,
  CreateSymptomDto,
  UpdateSymptomDto,
  SymptomAnalysisDto,
  SymptomCategory,
} from "@/shared/types/api/symptom.dto";

/**
 * Symptom Service - работа с симптомами
 */
class SymptomService extends BaseService {
  /**
   * Получить все симптомы пользователя
   */
  fetchSymptoms(
    userId?: string,
    category?: SymptomCategory,
    startDate?: string,
    endDate?: string,
  ): Promise<SymptomDto[]> {
    const params: Record<string, unknown> = {};
    if (userId) params.userId = userId;
    if (category) params.category = category;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return this.get<SymptomDto[]>("/symptoms", params);
  }

  /**
   * Получить симптом по ID
   */
  fetchSymptom(id: string): Promise<SymptomDto> {
    return this.get<SymptomDto>(`/symptoms/${id}`);
  }

  /**
   * Получить AI-анализ симптома
   */
  fetchSymptomAnalysis(id: string): Promise<SymptomAnalysisDto> {
    return this.get<SymptomAnalysisDto>(`/symptoms/${id}/analysis`);
  }

  /**
   * Создать новый симптом
   */
  createSymptom(payload: CreateSymptomDto): Promise<SymptomDto> {
    return this.post<SymptomDto>("/symptoms", payload);
  }

  /**
   * Обновить симптом
   */
  updateSymptom(id: string, payload: UpdateSymptomDto): Promise<SymptomDto> {
    return this.patch<SymptomDto>(`/symptoms/${id}`, payload);
  }

  /**
   * Удалить симптом
   */
  deleteSymptom(id: string): Promise<void> {
    return this.delete(`/symptoms/${id}`);
  }
}

export const symptomService = new SymptomService();

// Экспортируем методы для удобства
export const fetchSymptoms = (
  userId?: string,
  category?: SymptomCategory,
  startDate?: string,
  endDate?: string,
) => symptomService.fetchSymptoms(userId, category, startDate, endDate);
export const fetchSymptom = (id: string) => symptomService.fetchSymptom(id);
export const fetchSymptomAnalysis = (id: string) => symptomService.fetchSymptomAnalysis(id);
export const createSymptom = (payload: CreateSymptomDto) => symptomService.createSymptom(payload);
export const updateSymptom = (id: string, payload: UpdateSymptomDto) =>
  symptomService.updateSymptom(id, payload);
export const deleteSymptom = (id: string) => symptomService.deleteSymptom(id);

// Re-export типы
export type {
  SymptomDto,
  CreateSymptomDto,
  UpdateSymptomDto,
  SymptomAnalysisDto,
  SymptomCategory,
  TriageLevel,
} from "@/shared/types/api/symptom.dto";

