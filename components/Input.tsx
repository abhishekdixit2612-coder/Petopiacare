import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  helperText,
  error = false,
  errorMessage,
  icon,
  disabled = false,
  className = '',
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-body-md font-medium text-neutral-900 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{icon}</div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full h-10 px-3 py-2 rounded-md
            font-body text-body-md transition-all
            ${icon ? 'pl-10' : ''}
            ${
              error
                ? 'border-2 border-error-500 bg-error-50 text-error-700 focus:outline-none focus:ring-2 focus:ring-error-100'
                : 'border border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400 focus:border-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100'
            }
            ${disabled ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : ''}
            ${className}
          `}
        />
      </div>

      {error && errorMessage && (
        <p className="mt-2 text-body-sm text-error-700">{errorMessage}</p>
      )}

      {helperText && !error && (
        <p className="mt-2 text-body-sm text-neutral-600">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
