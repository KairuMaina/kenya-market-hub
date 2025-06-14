
import React from 'react';
import PropertyOwnerLayout from '@/components/layouts/PropertyOwnerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedPropertyOwnerRoute from '@/components/ProtectedPropertyOwnerRoute';
import PropertyOwnerMainDashboard from '@/components/PropertyOwnerMainDashboard';

const PropertyOwnerApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property management...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <ProtectedPropertyOwnerRoute>
      <PropertyOwnerLayout>
        <PropertyOwnerMainDashboard />
      </PropertyOwnerLayout>
    </ProtectedPropertyOwnerRoute>
  );
};

export default PropertyOwnerApp;
