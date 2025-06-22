
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      "w-full max-w-7xl mx-auto",
      "px-4 sm:px-6 lg:px-8",
      "py-4 sm:py-6 lg:py-8",
      className
    )}>
      {children}
    </div>
  );
};

export const MobileOptimizedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border",
      "p-4 sm:p-6",
      "space-y-4 sm:space-y-6",
      "mb-4 sm:mb-6",
      className
    )}>
      {children}
    </div>
  );
};

export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}> = ({ children, cols = { default: 1 }, className }) => {
  const gridCols = cn(
    `grid gap-4 sm:gap-6`,
    `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    className
  );
  
  return (
    <div className={gridCols}>
      {children}
    </div>
  );
};
