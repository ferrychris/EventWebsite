import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { menuItems } from '../../../config/navigationConfig';
import { supabase } from '../../../config/supabase';
import type { Venue } from '../../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavItem = ({ icon: Icon, label, isActive, isProFeature, onClick }: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  isProFeature?: boolean;
  onClick: () => void;
}) => {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left relative transition-colors
        ${isActive 
          ? 'text-slate-800 font-medium before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r' 
          : 'hover:bg-gray-50 text-gray-600'}
        ${isProFeature ? 'opacity-75' : ''}`}
      style={{
        backgroundColor: isActive ? `${primaryColor}10` : undefined,
        '--before-bg': primaryColor,
        '--before-opacity': isActive ? '1' : '0'
      } as React.CSSProperties}
    >
      <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r transition-opacity"
        style={{ 
          backgroundColor: primaryColor,
          opacity: isActive ? 1 : 0
        }} 
      />
      <Icon size={20} className={isActive ? 'text-current' : 'text-gray-400'} 
        style={{ color: isActive ? primaryColor : undefined }} 
      />
      <span className="flex-grow">{label}</span>
      {isProFeature && <Crown size={16} className="text-amber-400" />}
    </button>
  );
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const venueId = searchParams.get('id');
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);
  const [venueName, setVenueName] = useState<string>('');

  useEffect(() => {
    async function fetchVenueName() {
      if (!venueId) return;

      try {
        const { data, error } = await supabase
          .from('venues')
          .select('name')
          .eq('id', venueId)
          .single();

        if (error) throw error;
        if (data) {
          setVenueName(data.name);
        }
      } catch (err) {
        console.error('Error fetching venue name:', err);
      }
    }

    fetchVenueName();
  }, [venueId]);

  const getCurrentSection = () => {
    const path = location.pathname.split('/')[2];
    switch (path) {
      case 'dashboard': return 'dashboard';
      case 'profile': return 'venue-profile';
      case 'events': return 'events-clients';
      case 'education': return 'education';
      case 'audits': return 'audits';
      case 'services': return 'services';
      case 'store': return 'store';
      case 'support': return 'support';
      case 'settings': return 'settings';
      default: return 'dashboard';
    }
  };

  const handleNavigation = (path: string) => {
    navigate(venueId ? `${path}?id=${venueId}` : path);
    onClose();
  };

  const currentSection = getCurrentSection();

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 
      transform transition-transform duration-300 ease-in-out lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-50">
          <div className="flex flex-col items-center text-center mb-3">
            <div className="w-20 h-20 mb-3 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=80&h=80&fit=crop&crop=faces,center"
                alt={venueName}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-semibold text-2xl heading-font">{venueName}</h1>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
          <button 
            className="w-full flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            <Crown className="w-4 h-4" />
            <span>Upgrade to Pro</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="mb-6">
              <h3 className="px-4 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Main Menu
              </h3>
              {menuItems.main.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={currentSection === item.id}
                  isProFeature={item.isProFeature}
                  onClick={() => handleNavigation(item.path)}
                />
              ))}
            </div>

            <div className="mb-6">
              <h3 className="px-4 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Other
              </h3>
              {menuItems.other.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={currentSection === item.id}
                  isProFeature={item.isProFeature}
                  onClick={() => handleNavigation(item.path)}
                />
              ))}
            </div>
          </nav>

          <div className="border-t border-gray-50 p-2 mt-auto">
            {menuItems.settings.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={currentSection === item.id}
                onClick={() => handleNavigation(item.path)}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}