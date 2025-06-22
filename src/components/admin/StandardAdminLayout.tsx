
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/ui/responsive-container';
import { cn } from '@/lib/utils';

interface StandardAdminLayoutProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  stats?: Array<{
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  children: React.ReactNode;
  loading?: boolean;
}

export const StandardAdminLayout: React.FC<StandardAdminLayoutProps> = ({
  title,
  description,
  actions,
  stats,
  children,
  loading
}) => {
  return (
    <ResponsiveContainer className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex flex-col sm:flex-row gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* Stats Section */}
      {stats && stats.length > 0 && (
        <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 4 }}>
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  {stat.change && (
                    <Badge 
                      variant={stat.trend === 'up' ? 'default' : stat.trend === 'down' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </ResponsiveGrid>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading...</span>
            </CardContent>
          </Card>
        ) : (
          children
        )}
      </div>
    </ResponsiveContainer>
  );
};
