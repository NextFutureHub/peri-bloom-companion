import { useTranslation } from "@/shared/hooks/useTranslation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { GradientButton } from "@/shared/ui/atoms/button-variants";
import { MessageCircle, BookOpen, FileText, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserQuery } from "@/entities/user";

const Dashboard = () => {
  const { data: user, isLoading } = useUserQuery("profile");
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user?.profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Профиль не найден</p>
      </div>
    );
  }

  const profile = user.profile;
  const userName = profile.name || "Пользователь";

  // Получаем недели беременности из API или рассчитываем
  const getWeeksPregnant = (): number => {
    // Если есть gestationalAgeWeeks из API - используем его
    if (profile.gestationalAgeWeeks) {
      return profile.gestationalAgeWeeks;
    }
    
    // Иначе рассчитываем из estimatedDueDate
    if (profile.estimatedDueDate) {
      const due = new Date(profile.estimatedDueDate);
      const now = new Date();
      const diff = due.getTime() - now.getTime();
      const weeks = 40 - Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
      return Math.max(0, Math.min(42, weeks));
    }
    
    return 0;
  };

  // Получаем возраст ребенка в месяцах
  const getChildAgeMonths = (): number => {
    if (profile.deliveryDate) {
      const birth = new Date(profile.deliveryDate);
      const now = new Date();
      const diff = now.getTime() - birth.getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    }
    
    // Проверяем children если есть
    if (profile.children && Array.isArray(profile.children) && profile.children.length > 0) {
      const firstChild = profile.children[0] as { dateOfBirth?: string };
      if (firstChild?.dateOfBirth) {
        const birth = new Date(firstChild.dateOfBirth);
        const now = new Date();
        const diff = now.getTime() - birth.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
      }
    }
    
    return 0;
  };

  const weeks = profile.lifeStage === "pregnancy" ? getWeeksPregnant() : 0;
  const months = profile.lifeStage !== "pregnancy" ? getChildAgeMonths() : 0;

  const quickActions = [
    {
      title: t("dashboard.aiAssistant"),
      description: "Задайте вопрос AI",
      icon: MessageCircle,
      path: "/ai-chat",
      gradient: "gradient-primary",
    },
    {
      title: t("dashboard.symptomJournal"),
      description: "Отслеживайте симптомы",
      icon: FileText,
      path: "/symptoms",
      gradient: "gradient-peachy",
    },
    {
      title: t("dashboard.education"),
      description: "Обучающие материалы",
      icon: BookOpen,
      path: "/education",
      gradient: "gradient-warm",
    },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-soft animate-float">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-glow animate-pulse-soft">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-4xl">
              Здравствуйте, {userName}! 💗
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              {profile.lifeStage === "pregnancy" && (
                <span className="text-primary font-semibold">
                  {weeks} {t("dashboard.weeksPregnant")}
                </span>
              )}
              {profile.lifeStage === "postpartum" && (
                <span className="text-primary font-semibold">
                  {t("dashboard.childAge")}: {months} {t("dashboard.months")}
                </span>
              )}
              {profile.lifeStage === "childcare" && (
                <span className="text-primary font-semibold">
                  {t("dashboard.childAge")}: {months} {t("dashboard.months")}
                </span>
              )}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">{t("dashboard.quickActions")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="shadow-soft hover:shadow-glow transition-smooth cursor-pointer group"
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div
                    className={`mx-auto w-16 h-16 rounded-2xl ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-smooth shadow-soft`}
                  >
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                  </div>
                  <GradientButton className="w-full">Открыть</GradientButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
