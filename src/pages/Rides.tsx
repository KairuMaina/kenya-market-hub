
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
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading...</p>
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
          description="Book rides with verified drivers across Kenya."
          imageUrl="photo-1449824913935-59a10b8d2000"
          className="mb-0 rounded-b-3xl"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="shadow-lg border-0 bg-white rounded-2xl">
            <CardContent className="p-0">
              <Tabs defaultValue="book" className="space-y-3">
                <div className="p-4 pb-0">
                  <TabsList className="grid w-full max-w-sm grid-cols-2 bg-orange-100 mx-auto">
                    <TabsTrigger 
                      value="book" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-sm"
                    >
                      Book a Ride
                    </TabsTrigger>
                    <TabsTrigger 
                      value="history" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-sm"
                    >
                      My Rides
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="book" className="p-4 pt-0">
                  <UberLikeRideBooking />
                </TabsContent>

                <TabsContent value="history" className="p-4 pt-0">
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
