import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  isProFeature?: boolean;
}

export interface MenuSection {
  main: MenuItem[];
  other: MenuItem[];
}

export interface TabItem {
  id: string;
  label: string;
}

export interface SectionTabs {
  [key: string]: TabItem[];
}

export interface StatChange {
  value: string;
  positive: boolean;
}

export interface ActionButton {
  icon: React.ElementType;
  label: string;
}