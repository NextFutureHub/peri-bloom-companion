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

  // IoT Device queries
  devices: (userId?: string) => ["devices", userId ?? "me"] as const,
  device: (id: string) => ["device", id] as const,
  deviceMetrics: (deviceId: string) => ["device", "metrics", deviceId] as const,

  // Education queries
  education: (category?: string) => ["education", category ?? "all"] as const,
  educationArticle: (id: string) => ["education", "article", id] as const,
} as const;



