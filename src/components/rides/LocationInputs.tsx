
import React from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface LocationInputsProps {
  fromLocation: string;
  toLocation: string;
  onFromLocationChange: (value: string) => void;
  onToLocationChange: (value: string) => void;
}

const LocationInputs = ({ 
  fromLocation, 
  toLocation, 
  onFromLocationChange, 
  onToLocationChange 
}: LocationInputsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center">
          <MapPin className="h-3 w-3 mr-1 text-green-600" />
          From
        </label>
        <Input
          placeholder="Enter pickup location"
          value={fromLocation}
          onChange={(e) => onFromLocationChange(e.target.value)}
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
          onChange={(e) => onToLocationChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default LocationInputs;
