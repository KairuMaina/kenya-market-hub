
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Car, Users, MapPin, Star, Eye, Edit, UserCheck } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminDrivers = () => {
  // Fetch drivers
  const { data: drivers, isLoading: driversLoading } = useQuery({
    queryKey: ['admin-drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch profiles separately
  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles-drivers'],
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'online':
      case 'available':
        return 'default';
      case 'busy':
        return 'secondary';
      case 'offline':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getDriverName = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile ? (profile.full_name || profile.email || 'Unknown') : 'Unknown';
  };

  // Calculate statistics
  const totalDrivers = drivers?.length || 0;
  const activeDrivers = drivers?.filter(driver => driver.is_active).length || 0;
  const verifiedDrivers = drivers?.filter(driver => driver.is_verified).length || 0;
  const onlineDrivers = drivers?.filter(driver => driver.status === 'online').length || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Car className="h-8 w-8" />
              Driver Management
            </h1>
            <p className="text-blue-100 mt-2">Manage drivers and their vehicle information</p>
          </div>

          {/* Driver Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDrivers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeDrivers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{verifiedDrivers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Online Now</CardTitle>
                <MapPin className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{onlineDrivers}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Drivers</CardTitle>
              <CardDescription>View and manage driver profiles and vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              {driversLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading drivers...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Driver</TableHead>
                        <TableHead>License</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Rides</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drivers?.map((driver) => (
                        <TableRow key={driver.id}>
                          <TableCell className="font-medium">
                            {getDriverName(driver.user_id)}
                          </TableCell>
                          <TableCell>{driver.license_number}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {driver.vehicle_make} {driver.vehicle_model}
                              </div>
                              <div className="text-sm text-gray-500">
                                {driver.license_plate} • {driver.vehicle_type}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{driver.phone_number}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {Number(driver.rating || 0).toFixed(1)}
                            </div>
                          </TableCell>
                          <TableCell>{driver.total_rides || 0}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(driver.status)}>
                              {driver.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {driver.is_verified ? (
                              <Badge variant="default">Verified</Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="sm">
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

export default AdminDrivers;
