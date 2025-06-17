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
  Cog,
  HeartPulse,
  ClipboardList,
  MessageSquare,
  CalendarClock,
  Truck,
  ShieldCheck,
  LifeBuoy,
  DollarSign
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
      { title: 'Medical', url: '/medical', icon: HeartPulse },
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
      { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
      { title: 'Reports', url: '/admin/reports', icon: FileText },
      { title: 'Users', url: '/admin/users', icon: Users },
      { title: 'Vendors', url: '/admin/vendors', icon: Store },
      { title: 'Drivers', url: '/admin/drivers', icon: Car },
      { title: 'Products', url: '/admin/products', icon: Package },
      { title: 'Orders', url: '/admin/orders', icon: ClipboardList },
      { title: 'Properties', url: '/admin/properties', icon: Building },
      { title: 'Agents', url: '/admin/agents', icon: Users },
      { title: 'Inquiries', url: '/admin/property-inquiries', icon: MessageSquare },
      { title: 'Viewings', url: '/admin/property-viewings', icon: CalendarClock },
      { title: 'Rides', url: '/admin/rides', icon: Truck },
      { title: 'Pricing', url: '/admin/ride-pricing', icon: DollarSign },
      { title: 'Service Providers', url: '/admin/service-providers', icon: ShieldCheck },
      { title: 'Service Bookings', url: '/admin/service-bookings', icon: CalendarClock },
      { title: 'Medical Mgmt', url: '/admin/medical', icon: LifeBuoy },
      { title: 'Notifications', url: '/admin/notifications', icon: Bell },
      { title: 'Settings', url: '/admin/settings', icon: Settings },
      { title: 'Job Board', url: '/admin/job-board', icon: Briefcase },
    ]
  }
];
