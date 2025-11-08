import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, ReactNode } from "react";
import { Navigation } from "@/widgets/header";
import { AuthGuard } from "@/shared/lib/guards";
import { ErrorBoundary } from "@/shared/lib/errorBoundary";
import { useUserQuery } from "@/entities/user";
import { tokenStorage } from "@/shared/api/client";

// Lazy loading для страниц
const OnboardingPage = lazy(() => import("@/pages/Onboarding"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const AIChatPage = lazy(() => import("@/pages/AIChat"));
const SymptomsPage = lazy(() => import("@/pages/Symptoms"));
const IoTMonitorPage = lazy(() => import("@/pages/IoTMonitor"));
const EducationPage = lazy(() => import("@/pages/Education"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

// Layout с навигацией
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const accessToken = tokenStorage.getAccessToken();
  // Запрос выполняется только если есть токен
  const { data: user } = useUserQuery("profile", {
    enabled: !!accessToken,
  });
  
  // Проверяем onboarding статус через API
  const onboardingComplete = 
    accessToken && 
    user?.profile?.lifeStage !== null && 
    user?.profile?.lifeStage !== undefined;

  return (
    <div className={onboardingComplete ? "pb-20 md:pb-0 md:pt-20" : ""}>
      {onboardingComplete && <Navigation />}
      {children}
    </div>
  );
};

// Компонент для главной страницы с проверкой авторизации
const HomePage = () => {
  const accessToken = tokenStorage.getAccessToken();
  // Запрос выполняется только если есть токен
  const { data: user, isLoading } = useUserQuery("profile", {
    enabled: !!accessToken,
  });

  // Если загружается и есть токен, показываем загрузку
  if (accessToken && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если есть токен и пользователь авторизован с завершенным onboarding
  if (accessToken && user?.profile?.lifeStage) {
    return <Navigate to="/dashboard" replace />;
  }

  // Иначе показываем onboarding
  return <OnboardingPage />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <HomePage />
      </AppLayout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AppLayout>
        <ErrorBoundary>
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        </ErrorBoundary>
      </AppLayout>
    ),
  },
  {
    path: "/ai-chat",
    element: (
      <AppLayout>
        <ErrorBoundary>
          <AuthGuard>
            <AIChatPage />
          </AuthGuard>
        </ErrorBoundary>
      </AppLayout>
    ),
  },
  {
    path: "/symptoms",
    element: (
      <AppLayout>
        <ErrorBoundary>
          <AuthGuard>
            <SymptomsPage />
          </AuthGuard>
        </ErrorBoundary>
      </AppLayout>
    ),
  },
  {
    path: "/iot",
    element: (
      <AppLayout>
        <ErrorBoundary>
          <AuthGuard>
            <IoTMonitorPage />
          </AuthGuard>
        </ErrorBoundary>
      </AppLayout>
    ),
  },
  {
    path: "/education",
    element: (
      <AppLayout>
        <ErrorBoundary>
          <AuthGuard>
            <EducationPage />
          </AuthGuard>
        </ErrorBoundary>
      </AppLayout>
    ),
  },
  {
    path: "/settings",
    element: (
      <AppLayout>
        <ErrorBoundary>
          <AuthGuard>
            <SettingsPage />
          </AuthGuard>
        </ErrorBoundary>
      </AppLayout>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

