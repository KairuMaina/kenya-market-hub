
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import PropertyOwnerSidebar from '@/components/sidebars/PropertyOwnerSidebar';

interface PropertyOwnerLayoutProps {
  children: React.ReactNode;
}

const PropertyOwnerLayout: React.FC<PropertyOwnerLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <PropertyOwnerSidebar />
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PropertyOwnerLayout;
