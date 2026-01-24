import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/api/queryKeys";
import {
  fetchSymptoms,
  fetchSymptom,
  fetchSymptomAnalysis,
  createSymptom,
  updateSymptom,
  deleteSymptom,
} from "../api/symptom.client";
import type {
  CreateSymptomDto,
  UpdateSymptomDto,
  SymptomDto,
  SymptomCategory,
} from "@/shared/types/api/symptom.dto";

/**
 * Hook для получения всех симптомов пользователя
 */
export const useSymptomsQuery = (
  userId?: string,
  category?: SymptomCategory,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.symptoms(userId), category, startDate, endDate],
    queryFn: () => fetchSymptoms(userId, category, startDate, endDate),
    staleTime: 1000 * 60 * 5, // 5 минут
  });
};

/**
 * Hook для получения симптома по ID
 */
export const useSymptomQuery = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.symptom(id),
    queryFn: () => fetchSymptom(id),
    enabled: !!id,
  });
};

/**
 * Hook для получения AI-анализа симптома
 */
export const useSymptomAnalysisQuery = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.symptom(id), "analysis"],
    queryFn: () => fetchSymptomAnalysis(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 минут (анализ не меняется часто)
  });
};

/**
 * Hook для создания симптома
 */
export const useCreateSymptom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSymptomDto) => createSymptom(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.symptoms() });
      // Важно: статус Bloom зависит от симптомов, поэтому обновляем его сразу
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bloom.status() });
      queryClient.refetchQueries({ queryKey: QUERY_KEYS.bloom.status(), type: "active" });
    },
  });
};

/**
 * Hook для обновления симптома
 */
export const useUpdateSymptom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSymptomDto }) =>
      updateSymptom(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.symptoms() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.symptom(data.id) });
      // Важно: статус Bloom зависит от симптомов, поэтому обновляем его сразу
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bloom.status() });
      queryClient.refetchQueries({ queryKey: QUERY_KEYS.bloom.status(), type: "active" });
    },
  });
};

/**
 * Hook для удаления симптома
 */
export const useDeleteSymptom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSymptom(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.symptoms() });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.symptom(id) });
      // Важно: статус Bloom зависит от симптомов, поэтому обновляем его сразу
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bloom.status() });
      queryClient.refetchQueries({ queryKey: QUERY_KEYS.bloom.status(), type: "active" });
    },
  });
};

