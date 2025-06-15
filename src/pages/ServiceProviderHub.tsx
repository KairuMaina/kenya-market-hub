
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import RoleSelector from '@/components/RoleSelector';
import { useRoleRedirection } from '@/hooks/useRoleRedirection';
import MainLayout from '@/components/MainLayout';

const ServiceProviderHub = () => {
  const { user, loading } = useAuth();
  const { isLoading, hasAnyApprovedRole, getAvailableApps } = useRoleRedirection();

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service provider access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user has approved roles, show app selector
  if (hasAnyApprovedRole) {
    const availableApps = getAvailableApps();
    
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Service Provider Hub</h1>
            <p className="text-gray-600">Select your service provider dashboard</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableApps.map((app) => (
              <div key={app.path} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 bg-gradient-to-br from-${app.color}-500 to-${app.color}-600 rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                  <span className="text-white text-2xl font-bold">
                    {app.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{app.name}</h3>
                <p className="text-gray-600 text-center mb-4">{app.description}</p>
                <button
                  onClick={() => window.location.href = app.path}
                  className={`w-full bg-gradient-to-r from-${app.color}-500 to-${app.color}-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity`}
                >
                  Open Dashboard
                </button>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // If no approved roles, show registration interface
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Service Provider Registration</h1>
          <p className="text-gray-600">Apply to become a service provider and grow your business</p>
        </div>
        <RoleSelector />
      </div>
    </MainLayout>
  );
};

export default ServiceProviderHub;
