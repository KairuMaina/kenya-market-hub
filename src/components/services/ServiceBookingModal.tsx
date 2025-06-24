
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;
  business_description: string;
  provider_type: string;
  location_address: string;
  phone_number: string;
  email: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ServiceProvider;
}

const ServiceBookingModal = ({ isOpen, onClose, provider }: ServiceBookingModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [notes, setNotes] = useState('');

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('service_bookings')
        .insert({
          customer_id: user.id,
          provider_id: provider.user_id,
          service_type: provider.provider_type,
          service_description: serviceDescription,
          booking_date: new Date(`${format(selectedDate!, 'yyyy-MM-dd')} ${selectedTime}`).toISOString(),
          booking_time: selectedTime,
          booking_address: customerAddress,
          total_amount: estimatedAmount ? parseFloat(estimatedAmount) : null,
          notes: notes,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (booking) => {
      toast({
        title: 'Booking Created Successfully!',
        description: `Your service booking with ${provider.business_name} has been created. You will be redirected to payment.`
      });
      
      queryClient.invalidateQueries({ queryKey: ['service-bookings'] });
      onClose();
      
      // Navigate to checkout with booking details
      navigate('/checkout', {
        state: {
          type: 'service',
          booking: booking,
          provider: provider,
          amount: estimatedAmount ? parseFloat(estimatedAmount) : 0
        }
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to book a service.',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedDate || !selectedTime || !serviceDescription || !customerAddress) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    createBookingMutation.mutate({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Book Service with {provider.business_name}
          </DialogTitle>
          <DialogDescription>
            Schedule your appointment and provide service details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Provider Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{provider.business_name}</h3>
            <p className="text-sm text-gray-600 mb-2">{provider.business_description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{provider.location_address}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{provider.profiles?.full_name}</span>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="booking-date">Select Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="booking-time">Select Time *</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Choose time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service Description */}
          <div className="space-y-2">
            <Label htmlFor="service-description">Service Description *</Label>
            <Textarea
              id="service-description"
              placeholder="Describe the service you need..."
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Customer Address */}
          <div className="space-y-2">
            <Label htmlFor="customer-address">Service Address *</Label>
            <Input
              id="customer-address"
              placeholder="Where should the service be performed?"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>

          {/* Estimated Amount */}
          <div className="space-y-2">
            <Label htmlFor="estimated-amount">Estimated Amount (KSH)</Label>
            <Input
              id="estimated-amount"
              type="number"
              placeholder="0.00"
              value={estimatedAmount}
              onChange={(e) => setEstimatedAmount(e.target.value)}
            />
            <p className="text-sm text-gray-600">
              This is an estimate. Final amount will be confirmed by the provider.
            </p>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or additional information..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
              disabled={createBookingMutation.isPending}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {createBookingMutation.isPending ? 'Creating Booking...' : 'Book & Pay'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceBookingModal;
