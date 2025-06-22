
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount_amount: number;
  discount_type: string;
  used_count: number;
  usage_limit?: number;
  expires_at: string;
  created_at: string;
  is_active: boolean;
  minimum_order_amount: number;
  updated_at: string;
}

interface AdminCouponsTabProps {
  coupons: Coupon[] | undefined;
  isLoading: boolean;
}

const AdminCouponsTab: React.FC<AdminCouponsTabProps> = ({
  coupons,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Coupon Management</CardTitle>
            <CardDescription>Manage discount coupons and promotions</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Coupon
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading coupons...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons?.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono">{coupon.code}</TableCell>
                  <TableCell className="capitalize">{coupon.discount_type}</TableCell>
                  <TableCell>
                    {coupon.discount_type === 'percentage' 
                      ? `${coupon.discount_amount}%` 
                      : `KSH ${coupon.discount_amount}`}
                  </TableCell>
                  <TableCell>
                    {coupon.used_count}/{coupon.usage_limit || '∞'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm">
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

export default AdminCouponsTab;
