
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Package2, Edit, Eye } from 'lucide-react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';
import AddProductModal from '@/components/AddProductModal';
import EditProductModal from '@/components/EditProductModal';
import ViewProductModal from '@/components/ViewProductModal';

const AdminProducts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showViewProduct, setShowViewProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Delete product mutation
  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting product", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(productId);
    }
  };

  const handleProductAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    setShowAddProduct(false);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditProduct(true);
  };

  const handleViewClick = (product) => {
    setSelectedProduct(product);
    setShowViewProduct(true);
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    setShowEditProduct(false);
  };

  return (
    <ModernAdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package2 className="h-8 w-8" />
            Product Management
          </h1>
          <p className="text-blue-100 mt-2">Manage your marketplace products</p>
        </div>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Products</CardTitle>
                <CardDescription>Add, edit, and manage your product catalog</CardDescription>
              </div>
              <Button 
                onClick={() => setShowAddProduct(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading products...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Price</TableHead>
                      <TableHead className="font-semibold">Stock</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.map((product, index) => (
                      <TableRow 
                        key={product.id} 
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-purple-100">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          KSH {Number(product.price).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.in_stock ? 'default' : 'destructive'} 
                                 className={product.in_stock ? 'bg-gradient-to-r from-green-500 to-green-600' : ''}>
                            {product.in_stock ? `${product.stock_quantity} in stock` : 'Out of stock'}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewClick(product)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEditClick(product)}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 hover:scale-105"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deleteProduct.isPending}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:scale-105"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddProductModal 
        open={showAddProduct} 
        onOpenChange={setShowAddProduct}
        onSuccess={handleProductAdded}
      />
      <EditProductModal
        open={showEditProduct}
        product={selectedProduct}
        onOpenChange={setShowEditProduct}
        onSuccess={handleEditSuccess}
      />
      <ViewProductModal
        open={showViewProduct}
        product={selectedProduct}
        onOpenChange={setShowViewProduct}
      />
    </ModernAdminLayout>
  );
};

export default AdminProducts;
