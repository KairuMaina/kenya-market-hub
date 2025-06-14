
import React from 'react';
import VendorLayout from '@/components/layouts/VendorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedVendorRoute from '@/components/ProtectedVendorRoute';
import VendorMainDashboard from '@/components/VendorMainDashboard';

const VendorApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <ProtectedVendorRoute>
      <VendorLayout>
        <VendorMainDashboard />
      </VendorLayout>
    </ProtectedVendorRoute>
  );
};

export default VendorApp;
