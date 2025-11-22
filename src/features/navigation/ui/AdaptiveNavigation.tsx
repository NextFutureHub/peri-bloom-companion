import { memo, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigationConfig } from "../model/useNavigation";
import { getIcon } from "../lib/iconMap";
import { getNavTranslationKey } from "../lib/navTranslation";
import { cn } from "@/shared/lib/utils";
import { useTranslation } from "@/shared/hooks/useTranslation";

export const AdaptiveNavigation = memo(() => {
  const location = useLocation();
  const { t } = useTranslation();
  const { data: config, isLoading } = useNavigationConfig();

  const visibleItems = useMemo(() => {
    if (!config?.items) return [];
    return config.items.filter((item) => item.visible).slice(0, 5); // Максимум 5 элементов
  }, [config?.items]);

  if (isLoading) {
    return null; // Или скелетон загрузки
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t md:top-0 md:bottom-auto md:border-b shadow-soft z-50">
        <div className="max-w-6xl mx-auto flex justify-around md:justify-center md:gap-8 py-3 px-4">
          {visibleItems.map((item) => {
            const Icon = getIcon(item.icon);
            const isActive = location.pathname === item.route || location.pathname.startsWith(item.route + "/");
            const translatedLabel = t(getNavTranslationKey(item));
            
            return (
              <Link
                key={item.id}
                to={item.route}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-lg transition-smooth relative",
                  isActive
                    ? "text-primary gradient-primary/10"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs md:text-sm font-medium">{translatedLabel}</span>
                {item.aiRecommended && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
});

AdaptiveNavigation.displayName = "AdaptiveNavigation";

