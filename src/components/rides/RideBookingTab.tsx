
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import EnhancedRideBooking from '@/components/EnhancedRideBooking';

interface RideBookingTabProps {
  onRideBooked: (rideId: string) => void;
}

const RideBookingTab = ({ onRideBooked }: RideBookingTabProps) => {
  return (
    <TabsContent value="book" className="p-6 pt-0 space-y-4">
      <EnhancedRideBooking onRideBooked={onRideBooked} />
    </TabsContent>
  );
};

export default RideBookingTab;
