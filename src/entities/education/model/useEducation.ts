import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/api/queryKeys";
import {
  fetchEducationModules,
  fetchEducationModule,
  fetchEducationModuleLessons,
  fetchEducationModuleProgress,
} from "../api/education.client";
import type {
  EducationModuleDto,
  LessonDto,
  EducationModuleFilters,
  EducationModuleProgressDto,
} from "@/shared/types/api/education.dto";

type QueryOptions<TData> = Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">;

export const useEducationModules = (
  filters?: EducationModuleFilters,
  options?: QueryOptions<EducationModuleDto[]>,
) => {
  return useQuery<EducationModuleDto[], Error>({
    queryKey: QUERY_KEYS.educationModules(filters),
    queryFn: () => fetchEducationModules(filters),
    ...options,
  });
};

export const useEducationModule = (
  id: string,
  options?: QueryOptions<EducationModuleDto>,
) => {
  return useQuery<EducationModuleDto, Error>({
    queryKey: QUERY_KEYS.educationModule(id),
    queryFn: () => fetchEducationModule(id),
    enabled: Boolean(id),
    retry: (failureCount, error) => {
      // Не повторяем запрос при 404 ошибке
      if (error && 'response' in error && (error as { response?: { status?: number } }).response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
};

export const useEducationModuleLessons = (
  moduleId: string,
  options?: QueryOptions<LessonDto[]>,
) => {
  return useQuery<LessonDto[], Error>({
    queryKey: QUERY_KEYS.educationModuleLessons(moduleId),
    queryFn: () => fetchEducationModuleLessons(moduleId),
    enabled: Boolean(moduleId),
    ...options,
  });
};

export const useEducationModuleProgress = (
  moduleId: string,
  options?: QueryOptions<EducationModuleProgressDto>,
) => {
  return useQuery<EducationModuleProgressDto, Error>({
    queryKey: QUERY_KEYS.educationModuleProgress(moduleId),
    queryFn: () => fetchEducationModuleProgress(moduleId),
    enabled: Boolean(moduleId),
    ...options,
  });
};
