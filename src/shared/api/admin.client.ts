import { api } from "./client";
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
import type { LessonDto, LessonContentType } from "@/shared/types/api/education.dto";

export interface CreateLessonDto {
  moduleId: string;
  title: string;
  description?: string;
  contentType: LessonContentType;
  order: number;
  durationMin?: number;
  videoUrl?: string;
  content?: string;
  transcript?: string;
  thumbnailUrl?: string;
  estimatedReadTime?: number;
  isPublished?: boolean;
}

/**
 * API клиент для админ-панели
 */

// Dashboard
export const fetchAdminDashboard = async (): Promise<DashboardResponseDto> => {
  const response = await api.get<DashboardResponseDto>("/admin/dashboard");
  return response.data;
};

// Users
export const fetchAdminUsers = async (
  page: number = 1,
  limit: number = 20,
  search?: string,
  role?: string
): Promise<UserListResponseDto> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (search) params.append("search", search);
  if (role) params.append("role", role);

  const response = await api.get<UserListResponseDto>(`/admin/users?${params.toString()}`);
  return response.data;
};

export const fetchAdminUserById = async (userId: string): Promise<UserDetailResponseDto> => {
  const response = await api.get<UserDetailResponseDto>(`/admin/users/${userId}`);
  return response.data;
};

export const updateAdminUser = async (
  userId: string,
  data: UpdateUserDto
): Promise<UserDetailResponseDto> => {
  const response = await api.patch<UserDetailResponseDto>(`/admin/users/${userId}`, data);
  return response.data;
};

export const updateAdminUserRole = async (
  userId: string,
  data: UpdateUserRoleDto
): Promise<UserDetailResponseDto> => {
  const response = await api.patch<UserDetailResponseDto>(`/admin/users/${userId}/role`, data);
  return response.data;
};

export const deleteAdminUser = async (userId: string): Promise<void> => {
  await api.delete(`/admin/users/${userId}`);
};

export const restoreAdminUser = async (userId: string): Promise<UserDetailResponseDto> => {
  const response = await api.post<UserDetailResponseDto>(`/admin/users/${userId}/restore`);
  return response.data;
};

export const fetchAdminUserStatus = async (userId: string): Promise<StatusResponseDto> => {
  const response = await api.get<StatusResponseDto>(`/admin/users/${userId}/status`);
  return response.data;
};

export const updateAdminUserStatus = async (
  userId: string,
  data: UpdateUserStatusDto
): Promise<StatusResponseDto> => {
  const response = await api.patch<StatusResponseDto>(`/admin/users/${userId}/status`, data);
  return response.data;
};

// Education
export const fetchAdminEducationModules = async (
  page: number = 1,
  limit: number = 20
): Promise<EducationModuleListResponseDto> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await api.get<EducationModuleListResponseDto>(
    `/admin/education/modules?${params.toString()}`
  );
  return response.data;
};

export const fetchAdminEducationModuleById = async (
  moduleId: string
): Promise<EducationModuleDetailResponseDto> => {
  const response = await api.get<EducationModuleDetailResponseDto>(
    `/admin/education/modules/${moduleId}`
  );
  return response.data;
};

export const createAdminEducationModule = async (
  data: CreateEducationModuleDto
): Promise<EducationModuleDetailResponseDto> => {
  const response = await api.post<EducationModuleDetailResponseDto>(
    "/admin/education/modules",
    data
  );
  return response.data;
};

export const updateAdminEducationModule = async (
  moduleId: string,
  data: UpdateEducationModuleDto
): Promise<EducationModuleDetailResponseDto> => {
  const response = await api.patch<EducationModuleDetailResponseDto>(
    `/admin/education/modules/${moduleId}`,
    data
  );
  return response.data;
};

export const deleteAdminEducationModule = async (moduleId: string): Promise<void> => {
  await api.delete(`/admin/education/modules/${moduleId}`);
};

// Lessons
export const fetchAdminModuleLessons = async (
  moduleId: string,
  includeUnpublished: boolean = true
): Promise<LessonDto[]> => {
  const params = new URLSearchParams();
  if (includeUnpublished) params.append("includeUnpublished", "true");

  const response = await api.get<LessonDto[]>(
    `/admin/education/modules/${moduleId}/lessons?${params.toString()}`
  );
  return response.data;
};

export const fetchAdminLessonById = async (lessonId: string): Promise<LessonDto> => {
  const response = await api.get<LessonDto>(`/admin/education/lessons/${lessonId}`);
  return response.data;
};

export const createAdminLesson = async (data: CreateLessonDto): Promise<LessonDto> => {
  const response = await api.post<LessonDto>("/admin/education/lessons", data);
  return response.data;
};

export const updateAdminLesson = async (
  lessonId: string,
  data: Partial<CreateLessonDto>
): Promise<LessonDto> => {
  const response = await api.patch<LessonDto>(`/admin/education/lessons/${lessonId}`, data);
  return response.data;
};

export const deleteAdminLesson = async (lessonId: string): Promise<void> => {
  await api.delete(`/admin/education/lessons/${lessonId}`);
};

