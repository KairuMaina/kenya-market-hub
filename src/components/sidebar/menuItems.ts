
import { 
  Home, 
  ShoppingBag, 
  Car, 
  Building, 
  Briefcase, 
  User, 
  Heart, 
  ShoppingCart,
  Settings,
  BarChart3,
  Users,
  Package,
  FileText,
  DollarSign,
  Shield
} from 'lucide-react';

export const menuItems = [
  {
    title: 'Main',
    items: [
      {
        title: 'Dashboard',
        url: '/',
        icon: Home,
      },
      {
        title: 'Shop',
        url: '/shop',
        icon: ShoppingBag,
      },
      {
        title: 'Products',
        url: '/products',
        icon: Package,
      },
      {
        title: 'Rides',
        url: '/rides',
        icon: Car,
      },
      {
        title: 'Real Estate',
        url: '/real-estate',
        icon: Building,
      },
      {
        title: 'Services',
        url: '/services',
        icon: Briefcase,
      },
    ],
  },
  {
    title: 'Shopping',
    items: [
      {
        title: 'Cart',
        url: '/cart',
        icon: ShoppingCart,
      },
      {
        title: 'Wishlist',
        url: '/wishlist',
        icon: Heart,
      },
      {
        title: 'Checkout',
        url: '/checkout',
        icon: DollarSign,
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        title: 'Profile',
        url: '/profile',
        icon: User,
      },
      {
        title: 'Vendor Dashboard',
        url: '/vendor-dashboard',
        icon: Briefcase,
      },
    ],
  },
  {
    title: 'Admin',
    items: [
      {
        title: 'Admin Dashboard',
        url: '/admin',
        icon: Shield,
      },
      {
        title: 'Analytics',
        url: '/admin/analytics',
        icon: BarChart3,
      },
      {
        title: 'Customers',
        url: '/admin/customers',
        icon: Users,
      },
      {
        title: 'Products',
        url: '/admin/products',
        icon: Package,
      },
      {
        title: 'Orders',
        url: '/admin/orders',
        icon: ShoppingCart,
      },
      {
        title: 'Reports',
        url: '/admin/reports',
        icon: FileText,
      },
      {
        title: 'Settings',
        url: '/admin/settings',
        icon: Settings,
      },
    ],
  },
];
