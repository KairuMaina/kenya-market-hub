
import React from 'react';
import { 
  Calendar, 
  BarChart3, 
  Settings, 
  User, 
  Home,
  Wrench
} from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import SidebarSection from '../sidebar/SidebarSection';

const ServicesSidebar = () => {
  const mainItems = [
    { icon: Home, label: 'Dashboard', path: '/services-app' },
    { icon: Calendar, label: 'Bookings', path: '/services-app/bookings' },
    { icon: BarChart3, label: 'Analytics', path: '/services-app/analytics' },
  ];

  const accountItems = [
    { icon: User, label: 'Profile', path: '/services-app/profile' },
    { icon: Settings, label: 'Settings', path: '/services-app/settings' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Services</h1>
            <p className="text-xs text-gray-600">Service Provider Hub</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarSection title="Main" items={mainItems} />
        <SidebarSection title="Account" items={accountItems} />
      </SidebarContent>
    </Sidebar>
  );
};

export default ServicesSidebar;
