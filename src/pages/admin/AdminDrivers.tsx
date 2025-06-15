
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Car, Search, Edit, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminDrivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: drivers, isLoading } = useQuery({
    queryKey: ['admin-drivers', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('drivers')
        .select(`
          id,
          user_id,
          phone_number,
          vehicle_type,
          vehicle_make,
          vehicle_model,
          license_plate,
          license_number,
          rating,
          total_rides,
          is_verified,
          is_active,
          status,
          created_at,
          profiles!inner(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`profiles.full_name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%,license_plate.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateDriverStatus = useMutation({
    mutationFn: async ({ driverId, isVerified, isActive }: { driverId: string; isVerified?: boolean; isActive?: boolean }) => {
      const updates: any = {};
      if (isVerified !== undefined) updates.is_verified = isVerified;
      if (isActive !== undefined) updates.is_active = isActive;

      const { error } = await supabase
        .from('drivers')
        .update(updates)
        .eq('id', driverId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-drivers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Driver status updated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating driver status',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Car className="h-8 w-8" />
              Driver Management
            </h1>
            <p className="text-orange-100 mt-2">Manage all platform drivers</p>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Drivers</CardTitle>
                  <CardDescription>View and manage all registered drivers</CardDescription>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search drivers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Driver
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-orange-50 to-orange-100">
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Vehicle</TableHead>
                        <TableHead className="font-semibold">License Plate</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Rating</TableHead>
                        <TableHead className="font-semibold">Total Rides</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drivers?.map((driver: any) => (
                        <TableRow key={driver.id} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-200">
                          <TableCell className="font-medium">
                            {driver.profiles?.full_name || 'N/A'}
                          </TableCell>
                          <TableCell>{driver.profiles?.email}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{driver.vehicle_make} {driver.vehicle_model}</div>
                              <div className="text-gray-500">{driver.vehicle_type}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{driver.license_plate}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant={driver.is_verified ? 'default' : 'secondary'} 
                                     className={driver.is_verified ? 'bg-gradient-to-r from-green-500 to-green-600' : ''}>
                                {driver.is_verified ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                                {driver.is_verified ? 'Verified' : 'Unverified'}
                              </Badge>
                              <Badge variant={driver.is_active ? 'default' : 'secondary'}>
                                {driver.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="text-yellow-500">⭐</span>
                              <span className="ml-1">{driver.rating?.toFixed(1) || '0.0'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-orange-600">
                            {driver.total_rides || 0}
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button variant="secondary" size="sm" className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {!driver.is_verified && (
                              <Button 
                                size="sm"
                                onClick={() => updateDriverStatus.mutate({ driverId: driver.id, isVerified: true })}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              size="sm"
                              variant={driver.is_active ? "destructive" : "default"}
                              onClick={() => updateDriverStatus.mutate({ driverId: driver.id, isActive: !driver.is_active })}
                            >
                              {driver.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
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
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminDrivers;
