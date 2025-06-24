
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UnifiedCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const StatsCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}> = ({ title, value, subtitle, icon, trend, className }) => (
  <Card className={cn(
    "bg-white shadow-md hover:shadow-lg transition-all duration-200",
    "border border-gray-200 rounded-xl",
    className
  )}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "text-sm font-medium mt-2",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
            <div className="text-white">
              {icon}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export const ContentCard: React.FC<UnifiedCardProps> = ({ 
  children, className, title, subtitle, actions 
}) => (
  <Card className={cn(
    "bg-white shadow-md hover:shadow-lg transition-all duration-200",
    "border border-gray-200 rounded-xl",
    className
  )}>
    {(title || actions) && (
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            {title && <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </CardHeader>
    )}
    <CardContent className={title || actions ? "pt-0" : "p-6"}>
      {children}
    </CardContent>
  </Card>
);

export const ListCard: React.FC<{
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    avatar?: string;
    badge?: string;
    actions?: React.ReactNode;
  }>;
  className?: string;
}> = ({ items, className }) => (
  <ContentCard className={className}>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div 
          key={item.id} 
          className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            "hover:bg-gray-50 transition-colors",
            index < items.length - 1 && "border-b border-gray-100"
          )}
        >
          <div className="flex items-center space-x-3">
            {item.avatar && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {item.title.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{item.title}</p>
              {item.subtitle && (
                <p className="text-sm text-gray-600">{item.subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {item.badge && (
              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                {item.badge}
              </span>
            )}
            {item.actions}
          </div>
        </div>
      ))}
    </div>
  </ContentCard>
);
