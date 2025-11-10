import { useMutation } from "@tanstack/react-query";
import { sendAiMessage } from "../api/ai-chat.client";
import type { SendAiMessageDto, AiChatResponseDto } from "@/shared/types/api/ai-chat.dto";
import { QUERY_KEYS } from "@/shared/api/queryKeys";

/**
 * Хук для отправки сообщения в AI чат
 */
export const useSendAiMessage = () => {
  return useMutation<AiChatResponseDto, Error, SendAiMessageDto>({
    mutationFn: sendAiMessage,
    // Можно добавить onSuccess для обновления кеша сообщений, если будет эндпоинт для получения истории
  });
};

