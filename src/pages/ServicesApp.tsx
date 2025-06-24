
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ServicesLayout from '@/components/layouts/ServicesLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedServiceProviderRoute from '@/components/ProtectedServiceProviderRoute';
import ServicesMainDashboard from '@/components/ServicesMainDashboard';
import ServicesBookings from '@/components/services/ServicesBookings';
import ServicesProfile from '@/components/services/ServicesProfile';
import ServicesAnalytics from '@/components/services/ServicesAnalytics';
import ServicesSettings from '@/components/services/ServicesSettings';

const ServicesApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <ProtectedServiceProviderRoute>
      <ServicesLayout>
        <Routes>
          <Route index element={<ServicesMainDashboard />} />
          <Route path="bookings" element={<ServicesBookings />} />
          <Route path="profile" element={<ServicesProfile />} />
          <Route path="analytics" element={<ServicesAnalytics />} />
          <Route path="settings" element={<ServicesSettings />} />
          {/* Catch-all route for 404s within services app */}
          <Route path="*" element={<Navigate to="/services-app" replace />} />
        </Routes>
      </ServicesLayout>
    </ProtectedServiceProviderRoute>
  );
};

export default ServicesApp;
