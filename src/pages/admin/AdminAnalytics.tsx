/**
 * Страница аналитики в админ-панели
 * Показывает метрики из системы аналитики Femli приложения
 */
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Button } from "@/shared/ui/atoms/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/select";
import { Badge } from "@/shared/ui/atoms/badge";
import { Loader2, TrendingUp, TrendingDown, Users, Target, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import {
  useFirstTimeAppOpens,
  useD7AppOpenAfterRegistration,
  useRiskEngineOverview,
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

// Старые компоненты/воронки (core_action) удалены — оставляем только метрики из нового ТЗ.

export default function AdminAnalytics() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<number>(7);

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
  
  const { data: firstTimeOpens, isLoading: firstTimeOpensLoading } = useFirstTimeAppOpens(period);
  const { data: d7FromRegistration, isLoading: d7FromRegistrationLoading } = useD7AppOpenAfterRegistration(period);
  const { data: riskOverview, isLoading: riskOverviewLoading } = useRiskEngineOverview(period);

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

      {/* North Star Metric (новая) */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            {t('admin.analytics.northStarTitle')}
            <Badge variant="outline" className="ml-2">{t('admin.analytics.northStarBadge')}</Badge>
          </CardTitle>
          <CardDescription>
            {t('admin.analytics.validSeriesUsersDesc', {
              rate: Math.round((riskOverview?.validSeriesRate || 0) * 100),
              active: riskOverview?.activeUsersWithData || 0,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {riskOverviewLoading ? (
            <Loader2 className="h-12 w-12 animate-spin" />
          ) : (
            <div className="text-4xl font-bold text-blue-600">
              {Math.round((riskOverview?.validSeriesRate || 0) * 100)}%
            </div>
          )}
        </CardContent>
      </Card>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title={t('admin.analytics.validSeriesUsers')}
          value={riskOverview ? riskOverview.validSeriesUsers : 0}
          format="number"
          icon={Target}
          isLoading={riskOverviewLoading}
          description={
            riskOverview
              ? t('admin.analytics.validSeriesUsersDesc', {
                  rate: Math.round(riskOverview.validSeriesRate * 100),
                  active: riskOverview.activeUsersWithData,
                })
              : t('admin.analytics.validSeriesUsersDesc', { rate: 0, active: 0 })
          }
        />
        <MetricCard
          title={t('admin.analytics.coverageAvgDays')}
          value={riskOverview ? riskOverview.coverageAvgDays : 0}
          format="decimal"
          icon={Target}
          isLoading={riskOverviewLoading}
          description={t('admin.analytics.coverageAvgDaysDesc', { period })}
        />
        <MetricCard
          title={t('admin.analytics.explainabilityCoverage')}
          value={riskOverview ? riskOverview.explainabilityCoverage : 0}
          format="percentage"
          icon={TrendingUp}
          isLoading={riskOverviewLoading}
          description={t('admin.analytics.explainabilityCoverageDesc')}
        />
        <MetricCard
          title={t('admin.analytics.volatilityAvgRiskChanges')}
          value={riskOverview ? riskOverview.volatilityAvgRiskChanges : 0}
          format="decimal"
          icon={AlertTriangle}
          isLoading={riskOverviewLoading}
          description={t('admin.analytics.volatilityAvgRiskChangesDesc', { period })}
        />
        <MetricCard
          title={t('admin.analytics.actionAlignment24h')}
          value={riskOverview ? riskOverview.actionAlignment24h : 0}
          format="percentage"
          icon={Users}
          isLoading={riskOverviewLoading}
          description={t('admin.analytics.actionAlignment24hDesc')}
        />
        <MetricCard
          title={t('admin.analytics.firstTimeAppOpen')}
          value={firstTimeOpens?.totalUsers || 0}
          format="number"
          icon={Users}
          isLoading={firstTimeOpensLoading}
          description={t('admin.analytics.firstTimeAppOpenDesc', { period })}
        />
        <MetricCard
          title={t('admin.analytics.d7AppOpenAfterRegistration')}
          value={d7FromRegistration?.returnedUsers || 0}
          format="number"
          icon={Users}
          isLoading={d7FromRegistrationLoading}
          description={
            d7FromRegistration
              ? t('admin.analytics.d7AppOpenAfterRegistrationDesc', {
                  eligible: d7FromRegistration.eligibleUsers,
                  rate: Math.round((d7FromRegistration.retentionRate || 0) * 100),
                })
              : t('admin.analytics.d7AppOpenAfterRegistrationDesc', { eligible: 0, rate: 0 })
          }
        />
      </div>
    </div>
  );
}