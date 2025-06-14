
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Car, Users, CheckCircle, Clock, Eye, UserCheck, Check, X, MapPin, Star } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useApprovalActions } from '@/hooks/useApprovalActions';

const AdminDrivers = () => {
  const { approveDriver, rejectDriver } = useApprovalActions();
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');

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

  // Fetch profiles for driver names
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
        return 'destructive';
      case 'offline':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getDriverOwner = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile ? (profile.full_name || profile.email || 'Unknown') : 'Unknown';
  };

  const handleApprove = (driver: any) => {
    setSelectedDriver(driver);
    setIsApprovalDialogOpen(true);
  };

  const handleReject = (driver: any) => {
    setSelectedDriver(driver);
    setIsRejectionDialogOpen(true);
  };

  const handleView = (driver: any) => {
    setSelectedDriver(driver);
    setIsViewModalOpen(true);
  };

  const confirmApproval = () => {
    if (selectedDriver) {
      approveDriver.mutate({ driverId: selectedDriver.id });
      setIsApprovalDialogOpen(false);
      setSelectedDriver(null);
    }
  };

  const confirmRejection = () => {
    if (selectedDriver) {
      rejectDriver.mutate({ 
        driverId: selectedDriver.id, 
        notes: rejectionNotes 
      });
      setIsRejectionDialogOpen(false);
      setSelectedDriver(null);
      setRejectionNotes('');
    }
  };

  // Calculate statistics
  const totalDrivers = drivers?.length || 0;
  const activeDrivers = drivers?.filter(driver => driver.is_active).length || 0;
  const verifiedDrivers = drivers?.filter(driver => driver.is_verified).length || 0;
  const availableDrivers = drivers?.filter(driver => driver.availability_status === 'available').length || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6 sm:h-8 sm:w-8" />
              Driver Management
            </h1>
            <p className="text-blue-100 mt-2 text-sm sm:text-base">Manage ride-sharing drivers and their applications</p>
          </div>

          {/* Driver Statistics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Drivers</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
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
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{verifiedDrivers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Available</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{availableDrivers}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">All Drivers</CardTitle>
              <CardDescription className="text-sm">View and manage driver accounts</CardDescription>
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
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Vehicle</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Contact</TableHead>
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
                              <div className="font-medium">{getDriverOwner(driver.user_id)}</div>
                              <div className="text-xs text-gray-500">ID: {driver.id.slice(-8)}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            <div className="space-y-1">
                              <div className="font-medium">{driver.vehicle_make} {driver.vehicle_model}</div>
                              <div className="text-xs text-gray-500">{driver.license_plate}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <div className="space-y-1">
                              <div>{driver.phone_number}</div>
                              <div className="text-gray-500">{driver.license_number}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{driver.rating || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {driver.is_active ? (
                                <Badge variant="default" className="text-xs">Active</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">Inactive</Badge>
                              )}
                              {driver.is_verified ? (
                                <Badge variant="default" className="text-xs">Verified</Badge>
                              ) : (
                                <Badge variant="destructive" className="text-xs">Unverified</Badge>
                              )}
                              <Badge variant={getStatusBadgeVariant(driver.availability_status)} className="text-xs">
                                {driver.availability_status || 'offline'}
                              </Badge>
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
                                    onClick={() => handleApprove(driver)}
                                    disabled={approveDriver.isPending}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1"
                                    onClick={() => handleReject(driver)}
                                    disabled={rejectDriver.isPending}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs px-2 py-1"
                                onClick={() => handleView(driver)}
                              >
                                <Eye className="h-3 w-3" />
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

          {/* Approval Dialog */}
          <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Driver</DialogTitle>
                <DialogDescription>
                  Are you sure you want to approve {getDriverOwner(selectedDriver?.user_id)}? 
                  This will verify their account and allow them to accept rides.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmApproval} disabled={approveDriver.isPending}>
                  {approveDriver.isPending ? 'Approving...' : 'Approve'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Rejection Dialog */}
          <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Driver</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting {getDriverOwner(selectedDriver?.user_id)}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="rejection-notes">Rejection Reason</Label>
                  <Textarea
                    id="rejection-notes"
                    placeholder="Enter the reason for rejection..."
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRejectionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmRejection} 
                  disabled={rejectDriver.isPending}
                >
                  {rejectDriver.isPending ? 'Rejecting...' : 'Reject'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View Driver Details Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Driver Details
                </DialogTitle>
                <DialogDescription>
                  View details for {getDriverOwner(selectedDriver?.user_id)}
                </DialogDescription>
              </DialogHeader>
              
              {selectedDriver && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Driver:</span>
                        <span className="text-sm">{getDriverOwner(selectedDriver.user_id)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Vehicle:</span>
                        <span className="text-sm">{selectedDriver.vehicle_make} {selectedDriver.vehicle_model} ({selectedDriver.vehicle_year})</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">License Plate:</span>
                        <span className="text-sm">{selectedDriver.license_plate}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Phone:</span>
                        <span className="text-sm">{selectedDriver.phone_number}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">License Number:</span>
                        <span className="text-sm">{selectedDriver.license_number}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Rating:</span>
                        <span className="text-sm">{selectedDriver.rating || 0} / 5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">{selectedDriver.total_rides || 0}</div>
                      <div className="text-sm text-gray-500">Total Rides</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {selectedDriver.is_verified ? 'Verified' : 'Unverified'}
                      </div>
                      <div className="text-sm text-gray-500">Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{selectedDriver.availability_status || 'offline'}</div>
                      <div className="text-sm text-gray-500">Availability</div>
                    </div>
                  </div>
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
