import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full glass-input rounded-lg px-4 py-2.5
            border border-gray-300 
            focus:ring-2 focus:border-transparent
            ${error ? 'border-red-300' : ''}
            ${className}
          `}
          style={{ 
            '--tw-ring-color': primaryColor,
            '--tw-ring-opacity': 0.2
          } as React.CSSProperties}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;