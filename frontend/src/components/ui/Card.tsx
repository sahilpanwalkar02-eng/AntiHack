import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?: 'blue' | 'teal' | 'red' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  glow = 'none',
  className,
  ...props
}) => {
  const glowStyles = {
    none: '',
    blue: 'hover:border-blue-500/50 hover:shadow-cyber-glow',
    teal: 'hover:border-teal-500/50 hover:shadow-accent-glow',
    red: 'hover:border-red-500/50 hover:shadow-danger-glow',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'glass-card rounded-2xl p-6 transition-all duration-300',
          hoverable && 'glass-card-hover cursor-pointer',
          glowStyles[glow],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
