
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ServicesProfile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Service Provider Profile</h1>
        <p className="text-gray-600">Manage your professional profile and services</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            Profile management interface will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesProfile;
