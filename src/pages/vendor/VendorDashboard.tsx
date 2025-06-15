
import React from 'react';
import { Navigate } from 'react-router-dom';

const VendorDashboard = () => {
  // Redirect to the main vendor app
  return <Navigate to="/vendor" replace />;
};

export default VendorDashboard;
