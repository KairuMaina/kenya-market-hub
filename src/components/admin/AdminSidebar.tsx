
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  ClipboardList,
  Store,
  Car,
  Wrench,
  Building,
  Route,
  Stethoscope,
  BarChart3,
  Settings,
  UserCheck,
  Building2,
  Bell,
  Briefcase,
  Shield,
  UtensilsCrossed,
  Calendar,
  FileText
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === `/admin${path}`;
  };

  const handleNavigation = (path: string) => {
    navigate(`/admin${path}`);
  };

  const mainItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: ShoppingBag, label: 'Products', path: '/products' },
    { icon: ClipboardList, label: 'Orders', path: '/orders' }
  ];

  const businessItems = [
    { icon: Store, label: 'Vendors', path: '/vendors' },
    { icon: Car, label: 'Drivers', path: '/drivers' },
    { icon: Wrench, label: 'Service Providers', path: '/service-providers' },
    { icon: Building2, label: 'Employers', path: '/employers' },
    { icon: UserCheck, label: 'Agents', path: '/agents' }
  ];

  const servicesItems = [
    { icon: Route, label: 'Rides', path: '/rides' },
    { icon: Wrench, label: 'Service Bookings', path: '/service-bookings' },
    { icon: Building, label: 'Properties', path: '/properties' },
    { icon: Stethoscope, label: 'Medical', path: '/medical' },
    { icon: Shield, label: 'Insurance', path: '/insurance' },
    { icon: UtensilsCrossed, label: 'Food Delivery', path: '/food-delivery' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Briefcase, label: 'Job Board', path: '/jobs' }
  ];

  const systemItems = [
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const SidebarSection = ({ title, items }: { title: string; items: any[] }) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-orange-600 font-semibold">{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                onClick={() => handleNavigation(item.path)}
                isActive={isActive(item.path)}
                className={`hover:bg-orange-50 hover:text-orange-700 ${
                  isActive(item.path) ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500' : ''
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar variant="inset" className="border-r border-orange-200 bg-white">
      <SidebarHeader className="border-b border-orange-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-600">Soko Smart</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarSection title="Main" items={mainItems} />
        <SidebarSection title="Business Partners" items={businessItems} />
        <SidebarSection title="Services & Modules" items={servicesItems} />
        <SidebarSection title="System" items={systemItems} />
      </SidebarContent>

      <SidebarFooter className="border-t border-orange-200 p-4">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Soko Smart Admin
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
