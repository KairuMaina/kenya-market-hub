
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UberLikeRideBooking from '@/components/rides/UberLikeRideBooking';
import RideHistoryTab from '@/components/rides/RideHistoryTab';
import HeroSection from '@/components/shared/HeroSection';

const Rides = () => {
  const { user, loading } = useAuth();

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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Hero Section with Image Backdrop */}
        <HeroSection
          title="Ride Booking"
          subtitle="Safe & Reliable Transport"
          description="Book rides with verified drivers. Get around Kenya safely and conveniently."
          imageUrl="photo-1449824913935-59a10b8d2000"
          className="mb-0"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-0">
              <Tabs defaultValue="book" className="space-y-4">
                <div className="p-6 pb-0">
                  <TabsList className="grid w-full max-w-md grid-cols-2 bg-orange-100 mx-auto">
                    <TabsTrigger 
                      value="book" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
                    >
                      Book a Ride
                    </TabsTrigger>
                    <TabsTrigger 
                      value="history" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
                    >
                      My Rides
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="book" className="p-6 pt-0">
                  <UberLikeRideBooking />
                </TabsContent>

                <TabsContent value="history" className="p-6 pt-0">
                  <RideHistoryTab />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Rides;
