import {
  Home,
  MessageCircle,
  FileText,
  BookOpen,
  Settings,
  Activity,
  Heart,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/**
 * Маппинг строковых имен иконок на компоненты Lucide React
 */
export const iconMap: Record<string, LucideIcon> = {
  Home,
  MessageCircle,
  FileText,
  BookOpen,
  Settings,
  Activity,
  Heart,
  Users,
  Sparkles,
};

/**
 * Получить компонент иконки по имени
 */
export const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Home; // Fallback на Home если иконка не найдена
};

