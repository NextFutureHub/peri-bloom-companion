import { useState } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Input } from "@/shared/ui/atoms/input";
import { Label } from "@/shared/ui/atoms/label";
import { GradientButton, SoftButton } from "@/shared/ui/atoms/button-variants";
import { Heart, Baby, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  useRegister,
  useRegisterProfile,
  useRegisterContext,
  useSkipContext,
} from "@/features/auth";
import { tokenStorage } from "@/shared/api/client";
import type {
  PregnancyContextDto,
  PostpartumContextDto,
  ChildcareContextDto,
} from "@/shared/types/api/auth.dto";

type LifeStage = "pregnancy" | "postpartum" | "childcare";

const Onboarding = () => {
  const { t } = useTranslation();
  
  // Проверяем, есть ли уже registrationToken
  const hasRegistrationToken = !!tokenStorage.getRegistrationToken();
  
  // Если есть registrationToken, начинаем с шага 1 (имя), иначе с шага 0 (регистрация)
  const [step, setStep] = useState(hasRegistrationToken ? 1 : 0);
  
  const [formData, setFormData] = useState({
    // Шаг 0: регистрация
    email: "",
    password: "",
    confirmPassword: "",
    // Шаг 1: имя
    name: "",
    // Шаг 2: lifeStage
    lifeStage: null as LifeStage | null,
    // Pregnancy fields
    pregnancyReference: "LMP" as "LMP" | "EDD" | "IVF" | "unknown",
    lastMenstrualPeriod: "",
    estimatedDueDate: "",
    ivfTransferDate: "",
    medDataConsent: false,
    // Postpartum fields
    deliveryDate: "",
    deliveryMethod: "vaginal" as "vaginal" | "cesarean" | "assisted" | "unknown",
    // Childcare fields
    children: [{ name: "", dateOfBirth: "", sex: "female" as "male" | "female" | "other" }],
  });

  const registerMutation = useRegister();
  const registerProfileMutation = useRegisterProfile();
  const registerContextMutation = useRegisterContext();
  const skipContextMutation = useSkipContext();

  const isLoading =
    registerMutation.isPending ||
    registerProfileMutation.isPending ||
    registerContextMutation.isPending ||
    skipContextMutation.isPending;

  const handleNext = async () => {
    if (step === 0) {
      // Шаг 0: Регистрация (email + password)
      if (!formData.email.trim()) {
        toast.error("Пожалуйста, введите email");
        return;
      }
      if (!formData.password.trim()) {
        toast.error("Пожалуйста, введите пароль");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Пароль должен содержать минимум 6 символов");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Пароли не совпадают");
        return;
      }

      try {
        await registerMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
        });
        toast.success("Регистрация успешна! Продолжаем...");
        setStep(1);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Ошибка при регистрации";
        toast.error(message);
      }
    } else if (step === 1) {
      // Шаг 1: Имя
      if (!formData.name.trim()) {
        toast.error("Пожалуйста, введите ваше имя");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Шаг 2: LifeStage + отправка профиля
      if (!formData.lifeStage) {
        toast.error("Пожалуйста, выберите жизненный этап");
        return;
      }

      // Отправляем шаг 2: профиль
      try {
        await registerProfileMutation.mutateAsync({
          name: formData.name,
          lifeStage: formData.lifeStage,
        });
        setStep(3);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Ошибка при сохранении профиля";
        toast.error(message);
      }
    }
  };

  const handleFinish = async () => {
    if (!formData.lifeStage) {
      toast.error("Пожалуйста, выберите жизненный этап");
      return;
    }

    try {
      let context: PregnancyContextDto | PostpartumContextDto | ChildcareContextDto;

      if (formData.lifeStage === "pregnancy") {
        context = {
          pregnancyReference: formData.pregnancyReference,
          lastMenstrualPeriod:
            formData.pregnancyReference === "LMP" || formData.pregnancyReference === "unknown"
              ? formData.lastMenstrualPeriod || undefined
              : undefined,
          estimatedDueDate:
            formData.pregnancyReference === "EDD" || formData.pregnancyReference === "unknown"
              ? formData.estimatedDueDate || undefined
              : undefined,
          ivfTransferDate:
            formData.pregnancyReference === "IVF"
              ? formData.ivfTransferDate || undefined
              : undefined,
          medDataConsent: formData.medDataConsent,
        };
      } else if (formData.lifeStage === "postpartum") {
        if (!formData.deliveryDate) {
          toast.error("Пожалуйста, укажите дату родов");
          return;
        }
        context = {
          deliveryDate: formData.deliveryDate,
          deliveryMethod: formData.deliveryMethod,
          medDataConsent: formData.medDataConsent,
        };
      } else {
        // childcare
        const validChildren = formData.children.filter(
          (child) => child.dateOfBirth && child.dateOfBirth.trim() !== ""
        );
        if (validChildren.length === 0) {
          toast.error("Пожалуйста, укажите дату рождения хотя бы одного ребёнка");
          return;
        }
        context = {
          children: validChildren.map((child) => ({
            name: child.name || undefined,
            dateOfBirth: child.dateOfBirth,
            sex: child.sex,
          })),
          medDataConsent: formData.medDataConsent,
        };
      }

      await registerContextMutation.mutateAsync(context);
      toast.success(`Добро пожаловать, ${formData.name}! 💗`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ошибка при завершении регистрации";
      toast.error(message);
    }
  };

  const handleSkip = async () => {
    try {
      await skipContextMutation.mutateAsync();
      toast.success(`Добро пожаловать, ${formData.name}! 💗`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ошибка при завершении регистрации";
      toast.error(message);
    }
  };

  const stageOptions = [
    { value: "pregnancy" as LifeStage, label: t("onboarding.pregnant"), icon: Heart },
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
            {step === 0 && "Создайте аккаунт для начала"}
            {step === 1 && t("onboarding.nameLabel")}
            {step === 2 && t("onboarding.stageLabel")}
            {step === 3 && "Последний шаг"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="transition-smooth"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="transition-smooth"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Повторите пароль"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="transition-smooth"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <Label htmlFor="name">{t("onboarding.nameLabel")}</Label>
              <Input
                id="name"
                placeholder={t("onboarding.namePlaceholder")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="transition-smooth"
                disabled={isLoading}
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
                    disabled={isLoading}
                    className={`p-4 rounded-lg border-2 transition-smooth flex items-center gap-3 ${
                      formData.lifeStage === option.value
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border hover:border-primary/50"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
              {formData.lifeStage === "pregnancy" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pregnancyReference">Источник расчёта срока</Label>
                    <select
                      id="pregnancyReference"
                      value={formData.pregnancyReference}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pregnancyReference: e.target.value as typeof formData.pregnancyReference,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      disabled={isLoading}
                    >
                      <option value="LMP">Последняя менструация (LMP)</option>
                      <option value="EDD">Предполагаемая дата родов (EDD)</option>
                      <option value="IVF">ЭКО (IVF)</option>
                      <option value="unknown">Не знаю</option>
                    </select>
                  </div>

                  {(formData.pregnancyReference === "LMP" ||
                    formData.pregnancyReference === "unknown") && (
                    <div className="space-y-2">
                      <Label htmlFor="lastMenstrualPeriod">Дата последней менструации</Label>
                      <Input
                        id="lastMenstrualPeriod"
                        type="date"
                        value={formData.lastMenstrualPeriod}
                        onChange={(e) =>
                          setFormData({ ...formData, lastMenstrualPeriod: e.target.value })
                        }
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  {(formData.pregnancyReference === "EDD" ||
                    formData.pregnancyReference === "unknown") && (
                    <div className="space-y-2">
                      <Label htmlFor="estimatedDueDate">Предполагаемая дата родов</Label>
                      <Input
                        id="estimatedDueDate"
                        type="date"
                        value={formData.estimatedDueDate}
                        onChange={(e) =>
                          setFormData({ ...formData, estimatedDueDate: e.target.value })
                        }
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  {formData.pregnancyReference === "IVF" && (
                    <div className="space-y-2">
                      <Label htmlFor="ivfTransferDate">Дата переноса эмбриона</Label>
                      <Input
                        id="ivfTransferDate"
                        type="date"
                        value={formData.ivfTransferDate}
                        onChange={(e) =>
                          setFormData({ ...formData, ivfTransferDate: e.target.value })
                        }
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="medDataConsent"
                      checked={formData.medDataConsent}
                      onChange={(e) =>
                        setFormData({ ...formData, medDataConsent: e.target.checked })
                      }
                      disabled={isLoading}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="medDataConsent" className="cursor-pointer">
                      Согласен на хранение медицинских данных
                    </Label>
                  </div>
                </div>
              )}

              {formData.lifeStage === "postpartum" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">Дата родов *</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryMethod">Способ родоразрешения</Label>
                    <select
                      id="deliveryMethod"
                      value={formData.deliveryMethod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deliveryMethod: e.target.value as typeof formData.deliveryMethod,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      disabled={isLoading}
                    >
                      <option value="vaginal">Естественные роды</option>
                      <option value="cesarean">Кесарево сечение</option>
                      <option value="assisted">Вспомогательные роды</option>
                      <option value="unknown">Не знаю</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="medDataConsent"
                      checked={formData.medDataConsent}
                      onChange={(e) =>
                        setFormData({ ...formData, medDataConsent: e.target.checked })
                      }
                      disabled={isLoading}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="medDataConsent" className="cursor-pointer">
                      Согласен на хранение медицинских данных
                    </Label>
                  </div>
                </div>
              )}

              {formData.lifeStage === "childcare" && (
                <div className="space-y-4">
                  {formData.children.map((child, index) => (
                    <div key={index} className="space-y-2 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor={`child-name-${index}`}>Имя ребёнка (необязательно)</Label>
                        <Input
                          id={`child-name-${index}`}
                          value={child.name}
                          onChange={(e) => {
                            const newChildren = [...formData.children];
                            newChildren[index] = { ...child, name: e.target.value };
                            setFormData({ ...formData, children: newChildren });
                          }}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`child-date-${index}`}>Дата рождения *</Label>
                        <Input
                          id={`child-date-${index}`}
                          type="date"
                          value={child.dateOfBirth}
                          onChange={(e) => {
                            const newChildren = [...formData.children];
                            newChildren[index] = { ...child, dateOfBirth: e.target.value };
                            setFormData({ ...formData, children: newChildren });
                          }}
                          disabled={isLoading}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`child-sex-${index}`}>Пол</Label>
                        <select
                          id={`child-sex-${index}`}
                          value={child.sex}
                          onChange={(e) => {
                            const newChildren = [...formData.children];
                            newChildren[index] = {
                              ...child,
                              sex: e.target.value as typeof child.sex,
                            };
                            setFormData({ ...formData, children: newChildren });
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                          disabled={isLoading}
                        >
                          <option value="male">Мальчик</option>
                          <option value="female">Девочка</option>
                          <option value="other">Другое</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        children: [
                          ...formData.children,
                          { name: "", dateOfBirth: "", sex: "female" },
                        ],
                      });
                    }}
                    className="text-sm text-primary hover:underline"
                    disabled={isLoading}
                  >
                    + Добавить ещё ребёнка
                  </button>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="medDataConsent"
                      checked={formData.medDataConsent}
                      onChange={(e) =>
                        setFormData({ ...formData, medDataConsent: e.target.checked })
                      }
                      disabled={isLoading}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="medDataConsent" className="cursor-pointer">
                      Согласен на хранение медицинских данных
                    </Label>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 0 && (
              <SoftButton
                onClick={() => setStep(step - 1)}
                className="flex-1"
                disabled={isLoading}
              >
                {t("onboarding.back")}
              </SoftButton>
            )}
            {step < 3 ? (
              <GradientButton onClick={handleNext} className="flex-1" disabled={isLoading}>
                {isLoading ? "Загрузка..." : t("onboarding.next")}
              </GradientButton>
            ) : (
              <>
                <SoftButton onClick={handleSkip} className="flex-1" disabled={isLoading}>
                  Пропустить
                </SoftButton>
                <GradientButton onClick={handleFinish} className="flex-1" disabled={isLoading}>
                  {isLoading ? "Загрузка..." : t("onboarding.finish")}
                </GradientButton>
              </>
            )}
          </div>

          <div className="flex justify-center gap-2 pt-2">
            {[0, 1, 2, 3].map((i) => (
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
