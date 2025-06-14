
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EditProductModal = ({ open, onOpenChange, product, onSuccess }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [inStock, setInStock] = useState(true);
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('new');
  const [location, setLocation] = useState('');
  const [brand, setBrand] = useState('');
  const [vendor, setVendor] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || '');
      setPrice(product.price ? product.price.toString() : '');
      setOriginalPrice(product.original_price ? product.original_price.toString() : '');
      setStockQuantity(product.stock_quantity ? product.stock_quantity.toString() : '');
      setInStock(product.in_stock ?? true);
      setDescription(product.description || '');
      setCondition(product.condition || 'new');
      setLocation(product.location || '');
      setBrand(product.brand || '');
      setVendor(product.vendor || '');
    }
  }, [product]);

  const updateProduct = useMutation({
    mutationFn: async () => {
      const updateData = {
        name,
        category,
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : null,
        stock_quantity: Number(stockQuantity),
        in_stock: inStock,
        description,
        condition,
        location,
        brand,
        vendor
      };

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Product updated successfully' });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Error updating product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct.mutate();
  };

  const categories = [
    'Electronics & Tech',
    'Fashion & Apparel', 
    'Cosmetics & Beauty',
    'Auto Parts & Accessories',
    'Home & Garden',
    'Sports & Recreation',
    'Books & Media',
    'Health & Wellness'
  ];

  const conditions = ['new', 'like new', 'good', 'fair', 'poor'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (KSH) *</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="originalPrice">Original Price (KSH)</Label>
              <Input id="originalPrice" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stockQuantity">Stock Quantity *</Label>
              <Input id="stockQuantity" type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((cond) => (
                    <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input id="vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Nairobi, Mombasa" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="cursor-pointer"
            />
            <Label htmlFor="inStock" className="cursor-pointer">In Stock</Label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={updateProduct.isPending} className="bg-blue-600 hover:bg-blue-700">
              {updateProduct.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
