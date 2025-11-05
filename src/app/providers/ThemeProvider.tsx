import { ReactNode } from "react";

// Временная заглушка, так как next-themes может не быть установлен
// TODO: Установить next-themes если нужна поддержка тем
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

