/**
 * DTO для админ-панели
 */

// Dashboard
export interface DashboardStatsDto {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  activeChats: number;
  onlineDevices: number;
  offlineDevices: number;
  completedModules: number;
  incidents: number;
}

export interface DashboardResponseDto {
  stats: DashboardStatsDto;
  generatedAt: string;
}

// Users
export type UserRole = "user" | "expert" | "admin" | "super_admin";

export interface UserListItemDto {
  id: string;
  email: string;
  role: UserRole;
  name?: string | null;
  lifeStage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponseDto {
  users: UserListItemDto[];
  total: number;
  page: number;
  limit: number;
}

export interface UserProfileDetailDto {
  id: string;
  userId: string;
  lifeStage: string;
  name?: string | null;
  language: string;
  dateOfBirth?: string | null;
  estimatedDueDate?: string | null;
  deliveryDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetailResponseDto {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfileDetailDto | null;
}

export interface UpdateUserDto {
  role?: UserRole;
  name?: string;
  isActive?: boolean;
}

export interface UpdateUserRoleDto {
  role: UserRole;
}

// Education
export interface EducationModuleListItemDto {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  type: string;
  stage: string;
  language: string;
  durationMin: number;
  thumbnailUrl?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  lessonsCount: number;
  progressCount: number;
}

export interface EducationModuleListResponseDto {
  modules: EducationModuleListItemDto[];
  total: number;
  page: number;
  limit: number;
}

export interface EducationModuleDetailResponseDto {
  id: string;
  title: string;
  description: string;
  goal?: string | null;
  category: string;
  difficulty: string;
  type: string;
  stage: string;
  language: string;
  durationMin: number;
  thumbnailUrl?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  lessons?: any[];
  lessonsCount: number;
  progressCount: number;
}

export interface CreateEducationModuleDto {
  title: string;
  description: string;
  goal?: string;
  category: string;
  difficulty: string;
  type: string;
  stage: string;
  language?: string;
  durationMin: number;
  thumbnailUrl?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  order?: number;
}

export interface UpdateEducationModuleDto {
  title?: string;
  description?: string;
  goal?: string;
  category?: string;
  difficulty?: string;
  type?: string;
  stage?: string;
  language?: string;
  durationMin?: number;
  thumbnailUrl?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  order?: number;
}

