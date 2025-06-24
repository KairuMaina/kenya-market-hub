
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Briefcase, CheckCircle, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useAdminServiceBookings, AdminServiceBooking } from '@/hooks/useAdminServiceBookings';
import { ViewButton, EditButton } from '@/components/ui/action-buttons';
import BookingDetailsModal from '@/components/admin/BookingDetailsModal';

const AdminServiceBookings = () => {
  const { data: bookings, isLoading } = useAdminServiceBookings();
  const [selectedBooking, setSelectedBooking] = useState<AdminServiceBooking | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
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

  const handleViewDetails = (booking: AdminServiceBooking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const totalBookings = bookings?.length || 0;
  const confirmedBookings = bookings?.filter(booking => booking.status === 'confirmed').length || 0;
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
                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                <Briefcase className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{confirmedBookings}</div>
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
              <CardTitle className="text-2xl">All Bookings</CardTitle>
              <CardDescription>View and manage all service bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  <span className="ml-2 text-lg">Loading bookings...</span>
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
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings && bookings.length > 0 ? (
                        bookings.map((booking) => (
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
                              {booking.total_amount ? `KSH ${Number(booking.total_amount).toLocaleString()}` : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(booking.status) as any} className="capitalize">
                                {booking.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="space-x-2">
                              <ViewButton onClick={() => handleViewDetails(booking)} />
                              <EditButton onClick={() => console.log('Edit booking:', booking.id)} />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No service bookings found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedBooking(null);
          }}
        />
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminServiceBookings;
