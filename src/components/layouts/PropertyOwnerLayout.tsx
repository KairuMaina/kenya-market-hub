
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';
import PropertyOwnerSidebar from '../sidebars/PropertyOwnerSidebar';
import UserNav from '../UserNav';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface PropertyOwnerLayoutProps {
  children: React.ReactNode;
}

const PropertyOwnerLayout = ({ children }: PropertyOwnerLayoutProps) => {
  const isOnline = useOnlineStatus();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-green-50">
        <PropertyOwnerSidebar />
        <main className="flex-1">
          <div className="sticky top-0 z-40 flex items-center justify-between border-b border-green-200 bg-white px-3 sm:px-6 py-3 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-4">
              <SidebarTrigger className="hover:bg-green-50 hover:text-green-600" />
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xs sm:text-sm">P</span>
                </div>
                <div>
                  <h1 className="text-sm sm:text-lg font-bold text-gray-900">Property Management</h1>
                  <p className="text-xs text-gray-600">Real Estate Portal</p>
                </div>
              </div>
            </div>
            <UserNav />
          </div>
          
          {!isOnline && (
            <Alert className="m-4 border-yellow-200 bg-yellow-50">
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                You're currently offline. Some features may not be available.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="p-2 sm:p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PropertyOwnerLayout;
