import { useAdminDashboard } from "@/features/admin";
import { useKeyMetrics, useNorthStarMetric } from "@/features/admin/model/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Users, MessageCircle, Activity, BookOpen, AlertCircle, TrendingUp, Target, Star } from "lucide-react";
import { Skeleton } from "@/shared/ui/atoms/skeleton";
import { Badge } from "@/shared/ui/atoms/badge";
import { useTranslation } from "@/shared/hooks/useTranslation";

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
  const { data: keyMetrics, isLoading: analyticsLoading } = useKeyMetrics();
  const { northStarMetric, isLoading: northStarLoading } = useNorthStarMetric();
  const { t } = useTranslation();

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">{t("admin.dashboard.errorLoading")}</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="min-h-[calc(100dvh-5rem)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("admin.dashboard.title")}</h1>
          <p className="text-muted-foreground">
            {t("admin.dashboard.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t("admin.dashboard.totalUsers")}
            value={stats?.totalUsers ?? 0}
            icon={Users}
            isLoading={isLoading}
          />
          <StatCard
            title={t("admin.dashboard.newUsers")}
            value={stats?.newUsers ?? 0}
            icon={TrendingUp}
            description={t("admin.dashboard.newUsersDescription")}
            isLoading={isLoading}
          />
          <StatCard
            title={t("admin.dashboard.activeUsers")}
            value={stats?.activeUsers ?? 0}
            icon={Activity}
            description={t("admin.dashboard.activeUsersDescription")}
            isLoading={isLoading}
          />
          <StatCard
            title={t("admin.dashboard.activeChats")}
            value={stats?.activeChats ?? 0}
            icon={MessageCircle}
            description={t("admin.dashboard.activeChatsDescription")}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t("admin.dashboard.onlineDevices")}
            value={stats?.onlineDevices ?? 0}
            icon={Activity}
            isLoading={isLoading}
          />
          <StatCard
            title={t("admin.dashboard.offlineDevices")}
            value={stats?.offlineDevices ?? 0}
            icon={Activity}
            isLoading={isLoading}
          />
          <StatCard
            title={t("admin.dashboard.completedModules")}
            value={stats?.completedModules ?? 0}
            icon={BookOpen}
            isLoading={isLoading}
          />
          <StatCard
            title={t("admin.dashboard.incidents")}
            value={stats?.incidents ?? 0}
            icon={AlertCircle}
            isLoading={isLoading}
          />
        </div>

        {/* North Star Metric - главная метрика аналитики */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              North Star Metric
              <Badge variant="outline" className="ml-2">Главная метрика</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {northStarLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round((northStarMetric || 0) * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Пользователи с ≥2 Core Actions за 7 дней
                  </p>
                </div>
                <Star className="h-8 w-8 text-blue-500" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ключевые аналитические метрики */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Продуктовая аналитика
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Activation Rate"
              value={keyMetrics?.activationRate ? `${Math.round(keyMetrics.activationRate * 100)}%` : '0%'}
              icon={TrendingUp}
              description="Доля активировавшихся пользователей"
              isLoading={analyticsLoading}
            />
            <StatCard
              title="Day 1 Retention"
              value={keyMetrics?.day1Retention ? `${Math.round(keyMetrics.day1Retention * 100)}%` : '0%'}
              icon={Users}
              description="Возвращаются на следующий день"
              isLoading={analyticsLoading}
            />
            <StatCard
              title="Day 7 Retention"
              value={keyMetrics?.day7Retention ? `${Math.round(keyMetrics.day7Retention * 100)}%` : '0%'}
              icon={Users}
              description="Возвращаются через неделю"
              isLoading={analyticsLoading}
            />
            <StatCard
              title="Core Actions/User"
              value={keyMetrics?.coreActionFrequency?.toFixed(1) || '0.0'}
              icon={Target}
              description="Среднее число Core Actions"
              isLoading={analyticsLoading}
            />
          </div>
        </div>

        {data?.generatedAt && (
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                {t("admin.dashboard.dataUpdated")}: {new Date(data.generatedAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

