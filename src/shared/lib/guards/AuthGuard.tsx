import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserQuery } from "@/entities/user";
import { ErrorBoundary } from "@/shared/lib/errorBoundary";
import { tokenStorage } from "@/shared/api/client";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Guard компонент для защиты маршрутов, требующих авторизации
 * Проверяет наличие пользователя и статус onboarding
 */
export const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const accessToken = tokenStorage.getAccessToken();
  const { data: user, isLoading, isError } = useUserQuery("profile");

  // Если нет токена, редиректим на главную
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/" replace />;
  }

  // Проверяем статус onboarding - профиль должен быть заполнен
  const onboardingComplete = user.profile?.lifeStage !== null && user.profile?.lifeStage !== undefined;

  if (!onboardingComplete) {
    return <Navigate to="/" replace />;
  }

  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};


