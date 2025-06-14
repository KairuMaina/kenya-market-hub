
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Eye, Edit, Mail, Phone, Clock } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminPropertyViewings = () => {
  const { data: viewings, isLoading } = useQuery({
    queryKey: ['admin-property-viewings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_viewings')
        .select('*')
        .order('viewing_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: properties } = useQuery({
    queryKey: ['admin-properties-for-viewings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title');
      
      if (error) {
        console.error('Properties fetch error:', error);
        return [];
      }
      return data || [];
    }
  });

  const getPropertyTitle = (propertyId: string) => {
    const property = properties?.find(p => p.id === propertyId);
    return property?.title || 'Unknown Property';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const totalViewings = viewings?.length || 0;
  const scheduledViewings = viewings?.filter(viewing => viewing.status === 'scheduled').length || 0;
  const completedViewings = viewings?.filter(viewing => viewing.status === 'completed').length || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-8 w-8" />
              Property Viewings
            </h1>
            <p className="text-purple-100 mt-2">Manage property viewing appointments and schedules</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Viewings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViewings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scheduledViewings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Eye className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedViewings}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Property Viewings</CardTitle>
              <CardDescription>View and manage property viewing appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2">Loading viewings...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Viewer</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewings?.map((viewing) => (
                        <TableRow key={viewing.id}>
                          <TableCell className="font-medium">
                            {viewing.viewer_name}
                          </TableCell>
                          <TableCell>{getPropertyTitle(viewing.property_id)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {viewing.viewer_email}
                              </div>
                              {viewing.viewer_phone && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="h-3 w-3" />
                                  {viewing.viewer_phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {new Date(viewing.viewing_date).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {viewing.viewing_time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(viewing.status)}>
                              {viewing.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {viewing.notes || 'No notes'}
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

export default AdminPropertyViewings;
