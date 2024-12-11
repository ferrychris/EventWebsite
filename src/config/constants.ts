import { 
  Home, 
  Building2, 
  Heart, 
  BookOpen, 
  Bot, 
  Briefcase, 
  Store, 
  HelpCircle, 
  Settings, 
  Plus, 
  Upload, 
  Calendar, 
  Search, 
  FileText 
} from 'lucide-react';
import type { MenuSection, ActionButton } from '../types/common';

export const MENU_ITEMS: MenuSection = {
  main: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'venue-profile', label: 'Venue Profile' },
    { id: 'events-clients', label: 'Events & Clients', isProFeature: true },
    { id: 'education', label: 'Education & Resources' }
  ],
  other: [
    { id: 'audits', label: 'Audits & Insights' },
    { id: 'services', label: 'Services & Upgrades' },
    { id: 'store', label: 'Store & Inventory', isProFeature: true },
    { id: 'support', label: 'Support & Community' }
  ]
};

export const SECTION_ICONS: Record<string, React.ElementType> = {
  dashboard: Home,
  'venue-profile': Building2,
  'events-clients': Heart,
  education: BookOpen,
  audits: Bot,
  services: Briefcase,
  store: Store,
  support: HelpCircle,
  settings: Settings
};

export const ACTION_BUTTONS: Record<string, ActionButton> = {
  dashboard: { icon: Plus, label: 'Add Widget' },
  'venue-profile': { icon: Upload, label: 'Update Profile' },
  'events-clients': { icon: Calendar, label: 'Create Event' },
  education: { icon: Calendar, label: 'Schedule Session' },
  audits: { icon: Search, label: 'Run Audit' },
  services: { icon: Plus, label: 'Add Service' },
  store: { icon: Plus, label: 'Add Product' },
  support: { icon: FileText, label: 'Submit Ticket' },
  settings: { icon: Settings, label: 'Save Changes' }
};