
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import LocationInputs from './LocationInputs';
import QuickOptions from './QuickOptions';
import FilterGrid from './FilterGrid';
import PriceRangeSlider from './PriceRangeSlider';

interface RidesAdvancedSearchProps {
  onFiltersChange: (filters: any) => void;
  className?: string;
}

const RidesAdvancedSearch = ({ onFiltersChange, className }: RidesAdvancedSearchProps) => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [vehicleType, setVehicleType] = useState('all');
  const [serviceArea, setServiceArea] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [departureTime, setDepartureTime] = useState('any');
  const [instantBooking, setInstantBooking] = useState(false);
  const [verifiedDrivers, setVerifiedDrivers] = useState(false);
  const [airConditioned, setAirConditioned] = useState(false);

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
        <LocationInputs
          fromLocation={fromLocation}
          toLocation={toLocation}
          onFromLocationChange={setFromLocation}
          onToLocationChange={setToLocation}
        />

        <QuickOptions
          instantBooking={instantBooking}
          verifiedDrivers={verifiedDrivers}
          airConditioned={airConditioned}
          onInstantBookingChange={setInstantBooking}
          onVerifiedDriversChange={setVerifiedDrivers}
          onAirConditionedChange={setAirConditioned}
        />

        <FilterGrid
          vehicleType={vehicleType}
          serviceArea={serviceArea}
          departureTime={departureTime}
          onVehicleTypeChange={setVehicleType}
          onServiceAreaChange={setServiceArea}
          onDepartureTimeChange={setDepartureTime}
        />

        <PriceRangeSlider
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
        />

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
