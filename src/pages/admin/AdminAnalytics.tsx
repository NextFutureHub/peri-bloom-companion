/**
 * Страница аналитики в админ-панели
 * Показывает метрики из системы аналитики Femli приложения
 */
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Button } from "@/shared/ui/atoms/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/atoms/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/select";
import { Badge } from "@/shared/ui/atoms/badge";
import { Loader2, TrendingUp, TrendingDown, Users, Target, AlertTriangle, MessageSquare } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import {
  useAnalyticsOverview,
  useKeyMetrics,
  useAnalyticsFunnel,
  useAnalyticsLosses,
  useAnalyticsFeedback,
  useNorthStarMetric,
} from "@/features/admin/model/useAnalytics";

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  format?: 'number' | 'percentage' | 'decimal';
  icon?: React.ComponentType<any>;
  isLoading?: boolean;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  format = 'number',
  icon: Icon = Target,
  isLoading = false,
  description,
}) => {
  const formatValue = (val: number | string, fmt: MetricCardProps['format']) => {
    if (typeof val === 'string') return val;
    
    switch (fmt) {
      case 'percentage':
        return `${Math.round(val * 100)}%`;
      case 'decimal':
        return val.toFixed(2);
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = (changeVal?: number) => {
    if (!changeVal) return null;
    return changeVal > 0 
      ? <TrendingUp className="h-4 w-4 text-green-600" />
      : <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getTrendColor = (changeVal?: number) => {
    if (!changeVal) return 'text-muted-foreground';
    return changeVal > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <div>
            <div className="text-2xl font-bold">
              {formatValue(value, format)}
            </div>
            {change !== undefined && (
              <div className={`flex items-center text-xs ${getTrendColor(change)}`}>
                {getTrendIcon(change)}
                <span className="ml-1">
                  {change > 0 ? '+' : ''}{Math.round(change * 100) / 100}%
                </span>
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface FunnelStepProps {
  stepName: string;
  usersCount: number;
  conversionRate: number;
  isLast?: boolean;
}

const FunnelStep: React.FC<FunnelStepProps> = ({ stepName, usersCount, conversionRate, isLast }) => {
  const getStepLabel = (step: string) => {
    switch (step) {
      case 'app_install':
        return 'Установка приложения';
      case 'app_open':
        return 'Первое открытие';
      case 'activation_event':
        return 'Первый Core Action';
      case 'core_action_repeat':
        return 'Повторное использование';
      default:
        return step;
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{getStepLabel(stepName)}</h3>
          <p className="text-2xl font-bold text-blue-600">{usersCount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            {conversionRate.toFixed(1)}% от предыдущего этапа
          </p>
        </div>
      </div>
      {!isLast && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-300"></div>
        </div>
      )}
    </div>
  );
};

export default function AdminAnalytics() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<number>(7);

  // Функция для получения перевода названия точки выхода
  const getExitPointName = (point: string) => {
    const key = `admin.analytics.exitPoints.${point}`;
    const translated = t(key);
    return translated !== key ? translated : point; // fallback на оригинальное название
  };

  // Тестирование аналитики
  const testAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:3000/analytics/debug/status');
      const data = await response.json();
      alert(`Статус аналитики:\n${data.message}\nВсего событий: ${data.totalEvents}\nУникальных пользователей: ${data.uniqueUsers}`);
    } catch (error) {
      alert('❌ Ошибка подключения к backend: ' + error);
    }
  };
  
  const { data: keyMetrics, isLoading: keyMetricsLoading } = useKeyMetrics();
  const { northStarMetric, isLoading: northStarLoading } = useNorthStarMetric(period);
  const { data: funnel, isLoading: funnelLoading } = useAnalyticsFunnel(period);
  const { data: losses, isLoading: lossesLoading } = useAnalyticsLosses();
  const { data: feedbackData, isLoading: feedbackLoading } = useAnalyticsFeedback();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.analytics.title')}</h1>
          <p className="text-muted-foreground">
            {t('admin.analytics.description')}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={period.toString()} onValueChange={(value) => setPeriod(Number(value))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t('admin.analytics.last7days')}</SelectItem>
              <SelectItem value="30">{t('admin.analytics.last30days')}</SelectItem>
              <SelectItem value="90">{t('admin.analytics.last90days')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={testAnalytics}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            🔍 Тестировать БД
          </Button>
        </div>
      </div>

      {/* North Star Metric - главная метрика */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            {t('admin.analytics.northStarTitle')}
            <Badge variant="outline" className="ml-2">{t('admin.analytics.northStarBadge')}</Badge>
          </CardTitle>
          <CardDescription>
            {t('admin.analytics.northStarDescription', { period })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {northStarLoading ? (
            <Loader2 className="h-12 w-12 animate-spin" />
          ) : (
            <div className="text-4xl font-bold text-blue-600">
              {Math.round((northStarMetric || 0) * 100)}%
            </div>
          )}
        </CardContent>
      </Card>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title={t('admin.analytics.activationRate')}
          value={keyMetrics?.activationRate || 0}
          format="percentage"
          icon={TrendingUp}
          isLoading={keyMetricsLoading}
          description={t('admin.analytics.activationRateDesc')}
        />
        <MetricCard
          title={t('admin.analytics.day1Retention')}
          value={keyMetrics?.day1Retention || 0}
          format="percentage"
          icon={Users}
          isLoading={keyMetricsLoading}
          description={t('admin.analytics.day1RetentionDesc')}
        />
        <MetricCard
          title={t('admin.analytics.day7Retention')}
          value={keyMetrics?.day7Retention || 0}
          format="percentage"
          icon={Users}
          isLoading={keyMetricsLoading}
          description={t('admin.analytics.day7RetentionDesc')}
        />
        <MetricCard
          title={t('admin.analytics.coreActionFreq')}
          value={keyMetrics?.coreActionFrequency || 0}
          format="decimal"
          icon={Target}
          isLoading={keyMetricsLoading}
          description={t('admin.analytics.coreActionFreqDesc')}
        />
        <MetricCard
          title={t('admin.analytics.repeatUsers')}
          value={keyMetrics?.repeatUsersPercent || 0}
          format="percentage"
          icon={TrendingUp}
          isLoading={keyMetricsLoading}
          description={t('admin.analytics.repeatUsersDesc')}
        />
        <MetricCard
          title={t('admin.analytics.uniqueUsers')}
          value={keyMetrics?.uniqueUsers || 0}
          format="number"
          icon={Users}
          isLoading={keyMetricsLoading}
          description={t('admin.analytics.uniqueUsersDesc')}
        />
      </div>

      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnel">{t('admin.analytics.funnel')}</TabsTrigger>
          <TabsTrigger value="losses">{t('admin.analytics.losses')}</TabsTrigger>
          <TabsTrigger value="feedback">{t('admin.analytics.feedback')}</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.analytics.funnelTitle')}</CardTitle>
              <CardDescription>
                {t('admin.analytics.funnelDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {funnelLoading ? (
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              ) : funnel?.steps ? (
                <div className="space-y-6">
                  {funnel.steps.map((step, index) => (
                    <FunnelStep
                      key={step.step_name}
                      stepName={step.step_name}
                      usersCount={step.users_count}
                      conversionRate={step.conversion_from_previous}
                      isLast={index === funnel.steps.length - 1}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">{t('admin.analytics.noFunnelData')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="losses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  {t('admin.analytics.errorsTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lossesLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : losses?.errorsByScreen.length ? (
                  <div className="space-y-3">
                    {losses.errorsByScreen.slice(0, 5).map((error, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="font-medium">{error.screen}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold text-red-600">{error.errors}</div>
                          <div className="text-xs text-muted-foreground">
                            {error.errorRate.toFixed(1)}% rate
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('admin.analytics.noErrors')}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('admin.analytics.exitPointsTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                {lossesLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : losses?.exitPoints.length ? (
                  <div className="space-y-3">
                    {losses.exitPoints.map((exit, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <span className="font-medium">{getExitPointName(exit.point)}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold text-orange-600">{exit.exits}</div>
                          <div className="text-xs text-muted-foreground">
                            {exit.exitRate.toFixed(1)}% exit rate
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('admin.analytics.noExitData')}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                {t('admin.analytics.feedbackTitle')}
              </CardTitle>
              <CardDescription>
                {t('admin.analytics.feedbackDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {feedbackLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : feedbackData?.feedback.length ? (
                <div className="space-y-4">
                  {feedbackData.feedback.slice(0, 10).map((feedback) => (
                    <div key={feedback.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={feedback.trigger === 'after_second_core_action' ? 'default' : 'secondary'}>
                          {feedback.trigger === 'after_second_core_action' 
                            ? t('admin.analytics.triggerAfterUse')
                            : t('admin.analytics.triggerBeforeExit')
                          }
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(feedback.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      
                      {feedback.expectations && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-gray-700">{t('admin.analytics.feedbackExpectations')}</p>
                          <p className="text-sm text-gray-600">{feedback.expectations}</p>
                        </div>
                      )}
                      
                      {feedback.unclear_points && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-gray-700">{t('admin.analytics.feedbackUnclear')}</p>
                          <p className="text-sm text-gray-600">{feedback.unclear_points}</p>
                        </div>
                      )}
                      
                      {feedback.exit_reason && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">{t('admin.analytics.feedbackExit')}</p>
                          <p className="text-sm text-gray-600">{feedback.exit_reason}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {feedbackData.total > 10 && (
                    <p className="text-sm text-muted-foreground text-center">
                      {t('admin.analytics.feedbackShowing', { shown: 10, total: feedbackData.total })}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">{t('admin.analytics.noFeedback')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}