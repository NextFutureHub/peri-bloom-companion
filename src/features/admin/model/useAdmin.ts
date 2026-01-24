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
  fetchAdminUserStatus,
  updateAdminUserStatus,
  fetchAdminEducationModules,
  fetchAdminEducationModuleById,
  createAdminEducationModule,
  updateAdminEducationModule,
  deleteAdminEducationModule,
  fetchAdminModuleLessons,
  fetchAdminLessonById,
  createAdminLesson,
  updateAdminLesson,
  deleteAdminLesson,
  type CreateLessonDto,
} from "@/shared/api/admin.client";
import type {
  DashboardResponseDto,
  UserListResponseDto,
  UserDetailResponseDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  UpdateUserStatusDto,
  StatusResponseDto,
  EducationModuleListResponseDto,
  EducationModuleDetailResponseDto,
  CreateEducationModuleDto,
  UpdateEducationModuleDto,
} from "@/shared/types/api/admin.dto";
import type { LessonDto } from "@/shared/types/api/education.dto";

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
    onSuccess: (deletedUser, deletedUserId) => {
      // Инвалидируем все запросы пользователей с любыми параметрами
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "admin" && query.queryKey[1] === "users";
        }
      });
      
      // Принудительно обновляем все активные запросы пользователей
      queryClient.refetchQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "admin" && 
                 query.queryKey[1] === "users" && 
                 query.state.status === "success";
        },
        type: "active"
      });

      // Удаляем из кеша конкретного пользователя
      queryClient.removeQueries({ 
        queryKey: QUERY_KEYS.admin.user(deletedUserId) 
      });
      
      // Также инвалидируем статус пользователя
      queryClient.removeQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === "admin" && 
                 query.queryKey[1] === "users" && 
                 query.queryKey[2] === deletedUserId;
        }
      });
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

export const useAdminUserStatus = (userId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.user(userId), 'status'],
    queryFn: () => fetchAdminUserStatus(userId),
    enabled: options?.enabled !== undefined ? options.enabled : !!userId,
  });
};

export const useUpdateAdminUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserStatusDto }) =>
      updateAdminUserStatus(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.admin.user(variables.userId), 'status'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users() });
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

// Lessons
export const useAdminModuleLessons = (moduleId: string, includeUnpublished: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.moduleLessons(moduleId),
    queryFn: () => fetchAdminModuleLessons(moduleId, includeUnpublished),
    enabled: !!moduleId,
  });
};

export const useAdminLesson = (lessonId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.lesson(lessonId),
    queryFn: () => fetchAdminLessonById(lessonId),
    enabled: !!lessonId,
  });
};

export const useCreateAdminLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminLesson,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.admin.moduleLessons(variables.moduleId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.admin.educationModule(variables.moduleId),
      });
    },
  });
};

export const useUpdateAdminLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: string; data: Partial<CreateLessonDto> }) =>
      updateAdminLesson(lessonId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.admin.lesson(variables.lessonId),
      });
      // Нужно получить moduleId из кеша или передать его
      // Пока инвалидируем все уроки модулей
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "admin" && 
                 query.queryKey[1] === "education" && 
                 query.queryKey[2] === "modules" &&
                 query.queryKey[4] === "lessons";
        }
      });
    },
  });
};

export const useDeleteAdminLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminLesson,
    onSuccess: () => {
      // Инвалидируем все запросы уроков модулей
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "admin" && 
                 query.queryKey[1] === "education" && 
                 query.queryKey[2] === "modules" &&
                 query.queryKey[4] === "lessons";
        }
      });
    },
  });
};

