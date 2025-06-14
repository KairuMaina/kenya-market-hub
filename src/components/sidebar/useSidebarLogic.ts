
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useSidebarLogic = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const isOnShopSection = location.pathname.startsWith('/shop') || 
                         location.pathname.startsWith('/products') || 
                         location.pathname.startsWith('/cart') || 
                         location.pathname.startsWith('/wishlist') ||
                         location.pathname.startsWith('/checkout');

  const isOnRidesSection = location.pathname.startsWith('/rides');
  const isOnServicesSection = location.pathname.startsWith('/services');
  const isOnRealEstateSection = location.pathname.startsWith('/real-estate');

  const getShopSectionIsActive = (path: string) => {
    return location.pathname === path ||
           (path === '/shop/products' && location.pathname === '/products') ||
           (path === '/shop/cart' && location.pathname === '/cart') ||
           (path === '/shop/wishlist' && location.pathname === '/wishlist');
  };

  const getServiceSectionIsActive = (path: string, sectionPath: string) => {
    return location.pathname === path || 
           (path === sectionPath && (
             (sectionPath === '/shop' && isOnShopSection) ||
             (sectionPath === '/rides' && isOnRidesSection) ||
             (sectionPath === '/services' && isOnServicesSection) ||
             (sectionPath === '/real-estate' && isOnRealEstateSection)
           ));
  };

  return {
    isOpen,
    toggle,
    isOnShopSection,
    isOnRidesSection,
    isOnServicesSection,
    isOnRealEstateSection,
    getShopSectionIsActive,
    getServiceSectionIsActive,
  };
};
