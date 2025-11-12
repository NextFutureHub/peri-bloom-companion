import { useMemo, useRef, useEffect } from "react";
import { useEducationModules } from "@/entities/education";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { BookOpen, Lock, Clock, Layers } from "lucide-react";
import { Badge } from "@/shared/ui/atoms/badge";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/atoms/alert";
import { Skeleton } from "@/shared/ui/atoms/skeleton";
import { Link } from "react-router-dom";
import type { EducationModuleDto, EducationStage } from "@/shared/types/api/education.dto";

const formatDuration = (minutes?: number | null) => {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours} ч${rest ? ` ${rest} мин` : ""}`;
};

const Education = () => {
  const { data, isLoading, isError, refetch, isRefetching } = useEducationModules();
  const { t } = useTranslation();
  const modules = useMemo(() => data ?? [], [data]);

  // Группируем модули по этапам
  const groupedModules = useMemo(() => {
    const groups: Record<EducationStage | "all", EducationModuleDto[]> = {
      pregnancy: [],
      postpartum: [],
      childcare: [],
      all: [],
    };

    modules.forEach((module) => {
      if (module.stage === "all") {
        groups.all.push(module);
      } else {
        groups[module.stage].push(module);
      }
    });

    return groups;
  }, [modules]);

  const getStageLabel = (stage: EducationStage) => {
    switch (stage) {
      case "pregnancy":
        return t("onboarding.pregnant");
      case "postpartum":
        return t("onboarding.postpartum");
      case "childcare":
        return t("onboarding.childcare");
      case "all":
        return t("education.forAllStages");
      default:
        return stage;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return t("education.difficultyEasy") || "Легко";
      case "medium":
        return t("education.difficultyMedium") || "Средне";
      case "hard":
        return t("education.difficultyHard") || "Сложно";
      default:
        return difficulty;
    }
  };

  const stageOrder: EducationStage[] = ["pregnancy", "postpartum", "childcare", "all"];

  // Refs для горизонтальных контейнеров скролла и карточек модулей
  const scrollContainerRefs = useRef<Record<EducationStage, HTMLDivElement | null>>({
    pregnancy: null,
    postpartum: null,
    childcare: null,
    all: null,
  });

  const moduleCardRefs = useRef<Record<string, HTMLAnchorElement | HTMLDivElement | null>>({});

  // Refs для блоков этапов для вертикального скролла
  const stageBlockRefs = useRef<Record<EducationStage, HTMLDivElement | null>>({
    pregnancy: null,
    postpartum: null,
    childcare: null,
    all: null,
  });

  // Автоматический скролл к нужному модулю при возврате со страницы модуля
  useEffect(() => {
    if (!isLoading && modules.length > 0) {
      const lastModuleId = sessionStorage.getItem("education_last_module_id");
      const lastStage = sessionStorage.getItem("education_last_stage") as EducationStage | null;
      
      if (lastModuleId && lastStage) {
        // Небольшая задержка для корректного рендеринга
        setTimeout(() => {
          const cardElement = moduleCardRefs.current[lastModuleId];
          const scrollContainer = scrollContainerRefs.current[lastStage];
          const stageBlock = stageBlockRefs.current[lastStage];
          
          if (!cardElement || !scrollContainer || !stageBlock) {
            sessionStorage.removeItem("education_last_stage");
            sessionStorage.removeItem("education_last_module_id");
            return;
          }

          // Проверяем, виден ли блок на экране
          const blockRect = stageBlock.getBoundingClientRect();
          const isBlockVisible = blockRect.top >= 0 && blockRect.top < window.innerHeight;
          
          // Если блок не виден, сначала скроллим страницу к блоку (вертикально)
          if (!isBlockVisible) {
            stageBlock.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
          
          // Скроллим горизонтальный контейнер к нужной карточке
          // Используем задержку только если был вертикальный скролл
          const scrollDelay = isBlockVisible ? 100 : 400;
          
          setTimeout(() => {
            const containerRect = scrollContainer.getBoundingClientRect();
            const cardRect = cardElement.getBoundingClientRect();
            
            // Вычисляем позицию для горизонтального скролла (центрируем карточку)
            const cardLeft = cardRect.left - containerRect.left;
            const containerCenter = containerRect.width / 2;
            const cardCenter = cardRect.width / 2;
            const scrollLeft = scrollContainer.scrollLeft + cardLeft - containerCenter + cardCenter;
            
            scrollContainer.scrollTo({
              left: Math.max(0, scrollLeft),
              behavior: "smooth",
            });
            
            // Очищаем сохранённые данные после скролла
            sessionStorage.removeItem("education_last_stage");
            sessionStorage.removeItem("education_last_module_id");
          }, scrollDelay);
        }, 100);
      }
    }
  }, [isLoading, modules.length]);

  return (
    <div className="min-h-[calc(100dvh-5rem)] p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <CardTitle>{t("education.title")}</CardTitle>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-sm text-primary hover:underline disabled:opacity-60"
              disabled={isRefetching}
            >
              {t("education.refresh")}
            </button>
          </CardHeader>
        </Card>

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-4 overflow-hidden">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="min-w-[280px] shadow-soft">
                      <CardContent className="p-0">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertTitle>{t("education.error")}</AlertTitle>
            <AlertDescription>{t("education.errorDescription")}</AlertDescription>
          </Alert>
        ) : modules.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            {t("education.noModules")}
          </div>
        ) : (
          <div className="space-y-8">
            {stageOrder.map((stage) => {
              const stageModules = groupedModules[stage];
              if (stageModules.length === 0) return null;

              return (
                <div
                  key={stage}
                  ref={(el) => {
                    stageBlockRefs.current[stage] = el;
                  }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold">{getStageLabel(stage)}</h2>
                  <div
                    ref={(el) => {
                      scrollContainerRefs.current[stage] = el;
                    }}
                    className="overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth"
                  >
                    <div className="flex gap-4 min-w-max">
                      {stageModules.map((module) => {
                        const locked = !module.isPublished;
                        const duration = formatDuration(module.durationMin);
                        const thumbnailUrl = module.thumbnailUrl || "/placeholder.svg";

                        const card = (
                          <Card
                            className={`min-w-[280px] max-w-[280px] shadow-soft transition ${
                              locked ? "opacity-60" : "hover:shadow-lg cursor-pointer"
                            }`}
                          >
                            <div className="relative">
                              <img
                                src={thumbnailUrl}
                                alt={module.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                              />
                              {locked && (
                                <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-t-lg">
                                  <Lock className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-lg font-semibold line-clamp-2 flex-1">
                                  {module.title}
                                </h3>
                                <Badge variant="secondary" className="shrink-0">
                                  {getDifficultyLabel(module.difficulty)}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {module.lessonsCount !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <Layers className="h-4 w-4" />
                                    {module.lessonsCount} {t("education.lessons")}
                                  </span>
                                )}
                                {duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {duration}
                                  </span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );

                        if (locked) {
                          return (
                            <div
                              key={module.id}
                              ref={(el) => {
                                moduleCardRefs.current[module.id] = el;
                              }}
                              className="cursor-not-allowed"
                            >
                              {card}
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={module.id}
                            ref={(el) => {
                              moduleCardRefs.current[module.id] = el;
                            }}
                            to={`/education/${module.id}`}
                            onClick={() => {
                              // Сохраняем stage и ID модуля перед переходом для автоматического скролла при возврате
                              sessionStorage.setItem("education_last_stage", module.stage);
                              sessionStorage.setItem("education_last_module_id", module.id);
                            }}
                            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                          >
                            {card}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Education;
