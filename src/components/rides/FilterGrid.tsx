
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Clock } from 'lucide-react';

interface FilterGridProps {
  vehicleType: string;
  serviceArea: string;
  departureTime: string;
  onVehicleTypeChange: (value: string) => void;
  onServiceAreaChange: (value: string) => void;
  onDepartureTimeChange: (value: string) => void;
}

const FilterGrid = ({
  vehicleType,
  serviceArea,
  departureTime,
  onVehicleTypeChange,
  onServiceAreaChange,
  onDepartureTimeChange
}: FilterGridProps) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center">
          <Car className="h-3 w-3 mr-1" />
          Vehicle Type
        </label>
        <Select value={vehicleType} onValueChange={onVehicleTypeChange}>
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
        <Select value={serviceArea} onValueChange={onServiceAreaChange}>
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
        <Select value={departureTime} onValueChange={onDepartureTimeChange}>
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
  );
};

export default FilterGrid;
