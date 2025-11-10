import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Input } from "@/shared/ui/atoms/input";
import { GradientButton } from "@/shared/ui/atoms/button-variants";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { ScrollArea } from "@/shared/ui/atoms/scroll-area";
import { useSendAiMessage } from "@/features/aiChat/model/useAiChat";
import type { ChatMessage } from "@/shared/types/api/ai-chat.dto";
import { toast } from "sonner";

const AIChat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      message: t("aiChat.greeting") || "Привет! Я PeriBloom AI ассистент. Чем могу помочь?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sendMessageMutation = useSendAiMessage();

  // Автопрокрутка к последнему сообщению
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

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
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      toast.error("Не удалось отправить сообщение. Попробуйте ещё раз.");
      
      // Удаляем сообщение пользователя при ошибке (опционально)
      // setMessages((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-soft h-[calc(100vh-8rem)]">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              {t("aiChat.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-5rem)] flex flex-col">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : ""}`}
                  >
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-soft flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    {msg.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-soft flex-shrink-0">
                        <User className="w-5 h-5 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {sendMessageMutation.isPending && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-soft flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="max-w-[80%] p-4 rounded-2xl bg-muted">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">AI печатает...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder={t("aiChat.placeholder") || "Введите ваше сообщение..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  className="flex-1"
                  disabled={sendMessageMutation.isPending}
                  maxLength={2000}
                />
                <GradientButton 
                  onClick={handleSend} 
                  size="icon"
                  disabled={sendMessageMutation.isPending || !input.trim()}
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
