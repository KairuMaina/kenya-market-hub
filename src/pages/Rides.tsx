
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import RidesHeader from '@/components/rides/RidesHeader';
import UberLikeRideBooking from '@/components/rides/UberLikeRideBooking';
import RideHistoryTab from '@/components/rides/RideHistoryTab';

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
      <div className="space-y-6 animate-fade-in">
        <RidesHeader />

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
    </MainLayout>
  );
};

export default Rides;
