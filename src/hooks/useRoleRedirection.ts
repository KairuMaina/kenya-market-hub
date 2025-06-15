
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';

interface UserRoles {
  isVendor: boolean;
  isDriver: boolean;
  isPropertyOwner: boolean;
  approvedRoles: string[];
  primaryRole?: string;
}

export const useRoleRedirection = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { data: vendorProfile, isLoading: vendorLoading } = useMyVendorProfile();
  const { data: driverProfile, isLoading: driverLoading } = useServiceProviderProfile('driver');
  const { data: propertyProfile, isLoading: propertyLoading } = useServiceProviderProfile('property_owner');
  
  const [roles, setRoles] = useState<UserRoles>({
    isVendor: false,
    isDriver: false,
    isPropertyOwner: false,
    approvedRoles: []
  });

  const isLoading = authLoading || vendorLoading || driverLoading || propertyLoading;

  useEffect(() => {
    if (!user || isLoading) return;

    const approvedRoles: string[] = [];
    let primaryRole: string | undefined;

    // Check vendor status
    const isVendor = vendorProfile?.verification_status === 'approved';
    if (isVendor) {
      approvedRoles.push('vendor');
      if (!primaryRole) primaryRole = 'vendor';
    }

    // Check driver status
    const isDriver = driverProfile?.verification_status === 'approved';
    if (isDriver) {
      approvedRoles.push('driver');
      if (!primaryRole) primaryRole = 'driver';
    }

    // Check property owner status
    const isPropertyOwner = propertyProfile?.verification_status === 'approved';
    if (isPropertyOwner) {
      approvedRoles.push('property_owner');
      if (!primaryRole) primaryRole = 'property_owner';
    }

    setRoles({
      isVendor,
      isDriver,
      isPropertyOwner,
      approvedRoles,
      primaryRole
    });
  }, [user, vendorProfile, driverProfile, propertyProfile, isLoading]);

  const redirectToAppropriateApp = () => {
    if (!user || isLoading) return;

    const currentPath = location.pathname;
    
    // Don't redirect if already on a service provider app or public pages
    if (currentPath.startsWith('/driver') || 
        currentPath.startsWith('/vendor') || 
        currentPath.startsWith('/property-owner') ||
        currentPath === '/auth' ||
        currentPath === '/vendor-dashboard') {
      return;
    }

    // If user has approved roles, redirect to primary app
    if (roles.approvedRoles.length > 0 && roles.primaryRole) {
      switch (roles.primaryRole) {
        case 'driver':
          navigate('/driver');
          break;
        case 'vendor':
          navigate('/vendor');
          break;
        case 'property_owner':
          navigate('/property-owner');
          break;
      }
    }
  };

  const getAvailableApps = () => {
    const apps = [];
    
    if (roles.isDriver) {
      apps.push({ 
        name: 'Driver App', 
        path: '/driver', 
        description: 'Manage rides and earnings',
        color: 'blue'
      });
    }
    
    if (roles.isVendor) {
      apps.push({ 
        name: 'Vendor Portal', 
        path: '/vendor', 
        description: 'Manage products and sales',
        color: 'orange'
      });
    }
    
    if (roles.isPropertyOwner) {
      apps.push({ 
        name: 'Property Management', 
        path: '/property-owner', 
        description: 'Manage properties and inquiries',
        color: 'green'
      });
    }
    
    return apps;
  };

  return {
    roles,
    isLoading,
    redirectToAppropriateApp,
    getAvailableApps,
    hasAnyApprovedRole: roles.approvedRoles.length > 0,
    hasMultipleRoles: roles.approvedRoles.length > 1
  };
};
