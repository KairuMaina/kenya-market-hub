
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const VendorCustomers = () => {
  const { data: vendorProfile } = useMyVendorProfile();

  const { data, isLoading, error } = useQuery({
    queryKey: ['vendor-customers', vendorProfile?.id],
    enabled: !!vendorProfile?.id,
    queryFn: async () => {
      // Find customers who placed at least one order for a product owned by this vendor
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select(
          'order_id, product_id, orders(user_id, created_at), products(id, name, vendor_id)'
        )
        .eq('products.vendor_id', vendorProfile?.id);

      if (error) throw error;

      // Get unique customers from the results
      const customerMap = new Map();
      for (const item of orderItems || []) {
        if (!item.orders?.user_id) continue;
        if (!customerMap.has(item.orders.user_id)) {
          customerMap.set(item.orders.user_id, {
            userId: item.orders.user_id,
            firstOrder: item.orders.created_at,
            ordersCount: 1,
          });
        } else {
          const cust = customerMap.get(item.orders.user_id);
          cust.ordersCount += 1;
        }
      }
      return Array.from(customerMap.values());
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading customers...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>First Order</TableHead>
                  <TableHead>Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data?.length && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                )}
                {data?.map((customer, idx) => (
                  <TableRow key={customer.userId}>
                    <TableCell>{customer.userId.slice(0, 8)}...</TableCell>
                    <TableCell>{new Date(customer.firstOrder).toLocaleDateString()}</TableCell>
                    <TableCell>{customer.ordersCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorCustomers;
