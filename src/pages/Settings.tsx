import { useApp } from "@/contexts/AppContext";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SoftButton } from "@/components/ui/button-variants";
import { Settings as SettingsIcon, Globe, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { profile, language, setLanguage, resetProfile } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleReset = () => {
    if (confirm("Вы уверены, что хотите сбросить все данные?")) {
      resetProfile();
      toast.success("Данные сброшены");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen p-6">
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

            <div className="pt-6 border-t">
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
