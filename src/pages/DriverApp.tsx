
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DriverLayout from '@/components/layouts/DriverLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedDriverRoute from '@/components/ProtectedDriverRoute';
import DriverMainDashboard from '@/components/DriverMainDashboard';
import DriverRideManagement from '@/components/DriverRideManagement';
import DriverEarnings from '@/components/driver/DriverEarnings';
import DriverHistory from '@/components/driver/DriverHistory';
import DriverRoutes from '@/components/driver/DriverRoutes';
import DriverAnalytics from '@/components/driver/DriverAnalytics';
import DriverRatings from '@/components/driver/DriverRatings';
import DriverProfile from '@/components/driver/DriverProfile';
import DriverSettings from '@/components/driver/DriverSettings';

const DriverApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading driver portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <ProtectedDriverRoute>
      <DriverLayout>
        <Routes>
          <Route index element={<DriverMainDashboard />} />
          <Route path="rides" element={<DriverRideManagement />} />
          <Route path="earnings" element={<DriverEarnings />} />
          <Route path="history" element={<DriverHistory />} />
          <Route path="routes" element={<DriverRoutes />} />
          <Route path="analytics" element={<DriverAnalytics />} />
          <Route path="ratings" element={<DriverRatings />} />
          <Route path="profile" element={<DriverProfile />} />
          <Route path="settings" element={<DriverSettings />} />
          {/* Catch-all route for 404s within driver app */}
          <Route path="*" element={<Navigate to="/driver" replace />} />
        </Routes>
      </DriverLayout>
    </ProtectedDriverRoute>
  );
};

export default DriverApp;
