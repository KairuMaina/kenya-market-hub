
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface OrderData {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
}

interface AdminOrdersTabProps {
  orders: OrderData[] | undefined;
  isLoading: boolean;
  getStatusBadgeVariant: (status: string) => "default" | "destructive" | "outline" | "secondary";
}

const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  isLoading,
  getStatusBadgeVariant
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>View and manage customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading orders...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>{order.user_name || order.user_email || 'Unknown'}</TableCell>
                  <TableCell>KSH {Number(order.total_amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.payment_status)}>
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOrdersTab;
