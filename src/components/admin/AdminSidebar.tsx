
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  ShoppingBag, 
  ClipboardList, 
  Store, 
  Car, 
  Briefcase, 
  Building2, 
  UserCheck, 
  Route, 
  Wrench, 
  Building, 
  Stethoscope, 
  Shield, 
  UtensilsCrossed, 
  Calendar, 
  Briefcase as JobIcon, 
  BarChart3, 
  FileText, 
  Bell,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminSidebar = () => {
  const location = useLocation();

  // Fetch notification count
  const { data: notificationCount } = useQuery({
    queryKey: ['admin-notification-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      return count || 0;
    }
  });

  // Fetch pending vendor applications count
  const { data: pendingVendorCount } = useQuery({
    queryKey: ['admin-pending-vendor-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('vendors')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'pending');
      return count || 0;
    }
  });

  // Fetch orders count
  const { data: ordersCount } = useQuery({
    queryKey: ['admin-orders-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: Home,
      exact: true
    },
    { 
      name: 'Users', 
      href: '/admin/users', 
      icon: Users 
    },
    { 
      name: 'Products', 
      href: '/admin/products', 
      icon: ShoppingBag 
    },
    { 
      name: 'Orders', 
      href: '/admin/orders', 
      icon: ClipboardList,
      badge: ordersCount
    },
    { 
      name: 'Vendors', 
      href: '/admin/vendors', 
      icon: Store,
      badge: pendingVendorCount
    },
    { 
      name: 'Drivers', 
      href: '/admin/drivers', 
      icon: Car 
    },
    { 
      name: 'Service Providers', 
      href: '/admin/service-providers', 
      icon: Briefcase 
    },
    { 
      name: 'Employers', 
      href: '/admin/employers', 
      icon: Building2 
    },
    { 
      name: 'Agents', 
      href: '/admin/agents', 
      icon: UserCheck 
    },
    { 
      name: 'Rides', 
      href: '/admin/rides', 
      icon: Route 
    },
    { 
      name: 'Service Bookings', 
      href: '/admin/service-bookings', 
      icon: Wrench 
    },
    { 
      name: 'Properties', 
      href: '/admin/properties', 
      icon: Building 
    },
    { 
      name: 'Medical', 
      href: '/admin/medical', 
      icon: Stethoscope 
    },
    { 
      name: 'Insurance', 
      href: '/admin/insurance', 
      icon: Shield 
    },
    { 
      name: 'Food Delivery', 
      href: '/admin/food-delivery', 
      icon: UtensilsCrossed 
    },
    { 
      name: 'Events', 
      href: '/admin/events', 
      icon: Calendar 
    },
    { 
      name: 'Jobs', 
      href: '/admin/jobs', 
      icon: JobIcon 
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: BarChart3 
    },
    { 
      name: 'Reports', 
      href: '/admin/reports', 
      icon: FileText 
    },
    { 
      name: 'Notifications', 
      href: '/admin/notifications', 
      icon: Bell,
      badge: notificationCount
    },
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: Settings 
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        <p className="text-sm text-gray-600">Soko Smart Management</p>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href 
              : location.pathname.startsWith(item.href);
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
