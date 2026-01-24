import { useApp } from "@/contexts/AppContext";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Label } from "@/shared/ui/atoms/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/select";
import { SoftButton, GradientButton } from "@/shared/ui/atoms/button-variants";
import { Settings as SettingsIcon, Globe, Trash2, LogOut, Navigation, Moon, Sun, Monitor } from "lucide-react";
import { toast } from "@/shared/ui/atoms/sonner";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/features/auth";
import { useUserQuery } from "@/entities/user";
import { NavigationEditor } from "@/features/navigation";
import { useState } from "react";
import { useThemeManager, type ThemeMode } from "@/shared/hooks/use-theme-manager";

const Settings = () => {
  const { profile, resetProfile } = useApp();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { data: userData, isLoading: isUserLoading } = useUserQuery("profile");
  const [isNavigationEditorOpen, setIsNavigationEditorOpen] = useState(false);
  const { themeMode, updateThemeMode } = useThemeManager();

  const apiProfile = userData?.profile;

  const getStageLabel = (stage?: string | null) => {
    if (!stage) return "—";

    switch (stage) {
      case "pregnancy":
      case "pregnant":
        return t("onboarding.pregnant");
      case "postpartum":
        return t("onboarding.postpartum");
      case "childcare":
        return t("onboarding.childcare");
      default:
        return "—";
    }
  };

  const displayName = apiProfile?.name || profile.name || "—";
  const displayStage = getStageLabel(apiProfile?.lifeStage || profile.lifeStage);

  const handleReset = () => {
    if (confirm(t("settings.resetConfirm"))) {
      resetProfile();
      toast.success(t("settings.resetSuccess"));
      navigate("/");
    }
  };

  const handleDeleteAllData = () => {
    if (confirm(t("settings.deleteAllDataConfirm"))) {
      resetProfile();
      toast.success(t("settings.deleteAllDataSuccess"));
      navigate("/");
    }
  };

  const handleLogout = () => {
    if (confirm(t("settings.logoutConfirm"))) {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          toast.success(t("settings.logoutSuccess"));
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : t("settings.logoutError");
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
                  <SelectItem value="ru">{t("settings.languageRu")}</SelectItem>
                  <SelectItem value="kk">{t("settings.languageKk")}</SelectItem>
                  <SelectItem value="en">{t("settings.languageEn")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-6 border-t space-y-3">
              <Label className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Тема
              </Label>
              <Select
                value={themeMode}
                onValueChange={(value: ThemeMode) => updateThemeMode(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">
                    <span className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Авто (по состоянию и времени)
                    </span>
                  </SelectItem>
                  <SelectItem value="light">
                    <span className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Светлая
                    </span>
                  </SelectItem>
                  <SelectItem value="dark">
                    <span className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Тёмная
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {themeMode === "auto" && (
                <p className="text-xs text-muted-foreground">
                  Автоматически переключается на основе статуса и времени суток
                </p>
              )}
            </div>

            <div className="pt-6 border-t space-y-3">
              <h3 className="font-semibold">{t("settings.profile")}</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">{t("settings.name")}:</span>{" "}
                  {isUserLoading ? t("common.loading") : displayName}
                </p>
                <p>
                  <span className="text-muted-foreground">{t("settings.stage")}:</span>{" "}
                  {isUserLoading ? t("common.loading") : displayStage}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t space-y-3">
              <h3 className="font-semibold">{t("settings.navigation.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings.navigation.description")}</p>
              <GradientButton
                onClick={() => setIsNavigationEditorOpen(true)}
                className="w-full"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {t("settings.navigation.customize")}
              </GradientButton>
            </div>

            <div className="pt-6 border-t space-y-3">
              <GradientButton
                onClick={handleLogout}
                className="w-full"
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {logoutMutation.isPending ? t("settings.loggingOut") : t("settings.logoutButton")}
              </GradientButton>
            </div>

            <div className="pt-6 border-t space-y-3">
              <h3 className="font-semibold text-destructive flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Опасная зона
              </h3>
              <p className="text-sm text-muted-foreground">
                Действия в этой секции необратимы. Будьте осторожны.
              </p>
              <SoftButton
                onClick={handleDeleteAllData}
                className="w-full text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/50 hover:bg-destructive/5"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("settings.deleteAllData")}
              </SoftButton>
            </div>
          </CardContent>
        </Card>
      </div>

      {isNavigationEditorOpen && (
        <NavigationEditor
          open={isNavigationEditorOpen}
          onClose={() => setIsNavigationEditorOpen(false)}
        />
      )}
    </div>
  );
};

export default Settings;
