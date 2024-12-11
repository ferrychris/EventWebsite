import React from 'react';
import { useLocation } from 'react-router-dom';
import Overview from '../../pages/venue/dashboard/Overview';
import UpcomingEvents from '../../pages/venue/dashboard/UpcomingEvents';
import BasicInfo from '../../pages/venue/profile/BasicInfo';

interface PageContentProps {
  section: string;
  tab: string;
}

export default function PageContent({ section, tab }: PageContentProps) {
  // Render the appropriate component based on section and tab
  const getContent = () => {
    switch (section) {
      case 'dashboard':
        switch (tab) {
          case 'overview':
            return <Overview />;
          case 'upcoming-events':
            return <UpcomingEvents />;
          default:
            return <Overview />;
        }
      case 'venue-profile':
        switch (tab) {
          case 'basic-info':
            return <BasicInfo />;
          default:
            return <BasicInfo />;
        }
      default:
        return <div>Content for {section} - {tab}</div>;
    }
  };

  return (
    <div className="min-h-[calc(100vh-8.5rem)]">
      {getContent()}
    </div>
  );
}