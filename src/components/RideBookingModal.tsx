
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Car, MapPin, Clock } from 'lucide-react';
import { useRides, RideBooking } from '@/hooks/useRides';

interface RideBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RideBookingModal: React.FC<RideBookingModalProps> = ({ isOpen, onClose }) => {
  const [booking, setBooking] = useState<RideBooking>({
    pickupAddress: '',
    destinationAddress: '',
    vehicleType: 'taxi',
    pickupLocation: { lat: -1.2921, lng: 36.8219 }, // Nairobi default
    destinationLocation: { lat: -1.2921, lng: 36.8219 },
  });

  const { bookRide, isBookingRide } = useRides();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking.pickupAddress || !booking.destinationAddress) {
      return;
    }
    
    bookRide(booking);
    onClose();
    
    // Reset form
    setBooking({
      pickupAddress: '',
      destinationAddress: '',
      vehicleType: 'taxi',
      pickupLocation: { lat: -1.2921, lng: 36.8219 },
      destinationLocation: { lat: -1.2921, lng: 36.8219 },
    });
  };

  const vehicleOptions = [
    {
      type: 'taxi' as const,
      name: 'Taxi',
      price: 'KSh 150',
      time: '5-10 min',
      icon: Car,
    },
    {
      type: 'motorbike' as const,
      name: 'Motorbike',
      price: 'KSh 80',
      time: '3-8 min',
      icon: Car,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Ride</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="pickup">Pickup Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="pickup"
                  placeholder="Enter pickup address"
                  value={booking.pickupAddress}
                  onChange={(e) => setBooking(prev => ({ ...prev, pickupAddress: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="destination">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="destination"
                  placeholder="Enter destination address"
                  value={booking.destinationAddress}
                  onChange={(e) => setBooking(prev => ({ ...prev, destinationAddress: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Choose Vehicle Type</Label>
            <RadioGroup
              value={booking.vehicleType}
              onValueChange={(value: 'taxi' | 'motorbike') => 
                setBooking(prev => ({ ...prev, vehicleType: value }))
              }
              className="mt-2"
            >
              {vehicleOptions.map((vehicle) => (
                <div key={vehicle.type} className="flex items-center space-x-3 rounded-lg border p-3">
                  <RadioGroupItem value={vehicle.type} id={vehicle.type} />
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <vehicle.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{vehicle.name}</div>
                      <div className="text-sm text-gray-600 flex items-center space-x-2">
                        <span>From {vehicle.price}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{vehicle.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isBookingRide}>
              {isBookingRide ? 'Booking...' : 'Book Ride'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RideBookingModal;
