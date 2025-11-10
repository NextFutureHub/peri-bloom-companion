import { BaseService } from "@/shared/api/baseService";
import type {
  SendAiMessageDto,
  AiChatResponseDto,
  AiChatHistoryResponseDto,
} from "@/shared/types/api/ai-chat.dto";

/**
 * AI Chat Service - работа с AI чатом
 */
class AiChatService extends BaseService {
  /**
   * Отправить сообщение в AI чат и получить ответ
   */
  sendMessage(payload: SendAiMessageDto): Promise<AiChatResponseDto> {
    return this.post<AiChatResponseDto>("/ai-chat/message", payload);
  }

  /**
   * Получить историю текущей сессии чата
   */
  fetchHistory(): Promise<AiChatHistoryResponseDto> {
    return this.get<AiChatHistoryResponseDto>("/ai-chat/session");
  }
}

export const aiChatService = new AiChatService();

// Экспортируем методы для удобства
export const sendAiMessage = (payload: SendAiMessageDto) =>
  aiChatService.sendMessage(payload);
export const fetchAiChatHistory = () => aiChatService.fetchHistory();

// Re-export типы
export type {
  SendAiMessageDto,
  AiChatResponseDto,
  AiChatHistoryResponseDto,
} from "@/shared/types/api/ai-chat.dto";

