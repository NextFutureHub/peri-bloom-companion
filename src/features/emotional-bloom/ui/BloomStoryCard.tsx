import { memo, useState } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Card, CardContent } from "@/shared/ui/atoms/card";
import { Button } from "@/shared/ui/atoms/button";
import { cn } from "@/shared/lib/utils";
import { Sparkles, MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BloomStoryCue } from "@/shared/types/api/bloom.dto";

interface BloomStoryCardProps {
  storyCue: BloomStoryCue;
  aiNote?: string | null;
  className?: string;
  onDismiss?: () => void;
}

const storyIcons: Record<BloomStoryCue, React.ComponentType<{ className?: string }>> = {
  glow: Sparkles,
  rise: Sparkles,
  restore: MessageCircle,
};

export const BloomStoryCard = memo(({ storyCue, aiNote, className, onDismiss }: BloomStoryCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  const Icon = storyIcons[storyCue];
  const storyText = t(`bloom.story.${storyCue}`);
  const displayText = aiNote || storyText;

  const handleStartChat = () => {
    navigate("/ai-chat", { state: { initialMessage: `Расскажи мне о моём эмоциональном цветке. ${displayText}` } });
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <Card className={cn("shadow-soft border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-sm leading-relaxed text-foreground">{displayText}</p>
            <div className="flex gap-2">
              <Button onClick={handleStartChat} size="sm" className="flex-1 gradient-primary text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                {t("bloom.story.startChat")}
              </Button>
              {onDismiss && (
                <Button onClick={handleDismiss} size="sm" variant="ghost" className="px-3">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

BloomStoryCard.displayName = "BloomStoryCard";

