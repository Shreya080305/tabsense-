import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

/**
 * Reusable Button UI component.
 * Supports different size metrics, style variants, and native loading states.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          // Variant mappings
          {
            "bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700 shadow-lg shadow-brand-600/15": variant === 'primary',
            "bg-dark-800 text-dark-100 hover:bg-dark-700 border border-dark-700/80 active:bg-dark-600": variant === 'secondary',
            "bg-transparent text-dark-200 border border-dark-700 hover:bg-dark-800 hover:text-dark-100": variant === 'outline',
            "bg-transparent text-dark-400 hover:bg-dark-800 hover:text-dark-100": variant === 'ghost',
            "bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-950/30 hover:border-red-900 hover:text-red-300": variant === 'danger',
          },
          // Size mappings
          {
            "px-3 py-1.5 text-xs": size === 'sm',
            "px-4 py-2 text-sm": size === 'md',
            "px-5 py-2.5 text-base": size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
