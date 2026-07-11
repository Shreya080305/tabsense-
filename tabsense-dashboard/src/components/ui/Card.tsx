import React, { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

/**
 * Reusable Card Container.
 * Promotes standard borders, backgrounds, paddings, and hover shadows.
 */
export const Card: React.FC<CardProps> = ({ className, hoverable = false, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-dark-800/80 bg-dark-900/40 p-6 backdrop-blur-md",
        {
          "transition-all duration-300 hover:border-brand-500/25 hover:bg-dark-900/60 hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-0.5": hoverable,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
