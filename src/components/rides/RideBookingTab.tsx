
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import EnhancedRideBooking from '@/components/EnhancedRideBooking';
import { useRideNotifications } from '@/hooks/useRideNotifications';

interface RideBookingTabProps {
  onRideBooked: (rideId: string) => void;
}

const RideBookingTab = ({ onRideBooked }: RideBookingTabProps) => {
  // Enable ride notifications
  useRideNotifications();

  return (
    <TabsContent value="book" className="p-6 pt-0 space-y-4">
      <EnhancedRideBooking onRideBooked={onRideBooked} />
    </TabsContent>
  );
};

export default RideBookingTab;
