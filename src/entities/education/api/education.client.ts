import { BaseService } from "@/shared/api/baseService";
import type {
  EducationModuleDto,
  LessonDto,
  EducationModuleFilters,
  EducationModuleProgressDto,
} from "@/shared/types/api/education.dto";

const normalizeFilters = (
  filters?: EducationModuleFilters,
): Record<string, unknown> | undefined => {
  if (!filters) {
    return undefined;
  }

  return Object.entries(filters).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});
};

class EducationService extends BaseService {
  fetchModules(filters?: EducationModuleFilters): Promise<EducationModuleDto[]> {
    return this.get<EducationModuleDto[]>("/education/modules", normalizeFilters(filters));
  }

  fetchModule(id: string): Promise<EducationModuleDto> {
    return this.get<EducationModuleDto>(`/education/modules/${id}`);
  }

  fetchModuleLessons(moduleId: string): Promise<LessonDto[]> {
    return this.get<LessonDto[]>(`/education/modules/${moduleId}/lessons`);
  }

  fetchModuleProgress(moduleId: string): Promise<EducationModuleProgressDto> {
    return this.get<EducationModuleProgressDto>(`/education/modules/${moduleId}/progress`);
  }
}

export const educationService = new EducationService();

export const fetchEducationModules = (filters?: EducationModuleFilters) =>
  educationService.fetchModules(filters);

export const fetchEducationModule = (id: string) => educationService.fetchModule(id);

export const fetchEducationModuleLessons = (moduleId: string) =>
  educationService.fetchModuleLessons(moduleId);

export const fetchEducationModuleProgress = (moduleId: string) =>
  educationService.fetchModuleProgress(moduleId);

export type { EducationModuleFilters } from "@/shared/types/api/education.dto";
