
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import RoleSelector from '@/components/RoleSelector';
import { useRoleRedirection } from '@/hooks/useRoleRedirection';

const ServiceProviderHub = () => {
  const { user, loading } = useAuth();
  const { isLoading } = useRoleRedirection();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <RoleSelector />
    </div>
  );
};

export default ServiceProviderHub;
