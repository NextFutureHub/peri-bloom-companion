import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAiChatHistory, sendAiMessage } from "../api/ai-chat.client";
import type {
  SendAiMessageDto,
  AiChatResponseDto,
  AiChatHistoryResponseDto,
} from "@/shared/types/api/ai-chat.dto";
import { QUERY_KEYS } from "@/shared/api/queryKeys";

/**
 * Хук для получения истории AI чата
 */
export const useAiChatHistory = () => {
  return useQuery<AiChatHistoryResponseDto>({
    queryKey: QUERY_KEYS.aiChatSession(),
    queryFn: fetchAiChatHistory,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Хук для отправки сообщения в AI чат
 */
export const useSendAiMessage = () => {
  return useMutation<AiChatResponseDto, Error, SendAiMessageDto>({
    mutationFn: sendAiMessage,
    // Можно добавить onSuccess для обновления кеша сообщений, если будет эндпоинт для получения истории
  });
};

