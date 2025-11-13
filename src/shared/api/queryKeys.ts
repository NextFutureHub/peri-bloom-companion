/**
 * Централизованные ключи запросов для React Query
 * Используются для кеширования и инвалидации данных
 */

export const QUERY_KEYS = {
  // User queries
  user: (id?: string) => ["user", id ?? "me"] as const,
  userProfile: (userId?: string) => ["user", "profile", userId ?? "me"] as const,

  // Auth queries
  auth: {
    me: () => ["auth", "me"] as const,
  },

  // Symptoms queries
  symptoms: (userId?: string) => ["symptoms", userId ?? "me"] as const,
  symptom: (id: string) => ["symptom", id] as const,

  // AI Chat queries
  aiMessages: (conversationId?: string) => ["aiMessages", conversationId ?? "default"] as const,
  aiConversations: () => ["aiConversations"] as const,
  aiChatSession: () => ["aiChat", "session"] as const,

  // IoT Device queries
  devices: (userId?: string) => ["devices", userId ?? "me"] as const,
  device: (id: string) => ["device", id] as const,
  deviceMetrics: (deviceId: string) => ["device", "metrics", deviceId] as const,

  // Education queries
  educationModules: (filters?: unknown) => ["education", "modules", filters ?? {}] as const,
  educationModule: (id: string) => ["education", "modules", id] as const,
  educationModuleLessons: (moduleId: string) => ["education", "modules", moduleId, "lessons"] as const,
  educationModuleProgress: (moduleId: string) => ["education", "modules", moduleId, "progress"] as const,

  // Admin queries
  admin: {
    dashboard: () => ["admin", "dashboard"] as const,
    users: (page?: number, limit?: number, search?: string, role?: string) =>
      ["admin", "users", page, limit, search, role] as const,
    user: (id: string) => ["admin", "users", id] as const,
    educationModules: (page?: number, limit?: number) =>
      ["admin", "education", "modules", page, limit] as const,
    educationModule: (id: string) => ["admin", "education", "modules", id] as const,
    moduleLessons: (moduleId: string) => ["admin", "education", "modules", moduleId, "lessons"] as const,
    lesson: (id: string) => ["admin", "education", "lessons", id] as const,
  },

  // Bloom queries
  bloom: {
    history: (userId?: string, page?: number, pageSize?: number) =>
      ["bloom", "history", userId ?? "me", page ?? 1, pageSize ?? 3] as const,
    insight: (userId?: string) => ["bloom", "insight", userId ?? "me"] as const,
    achievements: (userId?: string) => ["bloom", "achievements", userId ?? "me"] as const,
  },
} as const;




