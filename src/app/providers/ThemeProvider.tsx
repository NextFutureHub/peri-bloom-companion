import { ReactNode, useEffect } from "react";
import { useThemeManager } from "@/shared/hooks/use-theme-manager";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Используем хук для управления темой
  // Статус можно передать позже, когда будет доступен
  useThemeManager();

  return <>{children}</>;
};

