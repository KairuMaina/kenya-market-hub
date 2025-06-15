import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Car, Eye, MapPin, Star, CheckCircle, XCircle, Users } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useToast } from '@/hooks/use-toast';

const AdminDrivers = () => {
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch drivers with user profiles separately
  const { data: drivers, isLoading } = useQuery({
    queryKey: ['admin-drivers'],
    queryFn: async () => {
      const { data: driversData, error: driversError } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (driversError) {
        console.error("Supabase driversError:", driversError);
        throw driversError;
      }
      if (!driversData) {
        console.warn("No drivers data from Supabase.");
        return [];
      }
      const userIds = [...new Set(driversData.map(driver => driver.user_id))];
      if (!userIds.length) {
        console.warn("No userIds for drivers found.");
        return [];
      }
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone')
        .in('id', userIds);

      if (profilesError) {
        console.error("Supabase profilesError:", profilesError);
        throw profilesError;
      }

      // Combine the data
      const driversWithProfiles = driversData.map(driver => ({
        ...driver,
        user_profile: profilesData.find(profile => profile.id === driver.user_id)
      }));

      console.log("Drivers fetched:", driversWithProfiles);

      return driversWithProfiles || [];
    }
  });

  // Verify driver mutation
  const verifyDriver = useMutation({
    mutationFn: async (driverId: string) => {
      const { error } = await supabase
        .from('drivers')
        .update({ is_verified: true })
        .eq('id', driverId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-drivers'] });
      toast({
        title: "Driver Verified",
        description: "Driver has been verified successfully.",
      });
    },
    onError: (error) => {
      console.error('Error verifying driver:', error);
      toast({
        title: "Error",
        description: "Failed to verify driver.",
        variant: "destructive",
      });
    },
  });

  // Deactivate driver mutation
  const deactivateDriver = useMutation({
    mutationFn: async (driverId: string) => {
      const { error } = await supabase
        .from('drivers')
        .update({ is_active: false })
        .eq('id', driverId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-drivers'] });
      toast({
        title: "Driver Deactivated",
        description: "Driver has been deactivated.",
      });
    },
    onError: (error) => {
      console.error('Error deactivating driver:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate driver.",
        variant: "destructive",
      });
    },
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

  const handleView = (driver: any) => {
    setSelectedDriver(driver);
    setIsViewModalOpen(true);
  };

  const handleVerify = (driverId: string) => {
    verifyDriver.mutate(driverId);
  };

  const handleDeactivate = (driverId: string) => {
    deactivateDriver.mutate(driverId);
  };

  // Calculate statistics
  const totalDrivers = drivers?.length || 0;
  const activeDrivers = drivers?.filter(driver => driver.is_active).length || 0;
  const verifiedDrivers = drivers?.filter(driver => driver.is_verified).length || 0;
  const averageRating = drivers?.length ? 
    (drivers.reduce((sum, driver) => sum + (Number(driver.rating) || 0), 0) / drivers.length).toFixed(1) : '0.0';

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6 sm:h-8 sm:w-8" />
              Driver Management
            </h1>
            <p className="text-green-100 mt-2 text-sm sm:text-base">Monitor and manage driver accounts</p>
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
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{activeDrivers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Verified</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{verifiedDrivers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{averageRating}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">All Drivers</CardTitle>
              <CardDescription className="text-sm">View and manage driver accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading drivers...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Driver</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Vehicle</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Rating</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Rides</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drivers?.map((driver) => (
                        <TableRow key={driver.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs sm:text-sm">
                            <div className="space-y-1">
                              <div className="font-medium">{driver.user_profile?.full_name || 'Unknown'}</div>
                              <div className="text-xs text-gray-500">{driver.user_profile?.email || 'No email'}</div>
                              <div className="text-xs text-gray-500">{driver.user_profile?.phone || driver.phone_number || 'No phone'}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            <div className="space-y-1">
                              <div className="font-medium">{driver.vehicle_make} {driver.vehicle_model}</div>
                              <div className="text-xs text-gray-500">{driver.license_plate}</div>
                              <Badge variant="outline" className="text-xs">
                                {driver.vehicle_type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{Number(driver.rating || 0).toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            {driver.total_rides || 0}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant={getStatusBadgeVariant(driver.status)} className="text-xs">
                                {driver.status || 'offline'}
                              </Badge>
                              {driver.is_verified ? (
                                <Badge variant="outline" className="text-xs text-green-600">
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs text-orange-600">
                                  Unverified
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs px-2 py-1"
                                onClick={() => handleView(driver)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              {!driver.is_verified && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-xs px-2 py-1 text-green-600"
                                  onClick={() => handleVerify(driver.id)}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                              {driver.is_active && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-xs px-2 py-1 text-red-600"
                                  onClick={() => handleDeactivate(driver.id)}
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              )}
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

          {/* View Driver Details Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Driver Details
                </DialogTitle>
                <DialogDescription>
                  {selectedDriver?.user_profile?.full_name || 'Driver Information'}
                </DialogDescription>
              </DialogHeader>
              
              {selectedDriver && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold">Personal Information</h3>
                        <div className="mt-2 space-y-2">
                          <p><span className="font-medium">Name:</span> {selectedDriver.user_profile?.full_name || 'Unknown'}</p>
                          <p><span className="font-medium">Email:</span> {selectedDriver.user_profile?.email || 'No email'}</p>
                          <p><span className="font-medium">Phone:</span> {selectedDriver.user_profile?.phone || selectedDriver.phone_number || 'No phone'}</p>
                          <p><span className="font-medium">License:</span> {selectedDriver.license_number}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold">Vehicle Information</h3>
                        <div className="mt-2 space-y-2">
                          <p><span className="font-medium">Make/Model:</span> {selectedDriver.vehicle_make} {selectedDriver.vehicle_model}</p>
                          <p><span className="font-medium">Year:</span> {selectedDriver.vehicle_year || 'Not specified'}</p>
                          <p><span className="font-medium">License Plate:</span> {selectedDriver.license_plate}</p>
                          <p><span className="font-medium">Type:</span> {selectedDriver.vehicle_type}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold">Performance</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>Rating: {Number(selectedDriver.rating || 0).toFixed(1)}</span>
                          </div>
                          <p><span className="font-medium">Total Rides:</span> {selectedDriver.total_rides || 0}</p>
                          <p><span className="font-medium">Status:</span> {selectedDriver.status || 'offline'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold">Account Status</h3>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={selectedDriver.is_verified ? 'default' : 'secondary'}>
                              {selectedDriver.is_verified ? 'Verified' : 'Unverified'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={selectedDriver.is_active ? 'default' : 'destructive'}>
                              {selectedDriver.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold">Registration</h3>
                        <div className="mt-2 space-y-2">
                          <p><span className="font-medium">Joined:</span> {new Date(selectedDriver.created_at).toLocaleDateString()}</p>
                          <p><span className="font-medium">Last Update:</span> {new Date(selectedDriver.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedDriver.documents && Object.keys(selectedDriver.documents).length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-bold mb-2">Documents</h3>
                      <div className="text-sm">
                        {Object.entries(selectedDriver.documents).map(([key, value]) => (
                          <p key={key}><span className="font-medium capitalize">{key.replace('_', ' ')}:</span> {String(value)}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminDrivers;
