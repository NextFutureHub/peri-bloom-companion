import { memo, useState, useEffect } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/atoms/dialog";
import { Button } from "@/shared/ui/atoms/button";
import { Card, CardContent } from "@/shared/ui/atoms/card";
import { Badge } from "@/shared/ui/atoms/badge";
import { Switch } from "@/shared/ui/atoms/switch";
import { Label } from "@/shared/ui/atoms/label";
import { useNavigationConfig, useUpdateNavigationConfig, useNavigationRecommendations } from "../model/useNavigation";
import { getIcon } from "../lib/iconMap";
import { getNavTranslationKey } from "../lib/navTranslation";
import { cn } from "@/shared/lib/utils";
import { Sparkles, X, GripVertical } from "lucide-react";
import { toast } from "@/shared/ui/atoms/sonner";

interface NavigationEditorProps {
  open: boolean;
  onClose: () => void;
}

export const NavigationEditor = memo(({ open, onClose }: NavigationEditorProps) => {
  const { t } = useTranslation();
  const { data: config, isLoading } = useNavigationConfig();
  const { data: recommendations } = useNavigationRecommendations();
  const { mutate: updateConfig, isPending } = useUpdateNavigationConfig();
  const [localItems, setLocalItems] = useState<NavigationItem[]>([]);

  // Инициализируем локальное состояние при открытии и применяем AI рекомендации
  useEffect(() => {
    if (config?.items && open) {
      const items = [...config.items];
      
      // Применяем AI рекомендации: обновляем aiRecommended флаг для элементов
      if (recommendations && recommendations.length > 0) {
        recommendations.forEach((rec) => {
          const existingItem = items.find((item) => item.id === rec.id);
          if (existingItem) {
            existingItem.aiRecommended = true;
          } else {
            // Если элемента нет в конфигурации, добавляем его как скрытый с рекомендацией
            items.push({ ...rec, visible: false });
          }
        });
      }
      
      setLocalItems(items);
    }
  }, [config?.items, recommendations, open]);

  const handleToggleVisibility = (itemId: string) => {
    setLocalItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, visible: !item.visible } : item))
    );
  };

  const handleSave = () => {
    updateConfig(
      { items: localItems },
      {
        onSuccess: () => {
          toast.success(t("navigation.saveSuccess"));
          onClose();
        },
        onError: () => {
          toast.error(t("navigation.saveError"));
        },
      }
    );
  };

  const handleReset = () => {
    if (config?.items) {
      setLocalItems([...config.items]);
    }
  };

  const visibleItems = localItems.filter((item) => item.visible);
  const hiddenItems = localItems.filter((item) => !item.visible);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("navigation.editor.title")}</DialogTitle>
          <DialogDescription>{t("navigation.editor.description")}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : (
          <div className="space-y-6">
            {/* Активные элементы */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">{t("navigation.editor.active")}</Label>
                <Badge variant="secondary">{visibleItems.length}/5</Badge>
              </div>
              <div className="space-y-2">
                {visibleItems.map((item) => {
                  const Icon = getIcon(item.icon);
                  const translatedLabel = t(getNavTranslationKey(item));
                  return (
                    <Card key={item.id} className="p-3">
                      <CardContent className="p-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="font-medium">{translatedLabel}</span>
                          {item.aiRecommended && (
                            <Badge variant="outline" className="text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              {t("navigation.aiRecommended")}
                            </Badge>
                          )}
                        </div>
                        <Switch
                          checked={item.visible}
                          onCheckedChange={() => handleToggleVisibility(item.id)}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Скрытые элементы */}
            {hiddenItems.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-muted-foreground">
                  {t("navigation.editor.hidden")}
                </Label>
                <div className="space-y-2">
                  {hiddenItems.map((item) => {
                    const Icon = getIcon(item.icon);
                    const translatedLabel = t(getNavTranslationKey(item));
                    return (
                      <Card key={item.id} className={cn("p-3", item.aiRecommended ? "border-primary/20 bg-primary/5" : "opacity-60")}>
                        <CardContent className="p-0 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <span className="text-muted-foreground">{translatedLabel}</span>
                            {item.aiRecommended && (
                              <Badge variant="outline" className="text-xs">
                                <Sparkles className="w-3 h-3 mr-1" />
                                {t("navigation.aiRecommended")}
                              </Badge>
                            )}
                          </div>
                          <Switch
                            checked={item.visible}
                            onCheckedChange={() => handleToggleVisibility(item.id)}
                          />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI рекомендации */}
            {localItems.some((item) => item.aiRecommended && !item.visible) && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t("navigation.aiSuggestion")}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("navigation.aiSuggestionDescription")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Кнопки действий */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleReset} disabled={isPending}>
                {t("navigation.editor.reset")}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} disabled={isPending}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleSave} disabled={isPending || visibleItems.length > 5}>
                  {t("common.save")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

NavigationEditor.displayName = "NavigationEditor";

