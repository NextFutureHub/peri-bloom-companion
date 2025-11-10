import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Input } from "@/shared/ui/atoms/input";
import { GradientButton } from "@/shared/ui/atoms/button-variants";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { ScrollArea } from "@/shared/ui/atoms/scroll-area";
import { useAiChatHistory, useSendAiMessage } from "@/features/aiChat/model/useAiChat";
import type { ChatMessage } from "@/shared/types/api/ai-chat.dto";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/api/queryKeys";

const AIChat = () => {
  const { t } = useTranslation();
  const defaultGreeting = useMemo<ChatMessage>(
    () => ({
      sender: "ai",
      message: t("aiChat.greeting") || "Привет! Я PeriBloom AI ассистент. Чем могу помочь?",
      timestamp: new Date().toISOString(),
    }),
    [t],
  );
  const [messages, setMessages] = useState<ChatMessage[]>([defaultGreeting]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sendMessageMutation = useSendAiMessage();
  const queryClient = useQueryClient();
  const {
    data: history,
    isLoading: isHistoryLoading,
    isRefetching: isHistoryRefetching,
  } = useAiChatHistory();

  // Автопрокрутка к последнему сообщению
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (history) {
      if (history.messages.length > 0) {
        setMessages(history.messages);
      } else {
        setMessages([defaultGreeting]);
      }
    }
  }, [history, defaultGreeting]);

  const handleSend = async () => {
    const messageText = input.trim();
    if (!messageText || sendMessageMutation.isPending) return;

    // Добавляем сообщение пользователя
    const userMessage: ChatMessage = {
      sender: "user",
      message: messageText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Отправляем запрос к API
      const response = await sendMessageMutation.mutateAsync({ message: messageText });

      // Добавляем ответ AI
      const aiMessage: ChatMessage = {
        sender: "ai",
        message: response.aiMessage,
        timestamp: response.timestamp,
      };
      setMessages((prev) => [...prev, aiMessage]);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.aiChatSession() });
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      toast.error("Не удалось отправить сообщение. Попробуйте ещё раз.");
      
      // Удаляем сообщение пользователя при ошибке (опционально)
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] overflow-hidden flex flex-col p-2 sm:p-4 md:p-6">
      <div className="max-w-5xl lg:max-w-6xl w-full mx-auto flex-1 flex flex-col min-h-0">
        <Card className="shadow-soft h-full flex flex-col">
          <CardHeader className="border-b flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              {t("aiChat.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col min-h-0">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 sm:p-6">
              <div className="space-y-4">
                {isHistoryLoading && (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!isHistoryLoading &&
                  messages.map((msg, i) => (
                    <div
                      key={`${msg.timestamp}-${i}`}
                      className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : ""}`}
                    >
                      {msg.sender === "ai" && (
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-soft flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl ${
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
                      </div>
                      {msg.sender === "user" && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-soft flex-shrink-0">
                          <User className="w-5 h-5 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                {sendMessageMutation.isPending && !isHistoryLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-soft flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl bg-muted">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        <p className="text-sm sm:text-base text-muted-foreground">AI печатает...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-3 sm:p-4 border-t flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  placeholder={t("aiChat.placeholder") || "Введите ваше сообщение..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  className="flex-1"
                  disabled={sendMessageMutation.isPending || isHistoryLoading || isHistoryRefetching}
                  maxLength={2000}
                />
                <GradientButton 
                  onClick={handleSend} 
                  size="icon"
                  disabled={
                    sendMessageMutation.isPending ||
                    !input.trim() ||
                    isHistoryLoading ||
                    isHistoryRefetching
                  }
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </GradientButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIChat;
