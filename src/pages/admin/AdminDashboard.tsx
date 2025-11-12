import { useAdminDashboard } from "@/features/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Users, MessageCircle, Activity, BookOpen, AlertCircle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/shared/ui/atoms/skeleton";

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  isLoading,
}: {
  title: string;
  value: number | string;
  icon: any;
  description?: string;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-12 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const { data, isLoading, error } = useAdminDashboard();

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Ошибка загрузки данных</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="min-h-[calc(100dvh-5rem)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
          <p className="text-muted-foreground">
            Обзор активности платформы PeriBloom
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Всего пользователей"
            value={stats?.totalUsers ?? 0}
            icon={Users}
            isLoading={isLoading}
          />
          <StatCard
            title="Новые регистрации"
            value={stats?.newUsers ?? 0}
            icon={TrendingUp}
            description="За последние 7 дней"
            isLoading={isLoading}
          />
          <StatCard
            title="Активные пользователи"
            value={stats?.activeUsers ?? 0}
            icon={Activity}
            description="За последние 30 дней"
            isLoading={isLoading}
          />
          <StatCard
            title="Активные AI-чаты"
            value={stats?.activeChats ?? 0}
            icon={MessageCircle}
            description="За последние 24 часа"
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Онлайн устройств"
            value={stats?.onlineDevices ?? 0}
            icon={Activity}
            isLoading={isLoading}
          />
          <StatCard
            title="Офлайн устройств"
            value={stats?.offlineDevices ?? 0}
            icon={Activity}
            isLoading={isLoading}
          />
          <StatCard
            title="Завершённых модулей"
            value={stats?.completedModules ?? 0}
            icon={BookOpen}
            isLoading={isLoading}
          />
          <StatCard
            title="Инциденты"
            value={stats?.incidents ?? 0}
            icon={AlertCircle}
            isLoading={isLoading}
          />
        </div>

        {data?.generatedAt && (
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Данные обновлены: {new Date(data.generatedAt).toLocaleString("ru-RU")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

