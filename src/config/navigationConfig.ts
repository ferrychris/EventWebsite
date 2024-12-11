import { 
  Home, 
  Building2, 
  Heart, 
  BookOpen, 
  Bot, 
  Briefcase, 
  Store, 
  HelpCircle,
  Settings
} from 'lucide-react';
import type { MenuSection } from '../types/navigation';

export const menuItems: MenuSection = {
  main: [
    { 
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/venue/dashboard'
    },
    { 
      id: 'venue-profile',
      label: 'Venue Profile',
      icon: Building2,
      path: '/venue/profile'
    },
    { 
      id: 'events-clients',
      label: 'Events & Clients',
      icon: Heart,
      path: '/venue/events',
      isProFeature: true
    },
    { 
      id: 'education',
      label: 'Education & Resources',
      icon: BookOpen,
      path: '/venue/education'
    }
  ],
  other: [
    { 
      id: 'audits',
      label: 'Audits & Insights',
      icon: Bot,
      path: '/venue/audits'
    },
    { 
      id: 'services',
      label: 'Services & Upgrades',
      icon: Briefcase,
      path: '/venue/services'
    },
    { 
      id: 'store',
      label: 'Store & Inventory',
      icon: Store,
      path: '/venue/store',
      isProFeature: true
    },
    { 
      id: 'support',
      label: 'Support & Community',
      icon: HelpCircle,
      path: '/venue/support'
    }
  ],
  settings: [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/venue/settings'
    }
  ]
};

export const sectionTabs = {
  dashboard: [
    { id: 'overview', label: 'Overview' },
    { id: 'upcoming-events', label: 'Upcoming Events' }
  ],
  'venue-profile': [
    { id: 'basic-info', label: 'Basic Info' },
    { id: 'features', label: 'Features & Amenities' },
    { id: 'photos', label: 'Photo Gallery' },
    { id: 'pricing', label: 'Pricing & Packages' }
  ],
  'events-clients': [
    { id: 'client-management', label: 'Client Management' },
    { id: 'documents', label: 'Documents & Portal' },
    { id: 'guest-management', label: 'Guest Management' },
    { id: 'automated-emails', label: 'Automated Emails' },
    { id: 'vendor-management', label: 'Vendor Management' }
  ],
  'education': [
    { id: 'calendar', label: 'Calendar' },
    { id: 'webinars', label: 'Webinars' },
    { id: 'resources', label: "Didi's Resources" },
    { id: 'community', label: 'Venue Community' },
    { id: 'blogging', label: 'Blogging Group' }
  ],
  'audits': [
    { id: 'website-audit', label: 'Website Audit' },
    { id: 'seo-audit', label: 'SEO Audit' },
    { id: 'market-insights', label: 'Market Insights' }
  ],
  'services': [
    { id: 'upgrade', label: 'Upgrade to Pro' },
    { id: 'paid-services', label: 'Paid Services' }
  ],
  'store': [
    { id: 'online-store', label: 'Online Store' },
    { id: 'decor-inventory', label: 'Decor Inventory' }
  ],
  'support': [
    { id: 'facebook-group', label: 'Facebook Group' },
    { id: 'help-center', label: 'Help Center' }
  ],
  'settings': [
    { id: 'account', label: 'Account Settings' },
    { id: 'theme', label: 'Theme' }
  ]
} as const;