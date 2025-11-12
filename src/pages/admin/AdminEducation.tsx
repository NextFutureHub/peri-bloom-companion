import { useState, useEffect } from "react";
import { useAdminEducationModules, useDeleteAdminEducationModule, useUpdateAdminEducationModule, useAdminEducationModule } from "@/features/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Button } from "@/shared/ui/atoms/button";
import { Badge } from "@/shared/ui/atoms/badge";
import { BookOpen, Plus, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/shared/ui/atoms/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/atoms/dialog";
import { Input } from "@/shared/ui/atoms/input";
import { Label } from "@/shared/ui/atoms/label";
import { Textarea } from "@/shared/ui/atoms/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/select";
import { useCreateAdminEducationModule } from "@/features/admin";

const AdminEducation = () => {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useAdminEducationModules(page, limit);
  const deleteMutation = useDeleteAdminEducationModule();
  const createMutation = useCreateAdminEducationModule();
  const updateMutation = useUpdateAdminEducationModule();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    category: "",
    difficulty: "",
    type: "",
    stage: "",
    language: "ru",
    durationMin: "",
    isPublished: "false",
    isFeatured: "false",
    order: "0",
  });

  // Загружаем данные модуля для редактирования
  const { data: moduleData } = useAdminEducationModule(editingModuleId || "", {
    enabled: !!editingModuleId && isEditDialogOpen,
  });

  // Заполняем форму данными модуля при открытии диалога редактирования
  useEffect(() => {
    if (moduleData && isEditDialogOpen) {
      setFormData({
        title: moduleData.title || "",
        description: moduleData.description || "",
        goal: moduleData.goal || "",
        category: moduleData.category || "",
        difficulty: moduleData.difficulty || "",
        type: moduleData.type || "",
        stage: moduleData.stage || "",
        language: moduleData.language || "ru",
        durationMin: moduleData.durationMin?.toString() || "",
        isPublished: moduleData.isPublished ? "true" : "false",
        isFeatured: moduleData.isFeatured ? "true" : "false",
        order: moduleData.order?.toString() || "0",
      });
    }
  }, [moduleData, isEditDialogOpen]);

  const handleDelete = async (moduleId: string) => {
    if (confirm("Вы уверены, что хотите удалить этот модуль?")) {
      try {
        await deleteMutation.mutateAsync(moduleId);
        toast.success("Модуль успешно удалён");
      } catch (error) {
        toast.error("Ошибка при удалении модуля");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      goal: "",
      category: "",
      difficulty: "",
      type: "",
      stage: "",
      language: "ru",
      durationMin: "",
      isPublished: "false",
      isFeatured: "false",
      order: "0",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || 
        !formData.difficulty || !formData.type || !formData.stage || !formData.durationMin) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        goal: formData.goal || undefined,
        category: formData.category,
        difficulty: formData.difficulty,
        type: formData.type,
        stage: formData.stage,
        language: formData.language || "ru",
        durationMin: parseInt(formData.durationMin),
        isPublished: formData.isPublished === "true",
        isFeatured: formData.isFeatured === "true",
        order: parseInt(formData.order || "0"),
      });
      toast.success("Модуль успешно создан");
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Ошибка при создании модуля");
    }
  };

  const handleEdit = (moduleId: string) => {
    setEditingModuleId(moduleId);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingModuleId) return;

    if (!formData.title || !formData.description || !formData.category || 
        !formData.difficulty || !formData.type || !formData.stage || !formData.durationMin) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        moduleId: editingModuleId,
        data: {
          title: formData.title,
          description: formData.description,
          goal: formData.goal || undefined,
          category: formData.category,
          difficulty: formData.difficulty,
          type: formData.type,
          stage: formData.stage,
          language: formData.language || "ru",
          durationMin: parseInt(formData.durationMin),
          isPublished: formData.isPublished === "true",
          isFeatured: formData.isFeatured === "true",
          order: parseInt(formData.order || "0"),
        },
      });
      toast.success("Модуль успешно обновлён");
      setIsEditDialogOpen(false);
      setEditingModuleId(null);
      resetForm();
    } catch (error) {
      toast.error("Ошибка при обновлении модуля");
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingModuleId(null);
    resetForm();
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="min-h-[calc(100dvh-5rem)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              Управление образованием
            </h1>
            <p className="text-muted-foreground">Создание и редактирование образовательных модулей</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Создать модуль
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Создание нового модуля</DialogTitle>
                <DialogDescription>
                  Заполните форму для создания образовательного модуля
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Название *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Описание *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label>Цель</Label>
                  <Textarea
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Категория *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pregnancy">Беременность</SelectItem>
                        <SelectItem value="postpartum">Послеродовой период</SelectItem>
                        <SelectItem value="childcare">Уход за ребёнком</SelectItem>
                        <SelectItem value="nutrition">Питание</SelectItem>
                        <SelectItem value="emotional_health">Эмоциональное здоровье</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Сложность *</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите сложность" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Легкая</SelectItem>
                        <SelectItem value="medium">Средняя</SelectItem>
                        <SelectItem value="hard">Сложная</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Тип *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Видео</SelectItem>
                        <SelectItem value="text">Текст</SelectItem>
                        <SelectItem value="mixed">Смешанный</SelectItem>
                        <SelectItem value="interactive">Интерактивный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Этап *</Label>
                    <Select
                      value={formData.stage}
                      onValueChange={(value) => setFormData({ ...formData, stage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите этап" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pregnancy">Беременность</SelectItem>
                        <SelectItem value="postpartum">Послеродовой</SelectItem>
                        <SelectItem value="childcare">Уход за ребёнком</SelectItem>
                        <SelectItem value="all">Для всех</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Длительность (минуты) *</Label>
                    <Input
                      type="number"
                      value={formData.durationMin}
                      onChange={(e) => setFormData({ ...formData, durationMin: e.target.value })}
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <Label>Порядок</Label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Опубликован</Label>
                    <Select
                      value={formData.isPublished}
                      onValueChange={(value) => setFormData({ ...formData, isPublished: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Нет</SelectItem>
                        <SelectItem value="true">Да</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Рекомендуемый</Label>
                    <Select
                      value={formData.isFeatured}
                      onValueChange={(value) => setFormData({ ...formData, isFeatured: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Нет</SelectItem>
                        <SelectItem value="true">Да</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Создание..." : "Создать"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Диалог редактирования */}
          <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Редактирование модуля</DialogTitle>
                <DialogDescription>
                  Измените данные образовательного модуля
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <Label>Название *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Описание *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <Label>Цель</Label>
                  <Textarea
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Категория *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pregnancy">Беременность</SelectItem>
                        <SelectItem value="postpartum">Послеродовой период</SelectItem>
                        <SelectItem value="childcare">Уход за ребёнком</SelectItem>
                        <SelectItem value="nutrition">Питание</SelectItem>
                        <SelectItem value="emotional_health">Эмоциональное здоровье</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Сложность *</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите сложность" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Легкая</SelectItem>
                        <SelectItem value="medium">Средняя</SelectItem>
                        <SelectItem value="hard">Сложная</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Тип *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Видео</SelectItem>
                        <SelectItem value="text">Текст</SelectItem>
                        <SelectItem value="mixed">Смешанный</SelectItem>
                        <SelectItem value="interactive">Интерактивный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Этап *</Label>
                    <Select
                      value={formData.stage}
                      onValueChange={(value) => setFormData({ ...formData, stage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите этап" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pregnancy">Беременность</SelectItem>
                        <SelectItem value="postpartum">Послеродовой</SelectItem>
                        <SelectItem value="childcare">Уход за ребёнком</SelectItem>
                        <SelectItem value="all">Для всех</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Длительность (минуты) *</Label>
                    <Input
                      type="number"
                      value={formData.durationMin}
                      onChange={(e) => setFormData({ ...formData, durationMin: e.target.value })}
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <Label>Порядок</Label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Опубликован</Label>
                    <Select
                      value={formData.isPublished}
                      onValueChange={(value) => setFormData({ ...formData, isPublished: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Нет</SelectItem>
                        <SelectItem value="true">Да</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Рекомендуемый</Label>
                    <Select
                      value={formData.isFeatured}
                      onValueChange={(value) => setFormData({ ...formData, isFeatured: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Нет</SelectItem>
                        <SelectItem value="true">Да</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseEditDialog}>
                    Отмена
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Модули ({data?.total ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">
                Ошибка загрузки модулей
              </div>
            ) : !data || data.modules.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Модули не найдены
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {data.modules.map((module) => (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{module.title}</h3>
                          <Badge variant={module.isPublished ? "default" : "secondary"}>
                            {module.isPublished ? "Опубликован" : "Черновик"}
                          </Badge>
                          {module.isFeatured && (
                            <Badge variant="outline">Рекомендуемый</Badge>
                          )}
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(module.id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Редактировать
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(module.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                      Страница {page} из {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Назад
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Вперёд
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminEducation;

