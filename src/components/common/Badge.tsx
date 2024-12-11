import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ 
  variant = 'info', 
  children, 
  className = '' 
}: BadgeProps) {
  const variants = {
    success: 'bg-teal-50 text-teal-700',
    error: 'bg-red-50 text-red-700',
    warning: 'bg-amber-50 text-amber-700',
    info: 'bg-slate-50 text-slate-700'
  };

  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}