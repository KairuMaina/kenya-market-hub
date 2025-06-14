
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Building, Eye, Edit, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminProperties = () => {
  const { toast } = useToast();

  // Fetch properties without joins initially
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Properties fetch error:', error);
        throw error;
      }
      return data || [];
    }
  });

  // Fetch profiles separately to get owner information
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'default';
      case 'sold':
      case 'rented':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'unavailable':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getOwnerInfo = (ownerId: string) => {
    const profile = profiles?.find(p => p.id === ownerId);
    return profile ? (profile.full_name || profile.email || 'Unknown') : 'Unknown';
  };

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building className="h-8 w-8" />
              Property Management
            </h1>
            <p className="text-green-100 mt-2">Manage real estate properties and listings</p>
          </div>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Properties</CardTitle>
                  <CardDescription>View and manage all property listings</CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {propertiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-2">Loading properties...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <TableHead className="font-semibold">Property</TableHead>
                        <TableHead className="font-semibold">Owner</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Views</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties?.map((property) => (
                        <TableRow 
                          key={property.id} 
                          className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200"
                        >
                          <TableCell className="font-medium">{property.title}</TableCell>
                          <TableCell>{getOwnerInfo(property.owner_id)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{property.property_type}</Badge>
                          </TableCell>
                          <TableCell className="max-w-32 truncate">{property.location_address}</TableCell>
                          <TableCell className="font-semibold text-green-600">
                            KSH {Number(property.price || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(property.status)}>
                              {property.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{property.views_count || 0}</TableCell>
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

export default AdminProperties;
