
import { Home, ShoppingBag, User, ShoppingCart, LogIn, Package, Star, Settings } from 'lucide-react';
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
    { title: 'All Products', url: '/products', icon: Package },
    { title: 'Cart', url: '/cart', icon: ShoppingCart },
    { title: 'Checkout', url: '/checkout', icon: ShoppingBag },
  ];

  const accountItems = [
    { title: 'Admin Panel', url: '/admin/login', icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 bg-orange-50">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🛒</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Soko Smart</h1>
            <p className="text-xs text-gray-600">Kenya's Marketplace</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold">Shop</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="hover:bg-orange-50 hover:text-orange-700 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 data-[active=true]:font-semibold"
                  >
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

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname.startsWith('/admin')}
                    className="hover:bg-orange-50 hover:text-orange-700 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700 data-[active=true]:font-semibold"
                  >
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

        {/* Quick Categories */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold">Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-orange-50 hover:text-orange-700">
                  <Link to="/products?category=electronics">
                    <span className="text-base">📱</span>
                    <span>Electronics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-orange-50 hover:text-orange-700">
                  <Link to="/products?category=fashion">
                    <span className="text-base">👗</span>
                    <span>Fashion</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-orange-50 hover:text-orange-700">
                  <Link to="/products?category=cosmetics">
                    <span className="text-base">💄</span>
                    <span>Cosmetics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-orange-50 hover:text-orange-700">
                  <Link to="/products?category=auto-parts">
                    <span className="text-base">🚗</span>
                    <span>Auto Parts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-orange-50 hover:text-orange-700">
                  <Link to="/products?category=home-kitchen">
                    <span className="text-base">🏠</span>
                    <span>Home & Kitchen</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-orange-50 hover:text-orange-700">
                  <Link to="/products?category=health-beauty">
                    <span className="text-base">💅</span>
                    <span>Health & Beauty</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-orange-50 hover:text-orange-700">
                  <Link to="/products?category=baby-kids">
                    <span className="text-base">👶</span>
                    <span>Baby & Kids</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-orange-50 hover:text-orange-700">
                  <Link to="/products?category=sports">
                    <span className="text-base">⚽</span>
                    <span>Sports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
