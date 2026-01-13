import { useState } from "react";
import { useAdminUsers, useDeleteAdminUser, useUpdateAdminUserRole, useAdminUserStatus, useUpdateAdminUserStatus } from "@/features/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/atoms/card";
import { Input } from "@/shared/ui/atoms/input";
import { Button } from "@/shared/ui/atoms/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/atoms/select";
import { Badge } from "@/shared/ui/atoms/badge";
import { Label } from "@/shared/ui/atoms/label";
import { Textarea } from "@/shared/ui/atoms/textarea";
import { Users, Search, Trash2, Edit, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";
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
import type { UserRole, TriageStatus } from "@/shared/types/api/admin.dto";
import { useTranslation } from "@/shared/hooks/useTranslation";

const STATUS_CONFIG: Record<TriageStatus, { label: string; color: string; icon: typeof AlertTriangle }> = {
  SAFE: { label: "Безопасно", color: "bg-green-500", icon: CheckCircle },
  ATTENTION: { label: "Внимание", color: "bg-amber-500", icon: Info },
  RISK: { label: "Риск", color: "bg-orange-500", icon: AlertTriangle },
  CRITICAL: { label: "Критично", color: "bg-red-600", icon: AlertCircle },
};

const AdminUsers = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const limit = 20;

  const { data, isLoading, error } = useAdminUsers(
    page,
    limit,
    search || undefined,
    roleFilter !== "all" ? roleFilter : undefined
  );

  const deleteMutation = useDeleteAdminUser();
  const updateRoleMutation = useUpdateAdminUserRole();
  const updateStatusMutation = useUpdateAdminUserStatus();

  // Загружаем статус для выбранного пользователя
  const { data: userStatus, isLoading: isStatusLoading } = useAdminUserStatus(
    selectedUserId || "",
    { enabled: !!selectedUserId && statusDialogOpen }
  );

  const [statusForm, setStatusForm] = useState<{
    manualStatus?: TriageStatus;
    criticalFlags: string;
    overrideNote: string;
  }>({
    manualStatus: undefined,
    criticalFlags: "",
    overrideNote: "",
  });

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

  const handleOpenStatusDialog = (userId: string) => {
    setSelectedUserId(userId);
    setStatusDialogOpen(true);
    // Сбрасываем форму
    setStatusForm({
      manualStatus: undefined,
      criticalFlags: "",
      overrideNote: "",
    });
  };

  const handleStatusUpdate = async () => {
    if (!selectedUserId) return;

    try {
      const criticalFlagsArray = statusForm.criticalFlags
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      await updateStatusMutation.mutateAsync({
        userId: selectedUserId,
        data: {
          manualStatus: statusForm.manualStatus,
          criticalFlags: criticalFlagsArray.length > 0 ? criticalFlagsArray : undefined,
          overrideNote: statusForm.overrideNote || undefined,
        },
      });

      toast.success("Статус успешно обновлён");
      setStatusDialogOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      toast.error("Ошибка при обновлении статуса");
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

  const getStatusBadge = (status: TriageStatus) => {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
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
                    <UserStatusRow
                      key={user.id}
                      user={user}
                      getRoleBadgeVariant={getRoleBadgeVariant}
                      getStatusBadge={getStatusBadge}
                      onRoleChange={handleRoleChange}
                      onDelete={handleDelete}
                      onOpenStatusDialog={handleOpenStatusDialog}
                      deleteMutationPending={deleteMutation.isPending}
                    />
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

        {/* Диалог редактирования статуса */}
        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Управление статусом пользователя</DialogTitle>
              <DialogDescription>
                Просмотр и изменение уровня тревожности пользователя
              </DialogDescription>
            </DialogHeader>

            {isStatusLoading ? (
              <div className="space-y-4 py-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : userStatus ? (
              <div className="space-y-6 py-4">
                {/* Текущий статус */}
                <div className="space-y-2">
                  <Label>Текущий статус</Label>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(userStatus.status)}
                    <span className="text-sm text-muted-foreground">
                      {userStatus.timeWindowLabel}
                    </span>
                  </div>
                  {userStatus.manualOverrideStatus && (
                    <p className="text-xs text-amber-600">
                      ⚠️ Ручной override активен: {STATUS_CONFIG[userStatus.manualOverrideStatus].label}
                    </p>
                  )}
                </div>

                {/* Детали статуса */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">HarmonyScore</Label>
                    <p className="text-sm font-medium">{getStatusBadge(userStatus.harmonyScoreStatus)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Симптомы</Label>
                    <p className="text-sm font-medium">{getStatusBadge(userStatus.symptomCriticalityStatus)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Тренд</Label>
                    <p className="text-sm font-medium">{getStatusBadge(userStatus.trendDeteriorationStatus)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Качество данных</Label>
                    <Badge variant={userStatus.dataQuality === "high" ? "default" : userStatus.dataQuality === "medium" ? "secondary" : "outline"}>
                      {userStatus.dataQuality}
                    </Badge>
                  </div>
                </div>

                {/* Причины */}
                {userStatus.reasons.length > 0 && (
                  <div className="space-y-2">
                    <Label>Причины (топ-2)</Label>
                    <div className="space-y-2">
                      {userStatus.reasons.slice(0, 2).map((reason, index) => (
                        <div key={reason.code || index} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={reason.severity === "high" ? "destructive" : reason.severity === "medium" ? "default" : "secondary"}>
                              {reason.severity}
                            </Badge>
                            <span className="text-sm font-medium">{reason.label}</span>
                          </div>
                          {reason.evidence.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {reason.evidence.map((evidence, evIndex) => (
                                <p key={evIndex} className="text-xs text-muted-foreground">
                                  {evidence.field}: {evidence.value}
                                  {evidence.window && ` (${evidence.window})`}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Форма изменения статуса */}
                <div className="space-y-4 border-t pt-4">
                  <Label className="text-base font-semibold">Изменить статус (Override)</Label>
                  
                  <div className="space-y-2">
                    <Label>Ручной статус</Label>
                    <Select
                      value={statusForm.manualStatus || "none"}
                      onValueChange={(value) =>
                        setStatusForm({
                          ...statusForm,
                          manualStatus: value === "none" ? undefined : (value as TriageStatus),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Не изменять" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Не изменять (автоматический)</SelectItem>
                        <SelectItem value="SAFE">SAFE - Безопасно</SelectItem>
                        <SelectItem value="ATTENTION">ATTENTION - Внимание</SelectItem>
                        <SelectItem value="RISK">RISK - Риск</SelectItem>
                        <SelectItem value="CRITICAL">CRITICAL - Критично</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Критические флаги (через запятую)</Label>
                    <Input
                      placeholder="critical, risk, emergency"
                      value={statusForm.criticalFlags}
                      onChange={(e) =>
                        setStatusForm({ ...statusForm, criticalFlags: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Флаги, которые влияют на финальный статус
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Примечание</Label>
                    <Textarea
                      placeholder="Причина изменения статуса..."
                      value={statusForm.overrideNote}
                      onChange={(e) =>
                        setStatusForm({ ...statusForm, overrideNote: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                Отмена
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

interface UserStatusRowProps {
  user: {
    id: string;
    email: string;
    role: UserRole;
    name?: string | null;
    lifeStage?: string | null;
  };
  getRoleBadgeVariant: (role: UserRole) => "destructive" | "default" | "secondary" | "outline";
  getStatusBadge: (status: TriageStatus) => JSX.Element;
  onRoleChange: (userId: string, role: UserRole) => void;
  onDelete: (userId: string) => void;
  onOpenStatusDialog: (userId: string) => void;
  deleteMutationPending: boolean;
}

const UserStatusRow: React.FC<UserStatusRowProps> = ({
  user,
  getRoleBadgeVariant,
  getStatusBadge,
  onRoleChange,
  onDelete,
  onOpenStatusDialog,
  deleteMutationPending,
}) => {
  const { t } = useTranslation();
  const { data: status, isLoading: isStatusLoading } = useAdminUserStatus(user.id);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="font-semibold">{user.email}</p>
          <Badge variant={getRoleBadgeVariant(user.role)}>
            {user.role}
          </Badge>
          {isStatusLoading ? (
            <Skeleton className="h-5 w-20" />
          ) : status ? (
            getStatusBadge(status.status)
          ) : null}
        </div>
        {user.name && (
          <p className="text-sm text-muted-foreground mt-1">{user.name}</p>
        )}
        {user.lifeStage && (
          <p className="text-xs text-muted-foreground mt-1">
            Этап: {user.lifeStage}
          </p>
        )}
        {status && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Окно: {status.timeWindowLabel}</span>
            {status.dataQuality !== "high" && (
              <Badge variant="outline" className="text-xs">
                Данные: {status.dataQuality}
              </Badge>
            )}
          </div>
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
                onValueChange={(value) => onRoleChange(user.id, value as UserRole)}
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
          variant="outline"
          size="sm"
          onClick={() => onOpenStatusDialog(user.id)}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Статус
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(user.id)}
          disabled={deleteMutationPending}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t("admin.users.delete")}
        </Button>
      </div>
    </div>
  );
};

export default AdminUsers;
