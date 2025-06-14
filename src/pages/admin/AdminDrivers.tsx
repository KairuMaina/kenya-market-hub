
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Car, Users, MapPin, Star, Eye, Edit, UserCheck, Check, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useApprovalActions } from '@/hooks/useApprovalActions';

const AdminDrivers = () => {
  const { approveDriver, rejectDriver } = useApprovalActions();

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

  const handleApprove = (driverId: string) => {
    approveDriver.mutate({ driverId });
  };

  const handleReject = (driverId: string) => {
    rejectDriver.mutate({ driverId });
  };

  // Calculate statistics
  const totalDrivers = drivers?.length || 0;
  const activeDrivers = drivers?.filter(driver => driver.is_active).length || 0;
  const verifiedDrivers = drivers?.filter(driver => driver.is_verified).length || 0;
  const availableDrivers = drivers?.filter(driver => driver.status === 'available').length || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6 sm:h-8 sm:w-8" />
              Driver Management
            </h1>
            <p className="text-blue-100 mt-2 text-sm sm:text-base">Manage drivers and their vehicle information</p>
          </div>

          {/* Driver Statistics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Drivers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{totalDrivers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{activeDrivers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Verified</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{verifiedDrivers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Available Now</CardTitle>
                <MapPin className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{availableDrivers}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Drivers</CardTitle>
              <CardDescription className="text-sm">View and manage driver profiles and vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              {driversLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading drivers...</span>
                </div>
              ) : (
                <div className="overflow-x-auto table-responsive">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Driver</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Vehicle</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Phone</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Rating</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drivers?.map((driver) => (
                        <TableRow key={driver.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs sm:text-sm">
                            <div className="space-y-1">
                              <div className="font-medium">{getDriverName(driver.user_id)}</div>
                              <div className="text-xs text-gray-500">{driver.license_number}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="font-medium">
                                {driver.vehicle_make} {driver.vehicle_model}
                              </div>
                              <div className="text-xs text-gray-500">
                                {driver.license_plate} • {driver.vehicle_type}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            {driver.phone_number}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {Number(driver.rating || 0).toFixed(1)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant={getStatusBadgeVariant(driver.status)} className="text-xs">
                                {driver.status}
                              </Badge>
                              {driver.is_verified ? (
                                <Badge variant="default" className="text-xs">Verified</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">Pending</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              {!driver.is_verified && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-green-500 text-white hover:bg-green-600 text-xs px-2 py-1"
                                    onClick={() => handleApprove(driver.id)}
                                    disabled={approveDriver.isPending}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1"
                                    onClick={() => handleReject(driver.id)}
                                    disabled={rejectDriver.isPending}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              <Button variant="outline" size="sm" className="text-xs px-2 py-1">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="secondary" size="sm" className="text-xs px-2 py-1">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
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
