import { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { LanguageProvider } from "./LanguageProvider";
import { TooltipProvider } from "@/shared/ui/atoms/tooltip";
import { Toaster } from "@/shared/ui/atoms/toaster";
import { Toaster as Sonner } from "@/shared/ui/atoms/sonner";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

