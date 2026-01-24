# 📊 Интеграция Аналитики в Админ-панель

## Обзор
Интеграция системы продуктовой аналитики из **Femli** мобильного приложения в веб-админ-панель.

## 🎯 Реализованные метрики

### North Star Metric (Главная метрика)
- **Что:** % пользователей, совершивших ≥2 Core Actions за 7 дней
- **Где показывается:** Главный дашборд админки (выделенная карточка)
- **API:** `GET /admin/analytics/overview?periodDays=7`

### Ключевые метрики
1. **Activation Rate** - `activation_event / app_install`
2. **Day 1 Retention** - % пользователей, вернувшихся на следующий день
3. **Day 7 Retention** - % пользователей, вернувшихся через неделю  
4. **Core Action Frequency** - среднее число Core Actions на пользователя
5. **Repeat Users %** - % пользователей с ≥2 Core Actions

### Детальная аналитика
- **Воронка пользователей** - от установки до повторного использования
- **Анализ потерь** - ошибки по экранам и точки выхода
- **Качественная обратная связь** - отзывы пользователей

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

### 1. Обзор аналитики
```typescript
GET /admin/analytics/overview?periodDays=7
Response: AnalyticsOverviewDto
```

### 2. Детальные метрики
```typescript
GET /admin/analytics/metrics?startDate=...&endDate=...
Response: AnalyticsMetricsDto
```

### 3. Воронка пользователей
```typescript
GET /admin/analytics/funnel?periodDays=7
Response: AnalyticsFunnelDto
```

### 4. Анализ потерь
```typescript
GET /admin/analytics/losses
Response: AnalyticsLossesDto
```

### 5. События (для отладки)
```typescript
GET /admin/analytics/events?limit=100&userId=...&eventName=...
Response: { events: AnalyticsEventDto[], total: number }
```

### 6. Обратная связь
```typescript
GET /admin/analytics/feedback?limit=50
Response: { feedback: AnalyticsFeedbackDto[], total: number }
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
import { useKeyMetrics, useNorthStarMetric } from "@/features/admin/model/useAnalytics";

const { data: keyMetrics } = useKeyMetrics();
const { northStarMetric } = useNorthStarMetric();
```

### В AdminAnalytics.tsx (детальная страница)
```typescript
import { 
  useAnalyticsOverview,
  useAnalyticsFunnel,
  useAnalyticsLosses,
  useAnalyticsFeedback 
} from "@/features/admin/model/useAnalytics";
```

## 🎨 UI Особенности

1. **North Star Metric** - выделенная голубая карточка на главном дашборде
2. **Табы на детальной странице** - Воронка / Анализ потерь / Обратная связь
3. **Период выбора** - 7/30/90 дней
4. **Автообновление** - каждые 10 минут для ключевых метрик
5. **Индикаторы загрузки** - Skeleton компоненты

## 🔄 Синхронизация данных

События из Femli отправляются на backend через:
1. **Realtime** - при активном интернете
2. **Batch sync** - при подключении к интернету
3. **Хранение в AsyncStorage** - для офлайн работы

## 📈 Метрики расчета

Точные формулы согласно ТЗ:
- **Activation Rate** = `COUNT(activation_event) / COUNT(app_install)`
- **North Star** = `COUNT(users с ≥2 core_action за 7 дней) / COUNT(active users за 7 дней)`
- **Retention Day N** = `COUNT(users возвратившихся на день N) / COUNT(users установивших N дней назад)`