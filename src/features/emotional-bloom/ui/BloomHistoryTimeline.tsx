import { Fragment, memo, useMemo, useState } from "react";
import { useBloomHistory } from "../model/useBloomHistory";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Badge } from "@/shared/ui/atoms/badge";
import { Button } from "@/shared/ui/atoms/button";
import { cn } from "@/shared/lib/utils";

interface BloomHistoryTimelineProps {
  className?: string;
  pageSize?: number;
}

const formatDate = (dateIso: string, locale: string) => {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const moodAccentMap: Record<string, string> = {
  radiant: "text-amber-600",
  balanced: "text-emerald-600",
  resting: "text-sky-600",
};

export const BloomHistoryTimeline = memo(({ className, pageSize = 3 }: BloomHistoryTimelineProps) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useBloomHistory(page, pageSize);
  const { t, language } = useTranslation();

  const entries = useMemo(() => data?.items ?? [], [data?.items]);
  const meta = data?.meta;

  const handlePrev = () => {
    if (meta?.hasPrev) {
      setPage((prev) => Math.max(1, prev - 1));
    }
  };

  const handleNext = () => {
    if (meta?.hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Card className={cn("shadow-soft", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          {t("bloom.history.title")}
          {meta ? (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {meta.page}/{Math.max(1, Math.ceil(meta.total / meta.pageSize))}
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : isError ? (
          <p className="text-sm text-muted-foreground">{t("common.error")}</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("bloom.history.empty")}</p>
        ) : (
          <div className="space-y-4">
            {entries.map((snapshot, index) => {
              const dateLabel = formatDate(snapshot.createdAt, language);
              const stageLabel = t(`bloom.stages.${snapshot.stage}.label`);
              const moodLabel = t(`bloom.moods.${snapshot.mood}.label`);
              const accent = moodAccentMap[snapshot.mood] ?? "text-primary";

              return (
                <Fragment key={snapshot.id}>
                  <div className="flex items-start gap-3">
                    <div className="relative mt-1 flex flex-col items-center">
                      <span className={cn("flex h-2 w-2 rounded-full bg-primary", snapshot.companionVisible && "bg-emerald-500")}></span>
                      {index < entries.length - 1 ? <span className="mt-1 h-10 w-px bg-muted" /> : null}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{dateLabel}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{stageLabel}</span>
                        <Badge variant="secondary" className="text-xs">
                          {snapshot.petals} {t("bloom.history.petals")}
                        </Badge>
                        {snapshot.companionVisible ? (
                          <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">
                            {t("bloom.history.companion")}
                          </Badge>
                        ) : null}
                      </div>
                      <p className={cn("text-sm font-medium", accent)}>{moodLabel}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("bloom.history.harmony", {
                          harmony: Math.round(snapshot.harmonyScore * 100),
                          care: Math.round(snapshot.careScore * 100),
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">{t(`bloom.story.${snapshot.storyCue}`)}</p>
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handlePrev} disabled={isLoading || !meta?.hasPrev}>
          {t("common.previous")}
        </Button>
        <span className="text-xs text-muted-foreground">
          {meta ? `${(meta.page - 1) * meta.pageSize + 1}-${(meta.page - 1) * meta.pageSize + entries.length} / ${meta.total}` : ""}
        </span>
        <Button variant="outline" size="sm" onClick={handleNext} disabled={isLoading || !meta?.hasNext}>
          {t("common.next")}
        </Button>
      </CardFooter>
    </Card>
  );
});

BloomHistoryTimeline.displayName = "BloomHistoryTimeline";
