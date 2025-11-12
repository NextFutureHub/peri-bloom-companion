import { useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEducationModule,
  useEducationModuleLessons,
  useEducationModuleProgress,
} from "@/entities/education";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/atoms/alert";
import { Badge } from "@/shared/ui/atoms/badge";
import { Button } from "@/shared/ui/atoms/button";
import { Progress } from "@/shared/ui/atoms/progress";
import { Skeleton } from "@/shared/ui/atoms/skeleton";
import { ArrowLeft, Clock, Layers } from "lucide-react";

const formatDuration = (minutes?: number | null) => {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours} ч${rest ? ` ${rest} мин` : ""}`;
};

const EducationModule = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const {
    data: module,
    isLoading: moduleLoading,
    isError: moduleError,
    refetch: refetchModule,
    isRefetching: moduleRefetching,
  } = useEducationModule(moduleId ?? "");

  const {
    data: lessons,
    isLoading: lessonsLoading,
    isError: lessonsError,
    refetch: refetchLessons,
  } = useEducationModuleLessons(moduleId ?? "", {
    enabled: Boolean(moduleId),
  });

  const {
    data: progress,
    isLoading: progressLoading,
    refetch: refetchProgress,
  } = useEducationModuleProgress(moduleId ?? "", {
    enabled: Boolean(moduleId),
  });

  const duration = useMemo(() => formatDuration(module?.durationMin), [module?.durationMin]);
  const progressValue = useMemo(
    () => Math.round(progress?.progressPercent ?? module?.userProgress ?? 0),
    [module?.userProgress, progress?.progressPercent],
  );

  const isLoading = moduleLoading || progressLoading;
  const hasError = moduleError || lessonsError;

  // Сохраняем stage и ID модуля в sessionStorage для автоматического скролла при возврате
  useEffect(() => {
    if (module?.stage && moduleId) {
      sessionStorage.setItem("education_last_stage", module.stage);
      sessionStorage.setItem("education_last_module_id", moduleId);
    }
  }, [module?.stage, moduleId]);

  const handleRefetch = () => {
    refetchModule();
    refetchLessons();
    refetchProgress();
  };

  const handleBack = () => {
    // Сохраняем stage и ID модуля перед возвратом для автоматического скролла
    if (module?.stage && moduleId) {
      sessionStorage.setItem("education_last_stage", module.stage);
      sessionStorage.setItem("education_last_module_id", moduleId);
    }
    navigate("/education");
  };

  // Если нет moduleId, редиректим на страницу списка
  if (!moduleId) {
    navigate("/education", { replace: true });
    return null;
  }

  // Если ошибка загрузки модуля (404 или другая ошибка) и не идет загрузка
  if (hasError && !isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <Button variant="ghost" className="w-fit gap-2" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
          Назад к модулям
        </Button>
          <Alert variant="destructive">
            <AlertTitle>Не удалось загрузить модуль</AlertTitle>
            <AlertDescription>
              {moduleError
                ? "Модуль не найден или произошла ошибка при загрузке. Проверьте корректность ссылки."
                : "Произошла ошибка при загрузке данных модуля."}
            </AlertDescription>
          </Alert>
          <Button onClick={handleRefetch}>Попробовать снова</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <Button variant="ghost" className="w-fit gap-2" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            {isLoading ? (
              <div className="flex w-full flex-col gap-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {module?.stage === "all" ? "Для всех этапов" : module?.stage}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {module?.difficulty}
                    </Badge>
                    {module?.isFeatured && <Badge variant="default">Рекомендуем</Badge>}
                  </div>
                  <CardTitle className="text-3xl font-semibold">{module?.title}</CardTitle>
                  <p className="text-muted-foreground">{module?.description}</p>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  {duration && (
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {duration}
                    </span>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRefetch}
                    disabled={moduleRefetching}
                  >
                    Обновить
                  </Button>
                </div>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                <span>Прогресс</span>
                <span>{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>

            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Layers className="h-5 w-5 text-primary" />
                Уроки
              </h2>

              {lessonsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="shadow-soft">
                      <CardContent className="space-y-2 p-4">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : !lessons || lessons.length === 0 ? (
                <div className="rounded-lg border border-dashed border-muted p-6 text-center text-sm text-muted-foreground">
                  Нет опубликованных уроков. Зайдите позже.
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <Card key={lesson.id} className="shadow-sm">
                      <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                            Урок {index + 1}
                          </div>
                          <h3 className="text-base font-medium">{lesson.title}</h3>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-start gap-3 sm:items-end">
                          {lesson.durationMin && (
                            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {formatDuration(lesson.durationMin)}
                            </span>
                          )}
                          <Badge variant="outline" className="capitalize">
                            {lesson.contentType}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EducationModule;

