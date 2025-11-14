import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNavigationConfig, updateNavigationConfig, fetchNavigationRecommendations } from "@/shared/api/navigation.client";
import { QUERY_KEYS } from "@/shared/api/queryKeys";
import type { NavigationConfig, UpdateNavigationConfigDto, NavigationItem } from "@/shared/types/api/navigation.dto";
import { useUserQuery } from "@/entities/user";

export const useNavigationConfig = () => {
  const { data: userData } = useUserQuery("profile");
  const userId = userData?.id;

  return useQuery({
    queryKey: QUERY_KEYS.navigation.config(userId),
    queryFn: fetchNavigationConfig,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 минут
  });
};

export const useUpdateNavigationConfig = () => {
  const queryClient = useQueryClient();
  const { data: userData } = useUserQuery("profile");
  const userId = userData?.id;

  return useMutation({
    mutationFn: (dto: UpdateNavigationConfigDto) => updateNavigationConfig(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.navigation.config(userId),
      });
    },
  });
};

export const useNavigationRecommendations = () => {
  const { data: userData } = useUserQuery("profile");
  const userId = userData?.id;

  return useQuery({
    queryKey: QUERY_KEYS.navigation.recommendations(userId),
    queryFn: fetchNavigationRecommendations,
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 минут
  });
};

