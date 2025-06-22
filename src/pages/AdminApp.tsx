
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import ModernAdminDashboard from '@/pages/admin/ModernAdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminVendors from '@/pages/admin/AdminVendors';
import AdminDrivers from '@/pages/admin/AdminDrivers';
import AdminServiceProviders from '@/pages/admin/AdminServiceProviders';
import AdminServiceBookings from '@/pages/admin/AdminServiceBookings';
import AdminProperties from '@/pages/admin/AdminProperties';
import AdminPropertyInquiries from '@/pages/admin/AdminPropertyInquiries';
import AdminPropertyViewings from '@/pages/admin/AdminPropertyViewings';
import AdminRides from '@/pages/admin/AdminRides';
import AdminRidePricing from '@/pages/admin/AdminRidePricing';
import AdminMedical from '@/pages/admin/AdminMedical';
import AdminReports from '@/pages/admin/AdminReports';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminAgents from '@/pages/admin/AdminAgents';
import AdminEmployers from '@/pages/admin/AdminEmployers';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import JobBoard from '@/pages/admin/JobBoard';
import AdminInsurance from '@/modules/insurance/pages/AdminInsurance';
import AdminFoodDelivery from '@/pages/admin/AdminFoodDelivery';
import AdminEvents from '@/pages/admin/AdminEvents';

const AdminApp = () => {
  return (
    <ProtectedAdminRoute>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<ModernAdminDashboard />} />
        <Route path="/modern-dashboard" element={<ModernAdminDashboard />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/orders" element={<AdminOrders />} />
        <Route path="/vendors" element={<AdminVendors />} />
        <Route path="/drivers" element={<AdminDrivers />} />
        <Route path="/service-providers" element={<AdminServiceProviders />} />
        <Route path="/service-bookings" element={<AdminServiceBookings />} />
        <Route path="/properties" element={<AdminProperties />} />
        <Route path="/property-inquiries" element={<AdminPropertyInquiries />} />
        <Route path="/property-viewings" element={<AdminPropertyViewings />} />
        <Route path="/rides" element={<AdminRides />} />
        <Route path="/ride-pricing" element={<AdminRidePricing />} />
        <Route path="/medical" element={<AdminMedical />} />
        <Route path="/insurance" element={<AdminInsurance />} />
        <Route path="/food-delivery" element={<AdminFoodDelivery />} />
        <Route path="/events" element={<AdminEvents />} />
        <Route path="/jobs" element={<JobBoard />} />
        <Route path="/agents" element={<AdminAgents />} />
        <Route path="/employers" element={<AdminEmployers />} />
        <Route path="/reports" element={<AdminReports />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="/notifications" element={<AdminNotifications />} />
      </Routes>
    </ProtectedAdminRoute>
  );
};

export default AdminApp;
