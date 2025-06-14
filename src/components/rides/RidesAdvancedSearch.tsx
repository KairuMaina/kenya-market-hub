
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Car, MapPin, Clock, DollarSign, Search, X, Filter } from 'lucide-react';

interface RidesAdvancedSearchProps {
  onFiltersChange: (filters: any) => void;
  className?: string;
}

const RidesAdvancedSearch = ({ onFiltersChange, className }: RidesAdvancedSearchProps) => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('all');
  const [serviceArea, setServiceArea] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [departureTime, setDepartureTime] = useState('any');
  const [instantBooking, setInstantBooking] = useState(false);
  const [verifiedDrivers, setVerifiedDrivers] = useState(false);
  const [airConditioned, setAirConditioned] = useState(false);

  const vehicleTypes = [
    'Taxi (Car)', 'Motorbike', 'Tuk Tuk', 'Van', 'Bus', 'Truck'
  ];

  const serviceAreas = [
    'Nairobi CBD', 'Westlands', 'Karen', 'Kileleshwa', 'Kasarani',
    'Mombasa Island', 'Nyali', 'Kisumu Central', 'Nakuru Town'
  ];

  const timeSlots = [
    'Early Morning (5-8 AM)', 'Morning (8-12 PM)', 
    'Afternoon (12-5 PM)', 'Evening (5-8 PM)', 'Night (8 PM+)'
  ];

  const handleSearch = () => {
    onFiltersChange({
      fromLocation,
      toLocation,
      vehicleType,
      serviceArea,
      priceRange,
      departureTime,
      instantBooking,
      verifiedDrivers,
      airConditioned
    });
  };

  const clearFilters = () => {
    setFromLocation('');
    setToLocation('');
    setVehicleType('all');
    setServiceArea('all');
    setPriceRange([0, 5000]);
    setDepartureTime('any');
    setInstantBooking(false);
    setVerifiedDrivers(false);
    setAirConditioned(false);
    onFiltersChange({});
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Find Your Perfect Ride
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-green-600" />
              From
            </label>
            <Input
              placeholder="Enter pickup location"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-red-600" />
              To
            </label>
            <Input
              placeholder="Enter destination"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Options */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="instantBooking"
              checked={instantBooking}
              onCheckedChange={(checked) => setInstantBooking(checked === true)}
            />
            <label htmlFor="instantBooking" className="text-sm">Instant Booking</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verifiedDrivers"
              checked={verifiedDrivers}
              onCheckedChange={(checked) => setVerifiedDrivers(checked === true)}
            />
            <label htmlFor="verifiedDrivers" className="text-sm">Verified Drivers Only</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="airConditioned"
              checked={airConditioned}
              onCheckedChange={(checked) => setAirConditioned(checked === true)}
            />
            <label htmlFor="airConditioned" className="text-sm">Air Conditioned</label>
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Car className="h-3 w-3 mr-1" />
              Vehicle Type
            </label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Any Vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Vehicle</SelectItem>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase().replace(/[^a-z]/g, '')}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Service Area</label>
            <Select value={serviceArea} onValueChange={setServiceArea}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {serviceAreas.map((area) => (
                  <SelectItem key={area} value={area.toLowerCase()}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Departure Time
            </label>
            <Select value={departureTime} onValueChange={setDepartureTime}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Any Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Time</SelectItem>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot.toLowerCase()}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center">
            <DollarSign className="h-3 w-3 mr-1" />
            Budget Range: KSh {priceRange[0]} - KSh {priceRange[1]}
          </label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={5000}
            min={0}
            step={100}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleSearch} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Find Rides
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RidesAdvancedSearch;
