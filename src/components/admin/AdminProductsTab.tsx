
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  in_stock: boolean;
  stock_quantity?: number;
}

interface AdminProductsTabProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onAddProduct: () => void;
  onDeleteProduct: (productId: string) => void;
  isDeleting: boolean;
}

const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  isLoading,
  onAddProduct,
  onDeleteProduct,
  isDeleting
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Manage your marketplace products</CardDescription>
          </div>
          <Button onClick={onAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>KSH {Number(product.price).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                      {product.in_stock ? `${product.stock_quantity || 0} in stock` : 'Out of stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteProduct(product.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminProductsTab;
