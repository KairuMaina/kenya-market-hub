
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Car, Eye, Edit, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminRides = () => {
  const { toast } = useToast();

  // Fetch rides without joins initially
  const { data: rides, isLoading: ridesLoading } = useQuery({
    queryKey: ['admin-rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Rides fetch error:', error);
        throw error;
      }
      return data || [];
    }
  });

  // Fetch profiles separately to get user information
  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Profiles fetch error:', error);
        return [];
      }
      return data || [];
    }
  });

  // Fetch drivers separately
  const { data: drivers } = useQuery({
    queryKey: ['admin-drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*');
      
      if (error) {
        console.error('Drivers fetch error:', error);
        return [];
      }
      return data || [];
    }
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in_progress':
      case 'accepted':
        return 'secondary';
      case 'requested':
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getUserInfo = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile ? (profile.full_name || profile.email || 'Unknown') : 'Unknown';
  };

  const getDriverInfo = (driverId: string) => {
    if (!driverId) return 'Unassigned';
    const driver = drivers?.find(d => d.id === driverId);
    return driver ? (driver.license_number || 'Unknown Driver') : 'Unknown Driver';
  };

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Car className="h-8 w-8" />
              Ride Management
            </h1>
            <p className="text-blue-100 mt-2">Manage ride requests and transportation services</p>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Rides</CardTitle>
                  <CardDescription>View and manage all ride requests</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ride
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {ridesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading rides...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <TableHead className="font-semibold">Ride ID</TableHead>
                        <TableHead className="font-semibold">Passenger</TableHead>
                        <TableHead className="font-semibold">Driver</TableHead>
                        <TableHead className="font-semibold">From</TableHead>
                        <TableHead className="font-semibold">To</TableHead>
                        <TableHead className="font-semibold">Fare</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rides?.map((ride) => (
                        <TableRow 
                          key={ride.id} 
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                        >
                          <TableCell className="font-mono text-sm">{ride.id.slice(0, 8)}...</TableCell>
                          <TableCell>{getUserInfo(ride.user_id)}</TableCell>
                          <TableCell>{getDriverInfo(ride.driver_id)}</TableCell>
                          <TableCell className="max-w-32 truncate">{ride.pickup_address}</TableCell>
                          <TableCell className="max-w-32 truncate">{ride.destination_address}</TableCell>
                          <TableCell className="font-semibold text-green-600">
                            KSH {Number(ride.estimated_fare || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(ride.status)}>
                              {ride.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(ride.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="space-x-2">
                            <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="sm" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600">
                              <Edit className="h-4 w-4" />
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

export default AdminRides;
