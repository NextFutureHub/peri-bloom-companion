import { Card, CardContent } from "@/shared/ui/atoms/card";
import { Button } from "@/shared/ui/atoms/button";
import { Badge } from "@/shared/ui/atoms/badge";
import { Edit, Trash2, Plus, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useAdminModuleLessons } from "@/features/admin";
import { Skeleton } from "@/shared/ui/atoms/skeleton";
import type { EducationModuleListItemDto } from "@/shared/types/api/admin.dto";

interface ModuleCardWithLessonsProps {
  module: EducationModuleListItemDto;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreateLesson: () => void;
  onDeleteLesson: (lessonId: string) => void;
  deleteMutationPending: boolean;
}

const ModuleCardWithLessons = ({
  module,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onCreateLesson,
  onDeleteLesson,
  deleteMutationPending,
}: ModuleCardWithLessonsProps) => {
  const { data: lessons, isLoading: lessonsLoading } = useAdminModuleLessons(module.id, true);

  return (
    <Card className="shadow-soft">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold">{module.title}</h3>
              <Badge variant={module.isPublished ? "default" : "secondary"}>
                {module.isPublished ? "Опубликован" : "Черновик"}
              </Badge>
              {module.isFeatured && <Badge variant="outline">Рекомендуемый</Badge>}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {module.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Категория: {module.category}</span>
              <span>Сложность: {module.difficulty}</span>
              <span>Уроков: {module.lessonsCount}</span>
              <span>Прогресс: {module.progressCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onToggleExpand}>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 mr-2" />
              ) : (
                <ChevronDown className="w-4 h-4 mr-2" />
              )}
              Уроки
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Редактировать
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={deleteMutationPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить
            </Button>
          </div>
        </div>

        {isExpanded && (
            <div className="p-4 bg-muted/30 border-t">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Уроки модуля ({lessons?.length ?? 0})
                </h4>
                <Button size="sm" onClick={onCreateLesson}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить урок
                </Button>
              </div>

              {lessonsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : !lessons || lessons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Уроки не найдены</p>
                  <p className="text-sm mt-2">Создайте первый урок для этого модуля</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">#{lesson.order}</span>
                          <h5 className="font-medium">{lesson.title}</h5>
                          <Badge variant={lesson.isPublished ? "default" : "secondary"} className="text-xs">
                            {lesson.isPublished ? "Опубликован" : "Черновик"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {lesson.contentType}
                          </Badge>
                        </div>
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {lesson.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          {lesson.durationMin && <span>Длительность: {lesson.durationMin} мин</span>}
                          {lesson.estimatedReadTime && (
                            <span>Время чтения: {lesson.estimatedReadTime} мин</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeleteLesson(lesson.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModuleCardWithLessons;

