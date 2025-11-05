# Feature-Sliced Design v2.0 - PeriBloom

## ✅ Что реализовано (FSD v2.0)

### 1. BaseService Layer
- ✅ `shared/api/baseService.ts` - базовый класс для всех API сервисов
- ✅ Все entities используют BaseService (UserService, SymptomService, DeviceService, AuthService)
- ✅ Единообразный API через методы `get()`, `post()`, `patch()`, `delete()`

### 2. Типизация и DTO Management
- ✅ `shared/types/api/` - DTO для каждой сущности:
  - `user.dto.ts`
  - `symptom.dto.ts`
  - `device.dto.ts`
  - `auth.dto.ts`
- ✅ `shared/types/common/` - общие типы (BaseEntity, ApiResponse, etc.)
- ✅ Централизованный экспорт через `shared/types/index.ts`

### 3. i18n Architecture
- ✅ `shared/config/i18n/` - структурированные переводы:
  - `index.ts` - экспорт и типы
  - `ru.ts` - русский язык
  - `kk.ts` - казахский язык
- ✅ `useTranslation` hook интегрирован с `LanguageProvider`

### 4. Error Handling
- ✅ `shared/lib/errorBoundary/ErrorBoundary.tsx` - компонент для обработки ошибок
- ✅ ErrorBoundary на уровне AppProviders
- ✅ ErrorBoundary на каждом protected route

### 5. AuthGuard
- ✅ `shared/lib/guards/AuthGuard.tsx` - защита маршрутов
- ✅ Проверка через `useUserQuery` из entities/user
- ✅ Автоматический редирект при отсутствии авторизации
- ✅ Проверка статуса onboarding

### 6. React Query DevTools
- ✅ `@tanstack/react-query-devtools` установлен
- ✅ Показывается только в development режиме
- ✅ Позиция: bottom-right

### 7. App-level Optimizations
- ✅ ErrorBoundary на верхнем уровне
- ✅ ReactQueryDevtools в development
- ✅ Все провайдеры правильно обёрнуты

## 📁 Итоговая структура (FSD v2.0)

```
src/
├── app/
│   ├── providers/          ✅ QueryProvider, ThemeProvider, LanguageProvider
│   ├── router/             ✅ Routes с ErrorBoundary и AuthGuard
│   └── App.tsx
│
├── processes/              ⚠️ Структура создана (registration flow)
│   └── registration/
│
├── pages/                  ✅ Только композиция компонентов
│
├── widgets/                ✅ Navigation
│   └── header/
│
├── features/               ✅ Бизнес-фичи
│   ├── auth/              ✅ Полностью готово (BaseService)
│   ├── onboarding/        ⚠️ Структура готова
│   ├── aiChat/            ⚠️ Структура готова
│   ├── symptoms/          ✅ Использует entities/symptom
│   └── iotMonitor/         ✅ Использует entities/device
│
├── entities/               ✅ Бизнес-сущности с BaseService
│   ├── user/              ✅ UserService extends BaseService
│   ├── symptom/           ✅ SymptomService extends BaseService
│   ├── device/            ✅ DeviceService extends BaseService
│   └── aiMessage/         ⚠️ Структура создана
│
└── shared/
    ├── api/
    │   ├── baseService.ts  ✅ BaseService класс
    │   ├── client.ts       ✅ Axios client
    │   └── queryKeys.ts    ✅ Централизованные ключи
    ├── config/
    │   └── i18n/          ✅ Структурированные переводы
    ├── hooks/
    │   └── useTranslation.ts ✅ Интеграция с LanguageProvider
    ├── lib/
    │   ├── errorBoundary/  ✅ ErrorBoundary компонент
    │   ├── guards/         ✅ AuthGuard компонент
    │   └── utils.ts        ✅ Утилиты
    ├── types/
    │   ├── api/           ✅ DTO для каждой сущности
    │   ├── common/        ✅ Общие типы
    │   └── index.ts       ✅ Централизованный экспорт
    └── ui/
        └── atoms/         ✅ Shadcn компоненты
```

## 🔄 Использование BaseService

Все сервисы теперь используют единый подход:

```typescript
// До
export const fetchMe = () => api.get("/users/me").then(r => r.data.data);

// После
class UserService extends BaseService {
  fetchMe() {
    return this.get<UserWithProfileResponseDto>("/users/me");
  }
}
```

## 🎯 Что дальше (опционально)

1. **Molecules и Organisms** - расширить UI слой
2. **Processes** - реализовать registration flow
3. **Features** - перенести логику из pages в features
4. **AI Message Entity** - создать полную структуру для AI чата
5. **Prefetch** - добавить prefetch в route loaders
6. **Optimistic Updates** - добавить оптимистичные обновления

## 📝 Примечания

- Все сервисы используют BaseService для единообразия
- Типы централизованы в `shared/types/api/`
- i18n структурирован в `shared/config/i18n/`
- ErrorBoundary и AuthGuard готовы к использованию
- React Query DevTools доступен в development

