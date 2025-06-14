
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useWishlist, useToggleWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Wishlist = () => {
  const { user } = useAuth();
  const { data: wishlistItems, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const toggleWishlist = useToggleWishlist();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.products.id,
      name: item.products.name,
      price: Number(item.products.price),
      image: item.products.image_url || '/placeholder.svg',
      vendor: item.products.vendor || 'Unknown Vendor'
    });
    toast({ title: "Added to cart", description: `${item.products.name} has been added to your cart.` });
  };

  const handleRemove = (productId: string) => {
    toggleWishlist.mutate(productId);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          <p className="text-gray-600 text-lg">Products you've saved for later</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : wishlistItems?.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding products you love to save them for later!</p>
            <Button onClick={() => window.location.href = '/products'}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems?.map((item) => (
              <Card key={item.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <img 
                      src={item.products?.image_url || '/placeholder.svg'} 
                      alt={item.products?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">
                    {item.products?.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">{item.products?.vendor}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-gray-900">
                      KSH {Number(item.products?.price).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRemove(item.product_id)}
                      disabled={toggleWishlist.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Wishlist;
