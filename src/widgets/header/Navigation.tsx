import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { Home, MessageCircle, FileText, Activity, BookOpen, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export const Navigation = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: "/dashboard", label: t("nav.dashboard"), icon: Home },
    { path: "/ai-chat", label: t("nav.aiChat"), icon: MessageCircle },
    { path: "/symptoms", label: t("nav.symptoms"), icon: FileText },
    { path: "/iot", label: t("nav.iot"), icon: Activity },
    { path: "/education", label: t("nav.education"), icon: BookOpen },
    { path: "/settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t md:top-0 md:bottom-auto md:border-b shadow-soft z-50">
      <div className="max-w-6xl mx-auto flex justify-around md:justify-center md:gap-8 py-3 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-lg transition-smooth",
                isActive
                  ? "text-primary gradient-primary/10"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};



