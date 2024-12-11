import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
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

export interface ActionButton {
  icon: LucideIcon;
  label: string;
}