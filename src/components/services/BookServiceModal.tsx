
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
}

const BookServiceModal: React.FC<BookServiceModalProps> = ({ isOpen, onClose, service }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    booking_date: '',
    booking_time: '09:00',
    booking_address: '',
    service_description: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to book a service.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        customer_id: user.id,
        provider_id: service.user_id, // Use user_id instead of id to avoid foreign key constraint
        service_type: service.provider_type,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        booking_address: formData.booking_address,
        service_description: formData.service_description || `${service.provider_type} service from ${service.business_name}`,
        notes: formData.notes,
        status: 'pending',
        payment_status: 'pending'
      };

      const { error } = await supabase
        .from('service_bookings')
        .insert([bookingData]);

      if (error) throw error;

      toast({
        title: 'Booking Submitted',
        description: 'Your service booking has been submitted successfully. The provider will contact you soon.'
      });

      onClose();
      setFormData({
        booking_date: '',
        booking_time: '09:00',
        booking_address: '',
        service_description: '',
        notes: ''
      });
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: error.message || 'There was an error submitting your booking.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-orange-500" />
            Book Service with {service.business_name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="booking_date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Preferred Date
            </Label>
            <Input
              id="booking_date"
              type="date"
              value={formData.booking_date}
              onChange={(e) => setFormData(prev => ({ ...prev, booking_date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              required
              className="border-orange-200 focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking_time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Preferred Time
            </Label>
            <Input
              id="booking_time"
              type="time"
              value={formData.booking_time}
              onChange={(e) => setFormData(prev => ({ ...prev, booking_time: e.target.value }))}
              required
              className="border-orange-200 focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking_address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Service Location
            </Label>
            <Input
              id="booking_address"
              value={formData.booking_address}
              onChange={(e) => setFormData(prev => ({ ...prev, booking_address: e.target.value }))}
              placeholder="Enter the address where service is needed"
              required
              className="border-orange-200 focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_description">Service Description</Label>
            <Textarea
              id="service_description"
              value={formData.service_description}
              onChange={(e) => setFormData(prev => ({ ...prev, service_description: e.target.value }))}
              placeholder="Describe what service you need..."
              rows={3}
              className="border-orange-200 focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information..."
              rows={2}
              className="border-orange-200 focus:border-orange-500"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {isSubmitting ? 'Booking...' : 'Book Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookServiceModal;
