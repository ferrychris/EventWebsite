import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import Sidebar from './Sidebar';
import Header from './Header';
import { sectionTabs } from '../../../config/navigationConfig';

Import all page components
import Overview from '../../../pages/venue/dashboard/Overview';
import UpcomingEvents from '../../../pages/venue/dashboard/UpcomingEvents';
import BasicInfo from '../../../pages/venue/profile/BasicInfo';
import Features from '../../../pages/venue/profile/Features';
import Photos from '../../../pages/venue/profile/Photos';
import Pricing from '../../../pages/venue/profile/Pricing';
import ClientManagement from '../../../pages/venue/events/ClientManagement';
import Documents from '../../../pages/venue/events/Documents';
import GuestManagement from '../../../pages/venue/events/GuestManagement';
import AutomatedEmails from '../../../pages/venue/events/AutomatedEmails';
import VendorManagement from '../../../pages/venue/events/VendorManagement';
import Calendar from '../../../pages/venue/education/Calendar';
import Webinars from '../../../pages/venue/education/Webinars';
import Resources from '../../../pages/venue/education/Resources';
import Community from '../../../pages/venue/education/Community';
import Blogging from '../../../pages/venue/education/Blogging';
import WebsiteAudit from '../../../pages/venue/audits/WebsiteAudit';
import SeoAudit from '../../../pages/venue/audits/SeoAudit';
import MarketInsights from '../../../pages/venue/audits/MarketInsights';
import Upgrade from '../../../pages/venue/services/Upgrade';
import PaidServices from '../../../pages/venue/services/PaidServices';
import OnlineStore from '../../../pages/venue/store/OnlineStore';
import DecorInventory from '../../../pages/venue/store/DecorInventory';
import FacebookGroup from '../../../pages/venue/support/FacebookGroup';
import HelpCenter from '../../../pages/venue/support/HelpCenter';
import Account from '../../../pages/venue/settings/Account';
import Theme from '../../../pages/venue/settings/Theme';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  // Get current section from path
  const getCurrentSection = () => {
    const path = location.pathname.split('/')[2];
    switch (path) {
      case 'dashboard':
        return 'dashboard';
      case 'profile':
        return 'venue-profile';
      case 'events':
        return 'events-clients';
      case 'education':
        return 'education';
      case 'audits':
        return 'audits';
      case 'services':
        return 'services';
      case 'store':
        return 'store';
      case 'support':
        return 'support';
      case 'settings':
        return 'settings';
      default:
        return 'dashboard';
    }
  };

  // Get current tab from path or default to first tab
  const getCurrentTab = () => {
    const section = getCurrentSection();
    const tabs = sectionTabs[section];
    if (!tabs) return '';

    const path = location.pathname.split('/');
    return path.length > 3 ? path[3] : tabs[0].id;
  };

  // Get section title
  const getSectionTitle = () => {
    const section = getCurrentSection();
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      'venue-profile': 'Venue Profile',
      'events-clients': 'Events & Clients',
      education: 'Education & Resources',
      audits: 'Audits & Insights',
      services: 'Services & Upgrades',
      store: 'Store & Inventory',
      support: 'Support & Community',
      settings: 'Settings'
    };
    return titles[section] || 'Dashboard';
  };

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    const section = getCurrentSection();
    const searchParams = new URLSearchParams(location.search);
    const venueId = searchParams.get('id');

    // Map section to URL path
    const sectionPaths: Record<string, string> = {
      dashboard: 'dashboard',
      'venue-profile': 'profile',
      'events-clients': 'events',
      education: 'education',
      audits: 'audits',
      services: 'services',
      store: 'store',
      support: 'support',
      settings: 'settings'
    };

    const basePath = `/venue/${sectionPaths[section]}`;
    const newPath = tabId === sectionTabs[section][0].id ? basePath : `${basePath}/${tabId}`;
    navigate(venueId ? `${newPath}?id=${venueId}` : newPath);
  };

  // Render content based on current route
  const renderContent = () => {
    const section = getCurrentSection();
    const tab = getCurrentTab();

    // Map routes to components
    const routeMap: Record<string, Record<string, React.ComponentType>> = {
      dashboard: {
        overview: Overview,
        'upcoming-events': UpcomingEvents
      },
      'venue-profile': {
        'basic-info': BasicInfo,
        features: Features,
        photos: Photos,
        pricing: Pricing
      },
      'events-clients': {
        'client-management': ClientManagement,
        documents: Documents,
        'guest-management': GuestManagement,
        'automated-emails': AutomatedEmails,
        'vendor-management': VendorManagement
      },
      education: {
        calendar: Calendar,
        webinars: Webinars,
        resources: Resources,
        community: Community,
        blogging: Blogging
      },
      audits: {
        'website-audit': WebsiteAudit,
        'seo-audit': SeoAudit,
        'market-insights': MarketInsights
      },
      services: {
        upgrade: Upgrade,
        'paid-services': PaidServices
      },
      store: {
        'online-store': OnlineStore,
        'decor-inventory': DecorInventory
      },
      support: {
        'facebook-group': FacebookGroup,
        'help-center': HelpCenter
      },
      settings: {
        account: Account,
        theme: Theme
      }
    };

    // Check if the tab exists in the route map, otherwise return null or fallback component
    const Component = routeMap[section]?.[tab] || null;
    if (!Component) {
      console.error(`No component found for section: ${section}, tab: ${tab}`);
      return <div>Error: Page not found.</div>;
    }
    return <Component />;
  };

  const currentSection = getCurrentSection();
  const currentTab = getCurrentTab();
  const currentTabs = sectionTabs[currentSection] || [];

  return (
    <div className="flex min-h-screen w-full">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white shadow-lg"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          {/* Header */}
          <Header 
            title={getSectionTitle()}
            onMenuClick={() => setIsSidebarOpen(true)}
          />

          {/* Tab Navigation */}
          {currentTabs.length > 0 && (
            <div className="border-b border-gray-200">
              <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                <div className="flex">
                  {currentTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        currentTab === tab.id
                          ? 'border-current text-current'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                      style={{ 
                        color: currentTab === tab.id ? primaryColor : undefined,
                        borderColor: currentTab === tab.id ? primaryColor : undefined
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Page Content */}
        <div className="flex-1 bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
