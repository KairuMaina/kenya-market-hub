
import { Home, ShoppingBag, User, ShoppingCart, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const AppSidebar = () => {
  const location = useLocation();

  const navigationItems = [
    { title: 'Home', url: '/', icon: Home },
    { title: 'Products', url: '/products', icon: ShoppingBag },
    { title: 'Cart', url: '/cart', icon: ShoppingCart },
    { title: 'Checkout', url: '/checkout', icon: ShoppingCart },
    { title: 'Admin', url: '/admin/login', icon: LogIn },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-3 px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SS</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Soko Smart</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
