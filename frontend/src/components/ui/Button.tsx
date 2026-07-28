import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98] rounded-button select-none';

  const variantStyles = {
    // Prohibited: System default bootstrap blue. Use brand earthy Ihram brown #6B4F3B
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-premium hover:shadow-premium-hover',
    secondary: 'bg-[#EDE7DE] text-ink hover:bg-[#E3DCD1]',
    outline: 'border border-[#C2B5A7] text-ink hover:bg-[#F5F0EA]',
    gold: 'bg-[#C9A227] hover:bg-[#B38F1F] text-white shadow-premium hover:shadow-premium-hover font-semibold',
    ghost: 'bg-transparent hover:bg-black/5 text-ink',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${disabled || isLoading ? 'opacity-60 pointer-events-none' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
