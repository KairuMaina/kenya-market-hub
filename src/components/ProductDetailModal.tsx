
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useAddToRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useAuth } from '@/contexts/AuthContext';
import ProductReviews from './ProductReviews';
import WishlistButton from './WishlistButton';

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
}

const ProductDetailModal = ({ open, onOpenChange, product }: ProductDetailModalProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const addToRecentlyViewed = useAddToRecentlyViewed();

  useEffect(() => {
    if (open && product && user) {
      addToRecentlyViewed.mutate(product.id);
    }
  }, [open, product, user]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image_url || '/placeholder.svg',
      vendor: product.vendor || 'Unknown Vendor'
    });
    toast({ title: "Added to cart", description: `${product.name} has been added to your cart.` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={product.image_url || '/placeholder.svg'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">{product.vendor || 'Soko Smart'}</p>
              <Badge variant="outline" className="mb-2">{product.category}</Badge>
              
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviews_count || 0} reviews)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  KSH {Number(product.price).toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="text-lg text-gray-500 line-through">
                    KSH {Number(product.original_price).toLocaleString()}
                  </span>
                )}
              </div>
              
              {product.condition && (
                <Badge variant="secondary">Condition: {product.condition}</Badge>
              )}
              
              {product.location && (
                <p className="text-sm text-gray-600">📍 {product.location}</p>
              )}
              
              <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                {product.in_stock ? `${product.stock_quantity} in stock` : 'Out of stock'}
              </Badge>
            </div>

            {product.description && (
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}

            <div className="flex space-x-2">
              <Button 
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <WishlistButton productId={product.id} size="default" />
            </div>
          </div>
        </div>

        <ProductReviews productId={product.id} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
