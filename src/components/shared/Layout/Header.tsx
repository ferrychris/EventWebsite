import React from 'react';
import { Search, Bell, Facebook, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-[1440px] mx-auto h-16 px-4 lg:px-8 flex items-center">
        <div className="flex items-center gap-8 flex-1 mr-8">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-display text-slate-800">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="relative group hidden lg:block">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-64 
                focus:outline-none focus:ring-2 focus:border-transparent 
                transition-all duration-300 bg-gray-50 group-hover:bg-white
                group-hover:shadow-lg group-hover:border-transparent"
              style={{ 
                '--tw-ring-color': primaryColor,
                '--tw-ring-opacity': 0.2
              } as React.CSSProperties}
            />
            <Search 
              className="w-5 h-5 text-gray-400 absolute left-3 top-3 
                transition-colors group-hover:text-current"
              style={{ color: primaryColor }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              className="p-2.5 rounded-xl transition-colors relative hover:bg-opacity-10"
              style={{ 
                '&:hover': {
                  backgroundColor: `${primaryColor}10`
                }
              } as React.CSSProperties}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span 
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
            </button>
            <a 
              href="#" 
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl border 
                transition-all duration-300 text-sm"
              style={{ 
                color: primaryColor,
                borderColor: `${primaryColor}40`,
                backgroundColor: `${primaryColor}10`,
                '&:hover': {
                  backgroundColor: `${primaryColor}20`,
                  borderColor: primaryColor
                }
              } as React.CSSProperties}
            >
              <Facebook size={16} />
              <span>Join the Facebook Community</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}