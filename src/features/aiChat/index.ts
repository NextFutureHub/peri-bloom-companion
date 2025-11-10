export { useSendAiMessage, useAiChatHistory } from "./model/useAiChat";
export { aiChatService, sendAiMessage } from "./api/ai-chat.client";
export type {
  SendAiMessageDto,
  AiChatResponseDto,
  AiChatHistoryResponseDto,
  ChatMessage,
} from "@/shared/types/api/ai-chat.dto";

