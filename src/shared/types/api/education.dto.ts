export type EducationCategory =
  | "pregnancy"
  | "postpartum"
  | "childcare"
  | "nutrition"
  | "emotional_health"
  | "partnership"
  | "early_development"
  | "breastfeeding"
  | "postpartum_recovery"
  | "newborn_care";

export type EducationDifficulty = "easy" | "medium" | "hard";
export type EducationType = "video" | "text" | "mixed" | "interactive" | "webinar";
export type EducationStage = "pregnancy" | "postpartum" | "childcare" | "all";
export type LessonContentType = "video" | "article" | "podcast" | "pdf" | "checklist" | "interactive";
export type ResourceType = "video" | "article" | "pdf" | "image" | "audio" | "link" | "checklist";
export type LanguageCode = "ru" | "kk" | "en";

export interface EducationModuleDto {
  id: string;
  title: string;
  description: string;
  goal?: string | null;
  category: EducationCategory;
  difficulty: EducationDifficulty;
  type: EducationType;
  stage: EducationStage;
  language: LanguageCode;
  durationMin: number;
  thumbnailUrl?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  lessonsCount?: number;
  userProgress?: number;
}

export interface LessonResourceDto {
  id: string;
  type: ResourceType;
  title: string;
  url: string;
  description?: string | null;
  durationMin?: number | null;
  order: number;
}

export interface LessonDto {
  id: string;
  moduleId: string;
  title: string;
  description?: string | null;
  contentType: LessonContentType;
  order: number;
  durationMin?: number | null;
  videoUrl?: string | null;
  content?: string | null;
  transcript?: string | null;
  thumbnailUrl?: string | null;
  estimatedReadTime?: number | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  resources?: LessonResourceDto[];
}

export interface EducationModuleFilters {
  category?: EducationCategory;
  stage?: EducationStage;
  difficulty?: EducationDifficulty;
  language?: LanguageCode;
  isPublished?: boolean;
  isFeatured?: boolean;
}

export interface EducationModuleProgressDto {
  progressPercent: number;
  completedLessons: string[];
  completedQuizzes: string[];
  totalLessons: number;
  score: number | null;
  lastAccessed?: string;
  completedAt?: string | null;
}
