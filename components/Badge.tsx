import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'forest' | 'gold' | 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'surface';
  size?: 'small' | 'medium';
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'primary',
  size = 'medium',
  icon,
  children,
  className = '',
}: BadgeProps) {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-700',
    forest:  'bg-forest-50 text-forest-500',
    gold:    'bg-secondary-100 text-secondary-700',
    success: 'bg-success-100 text-success-700',
    error:   'bg-error-100 text-error-700',
    warning: 'bg-warning-100 text-warning-700',
    info:    'bg-info-100 text-info-700',
    neutral: 'bg-neutral-100 text-neutral-600',
    surface: 'bg-neutral-100 text-neutral-600',
  };

  const sizeClasses = {
    small:  'px-2.5 py-0.5 text-[10px] rounded-full font-bold tracking-wide uppercase',
    medium: 'px-3 py-1 text-[11px] rounded-full font-bold tracking-wide uppercase',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-display ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon && icon}
      {children}
    </span>
  );
}

export default Badge;
