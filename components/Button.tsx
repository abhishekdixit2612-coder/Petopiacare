import React from 'react';
import { designTokens } from '@/lib/design-tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  state?: 'default' | 'hover' | 'active' | 'disabled' | 'loading';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'medium',
  state = 'default',
  icon,
  iconPosition = 'left',
  children,
  onClick,
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const baseStyles =
    'font-medium transition-all cursor-pointer flex items-center justify-center gap-2 rounded-md';

  const sizeClasses = {
    small: 'h-9 px-3 text-sm',
    medium: 'h-11 px-4 text-base',
    large: 'h-[52px] px-6 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-neutral-300',
    secondary:
      'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 disabled:bg-neutral-300 border border-neutral-300',
    ghost:
      'bg-transparent text-primary-500 hover:bg-primary-50 border border-primary-300 active:bg-primary-100',
    danger:
      'bg-error-500 text-white hover:bg-error-700 active:bg-error-800 disabled:bg-neutral-300',
    success:
      'bg-success-500 text-white hover:bg-success-700 active:bg-success-800 disabled:bg-neutral-300',
  };

  const stateClasses = {
    default: '',
    hover: 'shadow-md',
    active: 'shadow-sm scale-[0.98]',
    disabled: 'opacity-40 cursor-not-allowed',
    loading: 'opacity-60 cursor-not-allowed',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${sizeClasses[size]} ${variantClasses[variant]} ${
        stateClasses[state]
      } ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      style={{ transition: designTokens.transitions.base }}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      )}
      {icon && iconPosition === 'left' && !loading && icon}
      {children}
      {icon && iconPosition === 'right' && !loading && icon}
    </button>
  );
}

export default Button;
