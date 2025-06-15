
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import DriverSidebar from '@/components/sidebars/DriverSidebar';

interface DriverLayoutProps {
  children: React.ReactNode;
}

const DriverLayout: React.FC<DriverLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DriverSidebar />
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DriverLayout;
