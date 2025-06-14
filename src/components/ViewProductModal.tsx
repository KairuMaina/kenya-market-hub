
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

const ViewProductModal = ({ open, onOpenChange, product }) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Name:</strong> {product.name}
            </div>
            <div>
              <strong>Category:</strong> 
              <Badge variant="outline" className="ml-2">{product.category}</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Price:</strong> KSH {Number(product.price).toLocaleString()}
              {product.original_price && (
                <span className="text-gray-500 line-through ml-2">
                  KSH {Number(product.original_price).toLocaleString()}
                </span>
              )}
            </div>
            <div>
              <strong>Stock:</strong> 
              <Badge variant={product.in_stock ? 'default' : 'destructive'} className="ml-2">
                {product.in_stock ? `${product.stock_quantity} in stock` : 'Out of stock'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Condition:</strong> 
              <Badge variant="secondary" className="ml-2">{product.condition || 'new'}</Badge>
            </div>
            <div>
              <strong>Rating:</strong>
              <div className="flex items-center ml-2">
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
                <span className="text-sm text-gray-600 ml-1">
                  ({product.reviews_count || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          {(product.brand || product.vendor) && (
            <div className="grid grid-cols-2 gap-4">
              {product.brand && (
                <div>
                  <strong>Brand:</strong> {product.brand}
                </div>
              )}
              {product.vendor && (
                <div>
                  <strong>Vendor:</strong> {product.vendor}
                </div>
              )}
            </div>
          )}

          {product.location && (
            <div>
              <strong>Location:</strong> 📍 {product.location}
            </div>
          )}

          {product.description && (
            <div>
              <strong>Description:</strong>
              <p className="mt-2 text-gray-700 bg-gray-50 p-3 rounded-lg">{product.description}</p>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <strong>Created:</strong> {new Date(product.created_at).toLocaleDateString()}
            {product.updated_at !== product.created_at && (
              <span className="ml-4">
                <strong>Updated:</strong> {new Date(product.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="bg-blue-600 hover:bg-blue-700">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProductModal;
