import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  showHelp?: boolean;
}

export default function Card({ 
  title, 
  children, 
  className = '',
  showHelp = true 
}: CardProps) {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  return (
    <div className={`glass-card rounded-2xl p-6 group ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div 
            className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg
              group-hover:bg-opacity-50 transition-colors"
            style={{ 
              '--hover-bg-color': `${primaryColor}10`,
              backgroundColor: 'var(--hover-bg-color)'
            } as React.CSSProperties}
          >
            <h3 
              className="text-sm font-medium group-hover:text-current transition-colors"
              style={{ 
                '--hover-text-color': primaryColor,
                color: 'rgb(71 85 105)'
              } as React.CSSProperties}
            >
              {title}
            </h3>
            {showHelp && (
              <HelpCircle 
                className="w-4 h-4 text-slate-400 group-hover:text-current transition-colors"
                style={{ '--hover-text-color': primaryColor }}
              />
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}