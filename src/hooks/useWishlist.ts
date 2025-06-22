
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    vendor?: string;
  };
}

export const useWishlist = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      // Mock implementation since wishlist table doesn't exist
      return [] as WishlistItem[];
    },
    enabled: !!user,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      // Mock implementation
      return { id: Date.now().toString(), product_id: productId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: 'Added to wishlist',
        description: 'Product has been added to your wishlist.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error adding to wishlist',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      // Mock implementation
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: 'Removed from wishlist',
        description: 'Product has been removed from your wishlist.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error removing from wishlist',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useToggleWishlist = () => {
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  
  return useMutation({
    mutationFn: async ({ productId, isInWishlist }: { productId: string; isInWishlist: boolean }) => {
      if (isInWishlist) {
        return removeFromWishlist.mutateAsync(productId);
      } else {
        return addToWishlist.mutateAsync(productId);
      }
    }
  });
};

export const useIsInWishlist = (productId: string) => {
  const { data: wishlist, isLoading } = useWishlist();
  const isInWishlist = wishlist?.some(item => item.product_id === productId) || false;
  
  return useQuery({
    queryKey: ['is-in-wishlist', productId],
    queryFn: () => isInWishlist,
    initialData: false,
    enabled: !!productId
  });
};
