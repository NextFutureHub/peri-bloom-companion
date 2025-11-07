import { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { LanguageProvider } from "./LanguageProvider";
import { AppProvider } from "@/contexts/AppContext";
import { TooltipProvider } from "@/shared/ui/atoms/tooltip";
import { Toaster } from "@/shared/ui/atoms/toaster";
import { Toaster as Sonner } from "@/shared/ui/atoms/sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "@/shared/lib/errorBoundary";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AppProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                {children}
                {import.meta.env.DEV && (
                  <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
                )}
              </TooltipProvider>
            </AppProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};

