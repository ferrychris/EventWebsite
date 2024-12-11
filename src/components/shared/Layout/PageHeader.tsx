import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { sectionTabs } from '../../../config/navigationConfig';
import { ACTION_BUTTONS } from '../../../config/constants';

interface PageHeaderProps {
  activeSection: keyof typeof sectionTabs;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function PageHeader({ activeSection, activeTab, onTabChange }: PageHeaderProps) {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);
  const currentTabs = sectionTabs[activeSection] || [];

  const getActionButton = () => {
    const button = ACTION_BUTTONS[activeSection];
    if (!button) return null;

    const Icon = button.icon;
    
    return (
      <button 
        className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
        style={{ backgroundColor: primaryColor }}
      >
        <Icon size={16} />
        <span>{button.label}</span>
      </button>
    );
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
        <div className="flex items-center">
          <div className="flex-1">
            {currentTabs.length > 0 && (
              <div className="flex space-x-4 overflow-x-auto">
                {currentTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-current text-current'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    style={{ color: activeTab === tab.id ? primaryColor : undefined }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {getActionButton()}
        </div>
      </div>
    </div>
  );
}