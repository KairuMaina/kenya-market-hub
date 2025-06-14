
import { Home, Package, ShoppingCart, Heart, User, Settings, BarChart3, Car, Wrench, Building } from 'lucide-react';

export const mainMenuItems = [
  { icon: Home, label: 'Home', path: '/' },
];

export const serviceItems = [
  { icon: Package, label: 'Shop', path: '/shop' },
  { icon: Car, label: 'Rides', path: '/rides' },
  { icon: Wrench, label: 'Services', path: '/services' },
  { icon: Building, label: 'Real Estate', path: '/real-estate' },
];

export const shopMenuItems = [
  { icon: Package, label: 'Products', path: '/shop/products' },
  { 
    icon: ShoppingCart, 
    label: 'Cart', 
    path: '/shop/cart',
    hasQuantityBadge: true
  },
  { icon: Heart, label: 'Wishlist', path: '/shop/wishlist' },
];

export const ridesMenuItems = [
  { icon: Car, label: 'Book Ride', path: '/rides' },
];

export const servicesMenuItems = [
  { icon: Wrench, label: 'Find Services', path: '/services' },
];

export const realEstateMenuItems = [
  { icon: Building, label: 'Browse Properties', path: '/real-estate' },
];

export const accountMenuItems = [
  { icon: User, label: 'Profile', path: '/profile' },
];

export const adminItems = [
  { icon: BarChart3, label: 'Admin Dashboard', path: '/admin' },
  { icon: Package, label: 'Manage Products', path: '/admin/products' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];
