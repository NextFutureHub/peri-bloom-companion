export type NavigationCategory = "core" | "optional" | "contextual";

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  visible: boolean;
  category: NavigationCategory;
  aiRecommended?: boolean;
}

export interface NavigationConfig {
  userId: string;
  items: NavigationItem[];
  updatedAt: string;
}

export interface UpdateNavigationConfigDto {
  items: NavigationItem[];
}

