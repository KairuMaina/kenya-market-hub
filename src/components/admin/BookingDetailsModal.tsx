
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AdminServiceBooking } from '@/hooks/useAdminServiceBookings';
import { Calendar, User, MapPin, DollarSign, Clock, FileText } from 'lucide-react';

interface BookingDetailsModalProps {
  booking: AdminServiceBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, isOpen, onClose }) => {
  if (!booking) return null;

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this service booking
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Badge variant={getStatusBadgeVariant(booking.status) as any} className="capitalize">
                {booking.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Payment Status</label>
              <Badge variant="outline" className="capitalize">
                {booking.payment_status}
              </Badge>
            </div>
          </div>

          {/* Customer and Provider Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <User className="h-4 w-4" />
                Customer
              </label>
              <p className="text-sm">{booking.customer_name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <User className="h-4 w-4" />
                Service Provider
              </label>
              <p className="text-sm">{booking.provider_name}</p>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Service Type</label>
              <p className="text-sm capitalize">{booking.service_type}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <p className="text-sm">{booking.service_description}</p>
            </div>
          </div>

          {/* Date, Time, and Location */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Date
              </label>
              <p className="text-sm">{new Date(booking.booking_date).toLocaleDateString()}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Time
              </label>
              <p className="text-sm">{booking.booking_time}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Amount
              </label>
              <p className="text-sm font-semibold">KSH {Number(booking.total_amount).toLocaleString()}</p>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Address
            </label>
            <p className="text-sm">{booking.booking_address}</p>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Notes
              </label>
              <p className="text-sm bg-gray-50 p-3 rounded-md">{booking.notes}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Created At</label>
              <p className="text-xs text-gray-700">{new Date(booking.created_at).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">Last Updated</label>
              <p className="text-xs text-gray-700">{new Date(booking.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;
