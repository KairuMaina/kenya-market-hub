
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Car, Eye, MapPin, Clock, DollarSign, User, Star } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminRides = () => {
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch rides
  const { data: rides, isLoading } = useQuery({
    queryKey: ['admin-rides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch profiles for user and driver names
  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles-for-rides'],
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

  const getUserName = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile ? (profile.full_name || profile.email) : 'Unknown';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'requested':
        return 'outline';
      case 'accepted':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'in_progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleView = (ride: any) => {
    setSelectedRide(ride);
    setIsViewModalOpen(true);
  };

  // Calculate statistics
  const totalRides = rides?.length || 0;
  const completedRides = rides?.filter(ride => ride.status === 'completed').length || 0;
  const activeRides = rides?.filter(ride => ['requested', 'accepted', 'in_progress'].includes(ride.status)).length || 0;
  const cancelledRides = rides?.filter(ride => ride.status === 'cancelled').length || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6 sm:h-8 sm:w-8" />
              Ride Management
            </h1>
            <p className="text-blue-100 mt-2 text-sm sm:text-base">Manage ride requests and transportation</p>
          </div>

          {/* Ride Statistics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Rides</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{totalRides}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Completed</CardTitle>
                <Clock className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{completedRides}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Active</CardTitle>
                <User className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{activeRides}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Cancelled</CardTitle>
                <DollarSign className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{cancelledRides}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">All Rides</CardTitle>
              <CardDescription className="text-sm">View and manage ride requests</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading rides...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Ride ID</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Customer</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Route</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Vehicle</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rides?.map((ride) => (
                        <TableRow key={ride.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs sm:text-sm">
                            <div className="font-mono text-xs">
                              #{ride.id.slice(-8)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(ride.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            <div className="space-y-1">
                              <div className="font-medium">{getUserName(ride.user_id)}</div>
                              {ride.driver_id && (
                                <div className="text-xs text-gray-500">
                                  Driver: {getUserName(ride.driver_id)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <MapPin className="h-3 w-3 text-green-600" />
                                <span className="truncate max-w-24">{ride.pickup_address}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <MapPin className="h-3 w-3 text-red-600" />
                                <span className="truncate max-w-24">{ride.destination_address}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {ride.vehicle_type}
                            </Badge>
                            {ride.actual_fare && (
                              <div className="text-xs text-green-600 mt-1">
                                KSH {Number(ride.actual_fare).toLocaleString()}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={getStatusBadgeVariant(ride.status)} 
                              className="text-xs"
                            >
                              {ride.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs px-2 py-1"
                              onClick={() => handleView(ride)}
                            >
                              <Eye className="h-3 w-3" />
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

          {/* View Ride Details Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Ride Details
                </DialogTitle>
                <DialogDescription>
                  Ride #{selectedRide?.id.slice(-8)}
                </DialogDescription>
              </DialogHeader>
              
              {selectedRide && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium">Customer:</span>
                        <p className="text-sm">{getUserName(selectedRide.user_id)}</p>
                      </div>
                      
                      {selectedRide.driver_id && (
                        <div>
                          <span className="text-sm font-medium">Driver:</span>
                          <p className="text-sm">{getUserName(selectedRide.driver_id)}</p>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-sm font-medium">Vehicle Type:</span>
                        <Badge variant="outline" className="ml-2">
                          {selectedRide.vehicle_type}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Status:</span>
                        <Badge variant={getStatusBadgeVariant(selectedRide.status)} className="ml-2">
                          {selectedRide.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium">Requested:</span>
                        <p className="text-sm">{new Date(selectedRide.requested_at).toLocaleString()}</p>
                      </div>
                      
                      {selectedRide.completed_at && (
                        <div>
                          <span className="text-sm font-medium">Completed:</span>
                          <p className="text-sm">{new Date(selectedRide.completed_at).toLocaleString()}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium">Distance:</span>
                          <p className="text-sm">{selectedRide.distance_km || 0} km</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Duration:</span>
                          <p className="text-sm">{selectedRide.duration_minutes || 0} min</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Pickup Location</h4>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{selectedRide.pickup_address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Destination</h4>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-600" />
                          <span className="text-sm">{selectedRide.destination_address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        KSH {Number(selectedRide.estimated_fare || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Estimated Fare</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        KSH {Number(selectedRide.actual_fare || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Actual Fare</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {selectedRide.rating || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>
                  
                  {selectedRide.review && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Customer Review:</span>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm">{selectedRide.review}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedRide.cancellation_reason && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Cancellation Reason:</span>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-700">{selectedRide.cancellation_reason}</p>
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

export default AdminRides;
