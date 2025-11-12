import { useState } from "react";
import { useAdminUsers, useDeleteAdminUser, useUpdateAdminUserRole } from "@/features/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Input } from "@/shared/ui/atoms/input";
import { Button } from "@/shared/ui/atoms/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/select";
import { Badge } from "@/shared/ui/atoms/badge";
import { Users, Search, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/shared/ui/atoms/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/atoms/dialog";
import type { UserRole } from "@/shared/types/api/admin.dto";
import { useTranslation } from "@/shared/hooks/useTranslation";

const AdminUsers = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const limit = 20;

  const { data, isLoading, error } = useAdminUsers(
    page,
    limit,
    search || undefined,
    roleFilter !== "all" ? roleFilter : undefined
  );

  const deleteMutation = useDeleteAdminUser();
  const updateRoleMutation = useUpdateAdminUserRole();

  const handleDelete = async (userId: string) => {
    if (confirm(t("admin.users.deleteConfirm"))) {
      try {
        await deleteMutation.mutateAsync(userId);
        toast.success(t("admin.users.deleteSuccess"));
      } catch (error) {
        toast.error(t("admin.users.deleteError"));
      }
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateRoleMutation.mutateAsync({ userId, data: { role: newRole } });
      toast.success(t("admin.users.roleChangeSuccess"));
    } catch (error) {
      toast.error(t("admin.users.roleChangeError"));
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        return "destructive";
      case "admin":
        return "default";
      case "expert":
        return "secondary";
      default:
        return "outline";
    }
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="min-h-[calc(100dvh-5rem)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Users className="w-8 h-8" />
            {t("admin.users.title")}
          </h1>
          <p className="text-muted-foreground">{t("admin.users.description")}</p>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>{t("admin.users.filters")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={t("admin.users.searchPlaceholder")}
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="min-w-[200px]">
                <Select value={roleFilter} onValueChange={(value) => {
                  setRoleFilter(value);
                  setPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.users.allRoles")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("admin.users.allRoles")}</SelectItem>
                    <SelectItem value="user">{t("admin.users.user")}</SelectItem>
                    <SelectItem value="expert">{t("admin.users.expert")}</SelectItem>
                    <SelectItem value="admin">{t("admin.users.admin")}</SelectItem>
                    <SelectItem value="super_admin">{t("admin.users.superAdmin")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>
              Пользователи ({data?.total ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">
                {t("admin.users.errorLoading")}
              </div>
            ) : !data || data.users.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t("admin.users.noUsers")}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {data.users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold">{user.email}</p>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </div>
                        {user.name && (
                          <p className="text-sm text-muted-foreground mt-1">{user.name}</p>
                        )}
                        {user.lifeStage && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Этап: {user.lifeStage}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-2" />
                              {t("admin.users.changeRole")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t("admin.users.changeRole")}</DialogTitle>
                              <DialogDescription>
                                {t("admin.users.selectRoleFor")} {user.email}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <Select
                                defaultValue={user.role}
                                onValueChange={(value) =>
                                  handleRoleChange(user.id, value as UserRole)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">{t("admin.users.user")}</SelectItem>
                                  <SelectItem value="expert">{t("admin.users.expert")}</SelectItem>
                                  <SelectItem value="admin">{t("admin.users.admin")}</SelectItem>
                                  <SelectItem value="super_admin">{t("admin.users.superAdmin")}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t("admin.users.delete")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                      {t("admin.users.page")} {page} {t("admin.users.of")} {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        {t("admin.users.previous")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        {t("admin.users.next")}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;

