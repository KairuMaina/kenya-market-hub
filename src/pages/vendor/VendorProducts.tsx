
import React, { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AddProductModal from '@/components/AddProductModal';

const VendorProducts = () => {
  const { data: vendorProfile } = useMyVendorProfile();
  const [showAddProduct, setShowAddProduct] = useState(false);

  const { data: products, isLoading } = useProducts({ vendorId: vendorProfile?.id });
  // (Above, we'll update useProducts for vendorId filter in the next step)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>My Products</CardTitle>
          <Button onClick={() => setShowAddProduct(true)}>Add New Product</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading products...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
                {products?.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>KSH {product.price}</TableCell>
                    <TableCell>
                      {product.in_stock ? `${product.stock_quantity} in stock` : 'Out of stock'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <AddProductModal open={showAddProduct} onOpenChange={setShowAddProduct} onSuccess={() => {}} />
    </div>
  );
};

export default VendorProducts;
