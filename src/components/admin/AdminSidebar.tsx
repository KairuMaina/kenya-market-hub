import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Building, 
  Car, 
  Briefcase,
  BarChart3,
  Settings,
  FileText,
  DollarSign,
  Store,
  UserCheck,
  Eye,
  Bell,
  Truck,
  MessageSquare,
  Calendar,
  HeartPulse,
  Shield
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Overview',
      items: [
        { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
        { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
        { title: 'Reports', url: '/admin/reports', icon: FileText },
      ]
    },
    {
      title: 'User Management',
      items: [
        { title: 'Users', url: '/admin/users', icon: Users },
        { title: 'Vendors', url: '/admin/vendors', icon: Store },
        { title: 'Drivers', url: '/admin/drivers', icon: Truck },
      ]
    },
    {
      title: 'E-commerce',
      items: [
        { title: 'Products', url: '/admin/products', icon: Package },
        { title: 'Orders', url: '/admin/orders', icon: ShoppingCart },
      ]
    },
    {
      title: 'Real Estate',
      items: [
        { title: 'Properties', url: '/admin/properties', icon: Building },
        { title: 'Agents', url: '/admin/agents', icon: UserCheck },
        { title: 'Inquiries', url: '/admin/property-inquiries', icon: MessageSquare },
        { title: 'Viewings', url: '/admin/property-viewings', icon: Eye },
      ]
    },
    {
      title: 'Transportation',
      items: [
        { title: 'Rides', url: '/admin/rides', icon: Car },
        { title: 'Pricing', url: '/admin/ride-pricing', icon: DollarSign },
      ]
    },
    {
      title: 'Services',
      items: [
        { title: 'Service Providers', url: '/admin/service-providers', icon: Briefcase },
        { title: 'Service Bookings', url: '/admin/service-bookings', icon: Calendar },
      ]
    },
    {
      title: 'Medical',
      items: [
        { title: 'Medical Mgmt', url: '/admin/medical', icon: HeartPulse },
      ]
    },
    {
      title: 'Insurance',
      items: [
        { title: 'Insurance Hub', url: '/admin/insurance', icon: Shield },
      ]
    },
    {
      title: 'System',
      items: [
        { title: 'Notifications', url: '/admin/notifications', icon: Bell },
        { title: 'Settings', url: '/admin/settings', icon: Settings },
      ]
    }
  ];

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-600">Management Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        {menuSections.map((section, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = location.pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        className="w-full relative"
                        isActive={isActive}
                        onClick={() => handleNavigation(item.url)}
                      >
                        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
                          <item.icon className="h-4 w-4" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="text-xs text-gray-500 text-center">
          © 2025 Soko Smart by Milleast.tech
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
