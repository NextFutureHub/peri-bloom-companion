import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, ReactNode } from "react";
import { Navigation } from "@/widgets/header";
import { AuthGuard } from "@/shared/lib/guards";
import { ErrorBoundary } from "@/shared/lib/errorBoundary";

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

