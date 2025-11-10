# Feature-Sliced Design (FSD) Architecture

Проект PeriBloom использует архитектуру Feature-Sliced Design для организации кода.

## Структура проекта

```
src/
├── app/                    # Инициализация приложения
│   ├── providers/          # Провайдеры (QueryClient, Theme, Language)
│   ├── router/             # Конфигурация роутинга
│   └── App.tsx             # Главный компонент
│
├── pages/                  # Страницы приложения
│   ├── Dashboard.tsx
│   ├── Onboarding.tsx
│   ├── AIChat.tsx
│   └── ...
│
├── widgets/                # Композиционные компоненты
│   └── header/
│       └── Navigation.tsx
│
├── features/               # Бизнес-фичи
│   ├── auth/              # Аутентификация
│   │   ├── api/           # API клиенты
│   │   ├── model/         # React Query hooks
│   │   └── ui/            # UI компоненты фичи
│   ├── onboarding/
│   ├── aiChat/
│   ├── symptoms/
│   └── iotMonitor/
│
├── entities/               # Бизнес-сущности
│   ├── user/              # Пользователь
│   │   ├── api/           # API клиенты
│   │   ├── model/         # React Query hooks
│   │   └── ui/            # UI компоненты сущности
│   ├── symptom/           # Симптом
│   └── device/            # IoT устройство
│
└── shared/                 # Переиспользуемый код
    ├── api/               # API клиент (axios)
    ├── hooks/            # Общие хуки
    ├── lib/              # Утилиты
    ├── types/            # Общие типы
    └── ui/               # UI компоненты (shadcn)
        └── atoms/        # Атомарные компоненты
```

## Правила зависимостей

1. **pages** → может импортировать `features`, `widgets`, `entities`, `shared`
2. **widgets** → может импортировать `entities`, `shared`
3. **features** → может импортировать `entities`, `shared`
4. **entities** → может импортировать только `shared`
5. **shared** → не может импортировать ничего из других слоёв

## Использование

### API клиент

```typescript
import { api } from "@/shared/api/client";

// API клиент настроен с interceptors для авторизации
```

### React Query hooks

```typescript
import { useUserQuery, useUpdateProfile } from "@/entities/user";

// В компоненте
const { data: user, isLoading } = useUserQuery();
const updateMutation = useUpdateProfile();
```

### Features

```typescript
import { useLogin, useRegister } from "@/features/auth";

const loginMutation = useLogin();
loginMutation.mutate({ email, password });
```

## Ключи запросов

Все ключи запросов определены в `shared/api/queryKeys.ts` для централизованного управления кешем.

## Провайдеры

Провайдеры настроены в `app/providers/index.tsx`:
- QueryClientProvider (React Query)
- ThemeProvider (next-themes)
- LanguageProvider (i18n)




