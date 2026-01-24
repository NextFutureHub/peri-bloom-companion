import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, LogOut, Settings, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokenStorage } from "@/shared/api/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navItems = [
    { path: "/admin", label: t("admin.layout.dashboard"), icon: LayoutDashboard },
    { path: "/admin/analytics", label: t("admin.layout.analytics"), icon: BarChart3 },
    { path: "/admin/users", label: t("admin.layout.users"), icon: Users },
    { path: "/admin/education", label: t("admin.layout.education"), icon: BookOpen },
  ];

  const handleLogout = () => {
    tokenStorage.clearAll();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r shadow-soft z-50">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-primary">{t("admin.layout.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("admin.layout.subtitle")}</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t space-y-2">
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">{t("admin.layout.settings")}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t("admin.layout.logout")}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64">{children}</main>
    </div>
  );
};

export default AdminLayout;

