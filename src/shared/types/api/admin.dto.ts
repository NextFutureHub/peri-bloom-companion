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

// Status types
export type TriageStatus = "SAFE" | "ATTENTION" | "RISK" | "CRITICAL";
export type ActionType = "primary" | "secondary" | "link";
export type ReasonSeverity = "low" | "medium" | "high";
export type DataQuality = "high" | "medium" | "low";
export type StatusChange = "up" | "down" | "same";

export interface StatusReasonEvidenceDto {
  field: string;
  value: string;
  window?: string;
}

export interface StatusReasonDto {
  code: string;
  label: string;
  severity: ReasonSeverity;
  evidence: StatusReasonEvidenceDto[];
  rank: number;
}

export interface StatusActionDto {
  id: string;
  label: string;
  type: ActionType;
  route?: string;
  deeplink?: string;
  requiresPaywall?: boolean;
  analyticsEvent: string;
  priority: number;
}

export interface StatusResponseDto {
  status: TriageStatus;
  harmonyScoreStatus: TriageStatus;
  symptomCriticalityStatus: TriageStatus;
  trendDeteriorationStatus: TriageStatus;
  manualOverrideStatus: TriageStatus | null;
  reasons: StatusReasonDto[];
  nextBestActions: StatusActionDto[];
  dataQuality: DataQuality;
  missingSignals?: string[];
  timeWindowLabel: string;
  statusChange?: StatusChange;
  changeReasons?: StatusReasonDto[];
  timestamp: string;
}

export interface UpdateUserStatusDto {
  manualStatus?: TriageStatus;
  criticalFlags?: string[];
  overrideNote?: string;
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

