
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, User, Briefcase, Eye, Edit, CheckCircle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminServiceBookings = () => {
  // Fetch service bookings - using placeholder data since service_bookings table doesn't exist yet
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-service-bookings'],
    queryFn: async () => {
      // This would be the actual query when service_bookings table exists
      // const { data, error } = await supabase
      //   .from('service_bookings')
      //   .select('*')
      //   .order('created_at', { ascending: false });
      
      // For now, return mock data
      return [
        {
          id: '1',
          service_provider_id: '1',
          customer_id: '1',
          service_type: 'plumbing',
          booking_date: '2024-01-15',
          booking_time: '10:00',
          status: 'scheduled',
          total_amount: 5000,
          customer_name: 'John Doe',
          provider_name: 'Quick Fix Plumbing',
          description: 'Fix kitchen sink leak'
        },
        {
          id: '2',
          service_provider_id: '2',
          customer_id: '2',
          service_type: 'cleaning',
          booking_date: '2024-01-16',
          booking_time: '14:00',
          status: 'completed',
          total_amount: 3000,
          customer_name: 'Jane Smith',
          provider_name: 'Clean House Services',
          description: 'Deep cleaning service'
        }
      ];
    }
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const totalBookings = bookings?.length || 0;
  const scheduledBookings = bookings?.filter(booking => booking.status === 'scheduled').length || 0;
  const completedBookings = bookings?.filter(booking => booking.status === 'completed').length || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-8 w-8" />
              Service Bookings
            </h1>
            <p className="text-indigo-100 mt-2">Manage service bookings and appointments</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBookings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                <Briefcase className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scheduledBookings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedBookings}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Service Bookings</CardTitle>
              <CardDescription>View and manage service bookings and appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-2">Loading bookings...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service Provider</TableHead>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings?.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {booking.customer_name}
                            </div>
                          </TableCell>
                          <TableCell>{booking.provider_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {booking.service_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {new Date(booking.booking_date).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.booking_time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            KSH {Number(booking.total_amount).toLocaleString()}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {booking.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(booking.status)}>
                              {booking.status}
                            </Badge>
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

export default AdminServiceBookings;
