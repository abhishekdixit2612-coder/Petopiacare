import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
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
    secondary: 'bg-secondary-100 text-secondary-700',
    success: 'bg-success-100 text-success-700',
    error: 'bg-error-100 text-error-700',
    warning: 'bg-warning-100 text-warning-700',
    info: 'bg-info-100 text-info-700',
    neutral: 'bg-neutral-100 text-neutral-700',
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-label-sm rounded-md',
    medium: 'px-3 py-1.5 text-label rounded-full',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon && icon}
      {children}
    </span>
  );
}

export default Badge;
