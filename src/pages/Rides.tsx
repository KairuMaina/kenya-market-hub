
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEnhancedRides, useRideMatchingRequests } from '@/hooks/useEnhancedRides';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import RidesHeader from '@/components/rides/RidesHeader';
import RidesSearchSection from '@/components/rides/RidesSearchSection';
import RideBookingTab from '@/components/rides/RideBookingTab';
import RideHistoryTab from '@/components/rides/RideHistoryTab';

const Rides = () => {
  const { user, loading } = useAuth();
  const { data: rides, isLoading } = useEnhancedRides();
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const { data: matchingRequests } = useRideMatchingRequests(selectedRideId || undefined);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleAdvancedFiltersChange = (filters: any) => {
    setSearchFilters(filters);
    console.log('Applied ride filters:', filters);
  };

  const handleRideBooked = (rideId: string) => {
    setSelectedRideId(rideId);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <RidesHeader />

        <RidesSearchSection
          showAdvancedSearch={showAdvancedSearch}
          onToggleAdvancedSearch={() => setShowAdvancedSearch(!showAdvancedSearch)}
          onFiltersChange={handleAdvancedFiltersChange}
        />

        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-0">
            <Tabs defaultValue="book" className="space-y-4">
              <div className="p-6 pb-0">
                <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100">
                  <TabsTrigger value="book" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Book a Ride
                  </TabsTrigger>
                  <TabsTrigger value="history" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    My Rides
                  </TabsTrigger>
                </TabsList>
              </div>

              <RideBookingTab onRideBooked={handleRideBooked} />
              <RideHistoryTab />
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Rides;
