
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect to the new modern dashboard
const AdminDashboard = () => {
  return <Navigate to="/admin/modern-dashboard" replace />;
};

export default AdminDashboard;
