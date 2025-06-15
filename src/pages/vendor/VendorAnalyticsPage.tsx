
import React from 'react';
import { Navigate } from 'react-router-dom';

const VendorAnalyticsPage = () => {
  // Redirect to the main vendor app
  return <Navigate to="/vendor/analytics" replace />;
};

export default VendorAnalyticsPage;
