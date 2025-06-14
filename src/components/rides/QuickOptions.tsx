
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface QuickOptionsProps {
  instantBooking: boolean;
  verifiedDrivers: boolean;
  airConditioned: boolean;
  onInstantBookingChange: (checked: boolean) => void;
  onVerifiedDriversChange: (checked: boolean) => void;
  onAirConditionedChange: (checked: boolean) => void;
}

const QuickOptions = ({
  instantBooking,
  verifiedDrivers,
  airConditioned,
  onInstantBookingChange,
  onVerifiedDriversChange,
  onAirConditionedChange
}: QuickOptionsProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="instantBooking"
          checked={instantBooking}
          onCheckedChange={(checked) => onInstantBookingChange(checked === true)}
        />
        <label htmlFor="instantBooking" className="text-sm">Instant Booking</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="verifiedDrivers"
          checked={verifiedDrivers}
          onCheckedChange={(checked) => onVerifiedDriversChange(checked === true)}
        />
        <label htmlFor="verifiedDrivers" className="text-sm">Verified Drivers Only</label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="airConditioned"
          checked={airConditioned}
          onCheckedChange={(checked) => onAirConditionedChange(checked === true)}
        />
        <label htmlFor="airConditioned" className="text-sm">Air Conditioned</label>
      </div>
    </div>
  );
};

export default QuickOptions;
