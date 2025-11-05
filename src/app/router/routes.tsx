import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, ReactNode } from "react";
import { Navigation } from "@/widgets/header";

// Lazy loading для страниц
const OnboardingPage = lazy(() => import("@/pages/Onboarding"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const AIChatPage = lazy(() => import("@/pages/AIChat"));
const SymptomsPage = lazy(() => import("@/pages/Symptoms"));
const IoTMonitorPage = lazy(() => import("@/pages/IoTMonitor"));
const EducationPage = lazy(() => import("@/pages/Education"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

// Protected Route компонент
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO: Проверка через useUserQuery из entities/user
  // Пока используем localStorage для проверки onboarding
  const onboardingComplete = localStorage.getItem("peribloom_profile")
    ? JSON.parse(localStorage.getItem("peribloom_profile") || "{}").onboardingComplete
    : false;

  return onboardingComplete ? <>{children}</> : <Navigate to="/" replace />;
};

// Layout с навигацией
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const onboardingComplete = localStorage.getItem("peribloom_profile")
    ? JSON.parse(localStorage.getItem("peribloom_profile") || "{}").onboardingComplete
    : false;

  return (
    <div className="pb-20 md:pb-0 md:pt-20">
      {onboardingComplete && <Navigation />}
      {children}
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <OnboardingPage />
      </AppLayout>
    ),
    // TODO: Добавить loader для prefetch данных
    // loader: async () => {
    //   // Prefetch user data if needed
    //   return null;
    // },
  },
  {
    path: "/dashboard",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/ai-chat",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <AIChatPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/symptoms",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <SymptomsPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/iot",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <IoTMonitorPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/education",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <EducationPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/settings",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

