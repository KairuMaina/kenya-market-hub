
import React from 'react';
import { Home, Package, ShoppingCart, Heart, User, Settings, BarChart3, Car, Wrench, Building } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import CartQuantityBadge from './CartQuantityBadge';

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const mainMenuItems = [
    { icon: Home, label: 'Home', path: '/' },
  ];

  const serviceItems = [
    { icon: Package, label: 'Shop', path: '/shop' },
    { icon: Car, label: 'Rides', path: '/rides' },
    { icon: Wrench, label: 'Services', path: '/services' },
    { icon: Building, label: 'Real Estate', path: '/real-estate' },
  ];

  const shopMenuItems = [
    { icon: Package, label: 'Products', path: '/products' },
    { 
      icon: ShoppingCart, 
      label: 'Cart', 
      path: '/cart',
      hasQuantityBadge: true
    },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
  ];

  const adminItems = [
    { icon: BarChart3, label: 'Admin Dashboard', path: '/admin' },
    { icon: Package, label: 'Manage Products', path: '/admin/products' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Determine which menu items to show based on current path
  const isOnShopSection = location.pathname.startsWith('/shop') || 
                         location.pathname.startsWith('/products') || 
                         location.pathname.startsWith('/cart') || 
                         location.pathname.startsWith('/wishlist');

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold text-gray-900">Soko Smart</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.path)}
                    isActive={location.pathname === item.path}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Services</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {serviceItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.path)}
                    isActive={location.pathname === item.path}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isOnShopSection && (
          <SidebarGroup>
            <SidebarGroupLabel>Shop</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {shopMenuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.path)}
                      isActive={location.pathname === item.path}
                      className="relative"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.hasQuantityBadge && <CartQuantityBadge />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleNavigation('/profile')}
                    isActive={location.pathname === '/profile'}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.path)}
                      isActive={location.pathname === item.path}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
