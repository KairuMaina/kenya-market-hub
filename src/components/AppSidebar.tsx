
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import SidebarSection from './sidebar/SidebarSection';
import { useSidebarLogic } from './sidebar/useSidebarLogic';
import {
  mainMenuItems,
  serviceItems,
  shopMenuItems,
  ridesMenuItems,
  servicesMenuItems,
  realEstateMenuItems,
  accountMenuItems,
  adminItems,
} from './sidebar/menuItems';

const AppSidebar = () => {
  const { user, isAdmin } = useAuth();
  const {
    isOnShopSection,
    isOnRidesSection,
    isOnServicesSection,
    isOnRealEstateSection,
    getShopSectionIsActive,
    getServiceSectionIsActive,
  } = useSidebarLogic();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold text-gray-900">Soko Smart</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarSection title="Main" items={mainMenuItems} />

        <SidebarSection 
          title="Services" 
          items={serviceItems}
          isActive={(path) => getServiceSectionIsActive(path, path)}
        />

        {isOnShopSection && (
          <SidebarSection 
            title="Shop" 
            items={shopMenuItems}
            isActive={getShopSectionIsActive}
          />
        )}

        {isOnRidesSection && (
          <SidebarSection title="Rides" items={ridesMenuItems} />
        )}

        {isOnServicesSection && (
          <SidebarSection title="Services" items={servicesMenuItems} />
        )}

        {isOnRealEstateSection && (
          <SidebarSection title="Real Estate" items={realEstateMenuItems} />
        )}

        {user && (
          <SidebarSection title="Account" items={accountMenuItems} />
        )}

        {isAdmin && (
          <SidebarSection title="Admin" items={adminItems} />
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
