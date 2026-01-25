# 📊 Интеграция Аналитики в Админ-панель

## Обзор
Интеграция системы продуктовой аналитики из **Femli** мобильного приложения в веб-админ-панель.

## 🎯 Реализованные метрики

### North Star Metric (Главная метрика)
- **Что:** **Active Users with Valid 7-day Time Series**  
  (валидный ряд = ≥4 дней данных `symptom_logged|bp_logged` за 7 дней + был `risk_status_viewed`)
- **Где показывается:** Главный дашборд админки (выделенная карточка)
- **API:** `GET /admin/analytics/risk/overview?periodDays=7`

### Дополнительные метрики (Risk Engine)
- Coverage (avg active days with data)
- Volatility (avg `risk_status_changed` per user)
- Explainability coverage (% смен риска с `explainability_available=1`)
- Action alignment 24h (% high/critical → `help_steps_opened` в течение 24ч)

### Метрики по app_open
- **First-time app_open**: сколько пользователей впервые открыли приложение (по их первому `app_open`)
- **D7 app_open от регистрации**: сколько пользователей открыли приложение на 7-й день после `User.createdAt`

## 🗂 Структура файлов

```
web/src/features/admin/
├── api/analytics.client.ts      # API клиент для аналитических данных
├── model/useAnalytics.ts        # React Query хуки для аналитики
└── analytics/README.md          # Документация

web/src/pages/admin/
├── AdminDashboard.tsx           # Обновлен с аналитическими метриками
└── AdminAnalytics.tsx           # Отдельная страница детальной аналитики
```

## 📡 Требуемые Backend API Endpoints

### 1. Risk Engine overview (North Star и связанные метрики)
```typescript
GET /admin/analytics/risk/overview?periodDays=7
Response: RiskEngineOverviewResponseDto
```

### 2. First-time app_open
```typescript
GET /admin/analytics/app-open/first-time?periodDays=7
Response: FirstTimeAppOpenResponseDto
```

### 3. D7 app_open от регистрации
```typescript
GET /admin/analytics/retention/app-open/d7?periodDays=7
Response: D7AppOpenAfterRegistrationResponseDto
```

### 4. События (для отладки)
```typescript
GET /admin/analytics/events?limit=100&userId=...&eventName=...
Response: { events: AnalyticsEventDto[], total: number }
```

## 🏗 Backend Integration План

### Шаг 1: Данные из Femli в Backend
События аналитики из мобильного приложения должны передаваться на backend:

```typescript
// Синхронизация событий из Femli AsyncStorage
POST /analytics/events/batch
Body: { events: AnalyticsEvent[] }
```

### Шаг 2: Admin Controller
Создать контроллер в `backend-peri/src/modules/admin/`:

```typescript
@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminAnalyticsController {
  @Get('overview')
  async getOverview(@Query('periodDays') periodDays?: number) {
    // Вычисление метрик из событий
    return this.analyticsService.calculateOverview(periodDays);
  }

  @Get('metrics')
  async getMetrics(@Query() params: AnalyticsMetricsQuery) {
    return this.analyticsService.calculateMetrics(params);
  }

  // ... другие endpoints
}
```

### Шаг 3: Database Schema
Добавить таблицы в Prisma:

```prisma
model AnalyticsEvent {
  id          String   @id @default(cuid())
  event_name  String
  timestamp   DateTime
  user_id     String
  session_id  String
  data        Json?    // Дополнительные поля события
  created_at  DateTime @default(now())
  
  @@index([user_id, timestamp])
  @@index([event_name, timestamp])
}

model FeedbackResponse {
  id              String   @id @default(cuid())
  user_id         String   @unique // Один отзыв на пользователя
  trigger         String   // 'after_second_core_action' | 'exit_without_core_action'
  expectations    String?
  unclear_points  String?
  exit_reason     String?
  created_at      DateTime @default(now())
}
```

## 🔧 Использование

### В AdminDashboard.tsx (главный дашборд)
```typescript
import { useRiskEngineOverview } from "@/features/admin/model/useAnalytics";

const { data: riskOverview } = useRiskEngineOverview(7);
```

### В AdminAnalytics.tsx (детальная страница)
```typescript
import { 
  useRiskEngineOverview,
  useFirstTimeAppOpens,
  useD7AppOpenAfterRegistration
} from "@/features/admin/model/useAnalytics";
```

## 🎨 UI Особенности

1. **North Star Metric** - выделенная голубая карточка на главном дашборде
2. **Детальная страница** - только метрики, которые реально собираются новой схемой
3. **Период выбора** - 7/30/90 дней
4. **Автообновление** - зависит от метрики (обычно 5–10 минут)
5. **Индикаторы загрузки** - Skeleton компоненты

## 🔄 Синхронизация данных

События из Femli отправляются на backend через:
1. **Realtime** - при активном интернете
2. **Batch sync** - при подключении к интернету
3. **Хранение в AsyncStorage** - для офлайн работы

## 📈 Метрики расчёта (кратко)

- **North Star (Valid series rate)** = `validSeriesUsers / activeUsersWithData`
- **validSeriesUsers** = users с `>=4` дней данных (`symptom_logged|bp_logged`) за окно + `risk_status_viewed` в окне