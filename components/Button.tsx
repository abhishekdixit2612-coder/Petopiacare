import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'forest' | 'ghost' | 'danger' | 'ivory';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  children,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  // All buttons are pill-shaped per brand guidelines
  const base = 'inline-flex items-center justify-center gap-2 font-display font-bold rounded-full transition-all cursor-pointer border-none';

  const sizes = {
    small:  'h-[34px] px-4 text-[12px]',
    medium: 'h-11 px-5 text-[14px]',
    large:  'h-[54px] px-7 text-[16px]',
  };

  const variants = {
    primary:   'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-neutral-200 disabled:text-neutral-400',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-200',
    forest:    'bg-forest-500 text-white hover:bg-forest-600 active:bg-forest-700',
    ghost:     'bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200',
    danger:    'bg-error-500 text-white hover:bg-error-700',
    ivory:     'bg-neutral-50 text-forest-500 hover:bg-neutral-100 border border-neutral-200',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {icon && iconPosition === 'left' && !loading && icon}
      {children}
      {icon && iconPosition === 'right' && !loading && icon}
    </button>
  );
}

export default Button;
