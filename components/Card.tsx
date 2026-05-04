import React from 'react';
import { designTokens } from '@/lib/design-tokens';

interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled' | 'ghost';
  image?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Card({
  variant = 'elevated',
  image,
  title,
  description,
  footer,
  children,
  onClick,
  className = '',
}: CardProps) {
  const variantClasses = {
    elevated: 'bg-white shadow-md hover:shadow-lg border-0',
    outlined: 'bg-white shadow-none border border-neutral-200 hover:border-neutral-300 hover:shadow-sm',
    filled: 'bg-neutral-50 shadow-none border-0 hover:bg-neutral-100',
    ghost: 'bg-transparent shadow-none border border-dashed border-neutral-300 hover:border-primary-300 hover:bg-primary-50',
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-lg p-4 md:p-5
        transition-all
        ${variantClasses[variant]}
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${className}
      `}
      style={{ transition: designTokens.transitions.base }}
    >
      {image && (
        <div className="mb-4 rounded-lg overflow-hidden h-48 md:h-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {title && (
        <h3 className="text-heading-md font-display text-neutral-900 mb-2">{title}</h3>
      )}

      {description && (
        <p className="text-body-md text-neutral-600 mb-4">{description}</p>
      )}

      {children}

      {footer && <div className="mt-4 pt-4 border-t border-neutral-200">{footer}</div>}
    </div>
  );
}

export default Card;
