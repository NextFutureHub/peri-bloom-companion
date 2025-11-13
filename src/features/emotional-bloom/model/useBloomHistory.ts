import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchBloomHistory } from "@/shared/api/bloom.client";
import { QUERY_KEYS } from "@/shared/api/queryKeys";
import type { BloomHistoryPageDto } from "@/shared/types/api/bloom.dto";
import { useUserQuery } from "@/entities/user";

interface UseBloomHistoryOptions
  extends Omit<UseQueryOptions<BloomHistoryPageDto>, "queryKey" | "queryFn"> {}

export const useBloomHistory = (
  page = 1,
  pageSize = 3,
  options?: UseBloomHistoryOptions,
) => {
  const { data: userData } = useUserQuery("profile");
  const userId = userData?.id;

  return useQuery({
    queryKey: QUERY_KEYS.bloom.history(userId, page, pageSize),
    queryFn: () => fetchBloomHistory(page, pageSize),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

