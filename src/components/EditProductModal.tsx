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
import { useProductImages, useUploadProductImages } from '@/hooks/useProductImages';
import ImageUpload from './ImageUpload';
import { Trash2 } from 'lucide-react';

const EditProductModal = ({ open, onOpenChange, product, onSuccess }) => {
  const { toast } = useToast();
  const { data: productImages } = useProductImages(product?.id);
  const uploadImages = useUploadProductImages();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
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

      // Upload new images if any were selected
      if (selectedFiles.length > 0) {
        await uploadImages.mutateAsync({
          productId: product.id,
          files: selectedFiles,
          isPrimary: !productImages || productImages.length === 0
        });
      }
    },
    onSuccess: () => {
      toast({ title: 'Product updated successfully' });
      setSelectedFiles([]);
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

  const deleteImage = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Image deleted successfully' });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct.mutate();
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    toast({
      title: `${files.length} image(s) selected`,
      description: "Images will be uploaded when you save the product"
    });
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

          <div className="space-y-2">
            <Label>Current Images</Label>
            {productImages && productImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {productImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img 
                      src={image.image_url} 
                      alt="Product" 
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 h-6 w-6"
                      onClick={() => deleteImage.mutate(image.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    {image.is_primary && (
                      <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No images uploaded</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Add New Images</Label>
            <ImageUpload 
              onFilesSelected={handleFilesSelected}
              maxFiles={5}
            />
            {selectedFiles.length > 0 && (
              <p className="text-sm text-gray-600">
                {selectedFiles.length} new image(s) selected
              </p>
            )}
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
