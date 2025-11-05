import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/api/queryKeys";
import { fetchMe, updateProfile } from "../api/user.client";
import type { UpdateProfileDto, UserWithProfileResponseDto } from "@/shared/types/api/user.dto";

/**
 * Hook для получения данных текущего пользователя
 */
export const useUserQuery = (include?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.user(),
    queryFn: () => fetchMe(include),
    staleTime: 1000 * 60 * 2, // 2 минуты
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook для обновления профиля пользователя
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileDto) => updateProfile(payload),
    onSuccess: (data: UserWithProfileResponseDto) => {
      // Инвалидируем кеш пользователя
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user() });
      // Обновляем кеш оптимистично
      queryClient.setQueryData(QUERY_KEYS.user(), data);
    },
  });
};

