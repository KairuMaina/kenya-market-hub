
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ServicesSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Service Settings</h1>
        <p className="text-gray-600">Configure your service preferences and notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            Settings interface will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesSettings;
