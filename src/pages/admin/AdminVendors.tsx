
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Store, Edit, Trash2, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminVendors = () => {
  // Mock vendor data - replace with actual data fetching
  const vendors = [
    { id: 1, name: 'Tech Store Kenya', email: 'contact@techstore.co.ke', status: 'Approved', products: 45, revenue: 'KSh 250,000', joinDate: '2024-01-15' },
    { id: 2, name: 'Fashion Hub', email: 'info@fashionhub.co.ke', status: 'Pending', products: 23, revenue: 'KSh 89,000', joinDate: '2024-02-20' },
    { id: 3, name: 'Home Essentials', email: 'sales@homeessentials.co.ke', status: 'Approved', products: 67, revenue: 'KSh 180,000', joinDate: '2024-03-10' },
    { id: 4, name: 'Sports World', email: 'shop@sportsworld.co.ke', status: 'Rejected', products: 12, revenue: 'KSh 45,000', joinDate: '2024-04-05' },
  ];

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Store className="h-8 w-8" />
              Vendor Management
            </h1>
            <p className="text-orange-100 mt-2">Manage all platform vendors</p>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Vendors</CardTitle>
                  <CardDescription>View and manage all registered vendors</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Vendor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-orange-50 to-orange-100">
                      <TableHead className="font-semibold">Business Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Products</TableHead>
                      <TableHead className="font-semibold">Revenue</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor.id} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-200">
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={vendor.status === 'Approved' ? 'default' : vendor.status === 'Pending' ? 'secondary' : 'destructive'}
                            className={vendor.status === 'Approved' ? 'bg-gradient-to-r from-green-500 to-green-600' : ''}
                          >
                            {vendor.status === 'Approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {vendor.status === 'Rejected' && <XCircle className="h-3 w-3 mr-1" />}
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-orange-600">{vendor.products}</TableCell>
                        <TableCell className="font-semibold text-green-600">{vendor.revenue}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="secondary" size="sm" className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminVendors;
