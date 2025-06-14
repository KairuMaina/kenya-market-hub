
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  Home, 
  ShoppingBag, 
  ShoppingCart, 
  CreditCard, 
  User,
  Package,
  Users,
  BarChart3,
  Settings,
  FileText,
  Shield,
  Store
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AppSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.email === 'gmaina424@gmail.com';

  const customerItems = [
    { title: 'Home', url: '/', icon: Home },
    { title: 'Products', url: '/products', icon: ShoppingBag },
    { title: 'Cart', url: '/cart', icon: ShoppingCart },
    { title: 'Checkout', url: '/checkout', icon: CreditCard },
  ];

  const vendorItems = [
    { title: 'Vendor Dashboard', url: '/vendor', icon: Store },
  ];

  const adminItems = [
    { title: 'Dashboard', url: '/admin', icon: BarChart3 },
    { title: 'Products', url: '/admin/products', icon: Package },
    { title: 'Orders', url: '/admin/orders', icon: ShoppingCart },
    { title: 'Customers', url: '/admin/customers', icon: Users },
    { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
    { title: 'Reports', url: '/admin/reports', icon: FileText },
    { title: 'Settings', url: '/admin/settings', icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-gray-200 bg-white/95 backdrop-blur-sm">
      <SidebarHeader className="border-b border-gray-100 p-3 sm:p-4">
        <div className="flex items-center space-x-2 sm:space-x-3 animate-fade-in">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
            <span className="text-white font-bold text-sm sm:text-base">🛒</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent truncate">
              Soko Smart
            </h1>
            <p className="text-xs text-gray-600 truncate">
              {isAdmin ? 'Admin Panel' : 'Marketplace'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {isAdmin ? (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                <Shield className="h-3 w-3" />
                <span>Admin Panel</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location.pathname === item.url}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-600 hover:scale-105 hover:shadow-sm"
                      >
                        <Link to={item.url} className="flex items-center space-x-3 min-w-0">
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">
                <span>Customer View</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:scale-105 hover:shadow-sm"
                    >
                      <Link to="/" className="flex items-center space-x-3 min-w-0">
                        <Home className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">View Store</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">
                <span>Marketplace</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {customerItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location.pathname === item.url}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:scale-105 hover:shadow-sm"
                      >
                        <Link to={item.url} className="flex items-center space-x-3 min-w-0">
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {user && (
              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-2">
                  <span>Sell With Us</span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {vendorItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={location.pathname === item.url}
                          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 hover:scale-105 hover:shadow-sm"
                        >
                          <Link to={item.url} className="flex items-center space-x-3 min-w-0">
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 p-3 sm:p-4">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {user ? (
            <div className="flex items-center space-x-2 min-w-0">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </span>
            </div>
          ) : (
            <span>Not signed in</span>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
