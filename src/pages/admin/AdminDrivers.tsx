
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MapPin,
  Star
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminDrivers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const driversPerPage = 10;

  const { data: driversData, isLoading, error } = useQuery({
    queryKey: ['admin-drivers', currentPage, searchTerm],
    queryFn: async () => {
      console.log('🔍 Fetching drivers...', { currentPage, searchTerm });

      let query = supabase
        .from('drivers')
        .select(`
          *,
          profiles!inner(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`profiles.full_name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%,license_plate.ilike.%${searchTerm}%`);
      }

      const { data: drivers, error, count } = await query
        .range((currentPage - 1) * driversPerPage, currentPage * driversPerPage - 1);

      if (error) {
        console.error('❌ Error fetching drivers:', error);
        throw error;
      }

      console.log('✅ Drivers fetched successfully:', drivers?.length || 0);

      return {
        drivers: drivers || [],
        total: count || 0,
        totalPages: Math.ceil((count || 0) / driversPerPage)
      };
    }
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (isVerified: boolean) => {
    return isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (error) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">Error loading drivers data</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedAdminRoute>
    );
  }

  const drivers = driversData?.drivers || [];
  const driverStats = {
    total: drivers.length,
    verified: drivers.filter(d => d.is_verified).length,
    active: drivers.filter(d => d.is_active).length,
    available: drivers.filter(d => d.status === 'available').length
  };

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Car className="h-8 w-8" />
              Driver Management
            </h1>
            <p className="text-orange-100 mt-2">Manage all platform drivers and their verification status</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                    <p className="text-2xl font-bold text-gray-900">{driverStats.total}</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Verified</p>
                    <p className="text-2xl font-bold text-green-600">{driverStats.verified}</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-blue-600">{driverStats.active}</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-purple-600">{driverStats.available}</p>
                  </div>
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600">
                    <Car className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Drivers Table */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Drivers</CardTitle>
                  <CardDescription>
                    View and manage all registered drivers ({driversData?.total || 0} total)
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search drivers..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-orange-50 to-orange-100">
                          <TableHead className="font-semibold">Driver</TableHead>
                          <TableHead className="font-semibold">Vehicle</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Verified</TableHead>
                          <TableHead className="font-semibold">Rating</TableHead>
                          <TableHead className="font-semibold">Rides</TableHead>
                          <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {drivers.map((driver) => (
                          <TableRow 
                            key={driver.id} 
                            className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-200"
                          >
                            <TableCell>
                              <div>
                                <p className="font-medium">{driver.profiles?.full_name || 'Unknown Driver'}</p>
                                <p className="text-sm text-gray-500">{driver.profiles?.email}</p>
                                <p className="text-sm text-gray-500">{driver.phone_number}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {driver.vehicle_make} {driver.vehicle_model} ({driver.vehicle_year})
                                </p>
                                <p className="text-sm text-gray-500">{driver.license_plate}</p>
                                <Badge variant="outline" className="text-xs">
                                  {driver.vehicle_type?.replace('_', ' ')}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(driver.status || 'offline')}>
                                {driver.status?.replace('_', ' ') || 'Offline'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getVerificationColor(driver.is_verified)}>
                                {driver.is_verified ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Unverified
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="font-medium">{driver.rating || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-blue-600">
                                {driver.total_rides || 0}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {!driver.is_verified && (
                                  <Button 
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white"
                                >
                                  View
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {driversData && driversData.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * driversPerPage) + 1} to {Math.min(currentPage * driversPerPage, driversData.total)} of {driversData.total} drivers
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <span className="text-sm">
                          Page {currentPage} of {driversData.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, driversData.totalPages))}
                          disabled={currentPage === driversData.totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminDrivers;
