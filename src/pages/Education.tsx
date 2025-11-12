import { useMemo } from "react";
import { useEducationModules } from "@/entities/education";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { BookOpen, Lock, Clock, Layers } from "lucide-react";
import { Progress } from "@/shared/ui/atoms/progress";
import { Badge } from "@/shared/ui/atoms/badge";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/atoms/alert";
import { Skeleton } from "@/shared/ui/atoms/skeleton";
import { Link } from "react-router-dom";

const formatDuration = (minutes?: number | null) => {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours} ч${rest ? ` ${rest} мин` : ""}`;
};

const Education = () => {
  const { data, isLoading, isError, refetch, isRefetching } = useEducationModules();
  const modules = useMemo(() => data ?? [], [data]);

  return (
    <div className="min-h-[calc(100dvh-5rem)] p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <CardTitle>Образовательные модули</CardTitle>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-sm text-primary hover:underline disabled:opacity-60"
              disabled={isRefetching}
            >
              Обновить
            </button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="shadow-soft">
                    <CardContent className="space-y-3 p-4">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : isError ? (
              <Alert variant="destructive">
                <AlertTitle>Не удалось загрузить модули</AlertTitle>
                <AlertDescription>Попробуйте обновить страницу позднее.</AlertDescription>
              </Alert>
            ) : modules.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                Нет доступных модулей. Проверьте настройки профиля или попробуйте позже.
              </div>
            ) : (
              <div className="grid gap-4">
                {modules.map((module) => {
                  const progressValue = Math.round(module.userProgress ?? 0);
                  const locked = !module.isPublished;
                  const duration = formatDuration(module.durationMin);

                  const card = (
                    <Card className={`shadow-soft transition ${locked ? "opacity-60" : "hover:shadow-lg"}`}>
                      <CardContent className="space-y-4 p-5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{module.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{module.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="capitalize">
                              {module.stage === "all" ? "Для всех этапов" : module.stage}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {module.difficulty}
                            </Badge>
                            {locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                            <span>Прогресс</span>
                            <span>{progressValue}%</span>
                          </div>
                          <Progress value={progressValue} className="h-2" />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {module.lessonsCount !== undefined && (
                            <span className="flex items-center gap-1">
                              <Layers className="h-4 w-4" />
                              {module.lessonsCount} уроков
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
                      <div key={module.id} className="cursor-not-allowed">
                        {card}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={module.id}
                      to={`/education/${module.id}`}
                      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {card}
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Education;
