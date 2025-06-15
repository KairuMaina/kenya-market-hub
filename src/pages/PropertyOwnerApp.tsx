
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PropertyOwnerLayout from '@/components/layouts/PropertyOwnerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedPropertyOwnerRoute from '@/components/ProtectedPropertyOwnerRoute';
import PropertyOwnerMainDashboard from '@/components/PropertyOwnerMainDashboard';
import PropertyOwnerProperties from '@/pages/property-owner/PropertyOwnerProperties';
import PropertyOwnerAddProperty from '@/pages/property-owner/PropertyOwnerAddProperty';
import PropertyOwnerViewings from '@/pages/property-owner/PropertyOwnerViewings';
import PropertyOwnerInquiries from '@/pages/property-owner/PropertyOwnerInquiries';
import PropertyOwnerTenants from '@/pages/property-owner/PropertyOwnerTenants';
import PropertyOwnerAnalytics from '@/pages/property-owner/PropertyOwnerAnalytics';
import PropertyOwnerRevenue from '@/pages/property-owner/PropertyOwnerRevenue';
import PropertyOwnerProfile from '@/pages/property-owner/PropertyOwnerProfile';
import PropertyOwnerSettings from '@/pages/property-owner/PropertyOwnerSettings';

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
        <Routes>
          <Route index element={<PropertyOwnerMainDashboard />} />
          <Route path="properties" element={<PropertyOwnerProperties />} />
          <Route path="properties/add" element={<PropertyOwnerAddProperty />} />
          <Route path="viewings" element={<PropertyOwnerViewings />} />
          <Route path="inquiries" element={<PropertyOwnerInquiries />} />
          <Route path="tenants" element={<PropertyOwnerTenants />} />
          <Route path="analytics" element={<PropertyOwnerAnalytics />} />
          <Route path="revenue" element={<PropertyOwnerRevenue />} />
          <Route path="profile" element={<PropertyOwnerProfile />} />
          <Route path="settings" element={<PropertyOwnerSettings />} />
        </Routes>
      </PropertyOwnerLayout>
    </ProtectedPropertyOwnerRoute>
  );
};

export default PropertyOwnerApp;
