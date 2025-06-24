
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsivePageProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsivePage: React.FC<ResponsivePageProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "min-h-screen w-full max-w-none overflow-x-hidden",
      "px-4 sm:px-6 lg:px-8",
      "py-4 sm:py-6 lg:py-8",
      className
    )}>
      {children}
    </div>
  );
};

export const ResponsiveSection: React.FC<ResponsivePageProps> = ({ children, className }) => {
  return (
    <section className={cn(
      "w-full mb-6 sm:mb-8 lg:mb-12",
      className
    )}>
      {children}
    </section>
  );
};

export const ResponsiveButtonGroup: React.FC<ResponsivePageProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "flex flex-col gap-3 sm:flex-row sm:gap-4",
      "sm:flex-wrap sm:items-center",
      "w-full overflow-x-auto",
      className
    )}>
      {children}
    </div>
  );
};

export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  cols?: number;
  className?: string;
}> = ({ children, cols = 1, className }) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2", 
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  };

  return (
    <div className={cn(
      "grid gap-4 sm:gap-6",
      gridCols[cols as keyof typeof gridCols] || gridCols[1],
      className
    )}>
      {children}
    </div>
  );
};

export const MobileScrollContainer: React.FC<ResponsivePageProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "flex gap-3 overflow-x-auto pb-2",
      "scrollbar-hide", // Custom class for hiding scrollbars
      "sm:grid sm:grid-cols-2 sm:overflow-visible",
      "lg:grid-cols-3 xl:grid-cols-4",
      className
    )}>
      {children}
    </div>
  );
};
