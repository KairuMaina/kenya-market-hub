
import React from 'react';
import { useLocation } from 'react-router-dom';
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
import { menuItems } from './sidebar/menuItems';
import CartQuantityBadge from './CartQuantityBadge';

const AppSidebar = () => {
  const location = useLocation();

  // Determine which section we're in
  const getActiveSection = () => {
    const path = location.pathname;
    
    if (path.startsWith('/shop') || path === '/products' || path === '/cart' || path === '/wishlist' || path === '/checkout') {
      return 'shop';
    } else if (path.startsWith('/rides')) {
      return 'rides';
    } else if (path.startsWith('/services')) {
      return 'services';
    } else if (path.startsWith('/real-estate')) {
      return 'real-estate';
    } else if (path.startsWith('/admin')) {
      return 'admin';
    } else if (path.startsWith('/vendor')) {
      return 'vendor';
    }
    return 'main';
  };

  const activeSection = getActiveSection();

  // Filter menu items based on active section
  const getFilteredMenuItems = () => {
    if (activeSection === 'shop') {
      return menuItems.filter(section => 
        section.title === 'Main' || 
        section.title === 'Shopping' || 
        section.title === 'Account'
      );
    } else if (activeSection === 'admin') {
      return menuItems.filter(section => section.title === 'Admin');
    } else if (activeSection === 'vendor') {
      return menuItems.filter(section => 
        section.title === 'Main' || 
        section.title === 'Account'
      );
    } else {
      // For main section, show everything except admin
      return menuItems.filter(section => section.title !== 'Admin');
    }
  };

  const filteredMenuItems = getFilteredMenuItems();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
            <img 
              alt="Soko Smart Logo" 
              src="/lovable-uploads/563ee6fb-f94f-43f3-a4f3-a61873a1b491.png" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Soko Smart</h1>
            <p className="text-xs text-gray-600">
              {activeSection === 'shop' && "Shopping Experience"}
              {activeSection === 'rides' && "Transportation Hub"}
              {activeSection === 'services' && "Service Marketplace"}
              {activeSection === 'real-estate' && "Property Portal"}
              {activeSection === 'admin' && "Admin Dashboard"}
              {activeSection === 'vendor' && "Vendor Portal"}
              {activeSection === 'main' && "Kenya's Marketplace"}
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        {filteredMenuItems.map((section, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = location.pathname === item.url ||
                                 (item.url === '/shop/products' && location.pathname === '/products') ||
                                 (item.url === '/shop/cart' && location.pathname === '/cart') ||
                                 (item.url === '/shop/wishlist' && location.pathname === '/wishlist') ||
                                 (item.url === '/shop/checkout' && location.pathname === '/checkout');

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className="w-full relative"
                        isActive={isActive}
                      >
                        <a href={item.url} className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
                          <item.icon className="h-4 w-4" />
                          <span className="font-medium">{item.title}</span>
                          {item.title === 'Cart' && <CartQuantityBadge />}
                        </a>
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

export default AppSidebar;
