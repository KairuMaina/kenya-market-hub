
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Star, User, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServiceProvider {
  id: string;
  name: string;
  rating: number;
  reviews_count: number;
  hourly_rate: number;
  availability: string[];
  services: string[];
  bio: string;
  image?: string;
  location: string;
}

interface ServiceBookingSystemProps {
  provider: ServiceProvider;
  service_type: string;
  onBookingComplete: (bookingId: string) => void;
}

const ServiceBookingSystem: React.FC<ServiceBookingSystemProps> = ({
  provider,
  service_type,
  onBookingComplete
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(2);
  const [description, setDescription] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedTime || !customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);
    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingId = `BK${Date.now()}`;
      
      toast({
        title: "Booking Confirmed!",
        description: `Your service is booked for ${selectedDate} at ${selectedTime}`,
      });
      
      onBookingComplete(bookingId);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  const totalCost = provider.hourly_rate * duration;

  // Generate next 14 days for date selection
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-6">
      {/* Provider Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              {provider.image ? (
                <img 
                  src={provider.image} 
                  alt={provider.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{provider.name}</h2>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{provider.rating}</span>
                  <span className="text-gray-600">({provider.reviews_count} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {provider.services.map((service, index) => (
                  <Badge key={index} variant="outline">
                    {service}
                  </Badge>
                ))}
              </div>
              
              <p className="text-gray-700 text-sm mb-4">{provider.bio}</p>
              
              <div className="text-2xl font-bold text-green-600">
                KSh {provider.hourly_rate.toLocaleString()}/hour
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Book {service_type} Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date & Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Select Date</Label>
              <select
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Choose date</option>
                {availableDates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="time">Select Time</Label>
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-2 border rounded-md"
                disabled={!selectedDate}
              >
                <option value="">Choose time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="8"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
            />
          </div>

          {/* Service Description */}
          <div>
            <Label htmlFor="description">Service Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what you need help with..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="+254712345678"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Service Address</Label>
              <Textarea
                id="address"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                placeholder="Where should the service be provided?"
                rows={2}
              />
            </div>
          </div>

          {/* Cost Summary */}
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service Rate:</span>
                  <span>KSh {provider.hourly_rate.toLocaleString()}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{duration} hour{duration > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Cost:</span>
                  <span className="text-green-600">KSh {totalCost.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Book Button */}
          <Button 
            onClick={handleBookingSubmit}
            disabled={isBooking || !selectedDate || !selectedTime || !customerInfo.name || !customerInfo.phone}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            {isBooking ? 'Processing...' : `Book Service - KSh ${totalCost.toLocaleString()}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceBookingSystem;
