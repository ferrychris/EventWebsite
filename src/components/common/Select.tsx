import React from 'react';
import { ChevronDown } from 'lucide-react';

// In src/components/common/Select.tsx
interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  className = '',
  style,
}: SelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          appearance-none glass-input text-sm rounded-lg px-3 py-1.5 pr-8
          focus:outline-none focus:ring-2 focus:border-transparent
          ${className}
        `}
        style={style}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
