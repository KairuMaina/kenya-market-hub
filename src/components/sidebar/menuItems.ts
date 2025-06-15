
import { 
  Home, 
  ShoppingBag, 
  Package, 
  ShoppingCart, 
  Heart, 
  Building, 
  Car, 
  Briefcase, 
  User, 
  Settings,
  Store,
  BarChart3,
  Users,
  FileText,
  Bell,
  Cog
} from 'lucide-react';

export const menuItems = [
  {
    title: 'Main',
    items: [
      { title: 'Home', url: '/', icon: Home },
      { title: 'Shop', url: '/shop', icon: ShoppingBag },
      { title: 'Real Estate', url: '/real-estate', icon: Building },
      { title: 'Rides', url: '/rides', icon: Car },
      { title: 'Services', url: '/services', icon: Briefcase },
      { title: 'Service Hub', url: '/service-provider-hub', icon: Cog },
    ]
  },
  {
    title: 'Shopping',
    items: [
      { title: 'Products', url: '/products', icon: Package },
      { title: 'Cart', url: '/cart', icon: ShoppingCart },
      { title: 'Wishlist', url: '/wishlist', icon: Heart },
    ]
  },
  {
    title: 'Account',
    items: [
      { title: 'Profile', url: '/profile', icon: User },
    ]
  },
  {
    title: 'Admin',
    items: [
      { title: 'Dashboard', url: '/admin', icon: BarChart3 },
      { title: 'Users', url: '/admin/users', icon: Users },
      { title: 'Products', url: '/admin/products', icon: Package },
      { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
      { title: 'Reports', url: '/admin/reports', icon: FileText },
      { title: 'Settings', url: '/admin/settings', icon: Settings },
      { title: 'Notifications', url: '/admin/notifications', icon: Bell },
    ]
  }
];
