import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import type { TabItem } from '../../../types/navigation';

interface TabNavProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  return (
    <div className="flex space-x-4 overflow-x-auto">
      {tabs.map((tab) => (
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
  );
}