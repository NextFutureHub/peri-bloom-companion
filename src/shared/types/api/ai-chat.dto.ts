/**
 * DTO для отправки сообщения в AI чат
 */
export interface SendAiMessageDto {
  message: string;
}

/**
 * DTO для ответа AI чата
 */
export interface AiChatResponseDto {
  sessionId: string;
  aiMessage: string;
  timestamp: string;
}

/**
 * История чата и текущая сессия
 */
export interface AiChatHistoryResponseDto {
  sessionId: string;
  lifeStage: "pregnancy" | "postpartum" | "childcare";
  messages: ChatMessage[];
}

/**
 * Сообщение в чате
 */
export interface ChatMessage {
  id?: string;
  sender: "user" | "ai";
  message: string;
  timestamp: string;
}

