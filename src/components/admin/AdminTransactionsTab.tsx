
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TransactionData {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  order_id: string;
}

interface AdminTransactionsTabProps {
  transactions: TransactionData[] | undefined;
  isLoading: boolean;
  getStatusBadgeVariant: (status: string) => "default" | "destructive" | "outline" | "secondary";
}

const AdminTransactionsTab: React.FC<AdminTransactionsTabProps> = ({
  transactions,
  isLoading,
  getStatusBadgeVariant
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View payment transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading transactions...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono">{transaction.id.slice(0, 8)}...</TableCell>
                  <TableCell className="font-mono">{transaction.order_id.slice(0, 8)}...</TableCell>
                  <TableCell>KSH {Number(transaction.amount).toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{transaction.payment_method}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTransactionsTab;
