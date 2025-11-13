import { memo } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Badge } from "@/shared/ui/atoms/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchBloomAchievements } from "@/shared/api/bloom.client";
import { QUERY_KEYS } from "@/shared/api/queryKeys";
import { useUserQuery } from "@/entities/user";
import { cn } from "@/shared/lib/utils";
import { Sparkles, Heart, MessageCircle, Award, Flower } from "lucide-react";
import type { BloomAchievementDto } from "@/shared/types/api/bloom.dto";

interface BloomAchievementsProps {
  className?: string;
}

const badgeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  care_streak: Heart,
  harmony_days: Sparkles,
  ai_interaction: MessageCircle,
  stage_milestone: Award,
  companion_unlocked: Flower,
};

export const BloomAchievements = memo(({ className }: BloomAchievementsProps) => {
  const { t } = useTranslation();
  const { data: userData } = useUserQuery("profile");

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.bloom.achievements(userData?.id),
    queryFn: fetchBloomAchievements,
    enabled: !!userData?.id,
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  if (isLoading) {
    return (
      <Card className={cn("shadow-soft", className)}>
        <CardHeader>
          <CardTitle className="text-lg">{t("bloom.achievements.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        </CardContent>
      </Card>
    );
  }

  const completed = achievements.filter((a) => a.isCompleted);
  const inProgress = achievements.filter((a) => !a.isCompleted && a.progress > 0);

  return (
    <Card className={cn("shadow-soft", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Flower className="w-5 h-5 text-primary" />
          {t("bloom.achievements.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {completed.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{t("bloom.achievements.completed")}</p>
            {completed.map((achievement) => {
              const Icon = badgeIcons[achievement.badgeType] || Award;
              return (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{achievement.badgeName}</p>
                    {achievement.description && (
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    )}
                  </div>
                  <Badge variant="default" className="bg-primary">
                    {t("bloom.achievements.completedBadge")}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        {inProgress.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{t("bloom.achievements.inProgress")}</p>
            {inProgress.map((achievement) => {
              const Icon = badgeIcons[achievement.badgeType] || Award;
              const progressPercent = Math.round((achievement.progress / achievement.target) * 100);
              return (
                <div key={achievement.id} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.badgeName}</p>
                      {achievement.description && (
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      )}
                    </div>
                    <Badge variant="secondary">
                      {achievement.progress} / {achievement.target}
                    </Badge>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {achievements.length === 0 && (
          <p className="text-sm text-center text-muted-foreground py-4">
            {t("bloom.achievements.empty")}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

BloomAchievements.displayName = "BloomAchievements";

