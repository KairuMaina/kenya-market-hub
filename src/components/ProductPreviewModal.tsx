
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import WishlistButton from './WishlistButton';

interface ProductPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
}

const ProductPreviewModal = ({ open, onOpenChange, product }: ProductPreviewModalProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  // Mock multiple images for demo - in real app this would come from product data
  const images = [
    product.image_url || '/placeholder.svg',
    product.image_url || '/placeholder.svg',
    product.image_url || '/placeholder.svg'
  ];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: images[0],
      vendor: product.vendor || 'Unknown Vendor'
    });
    toast({ 
      title: "Added to cart", 
      description: `${product.name} has been added to your cart.` 
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="relative bg-gray-50">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={images[currentImageIndex]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="flex space-x-2 p-4 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                        index === currentImageIndex ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details Section */}
            <div className="p-6 space-y-4">
              <DialogHeader>
                <DialogTitle className="text-2xl">{product.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{product.vendor || 'Soko Smart'}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    {product.category}
                  </Badge>
                  <Badge variant={product.in_stock ? 'default' : 'destructive'} className="bg-orange-100 text-orange-800">
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
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
                  <span className="text-3xl font-bold text-orange-600">
                    KSh {Number(product.price).toLocaleString()}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-lg text-gray-500 line-through">
                      KSh {Number(product.original_price).toLocaleString()}
                    </span>
                  )}
                </div>
                
                {product.location && (
                  <p className="text-sm text-gray-600">📍 {product.location}</p>
                )}
              </div>

              {product.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button 
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <WishlistButton productId={product.id} size="default" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreviewModal;
