
import React from 'react';
import { useCart } from '@/contexts/CartContext';

const CartQuantityBadge = () => {
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
      {totalItems > 99 ? '99+' : totalItems}
    </span>
  );
};

export default CartQuantityBadge;
