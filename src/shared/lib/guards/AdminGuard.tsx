import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserQuery } from "@/entities/user";
import { ErrorBoundary } from "@/shared/lib/errorBoundary";
import { tokenStorage } from "@/shared/api/client";

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Guard компонент для защиты админ-маршрутов
 * Проверяет наличие пользователя и роль администратора
 */
export const AdminGuard = ({ children, fallback }: AdminGuardProps) => {
  const accessToken = tokenStorage.getAccessToken();
  const { data: user, isLoading, isError } = useUserQuery("profile", {
    enabled: !!accessToken,
  });

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

  // Проверяем роль пользователя - должен быть admin или super_admin
  const isAdmin = user.role === "admin" || user.role === "super_admin";

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещён</h1>
          <p className="text-muted-foreground mb-4">
            У вас нет прав для доступа к админ-панели
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};

