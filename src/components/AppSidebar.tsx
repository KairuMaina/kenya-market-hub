
import React from 'react';
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';
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
import { useSidebarLogic } from './sidebar/useSidebarLogic';

const AppSidebar = () => {
  const { isOpen, toggle } = useSidebarLogic();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
            <img 
              alt="Soko Smart Logo" 
              src="/lovable-uploads/79fe9f77-6c77-4b5c-b7e0-4c0f7d6b4b4b.png" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Soko Smart</h1>
            <p className="text-xs text-gray-600">Kenya's Marketplace</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        {menuItems.map((section, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="w-full">
                      <a href={item.url} className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Soko Smart
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
