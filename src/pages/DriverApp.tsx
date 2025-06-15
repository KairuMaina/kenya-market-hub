
import React from 'react';
import DriverLayout from '@/components/layouts/DriverLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedDriverRoute from '@/components/ProtectedDriverRoute';
import DriverMainDashboard from '@/components/DriverMainDashboard';

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
        <DriverMainDashboard />
      </DriverLayout>
    </ProtectedDriverRoute>
  );
};

export default DriverApp;
