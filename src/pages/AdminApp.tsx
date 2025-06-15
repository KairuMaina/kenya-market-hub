
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/AdminUsers';
import AdminVendors from './admin/AdminVendors';
import AdminDrivers from './admin/AdminDrivers';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminProperties from './admin/AdminProperties';
import AdminAgents from './admin/AdminAgents';
import AdminPropertyInquiries from './admin/AdminPropertyInquiries';
import AdminPropertyViewings from './admin/AdminPropertyViewings';
import AdminRides from './admin/AdminRides';
import AdminRidePricing from './admin/AdminRidePricing';
import AdminServiceProviders from './admin/AdminServiceProviders';
import AdminServiceBookings from './admin/AdminServiceBookings';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminReports from './admin/AdminReports';
import AdminNotifications from './admin/AdminNotifications';
import AdminSettings from './admin/AdminSettings';
import AdminMedical from './admin/AdminMedical';

const AdminApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <ProtectedAdminRoute>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="vendors" element={<AdminVendors />} />
        <Route path="drivers" element={<AdminDrivers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="agents" element={<AdminAgents />} />
        <Route path="property-inquiries" element={<AdminPropertyInquiries />} />
        <Route path="property-viewings" element={<AdminPropertyViewings />} />
        <Route path="rides" element={<AdminRides />} />
        <Route path="ride-pricing" element={<AdminRidePricing />} />
        <Route path="service-providers" element={<AdminServiceProviders />} />
        <Route path="service-bookings" element={<AdminServiceBookings />} />
        <Route path="medical" element={<AdminMedical />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </ProtectedAdminRoute>
  );
};

export default AdminApp;
