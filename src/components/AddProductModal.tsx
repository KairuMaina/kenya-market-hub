import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useUploadProductImages } from '@/hooks/useProductImages';
import ImageUpload from './ImageUpload';

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddProductModal = ({ open, onOpenChange, onSuccess }: AddProductModalProps) => {
  const { toast } = useToast();
  const uploadImages = useUploadProductImages();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    brand: '',
    vendor_id: '',
    image_url: '',
    stock_quantity: '',
    in_stock: true,
    make: '',
    model: '',
    year: ''
  });

  const { data: vendors, isLoading: vendorsLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase.from('vendors').select('id, business_name');
      if (error) {
        toast({
          title: "Error fetching vendors",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }
      return data;
    },
  });

  const categories = [
    'Electronics',
    'Fashion',
    'Beauty',
    'Auto Parts',
    'Food & Beverages',
    'Motobike Spareparts',
    'Motobike Accessories',
    'Other'
  ];

  const addProduct = useMutation({
    mutationFn: async (productData: any) => {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: async (newProduct) => {
      // Upload images if any were selected
      if (selectedFiles.length > 0) {
        try {
          await uploadImages.mutateAsync({
            productId: newProduct.id,
            files: selectedFiles,
            isPrimary: true
          });
        } catch (error) {
          console.error('Error uploading images:', error);
          toast({
            title: "Product added but image upload failed",
            description: "You can add images later by editing the product",
            variant: "destructive"
          });
        }
      }
      
      toast({ title: "Product added successfully!" });
      onSuccess();
      setFormData({
        name: '',
        description: '',
        price: '',
        original_price: '',
        category: '',
        brand: '',
        vendor_id: '',
        image_url: '',
        stock_quantity: '',
        in_stock: true,
        make: '',
        model: '',
        year: ''
      });
      setSelectedFiles([]);
    },
    onError: (error: any) => {
      toast({ 
        title: "Error adding product", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      vendor_id: formData.vendor_id || null,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      year: formData.year ? parseInt(formData.year) : null,
    };

    addProduct.mutate(productData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    toast({
      title: `${files.length} image(s) selected`,
      description: "Images will be uploaded when you save the product"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the product details to add it to your inventory.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (KSh) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="original_price">Original Price (KSh)</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => handleInputChange('original_price', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vendor_id">Vendor</Label>
              <Select
                value={formData.vendor_id}
                onValueChange={(value) => handleInputChange('vendor_id', value)}
              >
                <SelectTrigger id="vendor_id">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendorsLoading ? (
                     <SelectItem value="loading" disabled>Loading vendors...</SelectItem>
                  ) : (
                    vendors?.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.business_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              placeholder="2024"
            />
          </div>

          <div className="space-y-2">
            <Label>Product Images</Label>
            <ImageUpload 
              onFilesSelected={handleFilesSelected}
              maxFiles={5}
            />
            {selectedFiles.length > 0 && (
              <p className="text-sm text-gray-600">
                {selectedFiles.length} image(s) selected
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="in_stock"
              checked={formData.in_stock}
              onCheckedChange={(checked) => handleInputChange('in_stock', checked)}
            />
            <Label htmlFor="in_stock">In Stock</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addProduct.isPending}>
              {addProduct.isPending ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
