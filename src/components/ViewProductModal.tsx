import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ViewProductModal = ({ open, onOpenChange, product }) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <strong>Name:</strong> {product.name}
          </div>
          <div>
            <strong>Category:</strong> {product.category}
          </div>
          <div>
            <strong>Price:</strong> KSH {Number(product.price).toLocaleString()}
          </div>
          <div>
            <strong>Stock Quantity:</strong> {product.stock_quantity}
          </div>
          <div>
            <strong>In Stock:</strong> {product.in_stock ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Description:</strong> {product.description || 'N/A'}
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
