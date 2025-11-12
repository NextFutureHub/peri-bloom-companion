import { useApp } from "@/contexts/AppContext";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Label } from "@/shared/ui/atoms/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/select";
import { SoftButton, GradientButton } from "@/shared/ui/atoms/button-variants";
import { Settings as SettingsIcon, Globe, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/features/auth";

const Settings = () => {
  const { profile, language, setLanguage, resetProfile } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleReset = () => {
    if (confirm("Вы уверены, что хотите сбросить все данные?")) {
      resetProfile();
      toast.success("Данные сброшены");
      navigate("/");
    }
  };

  const handleLogout = () => {
    if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          toast.success("Вы успешно вышли из аккаунта");
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : "Ошибка при выходе";
          toast.error(message);
        },
      });
    }
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-primary" />
              {t("settings.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t("settings.language")}
              </Label>
              <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="kk">Қазақша</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6 border-t space-y-3">
              <h3 className="font-semibold">{t("settings.profile")}</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Имя:</span> {profile.name}</p>
                <p><span className="text-muted-foreground">Этап:</span> {profile.lifeStage}</p>
              </div>
            </div>

            <div className="pt-6 border-t space-y-3">
              <GradientButton
                onClick={handleLogout}
                className="w-full"
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {logoutMutation.isPending ? "Выход..." : "Выйти из аккаунта"}
              </GradientButton>
              
              <SoftButton
                onClick={handleReset}
                className="w-full text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("settings.resetData")}
              </SoftButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
