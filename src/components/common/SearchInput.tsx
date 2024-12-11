import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
  className = ''
}: SearchInputProps) {
  return (
    <div className="relative group">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`
          pl-10 pr-4 py-2.5 glass-input rounded-xl w-full
          focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 
          transition-all duration-300 bg-gray-50 group-hover:bg-white
          group-hover:shadow-lg group-hover:border-transparent
          ${className}
        `}
      />
      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3 
        transition-colors group-hover:text-teal-500" />
    </div>
  );
}