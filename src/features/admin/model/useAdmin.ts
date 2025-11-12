import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/api/queryKeys";
import {
  fetchAdminDashboard,
  fetchAdminUsers,
  fetchAdminUserById,
  updateAdminUser,
  updateAdminUserRole,
  deleteAdminUser,
  restoreAdminUser,
  fetchAdminEducationModules,
  fetchAdminEducationModuleById,
  createAdminEducationModule,
  updateAdminEducationModule,
  deleteAdminEducationModule,
} from "@/shared/api/admin.client";
import type {
  DashboardResponseDto,
  UserListResponseDto,
  UserDetailResponseDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  EducationModuleListResponseDto,
  EducationModuleDetailResponseDto,
  CreateEducationModuleDto,
  UpdateEducationModuleDto,
} from "@/shared/types/api/admin.dto";

// Dashboard
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.dashboard(),
    queryFn: fetchAdminDashboard,
    staleTime: 1000 * 30, // 30 секунд
  });
};

// Users
export const useAdminUsers = (
  page: number = 1,
  limit: number = 20,
  search?: string,
  role?: string
) => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.users(page, limit, search, role),
    queryFn: () => fetchAdminUsers(page, limit, search, role),
  });
};

export const useAdminUser = (userId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.user(userId),
    queryFn: () => fetchAdminUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserDto }) =>
      updateAdminUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.user(variables.userId) });
    },
  });
};

export const useUpdateAdminUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRoleDto }) =>
      updateAdminUserRole(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.user(variables.userId) });
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users() });
    },
  });
};

export const useRestoreAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreAdminUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.user(userId) });
    },
  });
};

// Education
export const useAdminEducationModules = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.educationModules(page, limit),
    queryFn: () => fetchAdminEducationModules(page, limit),
  });
};

export const useAdminEducationModule = (moduleId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.educationModule(moduleId),
    queryFn: () => fetchAdminEducationModuleById(moduleId),
    enabled: options?.enabled !== undefined ? options.enabled : !!moduleId,
  });
};

export const useCreateAdminEducationModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminEducationModule,
    onSuccess: () => {
      // Инвалидируем все запросы модулей (с любыми параметрами пагинации)
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "admin" && 
                 query.queryKey[1] === "education" && 
                 query.queryKey[2] === "modules";
        }
      });
    },
  });
};

export const useUpdateAdminEducationModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, data }: { moduleId: string; data: UpdateEducationModuleDto }) =>
      updateAdminEducationModule(moduleId, data),
    onSuccess: (_, variables) => {
      // Инвалидируем все запросы модулей (с любыми параметрами пагинации)
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "admin" && 
                 query.queryKey[1] === "education" && 
                 query.queryKey[2] === "modules";
        }
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.admin.educationModule(variables.moduleId),
      });
    },
  });
};

export const useDeleteAdminEducationModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminEducationModule,
    onSuccess: () => {
      // Инвалидируем все запросы модулей (с любыми параметрами пагинации)
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "admin" && 
                 query.queryKey[1] === "education" && 
                 query.queryKey[2] === "modules";
        }
      });
    },
  });
};

