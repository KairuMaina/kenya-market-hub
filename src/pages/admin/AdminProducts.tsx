
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Package, Eye, TrendingUp, ShoppingCart, Star, DollarSign } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch vendors for product owner names
  const { data: vendors } = useQuery({
    queryKey: ['admin-vendors-for-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*');
      
      if (error) {
        console.error('Vendors fetch error:', error);
        return [];
      }
      return data || [];
    }
  });

  const getVendorName = (vendorId: string) => {
    const vendor = vendors?.find(v => v.id === vendorId);
    return vendor ? vendor.business_name : 'Unknown Vendor';
  };

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  // Calculate statistics
  const totalProducts = products?.length || 0;
  const inStockProducts = products?.filter(product => product.in_stock).length || 0;
  const outOfStockProducts = totalProducts - inStockProducts;
  const avgRating = products?.reduce((sum, product) => sum + (product.rating || 0), 0) / totalProducts || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 sm:h-8 sm:w-8" />
              Product Management
            </h1>
            <p className="text-green-100 mt-2 text-sm sm:text-base">Manage marketplace products and inventory</p>
          </div>

          {/* Product Statistics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{totalProducts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">In Stock</CardTitle>
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{inStockProducts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Out of Stock</CardTitle>
                <TrendingUp className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{outOfStockProducts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{avgRating.toFixed(1)}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">All Products</CardTitle>
              <CardDescription className="text-sm">View and manage marketplace products</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading products...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Product</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Category</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Price</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Stock</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((product) => (
                        <TableRow key={product.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center gap-3">
                              <img 
                                src={product.image_url || '/placeholder.svg'} 
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-gray-500">{getVendorName(product.vendor_id)}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>KSH {Number(product.price).toLocaleString()}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            <div className="text-center">
                              <div className="font-medium">{product.stock_quantity}</div>
                              <div className="text-xs text-gray-500">units</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={product.in_stock ? "default" : "destructive"} 
                              className="text-xs"
                            >
                              {product.in_stock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs px-2 py-1"
                              onClick={() => handleView(product)}
                            >
                              <Eye className="h-3 w-3" />
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

          {/* View Product Details Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Details
                </DialogTitle>
                <DialogDescription>
                  View details for {selectedProduct?.name}
                </DialogDescription>
              </DialogHeader>
              
              {selectedProduct && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img 
                        src={selectedProduct.image_url || '/placeholder.svg'} 
                        alt={selectedProduct.name}
                        className="w-full rounded-lg object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                        <p className="text-gray-600">{selectedProduct.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium">Price:</span>
                          <p className="text-lg font-bold text-green-600">
                            KSH {Number(selectedProduct.price).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Category:</span>
                          <p className="text-sm">{selectedProduct.category}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Brand:</span>
                          <p className="text-sm">{selectedProduct.brand || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Condition:</span>
                          <p className="text-sm">{selectedProduct.condition}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold">{selectedProduct.stock_quantity}</div>
                          <div className="text-xs text-gray-500">Stock</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{selectedProduct.rating || 0}</div>
                          <div className="text-xs text-gray-500">Rating</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{selectedProduct.reviews_count || 0}</div>
                          <div className="text-xs text-gray-500">Reviews</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminProducts;
