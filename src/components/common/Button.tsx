interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  customColor?: string;
}

// In src/components/common/Button.tsx
export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  customColor,
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-medium transition-colors rounded-lg 
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  // Updated Button component for outline variant
  if (variant === 'outline' && customColor) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
        ${baseClasses}
        ${sizes[size]}
        border border-gray-200
        transition-all duration-200
        hover:border-[var(--hover-border-color)]
        hover:bg-[var(--hover-bg-color)]
        hover:text-[var(--hover-text-color)]
        ${className}
      `}
        style={
          {
            '--hover-border-color': customColor,
            '--hover-bg-color': `${customColor}10`,
            '--hover-text-color': customColor,
          } as React.CSSProperties
        }
      >
        {Icon && <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />}
        {children}
      </button>
    );
  }

  // For primary variant with custom color
  if (variant === 'primary' && customColor) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          ${baseClasses}
          ${sizes[size]}
          text-white
          transition-opacity duration-200
          hover:opacity-90
          ${className}
        `}
        style={{ backgroundColor: customColor }}
      >
        {Icon && <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />}
        {children}
      </button>
    );
  }

  // Default variants using Tailwind classes
  const variants = {
    primary: 'bg-teal-500 hover:bg-teal-600 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    outline:
      'border border-gray-200 hover:border-teal-200 hover:bg-teal-50 text-gray-600 hover:text-teal-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />}
      {children}
    </button>
  );
}
