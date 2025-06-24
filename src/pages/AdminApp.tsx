
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

// Create placeholder components for admin routes
const AdminDashboard = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    <p>Admin dashboard coming soon...</p>
  </div>
);

const AdminUsers = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">User Management</h1>
    <p>User management interface coming soon...</p>
  </div>
);

const AdminProducts = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Product Management</h1>
    <p>Product management interface coming soon...</p>
  </div>
);

const AdminOrders = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Order Management</h1>
    <p>Order management interface coming soon...</p>
  </div>
);

const AdminVendors = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Vendor Management</h1>
    <p>Vendor management interface coming soon...</p>
  </div>
);

const AdminDrivers = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Driver Management</h1>
    <p>Driver management interface coming soon...</p>
  </div>
);

const AdminServiceProviders = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Service Provider Management</h1>
    <p>Service provider management interface coming soon...</p>
  </div>
);

const AdminEmployers = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Employer Management</h1>
    <p>Employer management interface coming soon...</p>
  </div>
);

const AdminAgents = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Agent Management</h1>
    <p>Agent management interface coming soon...</p>
  </div>
);

const AdminRides = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Ride Management</h1>
    <p>Ride management interface coming soon...</p>
  </div>
);

const AdminServiceBookings = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Service Booking Management</h1>
    <p>Service booking management interface coming soon...</p>
  </div>
);

const AdminProperties = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Property Management</h1>
    <p>Property management interface coming soon...</p>
  </div>
);

const AdminMedical = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Medical Management</h1>
    <p>Medical management interface coming soon...</p>
  </div>
);

const AdminInsurance = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Insurance Management</h1>
    <p>Insurance management interface coming soon...</p>
  </div>
);

const AdminFoodDelivery = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Food Delivery Management</h1>
    <p>Food delivery management interface coming soon...</p>
  </div>
);

const AdminEvents = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Event Management</h1>
    <p>Event management interface coming soon...</p>
  </div>
);

const AdminJobs = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Job Board Management</h1>
    <p>Job board management interface coming soon...</p>
  </div>
);

const AdminAnalytics = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Analytics</h1>
    <p>Analytics interface coming soon...</p>
  </div>
);

const AdminReports = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Reports</h1>
    <p>Reports interface coming soon...</p>
  </div>
);

const AdminNotifications = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Notifications</h1>
    <p>Notifications interface coming soon...</p>
  </div>
);

const AdminSettings = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Settings</h1>
    <p>Settings interface coming soon...</p>
  </div>
);

const AdminApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
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
      <AdminLayout>
        <Routes>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="vendors" element={<AdminVendors />} />
          <Route path="drivers" element={<AdminDrivers />} />
          <Route path="service-providers" element={<AdminServiceProviders />} />
          <Route path="employers" element={<AdminEmployers />} />
          <Route path="agents" element={<AdminAgents />} />
          <Route path="rides" element={<AdminRides />} />
          <Route path="service-bookings" element={<AdminServiceBookings />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="medical" element={<AdminMedical />} />
          <Route path="insurance" element={<AdminInsurance />} />
          <Route path="food-delivery" element={<AdminFoodDelivery />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
          {/* Catch-all route for 404s within admin app */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminApp;
