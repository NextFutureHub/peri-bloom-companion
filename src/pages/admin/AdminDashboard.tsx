import { useAdminDashboard } from "@/features/admin";
import { useRiskEngineOverview } from "@/features/admin/model/useAnalytics";
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
  const { data: riskOverview, isLoading: riskLoading } = useRiskEngineOverview(7);
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

        {/* North Star Metric (новая) */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              North Star Metric
              <Badge variant="outline" className="ml-2">Главная метрика</Badge>
              {!riskLoading && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Обновляется каждые 30 сек
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {riskLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(((riskOverview?.validSeriesRate || 0) * 100))}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Валидный 7‑дневный ряд (≥4 дней данных + просмотр риска)
                  </p>
                  {(riskOverview?.validSeriesUsers || 0) === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ Проверьте синхронизацию событий из мобильного приложения
                    </p>
                  )}
                </div>
                <Star className="h-8 w-8 text-blue-500" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Engine метрики (скользящее окно 7 дней) */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Risk Engine
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Валидные ряды (users)"
              value={riskOverview?.validSeriesUsers ?? 0}
              icon={Target}
              description="≥4 дней данных + просмотр риска"
              isLoading={riskLoading}
            />
            <StatCard
              title="Coverage (avg days)"
              value={riskOverview?.coverageAvgDays?.toFixed(1) ?? "0.0"}
              icon={TrendingUp}
              description="Среднее число дней с данными"
              isLoading={riskLoading}
            />
            <StatCard
              title="Explainability"
              value={riskOverview ? `${Math.round(riskOverview.explainabilityCoverage * 100)}%` : "0%"}
              icon={Users}
              description="% смен риска с объяснением"
              isLoading={riskLoading}
            />
            <StatCard
              title="Action alignment (24h)"
              value={riskOverview ? `${Math.round(riskOverview.actionAlignment24h * 100)}%` : "0%"}
              icon={Users}
              description="High/critical → help_steps_opened"
              isLoading={riskLoading}
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

