
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, TrendingUp, MapPin, Edit, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminRidePricing = () => {
  const { data: fareCalculations, isLoading: fareLoading } = useQuery({
    queryKey: ['admin-fare-calculations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fare_calculations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: surgePricing, isLoading: surgeLoading } = useQuery({
    queryKey: ['admin-surge-pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surge_pricing')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const activeFares = fareCalculations?.filter(fare => fare.is_active).length || 0;
  const activeSurgeZones = surgePricing?.filter(surge => surge.is_active).length || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <DollarSign className="h-8 w-8" />
              Ride Pricing Management
            </h1>
            <p className="text-yellow-100 mt-2">Manage fare calculations and surge pricing</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Fare Plans</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeFares}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Surge Zones</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSurgeZones}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vehicle Types</CardTitle>
                <MapPin className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fareCalculations?.length || 0}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Fare Calculations</CardTitle>
                    <CardDescription>Base fare rates by vehicle type</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Fare
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {fareLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                    <span className="ml-2">Loading fares...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vehicle Type</TableHead>
                          <TableHead>Base Fare</TableHead>
                          <TableHead>Per KM</TableHead>
                          <TableHead>Per Min</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fareCalculations?.map((fare) => (
                          <TableRow key={fare.id}>
                            <TableCell className="font-medium capitalize">
                              {fare.vehicle_type}
                            </TableCell>
                            <TableCell>KSH {Number(fare.base_fare).toLocaleString()}</TableCell>
                            <TableCell>KSH {Number(fare.per_km_rate).toLocaleString()}</TableCell>
                            <TableCell>KSH {Number(fare.per_minute_rate).toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant={fare.is_active ? "default" : "outline"}>
                                {fare.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
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

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Surge Pricing</CardTitle>
                    <CardDescription>Location-based surge multipliers</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Zone
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {surgeLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    <span className="ml-2">Loading surge zones...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Location</TableHead>
                          <TableHead>Vehicle Type</TableHead>
                          <TableHead>Multiplier</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {surgePricing?.map((surge) => (
                          <TableRow key={surge.id}>
                            <TableCell className="font-medium">
                              {surge.location_name}
                            </TableCell>
                            <TableCell className="capitalize">{surge.vehicle_type}</TableCell>
                            <TableCell className="font-bold text-orange-600">
                              {Number(surge.surge_multiplier).toFixed(1)}x
                            </TableCell>
                            <TableCell>
                              {surge.start_time && surge.end_time 
                                ? `${surge.start_time} - ${surge.end_time}`
                                : 'All day'
                              }
                            </TableCell>
                            <TableCell>
                              <Badge variant={surge.is_active ? "default" : "outline"}>
                                {surge.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
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
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminRidePricing;
