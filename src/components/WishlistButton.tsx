
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToggleWishlist, useIsInWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'default' | 'lg';
}

const WishlistButton = ({ productId, size = 'sm' }: WishlistButtonProps) => {
  const { user } = useAuth();
  const { data: isInWishlist, isLoading } = useIsInWishlist(productId);
  const toggleWishlist = useToggleWishlist();

  if (!user) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist.mutate(productId);
  };

  return (
    <Button
      variant={isInWishlist ? 'default' : 'outline'}
      size={size}
      onClick={handleClick}
      disabled={isLoading || toggleWishlist.isPending}
      className={`${isInWishlist ? 'bg-red-500 hover:bg-red-600' : ''} w-auto`}
    >
      <Heart 
        className={`h-4 w-4 ${size !== 'sm' ? 'mr-2' : ''} ${
          isInWishlist ? 'fill-current' : ''
        }`} 
      />
      {size !== 'sm' && (isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist')}
    </Button>
  );
};

export default WishlistButton;
