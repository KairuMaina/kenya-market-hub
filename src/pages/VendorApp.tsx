
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VendorLayout from '@/components/layouts/VendorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedVendorRoute from '@/components/ProtectedVendorRoute';
import VendorMainDashboard from '@/components/VendorMainDashboard';
import VendorProducts from "@/pages/vendor/VendorProducts";
import VendorStore from "@/pages/vendor/VendorStore";
import VendorCustomers from "@/pages/vendor/VendorCustomers";
import AddProductModal from '@/components/AddProductModal';

// Create placeholder components for missing routes
const VendorAnalytics = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Analytics</h1>
    <p>Vendor analytics dashboard coming soon...</p>
  </div>
);

const VendorProfile = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Profile</h1>
    <p>Vendor profile management coming soon...</p>
  </div>
);

const VendorSettings = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Settings</h1>
    <p>Vendor settings coming soon...</p>
  </div>
);

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
        <Routes>
          <Route index element={<VendorMainDashboard />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="products/add" element={<AddProductModal open onOpenChange={() => {}} onSuccess={() => {}} />} />
          <Route path="store" element={<VendorStore />} />
          <Route path="customers" element={<VendorCustomers />} />
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="settings" element={<VendorSettings />} />
          {/* Catch-all route for 404s within vendor app */}
          <Route path="*" element={<Navigate to="/vendor" replace />} />
        </Routes>
      </VendorLayout>
    </ProtectedVendorRoute>
  );
};

export default VendorApp;
