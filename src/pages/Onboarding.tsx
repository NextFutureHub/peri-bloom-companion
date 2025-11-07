import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, LifeStage } from "@/contexts/AppContext";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Input } from "@/shared/ui/atoms/input";
import { Label } from "@/shared/ui/atoms/label";
import { GradientButton, SoftButton } from "@/shared/ui/atoms/button-variants";
import { Heart, Baby, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateProfile } = useApp();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    lifeStage: null as LifeStage,
    dueDate: "",
    childBirthDate: "",
  });

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) {
      toast.error("Пожалуйста, введите ваше имя");
      return;
    }
    if (step === 2 && !formData.lifeStage) {
      toast.error("Пожалуйста, выберите жизненный этап");
      return;
    }
    setStep(step + 1);
  };

  const handleFinish = () => {
    updateProfile({
      name: formData.name,
      lifeStage: formData.lifeStage,
      dueDate: formData.dueDate || undefined,
      childBirthDate: formData.childBirthDate || undefined,
      onboardingComplete: true,
    });
    toast.success(`Добро пожаловать, ${formData.name}! 💗`);
    navigate("/dashboard");
  };

  const stageOptions = [
    { value: "pregnant" as LifeStage, label: t("onboarding.pregnant"), icon: Heart },
    { value: "postpartum" as LifeStage, label: t("onboarding.postpartum"), icon: Sparkles },
    { value: "childcare" as LifeStage, label: t("onboarding.childcare"), icon: Baby },
  ];

  return (
    <div className="h-screen flex items-center justify-center p-4 overflow-hidden">
      <Card className="w-full max-w-lg shadow-soft animate-float">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-glow">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl">{t("onboarding.title")}</CardTitle>
          <CardDescription className="text-base">
            {step === 1 && t("onboarding.nameLabel")}
            {step === 2 && t("onboarding.stageLabel")}
            {step === 3 && "Последний шаг"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-3">
              <Label htmlFor="name">{t("onboarding.nameLabel")}</Label>
              <Input
                id="name"
                placeholder={t("onboarding.namePlaceholder")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="transition-smooth"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label>{t("onboarding.stageLabel")}</Label>
              <div className="grid gap-3">
                {stageOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, lifeStage: option.value })}
                    className={`p-4 rounded-lg border-2 transition-smooth flex items-center gap-3 ${
                      formData.lifeStage === option.value
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <option.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {formData.lifeStage === "pregnant" && (
                <div className="space-y-2">
                  <Label htmlFor="dueDate">{t("onboarding.dueDateLabel")}</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              )}
              {(formData.lifeStage === "postpartum" || formData.lifeStage === "childcare") && (
                <div className="space-y-2">
                  <Label htmlFor="birthDate">{t("onboarding.birthDateLabel")}</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.childBirthDate}
                    onChange={(e) => setFormData({ ...formData, childBirthDate: e.target.value })}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <SoftButton onClick={() => setStep(step - 1)} className="flex-1">
                {t("onboarding.back")}
              </SoftButton>
            )}
            {step < 3 ? (
              <GradientButton onClick={handleNext} className="flex-1">
                {t("onboarding.next")}
              </GradientButton>
            ) : (
              <GradientButton onClick={handleFinish} className="flex-1">
                {t("onboarding.finish")}
              </GradientButton>
            )}
          </div>

          <div className="flex justify-center gap-2 pt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-smooth ${
                  i === step ? "w-8 gradient-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
