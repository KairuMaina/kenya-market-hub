
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResponsiveAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export const ResponsiveAuthLayout: React.FC<ResponsiveAuthLayoutProps> = ({
  children,
  title,
  description,
  className
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className={cn(
          "shadow-xl border-0",
          "backdrop-blur-sm bg-white/95",
          className
        )}>
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-base text-gray-600">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
